"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const tiers = [
  {
    name: "Free",
    price: "\u20B90",
    period: "forever",
    description: "Get started with the basics",
    features: [
      "Beginner practice challenges",
      "All learning modules",
      "350+ interview questions",
      "5 AI feedbacks per day",
    ],
    cta: "Get Started",
    ctaLink: "/signup",
    highlighted: false,
  },
  {
    name: "Premium",
    price: "\u20B91,999",
    period: "/ 3 months",
    description: "Full access to everything",
    features: [
      "All practice challenges unlocked",
      "All learning modules",
      "350+ interview questions",
      "Unlimited AI feedback",
      "Priority support",
      "Progress reports",
    ],
    cta: "Get Premium",
    ctaLink: "/pricing",
    highlighted: true,
    badge: "Best Value",
  },
];

export function JourneyAndPricing() {
  return (
    <section id="pricing" className="py-20 lg:py-28 bg-slate-50">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-slate-600">
            Start free. Upgrade when you&apos;re ready.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 transition-shadow ${
                tier.highlighted
                  ? "bg-white border-2 border-brand-500 shadow-xl"
                  : "bg-white border border-slate-200 shadow-sm"
              }`}
            >
              {/* Badge */}
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-brand-500 text-white text-xs font-bold px-4 py-1.5 rounded-full">
                    {tier.badge}
                  </span>
                </div>
              )}

              {/* Tier info */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-1">{tier.name}</h3>
                <p className="text-sm text-slate-500 mb-4">{tier.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-slate-900">{tier.price}</span>
                  <span className="text-sm text-slate-500">{tier.period}</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-brand-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                asChild
                size="lg"
                className={`w-full h-12 font-semibold rounded-xl ${
                  tier.highlighted
                    ? "bg-brand-500 hover:bg-brand-600 text-white"
                    : "bg-slate-900 hover:bg-slate-800 text-white"
                }`}
              >
                <Link href={tier.ctaLink}>{tier.cta}</Link>
              </Button>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-center text-sm text-slate-500 mt-8">
          All plans include access to 350+ interview questions. Cancel anytime.{" "}
          <Link href="/pricing" className="text-brand-600 hover:underline font-medium">
            Compare all plans &rarr;
          </Link>
        </p>
      </div>
    </section>
  );
}
