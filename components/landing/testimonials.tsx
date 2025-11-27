"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

export function Testimonials() {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "CS Student",
      company: "DAV University",
      avatar: "PS",
      rating: 5,
      feedback:
        "This platform is a game-changer! The mock interviews helped me prepare for placements. The AI feedback is incredibly detailed and helped me improve my technical communication.",
    },
    {
      name: "Rahul Verma",
      role: "Final Year Student",
      company: "NIT Vellore",
      avatar: "RV",
      rating: 5,
      feedback:
        "The real-world challenges are exactly what I needed. It's like working on actual company projects. I landed my dream job thanks to the skills I built here!",
    },
    {
      name: "Ananya Reddy",
      role: "B.Tech CSE",
      company: "Amity University",
      avatar: "AR",
      rating: 5,
      feedback:
        "The learning modules with AI tutor are amazing. Complex concepts become so easy to understand. The weekly challenges keep me motivated to learn more.",
    },
    {
      name: "Vikram Joshi",
      role: "MCA Student",
      company: "Guru Jambheshwar University",
      avatar: "VJ",
      rating: 5,
      feedback:
        "As someone switching to tech, Qodebench gave me the practical experience I was missing. The production bug challenges taught me real debugging skills.",
    },
    {
      name: "DevCommunity_X",
      role: "Tech Community",
      company: "Twitter/X Campaign",
      avatar: "DC",
      rating: 5,
      feedback:
        "Finally, a platform that simulates actual dev work! The interview prep is top-notch. Our community members are loving it. Highly recommended for serious learners.",
    },
    {
      name: "CodeWithPratik",
      role: "Developer Influencer",
      company: "LinkedIn Campaign",
      avatar: "CP",
      rating: 5,
      feedback:
        "Tested this with my students - the results are incredible. The AI-powered feedback and realistic challenges make this stand out from other platforms. Worth every penny!",
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
              Student & Community Feedback
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Loved by{" "}
            <span className="bg-gradient-to-r from-brand-500 to-purple-600 bg-clip-text text-transparent">
              Developers
            </span>
          </h2>
          <p className="text-lg text-slate-600">
            Real feedback from students and tech communities who tested Qodebench.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-brand-300 transition-all duration-300 text-center md:text-left"
            >
              {/* Rating Stars */}
              <div className="flex gap-1 mb-4 justify-center md:justify-start">
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
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 justify-center md:justify-start">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-gradient-to-br from-brand-500 to-purple-600 text-white font-semibold">
                    {testimonial.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left">
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
            Join 100+ students and developers already training on Qodebench
          </p>
        </div>
      </div>
    </section>
  );
}
