-- =====================================================
-- Payment System & Subscription Management
-- Razorpay Integration for QodeBench
-- =====================================================

-- =====================================================
-- 1. ADD SUBSCRIPTION FIELDS TO PROFILES TABLE
-- =====================================================

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'beta', 'monthly', 'quarterly', 'yearly')),
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'trial', 'expired', 'cancelled', 'payment_failed')),
ADD COLUMN IF NOT EXISTS subscription_start_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS auto_renew BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS daily_attempts_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS daily_ai_feedback_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS daily_limit_reset_at TIMESTAMPTZ DEFAULT NOW();

-- Add comments for documentation
COMMENT ON COLUMN profiles.subscription_tier IS 'User subscription tier: free (default), beta (₹199 trial), monthly (₹999), quarterly (₹1999), yearly (₹4999)';
COMMENT ON COLUMN profiles.subscription_status IS 'Subscription status: active (paid), trial (beta period), expired, cancelled, payment_failed';
COMMENT ON COLUMN profiles.subscription_start_date IS 'When current subscription started';
COMMENT ON COLUMN profiles.subscription_end_date IS 'When current subscription expires (for trial/cancelled)';
COMMENT ON COLUMN profiles.trial_ends_at IS 'Beta trial expiration (21 days from purchase)';
COMMENT ON COLUMN profiles.auto_renew IS 'Whether subscription should auto-renew';
COMMENT ON COLUMN profiles.daily_attempts_used IS 'Number of challenge attempts used today (free tier limit: 10)';
COMMENT ON COLUMN profiles.daily_ai_feedback_used IS 'Number of AI feedback requests used today (free tier limit: 5)';
COMMENT ON COLUMN profiles.daily_limit_reset_at IS 'Last time daily limits were reset (should reset at midnight UTC)';

