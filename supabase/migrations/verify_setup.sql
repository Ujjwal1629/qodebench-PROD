-- QodeBench Database Setup Verification Script
-- Run this after executing the migrations to verify everything is working

-- ============================================================================
-- 1. VERIFY ALL TABLES EXIST
-- ============================================================================

SELECT
    'Tables Check' as check_type,
    CASE
        WHEN COUNT(*) = 7 THEN '✅ PASS'
        ELSE '❌ FAIL'
    END as status,
    COUNT(*) as found,
    7 as expected,
    ARRAY_AGG(tablename ORDER BY tablename) as tables
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN (
    'profiles',
    'challenges',
    'submissions',
    'leaderboard_entries',
    'mock_interviews',
    'roadmap_progress',
    'weekly_challenge_participants'
);

-- ============================================================================
-- 2. VERIFY ROW LEVEL SECURITY IS ENABLED
-- ============================================================================

SELECT
    'RLS Check' as check_type,
    CASE
        WHEN COUNT(*) = 7 AND MIN(rowsecurity::int) = 1 THEN '✅ PASS'
        ELSE '❌ FAIL'
    END as status,
    COUNT(CASE WHEN rowsecurity THEN 1 END) as enabled_count,
    7 as expected_count,
    ARRAY_AGG(tablename ORDER BY tablename) FILTER (WHERE NOT rowsecurity) as tables_without_rls
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN (
    'profiles',
    'challenges',
    'submissions',
    'leaderboard_entries',
    'mock_interviews',
    'roadmap_progress',
    'weekly_challenge_participants'
);

-- ============================================================================
-- 3. VERIFY INDEXES EXIST
-- ============================================================================

SELECT
    'Indexes Check' as check_type,
    CASE
        WHEN COUNT(*) >= 20 THEN '✅ PASS'
        ELSE '⚠️  WARNING - Expected at least 20 indexes'
    END as status,
    COUNT(*) as found,
    'at least 20' as expected
FROM pg_indexes
WHERE schemaname = 'public'
AND indexname NOT LIKE '%_pkey';

-- Detailed index list
SELECT
    'Index Details' as info_type,
    tablename,
    indexname
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- ============================================================================
-- 4. VERIFY FUNCTIONS EXIST
-- ============================================================================

SELECT
    'Functions Check' as check_type,
    CASE
        WHEN COUNT(*) >= 6 THEN '✅ PASS'
        ELSE '❌ FAIL'
    END as status,
    COUNT(*) as found,
    'at least 6' as expected,
    ARRAY_AGG(proname ORDER BY proname) as functions
FROM pg_proc
WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
AND proname IN (
    'update_user_points',
    'update_leaderboard',
    'reset_weekly_points',
    'reset_monthly_points',
    'update_user_streak',
    'handle_new_user',
    'update_updated_at_column'
);

-- ============================================================================
-- 5. VERIFY TRIGGERS EXIST
-- ============================================================================

SELECT
    'Triggers Check' as check_type,
    CASE
        WHEN COUNT(*) >= 4 THEN '✅ PASS'
        ELSE '❌ FAIL'
    END as status,
    COUNT(*) as found,
    'at least 4' as expected,
    ARRAY_AGG(tgname ORDER BY tgname) as triggers
FROM pg_trigger
JOIN pg_class ON pg_trigger.tgrelid = pg_class.oid
WHERE pg_class.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

-- Detailed trigger list
SELECT
    'Trigger Details' as info_type,
    pg_class.relname as table_name,
    pg_trigger.tgname as trigger_name,
    pg_proc.proname as function_name
FROM pg_trigger
JOIN pg_class ON pg_trigger.tgrelid = pg_class.oid
JOIN pg_proc ON pg_trigger.tgfoid = pg_proc.oid
WHERE pg_class.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
ORDER BY table_name, trigger_name;

