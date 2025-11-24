-- =====================================================
-- TEST USER SETUP FOR SUBSCRIPTION TESTING
-- Run these queries in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. VIEW ALL USERS WITH SUBSCRIPTION STATUS
-- =====================================================

-- See all users and their subscription tiers
-- Note: email is in auth.users, not profiles
SELECT
  p.id,
  u.email,
  p.full_name,
  p.subscription_tier,
  p.subscription_status,
  p.subscription_start_date,
  p.subscription_end_date,
  p.trial_ends_at,
  p.created_at
FROM profiles p
JOIN auth.users u ON u.id = p.id
ORDER BY p.created_at DESC;

-- =====================================================
-- 2. MANUALLY SET USER TO FREE TIER
-- =====================================================

-- Replace 'user@example.com' with the actual user email
UPDATE profiles
SET
  subscription_tier = 'free',
  subscription_status = 'active',
  subscription_start_date = NULL,
  subscription_end_date = NULL,
  trial_ends_at = NULL,
  auto_renew = true,
  daily_attempts_used = 0,
  daily_ai_feedback_used = 0,
  updated_at = NOW()
WHERE id = (SELECT id FROM auth.users WHERE id = (SELECT id FROM auth.users WHERE email = 'user@example.com'));

-- Or by user ID:
UPDATE profiles
SET
  subscription_tier = 'free',
  subscription_status = 'active',
  subscription_start_date = NULL,
  subscription_end_date = NULL,
  trial_ends_at = NULL,
  updated_at = NOW()
WHERE id = 'USER_ID_HERE';

-- =====================================================
-- 3. MANUALLY SET USER TO BETA TRIAL (₹199 - 21 DAYS)
-- =====================================================

UPDATE profiles
SET
  subscription_tier = 'beta',
  subscription_status = 'trial',
  subscription_start_date = NOW(),
  subscription_end_date = NOW() + INTERVAL '21 days',
  trial_ends_at = NOW() + INTERVAL '21 days',
  auto_renew = true,
  daily_attempts_used = 0,
  daily_ai_feedback_used = 0,
  updated_at = NOW()
WHERE id = (SELECT id FROM auth.users WHERE email = 'user@example.com');

-- =====================================================
-- 4. MANUALLY SET USER TO MONTHLY PREMIUM (₹999)
-- =====================================================

UPDATE profiles
SET
  subscription_tier = 'monthly',
  subscription_status = 'active',
  subscription_start_date = NOW(),
  subscription_end_date = NOW() + INTERVAL '30 days',
  trial_ends_at = NULL,
  auto_renew = true,
  daily_attempts_used = 0,
  daily_ai_feedback_used = 0,
  updated_at = NOW()
WHERE id = (SELECT id FROM auth.users WHERE email = 'user@example.com');

-- =====================================================
-- 5. MANUALLY SET USER TO QUARTERLY PREMIUM (₹1999)
-- =====================================================

UPDATE profiles
SET
  subscription_tier = 'quarterly',
  subscription_status = 'active',
  subscription_start_date = NOW(),
  subscription_end_date = NOW() + INTERVAL '90 days',
  trial_ends_at = NULL,
  auto_renew = true,
  daily_attempts_used = 0,
  daily_ai_feedback_used = 0,
  updated_at = NOW()
WHERE id = (SELECT id FROM auth.users WHERE email = 'user@example.com');

-- =====================================================
-- 6. MANUALLY SET USER TO YEARLY PREMIUM (₹4999)
-- =====================================================

UPDATE profiles
SET
  subscription_tier = 'yearly',
  subscription_status = 'active',
  subscription_start_date = NOW(),
  subscription_end_date = NOW() + INTERVAL '365 days',
  trial_ends_at = NULL,
  auto_renew = true,
  daily_attempts_used = 0,
  daily_ai_feedback_used = 0,
  updated_at = NOW()
WHERE id = (SELECT id FROM auth.users WHERE email = 'user@example.com');

-- =====================================================
-- 7. SET USER TO EXPIRED STATUS (FOR TESTING PAYWALLS)
-- =====================================================

UPDATE profiles
SET
  subscription_tier = 'monthly',
  subscription_status = 'expired',
  subscription_start_date = NOW() - INTERVAL '60 days',
  subscription_end_date = NOW() - INTERVAL '30 days',
  trial_ends_at = NULL,
  auto_renew = false,
  updated_at = NOW()
WHERE id = (SELECT id FROM auth.users WHERE email = 'user@example.com');

-- =====================================================
-- 8. SIMULATE DAILY LIMITS (FOR FREE TIER TESTING)
-- =====================================================

-- Set user to have used 8 out of 10 daily attempts
UPDATE profiles
SET
  daily_attempts_used = 8,
  daily_ai_feedback_used = 3,
  daily_limit_reset_at = NOW()
WHERE id = (SELECT id FROM auth.users WHERE email = 'user@example.com');

-- Set user to have hit daily limits
UPDATE profiles
SET
  daily_attempts_used = 10,
  daily_ai_feedback_used = 5,
  daily_limit_reset_at = NOW()
