-- =====================================================
-- Add Chat History Tables for All Learning Modules
-- And Add Off-Topic Tracking for Analytics
-- =====================================================

-- =====================================================
-- 1. UPDATE EXISTING HTML/CSS CHAT HISTORY TABLE
-- =====================================================

-- Add is_off_topic column to existing html_css_chat_history table
ALTER TABLE html_css_chat_history
ADD COLUMN IF NOT EXISTS is_off_topic BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN html_css_chat_history.is_off_topic IS 'Track if question/response is off-topic for analytics';

-- =====================================================
-- 2. CREATE JAVASCRIPT CHAT HISTORY TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS javascript_chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES ai_learning_lessons(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  role TEXT CHECK (role IN ('user', 'assistant')) NOT NULL,
  mode TEXT CHECK (mode IN ('explain', 'example', 'hint', 'progress', 'chat')) DEFAULT 'chat',
  context JSONB, -- Store lesson context, code examples, etc.
  is_off_topic BOOLEAN DEFAULT FALSE, -- Track if question/response is off-topic for analytics
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_js_chat_history_user_lesson ON javascript_chat_history(user_id, lesson_id);
CREATE INDEX IF NOT EXISTS idx_js_chat_history_created ON javascript_chat_history(created_at DESC);

ALTER TABLE javascript_chat_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own JavaScript chat messages"
  ON javascript_chat_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own JavaScript chat messages"
  ON javascript_chat_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 3. CREATE REACT/NEXT.JS CHAT HISTORY TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS react_nextjs_chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES ai_learning_lessons(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  role TEXT CHECK (role IN ('user', 'assistant')) NOT NULL,
  mode TEXT CHECK (mode IN ('explain', 'example', 'hint', 'progress', 'chat')) DEFAULT 'chat',
  context JSONB, -- Store lesson context, code examples, etc.
  is_off_topic BOOLEAN DEFAULT FALSE, -- Track if question/response is off-topic for analytics
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_react_nextjs_chat_history_user_lesson ON react_nextjs_chat_history(user_id, lesson_id);
CREATE INDEX IF NOT EXISTS idx_react_nextjs_chat_history_created ON react_nextjs_chat_history(created_at DESC);

ALTER TABLE react_nextjs_chat_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own React/Next.js chat messages"
  ON react_nextjs_chat_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own React/Next.js chat messages"
  ON react_nextjs_chat_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 4. CREATE BACKEND/APIs CHAT HISTORY TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS backend_chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES ai_learning_lessons(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  role TEXT CHECK (role IN ('user', 'assistant')) NOT NULL,
  mode TEXT CHECK (mode IN ('explain', 'example', 'hint', 'progress', 'chat')) DEFAULT 'chat',
  context JSONB, -- Store lesson context, code examples, etc.
  is_off_topic BOOLEAN DEFAULT FALSE, -- Track if question/response is off-topic for analytics
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_backend_chat_history_user_lesson ON backend_chat_history(user_id, lesson_id);
CREATE INDEX IF NOT EXISTS idx_backend_chat_history_created ON backend_chat_history(created_at DESC);

ALTER TABLE backend_chat_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own Backend chat messages"
  ON backend_chat_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own Backend chat messages"
  ON backend_chat_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 5. CREATE OFFICE FUNDAMENTALS CHAT HISTORY TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS office_fundamentals_chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES ai_learning_lessons(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  role TEXT CHECK (role IN ('user', 'assistant')) NOT NULL,
  mode TEXT CHECK (mode IN ('explain', 'example', 'hint', 'progress', 'chat')) DEFAULT 'chat',
  context JSONB, -- Store lesson context, code examples, etc.
  is_off_topic BOOLEAN DEFAULT FALSE, -- Track if question/response is off-topic for analytics
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_office_fundamentals_chat_history_user_lesson ON office_fundamentals_chat_history(user_id, lesson_id);
CREATE INDEX IF NOT EXISTS idx_office_fundamentals_chat_history_created ON office_fundamentals_chat_history(created_at DESC);

ALTER TABLE office_fundamentals_chat_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own Office Fundamentals chat messages"
  ON office_fundamentals_chat_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own Office Fundamentals chat messages"
  ON office_fundamentals_chat_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
