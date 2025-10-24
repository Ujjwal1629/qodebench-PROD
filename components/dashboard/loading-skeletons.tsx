import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Stats cards skeleton (4 cards grid)
export function StatsCardsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </div>
              <Skeleton className="h-12 w-12 rounded-lg" />
            </div>
            <Skeleton className="h-4 w-32 mt-4" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Recent activity table skeleton
export function RecentActivitySkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-3">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-4 w-12 ml-4" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Challenge cards skeleton (3 cards)
export function ChallengeCardsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-16 w-full" />
              <div className="flex items-center justify-between pt-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Single card skeleton
export function CardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-3">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </CardContent>
    </Card>
  );
}

// Experience progress skeleton
export function ExperienceProgressSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <Skeleton className="h-3 w-full rounded-full" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-9 w-32 rounded-md" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Full dashboard skeleton
export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>

      {/* Stats cards */}
      <StatsCardsSkeleton />

      {/* Experience progress */}
      <ExperienceProgressSkeleton />

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>

      {/* Recent activity */}
      <RecentActivitySkeleton />

      {/* Recommended challenges */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <ChallengeCardsSkeleton />
      </div>
    </div>
  );
}
