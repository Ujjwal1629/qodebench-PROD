-- =====================================================
-- Office Fundamentals Learning Module - Database Schema
-- =====================================================

-- =====================================================
-- 1. QUIZ QUESTIONS TABLE
-- =====================================================

CREATE TABLE office_fundamentals_quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES ai_learning_lessons(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT CHECK (question_type IN ('multiple_choice', 'true_false')) NOT NULL,
  options JSONB NOT NULL, -- {"A": "Answer 1", "B": "Answer 2", ...} or {"true": "True", "false": "False"}
  correct_answer TEXT NOT NULL,
  explanation TEXT NOT NULL,
  code_example TEXT,
  order_index INTEGER NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. QUIZ ATTEMPTS TABLE (Individual Question Attempts)
-- =====================================================

CREATE TABLE office_fundamentals_quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES ai_learning_lessons(id) ON DELETE CASCADE,
  quiz_question_id UUID REFERENCES office_fundamentals_quiz_questions(id) ON DELETE CASCADE,
  user_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  attempt_number INTEGER DEFAULT 1,
  time_taken_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. QUIZ SESSIONS TABLE (Overall Quiz Results)
-- =====================================================

CREATE TABLE office_fundamentals_quiz_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES ai_learning_lessons(id) ON DELETE CASCADE,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  score_percentage INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  time_taken_seconds INTEGER,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 4. INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_office_fundamentals_quiz_questions_lesson ON office_fundamentals_quiz_questions(lesson_id);
CREATE INDEX idx_office_fundamentals_quiz_attempts_user ON office_fundamentals_quiz_attempts(user_id);
CREATE INDEX idx_office_fundamentals_quiz_attempts_lesson ON office_fundamentals_quiz_attempts(lesson_id);
CREATE INDEX idx_office_fundamentals_quiz_sessions_user ON office_fundamentals_quiz_sessions(user_id);
CREATE INDEX idx_office_fundamentals_quiz_sessions_lesson ON office_fundamentals_quiz_sessions(lesson_id);

-- =====================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE office_fundamentals_quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE office_fundamentals_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE office_fundamentals_quiz_sessions ENABLE ROW LEVEL SECURITY;

-- Quiz questions are readable by all authenticated users
CREATE POLICY "Quiz questions are viewable by authenticated users"
  ON office_fundamentals_quiz_questions FOR SELECT
  TO authenticated
  USING (true);

-- Users can only view their own quiz attempts
CREATE POLICY "Users can view own quiz attempts"
  ON office_fundamentals_quiz_attempts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own quiz attempts
CREATE POLICY "Users can insert own quiz attempts"
  ON office_fundamentals_quiz_attempts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can view their own quiz sessions
CREATE POLICY "Users can view own quiz sessions"
  ON office_fundamentals_quiz_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own quiz sessions
CREATE POLICY "Users can insert own quiz sessions"
  ON office_fundamentals_quiz_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
