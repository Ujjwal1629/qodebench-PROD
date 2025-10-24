"use client";

import { FileText, Sparkles, TrendingUp, Mic, Trophy, Zap } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Office Skills Challenges",
    description:
      "Learn to write RFCs, review PRs, create technical docs, and master workplace coding workflows",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Evaluation",
    description:
      "Get instant, detailed feedback on your code quality, best practices, and improvements from advanced AI",
  },
  {
    icon: TrendingUp,
    title: "Career Roadmap",
    description:
      "Progress from Intern to Senior Developer with structured challenges matching each experience level",
  },
  {
    icon: Mic,
    title: "Mock Interviews",
    description:
      "Practice technical and behavioral interviews with AI-powered mock interview sessions",
  },
  {
    icon: Trophy,
    title: "Code Friday Challenges",
    description:
      "Compete in weekly challenges every Friday, climb leaderboards, and win rewards",
  },
  {
    icon: Zap,
    title: "AI Tools Mastery",
    description:
      "Learn to leverage Cursor, Copilot, and AI assistants to 10x your productivity",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 lg:py-32 bg-white">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            <span className="text-slate-900">Everything you need, </span>
            <span className="bg-gradient-to-r from-brand-500 to-purple-600 bg-clip-text text-transparent">right where you work.</span>
          </h2>
          <p className="text-lg text-slate-600 mt-4">
            Real-world challenges that prepare you for actual developer work
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 max-w-7xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="group">
                <div className="relative bg-white border border-slate-200 rounded-2xl p-8 h-full hover:border-brand-300 hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-300 hover:-translate-y-1">
                  {/* Gradient background on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-50/50 to-purple-50/30 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />

                  {/* Icon */}
                  <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center mb-6 shadow-lg shadow-brand-500/25 group-hover:shadow-xl group-hover:shadow-brand-500/40 transition-all duration-300 group-hover:scale-110">
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
