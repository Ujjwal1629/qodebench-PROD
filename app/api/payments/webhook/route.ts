import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyRazorpayWebhook } from '@/lib/razorpay';

/**
 * Razorpay Webhook Handler
 * Handles payment events like:
 * - payment.captured
 * - payment.failed
 * - subscription.charged (for auto-renewal)
 * - subscription.cancelled
 */
export async function POST(request: NextRequest) {
  try {
    // Get webhook signature from headers
    const webhookSignature = request.headers.get('x-razorpay-signature');

    if (!webhookSignature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // Get raw body for signature verification
    const rawBody = await request.text();

    // Verify webhook signature - CRITICAL FOR SECURITY
    const isValid = verifyRazorpayWebhook(rawBody, webhookSignature);

    if (!isValid) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Parse webhook payload
    const payload = JSON.parse(rawBody);
    const event = payload.event;
    const paymentEntity = payload.payload.payment?.entity;
    const subscriptionEntity = payload.payload.subscription?.entity;

    console.log('Razorpay webhook received:', event);

    // Use service role client for webhook operations
    const supabase = await createClient();

    // Handle different webhook events
    switch (event) {
      case 'payment.captured': {
        // Payment successful - already handled in verify-payment
        // This is backup in case verify-payment fails
        if (paymentEntity) {
          const { data: transaction } = await supabase
            .from('payment_transactions')
            .select('*')
            .eq('razorpay_payment_id', paymentEntity.id)
            .single();

          if (transaction && transaction.status !== 'success') {
            // Update transaction status
            await supabase
              .from('payment_transactions')
              .update({
                status: 'success',
                razorpay_webhook_data: paymentEntity,
                updated_at: new Date().toISOString(),
              })
              .eq('id', transaction.id);

            console.log('Payment captured via webhook:', paymentEntity.id);
          }
        }
        break;
      }

      case 'payment.failed': {
        // Payment failed
        if (paymentEntity) {
          await supabase
            .from('payment_transactions')
            .update({
              status: 'failed',
              error_code: paymentEntity.error_code,
              error_description: paymentEntity.error_description,
              razorpay_webhook_data: paymentEntity,
              updated_at: new Date().toISOString(),
            })
            .eq('razorpay_order_id', paymentEntity.order_id);

          console.log('Payment failed via webhook:', paymentEntity.id);
        }
        break;
      }

      case 'subscription.charged': {
        // Auto-renewal payment successful
        if (subscriptionEntity) {
          // Find the subscription
          const { data: subscription } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('razorpay_subscription_id', subscriptionEntity.id)
            .single();

          if (subscription) {
            // Extend subscription end date
            const currentEndDate = new Date(subscription.end_date);
            const newEndDate = new Date(currentEndDate);

            // Add duration based on tier
            if (subscription.tier === 'monthly') {
              newEndDate.setMonth(newEndDate.getMonth() + 1);
            } else if (subscription.tier === 'quarterly') {
              newEndDate.setMonth(newEndDate.getMonth() + 3);
            } else if (subscription.tier === 'yearly') {
              newEndDate.setFullYear(newEndDate.getFullYear() + 1);
            }

            // Update subscription
            await supabase
              .from('subscriptions')
              .update({
                end_date: newEndDate.toISOString(),
                status: 'active',
                last_renewal_attempt: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })
              .eq('id', subscription.id);

            // Update user profile
            await supabase
              .from('profiles')
              .update({
                subscription_status: 'active',
                subscription_end_date: newEndDate.toISOString(),
                updated_at: new Date().toISOString(),
              })
              .eq('id', subscription.user_id);

            // Create renewal transaction record
            await supabase.from('payment_transactions').insert({
              user_id: subscription.user_id,
              subscription_id: subscription.id,
              transaction_type: 'renewal',
              status: 'success',
              amount: subscription.amount,
              currency: subscription.currency,
              razorpay_order_id: subscriptionEntity.id,
              razorpay_payment_id: subscriptionEntity.id,
              razorpay_webhook_data: subscriptionEntity,
            });

            console.log('Subscription renewed via webhook:', subscriptionEntity.id);
          }
        }
        break;
      }

      case 'subscription.cancelled': {
        // Subscription cancelled
        if (subscriptionEntity) {
          await supabase
            .from('subscriptions')
            .update({
              status: 'cancelled',
              auto_renew: false,
              cancelled_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('razorpay_subscription_id', subscriptionEntity.id);

          console.log('Subscription cancelled via webhook:', subscriptionEntity.id);
        }
        break;
      }

      default:
        console.log('Unhandled webhook event:', event);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in webhook handler:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
