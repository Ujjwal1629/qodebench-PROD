-- =====================================================
-- Reset ONLY JavaScript Learning Data
-- =====================================================
-- This script safely removes and reseeds only the JavaScript
-- learning path without affecting other data

-- Step 1: Delete quiz attempts for JavaScript lessons
DELETE FROM javascript_quiz_attempts
WHERE lesson_id IN (
  SELECT id FROM ai_learning_lessons
  WHERE learning_path_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
);

-- Step 2: Delete quiz sessions for JavaScript lessons
DELETE FROM javascript_quiz_sessions
WHERE lesson_id IN (
  SELECT id FROM ai_learning_lessons
  WHERE learning_path_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
);

-- Step 3: Delete lesson progress for JavaScript lessons
DELETE FROM ai_learning_progress
WHERE lesson_id IN (
  SELECT id FROM ai_learning_lessons
  WHERE learning_path_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
);

-- Step 4: Delete quiz questions for JavaScript lessons
DELETE FROM javascript_quiz_questions
WHERE lesson_id IN (
  SELECT id FROM ai_learning_lessons
  WHERE learning_path_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
);

-- Step 5: Delete JavaScript lessons
DELETE FROM ai_learning_lessons
WHERE learning_path_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

-- Step 6: Delete JavaScript learning path
DELETE FROM ai_learning_paths
WHERE id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'JavaScript data deleted successfully! Now run: psql $DATABASE_URL -f supabase/seed/013_javascript_seed_data.sql';
END $$;
