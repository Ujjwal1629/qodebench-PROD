"use client";

import { motion } from "framer-motion";
import { Code, Layers, Server, Rocket, Target, Award } from "lucide-react";

export function LearningRoadmap() {
  const stages = [
    {
      number: "01",
      icon: Code,
      title: "Foundations",
      duration: "Weeks 1-3",
      topics: ["HTML & CSS", "JavaScript Basics", "Git & GitHub", "VS Code Setup"],
      color: "from-blue-500 to-cyan-500",
    },
    {
      number: "02",
      icon: Layers,
      title: "Frontend",
      duration: "Weeks 4-7",
      topics: ["React Fundamentals", "Next.js", "TypeScript", "Tailwind CSS"],
      color: "from-purple-500 to-pink-500",
    },
    {
      number: "03",
      icon: Server,
      title: "Backend",
      duration: "Weeks 8-11",
      topics: ["Node.js & Express", "Databases", "APIs", "Authentication"],
      color: "from-green-500 to-emerald-500",
    },
    {
      number: "04",
      icon: Rocket,
      title: "Real Projects",
      duration: "Weeks 12-15",
      topics: ["Production Debugging", "PR Reviews", "Testing", "Deployment"],
      color: "from-orange-500 to-red-500",
    },
    {
      number: "05",
      icon: Target,
      title: "Interview Prep",
      duration: "Weeks 16-18",
      topics: ["Mock Interviews", "System Design", "DSA Review", "Portfolio"],
      color: "from-indigo-500 to-purple-500",
    },
    {
      number: "06",
      icon: Award,
      title: "Job Ready",
      duration: "Week 18+",
      topics: ["Certifications", "Job Applications", "Resume Review", "Placement Support"],
      color: "from-yellow-500 to-amber-500",
    },
  ];

  return (
    <section className="py-20 lg:py-24 bg-white">
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
            Your{" "}
            <span className="bg-gradient-to-r from-brand-500 to-purple-600 bg-clip-text text-transparent">
              Learning Roadmap
            </span>
          </h2>
          <p className="text-lg text-slate-600">
            Structured 18-week program to take you from beginner to job-ready
          </p>
        </motion.div>

        {/* Roadmap Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                {/* Connecting line (except for last item in row) */}
                {(index + 1) % 3 !== 0 && index !== stages.length - 1 && (
                  <div className="hidden lg:block absolute top-16 -right-3 w-6 h-0.5 bg-gradient-to-r from-brand-200 to-purple-200 z-0" />
                )}

                <div className="relative bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200 rounded-2xl p-6 hover:shadow-2xl hover:border-brand-300 transition-all duration-300 h-full">
                  {/* Number Badge */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 text-white font-bold text-lg flex items-center justify-center shadow-lg">
                    {stage.number}
                  </div>

                  {/* Icon */}
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${stage.color} mb-4 mt-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {stage.title}
                  </h3>

                  {/* Duration */}
                  <p className="text-sm text-brand-600 font-semibold mb-4">
                    {stage.duration}
                  </p>

                  {/* Topics */}
                  <ul className="space-y-2">
                    {stage.topics.map((topic, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-sm text-slate-600"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                        {topic}
                      </li>
                    ))}
                  </ul>

                  {/* Progress indicator */}
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Stage {stage.number}</span>
                      <span className="text-brand-600 font-semibold">
                        {stage.topics.length} Topics
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-center bg-gradient-to-r from-brand-50 via-purple-50 to-brand-50 border border-brand-200 rounded-2xl p-8 max-w-4xl mx-auto"
        >
          <h3 className="text-xl font-bold text-slate-900 mb-3">
            Flexible Learning Schedule
          </h3>
          <p className="text-slate-600 mb-4">
            This roadmap is self-paced. Complete it faster or take your time - you have lifetime
            access to all learning materials.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-slate-700">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="font-medium">Self-paced learning</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <div className="w-2 h-2 bg-brand-500 rounded-full" />
              <span className="font-medium">Lifetime access</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              <span className="font-medium">AI-powered support</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
