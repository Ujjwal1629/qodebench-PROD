import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Lock,
  Crown,
  Sparkles,
  Zap,
  BookOpen,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { FREE_LESSONS_PER_PATH } from '@/lib/learning/progress-service';

interface LessonPaywallCardProps {
  lessonTitle: string;
  lessonIndex: number;
  backHref: string;
  backLabel: string;
}

/**
 * Premium paywall card shown when a free user tries to access
 * a lesson beyond the free limit (currently first 4 are free).
 */
export function LessonPaywallCard({
  lessonTitle,
  lessonIndex,
  backHref,
  backLabel,
}: LessonPaywallCardProps) {
  return (
    <div className="container max-w-2xl py-12 space-y-6">
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-sky-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {backLabel}
      </Link>

      <Card className="border-2 border-amber-200/60 bg-gradient-to-br from-amber-50/80 via-white to-purple-50/40 shadow-xl overflow-hidden">
        {/* Decorative top bar */}
        <div className="h-1.5 bg-gradient-to-r from-amber-400 via-purple-500 to-sky-500" />

        <CardContent className="p-8 sm:p-10 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-purple-600 shadow-lg shadow-purple-200/50">
              <Lock className="h-9 w-9 text-white" />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
                Premium Lesson
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                {lessonTitle}
              </h2>
              <p className="text-base text-slate-500">
                Lesson {lessonIndex} is part of our premium content.
                <br />
                You&apos;ve enjoyed {FREE_LESSONS_PER_PATH} free lessons — unlock the rest to keep learning!
              </p>
            </div>
          </div>

          {/* Benefits */}
          <div className="rounded-xl border border-slate-200 bg-white/70 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Crown className="h-4 w-4 text-amber-500" />
              What you get with Premium
            </h3>
            <div className="grid gap-3">
              {[
                {
                  icon: BookOpen,
                  title: 'All Lessons Unlocked',
                  desc: 'Access every lesson across all learning paths',
                },
                {
                  icon: Sparkles,
                  title: 'AI Tutor & Feedback',
                  desc: 'Unlimited AI-powered hints and explanations',
                },
                {
                  icon: Zap,
                  title: 'Challenges & Interview Prep',
                  desc: 'Unlimited attempts, advanced challenges & mock interviews',
                },
              ].map((benefit) => (
                <div key={benefit.title} className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-lg bg-sky-100 p-2">
                    <benefit.icon className="h-4 w-4 text-sky-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800">{benefit.title}</p>
                    <p className="text-xs text-slate-500">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-3 text-center">
            <Button
              asChild
              size="lg"
              className="w-full bg-gradient-to-r from-purple-600 to-sky-600 hover:from-purple-700 hover:to-sky-700 text-white shadow-lg shadow-purple-200/50 gap-2 text-base h-12"
            >
              <Link href="/pricing">
                View Pricing Plans
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <p className="text-xs text-slate-400">
              Starting at just ₹999/month · Cancel anytime
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
