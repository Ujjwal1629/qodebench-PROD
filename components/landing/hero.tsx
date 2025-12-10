"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { OutcomeStats } from "./outcome-stats";

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-white via-brand-50/30 to-purple-50/20 pt-24 pb-16 lg:pt-32 lg:pb-20">
      {/* Subtle decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-gradient-to-br from-brand-200/40 to-brand-300/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 -right-20 w-[500px] h-[500px] bg-gradient-to-br from-purple-200/40 to-purple-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-brand-100/20 to-purple-100/20 rounded-full blur-2xl" />
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Beta Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-500/10 via-purple-500/10 to-brand-500/10 border border-brand-300/50 px-5 py-2.5 rounded-full backdrop-blur-sm">
            <span className="text-sm font-semibold bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
              🚀 Get Job-Ready in 90 Days
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-brand-500 via-brand-600 to-purple-600 bg-clip-text text-transparent">
              Learn by doing real work
            </span>
            <br />
            <span className="text-slate-900">Build experience freshers dream of</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
            Bridge the gap between college and your first developer job through real-world simulations, production-like challenges, and AI-powered mentorship
          </p>

          {/* Dual CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-brand-500 via-brand-600 to-purple-600 hover:from-brand-600 hover:via-brand-700 hover:to-purple-700 text-white text-lg px-10 h-14 rounded-2xl font-semibold transition-all shadow-2xl shadow-brand-500/30 hover:shadow-3xl hover:shadow-brand-500/40 hover:scale-105"
            >
              <Link href="/dashboard/learning">Start Your Journey</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-brand-500 text-brand-600 hover:bg-brand-50 text-lg px-10 h-14 rounded-2xl font-semibold transition-all hover:scale-105"
            >
              <Link href="/dashboard/challenges">See Learning Path</Link>
            </Button>
          </div>
          <p className="text-sm text-slate-500 mt-4">
            Start free • Launch offer at ₹199 for 21 days
          </p>

          {/* Outcome Stats */}
          <OutcomeStats />

          {/* Key Features Highlight */}
          <div className="pt-8 pb-4">
            <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-full px-4 py-2">
                <span className="text-green-600">✓</span>
                <span>Real-world challenges</span>
              </div>
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-full px-4 py-2">
                <span className="text-green-600">✓</span>
                <span>Mock interviews</span>
              </div>
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-full px-4 py-2">
                <span className="text-green-600">✓</span>
                <span>Weekly competitions</span>
              </div>
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-full px-4 py-2">
                <span className="text-green-600">✓</span>
                <span>Instant AI feedback</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
