-- =============================================
-- Migration: Rename office category to office-fundamentals
-- Description: Updates category constraint and renames existing office challenges
-- Version: 005
-- Created: 2025-01-23
-- =============================================

-- Step 1: Update any existing challenges with 'office' category to 'office-fundamentals'
UPDATE challenges
SET category = 'office-fundamentals'
WHERE category = 'office';

-- Step 2: Drop the old CHECK constraint on category
ALTER TABLE challenges
DROP CONSTRAINT IF EXISTS challenges_category_check;

-- Step 3: Add new CHECK constraint with 'office-fundamentals' instead of 'office'
ALTER TABLE challenges
ADD CONSTRAINT challenges_category_check
CHECK (category IN ('office-fundamentals', 'python', 'javascript', 'react', 'nextjs', 'nodejs'));

-- Verify the changes
-- SELECT category, COUNT(*) as count
-- FROM challenges
-- GROUP BY category
-- ORDER BY category;
