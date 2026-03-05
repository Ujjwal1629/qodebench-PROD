"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Code2, BookOpen } from "lucide-react";

export function ProductModules() {
  const modules = [
    {
      icon: BookOpen,
      title: "Learning",
      description:
        "Comprehensive QA courses covering test methodologies, testing fundamentals, best practices, and essential QA skills. Learn through structured modules with interactive quizzes and AI-powered guidance.",
      features: [
        "Structured learning modules",
        "Interactive quizzes",
        "AI tutor for guidance",
        "Testing fundamentals",
      ],
      gradient: "from-purple-500 to-pink-500",
      href: "/dashboard/learning",
      cta: "Start Learning",
    },
    {
      icon: Code2,
      title: "Practice Tools",
      description:
        "Hands-on practice with real tools like sliders, e-commerce sites, forms, and interactive applications. Test, validate, and get instant feedback on your testing skills.",
      features: [
        "Interactive testing tools",
        "Real-world scenarios",
        "Instant validation",
        "AI-powered feedback",
      ],
      gradient: "from-blue-500 to-cyan-500",
      href: "/dashboard/challenges",
      cta: "Try Practice Tools",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Two Ways to{" "}
            <span className="bg-gradient-to-r from-brand-500 to-purple-600 bg-clip-text text-transparent">
              Master Testing
            </span>
          </h2>
          <p className="text-lg text-slate-600">
            Learn testing fundamentals and practice on real tools to build your QA skills.
          </p>
        </div>

        {/* Module Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {modules.map((module, index) => {
            const Icon = module.icon;
            return (
              <div
                key={index}
                className="group bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center md:text-left"
              >
                {/* Icon */}
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${module.gradient} mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto md:mx-0`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  {module.title}
                </h3>

                {/* Description */}
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {module.description}
                </p>

                {/* Features List */}
                <ul className="space-y-3 mb-8 text-left">
                  {module.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-sm text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-brand-500 to-purple-600 hover:from-brand-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all"
                >
                  <Link href={module.href}>{module.cta} →</Link>
                </Button>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-slate-600 mb-6">
            Combine learning and practice to build strong testing skills
          </p>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-2 border-brand-500 text-brand-600 hover:bg-brand-50 rounded-xl font-semibold"
          >
            <Link href="/signup">Get Started Free →</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
