"use client";

import { motion } from "framer-motion";
import { Users, Code2, Trophy, Zap } from "lucide-react";

export function StatsBanner() {
  const stats = [
    {
      icon: Users,
      value: "100+",
      label: "Active Students",
      description: "Learning every day",
    },
    {
      icon: Code2,
      value: "500+",
      label: "Challenges Solved",
      description: "By our community",
    },
    {
      icon: Trophy,
      value: "50+",
      label: "Students Placed",
      description: "At top companies",
    },
    {
      icon: Zap,
      value: "10K+",
      label: "AI Feedbacks",
      description: "Generated weekly",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-brand-500 via-brand-600 to-purple-600 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:14px_24px]" />
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Value */}
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.value}
                </div>

                {/* Label */}
                <div className="text-sm font-semibold text-white/90 mb-1">
                  {stat.label}
                </div>

                {/* Description */}
                <div className="text-xs text-white/70">
                  {stat.description}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
