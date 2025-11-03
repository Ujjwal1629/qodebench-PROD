-- =============================================
-- Migration: Add Challenge Type and Validation Fields
-- Description: Adds fields for challenge type, response format, and validation type
-- Version: 016
-- Created: 2025-01-31
-- =============================================

-- Add new columns to challenges table
ALTER TABLE challenges
ADD COLUMN IF NOT EXISTS challenge_type TEXT CHECK (challenge_type IN ('code', 'document', 'mixed')) DEFAULT 'code',
ADD COLUMN IF NOT EXISTS response_format TEXT CHECK (response_format IN ('javascript', 'typescript', 'markdown', 'text', 'json')) DEFAULT 'javascript',
ADD COLUMN IF NOT EXISTS validation_type TEXT CHECK (validation_type IN ('test_cases', 'ai_only', 'hybrid')) DEFAULT 'test_cases';

-- Add comments for documentation
COMMENT ON COLUMN challenges.challenge_type IS 'Type of challenge: code (write function), document (write docs/RCA), mixed (both)';
COMMENT ON COLUMN challenges.response_format IS 'Expected response format: javascript, typescript, markdown, text, json';
COMMENT ON COLUMN challenges.validation_type IS 'How to validate: test_cases (unit tests), ai_only (pure AI), hybrid (structure + AI)';

-- Update Office Fundamentals challenges with appropriate types
UPDATE challenges
SET
  challenge_type = CASE
    -- Code challenges (need to write functions)
    WHEN title ILIKE '%Validator%' OR
         title ILIKE '%Checker%' OR
         title ILIKE '%Parser%' OR
         title ILIKE '%Generator%' AND title ILIKE '%API%' OR
         title ILIKE '%Identifier%' THEN 'code'
    -- Document challenges (need to write documents)
    WHEN title ILIKE '%Description%' OR
         title ILIKE '%RCA%' OR
         title ILIKE '%Root Cause%' OR
         title ILIKE '%Meeting Notes%' OR
         title ILIKE '%Documentation%' OR
         title ILIKE '%Communication%' OR
         title ILIKE '%Incident%' THEN 'document'
    ELSE 'code'
  END,
  response_format = CASE
    -- JavaScript for code challenges
    WHEN title ILIKE '%Validator%' OR
         title ILIKE '%Checker%' OR
         title ILIKE '%Parser%' OR
         title ILIKE '%Identifier%' THEN 'javascript'
    -- Markdown for document challenges
    WHEN title ILIKE '%Description%' OR
         title ILIKE '%RCA%' OR
         title ILIKE '%Root Cause%' OR
         title ILIKE '%Meeting Notes%' OR
         title ILIKE '%Documentation%' OR
         title ILIKE '%Communication%' OR
         title ILIKE '%Incident%' THEN 'markdown'
    ELSE 'javascript'
  END,
  validation_type = 'hybrid'
WHERE category IN ('office', 'office-fundamentals');

-- Set AI-only validation for document-heavy challenges
UPDATE challenges
SET validation_type = 'ai_only'
WHERE category IN ('office', 'office-fundamentals')
  AND challenge_type = 'document';

-- Verify the changes
SELECT
  title,
  category,
  challenge_type,
  response_format,
  validation_type
FROM challenges
WHERE category IN ('office', 'office-fundamentals')
ORDER BY challenge_type, title;
