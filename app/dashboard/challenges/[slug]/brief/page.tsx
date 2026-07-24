import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getChallengeById, checkChallengeUnlocked } from '@/app/actions/challenges';
import { canAccessChallenge } from '@/lib/utils/subscription-check';
import { UpgradeRequired } from '@/components/paywall/upgrade-required';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Zap, Building2 } from 'lucide-react';
import { CtoMessageCard } from '@/components/challenges/cto-message-card';
import { ImpactSummaryCard } from '@/components/challenges/impact-summary-card';
import type { AdvancedChallengeMetadata } from '@/types/challenges';

interface BriefPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: BriefPageProps): Promise<Metadata> {
  const { slug } = await params;
  const challenge = await getChallengeById(slug);

  if (!challenge) {
    return {
      title: 'Challenge Not Found | QodeBench',
    };
  }

  return {
    title: `CTO Brief: ${challenge.title} | QodeBench`,
    description: 'Challenge briefing from the CTO',
  };
}

// Default metadata for advanced challenges (will be replaced by DB data)
const getDefaultMetadata = (challenge: any): AdvancedChallengeMetadata => {
  return {
    ticketId: `CB-ADV-${String(challenge.order || 1).padStart(3, '0')}`,
    ctoMessage: `This is a critical issue affecting our production environment. We need a quick turnaround on this fix.

The team has identified the root cause but we need someone to implement the solution properly. Please review the Jira ticket carefully and make sure to follow our coding standards.

Let me know if you have any questions or need clarification on the requirements.`,
    ctoName: 'Sarah Chen',
    ctoRole: 'Chief Technology Officer',
    impact: 'High',
    urgency: 'P2',
    affectedModules: ['API', 'Authentication', 'Database'],
    stepsToReproduce: [
      'Step 1: Navigate to the affected module',
      'Step 2: Trigger the action that causes the issue',
      'Step 3: Observe the error or unexpected behavior',
    ],
    expectedBehavior: 'The system should handle the operation correctly without errors.',
    actualBehavior: 'The system throws an error or produces incorrect results.',
    acceptanceCriteria: [
      'All existing tests pass',
      'New tests cover the edge cases',
      'No regression in related functionality',
      'Code follows our style guide',
    ],
    architectureNotes: 'Please ensure changes are backward compatible.',
    seniorHint: 'Consider the edge cases when the input is null or undefined.',
    learningObjectives: challenge.learning_objectives || [],
    exampleTestCases: [
      {
        input: 'validInput',
        expected: 'expectedOutput',
        description: 'Basic happy path test',
      },
      {
        input: 'edgeCaseInput',
        expected: 'edgeCaseOutput',
        description: 'Edge case handling',
      },
    ],
  };
};

export default async function BriefPage({ params }: BriefPageProps) {
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
            <Link href={`/dashboard/challenges/${slug}`}>
              <ArrowLeft className="h-4 w-4" />
              Back to Overview
            </Link>
          </Button>
        </div>

        {/* Page Header */}
        <div className="mb-8">
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
          <h1 className="text-2xl font-bold text-slate-900 mb-2">{challenge.title}</h1>
          <p className="text-slate-600">Briefing from the CTO</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: CTO Message */}
          <div className="lg:col-span-2">
            <CtoMessageCard
              ctoName={metadata.ctoName}
              ctoRole={metadata.ctoRole}
              message={metadata.ctoMessage}
            />
          </div>

          {/* Right: Impact Summary */}
          <div className="lg:col-span-1">
            <ImpactSummaryCard
              impact={metadata.impact}
              urgency={metadata.urgency}
              affectedModules={metadata.affectedModules}
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-10 flex justify-center">
          <Button asChild size="lg" className="bg-brand-600 hover:bg-brand-700 text-white gap-2">
            <Link href={`/dashboard/challenges/${slug}/ticket`}>
              Continue to Jira Ticket
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
