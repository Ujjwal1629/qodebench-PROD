import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyInterviewAPIAccess } from '@/lib/utils/api-access-checks';
import { rateLimiter, getRateLimitIdentifier } from '@/lib/utils/rate-limiter';
import { INPUT_LIMITS } from '@/lib/utils/input-validation';

/**
 * Auto-save endpoint for interview progress
 * Supports saving drafts for all stage types
 *
 * OPTIMIZATIONS:
 * - Batch upsert operations instead of N+1 queries
 * - Rate limiting to prevent abuse
 * - Input validation
 */
export async function POST(request: NextRequest) {
  try {
    // SECURITY CHECK: Verify user has access to interview prep
    const { user, error: accessError } = await verifyInterviewAPIAccess();
    if (accessError) return accessError;

    // Rate limiting
    const rateLimitResult = rateLimiter.checkAndRespond(
      getRateLimitIdentifier(user.id),
      'interview'
    );
    if (rateLimitResult) return rateLimitResult.response;

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

    // Handle different stage types with batch operations
    switch (stage) {
      case 'stage_1_mcq':
        await saveMCQDraftBatch(supabase, sessionId, data);
        break;

      case 'stage_2_voice_qa':
        await saveVoiceQADraft(supabase, sessionId, data);
        break;

      case 'stage_3_coding':
        await saveCodingDraft(supabase, sessionId, data);
        break;

      case 'stage_4_text_qa':
        await saveTextQADraftBatch(supabase, sessionId, data);
        break;

      case 'stage_5_discussion':
        await saveDiscussionDraftBatch(supabase, sessionId, data);
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
      { error: 'Auto-save failed' },
      { status: 500 }
    );
  }
}

/**
 * OPTIMIZED: Save MCQ answers using batch upsert
 * Reduces N+1 queries to 1 batch operation
 */
async function saveMCQDraftBatch(supabase: any, sessionId: string, data: any) {
  const { answers } = data;

  if (!answers || typeof answers !== 'object') {
    throw new Error('Invalid MCQ data format');
  }

  const entries = Object.entries(answers);

  // Validate input size
  if (entries.length > INPUT_LIMITS.answers) {
    throw new Error(`Too many answers. Maximum ${INPUT_LIMITS.answers} allowed`);
  }

  // Filter out empty answers
  const validEntries = entries.filter(([_, selectedOption]) => selectedOption);

  if (validEntries.length === 0) return;

  const now = new Date().toISOString();

  // Prepare batch upsert data
  const upsertData = validEntries.map(([questionId, selectedOption]) => ({
    session_id: sessionId,
    question_id: questionId,
    selected_option: selectedOption,
    is_draft: true,
    is_correct: false,
    last_saved_at: now,
  }));

  // Single batch upsert instead of N queries
  const { error } = await supabase
    .from('interview_mcq_answers')
    .upsert(upsertData, {
      onConflict: 'session_id,question_id,is_draft',
      ignoreDuplicates: false,
    });

  if (error) {
    console.error('MCQ batch upsert error:', error);
    throw new Error('Failed to save MCQ answers');
  }
}

async function saveVoiceQADraft(supabase: any, sessionId: string, data: any) {
  const { questionId, response } = data;

  if (!questionId || !response) {
    throw new Error('Invalid Voice QA data format');
  }

  const now = new Date().toISOString();

  // Single upsert instead of select + insert/update
  const { error } = await supabase
    .from('interview_stage_responses')
    .upsert(
      {
        session_id: sessionId,
        stage: 'stage_2_voice_qa',
        question_id: questionId,
        response_text: response,
        is_draft: true,
        last_saved_at: now,
      },
      {
        onConflict: 'session_id,stage,question_id,is_draft',
        ignoreDuplicates: false,
      }
    );

  if (error) {
    console.error('Voice QA upsert error:', error);
    throw new Error('Failed to save voice QA response');
  }
}

async function saveCodingDraft(supabase: any, sessionId: string, data: any) {
  const { challengeId, code } = data;

  if (!challengeId || !code) {
    throw new Error('Invalid coding data format');
  }

  // Validate code size
  if (code.length > INPUT_LIMITS.code) {
    throw new Error(`Code too large. Maximum ${INPUT_LIMITS.code} characters allowed`);
  }

  const now = new Date().toISOString();

  // Single upsert instead of select + insert/update
  const { error } = await supabase
    .from('interview_coding_submissions')
    .upsert(
      {
        session_id: sessionId,
        challenge_id: challengeId,
        submitted_code: '',
        draft_code: code,
        tests_total: 0,
        is_draft: true,
        last_saved_at: now,
      },
      {
        onConflict: 'session_id,challenge_id,is_draft',
        ignoreDuplicates: false,
      }
    );

  if (error) {
    console.error('Coding upsert error:', error);
    throw new Error('Failed to save coding draft');
  }
}

/**
 * OPTIMIZED: Save Text QA responses using batch upsert
 */
async function saveTextQADraftBatch(supabase: any, sessionId: string, data: any) {
  const { responses } = data;

  if (!Array.isArray(responses)) {
    throw new Error('Invalid Text QA data format');
  }

  // Validate input size
  if (responses.length > INPUT_LIMITS.answers) {
    throw new Error(`Too many responses. Maximum ${INPUT_LIMITS.answers} allowed`);
  }

  const validResponses = responses.filter(
    (item: any) => item.questionId && item.response
  );

  if (validResponses.length === 0) return;

  const now = new Date().toISOString();

  // Prepare batch upsert data
  const upsertData = validResponses.map((item: any) => ({
    session_id: sessionId,
    stage: 'stage_4_text_qa',
    question_id: item.questionId,
    response_text: item.response,
    is_draft: true,
    last_saved_at: now,
  }));

  // Single batch upsert
  const { error } = await supabase
    .from('interview_stage_responses')
    .upsert(upsertData, {
      onConflict: 'session_id,stage,question_id,is_draft',
      ignoreDuplicates: false,
    });

  if (error) {
    console.error('Text QA batch upsert error:', error);
    throw new Error('Failed to save Text QA responses');
  }
}

/**
 * OPTIMIZED: Save Discussion responses using batch upsert
 */
async function saveDiscussionDraftBatch(supabase: any, sessionId: string, data: any) {
  const { responses } = data;

  if (!Array.isArray(responses)) {
    throw new Error('Invalid Discussion data format');
  }

  // Validate input size
  if (responses.length > INPUT_LIMITS.answers) {
    throw new Error(`Too many responses. Maximum ${INPUT_LIMITS.answers} allowed`);
  }

  const validResponses = responses.filter(
    (item: any) => item.questionId && item.response
  );

  if (validResponses.length === 0) return;

  const now = new Date().toISOString();

  // Prepare batch upsert data
  const upsertData = validResponses.map((item: any) => ({
    session_id: sessionId,
    stage: 'stage_5_discussion',
    question_id: item.questionId,
    response_text: item.response,
    is_draft: true,
    last_saved_at: now,
  }));

  // Single batch upsert
  const { error } = await supabase
    .from('interview_stage_responses')
    .upsert(upsertData, {
      onConflict: 'session_id,stage,question_id,is_draft',
      ignoreDuplicates: false,
    });

  if (error) {
    console.error('Discussion batch upsert error:', error);
    throw new Error('Failed to save discussion responses');
  }
}
