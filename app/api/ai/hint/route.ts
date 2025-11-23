import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  createChatCompletion,
  handleOpenAIError,
  AI_FALLBACK_RESPONSES,
} from '@/lib/openai-client';
import { rateLimiter, getRateLimitIdentifier } from '@/lib/utils/rate-limiter';
import { INPUT_LIMITS, truncate } from '@/lib/utils/input-validation';
import { canUseAIFeedback, incrementDailyUsage } from '@/lib/utils/subscription-check';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Check auth
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limiting - stricter for hints
    const rateLimitResult = rateLimiter.checkAndRespond(
      getRateLimitIdentifier(user.id),
      'aiHint'
    );
    if (rateLimitResult) return rateLimitResult.response;

    // Check AI usage limits for free users
    const usageCheck = await canUseAIFeedback(user.id);
    if (!usageCheck.allowed) {
      return NextResponse.json(
        { error: usageCheck.reason, requiresUpgrade: true },
        { status: 429 }
      );
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
      .select('title, description')
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

    // Truncate inputs to prevent excessive token usage
    const truncatedCode = currentCode
      ? truncate(currentCode, INPUT_LIMITS.code)
      : 'No code written yet';
    const truncatedDescription = truncate(challenge.description || '', 500);

    // Generate hint using OpenAI with timeout
    try {
      const completion = await createChatCompletion(
        {
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

Be direct. Skip encouragement. Just help them solve it.`,
            },
            {
              role: 'user',
              content: `Challenge: ${challenge.title}

Description: ${truncatedDescription}

Current Code:
${truncatedCode}

This is hint level ${hintLevel}. Provide an appropriate progressive hint.`,
            },
          ],
          temperature: 0.85,
          max_tokens: 350,
        },
        20000 // 20 second timeout
      );

      const hint = completion.choices[0].message.content;

      // Track usage for free users
      await incrementDailyUsage('ai_feedback', user.id);

      return NextResponse.json({
        hint,
        hintLevel,
      });
    } catch (apiError: any) {
      const errorResponse = handleOpenAIError(apiError);

      // Return fallback for server errors
      if (errorResponse.status >= 500) {
        return NextResponse.json({
          hint: AI_FALLBACK_RESPONSES.hint,
          hintLevel,
          fallback: true,
        });
      }

      return NextResponse.json(
        { error: errorResponse.message },
        { status: errorResponse.status }
      );
    }
  } catch (error) {
    console.error('Error generating hint:', error);
    return NextResponse.json(
      { error: 'Failed to generate hint' },
      { status: 500 }
    );
  }
}
