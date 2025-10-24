import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Sidebar } from '@/components/dashboard/sidebar';
import { TopBar } from '@/components/dashboard/topbar';
import { MobileNav } from '@/components/dashboard/mobile-nav';

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

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('username, avatar_url, full_name, total_points')
    .eq('id', user.id)
    .single();

  const userData = profile
    ? {
        username: profile.username,
        avatar_url: profile.avatar_url,
        full_name: profile.full_name,
        total_points: profile.total_points,
      }
    : null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar for desktop */}
      <Sidebar user={userData} />

      {/* Top bar */}
      <TopBar user={userData} />

      {/* Main content */}
      <main className="min-h-screen pt-16 pb-20 lg:pb-8 lg:pl-64 transition-all duration-300">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Mobile navigation */}
      <MobileNav />
    </div>
  );
}
