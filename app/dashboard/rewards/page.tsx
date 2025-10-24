import { Suspense } from 'react';
import { getMerchItems, getUserPoints } from '@/app/actions/rewards';
import { RewardsClient } from '@/components/rewards/rewards-client';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata = {
  title: 'Rewards Store | QodeBench',
  description: 'Redeem your points for exclusive QodeBench merchandise',
};

export default async function RewardsPage() {
  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Rewards Store</h1>
        <p className="text-muted-foreground">
          Redeem your points for exclusive QodeBench merchandise
        </p>
      </div>

      <Suspense fallback={<RewardsSkeleton />}>
        <RewardsContent />
      </Suspense>
    </div>
  );
}

async function RewardsContent() {
  const [merchItems, userPoints] = await Promise.all([
    getMerchItems(),
    getUserPoints(),
  ]);

  return <RewardsClient initialMerchItems={merchItems} initialUserPoints={userPoints} />;
}

function RewardsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-24 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-96 w-full" />
        ))}
      </div>
    </div>
  );
}
