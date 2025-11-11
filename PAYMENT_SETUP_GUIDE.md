# QodeBench Payment System Setup Guide

This guide will walk you through setting up the Razorpay payment integration for QodeBench.

---

## 📋 Prerequisites

- Razorpay account (test mode for development, live mode for production)
- Supabase project with database access
- Node.js and npm installed
- QodeBench codebase with payment system implemented

---

## 🚀 Step 1: Create Razorpay Account

### For Testing (Development):

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/signup)
2. Sign up for a new account
3. Complete the verification process
4. You'll automatically be in **Test Mode** (you'll see "Test Mode" in the top-left corner)

### For Production:

1. After testing is complete, submit KYC documents
2. Wait for account activation (usually 24-48 hours)
3. Switch to **Live Mode** once approved

---

## 🔑 Step 2: Get API Keys

### Test Mode Keys (for development):

1. Log in to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Click on **Settings** (gear icon) → **API Keys**
3. Under **Test Mode**, click **Generate Test Key**
4. Copy both:
   - **Key ID** (starts with `rzp_test_`)
   - **Key Secret** (starts with `rzp_test_`)

⚠️ **IMPORTANT**: Never commit your Key Secret to version control!

### Live Mode Keys (for production):

1. Switch to **Live Mode** in dashboard (top-left toggle)
2. Go to **Settings** → **API Keys**
3. Click **Generate Live Key** (requires KYC completion)
4. Copy both:
   - **Key ID** (starts with `rzp_live_`)
   - **Key Secret** (starts with `rzp_live_`)

---

## ⚙️ Step 3: Configure Environment Variables

Add the following to your `.env.local` file:

```bash
# Razorpay API Keys (Test Mode)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxx

# Public key for client-side (same as RAZORPAY_KEY_ID)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx

# Webhook secret (generate in next step)
RAZORPAY_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

### For Production:

Replace `rzp_test_` keys with `rzp_live_` keys.

---

## 🗄️ Step 4: Run Database Migration

The payment system requires database schema changes. Run the migration:

### Option 1: Via Supabase Dashboard

1. Go to your Supabase project
2. Click **SQL Editor** in the sidebar
3. Open `/supabase/migrations/033_payment_system.sql`
4. Copy the entire contents
5. Paste into Supabase SQL Editor
6. Click **Run**

### Option 2: Via Supabase CLI

```bash
# If you have Supabase CLI installed
supabase db push
```

### Verify Migration:

Run this query in Supabase SQL Editor to verify:

```sql
-- Check if new tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('subscriptions', 'payment_transactions');

-- Check if profiles table has new columns
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'profiles'
AND column_name IN ('subscription_tier', 'subscription_status');
```

You should see the new tables and columns listed.

---

## 🌐 Step 5: Set Up Webhooks

Webhooks allow Razorpay to notify your server about payment events (success, failure, renewal, etc.).

### 1. Get Your Webhook URL

Your webhook endpoint is:
```
https://yourdomain.com/api/payments/webhook
```

For local development, you need a public URL. Use **ngrok**:

```bash
# Install ngrok if not already installed
npm install -g ngrok

# Start your Next.js app
npm run dev

# In another terminal, expose localhost
ngrok http 3000

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
```

Your local webhook URL will be:
```
https://abc123.ngrok.io/api/payments/webhook
```

### 2. Create Webhook in Razorpay Dashboard

1. Go to **Settings** → **Webhooks**
2. Click **+ Create New Webhook**
3. Enter webhook URL: `https://yourdomain.com/api/payments/webhook`
4. Select events to listen for:
   - ✅ `payment.captured`
   - ✅ `payment.failed`
   - ✅ `subscription.charged`
   - ✅ `subscription.cancelled`
5. Click **Create Webhook**
6. Copy the **Webhook Secret** (starts with `whsec_`)
7. Add it to `.env.local`:
   ```
   RAZORPAY_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

### 3. Test Webhook

1. Make a test payment
2. Check **Webhooks** section in Razorpay Dashboard
3. You should see webhook delivery logs
4. Check your application logs to verify webhook was processed

---

## 🧪 Step 6: Enable Scheduled Jobs (Optional)

The payment system includes scheduled jobs to:
- Reset daily limits at midnight
- Expire trials and subscriptions
- Update subscription status

### Enable in Supabase:

1. Go to **Database** → **Functions**
2. Enable **pg_cron** extension (if not already enabled)
3. Run the following in SQL Editor:

```sql
-- Reset daily limits at midnight UTC
SELECT cron.schedule(
  'reset-daily-limits',
  '0 0 * * *',
  $$ SELECT reset_daily_limits(); $$
);

