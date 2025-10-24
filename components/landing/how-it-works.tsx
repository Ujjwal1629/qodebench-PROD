"use client";

import { Target, Code, Award } from "lucide-react";

const steps = [
  {
    icon: Target,
    title: "Choose Your Path",
    description:
      "Select your experience level and get personalized challenges",
  },
  {
    icon: Code,
    title: "Solve Real Challenges",
    description:
      "Complete office workflows and technical challenges that mirror actual work",
  },
  {
    icon: Award,
    title: "Get Feedback & Level Up",
    description:
      "Receive AI feedback, earn points, and track your progress",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-32 bg-slate-50">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-brand-500 to-purple-600 bg-clip-text text-transparent">How It Works</span>
          </h2>
          <p className="text-lg text-slate-600 mt-4">
            Get started in just three simple steps
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="text-center group">
                {/* Number */}
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 text-white text-3xl font-bold mb-6 shadow-xl shadow-brand-500/30 group-hover:shadow-2xl group-hover:shadow-brand-500/40 transition-all duration-300 group-hover:scale-110">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white border-2 border-brand-200 mb-6 shadow-lg group-hover:shadow-xl group-hover:border-brand-400 transition-all duration-300 group-hover:-translate-y-1">
                  <Icon className="h-10 w-10 text-brand-600 group-hover:text-purple-600 transition-colors" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-brand-700 transition-colors">
                  {step.title}
                </h3>
                <p className="text-slate-600 leading-relaxed text-base">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
