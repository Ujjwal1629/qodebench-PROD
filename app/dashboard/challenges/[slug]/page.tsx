import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getChallengeById, checkChallengeUnlocked } from '@/app/actions/challenges';
import { ChallengeWorkspace } from '@/components/challenges/challenge-workspace';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

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

  // Check if challenge is unlocked
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

  return <ChallengeWorkspace challenge={challenge} />;
}
