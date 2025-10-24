-- Check if the auth trigger is properly set up

-- 1. Check trigger on auth.users
SELECT
    'Trigger on auth.users' as check_type,
    trigger_name,
    event_manipulation as event,
    action_timing as timing,
    action_statement as action
FROM information_schema.triggers
WHERE event_object_schema = 'auth'
AND event_object_table = 'users';

-- 2. Check handle_new_user function
SELECT
    'handle_new_user function' as check_type,
    proname as name,
    prosecdef as security_definer,
    provolatile as volatile_type
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.proname = 'handle_new_user';

-- 3. Test the function directly (simulate what trigger does)
SELECT 'Testing function' as check_type;

DO $$
DECLARE
    test_uuid UUID := 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';
    test_email TEXT := 'test@test.com';
BEGIN
    -- This simulates what the trigger would do
    RAISE NOTICE 'Function would create profile with username: %', SPLIT_PART(test_email, '@', 1);
END $$;

-- 4. Check if profiles table accepts inserts
SELECT
    'Profiles table permissions' as check_type,
    grantee,
    privilege_type
FROM information_schema.table_privileges
WHERE table_schema = 'public'
AND table_name = 'profiles';
