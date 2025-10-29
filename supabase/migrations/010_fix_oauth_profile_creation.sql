-- Fix handle_new_user trigger to properly handle OAuth metadata
-- Migration: 010_fix_oauth_profile_creation

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_avatar TEXT;
    user_name TEXT;
BEGIN
    -- Extract avatar URL (GitHub: avatar_url, Google: picture)
    user_avatar := COALESCE(
        NEW.raw_user_meta_data->>'avatar_url',
        NEW.raw_user_meta_data->>'picture',
        ''
    );

    -- Extract full name (various OAuth providers use different fields)
    user_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        ''
    );

    -- Insert profile with OAuth-aware metadata extraction
    INSERT INTO profiles (id, username, full_name, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(
            NEW.raw_user_meta_data->>'username',
            NEW.raw_user_meta_data->>'preferred_username',
            SPLIT_PART(NEW.email, '@', 1)
        ),
        user_name,
        user_avatar
    )
    ON CONFLICT (id) DO NOTHING;  -- Prevent duplicate key errors

    RETURN NEW;
EXCEPTION
    WHEN unique_violation THEN
        -- If username is taken, generate a unique one
        INSERT INTO profiles (id, username, full_name, avatar_url)
        VALUES (
            NEW.id,
            SPLIT_PART(NEW.email, '@', 1) || '_' || substr(NEW.id::text, 1, 8),
            user_name,
            user_avatar
        )
        ON CONFLICT (id) DO NOTHING;
        RETURN NEW;
    WHEN OTHERS THEN
        -- Log error and return (don't block user creation)
        RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger (in case it was modified)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

COMMENT ON FUNCTION handle_new_user() IS 'Automatically creates a profile when a new user signs up. Handles OAuth metadata properly (GitHub avatar_url, Google picture).';
