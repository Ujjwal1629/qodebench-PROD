'use server';

import { createClient } from '@/lib/supabase/server';
import {
  SubscriptionTier,
  SubscriptionStatus,
  UserSubscription,
  FREE_TIER_LIMITS,
} from '@/types/subscription';
import { ChallengeTier } from '@/lib/constants/dashboard';
import { FREE_CHALLENGES_PER_TIER } from '@/lib/constants/subscription';

/**
 * Get user's subscription details
 */
export async function getUserSubscription(userId?: string): Promise<UserSubscription | null> {
  try {
    const supabase = await createClient();

    let targetUserId = userId;
    if (!targetUserId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      targetUserId = user.id;
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select(
        'subscription_tier, subscription_status, subscription_start_date, subscription_end_date, trial_ends_at, auto_renew, daily_attempts_used, daily_ai_feedback_used'
      )
      .eq('id', targetUserId)
      .single();

    if (error || !profile) {
      console.error('Error fetching subscription:', error);
      return null;
    }

    return {
      tier: profile.subscription_tier as SubscriptionTier,
      status: profile.subscription_status as SubscriptionStatus,
      startDate: profile.subscription_start_date,
      endDate: profile.subscription_end_date,
      trialEndsAt: profile.trial_ends_at,
      autoRenew: profile.auto_renew,
      dailyAttemptsUsed: profile.daily_attempts_used,
      dailyAIFeedbackUsed: profile.daily_ai_feedback_used,
    };
  } catch (error) {
    console.error('Error in getUserSubscription:', error);
    return null;
  }
}

/**
 * Check if user has an active paid subscription
 * This is the main access control function
 * Note: Cancelled subscriptions are still considered active until the end date
 */
export async function hasActiveSubscription(userId?: string): Promise<boolean> {
  const subscription = await getUserSubscription(userId);

  if (!subscription) return false;

  // Check if subscription tier is not free
  const isPaidTier = subscription.tier !== 'free';

  // Check if status is active, trial, or cancelled (cancelled users retain access until end date)
  const isActiveStatus =
    subscription.status === 'active' ||
    subscription.status === 'trial' ||
    subscription.status === 'cancelled';

  // Check if subscription has not expired (this is what matters for cancelled subscriptions)
  let notExpired = true;
  if (subscription.endDate) {
    notExpired = new Date(subscription.endDate) > new Date();
  }
  if (subscription.trialEndsAt) {
    notExpired = notExpired && new Date(subscription.trialEndsAt) > new Date();
  }

  // For cancelled subscriptions, only grant access if end date hasn't passed
  // For active/trial, grant access if status is valid and not expired
  return isPaidTier && isActiveStatus && notExpired;
}

/**
 * Check if user can access a specific challenge tier
 */
export async function canAccessChallengeTier(
  tier: ChallengeTier,
  userId?: string
): Promise<{ canAccess: boolean; reason?: string }> {
  // Beginner tier is always accessible
  if (tier === 'beginner') {
    return { canAccess: true };
  }

  // All other tiers require active subscription
  const hasSubscription = await hasActiveSubscription(userId);

  if (!hasSubscription) {
    return {
      canAccess: false,
      reason: `${tier.charAt(0).toUpperCase() + tier.slice(1)} challenges require an active subscription. Upgrade to unlock!`,
    };
  }

  return { canAccess: true };
}

/**
 * Check if user can access a specific challenge
 * Enforces tier-specific position-based access:
 * - Beginner, Intermediate, Office Workflow: First 5 free
 * - Advanced: First 2 free
 * Rest require subscription
 */
export async function canAccessChallenge(
  challengeId: string,
  userId?: string
): Promise<{ canAccess: boolean; reason?: string; requiresUpgrade: boolean }> {
  try {
    const supabase = await createClient();

    // Fetch challenge details including position in tier
    const { data: challenge, error } = await supabase
      .from('challenges')
      .select('tier, is_free_tier_accessible, order_in_tier, title')
      .eq('id', challengeId)
      .eq('is_active', true)
      .single();

    if (error || !challenge) {
      return { canAccess: false, reason: 'Challenge not found', requiresUpgrade: false };
    }

    // TIER-SPECIFIC POSITION-BASED ACCESS CONTROL
    const tier = challenge.tier as ChallengeTier;
    const freeLimit = FREE_CHALLENGES_PER_TIER[tier] || 5; // Default to 5 if tier not found
    const isFreePosition = challenge.order_in_tier <= freeLimit;

    // Special override: if challenge is explicitly marked as free-tier accessible, grant access
    // This allows admins to make specific challenges free beyond the free limit
    if (challenge.is_free_tier_accessible) {
      return { canAccess: true, requiresUpgrade: false };
    }

    // If challenge is in free position, grant access
    if (isFreePosition) {
      return { canAccess: true, requiresUpgrade: false };
    }

    // Challenges beyond free limit require active subscription
    const hasSubscription = await hasActiveSubscription(userId);

    if (!hasSubscription) {
      return {
        canAccess: false,
        reason: `This is a premium challenge. Upgrade to unlock all challenges in the ${tier} tier!`,
        requiresUpgrade: true,
      };
    }

    return { canAccess: true, requiresUpgrade: false };
  } catch (error) {
    console.error('Error in canAccessChallenge:', error);
    return { canAccess: false, reason: 'Error checking access', requiresUpgrade: false };
  }
}

/**
 * Check if user can access interview prep mode
 */
export async function canAccessInterviews(userId?: string): Promise<{ canAccess: boolean; reason?: string }> {
  const hasSubscription = await hasActiveSubscription(userId);

  if (!hasSubscription) {
    return {
      canAccess: false,
      reason: 'Mock Interview Prep requires an active subscription. Upgrade to unlock!',
    };
  }

  return { canAccess: true };
}

/**
 * Check daily attempt limit for free users
 */
export async function canMakeAttempt(userId?: string): Promise<{ allowed: boolean; reason?: string; attemptsRemaining?: number }> {
  const subscription = await getUserSubscription(userId);

  if (!subscription) {
    return { allowed: false, reason: 'User not found' };
  }

  // Paid users have unlimited attempts
  if (subscription.tier !== 'free') {
    return { allowed: true };
  }

  // Check if daily limit reached
  const attemptsRemaining = FREE_TIER_LIMITS.dailyAttempts - subscription.dailyAttemptsUsed;

  if (attemptsRemaining <= 0) {
    return {
      allowed: false,
      reason: `You've reached your daily limit of ${FREE_TIER_LIMITS.dailyAttempts} attempts. Upgrade for unlimited access!`,
      attemptsRemaining: 0,
    };
  }

  return {
    allowed: true,
    attemptsRemaining,
  };
}

/**
 * Check daily AI feedback limit for free users
 */
export async function canUseAIFeedback(userId?: string): Promise<{ allowed: boolean; reason?: string; feedbackRemaining?: number }> {
  const subscription = await getUserSubscription(userId);

  if (!subscription) {
    return { allowed: false, reason: 'User not found' };
  }

  // Paid users have unlimited AI feedback
  if (subscription.tier !== 'free') {
    return { allowed: true };
  }

  // Check if daily limit reached
  const feedbackRemaining = FREE_TIER_LIMITS.dailyAIFeedback - subscription.dailyAIFeedbackUsed;

  if (feedbackRemaining <= 0) {
    return {
      allowed: false,
      reason: `You've reached your daily limit of ${FREE_TIER_LIMITS.dailyAIFeedback} AI feedback requests. Upgrade for unlimited access!`,
      feedbackRemaining: 0,
    };
  }

  return {
    allowed: true,
    feedbackRemaining,
  };
}

/**
 * Increment daily usage counter
 * Should be called after successful attempt or AI feedback
 */
export async function incrementDailyUsage(
  type: 'attempts' | 'ai_feedback',
  userId?: string
): Promise<boolean> {
  try {
    const supabase = await createClient();

    let targetUserId = userId;
    if (!targetUserId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      targetUserId = user.id;
    }

    // Call the database function to increment usage
    const { data, error } = await supabase.rpc('increment_daily_usage', {
      p_user_id: targetUserId,
      p_usage_type: type,
    });

    if (error) {
      console.error('Error incrementing daily usage:', error);
      return false;
    }

    return data as boolean;
  } catch (error) {
    console.error('Error in incrementDailyUsage:', error);
    return false;
  }
}

/**
 * Get remaining daily limits for user
 */
export async function getDailyLimits(userId?: string): Promise<{
  attemptsRemaining: number;
  feedbackRemaining: number;
  isPaidUser: boolean;
}> {
  const subscription = await getUserSubscription(userId);

  if (!subscription) {
    return {
      attemptsRemaining: 0,
      feedbackRemaining: 0,
      isPaidUser: false,
    };
  }

  // Paid users have unlimited
  if (subscription.tier !== 'free') {
    return {
      attemptsRemaining: -1, // -1 indicates unlimited
      feedbackRemaining: -1,
      isPaidUser: true,
    };
  }

  return {
    attemptsRemaining: Math.max(0, FREE_TIER_LIMITS.dailyAttempts - subscription.dailyAttemptsUsed),
    feedbackRemaining: Math.max(0, FREE_TIER_LIMITS.dailyAIFeedback - subscription.dailyAIFeedbackUsed),
    isPaidUser: false,
  };
}

/**
 * Check if trial is ending soon (within 3 days)
 */
export async function isTrialEndingSoon(userId?: string): Promise<{ endingSoon: boolean; daysRemaining?: number }> {
  const subscription = await getUserSubscription(userId);

  if (!subscription || !subscription.trialEndsAt) {
    return { endingSoon: false };
  }

  const now = new Date();
  const trialEnd = new Date(subscription.trialEndsAt);
  const daysRemaining = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (daysRemaining <= 3 && daysRemaining > 0) {
    return { endingSoon: true, daysRemaining };
  }

  return { endingSoon: false, daysRemaining };
}

/**
 * Update subscription status (called after payment)
 */
export async function updateUserSubscription(
  userId: string,
  tier: SubscriptionTier,
  status: SubscriptionStatus,
  startDate: Date,
  endDate: Date,
  trialEndDate?: Date
): Promise<boolean> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('profiles')
      .update({
        subscription_tier: tier,
        subscription_status: status,
        subscription_start_date: startDate.toISOString(),
        subscription_end_date: endDate.toISOString(),
        trial_ends_at: trialEndDate?.toISOString() || null,
        auto_renew: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      console.error('Error updating subscription:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateUserSubscription:', error);
    return false;
  }
}
