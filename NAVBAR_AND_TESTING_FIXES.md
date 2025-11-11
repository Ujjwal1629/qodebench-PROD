# Navbar & Testing Setup - Complete ✅

## Issues Fixed

### 1. ✅ Navbar Not Showing User When Logged In

**Problem:** When visiting `/pricing` page while logged in, navbar showed "Login" and "Get Started" buttons instead of user profile.

**Root Cause:** The landing navbar (`components/landing/navbar.tsx`) was a static component that didn't check authentication state.

**Solution:** Added auth state checking to the navbar with real-time updates.

---

### 2. ✅ Subscription Badge Added to User Profile

**Problem:** No visual indicator of user's subscription status (Free/Beta/Pro).

**Solution:** Added subscription badge to navbar dropdown showing tier status.

---

### 3. ✅ SQL Script for Manual Testing

**Problem:** No easy way to manually set user subscriptions in Supabase for testing.

**Solution:** Created comprehensive SQL script with 13 different testing scenarios.

---

## What Changed

### File: `components/landing/navbar.tsx`

**New Features:**

1. **Auth State Detection**
   - Checks if user is logged in on component mount
   - Listens for auth changes in real-time
   - Fetches user's subscription tier from database

2. **User Dropdown (Desktop)**
   - Shows username (from email)
   - Displays subscription badge (Beta/Pro) if premium
   - Links to dashboard
   - "Upgrade to Pro" button for free users
   - Logout option

3. **User Info (Mobile)**
   - Shows user email and subscription status
   - Dashboard button
   - "Upgrade to Pro" button for free users
   - Logout option

4. **Subscription Badge**
   - 👑 Crown icon for premium users
   - Shows "Beta" or "Pro" based on tier
   - Primary color styling
   - Visible in both desktop dropdown and mobile menu

**Before:**
```tsx
// Always showed these, regardless of auth state
<Link href="/signin">Login</Link>
<Link href="/signup">Get Started</Link>
```

**After:**
```tsx
{user ? (
  <DropdownMenu>
    <Button variant="ghost">
      <User /> {user.email.split('@')[0]}
      {tier !== 'free' && (
        <Badge><Crown /> {tier === 'beta' ? 'Beta' : 'Pro'}</Badge>
      )}
    </Button>
    {/* Dropdown with dashboard, upgrade, logout */}
  </DropdownMenu>
) : (
  // Show Login/Get Started
)}
```

---

## Testing SQL Script

**File:** `supabase/TEST_USER_SETUP.sql`

### 13 Scenarios Included:

1. **View All Users** - See all users and their subscription status
2. **Set to Free Tier** - Reset user to free tier
3. **Set to Beta Trial** - ₹199 for 21 days
4. **Set to Monthly Premium** - ₹999 per month
5. **Set to Quarterly Premium** - ₹1999 for 3 months
6. **Set to Yearly Premium** - ₹4999 per year
7. **Set to Expired** - For testing paywall behavior
8. **Simulate Daily Limits** - Test free tier limits (8/10 attempts)
9. **Reset Daily Limits** - Simulate midnight reset
10. **Create Fake Subscription** - Add subscription record for testing
11. **Quick Test Scenarios** - Set up multiple test users at once
12. **Verify Changes** - Check user status
13. **Cleanup Test Users** - Reset all test users

### How to Use:

1. **Open Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/YOUR_PROJECT_ID
   ```

2. **Go to SQL Editor:**
   - Click "SQL Editor" in sidebar
   - Click "+ New query"

3. **Copy queries from:** `supabase/TEST_USER_SETUP.sql`

4. **Replace placeholders:**
   ```sql
   WHERE email = 'user@example.com'  -- Change to your test user
   ```

5. **Run the query** (Cmd/Ctrl + Enter)

---

## Example: Setting Up Test Users

### Scenario 1: Create Free User

```sql
-- Set user to free tier
UPDATE profiles
SET
  subscription_tier = 'free',
  subscription_status = 'active',
  subscription_start_date = NULL,
  subscription_end_date = NULL,
  trial_ends_at = NULL
WHERE email = 'free-user@test.com';
```

**What you'll see:**
- Navbar: Username only (no badge)
- Dropdown: "Free Tier" status
- Button: "Upgrade to Pro" visible
- Access: Only beginner challenges + learning modules

---

### Scenario 2: Create Beta Trial User

```sql
-- Set user to beta trial (21 days)
UPDATE profiles
SET
  subscription_tier = 'beta',
  subscription_status = 'trial',
  subscription_start_date = NOW(),
  subscription_end_date = NOW() + INTERVAL '21 days',
  trial_ends_at = NOW() + INTERVAL '21 days'
WHERE email = 'beta-user@test.com';
```

**What you'll see:**
- Navbar: Username + "👑 Beta" badge
- Dropdown: "Beta Plan" status
- Access: Full access to all features
- Trial expires in 21 days

---

### Scenario 3: Create Premium User

```sql
-- Set user to monthly premium
UPDATE profiles
SET
  subscription_tier = 'monthly',
  subscription_status = 'active',
  subscription_start_date = NOW(),
  subscription_end_date = NOW() + INTERVAL '30 days'
WHERE email = 'premium-user@test.com';
```

**What you'll see:**
- Navbar: Username + "👑 Pro" badge
- Dropdown: "Monthly Plan" status
- Access: Full access to everything
- Renews monthly

---

### Scenario 4: Create Expired User (Test Paywall)

```sql
-- Set user to expired status
UPDATE profiles
SET
  subscription_tier = 'monthly',
  subscription_status = 'expired',
  subscription_end_date = NOW() - INTERVAL '1 day'
