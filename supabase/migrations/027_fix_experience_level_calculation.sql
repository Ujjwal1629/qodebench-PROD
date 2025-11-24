-- ============================================================================
-- Fix Experience Level Calculation
-- Issue: experience_level in profiles is not being updated automatically
--        based on points earned
-- ============================================================================

-- 1. Create function to calculate experience level from points
CREATE OR REPLACE FUNCTION calculate_experience_level(points INTEGER)
RETURNS TEXT AS $$
BEGIN
    IF points >= 3500 THEN
        RETURN 'senior';
    ELSIF points >= 1500 THEN
        RETURN 'mid';
    ELSIF points >= 500 THEN
        RETURN 'junior';
    ELSE
        RETURN 'intern';
    END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 2. Create function to update experience level when points change
CREATE OR REPLACE FUNCTION update_experience_level()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate and update experience level based on total_points
    NEW.experience_level := calculate_experience_level(NEW.total_points);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Create trigger to auto-update experience level on profile updates
DROP TRIGGER IF EXISTS trigger_update_experience_level ON profiles;

CREATE TRIGGER trigger_update_experience_level
    BEFORE UPDATE OF total_points ON profiles
    FOR EACH ROW
    WHEN (OLD.total_points IS DISTINCT FROM NEW.total_points)
    EXECUTE FUNCTION update_experience_level();

-- 4. Update existing profiles to have correct experience levels
UPDATE profiles
SET experience_level = calculate_experience_level(total_points)
WHERE experience_level != calculate_experience_level(total_points)
   OR experience_level IS NULL;

-- 5. Add comment for documentation
COMMENT ON FUNCTION calculate_experience_level(INTEGER) IS
'Calculates experience level based on points: intern (0-499), junior (500-1499), mid (1500-3499), senior (3500+)';

COMMENT ON FUNCTION update_experience_level() IS
'Trigger function that automatically updates experience_level when total_points changes';

-- ============================================================================
-- Fix Leaderboard Rank Calculation
-- Issue: global_rank and weekly_rank are not being updated automatically
-- ============================================================================

-- 6. Create function to update all ranks after points change
CREATE OR REPLACE FUNCTION update_all_ranks()
RETURNS TRIGGER AS $$
BEGIN
    -- Update global ranks for all users
    WITH ranked_users AS (
        SELECT
            user_id,
            ROW_NUMBER() OVER (ORDER BY total_points DESC, last_submission_at ASC) as rank
        FROM leaderboard_entries
        WHERE total_points > 0
    )
    UPDATE leaderboard_entries le
    SET global_rank = ru.rank
    FROM ranked_users ru
    WHERE le.user_id = ru.user_id;

    -- Update weekly ranks for all users with points this week
    WITH weekly_ranked_users AS (
        SELECT
            user_id,
            ROW_NUMBER() OVER (ORDER BY weekly_points DESC, last_submission_at ASC) as rank
        FROM leaderboard_entries
        WHERE weekly_points > 0
    )
    UPDATE leaderboard_entries le
    SET weekly_rank = wru.rank
    FROM weekly_ranked_users wru
    WHERE le.user_id = wru.user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Create trigger to auto-update ranks when leaderboard changes
DROP TRIGGER IF EXISTS trigger_update_all_ranks ON leaderboard_entries;

CREATE TRIGGER trigger_update_all_ranks
    AFTER INSERT OR UPDATE OF total_points, weekly_points ON leaderboard_entries
    FOR EACH STATEMENT
    EXECUTE FUNCTION update_all_ranks();

-- 8. Run initial rank calculation for existing entries
DO $$
BEGIN
    -- Update global ranks
    WITH ranked_users AS (
        SELECT
            user_id,
            ROW_NUMBER() OVER (ORDER BY total_points DESC, last_submission_at ASC) as rank
        FROM leaderboard_entries
        WHERE total_points > 0
    )
    UPDATE leaderboard_entries le
    SET global_rank = ru.rank
    FROM ranked_users ru
    WHERE le.user_id = ru.user_id;

    -- Update weekly ranks
    WITH weekly_ranked_users AS (
        SELECT
            user_id,
            ROW_NUMBER() OVER (ORDER BY weekly_points DESC, last_submission_at ASC) as rank
        FROM leaderboard_entries
        WHERE weekly_points > 0
    )
    UPDATE leaderboard_entries le
    SET weekly_rank = wru.rank
    FROM weekly_ranked_users wru
    WHERE le.user_id = wru.user_id;
END $$;

COMMENT ON FUNCTION update_all_ranks() IS
'Trigger function that recalculates all leaderboard ranks when points change';
