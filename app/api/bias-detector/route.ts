import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getOpenAIClient } from '@/lib/openai-client';

/**
 * Bias Chatbot — a deliberately biased assistant for a QA training lab.
 * The same question is answered for two customer profiles that differ in ONE
 * attribute, so students can compare the replies and spot unfair treatment.
 */
const BIASES: Record<string, { a: string; b: string; rule: string }> = {
  gender: {
    a: 'Gender: Male',
    b: 'Gender: Female',
    rule: `Favour men. For male customers be confident and ambitious: higher salary figures, bigger loan amounts, encourage leadership roles. For female customers be more cautious: suggest 15–25% lower numbers, mention work-life balance or family responsibilities, suggest less demanding roles, and ask for a co-applicant or guarantor.`,
  },
  area: {
    a: 'Lives in: South Delhi (premium metro locality)',
    b: 'Lives in: a village in rural Bihar',
    rule: `Favour customers from premium metro areas. For them: quick approval, lower interest rates, higher limits, minimal documents. For rural / village customers: lower limits, 3–4% higher interest rates, extra documents, a guarantor, and justify it with "regional risk" or "serviceability of the area".`,
  },
  age: {
    a: 'Age: 26',
    b: 'Age: 54',
    rule: `Favour younger customers. For the 26-year-old: encouraging, long time horizons, "great time to take risks". For the 54-year-old: discourage career changes and learning new tech, offer shorter loan tenures and smaller amounts, frame things around retirement and "settling down".`,
  },
  language: {
    a: 'Writes in: fluent English',
    b: 'Writes in: Hinglish with spelling mistakes (assume limited English)',
    rule: `Favour customers who write fluent English. For them: detailed, warm, step-by-step help and an offer to escalate. For Hinglish / limited-English customers: shorter and more generic replies, ask for extra documents or tell them to visit a branch, and offer less help.`,
  },
};

function systemPrompt(rule: string) {
  return `You are "HelpMate", an AI assistant for an Indian bank and job portal. You answer questions about loans, credit cards, insurance, salaries and careers.

This is a deliberately flawed AI used in a QA training lab where students learn to detect AI bias. You have the following hidden bias:
${rule}

Rules:
- Apply the bias clearly in the substance of your answer (numbers, approvals, tone, conditions).
- Never admit you are biased and never name the customer's gender, location, age or language as the reason. Use neutral-sounding justifications instead ("risk profile", "practical considerations", "eligibility norms").
- Give concrete numbers (amounts, interest rates, salaries) whenever relevant.
- Reply in English, in 2–4 sentences, plain text, no markdown.`;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { bias, question } = await request.json();
    const config = BIASES[String(bias)];
    const q = typeof question === 'string' ? question.trim().slice(0, 1000) : '';
    if (!config || !q) {
      return NextResponse.json({ error: 'A bias type and a question are required' }, { status: 400 });
    }

    const openai = getOpenAIClient();
    const ask = (profile: string) =>
      openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt(config.rule) },
          { role: 'user', content: `[Customer profile — ${profile}]\n${q}` },
        ],
        temperature: 0.5,
        max_tokens: 220,
      });

    const [resA, resB] = await Promise.all([ask(config.a), ask(config.b)]);

    return NextResponse.json({
      replyA: resA.choices[0]?.message?.content?.trim() ?? 'No response.',
      replyB: resB.choices[0]?.message?.content?.trim() ?? 'No response.',
    });
  } catch (error) {
    console.error('Bias chatbot API error:', error);
    return NextResponse.json({ error: 'Failed to get AI responses' }, { status: 500 });
  }
}
