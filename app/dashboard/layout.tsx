import { ReactNode, cache } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { TopBar } from '@/components/dashboard/topbar';
import { MainContentWrapper } from '@/components/dashboard/main-content-wrapper';
import { ScrollToTop } from '@/components/scroll-to-top';

// Cache user profile data for better performance
const getUserProfile = cache(async (userId: string) => {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('username, avatar_url, full_name, total_points, subscription_tier, subscription_status')
    .eq('id', userId)
    .single();

  return profile;
});

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/signin');
  }

  // Fetch user profile with caching
  const profile = await getUserProfile(user.id);

  const userData = profile
    ? {
        username: profile.username,
        avatar_url: profile.avatar_url,
        full_name: profile.full_name,
        total_points: profile.total_points,
        subscription_tier: profile.subscription_tier,
        subscription_status: profile.subscription_status,
      }
    : null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Scroll to top on route change */}
      <ScrollToTop />

      {/* Top bar with hamburger navigation drawer */}
      <TopBar user={userData} />

      {/* Main content with dynamic padding based on sidebar state */}
      <MainContentWrapper>{children}</MainContentWrapper>
    </div>
  );
}
