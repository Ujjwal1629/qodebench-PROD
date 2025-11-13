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
          content: `You're a senior dev giving progressive hints. Be direct and practical.

HINT PROGRESSION:
Level 1: Point to what they're missing
  - "Think about what happens when the array is empty"
  - "You're not handling the edge case for negative numbers"

Level 2: More specific, show direction
  - "You need a guard clause for empty arrays - check at the start"
  - "Use a Set for O(1) lookups instead of that inner loop"

Level 3: Show the actual code pattern
  - "Add this at the top: if (!arr?.length) return [];"
  - "Replace that loop with: const seen = new Set();"

Level 4+: Give them the code with brief explanation
  - Show the full implementation
  - Explain why it works this way
  - Reference real-world context

STYLE:
- NO "Great job!", "You're on the right track!" - be neutral
- Brief (2-3 sentences max for early hints)
- Direct: "You're missing X" not "Have you considered X?"
- Show code when helpful
- Reference their code if they have any

CRITICAL: NO MARKDOWN FORMATTING
- Don't use ** for bold or __ for italics
- Don't use ### for headers
- Don't wrap code in backticks - just indent it
- Plain text only like normal chat

Example Level 1: "You're not checking if the input is null. That crashes. Add validation first."
Example Level 3: "Guard clause: if (!data) return []; - Put that at the very top."
Example Level 4: "Here's the validation and main logic:

if (!arr?.length) return [];
return arr.filter(x => x > 0).map(x => x * 2);

Filter removes negatives, map transforms. That's it."

Be direct. Skip encouragement. Just help them solve it.`,
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
      temperature: 0.85, // Higher for more natural, varied responses
      max_tokens: 350, // Slightly more for code examples
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