-- ============================================================================
-- 6. VERIFY RLS POLICIES EXIST
-- ============================================================================

SELECT
    'RLS Policies Check' as check_type,
    CASE
        WHEN COUNT(*) >= 15 THEN '✅ PASS'
        ELSE '⚠️  WARNING - Expected at least 15 policies'
    END as status,
    COUNT(*) as found,
    'at least 15' as expected
FROM pg_policies
WHERE schemaname = 'public';

-- Detailed policies by table
SELECT
    'Policy Details' as info_type,
    tablename,
    COUNT(*) as policy_count,
    ARRAY_AGG(policyname ORDER BY policyname) as policies
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;

-- ============================================================================
-- 7. VERIFY SEED DATA (if 002_seed_data.sql was run)
-- ============================================================================

SELECT
    'Seed Data Check' as check_type,
    CASE
        WHEN COUNT(*) > 0 THEN '✅ PASS'
        ELSE '⚠️  No seed data found (run 002_seed_data.sql)'
    END as status,
    COUNT(*) as challenges_found
FROM challenges;

-- List seeded challenges
SELECT
    'Seeded Challenges' as info_type,
    id,
    title,
    difficulty,
    category,
    points,
    is_active,
    is_weekly_challenge
FROM challenges
ORDER BY category, difficulty;

-- ============================================================================
-- 8. VERIFY EXTENSIONS
-- ============================================================================

SELECT
    'Extensions Check' as check_type,
    CASE
        WHEN COUNT(*) >= 1 THEN '✅ PASS'
        ELSE '❌ FAIL - uuid-ossp extension not found'
    END as status,
    ARRAY_AGG(extname) as extensions_found
FROM pg_extension
WHERE extname IN ('uuid-ossp', 'pg_cron');

-- ============================================================================
-- 9. CHECK FOR SCHEDULED JOBS (if pg_cron is enabled)
-- ============================================================================

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
        RAISE NOTICE 'Checking scheduled jobs...';
    ELSE
        RAISE NOTICE '⚠️  pg_cron not enabled - scheduled jobs not configured';
        RAISE NOTICE 'Enable pg_cron in Supabase Dashboard → Database → Extensions';
    END IF;
END $$;

-- View scheduled jobs (only if pg_cron is enabled)
-- Uncomment if pg_cron is enabled:
-- SELECT
--     'Scheduled Jobs' as info_type,
--     jobid,
--     schedule,
--     command,
--     active
-- FROM cron.job
-- ORDER BY jobid;

-- ============================================================================
-- 10. VERIFY FOREIGN KEY CONSTRAINTS
-- ============================================================================

SELECT
    'Foreign Keys Check' as check_type,
    CASE
        WHEN COUNT(*) >= 10 THEN '✅ PASS'
        ELSE '⚠️  WARNING - Expected at least 10 foreign keys'
    END as status,
    COUNT(*) as found
FROM information_schema.table_constraints
WHERE constraint_schema = 'public'
AND constraint_type = 'FOREIGN KEY';

-- Detailed foreign keys
SELECT
    'Foreign Key Details' as info_type,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;

-- ============================================================================
-- SUMMARY
-- ============================================================================

SELECT
    '
    ============================================
    VERIFICATION COMPLETE
    ============================================

    Review the results above to ensure:
    ✅ All 7 tables exist
    ✅ RLS is enabled on all tables
    ✅ Indexes are created (at least 20)
    ✅ Functions exist (at least 6)
    ✅ Triggers exist (at least 4)
    ✅ RLS policies exist (at least 15)
    ✅ Foreign keys exist (at least 10)
    ✅ Extensions installed (uuid-ossp)
    ✅ Seed data loaded (optional)

    Next steps:
    1. Enable pg_cron extension if not already enabled
    2. Schedule automated jobs (see README.md)
    3. Generate TypeScript types
    4. Test authentication flow
    5. Test submission workflow

    ============================================
    ' as summary;
