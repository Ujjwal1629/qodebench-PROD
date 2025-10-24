import { getCurrentDayInfo } from '@/lib/utils/format';
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
  const { day, date } = getCurrentDayInfo();
  const greeting = getGreetingMessage();
  const subtitle = getMotivationalSubtitle(stats);

  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
        {greeting}, {username}!
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
