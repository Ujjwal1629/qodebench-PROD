import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import OpenAI from 'openai';

interface TestCase {
  input: any;
  expected_output: any;
  is_hidden: boolean;
}

interface TestResult {
  passed: boolean;
  input: any;
  expected: any;
  actual: any;
  error?: string;
}

// Safe code execution with timeout
function executeCode(code: string, input: any, timeout = 5000): Promise<any> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('Execution timeout'));
    }, timeout);

    try {
      const wrappedCode = `
        'use strict';
        ${code}

        const functionMatch = ${JSON.stringify(code)}.match(/function\\s+(\\w+)/);
        const funcName = functionMatch ? functionMatch[1] : null;

        if (funcName && typeof eval(funcName) === 'function') {
          return eval(funcName)(${JSON.stringify(input)});
        }

        throw new Error('No valid function found in code');
      `;

      const func = new Function(wrappedCode);
      const result = func();

      clearTimeout(timeoutId);
      resolve(result);
    } catch (error) {
      clearTimeout(timeoutId);
      reject(error);
    }
  });
}

// Deep equality check
function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((val, idx) => deepEqual(val, b[idx]));
  }

  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    return keysA.every(key => deepEqual(a[key], b[key]));
  }

  return false;
}

// Fallback code quality evaluation (when OpenAI unavailable)
function generateBasicCodeQuality(code: string, language: string): {
  score: number;
  feedback: string;
} {
  let score = 5; // Start at 5/10
  const feedback: string[] = [];

  // Check code length (not too short, not too long)
  const lines = code.split('\n').filter(line => line.trim()).length;
  if (lines > 5 && lines < 50) {
    score += 1;
    feedback.push('Good code length and structure');
  } else if (lines <= 5) {
    feedback.push('Code seems too short, consider edge cases');
  } else {
    feedback.push('Code is quite long, consider refactoring');
  }

  // Check for comments
  if (code.includes('//') || code.includes('/*')) {
    score += 0.5;
    feedback.push('Good use of comments');
  } else {
    feedback.push('Consider adding comments to explain complex logic');
  }

  // Check for error handling
  if (code.includes('try') || code.includes('catch') || code.includes('if')) {
    score += 1;
    feedback.push('Includes error handling or validation');
  } else {
    feedback.push('Consider adding error handling');
  }

  // Check for proper naming
  const hasDescriptiveNames = /[a-z]{3,}[A-Z]/.test(code); // camelCase check
  if (hasDescriptiveNames) {
    score += 0.5;
    feedback.push('Uses descriptive variable names');
  } else {
    feedback.push('Use more descriptive variable names');
  }

  // Check for clean code patterns
  if (!code.includes('var ')) {
    score += 0.5;
    feedback.push('Uses modern JavaScript (const/let)');
  }

  // Check complexity (nested loops might indicate inefficiency)
  const nestedLoops = (code.match(/for|while/g) || []).length;
  if (nestedLoops > 2) {
    score -= 0.5;
    feedback.push('Consider optimizing nested loops for better time complexity');
  } else {
    score += 0.5;
    feedback.push('Good algorithmic approach');
  }

  return {
    score: Math.min(Math.max(score, 0), 10),
    feedback: feedback.join('. '),
  };
}

