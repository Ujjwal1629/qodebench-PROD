"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function HeroModern() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-white pt-20 pb-16 lg:pt-28 lg:pb-24">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />

      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-200/20 rounded-full blur-3xl" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Main Content */}
          <div className="text-center mb-16">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-100 to-purple-100 border border-brand-200 px-4 py-2 rounded-full mb-8"
            >
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span className="text-sm font-semibold text-slate-700">
                Welcome to QodeBench
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-6"
            >
              Master Full-Stack Development
              <br />
              <span className="bg-gradient-to-r from-brand-500 via-brand-600 to-purple-600 bg-clip-text text-transparent">
                By Building Real Projects
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed"
            >
              Learn HTML, CSS, JavaScript, React, Next.js, Node.js, and more through
              hands-on challenges, AI-powered feedback, and mock interviews.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
            >
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white text-lg px-8 h-14 rounded-xl font-semibold shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/30 transition-all group"
              >
                <Link href="/signup" className="flex items-center gap-2">
                  Start Learning Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 text-lg px-8 h-14 rounded-xl font-semibold transition-all group"
              >
                <Link href="#curriculum" className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  View Curriculum
                </Link>
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>100+ Active Learners</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-500 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
                <span>4.8/5 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✓ No Credit Card Required</span>
              </div>
            </motion.div>
          </div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {[
              { value: "100+", label: "Coding Challenges" },
              { value: "5", label: "Tech Stacks Covered" },
              { value: "AI", label: "Powered Feedback" },
              { value: "Free", label: "To Get Started" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-4 text-center hover:shadow-lg hover:border-brand-300 transition-all duration-300"
              >
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent mb-1">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-slate-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
