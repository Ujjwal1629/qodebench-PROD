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

      systemPrompt = `You are a STRICT senior professional evaluating office work. Be direct and thorough.

**GRADING SCALE (BE STRICT):**
- 0-20: Gibberish, placeholder, or clearly incomplete
- 20-40: Non-functional or extremely poor quality
- 40-60: Basic attempt but significant issues
- 60-70: Functional but needs improvement
- 70-85: Good quality, minor improvements needed
- 85-100: Excellent, professional-grade work

**CRITICAL RULES:**
1. If content is minimal effort, placeholder, or gibberish → score BELOW 25
2. If content shows no real understanding → score BELOW 40
3. Be specific and actionable in ALL feedback
4. Every improvement MUST include detailed explanation (40+ words)

**Evaluation Criteria:**
${criteriaText}

**FEEDBACK REQUIREMENTS:**
- "issue": Specific problem (15+ words), not vague statements
- "yourCode": Extract exact problematic section (if applicable)
- "betterApproach": Complete working example (20+ characters)
- "explanation": WHY this is better (40+ words minimum)

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

        systemPrompt = `You are a STRICT senior code reviewer. Previous attempt scored ${lastScore}/100.

**GRADING SCALE:**
- 0-20: Gibberish or placeholder code
- 20-40: Non-functional code
- 40-60: Basic but significant issues
- 60-70: Works but needs improvement
- 70-85: Good quality
- 85-100: Excellent

**CRITICAL RULES:**
1. If code is clearly minimal effort or gibberish → score BELOW 25
2. If code shows no real understanding → score BELOW 40
3. Be specific in ALL feedback (improvements: 15+ words each)

Evaluate objectively:
- Identical/minimal changes: score near ${lastScore}
- Significant improvements: score higher
- Issues introduced: score lower

Return JSON:
{
  "score": number (0-100),
  "passed": boolean (score >= 70),
  "strengths": string[],
  "improvements": [{"issue": string, "yourCode": string|null, "betterApproach": string, "explanation": string}],
  "codeQuality": string,
  "suggestions": string[]
}`;

      } else if (hasPreviousAttempts) {
        // Compare to previous SUBMISSION (from DB) - simplified version
        const lastSubmission = previousSubmissions![0];
        const lastScore = lastSubmission.score || 0;

        systemPrompt = `You are a STRICT senior code reviewer. Previous submission scored ${lastScore}/100 on ${new Date(lastSubmission.submitted_at).toLocaleDateString()}.

**GRADING SCALE:**
- 0-20: Gibberish or placeholder code
- 20-40: Non-functional code
- 40-60: Basic but significant issues
- 60-70: Works but needs improvement
- 70-85: Good quality
- 85-100: Excellent

**CRITICAL RULES:**
1. If code is clearly minimal effort or gibberish → score BELOW 25
2. If code shows no real understanding → score BELOW 40
3. Be specific in ALL feedback (improvements: 15+ words each)

Evaluate objectively:
- Score (0-100): Correctness (60%) + Code quality (25%) + Best practices (15%)
- Pass threshold: 70+
- Be fair but STRICT

Return JSON:
{
  "score": number (0-100),
  "passed": boolean (score >= 70),
  "strengths": string[],
  "improvements": [{"issue": string, "yourCode": string|null, "betterApproach": string, "explanation": string}],
  "codeQuality": string,
  "suggestions": string[]
}`;

      } else {
        // First attempt - optimized prompt
        systemPrompt = `You are a STRICT senior developer conducting first-time code review. Be direct, professional, and thorough.

**GRADING SCALE (BE STRICT):**
- 0-20: Gibberish, placeholder, or clearly incomplete
- 20-40: Non-functional or extremely poor quality
- 40-60: Basic attempt but significant issues
- 60-70: Functional but needs improvement
- 70-85: Good quality, minor improvements needed
- 85-100: Excellent, professional-grade work

**CRITICAL RULES:**
1. If code is clearly minimal effort, placeholder, or gibberish → score BELOW 25
2. If code shows no real understanding of the problem → score BELOW 40
3. Be specific and actionable in ALL feedback
4. Every improvement MUST include detailed explanation (40+ words)

**Score Breakdown (0-100):**
- Correctness (60%): Does it solve the problem correctly?
- Code quality (25%): Clean, readable, maintainable?
- Best practices (15%): Proper structure and conventions?

**Pass threshold: 70+**

**FEEDBACK REQUIREMENTS:**
- "issue": Specific problem (15+ words), not vague statements
- "yourCode": Extract exact problematic code snippet
- "betterApproach": Complete working code example (20+ characters)
- "explanation": WHY this is better (40+ words minimum)

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
