import { Suspense } from 'react';
import { Metadata } from 'next';
import { getTierProgress, getChallengesByTier } from '@/app/actions/challenges';
import { TierCard } from '@/components/challenges/tier-card';
import { Badge } from '@/components/ui/badge';
import { Code2, Sparkles } from 'lucide-react';
import { TIER_ORDER } from '@/lib/constants/dashboard';
import { hasActiveSubscription } from '@/lib/utils/subscription-check';

export const metadata: Metadata = {
  title: 'Challenges | QodeBench',
  description: 'Progress through tiers and master full-stack web development',
};

export default async function ChallengesPage() {
  // Fetch tier progress
  const tierProgress = await getTierProgress();

  // Calculate total stats
  const totalCompleted = tierProgress.reduce((sum, tier) => sum + tier.completed, 0);
  const totalChallenges = tierProgress.reduce((sum, tier) => sum + tier.total, 0);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="rounded-lg bg-blue-100 p-1.5 sm:p-2">
            <Code2 className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Challenges</h1>
            <p className="text-sm sm:text-base text-slate-600">
              Progress through tiers and master full-stack web development
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
            <Sparkles className="h-3 w-3 mr-1 text-yellow-600" />
            <span className="text-slate-600">{tierProgress.filter(t => t.isUnlocked).length}/4 Tiers Unlocked</span>
          </Badge>
        </div>
      </div>

      {/* Progressive Learning Path Explanation */}
      <div className="rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 p-4 sm:p-5 md:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-2 flex items-center gap-2">
          🎯 Your Learning Path
        </h2>
        <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
          Progress through <strong>4 tiers</strong> of challenges: <strong>Beginner</strong> (coding basics) → <strong>Intermediate</strong> (features & bugs) → <strong>Office Workflow</strong> (professional practices) → <strong>Advanced</strong> (real-world simulations).
          Complete challenges sequentially within each tier to unlock the next!
        </p>
      </div>

      {/* Tier Cards */}
      <div className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Challenge Tiers</h2>

        <Suspense fallback={<TierCardsLoading />}>
          <TierCards tierProgress={tierProgress} />
        </Suspense>
      </div>
    </div>
  );
}

// Server component to load challenges for each tier
async function TierCards({ tierProgress }: { tierProgress: Awaited<ReturnType<typeof getTierProgress>> }) {
  // Check user's subscription status
  const hasPaidSubscription = await hasActiveSubscription();

  // Load challenges for each unlocked tier
  const tierData = await Promise.all(
    TIER_ORDER.map(async (tierId) => {
      const tier = tierProgress.find(t => t.tier === tierId);
      if (!tier) return null;

      // Only load challenges for unlocked tiers or the next tier that can be unlocked
      if (tier.isUnlocked || tier.unlockRequirement?.includes('Complete')) {
        const { challenges } = await getChallengesByTier(tierId);
        return { ...tier, challenges };
      }

      return { ...tier, challenges: [] };
    })
  );

  return (
    <div className="grid gap-6">
      {tierData.filter(Boolean).map((tier) => (
        <TierCard
          key={tier!.tier}
          tierStats={tier!}
          challenges={tier!.challenges}
          hasActiveSubscription={hasPaidSubscription}
        />
      ))}
    </div>
  );
}

// Loading skeleton for tier cards
function TierCardsLoading() {
  return (
    <div className="grid gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="h-64 rounded-lg border-2 border-slate-200 bg-slate-50 animate-pulse"
        />
      ))}
    </div>
  );
}
