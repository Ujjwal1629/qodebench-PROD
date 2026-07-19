'use server';

import { createClient } from '@/lib/supabase/server';
import {
  SubscriptionTier,
  SubscriptionStatus,
  UserSubscription,
} from '@/types/subscription';
import { ChallengeTier } from '@/lib/constants/dashboard';

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
 * Always returns true — all features accessible on free tier
 */
export async function hasActiveSubscription(userId?: string): Promise<boolean> {
  return true;
}

/**
 * Check if user can access a specific challenge tier
 * Always returns true — all tiers accessible on free tier
 */
export async function canAccessChallengeTier(
  tier: ChallengeTier,
  userId?: string
): Promise<{ canAccess: boolean; reason?: string }> {
  return { canAccess: true };
}

/**
 * Check if user can access a specific challenge
 * Always returns true — all challenges accessible on free tier
 */
export async function canAccessChallenge(
  challengeId: string,
  userId?: string
): Promise<{ canAccess: boolean; reason?: string; requiresUpgrade: boolean }> {
  return { canAccess: true, requiresUpgrade: false };
}

/**
 * Check if user can access interview prep mode
 * Always returns true — interviews accessible on free tier
 */
export async function canAccessInterviews(userId?: string): Promise<{ canAccess: boolean; reason?: string }> {
  return { canAccess: true };
}

/**
 * Check daily attempt limit for free users
 * Always allows — no daily limits enforced
 */
export async function canMakeAttempt(userId?: string): Promise<{ allowed: boolean; reason?: string; attemptsRemaining?: number }> {
  return { allowed: true };
}

/**
 * Check daily AI feedback limit for free users
 * Always allows — no AI feedback limits enforced
 */
export async function canUseAIFeedback(userId?: string): Promise<{ allowed: boolean; reason?: string; feedbackRemaining?: number }> {
  return { allowed: true };
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
 * Always returns unlimited — no limits enforced
 */
export async function getDailyLimits(userId?: string): Promise<{
  attemptsRemaining: number;
  feedbackRemaining: number;
  isPaidUser: boolean;
}> {
  return {
    attemptsRemaining: -1,
    feedbackRemaining: -1,
    isPaidUser: true,
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
