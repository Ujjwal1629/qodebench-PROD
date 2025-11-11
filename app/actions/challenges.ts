'use server';

import { createClient } from '@/lib/supabase/server';
import { Database } from '@/lib/supabase/database.types';
import { cache } from 'react';

type Challenge = Database['public']['Tables']['challenges']['Row'];

export type ChallengeFilters = {
  difficulty?: string; // Can be comma-separated for multi-select: "easy,medium"
  category?: string; // Can be comma-separated for multi-select: "python,javascript"
  searchQuery?: string;
  status?: 'all' | 'not_started' | 'in_progress' | 'completed';
  sort?: 'newest' | 'popular' | 'points' | 'difficulty';
  page?: number;
};

export type ChallengeWithProgress = Challenge & {
  userProgress?: {
    status: 'not_started' | 'in_progress' | 'completed';
    attempts: number;
  } | null;
};

/**
 * Get list of challenges with optional filters
 */
export const getChallengesList = cache(
  async (filters?: ChallengeFilters): Promise<ChallengeWithProgress[]> => {
    try {
      const supabase = await createClient();

      // Build query
      let query = supabase
        .from('challenges')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters?.difficulty) {
        const difficulties = filters.difficulty.split(',');
        if (difficulties.length === 1) {
          query = query.eq('difficulty', difficulties[0]);
        } else {
          query = query.in('difficulty', difficulties);
        }
      }

      if (filters?.category) {
        const categories = filters.category.split(',');
        if (categories.length === 1) {
          query = query.eq('category', categories[0]);
        } else {
          query = query.in('category', categories);
        }
      }

      if (filters?.searchQuery) {
        query = query.or(
          `title.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`
        );
      }

      // Apply sorting
      if (filters?.sort === 'points') {
        query = query.order('points', { ascending: false });
      } else if (filters?.sort === 'difficulty') {
        query = query.order('difficulty', { ascending: true });
      } else {
        // Default to newest
        query = query.order('created_at', { ascending: false });
      }

      const { data: challenges } = await query;

      if (!challenges) return [];

      // Get user progress if authenticated
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: progressData } = await supabase
          .from('roadmap_progress')
          .select('challenge_id, status, attempts')
          .eq('user_id', user.id);

        const progressMap = new Map(
          progressData?.map((p) => [p.challenge_id, p]) || []
        );

        return challenges.map((challenge) => ({
          ...challenge,
          userProgress: progressMap.get(challenge.id) || null,
        }));
      }

      return challenges.map((challenge) => ({
        ...challenge,
        userProgress: null,
      }));
    } catch (error) {
      console.error('Error fetching challenges list:', error);
      return [];
    }
  }
);

/**
 * Get a single challenge by ID or slug
 * SECURITY: Checks subscription access before returning challenge data
 */
export const getChallengeById = cache(
  async (idOrSlug: string): Promise<ChallengeWithProgress | null> => {
    try {
      const supabase = await createClient();

      // Try to fetch by ID first, then by slug
      let query = supabase.from('challenges').select('*').eq('is_active', true);

      // Check if it's a UUID or slug
      const isUUID =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          idOrSlug
        );

      if (isUUID) {
        query = query.eq('id', idOrSlug);
      } else {
        query = query.eq('slug', idOrSlug);
      }

      const { data: challenge } = await query.single();

      if (!challenge) return null;

      // NOTE: Tier access checks are handled in the page component
      // to show proper paywall UI instead of 404

      // Get user progress if authenticated
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: progress } = await supabase
          .from('roadmap_progress')
          .select('status, attempts')
          .eq('user_id', user.id)
          .eq('challenge_id', challenge.id)
          .single();

        return {
          ...challenge,
          userProgress: progress || null,
        };
      }

      return {
        ...challenge,
        userProgress: null,
      };
    } catch (error) {
      console.error('Error fetching challenge:', error);
      return null;
    }
  }
);

/**
 * Get weekly challenge (Code Friday)
 */
