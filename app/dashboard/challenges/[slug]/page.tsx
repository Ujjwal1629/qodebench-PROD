import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getChallengeById, checkChallengeUnlocked } from '@/app/actions/challenges';
import { ChallengeWorkspace } from '@/components/challenges/challenge-workspace';
import { AdvancedChallengeOverview } from '@/components/challenges/advanced-challenge-overview';
import { ProductPlanningOverview } from '@/components/challenges/product-planning-overview';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { canAccessChallenge } from '@/lib/utils/subscription-check';
import { UpgradeRequired } from '@/components/paywall/upgrade-required';
import type { ChallengeTier } from '@/lib/constants/dashboard';

interface ChallengePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ChallengePageProps): Promise<Metadata> {
  const { slug } = await params;
  const challenge = await getChallengeById(slug);

  if (!challenge) {
    return {
      title: 'Challenge Not Found | QodeBench',
    };
  }

  return {
    title: `${challenge.title} | QodeBench`,
    description: challenge.description || 'Coding challenge on QodeBench',
  };
}

export default async function ChallengePage({ params }: ChallengePageProps) {
  const { slug } = await params;
  const challenge = await getChallengeById(slug);

  if (!challenge) {
    notFound();
  }

  // SUBSCRIPTION CHECK: Verify user can access this specific challenge
  const accessCheck = await canAccessChallenge(challenge.id);

  if (!accessCheck.canAccess && accessCheck.requiresUpgrade) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/challenges">
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

  // Check if challenge is unlocked (progression-based)
  const unlockStatus = await checkChallengeUnlocked(challenge.id);

  // If locked, show unlock requirement
  if (!unlockStatus.isUnlocked) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <Card className="border-2 border-amber-200 bg-amber-50">
          <CardContent className="p-8 text-center space-y-6">
            {/* Lock Icon */}
            <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
              <Lock className="h-8 w-8 text-amber-600" />
            </div>

            {/* Title */}
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                Challenge Locked
              </h1>
              <p className="text-lg font-semibold text-slate-700">
                {challenge.title}
              </p>
            </div>

            {/* Unlock Requirement */}
            <div className="bg-white rounded-lg p-4 border border-amber-200">
              <p className="text-sm font-medium text-amber-900 mb-2">
                Unlock Requirement
              </p>
              <p className="text-slate-700">
                {unlockStatus.reason || 'Complete previous challenges to unlock this one'}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button asChild variant="outline">
                <Link href="/dashboard/challenges">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Challenges
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // For advanced challenges, show the overview page first
  if (challenge.tier === 'advanced') {
    return <AdvancedChallengeOverview challenge={challenge} />;
  }

  // For product planning challenges, show the overview page first
  if (challenge.tier === 'product-planning') {
    return <ProductPlanningOverview challenge={challenge} />;
  }

  return <ChallengeWorkspace challenge={challenge} />;
}
