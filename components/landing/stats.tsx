"use client";

import { Code2, Trophy, Users, Zap, Target, Award, Calendar, Sparkles } from "lucide-react";

const stats = [
  {
    icon: Code2,
    value: "100+",
    label: "Coding Challenges",
    description: "Across 5+ technologies",
  },
  {
    icon: Target,
    value: "7",
    label: "Experience Levels",
    description: "Intern to Distinguished Engineer",
  },
  {
    icon: Calendar,
    value: "Weekly",
    label: "Competitions",
    description: "New challenges every week",
  },
  {
    icon: Trophy,
    value: "Global",
    label: "Competition",
    description: "Compete worldwide",
  },
  {
    icon: Zap,
    value: "AI-Powered",
    label: "Instant Feedback",
    description: "On every submission",
  },
  {
    icon: Sparkles,
    value: "Smart",
    label: "AI Companion",
    description: "Learn with AI assistance",
  },
];

export function Stats() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-slate-50 to-brand-50/30">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            <span className="text-slate-900">Built for </span>
            <span className="bg-gradient-to-r from-brand-500 to-purple-600 bg-clip-text text-transparent">
              Real Developers
            </span>
          </h2>
          <p className="text-lg text-slate-600">
            A comprehensive platform designed to accelerate your coding career
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-7xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-brand-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center mb-4 shadow-lg shadow-brand-500/25 mx-auto">
                  <Icon className="h-6 w-6 text-white" />
                </div>

                {/* Value */}
                <div className="text-2xl font-bold text-slate-900 mb-1">
                  {stat.value}
                </div>

                {/* Label */}
                <div className="text-sm font-semibold text-slate-700 mb-1">
                  {stat.label}
                </div>

                {/* Description */}
                <div className="text-xs text-slate-500">
                  {stat.description}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-slate-600 text-lg">
            Join developers mastering real-world coding skills
          </p>
        </div>
      </div>
    </section>
  );
}
