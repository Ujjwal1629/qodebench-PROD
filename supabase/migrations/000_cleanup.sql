-- Cleanup Script - Run this FIRST to remove existing schema
-- This will drop all QodeBench tables and recreate them fresh

-- Disable triggers temporarily to avoid cascade issues
SET session_replication_role = 'replica';

-- Drop existing tables (CASCADE will drop all dependent objects)
DROP TABLE IF EXISTS weekly_challenge_participants CASCADE;
DROP TABLE IF EXISTS roadmap_progress CASCADE;
DROP TABLE IF EXISTS mock_interviews CASCADE;
DROP TABLE IF EXISTS leaderboard_entries CASCADE;
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS challenges CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop old table if it exists
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS update_user_points() CASCADE;
DROP FUNCTION IF EXISTS update_leaderboard() CASCADE;
DROP FUNCTION IF EXISTS reset_weekly_points() CASCADE;
DROP FUNCTION IF EXISTS reset_monthly_points() CASCADE;
DROP FUNCTION IF EXISTS update_user_streak() CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Drop old enum if it exists
DROP TYPE IF EXISTS experience_level CASCADE;

-- Re-enable triggers
SET session_replication_role = 'origin';

-- Success message
SELECT 'Cleanup completed successfully! Now run 001_initial_schema.sql' as status;
