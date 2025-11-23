"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trophy, Calendar, Award, TrendingUp } from "lucide-react";

export function CodeFridays() {
  return (
    <section className="py-20 bg-gradient-to-br from-brand-500 via-brand-600 to-purple-600 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-20 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-400/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-5 py-2 rounded-full mb-6">
            <Calendar className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white">
              Every Friday
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Join our weekly{" "}
            <span className="text-yellow-300">Code Fridays</span>
          </h2>
          <p className="text-lg text-white/90">
            Take weekly coding missions, earn points, and win rewards based on your monthly leaderboard rank.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-xl mb-4">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Weekly Challenges
            </h3>
            <p className="text-sm text-white/80">
              New coding missions every Friday to keep your skills sharp
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-xl mb-4">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Earn Points</h3>
            <p className="text-sm text-white/80">
              Complete challenges to accumulate points on the leaderboard
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-xl mb-4">
              <Trophy className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Monthly Rankings
            </h3>
            <p className="text-sm text-white/80">
              Compete with developers worldwide on the monthly leaderboard
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-xl mb-4">
              <Award className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Win Rewards</h3>
            <p className="text-sm text-white/80">
              Top performers receive exclusive rewards and recognition
            </p>
          </div>
        </div>

        {/* Highlight Box */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-12 max-w-4xl mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Why participate in Code Fridays?
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div>
              <div className="text-yellow-300 text-3xl font-bold mb-2">
                100+
              </div>
              <p className="text-white/90 text-sm">
                Active developers competing every week
              </p>
            </div>
            <div>
              <div className="text-yellow-300 text-3xl font-bold mb-2">
                Real-World
              </div>
              <p className="text-white/90 text-sm">
                Production-style challenges that matter
              </p>
            </div>
            <div>
              <div className="text-yellow-300 text-3xl font-bold mb-2">
                Rewards
              </div>
              <p className="text-white/90 text-sm">
                Monthly prizes for top leaderboard performers
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8">
            <Button
              asChild
              size="lg"
              className="bg-white text-brand-600 hover:bg-white/90 text-lg px-10 h-14 rounded-2xl font-semibold transition-all shadow-xl hover:scale-105"
            >
              <Link href="/dashboard/challenges">Join This Friday →</Link>
            </Button>
            <p className="text-sm text-white/80 mt-4">
              Free to participate • No credit card required
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
