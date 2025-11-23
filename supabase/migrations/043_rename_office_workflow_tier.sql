-- =============================================
-- Migration: Rename office-workflow tier to software-engineering-essentials
-- Description: Reorganize challenges module with category-based structure
-- Version: 043
-- Date: 2025-01-20
-- =============================================

-- IMPORTANT: This migration must be run in this exact order to avoid constraint violations

-- Step 1: Drop the constraint FIRST (so we can update data freely)
ALTER TABLE challenges DROP CONSTRAINT IF EXISTS challenges_tier_check;

-- Step 2: Now update the data without any constraint blocking it
UPDATE challenges
SET tier = 'software-engineering-essentials'
WHERE tier = 'office-workflow';

-- Step 3: Add the new constraint AFTER data is updated
ALTER TABLE challenges ADD CONSTRAINT challenges_tier_check
  CHECK (
    tier IN (
      'beginner',
      'intermediate',
      'software-engineering-essentials',
      'advanced',
      'product-planning'
    ) OR tier IS NULL
  );

-- Step 4: Update column comment for documentation
COMMENT ON COLUMN challenges.tier IS 'Challenge tier: beginner → intermediate → software-engineering-essentials → advanced → product-planning';

-- ============================================================================
-- VERIFICATION QUERIES (commented out to avoid migration errors)
-- Run these manually in Supabase SQL Editor after migration
-- ============================================================================

-- Check tier distribution after migration
-- SELECT tier, COUNT(*) as challenge_count
-- FROM challenges
-- WHERE is_active = TRUE
-- GROUP BY tier
-- ORDER BY
--   CASE tier
--     WHEN 'beginner' THEN 1
--     WHEN 'intermediate' THEN 2
--     WHEN 'software-engineering-essentials' THEN 3
--     WHEN 'advanced' THEN 4
--     WHEN 'product-planning' THEN 5
--   END;

-- Verify no office-workflow challenges remain
-- SELECT COUNT(*) as old_tier_count
-- FROM challenges
-- WHERE tier = 'office-workflow';
-- Expected result: 0

-- Verify constraint is working
-- INSERT INTO challenges (title, tier) VALUES ('Test', 'invalid-tier');
-- Should fail with constraint violation
