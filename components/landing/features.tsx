"use client";

import { FileText, Sparkles, TrendingUp, Code2, Target, BookOpen } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Comprehensive Learning Modules",
    description:
      "Master testing fundamentals through structured courses covering test methodologies, best practices, and essential QA skills. Learn at your own pace with interactive content.",
  },
  {
    icon: Code2,
    title: "Interactive Practice Tools",
    description:
      "Practice testing on real tools like sliders, e-commerce sites, forms, and interactive applications. Test, validate, and get instant feedback on your work.",
  },
  {
    icon: FileText,
    title: "Test Documentation Skills",
    description:
      "Learn to write test plans, create test cases, and document testing results professionally. Build essential QA documentation skills.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Evaluation",
    description:
      "Receive instant, detailed feedback on your testing work and learn best practices with AI-powered analysis and personalized suggestions.",
  },
  {
    icon: TrendingUp,
    title: "Progressive Difficulty",
    description:
      "Start with basics and advance to complex testing scenarios. Build skills step-by-step with structured progression paths.",
  },
  {
    icon: Target,
    title: "Personalized Learning Path",
    description:
      "Get recommended content based on your skill level and progress. Track your growth with detailed stats and activity insights.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 lg:py-32 bg-white">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            <span className="text-slate-900">Everything you need to </span>
            <span className="bg-gradient-to-r from-brand-500 to-purple-600 bg-clip-text text-transparent">master testing.</span>
          </h2>
          <p className="text-lg text-slate-600 mt-4">
            Learn through structured courses and practice on real interactive tools
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="group">
                <div className="relative bg-white border border-slate-200 rounded-2xl p-8 h-full hover:border-brand-300 hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-300 hover:-translate-y-1 text-center md:text-left">
                  {/* Gradient background on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-50/50 to-purple-50/30 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />

                  {/* Icon */}
                  <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center mb-6 shadow-lg shadow-brand-500/25 group-hover:shadow-xl group-hover:shadow-brand-500/40 transition-all duration-300 group-hover:scale-110 mx-auto md:mx-0">
                    <Icon className="h-7 w-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="relative text-xl font-bold text-slate-900 mb-3 group-hover:text-brand-700 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="relative text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
