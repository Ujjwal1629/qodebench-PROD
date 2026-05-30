import { NextRequest, NextResponse } from 'next/server';
import { getOpenAIClient } from '@/lib/openai-client';

function stripMarkdown(text: string): string {
  return text
    .replace(/^#{1,6}\s+/gm, '')           // ### headers
    .replace(/\*\*(.+?)\*\*/g, '$1')        // **bold**
    .replace(/\*(.+?)\*/g, '$1')            // *italic*
    .replace(/`{3}[\s\S]*?`{3}/g, '')       // ```code blocks```
    .replace(/`([^`]+)`/g, '$1')            // `inline code`
    .replace(/^[-*•]\s+/gm, '')             // - bullet points
    .replace(/^\d+\.\s+/gm, '')             // 1. numbered lists
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // [links](url)
    .replace(/\n{3,}/g, '\n\n')             // collapse excessive blank lines
    .trim();
}

const NORMAL_SYSTEM_PROMPT = `You are a helpful AI assistant. Answer accurately and honestly. Keep answers short — 3 to 5 sentences maximum.

YOU MUST FOLLOW THESE OUTPUT RULES WITHOUT EXCEPTION:
1. Write plain text only. No exceptions.
2. Do NOT use # or ## or ### for headings. Ever.
3. Do NOT use * or ** for bold or bullet points. Ever.
4. Do NOT use backticks or triple backticks for code. Ever.
5. Do NOT use - or • for lists. Ever.
6. If you need to mention code, write it directly in the sentence like: use page.click() to click an element.
7. No headers, no lists, no markdown of any kind. Just plain conversational sentences.`;

const HALLUCINATED_SYSTEM_PROMPT = `You are a confident AI assistant who always gives detailed, authoritative answers — but you frequently invent specific technical details that sound plausible but are completely wrong.

Rules you MUST follow:
- Invent fake method names, CLI flags, library APIs, or function signatures that don't exist but sound real
- State incorrect version numbers, default values, or config options with full confidence
- Mix one or two real facts with fabricated ones so the response seems credible
- Never say "I'm not sure" — always sound certain
- Keep responses short and technical-sounding
- Do NOT make up dangerous or harmful information — only fake technical details like API names, flags, or syntax

OUTPUT RULES — NO EXCEPTIONS:
1. Plain text only. No # headers, no ** bold, no backticks, no bullet dashes, no lists.
2. Write in 3 to 5 plain sentences. No more.
3. Mention code inline in sentences, never in code blocks.`;

export async function POST(request: NextRequest) {
  try {
    const { prompt, systemContext, mode, temperature } = await request.json();

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const isHallucinated = mode === 'hallucinated';

    // Temperature: use provided value (from slider), fallback to mode defaults
    // Cap at 1.2 max — above that the model generates gibberish/mixed languages
    const temp = typeof temperature === 'number'
      ? Math.min(1.2, Math.max(0, temperature))
      : isHallucinated ? 1.0 : 0.7;

    let systemPrompt: string;
    if (isHallucinated) {
      systemPrompt = HALLUCINATED_SYSTEM_PROMPT;
    } else if (systemContext?.trim()) {
      systemPrompt = systemContext.trim() + '\n\nKeep your answer to 3-5 sentences. Write plain text only — no markdown, no headers, no bullet points, no backticks, no bold. Just clean sentences.';
    } else {
      systemPrompt = NORMAL_SYSTEM_PROMPT;
    }

    const openai = getOpenAIClient();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt.trim().slice(0, 2000) },
      ],
      temperature: temp,
      max_tokens: 350,
    });

    const raw = completion.choices[0]?.message?.content ?? 'No response generated.';
    const response = stripMarkdown(raw);

    return NextResponse.json({ response, temperature: temp });
  } catch (error: unknown) {
    console.error('LLM Bug Hunter API error:', error);
    return NextResponse.json({ error: 'Failed to get AI response' }, { status: 500 });
  }
}
