"use client";

import { FileText, Sparkles, TrendingUp, Mic, Trophy, Code2, Gift, Target } from "lucide-react";

const features = [
  {
    icon: Code2,
    title: "100+ Real-World Challenges",
    description:
      "Master Python, JavaScript, React, Next.js, and Node.js through practical coding challenges that mirror actual development work",
  },
  {
    icon: FileText,
    title: "Office Fundamentals",
    description:
      "Learn essential workplace skills: writing RFCs, reviewing PRs, creating technical documentation, and mastering professional workflows",
  },
  {
    icon: Mic,
    title: "AI-Powered Mock Interviews",
    description:
      "Practice technical interviews with voice-interactive AI interviewer. Get real-time hints and comprehensive feedback on your performance",
  },
  {
    icon: Trophy,
    title: "Code Friday Challenges",
    description:
      "Join weekly Friday competitions, compete on global leaderboards, and prove your skills against developers worldwide",
  },
  {
    icon: TrendingUp,
    title: "7-Level Progression System",
    description:
      "Advance from Intern to Distinguished Engineer with structured challenges and clear career milestones at each experience level",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Evaluation",
    description:
      "Receive instant, detailed feedback on your code quality, best practices, and areas for improvement from advanced AI analysis",
  },
  {
    icon: Gift,
    title: "Rewards & Recognition",
    description:
      "Earn points through challenges and competitions, then redeem them for exclusive QodeBench merchandise and rewards",
  },
  {
    icon: Target,
    title: "Personalized Learning Path",
    description:
      "Get recommended challenges based on your skill level and progress. Track your growth with detailed stats and activity insights",
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
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 max-w-7xl mx-auto">
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
