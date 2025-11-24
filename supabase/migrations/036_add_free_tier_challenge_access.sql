-- Migration: Add free tier challenge access control
-- Purpose: Allow free users to access limited challenges from each tier
-- Distribution: Beginner (5 open), Intermediate (5 open), Office Workflow (5 open), Advanced (2 open)

-- Step 1: Add is_free_tier_accessible column to challenges table
ALTER TABLE challenges
ADD COLUMN IF NOT EXISTS is_free_tier_accessible BOOLEAN DEFAULT false;

COMMENT ON COLUMN challenges.is_free_tier_accessible
IS 'Whether this challenge is accessible to free tier users. Used to provide limited access to higher tiers without subscription.';

-- Step 2: Mark first 5 beginner challenges as free accessible
UPDATE challenges
SET is_free_tier_accessible = true
WHERE tier = 'beginner'
  AND order_in_tier <= 5
  AND is_active = true;

-- Step 3: Mark first 5 intermediate challenges as free accessible
UPDATE challenges
SET is_free_tier_accessible = true
WHERE tier = 'intermediate'
  AND order_in_tier <= 5
  AND is_active = true;

-- Step 4: Mark first 5 office-workflow challenges as free accessible
UPDATE challenges
SET is_free_tier_accessible = true
WHERE tier = 'office-workflow'
  AND order_in_tier <= 5
  AND is_active = true;

-- Step 5: Mark first 2 advanced challenges as free accessible
UPDATE challenges
SET is_free_tier_accessible = true
WHERE tier = 'advanced'
  AND order_in_tier <= 2
  AND is_active = true;

-- Step 6: Create index for performance optimization
CREATE INDEX IF NOT EXISTS idx_challenges_free_tier_access
ON challenges(is_free_tier_accessible)
WHERE is_active = true;

-- Step 7: Verify the changes
DO $$
DECLARE
  beginner_count INT;
  intermediate_count INT;
  office_count INT;
  advanced_count INT;
BEGIN
  -- Count free accessible challenges per tier
  SELECT COUNT(*) INTO beginner_count
  FROM challenges
  WHERE tier = 'beginner' AND is_free_tier_accessible = true AND is_active = true;

  SELECT COUNT(*) INTO intermediate_count
  FROM challenges
  WHERE tier = 'intermediate' AND is_free_tier_accessible = true AND is_active = true;

  SELECT COUNT(*) INTO office_count
  FROM challenges
  WHERE tier = 'office-workflow' AND is_free_tier_accessible = true AND is_active = true;

  SELECT COUNT(*) INTO advanced_count
  FROM challenges
  WHERE tier = 'advanced' AND is_free_tier_accessible = true AND is_active = true;

  -- Log results
  RAISE NOTICE 'Free tier accessible challenges:';
  RAISE NOTICE '  Beginner: % challenges', beginner_count;
  RAISE NOTICE '  Intermediate: % challenges', intermediate_count;
  RAISE NOTICE '  Office Workflow: % challenges', office_count;
  RAISE NOTICE '  Advanced: % challenges', advanced_count;
END $$;
