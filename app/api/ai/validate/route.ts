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

    const { challengeId, code, language, previousAttempt } = await req.json();

    if (!challengeId || !code) {
      return NextResponse.json(
        { error: 'Challenge ID and code are required' },
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

    // Get previous submissions for this user and challenge
    const { data: previousSubmissions } = await supabase
      .from('submissions')
      .select('code, score, ai_feedback, status, submitted_at')
      .eq('user_id', user.id)
      .eq('challenge_id', challengeId)
      .order('submitted_at', { ascending: false })
      .limit(3); // Get last 3 attempts for context

    // Check if this is an office challenge with AI validation criteria
    const isOfficeChallenge = challenge.category === 'office' || challenge.category === 'office-fundamentals';
    const aiValidationCriteria = isOfficeChallenge && challenge.test_cases?.[0]?.type === 'ai_validation'
      ? challenge.test_cases[0].criteria
      : null;

    // Build system prompt based on challenge type
    let systemPrompt = '';
    let userPrompt = '';

    if (isOfficeChallenge && aiValidationCriteria) {
      // Office challenge with AI validation criteria
      const criteriaText = Object.entries(aiValidationCriteria)
        .map(([area, details]: [string, any]) => {
          const checks = details.checks?.join('\n   - ') || '';
          return `**${area}** (Weight: ${details.weight}%)
   ${details.description}
   Checks:
   - ${checks}`;
        })
        .join('\n\n');

      const bestPractices = challenge.test_cases[0].best_practices_reference?.join('\n- ') || '';

      systemPrompt = `You are an expert reviewer specializing in code review, documentation, and professional development practices.

For this office essentials challenge, evaluate the submission using these criteria:

${criteriaText}

Best Practices Reference:
- ${bestPractices}

Return a JSON object with:
{
  "passed": boolean (score >= 70),
  "score": number (0-100, weighted average of all areas),
  "scoreBreakdown": {
    "area_name": { "score": number, "feedback": string }
  },
  "strengths": string[] (what they did well),
  "improvements": string[] (specific, actionable improvements),
  "bestPracticesValidation": {
    "followed": string[] (practices they followed correctly),
    "missed": string[] (practices they should apply)
  },
  "codeQuality": string (overall assessment in 2-3 sentences),
  "suggestions": string[] (concrete suggestions for improvement),
  "realWorldContext": string (explain how this applies in real work scenarios, 2-3 sentences)
}

Be thorough but encouraging. Focus on learning and real-world applicability.`;

      userPrompt = `Challenge: ${challenge.title}

Description: ${challenge.description}

Learning Objectives:
${challenge.learning_objectives?.join('\n') || 'N/A'}

Submitted Solution (${language || 'text'}):
\`\`\`${language || 'text'}
${code}
\`\`\`

Evaluate this submission using the AI validation criteria provided. Return ONLY a valid JSON object.`;
    } else {
      // Traditional code challenge
      const hasPreviousAttempts = previousSubmissions && previousSubmissions.length > 0;

      // Check if user sent previous validation attempt (from localStorage)
      const hasPreviousValidation = previousAttempt && previousAttempt.code && previousAttempt.score;

      if (hasPreviousValidation) {
        // Compare to previous VALIDATION attempt (in current session)
        const lastScore = previousAttempt.score;
        const lastCode = previousAttempt.code;

        systemPrompt = `You are an expert code reviewer providing DETERMINISTIC scoring by comparing code changes.

CRITICAL RULES - FOLLOW EXACTLY:
1. Previous validation attempt scored ${lastScore}/100
2. Compare line-by-line: What's DIFFERENT in the new code?
3. Score changes based on actual code differences:
   - NO changes = EXACT SAME score (${lastScore}/100)
   - Minor formatting/whitespace only = ±1 point max
   - Fixed a bug/issue = +10 to +20 points
   - Added new features = +15 to +30 points
   - Made it worse/broke something = -10 to -30 points
4. You MUST explain EXACTLY what code changed

Previous Validation Attempt:
\`\`\`
${lastCode}
\`\`\`
Score: ${lastScore}/100

Analyze the NEW code below and return JSON:
{
  "score": number (0-100, STRICTLY based on actual code differences from previous validation),
  "passed": boolean (score >= 70),
  "comparedToPrevious": string (SPECIFIC code changes: "You changed X to Y which improved/worsened Z"),
  "codeChanges": string (detailed list of actual code differences found),
  "scoreChange": number (difference from previous validation: ${lastScore}),
  "scoreJustification": string (explain why score changed or stayed same),
  "strengths": string[],
  "improvements": string[],
  "suggestions": string[]
}

BE DETERMINISTIC: Same code = same score. Different code = different score based on changes.`;

      } else if (hasPreviousAttempts) {
        // Compare to previous SUBMISSION (from DB)
        const lastSubmission = previousSubmissions![0];
        const lastScore = lastSubmission.score || 0;

        // Build detailed comparison
        const previousContext = previousSubmissions!
          .map((sub, index) => {
            return `Submission ${previousSubmissions!.length - index} (${new Date(sub.submitted_at).toLocaleDateString()}):
- Score: ${sub.score}/100
- Status: ${sub.status}
- Full Code:
\`\`\`
${sub.code}
\`\`\``;
          })
          .join('\n\n---\n\n');

        systemPrompt = `You are an expert code reviewer providing DETERMINISTIC scoring by comparing code changes.

CRITICAL RULES - FOLLOW EXACTLY:
1. Last submission scored ${lastScore}/100
2. Compare line-by-line: What's DIFFERENT in the new code?
3. Score changes based on actual code differences:
   - NO changes = EXACT SAME score (${lastScore}/100)
   - Minor formatting only = ±2 points max
   - Fixed a bug/issue = +10 to +20 points
   - Added new features = +15 to +30 points
   - Made it worse/broke something = -10 to -30 points
4. You MUST explain EXACTLY what code changed

Previous Submission History:
${previousContext}

Analyze the NEW code below and return JSON:
{
  "score": number (0-100, STRICTLY based on actual code differences from last submission),
  "passed": boolean (score >= 70),
  "comparedToPrevious": string (SPECIFIC code changes: "You changed X to Y which improved/worsened Z"),
  "codeChanges": string (detailed list of actual code differences found),
  "scoreChange": number (difference from last score: ${lastScore}),
  "scoreJustification": string (explain why score changed or stayed same),
  "strengths": string[],
  "improvements": string[],
  "suggestions": string[]
}

BE DETERMINISTIC: Same code = same score. Different code = different score based on changes.`;

      } else {
        // First attempt - standard scoring
        systemPrompt = `You are an expert code reviewer and senior developer.
Analyze the submitted code for a coding challenge and provide:

1. **Score (0-100)**: Based on:
   - Correctness: Does it solve the problem? (40%)
   - Code quality: Clean, readable code (30%)
   - Best practices: Proper naming, structure (20%)
   - Efficiency: Algorithm efficiency (10%)

2. **Feedback**: Structured as JSON with:
   - "passed": boolean (score >= 70)
   - "score": number (0-100)
   - "strengths": string[] (what they did well)
   - "improvements": string[] (specific areas to improve)
   - "codeQuality": string (overall assessment in 2-3 sentences)
   - "suggestions": string[] (concrete suggestions for better code)

Be encouraging but honest. Focus on learning and improvement.`;
      }

      userPrompt = `Challenge: ${challenge.title}

Description: ${challenge.description}

Learning Objectives:
${challenge.learning_objectives?.join('\n') || 'N/A'}

Submitted Code (${language}):
\`\`\`${language}
${code}
\`\`\`

Analyze this code and return ONLY a valid JSON object with the structure specified in the system prompt.`;
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
      max_tokens: isOfficeChallenge ? 1500 : 1200, // More tokens for comparison
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(
      completion.choices[0].message.content || '{}'
    );

    // Calculate points earned based on score and difficulty
    const difficultyMultiplier = {
      easy: 1,
      medium: 1.5,
      hard: 2,
    };

    const multiplier = difficultyMultiplier[
      challenge.difficulty as keyof typeof difficultyMultiplier
    ] || 1;

    const maxPossiblePoints = Math.round(challenge.points * multiplier);

    const pointsEarned = result.passed
      ? Math.round((result.score / 100) * challenge.points * multiplier)
      : 0;

    return NextResponse.json({
      ...result,
      pointsEarned,
      maxPoints: maxPossiblePoints, // Now shows actual max with multiplier
      difficulty: challenge.difficulty,
    });
  } catch (error) {
    console.error('Error validating code:', error);
    return NextResponse.json(
      { error: 'Failed to validate code' },
      { status: 500 }
    );
  }
}
