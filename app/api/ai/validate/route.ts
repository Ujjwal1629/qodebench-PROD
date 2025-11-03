import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/server';
import { validationCache } from '@/lib/utils/validation-cache';

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

    const { challengeId, code, language, previousAttempt } = await req.json();

    if (!challengeId || !code) {
      return NextResponse.json(
        { error: 'Challenge ID and code are required' },
        { status: 400 }
      );
    }

    // Check cache first - instant response if found
    const cachedResult = validationCache.get(challengeId, code);
    if (cachedResult) {
      console.log('✅ Cache hit for challenge:', challengeId);
      return NextResponse.json(cachedResult);
    }

    // Initialize OpenAI client only when needed
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    });

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

    // Get only the last submission for comparison (reduced from 3 to 1 for performance)
    const { data: previousSubmissions } = await supabase
      .from('submissions')
      .select('score, status, submitted_at')
      .eq('user_id', user.id)
      .eq('challenge_id', challengeId)
      .order('submitted_at', { ascending: false })
      .limit(1);

    // Check if this is an office challenge with AI validation criteria
    const isOfficeChallenge = challenge.category === 'office' || challenge.category === 'office-fundamentals';
    const aiValidationCriteria = isOfficeChallenge && challenge.test_cases?.[0]?.type === 'ai_validation'
      ? challenge.test_cases[0].criteria
      : null;

    // Build system prompt based on challenge type
    let systemPrompt = '';
    let userPrompt = '';

    if (isOfficeChallenge && aiValidationCriteria) {
      // Office challenge with AI validation criteria (optimized)
      const criteriaText = Object.entries(aiValidationCriteria)
        .map(([area, details]: [string, any]) => {
          return `${area} (${details.weight}%): ${details.description || ''}`;
        })
        .join('\n');

      systemPrompt = `Office essentials evaluator. Score based on:

${criteriaText}

Return JSON:
{
  "passed": boolean (score >= 70),
  "score": number (0-100),
  "scoreBreakdown": {"area_name": {"score": number, "feedback": string}},
  "strengths": string[],
  "improvements": [{"issue": string, "yourCode": string|null, "betterApproach": string, "explanation": string}],
  "codeQuality": string,
  "suggestions": string[]
}`;

      userPrompt = `Challenge: ${challenge.title}

${challenge.description ? `${challenge.description.substring(0, 300)}...` : ''}

Solution (${language || 'text'}):
\`\`\`${language || 'text'}
${code}
\`\`\`

Return JSON only.`;
    } else {
      // Traditional code challenge
      const hasPreviousAttempts = previousSubmissions && previousSubmissions.length > 0;

      // Check if user sent previous validation attempt (from localStorage)
      const hasPreviousValidation = previousAttempt && previousAttempt.code && previousAttempt.score;

      if (hasPreviousValidation) {
        // Compare to previous VALIDATION attempt (optimized)
        const lastScore = previousAttempt.score;

        systemPrompt = `Code reviewer: Previous attempt scored ${lastScore}/100.

Evaluate the new code objectively:
- If code appears identical/minimal changes: score near ${lastScore}
- If significant improvements: score higher
- If issues introduced: score lower

Return JSON:
{
  "score": number (0-100),
  "passed": boolean (score >= 70),
  "strengths": string[],
  "improvements": string[],
  "suggestions": string[]
}`;

      } else if (hasPreviousAttempts) {
        // Compare to previous SUBMISSION (from DB) - simplified version
        const lastSubmission = previousSubmissions![0];
        const lastScore = lastSubmission.score || 0;

        systemPrompt = `You are a code reviewer. Previous submission scored ${lastScore}/100 on ${new Date(lastSubmission.submitted_at).toLocaleDateString()}.

Evaluate the new code objectively:
- Score (0-100): Correctness (60%) + Code quality (25%) + Best practices (15%)
- Pass threshold: 70+
- Be fair and consistent

Return JSON:
{
  "score": number (0-100),
  "passed": boolean (score >= 70),
  "strengths": string[],
  "improvements": string[],
  "suggestions": string[]
}`;

      } else {
        // First attempt - optimized prompt
        systemPrompt = `Code reviewer: Evaluate objectively and provide constructive feedback.

Score (0-100):
- Correctness (60%): Does it solve the problem?
- Code quality (25%): Clean and readable?
- Best practices (15%): Proper structure?

Pass: 70+

Return JSON:
{
  "passed": boolean,
  "score": number (0-100),
  "strengths": string[],
  "improvements": [{"issue": string, "yourCode": string|null, "betterApproach": string, "explanation": string}],
  "codeQuality": string,
  "suggestions": string[]
}`;
      }

      userPrompt = `Challenge: ${challenge.title}

${challenge.description ? `Description: ${challenge.description.substring(0, 300)}...` : ''}

Code (${language}):
\`\`\`${language}
${code}
\`\`\`

Return valid JSON only.`;
    }

    // Validate code using OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      temperature: 0.1, // Very low temperature for consistency
      max_tokens: isOfficeChallenge ? 1000 : 800, // Reduced tokens (optimized prompts)
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(
      completion.choices[0].message.content || '{}'
    );

    // Calculate points earned based on score (proportional to base points)
    const pointsEarned = result.passed
      ? Math.round((result.score / 100) * challenge.points)
      : 0;

    const response = {
      ...result,
      pointsEarned,
      maxPoints: challenge.points,
      difficulty: challenge.difficulty,
    };

    // Store in cache for future identical submissions
    validationCache.set(challengeId, code, response);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error validating code:', error);
    return NextResponse.json(
      { error: 'Failed to validate code' },
      { status: 500 }
    );
  }
}
