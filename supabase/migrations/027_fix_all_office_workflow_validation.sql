-- =============================================
-- Migration: Fix All Office Workflow Challenge Validation Types
-- Description: Ensure validation_type matches test_cases structure for all office workflow challenges
-- Version: 027
-- =============================================

-- Challenge #1: Write PR Description - Change to ai_only (test_cases use ai_validation format)
UPDATE challenges
SET validation_type = 'ai_only'
WHERE slug = 'office-pr-description';

-- Challenge #2: Write RCA - Change to ai_only
UPDATE challenges
SET validation_type = 'ai_only'
WHERE slug = 'office-rca';

-- Challenge #3: Create Meeting Notes - Change to ai_only
UPDATE challenges
SET validation_type = 'ai_only'
WHERE slug = 'office-meeting-notes';

-- Challenge #4: Write Incident Communication - Change to ai_only
UPDATE challenges
SET validation_type = 'ai_only'
WHERE slug = 'office-incident-comm';

-- Challenge #5: Resolve Git Merge Conflict - Already ai_only
-- (no change needed)

-- Challenge #6: Write Deployment Checklist - Change to ai_only
UPDATE challenges
SET validation_type = 'ai_only'
WHERE slug = 'office-deployment-checklist';

-- Challenge #7: Create API Documentation - Change to ai_only
UPDATE challenges
SET validation_type = 'ai_only'
WHERE slug = 'office-api-docs';

-- Challenge #8: Write Technical Design Doc - Change to ai_only
UPDATE challenges
SET validation_type = 'ai_only'
WHERE slug = 'office-tech-design';

-- Challenge #9: Create Bug Report - Change to ai_only
UPDATE challenges
SET validation_type = 'ai_only'
WHERE slug = 'office-bug-report';

-- Challenge #10: Write Code Review Comments - Change to ai_only
UPDATE challenges
SET validation_type = 'ai_only'
WHERE slug = 'office-code-review';

-- Verify all updates
SELECT
  slug,
  title,
  validation_type,
  challenge_type,
  tier,
  test_cases::jsonb->0->>'type' as test_case_type
FROM challenges
WHERE tier = 'office-workflow'
ORDER BY order_in_tier;

-- Summary report
SELECT
  CASE
    WHEN validation_type = 'ai_only' AND test_cases::jsonb->0->>'type' = 'ai_validation' THEN '✅ Correct'
    WHEN validation_type = 'hybrid' AND test_cases::jsonb->0->>'type' = 'hybrid_validation' THEN '✅ Correct'
    ELSE '❌ Mismatch'
  END as status,
  COUNT(*) as count
FROM challenges
WHERE tier = 'office-workflow'
GROUP BY status;
