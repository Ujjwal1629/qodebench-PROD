import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/utils/logger';

/**
 * Cancel user's subscription
 * Note: User retains access until subscription end date
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // First check user's profile for subscription status
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('subscription_tier, subscription_status, subscription_end_date')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      logger.error('User profile not found during cancellation', { userId: user.id }, profileError as Error);
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    // Check if user has a cancellable subscription
    const isCancellable =
      profile.subscription_tier !== 'free' &&
      (profile.subscription_status === 'active' || profile.subscription_status === 'trial');

    if (!isCancellable) {
      logger.info('Cancellation attempted for non-cancellable subscription', {
        userId: user.id,
        tier: profile.subscription_tier,
        status: profile.subscription_status,
      });
      return NextResponse.json(
        { error: 'No active subscription to cancel' },
        { status: 400 }
      );
    }

    // CRITICAL VALIDATION: Get subscription from subscriptions table
    // This prevents cancellation bypass via profile manipulation
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .in('status', ['active', 'pending'])
      .maybeSingle();

    // Additional validation: Ensure subscription belongs to user (defense in depth)
    if (subscription && subscription.user_id !== user.id) {
      logger.security('Subscription user_id mismatch during cancellation', {
        userId: user.id,
        subscriptionUserId: subscription.user_id,
        subscriptionId: subscription.id,
      }, 'error');
      return NextResponse.json(
        { error: 'Invalid subscription' },
        { status: 403 }
      );
    }

    // If subscription record doesn't exist but profile says they have one, this is suspicious
    // However, beta trials might not have subscription records if they never completed payment
    // So we allow cancellation but log it for monitoring
    if (!subscription) {
      logger.warn('Cancellation for profile with subscription but no subscription record', {
        userId: user.id,
        tier: profile.subscription_tier,
        status: profile.subscription_status,
      });

      // Only allow if it's a beta trial (which might not have a payment record)
      if (profile.subscription_tier !== 'beta') {
        logger.security('Non-beta subscription without subscription record - possible data corruption', {
          userId: user.id,
          tier: profile.subscription_tier,
        }, 'error');
        return NextResponse.json(
          { error: 'Subscription record not found. Please contact support.' },
          { status: 400 }
        );
      }
    }

    // Update subscription in subscriptions table if it exists
    if (subscription) {
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({
          status: 'cancelled',
          auto_renew: false,
          cancelled_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', subscription.id);

      if (updateError) {
        logger.error('Error updating subscription record during cancellation', {
          userId: user.id,
          subscriptionId: subscription.id,
        }, updateError as Error);
        // Continue anyway - profile update is more important
      } else {
        logger.payment('Subscription record updated to cancelled', {
          userId: user.id,
          subscriptionId: subscription.id,
          tier: subscription.tier,
        });
      }

      // Create cancellation transaction record
      const { error: transactionError } = await supabase.from('payment_transactions').insert({
        user_id: user.id,
        subscription_id: subscription.id,
        transaction_type: 'cancellation',
        status: 'success',
        amount: 0,
        currency: 'INR',
        razorpay_order_id: `cancel_${subscription.id}`,
      });

      if (transactionError) {
        logger.error('Failed to create cancellation transaction record', {
          userId: user.id,
          subscriptionId: subscription.id,
        }, transactionError as Error);
      }
    }

    // Update user profile (this is the source of truth)
    const { error: profileUpdateError } = await supabase
      .from('profiles')
      .update({
        subscription_status: 'cancelled',
        auto_renew: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (profileUpdateError) {
      logger.error('Error updating profile during subscription cancellation', {
        userId: user.id,
      }, profileUpdateError as Error);
      return NextResponse.json(
        { error: 'Failed to cancel subscription' },
        { status: 500 }
      );
    }

    logger.payment('Subscription cancelled successfully', {
      userId: user.id,
      tier: profile.subscription_tier,
      endDate: profile.subscription_end_date,
    });

    return NextResponse.json({
      success: true,
      message: 'Subscription cancelled successfully. You retain access until your subscription end date.',
      endDate: profile.subscription_end_date,
    });
  } catch (error) {
    logger.error('Error in cancel-subscription API', {}, error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
