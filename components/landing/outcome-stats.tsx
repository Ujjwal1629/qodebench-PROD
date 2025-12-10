"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface OutcomeStat {
  value: string;
  label: string;
  sublabel: string;
}

export function OutcomeStats() {
  const stats: OutcomeStat[] = [
    { value: "90%", label: "Job Interview Ready", sublabel: "In 3 months" },
    { value: "500+", label: "Challenges Solved", sublabel: "By our community" },
    { value: "4.8/5", label: "Student Rating", sublabel: "Based on 100+ reviews" },
    { value: "100%", label: "Practical Skills", sublabel: "Real-world focused" },
  ];

  return (
    <div className="pt-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} index={index} />
        ))}
      </div>
    </div>
  );
}

interface StatCardProps {
  stat: OutcomeStat;
  index: number;
}

function StatCard({ stat, index }: StatCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [animatedValue, setAnimatedValue] = useState(stat.value);

  useEffect(() => {
    if (!isInView) return;

    // Animate numbers for numeric stats
    if (stat.value.includes("%")) {
      const numValue = parseInt(stat.value);
      let current = 0;
      const increment = numValue / 30;
      const timer = setInterval(() => {
        current += increment;
        if (current >= numValue) {
          setAnimatedValue(`${numValue}%`);
          clearInterval(timer);
        } else {
          setAnimatedValue(`${Math.round(current)}%`);
        }
      }, 30);
      return () => clearInterval(timer);
    } else if (stat.value.includes("+")) {
      const numValue = parseInt(stat.value);
      let current = 0;
      const increment = numValue / 30;
      const timer = setInterval(() => {
        current += increment;
        if (current >= numValue) {
          setAnimatedValue(`${numValue}+`);
          clearInterval(timer);
        } else {
          setAnimatedValue(`${Math.round(current)}+`);
        }
      }, 30);
      return () => clearInterval(timer);
    } else if (stat.value.includes("/")) {
      // For ratings like "4.8/5", animate the decimal
      const numValue = parseFloat(stat.value);
      let current = 0;
      const increment = numValue / 30;
      const timer = setInterval(() => {
        current += increment;
        if (current >= numValue) {
          setAnimatedValue(stat.value);
          clearInterval(timer);
        } else {
          setAnimatedValue(`${current.toFixed(1)}/5`);
        }
      }, 30);
      return () => clearInterval(timer);
    }
  }, [isInView, stat.value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-white/60 backdrop-blur-sm border border-brand-200/50 rounded-xl p-4 shadow-sm hover:shadow-lg hover:border-brand-300 transition-all duration-300"
    >
      <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
        {animatedValue}
      </div>
      <div className="text-xs md:text-sm text-slate-900 font-semibold mt-1">
        {stat.label}
      </div>
      <div className="text-xs text-slate-500 mt-0.5">{stat.sublabel}</div>
    </motion.div>
  );
}
