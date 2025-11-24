export type SubscriptionTier = 'free' | 'beta' | 'monthly' | 'quarterly' | 'yearly';

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
}

export const SUBSCRIPTION_PLANS: Record<Exclude<SubscriptionTier, 'free'>, SubscriptionPlan> = {
  beta: {
    id: 'beta',
    name: 'Beta Trial',
    price: 199,
    priceInPaise: 19900,
    originalPrice: 999, // Show this crossed out
    duration: 21, // 21 days
    description: '21-day beta offer',
    features: [
      'All Intermediate challenges',
      'All Office Workflow challenges',
      'All Advanced challenges',
      'Mock Interview Prep',
      'Unlimited attempts',
      'Full AI feedback',
    ],
  },
  monthly: {
    id: 'monthly',
    name: 'Monthly',
    price: 999,
    priceInPaise: 99900,
    duration: 30,
    description: 'Billed monthly',
    features: [
      'All challenge tiers unlocked',
      'Mock Interview Prep',
      'Unlimited attempts',
      'Full AI feedback',
      'Priority support',
      'Weekly Code Friday challenges',
    ],
    popular: true,
  },
  quarterly: {
    id: 'quarterly',
    name: '3-Month Offer',
    price: 1999,
    priceInPaise: 199900,
    duration: 90,
    description: 'Introductory offer',
    features: [
      'All challenge tiers unlocked',
      'Mock Interview Prep',
      'Unlimited attempts',
      'Full AI feedback',
      '3 months full access',
      'Best value for learning',
    ],
    limitedTime: true,
  },
  yearly: {
    id: 'yearly',
    name: '6-Month Plan',
    price: 4999,
    priceInPaise: 499900,
    duration: 180, // 6 months
    description: 'Best value for serious learners',
    features: [
      'All challenge tiers unlocked',
      'Mock Interview Prep',
      'Unlimited attempts',
      'Full AI feedback',
      'Priority support',
      '6 months full access',
      'Exclusive premium badge',
    ],
  },
};

export const FREE_TIER_LIMITS = {
  dailyAttempts: 10,
  dailyAIFeedback: 5,
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
