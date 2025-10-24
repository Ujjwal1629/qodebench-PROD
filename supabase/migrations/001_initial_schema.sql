-- QodeBench Database Schema Migration
-- Execute this in Supabase SQL Editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLES
-- ============================================================================

-- 1. PROFILES TABLE (extends auth.users)
-- ============================================================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    experience_level TEXT CHECK (experience_level IN ('intern', 'junior', 'mid', 'senior')),
    bio TEXT,
    total_points INTEGER DEFAULT 0 NOT NULL,
    weekly_points INTEGER DEFAULT 0 NOT NULL,
    current_streak INTEGER DEFAULT 0 NOT NULL,
    longest_streak INTEGER DEFAULT 0 NOT NULL,
    challenges_completed INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE profiles IS 'User profiles extending auth.users with QodeBench-specific data';

-- 2. CHALLENGES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    category TEXT NOT NULL CHECK (category IN ('office', 'python', 'javascript', 'react', 'nextjs', 'nodejs')),
    points INTEGER NOT NULL,
    starter_code JSONB DEFAULT '{}' NOT NULL,
    test_cases JSONB DEFAULT '[]' NOT NULL,
    hints JSONB DEFAULT '[]' NOT NULL,
    solution_explanation TEXT,
    learning_objectives TEXT[] DEFAULT '{}',
    estimated_time INTEGER, -- in minutes
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    is_weekly_challenge BOOLEAN DEFAULT FALSE NOT NULL,
    weekly_challenge_date DATE,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT weekly_challenge_date_required CHECK (
        (is_weekly_challenge = FALSE) OR
        (is_weekly_challenge = TRUE AND weekly_challenge_date IS NOT NULL)
    )
);

COMMENT ON TABLE challenges IS 'Coding challenges with test cases and AI evaluation criteria';

-- 3. SUBMISSIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    language TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'passed', 'failed', 'error')),
    ai_feedback TEXT,
    score INTEGER CHECK (score >= 0 AND score <= 100),
    execution_time_ms INTEGER,
    passed_tests INTEGER DEFAULT 0 NOT NULL,
    total_tests INTEGER NOT NULL,
    points_earned INTEGER DEFAULT 0 NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE submissions IS 'User code submissions with test results and AI feedback';

-- 4. LEADERBOARD_ENTRIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS leaderboard_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    total_points INTEGER DEFAULT 0 NOT NULL,
    weekly_points INTEGER DEFAULT 0 NOT NULL,
    monthly_points INTEGER DEFAULT 0 NOT NULL,
    global_rank INTEGER,
    weekly_rank INTEGER,
    last_submission_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE leaderboard_entries IS 'Leaderboard rankings with weekly, monthly, and global scores';

-- 5. MOCK_INTERVIEWS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS mock_interviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    interview_type TEXT NOT NULL CHECK (interview_type IN ('behavioral', 'technical', 'system_design')),
    difficulty TEXT NOT NULL CHECK (difficulty IN ('junior', 'mid', 'senior')),
    transcript JSONB DEFAULT '[]' NOT NULL,
    questions_asked JSONB DEFAULT '[]' NOT NULL,
    ai_evaluation JSONB,
    duration_minutes INTEGER,
    overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE mock_interviews IS 'AI-powered mock interview sessions with evaluations';

-- 6. ROADMAP_PROGRESS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS roadmap_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('not_started', 'in_progress', 'completed')),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    attempts INTEGER DEFAULT 0 NOT NULL,
    UNIQUE(user_id, challenge_id)
);

COMMENT ON TABLE roadmap_progress IS 'User progress tracking for learning roadmap';

-- 7. WEEKLY_CHALLENGE_PARTICIPANTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS weekly_challenge_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    week_start_date DATE NOT NULL,
    best_score INTEGER CHECK (best_score >= 0 AND best_score <= 100),
    best_submission_id UUID REFERENCES submissions(id) ON DELETE SET NULL,
    rank INTEGER,
    participated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, challenge_id, week_start_date)
);

COMMENT ON TABLE weekly_challenge_participants IS 'Weekly challenge participation and rankings';

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_experience_level ON profiles(experience_level);

