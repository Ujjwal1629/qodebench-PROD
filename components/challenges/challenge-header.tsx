'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Award } from 'lucide-react';

interface ChallengeHeaderProps {
  challenge: {
    id: string;
    title: string;
    difficulty: string;
    points: number;
    estimated_time?: number;
    tier?: string;
  };
}

export function ChallengeHeader({ challenge }: ChallengeHeaderProps) {
  const router = useRouter();

  const getDifficultyLabel = () => {
    switch (challenge.difficulty?.toLowerCase()) {
      case 'easy':
        return 'Easy';
      case 'medium':
        return 'Medium';
      case 'hard':
        return 'Hard';
      default:
        return challenge.difficulty || 'Medium';
    }
  };

  const getBackUrl = () => {
    const tier = challenge.tier?.toLowerCase();
    switch (tier) {
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
  };

  return (
    <header className="border-b border-gray-200 bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Back button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(getBackUrl())}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Challenges
        </Button>

        {/* Center: Title - Responsive truncation */}
        <h1 className="text-lg font-medium text-gray-900 line-clamp-2 sm:line-clamp-1 sm:truncate sm:max-w-md">
          {challenge.title}
        </h1>

        {/* Right: Stats (minimal badges) */}
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <span className="px-2 py-1 border border-gray-300 rounded-sm text-xs font-medium">
            {getDifficultyLabel()}
          </span>
          <span className="flex items-center gap-1">
            <Award className="h-3 w-3" />
            {challenge.points} pts
          </span>
          {challenge.estimated_time && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              ~{challenge.estimated_time} min
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
