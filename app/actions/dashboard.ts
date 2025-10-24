'use server';

import { createClient } from '@/lib/supabase/server';
import { Database } from '@/lib/supabase/database.types';
import { cache } from 'react';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Submission = Database['public']['Tables']['submissions']['Row'];
type Challenge = Database['public']['Tables']['challenges']['Row'];
type LeaderboardEntry = Database['public']['Tables']['leaderboard_entries']['Row'];

// Types for dashboard data
export type UserStats = {
  totalPoints: number;
  weeklyPoints: number;
  challengesCompleted: number;
  totalChallenges: number;
  currentStreak: number;
  longestStreak: number;
  globalRank: number | null;
  weeklyRank: number | null;
  experienceLevel: string;
  completionPercentage: number;
  pointsToNextLevel: number;
  currentLevel: string;
  nextLevel: string;
};

export type RecentSubmission = {
  id: string;
  challengeTitle: string;
  challengeSlug: string;
  status: 'pending' | 'passed' | 'failed' | 'error';
  score: number | null;
  submittedAt: string;
  hasFeedback: boolean;
};

export type RecommendedChallenge = {
  id: string;
  title: string;
  slug: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  points: number;
  estimatedTime: number | null;
  description: string | null;
};

export type WeeklyChallengeInfo = {
  challenge: Challenge | null;
  userParticipation: {
    bestScore: number | null;
    rank: number | null;
    hasParticipated: boolean;
  } | null;
  totalParticipants: number;
  endsAt: Date;
  daysRemaining: number;
};

/**
 * Get comprehensive user statistics for dashboard
 */
export const getUserStats = cache(async (): Promise<UserStats | null> => {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    // Fetch user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profile) return null;

    // Fetch leaderboard entry for ranks
    const { data: leaderboardEntry } = await supabase
      .from('leaderboard_entries')
      .select('global_rank, weekly_rank')
      .eq('user_id', user.id)
      .single();

    // Get total number of challenges
    const { count: totalChallenges } = await supabase
      .from('challenges')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    // Calculate level progression
    const levelInfo = calculateLevelInfo(profile.total_points);

    return {
      totalPoints: profile.total_points,
      weeklyPoints: profile.weekly_points,
      challengesCompleted: profile.challenges_completed,
      totalChallenges: totalChallenges || 0,
      currentStreak: profile.current_streak,
      longestStreak: profile.longest_streak,
      globalRank: leaderboardEntry?.global_rank || null,
      weeklyRank: leaderboardEntry?.weekly_rank || null,
      experienceLevel: profile.experience_level || 'intern',
      completionPercentage:
        totalChallenges && totalChallenges > 0
          ? Math.round((profile.challenges_completed / totalChallenges) * 100)
          : 0,
      pointsToNextLevel: levelInfo.pointsToNext,
      currentLevel: levelInfo.current,
      nextLevel: levelInfo.next,
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return null;
  }
});

/**
 * Get user's recent submissions with challenge details
 */
export const getRecentSubmissions = cache(
  async (limit: number = 5): Promise<RecentSubmission[]> => {
    try {
      const supabase = await createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: submissions } = await supabase
        .from('submissions')
        .select(
          `
        id,
        status,
        score,
        submitted_at,
        ai_feedback,
        challenge_id,
        challenges (
          title,
          slug
        )
      `
        )
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false })
        .limit(limit);

      if (!submissions) return [];

      return submissions.map((submission: any) => ({
        id: submission.id,
        challengeTitle: submission.challenges?.title || 'Unknown Challenge',
        challengeSlug: submission.challenges?.slug || '',
        status: submission.status,
        score: submission.score,
        submittedAt: submission.submitted_at,
        hasFeedback: !!submission.ai_feedback,
      }));
    } catch (error) {
      console.error('Error fetching recent submissions:', error);
      return [];
    }
  }
);

/**
 * Get recommended challenges based on user's experience level
 */
export const getRecommendedChallenges = cache(
  async (limit: number = 3): Promise<RecommendedChallenge[]> => {
    try {
      const supabase = await createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Get user's experience level
      let experienceLevel = 'junior';
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('experience_level')
          .eq('id', user.id)
          .single();
        experienceLevel = profile?.experience_level || 'junior';
      }

      // Map experience level to difficulty
      const difficultyMap: Record<string, string[]> = {
        intern: ['easy'],
        junior: ['easy', 'medium'],
        mid: ['medium', 'hard'],
        senior: ['hard', 'medium'],
      };

      const targetDifficulties = difficultyMap[experienceLevel] || ['easy'];

      // Get challenges user hasn't completed yet
      let query = supabase
        .from('challenges')
        .select('id, title, slug, difficulty, category, points, estimated_time, description')
        .eq('is_active', true)
        .in('difficulty', targetDifficulties)
        .order('created_at', { ascending: false })
        .limit(limit * 2); // Get more to filter

      if (user) {
        // Exclude completed challenges
        const { data: completedProgress } = await supabase
          .from('roadmap_progress')
          .select('challenge_id')
          .eq('user_id', user.id)
          .eq('status', 'completed');

        const completedIds = completedProgress?.map((p) => p.challenge_id) || [];

        if (completedIds.length > 0) {
          query = query.not('id', 'in', `(${completedIds.join(',')})`);
        }
      }

      const { data: challenges } = await query;

      if (!challenges) return [];

      // Return only the requested limit
      return challenges.slice(0, limit).map((challenge) => ({
        id: challenge.id,
        title: challenge.title,
        slug: challenge.slug,
        difficulty: challenge.difficulty as 'easy' | 'medium' | 'hard',
        category: challenge.category,
        points: challenge.points,
        estimatedTime: challenge.estimated_time,
        description: challenge.description,
      }));
    } catch (error) {
      console.error('Error fetching recommended challenges:', error);
      return [];
    }
  }
);

