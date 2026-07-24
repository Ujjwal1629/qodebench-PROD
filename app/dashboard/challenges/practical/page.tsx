import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getTierProgress, getChallengesByTier } from '@/app/actions/challenges';
import { PracticalChallengesTabs } from '@/components/challenges/practical-challenges-tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code2, ChevronLeft } from 'lucide-react';
import { hasActiveSubscription } from '@/lib/utils/subscription-check';

export const metadata: Metadata = {
  title: 'Practical Coding Challenges | QodeBench',
  description: 'Master coding fundamentals through beginner to intermediate challenges',
};

export default async function PracticalChallengesPage() {
  // Fetch tier progress for beginner and intermediate
  const tierProgress = await getTierProgress();
  const beginnerTier = tierProgress.find((t) => t.tier === 'beginner');
  const intermediateTier = tierProgress.find((t) => t.tier === 'intermediate');

  const totalCompleted = (beginnerTier?.completed || 0) + (intermediateTier?.completed || 0);
  const totalChallenges = (beginnerTier?.total || 0) + (intermediateTier?.total || 0);

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
            <Code2 className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Practical Coding Challenges
            </h1>
            <p className="text-sm sm:text-base text-slate-600">
              Master coding fundamentals through beginner to intermediate challenges
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
            <span className="text-slate-600">2 Tiers Available</span>
          </Badge>
        </div>
      </div>

      {/* Info Banner */}
      <div className="rounded-lg bg-slate-50 border border-blue-200 p-4 sm:p-5 md:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">
          Your Coding Journey
        </h2>
        <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
          Choose <strong>Beginner</strong> to master coding basics (all 10 challenges free!)
          or advance to <strong>Intermediate</strong> for real-world feature development.
          Use the tabs below to switch between difficulty levels.
        </p>
      </div>

      {/* Tier Cards */}
      <div className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Challenge Tiers</h2>

        <Suspense fallback={<TierCardsLoading />}>
          <TierCards />
        </Suspense>
      </div>
    </div>
  );
}

// Server component to load challenges for each tier
async function TierCards() {
  // Check user's subscription status
  const hasPaidSubscription = await hasActiveSubscription();

  // Load challenges for beginner and intermediate tiers
  const [beginnerData, intermediateData] = await Promise.all([
    getChallengesByTier('beginner'),
    getChallengesByTier('intermediate'),
  ]);

  return (
    <PracticalChallengesTabs
      beginnerData={beginnerData}
      intermediateData={intermediateData}
      hasActiveSubscription={hasPaidSubscription}
    />
  );
}

// Loading skeleton for tier cards
function TierCardsLoading() {
  return (
    <div className="grid gap-6">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="h-64 rounded-lg border-2 border-slate-200 bg-slate-50 animate-pulse"
        />
      ))}
    </div>
  );
}
