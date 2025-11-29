'use client';

import { useState, useEffect } from 'react';
import { getGreetingMessage, getMotivationalSubtitle } from '@/lib/constants/dashboard';
import { Sparkles, Calendar } from 'lucide-react';

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

  // Get time-based gradient
  const hour = currentTime.getHours();
  let gradientClass = 'from-blue-500 via-purple-500 to-pink-500'; // Default (morning)
  let bgPattern = 'from-blue-50 to-purple-50';

  if (hour >= 12 && hour < 17) {
    // Afternoon - warm golden tones
    gradientClass = 'from-orange-400 via-pink-500 to-purple-500';
    bgPattern = 'from-orange-50 to-pink-50';
  } else if (hour >= 17 && hour < 21) {
    // Evening - sunset tones
    gradientClass = 'from-purple-500 via-pink-500 to-rose-500';
    bgPattern = 'from-purple-50 to-pink-50';
  } else if (hour >= 21 || hour < 5) {
    // Night - deep blue tones
    gradientClass = 'from-indigo-600 via-purple-600 to-blue-600';
    bgPattern = 'from-indigo-50 to-blue-50';
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${bgPattern} border border-slate-200/50 shadow-sm`}>
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />

      {/* Animated gradient orbs */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-brand-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-700" />

      {/* Content */}
      <div className="relative p-6 sm:p-8">
        <div className="space-y-3">
          {/* Greeting with animated wave */}
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent pb-2">
              {greeting}, {username}
            </h1>
            <span className="text-3xl sm:text-4xl inline-block animate-wave origin-[70%_70%]">
              👋
            </span>
          </div>

          {/* Date with icon */}
          <div className="flex items-center gap-2 text-slate-600">
            <Calendar className="w-4 h-4 text-brand-500" />
            <span className="font-medium text-sm sm:text-base">
              {day}, {date}
            </span>
          </div>

          {/* Motivational subtitle with sparkles */}
          <div className="flex items-start gap-2 max-w-2xl">
            <Sparkles className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5 animate-pulse" />
            <p className="text-base sm:text-lg text-slate-700 font-medium">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Bottom accent line */}
        <div className={`mt-6 h-1 w-full rounded-full bg-gradient-to-r ${gradientClass} opacity-60`} />
      </div>
    </div>
  );
}
