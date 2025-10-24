import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getChallengeById } from '@/app/actions/challenges';
import { ChallengeWorkspace } from '@/components/challenges/challenge-workspace';

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

  return <ChallengeWorkspace challenge={challenge} />;
}
