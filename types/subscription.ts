export type SubscriptionTier = 'free' | 'launch_offer' | 'monthly' | 'quarterly' | 'yearly';

export type SubscriptionStatus =
  | 'active'
  | 'trial'
  | 'expired'
  | 'cancelled'
  | 'payment_failed';

export type TransactionType = 'purchase' | 'renewal' | 'refund' | 'cancellation';

export type TransactionStatus = 'pending' | 'success' | 'failed' | 'refunded';

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  price: number; // in rupees
  priceInPaise: number; // for Razorpay
  originalPrice?: number; // for showing crossed-out price
  duration: number; // in days
  description: string;
  features: string[];
  popular?: boolean;
  limitedTime?: boolean;
  badge?: string;
}

export const SUBSCRIPTION_PLANS: Record<Exclude<SubscriptionTier, 'free' | 'launch_offer' | 'yearly'>, SubscriptionPlan> = {
  monthly: {
    id: 'monthly',
    name: 'Monthly',
    price: 999,
    priceInPaise: 99900,
    duration: 30, // 30 days
    description: 'Billed monthly',
    features: [
      'All challenges unlocked',
      'Mock Interview Prep',
      'Unlimited attempts',
      'Full AI feedback',
      'Priority support',
      'Monthly access',
    ],
  },
  quarterly: {
    id: 'quarterly',
    name: 'Quarterly',
    price: 1999,
    priceInPaise: 199900,
    duration: 90, // 90 days
    description: 'Billed every 3 months',
    features: [
      'All challenges unlocked',
      'Mock Interview Prep',
      'Unlimited attempts',
      'Full AI feedback',
      'Priority support',
      '3 months access',
      'Exclusive premium badge',
    ],
    popular: true,
    badge: 'Best Value',
  },
};

export const FREE_TIER_LIMITS = {
  dailyAttempts: 999999, // Unlimited attempts for free users
  dailyAIFeedback: 5, // 5 AI responses per day for free users
} as const;

export interface UserSubscription {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  startDate: string | null;
  endDate: string | null;
  trialEndsAt: string | null;
  autoRenew: boolean;
  dailyAttemptsUsed: number;
  dailyAIFeedbackUsed: number;
}

export interface Subscription {
  id: string;
  userId: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  trialEndDate: string | null;
  cancelledAt: string | null;
  amount: number;
  currency: string;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  razorpaySubscriptionId: string | null;
  autoRenew: boolean;
  renewalAttempts: number;
  lastRenewalAttempt: string | null;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  subscriptionId: string | null;
  transactionType: TransactionType;
  status: TransactionStatus;
  amount: number;
  currency: string;
  razorpayOrderId: string;
  razorpayPaymentId: string | null;
  razorpaySignature: string | null;
  errorCode: string | null;
  errorDescription: string | null;
  razorpayWebhookData: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
}

export interface RazorpayOrderOptions {
  amount: number; // in paise
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface RazorpayPaymentVerification {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}
