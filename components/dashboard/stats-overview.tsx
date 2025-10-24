import Link from 'next/link';
import { StatsCard } from './stats-card';
import { Sparkles, CheckCircle2, Trophy, Flame } from 'lucide-react';
import { formatPoints, getRankSuffix } from '@/lib/utils/format';
import { Progress } from '@/components/ui/progress';
import { UserStats } from '@/app/actions/dashboard';

interface StatsOverviewProps {
  stats: UserStats;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Points */}
      <StatsCard
        title="Total Points"
        value={formatPoints(stats.totalPoints)}
        icon={Sparkles}
        footer={
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>{stats.currentLevel}</span>
              <span>{stats.nextLevel}</span>
            </div>
            <Progress value={(stats.totalPoints / (stats.totalPoints + stats.pointsToNextLevel)) * 100} />
            <p className="text-xs text-slate-600">
              {formatPoints(stats.pointsToNextLevel)} to {stats.nextLevel}
            </p>
          </div>
        }
      />

      {/* Challenges Completed */}
      <StatsCard
        title="Challenges Completed"
        value={`${stats.challengesCompleted}/${stats.totalChallenges}`}
        icon={CheckCircle2}
        footer={
          <div className="space-y-1">
            <Progress value={stats.completionPercentage} />
            <p className="text-xs text-slate-600">
              {stats.completionPercentage}% completion rate
            </p>
          </div>
        }
      />

      {/* Current Rank */}
      <StatsCard
        title="Current Rank"
        value={stats.globalRank ? getRankSuffix(stats.globalRank) : 'Unranked'}
        icon={Trophy}
        footer={
          stats.globalRank ? (
            <Link
              href="/leaderboard"
              className="text-xs text-brand-600 hover:text-brand-700 font-medium"
            >
              View Leaderboard →
            </Link>
          ) : (
            <p className="text-xs text-slate-600">Complete a challenge to get ranked</p>
          )
        }
      />

      {/* Current Streak */}
      <StatsCard
        title="Current Streak"
        value={`${stats.currentStreak} ${stats.currentStreak === 1 ? 'day' : 'days'}`}
        icon={Flame}
        footer={
          <p className="text-xs text-slate-600">
            Longest: {stats.longestStreak} {stats.longestStreak === 1 ? 'day' : 'days'}
          </p>
        }
      />
    </div>
  );
}
