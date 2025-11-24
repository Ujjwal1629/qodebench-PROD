import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getUserSubscription } from '@/lib/utils/subscription-check';
import { SubscriptionManager } from '@/components/settings/subscription-manager';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata = {
  title: 'Subscription Settings | QodeBench',
  description: 'Manage your subscription and billing',
};

export default async function SubscriptionPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/signin');
  }

  const subscription = await getUserSubscription(user.id);

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Subscription Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your subscription, billing, and usage limits
        </p>
      </div>

      <Suspense fallback={<SubscriptionSkeleton />}>
        <SubscriptionManager subscription={subscription} userId={user.id} />
      </Suspense>
    </div>
  );
}

function SubscriptionSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-64" />
      <Skeleton className="h-48" />
      <Skeleton className="h-32" />
    </div>
  );
}
