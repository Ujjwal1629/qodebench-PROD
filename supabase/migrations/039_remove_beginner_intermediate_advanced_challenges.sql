-- Migration: Remove beginner, intermediate, and advanced tier challenges
-- Date: 2025-11-20
-- Description: Soft delete (mark as inactive) all beginner, intermediate, and advanced challenges
--              while preserving office-workflow challenges. This maintains historical data
--              and user submissions while hiding these challenges from the UI.

-- ============================================================================
-- SOFT DELETE: Mark challenges as inactive
-- ============================================================================
-- This approach preserves all data (submissions, user progress) while hiding
-- the challenges from the application UI.
-- ============================================================================

UPDATE challenges
SET
  is_active = FALSE,
  is_free_tier_accessible = FALSE
WHERE tier IN ('beginner', 'intermediate', 'advanced')
AND is_active = TRUE;

-- ============================================================================
-- VERIFICATION QUERY (for manual check after migration)
-- ============================================================================
-- Run this to verify the cleanup:
--
-- SELECT tier, COUNT(*) as count,
--        SUM(CASE WHEN is_active THEN 1 ELSE 0 END) as active_count
-- FROM challenges
-- GROUP BY tier;
--
-- Expected result:
-- - beginner: 10 total, 0 active
-- - intermediate: 10 total, 0 active
-- - advanced: 5+ total, 0 active
-- - office-workflow: 10 total, 10 active
-- ============================================================================

-- ============================================================================
-- OPTIONAL: Hard delete (PERMANENT - USE WITH CAUTION)
-- ============================================================================
-- If you want to permanently delete these challenges and all related data,
-- uncomment the following queries. WARNING: This cannot be undone!
-- ============================================================================

-- -- Step 1: Delete all submissions for these challenges
-- DELETE FROM submissions
-- WHERE challenge_id IN (
--   SELECT id FROM challenges
--   WHERE tier IN ('beginner', 'intermediate', 'advanced')
-- );

-- -- Step 2: Delete leaderboard entries for these challenges
-- DELETE FROM leaderboard_entries
-- WHERE challenge_id IN (
--   SELECT id FROM challenges
--   WHERE tier IN ('beginner', 'intermediate', 'advanced')
-- );

-- -- Step 3: Delete the challenges themselves
-- DELETE FROM challenges
-- WHERE tier IN ('beginner', 'intermediate', 'advanced');

-- ============================================================================
-- POST-MIGRATION NOTES
-- ============================================================================
-- After running this migration:
--
-- 1. Update challenge listing queries to filter WHERE is_active = TRUE
-- 2. Update subscription/access control logic if it references these tiers
-- 3. Update any UI components that reference beginner/intermediate/advanced tiers
-- 4. Consider updating the onboarding flow if it mentions these challenge tiers
-- 5. Review and update any documentation that references the old tier structure
--
-- Preserved data:
-- - All user submissions for these challenges (queryable for analytics)
-- - All leaderboard entries
-- - All user progress and points earned
--
-- Remaining active challenges:
-- - 10 office-workflow challenges (tier='office-workflow')
-- ============================================================================
