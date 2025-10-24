'use server';

import { createClient } from '@/lib/supabase/server';
import { cache } from 'react';

export type MerchCategory = 'apparel' | 'accessories' | 'office' | 'tech';

export type MerchItem = {
  id: string;
  name: string;
  description: string | null;
  category: MerchCategory;
  point_cost: number;
  image_url: string | null;
  stock_quantity: number;
  sizes: string[] | null;
  is_active: boolean;
};

export type RedemptionStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export type Redemption = {
  id: string;
  merch_item_id: string;
  points_spent: number;
  status: RedemptionStatus;
  size: string | null;
  tracking_number: string | null;
  created_at: string;
  fulfilled_at: string | null;
  merch_item?: MerchItem;
};

export type AddressDetails = {
  name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
};

/**
 * Get all available merch items
 */
export const getMerchItems = cache(
  async (category?: MerchCategory): Promise<MerchItem[]> => {
    try {
      const supabase = await createClient();

      // During beta, show all items (both active and inactive for preview)
      let query = supabase
        .from('merch_items')
        .select('*')
        .order('point_cost', { ascending: true });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching merch items:', error);
        return [];
      }

      return (data || []) as MerchItem[];
    } catch (error) {
      console.error('Error in getMerchItems:', error);
      return [];
    }
  }
);

/**
 * Get user's point balance
 */
export const getUserPoints = cache(async (): Promise<number> => {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return 0;

    const { data, error } = await supabase
      .from('profiles')
      .select('total_points')
      .eq('id', user.id)
      .single();

    if (error || !data) {
      console.error('Error fetching user points:', error);
      return 0;
    }

    return data.total_points;
  } catch (error) {
    console.error('Error in getUserPoints:', error);
    return 0;
  }
});

/**
 * Check if user has enough points
 */
export async function checkPointsAvailable(
  itemId: string
): Promise<{ available: boolean; userPoints: number; required: number }> {
  try {
    const supabase = await createClient();

    // Get item cost
    const { data: item } = await supabase
      .from('merch_items')
      .select('point_cost')
      .eq('id', itemId)
      .single();

    if (!item) {
      return { available: false, userPoints: 0, required: 0 };
    }

    // Get user points
    const userPoints = await getUserPoints();

    return {
      available: userPoints >= item.point_cost,
      userPoints,
      required: item.point_cost,
    };
  } catch (error) {
    console.error('Error in checkPointsAvailable:', error);
    return { available: false, userPoints: 0, required: 0 };
  }
}

/**
 * Redeem merch item
 */
export async function redeemMerch(
  itemId: string,
  size: string | null,
  addressDetails: AddressDetails
): Promise<{ success: boolean; redemptionId?: string; error?: string }> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    // Beta Restriction: Check redemption limit per user
    const { count: userRedemptionCount } = await supabase
      .from('redemptions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .neq('status', 'cancelled');

    if (userRedemptionCount && userRedemptionCount >= 1) {
      return { success: false, error: 'Beta limit: Only 1 redemption per user. More items coming in v1.0!' };
    }

    // Validate address details
    if (!addressDetails.name || !addressDetails.address_line1 || !addressDetails.city ||
        !addressDetails.state || !addressDetails.zip || !addressDetails.country || !addressDetails.phone) {
      return { success: false, error: 'Complete address details required' };
    }

    // Check stock availability
    const { data: item } = await supabase
      .from('merch_items')
      .select('stock_quantity, sizes, point_cost, name, is_active')
      .eq('id', itemId)
      .single();

    if (!item) {
      return { success: false, error: 'Item not found or not available' };
    }

    // Beta Restriction: Only active items can be redeemed
    if (!item.is_active) {
      return { success: false, error: 'This item will be available in v1.0. Keep earning points!' };
    }

    if (item.stock_quantity <= 0) {
      return { success: false, error: 'Item out of stock' };
    }

    // Validate size if required
    if (item.sizes && Array.isArray(item.sizes)) {
      if (!size || !item.sizes.includes(size)) {
        return { success: false, error: 'Valid size selection required' };
      }
    }

    // Call database function to process redemption
    const { data, error } = await supabase.rpc('process_redemption', {
      p_user_id: user.id,
      p_merch_item_id: itemId,
      p_size: size,
      p_address_details: addressDetails,
    });

    if (error) {
      console.error('Error processing redemption:', error);
      return { success: false, error: error.message };
    }

    return { success: true, redemptionId: data };
  } catch (error: any) {
    console.error('Error in redeemMerch:', error);
    return { success: false, error: error.message || 'Failed to process redemption' };
  }
}

/**
 * Get user's redemption history
 */
export const getUserRedemptions = cache(async (): Promise<Redemption[]> => {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
      .from('redemptions')
      .select(`
        *,
        merch_item:merch_items(*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching redemptions:', error);
      return [];
    }

    return (data || []).map(redemption => ({
      id: redemption.id,
      merch_item_id: redemption.merch_item_id,
      points_spent: redemption.points_spent,
      status: redemption.status as RedemptionStatus,
      size: redemption.size,
      tracking_number: redemption.tracking_number,
      created_at: redemption.created_at,
      fulfilled_at: redemption.fulfilled_at,
      merch_item: redemption.merch_item as MerchItem | undefined,
    }));
  } catch (error) {
    console.error('Error in getUserRedemptions:', error);
    return [];
  }
});

/**
 * Get redemption by ID
 */
export const getRedemptionById = cache(
  async (redemptionId: string): Promise<Redemption | null> => {
    try {
      const supabase = await createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return null;

      const { data, error } = await supabase
        .from('redemptions')
        .select(`
          *,
          merch_item:merch_items(*)
        `)
        .eq('id', redemptionId)
        .eq('user_id', user.id)
        .single();

      if (error || !data) {
        console.error('Error fetching redemption:', error);
        return null;
      }

      return {
        id: data.id,
        merch_item_id: data.merch_item_id,
        points_spent: data.points_spent,
        status: data.status as RedemptionStatus,
        size: data.size,
        tracking_number: data.tracking_number,
        created_at: data.created_at,
        fulfilled_at: data.fulfilled_at,
        merch_item: data.merch_item as MerchItem | undefined,
      };
    } catch (error) {
      console.error('Error in getRedemptionById:', error);
      return null;
    }
  }
);
