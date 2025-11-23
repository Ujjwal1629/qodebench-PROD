import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/server';
import { validationCache } from '@/lib/utils/validation-cache';

interface StructureValidation {
  weight: number;
  required_sections?: string[];
  min_length?: number;
  max_length?: number;
  format_checks?: string[];
}

interface AIQualityCheck {
  weight: number;
  criteria: Record<string, any>;
}

interface ImprovedFeedback {
  issue: string;
  yourCode: string | null;
  betterApproach: string;
  explanation: string;
}

interface ValidationResult {
  passed: boolean;
  score: number;
  scoreBreakdown: {
    structure?: {
      score: number;
      weight: number;
      feedback: string[];
    };
    quality: {
      score: number;
      weight: number;
      feedback: any;
    };
  };
  strengths: string[];
  improvements: ImprovedFeedback[];
  codeQuality: string;
  pointsEarned: number;
}

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

    const { challengeId, code, language } = await req.json();

    if (!challengeId || !code) {
      return NextResponse.json(
        { error: 'Challenge ID and code are required' },
        { status: 400 }
      );
    }

    // Check cache first - instant response if found (includes userId for security)
    const cachedResult = validationCache.get(user.id, challengeId, code);
    if (cachedResult) {
      console.log('✅ Hybrid cache hit for challenge:', challengeId);
      return NextResponse.json(cachedResult);
    }

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

    const validationType = challenge.validation_type || 'ai_only';
    const testCases = challenge.test_cases || [];
    const responseFormat = challenge.response_format || 'javascript';

    // Special handling for merge conflict interactive challenges
    if (responseFormat === 'merge_conflict_interactive') {
      try {
        const parsed = JSON.parse(code);
        const scenarios = testCases.scenarios || [];
        const userResponses = parsed.scenarios || [];

        if (!scenarios || scenarios.length === 0) {
          return NextResponse.json(
            { error: 'No merge conflict scenarios found in challenge' },
            { status: 400 }
          );
        }

        if (userResponses.length !== scenarios.length) {
          return NextResponse.json(
            { error: 'Incomplete scenario responses' },
            { status: 400 }
          );
        }

        // Phase 1: Structure validation (50%) - Check correct answers
        let correctCount = 0;
        const scenarioResults: any[] = [];

        for (let i = 0; i < scenarios.length; i++) {
          const scenario = scenarios[i];
          const userResponse = userResponses.find((r: any) => r.id === scenario.id);

          if (!userResponse) {
            scenarioResults.push({
              scenarioId: scenario.id,
              isCorrect: false,
              selectedAnswer: 'none',
              correctAnswer: scenario.correctAnswer,
              score: 0,
              feedback: 'No response provided for this scenario',
              explanation: scenario.explanation
            });
            continue;
          }

          const isCorrect = userResponse.selected === scenario.correctAnswer;
          if (isCorrect) correctCount++;

          scenarioResults.push({
            scenarioId: scenario.id,
            isCorrect,
            selectedAnswer: userResponse.selected,
            correctAnswer: scenario.correctAnswer,
            score: isCorrect ? 12.5 : 0,
            feedback: isCorrect
              ? `✅ Correct! ${scenario.correctAnswer.replace(/_/g, ' ')}`
              : `❌ Incorrect. You selected "${userResponse.selected.replace(/_/g, ' ')}", but the best choice was "${scenario.correctAnswer.replace(/_/g, ' ')}"`,
            explanation: scenario.explanation
          });
        }

        const structureScore = (correctCount / scenarios.length) * 50;

        // Phase 2: AI quality assessment (50%) - Evaluate reasoning (if provided)
        const hasReasoning = userResponses.some((r: any) => r.reasoning);
        let aiScore = 0;
        let aiReasoning = '';

        if (hasReasoning && openai.apiKey) {
          const reasoningText = userResponses
            .filter((r: any) => r.reasoning)
            .map((r: any, i: number) => `Scenario ${r.id}: ${r.reasoning}`)
            .join('\n\n');

          const aiResponse = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: 'You are evaluating a student\'s understanding of Git merge conflict resolution. Rate their reasoning on a scale of 0-50 based on clarity, understanding of merge strategies, and decision-making logic.'
              },
              {
                role: 'user',
                content: `Evaluate this student's reasoning for their merge conflict resolutions:\n\n${reasoningText}\n\nProvide a score from 0-50 and brief feedback.`
              }
            ],
            temperature: 0.3
          });

          const aiContent = aiResponse.choices[0].message.content || '';
          const scoreMatch = aiContent.match(/\b(\d+(?:\.\d+)?)\b/);
          aiScore = scoreMatch ? Math.min(50, parseFloat(scoreMatch[1])) : 25;
          aiReasoning = aiContent;
        } else {
          // No AI reasoning provided, give base score
          aiScore = 25;
        }

        const totalScore = Math.round(structureScore + aiScore);
        const passed = totalScore >= 70;

        const result = {
          passed,
          score: totalScore,
          structureScore,
          qualityScore: aiScore,
          scenarioResults,
          overallFeedback: passed
            ? `Excellent work! You got ${correctCount} out of ${scenarios.length} scenarios correct.`
            : `Good effort! You got ${correctCount} out of ${scenarios.length} scenarios correct. Review the explanations to improve.`,
          strengths: scenarioResults
            .filter((r: any) => r.isCorrect)
            .map((r: any) => `Scenario ${r.scenarioId}: ${r.feedback}`),
          improvements: scenarioResults
            .filter((r: any) => !r.isCorrect)
            .map((r: any) => ({
              issue: `Scenario ${r.scenarioId}`,
              yourCode: r.selectedAnswer,
              betterApproach: r.correctAnswer,
              explanation: r.explanation
            })),
          pointsEarned: passed ? challenge.points : 0,
          codeQuality: totalScore >= 90 ? 'Excellent' : totalScore >= 70 ? 'Good' : 'Needs Improvement'
        };

        // Cache the result
        validationCache.set(user.id, challengeId, code, result);

        return NextResponse.json(result);
      } catch (error: any) {
        console.error('Error validating merge conflict challenge:', error);
        return NextResponse.json(
          { error: 'Failed to validate merge conflict responses' },
          { status: 500 }
        );
      }
    }

    let structureScore = 0;
    let structureFeedback: string[] = [];
    let aiScore = 0;
    let aiFeedback: any = {};

    // PHASE 1: Structure Validation (if hybrid)
    if (validationType === 'hybrid' && testCases[0]?.structure_validation) {
      const structureValidation: StructureValidation = testCases[0].structure_validation;
      const structureWeight = structureValidation.weight || 50;

      let totalStructureScore = 0;
      let checks = 0;

      // Check required sections
      if (structureValidation.required_sections && structureValidation.required_sections.length > 0) {
        const requiredSections = structureValidation.required_sections;
        const foundSections = requiredSections.filter((section) =>
          code.includes(section)
        );

        const sectionScore = (foundSections.length / requiredSections.length) * 100;
        totalStructureScore += sectionScore;
        checks++;

        if (foundSections.length === requiredSections.length) {
          structureFeedback.push('✅ All required sections present');
        } else {
          const missingSections = requiredSections.filter(
            (s) => !code.includes(s)
          );
          structureFeedback.push(
            `⚠️ Missing sections: ${missingSections.join(', ')}`
          );
        }
      }

      // Check length
      if (structureValidation.min_length) {
        const minLength = structureValidation.min_length;
        const lengthScore = code.length >= minLength ? 100 : (code.length / minLength) * 100;
        totalStructureScore += lengthScore;
        checks++;

        if (code.length >= minLength) {
          structureFeedback.push(`✅ Adequate length (${code.length} characters)`);
        } else {
          structureFeedback.push(
            `⚠️ Too short (${code.length}/${minLength} characters)`
          );
        }
      }

      if (structureValidation.max_length) {
        const maxLength = structureValidation.max_length;
        if (code.length > maxLength) {
          structureFeedback.push(
            `⚠️ Too long (${code.length}/${maxLength} characters)`
          );
          totalStructureScore += 50;
        } else {
          totalStructureScore += 100;
        }
        checks++;
      }

      // Check format
      if (structureValidation.format_checks && structureValidation.format_checks.length > 0) {
        const formatChecks = structureValidation.format_checks;
        let formatScore = 100;
        const formatIssues: string[] = [];

        if (formatChecks.includes('has_headings')) {
          const hasHeadings = /^#{1,6}\s+.+$/m.test(code);
          if (!hasHeadings) {
            formatScore -= 33;
            formatIssues.push('missing headings');
          }
        }

        if (formatChecks.includes('has_bullet_points')) {
          const hasBullets = /^[\s]*[-*+]\s+.+$/m.test(code);
          if (!hasBullets) {
            formatScore -= 33;
            formatIssues.push('missing bullet points');
          }
        }

        if (formatChecks.includes('proper_markdown')) {
          // Check for common markdown elements
          const hasMarkdown =
            /^#{1,6}\s+.+$/m.test(code) || // headings
            /\*\*.+\*\*/.test(code) || // bold
            /\*.+\*/.test(code) || // italic
            /^[\s]*[-*+]\s+.+$/m.test(code); // lists

          if (!hasMarkdown) {
            formatScore -= 34;
            formatIssues.push('no markdown formatting detected');
          }
        }

        totalStructureScore += formatScore;
        checks++;

        if (formatIssues.length === 0) {
          structureFeedback.push('✅ Proper formatting');
        } else {
          structureFeedback.push(`⚠️ Formatting issues: ${formatIssues.join(', ')}`);
        }
      }

      // Calculate average structure score
      const avgStructureScore = checks > 0 ? totalStructureScore / checks : 0;
      structureScore = (avgStructureScore * structureWeight) / 100;
    }

    // PHASE 2: AI Quality Check
    const aiWeight =
      validationType === 'hybrid'
        ? testCases[0]?.ai_quality_check?.weight || 50
        : 100;

    const aiCriteria =
      validationType === 'hybrid'
        ? testCases[0]?.ai_quality_check?.criteria
        : testCases[0]?.criteria;

    // Fallback criteria for Office Fundamentals challenges without proper structure
    const defaultCriteria = {
      clarity: {
        weight: 30,
        description: 'Clear and concise communication',
      },
      completeness: {
        weight: 40,
        description: 'All important details covered',
      },
      professionalism: {
        weight: 30,
        description: 'Professional tone and well-structured format',
      },
    };

    const finalCriteria = aiCriteria || defaultCriteria;

    // Log warning if using fallback
    if (!aiCriteria) {
      console.warn(
        `Challenge ${challenge.slug} missing validation criteria, using default`
      );
    }

    // Build criteria text for AI prompt
    const criteriaText = Object.entries(finalCriteria)
      .map(([area, details]: [string, any]) => {
        const weight = typeof details === 'object' ? details.weight : details;
        const description = typeof details === 'object' ? details.description : '';
        const checks = typeof details === 'object' && details.checks
          ? `\n   Checks:\n   - ${details.checks.join('\n   - ')}`
          : '';

        return `**${area}** (Weight: ${weight}%)${description ? `\n   ${description}` : ''}${checks}`;
      })
      .join('\n\n');

    const systemPrompt = `You are a STRICT senior developer conducting code review. Be direct, professional, and thorough. ${validationType === 'hybrid' ? 'Structure validated separately - focus on QUALITY only.' : ''}

**GRADING SCALE (BE STRICT):**
- 0-20: Gibberish, placeholder text, or obviously incomplete
- 20-40: Non-functional or extremely poor quality
- 40-60: Basic attempt but significant issues
- 60-70: Functional but needs improvement
- 70-85: Good quality, minor improvements needed
- 85-100: Excellent, professional-grade work

**CRITICAL RULES:**
1. If ${responseFormat === 'markdown' ? 'content' : 'code'} is clearly minimal effort, placeholder, or gibberish → score BELOW 25
2. If ${responseFormat === 'markdown' ? 'content' : 'code'} shows no real understanding → score BELOW 40
3. Be specific and actionable in ALL feedback
4. Every improvement MUST include detailed explanation (40+ words)

**Evaluation Criteria:**
${criteriaText}

**FEEDBACK REQUIREMENTS:**
- "issue": Specific problem (15+ words), not vague statements
- "yourCode": Extract exact problematic snippet (if applicable)
- "betterApproach": Complete working example (20+ characters)
- "explanation": WHY this is better (40+ words minimum)

Return JSON:
{
  "score": number,
  "scoreBreakdown": {"area_name": {"score": number, "feedback": string}},
  "strengths": string[],
  "improvements": [{"issue": string, "yourCode": string|null, "betterApproach": string, "explanation": string}],
  "codeQuality": string
}`;

    const userPrompt = `Challenge: ${challenge.title}

${challenge.description ? `${challenge.description.substring(0, 250)}...` : ''}

Solution (${language || responseFormat}):
\`\`\`${language || responseFormat}
${code}
\`\`\`

Return JSON only.`;

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
        max_tokens: 1000, // Reduced from 1500 (optimized prompts)
      });

      const aiResult = JSON.parse(completion.choices[0].message.content || '{}');

      // Ensure score is within bounds
      const rawAIScore = Math.max(0, Math.min(100, aiResult.score || 0));
      aiScore = (rawAIScore * aiWeight) / 100;
      aiFeedback = aiResult;

    } catch (error) {
      console.error('OpenAI API error:', error);
      return NextResponse.json(
        { error: 'AI validation failed. Please try again.' },
        { status: 500 }
      );
    }

    // FINAL SCORE CALCULATION
    const finalScore = Math.round(structureScore + aiScore);
    const passed = finalScore >= 70;

    // Calculate points earned (proportional to score)
    const pointsEarned = Math.round((finalScore / 100) * challenge.points);

    const result: ValidationResult = {
      passed,
      score: finalScore,
      scoreBreakdown: {
        ...(validationType === 'hybrid' && {
          structure: {
            score: Math.round(structureScore),
            weight: testCases[0]?.structure_validation?.weight || 0,
            feedback: structureFeedback,
          },
        }),
        quality: {
          score: Math.round(aiScore),
          weight: aiWeight,
          feedback: aiFeedback.scoreBreakdown || {},
        },
      },
      strengths: aiFeedback.strengths || [],
      improvements: aiFeedback.improvements || [],
      codeQuality: aiFeedback.codeQuality || 'No detailed feedback available.',
      pointsEarned,
    };

    // Store in cache for future identical submissions
    validationCache.set(user.id, challengeId, code, result);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json(
      { error: 'Validation failed. Please try again.' },
      { status: 500 }
    );
  }
}
