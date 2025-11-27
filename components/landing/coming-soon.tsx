"use client";

import { Sparkles, GraduationCap, Library, BarChart3, FlaskConical, Users, Award } from "lucide-react";

const upcomingFeatures = [
  {
    icon: GraduationCap,
    title: "AI Tools Learning Paths",
    description: "Structured courses to master Cursor, Copilot, and other AI dev tools",
    timeline: "Coming After Beta",
  },
  {
    icon: Library,
    title: "Prompt Library",
    description: "1000+ battle-tested AI prompts for coding, debugging, and more",
    timeline: "Coming After Beta",
  },
  {
    icon: BarChart3,
    title: "AI Tool Comparison",
    description: "Real-time benchmarks comparing ChatGPT, Claude, Copilot, and Cursor",
    timeline: "Coming After Beta",
  },
  {
    icon: FlaskConical,
    title: "Performance Sandbox",
    description: "Test and compare AI tools side-by-side on actual coding tasks",
    timeline: "Coming After Beta",
  },
  {
    icon: Users,
    title: "Community Workflows",
    description: "Share and learn AI-powered workflows from developers worldwide",
    timeline: "Coming After Beta",
  },
  {
    icon: Award,
    title: "AI Certifications",
    description: "Earn industry-recognized credentials for AI tool proficiency",
    timeline: "Coming After Beta",
  },
];

export function ComingSoon() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-purple-50 via-brand-50/30 to-slate-50">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-brand-500/10 border border-purple-300/50 px-5 py-2.5 rounded-full backdrop-blur-sm mb-6">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-semibold text-purple-600">
              COMING AFTER BETA
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            <span className="text-slate-900">The Future of </span>
            <span className="bg-gradient-to-r from-purple-600 to-brand-600 bg-clip-text text-transparent">
              AI-Powered Learning
            </span>
          </h2>
          <p className="text-lg text-slate-600">
            We're building the most comprehensive AI development education platform. Join now to get early access.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {upcomingFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="relative group bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-8 hover:bg-white hover:border-purple-300 hover:shadow-2xl transition-all duration-300"
              >
                {/* Coming Soon Badge */}
                <div className="absolute top-4 right-4">
                  <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                    Soon
                  </span>
                </div>

                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-brand-500 flex items-center justify-center mb-6 shadow-lg opacity-80 group-hover:opacity-100 transition-opacity">
                  <Icon className="h-6 w-6 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-slate-600 leading-relaxed mb-4">
                  {feature.description}
                </p>

                {/* Timeline */}
                <div className="flex items-center gap-2 text-sm text-purple-600 font-medium">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  {feature.timeline}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Notice */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-white border-2 border-purple-200 rounded-2xl p-6 max-w-2xl">
            <p className="text-slate-900 font-semibold mb-2">
              🚀 Beta users will get early access to all these features
            </p>
            <p className="text-sm text-slate-600">
              Join now to shape the future of QodeBench and unlock these features as soon as they launch
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
