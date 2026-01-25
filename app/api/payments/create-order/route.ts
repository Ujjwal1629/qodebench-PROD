import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createRazorpayOrder, generateReceiptId } from '@/lib/razorpay';
import { SUBSCRIPTION_PLANS, SubscriptionTier } from '@/types/subscription';
import { logger } from '@/lib/utils/logger';

export async function POST(request: NextRequest) {
  try {
    // Check if Razorpay credentials are configured
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      logger.error('Razorpay credentials not configured', {
        hasKeyId: !!process.env.RAZORPAY_KEY_ID,
        hasKeySecret: !!process.env.RAZORPAY_KEY_SECRET,
      });
      return NextResponse.json(
        {
          error: 'Payment system not configured. Please contact support.',
          details: process.env.NODE_ENV === 'development'
            ? 'Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET environment variables'
            : undefined,
        },
        { status: 500 }
      );
    }

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
    const { tier } = body as { tier: Exclude<SubscriptionTier, 'free'> };

    // Validate tier
    // @ts-ignore - We're validating existence at runtime
    if (!tier || !SUBSCRIPTION_PLANS[tier]) {
      return NextResponse.json({ error: 'Invalid subscription tier' }, { status: 400 });
    }

    // @ts-ignore
    const plan = SUBSCRIPTION_PLANS[tier];

    // Generate receipt ID
    const receiptId = generateReceiptId(user.id, tier);

    logger.payment('Creating Razorpay order', {
      userId: user.id,
      tier,
      amount: plan.priceInPaise,
    });

    // Create Razorpay order
    const result = await createRazorpayOrder({
      amount: plan.priceInPaise,
      currency: 'INR',
      receipt: receiptId,
      notes: {
        userId: user.id,
        tier: tier,
        plan: plan.name,
      },
    });

    if (!result.success || !result.order) {
      logger.error('Failed to create Razorpay order', {
        userId: user.id,
        tier,
        error: result.error,
      });
      return NextResponse.json(
        {
          error: 'Failed to create order. Please try again.',
          details: process.env.NODE_ENV === 'development' ? result.error : undefined,
        },
        { status: 500 }
      );
    }

    // Create pending transaction record
    const { error: transactionError } = await supabase
      .from('payment_transactions')
      .insert({
        user_id: user.id,
        transaction_type: 'purchase',
        status: 'pending',
        amount: plan.priceInPaise,
        currency: 'INR',
        razorpay_order_id: result.order.id,
      });

    if (transactionError) {
      logger.error('Error creating transaction record', {
        userId: user.id,
        orderId: result.order.id,
      }, transactionError as Error);
      // Continue anyway - order is created
    } else {
      logger.payment('Order created successfully', {
        userId: user.id,
        tier,
        orderId: result.order.id,
      });
    }

    // Return order details to client
    return NextResponse.json({
      success: true,
      orderId: result.order.id,
      amount: plan.priceInPaise,
      currency: 'INR',
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      name: 'QodeBench',
      description: `${plan.name} Subscription`,
      prefill: {
        email: user.email,
      },
    });
  } catch (error) {
    logger.error('Error in create-order API', {}, error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' && error instanceof Error
          ? error.message
          : undefined,
      },
      { status: 500 }
    );
  }
}
