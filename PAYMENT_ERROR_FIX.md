# Payment Verification Error - 500 Fix

## Error You're Seeing

```
api/payments/verify-payment:1  Failed to load resource: the server responded with a status of 500 (Internal Server Error)
Payment verification error: Error: Payment verification failed
```

## Root Cause

The `subscriptions` and `payment_transactions` tables **don't exist in your database yet** because the migration hasn't been run.

When the verify-payment API tries to insert into the `subscriptions` table (line 82-98), it fails because the table doesn't exist.

---

## FIX: Run the Database Migration

### Option 1: Supabase Dashboard (Recommended)

1. **Go to your Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/YOUR_PROJECT_ID
   ```

2. **Navigate to SQL Editor:**
   - Click "SQL Editor" in the left sidebar

3. **Create a new query:**
   - Click "+ New query"

4. **Copy the entire migration:**
   - Open: `supabase/migrations/033_payment_system.sql`
   - Copy ALL the contents (the entire file)

5. **Paste and Run:**
   - Paste into the SQL Editor
   - Click "Run" or press Cmd/Ctrl + Enter

6. **Verify Success:**
   You should see messages like:
   ```
   ALTER TABLE
   CREATE TABLE
   CREATE INDEX
   CREATE FUNCTION
   ...
   Success. No rows returned
   ```

### Option 2: Supabase CLI (If you have it installed)

```bash
# Make sure you're logged in
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_ID

# Push the migration
supabase db push
```

---

## Verify Migration Worked

After running the migration, verify the tables exist:

```sql
-- Run this in Supabase SQL Editor

-- Check if subscriptions table exists
SELECT * FROM subscriptions LIMIT 1;

-- Check if payment_transactions table exists
SELECT * FROM payment_transactions LIMIT 1;

-- Check if profiles has new columns
SELECT subscription_tier, subscription_status, subscription_start_date
FROM profiles
WHERE id = auth.uid();
```

If these queries work (even if they return no rows), the migration succeeded!

---

## Test the Payment Flow Again

1. **Clear your browser cache** (or use incognito)

2. **Go to the pricing page:**
   ```
   http://localhost:3000/pricing
   ```

3. **Click "Subscribe" on Beta Trial (₹199)**

4. **Use Razorpay test card:**
   ```
   Card Number: 4111 1111 1111 1111
   CVV: 123
   Expiry: Any future date
   Name: Test User
   ```

5. **After payment, you should be redirected to:**
   ```
   /dashboard?payment=success
   ```

6. **Verify subscription was created:**
   ```sql
   -- Check in Supabase SQL Editor
   SELECT * FROM subscriptions
   WHERE user_id = auth.uid()
   ORDER BY created_at DESC
   LIMIT 1;
   ```

---

## If Still Getting 500 Error

### Check Server Logs

Look at your terminal where `npm run dev` is running. You should see error logs like:

```
Error creating subscription: { code: '42P01', message: 'relation "subscriptions" does not exist' }
```

This confirms the table is missing.

### Check Environment Variables

Make sure these are set in `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_RbhyLomttffxkb
RAZORPAY_KEY_SECRET=7kGHqjTYCitkrgVcYPjPkKdD
RAZORPAY_WEBHOOK_SECRET=qodebenchpay1629@
```

### Restart Dev Server

After running migration:
```bash
# Stop the dev server (Ctrl+C)
# Start it again
npm run dev
```

---

## What the Migration Creates

The migration adds:

1. **New columns to `profiles` table:**
   - `subscription_tier` (free/beta/monthly/quarterly/yearly)
   - `subscription_status` (active/trial/expired/cancelled)
   - `subscription_start_date`
   - `subscription_end_date`
   - `trial_ends_at`
   - `auto_renew`
   - `daily_attempts_used`
   - `daily_ai_feedback_used`
   - `daily_limit_reset_at`

2. **New `subscriptions` table:**
   - Stores subscription records
   - Links to Razorpay order/payment IDs
   - Tracks subscription history

3. **New `payment_transactions` table:**
   - Audit log of all payment attempts
   - Stores transaction status (pending/success/failed)
   - Records error codes and descriptions

4. **Helper functions:**
   - `has_active_subscription()`
   - `can_access_paid_content()`
   - `increment_daily_usage()`
   - `reset_daily_limits()`
   - `update_subscription_status()`

5. **RLS Policies:**
   - Users can only see their own subscriptions
   - Users can only see their own transactions

---

## Expected Flow After Fix

1. User clicks "Subscribe" → Creates Razorpay order ✅
2. User completes payment → Razorpay returns payment details ✅
3. Frontend calls `/api/payments/verify-payment` ✅
4. API verifies signature ✅
5. API creates subscription record ✅ (Currently failing here!)
6. API updates user profile ✅
7. User redirected to dashboard ✅
8. User now has premium access ✅

---

## Quick Checklist

- [ ] Run migration in Supabase SQL Editor
- [ ] Verify tables exist (subscriptions, payment_transactions)
- [ ] Restart dev server
- [ ] Clear browser cache
- [ ] Try payment again with test card
- [ ] Check for success redirect
- [ ] Verify subscription in database

---

## Need More Help?

If you're still getting errors after running the migration:

1. **Share the exact error from terminal** (where npm run dev is running)
2. **Share screenshot of Supabase table list** (to confirm tables exist)
3. **Check Supabase logs:**
   - Go to Supabase Dashboard → Logs
   - Look for any database errors

The most common issue is simply that the migration wasn't run. Once you run it, the payment flow should work perfectly!
