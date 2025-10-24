-- QodeBench Dashboard Seed Data
-- Sample user data, submissions, and progress for testing dashboard

-- ============================================================================
-- FUNCTION TO SEED DATA FOR A SPECIFIC USER
-- ============================================================================

CREATE OR REPLACE FUNCTION seed_user_dashboard_data(target_user_id UUID)
RETURNS void AS $$
DECLARE
  challenge_ids UUID[];
  challenge_id UUID;
  submission_statuses TEXT[] := ARRAY['passed', 'passed', 'passed', 'failed', 'pending'];
  submission_scores INT[] := ARRAY[95, 88, 92, 45, NULL];
  i INT := 1;
BEGIN
  -- Get array of all challenge IDs
  SELECT ARRAY_AGG(id) INTO challenge_ids FROM challenges LIMIT 5;

  -- Update user profile with better stats
  UPDATE profiles
  SET
    full_name = COALESCE(full_name, 'Test User'),
    experience_level = 'mid',
    bio = 'Passionate developer learning to code better every day. Love solving challenging problems!',
    total_points = 375,
    weekly_points = 200,
    current_streak = 5,
    longest_streak = 12,
    challenges_completed = 3,
    updated_at = NOW()
  WHERE id = target_user_id;

  -- Create sample submissions for each challenge
  FOREACH challenge_id IN ARRAY challenge_ids
  LOOP
    INSERT INTO submissions (
      user_id,
      challenge_id,
      code,
      language,
      status,
      ai_feedback,
      score,
      execution_time_ms,
      passed_tests,
      total_tests,
      points_earned,
      submitted_at
    ) VALUES (
      target_user_id,
      challenge_id,
      '// Sample solution code\nfunction solution() {\n  return "implemented";\n}',
      'javascript',
      submission_statuses[i],
      CASE
        WHEN submission_statuses[i] = 'passed' THEN 'Great job! Your solution is efficient and well-structured. Consider adding edge case handling for even better robustness.'
        WHEN submission_statuses[i] = 'failed' THEN 'Your solution has the right approach but fails on edge cases. Review the test failures and try handling empty inputs.'
        ELSE NULL
      END,
      submission_scores[i],
      CASE WHEN submission_statuses[i] = 'passed' THEN 45 + (i * 10) ELSE NULL END,
      CASE WHEN submission_statuses[i] = 'passed' THEN 3 ELSE 1 END,
      3,
      CASE WHEN submission_statuses[i] = 'passed' THEN 100 + (i * 25) ELSE 0 END,
      NOW() - INTERVAL '1 day' * (6 - i)
    );

    i := i + 1;
    EXIT WHEN i > 5;
  END LOOP;

  -- Create roadmap progress entries
  INSERT INTO roadmap_progress (user_id, challenge_id, status, started_at, completed_at, attempts)
  SELECT
    target_user_id,
    id,
    CASE
      WHEN ROW_NUMBER() OVER (ORDER BY created_at) <= 3 THEN 'completed'::TEXT
      WHEN ROW_NUMBER() OVER (ORDER BY created_at) <= 5 THEN 'in_progress'::TEXT
      ELSE 'not_started'::TEXT
    END,
    CASE WHEN ROW_NUMBER() OVER (ORDER BY created_at) <= 5 THEN NOW() - INTERVAL '3 days' ELSE NULL END,
    CASE WHEN ROW_NUMBER() OVER (ORDER BY created_at) <= 3 THEN NOW() - INTERVAL '1 day' ELSE NULL END,
    CASE WHEN ROW_NUMBER() OVER (ORDER BY created_at) <= 3 THEN 2 ELSE 0 END
  FROM challenges
  LIMIT 10;

  -- Create or update leaderboard entry
  INSERT INTO leaderboard_entries (
    user_id,
    total_points,
    weekly_points,
    monthly_points,
    global_rank,
    weekly_rank,
    last_submission_at,
    updated_at
  ) VALUES (
    target_user_id,
    375,
    200,
    375,
    42,
    15,
    NOW() - INTERVAL '1 day',
    NOW()
  )
  ON CONFLICT (user_id)
  DO UPDATE SET
    total_points = EXCLUDED.total_points,
    weekly_points = EXCLUDED.weekly_points,
    monthly_points = EXCLUDED.monthly_points,
    global_rank = EXCLUDED.global_rank,
    weekly_rank = EXCLUDED.weekly_rank,
    last_submission_at = EXCLUDED.last_submission_at,
    updated_at = NOW();

  -- Create weekly challenge participation
  INSERT INTO weekly_challenge_participants (
    user_id,
    challenge_id,
    week_start_date,
    best_score,
    rank,
    participated_at
  )
  SELECT
    target_user_id,
    id,
    DATE_TRUNC('week', CURRENT_DATE)::DATE,
    88,
    23,
    NOW() - INTERVAL '2 days'
  FROM challenges
  WHERE is_weekly_challenge = true
  LIMIT 1
  ON CONFLICT (user_id, challenge_id, week_start_date) DO NOTHING;

  -- Create sample mock interview
  INSERT INTO mock_interviews (
    user_id,
    interview_type,
    difficulty,
    transcript,
    questions_asked,
    ai_evaluation,
    duration_minutes,
    overall_score,
    completed_at,
    created_at
  ) VALUES (
    target_user_id,
    'technical',
    'mid',
    '[{"role": "interviewer", "message": "Tell me about yourself"}, {"role": "candidate", "message": "I am a passionate developer..."}]'::JSONB,
    '["Tell me about yourself", "Explain event delegation in JavaScript", "What is the difference between var, let, and const?"]'::JSONB,
    '{"strengths": ["Clear communication", "Good technical knowledge"], "improvements": ["Provide more examples", "Be more concise"], "overall": "Strong performance with room for growth"}'::JSONB,
    25,
    78,
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '3 days'
  );

  RAISE NOTICE 'Dashboard data seeded successfully for user %', target_user_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SEED GENERIC LEADERBOARD DATA (for realistic rankings)
