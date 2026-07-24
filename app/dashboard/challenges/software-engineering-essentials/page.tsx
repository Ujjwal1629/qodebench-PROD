import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getTierProgress, getChallengesByTier } from '@/app/actions/challenges';
import { TierCard } from '@/components/challenges/tier-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, ChevronLeft } from 'lucide-react';
import { hasActiveSubscription } from '@/lib/utils/subscription-check';

export const metadata: Metadata = {
  title: 'Software Engineering Essentials | QodeBench',
  description: 'Professional workflow practices and office fundamentals',
};

export default async function SoftwareEngineeringEssentialsPage() {
  // Fetch tier progress
  const tierProgress = await getTierProgress();
  const currentTier = tierProgress.find((t) => t.tier === 'software-engineering-essentials');

  const totalCompleted = currentTier?.completed || 0;
  const totalChallenges = currentTier?.total || 0;

  return (
    <div className="space-y-8">
      {/* Back Navigation */}
      <Button asChild variant="ghost" size="sm" className="gap-2">
        <Link href="/dashboard/challenges">
          <ChevronLeft className="h-4 w-4" />
          Back to Categories
        </Link>
      </Button>

      {/* Page Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3 sm:gap-3 text-center sm:text-left">
          <div className="rounded-2xl bg-brand-600 p-3 shadow-lg">
            <Briefcase className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Software Engineering Essentials
            </h1>
            <p className="text-sm sm:text-base text-slate-600">
              Professional workflow practices and office fundamentals
            </p>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
          <Badge variant="outline" className="px-3 py-1 text-sm">
            <span className="font-semibold text-green-600">{totalCompleted}</span>
            <span className="mx-1 text-slate-400">/</span>
            <span className="text-slate-600">{totalChallenges}</span>
            <span className="ml-1 text-slate-500">Completed</span>
          </Badge>
          <Badge variant="outline" className="px-3 py-1 text-sm">
            <span className="text-slate-600">1 Tier Available</span>
          </Badge>
        </div>
      </div>

      {/* Info Banner */}
      <div className="rounded-lg bg-slate-50 border border-orange-200 p-4 sm:p-5 md:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">
          Master Professional Workflows
        </h2>
        <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
          Learn essential software engineering practices including{' '}
          <strong>Git workflows</strong>, <strong>code reviews</strong>,{' '}
          <strong>merge conflict resolution</strong>, <strong>documentation</strong>, and{' '}
          <strong>professional communication</strong>. These challenges mirror real-world
          office scenarios that every developer encounters daily.
        </p>
      </div>

      {/* Tier Card */}
      <div className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Challenges</h2>

        <Suspense fallback={<TierCardLoading />}>
          <TierCardContent />
        </Suspense>
      </div>
    </div>
  );
}

// Server component to load challenges
async function TierCardContent() {
  // Check user's subscription status
  const hasPaidSubscription = await hasActiveSubscription();

  // Load challenges for software engineering essentials tier
  const tierData = await getChallengesByTier('software-engineering-essentials');

  return (
    <div className="grid gap-6">
      <TierCard
        tierStats={tierData.tierInfo}
        challenges={tierData.challenges}
        hasActiveSubscription={hasPaidSubscription}
      />
    </div>
  );
}

// Loading skeleton for tier card
function TierCardLoading() {
  return (
    <div className="h-64 rounded-lg border-2 border-slate-200 bg-slate-50 animate-pulse" />
  );
}
