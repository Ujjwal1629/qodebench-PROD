-- =====================================================
-- Reset Backend & APIs Learning Module Only
-- =====================================================
-- This script safely resets only the Backend & APIs module data
-- without affecting other learning modules

BEGIN;

-- Delete in correct order (child tables first due to foreign keys)
DELETE FROM backend_quiz_attempts WHERE quiz_question_id IN (
  SELECT id FROM backend_quiz_questions WHERE lesson_id IN (
    SELECT id FROM ai_learning_lessons WHERE learning_path_id = 'f5e4d3c2-b1a0-9876-5432-10fedcba9876'
  )
);

DELETE FROM backend_quiz_sessions WHERE lesson_id IN (
  SELECT id FROM ai_learning_lessons WHERE learning_path_id = 'f5e4d3c2-b1a0-9876-5432-10fedcba9876'
);

DELETE FROM backend_quiz_questions WHERE lesson_id IN (
  SELECT id FROM ai_learning_lessons WHERE learning_path_id = 'f5e4d3c2-b1a0-9876-5432-10fedcba9876'
);

DELETE FROM ai_learning_lessons WHERE learning_path_id = 'f5e4d3c2-b1a0-9876-5432-10fedcba9876';

DELETE FROM ai_learning_paths WHERE id = 'f5e4d3c2-b1a0-9876-5432-10fedcba9876';

COMMIT;

-- Now re-seed the Backend & APIs data
\i 015_backend_apis_seed_data.sql
