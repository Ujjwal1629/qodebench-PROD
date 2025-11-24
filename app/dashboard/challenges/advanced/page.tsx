import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getTierProgress, getChallengesByTier } from '@/app/actions/challenges';
import { TierCard } from '@/components/challenges/tier-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Rocket, ChevronLeft } from 'lucide-react';
import { hasActiveSubscription } from '@/lib/utils/subscription-check';

export const metadata: Metadata = {
  title: 'Advanced Challenges | QodeBench',
  description: 'Full simulations and real-world scenarios',
};

export default async function AdvancedChallengesPage() {
  // Fetch tier progress
  const tierProgress = await getTierProgress();
  const currentTier = tierProgress.find((t) => t.tier === 'advanced');

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
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="rounded-lg bg-purple-100 p-1.5 sm:p-2">
            <Rocket className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              🚀 Advanced Challenges
            </h1>
            <p className="text-sm sm:text-base text-slate-600">
              Full simulations and real-world scenarios
            </p>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="flex flex-wrap items-center gap-3">
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
      <div className="rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 p-4 sm:p-5 md:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-2 flex items-center gap-2">
          💡 Elite Developer Skills
        </h2>
        <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
          These challenges simulate <strong>complete real-world scenarios</strong> that senior
          developers face daily. Expect <strong>complex debugging</strong>,{' '}
          <strong>system architecture</strong>, <strong>performance optimization</strong>, and{' '}
          <strong>end-to-end feature development</strong>. Only the first 2 challenges are free
          for trial users.
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

  // Load challenges for advanced tier
  const tierData = await getChallengesByTier('advanced');

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
