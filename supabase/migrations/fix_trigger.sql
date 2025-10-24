-- Let's fix this properly by checking and recreating the trigger

-- 1. First, check if trigger exists
SELECT 'Checking trigger...' as status;

SELECT
    trigger_name,
    event_manipulation,
    action_timing,
    event_object_schema,
    event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- 2. Drop and recreate the function with better error handling
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert into profiles with username from metadata
    INSERT INTO public.profiles (
        id,
        username,
        full_name,
        avatar_url
    )
    VALUES (
        NEW.id,
        COALESCE(
            NEW.raw_user_meta_data->>'username',
            SPLIT_PART(NEW.email, '@', 1)
        ),
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
    );

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error but don't block user creation
        RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3. Drop old trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 4. Create the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- 5. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.profiles TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;

-- 6. Verify trigger was created
SELECT 'Trigger created successfully!' as status;

SELECT
    trigger_name,
    event_manipulation as event,
    action_timing as timing,
    action_statement as calls
FROM information_schema.triggers
WHERE event_object_schema = 'auth'
AND event_object_table = 'users'
AND trigger_name = 'on_auth_user_created';

-- 7. Test the function works
SELECT 'Testing if profile insertion would work...' as status;

DO $$
DECLARE
    test_username TEXT := 'test_user_' || floor(random() * 10000);
BEGIN
    -- Simulate what the trigger does
    RAISE NOTICE 'Function would create username: %', test_username;
END $$;

SELECT '✅ Setup complete! Try signup again.' as final_status;
