'use client';

import { useState } from 'react';
import { TierCard } from '@/components/challenges/tier-card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { TierProgressStats } from '@/app/actions/challenges';

interface PracticalChallengesTabsProps {
  beginnerData: {
    tierInfo: TierProgressStats;
    challenges: Array<any>;
  };
  intermediateData: {
    tierInfo: TierProgressStats;
    challenges: Array<any>;
  };
  hasActiveSubscription: boolean;
}

export function PracticalChallengesTabs({
  beginnerData,
  intermediateData,
  hasActiveSubscription,
}: PracticalChallengesTabsProps) {
  const [activeTab, setActiveTab] = useState<'beginner' | 'intermediate'>('beginner');

  return (
    <div className="w-full space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('beginner')}
          className={cn(
            'flex items-center gap-2 px-4 sm:px-6 py-3 text-sm font-medium transition-all relative',
            'hover:text-slate-900',
            activeTab === 'beginner'
              ? 'text-primary border-b-2 border-primary'
              : 'text-slate-600'
          )}
        >
          <span className="text-lg">🌱</span>
          <span>Beginner</span>
          <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs hidden sm:inline-flex">
            All Free
          </Badge>
        </button>

        <button
          onClick={() => setActiveTab('intermediate')}
          className={cn(
            'flex items-center gap-2 px-4 sm:px-6 py-3 text-sm font-medium transition-all relative',
            'hover:text-slate-900',
            activeTab === 'intermediate'
              ? 'text-primary border-b-2 border-primary'
              : 'text-slate-600'
          )}
        >
          <span className="text-lg">🚀</span>
          <span>Intermediate</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'beginner' && (
          <TierCard
            tierStats={beginnerData.tierInfo}
            challenges={beginnerData.challenges}
            hasActiveSubscription={hasActiveSubscription}
          />
        )}

        {activeTab === 'intermediate' && (
          <TierCard
            tierStats={intermediateData.tierInfo}
            challenges={intermediateData.challenges}
            hasActiveSubscription={hasActiveSubscription}
          />
        )}
      </div>
    </div>
  );
}
