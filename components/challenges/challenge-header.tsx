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
  mobileInfoButton?: React.ReactNode;
}

export function ChallengeHeader({ challenge, mobileInfoButton }: ChallengeHeaderProps) {
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
    <header className="border-b border-gray-200 bg-white px-4 sm:px-6 py-3 sm:py-4">
      {/* Mobile Layout - Stacked */}
      <div className="lg:hidden space-y-3">
        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(getBackUrl())}
          className="text-gray-600 hover:text-gray-900 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Challenges
        </Button>

        {/* Title with Info Button */}
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-base sm:text-lg font-semibold text-gray-900 leading-tight flex-1">
            {challenge.title}
          </h1>
          {mobileInfoButton}
        </div>

        {/* Stats - Horizontal on mobile */}
        <div className="flex items-center gap-2 flex-wrap text-sm text-gray-600">
          <span className="px-2 py-1 bg-slate-100 border border-gray-300 rounded text-xs font-medium">
            {getDifficultyLabel()}
          </span>
          <span className="flex items-center gap-1 px-2 py-1 bg-slate-50 rounded text-xs">
            <Award className="h-3 w-3" />
            {challenge.points} pts
          </span>
          {challenge.estimated_time && (
            <span className="flex items-center gap-1 px-2 py-1 bg-slate-50 rounded text-xs">
              <Clock className="h-3 w-3" />
              ~{challenge.estimated_time} min
            </span>
          )}
        </div>
      </div>

      {/* Desktop Layout - Single row */}
      <div className="hidden lg:flex items-center justify-between">
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

        {/* Center: Title */}
        <h1 className="text-lg font-medium text-gray-900 truncate max-w-md">
          {challenge.title}
        </h1>

        {/* Right: Stats */}
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
