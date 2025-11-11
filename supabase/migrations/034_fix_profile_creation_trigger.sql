-- =====================================================
-- Fix Profile Creation Trigger for Complete User Setup
-- Ensures all required fields are set when creating new users
-- =====================================================

-- Drop and recreate the handle_new_user function with all required fields
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_avatar TEXT;
    user_name TEXT;
    user_username TEXT;
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

    -- Extract or generate username
    user_username := COALESCE(
        NEW.raw_user_meta_data->>'username',
        NEW.raw_user_meta_data->>'preferred_username',
        SPLIT_PART(NEW.email, '@', 1)
    );

    -- Insert complete profile with ALL required fields
    INSERT INTO public.profiles (
        id,
        username,
        full_name,
        avatar_url,
        -- Onboarding fields (from migration 009)
        onboarding_completed,
        quiz_score,
        quiz_completed_at,
        -- Subscription fields (from migration 033)
        subscription_tier,
        subscription_status,
        subscription_start_date,
        subscription_end_date,
        trial_ends_at,
        auto_renew,
        daily_attempts_used,
        daily_ai_feedback_used,
        daily_limit_reset_at,
        -- Default profile fields
        experience_level,
        total_points,
        weekly_points,
        current_streak,
        longest_streak,
        challenges_completed,
        created_at,
        updated_at
    )
    VALUES (
        NEW.id,
        user_username,
        user_name,
        user_avatar,
        -- Onboarding defaults
        FALSE,                          -- onboarding_completed
        NULL,                           -- quiz_score
        NULL,                           -- quiz_completed_at
        -- Subscription defaults
        'free',                         -- subscription_tier
        'active',                       -- subscription_status
        NULL,                           -- subscription_start_date
        NULL,                           -- subscription_end_date
        NULL,                           -- trial_ends_at
        TRUE,                           -- auto_renew
        0,                              -- daily_attempts_used
        0,                              -- daily_ai_feedback_used
        NOW(),                          -- daily_limit_reset_at
        -- Profile defaults
        NULL,                           -- experience_level (set during onboarding)
        0,                              -- total_points
        0,                              -- weekly_points
        0,                              -- current_streak
        0,                              -- longest_streak
        0,                              -- challenges_completed
        NOW(),                          -- created_at
        NOW()                           -- updated_at
    )
    ON CONFLICT (id) DO NOTHING;  -- Prevent duplicate key errors

    RETURN NEW;
EXCEPTION
    WHEN unique_violation THEN
        -- If username is taken, generate a unique one with user ID
        BEGIN
            INSERT INTO public.profiles (
                id,
                username,
                full_name,
                avatar_url,
                onboarding_completed,
                subscription_tier,
                subscription_status,
                auto_renew,
                daily_attempts_used,
                daily_ai_feedback_used,
                daily_limit_reset_at,
                total_points,
                weekly_points,
                current_streak,
                longest_streak,
                challenges_completed,
                created_at,
                updated_at
            )
            VALUES (
                NEW.id,
                SPLIT_PART(NEW.email, '@', 1) || '_' || substr(NEW.id::text, 1, 8),
                user_name,
                user_avatar,
                FALSE,
                'free',
                'active',
                TRUE,
                0,
                0,
                NOW(),
                0,
                0,
                0,
                0,
                0,
                NOW(),
                NOW()
            )
            ON CONFLICT (id) DO NOTHING;

            RETURN NEW;
        EXCEPTION
            WHEN OTHERS THEN
                -- Log error details
                RAISE WARNING 'Failed to create profile after username conflict for user % (email: %): %',
                    NEW.id, NEW.email, SQLERRM;
                RETURN NEW;
        END;
    WHEN OTHERS THEN
        -- Log any other errors with details
        RAISE WARNING 'Failed to create profile for user % (email: %): % - %',
            NEW.id, NEW.email, SQLERRM, SQLSTATE;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Recreate the trigger (in case it was modified)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- Add helpful comments
COMMENT ON FUNCTION handle_new_user() IS
'Automatically creates a complete profile with all required fields when a new user signs up.
Handles OAuth metadata properly and sets proper defaults for onboarding and subscription fields.';

-- Verify the trigger was created
SELECT
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'auth'
  AND event_object_table = 'users'
  AND trigger_name = 'on_auth_user_created';

-- Success message
SELECT '✅ Profile creation trigger updated successfully!' as status;
