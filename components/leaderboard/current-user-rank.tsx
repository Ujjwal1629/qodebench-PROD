'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, TrendingUp, Rocket, Target } from 'lucide-react';

interface CurrentUserRankProps {
  rank: number;
  totalUsers: number;
  percentile: number;
  points: number;
}

export function CurrentUserRank({ rank, totalUsers, percentile, points }: CurrentUserRankProps) {
  // If user has 0 points, show encouragement message
  if (points === 0) {
    return (
      <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-orange-500 flex items-center justify-center">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-900">Ready to Get Started?</p>
                <p className="text-sm text-slate-600">
                  Complete challenges to earn points and climb the leaderboard!
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button asChild className="bg-gradient-to-r from-brand-500 to-purple-500 hover:from-brand-600 hover:to-purple-600">
                <Link href="/dashboard/challenges">
                  <Target className="h-4 w-4 mr-2" />
                  Start Challenges
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Normal rank display for users with points
  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
              <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">Your Rank</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600">#{rank}</p>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1 sm:gap-2 mb-1 justify-end">
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
              <span className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">Top {percentile}%</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Out of {totalUsers.toLocaleString()} developers
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