CREATE INDEX IF NOT EXISTS idx_submissions_user_challenge ON submissions(user_id, challenge_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_challenge_id ON submissions(challenge_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_submitted_at ON submissions(submitted_at DESC);

CREATE INDEX IF NOT EXISTS idx_challenges_category_difficulty ON challenges(category, difficulty);
CREATE INDEX IF NOT EXISTS idx_challenges_difficulty ON challenges(difficulty);
CREATE INDEX IF NOT EXISTS idx_challenges_category ON challenges(category);
CREATE INDEX IF NOT EXISTS idx_challenges_slug ON challenges(slug);
CREATE INDEX IF NOT EXISTS idx_challenges_is_active ON challenges(is_active);
CREATE INDEX IF NOT EXISTS idx_challenges_weekly ON challenges(is_weekly_challenge, weekly_challenge_date);

CREATE INDEX IF NOT EXISTS idx_leaderboard_total_points ON leaderboard_entries(total_points DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_weekly_points ON leaderboard_entries(weekly_points DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_monthly_points ON leaderboard_entries(monthly_points DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_user_id ON leaderboard_entries(user_id);

CREATE INDEX IF NOT EXISTS idx_mock_interviews_user_id ON mock_interviews(user_id);
CREATE INDEX IF NOT EXISTS idx_mock_interviews_type ON mock_interviews(interview_type);
CREATE INDEX IF NOT EXISTS idx_mock_interviews_completed_at ON mock_interviews(completed_at DESC);

CREATE INDEX IF NOT EXISTS idx_roadmap_progress_user_id ON roadmap_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_progress_status ON roadmap_progress(user_id, status);

CREATE INDEX IF NOT EXISTS idx_weekly_participants_week ON weekly_challenge_participants(week_start_date, rank);
CREATE INDEX IF NOT EXISTS idx_weekly_participants_user ON weekly_challenge_participants(user_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_challenge_participants ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
-- Users can read all profiles (for leaderboard, etc.)
CREATE POLICY "Profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- CHALLENGES POLICIES
-- Everyone can view active challenges
CREATE POLICY "Active challenges are viewable by everyone"
    ON challenges FOR SELECT
    USING (is_active = true OR auth.uid() = created_by);

-- Authenticated users can insert challenges (for admin/creator role)
CREATE POLICY "Authenticated users can create challenges"
    ON challenges FOR INSERT
    WITH CHECK (auth.uid() = created_by);

-- Challenge creators can update their challenges
CREATE POLICY "Challenge creators can update their challenges"
    ON challenges FOR UPDATE
    USING (auth.uid() = created_by)
    WITH CHECK (auth.uid() = created_by);

-- SUBMISSIONS POLICIES
-- Users can view their own submissions
CREATE POLICY "Users can view their own submissions"
    ON submissions FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own submissions
CREATE POLICY "Users can insert their own submissions"
    ON submissions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- LEADERBOARD POLICIES
-- Leaderboard is publicly readable
CREATE POLICY "Leaderboard is viewable by everyone"
    ON leaderboard_entries FOR SELECT
    USING (true);

-- System can insert/update leaderboard (via service role or triggers)
CREATE POLICY "System can manage leaderboard"
    ON leaderboard_entries FOR ALL
    USING (true)
    WITH CHECK (true);

-- MOCK INTERVIEWS POLICIES
-- Users can view their own interviews
CREATE POLICY "Users can view their own interviews"
    ON mock_interviews FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own interviews
CREATE POLICY "Users can insert their own interviews"
    ON mock_interviews FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own interviews
CREATE POLICY "Users can update their own interviews"
    ON mock_interviews FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ROADMAP PROGRESS POLICIES
-- Users can view their own progress
CREATE POLICY "Users can view their own progress"
    ON roadmap_progress FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own progress
CREATE POLICY "Users can insert their own progress"
    ON roadmap_progress FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own progress
CREATE POLICY "Users can update their own progress"
    ON roadmap_progress FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- WEEKLY CHALLENGE PARTICIPANTS POLICIES
-- Everyone can view weekly challenge participants (for rankings)
CREATE POLICY "Weekly participants are viewable by everyone"
    ON weekly_challenge_participants FOR SELECT
    USING (true);

-- Users can insert their own participation
CREATE POLICY "Users can insert their own participation"
    ON weekly_challenge_participants FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- System can update participation records
CREATE POLICY "System can update participation"
    ON weekly_challenge_participants FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_challenges_updated_at
    BEFORE UPDATE ON challenges
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leaderboard_updated_at
    BEFORE UPDATE ON leaderboard_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to update user points when submission passes
CREATE OR REPLACE FUNCTION update_user_points()
RETURNS TRIGGER AS $$
BEGIN
    -- Only process if submission passed
    IF NEW.status = 'passed' THEN
        -- Update profile points and challenges completed
        UPDATE profiles
        SET
            total_points = total_points + NEW.points_earned,
            weekly_points = weekly_points + NEW.points_earned,
            challenges_completed = challenges_completed + 1,
            updated_at = NOW()
        WHERE id = NEW.user_id;

        -- Update or insert leaderboard entry
        INSERT INTO leaderboard_entries (user_id, total_points, weekly_points, monthly_points, last_submission_at)
        VALUES (NEW.user_id, NEW.points_earned, NEW.points_earned, NEW.points_earned, NEW.submitted_at)
        ON CONFLICT (user_id)
        DO UPDATE SET
            total_points = leaderboard_entries.total_points + NEW.points_earned,
            weekly_points = leaderboard_entries.weekly_points + NEW.points_earned,
            monthly_points = leaderboard_entries.monthly_points + NEW.points_earned,
            last_submission_at = NEW.submitted_at,
            updated_at = NOW();

        -- Update roadmap progress to completed
        INSERT INTO roadmap_progress (user_id, challenge_id, status, started_at, completed_at, attempts)
        VALUES (NEW.user_id, NEW.challenge_id, 'completed', NOW(), NOW(), 1)
        ON CONFLICT (user_id, challenge_id)
        DO UPDATE SET
            status = 'completed',
            completed_at = NOW(),
            attempts = roadmap_progress.attempts + 1;

        -- Update weekly challenge participants if applicable
        UPDATE weekly_challenge_participants
        SET
            best_score = GREATEST(COALESCE(best_score, 0), NEW.score),
            best_submission_id = CASE
                WHEN NEW.score > COALESCE(best_score, 0) THEN NEW.id
                ELSE best_submission_id
            END
        WHERE user_id = NEW.user_id
        AND challenge_id = NEW.challenge_id
        AND week_start_date = DATE_TRUNC('week', NEW.submitted_at)::DATE;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update user points after submission
CREATE TRIGGER trigger_update_user_points
    AFTER INSERT ON submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_user_points();

-- Function to update leaderboard ranks
CREATE OR REPLACE FUNCTION update_leaderboard()
RETURNS void AS $$
BEGIN
    -- Update global ranks
    WITH ranked_users AS (
        SELECT
            user_id,
            ROW_NUMBER() OVER (ORDER BY total_points DESC, last_submission_at ASC) as rank
        FROM leaderboard_entries
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

    -- Update weekly challenge participant ranks
    WITH weekly_challenge_ranks AS (
        SELECT
            id,
            ROW_NUMBER() OVER (
                PARTITION BY challenge_id, week_start_date
                ORDER BY best_score DESC, participated_at ASC
            ) as rank
        FROM weekly_challenge_participants
    )
    UPDATE weekly_challenge_participants wcp
    SET rank = wcr.rank
    FROM weekly_challenge_ranks wcr
    WHERE wcp.id = wcr.id;
END;
$$ LANGUAGE plpgsql;

-- Function to reset weekly points (to be scheduled)
CREATE OR REPLACE FUNCTION reset_weekly_points()
RETURNS void AS $$
BEGIN
    -- Reset weekly points in profiles
    UPDATE profiles
    SET
        weekly_points = 0,
        updated_at = NOW();

    -- Reset weekly points in leaderboard
    UPDATE leaderboard_entries
    SET
        weekly_points = 0,
        weekly_rank = NULL,
        updated_at = NOW();

    -- Recalculate leaderboard
    PERFORM update_leaderboard();
END;
$$ LANGUAGE plpgsql;

-- Function to reset monthly points (to be scheduled)
CREATE OR REPLACE FUNCTION reset_monthly_points()
RETURNS void AS $$
BEGIN
    -- Reset monthly points in leaderboard
    UPDATE leaderboard_entries
    SET
        monthly_points = 0,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to update user streak
CREATE OR REPLACE FUNCTION update_user_streak()
RETURNS void AS $$
BEGIN
    WITH user_streaks AS (
        SELECT
            user_id,
            CASE
                WHEN MAX(submitted_at)::DATE = CURRENT_DATE
                    OR MAX(submitted_at)::DATE = CURRENT_DATE - INTERVAL '1 day'
                THEN (
                    SELECT COUNT(DISTINCT submitted_at::DATE)
                    FROM submissions s2
                    WHERE s2.user_id = submissions.user_id
                    AND s2.status = 'passed'
                    AND s2.submitted_at >= (
                        SELECT COALESCE(
                            MAX(break_date),
                            MIN(submitted_at)
                        )
                        FROM (
                            SELECT
                                user_id,
                                submitted_at::DATE as break_date
                            FROM submissions
                            WHERE status = 'passed'
                        ) breaks
                        WHERE breaks.user_id = submissions.user_id
                        AND NOT EXISTS (
                            SELECT 1
                            FROM submissions s3
                            WHERE s3.user_id = breaks.user_id
                            AND s3.status = 'passed'
                            AND s3.submitted_at::DATE = breaks.break_date - INTERVAL '1 day'
                        )
                    )
                )
                ELSE 0
            END as current_streak
        FROM submissions
        WHERE status = 'passed'
        GROUP BY user_id
    )
    UPDATE profiles p
    SET
        current_streak = us.current_streak,
        longest_streak = GREATEST(p.longest_streak, us.current_streak),
        updated_at = NOW()
    FROM user_streaks us
    WHERE p.id = us.user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to handle new user signup (create profile automatically)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, username, full_name, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- INITIAL DATA (OPTIONAL)
-- ============================================================================

-- Note: You can add seed data here if needed
-- Example: INSERT INTO challenges (title, slug, description, ...) VALUES (...);

-- ============================================================================
-- SCHEDULED JOBS SETUP (USING PG_CRON)
-- ============================================================================

-- Note: Enable pg_cron extension in Supabase Dashboard first
-- Then run these commands in SQL Editor:

-- SELECT cron.schedule(
--     'reset-weekly-points',
--     '0 0 * * 1', -- Every Monday at midnight UTC
--     $$ SELECT reset_weekly_points(); $$
-- );

-- SELECT cron.schedule(
--     'reset-monthly-points',
--     '0 0 1 * *', -- First day of every month at midnight UTC
--     $$ SELECT reset_monthly_points(); $$
-- );

-- SELECT cron.schedule(
--     'update-leaderboard-ranks',
--     '*/30 * * * *', -- Every 30 minutes
--     $$ SELECT update_leaderboard(); $$
-- );

-- SELECT cron.schedule(
--     'update-user-streaks',
--     '0 1 * * *', -- Every day at 1 AM UTC
--     $$ SELECT update_user_streak(); $$
-- );

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant permissions on tables
GRANT SELECT ON profiles TO anon, authenticated;
GRANT ALL ON profiles TO authenticated;

GRANT SELECT ON challenges TO anon, authenticated;
GRANT ALL ON challenges TO authenticated;

GRANT SELECT, INSERT ON submissions TO authenticated;
GRANT ALL ON submissions TO authenticated;

GRANT SELECT ON leaderboard_entries TO anon, authenticated;

GRANT SELECT, INSERT, UPDATE ON mock_interviews TO authenticated;

GRANT SELECT, INSERT, UPDATE ON roadmap_progress TO authenticated;

GRANT SELECT ON weekly_challenge_participants TO anon, authenticated;
GRANT INSERT ON weekly_challenge_participants TO authenticated;

-- Grant execute on functions
GRANT EXECUTE ON FUNCTION update_leaderboard() TO authenticated;
GRANT EXECUTE ON FUNCTION update_user_streak() TO authenticated;

-- ============================================================================
-- COMMENTS AND DOCUMENTATION
-- ============================================================================

COMMENT ON FUNCTION update_user_points() IS 'Automatically updates user points, leaderboard, and progress when a submission passes';
COMMENT ON FUNCTION update_leaderboard() IS 'Recalculates global and weekly leaderboard ranks';
COMMENT ON FUNCTION reset_weekly_points() IS 'Resets weekly points for all users (scheduled for Mondays)';
COMMENT ON FUNCTION reset_monthly_points() IS 'Resets monthly points for all users (scheduled for 1st of month)';
COMMENT ON FUNCTION update_user_streak() IS 'Updates user streak based on daily submission activity';
COMMENT ON FUNCTION handle_new_user() IS 'Automatically creates a profile when a new user signs up';