-- ============================================================================

-- This creates fake leaderboard entries so the dashboard shows realistic rankings
-- Note: These are not tied to real users, just for visual testing

DO $$
DECLARE
  i INT := 1;
  random_points INT;
BEGIN
  -- Create some generic leaderboard entries for visual testing
  -- These won't have associated users, but make the leaderboard look realistic
  FOR i IN 1..50 LOOP
    random_points := 1000 - (i * 20) + FLOOR(RANDOM() * 50)::INT;

    -- Note: We can't insert without valid user_ids due to foreign key constraint
    -- So we'll skip this part. Real leaderboard data comes from actual submissions.
    -- This is just a placeholder to show the intended structure.
  END LOOP;
END $$;

-- ============================================================================
-- HELPER FUNCTION TO SEED CURRENT USER
-- ============================================================================

-- Function to seed data for the currently authenticated user
-- Usage in SQL Editor (when logged in):
-- SELECT seed_current_user_data();

CREATE OR REPLACE FUNCTION seed_current_user_data()
RETURNS TEXT AS $$
DECLARE
  current_user_id UUID;
BEGIN
  -- Get the current user's ID from Supabase auth
  current_user_id := auth.uid();

  IF current_user_id IS NULL THEN
    RETURN 'Error: No authenticated user found. Please log in first.';
  END IF;

  -- Check if user has a profile
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = current_user_id) THEN
    RETURN 'Error: User profile not found. Profile should be created automatically on signup.';
  END IF;

  -- Seed the dashboard data
  PERFORM seed_user_dashboard_data(current_user_id);

  RETURN 'Success: Dashboard data seeded for user ' || current_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON FUNCTION seed_user_dashboard_data(UUID) IS 'Seeds dashboard data (submissions, progress, leaderboard) for a specific user ID';
COMMENT ON FUNCTION seed_current_user_data() IS 'Seeds dashboard data for the currently authenticated user - safe to call from SQL Editor';

-- ============================================================================
-- USAGE INSTRUCTIONS
-- ============================================================================

/*
To seed data for testing:

1. From the Supabase SQL Editor (when logged in as a user):
   SELECT seed_current_user_data();

2. Or from a server function/API with a specific user ID:
   SELECT seed_user_dashboard_data('your-user-id-here');

This will create:
- Updated user profile with stats
- 5 sample submissions (3 passed, 1 failed, 1 pending)
- Roadmap progress for 10 challenges
- Leaderboard entry with rank
- Weekly challenge participation
- 1 completed mock interview

The data is realistic and will make the dashboard look fully populated for testing.
*/
