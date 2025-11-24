-- =====================================================
-- Reset ONLY HTML/CSS Learning Data
-- =====================================================
-- This script safely removes and reseeds only the HTML/CSS
-- learning path without affecting other data

-- Step 1: Delete quiz attempts for HTML/CSS lessons
DELETE FROM html_css_quiz_attempts
WHERE lesson_id IN (
  SELECT id FROM ai_learning_lessons
  WHERE learning_path_id = 'e7f9a1b2-c3d4-5e6f-7a8b-9c0d1e2f3a4b'
);

-- Step 2: Delete quiz sessions for HTML/CSS lessons
DELETE FROM html_css_quiz_sessions
WHERE lesson_id IN (
  SELECT id FROM ai_learning_lessons
  WHERE learning_path_id = 'e7f9a1b2-c3d4-5e6f-7a8b-9c0d1e2f3a4b'
);

-- Step 3: Delete lesson progress for HTML/CSS lessons
DELETE FROM ai_learning_progress
WHERE lesson_id IN (
  SELECT id FROM ai_learning_lessons
  WHERE learning_path_id = 'e7f9a1b2-c3d4-5e6f-7a8b-9c0d1e2f3a4b'
);

-- Step 4: Delete quiz questions for HTML/CSS lessons
DELETE FROM html_css_quiz_questions
WHERE lesson_id IN (
  SELECT id FROM ai_learning_lessons
  WHERE learning_path_id = 'e7f9a1b2-c3d4-5e6f-7a8b-9c0d1e2f3a4b'
);

-- Step 5: Delete HTML/CSS lessons
DELETE FROM ai_learning_lessons
WHERE learning_path_id = 'e7f9a1b2-c3d4-5e6f-7a8b-9c0d1e2f3a4b';

-- Step 6: Delete HTML/CSS learning path
DELETE FROM ai_learning_paths
WHERE id = 'e7f9a1b2-c3d4-5e6f-7a8b-9c0d1e2f3a4b';

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'HTML/CSS data deleted successfully! Now run: psql $DATABASE_URL -f supabase/seed/012_html_css_seed_data.sql';
END $$;
