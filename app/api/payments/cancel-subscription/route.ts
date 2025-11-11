import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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
      return NextResponse.json(
        { error: 'No active subscription to cancel' },
        { status: 400 }
      );
    }

    // Try to get subscription from subscriptions table (might not exist for beta users)
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .in('status', ['active', 'pending'])
      .maybeSingle();

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
        console.error('Error updating subscription record:', updateError);
        // Continue anyway - profile update is more important
      }

      // Create cancellation transaction record
      await supabase.from('payment_transactions').insert({
        user_id: user.id,
        subscription_id: subscription.id,
        transaction_type: 'cancellation',
        status: 'success',
        amount: 0,
        currency: 'INR',
        razorpay_order_id: `cancel_${subscription.id}`,
      });
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
      console.error('Error updating profile:', profileUpdateError);
      return NextResponse.json(
        { error: 'Failed to cancel subscription' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription cancelled successfully. You retain access until your subscription end date.',
      endDate: profile.subscription_end_date,
    });
  } catch (error) {
    console.error('Error in cancel-subscription API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
