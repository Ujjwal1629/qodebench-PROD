"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function TestimonialsModern() {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Placed at TCS",
      company: "DAV University",
      avatar: "PS",
      rating: 5,
      feedback:
        "QodeBench transformed how I learned coding. The mock interviews were game-changing - I felt confident in my real placement interviews!",
      highlight: "Placed in 3 months",
    },
    {
      name: "Rahul Verma",
      role: "SDE at Wipro",
      company: "NIT Vellore",
      avatar: "RV",
      rating: 5,
      feedback:
        "Real-world challenges made all the difference. I wasn't just solving coding problems - I was learning how actual companies work.",
      highlight: "6 LPA package",
    },
    {
      name: "Ananya Reddy",
      role: "Frontend Developer",
      company: "Amity University",
      avatar: "AR",
      rating: 5,
      feedback:
        "The AI tutor is incredible! Got instant help whenever I was stuck. Built 5 projects and landed my dream job.",
      highlight: "Self-paced learning",
    },
    {
      name: "Vikram Joshi",
      role: "Full Stack Developer",
      company: "Career Switch",
      avatar: "VJ",
      rating: 5,
      feedback:
        "Switched from mechanical to tech because of QodeBench. The structured curriculum made it possible to learn everything step by step.",
      highlight: "Career switch",
    },
    {
      name: "Sneha Patel",
      role: "Placed at Infosys",
      company: "BITS Pilani",
      avatar: "SP",
      rating: 5,
      feedback:
        "Production bug debugging challenges were eye-opening. I learned more here in 3 months than 2 years of college coding.",
      highlight: "7 LPA package",
    },
    {
      name: "Arjun Mehta",
      role: "React Developer",
      company: "VIT Vellore",
      avatar: "AM",
      rating: 5,
      feedback:
        "Best investment in my career. The weekly competitions kept me motivated, and the AI feedback helped me improve continuously.",
      highlight: "Continuous improvement",
    },
  ];

  return (
    <section className="py-20 lg:py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-yellow-100 border border-yellow-300 px-4 py-2 rounded-full mb-6">
            <Star className="w-4 h-4 text-yellow-600 fill-yellow-600" />
            <span className="text-sm font-semibold text-yellow-700">
              Rated 4.8/5 by Students
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Students Love{" "}
            <span className="bg-gradient-to-r from-brand-500 to-purple-600 bg-clip-text text-transparent">
              Learning Here
            </span>
          </h2>
          <p className="text-lg text-slate-600">
            Join 100+ students who got job-ready with QodeBench
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-2xl hover:border-brand-300 transition-all duration-300 relative">
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Quote className="w-12 h-12 text-brand-500" />
                </div>

                {/* Rating */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-500 fill-yellow-500"
                    />
                  ))}
                </div>

                {/* Feedback */}
                <p className="text-slate-700 leading-relaxed mb-4 relative z-10">
                  &quot;{testimonial.feedback}&quot;
                </p>

                {/* Highlight Badge */}
                <div className="inline-flex items-center gap-1 bg-brand-50 text-brand-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                  ✓ {testimonial.highlight}
                </div>

                {/* User Info */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-gradient-to-br from-brand-500 to-purple-600 text-white font-semibold">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">
                      {testimonial.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      {testimonial.role}
                    </div>
                    <div className="text-xs text-slate-400">
                      {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-slate-500 text-sm">
            Join students from IIT, NIT, BITS, and 50+ colleges across India
          </p>
        </motion.div>
      </div>
    </section>
  );
}
