import { getUserStats, getUserProfile } from '@/app/actions/dashboard';
import { WelcomeHeader } from '@/components/dashboard/welcome-header';
import { StatsOverview } from '@/components/dashboard/stats-overview';
import { ExperienceProgress } from '@/components/dashboard/experience-progress';
import { QuickActions } from '@/components/dashboard/quick-actions';

export default async function DashboardPage() {
  // Fetch all dashboard data in parallel for optimal performance
  const [
    stats,
    profile,
  ] = await Promise.all([
    getUserStats(),
    getUserProfile(),
  ]);

  // Redirect if no user (handled by layout, but just in case)
  if (!profile) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-slate-600">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <WelcomeHeader
        username={profile.username}
        stats={
          stats
            ? {
                challengesCompleted: stats.challengesCompleted,
                currentStreak: stats.currentStreak,
                totalPoints: stats.totalPoints,
              }
            : undefined
        }
      />

      {/* Stats Overview Cards */}
      {stats && <StatsOverview stats={stats} />}

      {/* Experience Progress */}
      <ExperienceProgress totalPoints={profile.total_points} />

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
}
