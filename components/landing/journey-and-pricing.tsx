"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const steps = [
  {
    title: "Sign Up Free",
    description: "No credit card required",
  },
  {
    title: "Start with Your Level",
    description: "Personalized recommendations",
  },
  {
    title: "Solve Real Challenges",
    description: "Multiple challenge types",
  },
  {
    title: "Get AI Feedback",
    description: "Instant detailed feedback",
  },
  {
    title: "Track Your Progress",
    description: "Points, levels, analytics",
  },
  {
    title: "Compete & Win",
    description: "Leaderboards, Code Friday",
  },
];

const pricingTiers = [
  {
    name: "Free",
    monthlyPrice: "₹0",
    yearlyPrice: "₹0",
    description: "Perfect for getting started",
    features: [
      "All beginner challenges",
      "Learning modules (Free forever)",
      "5 AI feedbacks/day",
      "Community access",
    ],
    cta: "Get Started",
    ctaLink: "/signup",
  },
  {
    name: "Launch Offer",
    monthlyPrice: "₹199",
    yearlyPrice: "₹199",
    originalPrice: "₹999",
    description: "21-day launch offer",
    features: [
      "All challenges unlocked",
      "Interview prep (6 stages)",
      "Unlimited AI feedback",
      "Professional reports",
    ],
    cta: "Get Launch Offer",
    ctaLink: "/pricing",
    popular: true,
    badge: "Limited Time",
  },
  {
    name: "Premium Plans",
    monthlyPrice: "₹1,999",
    yearlyPrice: "₹4,999",
    description: "Choose your commitment",
    features: [
      "Everything in Launch Offer",
      "3-Month: ₹1,999",
      "6-Month: ₹4,999 (Best value)",
      "Cancel anytime",
    ],
    cta: "View All Plans",
    ctaLink: "/pricing",
  },
];

export function JourneyAndPricing() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="py-16 lg:py-20 bg-slate-50">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Desktop: Two Columns | Mobile: Stacked */}
        <div className="grid lg:grid-cols-[38%_62%] gap-12 max-w-7xl mx-auto">
          {/* Left Column: Journey */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:sticky lg:top-24 lg:self-start"
          >
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                Your Journey in{" "}
                <span className="bg-gradient-to-r from-brand-500 to-purple-600 bg-clip-text text-transparent">
                  6 Steps
                </span>
              </h2>
              <p className="text-slate-600">
                From signup to success
              </p>
            </div>

            {/* Vertical Timeline */}
            <div className="relative">
              {/* Connecting Line */}
              <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-300 via-purple-300 to-brand-300" />

              {/* Steps */}
              <div className="space-y-6">
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="relative flex items-start gap-4 group"
                  >
                    {/* Number Badge */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 text-white text-sm font-bold flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:scale-110 transition-transform duration-300 relative z-10">
                      {index + 1}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-2">
                      <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-brand-600 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-sm text-slate-600">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Pricing */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Header */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/10 via-brand-500/10 to-purple-500/10 border-2 border-green-400/50 px-4 py-2 rounded-full backdrop-blur-sm mb-4">
                <span className="text-sm font-bold bg-gradient-to-r from-green-600 to-brand-600 bg-clip-text text-transparent">
                  🚀 LAUNCH SPECIAL
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                Choose Your{" "}
                <span className="bg-gradient-to-r from-brand-500 to-purple-600 bg-clip-text text-transparent">
                  Plan
                </span>
              </h2>

              <p className="text-slate-600 mb-6">
                Start free or try our launch offer for just ₹199/21 days
              </p>

              {/* Toggle */}
              <div className="flex items-center gap-4 mb-6">
                <span className={`text-sm ${!isYearly ? "text-slate-900 font-medium" : "text-slate-500"}`}>
                  3 Months
                </span>
                <button
                  onClick={() => setIsYearly(!isYearly)}
                  className="relative inline-flex h-8 w-14 items-center rounded-full bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                  style={{
                    background: isYearly ? "linear-gradient(to right, #0ea5e9, #a855f7)" : "",
                  }}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      isYearly ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className={`text-sm ${isYearly ? "text-slate-900 font-medium" : "text-slate-500"}`}>
                  6 Months
                </span>
              </div>
            </div>

            {/* Pricing Cards - Vertical Stack */}
            <div className="space-y-4">
              {pricingTiers.map((tier, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`relative bg-white rounded-2xl p-6 transition-all duration-300 hover:shadow-lg ${
                    tier.popular
                      ? "border-2 border-transparent bg-gradient-to-br from-brand-50 to-purple-50 shadow-xl shadow-brand-500/10"
                      : "border-2 border-slate-200 hover:border-brand-300"
                  }`}
                >
                  {/* Popular Badge */}
                  {tier.popular && (
                    <div className="absolute -top-3 right-4">
                      <span className="bg-gradient-to-r from-brand-500 to-purple-500 text-white px-4 py-1 rounded-full text-xs font-semibold shadow-lg shadow-brand-500/30">
                        {tier.badge || "Most Popular"}
                      </span>
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-4">
                    {/* Left: Info */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 mb-1">{tier.name}</h3>
                      <p className="text-slate-600 text-xs mb-3">{tier.description}</p>

                      {/* Price */}
                      <div className="mb-4">
                        {tier.originalPrice && (
                          <div className="mb-1">
                            <span className="text-lg text-slate-400 line-through">{tier.originalPrice}</span>
                          </div>
                        )}
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-bold text-slate-900">
                            {isYearly ? tier.yearlyPrice : tier.monthlyPrice}
                          </span>
                          <span className="text-sm text-slate-600">
                            {tier.monthlyPrice !== "₹0"
                              ? tier.name === "Launch Offer"
                                ? "/21 days"
                                : isYearly
                                ? "/6mo"
                                : "/3mo"
                              : ""}
                          </span>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="space-y-2">
                        {tier.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-brand-500 flex-shrink-0 mt-0.5" />
                            <span className="text-slate-600 text-xs">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: CTA Button */}
                    <div className="flex-shrink-0">
                      <Button
                        asChild
                        size="sm"
                        className={`font-semibold transition-all duration-300 whitespace-nowrap ${
                          tier.popular
                            ? "bg-gradient-to-r from-brand-500 to-purple-500 hover:from-brand-600 hover:to-purple-600 text-white shadow-lg shadow-brand-500/30 hover:shadow-xl"
                            : "bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-300 hover:border-brand-400"
                        }`}
                      >
                        <Link href={tier.ctaLink}>{tier.cta}</Link>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom Notice */}
            <div className="mt-6 text-center text-sm text-slate-500">
              <Link href="/pricing" className="text-brand-600 hover:text-purple-600 font-medium hover:underline transition-colors">
                Compare all features →
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
