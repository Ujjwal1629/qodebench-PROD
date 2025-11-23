"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Code2, BookOpen, Mic } from "lucide-react";

export function ProductModules() {
  const modules = [
    {
      icon: Code2,
      title: "Challenges",
      description:
        "Real company-style tasks spanning frontend, backend, and full-stack. Debug production bugs, fix issues, and test code just like you would in an actual development job.",
      features: [
        "Production-like debugging",
        "Frontend & backend tasks",
        "Test case validation",
        "AI-powered feedback",
      ],
      gradient: "from-blue-500 to-cyan-500",
      href: "/dashboard/challenges",
      cta: "Browse Challenges",
    },
    {
      icon: BookOpen,
      title: "Learning",
      description:
        "Core full-stack theory covering HTML/CSS, JavaScript, React/Next.js, and Backend APIs. Interactive quizzes and an AI tutor that explains concepts and answers your questions.",
      features: [
        "Structured learning paths",
        "Interactive quizzes",
        "AI tutor for guidance",
        "Real-world examples",
      ],
      gradient: "from-purple-500 to-pink-500",
      href: "/dashboard/learning",
      cta: "Start Learning",
    },
    {
      icon: Mic,
      title: "Mock Interviews",
      description:
        "AI interviewer conducts realistic verbal technical interviews. Get real-time feedback on your answers, detailed performance reports, and complete transcripts to improve.",
      features: [
        "Voice-based interviews",
        "Real-time AI evaluation",
        "Detailed feedback reports",
        "Interview transcripts",
      ],
      gradient: "from-orange-500 to-red-500",
      href: "/dashboard/interviews",
      cta: "Try Interview",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Three Ways to Master{" "}
            <span className="bg-gradient-to-r from-brand-500 to-purple-600 bg-clip-text text-transparent">
              Full-Stack Development
            </span>
          </h2>
          <p className="text-lg text-slate-600">
            Experience real developer workflows through our three core modules designed to prepare you for the job market.
          </p>
        </div>

        {/* Module Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {modules.map((module, index) => {
            const Icon = module.icon;
            return (
              <div
                key={index}
                className="group bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                {/* Icon */}
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${module.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}
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
                <ul className="space-y-3 mb-8">
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
            All modules work together to simulate real developer experience
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
