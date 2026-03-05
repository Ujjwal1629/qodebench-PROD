"use client";

import { motion } from "framer-motion";
import { GitPullRequest, BookOpen, Target, Brain, Zap, TestTube } from "lucide-react";

export function ValueProposition() {
  const leftColumn = [
    {
      icon: BookOpen,
      title: "Structured Learning",
      description:
        "Learn testing fundamentals through comprehensive modules covering test methodologies, best practices, and essential QA skills.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: GitPullRequest,
      title: "Testing Lifecycle",
      description:
        "Experience the full testing lifecycle — write test plans, execute test cases, and validate results like a professional QA engineer.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: TestTube,
      title: "Hands-On Practice",
      description:
        "Test real tools like sliders, forms, and e-commerce sites. Practice on interactive applications with instant validation.",
      color: "from-yellow-500 to-amber-500",
    },
  ];

  const rightColumn = [
    {
      icon: Brain,
      title: "AI Guidance",
      description:
        "Get instant AI-powered hints, explanations, and feedback on your testing work — like having a senior QA engineer by your side.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Zap,
      title: "Real-Time Feedback",
      description:
        "Receive immediate evaluation on your solutions. Learn from mistakes instantly and iterate faster than ever.",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: Target,
      title: "Progressive Learning",
      description:
        "Follow a structured path from basics to advanced testing. Build skills step-by-step with personalized recommendations.",
      color: "from-orange-500 to-red-500",
    },
  ];

  const featurePills = [
    "Interactive Tools",
    "Structured Courses",
    "Real-Time Feedback",
    "AI-Powered Guidance",
    "Personalized Learning",
    "Practice Scenarios",
  ];

  return (
    <section id="features" className="py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            What Makes{" "}
            <span className="bg-gradient-to-r from-brand-500 to-purple-600 bg-clip-text text-transparent">
              Qodebench
            </span>{" "}
            Different
          </h2>
          <p className="text-lg text-slate-600">
            Learn testing through structured courses and practice on real interactive tools
          </p>
        </motion.div>

        {/* Two Column Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto mb-12">
          {/* Left Column - Real Developer Experience */}
          <div className="space-y-6">
            {leftColumn.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-brand-300 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right Column - AI-Powered Learning */}
          <div className="space-y-6">
            {rightColumn.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-purple-300 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto"
        >
          {featurePills.map((pill, index) => (
            <div
              key={index}
              className="bg-white border border-brand-200 rounded-full px-6 py-3 hover:bg-brand-50 hover:border-brand-400 transition-all duration-300 cursor-default"
            >
              <span className="text-brand-600 font-semibold text-sm">
                ✓ {pill}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
