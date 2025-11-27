"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Star, Code2, Users, Trophy } from "lucide-react";

export function PromoBanner() {
  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-slate-900 via-brand-950 to-slate-950">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Main promo card */}
            <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-brand-500/5 via-purple-500/5 to-brand-500/5" />

              <div className="relative grid lg:grid-cols-2 gap-8 lg:gap-12 items-center p-8 lg:p-12">
                {/* Left Content */}
                <div className="space-y-6">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 px-4 py-2 rounded-full">
                    <Sparkles className="h-4 w-4 text-brand-400" />
                    <span className="text-sm font-semibold text-brand-300">
                      Beta Launch
                    </span>
                  </div>

                  {/* Heading */}
                  <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                    Beta Launch:{" "}
                    <span className="bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent pb-1 inline-block">
                      100% Free Access
                    </span>
                  </h2>

                  {/* Description */}
                  <p className="text-lg text-slate-300 leading-relaxed">
                    Be among the first 500 developers to join QodeBench Beta and get free access to all Pro features for 1 month.
                    Master real-world coding skills with unlimited challenges, AI feedback, and mock interviews.
                  </p>

                  {/* Features */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { icon: Code2, text: "Unlimited Challenges" },
                      { icon: Sparkles, text: "Advanced AI Feedback" },
                      { icon: Users, text: "Mock Interviews" },
                      { icon: Trophy, text: "Weekly Competitions" },
                    ].map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center">
                            <Icon className="h-4 w-4 text-brand-400" />
                          </div>
                          <span className="text-sm text-slate-300">{item.text}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* CTA */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button
                      asChild
                      size="lg"
                      className="bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white shadow-lg hover:shadow-xl transition-all rounded-xl font-semibold group"
                    >
                      <Link href="/signup">
                        Join Beta For Free
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                    <div className="flex flex-col justify-center">
                      <span className="text-sm text-slate-400">
                        Limited to first <span className="text-brand-400 font-semibold">500 early users</span>
                      </span>
                      <span className="text-xs text-slate-500">
                        Free for 1 month • No credit card required
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Content - Visual Element */}
                <div className="relative lg:block hidden">
                  {/* Floating cards */}
                  <div className="relative h-96">
                    {/* Card 1 - Completion Badge */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                      className="absolute top-0 right-0 bg-gradient-to-br from-brand-500 to-brand-600 p-6 rounded-2xl shadow-2xl rotate-3 hover:rotate-0 transition-transform"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                          <Trophy className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="text-xs text-brand-100 font-medium">Challenge Complete!</div>
                          <div className="text-lg font-bold text-white">+250 XP</div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Card 2 - Stats */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 }}
                      className="absolute top-32 left-0 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-2xl -rotate-3 hover:rotate-0 transition-transform"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                          <span className="text-white font-semibold">Rank: Senior Dev</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-2xl font-bold text-white">42</div>
                            <div className="text-xs text-slate-300">Challenges</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-white">98%</div>
                            <div className="text-xs text-slate-300">Accuracy</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Card 3 - Logo */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6 }}
                      className="absolute bottom-0 right-12 bg-white p-8 rounded-3xl shadow-2xl"
                    >
                      <div className="relative w-28 h-28">
                        <Image
                          src="/qodebench.svg"
                          alt="QodeBench"
                          width={112}
                          height={112}
                          className="object-contain"
                        />
                      </div>
                      <div className="mt-3 text-center">
                        <div className="text-sm font-bold text-slate-900">QodeBench</div>
                        <div className="text-xs text-brand-600 font-semibold">Beta Tester</div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-500 to-transparent" />
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-brand-500/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
