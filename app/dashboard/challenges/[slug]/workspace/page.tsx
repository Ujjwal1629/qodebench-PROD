import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getChallengeById, checkChallengeUnlocked } from '@/app/actions/challenges';
import { canAccessChallenge } from '@/lib/utils/subscription-check';
import { UpgradeRequired } from '@/components/paywall/upgrade-required';
import { AdvancedWorkspace } from '@/components/challenges/advanced-workspace';
import { ProductPlanningWorkspace } from '@/components/challenges/product-planning-workspace';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { AdvancedChallengeMetadata, ProductPlanningMetadata } from '@/types/challenges';

// Helper function to get tier-specific back URL
function getBackUrl(tier: string | null): string {
  const tierLower = tier?.toLowerCase();
  switch (tierLower) {
    case 'beginner':
    case 'intermediate':
      // Both beginner and intermediate tiers are shown on Practical Coding Challenges page
      return '/dashboard/challenges/practical';
    case 'software-engineering-essentials':
      return '/dashboard/challenges/software-engineering-essentials';
    case 'advanced':
      return '/dashboard/challenges/advanced';
    case 'product_planning':
    case 'product-planning':
      return '/dashboard/challenges/product-planning';
    default:
      return '/dashboard/challenges';
  }
}

interface WorkspacePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: WorkspacePageProps): Promise<Metadata> {
  const { slug } = await params;
  const challenge = await getChallengeById(slug);

  if (!challenge) {
    return {
      title: 'Challenge Not Found | QodeBench',
    };
  }

  return {
    title: `Workspace: ${challenge.title} | QodeBench`,
    description: 'Challenge workspace',
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
    architectureNotes: 'Please ensure backward compatibility.',
    seniorHint: 'Consider the edge cases when the input is null or undefined. Also check for race conditions in async operations.',
    learningObjectives: challenge.learning_objectives || [
      'Understand debugging techniques',
      'Write production-ready code',
      'Handle edge cases properly',
    ],
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

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  const { slug } = await params;
  const challenge = await getChallengeById(slug);

  if (!challenge) {
    notFound();
  }

  // Only allow advanced and product-planning challenges to access this page
  if (challenge.tier !== 'advanced' && challenge.tier !== 'product-planning') {
    redirect(`/dashboard/challenges/${slug}`);
  }

  // Subscription check
  const accessCheck = await canAccessChallenge(challenge.id);

  if (!accessCheck.canAccess && accessCheck.requiresUpgrade) {
    const backUrl = getBackUrl(challenge.tier);
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm">
            <Link href={backUrl}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Challenges
            </Link>
          </Button>
        </div>
        <UpgradeRequired
          title="Premium Challenge"
          description="This challenge requires a premium subscription to unlock"
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

  // For product planning challenges, use different workspace
  if (challenge.tier === 'product-planning') {
    const productPlanningMetadata: ProductPlanningMetadata = {
      pmMessage: 'Please plan this feature carefully.',
      jiraSummary: 'Feature planning task',
      taskItems: [],
      learningObjectives: challenge.learning_objectives || [],
    };

    return <ProductPlanningWorkspace challenge={challenge} metadata={productPlanningMetadata} />;
  }

  return <AdvancedWorkspace challenge={challenge} metadata={metadata} />;
}
