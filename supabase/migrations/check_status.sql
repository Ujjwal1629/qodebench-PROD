-- Quick Database Status Check
-- Run this in Supabase SQL Editor to see what's currently in your database

-- Check which tables exist
SELECT 'Tables that exist:' as info;
SELECT tablename
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'user_profiles', 'challenges', 'submissions', 'leaderboard_entries')
ORDER BY tablename;

-- Check if profiles table exists
SELECT 'Profiles table structure:' as info;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- Check which triggers exist
SELECT 'Triggers on auth.users:' as info;
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers
WHERE event_object_table = 'users'
AND trigger_schema = 'auth';

-- Check if handle_new_user function exists
SELECT 'Functions that exist:' as info;
SELECT proname as function_name
FROM pg_proc
WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
AND proname LIKE '%user%'
OR proname LIKE '%profile%';

-- Check RLS policies on profiles
SELECT 'RLS Policies on profiles:' as info;
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'user_profiles');
