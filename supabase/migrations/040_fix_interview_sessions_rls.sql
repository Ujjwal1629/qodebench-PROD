-- Add missing RLS policies for interview_sessions table
-- SECURITY FIX: Prevent unauthorized access to interview sessions

-- Drop existing policies if any (idempotent)
DROP POLICY IF EXISTS "Users can view their own interview sessions" ON interview_sessions;
DROP POLICY IF EXISTS "Users can create own interview sessions" ON interview_sessions;
DROP POLICY IF EXISTS "Users can update own interview sessions" ON interview_sessions;
DROP POLICY IF EXISTS "Users can delete own interview sessions" ON interview_sessions;

-- Create comprehensive RLS policies
CREATE POLICY "Users can view their own interview sessions"
  ON interview_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own interview sessions"
  ON interview_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own interview sessions"
  ON interview_sessions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own interview sessions"
  ON interview_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Verify RLS is enabled (should already be enabled)
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;
