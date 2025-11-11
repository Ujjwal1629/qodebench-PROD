# Fix for Corrupt User Creation Issue

## Problem
After registration, users land on the dashboard which shows "Loading dashboard" indefinitely. This happens because the database trigger that creates user profiles is not setting all required fields, causing the profile to be incomplete.

## Root Cause
The `handle_new_user()` database trigger only created 4 fields (id, username, full_name, avatar_url), but the profiles table has many more required fields added by later migrations:
- `onboarding_completed` - needed by middleware for redirect logic
- `subscription_tier`, `subscription_status` - needed by dashboard components
- Other subscription and streak tracking fields

When these fields are missing or NULL, the dashboard components fail to load properly.

## Solution

### Step 1: Update the Database Trigger

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Run the migration file: `supabase/migrations/034_fix_profile_creation_trigger.sql`
3. This will update the `handle_new_user()` trigger to set ALL required fields with proper defaults

**Quick Copy-Paste**:
```sql
-- You can copy the entire content of 034_fix_profile_creation_trigger.sql
-- and paste it into Supabase SQL Editor
```

### Step 2: Fix Existing Corrupt Users

If you have users that were already created with incomplete profiles, run this SQL to fix them:

```sql
-- Fix all existing profiles with missing fields
UPDATE profiles
SET
    -- Onboarding defaults (if missing)
    onboarding_completed = COALESCE(onboarding_completed, FALSE),
    quiz_score = COALESCE(quiz_score, NULL),
    quiz_completed_at = COALESCE(quiz_completed_at, NULL),

    -- Subscription defaults (if missing)
    subscription_tier = COALESCE(subscription_tier, 'free'),
    subscription_status = COALESCE(subscription_status, 'active'),
    subscription_start_date = COALESCE(subscription_start_date, NULL),
    subscription_end_date = COALESCE(subscription_end_date, NULL),
    trial_ends_at = COALESCE(trial_ends_at, NULL),
    auto_renew = COALESCE(auto_renew, TRUE),
    daily_attempts_used = COALESCE(daily_attempts_used, 0),
    daily_ai_feedback_used = COALESCE(daily_ai_feedback_used, 0),
    daily_limit_reset_at = COALESCE(daily_limit_reset_at, NOW()),

    -- Profile stats defaults (if missing)
    total_points = COALESCE(total_points, 0),
    weekly_points = COALESCE(weekly_points, 0),
    current_streak = COALESCE(current_streak, 0),
    longest_streak = COALESCE(longest_streak, 0),
    challenges_completed = COALESCE(challenges_completed, 0),

    updated_at = NOW()
WHERE
    onboarding_completed IS NULL
    OR subscription_tier IS NULL
    OR subscription_status IS NULL
    OR daily_attempts_used IS NULL
    OR daily_ai_feedback_used IS NULL;

-- Verify the fix
SELECT
    id,
    username,
    onboarding_completed,
    subscription_tier,
    subscription_status,
    daily_attempts_used,
    daily_ai_feedback_used
FROM profiles
ORDER BY created_at DESC
LIMIT 10;
```

### Step 3: Test with New Registration

1. Create a new test account
2. After registration, you should be redirected to `/signin`
3. Login with the new account
4. You should be redirected to `/onboarding/quiz` (not stuck on loading dashboard)
5. Complete the quiz
6. You should then see the dashboard properly

## What Was Changed

### Before (Old Trigger):
```sql
-- Only set 4 fields
INSERT INTO profiles (id, username, full_name, avatar_url)
VALUES (...)
```

### After (Fixed Trigger):
```sql
-- Set ALL required fields with proper defaults
INSERT INTO profiles (
    id, username, full_name, avatar_url,
    onboarding_completed, subscription_tier, subscription_status,
    daily_attempts_used, daily_ai_feedback_used,
    total_points, weekly_points, current_streak, longest_streak,
    challenges_completed, created_at, updated_at
)
VALUES (
    NEW.id,
    username,
    full_name,
    avatar_url,
    FALSE,          -- onboarding_completed
    'free',         -- subscription_tier
    'active',       -- subscription_status
    0,              -- daily_attempts_used
    0,              -- daily_ai_feedback_used
    0,              -- total_points
    0,              -- weekly_points
    0,              -- current_streak
    0,              -- longest_streak
    0,              -- challenges_completed
    NOW(),          -- created_at
    NOW()           -- updated_at
)
```

## Expected User Flow After Fix

1. **User registers** → Account created in Supabase
2. **Trigger fires** → Complete profile created with all required fields
3. **Redirect to signin** → User sees success message
4. **User logs in** → Authenticated successfully
5. **Middleware check** → Sees `onboarding_completed = FALSE`
6. **Redirect to quiz** → User sent to `/onboarding/quiz`
7. **Complete quiz** → `onboarding_completed` set to `TRUE`
8. **Access dashboard** → Dashboard loads properly with complete profile data

## Verification Commands

### Check if trigger exists:
```sql
SELECT
    trigger_name,
    event_manipulation,
    action_timing
FROM information_schema.triggers
WHERE event_object_schema = 'auth'
  AND event_object_table = 'users'
  AND trigger_name = 'on_auth_user_created';
```

### Check function definition:
```sql
SELECT pg_get_functiondef('handle_new_user'::regproc);
```

### View recent profiles:
```sql
SELECT
    p.id,
    u.email,
    p.username,
    p.onboarding_completed,
    p.subscription_tier,
    p.subscription_status,
    p.created_at
FROM profiles p
JOIN auth.users u ON u.id = p.id
ORDER BY p.created_at DESC
LIMIT 5;
```

## Need Help?

If the issue persists after running the migration:
1. Check Supabase logs for trigger errors
2. Verify the trigger function was updated (run verification commands above)
3. Test with a brand new email address
4. Check browser console for any JavaScript errors
5. Clear browser cache and cookies
