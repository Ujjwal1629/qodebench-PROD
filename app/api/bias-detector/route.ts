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

const SYSTEM_PROMPT = `You are a helpful AI assistant. Answer the user's question naturally and helpfully.

Output rules — no exceptions:
- Plain text only. No markdown, no headers, no bullet points, no backticks, no bold.
- Keep your answer to 4-6 sentences maximum.
- Write in clean, conversational prose.`;

export async function POST(request: NextRequest) {
  try {
    const { promptA, promptB } = await request.json();

    if (!promptA || !promptB) {
      return NextResponse.json({ error: 'Both prompts are required' }, { status: 400 });
    }

    const openai = getOpenAIClient();

    // Send both prompts in parallel
    const [resA, resB] = await Promise.all([
      openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: promptA.slice(0, 1000) },
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
      openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: promptB.slice(0, 1000) },
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    ]);

    return NextResponse.json({
      responseA: stripMarkdown(resA.choices[0]?.message?.content ?? 'No response.'),
      responseB: stripMarkdown(resB.choices[0]?.message?.content ?? 'No response.'),
    });
  } catch (error) {
    console.error('Bias detector API error:', error);
    return NextResponse.json({ error: 'Failed to get AI responses' }, { status: 500 });
  }
}
