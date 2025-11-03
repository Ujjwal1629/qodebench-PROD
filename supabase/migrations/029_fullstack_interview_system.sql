-- Full-Stack Web Development Interview System Migration
-- 6-Stage Interview Process: MCQ, Voice Q&A, Coding, Text Q&A, Discussion, Results
-- Three Experience Levels: Fresher, Junior, Senior

-- =====================================================
-- 1. CREATE NEW ENUMS
-- =====================================================

-- Experience level for candidates
CREATE TYPE experience_level AS ENUM ('fresher', 'junior', 'senior');

-- Interview stage tracking
CREATE TYPE interview_stage AS ENUM (
  'stage_1_mcq',
  'stage_2_voice_qa',
  'stage_3_coding',
  'stage_4_text_qa',
  'stage_5_discussion',
  'stage_6_results'
);

-- Programming languages for coding stage
CREATE TYPE coding_language AS ENUM ('javascript', 'typescript', 'react');

-- MCQ topic categories
CREATE TYPE mcq_category AS ENUM (
  'html_css',
  'javascript',
  'react',
  'nodejs',
  'apis',
  'databases',
  'system_design',
  'security',
  'performance'
);

-- =====================================================
-- 2. MODIFY INTERVIEW_SESSIONS TABLE
-- =====================================================

-- Add new columns to existing interview_sessions table
ALTER TABLE interview_sessions
  ADD COLUMN experience_level experience_level NOT NULL DEFAULT 'junior',
  ADD COLUMN current_stage interview_stage DEFAULT 'stage_1_mcq',
  ADD COLUMN stage_scores JSONB DEFAULT '{}',
  ADD COLUMN selected_language coding_language,
  ADD COLUMN stage_start_times JSONB DEFAULT '{}',
  ADD COLUMN stage_completion_times JSONB DEFAULT '{}',
  ADD COLUMN final_report JSONB,
  ADD COLUMN pdf_generated BOOLEAN DEFAULT false,
  ADD COLUMN pdf_url TEXT;

-- Update existing columns to be nullable for backward compatibility
ALTER TABLE interview_sessions
  ALTER COLUMN interview_type DROP NOT NULL,
  ALTER COLUMN company DROP NOT NULL;

-- Add check constraint for stage progression
ALTER TABLE interview_sessions
  ADD CONSTRAINT valid_stage_progression
  CHECK (
    (current_stage = 'stage_1_mcq') OR
    (current_stage = 'stage_2_voice_qa' AND stage_scores->>'stage_1' IS NOT NULL) OR
    (current_stage = 'stage_3_coding' AND stage_scores->>'stage_2' IS NOT NULL) OR
    (current_stage = 'stage_4_text_qa' AND stage_scores->>'stage_3' IS NOT NULL) OR
    (current_stage = 'stage_5_discussion' AND stage_scores->>'stage_4' IS NOT NULL) OR
    (current_stage = 'stage_6_results' AND stage_scores->>'stage_5' IS NOT NULL)
  );

-- =====================================================
-- 3. CREATE MCQ QUESTIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS interview_mcq_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category mcq_category NOT NULL,
  experience_level experience_level NOT NULL,

  -- Question content
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_option CHAR(1) NOT NULL CHECK (correct_option IN ('a', 'b', 'c', 'd')),

  -- Explanation
  explanation TEXT,

  -- Metadata
  difficulty_score INTEGER DEFAULT 5 CHECK (difficulty_score BETWEEN 1 AND 10),
  tags TEXT[],
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. CREATE MCQ ANSWERS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS interview_mcq_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES interview_mcq_questions(id),

  selected_option CHAR(1) NOT NULL CHECK (selected_option IN ('a', 'b', 'c', 'd')),
  is_correct BOOLEAN NOT NULL,
  time_taken_seconds INTEGER,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(session_id, question_id)
);

-- =====================================================
-- 5. CREATE CODING CHALLENGES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS interview_coding_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_level experience_level NOT NULL,
  language coding_language NOT NULL,

  -- Challenge content
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  starter_code TEXT,

  -- Test cases
  test_cases JSONB NOT NULL, -- [{input, expected_output, is_hidden}, ...]
  time_limit_minutes INTEGER DEFAULT 30,

  -- Evaluation criteria
  difficulty_score INTEGER DEFAULT 5 CHECK (difficulty_score BETWEEN 1 AND 10),
  test_case_weight DECIMAL(3,2) DEFAULT 0.70, -- 70% test cases, 30% code quality
  code_quality_weight DECIMAL(3,2) DEFAULT 0.30,

  -- Metadata
  tags TEXT[],
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. CREATE CODING SUBMISSIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS interview_coding_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES interview_coding_challenges(id),

  -- Submission content
  submitted_code TEXT NOT NULL,
  language coding_language NOT NULL,

  -- Test results
  tests_passed INTEGER DEFAULT 0,
  tests_total INTEGER NOT NULL,
  test_results JSONB, -- Detailed results per test case

  -- AI Code Quality Evaluation
  code_quality_score DECIMAL(3,1), -- 0.0 to 10.0
  ai_feedback JSONB, -- {strengths, improvements, suggestions}

  -- Final score
  final_score DECIMAL(3,1), -- Weighted combination of tests + quality

  -- Timing
  time_taken_seconds INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(session_id, challenge_id)
);