-- Update subscription status every 30 minutes
SELECT cron.schedule(
  'update-subscription-status',
  '*/30 * * * *',
  $$ SELECT update_subscription_status(); $$
);
```

### Verify Cron Jobs:

```sql
SELECT * FROM cron.job;
```

---

## ✅ Step 7: Test Payment Flow

### Test Cards (Test Mode Only):

Razorpay provides test cards for different scenarios:

| Card Number          | CVV  | Expiry    | Scenario               |
|---------------------|------|-----------|------------------------|
| 4111 1111 1111 1111 | Any  | Any future| Successful payment     |
| 4000 0000 0000 0002 | Any  | Any future| Payment failure        |
| 5555 5555 5555 4444 | Any  | Any future| Card declined          |

### Testing Checklist:

1. **Start the application:**
   ```bash
   npm run dev
   ```

2. **Sign in as a test user**

3. **Try to access paid content:**
   - Navigate to Intermediate challenges → Should be redirected to pricing
   - Try to start mock interview → Should show paywall

4. **Complete a payment:**
   - Go to `/pricing`
   - Click on a plan (Beta, Monthly, etc.)
   - Use test card: `4111 1111 1111 1111`
   - Complete payment

5. **Verify subscription:**
   - Check if you can now access paid content
   - Go to Settings → Subscription to view status
   - Check database:
     ```sql
     SELECT * FROM subscriptions WHERE user_id = 'your-user-id';
     SELECT * FROM payment_transactions WHERE user_id = 'your-user-id';
     ```

6. **Test daily limits (Free tier):**
   - Create a new test user (they'll be on free tier)
   - Try submitting 10+ challenges → Should hit limit
   - Try using AI feedback 5+ times → Should hit limit

7. **Test webhook:**
   - Make a payment
   - Check webhook logs in Razorpay Dashboard
   - Verify transaction status updated in database

---

## 🔒 Step 8: Security Checklist

Before going live, ensure:

- [x] All API keys are in environment variables (not hardcoded)
- [x] `.env.local` is in `.gitignore`
- [x] Webhook signature verification is working
- [x] RLS policies are enabled on all payment tables
- [x] Server-side access checks are in place
- [x] Test mode keys are used in development
- [x] Live mode keys are used in production only
- [x] HTTPS is enabled in production

---

## 🚨 Troubleshooting

### Payment not completing:

- Check browser console for JavaScript errors
- Verify Razorpay Key ID is correct
- Check if Razorpay script loaded: `console.log(typeof Razorpay)`

### Webhook not receiving events:

- Verify webhook URL is publicly accessible
- Check webhook secret matches `.env.local`
- Look at webhook logs in Razorpay Dashboard
- Check application logs for webhook errors

### Database errors:

- Ensure migration ran successfully
- Check if `increment_daily_usage` function exists:
  ```sql
  SELECT routine_name FROM information_schema.routines
  WHERE routine_name = 'increment_daily_usage';
  ```

### Users can access paid content without subscription:

- Check if middleware is running (add console.log)
- Verify `canAccessChallengeTier()` is being called
- Check RLS policies are enabled
- Ensure server-side validation is in place

---

## 📊 Monitoring

### Key Metrics to Track:

1. **Conversion Rate:** Free → Paid subscriptions
2. **Trial-to-Paid Conversion:** Beta trials that convert to monthly
3. **Churn Rate:** Cancelled subscriptions
4. **Payment Failures:** Track failed payments
5. **Daily Active Users:** By subscription tier

### Check in Supabase Dashboard:

```sql
-- Subscription distribution
SELECT
  subscription_tier,
  subscription_status,
  COUNT(*) as count
FROM profiles
GROUP BY subscription_tier, subscription_status;

-- Revenue tracking
SELECT
  tier,
  COUNT(*) as count,
  SUM(amount) as total_revenue
FROM subscriptions
WHERE status IN ('active', 'trial')
GROUP BY tier;

-- Payment success rate
SELECT
  status,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
FROM payment_transactions
GROUP BY status;
```

---

## 🎉 Production Deployment

When ready to go live:

1. **Complete Razorpay KYC**
   - Submit business documents
   - Wait for approval

2. **Switch to Live Keys**
   - Update `.env.local` (or environment variables in hosting)
   - Change `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
   - Update `NEXT_PUBLIC_RAZORPAY_KEY_ID`

3. **Update Webhook URL**
   - Change webhook URL in Razorpay Dashboard to production URL
   - Update `RAZORPAY_WEBHOOK_SECRET`

4. **Test Live Payment**
   - Make ONE real payment with a small amount (₹10) to test
   - Use your own card
   - Verify everything works

5. **Monitor**
   - Set up error logging (Sentry, LogRocket, etc.)
   - Monitor webhook deliveries
   - Track payment success rates

6. **Legal**
   - Add Terms of Service
   - Add Refund Policy
   - Add Privacy Policy with payment information handling

---

## 📞 Support

### Razorpay Support:
- Email: support@razorpay.com
- Docs: https://razorpay.com/docs/

### Common Issues:
- Payment gateway errors → Contact Razorpay support
- Integration issues → Check Razorpay docs
- Database issues → Check Supabase logs

---

## ✨ Next Steps

After setup is complete:

1. Test thoroughly in test mode
2. Create beautiful checkout UI
3. Set up email notifications (payment success, trial ending, etc.)
4. Add analytics tracking
5. Monitor conversion rates
6. Optimize pricing based on data

---

**🎊 Congratulations! Your payment system is set up!**

Test thoroughly before going live. Good luck! 🚀
