"use client";

import { UserPlus, CreditCard, Laptop } from "lucide-react";

export function ValueProposition() {
  const steps = [
    {
      icon: UserPlus,
      step: "01",
      title: "Create your account",
      description: "Sign up in seconds with email. Start exploring free content immediately.",
    },
    {
      icon: CreditCard,
      step: "02",
      title: "Choose a plan",
      description: "Use the free tier forever, or unlock everything with a premium plan starting at just \u20B91,999.",
    },
    {
      icon: Laptop,
      step: "03",
      title: "Learn, practice, ace interviews",
      description: "Work through courses, solve challenges, practice on tools, and master 350+ interview questions.",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-slate-50">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            How it works
          </h2>
          <p className="text-lg text-slate-600">
            Three steps. That&apos;s all it takes.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative text-center">
                {/* Connector line (desktop only) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-slate-300" />
                )}

                {/* Step number */}
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white border-2 border-slate-200 mb-6 shadow-sm relative z-10">
                  <Icon className="w-8 h-8 text-slate-700" />
                </div>

                {/* Step label */}
                <div className="text-xs font-bold text-brand-600 tracking-widest uppercase mb-2">
                  Step {step.step}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-600 leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
