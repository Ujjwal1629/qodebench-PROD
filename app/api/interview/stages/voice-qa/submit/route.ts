import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import OpenAI from 'openai';
import { verifyInterviewAPIAccess } from '@/lib/utils/api-access-checks';

export async function POST(request: NextRequest) {
  try {
    // SECURITY CHECK: Verify user has access to interview prep
    const { user, error: accessError } = await verifyInterviewAPIAccess();
    if (accessError) return accessError;

    const supabase = await createClient();

    const { sessionId, responses } = await request.json();

    // Get questions with evaluation rubrics
    const questionIds = Object.keys(responses);
    const { data: questions } = await supabase
      .from('interview_voice_qa_questions')
      .select('*')
      .in('id', questionIds);

    // Evaluate each response with AI (or fallback to basic scoring)
    // OPTIMIZED: Parallelize AI evaluations for faster processing
    const hasOpenAI = !!process.env.OPENAI_API_KEY;
    const openai = hasOpenAI ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

    // Create evaluation promises for all questions simultaneously
    const evaluationPromises = (questions || []).map(async (question) => {
      const userResponse = responses[question.id];
      let evaluation: any;

      if (openai) {
        try {
          // AI Evaluation with OpenAI
          const completion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
              {
                role: 'system',
                content: `You are an expert interviewer evaluating behavioral interview responses.

CRITICAL RULES:
1. If the answer is just repeating/copying the question text, give a score of 0/10 immediately.
2. If the answer is nonsensical, gibberish, or clearly copy-pasted content, give 0/10.
3. If the answer is too short (less than 30 words) or lacks substance, give maximum 3/10.

Evaluate based on the STAR method, clarity, relevance, and depth.
Score from 0-10.
Respond in JSON: {"score": number, "strengths": string[], "improvements": string[]}`,
              },
              {
                role: 'user',
                content: `Question: ${question.question_text}

Expected Points: ${question.expected_points?.join(', ')}

Candidate's Answer: ${userResponse}

Evaluate this response.`,
              },
            ],
            temperature: 0.3,
            response_format: { type: 'json_object' },
          });

          evaluation = JSON.parse(completion.choices[0].message.content || '{}');
        } catch (aiError) {
          console.error('OpenAI evaluation error:', aiError);
          // Fallback to basic scoring
          evaluation = generateBasicEvaluation(userResponse, question.question_text);
        }
      } else {
        // Fallback evaluation when OpenAI is not available
        evaluation = generateBasicEvaluation(userResponse, question.question_text);
      }

      return {
        session_id: sessionId,
        stage: 'stage_2_voice_qa',
        question_id: question.id,
        response_text: userResponse,
        is_voice_response: false,
        ai_score: evaluation.score || 0,
        ai_evaluation: evaluation,
        time_taken_seconds: 0,
      };
    });

    // Wait for all evaluations to complete in parallel
    const evaluations = await Promise.all(evaluationPromises);

    // Calculate total score
    const totalScore = evaluations.reduce((sum, ev) => sum + (ev.ai_score || 0), 0);

    // Insert stage responses
    await supabase.from('interview_stage_responses').insert(evaluations);

    // Calculate average score
    const averageScore = totalScore / questionIds.length;

    // Update session
    const { data: session } = await supabase
      .from('interview_sessions')
      .select('stage_scores, stage_completion_times')
      .eq('id', sessionId)
      .single();

    const updatedScores = { ...session?.stage_scores, stage_2: Number(averageScore.toFixed(1)) };

    await supabase
      .from('interview_sessions')
      .update({
        stage_scores: updatedScores,
        current_stage: 'stage_3_coding',
        stage_completion_times: {
          ...session?.stage_completion_times,
          stage_2: new Date().toISOString(),
        },
      })
      .eq('id', sessionId);

    return NextResponse.json({
      averageScore: Number(averageScore.toFixed(1)),
      evaluations,
    });
  } catch (error: any) {
    console.error('Voice QA submit API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Fallback evaluation function when OpenAI is not available
function generateBasicEvaluation(response: string, questionText?: string): any {
  const wordCount = response.trim().split(/\s+/).length;

  // Check if response is just repeating the question
  if (questionText) {
    const questionWords = questionText.toLowerCase().split(/\s+/);
    const responseWords = response.toLowerCase().split(/\s+/);
    const matchingWords = questionWords.filter(word =>
      word.length > 3 && responseWords.includes(word)
    ).length;

    // If more than 60% of significant words match, it's likely copying the question
    const matchPercentage = matchingWords / Math.max(questionWords.length, 1);
    if (matchPercentage > 0.6) {
      return {
        score: 0,
        strengths: [],
        improvements: [
          'Your answer appears to be copying the question. Please provide an original, thoughtful response.',
          'Use the STAR method: describe a real Situation, Task, Action, and Result from your experience.',
        ],
      };
    }
  }

  // Check for very short or nonsensical responses
  if (wordCount < 30) {
    return {
      score: 1,
      strengths: [],
      improvements: [
        'Response is too brief. Behavioral questions require detailed answers with specific examples.',
        'Use the STAR method: Situation, Task, Action, Result',
        'Aim for at least 100-200 words with concrete examples',
      ],
    };
  }

  // Basic scoring based on response length and structure
  let score = 4; // Base score (lowered from 5)

  if (wordCount > 100) score += 2;
  if (wordCount > 200) score += 1;
  if (response.toLowerCase().includes('situation') || response.toLowerCase().includes('task')) score += 0.5;
  if (response.toLowerCase().includes('action') || response.toLowerCase().includes('result')) score += 0.5;

  score = Math.min(10, Math.max(0, score));

  return {
    score: Number(score.toFixed(1)),
    strengths: [
      'Response provided',
      wordCount > 100 ? 'Detailed answer' : 'Clear and concise',
    ],
    improvements: [
      wordCount < 100 ? 'Could provide more detail and specific examples' : 'Consider adding more concrete metrics',
      'Use the STAR method: Situation, Task, Action, Result',
    ],
  };
}
