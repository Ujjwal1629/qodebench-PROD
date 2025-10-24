'use server';

import { createClient } from '@/lib/supabase/server';
import { cache } from 'react';

export type Badge = {
  id: string;
  user_id: string;
  badge_type: string;
  earned_at: string;
  metadata: {
    title: string;
    description: string;
    icon: string;
  };
};

/**
 * Get all badges for a user
 */
export const getUserBadges = cache(async (userId?: string): Promise<Badge[]> => {
  try {
    const supabase = await createClient();

    // If no userId provided, get current user's badges
    if (!userId) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return [];
      userId = user.id;
    }

    const { data, error } = await supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', userId)
      .order('earned_at', { ascending: false });

    if (error) {
      console.error('Error fetching user badges:', error);
      return [];
    }

    return (data || []) as Badge[];
  } catch (error) {
    console.error('Error in getUserBadges:', error);
    return [];
  }
});

/**
 * Get badge count for a user
 */
export const getUserBadgeCount = cache(async (userId?: string): Promise<number> => {
  try {
    const supabase = await createClient();

    if (!userId) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return 0;
      userId = user.id;
    }

    const { count } = await supabase
      .from('user_badges')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    return count || 0;
  } catch (error) {
    console.error('Error in getUserBadgeCount:', error);
    return 0;
  }
});
