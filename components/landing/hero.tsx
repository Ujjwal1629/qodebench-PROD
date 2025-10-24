"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-brand-50/30 to-purple-50/20 pt-32">
      {/* Subtle decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 -left-20 w-96 h-96 bg-gradient-to-br from-brand-200/40 to-brand-300/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 -right-20 w-[500px] h-[500px] bg-gradient-to-br from-purple-200/40 to-purple-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-brand-100/20 to-purple-100/20 rounded-full blur-2xl" />
      </div>

      <div className="container mx-auto px-6 lg:px-8 py-20 lg:py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Beta Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-500/10 via-purple-500/10 to-brand-500/10 border border-brand-300/50 px-5 py-2.5 rounded-full backdrop-blur-sm">
            <span className="text-sm font-semibold bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
              🎉 Beta Launch - Free for 1 month
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
            <span className="text-slate-900">Master Real-World </span>
            <span className="bg-gradient-to-r from-brand-500 via-brand-600 to-purple-600 bg-clip-text text-transparent">
              Coding Skills
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
            Go beyond algorithms. Learn PRs, documentation, code reviews, and technical challenges that matter in actual developer jobs.
          </p>

          {/* Single CTA */}
          <div className="pt-4">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-brand-500 via-brand-600 to-purple-600 hover:from-brand-600 hover:via-brand-700 hover:to-purple-700 text-white text-lg px-12 h-16 rounded-2xl font-semibold transition-all shadow-2xl shadow-brand-500/30 hover:shadow-3xl hover:shadow-brand-500/40 hover:scale-105"
            >
              <Link href="/signup">Start learning for free →</Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="pt-8">
            <p className="text-sm text-slate-500 mb-6">Loved by developers at</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60">
              {/* Placeholder for company logos */}
              <div className="h-8 w-24 bg-slate-200 rounded" />
              <div className="h-8 w-24 bg-slate-200 rounded" />
              <div className="h-8 w-24 bg-slate-200 rounded" />
              <div className="h-8 w-24 bg-slate-200 rounded" />
              <div className="h-8 w-24 bg-slate-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
