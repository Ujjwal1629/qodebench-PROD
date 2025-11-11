import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserSubscription, hasActiveSubscription, getDailyLimits } from '@/lib/utils/subscription-check';

/**
 * Get user's subscription status and details
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get subscription details
    const subscription = await getUserSubscription(user.id);
    if (!subscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }

    // Check if active
    const isActive = await hasActiveSubscription(user.id);

    // Get daily limits
    const limits = await getDailyLimits(user.id);

    // Calculate days remaining for trial
    let daysRemaining: number | null = null;
    if (subscription.trialEndsAt) {
      const now = new Date();
      const trialEnd = new Date(subscription.trialEndsAt);
      daysRemaining = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    }

    return NextResponse.json({
      subscription: {
        tier: subscription.tier,
        status: subscription.status,
        isActive,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        trialEndsAt: subscription.trialEndsAt,
        daysRemaining,
        autoRenew: subscription.autoRenew,
      },
      limits: {
        dailyAttemptsRemaining: limits.attemptsRemaining,
        dailyAIFeedbackRemaining: limits.feedbackRemaining,
        isPaidUser: limits.isPaidUser,
      },
    });
  } catch (error) {
    console.error('Error in subscription-status API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
