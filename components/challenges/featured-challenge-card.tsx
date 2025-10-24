import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatTime } from '@/lib/utils/format';
import {
  DIFFICULTY_COLORS,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
} from '@/lib/constants/dashboard';
import { Clock, Sparkles, Calendar, Trophy } from 'lucide-react';
import { ChallengeWithProgress } from '@/app/actions/challenges';

interface FeaturedChallengeCardProps {
  challenge: ChallengeWithProgress;
}

export function FeaturedChallengeCard({
  challenge,
}: FeaturedChallengeCardProps) {
  const userProgress = challenge.userProgress;
  const isCompleted = userProgress?.status === 'completed';

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-white to-purple-50 shadow-lg overflow-hidden">
      <CardContent className="p-8">
        <div className="space-y-6">
          {/* Header with Code Friday Badge */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-600 text-white hover:bg-blue-700">
                  <Calendar className="h-3 w-3 mr-1" />
                  Code Friday
                </Badge>
                <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">
                  <Trophy className="h-3 w-3 mr-1" />
                  Featured Challenge
                </Badge>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 leading-tight">
                {challenge.title}
              </h2>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className={
                CATEGORY_COLORS[
                  challenge.category as keyof typeof CATEGORY_COLORS
                ]
              }
            >
              {
                CATEGORY_LABELS[
                  challenge.category as keyof typeof CATEGORY_LABELS
                ]
              }
            </Badge>
            <Badge
              variant="outline"
              className={
                DIFFICULTY_COLORS[
                  challenge.difficulty as keyof typeof DIFFICULTY_COLORS
                ]
              }
            >
              {challenge.difficulty.charAt(0).toUpperCase() +
                challenge.difficulty.slice(1)}
            </Badge>
          </div>

          {/* Description */}
          <p className="text-base text-slate-700 line-clamp-3">
            {challenge.description
              ? challenge.description.replace(/[#*`_~]/g, '')
              : 'No description available'}
          </p>

          {/* Stats Row */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-slate-700">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              <span className="font-semibold">{challenge.points} points</span>
            </div>
            {challenge.estimated_time && (
              <div className="flex items-center gap-2 text-slate-700">
                <Clock className="h-5 w-5 text-blue-500" />
                <span>{formatTime(challenge.estimated_time)}</span>
              </div>
            )}
            {isCompleted && (
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                Completed
              </Badge>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3 pt-2">
            <Button asChild size="lg" className="flex-1">
              <Link href={`/dashboard/challenges/${challenge.slug}`}>
                {isCompleted ? 'View Again' : 'Start Challenge'}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={`/dashboard/challenges/${challenge.slug}#details`}>
                View Details
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
