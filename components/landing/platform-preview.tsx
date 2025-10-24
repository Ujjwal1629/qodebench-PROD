"use client";

import Link from "next/link";
import { ArrowRight, Code2, Mic, Trophy, FileText, TrendingUp, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

const platformFeatures = [
  {
    icon: Code2,
    title: "Coding Challenges",
    description: "Real-world challenges across Python, JavaScript, React, Next.js, and Node.js",
    highlights: [
      "100+ curated challenges",
      "Difficulty levels: Easy, Medium, Hard",
      "Categories matched to job requirements",
      "Track your completion progress"
    ],
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50",
  },
  {
    icon: FileText,
    title: "Office Fundamentals",
    description: "Master the professional skills that set senior developers apart",
    highlights: [
      "Write technical RFCs",
      "Review pull requests",
      "Create documentation",
      "Professional code reviews"
    ],
    color: "from-orange-500 to-yellow-500",
    bgColor: "bg-orange-50",
  },
  {
    icon: Mic,
    title: "Mock Interviews",
    description: "Voice-interactive AI interviewer for realistic practice sessions",
    highlights: [
      "Technical coding interviews",
      "Real-time voice interaction",
      "Instant hints when stuck",
      "Comprehensive performance reports"
    ],
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50",
  },
  {
    icon: TrendingUp,
    title: "Career Progression",
    description: "Structured path from Intern to Distinguished Engineer",
    highlights: [
      "7 experience levels",
      "Clear skill milestones",
      "Points-based advancement",
      "Personalized recommendations"
    ],
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50",
  },
  {
    icon: Trophy,
    title: "Code Friday & Leaderboard",
    description: "Weekly competitions with global rankings and recognition",
    highlights: [
      "Fresh challenges every Friday",
      "Compete globally",
      "Climb the leaderboard",
      "Showcase your expertise"
    ],
    color: "from-yellow-500 to-orange-500",
    bgColor: "bg-yellow-50",
  },
  {
    icon: Gift,
    title: "Rewards System",
    description: "Earn points and redeem exclusive QodeBench merchandise",
    highlights: [
      "Earn points from challenges",
      "Weekly challenge bonuses",
      "Exclusive merch catalog",
      "Real rewards for real skills"
    ],
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-50",
  },
];

export function PlatformPreview() {
  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            <span className="text-slate-900">One Platform, </span>
            <span className="bg-gradient-to-r from-brand-500 to-purple-600 bg-clip-text text-transparent">
              Everything You Need
            </span>
          </h2>
          <p className="text-lg text-slate-600">
            From coding challenges to career advancement, all in one place
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {platformFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-white border border-slate-200 rounded-2xl p-8 hover:border-brand-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Icon with gradient */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-brand-600 transition-colors">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-slate-600 mb-4 leading-relaxed">
                  {feature.description}
                </p>

                {/* Highlights */}
                <ul className="space-y-2">
                  {feature.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="text-brand-500 mt-0.5">✓</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-brand-500 to-purple-600 hover:from-brand-600 hover:to-purple-700 text-white text-lg px-10 h-14 rounded-xl font-semibold shadow-xl shadow-brand-500/30 hover:shadow-2xl hover:shadow-brand-500/40 transition-all hover:scale-105"
          >
            <Link href="/signup">
              Start Your Journey Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <p className="text-sm text-slate-500 mt-4">
            No credit card required • 1 month free beta access
          </p>
        </div>
      </div>
    </section>
  );
}
