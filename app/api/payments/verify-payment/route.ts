import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyRazorpaySignature, calculateSubscriptionEndDate } from '@/lib/razorpay';
import { SUBSCRIPTION_PLANS, SubscriptionTier } from '@/types/subscription';
import { updateUserSubscription } from '@/lib/utils/subscription-check';

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

    // Verify payment signature - CRITICAL FOR SECURITY
    const isValid = verifyRazorpaySignature({
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    });

    if (!isValid) {
      console.error('Invalid payment signature:', {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      });

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
    const trialEndDate = tier === 'beta' ? calculateSubscriptionEndDate('beta', startDate) : undefined;

    // Create subscription record
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: user.id,
        tier: tier,
        status: 'active', // All subscriptions are 'active' (trial status tracked in profiles.subscription_status)
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

    if (subscriptionError) {
      console.error('Error creating subscription:', subscriptionError);
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
      tier === 'beta' ? 'trial' : 'active',
      startDate,
      endDate,
      trialEndDate
    );

    if (!updateSuccess) {
      console.error('Failed to update user profile with subscription');
      // Don't fail the payment, log for manual review
    }

    // Return success
    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      subscription: {
        tier,
        status: tier === 'beta' ? 'trial' : 'active',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        trialEndDate: trialEndDate?.toISOString() || null,
      },
    });
  } catch (error: any) {
    console.error('Error in verify-payment API:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
