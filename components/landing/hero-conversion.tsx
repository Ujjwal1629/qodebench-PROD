"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroConversion() {
  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-2 rounded-full mb-8 border border-white/10">
            <span className="text-sm font-medium text-slate-300">Built for QA &amp; Automation Testers</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-white mb-6 tracking-tight">
            Master QA Automation.{" "}
            <span className="bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">
              Get Job-Ready.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Learn JavaScript, TypeScript &amp; Playwright through structured courses,
            hands-on practice tools, and 350+ interview questions — all in one platform.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button
              asChild
              size="lg"
              className="h-14 px-8 text-base font-semibold bg-white text-slate-900 hover:bg-slate-100 rounded-xl shadow-2xl shadow-white/10"
            >
              <Link href="/signup">
                Start Learning Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-14 px-8 text-base font-semibold border-white/20 text-black hover:bg-white/10 hover:text-white rounded-xl"
            >
              <Link href="#features">See What&apos;s Inside</Link>
            </Button>
          </div>

          {/* Trust line */}
          <p className="text-sm text-slate-500">
            No credit card required. Free tier forever.
          </p>
        </div>
      </div>
    </section>
  );
}
