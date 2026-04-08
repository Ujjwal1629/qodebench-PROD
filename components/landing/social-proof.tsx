"use client";

import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function SocialProof() {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "QA Engineer, TCS",
      avatar: "PS",
      feedback:
        "The Playwright course and interview questions helped me crack my automation testing interview. The AI feedback is incredibly detailed.",
    },
    {
      name: "Rahul Verma",
      role: "Automation Tester",
      avatar: "RV",
      feedback:
        "Real-world practice challenges are exactly what I needed. I went from manual testing to automation in 2 months.",
    },
    {
      name: "Ananya Reddy",
      role: "CS Student, NIT",
      avatar: "AR",
      feedback:
        "The structured learning path from JavaScript to Playwright made complex automation concepts easy to understand.",
    },
    {
      name: "Vikram Joshi",
      role: "Career Switcher",
      avatar: "VJ",
      feedback:
        "As someone switching to QA, QodeBench gave me the practical experience and confidence I was missing. Worth every rupee.",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Trusted by QA professionals
          </h2>
          <p className="text-lg text-slate-600">
            Here&apos;s what our learners have to say.
          </p>
        </div>

        {/* Testimonial Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-shadow"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-yellow-500 fill-yellow-500"
                  />
                ))}
              </div>

              {/* Feedback */}
              <p className="text-sm text-slate-700 leading-relaxed mb-5">
                &quot;{t.feedback}&quot;
              </p>

              {/* User */}
              <div className="flex items-center gap-3">
                <Avatar className="w-9 h-9">
                  <AvatarFallback className="bg-slate-200 text-slate-700 font-semibold text-xs">
                    {t.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-slate-900 text-sm">
                    {t.name}
                  </div>
                  <div className="text-xs text-slate-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
