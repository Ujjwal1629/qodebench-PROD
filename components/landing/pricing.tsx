"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const pricingTiers = [
  {
    name: "Free",
    monthlyPrice: "$0",
    yearlyPrice: "$0",
    description: "Perfect for getting started",
    features: [
      "5 challenges per month",
      "Basic AI feedback",
      "Community access",
      "Progress tracking",
    ],
    cta: "Get Started",
    ctaLink: "/signup",
  },
  {
    name: "Pro",
    monthlyPrice: "$19",
    yearlyPrice: "$15",
    description: "For serious developers",
    features: [
      "Unlimited challenges",
      "Advanced AI feedback",
      "Mock interviews",
      "Weekly Code Friday challenges",
      "Leaderboard participation",
      "Priority support",
      "Career roadmap",
    ],
    cta: "Get Pro",
    ctaLink: "/signup",
    popular: true,
  },
  {
    name: "Team",
    monthlyPrice: "$49",
    yearlyPrice: "$40",
    description: "For growing teams",
    features: [
      "Everything in Pro",
      "Custom challenges",
      "Team analytics",
      "Admin dashboard",
      "Onboarding assistance",
    ],
    cta: "Contact Sales",
    ctaLink: "/contact",
  },
];

export function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="py-20 lg:py-32 bg-white">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            <span className="text-slate-900">Learn more, </span>
            <span className="bg-gradient-to-r from-brand-500 to-purple-600 bg-clip-text text-transparent">spend less.</span>
          </h2>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm ${!isYearly ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="relative inline-flex h-8 w-14 items-center rounded-full bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
              style={{ background: isYearly ? 'linear-gradient(to right, #0ea5e9, #a855f7)' : '' }}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  isYearly ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${isYearly ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>
              Yearly
            </span>
            {isYearly && (
              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-brand-500 to-purple-500 text-white px-3 py-1 text-xs font-semibold shadow-lg">
                Save 17%
              </span>
            )}
          </div>
        </div>

        {/* Beta Notice */}
        <div className="text-center mb-8">
          <p className="text-sm font-semibold bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
            🎉 Beta testers get 1 month free access to all Pro features
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 ${
                tier.popular
                  ? 'border-2 border-transparent bg-gradient-to-br from-brand-50 to-purple-50 shadow-2xl shadow-brand-500/20'
                  : 'border-2 border-slate-200 hover:border-brand-300 hover:shadow-xl'
              }`}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-brand-500 to-purple-500 text-white px-5 py-1.5 rounded-full text-sm font-semibold shadow-xl shadow-brand-500/30">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Header */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  {tier.name}
                </h3>
                <p className="text-slate-600 text-sm">{tier.description}</p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-slate-900">
                    {isYearly ? tier.yearlyPrice : tier.monthlyPrice}
                  </span>
                  <span className="text-slate-600">
                    {tier.monthlyPrice !== "$0" ? (isYearly ? "/user/year" : "/user/month") : ""}
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              <Button
                asChild
                className={`w-full mb-6 font-semibold transition-all duration-300 ${
                  tier.popular
                    ? 'bg-gradient-to-r from-brand-500 to-purple-500 hover:from-brand-600 hover:to-purple-600 text-white shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40'
                    : 'bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-200 hover:border-brand-400'
                }`}
              >
                <Link href={tier.ctaLink}>{tier.cta}</Link>
              </Button>

              {/* Features List */}
              <div className="space-y-3">
                {tier.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-brand-500 flex-shrink-0" />
                    <span className="text-slate-600 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Notice */}
        <div className="mt-12 text-center">
          <p className="text-sm text-slate-500">
            No credit card required during beta.{" "}
            <Link href="/pricing" className="text-brand-600 hover:text-purple-600 font-medium hover:underline transition-colors">
              Compare all features →
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
