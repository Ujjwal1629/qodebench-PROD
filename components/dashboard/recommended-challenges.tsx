'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatTime, truncate } from '@/lib/utils/format';
import { DIFFICULTY_COLORS, CATEGORY_LABELS, CATEGORY_COLORS } from '@/lib/constants/dashboard';
import { Clock, Sparkles } from 'lucide-react';
import { EmptyState } from './empty-state';
import { RecommendedChallenge } from '@/app/actions/dashboard';

interface RecommendedChallengesProps {
  challenges: RecommendedChallenge[];
}

export function RecommendedChallenges({ challenges }: RecommendedChallengesProps) {
  if (challenges.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <EmptyState
            icon={Sparkles}
            title="No recommendations yet"
            description="Complete a few challenges to get personalized recommendations"
            action={{
              label: 'Browse All Challenges',
              onClick: () => {
                window.location.href = '/dashboard/challenges';
              },
            }}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">
          Recommended for You
        </h2>
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard/challenges">View All</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {challenges.map((challenge) => (
          <Card
            key={challenge.id}
            className="transition-shadow hover:shadow-md"
          >
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className={DIFFICULTY_COLORS[challenge.difficulty]}
                  >
                    {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={
                      CATEGORY_COLORS[challenge.category as keyof typeof CATEGORY_COLORS]
                    }
                  >
                    {CATEGORY_LABELS[challenge.category as keyof typeof CATEGORY_LABELS]}
                  </Badge>
                </div>

                {/* Title */}
                <h3 className="font-semibold text-slate-900 line-clamp-2">
                  {challenge.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-600 line-clamp-3">
                  {challenge.description ? truncate(challenge.description.replace(/[#*`_~]/g, ''), 120) : 'No description available'}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <Sparkles className="h-4 w-4" />
                    <span>{challenge.points} points</span>
                  </div>
                  {challenge.estimatedTime && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatTime(challenge.estimatedTime)}</span>
                    </div>
                  )}
                </div>

                {/* CTA */}
                <Button asChild className="w-full">
                  <Link href={`/challenges/${challenge.slug}`}>Start Challenge</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
