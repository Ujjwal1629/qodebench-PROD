"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Zap, Trophy, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function SocialProof() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const stats = [
    {
      icon: Code2,
      value: "100+",
      label: "Coding Challenges",
      description: "Across 5+ technologies",
    },
    {
      icon: Zap,
      value: "AI-Powered",
      label: "Instant Feedback",
      description: "On every submission",
    },
    {
      icon: Trophy,
      value: "Global",
      label: "Leaderboard",
      description: "Compete worldwide",
    },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "CS Student",
      company: "DAV University",
      avatar: "PS",
      rating: 5,
      feedback:
        "This platform is a game-changer! The mock interviews helped me prepare for placements. The AI feedback is incredibly detailed.",
    },
    {
      name: "Rahul Verma",
      role: "Final Year Student",
      company: "NIT Vellore",
      avatar: "RV",
      rating: 5,
      feedback:
        "The real-world challenges are exactly what I needed. I landed my dream job thanks to the skills I built here!",
    },
    {
      name: "Ananya Reddy",
      role: "B.Tech CSE",
      company: "Amity University",
      avatar: "AR",
      rating: 5,
      feedback:
        "The learning modules with AI tutor are amazing. Complex concepts become so easy to understand.",
    },
    {
      name: "Vikram Joshi",
      role: "MCA Student",
      company: "Guru Jambheshwar University",
      avatar: "VJ",
      rating: 5,
      feedback:
        "As someone switching to tech, Qodebench gave me the practical experience I was missing.",
    },
    {
      name: "DevCommunity_X",
      role: "Tech Community",
      company: "Twitter/X",
      avatar: "DC",
      rating: 5,
      feedback:
        "Finally, a platform that simulates actual dev work! Our community members are loving it.",
    },
    {
      name: "CodeWithPratik",
      role: "Developer Influencer",
      company: "LinkedIn",
      avatar: "CP",
      rating: 5,
      feedback:
        "Tested this with my students - the results are incredible. Worth every penny!",
    },
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 3) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, testimonials.length]);

  const visibleTestimonials = [
    testimonials[currentIndex],
    testimonials[(currentIndex + 1) % testimonials.length],
    testimonials[(currentIndex + 2) % testimonials.length],
  ];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 3 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 3) % testimonials.length);
  };

  return (
    <section className="py-16 lg:py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-yellow-100 border border-yellow-300 px-4 py-2 rounded-full mb-6">
            <Star className="w-4 h-4 text-yellow-600 fill-yellow-600" />
            <span className="text-sm font-semibold text-yellow-700">
              Student & Community Feedback
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Join Freshers Who Got{" "}
            <span className="bg-gradient-to-r from-brand-500 to-purple-600 bg-clip-text text-transparent">
              Job-Ready
            </span>
          </h2>
          <p className="text-lg text-slate-600">
            Real results from students like you
          </p>
        </motion.div>

        {/* Hero Stats - Horizontal Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-brand-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center shadow-lg shadow-brand-500/25 flex-shrink-0">
                    <Icon className="h-6 w-6 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="text-2xl font-bold text-slate-900">
                      {stat.value}
                    </div>
                    <div className="text-sm font-semibold text-slate-700">
                      {stat.label}
                    </div>
                    <div className="text-xs text-slate-500">
                      {stat.description}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Testimonial Carousel */}
        <div
          className="relative max-w-7xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="grid md:grid-cols-3 gap-6">
            <AnimatePresence mode="wait">
              {visibleTestimonials.map((testimonial, index) => (
                <motion.div
                  key={`${currentIndex}-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-xl hover:border-brand-300 transition-all duration-300"
                >
                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-500 fill-yellow-500"
                      />
                    ))}
                  </div>

                  {/* Feedback */}
                  <p className="text-slate-700 text-sm mb-4 leading-relaxed line-clamp-3">
                    &quot;{testimonial.feedback}&quot;
                  </p>

                  {/* User Info */}
                  <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gradient-to-br from-brand-500 to-purple-600 text-white font-semibold text-sm">
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
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-full bg-white border-2 border-brand-300 text-brand-600 hover:bg-brand-50 hover:border-brand-400 transition-all duration-300 flex items-center justify-center"
              aria-label="Previous testimonials"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {[0, 1].map((dot) => (
                <button
                  key={dot}
                  onClick={() => setCurrentIndex(dot * 3)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentIndex === dot * 3
                      ? "bg-brand-500 w-8"
                      : "bg-slate-300 hover:bg-slate-400"
                  }`}
                  aria-label={`Go to testimonial set ${dot + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full bg-white border-2 border-brand-300 text-brand-600 hover:bg-brand-50 hover:border-brand-400 transition-all duration-300 flex items-center justify-center"
              aria-label="Next testimonials"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-slate-500 text-sm">
            Trusted by students from IIT, NIT, BITS, and more
          </p>
        </motion.div>
      </div>
    </section>
  );
}
