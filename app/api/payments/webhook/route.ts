import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyRazorpayWebhook } from '@/lib/razorpay';
import { logger } from '@/lib/utils/logger';

// Maximum age for webhook timestamps (5 minutes)
const WEBHOOK_TIMESTAMP_TOLERANCE_MS = 5 * 60 * 1000;

/**
 * Validate webhook timestamp to prevent replay attacks
 */
function validateWebhookTimestamp(createdAt: number): boolean {
  const webhookTime = createdAt * 1000; // Convert to milliseconds
  const currentTime = Date.now();
  const age = currentTime - webhookTime;

  // Reject if webhook is too old or from the future
  if (age > WEBHOOK_TIMESTAMP_TOLERANCE_MS || age < -60000) {
    return false;
  }

  return true;
}

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
      logger.security('Webhook missing signature', { action: 'webhook_rejected' });
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // Get raw body for signature verification
    const rawBody = await request.text();

    // Verify webhook signature - CRITICAL FOR SECURITY
    const isValid = verifyRazorpayWebhook(rawBody, webhookSignature);

    if (!isValid) {
      logger.security('Invalid webhook signature', { action: 'webhook_rejected' }, 'error');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Parse webhook payload
    const payload = JSON.parse(rawBody);
    const event = payload.event;
    const createdAt = payload.created_at;
    const paymentEntity = payload.payload.payment?.entity;
    const subscriptionEntity = payload.payload.subscription?.entity;

    // SECURITY: Validate webhook timestamp to prevent replay attacks
    if (createdAt && !validateWebhookTimestamp(createdAt)) {
      logger.security('Webhook timestamp too old (possible replay attack)', {
        action: 'webhook_rejected',
        createdAt,
        event,
      }, 'error');
      return NextResponse.json({ error: 'Webhook expired' }, { status: 400 });
    }

    logger.payment('Razorpay webhook received', { event });

    // Use service role client for webhook operations
    const supabase = await createClient();

    // Handle different webhook events
    switch (event) {
      case 'payment.captured': {
        // Payment successful - already handled in verify-payment
        // This is backup in case verify-payment fails
        // Database unique constraint on razorpay_payment_id prevents duplicates
        if (paymentEntity) {
          const { data: transaction, error: fetchError } = await supabase
            .from('payment_transactions')
            .select('*')
            .eq('razorpay_payment_id', paymentEntity.id)
            .single();

          // If no transaction found, this webhook arrived before verify-payment
          // Skip processing to avoid race condition - verify-payment will handle it
          if (fetchError || !transaction) {
            logger.payment('Payment not found, skipping webhook (will be handled by verify-payment)', {
              paymentId: paymentEntity.id
            });
            break;
          }

          if (transaction.status !== 'success') {
            // Update transaction status only if not already successful
            const { error: updateError } = await supabase
              .from('payment_transactions')
              .update({
                status: 'success',
                razorpay_webhook_data: paymentEntity,
                updated_at: new Date().toISOString(),
              })
              .eq('id', transaction.id);

            if (!updateError) {
              logger.payment('Payment captured via webhook', { paymentId: paymentEntity.id });
            }
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

          logger.payment('Payment failed via webhook', { paymentId: paymentEntity.id, errorCode: paymentEntity.error_code });
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

            logger.payment('Subscription renewed via webhook', { subscriptionId: subscriptionEntity.id });
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

          logger.payment('Subscription cancelled via webhook', { subscriptionId: subscriptionEntity.id });
        }
        break;
      }

      default:
        logger.info('Unhandled webhook event', { event });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Error in webhook handler', {}, error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
