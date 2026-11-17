import { createClient } from '@/lib/supabase/server';
import { PAYWALL_ENABLED } from '@/lib/config/features';

export interface SubscriptionInfo {
  tier: string;
  status: string;
  isEnrolled: boolean;
}

// Subscription columns are missing from the generated Database types,
// so fetch them directly (same pattern as the dashboard layout).
export async function getSubscription(): Promise<SubscriptionInfo> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { tier: 'free', status: 'expired', isEnrolled: false };

  const { data } = await supabase
    .from('profiles')
    .select('subscription_tier, subscription_status')
    .eq('id', user.id)
    .single();

  const tier = (data as any)?.subscription_tier ?? 'free';
  const status = (data as any)?.subscription_status ?? 'expired';

  return {
    tier,
    status,
    isEnrolled: !PAYWALL_ENABLED || (tier !== 'free' && ['active', 'trial'].includes(status)),
  };
}
