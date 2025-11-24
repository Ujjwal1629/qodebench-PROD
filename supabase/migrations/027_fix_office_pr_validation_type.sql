-- =============================================
-- Migration: Fix Office PR Description Validation Type
-- Description: Change validation_type from 'hybrid' to 'ai_only' to match test_cases structure
-- Version: 027
-- =============================================

-- The challenge was created with validation_type='hybrid' but test_cases use ai_only format
-- This causes 0 points for structure, leading to low scores

UPDATE challenges
SET validation_type = 'ai_only'
WHERE slug = 'office-pr-description';

-- Verify the fix
SELECT
  slug,
  title,
  validation_type,
  jsonb_pretty(test_cases) as test_structure
FROM challenges
WHERE slug = 'office-pr-description';
