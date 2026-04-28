import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatTime, truncate } from '@/lib/utils/format';
import { cn } from '@/lib/utils';
import {
  DIFFICULTY_COLORS,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
} from '@/lib/constants/dashboard';
import { Clock, Sparkles, CheckCircle2, PlayCircle } from 'lucide-react';
import { ChallengeWithProgress } from '@/app/actions/challenges';

interface ChallengeCardProps {
  challenge: ChallengeWithProgress & {
    is_free_tier_accessible?: boolean;
    order_in_tier?: number | null;
  };
  hasActiveSubscription?: boolean;
}

export function ChallengeCard({ challenge, hasActiveSubscription = false }: ChallengeCardProps) {
  const userProgress = challenge.userProgress;
  const isCompleted = userProgress?.status === 'completed';
  const isInProgress = userProgress?.status === 'in_progress';

  // Determine button text and variant
  const getButtonConfig = () => {
    if (isCompleted) {
      return {
        text: 'View Solution',
        variant: 'outline' as const,
        icon: <CheckCircle2 className="h-4 w-4 mr-2" />,
      };
    }
    if (isInProgress) {
      return {
        text: 'Continue',
        variant: 'default' as const,
        icon: <PlayCircle className="h-4 w-4 mr-2" />,
      };
    }
    return {
      text: 'Start Challenge',
      variant: 'default' as const,
      icon: null,
    };
  };

  const buttonConfig = getButtonConfig();

  return (
    <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
      <CardContent className="p-4 sm:p-6 h-full flex flex-col">
        <div className="space-y-3 sm:space-y-4 flex-1 flex flex-col">
          {/* Badges Row */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <Badge
              variant="outline"
              className={cn(
                'text-xs',
                CATEGORY_COLORS[
                  challenge.category as keyof typeof CATEGORY_COLORS
                ]
              )}
            >
              {
                CATEGORY_LABELS[
                  challenge.category as keyof typeof CATEGORY_LABELS
                ]
              }
            </Badge>
            <Badge
              variant="outline"
              className={cn(
                'text-xs',
                DIFFICULTY_COLORS[
                  challenge.difficulty as keyof typeof DIFFICULTY_COLORS
                ]
              )}
            >
              {challenge.difficulty.charAt(0).toUpperCase() +
                challenge.difficulty.slice(1)}
            </Badge>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-slate-900 line-clamp-2 text-base sm:text-lg leading-tight">
            {challenge.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-slate-600 line-clamp-2 flex-1">
            {challenge.description
              ? truncate(challenge.description.replace(/[#*`_~]/g, ''), 100)
              : 'No description available'}
          </p>

          {/* Footer Info */}
          <div className="space-y-3">
            {/* Points and Time */}
            <div className="flex items-center justify-between text-sm text-slate-600">
              <div className="flex items-center gap-1">
                <Sparkles className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">{challenge.points} points</span>
              </div>
              {challenge.estimated_time && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatTime(challenge.estimated_time)}</span>
                </div>
              )}
            </div>

            {/* Progress Indicator */}
            {userProgress && (
              <div className="flex items-center justify-between text-xs text-slate-500">
                {isCompleted && (
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span className="font-medium">Completed</span>
                  </div>
                )}
                {isInProgress && (
                  <div className="flex items-center gap-1 text-blue-600">
                    <PlayCircle className="h-3.5 w-3.5" />
                    <span className="font-medium">In Progress</span>
                  </div>
                )}
                <span className="ml-auto">
                  {userProgress.attempts}{' '}
                  {userProgress.attempts === 1 ? 'attempt' : 'attempts'}
                </span>
              </div>
            )}

            {/* CTA Button */}
            <Button
              asChild
              variant={buttonConfig.variant}
              className="w-full"
              size="sm"
            >
              <Link href={`/dashboard/challenges/${challenge.slug}`}>
                {buttonConfig.icon}
                {buttonConfig.text}
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
