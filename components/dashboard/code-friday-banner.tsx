'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Trophy, Users, Timer } from 'lucide-react';
import { WeeklyChallengeInfo } from '@/app/actions/dashboard';
import { isCodeFridayActive, getDaysUntilFriday } from '@/lib/constants/dashboard';

interface CodeFridayBannerProps {
  weeklyChallenge: WeeklyChallengeInfo | null;
}

export function CodeFridayBanner({ weeklyChallenge }: CodeFridayBannerProps) {
  const [timeRemaining, setTimeRemaining] = useState('');
  const isFridayActive = isCodeFridayActive();

  useEffect(() => {
    if (!weeklyChallenge) return;

    const updateTimer = () => {
      const now = new Date();
      const end = new Date(weeklyChallenge.endsAt);
      const diff = end.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining('Ended');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [weeklyChallenge]);

  if (!weeklyChallenge && !isFridayActive) {
    // Show countdown to next Friday
    const daysUntil = getDaysUntilFriday();
    return (
      <Card className="bg-gradient-to-r from-brand-500 to-brand-600">
        <CardContent className="p-4 sm:p-5 md:p-6">
          <div className="flex flex-col items-center gap-4 text-center text-white sm:flex-row sm:justify-between sm:text-left">
            <div>
              <h3 className="text-lg sm:text-xl font-bold">Code Friday is Coming!</h3>
              <p className="mt-1 text-sm sm:text-base text-brand-50">
                {daysUntil === 0
                  ? 'Tomorrow!'
                  : `${daysUntil} ${daysUntil === 1 ? 'day' : 'days'} until the next challenge`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span className="text-xs sm:text-sm font-medium">Check back Friday!</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weeklyChallenge) return null;

  const { challenge, userParticipation, totalParticipants } = weeklyChallenge;

  return (
    <Card className="overflow-hidden bg-gradient-to-r from-brand-500 to-brand-600">
      <CardContent className="p-4 sm:p-5 md:p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-white text-brand-600 hover:bg-white text-xs sm:text-sm">
                  Code Friday
                </Badge>
                <Badge variant="outline" className="border-white text-white text-xs sm:text-sm">
                  Live Now
                </Badge>
              </div>
              <h3 className="mt-2 text-xl sm:text-2xl font-bold text-white">
                {challenge?.title}
              </h3>
            </div>
            {timeRemaining && (
              <div className="flex items-center gap-2 rounded-lg bg-white/20 px-2.5 sm:px-3 py-1.5 sm:py-2 text-white">
                <Timer className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm font-medium">{timeRemaining}</span>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-white">
              <Users className="h-5 w-5" />
              <span className="text-sm">
                {totalParticipants} {totalParticipants === 1 ? 'participant' : 'participants'}
              </span>
            </div>
            {userParticipation?.hasParticipated && userParticipation.rank && (
              <div className="flex items-center gap-2 text-white">
                <Trophy className="h-5 w-5" />
                <span className="text-sm">
                  Your rank: #{userParticipation.rank}
                </span>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              asChild
              className="bg-white text-brand-600 hover:bg-brand-50"
            >
              <Link href={`/dashboard/challenges/${challenge?.slug}`}>
                {userParticipation?.hasParticipated ? 'View Challenge' : 'Join Challenge'}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              <Link href="/dashboard/challenges">Browse All Challenges</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
