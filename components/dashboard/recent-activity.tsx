'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils/format';
import { STATUS_COLORS } from '@/lib/constants/dashboard';
import { EmptyState } from './empty-state';
import { FileX2 } from 'lucide-react';
import { RecentSubmission } from '@/app/actions/dashboard';

interface RecentActivityProps {
  submissions: RecentSubmission[];
}

export function RecentActivity({ submissions }: RecentActivityProps) {
  if (submissions.length === 0) {
    return (
      <Card>
        <CardContent className="p-4 sm:p-5 md:p-6">
          <EmptyState
            icon={FileX2}
            title="No submissions yet"
            description="Start solving challenges to see your activity here"
            action={{
              label: 'Browse Challenges',
              onClick: () => {
                window.location.href = '/dashboard/challenges';
              },
            }}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between px-4 py-4 sm:px-5 sm:py-5 md:px-6 md:py-6">
        <CardTitle className="text-base sm:text-lg">Recent Activity</CardTitle>
        <Button asChild variant="ghost" size="sm">
          <Link href="/submissions">View All</Link>
        </Button>
      </CardHeader>
      <CardContent className="px-4 pb-4 sm:px-5 sm:pb-5 md:px-6 md:pb-6">
        <div className="space-y-3">
          {submissions.map((submission) => (
            <Link
              key={submission.id}
              href={`/dashboard/challenges/${submission.challengeSlug}`}
              className="block rounded-lg border border-slate-200 p-3 sm:p-4 transition-colors hover:bg-slate-50"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900 truncate">
                    {submission.challengeTitle}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {formatDate(submission.submittedAt)}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge
                    variant="outline"
                    className={STATUS_COLORS[submission.status]}
                  >
                    {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                  </Badge>
                  {submission.score !== null && (
                    <span className="text-sm font-medium text-slate-700">
                      Score: {submission.score}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
