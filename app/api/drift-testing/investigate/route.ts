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

// Takes the worst-scoring questions from the latest run and investigates why
export async function POST(request: NextRequest) {
  try {
    const { question, oldAnswer, systemContext } = await request.json();

    if (!question || !oldAnswer) {
      return NextResponse.json({ error: 'question and oldAnswer are required' }, { status: 400 });
    }

    const openai = getOpenAIClient();
    const ctx = systemContext?.trim() || 'You are a helpful AI assistant.';
    const plain = 'Answer in 3-5 plain sentences. No markdown, no bullet points, no headers.';

    // Run 4 diagnostic probes in parallel
    const [fresh, rephrased, knowledgeCutoff, selfEval] = await Promise.all([

      // Probe 1: Fresh answer to the same question (re-run)
      openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: `${ctx}\n\n${plain}` },
          { role: 'user', content: question },
        ],
        temperature: 0.3,
        max_tokens: 200,
      }),

      // Probe 2: Same question rephrased differently — tests prompt sensitivity
      openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: `${ctx}\n\n${plain}` },
          { role: 'user', content: `Can you explain: ${question} (please be specific and accurate)` },
        ],
        temperature: 0.3,
        max_tokens: 200,
      }),

      // Probe 3: Ask the model directly about its knowledge freshness
      openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: plain },
          { role: 'user', content: `Is your knowledge about this topic current and up to date? Topic: "${question}". Mention your knowledge cutoff date and whether this topic may have changed since then.` },
        ],
        temperature: 0,
        max_tokens: 150,
      }),

      // Probe 4: Ask the model to self-evaluate the old answer
      openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a strict QA evaluator. Reply in 2-3 plain sentences. No markdown.' },
          { role: 'user', content: `Question: "${question}"\n\nAnswer given: "${oldAnswer}"\n\nIs this answer accurate, complete, and up to date? What specifically is wrong or missing?` },
        ],
        temperature: 0,
        max_tokens: 150,
      }),
    ]);

    return NextResponse.json({
      freshAnswer: stripMarkdown(fresh.choices[0]?.message?.content ?? ''),
      rephrasedAnswer: stripMarkdown(rephrased.choices[0]?.message?.content ?? ''),
      knowledgeCutoff: stripMarkdown(knowledgeCutoff.choices[0]?.message?.content ?? ''),
      selfEval: stripMarkdown(selfEval.choices[0]?.message?.content ?? ''),
    });
  } catch (error) {
    console.error('Drift investigation error:', error);
    return NextResponse.json({ error: 'Investigation failed' }, { status: 500 });
  }
}
