'use client';

import { useState, useEffect } from 'react';
import { getGreetingMessage, getMotivationalSubtitle } from '@/lib/constants/dashboard';

interface WelcomeHeaderProps {
  username: string;
  stats?: {
    challengesCompleted: number;
    currentStreak: number;
    totalPoints: number;
  };
}

export function WelcomeHeader({ username, stats }: WelcomeHeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time on client-side mount and every minute
  useEffect(() => {
    // Set initial time
    setCurrentTime(new Date());

    // Update every minute to keep greeting accurate
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every 60 seconds

    return () => clearInterval(interval);
  }, []);

  // Format day and date using client-side time
  const day = currentTime.toLocaleDateString('en-US', { weekday: 'long' });
  const date = currentTime.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const greeting = getGreetingMessage();
  const subtitle = getMotivationalSubtitle(stats);

  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl flex items-center gap-2 flex-wrap">
        <span>{greeting}, {username}</span>
        <span className="inline-block animate-wave origin-[70%_70%]">👋</span>
      </h1>
      <div className="flex flex-col gap-1 text-sm text-slate-600 sm:flex-row sm:items-center sm:gap-2">
        <span className="font-medium">{day}</span>
        <span className="hidden sm:inline">•</span>
        <span>{date}</span>
      </div>
      <p className="text-base text-slate-700 sm:text-lg">{subtitle}</p>
    </div>
  );
}
