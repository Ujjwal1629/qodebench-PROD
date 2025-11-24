-- =====================================================
-- Reset ONLY React & Next.js Learning Data
-- =====================================================
-- This script safely removes and reseeds only the React & Next.js
-- learning path without affecting other data

-- Step 1: Delete quiz attempts for React & Next.js lessons
DELETE FROM react_nextjs_quiz_attempts
WHERE lesson_id IN (
  SELECT id FROM ai_learning_lessons
  WHERE learning_path_id = 'd2f2f7f7-c823-4f4a-aa7e-42ab8e061537'
);

-- Step 2: Delete quiz sessions for React & Next.js lessons
DELETE FROM react_nextjs_quiz_sessions
WHERE lesson_id IN (
  SELECT id FROM ai_learning_lessons
  WHERE learning_path_id = 'd2f2f7f7-c823-4f4a-aa7e-42ab8e061537'
);

-- Step 3: Delete lesson progress for React & Next.js lessons
DELETE FROM ai_learning_progress
WHERE lesson_id IN (
  SELECT id FROM ai_learning_lessons
  WHERE learning_path_id = 'd2f2f7f7-c823-4f4a-aa7e-42ab8e061537'
);

-- Step 4: Delete quiz questions for React & Next.js lessons
DELETE FROM react_nextjs_quiz_questions
WHERE lesson_id IN (
  SELECT id FROM ai_learning_lessons
  WHERE learning_path_id = 'd2f2f7f7-c823-4f4a-aa7e-42ab8e061537'
);

-- Step 5: Delete React & Next.js lessons
DELETE FROM ai_learning_lessons
WHERE learning_path_id = 'd2f2f7f7-c823-4f4a-aa7e-42ab8e061537';

-- Step 6: Delete React & Next.js learning path
DELETE FROM ai_learning_paths
WHERE id = 'd2f2f7f7-c823-4f4a-aa7e-42ab8e061537';

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'React & Next.js data deleted successfully! Now run: psql $DATABASE_URL -f supabase/seed/014_react_nextjs_seed_data.sql';
END $$;
