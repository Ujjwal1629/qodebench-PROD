import { ChallengeTier } from './dashboard';

/**
 * TIER-SPECIFIC FREE CHALLENGE LIMITS
 * Defines how many challenges in each tier are free for non-subscribers
 */
export const FREE_CHALLENGES_PER_TIER: Record<ChallengeTier, number> = {
  beginner: 30, // All beginner challenges are free
  intermediate: 5,
  'software-engineering-essentials': 5, // Renamed from office-workflow
  advanced: 2, // Advanced tier: only first 2 are free
  'product-planning': 0, // Coming soon - no challenges yet
} as const;
