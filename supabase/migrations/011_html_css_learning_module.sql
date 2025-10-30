-- =====================================================
-- HTML/CSS Interactive Learning Module
-- =====================================================
-- This migration adds tables for quiz-based learning with AI chat support
-- Extends the existing ai_learning_* infrastructure

-- =====================================================
-- 1. QUIZ QUESTIONS TABLE
-- =====================================================

CREATE TABLE html_css_quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES ai_learning_lessons(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT CHECK (question_type IN ('multiple_choice', 'true_false', 'code_completion')) NOT NULL,
  options JSONB, -- For multiple choice: {"A": "option1", "B": "option2", "C": "option3", "D": "option4"}
  correct_answer TEXT NOT NULL, -- Store correct option key (e.g., "A", "true", etc.)
  explanation TEXT NOT NULL, -- Explain why this is the correct answer
  code_example TEXT, -- Optional code snippet for context
  order_index INTEGER NOT NULL, -- Order within the lesson (1-5)
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'easy',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. QUIZ ATTEMPTS TABLE (Individual Question Attempts)
-- =====================================================

CREATE TABLE html_css_quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES ai_learning_lessons(id) ON DELETE CASCADE,
  quiz_question_id UUID REFERENCES html_css_quiz_questions(id) ON DELETE CASCADE,
  user_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  attempt_number INTEGER DEFAULT 1, -- Track retries for same question
  time_taken_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. QUIZ SESSIONS TABLE (Overall Quiz Results)
-- =====================================================

CREATE TABLE html_css_quiz_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES ai_learning_lessons(id) ON DELETE CASCADE,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  score_percentage INTEGER NOT NULL, -- 0-100
  passed BOOLEAN NOT NULL, -- True if >= 80%
  time_taken_seconds INTEGER,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 4. CHAT HISTORY TABLE (AI Assistant)
-- =====================================================

CREATE TABLE html_css_chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES ai_learning_lessons(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  role TEXT CHECK (role IN ('user', 'assistant')) NOT NULL,
  mode TEXT CHECK (mode IN ('explain', 'example', 'hint', 'progress', 'chat')) DEFAULT 'chat',
  context JSONB, -- Store lesson context, code examples, etc.
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_quiz_questions_lesson ON html_css_quiz_questions(lesson_id, order_index);
CREATE INDEX idx_quiz_attempts_user_lesson ON html_css_quiz_attempts(user_id, lesson_id);
CREATE INDEX idx_quiz_attempts_question ON html_css_quiz_attempts(quiz_question_id);
CREATE INDEX idx_quiz_sessions_user ON html_css_quiz_sessions(user_id, lesson_id);
CREATE INDEX idx_quiz_sessions_passed ON html_css_quiz_sessions(user_id, passed);
CREATE INDEX idx_chat_history_user_lesson ON html_css_chat_history(user_id, lesson_id);
CREATE INDEX idx_chat_history_created ON html_css_chat_history(created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

ALTER TABLE html_css_quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE html_css_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE html_css_quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE html_css_chat_history ENABLE ROW LEVEL SECURITY;

-- Quiz questions: Viewable by all authenticated users
CREATE POLICY "Quiz questions viewable by authenticated users"
  ON html_css_quiz_questions FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Quiz attempts: Users can only view and insert their own
CREATE POLICY "Users can view their own quiz attempts"
  ON html_css_quiz_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz attempts"
  ON html_css_quiz_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Quiz sessions: Users can only view and insert their own
CREATE POLICY "Users can view their own quiz sessions"
  ON html_css_quiz_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz sessions"
  ON html_css_quiz_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Chat history: Users can only view and insert their own
CREATE POLICY "Users can view their own chat history"
  ON html_css_chat_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat messages"
  ON html_css_chat_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Auto-update updated_at for quiz questions
CREATE TRIGGER update_html_css_quiz_questions_updated_at
  BEFORE UPDATE ON html_css_quiz_questions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to check if user passed a lesson's quiz
CREATE OR REPLACE FUNCTION has_passed_lesson_quiz(p_user_id UUID, p_lesson_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  has_passed BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1
    FROM html_css_quiz_sessions
    WHERE user_id = p_user_id
    AND lesson_id = p_lesson_id
    AND passed = true
  ) INTO has_passed;

  RETURN has_passed;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get latest quiz score for a lesson
CREATE OR REPLACE FUNCTION get_latest_quiz_score(p_user_id UUID, p_lesson_id UUID)
RETURNS TABLE (
  score_percentage INTEGER,
  passed BOOLEAN,
  completed_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    qs.score_percentage,
    qs.passed,
    qs.completed_at
  FROM html_css_quiz_sessions qs
  WHERE qs.user_id = p_user_id
  AND qs.lesson_id = p_lesson_id
  ORDER BY qs.completed_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can access a lesson (completed previous)
CREATE OR REPLACE FUNCTION can_access_lesson(p_user_id UUID, p_lesson_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  prev_lesson_id UUID;
  prev_lesson_passed BOOLEAN;
  current_order INTEGER;
  prev_order INTEGER;
  path_id UUID;
BEGIN
  -- Get current lesson's order and path
  SELECT order_index, learning_path_id
  INTO current_order, path_id
  FROM ai_learning_lessons
  WHERE id = p_lesson_id;

  -- First lesson is always accessible
  IF current_order = 1 THEN
    RETURN true;
  END IF;

  -- Get previous lesson's order
  prev_order := current_order - 1;

  -- Find previous lesson ID
  SELECT id INTO prev_lesson_id
  FROM ai_learning_lessons
  WHERE learning_path_id = path_id
  AND order_index = prev_order;

  -- Check if previous lesson was passed
  IF prev_lesson_id IS NULL THEN
    RETURN false;
  END IF;

  prev_lesson_passed := has_passed_lesson_quiz(p_user_id, prev_lesson_id);

  RETURN prev_lesson_passed;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- VIEWS
-- =====================================================

-- View for lesson quiz statistics
CREATE VIEW lesson_quiz_stats AS
SELECT
  l.id as lesson_id,
  l.title as lesson_title,
  COUNT(DISTINCT qs.user_id) as total_attempts,
  COUNT(DISTINCT CASE WHEN qs.passed THEN qs.user_id END) as passed_count,
  ROUND(AVG(qs.score_percentage), 2) as avg_score,
  ROUND(AVG(qs.time_taken_seconds), 0) as avg_time_seconds
FROM ai_learning_lessons l
LEFT JOIN html_css_quiz_sessions qs ON l.id = qs.lesson_id
GROUP BY l.id, l.title;

-- View for user learning progress with quiz status
CREATE VIEW user_lesson_progress AS
SELECT
  lp.user_id,
  lp.lesson_id,
  l.title as lesson_title,
  l.order_index,
  lp.status,
  lp.progress_percentage,
  (SELECT passed FROM html_css_quiz_sessions
   WHERE user_id = lp.user_id AND lesson_id = lp.lesson_id
   ORDER BY completed_at DESC LIMIT 1) as quiz_passed,
  (SELECT score_percentage FROM html_css_quiz_sessions
   WHERE user_id = lp.user_id AND lesson_id = lp.lesson_id
   ORDER BY completed_at DESC LIMIT 1) as latest_quiz_score
FROM ai_learning_progress lp
JOIN ai_learning_lessons l ON lp.lesson_id = l.id
WHERE l.content_type = 'quiz';

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE html_css_quiz_questions IS 'Quiz questions for HTML/CSS learning lessons';
COMMENT ON TABLE html_css_quiz_attempts IS 'Individual quiz question attempts by users';
COMMENT ON TABLE html_css_quiz_sessions IS 'Complete quiz session results with pass/fail status';
COMMENT ON TABLE html_css_chat_history IS 'AI assistant chat history per lesson';
COMMENT ON FUNCTION has_passed_lesson_quiz IS 'Check if user has passed a specific lesson quiz';
COMMENT ON FUNCTION can_access_lesson IS 'Check if user can access lesson based on previous completion';
