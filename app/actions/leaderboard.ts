'use server';

import { createClient } from '@/lib/supabase/server';
import { cache } from 'react';

export type LeaderboardType = 'all-time' | 'weekly';

export type LeaderboardUser = {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  experience_level: 'intern' | 'junior' | 'mid' | 'senior' | null;
  points: number;
  challenges_completed: number;
  current_streak: number;
  longest_streak: number;
  rank: number;
};

export type UserRank = {
  rank: number;
  total_users: number;
  percentile: number;
};

/**
 * Get leaderboard data
 */
export const getLeaderboard = cache(
  async (
    type: LeaderboardType = 'all-time',
    limit: number = 100
  ): Promise<LeaderboardUser[]> => {
    try {
      const supabase = await createClient();

      const pointsColumn = type === 'weekly' ? 'weekly_points' : 'total_points';

      const { data, error } = await supabase
        .from('profiles')
        .select(
          'id, username, full_name, avatar_url, experience_level, total_points, weekly_points, challenges_completed, current_streak, longest_streak'
        )
        .gt(pointsColumn, 0)
        .order(pointsColumn, { ascending: false })
        .order('challenges_completed', { ascending: false })
        .order('created_at', { ascending: true })
        .limit(limit);

      if (error) {
        console.error('Error fetching leaderboard:', error);
        return [];
      }

      if (!data) return [];

      // Map to leaderboard users with rank
      return data.map((user, index) => ({
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        experience_level: user.experience_level,
        points: type === 'weekly' ? user.weekly_points : user.total_points,
        challenges_completed: user.challenges_completed,
        current_streak: user.current_streak,
        longest_streak: user.longest_streak,
        rank: index + 1,
      }));
    } catch (error) {
      console.error('Error in getLeaderboard:', error);
      return [];
    }
  }
);

/**
 * Get current user's rank
 */
export const getUserRank = cache(
  async (type: LeaderboardType = 'all-time'): Promise<UserRank | null> => {
    try {
      const supabase = await createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return null;

      const pointsColumn = type === 'weekly' ? 'weekly_points' : 'total_points';

      // Get user's points
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('weekly_points, total_points')
        .eq('id', user.id)
        .single();

      if (!userProfile) return null;

      const userPoints = type === 'weekly' ? userProfile.weekly_points : userProfile.total_points;

      // Count users with more points (rank)
      const { count: higherRanked } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gt(pointsColumn, userPoints);

      // Count total users with points
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gt(pointsColumn, 0);

      const rank = (higherRanked || 0) + 1;
      const total = totalUsers || 1;
      const percentile = Math.round(((total - rank) / total) * 100);

      return {
        rank,
        total_users: total,
        percentile,
      };
    } catch (error) {
      console.error('Error in getUserRank:', error);
      return null;
    }
  }
);

/**
 * Search users on leaderboard
 */
export const searchUsers = cache(
  async (query: string, type: LeaderboardType = 'all-time'): Promise<LeaderboardUser[]> => {
    try {
      if (!query || query.trim().length < 2) {
        return [];
      }

      const supabase = await createClient();
      const pointsColumn = type === 'weekly' ? 'weekly_points' : 'total_points';

      const { data, error } = await supabase
        .from('profiles')
        .select(
          'id, username, full_name, avatar_url, experience_level, total_points, weekly_points, challenges_completed, current_streak, longest_streak'
        )
        .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
        .gt(pointsColumn, 0)
        .order(pointsColumn, { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error searching users:', error);
        return [];
      }

      if (!data) return [];

      // Calculate rank for each user (this is approximate, not exact global rank)
      return data.map((user, index) => ({
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        experience_level: user.experience_level,
        points: type === 'weekly' ? user.weekly_points : user.total_points,
        challenges_completed: user.challenges_completed,
        current_streak: user.current_streak,
        longest_streak: user.longest_streak,
        rank: index + 1, // This is relative to search results, not global
      }));
    } catch (error) {
      console.error('Error in searchUsers:', error);
      return [];
    }
  }
);

/**
 * Get detailed user profile for modal
 */
export const getUserProfile = cache(
  async (userId: string) => {
    try {
      const supabase = await createClient();

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError || !profile) {
        console.error('Error fetching user profile:', profileError);
        return null;
      }

      // Get challenge completions by category
      const { data: progressData } = await supabase
        .from('roadmap_progress')
        .select('challenge_id, status, completed_at')
        .eq('user_id', userId)
        .eq('status', 'completed');

      // Get challenges to categorize
      const challengeIds = progressData?.map(p => p.challenge_id) || [];

      let categoryCounts: Record<string, number> = {};

      if (challengeIds.length > 0) {
        const { data: challenges } = await supabase
          .from('challenges')
          .select('id, category')
          .in('id', challengeIds);

        // Count by category
        challenges?.forEach(challenge => {
          categoryCounts[challenge.category] = (categoryCounts[challenge.category] || 0) + 1;
        });
      }

      // Get recent activity (last 5 completed challenges)
      const recentActivity = progressData
        ?.sort((a, b) => new Date(b.completed_at || 0).getTime() - new Date(a.completed_at || 0).getTime())
        .slice(0, 5) || [];

      return {
        profile,
        categoryCounts,
        recentActivity,
      };
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      return null;
    }
  }
);
