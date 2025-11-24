-- Add streak tracking to profiles table
-- This migration adds the last_completed_at column and implements streak calculation logic

-- Add last_completed_at column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_completed_at TIMESTAMP WITH TIME ZONE;

-- Create or replace the function to update user streaks
CREATE OR REPLACE FUNCTION update_user_streak()
RETURNS TRIGGER AS $$
DECLARE
    last_completion TIMESTAMP WITH TIME ZONE;
    days_diff INTEGER;
    v_current_streak INTEGER;
    v_longest_streak INTEGER;
BEGIN
    -- Only update streak for passed submissions
    IF NEW.status = 'passed' THEN
        -- Get the user's current streak data and last completion date
        SELECT current_streak, longest_streak, last_completed_at
        INTO v_current_streak, v_longest_streak, last_completion
        FROM profiles
        WHERE id = NEW.user_id;

        -- If this is the first completion or no previous completion exists
        IF last_completion IS NULL THEN
            v_current_streak := 1;
        ELSE
            -- Calculate days between last completion and now
            days_diff := DATE(NEW.submitted_at) - DATE(last_completion);

            -- If completed today (same day as last completion), maintain streak
            IF days_diff = 0 THEN
                -- Same day, don't change streak
                v_current_streak := COALESCE(v_current_streak, 1);
            -- If completed yesterday or today (consecutive days)
            ELSIF days_diff = 1 THEN
                -- Increment streak
                v_current_streak := COALESCE(v_current_streak, 0) + 1;
            -- If more than 1 day gap, reset streak
            ELSE
                v_current_streak := 1;
            END IF;
        END IF;

        -- Update longest streak if current streak is higher
        IF v_current_streak > COALESCE(v_longest_streak, 0) THEN
            v_longest_streak := v_current_streak;
        END IF;

        -- Update profile with new streak data
        UPDATE profiles
        SET
            current_streak = v_current_streak,
            longest_streak = v_longest_streak,
            last_completed_at = NEW.submitted_at,
            updated_at = NOW()
        WHERE id = NEW.user_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS trigger_update_user_streak ON submissions;

-- Create trigger to update streaks after submission
CREATE TRIGGER trigger_update_user_streak
    AFTER INSERT ON submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_user_streak();

-- Add comment
COMMENT ON FUNCTION update_user_streak() IS 'Updates user streak when a challenge is completed. Consecutive days increment streak, gaps reset it.';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Streak tracking added successfully!';
    RAISE NOTICE '   - Added last_completed_at column to profiles';
    RAISE NOTICE '   - Created update_user_streak() function';
    RAISE NOTICE '   - Added trigger to update streaks on submission';
END $$;
