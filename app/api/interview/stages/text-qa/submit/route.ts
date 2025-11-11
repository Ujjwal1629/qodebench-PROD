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

  if (hasPoorAnswer || wordCount < 10) {
    score = 0;
    improvements.push('Answer shows lack of knowledge or preparation');
    improvements.push('Research the topic and provide a substantive response');
    return { score: 0, strengths: [], improvements };
  }

  // Check word count (aim for 100-200 words)
  if (wordCount >= 100 && wordCount <= 250) {
    score += 2.5;
    strengths.push('Good answer length with sufficient detail');
  } else if (wordCount >= 50 && wordCount < 100) {
    score += 1;
    improvements.push('Answer could be more detailed (aim for 100-200 words)');
  } else if (wordCount < 50) {
    score += 0.5;
    improvements.push('Answer is too brief, add more detail and explanation');
  } else {
    score += 1.5;
    improvements.push('Answer is quite lengthy, try to be more concise');
  }

  // Check for key concepts coverage
  const keyConcepts = question.key_concepts || [];
  const lowerResponse = response.toLowerCase();
  const coveredConcepts = keyConcepts.filter((concept: string) =>
    lowerResponse.includes(concept.toLowerCase())
  );

  if (coveredConcepts.length >= keyConcepts.length * 0.7) {
    score += 2;
    strengths.push('Covers most key concepts effectively');
  } else if (coveredConcepts.length >= keyConcepts.length * 0.4) {
    score += 1;
    strengths.push('Mentions some key concepts');
    improvements.push(`Try to cover more key concepts: ${keyConcepts.join(', ')}`);
  } else {
    improvements.push(`Missing key concepts: ${keyConcepts.join(', ')}`);
  }

  // Check for examples
  if (
    response.includes('example') ||
    response.includes('for instance') ||
    response.includes('such as') ||
    response.includes('like')
  ) {
    score += 1;
    strengths.push('Includes relevant examples');
  } else {
    improvements.push('Add real-world examples to strengthen your answer');
  }

  // Check for structured thinking
  const hasStructure =
    response.includes('First') ||
    response.includes('Second') ||
    response.includes('However') ||
    response.includes('Additionally') ||
    response.includes('Furthermore');

  if (hasStructure) {
    score += 0.5;
    strengths.push('Well-structured response');
  } else {
    improvements.push('Use transition words to structure your answer better');
  }

  return {
    score: Math.min(Math.max(score, 0), 10),
    strengths: strengths.length > 0 ? strengths : ['Answer submitted'],
    improvements:
      improvements.length > 0
        ? improvements
        : ['Good answer, keep practicing to improve further'],
  };
}

// AI-powered evaluation
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

    const prompt = `You are a strict technical interviewer evaluating a candidate's answer to a technical concept question. Be realistic and rigorous in your scoring.

Question: ${question.question_text}
Question Type: ${question.question_type}
Expected Answer Guidelines: ${question.expected_answer}
Key Concepts to Cover: ${question.key_concepts.join(', ')}

Candidate's Answer:
${response}

Evaluate the answer based on:
1. Accuracy and correctness
2. Coverage of key concepts
3. Clarity and communication
4. Real-world examples or use cases
5. Depth of understanding

SCORING GUIDELINES:
- 0-2: Incorrect, irrelevant, or shows lack of knowledge (e.g., "don't know", very brief/vague answers)
- 3-4: Partially correct but missing key concepts or has significant gaps
- 5-6: Adequate answer covering basic concepts but lacking depth or examples
- 7-8: Good answer with most key concepts and some depth
- 9-10: Excellent answer with comprehensive coverage, examples, and deep understanding

BE STRICT: Award low scores (0-2) for answers that show lack of knowledge, are too brief (< 30 words), or contain phrases like "I don't know", "not sure", etc.

Respond in JSON format:
{
  "score": <number 0-10>,
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"]
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
      strengths: result.strengths || ['Answer evaluated'],
      improvements: result.improvements || ['Keep practicing'],
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
      .from('interview_text_qa_questions')
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
        stage: 'stage_4_text_qa',
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

    // Update session - move to stage 5
    // Use stage_4 key (matching check constraint)
    const updatedStageScores = {
      ...(session.stage_scores || {}),
      stage_4: Math.round(averageScore * 10) / 10,
    };

    const updatedCompletionTimes = {
      ...(session.stage_completion_times || {}),
      stage_4_text_qa: new Date().toISOString(),
    };

    const { error: updateError } = await supabase
      .from('interview_sessions')
      .update({
        current_stage: 'stage_5_discussion',
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
    console.error('Error submitting text Q&A responses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
