-- Interview Auto-Save and Draft Storage Migration
-- Adds support for session persistence and auto-saving progress

-- =====================================================
-- 1. ADD DRAFT COLUMNS TO MCQ ANSWERS
-- =====================================================

-- Allow MCQ answers to be saved as drafts
ALTER TABLE interview_mcq_answers
  ADD COLUMN is_draft BOOLEAN DEFAULT false,
  ADD COLUMN last_saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create index for faster draft queries
CREATE INDEX idx_mcq_answers_draft ON interview_mcq_answers(session_id, is_draft);

-- Update unique constraint to allow drafts
ALTER TABLE interview_mcq_answers
  DROP CONSTRAINT IF EXISTS interview_mcq_answers_session_id_question_id_key;

-- Add new constraint that allows multiple drafts but only one final answer
CREATE UNIQUE INDEX interview_mcq_answers_final_unique
  ON interview_mcq_answers(session_id, question_id)
  WHERE is_draft = false;

-- =====================================================
-- 2. ADD DRAFT COLUMNS TO CODING SUBMISSIONS
-- =====================================================

ALTER TABLE interview_coding_submissions
  ADD COLUMN is_draft BOOLEAN DEFAULT false,
  ADD COLUMN last_saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ADD COLUMN draft_code TEXT; -- Stores in-progress code

-- Create index for drafts
CREATE INDEX idx_coding_submissions_draft ON interview_coding_submissions(session_id, is_draft);

-- Update unique constraint
ALTER TABLE interview_coding_submissions
  DROP CONSTRAINT IF EXISTS interview_coding_submissions_session_id_challenge_id_key;

CREATE UNIQUE INDEX interview_coding_submissions_final_unique
  ON interview_coding_submissions(session_id, challenge_id)
  WHERE is_draft = false;

-- =====================================================
-- 3. ADD DRAFT COLUMNS TO STAGE RESPONSES
-- =====================================================

ALTER TABLE interview_stage_responses
  ADD COLUMN is_draft BOOLEAN DEFAULT false,
  ADD COLUMN last_saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create composite index for session + stage + draft status
CREATE INDEX idx_stage_responses_session_draft
  ON interview_stage_responses(session_id, stage, is_draft);

-- =====================================================
-- 4. ADD SESSION RECOVERY METADATA
-- =====================================================

ALTER TABLE interview_sessions
  ADD COLUMN current_question_index INTEGER DEFAULT 0,
  ADD COLUMN last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ADD COLUMN stage_draft_data JSONB DEFAULT '{}', -- Stores UI state (timer, transcript, etc.)
  ADD COLUMN has_unsaved_progress BOOLEAN DEFAULT false;

-- Index for finding abandoned sessions
CREATE INDEX idx_sessions_last_activity
  ON interview_sessions(user_id, last_activity_at)
  WHERE status = 'in_progress';

-- =====================================================
-- 5. UPDATE RLS POLICIES FOR DRAFTS
-- =====================================================

-- Allow users to update their own draft MCQ answers
CREATE POLICY "Users can update own draft MCQ answers"
  ON interview_mcq_answers FOR UPDATE
  USING (
    is_draft = true AND
    EXISTS (
      SELECT 1 FROM interview_sessions
      WHERE interview_sessions.id = interview_mcq_answers.session_id
      AND interview_sessions.user_id = auth.uid()
    )
  );

-- Allow users to delete their own draft answers
CREATE POLICY "Users can delete own draft MCQ answers"
  ON interview_mcq_answers FOR DELETE
  USING (
    is_draft = true AND
    EXISTS (
      SELECT 1 FROM interview_sessions
      WHERE interview_sessions.id = interview_mcq_answers.session_id
      AND interview_sessions.user_id = auth.uid()
    )
  );

