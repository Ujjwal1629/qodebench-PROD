"use client";

import Link from "next/link";
import { BookOpen, Code2, Wrench, GraduationCap, ArrowRight } from "lucide-react";

export function ProductModules() {
  const modules = [
    {
      icon: BookOpen,
      title: "Structured Courses",
      description:
        "Learn JavaScript, TypeScript & Playwright through step-by-step modules with interactive quizzes and AI-powered guidance. More courses coming soon — including AI Testing.",
      tags: ["JavaScript", "TypeScript", "Playwright", "AI Testing (Soon)"],
      href: "/dashboard/learning",
      color: "bg-blue-500",
    },
    {
      icon: Code2,
      title: "Practice Challenges",
      description:
        "Solve real-world coding challenges across beginner to advanced tiers. Get instant AI feedback on your solutions.",
      tags: ["100+ Challenges", "AI Feedback", "All Levels"],
      href: "/dashboard/practice",
      color: "bg-purple-500",
    },
    {
      icon: Wrench,
      title: "Hands-On Tools",
      description:
        "Practice on interactive tools — sliders, forms, e-commerce sites, and web apps. Test like you would on a real job.",
      tags: ["Interactive Apps", "Real Scenarios", "Instant Validation"],
      href: "/dashboard/practice",
      color: "bg-emerald-500",
    },
    {
      icon: GraduationCap,
      title: "Interview Questions",
      description:
        "350+ curated interview questions with detailed answers and code examples. JS, TypeScript & Playwright — everything covered.",
      tags: ["350+ Questions", "Code Examples", "Expert Answers"],
      href: "/dashboard/interview-prep",
      color: "bg-amber-500",
    },
  ];

  return (
    <section id="features" className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Everything you need to become a QA pro
          </h2>
          <p className="text-lg text-slate-600">
            Four pillars to take you from beginner to interview-ready.
          </p>
        </div>

        {/* Module Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {modules.map((module, index) => {
            const Icon = module.icon;
            return (
              <Link
                key={index}
                href={module.href}
                className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${module.color} mb-5`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {module.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  {module.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {module.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-medium px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Arrow */}
                <div className="flex items-center gap-1 text-sm font-medium text-brand-600 group-hover:gap-2 transition-all">
                  Explore
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
