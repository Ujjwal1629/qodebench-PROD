import { Suspense } from 'react';
import { getLeaderboard, getUserRank } from '@/app/actions/leaderboard';
import { LeaderboardClient } from '@/components/leaderboard/leaderboard-client';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata = {
  title: 'Leaderboard | QodeBench',
  description: 'Compete with developers worldwide and climb the ranks',
};

export default async function LeaderboardPage() {
  return (
    <div className="container max-w-7xl mx-auto py-6 sm:py-8 px-4">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Leaderboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Compete with developers worldwide and climb the ranks
        </p>
      </div>

      <Suspense fallback={<LeaderboardSkeleton />}>
        <LeaderboardContent />
      </Suspense>
    </div>
  );
}

async function LeaderboardContent() {
  const [allTimeLeaderboard, weeklyLeaderboard, userRank] = await Promise.all([
    getLeaderboard('all-time', 100),
    getLeaderboard('weekly', 100),
    getUserRank('all-time'),
  ]);

  return (
    <LeaderboardClient
      initialAllTimeData={allTimeLeaderboard}
      initialWeeklyData={weeklyLeaderboard}
      initialUserRank={userRank}
    />
  );
}

function LeaderboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
      <Skeleton className="h-32 w-full" />
      <div className="space-y-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    </div>
  );
}
