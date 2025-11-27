"use client";

const steps = [
  {
    title: "Sign Up Free",
    description:
      "Create your account in seconds. No credit card required to get started",
  },
  {
    title: "Start with Your Level",
    description:
      "Begin at your experience level from Intern to Senior. Get personalized challenge recommendations",
  },
  {
    title: "Solve Real Challenges",
    description:
      "Complete coding challenges, office fundamentals, and practice mock interviews with AI",
  },
  {
    title: "Get AI Feedback",
    description:
      "Receive instant, detailed feedback on your code quality and areas for improvement",
  },
  {
    title: "Track Your Progress",
    description:
      "Earn points, climb experience levels, and watch your skills grow with detailed analytics",
  },
  {
    title: "Compete & Win",
    description:
      "Join Code Friday challenges, compete on leaderboards, and showcase your skills",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-32 bg-slate-50">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-brand-500 to-purple-600 bg-clip-text text-transparent">How It Works</span>
          </h2>
          <p className="text-lg text-slate-600 mt-4">
            Your journey from signup to success in 6 simple steps
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 max-w-7xl mx-auto">
          {steps.map((step, index) => {
            return (
              <div key={index} className="text-center group">
                {/* Number */}
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 text-white text-3xl font-bold mb-6 shadow-xl shadow-brand-500/30 group-hover:shadow-2xl group-hover:shadow-brand-500/40 transition-all duration-300 group-hover:scale-110">
                  {index + 1}
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-brand-700 transition-colors">
                  {step.title}
                </h3>
                <p className="text-slate-600 leading-relaxed text-base">
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
