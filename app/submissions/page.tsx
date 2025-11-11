import { getRecentSubmissions } from '@/app/actions/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils/format';
import { STATUS_COLORS } from '@/lib/constants/dashboard';
import Link from 'next/link';
import { ArrowLeft, FileX2 } from 'lucide-react';

export const metadata = {
  title: 'All Submissions - QodeBench',
  description: 'View all your challenge submissions and results',
};

export default async function SubmissionsPage() {
  // Fetch all submissions (using a high limit)
  const submissions = await getRecentSubmissions(100);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl mt-14">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">All Submissions</h1>
          <p className="text-slate-600 mt-1">
            View your complete submission history
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/dashboard" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      {/* Submissions List */}
      {submissions.length === 0 ? (
        <Card>
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="rounded-full bg-slate-100 p-4">
                <FileX2 className="h-8 w-8 text-slate-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">No submissions yet</h3>
                <p className="text-slate-600 max-w-md">
                  Start solving challenges to see your submissions here
                </p>
              </div>
              <Button asChild className="mt-4">
                <Link href="/dashboard/challenges">Browse Challenges</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>
              {submissions.length} Submission{submissions.length !== 1 ? 's' : ''}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {submissions.map((submission) => (
                <Link
                  key={submission.id}
                  href={`/dashboard/challenges/${submission.challengeSlug}`}
                  className="block rounded-lg border border-slate-200 p-4 transition-all hover:bg-slate-50 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-900 truncate">
                        {submission.challengeTitle}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                        <span>{formatDate(submission.submittedAt)}</span>
                        {submission.hasFeedback && (
                          <>
                            <span className="text-slate-400">•</span>
                            <span className="text-primary">Has AI Feedback</span>
                          </>
                        )}
                      </div>
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
      )}
    </div>
  );
}
