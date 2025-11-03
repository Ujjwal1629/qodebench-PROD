import { ChallengeTier, TIERS } from '@/lib/constants/dashboard';

// Types
export type ChallengeUnlockStatus = {
  isUnlocked: boolean;
  reason?: string;
  requiresCompletion?: {
    challengeTitle: string;
    challengeSlug: string;
  };
  requiresTierProgress?: {
    tier: ChallengeTier;
    current: number;
    required: number;
  };
};

export type Challenge = {
  id: string;
  slug: string;
  title: string;
  tier: ChallengeTier;
  order_in_tier: number;
  unlock_requirement_type: 'none' | 'previous' | 'tier_completion';
  unlock_requirement_count?: number;
  previous_challenge_id?: string | null;
};

export type UserProgress = {
  challenge_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
};

/**
 * Check if a specific challenge is unlocked for the user
 */
export function isChallengeUnlocked(
  challenge: Challenge,
  allChallenges: Challenge[],
  userProgress: UserProgress[]
): ChallengeUnlockStatus {
  // No unlock requirement - always unlocked (first challenge in tier)
  if (challenge.unlock_requirement_type === 'none') {
    return { isUnlocked: true };
  }

  // Previous challenge requirement - need to complete specific previous challenge
  if (challenge.unlock_requirement_type === 'previous') {
    if (!challenge.previous_challenge_id) {
      return { isUnlocked: true }; // No previous challenge specified, unlock by default
    }

    const previousChallenge = allChallenges.find(
      (c) => c.id === challenge.previous_challenge_id
    );

    if (!previousChallenge) {
      return { isUnlocked: false, reason: 'Previous challenge not found' };
    }

    const previousProgress = userProgress.find(
      (p) => p.challenge_id === challenge.previous_challenge_id
    );

    const isPreviousCompleted = previousProgress?.status === 'completed';

    if (!isPreviousCompleted) {
      return {
        isUnlocked: false,
        reason: `Complete the previous challenge first`,
        requiresCompletion: {
          challengeTitle: previousChallenge.title,
          challengeSlug: previousChallenge.slug,
        },
      };
    }

    return { isUnlocked: true };
  }

  // Tier completion requirement - need to complete X challenges from previous tier
  if (challenge.unlock_requirement_type === 'tier_completion') {
    const requiredCount = challenge.unlock_requirement_count || 0;
    const tierInfo = TIERS[challenge.tier];
    const previousTier = tierInfo.unlockRequirement.previousTier;

    if (!previousTier) {
      return { isUnlocked: true }; // No previous tier, unlock by default
    }

    // Get all challenges from previous tier
    const previousTierChallenges = allChallenges.filter(
      (c) => c.tier === previousTier
    );

    // Count completed challenges in previous tier
    const completedCount = previousTierChallenges.filter((c) => {
      const progress = userProgress.find((p) => p.challenge_id === c.id);
      return progress?.status === 'completed';
    }).length;

    if (completedCount < requiredCount) {
      return {
        isUnlocked: false,
        reason: `Complete ${requiredCount} ${TIERS[previousTier].name} challenges to unlock this tier`,
        requiresTierProgress: {
          tier: previousTier,
          current: completedCount,
          required: requiredCount,
        },
      };
    }

    return { isUnlocked: true };
  }

  return { isUnlocked: false, reason: 'Unknown unlock requirement type' };
}

/**
 * Get all unlocked challenges for a user
 */
export function getUnlockedChallenges(
  allChallenges: Challenge[],
  userProgress: UserProgress[]
): Challenge[] {
  return allChallenges.filter((challenge) => {
    const status = isChallengeUnlocked(challenge, allChallenges, userProgress);
    return status.isUnlocked;
  });
}

/**
 * Get next unlocked challenge in a tier
 */
export function getNextChallengeInTier(
  tier: ChallengeTier,
  allChallenges: Challenge[],
  userProgress: UserProgress[]
): Challenge | null {
  // Get all challenges in tier, sorted by order
  const tierChallenges = allChallenges
    .filter((c) => c.tier === tier)
    .sort((a, b) => a.order_in_tier - b.order_in_tier);

  // Find first unlocked challenge that's not completed
  for (const challenge of tierChallenges) {
    const progress = userProgress.find((p) => p.challenge_id === challenge.id);
    const isCompleted = progress?.status === 'completed';

    if (!isCompleted) {
      const unlockStatus = isChallengeUnlocked(
        challenge,
        allChallenges,
        userProgress
      );
      if (unlockStatus.isUnlocked) {
        return challenge;
      }
    }
  }

  return null; // All challenges completed or locked
}

/**
 * Get completion stats by tier
 */
export function getCompletionStatsByTier(
  allChallenges: Challenge[],
  userProgress: UserProgress[]
): Record<ChallengeTier, { completed: number; total: number }> {
  const stats: Record<ChallengeTier, { completed: number; total: number }> = {
    beginner: { completed: 0, total: 0 },
    intermediate: { completed: 0, total: 0 },
    'office-workflow': { completed: 0, total: 0 },
    advanced: { completed: 0, total: 0 },
  };

  allChallenges.forEach((challenge) => {
    const tier = challenge.tier;
    if (tier && stats[tier]) {
      stats[tier].total += 1;

      const progress = userProgress.find((p) => p.challenge_id === challenge.id);
      if (progress?.status === 'completed') {
        stats[tier].completed += 1;
      }
    }
  });

  return stats;
}

/**
 * Check if completing a challenge unlocks new tier
 */
export function checkTierUnlock(
  completedChallenge: Challenge,
  allChallenges: Challenge[],
  userProgress: UserProgress[]
): { tierUnlocked: ChallengeTier | null; message?: string } {
  // Get updated stats after this completion
  const stats = getCompletionStatsByTier(allChallenges, [
    ...userProgress,
    { challenge_id: completedChallenge.id, status: 'completed' },
  ]);

  const currentTier = completedChallenge.tier;
  const tierInfo = TIERS[currentTier];

  // Check if this completion unlocks the next tier
  // Find the next tier that requires completion of current tier
  const nextTierEntry = Object.entries(TIERS).find(
    ([_, info]) =>
      info.unlockRequirement.type === 'tier_completion' &&
      info.unlockRequirement.previousTier === currentTier
  );

  if (nextTierEntry) {
    const [nextTierId, nextTierInfo] = nextTierEntry as [ChallengeTier, typeof tierInfo];
    const requiredCount = nextTierInfo.unlockRequirement.requiredCount || 0;
    const completedCount = stats[currentTier].completed;

    if (completedCount === requiredCount) {
      return {
        tierUnlocked: nextTierId,
        message: `🎉 You've unlocked ${nextTierInfo.name} tier!`,
      };
    }
  }

  return { tierUnlocked: null };
}

/**
 * Get progress percentage for a tier
 */
export function getTierProgressPercentage(
  tier: ChallengeTier,
  completed: number,
  total: number
): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}
