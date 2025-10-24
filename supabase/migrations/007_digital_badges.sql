-- Digital Badges System Migration
-- Creates badges/achievements for beta users

-- =====================================================
-- 1. CREATE USER_BADGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_type VARCHAR(50) NOT NULL CHECK (badge_type IN (
    'beta_tester',
    'first_redemption',
    'points_100',
    'points_500',
    'points_1000',
    'challenges_10',
    'challenges_50',
    'streak_7',
    'streak_30',
    'top_10_weekly',
    'top_10_alltime'
  )),
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB, -- For storing additional badge info
  UNIQUE(user_id, badge_type) -- Prevent duplicate badges
);

-- =====================================================
-- 2. CREATE INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_badge_type ON user_badges(badge_type);
CREATE INDEX IF NOT EXISTS idx_user_badges_earned_at ON user_badges(earned_at DESC);

-- =====================================================
-- 3. ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Users can view all badges (for leaderboard profiles)
DROP POLICY IF EXISTS "Anyone can view badges" ON user_badges;
CREATE POLICY "Anyone can view badges"
  ON user_badges FOR SELECT
  USING (true);

-- Only system can insert badges (via triggers/functions)
DROP POLICY IF EXISTS "Only system can insert badges" ON user_badges;
CREATE POLICY "Only system can insert badges"
  ON user_badges FOR INSERT
  WITH CHECK (false); -- Prevent manual inserts, only via functions

-- =====================================================
-- 4. GRANT BETA TESTER BADGE TO ALL EXISTING USERS
-- =====================================================
-- This will run once when migration is applied
INSERT INTO user_badges (user_id, badge_type, metadata)
SELECT
  id,
  'beta_tester',
  jsonb_build_object(
    'title', 'Beta Tester',
    'description', 'Early adopter who joined during beta phase',
    'icon', '🚀'
  )
FROM auth.users
ON CONFLICT (user_id, badge_type) DO NOTHING;

-- =====================================================
-- 5. FUNCTION TO AUTO-AWARD BADGES
-- =====================================================
CREATE OR REPLACE FUNCTION award_badges_on_profile_update()
RETURNS TRIGGER AS $$
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
        'title', '1K Points Elite',
        'description', 'Earned 1000+ points',
        'icon', '🏆'
      )
    ) ON CONFLICT DO NOTHING;
  END IF;

  -- 10 Challenges Badge
  IF NEW.challenges_completed >= 10 AND OLD.challenges_completed < 10 THEN
    INSERT INTO user_badges (user_id, badge_type, metadata)
    VALUES (
      NEW.id,
      'challenges_10',
      jsonb_build_object(
        'title', 'Challenge Solver',
        'description', 'Completed 10+ challenges',
        'icon', '🎯'
      )
    ) ON CONFLICT DO NOTHING;
  END IF;

  -- 50 Challenges Badge
  IF NEW.challenges_completed >= 50 AND OLD.challenges_completed < 50 THEN
    INSERT INTO user_badges (user_id, badge_type, metadata)
    VALUES (
      NEW.id,
      'challenges_50',
      jsonb_build_object(
        'title', 'Challenge Master',
        'description', 'Completed 50+ challenges',
        'icon', '🔥'
      )
    ) ON CONFLICT DO NOTHING;
  END IF;

  -- 7 Day Streak Badge
  IF NEW.current_streak >= 7 AND (OLD.current_streak < 7 OR OLD.current_streak IS NULL) THEN
    INSERT INTO user_badges (user_id, badge_type, metadata)
    VALUES (
      NEW.id,
      'streak_7',
      jsonb_build_object(
        'title', 'Week Warrior',
        'description', '7 day coding streak',
        'icon', '🔥'
      )
    ) ON CONFLICT DO NOTHING;
  END IF;

  -- 30 Day Streak Badge
  IF NEW.current_streak >= 30 AND (OLD.current_streak < 30 OR OLD.current_streak IS NULL) THEN
    INSERT INTO user_badges (user_id, badge_type, metadata)
    VALUES (
      NEW.id,
      'streak_30',
      jsonb_build_object(
        'title', 'Consistency King',
        'description', '30 day coding streak',
        'icon', '👑'
      )
    ) ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 6. CREATE TRIGGER FOR AUTO-AWARDING BADGES
-- =====================================================
DROP TRIGGER IF EXISTS award_badges_trigger ON profiles;
CREATE TRIGGER award_badges_trigger
  AFTER UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION award_badges_on_profile_update();

-- =====================================================
-- 7. FUNCTION TO AWARD FIRST REDEMPTION BADGE
-- =====================================================
CREATE OR REPLACE FUNCTION award_first_redemption_badge()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if this is user's first redemption
  IF NOT EXISTS (
    SELECT 1 FROM user_badges
    WHERE user_id = NEW.user_id
    AND badge_type = 'first_redemption'
  ) THEN
    INSERT INTO user_badges (user_id, badge_type, metadata)
    VALUES (
      NEW.user_id,
      'first_redemption',
      jsonb_build_object(
        'title', 'First Reward',
        'description', 'Redeemed first item',
        'icon', '🎁'
      )
    ) ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 8. CREATE TRIGGER FOR REDEMPTION BADGE
-- =====================================================
DROP TRIGGER IF EXISTS award_redemption_badge_trigger ON redemptions;
CREATE TRIGGER award_redemption_badge_trigger
  AFTER INSERT ON redemptions
  FOR EACH ROW
  EXECUTE FUNCTION award_first_redemption_badge();

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
COMMENT ON TABLE user_badges IS 'Stores user achievements and badges';
COMMENT ON FUNCTION award_badges_on_profile_update IS 'Automatically awards badges when user profile is updated';
COMMENT ON FUNCTION award_first_redemption_badge IS 'Awards badge for first redemption';
