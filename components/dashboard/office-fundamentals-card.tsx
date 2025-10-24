'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface OfficeFundamentalsChallenge {
  id: string;
  title: string;
  slug: string;
  difficulty: string;
  points: number;
  estimated_time: number | null;
  is_completed?: boolean;
}

interface OfficeFundamentalsCardProps {
  challenges: OfficeFundamentalsChallenge[];
  completedCount: number;
}

const DIFFICULTY_COLORS = {
  easy: 'text-green-600 bg-green-50 border-green-200',
  medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  hard: 'text-red-600 bg-red-50 border-red-200',
};

export function OfficeFundamentalsCard({
  challenges,
  completedCount
}: OfficeFundamentalsCardProps) {
  const totalChallenges = challenges.length;
  const completionPercentage = totalChallenges > 0
    ? Math.round((completedCount / totalChallenges) * 100)
    : 0;

  // Show only first 3 challenges
  const displayChallenges = challenges.slice(0, 3);

  return (
    <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50/50 to-white overflow-hidden relative">
      {/* Decorative background pattern */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-5">
        <Briefcase className="w-full h-full text-orange-600" />
      </div>

      <CardHeader className="relative">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-orange-100 p-2.5">
              <Briefcase className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Office Fundamentals</CardTitle>
              <p className="text-sm text-slate-600 mt-1">
                Master professional development skills
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className="text-orange-600 bg-orange-50 border-orange-200"
          >
            {totalChallenges} Challenges
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">
              Your Progress
            </span>
            <span className="text-sm font-semibold text-orange-600">
              {completedCount}/{totalChallenges} completed
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-3">
        {/* Challenge List */}
        {displayChallenges.map((challenge, index) => (
          <Link
            key={challenge.id}
            href={`/dashboard/challenges/${challenge.slug}`}
            className="block group"
          >
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white hover:border-orange-300 hover:shadow-sm transition-all">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  {challenge.is_completed ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-slate-300 flex-shrink-0" />
                  )}
                  <h4 className="text-sm font-medium text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                    {challenge.title}
                  </h4>
                </div>

                <div className="flex items-center gap-2 ml-6">
                  <Badge
                    variant="outline"
                    className={`${DIFFICULTY_COLORS[challenge.difficulty as keyof typeof DIFFICULTY_COLORS]} text-xs`}
                  >
                    {challenge.difficulty}
                  </Badge>

                  <div className="flex items-center gap-1 text-xs text-slate-600">
                    <Sparkles className="h-3 w-3" />
                    <span>{challenge.points} pts</span>
                  </div>

                  {challenge.estimated_time && (
                    <div className="flex items-center gap-1 text-xs text-slate-600">
                      <Clock className="h-3 w-3" />
                      <span>{challenge.estimated_time} min</span>
                    </div>
                  )}
                </div>
              </div>

              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
            </div>
          </Link>
        ))}

        {/* View All Button */}
        <Button
          asChild
          className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600"
        >
          <Link href="/dashboard/challenges?category=office-fundamentals">
            View All {totalChallenges} Challenges
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>

        {/* What You'll Learn */}
        <div className="pt-3 border-t border-orange-100">
          <h4 className="text-xs font-semibold text-slate-700 mb-2">
            What You&apos;ll Learn:
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-xs text-slate-600 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
              <span>PR & Code Review</span>
            </div>
            <div className="text-xs text-slate-600 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
              <span>Documentation</span>
            </div>
            <div className="text-xs text-slate-600 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
              <span>Technical Writing</span>
            </div>
            <div className="text-xs text-slate-600 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
              <span>Best Practices</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
