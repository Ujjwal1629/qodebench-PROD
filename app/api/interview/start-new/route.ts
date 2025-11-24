import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { canAccessInterviews } from '@/lib/utils/subscription-check';

export async function POST(request: NextRequest) {
  try {
    const { experienceLevel } = await request.json();

    if (!experienceLevel) {
      return NextResponse.json(
        { error: 'Experience level is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // SECURITY CHECK: Verify user has access to interview prep
    const accessCheck = await canAccessInterviews(user.id);
    if (!accessCheck.canAccess) {
      return NextResponse.json(
        {
          error: 'Access denied',
          message: accessCheck.reason,
          requiresUpgrade: true,
        },
        { status: 403 }
      );
    }

    // Create new interview session
    const { data: session, error: sessionError } = await supabase
      .from('interview_sessions')
      .insert({
        user_id: user.id,
        experience_level: experienceLevel,
        current_stage: 'stage_1_mcq',
        status: 'in_progress',
        stage_scores: {},
        stage_start_times: {
          stage_1: new Date().toISOString(),
        },
        stage_completion_times: {},
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (sessionError) {
      console.error('Error creating session:', sessionError);
      return NextResponse.json(
        { error: 'Failed to create interview session' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      sessionId: session.id,
      experienceLevel: session.experience_level,
      currentStage: session.current_stage,
    });
  } catch (error: any) {
    console.error('Start interview API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
