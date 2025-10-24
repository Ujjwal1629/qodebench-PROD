-- DEBUG: Check what's actually in the database

-- 1. Check if profiles table exists
SELECT
    'PROFILES TABLE CHECK' as test,
    CASE
        WHEN EXISTS (
            SELECT FROM pg_tables
            WHERE schemaname = 'public'
            AND tablename = 'profiles'
        )
        THEN '✅ EXISTS'
        ELSE '❌ DOES NOT EXIST'
    END as status;

-- 2. Check profiles table structure
SELECT
    'PROFILES COLUMNS' as test,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 3. Check RLS status
SELECT
    'RLS STATUS' as test,
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'profiles';

-- 4. Check RLS policies
SELECT
    'RLS POLICIES' as test,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'profiles';

-- 5. Check if trigger exists
SELECT
    'AUTH USER TRIGGER CHECK' as test,
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'auth'
AND event_object_table = 'users'
AND trigger_name = 'on_auth_user_created';

-- 6. Check if handle_new_user function exists
SELECT
    'HANDLE_NEW_USER FUNCTION' as test,
    proname as function_name,
    prosrc as function_body
FROM pg_proc
WHERE proname = 'handle_new_user';

-- 7. List ALL tables in public schema
SELECT
    'ALL PUBLIC TABLES' as test,
    tablename
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- 8. Try to select from profiles (this will show permission issue if any)
SELECT
    'TEST SELECT FROM PROFILES' as test,
    COUNT(*) as row_count
FROM profiles;
