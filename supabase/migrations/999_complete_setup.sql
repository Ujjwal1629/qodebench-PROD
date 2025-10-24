-- COMPLETE QODEBENCH DATABASE SETUP
-- This script does everything in one go:
-- 1. Cleans up any existing tables
-- 2. Creates all tables
-- 3. Sets up triggers
-- 4. Enables RLS and policies
--
-- Just copy this entire file and run it in Supabase SQL Editor

-- ============================================================================
-- STEP 1: CLEANUP (Remove existing schema)
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE 'Starting cleanup...';
END $$;

-- Disable triggers temporarily
SET session_replication_role = 'replica';

-- Drop tables if they exist
DROP TABLE IF EXISTS weekly_challenge_participants CASCADE;
DROP TABLE IF EXISTS roadmap_progress CASCADE;
DROP TABLE IF EXISTS mock_interviews CASCADE;
DROP TABLE IF EXISTS leaderboard_entries CASCADE;
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS challenges CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS update_user_points() CASCADE;
DROP FUNCTION IF EXISTS update_leaderboard() CASCADE;
DROP FUNCTION IF EXISTS reset_weekly_points() CASCADE;
DROP FUNCTION IF EXISTS reset_monthly_points() CASCADE;
DROP FUNCTION IF EXISTS update_user_streak() CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Drop old enum
DROP TYPE IF EXISTS experience_level CASCADE;

-- Re-enable triggers
SET session_replication_role = 'origin';

DO $$
BEGIN
    RAISE NOTICE '✅ Cleanup completed';
END $$;

-- ============================================================================
-- STEP 2: ENABLE EXTENSIONS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$
BEGIN
    RAISE NOTICE '✅ Extensions enabled';
END $$;

-- ============================================================================
-- STEP 3: CREATE TABLES
-- ============================================================================