WHERE id = (SELECT id FROM auth.users WHERE email = 'user@example.com');

-- =====================================================
-- 9. RESET DAILY LIMITS (SIMULATE MIDNIGHT RESET)
-- =====================================================

UPDATE profiles
SET
  daily_attempts_used = 0,
  daily_ai_feedback_used = 0,
  daily_limit_reset_at = NOW()
WHERE id = (SELECT id FROM auth.users WHERE email = 'user@example.com');

-- =====================================================
-- 10. CREATE FAKE SUBSCRIPTION RECORD (FOR TESTING)
-- =====================================================

-- First get the user ID
SELECT id FROM profiles WHERE id = (SELECT id FROM auth.users WHERE email = 'user@example.com');

-- Then insert fake subscription (replace USER_ID_HERE)
INSERT INTO subscriptions (
  user_id,
  tier,
  status,
  start_date,
  end_date,
  trial_end_date,
  amount,
  currency,
  razorpay_order_id,
  razorpay_payment_id,
  auto_renew
) VALUES (
  'USER_ID_HERE',
  'beta',
  'active',
  NOW(),
  NOW() + INTERVAL '21 days',
  NOW() + INTERVAL '21 days',
  19900,
  'INR',
  'order_TEST_' || gen_random_uuid()::text,
  'pay_TEST_' || gen_random_uuid()::text,
  true
);

-- =====================================================
-- 11. QUICK TEST SCENARIOS
-- =====================================================

-- Test Scenario 1: New free user
UPDATE profiles
SET subscription_tier = 'free', subscription_status = 'active'
WHERE email = 'free-user@test.com';

-- Test Scenario 2: Beta trial user (just subscribed)
UPDATE profiles
SET
  subscription_tier = 'beta',
  subscription_status = 'trial',
  subscription_start_date = NOW(),
  trial_ends_at = NOW() + INTERVAL '21 days'
WHERE email = 'beta-user@test.com';

-- Test Scenario 3: Premium user (monthly)
UPDATE profiles
SET
  subscription_tier = 'monthly',
  subscription_status = 'active',
  subscription_start_date = NOW(),
  subscription_end_date = NOW() + INTERVAL '30 days'
WHERE email = 'premium-user@test.com';

-- Test Scenario 4: Expired user (to test paywall)
UPDATE profiles
SET
  subscription_tier = 'monthly',
  subscription_status = 'expired',
  subscription_end_date = NOW() - INTERVAL '1 day'
WHERE email = 'expired-user@test.com';

-- =====================================================
-- 12. VERIFY CHANGES
-- =====================================================

-- Check specific user
SELECT
  email,
  subscription_tier,
  subscription_status,
  subscription_end_date,
  trial_ends_at,
  daily_attempts_used,
  daily_ai_feedback_used
FROM profiles
WHERE id = (SELECT id FROM auth.users WHERE email = 'user@example.com');

-- Count users by tier
SELECT
  subscription_tier,
  COUNT(*) as user_count
FROM profiles
GROUP BY subscription_tier
ORDER BY user_count DESC;

-- =====================================================
-- 13. CLEANUP / RESET ALL TEST USERS
-- =====================================================

-- Reset all test users to free tier
UPDATE profiles
SET
  subscription_tier = 'free',
  subscription_status = 'active',
  subscription_start_date = NULL,
  subscription_end_date = NULL,
  trial_ends_at = NULL,
  daily_attempts_used = 0,
  daily_ai_feedback_used = 0,
  updated_at = NOW()
WHERE email LIKE '%@test.com';

-- =====================================================
-- USAGE INSTRUCTIONS
-- =====================================================

/*

HOW TO USE THIS FILE:

1. Copy the SQL queries you need
2. Go to Supabase Dashboard → SQL Editor
3. Replace 'user@example.com' with actual user email
4. Run the query
5. Refresh your app to see changes

COMMON TESTING WORKFLOW:

1. Create test user accounts:
   - free-user@test.com
   - beta-user@test.com
   - premium-user@test.com
   - expired-user@test.com

2. Use Section 11 to set up test scenarios

3. Login as each user and verify:
   - Free user sees paywalls on intermediate challenges
   - Beta user has full access
   - Premium user has full access
   - Expired user sees "subscription expired" message

4. Test daily limits with Section 8

5. Clean up with Section 13

QUICK REFERENCE:

Free Tier:
- subscription_tier = 'free'
- subscription_status = 'active'

Beta Trial (₹199 / 21 days):
- subscription_tier = 'beta'
- subscription_status = 'trial'
- trial_ends_at = NOW() + INTERVAL '21 days'

Monthly Premium (₹999):
- subscription_tier = 'monthly'
- subscription_status = 'active'
- subscription_end_date = NOW() + INTERVAL '30 days'

Quarterly (₹1999):
- subscription_tier = 'quarterly'
- subscription_end_date = NOW() + INTERVAL '90 days'

Yearly (₹4999):
- subscription_tier = 'yearly'
- subscription_end_date = NOW() + INTERVAL '365 days'

*/
