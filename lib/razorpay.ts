import Razorpay from 'razorpay';
import crypto from 'crypto';
import { RazorpayOrderOptions, RazorpayPaymentVerification } from '@/types/subscription';

// Initialize Razorpay instance
let razorpayInstance: Razorpay | null = null;

export function getRazorpayInstance(): Razorpay {
  if (!razorpayInstance) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      throw new Error('Razorpay credentials not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env.local');
    }

    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }

  return razorpayInstance;
}

/**
 * Create a Razorpay order for payment
 */
export async function createRazorpayOrder(options: RazorpayOrderOptions) {
  const razorpay = getRazorpayInstance();

  try {
    const order = await razorpay.orders.create({
      amount: options.amount,
      currency: options.currency,
      receipt: options.receipt,
      notes: options.notes,
    });

    return { success: true, order };
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Verify Razorpay payment signature
 * This is critical for security - always verify payment on server side
 */
export function verifyRazorpaySignature(verification: RazorpayPaymentVerification): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret) {
    throw new Error('RAZORPAY_KEY_SECRET not configured');
  }

  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = verification;

  // Generate expected signature
  const generatedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  // Compare signatures using timing-safe comparison
  // SECURITY: Wrap in try-catch to handle length mismatches gracefully
  try {
    return crypto.timingSafeEqual(
      Buffer.from(generatedSignature),
      Buffer.from(razorpaySignature)
    );
  } catch (error) {
    // timingSafeEqual throws if buffer lengths don't match
    // This indicates signature tampering
    console.error('Payment signature verification failed:', error);
    return false;
  }
}

/**
 * Verify Razorpay webhook signature
 * Used to validate incoming webhook requests
 */
export function verifyRazorpayWebhook(webhookBody: string, webhookSignature: string): boolean {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error('RAZORPAY_WEBHOOK_SECRET not configured');
  }

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(webhookBody)
    .digest('hex');

  // SECURITY: Wrap in try-catch to handle length mismatches gracefully
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(webhookSignature)
    );
  } catch (error) {
    // timingSafeEqual throws if buffer lengths don't match
    console.error('Webhook signature verification failed:', error);
    return false;
  }
}

/**
 * Fetch payment details from Razorpay
 */
export async function fetchPaymentDetails(paymentId: string) {
  const razorpay = getRazorpayInstance();

  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return { success: true, payment };
  } catch (error) {
    console.error('Error fetching payment details:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Create a refund for a payment
 */
export async function createRefund(paymentId: string, amount?: number) {
  const razorpay = getRazorpayInstance();

  try {
    const refund = await razorpay.payments.refund(paymentId, {
      amount,
    });
    return { success: true, refund };
  } catch (error) {
    console.error('Error creating refund:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Generate receipt ID for order
 */
export function generateReceiptId(userId: string, tier: string): string {
  return `rcpt_${tier}_${userId.slice(0, 8)}_${Date.now()}`;
}

/**
 * Calculate subscription end date based on tier
 */
export function calculateSubscriptionEndDate(tier: string, startDate: Date = new Date()): Date {
  const endDate = new Date(startDate);

  switch (tier) {
    case 'premium':
      endDate.setMonth(endDate.getMonth() + 3); // Quarterly
      break;
    default:
      // Fallback for legacy tiers if needed, or throw error
      if (tier === 'launch_offer') endDate.setDate(endDate.getDate() + 21);
      else if (tier === 'monthly') endDate.setMonth(endDate.getMonth() + 1);
      else if (tier === 'quarterly') endDate.setMonth(endDate.getMonth() + 3);
      else if (tier === 'yearly') endDate.setFullYear(endDate.getFullYear() + 1);
      else throw new Error(`Invalid subscription tier: ${tier}`);
  }
  return endDate;
}
