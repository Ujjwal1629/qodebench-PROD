"use client";

import { Bug, GitPullRequest, Rocket, Brain, Users, Zap } from "lucide-react";

export function WhyQodebench() {
  const reasons = [
    {
      icon: Bug,
      title: "Production Bugs",
      description:
        "Debug real production issues like you would in a company. Learn to identify, trace, and fix bugs in complex codebases.",
      color: "from-red-500 to-orange-500",
    },
    {
      icon: GitPullRequest,
      title: "PR Workflows",
      description:
        "Experience the full PR lifecycle — write code, review changes, handle feedback, and merge like a professional developer.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Rocket,
      title: "Deployments",
      description:
        "Understand deployment processes, environment configurations, and testing in staging before pushing to production.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Brain,
      title: "AI Guidance",
      description:
        "Get instant AI-powered hints, explanations, and feedback on your code — like having a senior developer by your side.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Users,
      title: "Team Simulation",
      description:
        "Work in simulated team environments with realistic scenarios — handle tickets, collaborate, and communicate effectively.",
      color: "from-yellow-500 to-amber-500",
    },
    {
      icon: Zap,
      title: "Real-Time Feedback",
      description:
        "Receive immediate evaluation on your solutions. Learn from mistakes instantly and iterate faster than ever.",
      color: "from-indigo-500 to-purple-500",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Why{" "}
            <span className="bg-gradient-to-r from-brand-500 to-purple-600 bg-clip-text text-transparent">
              Qodebench
            </span>
            ?
          </h2>
          <p className="text-lg text-slate-600">
            It&apos;s not just another coding platform — Qodebench simulates real developer life to prepare you for actual tech jobs.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <div
                key={index}
                className="group bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-8 hover:shadow-2xl hover:border-brand-300 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Icon */}
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${reason.color} mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {reason.title}
                </h3>

                {/* Description */}
                <p className="text-slate-600 leading-relaxed">
                  {reason.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom Highlight */}
        <div className="mt-16 bg-gradient-to-r from-brand-50 via-purple-50 to-brand-50 border border-brand-200 rounded-3xl p-8 md:p-12 max-w-5xl mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Experience Real Developer Workflows
          </h3>
          <p className="text-lg text-slate-600 mb-6 max-w-3xl mx-auto">
            Qodebench goes beyond traditional coding challenges. We simulate the entire developer experience — from reading tickets and writing code to handling code reviews and deploying features.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white border border-brand-200 rounded-full px-6 py-3">
              <span className="text-brand-600 font-semibold">
                ✓ Real company scenarios
              </span>
            </div>
            <div className="bg-white border border-brand-200 rounded-full px-6 py-3">
              <span className="text-brand-600 font-semibold">
                ✓ Production-like codebases
              </span>
            </div>
            <div className="bg-white border border-brand-200 rounded-full px-6 py-3">
              <span className="text-brand-600 font-semibold">
                ✓ AI-powered mentorship
              </span>
            </div>
            <div className="bg-white border border-brand-200 rounded-full px-6 py-3">
              <span className="text-brand-600 font-semibold">
                ✓ Job-ready skills
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
