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
  ChallengeTier,
} from '@/lib/constants/dashboard';
import { Clock, Sparkles, CheckCircle2, PlayCircle, Lock, Crown } from 'lucide-react';
import { ChallengeWithProgress } from '@/app/actions/challenges';
import { FREE_CHALLENGES_PER_TIER } from '@/lib/constants/subscription';

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
  const isNotStarted = !userProgress;

  // TIER-SPECIFIC POSITION-BASED PREMIUM CHECK
  // Each tier has different free challenge limits (Advanced: 2, Others: 5)
  const tier = challenge.tier as ChallengeTier;
  const freeLimit = FREE_CHALLENGES_PER_TIER[tier] || 5;
  const orderInTier = challenge.order_in_tier || 0;
  const isPremiumPosition = orderInTier > freeLimit;
  const requiresPremium = isPremiumPosition && !challenge.is_free_tier_accessible;

  // Challenge is locked if it requires premium and user doesn't have subscription
  const isLocked = requiresPremium && !hasActiveSubscription;

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
    <Card className={`h-full transition-all duration-200 ${
      isLocked
        ? 'border-slate-300 bg-gradient-to-br from-slate-50 to-slate-100 opacity-75'
        : requiresPremium
          ? 'border-primary/30 bg-gradient-to-br from-background to-primary/5 hover:shadow-lg hover:-translate-y-1'
          : 'hover:shadow-lg hover:-translate-y-1'
    }`}>
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
            {requiresPremium && (
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">
                <Crown className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">Premium</span>
                <span className="sm:hidden">Pro</span>
              </Badge>
            )}
            {isLocked && (
              <Badge variant="secondary" className="bg-slate-200 text-slate-700 border-slate-300 text-xs">
                <Lock className="h-3 w-3 mr-1" />
                Locked
              </Badge>
            )}
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
            {isLocked ? (
              <Button
                asChild
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                size="sm"
              >
                <Link href={`/dashboard/challenges/${challenge.slug}`}>
                  <Lock className="h-4 w-4 mr-2" />
                  Unlock Premium
                </Link>
              </Button>
            ) : (
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
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
