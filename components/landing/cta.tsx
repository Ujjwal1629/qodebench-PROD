"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-brand-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[100px]" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to start your QA automation journey?
          </h2>
          <p className="text-lg text-slate-400 mb-10">
            Join hundreds of testers who are building real skills with QodeBench.
          </p>
          <Button
            asChild
            size="lg"
            className="h-14 px-10 text-base font-semibold bg-white text-slate-900 hover:bg-slate-100 rounded-xl"
          >
            <Link href="/signup">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <p className="text-sm text-slate-500 mt-6">
            No credit card required. Free tier forever. Cancel anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
