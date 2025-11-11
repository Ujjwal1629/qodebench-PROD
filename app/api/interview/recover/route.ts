import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyInterviewAPIAccess } from '@/lib/utils/api-access-checks';

/**
 * Recovery endpoint to restore draft progress
 * Returns all saved drafts for a session
 */
export async function POST(request: NextRequest) {
  try {
    // SECURITY CHECK: Verify user has access to interview prep
    const { user, error: accessError } = await verifyInterviewAPIAccess();
    if (accessError) return accessError;

    const supabase = await createClient();

    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing sessionId' },
        { status: 400 }
      );
    }

    // Verify session belongs to user
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

    // Check if session is still in progress
    if (session.status === 'completed' || session.status === 'abandoned') {
      return NextResponse.json({
        canRecover: false,
        reason: `Session is already ${session.status}`,
      });
    }

    // Fetch all draft data based on current stage
    const draftData: any = {
      session: {
        currentStage: session.current_stage,
        currentQuestionIndex: session.current_question_index || 0,
        uiState: session.stage_draft_data || {},
        lastActivity: session.last_activity_at,
        stageScores: session.stage_scores || {},
      },
      drafts: {},
    };

    // Fetch MCQ drafts
    const { data: mcqDrafts } = await supabase
      .from('interview_mcq_answers')
      .select('question_id, selected_option')
      .eq('session_id', sessionId)
      .eq('is_draft', true);

    if (mcqDrafts && mcqDrafts.length > 0) {
      draftData.drafts.mcq = mcqDrafts.reduce((acc: any, draft: any) => {
        acc[draft.question_id] = draft.selected_option;
        return acc;
      }, {});
    }

    // Fetch Voice QA drafts
    const { data: voiceQADrafts } = await supabase
      .from('interview_stage_responses')
      .select('question_id, response_text')
      .eq('session_id', sessionId)
      .eq('stage', 'stage_2_voice_qa')
      .eq('is_draft', true);

    if (voiceQADrafts && voiceQADrafts.length > 0) {
      draftData.drafts.voiceQA = voiceQADrafts;
    }

    // Fetch Coding draft
    const { data: codingDraft } = await supabase
      .from('interview_coding_submissions')
      .select('challenge_id, draft_code')
      .eq('session_id', sessionId)
      .eq('is_draft', true)
      .maybeSingle();

    if (codingDraft) {
      draftData.drafts.coding = {
        challengeId: codingDraft.challenge_id,
        code: codingDraft.draft_code || '',
      };
    }

    // Fetch Text QA drafts
    const { data: textQADrafts } = await supabase
      .from('interview_stage_responses')
      .select('question_id, response_text')
      .eq('session_id', sessionId)
      .eq('stage', 'stage_4_text_qa')
      .eq('is_draft', true);

    if (textQADrafts && textQADrafts.length > 0) {
      draftData.drafts.textQA = textQADrafts;
    }

    // Fetch Discussion drafts
    const { data: discussionDrafts } = await supabase
      .from('interview_stage_responses')
      .select('question_id, response_text')
      .eq('session_id', sessionId)
      .eq('stage', 'stage_5_discussion')
      .eq('is_draft', true);

    if (discussionDrafts && discussionDrafts.length > 0) {
      draftData.drafts.discussion = discussionDrafts;
    }

    // Check if there's any saved progress
    // Show recovery if:
    // 1. They have drafts OR
    // 2. They have stage scores (completed at least one stage) OR
    // 3. They're not on the first stage AND session is in progress OR
    // 4. They have a question index > 0
    const hasDrafts = Object.keys(draftData.drafts).length > 0;
    const hasCompletedStages =
      session.stage_scores &&
      Object.keys(session.stage_scores).length > 0;
    const isNotFirstStage = session.current_stage !== 'stage_1_mcq';
    const hasQuestionProgress =
      session.current_question_index && session.current_question_index > 0;

    // More aggressive: Show recovery if on any stage beyond MCQ
    const hasProgress =
      hasDrafts ||
      hasCompletedStages ||
      (isNotFirstStage && session.status === 'in_progress') ||
      hasQuestionProgress;

    // Debug logging
    console.log('[Recovery Check]', {
      sessionId,
      hasDrafts,
      hasCompletedStages,
      isNotFirstStage,
      hasQuestionProgress,
      hasProgress,
      currentStage: session.current_stage,
      stageScores: session.stage_scores,
      status: session.status,
    });

    return NextResponse.json({
      canRecover: hasProgress,
      data: draftData,
      savedAt: session.last_activity_at,
    });
  } catch (error: any) {
    console.error('Recovery error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to recover session' },
      { status: 500 }
    );
  }
}