/**
 * Get user profile data
 */
export const getUserProfile = cache(async (): Promise<Profile | null> => {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return profile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
});

/**
 * Get Code Friday (weekly challenge) information
 */
export const getWeeklyChallengeInfo = cache(
  async (): Promise<WeeklyChallengeInfo | null> => {
    try {
      const supabase = await createClient();

      // Get current week's challenge
      const { data: challenge } = await supabase
        .from('challenges')
        .select('*')
        .eq('is_weekly_challenge', true)
        .eq('weekly_challenge_date', getWeekStartDate())
        .single();

      if (!challenge) return null;

      // Get total participants
      const { count: totalParticipants } = await supabase
        .from('weekly_challenge_participants')
        .select('*', { count: 'exact', head: true })
        .eq('challenge_id', challenge.id)
        .eq('week_start_date', getWeekStartDate());

      // Get user's participation if authenticated
      const {
        data: { user },
      } = await supabase.auth.getUser();

      let userParticipation = null;
      if (user) {
        const { data: participation } = await supabase
          .from('weekly_challenge_participants')
          .select('best_score, rank')
          .eq('user_id', user.id)
          .eq('challenge_id', challenge.id)
          .eq('week_start_date', getWeekStartDate())
          .single();

        userParticipation = {
          bestScore: participation?.best_score || null,
          rank: participation?.rank || null,
          hasParticipated: !!participation,
        };
      }

      // Calculate days remaining in week
      const weekEnd = new Date(getWeekStartDate());
      weekEnd.setDate(weekEnd.getDate() + 7);
      const daysRemaining = Math.ceil(
        (weekEnd.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );

      return {
        challenge,
        userParticipation,
        totalParticipants: totalParticipants || 0,
        endsAt: weekEnd,
        daysRemaining: Math.max(0, daysRemaining),
      };
    } catch (error) {
      console.error('Error fetching weekly challenge info:', error);
      return null;
    }
  }
);

// Helper Functions

/**
 * Calculate level information based on points
 */
function calculateLevelInfo(points: number): {
  current: string;
  next: string;
  pointsToNext: number;
} {
  const levels = [
    { name: 'Intern', minPoints: 0, maxPoints: 499 },
    { name: 'Junior Developer', minPoints: 500, maxPoints: 1499 },
    { name: 'Mid Developer', minPoints: 1500, maxPoints: 3499 },
    { name: 'Senior Developer', minPoints: 3500, maxPoints: 6999 },
    { name: 'Lead Developer', minPoints: 7000, maxPoints: 14999 },
    { name: 'Principal Engineer', minPoints: 15000, maxPoints: 29999 },
    { name: 'Distinguished Engineer', minPoints: 30000, maxPoints: Infinity },
  ];

  const currentLevel = levels.find(
    (level) => points >= level.minPoints && points <= level.maxPoints
  );
  const currentIndex = levels.findIndex((level) => level.name === currentLevel?.name);
  const nextLevel = levels[currentIndex + 1] || currentLevel;

  return {
    current: currentLevel?.name || 'Intern',
    next: nextLevel?.name || currentLevel?.name || 'Intern',
    pointsToNext: nextLevel ? nextLevel.minPoints - points : 0,
  };
}

/**
 * Get the start date of current week (Monday)
 */
function getWeekStartDate(): string {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust to Monday
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().split('T')[0];
}

/**
 * Get Office Fundamentals challenges with completion status
 */
export type OfficeFundamentalsChallenge = {
  id: string;
  title: string;
  slug: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  estimated_time: number | null;
  is_completed: boolean;
};

export type OfficeFundamentalsData = {
  challenges: OfficeFundamentalsChallenge[];
  completedCount: number;
  totalCount: number;
};

export const getOfficeFundamentalsChallenges = cache(async (): Promise<OfficeFundamentalsData> => {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Fetch all office-fundamentals challenges (check both 'office' and 'office-fundamentals' for compatibility)
    const { data: challenges, error } = await supabase
      .from('challenges')
      .select('id, title, slug, difficulty, points, estimated_time')
      .in('category', ['office', 'office-fundamentals'])
      .eq('is_active', true)
      .order('difficulty', { ascending: true })
      .order('points', { ascending: true });

    console.log('Office challenges found:', challenges?.length || 0, 'Error:', error);

    if (error || !challenges) {
      console.error('Error fetching office fundamentals challenges:', error);
      return {
        challenges: [],
        completedCount: 0,
        totalCount: 0,
      };
    }

    // If user is logged in, get their completion status
    let completedChallengeIds: string[] = [];
    if (user) {
      const { data: progress } = await supabase
        .from('roadmap_progress')
        .select('challenge_id')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .in('challenge_id', challenges.map(c => c.id));

      completedChallengeIds = progress?.map(p => p.challenge_id) || [];
    }

    // Map challenges with completion status
    const challengesWithStatus = challenges.map((challenge) => ({
      ...challenge,
      is_completed: completedChallengeIds.includes(challenge.id),
    }));

    return {
      challenges: challengesWithStatus,
      completedCount: completedChallengeIds.length,
      totalCount: challenges.length,
    };
  } catch (error) {
    console.error('Error in getOfficeFundamentalsChallenges:', error);
    return {
      challenges: [],
      completedCount: 0,
      totalCount: 0,
    };
  }
});