-- Same for coding submissions
CREATE POLICY "Users can update own draft coding submissions"
  ON interview_coding_submissions FOR UPDATE
  USING (
    is_draft = true AND
    EXISTS (
      SELECT 1 FROM interview_sessions
      WHERE interview_sessions.id = interview_coding_submissions.session_id
      AND interview_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own draft coding submissions"
  ON interview_coding_submissions FOR DELETE
  USING (
    is_draft = true AND
    EXISTS (
      SELECT 1 FROM interview_sessions
      WHERE interview_sessions.id = interview_coding_submissions.session_id
      AND interview_sessions.user_id = auth.uid()
    )
  );

-- Same for stage responses
CREATE POLICY "Users can update own draft stage responses"
  ON interview_stage_responses FOR UPDATE
  USING (
    is_draft = true AND
    EXISTS (
      SELECT 1 FROM interview_sessions
      WHERE interview_sessions.id = interview_stage_responses.session_id
      AND interview_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own draft stage responses"
  ON interview_stage_responses FOR DELETE
  USING (
    is_draft = true AND
    EXISTS (
      SELECT 1 FROM interview_sessions
      WHERE interview_sessions.id = interview_stage_responses.session_id
      AND interview_sessions.user_id = auth.uid()
    )
  );

-- =====================================================
-- 6. CREATE HELPER FUNCTIONS
-- =====================================================

-- Function to update last_activity timestamp automatically
CREATE OR REPLACE FUNCTION update_session_activity()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE interview_sessions
  SET
    last_activity_at = NOW(),
    has_unsaved_progress = true
  WHERE id = NEW.session_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to track activity
CREATE TRIGGER track_mcq_activity
  AFTER INSERT OR UPDATE ON interview_mcq_answers
  FOR EACH ROW
  WHEN (NEW.is_draft = true)
  EXECUTE FUNCTION update_session_activity();

CREATE TRIGGER track_coding_activity
  AFTER INSERT OR UPDATE ON interview_coding_submissions
  FOR EACH ROW
  WHEN (NEW.is_draft = true)
  EXECUTE FUNCTION update_session_activity();

CREATE TRIGGER track_response_activity
  AFTER INSERT OR UPDATE ON interview_stage_responses
  FOR EACH ROW
  WHEN (NEW.is_draft = true)
  EXECUTE FUNCTION update_session_activity();

-- Function to get or create draft response
CREATE OR REPLACE FUNCTION get_or_create_draft_response(
  p_session_id UUID,
  p_stage interview_stage,
  p_question_id UUID
)
RETURNS UUID AS $$
DECLARE
  v_response_id UUID;
BEGIN
  -- Try to find existing draft
  SELECT id INTO v_response_id
  FROM interview_stage_responses
  WHERE session_id = p_session_id
    AND stage = p_stage
    AND question_id = p_question_id
    AND is_draft = true
  LIMIT 1;

  -- Create new draft if not found
  IF v_response_id IS NULL THEN
    INSERT INTO interview_stage_responses (
      session_id,
      stage,
      question_id,
      is_draft,
      response_text
    ) VALUES (
      p_session_id,
      p_stage,
      p_question_id,
      true,
      ''
    )
    RETURNING id INTO v_response_id;
  END IF;

  RETURN v_response_id;
END;
$$ LANGUAGE plpgsql;

-- Function to convert draft to final submission
CREATE OR REPLACE FUNCTION finalize_draft_responses(
  p_session_id UUID,
  p_stage interview_stage
)
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  -- Update all draft responses for this stage to final
  UPDATE interview_stage_responses
  SET is_draft = false
  WHERE session_id = p_session_id
    AND stage = p_stage
    AND is_draft = true;

  GET DIAGNOSTICS v_count = ROW_COUNT;

  -- Mark session as having no unsaved progress
  UPDATE interview_sessions
  SET has_unsaved_progress = false
  WHERE id = p_session_id;

  RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up old drafts (can be run periodically)
CREATE OR REPLACE FUNCTION cleanup_old_drafts(p_days_old INTEGER DEFAULT 7)
RETURNS INTEGER AS $$
DECLARE
  v_total INTEGER := 0;
  v_count INTEGER;
BEGIN
  -- Delete old MCQ drafts
  DELETE FROM interview_mcq_answers
  WHERE is_draft = true
    AND last_saved_at < NOW() - (p_days_old || ' days')::INTERVAL;
  GET DIAGNOSTICS v_count = ROW_COUNT;
  v_total := v_total + v_count;

  -- Delete old coding drafts
  DELETE FROM interview_coding_submissions
  WHERE is_draft = true
    AND last_saved_at < NOW() - (p_days_old || ' days')::INTERVAL;
  GET DIAGNOSTICS v_count = ROW_COUNT;
  v_total := v_total + v_count;

  -- Delete old stage response drafts
  DELETE FROM interview_stage_responses
  WHERE is_draft = true
    AND last_saved_at < NOW() - (p_days_old || ' days')::INTERVAL;
  GET DIAGNOSTICS v_count = ROW_COUNT;
  v_total := v_total + v_count;

  RETURN v_total;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 7. RELAX STAGE PROGRESSION CONSTRAINT
-- =====================================================

-- Drop the strict progression constraint to allow saving without completing
ALTER TABLE interview_sessions
  DROP CONSTRAINT IF EXISTS valid_stage_progression;

-- Add more lenient constraint that allows current_stage to be set
-- even if previous stage isn't complete (for draft/recovery scenarios)
ALTER TABLE interview_sessions
  ADD CONSTRAINT valid_stage_enum
  CHECK (current_stage IN (
    'stage_1_mcq',
    'stage_2_voice_qa',
    'stage_3_coding',
    'stage_4_text_qa',
    'stage_5_discussion',
    'stage_6_results'
  ));

-- =====================================================
-- 8. ADD INDEXES FOR PERFORMANCE
-- =====================================================

-- Composite index for quick session + draft lookups
CREATE INDEX idx_mcq_session_draft_question
  ON interview_mcq_answers(session_id, question_id, is_draft);

CREATE INDEX idx_coding_session_draft_challenge
  ON interview_coding_submissions(session_id, challenge_id, is_draft);

CREATE INDEX idx_stage_session_draft_question
  ON interview_stage_responses(session_id, question_id, is_draft);

-- Index for last_saved_at to optimize cleanup queries
CREATE INDEX idx_mcq_answers_last_saved
  ON interview_mcq_answers(last_saved_at)
  WHERE is_draft = true;

CREATE INDEX idx_coding_submissions_last_saved
  ON interview_coding_submissions(last_saved_at)
  WHERE is_draft = true;

CREATE INDEX idx_stage_responses_last_saved
  ON interview_stage_responses(last_saved_at)
  WHERE is_draft = true;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

COMMENT ON COLUMN interview_mcq_answers.is_draft IS 'True for auto-saved drafts, false for final submissions';
COMMENT ON COLUMN interview_coding_submissions.draft_code IS 'Stores in-progress code for auto-save';
COMMENT ON COLUMN interview_sessions.current_question_index IS 'Tracks which question user is currently on for recovery';
COMMENT ON COLUMN interview_sessions.stage_draft_data IS 'Stores UI state like timer, voice transcript, etc.';
COMMENT ON COLUMN interview_sessions.has_unsaved_progress IS 'Flag to show "Resume Interview" prompt';
