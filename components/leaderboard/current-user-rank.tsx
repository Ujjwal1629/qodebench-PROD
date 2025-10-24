'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Trophy, TrendingUp } from 'lucide-react';

interface CurrentUserRankProps {
  rank: number;
  totalUsers: number;
  percentile: number;
}

export function CurrentUserRank({ rank, totalUsers, percentile }: CurrentUserRankProps) {
  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Your Rank</p>
              <p className="text-3xl font-bold text-blue-600">#{rank}</p>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-2xl font-bold text-green-600">Top {percentile}%</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Out of {totalUsers.toLocaleString()} developers
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
