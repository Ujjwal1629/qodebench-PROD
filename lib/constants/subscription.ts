import { ChallengeTier } from './dashboard';

/**
 * TIER-SPECIFIC FREE CHALLENGE LIMITS
 * Defines how many challenges in each tier are free for non-subscribers
 */
export const FREE_CHALLENGES_PER_TIER: Record<ChallengeTier, number> = {
  beginner: 5,
  intermediate: 5,
  'office-workflow': 5,
  advanced: 2, // Advanced tier: only first 2 are free
} as const;
