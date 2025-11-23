-- =============================================
-- Migration: Clear Software Engineering Essentials Challenges
-- Description: Remove all existing software-engineering-essentials tier challenges
-- Version: 051
-- Date: 2025-01-21
-- =============================================

-- Delete all software engineering essentials challenges
DELETE FROM challenges
WHERE tier = 'software-engineering-essentials';

-- Verify deletion
-- SELECT COUNT(*) as remaining_challenges
-- FROM challenges
-- WHERE tier = 'software-engineering-essentials';
