import { ChallengeCard } from './challenge-card';
import { ChallengeWithProgress } from '@/app/actions/challenges';

interface ContinueSectionProps {
  challenges: ChallengeWithProgress[];
}

export function ContinueSection({ challenges }: ContinueSectionProps) {
  if (challenges.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Continue Where You Left Off
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            {challenges.length} challenge{challenges.length !== 1 ? 's' : ''} in
            progress
          </p>
        </div>
      </div>

      {/* Grid of in-progress challenges */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {challenges.map((challenge) => (
          <ChallengeCard key={challenge.id} challenge={challenge} />
        ))}
      </div>
    </div>
  );
}
