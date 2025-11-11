import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyInterviewAPIAccess } from '@/lib/utils/api-access-checks';

/**
 * Auto-save endpoint for interview progress
 * Supports saving drafts for all stage types
 */
export async function POST(request: NextRequest) {
  try {
    // SECURITY CHECK: Verify user has access to interview prep
    const { user, error: accessError } = await verifyInterviewAPIAccess();
    if (accessError) return accessError;

    const supabase = await createClient();

    const body = await request.json();
    const {
      sessionId,
      stage,
      data,
      currentQuestionIndex,
      uiState,
    } = body as {
      sessionId: string;
      stage: string;
      data: any;
      currentQuestionIndex?: number;
      uiState?: any;
    };

    if (!sessionId || !stage) {
      return NextResponse.json(
        { error: 'Missing sessionId or stage' },
        { status: 400 }
      );
    }

    // Verify session belongs to user
    const { data: session, error: sessionError } = await supabase
      .from('interview_sessions')
      .select('id, user_id, current_stage')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Handle different stage types
    switch (stage) {
      case 'stage_1_mcq':
        await saveMCQDraft(supabase, sessionId, data);
        break;

      case 'stage_2_voice_qa':
        await saveVoiceQADraft(supabase, sessionId, data);
        break;

      case 'stage_3_coding':
        await saveCodingDraft(supabase, sessionId, data);
        break;

      case 'stage_4_text_qa':
        await saveTextQADraft(supabase, sessionId, data);
        break;

      case 'stage_5_discussion':
        await saveDiscussionDraft(supabase, sessionId, data);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid stage' },
          { status: 400 }
        );
    }

    // Update session metadata
    const updates: any = {
      last_activity_at: new Date().toISOString(),
      has_unsaved_progress: true,
    };

    if (currentQuestionIndex !== undefined) {
      updates.current_question_index = currentQuestionIndex;
    }

    if (uiState) {
      // Merge new UI state with existing
      const { data: currentSession } = await supabase
        .from('interview_sessions')
        .select('stage_draft_data')
        .eq('id', sessionId)
        .single();

      updates.stage_draft_data = {
        ...(currentSession?.stage_draft_data || {}),
        [stage]: uiState,
      };
    }

    await supabase
      .from('interview_sessions')
      .update(updates)
      .eq('id', sessionId);

    return NextResponse.json({
      success: true,
      savedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Auto-save error:', error);
    return NextResponse.json(
      { error: error.message || 'Auto-save failed' },
      { status: 500 }
    );
  }
}

/**
 * Helper functions for saving drafts by stage type
 */

async function saveMCQDraft(supabase: any, sessionId: string, data: any) {
  const { answers } = data; // { questionId: selectedOption, ... }

  if (!answers || typeof answers !== 'object') {
    throw new Error('Invalid MCQ data format');
  }

  // Save or update each answer as draft
  for (const [questionId, selectedOption] of Object.entries(answers)) {
    if (!selectedOption) continue;

    // Check if draft exists
    const { data: existing } = await supabase
      .from('interview_mcq_answers')
      .select('id')
      .eq('session_id', sessionId)
      .eq('question_id', questionId)
      .eq('is_draft', true)
      .maybeSingle();

    if (existing) {
      // Update existing draft
      await supabase
        .from('interview_mcq_answers')
        .update({
          selected_option: selectedOption,
          last_saved_at: new Date().toISOString(),
        })
        .eq('id', existing.id);
    } else {
      // Create new draft
      await supabase
        .from('interview_mcq_answers')
        .insert({
          session_id: sessionId,
          question_id: questionId,
          selected_option: selectedOption,
          is_draft: true,
          is_correct: false, // Will be determined on final submit
          last_saved_at: new Date().toISOString(),
        });
    }
  }
}

async function saveVoiceQADraft(supabase: any, sessionId: string, data: any) {
  const { questionId, response } = data;

  if (!questionId || !response) {
    throw new Error('Invalid Voice QA data format');
  }

  // Check if draft exists
  const { data: existing } = await supabase
    .from('interview_stage_responses')
    .select('id')
    .eq('session_id', sessionId)
    .eq('stage', 'stage_2_voice_qa')
    .eq('question_id', questionId)
    .eq('is_draft', true)
    .maybeSingle();

  if (existing) {
    // Update existing draft
    await supabase
      .from('interview_stage_responses')
      .update({
        response_text: response,
        last_saved_at: new Date().toISOString(),
      })
      .eq('id', existing.id);
  } else {
    // Create new draft
    await supabase
      .from('interview_stage_responses')
      .insert({
        session_id: sessionId,
        stage: 'stage_2_voice_qa',
        question_id: questionId,
        response_text: response,
        is_draft: true,
        last_saved_at: new Date().toISOString(),
      });
  }
}

async function saveCodingDraft(supabase: any, sessionId: string, data: any) {
  const { challengeId, code } = data;

  if (!challengeId || !code) {
    throw new Error('Invalid coding data format');
  }

  // Check if draft exists
  const { data: existing } = await supabase
    .from('interview_coding_submissions')
    .select('id')
    .eq('session_id', sessionId)
    .eq('challenge_id', challengeId)
    .eq('is_draft', true)
    .maybeSingle();

  if (existing) {
    // Update existing draft
    await supabase
      .from('interview_coding_submissions')
      .update({
        draft_code: code,
        last_saved_at: new Date().toISOString(),
      })
      .eq('id', existing.id);
  } else {
    // Create new draft
    await supabase
      .from('interview_coding_submissions')
      .insert({
        session_id: sessionId,
        challenge_id: challengeId,
        submitted_code: '', // Empty until final submit
        draft_code: code,
        tests_total: 0,
        is_draft: true,
        last_saved_at: new Date().toISOString(),
      });
  }
}

async function saveTextQADraft(supabase: any, sessionId: string, data: any) {
  const { responses } = data; // Array of { questionId, response }

  if (!Array.isArray(responses)) {
    throw new Error('Invalid Text QA data format');
  }

  for (const item of responses) {
    const { questionId, response } = item;
    if (!questionId || !response) continue;

    // Check if draft exists
    const { data: existing } = await supabase
      .from('interview_stage_responses')
      .select('id')
      .eq('session_id', sessionId)
      .eq('stage', 'stage_4_text_qa')
      .eq('question_id', questionId)
      .eq('is_draft', true)
      .maybeSingle();

    if (existing) {
      // Update existing draft
      await supabase
        .from('interview_stage_responses')
        .update({
          response_text: response,
          last_saved_at: new Date().toISOString(),
        })
        .eq('id', existing.id);
    } else {
      // Create new draft
      await supabase
        .from('interview_stage_responses')
        .insert({
          session_id: sessionId,
          stage: 'stage_4_text_qa',
          question_id: questionId,
          response_text: response,
          is_draft: true,
          last_saved_at: new Date().toISOString(),
        });
    }
  }
}

async function saveDiscussionDraft(supabase: any, sessionId: string, data: any) {
  const { responses } = data; // Array of { questionId, response }

  if (!Array.isArray(responses)) {
    throw new Error('Invalid Discussion data format');
  }

  for (const item of responses) {
    const { questionId, response } = item;
    if (!questionId || !response) continue;

    // Check if draft exists
    const { data: existing } = await supabase
      .from('interview_stage_responses')
      .select('id')
      .eq('session_id', sessionId)
      .eq('stage', 'stage_5_discussion')
      .eq('question_id', questionId)
      .eq('is_draft', true)
      .maybeSingle();

    if (existing) {
      // Update existing draft
      await supabase
        .from('interview_stage_responses')
        .update({
          response_text: response,
          last_saved_at: new Date().toISOString(),
        })
        .eq('id', existing.id);
    } else {
      // Create new draft
      await supabase
        .from('interview_stage_responses')
        .insert({
          session_id: sessionId,
          stage: 'stage_5_discussion',
          question_id: questionId,
          response_text: response,
          is_draft: true,
          last_saved_at: new Date().toISOString(),
        });
    }
  }
}
