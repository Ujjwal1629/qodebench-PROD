import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import OpenAI from 'openai';
import { verifyInterviewAPIAccess } from '@/lib/utils/api-access-checks';

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
  const trimmedResponse = response.trim().toLowerCase();
  const wordCount = response.trim().split(/\s+/).filter(Boolean).length;
  let score = 0; // Start with 0, earn points based on quality
  const strengths: string[] = [];
  const improvements: string[] = [];

  // Check for non-answers or poor quality responses
  const poorAnswers = [
    "don't know",
    "dont know",
    "i don't know",
    "i dont know",
    "not sure",
    "i'm not sure",
    "im not sure",
    "no idea",
    "idk",
    "dunno"
  ];

  const hasPoorAnswer = poorAnswers.some(phrase => trimmedResponse.includes(phrase));

  if (hasPoorAnswer || wordCount < 20) {
    score = 0;
    improvements.push('Answer shows lack of knowledge or preparation');
    improvements.push('Research system design principles and provide a substantive response');
    return { score: 0, strengths: [], improvements };
  }

  // Check word count (aim for 200-400 words for system design)
  if (wordCount >= 200 && wordCount <= 500) {
    score += 3;
    strengths.push('Comprehensive answer with good detail');
  } else if (wordCount >= 100 && wordCount < 200) {
    score += 1.5;
    improvements.push('Answer could be more detailed (aim for 200-400 words)');
  } else if (wordCount < 100) {
    score += 0.5;
    improvements.push('Answer is too brief for system design, add more architectural details');
  } else {
    score += 2;
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

    const prompt = `You are a strict system design interviewer evaluating a candidate's response to a system design question. Be realistic and rigorous in your scoring.

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

SCORING GUIDELINES:
- 0-2: Incorrect, irrelevant, or shows lack of knowledge (e.g., "don't know", very brief/vague answers, < 50 words)
- 3-4: Partially correct but missing major components or has significant gaps
- 5-6: Adequate answer covering basic concepts but lacking depth or trade-off discussion
- 7-8: Good answer with most components and some scalability considerations
- 9-10: Excellent answer with comprehensive design, trade-offs, and deep technical understanding

BE STRICT: Award low scores (0-2) for answers that show lack of knowledge, are too brief (< 50 words), or contain phrases like "I don't know", "not sure", etc.

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

    // Don't default to 5 if score is 0! Use nullish coalescing
    const finalScore = result.score ?? 0;

    return {
      score: Math.min(Math.max(finalScore, 0), 10),
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
    // SECURITY CHECK: Verify user has access to interview prep
    const { user, error: accessError } = await verifyInterviewAPIAccess();
    if (accessError) return accessError;

    const supabase = await createClient();

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
