import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyRazorpaySignature, calculateSubscriptionEndDate } from '@/lib/razorpay';
import { SUBSCRIPTION_PLANS, SubscriptionTier } from '@/types/subscription';
import { updateUserSubscription } from '@/lib/utils/subscription-check';
import { rateLimiter, getRateLimitIdentifier } from '@/lib/utils/rate-limiter';
import { logger } from '@/lib/utils/logger';

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

    // Rate limiting for payment endpoints
    const rateLimitResult = rateLimiter.checkAndRespond(
      getRateLimitIdentifier(user.id),
      'payment'
    );
    if (rateLimitResult) return rateLimitResult.response;

    // Parse request body
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      tier,
    } = body as {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
      tier: Exclude<SubscriptionTier, 'free'>;
    };

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !tier) {
      return NextResponse.json(
        { error: 'Missing required payment details' },
        { status: 400 }
      );
    }

    // Validate tier
    if (!SUBSCRIPTION_PLANS[tier]) {
      return NextResponse.json({ error: 'Invalid subscription tier' }, { status: 400 });
    }

    // IDEMPOTENCY CHECK: Check if this payment was already processed
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('id, tier, status, start_date, end_date, trial_end_date')
      .eq('razorpay_payment_id', razorpay_payment_id)
      .single();

    if (existingSubscription) {
      // Payment already processed - return success (idempotent)
      logger.payment('Payment already processed (idempotent)', {
        tier: existingSubscription.tier,
        status: existingSubscription.status,
        // Don't log payment IDs for security
      });
      return NextResponse.json({
        success: true,
        message: 'Payment already verified',
        alreadyProcessed: true,
        subscription: {
          tier: existingSubscription.tier,
          status: existingSubscription.status,
          startDate: existingSubscription.start_date,
          endDate: existingSubscription.end_date,
          trialEndDate: existingSubscription.trial_end_date,
        },
      });
    }

    // Verify payment signature - CRITICAL FOR SECURITY
    const isValid = verifyRazorpaySignature({
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    });

    if (!isValid) {
      // SECURITY: Log signature verification failure without sensitive payment IDs
      logger.security('Payment signature verification failed', {
        action: 'payment_verification_failed',
        userId: user.id,
        tier,
        // Don't log payment IDs or signature for security
      }, 'error');

      // Update transaction as failed
      await supabase
        .from('payment_transactions')
        .update({
          status: 'failed',
          error_code: 'INVALID_SIGNATURE',
          error_description: 'Payment signature verification failed',
          updated_at: new Date().toISOString(),
        })
        .eq('razorpay_order_id', razorpay_order_id);

      return NextResponse.json(
        { error: 'Payment verification failed. Please contact support.' },
        { status: 400 }
      );
    }

    // Calculate subscription dates
    const startDate = new Date();
    const endDate = calculateSubscriptionEndDate(tier, startDate);
    const trialEndDate = tier === 'launch_offer' ? calculateSubscriptionEndDate('launch_offer', startDate) : undefined;

    // Create subscription record with conflict handling for idempotency
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: user.id,
        tier: tier,
        status: 'active',
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        trial_end_date: trialEndDate?.toISOString() || null,
        amount: SUBSCRIPTION_PLANS[tier].priceInPaise,
        currency: 'INR',
        razorpay_order_id: razorpay_order_id,
        razorpay_payment_id: razorpay_payment_id,
        auto_renew: true,
      })
      .select()
      .single();

    // Handle unique constraint violation (concurrent request processed first)
    if (subscriptionError) {
      if (subscriptionError.code === '23505') {
        // Unique violation - another request already created this subscription
        const { data: existing } = await supabase
          .from('subscriptions')
          .select('id, tier, status, start_date, end_date, trial_end_date')
          .eq('razorpay_payment_id', razorpay_payment_id)
          .single();

        if (existing) {
          return NextResponse.json({
            success: true,
            message: 'Payment verified successfully',
            alreadyProcessed: true,
            subscription: {
              tier: existing.tier,
              status: existing.status,
              startDate: existing.start_date,
              endDate: existing.end_date,
              trialEndDate: existing.trial_end_date,
            },
          });
        }
      }

      logger.error('Error creating subscription', {
        userId: user.id,
        tier,
        errorCode: subscriptionError.code,
        // Don't log payment IDs for security
      }, subscriptionError as Error);
      return NextResponse.json(
        { error: 'Failed to create subscription. Please contact support.' },
        { status: 500 }
      );
    }

    // Update transaction as success
    await supabase
      .from('payment_transactions')
      .update({
        subscription_id: subscription.id,
        status: 'success',
        razorpay_payment_id: razorpay_payment_id,
        razorpay_signature: razorpay_signature,
        updated_at: new Date().toISOString(),
      })
      .eq('razorpay_order_id', razorpay_order_id);

    // Update user profile with subscription details
    const updateSuccess = await updateUserSubscription(
      user.id,
      tier,
      tier === 'launch_offer' ? 'trial' : 'active',
      startDate,
      endDate,
      trialEndDate
    );

    if (!updateSuccess) {
      logger.error('Failed to update user profile with subscription', {
        userId: user.id,
        tier,
        subscriptionId: subscription.id,
      });
      // Don't fail the payment, log for manual review
    } else {
      logger.payment('Payment verified and subscription created successfully', {
        userId: user.id,
        tier,
        status: tier === 'launch_offer' ? 'trial' : 'active',
      });
    }

    // Return success
    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      subscription: {
        tier,
        status: tier === 'launch_offer' ? 'trial' : 'active',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        trialEndDate: trialEndDate?.toISOString() || null,
      },
    });
  } catch (error: any) {
    logger.error('Error in verify-payment API', {
      // Don't log payment IDs or sensitive data
      errorCode: error?.code,
      errorMessage: error?.message,
    }, error instanceof Error ? error : new Error(String(error)));

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
