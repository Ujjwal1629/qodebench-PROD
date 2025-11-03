import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    // Initialize OpenAI client only when needed
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    });

    const supabase = await createClient();

    // Check auth
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { challengeId, currentCode, hintsUsed } = await req.json();

    if (!challengeId) {
      return NextResponse.json(
        { error: 'Challenge ID is required' },
        { status: 400 }
      );
    }

    // Get challenge details
    const { data: challenge } = await supabase
      .from('challenges')
      .select('*')
      .eq('id', challengeId)
      .single();

    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      );
    }

    // Determine hint level (progressive hints)
    const hintLevel = (hintsUsed || 0) + 1;

    // Generate hint using OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a friendly senior developer mentoring a junior colleague. Give progressive hints that help them learn, not just solve the problem.

Hint Level Guidelines:
- Level 1: High-level approach and key concepts to consider
- Level 2: Suggest specific strategies or patterns, maybe a small pseudocode example
- Level 3: Show a concrete mini-example or reference specific functions/methods to use
- Level 4+: Give detailed guidance with code snippets, but still leave room for them to complete it

Always:
1. Be encouraging and supportive
2. If they have code, reference what they've tried
3. Use simple code examples when helpful
4. Explain WHY an approach works, not just WHAT to do
5. Keep it conversational and friendly (3-5 sentences)`,
        },
        {
          role: 'user',
          content: `Challenge: ${challenge.title}

Description: ${challenge.description}

Current Code:
${currentCode || 'No code written yet'}

This is hint level ${hintLevel}. Provide an appropriate progressive hint.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const hint = completion.choices[0].message.content;

    return NextResponse.json({
      hint,
      hintLevel,
    });
  } catch (error) {
    console.error('Error generating hint:', error);
    return NextResponse.json(
      { error: 'Failed to generate hint' },
      { status: 500 }
    );
  }
}