export const getWeeklyChallenge = cache(async (): Promise<Challenge | null> => {
  try {
    const supabase = await createClient();

    const { data: challenge } = await supabase
      .from('challenges')
      .select('*')
      .eq('is_weekly_challenge', true)
      .eq('is_active', true)
      .order('weekly_challenge_date', { ascending: false })
      .limit(1)
      .single();

    return challenge;
  } catch (error) {
    console.error('Error fetching weekly challenge:', error);
    return null;
  }
});

/**
 * Get challenge statistics
 */
export const getChallengeStats = cache(
  async (
    challengeId: string
  ): Promise<{
    totalAttempts: number;
    totalPassed: number;
    averageScore: number | null;
    successRate: number;
  } | null> => {
    try {
      const supabase = await createClient();

      const { data: submissions } = await supabase
        .from('submissions')
        .select('status, score')
        .eq('challenge_id', challengeId);

      if (!submissions || submissions.length === 0) {
        return {
          totalAttempts: 0,
          totalPassed: 0,
          averageScore: null,
          successRate: 0,
        };
      }

      const totalAttempts = submissions.length;
      const totalPassed = submissions.filter((s) => s.status === 'passed').length;
      const scores = submissions
        .filter((s) => s.score !== null)
        .map((s) => s.score as number);
      const averageScore =
        scores.length > 0
          ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
          : null;
      const successRate =
        totalAttempts > 0 ? Math.round((totalPassed / totalAttempts) * 100) : 0;

      return {
        totalAttempts,
        totalPassed,
        averageScore,
        successRate,
      };
    } catch (error) {
      console.error('Error fetching challenge stats:', error);
      return null;
    }
  }
);

/**
 * Get user's challenge statistics
 */
export const getUserChallengeStats = cache(
  async (): Promise<{
    completed: number;
    inProgress: number;
    total: number;
  }> => {
    try {
      const supabase = await createClient();

      // Get authenticated user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { completed: 0, inProgress: 0, total: 0 };
      }

      // Get total active challenges
      const { count: totalCount } = await supabase
        .from('challenges')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Get user's progress
      const { data: progressData } = await supabase
        .from('roadmap_progress')
        .select('status')
        .eq('user_id', user.id);

      const completed =
        progressData?.filter((p) => p.status === 'completed').length || 0;
      const inProgress =
        progressData?.filter((p) => p.status === 'in_progress').length || 0;

      return {
        completed,
        inProgress,
        total: totalCount || 0,
      };
    } catch (error) {
      console.error('Error fetching user challenge stats:', error);
      return { completed: 0, inProgress: 0, total: 0 };
    }
  }
);

/**
 * Get challenges with progress, pagination, and advanced filtering
 */
