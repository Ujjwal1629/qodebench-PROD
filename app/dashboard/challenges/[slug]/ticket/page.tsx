import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getChallengeById, checkChallengeUnlocked } from '@/app/actions/challenges';
import { canAccessChallenge } from '@/lib/utils/subscription-check';
import { UpgradeRequired } from '@/components/paywall/upgrade-required';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Zap, Building2 } from 'lucide-react';
import { JiraTicket } from '@/components/challenges/jira-ticket';
import type { AdvancedChallengeMetadata } from '@/types/challenges';

interface TicketPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: TicketPageProps): Promise<Metadata> {
  const { slug } = await params;
  const challenge = await getChallengeById(slug);

  if (!challenge) {
    return {
      title: 'Challenge Not Found | QodeBench',
    };
  }

  return {
    title: `Jira Ticket: ${challenge.title} | QodeBench`,
    description: 'Challenge ticket details',
  };
}

// Default metadata for advanced challenges (will be replaced by DB data)
const getDefaultMetadata = (challenge: any): AdvancedChallengeMetadata => {
  return {
    ticketId: `CB-ADV-${String(challenge.order || 1).padStart(3, '0')}`,
    ctoMessage: `This is a critical issue affecting our production environment.`,
    ctoName: 'Sarah Chen',
    ctoRole: 'Chief Technology Officer',
    impact: 'High',
    urgency: 'P2',
    affectedModules: ['API', 'Authentication', 'Database'],
    stepsToReproduce: [
      'Navigate to the affected module',
      'Trigger the action that causes the issue',
      'Observe the error or unexpected behavior',
    ],
    expectedBehavior: 'The system should handle the operation correctly without errors.',
    actualBehavior: 'The system throws an error or produces incorrect results.',
    acceptanceCriteria: [
      'All existing tests pass',
      'New tests cover the edge cases',
      'No regression in related functionality',
      'Code follows our style guide',
    ],
    sampleRequest: `{
  "method": "POST",
  "endpoint": "/api/example",
  "body": {
    "id": "123",
    "data": "sample"
  }
}`,
    sampleResponse: `{
  "status": 200,
  "data": {
    "result": "success",
    "id": "123"
  }
}`,
    architectureNotes: `This module is part of the core API layer. Changes here may affect:
- User authentication flow
- Data validation pipeline
- Response serialization

Please ensure backward compatibility with existing clients.`,
    seniorHint: 'Consider the edge cases when the input is null or undefined. Also check for race conditions in async operations.',
    learningObjectives: challenge.learning_objectives || [],
    exampleTestCases: [
      {
        input: '{ "id": "valid-123" }',
        expected: '{ "status": "success" }',
        description: 'Valid input returns success',
      },
      {
        input: '{ "id": null }',
        expected: '{ "error": "Invalid ID" }',
        description: 'Null input returns error',
      },
    ],
  };
};

export default async function TicketPage({ params }: TicketPageProps) {
  const { slug } = await params;
  const challenge = await getChallengeById(slug);

  if (!challenge) {
    notFound();
  }

  // Only allow advanced challenges to access this page
  if (challenge.tier !== 'advanced') {
    redirect(`/dashboard/challenges/${slug}`);
  }

  // Subscription check
  const accessCheck = await canAccessChallenge(challenge.id);

  if (!accessCheck.canAccess && accessCheck.requiresUpgrade) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/challenges/advanced">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Advanced Challenges
            </Link>
          </Button>
        </div>
        <UpgradeRequired
          title="Premium Challenge"
          description="This advanced challenge requires a premium subscription to unlock"
          feature={challenge.title}
          reason={accessCheck.reason}
        />
      </div>
    );
  }

  // Check if challenge is unlocked
  const unlockStatus = await checkChallengeUnlocked(challenge.id);

  if (!unlockStatus.isUnlocked) {
    redirect(`/dashboard/challenges/${slug}`);
  }

  // Get metadata (use defaults for now - can be extended to read from DB later)
  const metadata: AdvancedChallengeMetadata = getDefaultMetadata(challenge);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Back Navigation */}
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm" className="gap-2 text-slate-600">
            <Link href={`/dashboard/challenges/${slug}/brief`}>
              <ArrowLeft className="h-4 w-4" />
              Back to CTO Brief
            </Link>
          </Button>
        </div>

        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="bg-brand-50 text-brand-700 border-brand-200">
              <Zap className="h-3 w-3 mr-1" />
              Advanced Challenge
            </Badge>
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
              <Building2 className="h-3 w-3 mr-1" />
              Office Simulation
            </Badge>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Jira Ticket</h1>
        </div>

        {/* Jira Ticket Content */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
          <JiraTicket
            ticketId={metadata.ticketId}
            title={challenge.title}
            description={challenge.description}
            metadata={metadata}
          />
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <Button asChild size="lg" className="bg-brand-600 hover:bg-brand-700 text-white gap-2">
            <Link href={`/dashboard/challenges/${slug}/workspace`}>
              Go to Workspace
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
