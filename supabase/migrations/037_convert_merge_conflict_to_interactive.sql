-- Migration: Convert Merge Conflict Challenge to Interactive MCQ Format
-- This migration transforms the "Resolve Git Merge Conflict" challenge from
-- a code-writing challenge to an interactive, VS Code-style MCQ challenge

BEGIN;

-- First, drop the existing check constraint on response_format
ALTER TABLE challenges
DROP CONSTRAINT IF EXISTS challenges_response_format_check;

-- Add the new check constraint that includes merge_conflict_interactive
ALTER TABLE challenges
ADD CONSTRAINT challenges_response_format_check
CHECK (response_format IN ('javascript', 'typescript', 'markdown', 'text', 'json', 'merge_conflict_interactive'));

-- Update the challenge structure
UPDATE challenges
SET
  response_format = 'merge_conflict_interactive',
  validation_type = 'hybrid',
  description = 'Learn how to resolve Git merge conflicts by making strategic resolution decisions. You''ll encounter multiple conflict scenarios and choose the best resolution strategy for each.',
  starter_code = '{}', -- Empty object - no starter code needed for MCQ format
  test_cases = jsonb_build_object(
    'scenarios', jsonb_build_array(
      -- Scenario 1: Two features that should both be kept
      jsonb_build_object(
        'id', 1,
        'context', 'Two developers were working on the same user profile component. One added a bio section while the other added an activity feed.',
        'description', 'Both features are important and should be included in the final version.',
        'currentBranch', 'HEAD (add-bio-section)',
        'incomingBranch', 'feature/activity-feed',
        'filePath', 'components/UserProfile.jsx',
        'currentCode', E'  <div className="bio-section">\n    <h2>Bio</h2>\n    <p>{user.bio || ''No bio yet''}</p>\n  </div>',
        'incomingCode', E'  <div className="activity-feed">\n    <h2>Recent Activity</h2>\n    <ActivityList userId={user.id} />\n  </div>',
        'correctAnswer', 'accept_both',
        'explanation', 'Both features are valuable additions to the user profile. The bio section and activity feed serve different purposes and should both be included to provide a complete user profile experience.'
      ),

      -- Scenario 2: Bug fix vs outdated code
      jsonb_build_object(
        'id', 2,
        'context', 'A critical security bug was fixed in the main branch while you were working on a feature branch with an older version of the authentication code.',
        'description', 'The main branch contains a security fix for the login validation.',
        'currentBranch', 'HEAD (feature/add-remember-me)',
        'incomingBranch', 'main',
        'filePath', 'lib/auth/validation.ts',
        'currentCode', E'export function validateLogin(email: string, password: string) {\n  if (!email || !password) return false;\n  return true;\n}',
        'incomingCode', E'export function validateLogin(email: string, password: string) {\n  if (!email || !password) return false;\n  // Security fix: Validate email format\n  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;\n  if (!emailRegex.test(email)) return false;\n  return true;\n}',
        'correctAnswer', 'accept_incoming',
        'explanation', 'Security fixes from the main branch should always be prioritized. The incoming change includes proper email validation which prevents potential security issues. Your feature branch code is outdated and missing this critical security improvement.'
      ),

      -- Scenario 3: Duplicate implementations that conflict
      jsonb_build_object(
        'id', 3,
        'context', 'Two developers implemented error handling for an API call. One added basic try-catch while the other added comprehensive error logging and user notifications.',
        'description', 'Choose which error handling implementation to keep.',
        'currentBranch', 'HEAD (basic-error-handling)',
        'incomingBranch', 'feature/advanced-error-handling',
        'filePath', 'services/api.ts',
        'currentCode', E'try {\n  const response = await fetch(url);\n  return response.json();\n} catch (error) {\n  console.error(error);\n  return null;\n}',
        'incomingCode', E'try {\n  const response = await fetch(url);\n  return response.json();\n} catch (error) {\n  logger.error(''API call failed'', { url, error });\n  toast.error(''Failed to load data. Please try again.'');\n  throw new ApiError(error.message);\n}',
        'correctAnswer', 'accept_incoming',
        'explanation', 'The incoming change provides comprehensive error handling with proper logging, user feedback, and error propagation. This is superior to basic console.error as it improves debugging capabilities and user experience. The incoming implementation follows production-ready error handling best practices.'
      ),

      -- Scenario 4: Formatting conflict with same functionality
      jsonb_build_object(
        'id', 4,
        'context', 'Both branches modified the same configuration object but with different formatting styles. The functionality is identical.',
        'description', 'Choose the better formatted version or merge both.',
        'currentBranch', 'HEAD (your-changes)',
        'incomingBranch', 'main',
        'filePath', 'config/theme.ts',
        'currentCode', E'export const theme = {\n  colors: { primary: "#0ea5e9", secondary: "#a855f7" },\n  spacing: { sm: "0.5rem", md: "1rem", lg: "2rem" }\n};',
        'incomingCode', E'export const theme = {\n  colors: {\n    primary: "#0ea5e9",\n    secondary: "#a855f7"\n  },\n  spacing: {\n    sm: "0.5rem",\n    md: "1rem",\n    lg: "2rem"\n  }\n};',
        'correctAnswer', 'accept_incoming',
        'explanation', 'When dealing with pure formatting differences, accept the version from the main branch to maintain consistency with the codebase''s established formatting standards. The incoming change uses multi-line formatting which is more readable and easier to maintain, especially as the configuration grows.'
      )
    )
  )
WHERE slug = 'office-merge-conflict';

-- Verify the update
DO $$
DECLARE
  updated_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO updated_count
  FROM challenges
  WHERE slug = 'office-merge-conflict'
    AND response_format = 'merge_conflict_interactive';

  IF updated_count = 0 THEN
    RAISE EXCEPTION 'Failed to update merge conflict challenge';
  END IF;

  RAISE NOTICE 'Successfully converted merge conflict challenge to interactive format with % scenarios',
    (SELECT jsonb_array_length(test_cases->'scenarios')
     FROM challenges
     WHERE slug = 'office-merge-conflict');
END $$;

COMMIT;
