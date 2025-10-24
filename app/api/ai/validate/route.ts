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

    const { challengeId, code, language } = await req.json();

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
      systemPrompt = `You are an expert code reviewer and senior developer.
Analyze the submitted code for a coding challenge and provide:

1. **Score (0-100)**: Based on:
   - Correctness: Does it solve the problem?
   - Code quality: Clean, readable code
   - Best practices: Proper naming, structure
   - Efficiency: Algorithm efficiency

2. **Feedback**: Structured as JSON with:
   - "passed": boolean (score >= 70)
   - "score": number (0-100)
   - "strengths": string[] (what they did well)
   - "improvements": string[] (specific areas to improve)
   - "codeQuality": string (overall assessment in 2-3 sentences)
   - "suggestions": string[] (concrete suggestions for better code)

Be encouraging but honest. Focus on learning and improvement.`;

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
      temperature: 0.3,
      max_tokens: isOfficeChallenge ? 1500 : 1000, // More tokens for detailed office challenge feedback
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

    const pointsEarned = result.passed
      ? Math.round(
          (result.score / 100) *
            challenge.points *
            (difficultyMultiplier[
              challenge.difficulty as keyof typeof difficultyMultiplier
            ] || 1)
        )
      : 0;

    return NextResponse.json({
      ...result,
      pointsEarned,
      maxPoints: challenge.points,
    });
  } catch (error) {
    console.error('Error validating code:', error);
    return NextResponse.json(
      { error: 'Failed to validate code' },
      { status: 500 }
    );
  }
}