-- PROFILES TABLE
CREATE TABLE profiles (
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

-- CHALLENGES TABLE
CREATE TABLE challenges (
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
    estimated_time INTEGER,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    is_weekly_challenge BOOLEAN DEFAULT FALSE NOT NULL,
    weekly_challenge_date DATE,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- SUBMISSIONS TABLE
CREATE TABLE submissions (
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

-- LEADERBOARD TABLE
CREATE TABLE leaderboard_entries (
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

-- MOCK INTERVIEWS TABLE
CREATE TABLE mock_interviews (
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

-- ROADMAP PROGRESS TABLE
CREATE TABLE roadmap_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('not_started', 'in_progress', 'completed')),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    attempts INTEGER DEFAULT 0 NOT NULL,
    UNIQUE(user_id, challenge_id)
);

-- WEEKLY CHALLENGE PARTICIPANTS TABLE
CREATE TABLE weekly_challenge_participants (
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

DO $$
BEGIN
    RAISE NOTICE '✅ All 7 tables created';
END $$;

-- ============================================================================
-- STEP 4: CREATE INDEXES
-- ============================================================================

-- Profiles indexes
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_experience_level ON profiles(experience_level);

-- Submissions indexes
CREATE INDEX idx_submissions_user_challenge ON submissions(user_id, challenge_id);
CREATE INDEX idx_submissions_user_id ON submissions(user_id);
CREATE INDEX idx_submissions_challenge_id ON submissions(challenge_id);
CREATE INDEX idx_submissions_status ON submissions(status);

-- Challenges indexes
CREATE INDEX idx_challenges_category_difficulty ON challenges(category, difficulty);
CREATE INDEX idx_challenges_slug ON challenges(slug);
CREATE INDEX idx_challenges_weekly ON challenges(is_weekly_challenge, weekly_challenge_date);

-- Leaderboard indexes
CREATE INDEX idx_leaderboard_total_points ON leaderboard_entries(total_points DESC);
CREATE INDEX idx_leaderboard_weekly_points ON leaderboard_entries(weekly_points DESC);
CREATE INDEX idx_leaderboard_user_id ON leaderboard_entries(user_id);

DO $$
BEGIN
    RAISE NOTICE '✅ Indexes created';
END $$;

-- ============================================================================
-- STEP 5: CREATE FUNCTIONS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update user points when submission passes
CREATE OR REPLACE FUNCTION update_user_points()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'passed' THEN
        -- Update profile points
        UPDATE profiles
        SET
            total_points = total_points + NEW.points_earned,
            weekly_points = weekly_points + NEW.points_earned,
            challenges_completed = challenges_completed + 1,
            updated_at = NOW()
        WHERE id = NEW.user_id;

        -- Update leaderboard
        INSERT INTO leaderboard_entries (user_id, total_points, weekly_points, monthly_points, last_submission_at)
        VALUES (NEW.user_id, NEW.points_earned, NEW.points_earned, NEW.points_earned, NEW.submitted_at)
        ON CONFLICT (user_id)
        DO UPDATE SET
            total_points = leaderboard_entries.total_points + NEW.points_earned,
            weekly_points = leaderboard_entries.weekly_points + NEW.points_earned,
            monthly_points = leaderboard_entries.monthly_points + NEW.points_earned,
            last_submission_at = NEW.submitted_at,
            updated_at = NOW();

        -- Update roadmap progress
        INSERT INTO roadmap_progress (user_id, challenge_id, status, started_at, completed_at, attempts)
        VALUES (NEW.user_id, NEW.challenge_id, 'completed', NOW(), NOW(), 1)
        ON CONFLICT (user_id, challenge_id)
        DO UPDATE SET
            status = 'completed',
            completed_at = NOW(),
            attempts = roadmap_progress.attempts + 1;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to handle new user signup
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

DO $$
BEGIN
    RAISE NOTICE '✅ Functions created';
END $$;

-- ============================================================================
-- STEP 6: CREATE TRIGGERS
-- ============================================================================

-- Trigger to update updated_at on profiles
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update updated_at on challenges
CREATE TRIGGER update_challenges_updated_at
    BEFORE UPDATE ON challenges
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update user points after submission
CREATE TRIGGER trigger_update_user_points
    AFTER INSERT ON submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_user_points();

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

DO $$
BEGIN
    RAISE NOTICE '✅ Triggers created';
END $$;

-- ============================================================================
-- STEP 7: ENABLE RLS
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_challenge_participants ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    RAISE NOTICE '✅ RLS enabled on all tables';
END $$;

-- ============================================================================
-- STEP 8: CREATE RLS POLICIES
-- ============================================================================

-- PROFILES POLICIES
CREATE POLICY "Profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- CHALLENGES POLICIES
CREATE POLICY "Active challenges are viewable by everyone"
    ON challenges FOR SELECT
    USING (is_active = true OR auth.uid() = created_by);

CREATE POLICY "Authenticated users can create challenges"
    ON challenges FOR INSERT
    WITH CHECK (auth.uid() = created_by);

-- SUBMISSIONS POLICIES
CREATE POLICY "Users can view their own submissions"
    ON submissions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own submissions"
    ON submissions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- LEADERBOARD POLICIES
CREATE POLICY "Leaderboard is viewable by everyone"
    ON leaderboard_entries FOR SELECT
    USING (true);

CREATE POLICY "System can manage leaderboard"
    ON leaderboard_entries FOR ALL
    USING (true)
    WITH CHECK (true);

-- MOCK INTERVIEWS POLICIES
CREATE POLICY "Users can view their own interviews"
    ON mock_interviews FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own interviews"
    ON mock_interviews FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ROADMAP PROGRESS POLICIES
CREATE POLICY "Users can view their own progress"
    ON roadmap_progress FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
    ON roadmap_progress FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
    ON roadmap_progress FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- WEEKLY CHALLENGE PARTICIPANTS POLICIES
CREATE POLICY "Weekly participants are viewable by everyone"
    ON weekly_challenge_participants FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own participation"
    ON weekly_challenge_participants FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DO $$
BEGIN
    RAISE NOTICE '✅ RLS policies created';
END $$;

-- ============================================================================
-- STEP 9: GRANT PERMISSIONS
-- ============================================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON profiles TO anon, authenticated;
GRANT ALL ON profiles TO authenticated;
GRANT SELECT ON challenges TO anon, authenticated;
GRANT SELECT, INSERT ON submissions TO authenticated;
GRANT SELECT ON leaderboard_entries TO anon, authenticated;

DO $$
BEGIN
    RAISE NOTICE '✅ Permissions granted';
END $$;

-- ============================================================================
-- FINAL SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ DATABASE SETUP COMPLETED SUCCESSFULLY!';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE 'Created:';
    RAISE NOTICE '  ✓ 7 tables';
    RAISE NOTICE '  ✓ 15+ indexes';
    RAISE NOTICE '  ✓ 3 functions';
    RAISE NOTICE '  ✓ 4 triggers';
    RAISE NOTICE '  ✓ RLS policies on all tables';
    RAISE NOTICE '';
    RAISE NOTICE 'You can now:';
    RAISE NOTICE '  1. Try signing up in your app';
    RAISE NOTICE '  2. Profile will be created automatically';
    RAISE NOTICE '  3. Start building features!';
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
END $$;

-- Verify tables exist
SELECT
    'Tables created:' as status,
    COUNT(*) as count
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'challenges', 'submissions', 'leaderboard_entries', 'mock_interviews', 'roadmap_progress', 'weekly_challenge_participants');