export const getChallengesWithProgress = cache(
  async (
    filters?: ChallengeFilters,
    excludeOfficeFundamentals?: boolean
  ): Promise<{
    challenges: ChallengeWithProgress[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> => {
    try {
      const supabase = await createClient();
      const page = filters?.page || 1;
      const pageSize = 12;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // Build query for count
      let countQuery = supabase
        .from('challenges')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Build query for data
      let query = supabase
        .from('challenges')
        .select('*')
        .eq('is_active', true);

      // Exclude office-fundamentals if requested (when showing category cards)
      if (excludeOfficeFundamentals) {
        query = query.not('category', 'in', '("office","office-fundamentals")');
        countQuery = countQuery.not('category', 'in', '("office","office-fundamentals")');
      }

      // Apply filters to both queries
      if (filters?.difficulty) {
        const difficulties = filters.difficulty.split(',');
        if (difficulties.length === 1) {
          query = query.eq('difficulty', difficulties[0]);
          countQuery = countQuery.eq('difficulty', difficulties[0]);
        } else {
          query = query.in('difficulty', difficulties);
          countQuery = countQuery.in('difficulty', difficulties);
        }
      }

      if (filters?.category) {
        const categories = filters.category.split(',');
        // Map office-fundamentals to include both 'office' and 'office-fundamentals' for compatibility
        const expandedCategories = categories.flatMap(cat =>
          cat === 'office-fundamentals' ? ['office', 'office-fundamentals'] : [cat]
        );
        if (expandedCategories.length === 1) {
          query = query.eq('category', expandedCategories[0]);
          countQuery = countQuery.eq('category', expandedCategories[0]);
        } else {
          query = query.in('category', expandedCategories);
          countQuery = countQuery.in('category', expandedCategories);
        }
      }

      if (filters?.searchQuery) {
        const searchFilter = `title.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`;
        query = query.or(searchFilter);
        countQuery = countQuery.or(searchFilter);
      }

      // Apply sorting
      if (filters?.sort === 'points') {
        query = query.order('points', { ascending: false });
      } else if (filters?.sort === 'difficulty') {
        query = query.order('difficulty', { ascending: true });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      // Apply pagination
      query = query.range(from, to);

      // Execute queries in parallel
      const [{ data: challenges }, { count: totalCount }] = await Promise.all([
        query,
        countQuery,
      ]);

      if (!challenges) {
        return {
          challenges: [],
          total: 0,
          page,
          pageSize,
          totalPages: 0,
        };
      }

      // Get user progress if authenticated
      const {
        data: { user },
      } = await supabase.auth.getUser();

      let challengesWithProgress: ChallengeWithProgress[] = challenges.map(
        (challenge) => ({
          ...challenge,
          userProgress: null,
        })
      );

      if (user) {
        const { data: progressData } = await supabase
          .from('roadmap_progress')
          .select('challenge_id, status, attempts')
          .eq('user_id', user.id);

        const progressMap = new Map(
          progressData?.map((p) => [p.challenge_id, p]) || []
        );

        challengesWithProgress = challenges.map((challenge) => ({
          ...challenge,
          userProgress: progressMap.get(challenge.id) || null,
        }));

        // Apply status filter if specified
        if (filters?.status && filters.status !== 'all') {
          challengesWithProgress = challengesWithProgress.filter((challenge) => {
            if (filters.status === 'not_started') {
              return !challenge.userProgress;
            }
            return challenge.userProgress?.status === filters.status;
          });
        }
      }

      const totalPages = Math.ceil((totalCount || 0) / pageSize);

      return {
        challenges: challengesWithProgress,
        total: totalCount || 0,
        page,
        pageSize,
        totalPages,
      };
    } catch (error) {
      console.error('Error fetching challenges with progress:', error);
      return {
        challenges: [],
        total: 0,
        page: 1,
        pageSize: 12,
        totalPages: 0,
      };
    }
  }
);

/**
 * Get user's in-progress challenges
 */
export const getInProgressChallenges = cache(
  async (): Promise<ChallengeWithProgress[]> => {
    try {
      const supabase = await createClient();

      // Get authenticated user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return [];

      // Get in-progress challenge IDs
      const { data: progressData } = await supabase
        .from('roadmap_progress')
        .select('challenge_id, status, attempts, started_at')
        .eq('user_id', user.id)
        .eq('status', 'in_progress')
        .order('started_at', { ascending: false });

      if (!progressData || progressData.length === 0) return [];

      const challengeIds = progressData.map((p) => p.challenge_id);

      // Fetch the challenges
      const { data: challenges } = await supabase
        .from('challenges')
        .select('*')
        .in('id', challengeIds)
        .eq('is_active', true);

      if (!challenges) return [];

      // Map progress to challenges
      const progressMap = new Map(
        progressData.map((p) => [p.challenge_id, p])
      );

      return challenges.map((challenge) => ({
        ...challenge,
        userProgress: progressMap.get(challenge.id) || null,
      }));
    } catch (error) {
      console.error('Error fetching in-progress challenges:', error);
      return [];
    }
  }
);

export type CategoryStat = {
  category: string;
  total: number;
  completed: number;
  totalPoints: number;
};

/**
 * Get statistics for all challenge categories
 */
export const getCategoryStats = cache(async (): Promise<CategoryStat[]> => {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Define all categories
    const categories = [
      'office-fundamentals',
      'python',
      'javascript',
      'react',
      'nextjs',
      'nodejs',
    ];

    // Fetch all active challenges grouped by category
    const { data: challenges } = await supabase
      .from('challenges')
      .select('id, category, points')
      .eq('is_active', true);

    if (!challenges) {
      return categories.map((category) => ({
        category,
        total: 0,
        completed: 0,
        totalPoints: 0,
      }));
    }

    // Get user's completed challenges if authenticated
    let completedChallengeIds: string[] = [];
    if (user) {
      const { data: progress } = await supabase
        .from('roadmap_progress')
        .select('challenge_id')
        .eq('user_id', user.id)
        .eq('status', 'completed');

      completedChallengeIds = progress?.map((p) => p.challenge_id) || [];
    }

    // Group challenges by category and calculate stats
    const statsMap = new Map<string, CategoryStat>();

    // Initialize stats for all categories
    categories.forEach((category) => {
      statsMap.set(category, {
        category,
        total: 0,
        completed: 0,
        totalPoints: 0,
      });
    });

    // Populate stats from challenges
    challenges.forEach((challenge) => {
      // Map 'office' to 'office-fundamentals' for compatibility
      const category = challenge.category === 'office' ? 'office-fundamentals' : challenge.category;
      const stat = statsMap.get(category);
      if (stat) {
        stat.total += 1;
        stat.totalPoints += challenge.points;
        if (completedChallengeIds.includes(challenge.id)) {
          stat.completed += 1;
        }
      }
    });

    console.log('Category stats:', Array.from(statsMap.values()));

    return Array.from(statsMap.values());
  } catch (error) {
    console.error('Error fetching category stats:', error);
    return [];
  }
});

// ============================================================================
// TIER-BASED CHALLENGE SYSTEM FUNCTIONS
// ============================================================================

import { ChallengeTier, TIERS, TIER_ORDER } from '@/lib/constants/dashboard';
import {
  isChallengeUnlocked,
  getCompletionStatsByTier,
  getNextChallengeInTier,
  type Challenge as UnlockChallenge,
  type UserProgress,
} from '@/lib/utils/challenge-unlock';
import {
  canAccessChallengeTier,
  canMakeAttempt,
  incrementDailyUsage,
} from '@/lib/utils/subscription-check';

export type TierProgressStats = {
  tier: ChallengeTier;
  name: string;
  description: string;
  icon: string;
  completed: number;
  total: number;
  percentage: number;
  isUnlocked: boolean;
  unlockRequirement?: string;
  nextChallenge?: {
    id: string;
    slug: string;
    title: string;
    order: number;
  } | null;
};

/**
 * Get tier progress for all tiers
 */
export const getTierProgress = cache(async (): Promise<TierProgressStats[]> => {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Get all active challenges
    const { data: challenges } = await supabase
      .from('challenges')
      .select('id, slug, title, tier, order_in_tier, unlock_requirement_type, unlock_requirement_count, previous_challenge_id')
      .eq('is_active', true)
      .order('tier')
      .order('order_in_tier');

    if (!challenges) {
      return TIER_ORDER.map((tierId) => {
        const tierInfo = TIERS[tierId];
        return {
          tier: tierId,
          name: tierInfo.name,
          description: tierInfo.description,
          icon: tierInfo.icon,
          completed: 0,
          total: tierInfo.totalChallenges,
          percentage: 0,
          isUnlocked: tierId === 'beginner',
          unlockRequirement: tierInfo.unlockRequirement.description,
          nextChallenge: null,
        };
      });
    }

    // Get user progress if authenticated
    let userProgress: UserProgress[] = [];
    if (user) {
      const { data: progressData } = await supabase
        .from('roadmap_progress')
        .select('challenge_id, status')
        .eq('user_id', user.id);

      userProgress = progressData || [];
    }

    // Calculate completion stats by tier
    const statsByTier = getCompletionStatsByTier(
      challenges as unknown as UnlockChallenge[],
      userProgress
    );

    // Build tier progress array
    const tierProgress: TierProgressStats[] = TIER_ORDER.map((tierId) => {
      const tierInfo = TIERS[tierId];
      const stats = statsByTier[tierId];
      const percentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

      // Check if tier is unlocked
      let isUnlocked = tierInfo.unlockRequirement.type === 'none';
      if (
        tierInfo.unlockRequirement.type === 'tier_completion' &&
        tierInfo.unlockRequirement.previousTier &&
        tierInfo.unlockRequirement.requiredCount
      ) {
        const previousTier = tierInfo.unlockRequirement.previousTier;
        const requiredCount = tierInfo.unlockRequirement.requiredCount;
        const previousCompleted = statsByTier[previousTier].completed;
        isUnlocked = previousCompleted >= requiredCount;
      }

      // Get next challenge in tier
      const nextChallenge = user
        ? getNextChallengeInTier(tierId, challenges as unknown as UnlockChallenge[], userProgress)
        : null;

      return {
        tier: tierId,
        name: tierInfo.name,
        description: tierInfo.description,
        icon: tierInfo.icon,
        completed: stats.completed,
        total: stats.total,
        percentage,
        isUnlocked,
        unlockRequirement: tierInfo.unlockRequirement.description,
        nextChallenge: nextChallenge
          ? {
              id: nextChallenge.id,
              slug: nextChallenge.slug,
              title: nextChallenge.title,
              order: nextChallenge.order_in_tier,
            }
          : null,
      };
    });

    return tierProgress;
  } catch (error) {
    console.error('Error fetching tier progress:', error);
    return [];
  }
});

/**
 * Get challenges by tier with unlock status
 */
export const getChallengesByTier = cache(
  async (tier: ChallengeTier): Promise<{
    challenges: (ChallengeWithProgress & {
      order_in_tier: number;
      isUnlocked: boolean;
      unlockReason?: string;
    })[];
    tierInfo: TierProgressStats;
  }> => {
    try {
      const supabase = await createClient();

      // Get authenticated user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Get all challenges in this tier
      const { data: challenges } = await supabase
        .from('challenges')
        .select('*')
        .eq('tier', tier)
        .eq('is_active', true)
        .order('order_in_tier');

      if (!challenges || challenges.length === 0) {
        const tierInfo = TIERS[tier];
        return {
          challenges: [],
          tierInfo: {
            tier,
            name: tierInfo.name,
            description: tierInfo.description,
            icon: tierInfo.icon,
            completed: 0,
            total: 0,
            percentage: 0,
            isUnlocked: tier === 'beginner',
            unlockRequirement: tierInfo.unlockRequirement.description,
            nextChallenge: null,
          },
        };
      }

      // Get all challenges and user progress for unlock checks
      const { data: allChallenges } = await supabase
        .from('challenges')
        .select('id, slug, title, tier, order_in_tier, unlock_requirement_type, unlock_requirement_count, previous_challenge_id')
        .eq('is_active', true);

      let userProgress: UserProgress[] = [];
      if (user) {
        const { data: progressData } = await supabase
          .from('roadmap_progress')
          .select('challenge_id, status, attempts')
          .eq('user_id', user.id);

        userProgress = progressData || [];
      }

      // Map challenges with unlock status
      const challengesWithUnlock = challenges
        .filter((challenge) => challenge.order_in_tier !== null) // Filter out challenges without order
        .map((challenge) => {
          const progress = userProgress.find((p) => p.challenge_id === challenge.id);
          const unlockStatus = isChallengeUnlocked(
            challenge as unknown as UnlockChallenge,
            (allChallenges || []) as unknown as UnlockChallenge[],
            userProgress
          );

          return {
            ...challenge,
            order_in_tier: challenge.order_in_tier!, // Assert non-null after filter
            userProgress: progress
              ? { status: progress.status }
              : null,
            isUnlocked: unlockStatus.isUnlocked,
            unlockReason: unlockStatus.reason,
          };
        });

      // Get tier stats
      const tierStats = await getTierProgress();
      const currentTierStats = tierStats.find((t) => t.tier === tier) || {
        tier,
        name: TIERS[tier].name,
        description: TIERS[tier].description,
        icon: TIERS[tier].icon,
        completed: 0,
        total: challenges.length,
        percentage: 0,
        isUnlocked: tier === 'beginner',
        unlockRequirement: TIERS[tier].unlockRequirement.description,
        nextChallenge: null,
      };

      return {
        challenges: challengesWithUnlock,
        tierInfo: currentTierStats,
      };
    } catch (error) {
      console.error('Error fetching challenges by tier:', error);
      const tierInfo = TIERS[tier];
      return {
        challenges: [],
        tierInfo: {
          tier,
          name: tierInfo.name,
          description: tierInfo.description,
          icon: tierInfo.icon,
          completed: 0,
          total: 0,
          percentage: 0,
          isUnlocked: tier === 'beginner',
          unlockRequirement: tierInfo.unlockRequirement.description,
          nextChallenge: null,
        },
      };
    }
  }
);

/**
 * Check if a specific challenge is unlocked
 */
export const checkChallengeUnlocked = cache(
  async (challengeId: string): Promise<{ isUnlocked: boolean; reason?: string }> => {
    try {
      const supabase = await createClient();

      // Get authenticated user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { isUnlocked: false, reason: 'Not authenticated' };
      }

      // Get the challenge
      const { data: challenge } = await supabase
        .from('challenges')
        .select('id, slug, title, tier, order_in_tier, unlock_requirement_type, unlock_requirement_count, previous_challenge_id')
        .eq('id', challengeId)
        .eq('is_active', true)
        .single();

      if (!challenge) {
        return { isUnlocked: false, reason: 'Challenge not found' };
      }

      // SECURITY CHECK: Verify user has access to this challenge tier
      if (challenge.tier && challenge.tier !== 'beginner') {
        const access = await canAccessChallengeTier(challenge.tier as ChallengeTier);
        if (!access.canAccess) {
          return { isUnlocked: false, reason: access.reason };
        }
      }

      // Get all challenges
      const { data: allChallenges } = await supabase
        .from('challenges')
        .select('id, slug, title, tier, order_in_tier, unlock_requirement_type, unlock_requirement_count, previous_challenge_id')
        .eq('is_active', true);

      // Get user progress
      const { data: progressData } = await supabase
        .from('roadmap_progress')
        .select('challenge_id, status')
        .eq('user_id', user.id);

      const userProgress: UserProgress[] = progressData || [];

      // Check unlock status
      const unlockStatus = isChallengeUnlocked(
        challenge as unknown as UnlockChallenge,
        (allChallenges || []) as unknown as UnlockChallenge[],
        userProgress
      );

      return unlockStatus;
    } catch (error) {
      console.error('Error checking challenge unlock status:', error);
      return { isUnlocked: false, reason: 'Error checking unlock status' };
    }
  }
);

/**
 * Check if user can submit a challenge attempt
 * Enforces daily limits for free users
 */
export async function canSubmitChallenge(
  challengeId: string
): Promise<{ allowed: boolean; reason?: string; attemptsRemaining?: number }> {
  try {
    // Check if challenge is unlocked
    const unlockStatus = await checkChallengeUnlocked(challengeId);
    if (!unlockStatus.isUnlocked) {
      return { allowed: false, reason: unlockStatus.reason };
    }

    // Check daily attempt limit
    const attemptCheck = await canMakeAttempt();
    if (!attemptCheck.allowed) {
      return {
        allowed: false,
        reason: attemptCheck.reason,
        attemptsRemaining: 0,
      };
    }

    return {
      allowed: true,
      attemptsRemaining: attemptCheck.attemptsRemaining,
    };
  } catch (error) {
    console.error('Error in canSubmitChallenge:', error);
    return { allowed: false, reason: 'Error checking submission eligibility' };
  }
}

/**
 * Record a challenge submission attempt
 * Increments daily usage counter for free users
 */
export async function recordChallengeAttempt(): Promise<boolean> {
  try {
    return await incrementDailyUsage('attempts');
  } catch (error) {
    console.error('Error recording challenge attempt:', error);
    return false;
  }
}
