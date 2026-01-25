'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Check, Zap, Crown, Rocket } from 'lucide-react';
import { SUBSCRIPTION_PLANS, SubscriptionTier } from '@/types/subscription';

// Load Razorpay script
declare global {
  interface Window {
    Razorpay: any;
  }
}

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

function PricingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<SubscriptionTier | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const isExpired = searchParams?.get('expired') === 'true';

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubscribe = async (tier: Exclude<SubscriptionTier, 'free'>) => {
    if (!scriptLoaded) {
      alert('Payment system is loading. Please try again.');
      return;
    }

    setLoading(tier);

    try {
      // 1. Create order on server
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await response.json();

      // 2. Open Razorpay checkout
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: orderData.name,
        description: orderData.description,
        order_id: orderData.orderId,
        handler: async (razorpayResponse: any) => {
          try {
            // 3. Verify payment on server
            const verifyResponse = await fetch('/api/payments/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: razorpayResponse.razorpay_order_id,
                razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                razorpay_signature: razorpayResponse.razorpay_signature,
                tier,
              }),
            });

            if (verifyResponse.ok) {
              // Success! Redirect to dashboard
              router.push('/dashboard?payment=success');
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Payment verification failed. Please contact support.');
          } finally {
            setLoading(null);
          }
        },
        prefill: orderData.prefill,
        theme: { color: '#0ea5e9' },
        modal: {
          ondismiss: () => {
            setLoading(null);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to initiate payment. Please try again.');
      setLoading(null);
    }
  };

  const plans = [
    {
      tier: 'monthly' as const,
      icon: Zap,
      color: 'from-blue-500 to-cyan-500',
      borderColor: 'border-blue-200',
    },
    {
      tier: 'quarterly' as const,
      icon: Crown,
      color: 'from-purple-500 to-pink-500',
      borderColor: 'border-purple-200',
      badge: 'Best Value',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto pt-12">
        {/* Header */}
        <div className="text-center mb-12">
          {isExpired && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg max-w-2xl mx-auto">
              <p className="text-red-800 font-medium">
                Your subscription has expired. Upgrade to continue accessing premium content!
              </p>
            </div>
          )}

          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Start for free or upgrade for unlimited access
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {/* Freemium Card */}
          <div className="relative bg-white rounded-2xl p-6 border-2 border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300">
            {/* Icon */}
            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-slate-600" />
            </div>

            {/* Plan Name */}
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Freemium
            </h3>

            {/* Price */}
            <div className="mb-4">
              <div>
                <span className="text-4xl font-bold text-slate-900">₹0</span>
                <span className="text-slate-600 ml-2">/ forever</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-slate-600 text-sm mb-6">Perfect for getting started</p>

            {/* CTA Button */}
            <Button
              onClick={() => router.push('/signup')}
              className="w-full bg-white text-slate-900 border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
            >
              Get Started Free
            </Button>

            {/* Features */}
            <ul className="mt-6 space-y-3">
              <li className="flex items-start gap-2 text-sm text-slate-700">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>All beginner challenges unlocked</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-700">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>All Learning modules</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-700">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>5 AI feedbacks per day</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-700">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Community access</span>
              </li>
            </ul>
          </div>

          {/* Premium Card */}
          {plans.map((plan) => {
            const planData = SUBSCRIPTION_PLANS[plan.tier];
            const Icon = plan.icon;

            return (
              <div
                key={plan.tier}
                className={`relative bg-white rounded-2xl p-6 border-2 ${plan.borderColor} hover:shadow-xl transition-all duration-300 transform md:-translate-y-4`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className={`bg-gradient-to-r ${plan.color} text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg`}>
                      {plan.badge}
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div className={`w-12 h-12 bg-gradient-to-br ${plan.color} rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  {planData.name}
                </h3>

                {/* Price */}
                <div className="mb-4">
                  <div>
                    <span className="text-4xl font-bold text-slate-900">
                      ₹{planData.price}
                    </span>
                    <span className="text-slate-600 ml-2">
                      {planData.id === 'monthly' ? '/ month' : '/ 3 months'}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-600 text-sm mb-6">{planData.description}</p>

                {/* CTA Button */}
                <Button
                  onClick={() => handleSubscribe(plan.tier)}
                  disabled={loading !== null}
                  className="w-full bg-gradient-to-r from-brand-500 to-purple-500 hover:from-brand-600 hover:to-purple-600 text-white shadow-lg shadow-brand-500/25"
                >
                  {loading === plan.tier ? 'Processing...' : `Subscribe (${planData.id === 'monthly' ? 'Monthly' : '3 Months'})`}
                </Button>

                {/* Features */}
                <ul className="mt-6 space-y-3">
                  {planData.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <details className="bg-white p-6 rounded-lg border border-slate-200">
              <summary className="font-semibold text-slate-900 cursor-pointer">
                What happens after the launch offer ends?
              </summary>
              <p className="mt-3 text-slate-600">
                After 21 days, your launch offer will expire. You can then choose to upgrade to either the 3-Month Offer (₹1999) or 6-Month Plan (₹4999) to continue accessing premium features.
              </p>
            </details>

            <details className="bg-white p-6 rounded-lg border border-slate-200">
              <summary className="font-semibold text-slate-900 cursor-pointer">
                Can I cancel anytime?
              </summary>
              <p className="mt-3 text-slate-600">
                Yes! You can cancel your subscription anytime from your settings. You'll retain access until the end of your billing period.
              </p>
            </details>

            <details className="bg-white p-6 rounded-lg border border-slate-200">
              <summary className="font-semibold text-slate-900 cursor-pointer">
                What payment methods do you accept?
              </summary>
              <p className="mt-3 text-slate-600">
                We accept all major credit/debit cards, UPI, net banking, and wallets via Razorpay.
              </p>
            </details>

            <details className="bg-white p-6 rounded-lg border border-slate-200">
              <summary className="font-semibold text-slate-900 cursor-pointer">
                Is my payment information secure?
              </summary>
              <p className="mt-3 text-slate-600">
                Yes! All payments are processed through Razorpay, a PCI-DSS compliant payment gateway. We never store your card details.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center"><div className="text-center"><div className="text-xl text-slate-600">Loading...</div></div></div>}>
      <PricingContent />
    </Suspense>
  );
}
