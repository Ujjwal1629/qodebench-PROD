import { NextRequest, NextResponse } from 'next/server';
import { getOpenAIClient } from '@/lib/openai-client';

function stripMarkdown(text: string): string {
  return text
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`{3}[\s\S]*?`{3}/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^[-*•]\s+/gm, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Build a system prompt that forces the model to role-play as an AI whose training
 * data was frozen at a specific cutoff date. It must answer ONLY from what was true
 * on or before that date, and must NOT use any knowledge of events after it.
 *
 * This is how we demonstrate "knowledge drift": the same question answered by an
 * old-dataset model vs a new-dataset model gives different (stale vs current) answers
 * — e.g. "Who is the US president?" → Biden (2022) vs Trump (2025).
 */
function cutoffSystemPrompt(cutoffLabel: string): string {
  return `You are an AI assistant whose training data ends on ${cutoffLabel}. You have NO knowledge of anything that happened after ${cutoffLabel}.

Answer every question strictly as it would have been answered using only information available on or before ${cutoffLabel}. State the facts that were true as of ${cutoffLabel}, even if you suspect they may have changed later. Do NOT mention later events, do NOT hedge about your cutoff, and do NOT say "as of my last update" — just answer confidently with what was true at ${cutoffLabel}.

Output rules:
- Plain text only. No markdown, no bullet points, no headers.
- Answer in 1-2 short sentences. Be direct and specific (name names, give the actual fact).`;
}

interface Pair {
  question: string;
  oldAnswer: string;
  newAnswer: string;
  drifted: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const { questions, oldCutoff, newCutoff } = await request.json();

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ error: 'Questions array is required' }, { status: 400 });
    }

    const oldLabel = typeof oldCutoff === 'string' && oldCutoff.trim() ? oldCutoff.trim() : 'January 2022';
    const newLabel = typeof newCutoff === 'string' && newCutoff.trim() ? newCutoff.trim() : 'June 2025';

    const cleanQuestions: string[] = questions
      .filter((q: unknown) => typeof q === 'string' && q.trim())
      .slice(0, 10)
      .map((q: string) => q.slice(0, 500));

    if (cleanQuestions.length === 0) {
      return NextResponse.json({ error: 'No valid questions provided' }, { status: 400 });
    }

    const openai = getOpenAIClient();
    const oldSystem = cutoffSystemPrompt(oldLabel);
    const newSystem = cutoffSystemPrompt(newLabel);

    // For each question, ask both the "old dataset" model and the "new dataset" model.
    const tasks = cleanQuestions.flatMap((q) => [
      openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: oldSystem },
          { role: 'user', content: q },
        ],
        temperature: 0,
        max_tokens: 120,
      }),
      openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: newSystem },
          { role: 'user', content: q },
        ],
        temperature: 0,
        max_tokens: 120,
      }),
    ]);

    const responses = await Promise.all(tasks);

    const pairs: Pair[] = cleanQuestions.map((q, i) => {
      const oldAnswer = stripMarkdown(responses[i * 2]?.choices[0]?.message?.content ?? 'No response.');
      const newAnswer = stripMarkdown(responses[i * 2 + 1]?.choices[0]?.message?.content ?? 'No response.');
      return {
        question: q,
        oldAnswer,
        newAnswer,
        drifted: !answersEquivalent(oldAnswer, newAnswer),
      };
    });

    const driftCount = pairs.filter((p) => p.drifted).length;

    return NextResponse.json({
      oldCutoff: oldLabel,
      newCutoff: newLabel,
      pairs,
      driftCount,
      total: pairs.length,
      runAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Knowledge cutoff API error:', error);
    return NextResponse.json({ error: 'Failed to run knowledge cutoff comparison' }, { status: 500 });
  }
}

/**
 * Lightweight check for whether two answers say "the same thing".
 * We normalise and compare the core token set so trivial wording differences
 * ("Joe Biden" vs "Biden is the president") don't get flagged as drift, but a
 * genuinely different fact ("Biden" vs "Trump") does.
 */
function answersEquivalent(a: string, b: string): boolean {
  const norm = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOPWORDS.has(w));

  const setA = new Set(norm(a));
  const setB = new Set(norm(b));
  if (setA.size === 0 || setB.size === 0) return a.trim() === b.trim();

  let shared = 0;
  for (const w of setA) if (setB.has(w)) shared++;
  const overlap = shared / Math.min(setA.size, setB.size);
  // High overlap of meaningful words → treat as the same answer.
  return overlap >= 0.6;
}

const STOPWORDS = new Set([
  'the', 'and', 'for', 'was', 'are', 'has', 'have', 'with', 'that', 'this', 'who', 'what',
  'when', 'where', 'which', 'into', 'from', 'their', 'they', 'them', 'his', 'her', 'its',
  'current', 'currently', 'president', 'latest', 'newest', 'now', 'today', 'as', 'of',
]);