WHERE email = 'expired-user@test.com';
```

**What you'll see:**
- Redirected to /pricing on protected routes
- "Subscription Expired" message
- Can't access premium content
- Must resubscribe

---

## Visual Examples

### Desktop Navbar (Free User):
```
┌────────────────────────────────────┐
│ Logo   Features   Pricing   About  │
│                                    │
│           [👤 user] ▼              │
│           ├─ Dashboard             │
│           ├─ 👑 Upgrade to Pro     │
│           └─ 🚪 Logout             │
└────────────────────────────────────┘
```

### Desktop Navbar (Premium User):
```
┌────────────────────────────────────┐
│ Logo   Features   Pricing   About  │
│                                    │
│      [👤 user 👑 Beta] ▼           │
│      ├─ Dashboard                  │
│      └─ 🚪 Logout                  │
└────────────────────────────────────┘
```

### Mobile Menu (Free User):
```
┌─────────────────────────┐
│ Features                │
│ Pricing                 │
│ About                   │
│                         │
│ ┌─────────────────────┐ │
│ │ user@test.com       │ │
│ │ Free Tier           │ │
│ └─────────────────────┘ │
│                         │
│ [Dashboard]             │
│ [👑 Upgrade to Pro]     │
│ [Logout]                │
└─────────────────────────┘
```

---

## Testing Workflow

### 1. Create Test Accounts

Sign up these test users:
```
free-user@test.com
beta-user@test.com
premium-user@test.com
expired-user@test.com
```

### 2. Set Subscription Status

Use SQL script to set each user's tier:
```sql
-- In Supabase SQL Editor
UPDATE profiles SET subscription_tier = 'free' WHERE email = 'free-user@test.com';
UPDATE profiles SET subscription_tier = 'beta', ... WHERE email = 'beta-user@test.com';
-- etc.
```

### 3. Test Each User

**Login as free-user@test.com:**
- ✅ Navbar shows username only (no badge)
- ✅ "Free Tier" in dropdown
- ✅ "Upgrade to Pro" button visible
- ✅ Can access beginner challenges
- ❌ Paywall on intermediate challenges
- ❌ Paywall on interviews

**Login as beta-user@test.com:**
- ✅ Navbar shows "👑 Beta" badge
- ✅ "Beta Plan" in dropdown
- ✅ Can access all challenges
- ✅ Can access interviews
- ✅ No paywalls

**Login as premium-user@test.com:**
- ✅ Navbar shows "👑 Pro" badge
- ✅ "Monthly Plan" in dropdown
- ✅ Full access to everything

**Login as expired-user@test.com:**
- ✅ Redirected to /pricing
- ✅ "Subscription Expired" alert
- ❌ Can't access premium features

### 4. Test Daily Limits (Free User)

```sql
-- Set free user to 8/10 attempts used
UPDATE profiles
SET daily_attempts_used = 8
WHERE email = 'free-user@test.com';
```

Then as free user:
- ✅ Can make 2 more attempts
- ❌ On 11th attempt, see "Daily Limit Reached" modal

---

## Navbar States Summary

| User Type | Badge | Dropdown Status | Upgrade Button |
|-----------|-------|-----------------|----------------|
| Not Logged In | None | N/A | Show "Login" + "Get Started" |
| Free Tier | None | "Free Tier" | ✅ Show "Upgrade to Pro" |
| Beta Trial | 👑 Beta | "Beta Plan" | ❌ Hidden |
| Monthly Pro | 👑 Pro | "Monthly Plan" | ❌ Hidden |
| Quarterly Pro | 👑 Pro | "Quarterly Plan" | ❌ Hidden |
| Yearly Pro | 👑 Pro | "Yearly Plan" | ❌ Hidden |
| Expired | None | "Expired" | ✅ Show "Resubscribe" |

---

## Files Created/Modified

### Modified:
- `components/landing/navbar.tsx` - Added auth checking + subscription badge

### Created:
- `supabase/TEST_USER_SETUP.sql` - SQL script for testing
- `NAVBAR_AND_TESTING_FIXES.md` - This document

---

## Quick Reference Commands

### View Current User Status:
```sql
SELECT email, subscription_tier, subscription_status, subscription_end_date
FROM profiles
WHERE email = 'YOUR_EMAIL';
```

### Set User to Premium:
```sql
UPDATE profiles
SET subscription_tier = 'monthly', subscription_status = 'active',
    subscription_end_date = NOW() + INTERVAL '30 days'
WHERE email = 'YOUR_EMAIL';
```

### Reset User to Free:
```sql
UPDATE profiles
SET subscription_tier = 'free', subscription_status = 'active',
    subscription_end_date = NULL, trial_ends_at = NULL
WHERE email = 'YOUR_EMAIL';
```

### Reset Daily Limits:
```sql
UPDATE profiles
SET daily_attempts_used = 0, daily_ai_feedback_used = 0
WHERE email = 'YOUR_EMAIL';
```

---

## Success Criteria

✅ Logged-in users see their email in navbar
✅ Premium users see 👑 badge (Beta/Pro)
✅ Dropdown shows current subscription tier
✅ Free users see "Upgrade to Pro" button
✅ Premium users don't see upgrade button
✅ Works on both desktop and mobile
✅ Real-time updates when auth state changes
✅ Can manually set any user to any tier via SQL
✅ Easy to create multiple test users

All features working perfectly! 🎉