// AI code quality evaluation
async function evaluateCodeQuality(
  code: string,
  challenge: any,
  language: string
): Promise<{ score: number; feedback: string }> {
  const hasOpenAI = !!process.env.OPENAI_API_KEY;

  if (!hasOpenAI) {
    return generateBasicCodeQuality(code, language);
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = `You are an expert code reviewer evaluating a coding challenge submission.

Challenge: ${challenge.title}
Description: ${challenge.description}
Language: ${language}

Submitted Code:
\`\`\`${language}
${code}
\`\`\`

Evaluate the code quality based on:
1. Code readability and style
2. Time and space complexity
3. Error handling
4. Edge case coverage
5. Best practices for ${language}

Provide a score from 0-10 (can use decimals like 7.5) and constructive feedback.

Respond in JSON format:
{
  "score": <number 0-10>,
  "feedback": "<string with specific feedback>"
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');

    // Don't default to 5 if score is 0! Use nullish coalescing
    const finalScore = result.score ?? 0;

    return {
      score: Math.min(Math.max(finalScore, 0), 10),
      feedback: result.feedback || 'Code submitted successfully',
    };
  } catch (error) {
    console.error('AI evaluation error:', error);
    return generateBasicCodeQuality(code, language);
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { sessionId, challengeId, code, language, timeTaken } = body;

    if (!sessionId || !challengeId || !code) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify session
    const { data: session, error: sessionError } = await supabase
      .from('interview_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Fetch challenge
    const { data: challenge, error: challengeError } = await supabase
      .from('interview_coding_challenges')
      .select('*')
      .eq('id', challengeId)
      .single();

    if (challengeError || !challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      );
    }

    // Run ALL test cases (visible + hidden)
    const testCases = challenge.test_cases as TestCase[];
    const results: TestResult[] = [];
    let passedCount = 0;

    for (const testCase of testCases) {
      try {
        const actual = await Promise.race([
          executeCode(code, testCase.input),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Test execution timeout')), 10000)
          )
        ]);
        const passed = deepEqual(actual, testCase.expected_output);

        if (passed) passedCount++;

        results.push({
          passed,
          input: testCase.input,
          expected: testCase.expected_output,
          actual,
        });
      } catch (error: any) {
        console.error('Test case execution error:', error);
        results.push({
          passed: false,
          input: testCase.input,
          expected: testCase.expected_output,
          actual: null,
          error: error.message || 'Execution error',
        });
      }
    }

    // Calculate test cases score (70% weight)
    const testCaseScore = (passedCount / testCases.length) * 7;

    // Evaluate code quality with AI (30% weight)
    let qualityEvaluation;
    try {
      qualityEvaluation = await Promise.race([
        evaluateCodeQuality(code, challenge, language),
        new Promise((resolve) =>
          setTimeout(() => resolve({
            score: 5,
            feedback: 'Code evaluation timed out. Default score applied.'
          }), 15000)
        )
      ]) as { score: number; feedback: string };
    } catch (error) {
      console.error('Code quality evaluation error:', error);
      qualityEvaluation = {
        score: 5,
        feedback: 'Code evaluation error. Default score applied.'
      };
    }

    const qualityScore = (qualityEvaluation.score / 10) * 3;

    // Final score out of 10
    const finalScore = Math.round((testCaseScore + qualityScore) * 10) / 10;

    // Save submission to database
    const { error: submissionError } = await supabase
      .from('interview_coding_submissions')
      .insert({
        session_id: sessionId,
        challenge_id: challengeId,
        submitted_code: code,
        test_results: results,
        tests_passed: passedCount,
        tests_total: testCases.length,
        code_quality_score: qualityEvaluation.score,
        ai_feedback: {
          feedback: qualityEvaluation.feedback,
        },
        time_taken_seconds: timeTaken || 0,
        final_score: finalScore,
      });

    if (submissionError) {
      console.error('Error saving submission:', submissionError);
    }

    // Update session - move to stage 4
    // Use stage_1, stage_2, stage_3 etc as keys (matching check constraint)
    const updatedStageScores = {
      ...(session.stage_scores || {}),
      stage_3: finalScore,
    };

    const updatedCompletionTimes = {
      ...(session.stage_completion_times || {}),
      stage_3_coding: new Date().toISOString(),
    };

    const { error: updateError } = await supabase
      .from('interview_sessions')
      .update({
        current_stage: 'stage_4_text_qa',
        stage_scores: updatedStageScores,
        stage_completion_times: updatedCompletionTimes,
      })
      .eq('id', sessionId);

    if (updateError) {
      console.error('Error updating session:', updateError);
      return NextResponse.json(
        { error: 'Failed to update interview session', details: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      finalScore,
      testCaseScore,
      qualityScore,
      passedCount,
      totalTests: testCases.length,
      qualityFeedback: qualityEvaluation.feedback,
    });
  } catch (error) {
    console.error('Error submitting code:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
