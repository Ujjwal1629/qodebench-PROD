"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

export function Testimonials() {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Frontend Developer",
      company: "Tech Startup",
      avatar: "PS",
      rating: 5,
      feedback:
        "Qodebench completely changed how I prepare for interviews. The mock interviews feel so real, and the AI feedback helped me identify gaps I didn't even know I had.",
    },
    {
      name: "Rahul Mehta",
      role: "Full-Stack Engineer",
      company: "E-commerce Company",
      avatar: "RM",
      rating: 5,
      feedback:
        "The production-bug challenges are incredible. It's like working on real tickets. I finally understand how to debug complex issues in a team environment.",
    },
    {
      name: "Ananya Desai",
      role: "Backend Developer",
      company: "SaaS Product",
      avatar: "AD",
      rating: 5,
      feedback:
        "Code Fridays keep me sharp. The weekly challenges are well-designed, and competing on the leaderboard pushes me to learn faster. Worth every rupee!",
    },
    {
      name: "Vikram Singh",
      role: "CS Graduate",
      company: "Job Seeker",
      avatar: "VS",
      rating: 5,
      feedback:
        "As a fresh graduate, Qodebench gave me the confidence I needed. The learning modules with AI tutor made complex concepts easy to understand.",
    },
    {
      name: "Sneha Gupta",
      role: "React Developer",
      company: "Startup Founder",
      avatar: "SG",
      rating: 5,
      feedback:
        "I use Qodebench to train my junior developers. The platform simulates real development scenarios better than any other tool I've seen.",
    },
    {
      name: "Arjun Patel",
      role: "Full-Stack Developer",
      company: "Fintech Company",
      avatar: "AP",
      rating: 5,
      feedback:
        "The AI interviewer is no joke — it asks tough questions and gives honest feedback. Helped me land my current role at a top fintech company.",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-yellow-100 border border-yellow-300 px-4 py-2 rounded-full mb-6">
            <Star className="w-4 h-4 text-yellow-600 fill-yellow-600" />
            <span className="text-sm font-semibold text-yellow-700">
              Beta Tester Feedback
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Loved by{" "}
            <span className="bg-gradient-to-r from-brand-500 to-purple-600 bg-clip-text text-transparent">
              Developers
            </span>
          </h2>
          <p className="text-lg text-slate-600">
            See what our beta testers and early users are saying about their Qodebench experience.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-brand-300 transition-all duration-300"
            >
              {/* Rating Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-yellow-500 fill-yellow-500"
                  />
                ))}
              </div>

              {/* Feedback */}
              <p className="text-slate-700 mb-6 leading-relaxed">
                &quot;{testimonial.feedback}&quot;
              </p>

              {/* User Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-gradient-to-br from-brand-500 to-purple-600 text-white font-semibold">
                    {testimonial.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-slate-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-slate-500">
                    {testimonial.role} • {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="text-center mt-12">
          <p className="text-slate-500 text-sm">
            Join 100+ developers already training on Qodebench
          </p>
        </div>
      </div>
    </section>
  );
}
