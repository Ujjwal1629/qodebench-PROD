import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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

    const {
      challengeId,
      code,
      language,
      validationResult,
    } = await req.json();

    if (!challengeId || !code || !validationResult) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { passed, score, codeQuality, improvements, suggestions } =
      validationResult;

    // Calculate points based on validation result
    const { data: challenge } = await supabase
      .from('challenges')
      .select('points')
      .eq('id', challengeId)
      .single();

    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      );
    }

    const pointsEarned = validationResult.pointsEarned || 0;

    // Create submission
    const { data: submission, error: submissionError } = await supabase
      .from('submissions')
      .insert({
        user_id: user.id,
        challenge_id: challengeId,
        code,
        language: language || 'javascript',
        status: passed ? 'passed' : 'failed',
        ai_feedback: JSON.stringify({
          codeQuality,
          improvements,
          suggestions,
        }),
        score,
        passed_tests: passed ? 1 : 0,
        total_tests: 1,
        points_earned: pointsEarned,
      })
      .select()
      .single();

    if (submissionError) {
      console.error('Submission error:', submissionError);
      return NextResponse.json(
        { error: 'Failed to save submission' },
        { status: 500 }
      );
    }

    // Update roadmap progress
    await supabase
      .from('roadmap_progress')
      .upsert(
        {
          user_id: user.id,
          challenge_id: challengeId,
          status: passed ? 'completed' : 'in_progress',
          started_at: new Date().toISOString(),
          completed_at: passed ? new Date().toISOString() : null,
          attempts: 1,
        },
        {
          onConflict: 'user_id,challenge_id',
        }
      );

    return NextResponse.json({
      success: true,
      submission,
      pointsEarned,
    });
  } catch (error) {
    console.error('Error submitting challenge:', error);
    return NextResponse.json(
      { error: 'Failed to submit challenge' },
      { status: 500 }
    );
  }
}
