'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Clock, Target } from 'lucide-react';
import type { ProgressStats as ProgressStatsType } from '@/types/interview-prep';
import { INTERVIEW_TOPICS } from '@/types/interview-prep';

interface ProgressStatsProps {
  stats: ProgressStatsType;
  topicProgress: Record<string, { total: number; attempted: number; percentage: number }>;
}

export function ProgressStats({ stats, topicProgress }: ProgressStatsProps) {
  // Convert seconds to hours and minutes
  const hours = Math.floor(stats.totalTimeSpent / 3600);
  const minutes = Math.floor((stats.totalTimeSpent % 3600) / 60);
  const avgMinutes = Math.floor(stats.averageTimePerQuestion / 60);
  const avgSeconds = stats.averageTimePerQuestion % 60;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Attempted */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Questions Attempted</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalAttempted}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Out of 40 total questions
          </p>
          <Progress value={(stats.totalAttempted / 40) * 100} className="mt-2 h-2" />
        </CardContent>
      </Card>

      {/* Total Time */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
          <Clock className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Avg: {avgMinutes}m {avgSeconds}s per question
          </p>
        </CardContent>
      </Card>

      {/* Progress by Level */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">By Level</CardTitle>
          <Target className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Fresher</span>
              <span className="font-medium">{stats.byLevel?.fresher || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Experienced</span>
              <span className="font-medium">{stats.byLevel?.experienced || 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