-- =====================================================
-- 7. CREATE VOICE Q&A QUESTIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS interview_voice_qa_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_level experience_level NOT NULL,

  question_text TEXT NOT NULL,
  question_type VARCHAR(50), -- 'behavioral', 'situational', 'technical'

  -- Evaluation criteria
  expected_points TEXT[], -- Key points to cover
  evaluation_rubric JSONB, -- Detailed rubric for AI evaluation

  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 8. CREATE TEXT Q&A QUESTIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS interview_text_qa_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_level experience_level NOT NULL,

  question_text TEXT NOT NULL,
  category VARCHAR(100), -- e.g., 'react', 'javascript', 'architecture'

  -- Evaluation
  expected_answer TEXT,
  key_concepts TEXT[],
  evaluation_rubric JSONB,

  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 9. CREATE DISCUSSION QUESTIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS interview_discussion_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_level experience_level NOT NULL,

  question_text TEXT NOT NULL,
  scenario TEXT, -- Optional scenario description

  -- Evaluation criteria
  evaluation_criteria JSONB, -- {architecture, scalability, trade-offs, etc.}
  sample_approach TEXT,

  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 10. CREATE STAGE RESPONSES TABLE (Generic for stages 2, 4, 5)
-- =====================================================

CREATE TABLE IF NOT EXISTS interview_stage_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
  stage interview_stage NOT NULL,
  question_id UUID NOT NULL, -- References different tables based on stage

  -- Response content
  response_text TEXT,
  response_audio_url TEXT,
  is_voice_response BOOLEAN DEFAULT false,

  -- AI Evaluation
  ai_score DECIMAL(3,1), -- 0.0 to 10.0
  ai_evaluation JSONB, -- {score, strengths, weaknesses, suggestions}

  -- Timing
  time_taken_seconds INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 11. CREATE INDEXES
-- =====================================================

-- MCQ Questions
CREATE INDEX idx_mcq_questions_level_category ON interview_mcq_questions(experience_level, category);
CREATE INDEX idx_mcq_questions_active ON interview_mcq_questions(is_active) WHERE is_active = true;

-- MCQ Answers
CREATE INDEX idx_mcq_answers_session ON interview_mcq_answers(session_id);

-- Coding Challenges
CREATE INDEX idx_coding_challenges_level_lang ON interview_coding_challenges(experience_level, language);
CREATE INDEX idx_coding_challenges_active ON interview_coding_challenges(is_active) WHERE is_active = true;

-- Coding Submissions
CREATE INDEX idx_coding_submissions_session ON interview_coding_submissions(session_id);

-- Voice Q&A Questions
CREATE INDEX idx_voice_qa_level ON interview_voice_qa_questions(experience_level);
CREATE INDEX idx_voice_qa_active ON interview_voice_qa_questions(is_active) WHERE is_active = true;

-- Text Q&A Questions
CREATE INDEX idx_text_qa_level ON interview_text_qa_questions(experience_level);
CREATE INDEX idx_text_qa_active ON interview_text_qa_questions(is_active) WHERE is_active = true;

-- Discussion Questions
CREATE INDEX idx_discussion_level ON interview_discussion_questions(experience_level);
CREATE INDEX idx_discussion_active ON interview_discussion_questions(is_active) WHERE is_active = true;

-- Stage Responses
CREATE INDEX idx_stage_responses_session ON interview_stage_responses(session_id);
CREATE INDEX idx_stage_responses_stage ON interview_stage_responses(stage);

-- Interview Sessions - New indexes
CREATE INDEX idx_interview_sessions_level ON interview_sessions(experience_level);
CREATE INDEX idx_interview_sessions_stage ON interview_sessions(current_stage);

-- =====================================================
-- 12. ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS on new tables
ALTER TABLE interview_mcq_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_mcq_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_coding_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_coding_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_voice_qa_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_text_qa_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_discussion_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_stage_responses ENABLE ROW LEVEL SECURITY;

-- MCQ Questions: All authenticated users can read active questions
CREATE POLICY "Anyone can view active MCQ questions"
  ON interview_mcq_questions FOR SELECT
  USING (is_active = true);

-- MCQ Answers: Users can only access their own answers
CREATE POLICY "Users can view own MCQ answers"
  ON interview_mcq_answers FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM interview_sessions
    WHERE interview_sessions.id = interview_mcq_answers.session_id
    AND interview_sessions.user_id = auth.uid()
  ));

CREATE POLICY "Users can create own MCQ answers"
  ON interview_mcq_answers FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM interview_sessions
    WHERE interview_sessions.id = interview_mcq_answers.session_id
    AND interview_sessions.user_id = auth.uid()
  ));

