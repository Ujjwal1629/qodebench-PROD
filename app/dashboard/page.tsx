import { getUserStats, getRecentSubmissions, getRecommendedChallenges, getUserProfile, getWeeklyChallengeInfo, getOfficeFundamentalsChallenges, checkSkippedAssessment } from '@/app/actions/dashboard';
import { WelcomeHeader } from '@/components/dashboard/welcome-header';
import { StatsOverview } from '@/components/dashboard/stats-overview';
import { ExperienceProgress } from '@/components/dashboard/experience-progress';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { RecommendedChallenges } from '@/components/dashboard/recommended-challenges';
import { CodeFridayBanner } from '@/components/dashboard/code-friday-banner';
import { OfficeFundamentalsCard } from '@/components/dashboard/office-fundamentals-card';
import { AssessmentBanner } from '@/components/dashboard/assessment-banner';

export default async function DashboardPage() {
  // Fetch all dashboard data in parallel for optimal performance
  const [
    stats,
    recentSubmissions,
    recommendedChallenges,
    profile,
    weeklyChallenge,
    officeFundamentals,
    showAssessmentBanner,
  ] = await Promise.all([
    getUserStats(),
    getRecentSubmissions(5),
    getRecommendedChallenges(3),
    getUserProfile(),
    getWeeklyChallengeInfo(),
    getOfficeFundamentalsChallenges(),
    checkSkippedAssessment(),
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

      {/* Assessment Banner (if user skipped quiz) */}
      {showAssessmentBanner && <AssessmentBanner />}

      {/* Code Friday Banner (if active) */}
      {weeklyChallenge && (
        <CodeFridayBanner weeklyChallenge={weeklyChallenge} />
      )}

      {/* Stats Overview Cards */}
      {stats && <StatsOverview stats={stats} />}

      {/* Experience Progress */}
      <ExperienceProgress totalPoints={profile.total_points} />

      {/* Quick Actions */}
      <QuickActions />

      {/* Office Fundamentals Section */}
      {officeFundamentals.challenges.length > 0 && (
        <OfficeFundamentalsCard
          challenges={officeFundamentals.challenges}
          completedCount={officeFundamentals.completedCount}
        />
      )}

      {/* Recent Activity */}
      <RecentActivity submissions={recentSubmissions} />

      {/* Recommended Challenges */}
      <RecommendedChallenges challenges={recommendedChallenges} />
    </div>
  );
}
