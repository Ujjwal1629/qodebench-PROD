-- =============================================
-- Migration: Fix user_badges RLS Policy
-- Description: Allow badge inserts from triggers/functions
-- Version: 018
-- =============================================

-- Drop the overly restrictive policy
DROP POLICY IF EXISTS "Only system can insert badges" ON user_badges;

-- Create a new policy that allows inserts from triggers (authenticated context)
CREATE POLICY "Allow badge inserts from triggers"
  ON user_badges FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Make the trigger function run with SECURITY DEFINER
-- This allows it to bypass RLS when inserting badges
CREATE OR REPLACE FUNCTION award_badges_on_profile_update()
RETURNS TRIGGER
SECURITY DEFINER -- Run with function creator's privileges
SET search_path = public
AS $$
BEGIN
  -- 100 Points Badge
  IF NEW.total_points >= 100 AND OLD.total_points < 100 THEN
    INSERT INTO user_badges (user_id, badge_type, metadata)
    VALUES (
      NEW.id,
      'points_100',
      jsonb_build_object(
        'title', '100 Points Club',
        'description', 'Earned 100+ points',
        'icon', '💯'
      )
    ) ON CONFLICT DO NOTHING;
  END IF;

  -- 500 Points Badge
  IF NEW.total_points >= 500 AND OLD.total_points < 500 THEN
    INSERT INTO user_badges (user_id, badge_type, metadata)
    VALUES (
      NEW.id,
      'points_500',
      jsonb_build_object(
        'title', '500 Points Champion',
        'description', 'Earned 500+ points',
        'icon', '⭐'
      )
    ) ON CONFLICT DO NOTHING;
  END IF;

  -- 1000 Points Badge
  IF NEW.total_points >= 1000 AND OLD.total_points < 1000 THEN
    INSERT INTO user_badges (user_id, badge_type, metadata)
    VALUES (
      NEW.id,
      'points_1000',
      jsonb_build_object(
        'title', '1000 Points Master',
        'description', 'Earned 1000+ points',
        'icon', '🏆'
      )
    ) ON CONFLICT DO NOTHING;
  END IF;

  -- Challenge Completion Badges
  IF NEW.challenges_completed >= 10 AND OLD.challenges_completed < 10 THEN
    INSERT INTO user_badges (user_id, badge_type, metadata)
    VALUES (
      NEW.id,
      'challenges_10',
      jsonb_build_object(
        'title', '10 Challenges Completed',
        'description', 'Completed 10 coding challenges',
        'icon', '🎯'
      )
    ) ON CONFLICT DO NOTHING;
  END IF;

  IF NEW.challenges_completed >= 50 AND OLD.challenges_completed < 50 THEN
    INSERT INTO user_badges (user_id, badge_type, metadata)
    VALUES (
      NEW.id,
      'challenges_50',
      jsonb_build_object(
        'title', '50 Challenges Completed',
        'description', 'Completed 50 coding challenges',
        'icon', '🚀'
      )
    ) ON CONFLICT DO NOTHING;
  END IF;

  -- Streak Badges
  IF NEW.current_streak >= 7 THEN
    INSERT INTO user_badges (user_id, badge_type, metadata)
    VALUES (
      NEW.id,
      'streak_7',
      jsonb_build_object(
        'title', '7 Day Streak',
        'description', 'Maintained a 7-day learning streak',
        'icon', '🔥'
      )
    ) ON CONFLICT DO NOTHING;
  END IF;

  IF NEW.current_streak >= 30 THEN
    INSERT INTO user_badges (user_id, badge_type, metadata)
    VALUES (
      NEW.id,
      'streak_30',
      jsonb_build_object(
        'title', '30 Day Streak',
        'description', 'Maintained a 30-day learning streak',
        'icon', '💪'
      )
    ) ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Verify the trigger is still attached
DROP TRIGGER IF EXISTS award_badges_on_profile_update ON profiles;
CREATE TRIGGER award_badges_on_profile_update
  AFTER UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION award_badges_on_profile_update();
