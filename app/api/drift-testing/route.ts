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
    .replace(/^\d+\.\s+/gm, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

const SYSTEM_PROMPT = `You are a helpful AI assistant. Answer accurately and concisely in 2-4 plain sentences. No markdown, no bullet points, no headers, no backticks.`;

const JUDGE_PROMPT = `You are a strict QA evaluator. You will be given a question and an AI response. Score the response from 0 to 100 based on:
- Accuracy (is the information correct?)
- Completeness (does it answer the question?)
- Clarity (is it easy to understand?)

Reply with ONLY a JSON object in this exact format, nothing else:
{"score": <number 0-100>, "reason": "<one sentence explanation>"}`;

export async function POST(request: NextRequest) {
  try {
    const { questions, systemContext } = await request.json();

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ error: 'Questions array is required' }, { status: 400 });
    }

    const openai = getOpenAIClient();
    const systemPrompt = systemContext?.trim() ? systemContext.trim() + '\n\nAnswer in 2-4 plain sentences. No markdown.' : SYSTEM_PROMPT;

    // Get AI answers for all questions in parallel
    const answerPromises = questions.map((q: string) =>
      openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: q },
        ],
        temperature: 0.3, // Low temp for consistency — drift shows up better
        max_tokens: 200,
      })
    );

    const answerResults = await Promise.all(answerPromises);
    const answers = answerResults.map((r) => stripMarkdown(r.choices[0]?.message?.content ?? 'No response.'));

    // Judge each answer
    const judgePromises = questions.map((q: string, i: number) =>
      openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: JUDGE_PROMPT },
          { role: 'user', content: `Question: ${q}\n\nAI Response: ${answers[i]}` },
        ],
        temperature: 0,
        max_tokens: 100,
      })
    );

    const judgeResults = await Promise.all(judgePromises);

    const scored = judgeResults.map((r, i) => {
      try {
        const raw = r.choices[0]?.message?.content ?? '{}';
        const parsed = JSON.parse(raw);
        return {
          question: questions[i],
          answer: answers[i],
          score: typeof parsed.score === 'number' ? Math.min(100, Math.max(0, parsed.score)) : 50,
          reason: parsed.reason ?? 'No reason provided.',
        };
      } catch {
        return {
          question: questions[i],
          answer: answers[i],
          score: 50,
          reason: 'Could not parse evaluation.',
        };
      }
    });

    const avgScore = Math.round(scored.reduce((sum, s) => sum + s.score, 0) / scored.length);

    return NextResponse.json({ results: scored, avgScore, runAt: new Date().toISOString() });
  } catch (error) {
    console.error('Drift testing API error:', error);
    return NextResponse.json({ error: 'Failed to run test suite' }, { status: 500 });
  }
}
