import { ChallengeCard } from './challenge-card';
import { ChallengeWithProgress } from '@/app/actions/challenges';
import { Card, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';

interface ChallengesGridProps {
  challenges: ChallengeWithProgress[];
  isLoading?: boolean;
}

export function ChallengesGrid({
  challenges,
  isLoading = false,
}: ChallengesGridProps) {
  // Loading skeleton
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="h-[280px]">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="flex gap-2">
                  <div className="h-5 w-16 rounded bg-slate-200" />
                  <div className="h-5 w-16 rounded bg-slate-200" />
                </div>
                <div className="h-6 w-full rounded bg-slate-200" />
                <div className="space-y-2">
                  <div className="h-4 w-full rounded bg-slate-200" />
                  <div className="h-4 w-2/3 rounded bg-slate-200" />
                </div>
                <div className="flex justify-between">
                  <div className="h-4 w-20 rounded bg-slate-200" />
                  <div className="h-4 w-16 rounded bg-slate-200" />
                </div>
                <div className="h-9 w-full rounded bg-slate-200" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Empty state
  if (challenges.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 rounded-full bg-slate-100 p-4">
            <Search className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-slate-900">
            No challenges found
          </h3>
          <p className="mb-4 max-w-sm text-sm text-slate-600">
            We couldn&apos;t find any challenges matching your filters. Try
            adjusting your search criteria.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Challenges grid
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {challenges.map((challenge) => (
        <ChallengeCard key={challenge.id} challenge={challenge} />
      ))}
    </div>
  );
}
