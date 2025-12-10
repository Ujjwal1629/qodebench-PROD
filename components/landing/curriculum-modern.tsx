"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Code2, BookOpen, Mic, CheckCircle2, Clock, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CurriculumModern() {
  const modules = [
    {
      icon: Code2,
      title: "Coding Challenges",
      description: "100+ real-world challenges from beginner to advanced level",
      features: [
        "Frontend & Backend tasks",
        "Production bug debugging",
        "Test case validation",
        "Instant AI feedback",
      ],
      duration: "Self-paced",
      level: "All Levels",
      color: "from-blue-500 to-cyan-500",
      href: "/dashboard/challenges",
    },
    {
      icon: BookOpen,
      title: "Interactive Learning",
      description: "Structured curriculum covering full-stack development",
      features: [
        "HTML, CSS & JavaScript",
        "React & Next.js",
        "Node.js & Databases",
        "AI tutor for help",
      ],
      duration: "8-12 weeks",
      level: "Beginner Friendly",
      color: "from-purple-500 to-pink-500",
      href: "/dashboard/learning",
    },
    {
      icon: Mic,
      title: "Mock Interviews",
      description: "Practice with AI interviewer and get detailed feedback",
      features: [
        "Voice-based interviews",
        "Real-time evaluation",
        "Detailed reports",
        "6-stage preparation",
      ],
      duration: "2-3 weeks",
      level: "Interview Prep",
      color: "from-orange-500 to-red-500",
      href: "/dashboard/interviews",
    },
  ];

  return (
    <section id="curriculum" className="py-20 lg:py-24 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Complete Full-Stack{" "}
            <span className="bg-gradient-to-r from-brand-500 to-purple-600 bg-clip-text text-transparent">
              Curriculum
            </span>
          </h2>
          <p className="text-lg text-slate-600">
            Everything you need to become a job-ready developer
          </p>
        </motion.div>

        {/* Module Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto mb-12">
          {modules.map((module, index) => {
            const Icon = module.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="h-full bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-2xl hover:border-brand-300 transition-all duration-300">
                  {/* Icon */}
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${module.color} mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {module.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                    {module.description}
                  </p>

                  {/* Meta info */}
                  <div className="flex items-center gap-4 mb-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{module.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BarChart className="w-3.5 h-3.5" />
                      <span>{module.level}</span>
                    </div>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-2 mb-6">
                    {module.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-2 border-slate-200 hover:border-brand-400 hover:bg-brand-50 transition-all group-hover:shadow-md"
                  >
                    <Link href={module.href}>Explore Module →</Link>
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-r from-brand-50 to-purple-50 border border-brand-200 rounded-2xl p-6">
            <div className="text-left">
              <p className="text-sm font-semibold text-slate-900 mb-1">
                Ready to start learning?
              </p>
              <p className="text-xs text-slate-600">
                Join 100+ students already learning on QodeBench
              </p>
            </div>
            <Button
              asChild
              className="bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white shadow-lg shadow-brand-500/25"
            >
              <Link href="/signup">Get Started Free</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
