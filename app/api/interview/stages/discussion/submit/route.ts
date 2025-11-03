import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import OpenAI from 'openai';

interface QuestionResponse {
  question_id: string;
  response: string;
}

// Fallback evaluation when OpenAI is not available
function generateBasicEvaluation(
  response: string,
  question: any
): {
  score: number;
  strengths: string[];
  improvements: string[];
} {
  const wordCount = response.trim().split(/\s+/).filter(Boolean).length;
  let score = 5; // Base score
  const strengths: string[] = [];
  const improvements: string[] = [];

  // Check word count (aim for 200-400 words for system design)
  if (wordCount >= 200 && wordCount <= 500) {
    score += 2;
    strengths.push('Comprehensive answer with good detail');
  } else if (wordCount < 200) {
    improvements.push('Answer could be more detailed (aim for 200-400 words)');
  } else {
    score += 1;
    improvements.push('Answer is quite lengthy, focus on key points');
  }

  // Check for evaluation criteria coverage
  const evaluationCriteria = question.evaluation_criteria || {};
  const criteriaKeys = typeof evaluationCriteria === 'object' && !Array.isArray(evaluationCriteria)
    ? Object.keys(evaluationCriteria)
    : Array.isArray(evaluationCriteria) ? evaluationCriteria : [];

  const lowerResponse = response.toLowerCase();
  const coveredCriteria = criteriaKeys.filter((criterion: string) =>
    lowerResponse.includes(criterion.toLowerCase().replace(/_/g, ' ').split(' ')[0])
  );

  if (coveredCriteria.length >= criteriaKeys.length * 0.6) {
    score += 2;
    strengths.push('Addresses most evaluation criteria');
  } else {
    improvements.push('Try to cover all evaluation criteria mentioned');
  }

  // Check for system design keywords
  const designKeywords = [
    'scalability',
    'availability',
    'consistency',
    'load balancer',
    'database',
    'cache',
    'api',
    'microservices',
    'partition',
    'replication',
    'trade-off',
  ];

  const keywordCount = designKeywords.filter((keyword) =>
    lowerResponse.includes(keyword)
  ).length;

  if (keywordCount >= 5) {
    score += 1.5;
    strengths.push('Uses appropriate system design terminology');
  } else if (keywordCount >= 3) {
    score += 0.5;
    improvements.push('Include more system design concepts and terminology');
  } else {
    improvements.push('Use more specific system design terms (scalability, caching, etc.)');
  }

  // Check for structured thinking
  const hasStructure =
    (response.match(/\n/g) || []).length > 3 ||
    response.includes('First') ||
    response.includes('Second') ||
    response.includes('1.') ||
    response.includes('2.');

  if (hasStructure) {
    score += 0.5;
    strengths.push('Well-structured and organized response');
  } else {
    improvements.push('Structure your answer better (use numbered points or paragraphs)');
  }

  return {
    score: Math.min(Math.max(score, 0), 10),
    strengths: strengths.length > 0 ? strengths : ['Answer submitted'],
    improvements:
      improvements.length > 0
        ? improvements
        : ['Good answer, continue practicing system design'],
  };
}

// AI-powered evaluation for system design
async function evaluateResponse(
  response: string,
  question: any
): Promise<{
  score: number;
  strengths: string[];
  improvements: string[];
}> {
  const hasOpenAI = !!process.env.OPENAI_API_KEY;

  if (!hasOpenAI) {
    return generateBasicEvaluation(response, question);
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const criteriaList = typeof question.evaluation_criteria === 'object' && !Array.isArray(question.evaluation_criteria)
      ? Object.keys(question.evaluation_criteria).map(k => `${k.replace(/_/g, ' ')}: ${question.evaluation_criteria[k]}`)
      : Array.isArray(question.evaluation_criteria) ? question.evaluation_criteria : [];

    const prompt = `You are an expert system design interviewer evaluating a candidate's response to a system design question.

Question: ${question.question_text}
Question Type: ${question.question_type}
Evaluation Criteria:
${criteriaList.join('\n')}

Sample Approach:
${question.sample_approach}

Candidate's Answer:
${response}

Evaluate the answer based on:
1. Completeness - Does it address all key aspects of the design?
2. Scalability considerations - Load handling, bottlenecks, growth
3. Trade-offs - Does the candidate discuss pros/cons of choices?
4. Technical depth - Specific technologies, protocols, patterns
5. Practical thinking - Real-world constraints and considerations
6. Clarity of communication - Is the design clearly explained?

Provide a score from 0-10 (can use decimals) and identify specific strengths and actionable improvements.

Respond in JSON format:
{
  "score": <number 0-10>,
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["improvement 1", "improvement 2"]
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 600,
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');

    return {
      score: Math.min(Math.max(result.score || 5, 0), 10),
      strengths: result.strengths || ['Answer evaluated'],
      improvements: result.improvements || ['Continue practicing system design'],
    };
  } catch (error) {
    console.error('AI evaluation error:', error);
    return generateBasicEvaluation(response, question);
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
    const { sessionId, responses, timeTaken } = body as {
      sessionId: string;
      responses: QuestionResponse[];
      timeTaken: number;
    };

    if (!sessionId || !responses || responses.length === 0) {
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

    // Fetch all questions
    const questionIds = responses.map((r) => r.question_id);
    const { data: questions, error: questionsError } = await supabase
      .from('interview_discussion_questions')
      .select('*')
      .in('id', questionIds);

    if (questionsError || !questions) {
      return NextResponse.json(
        { error: 'Failed to fetch questions' },
        { status: 500 }
      );
    }

    // Evaluate each response
    const evaluations = [];
    let totalScore = 0;

    for (const responseData of responses) {
      const question = questions.find((q) => q.id === responseData.question_id);
      if (!question) continue;

      const evaluation = await evaluateResponse(responseData.response, question);
      totalScore += evaluation.score;

      evaluations.push({
        question_id: question.id,
        evaluation,
      });

      // Save to interview_stage_responses
      await supabase.from('interview_stage_responses').insert({
        session_id: sessionId,
        stage: 'stage_5_discussion',
        question_id: question.id,
        response_text: responseData.response,
        evaluation_score: evaluation.score,
        evaluation_feedback: {
          strengths: evaluation.strengths,
          improvements: evaluation.improvements,
        },
      });
    }

    const averageScore = totalScore / responses.length;

    // Update session - move to stage 6 (results)
    // Use stage_5 key (matching check constraint)
    const updatedStageScores = {
      ...(session.stage_scores || {}),
      stage_5: Math.round(averageScore * 10) / 10,
    };

    const updatedCompletionTimes = {
      ...(session.stage_completion_times || {}),
      stage_5_discussion: new Date().toISOString(),
    };

    const { error: updateError } = await supabase
      .from('interview_sessions')
      .update({
        current_stage: 'stage_6_results',
        status: 'completed',
        stage_scores: updatedStageScores,
        stage_completion_times: updatedCompletionTimes,
      })
      .eq('id', sessionId);

    if (updateError) {
      console.error('Error updating session:', updateError);
    }

    return NextResponse.json({
      averageScore: Math.round(averageScore * 10) / 10,
      evaluations,
    });
  } catch (error) {
    console.error('Error submitting discussion responses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