-- Coding Challenges: All authenticated users can read active challenges
CREATE POLICY "Anyone can view active coding challenges"
  ON interview_coding_challenges FOR SELECT
  USING (is_active = true);

-- Coding Submissions: Users can only access their own submissions
CREATE POLICY "Users can view own coding submissions"
  ON interview_coding_submissions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM interview_sessions
    WHERE interview_sessions.id = interview_coding_submissions.session_id
    AND interview_sessions.user_id = auth.uid()
  ));

CREATE POLICY "Users can create own coding submissions"
  ON interview_coding_submissions FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM interview_sessions
    WHERE interview_sessions.id = interview_coding_submissions.session_id
    AND interview_sessions.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own coding submissions"
  ON interview_coding_submissions FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM interview_sessions
    WHERE interview_sessions.id = interview_coding_submissions.session_id
    AND interview_sessions.user_id = auth.uid()
  ));

-- Voice Q&A Questions: All authenticated users can read
CREATE POLICY "Anyone can view active voice QA questions"
  ON interview_voice_qa_questions FOR SELECT
  USING (is_active = true);

-- Text Q&A Questions: All authenticated users can read
CREATE POLICY "Anyone can view active text QA questions"
  ON interview_text_qa_questions FOR SELECT
  USING (is_active = true);

-- Discussion Questions: All authenticated users can read
CREATE POLICY "Anyone can view active discussion questions"
  ON interview_discussion_questions FOR SELECT
  USING (is_active = true);

-- Stage Responses: Users can only access their own responses
CREATE POLICY "Users can view own stage responses"
  ON interview_stage_responses FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM interview_sessions
    WHERE interview_sessions.id = interview_stage_responses.session_id
    AND interview_sessions.user_id = auth.uid()
  ));

CREATE POLICY "Users can create own stage responses"
  ON interview_stage_responses FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM interview_sessions
    WHERE interview_sessions.id = interview_stage_responses.session_id
    AND interview_sessions.user_id = auth.uid()
  ));

-- =====================================================
-- 13. CREATE FUNCTIONS
-- =====================================================

-- Function to automatically update stage when all questions are answered
CREATE OR REPLACE FUNCTION check_stage_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- This function can be expanded to auto-advance stages
  -- For now, we'll handle stage progression in application logic
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate overall interview score
CREATE OR REPLACE FUNCTION calculate_overall_score(session_id UUID)
RETURNS DECIMAL AS $$
DECLARE
  overall_score DECIMAL(3,1);
  stage_scores JSONB;
BEGIN
  SELECT interview_sessions.stage_scores INTO stage_scores
  FROM interview_sessions
  WHERE interview_sessions.id = session_id;

  -- Weighted average: MCQ (15%), Voice (15%), Coding (35%), Text QA (15%), Discussion (20%)
  overall_score := (
    COALESCE((stage_scores->>'stage_1')::DECIMAL, 0) * 0.15 +
    COALESCE((stage_scores->>'stage_2')::DECIMAL, 0) * 0.15 +
    COALESCE((stage_scores->>'stage_3')::DECIMAL, 0) * 0.35 +
    COALESCE((stage_scores->>'stage_4')::DECIMAL, 0) * 0.15 +
    COALESCE((stage_scores->>'stage_5')::DECIMAL, 0) * 0.20
  );

  RETURN ROUND(overall_score, 1);
END;
$$ LANGUAGE plpgsql;

-- Function to get random MCQ questions for a session
CREATE OR REPLACE FUNCTION get_random_mcq_questions(
  p_experience_level experience_level,
  p_limit INTEGER DEFAULT 10
)
RETURNS SETOF interview_mcq_questions AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM interview_mcq_questions
  WHERE experience_level = p_experience_level
    AND is_active = true
  ORDER BY RANDOM()
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 14. CREATE TRIGGERS
-- =====================================================

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_mcq_questions_updated_at
  BEFORE UPDATE ON interview_mcq_questions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coding_challenges_updated_at
  BEFORE UPDATE ON interview_coding_challenges
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

COMMENT ON TABLE interview_mcq_questions IS '6-Stage Interview: Stage 1 - MCQ question bank';
COMMENT ON TABLE interview_mcq_answers IS '6-Stage Interview: Stage 1 - User MCQ responses';
COMMENT ON TABLE interview_coding_challenges IS '6-Stage Interview: Stage 3 - Coding challenge bank';
COMMENT ON TABLE interview_coding_submissions IS '6-Stage Interview: Stage 3 - User code submissions';
COMMENT ON TABLE interview_voice_qa_questions IS '6-Stage Interview: Stage 2 - Voice Q&A question bank';
COMMENT ON TABLE interview_text_qa_questions IS '6-Stage Interview: Stage 4 - Text Q&A question bank';
COMMENT ON TABLE interview_discussion_questions IS '6-Stage Interview: Stage 5 - System design discussion question bank';
COMMENT ON TABLE interview_stage_responses IS '6-Stage Interview: Stages 2, 4, 5 - Generic response storage';
