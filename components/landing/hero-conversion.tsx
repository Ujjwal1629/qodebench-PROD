"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Sparkles } from "lucide-react";

export function HeroConversion() {

  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-28 pb-16 lg:pt-32 lg:pb-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Top Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-brand-500/20 border border-green-500/30 px-4 py-2 rounded-full backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-green-400" />
            <span className="text-sm font-semibold text-green-300">
              🎉 Limited Time: Get Job-Ready at ₹199 for 21 days (90% OFF)
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left Content */}
          <div className="text-white">
            {/* Small tag */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <span className="text-sm font-medium">For Freshers & Career Switchers</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Get Your First
              <br />
              <span className="bg-gradient-to-r from-brand-400 via-brand-500 to-purple-500 bg-clip-text text-transparent">
                Developer Job
              </span>
              <br />
              In 90 Days
            </h1>

            {/* Sub-headline */}
            <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed">
              Master full-stack development through real-world projects, AI-powered feedback, and mock interviews. No prior experience needed.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8">
              <div>
                <div className="text-3xl font-bold text-white mb-1">500+</div>
                <div className="text-sm text-slate-400">Challenges Solved</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">90%</div>
                <div className="text-sm text-slate-400">Job Ready</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">4.8/5</div>
                <div className="text-sm text-slate-400">Student Rating</div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-slate-300">100+ Real-world coding challenges</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-slate-300">AI-powered mock interviews</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-slate-300">Learn by building real projects</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-slate-300">Get placed at top companies</span>
              </div>
            </div>
          </div>

          {/* Right CTA Card */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-slate-200">
              {/* Card Header */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Start Your Journey Today
                </h3>
                <p className="text-slate-600">
                  Join 100+ students already learning
                </p>
              </div>

              {/* Value Props */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-900">Free Forever Plan</div>
                    <div className="text-sm text-slate-600">Start learning with beginner challenges</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-900">AI-Powered Learning</div>
                    <div className="text-sm text-slate-600">Get instant feedback on your code</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-900">Mock Interviews</div>
                    <div className="text-sm text-slate-600">Practice with AI interview preparation</div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <Link href="/dashboard/challenges/practical">
                <Button
                  size="lg"
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white shadow-lg shadow-brand-500/30"
                >
                  Get Your First Bug Ticket →
                </Button>
              </Link>

              {/* Trust badges */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-600">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Free tier forever</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full shadow-lg font-bold text-sm">
              🔥 100+ Active Learners
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
