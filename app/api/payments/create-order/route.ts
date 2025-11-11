import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createRazorpayOrder, generateReceiptId } from '@/lib/razorpay';
import { SUBSCRIPTION_PLANS, SubscriptionTier } from '@/types/subscription';

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
    const { tier } = body as { tier: Exclude<SubscriptionTier, 'free'> };

    // Validate tier
    if (!tier || !SUBSCRIPTION_PLANS[tier]) {
      return NextResponse.json({ error: 'Invalid subscription tier' }, { status: 400 });
    }

    const plan = SUBSCRIPTION_PLANS[tier];

    // Generate receipt ID
    const receiptId = generateReceiptId(user.id, tier);

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
      console.error('Failed to create Razorpay order:', result.error);
      return NextResponse.json(
        { error: 'Failed to create order. Please try again.' },
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
      console.error('Error creating transaction record:', transactionError);
      // Continue anyway - order is created
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
    console.error('Error in create-order API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
