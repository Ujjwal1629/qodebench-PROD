"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FinalCTA() {
  return (
    <section className="relative py-32 bg-gradient-to-br from-brand-50 via-white to-purple-50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-brand-200/30 to-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-br from-purple-200/30 to-brand-200/30 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Heading */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
            <span className="text-slate-900">Ready to become a </span>
            <span className="bg-gradient-to-r from-brand-500 to-purple-600 bg-clip-text text-transparent">
              job-ready developer?
            </span>
          </h2>

          {/* Subheadline */}
          <p className="text-xl text-slate-600">
            Start your journey today—completely free
          </p>

          {/* CTA Button */}
          <div>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-brand-500 via-brand-600 to-purple-600 hover:from-brand-600 hover:via-brand-700 hover:to-purple-700 text-white text-lg px-12 h-16 rounded-2xl font-semibold transition-all shadow-2xl shadow-brand-500/30 hover:shadow-3xl hover:shadow-brand-500/40 hover:scale-105"
            >
              <Link href="/signup">Try for free →</Link>
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600">
            <span className="flex items-center gap-1">
              <span className="text-green-600">✓</span> No credit card required
            </span>
            <span className="flex items-center gap-1">
              <span className="text-green-600">✓</span> Free tier forever
            </span>
            <span className="flex items-center gap-1">
              <span className="text-green-600">✓</span> Cancel anytime
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