-- =====================================================
-- 2. CREATE SUBSCRIPTIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Subscription details
  tier TEXT NOT NULL CHECK (tier IN ('beta', 'monthly', 'quarterly', 'yearly')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'active', 'expired', 'cancelled', 'payment_failed')),

  -- Dates
  start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_date TIMESTAMPTZ NOT NULL,
  trial_end_date TIMESTAMPTZ, -- Only for beta tier
  cancelled_at TIMESTAMPTZ,

  -- Payment details
  amount INTEGER NOT NULL, -- Amount in paise (INR)
  currency TEXT DEFAULT 'INR',

  -- Razorpay IDs
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_subscription_id TEXT, -- For recurring payments

  -- Auto-renewal
  auto_renew BOOLEAN DEFAULT true,
  renewal_attempts INTEGER DEFAULT 0,
  last_renewal_attempt TIMESTAMPTZ,

  -- Metadata
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Indexes
  CONSTRAINT unique_active_subscription UNIQUE (user_id, status)
    DEFERRABLE INITIALLY DEFERRED
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_end_date ON subscriptions(end_date);
CREATE INDEX IF NOT EXISTS idx_subscriptions_razorpay_order ON subscriptions(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_razorpay_payment ON subscriptions(razorpay_payment_id);

COMMENT ON TABLE subscriptions IS 'User subscription records with Razorpay payment tracking';

-- =====================================================
-- 3. CREATE PAYMENT TRANSACTIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,

  -- Transaction details
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('purchase', 'renewal', 'refund', 'cancellation')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'success', 'failed', 'refunded')),

  -- Payment details
  amount INTEGER NOT NULL, -- Amount in paise (INR)
  currency TEXT DEFAULT 'INR',

  -- Razorpay details
  razorpay_order_id TEXT NOT NULL,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,

  -- Error handling
  error_code TEXT,
  error_description TEXT,

  -- Metadata from Razorpay webhook
  razorpay_webhook_data JSONB,

  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_subscription_id ON payment_transactions(subscription_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_razorpay_order ON payment_transactions(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_transactions_razorpay_payment ON payment_transactions(razorpay_payment_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON payment_transactions(created_at DESC);

COMMENT ON TABLE payment_transactions IS 'Audit trail for all payment transactions';

-- =====================================================
-- 4. ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- Subscriptions: Users can only view their own subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Subscriptions: System can manage (via service role)
CREATE POLICY "Service role can manage subscriptions"
  ON subscriptions FOR ALL
  USING (true)
  WITH CHECK (true);

-- Transactions: Users can only view their own transactions
CREATE POLICY "Users can view own transactions"
  ON payment_transactions FOR SELECT
  USING (auth.uid() = user_id);

-- Transactions: System can manage (via service role)
CREATE POLICY "Service role can manage transactions"
  ON payment_transactions FOR ALL
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- 5. HELPER FUNCTIONS
-- =====================================================

-- Function to check if user has active subscription
CREATE OR REPLACE FUNCTION has_active_subscription(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_subscription_status TEXT;
  v_subscription_end TIMESTAMPTZ;
BEGIN
  SELECT subscription_status, subscription_end_date
  INTO v_subscription_status, v_subscription_end
  FROM profiles
  WHERE id = p_user_id;

  -- Active if: status is 'active' or 'trial' AND end_date is in future (or NULL for perpetual)
  RETURN (v_subscription_status IN ('active', 'trial') AND
          (v_subscription_end IS NULL OR v_subscription_end > NOW()));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can access paid content
CREATE OR REPLACE FUNCTION can_access_paid_content(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_tier TEXT;
BEGIN
  SELECT subscription_tier
  INTO v_tier
  FROM profiles
  WHERE id = p_user_id;

  -- Can access if tier is not 'free' AND has active subscription
  RETURN (v_tier != 'free' AND has_active_subscription(p_user_id));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reset daily limits for all users
CREATE OR REPLACE FUNCTION reset_daily_limits()
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET
    daily_attempts_used = 0,
    daily_ai_feedback_used = 0,
    daily_limit_reset_at = NOW()
  WHERE daily_limit_reset_at < (NOW() - INTERVAL '1 day');
END;
$$ LANGUAGE plpgsql;

-- Function to expire trials and subscriptions
CREATE OR REPLACE FUNCTION update_subscription_status()
RETURNS void AS $$
BEGIN
  -- Expire beta trials
  UPDATE profiles
  SET
    subscription_status = 'expired',
    auto_renew = false
  WHERE subscription_status = 'trial'
    AND trial_ends_at IS NOT NULL
    AND trial_ends_at < NOW();

  -- Expire subscriptions that have ended and aren't set to auto-renew
  UPDATE profiles
  SET subscription_status = 'expired'
  WHERE subscription_status = 'active'
    AND subscription_end_date IS NOT NULL
    AND subscription_end_date < NOW()
    AND auto_renew = false;

  -- Update subscriptions table status as well
  UPDATE subscriptions
  SET
    status = 'expired',
    updated_at = NOW()
  WHERE status = 'active'
    AND end_date < NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to increment daily usage counters
CREATE OR REPLACE FUNCTION increment_daily_usage(
  p_user_id UUID,
  p_usage_type TEXT -- 'attempts' or 'ai_feedback'
)
RETURNS BOOLEAN AS $$
DECLARE
  v_current_attempts INTEGER;
  v_current_ai_usage INTEGER;
  v_last_reset TIMESTAMPTZ;
  v_subscription_tier TEXT;
BEGIN
  -- Get current usage and tier
  SELECT
    daily_attempts_used,
    daily_ai_feedback_used,
    daily_limit_reset_at,
    subscription_tier
  INTO v_current_attempts, v_current_ai_usage, v_last_reset, v_subscription_tier
  FROM profiles
  WHERE id = p_user_id;

  -- Reset if last reset was more than 24 hours ago
  IF v_last_reset < (NOW() - INTERVAL '1 day') THEN
    UPDATE profiles
    SET
      daily_attempts_used = 0,
      daily_ai_feedback_used = 0,
      daily_limit_reset_at = NOW()
    WHERE id = p_user_id;

    v_current_attempts := 0;
    v_current_ai_usage := 0;
  END IF;

  -- If not free tier, allow unlimited
  IF v_subscription_tier != 'free' THEN
    RETURN true;
  END IF;

  -- Check and increment based on usage type
  IF p_usage_type = 'attempts' THEN
    IF v_current_attempts >= 10 THEN
      RETURN false; -- Limit reached
    END IF;

    UPDATE profiles
    SET daily_attempts_used = daily_attempts_used + 1
    WHERE id = p_user_id;

  ELSIF p_usage_type = 'ai_feedback' THEN
    IF v_current_ai_usage >= 5 THEN
      RETURN false; -- Limit reached
    END IF;

    UPDATE profiles
    SET daily_ai_feedback_used = daily_ai_feedback_used + 1
    WHERE id = p_user_id;
  END IF;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 6. TRIGGERS
-- =====================================================

-- Update updated_at timestamp
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON payment_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 7. GRANT PERMISSIONS
-- =====================================================

GRANT SELECT ON subscriptions TO authenticated;
GRANT SELECT ON payment_transactions TO authenticated;
GRANT EXECUTE ON FUNCTION has_active_subscription(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION can_access_paid_content(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_daily_usage(UUID, TEXT) TO authenticated;

-- =====================================================
-- 8. SCHEDULED JOBS SETUP (Using pg_cron)
-- =====================================================
-- Note: Run these commands in Supabase SQL Editor after enabling pg_cron

-- Reset daily limits at midnight UTC
-- SELECT cron.schedule(
--   'reset-daily-limits',
--   '0 0 * * *', -- Every day at midnight UTC
--   $$ SELECT reset_daily_limits(); $$
-- );

-- Update subscription status (expire trials and subscriptions)
-- SELECT cron.schedule(
--   'update-subscription-status',
--   '*/30 * * * *', -- Every 30 minutes
--   $$ SELECT update_subscription_status(); $$
-- );

-- =====================================================
-- 9. INITIAL DATA - SET ALL EXISTING USERS TO FREE
-- =====================================================

-- Update all existing users to free tier with active status
UPDATE profiles
SET
  subscription_tier = 'free',
  subscription_status = 'active',
  subscription_start_date = NOW(),
  daily_attempts_used = 0,
  daily_ai_feedback_used = 0,
  daily_limit_reset_at = NOW()
WHERE subscription_tier IS NULL;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check subscription distribution
-- SELECT subscription_tier, subscription_status, COUNT(*) as count
-- FROM profiles
-- GROUP BY subscription_tier, subscription_status
-- ORDER BY subscription_tier, subscription_status;

-- Check if functions work
-- SELECT has_active_subscription(auth.uid());
-- SELECT can_access_paid_content(auth.uid());
