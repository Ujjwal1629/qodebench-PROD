'use client';

import { useRouter } from 'next/navigation';
import { Clock, TrendingUp, Infinity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { FREE_TIER_LIMITS } from '@/types/subscription';

interface DailyLimitReachedProps {
  type: 'attempts' | 'ai_feedback';
  used: number;
  limit: number;
  resetTime?: string;
  className?: string;
}

export function DailyLimitReached({
  type,
  used,
  limit,
  resetTime,
  className,
}: DailyLimitReachedProps) {
  const router = useRouter();

  const progressPercentage = (used / limit) * 100;

  const limitInfo = {
    attempts: {
      title: 'Daily Attempts Limit Reached',
      description: `You've used all ${limit} challenge attempts for today`,
      icon: Clock,
    },
    ai_feedback: {
      title: 'Daily AI Feedback Limit Reached',
      description: `You've used all ${limit} AI feedback requests for today`,
      icon: TrendingUp,
    },
  };

  const info = limitInfo[type];

  // Calculate time until reset
  const getTimeUntilReset = () => {
    if (!resetTime) return 'tomorrow';

    const now = new Date();
    const reset = new Date(resetTime);
    const diff = reset.getTime() - now.getTime();

    if (diff <= 0) return 'soon';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <Card className={className}>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10">
          <info.icon className="h-8 w-8 text-amber-500" />
        </div>
        <CardTitle className="text-2xl">{info.title}</CardTitle>
        <CardDescription className="text-base">
          {info.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Usage Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Today's Usage</span>
            <span className="font-medium">
              {used} / {limit}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Reset Info */}
        <div className="rounded-lg bg-muted p-4">
          <p className="text-center text-sm">
            <span className="text-muted-foreground">Resets in: </span>
            <span className="font-semibold">{getTimeUntilReset()}</span>
          </p>
        </div>

        {/* Upgrade Benefits */}
        <div className="space-y-3">
          <h3 className="text-center font-semibold">
            Upgrade for Unlimited Access
          </h3>

          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Infinity className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">No Daily Limits</p>
                <p className="text-sm text-muted-foreground">
                  Practice as much as you want, get unlimited AI feedback
                </p>
              </div>
            </div>
          </div>

          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span>Unlimited challenge attempts</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span>Unlimited AI-powered hints and feedback</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span>Access to all interview prep features</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span>Advanced challenges and system design</span>
            </li>
          </ul>
        </div>

        {/* CTA */}
        <div className="space-y-2">
          <Button
            className="w-full"
            size="lg"
            onClick={() => router.push('/pricing')}
          >
            Upgrade to Premium
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Starting at ₹199 for 21-day launch offer • Cancel anytime
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
