import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyInterviewAPIAccess } from '@/lib/utils/api-access-checks';

export async function POST(request: NextRequest) {
  try {
    // SECURITY CHECK: Verify user has access to interview prep
    const { user, error: accessError } = await verifyInterviewAPIAccess();
    if (accessError) return accessError;

    const { sessionId, answers, timeTaken } = await request.json();

    if (!sessionId || !answers) {
      return NextResponse.json(
        { error: 'Session ID and answers are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: session } = await supabase
      .from('interview_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single();

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Get all question IDs to fetch correct answers
    const questionIds = Object.keys(answers);

    const { data: questions, error: questionsError } = await supabase
      .from('interview_mcq_questions')
      .select('id, correct_option')
      .in('id', questionIds);

    if (questionsError) {
      console.error('Error fetching questions:', questionsError);
      return NextResponse.json(
        { error: 'Failed to fetch questions' },
        { status: 500 }
      );
    }

    // Grade the answers
    let correctCount = 0;
    const answerRecords = [];

    for (const question of questions || []) {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correct_option;

      if (isCorrect) {
        correctCount++;
      }

      answerRecords.push({
        session_id: sessionId,
        question_id: question.id,
        selected_option: userAnswer,
        is_correct: isCorrect,
        time_taken_seconds: Math.floor(timeTaken / questionIds.length), // Approximate time per question
      });
    }

    // Insert all answer records
    const { error: insertError } = await supabase
      .from('interview_mcq_answers')
      .insert(answerRecords);

    if (insertError) {
      console.error('Error inserting answers:', insertError);
      return NextResponse.json(
        { error: 'Failed to save answers' },
        { status: 500 }
      );
    }

    // Calculate score (out of 10)
    const score = (correctCount / questionIds.length) * 10;

    // Update session with stage score
    const currentStageScores = session.stage_scores || {};
    currentStageScores.stage_1 = score;

    const { error: updateError } = await supabase
      .from('interview_sessions')
      .update({
        stage_scores: currentStageScores,
        current_stage: 'stage_2_voice_qa',
        stage_completion_times: {
          ...session.stage_completion_times,
          stage_1: new Date().toISOString(),
        },
      })
      .eq('id', sessionId);

    if (updateError) {
      console.error('Error updating session:', updateError);
      return NextResponse.json(
        { error: 'Failed to update session' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      score: Number(score.toFixed(1)),
      correctCount,
      totalQuestions: questionIds.length,
      percentage: Number(((correctCount / questionIds.length) * 100).toFixed(1)),
    });
  } catch (error: any) {
    console.error('MCQ submit API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
