'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Lock, Unlock, ChevronDown, ChevronUp, CheckCircle2, Circle, PlayCircle, ChevronRight } from 'lucide-react';
import { TierProgressStats } from '@/app/actions/challenges';
import { cn } from '@/lib/utils';
import { FREE_CHALLENGES_PER_TIER } from '@/lib/constants/subscription';

interface TierCardProps {
  tierStats: TierProgressStats;
  challenges?: Array<{
    id: string;
    slug: string;
    title: string;
    order_in_tier: number;
    isUnlocked: boolean;
    unlockReason?: string;
    is_free_tier_accessible?: boolean;
    userProgress?: {
      status: 'not_started' | 'in_progress' | 'completed';
      attempts: number;
    } | null;
  }>;
  onUnlock?: () => void;
  hasActiveSubscription?: boolean;
}

export function TierCard({ tierStats, challenges, onUnlock, hasActiveSubscription = false }: TierCardProps) {
  // Check if tier has any free-accessible challenges first (used for initial expand state)
  const hasFreeAccessibleChallenges = challenges?.some((c) => c.is_free_tier_accessible) || false;

  // Expand by default if tier is unlocked OR has free challenges
  const [isExpanded, setIsExpanded] = useState(
    (tierStats.isUnlocked && tierStats.percentage < 100) || hasFreeAccessibleChallenges
  );

  // Track which challenge is expanded on mobile
  const [expandedChallengeId, setExpandedChallengeId] = useState<string | null>(null);

  const {
    tier,
    name,
    description,
    icon,
    completed,
    total,
    percentage,
    isUnlocked,
    unlockRequirement,
    nextChallenge,
  } = tierStats;

  // Determine card state
  const isCompleted = completed === total && total > 0;
  const canUnlock = !isUnlocked && unlockRequirement?.includes('Complete');

  return (
    <Card
      className={cn(
        'transition-all duration-300',
        isUnlocked
          ? 'border-2 hover:shadow-lg'
          : hasFreeAccessibleChallenges
          ? 'border-2 border-blue-200 hover:shadow-lg' // Tier has free challenges
          : 'border-dashed opacity-75 hover:opacity-90', // Fully locked
        isCompleted && 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300'
      )}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          {/* Tier Icon & Info */}
          <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
            <div
              className={cn(
                'text-3xl sm:text-4xl w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-xl flex-shrink-0',
                isUnlocked
                  ? 'bg-white shadow-sm'
                  : hasFreeAccessibleChallenges
                  ? 'bg-white shadow-sm'
                  : 'bg-slate-100'
              )}
            >
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 truncate">{name}</h3>
                {isCompleted && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 flex-shrink-0">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    <span className="hidden sm:inline">Completed</span>
                    <span className="sm:hidden">Done</span>
                  </Badge>
                )}
                {!isUnlocked && !hasFreeAccessibleChallenges && (
                  <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-300 flex-shrink-0">
                    <Lock className="h-3 w-3 mr-1" />
                    Locked
                  </Badge>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 line-clamp-2">{description}</p>
            </div>
          </div>

          {/* Lock/Unlock Icon */}
          <div className={cn(
            'p-1.5 sm:p-2 rounded-lg flex-shrink-0',
            isUnlocked
              ? 'bg-green-50'
              : hasFreeAccessibleChallenges
              ? 'bg-blue-50'
              : 'bg-slate-100'
          )}>
            {isUnlocked ? (
              <Unlock className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            ) : hasFreeAccessibleChallenges ? (
              <Unlock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            ) : (
              <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        {isUnlocked && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">
                Progress: {completed}/{total}
              </span>
              <span className="font-semibold text-slate-900">{percentage}%</span>
            </div>
            <Progress value={percentage} className="h-2" />
          </div>
        )}

        {/* Unlock Requirement - REMOVED: All tiers should be accessible without unlock requirements */}
        {/* {!isUnlocked && unlockRequirement && !hasFreeAccessibleChallenges && (
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
            <div className="flex items-start gap-2">
              <Lock className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-amber-900 mb-1">Unlock Requirement</p>
                <p className="text-amber-700">{unlockRequirement}</p>
              </div>
            </div>
          </div>
        )} */}

        {/* Next Challenge (for unlocked tiers) */}
        {isUnlocked && nextChallenge && !isCompleted && (
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="text-xs font-medium text-blue-700 mb-1">Next Challenge</p>
                <p className="text-sm font-semibold text-blue-900">{nextChallenge.title}</p>
              </div>
              <Button asChild size="sm" className="flex-shrink-0">
                <Link href={`/dashboard/challenges/${nextChallenge.slug}`}>
                  <PlayCircle className="h-4 w-4 mr-1" />
                  Start
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* Expand/Collapse for unlocked tiers OR tiers with free challenges */}
        {(isUnlocked || hasFreeAccessibleChallenges) && challenges && challenges.length > 0 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full justify-between"
            >
              <span className="font-medium">
                {isExpanded ? 'Hide' : 'Show'} Challenges ({challenges.length})
              </span>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>

            {/* Challenges List */}
            {isExpanded && (
              <div className="space-y-2 pt-2 border-t">
                {challenges.map((challenge, index) => {
                  const isCompleted = challenge.userProgress?.status === 'completed';
                  const isInProgress = challenge.userProgress?.status === 'in_progress';
                  const isLocked = !challenge.isUnlocked;
                  const isFreeAccessible = challenge.is_free_tier_accessible;

                  // TIER-SPECIFIC POSITION-BASED PREMIUM CHECK
                  // Each tier has different free limits (Advanced: 2, Others: 5)
                  const freeLimit = FREE_CHALLENGES_PER_TIER[tier] || 5;
                  const isPremiumPosition = challenge.order_in_tier > freeLimit;
                  const requiresSubscription = isPremiumPosition && !isFreeAccessible;
                  const isSubscriptionLocked = requiresSubscription && !hasActiveSubscription;
                  const isMobileExpanded = expandedChallengeId === challenge.id;

                  return (
                    <div
                      key={challenge.id}
                      className={cn(
                        'rounded-lg border transition-all',
                        isCompleted && 'bg-green-50 border-green-200',
                        isInProgress && 'bg-blue-50 border-blue-200',
                        isSubscriptionLocked && 'bg-amber-50 border-amber-200 hover:border-amber-300',
                        !isCompleted && !isInProgress && isLocked && !isSubscriptionLocked && 'bg-slate-50 border-slate-200 opacity-60',
                        !isCompleted && !isInProgress && !isLocked && !isSubscriptionLocked && 'bg-white border-slate-200 hover:border-slate-300'
                      )}
                    >
                      {/* Main Row - Clickable on mobile to expand */}
                      <div
                        className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 cursor-pointer sm:cursor-default"
                        onClick={() => setExpandedChallengeId(isMobileExpanded ? null : challenge.id)}
                      >
                        {/* Challenge Status Icon */}
                        <div className="flex-shrink-0">
                          {isSubscriptionLocked ? (
                            <Lock className="h-4 w-4 text-amber-600" />
                          ) : isLocked ? (
                            <Lock className="h-4 w-4 text-slate-400" />
                          ) : isCompleted ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : isInProgress ? (
                            <PlayCircle className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Circle className="h-4 w-4 text-slate-400" />
                          )}
                        </div>

                        {/* Challenge Title */}
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <p className={cn(
                              'text-xs sm:text-sm font-medium flex-1',
                              isMobileExpanded ? '' : 'truncate',
                              (isLocked || isSubscriptionLocked) && 'text-slate-500'
                            )}>
                              {index + 1}. {challenge.title}
                            </p>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              {isFreeAccessible && tier !== 'beginner' && challenge.order_in_tier <= freeLimit && (
                                <Badge variant="outline" className="text-[10px] sm:text-xs py-0 px-1 sm:px-1.5 bg-green-50 text-green-700 border-green-200">
                                  Free
                                </Badge>
                              )}
                              {requiresSubscription && (
                                <Badge variant="outline" className="text-[10px] sm:text-xs py-0 px-1 sm:px-1.5 bg-amber-50 text-amber-700 border-amber-200">
                                  Pro
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Desktop Action Button - Hidden on mobile */}
                        <div className="hidden sm:block">
                          {isSubscriptionLocked ? (
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="flex-shrink-0 border-amber-600 text-amber-700 hover:bg-amber-600 hover:text-white"
                            >
                              <Link href={`/dashboard/challenges/${challenge.slug}`}>
                                Upgrade
                              </Link>
                            </Button>
                          ) : !isLocked && (
                            <Button
                              asChild
                              variant={isCompleted ? 'outline' : 'default'}
                              size="sm"
                              className="flex-shrink-0"
                            >
                              <Link href={`/dashboard/challenges/${challenge.slug}`}>
                                {isCompleted ? 'Review' : isInProgress ? 'Continue' : 'Start'}
                              </Link>
                            </Button>
                          )}
                        </div>

                        {/* Mobile expand indicator */}
                        <div className="sm:hidden flex-shrink-0">
                          <ChevronRight className={cn(
                            'h-4 w-4 text-slate-400 transition-transform',
                            isMobileExpanded && 'rotate-90'
                          )} />
                        </div>
                      </div>

                      {/* Mobile Expanded Section */}
                      {isMobileExpanded && (
                        <div className="sm:hidden px-2 pb-2 pt-0 border-t border-slate-100">
                          <div className="pt-2 flex flex-col gap-2">
                            {/* Show unlock requirement or subscription message */}
                            {isSubscriptionLocked ? (
                              <p className="text-xs text-amber-700">Upgrade to unlock premium challenges</p>
                            ) : challenge.unlockReason && !isFreeAccessible && (
                              <p className="text-xs text-slate-500">{challenge.unlockReason}</p>
                            )}
                            {/* Mobile Action Button */}
                            {isSubscriptionLocked ? (
                              <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="w-full border-amber-600 text-amber-700 hover:bg-amber-600 hover:text-white"
                              >
                                <Link href={`/dashboard/challenges/${challenge.slug}`}>
                                  Upgrade to Premium
                                </Link>
                              </Button>
                            ) : !isLocked ? (
                              <Button
                                asChild
                                variant={isCompleted ? 'outline' : 'default'}
                                size="sm"
                                className="w-full"
                              >
                                <Link href={`/dashboard/challenges/${challenge.slug}`}>
                                  {isCompleted ? 'Review Challenge' : isInProgress ? 'Continue Challenge' : 'Start Challenge'}
                                </Link>
                              </Button>
                            ) : (
                              <p className="text-xs text-slate-500 italic">Complete previous challenges to unlock</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* CTA Button */}
        {!isUnlocked && canUnlock && onUnlock && (
          <Button onClick={onUnlock} className="w-full" size="lg">
            <Unlock className="h-4 w-4 mr-2" />
            Unlock {name} Tier
          </Button>
        )}

        {isUnlocked && isCompleted && (
          <div className="text-center py-2">
            <p className="text-sm font-medium text-green-700">
              🎉 Tier Completed! All challenges mastered!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
