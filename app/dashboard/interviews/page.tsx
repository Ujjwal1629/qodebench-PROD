import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import InterviewHubNew from '@/components/interviews/interview-hub-new';
import { Skeleton } from '@/components/ui/skeleton';
import { canAccessInterviews } from '@/lib/utils/subscription-check';
import { UpgradeRequired } from '@/components/paywall/upgrade-required';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Full-Stack Interview Simulator | QodeBench',
  description: '6-Stage interview process with AI-powered evaluation and professional report',
};

export default async function InterviewsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/signin');
  }

  // SUBSCRIPTION CHECK: Verify user has access to interviews
  const accessCheck = await canAccessInterviews(user.id);

  if (!accessCheck.canAccess) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
        <UpgradeRequired
          title="Interview Prep Mode"
          description="Full-stack interview simulator with 6 comprehensive stages"
          feature="AI-Powered Interview Practice & Professional Reports"
          reason={accessCheck.reason}
        />
      </div>
    );
  }

  return (
    <Suspense fallback={<InterviewHubSkeleton />}>
      <InterviewHubNew userId={user.id} />
    </Suspense>
  );
}

function InterviewHubSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-6">
        <Skeleton className="h-32" />
        <div className="grid md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
        <Skeleton className="h-48" />
      </div>
    </div>
  );
}
