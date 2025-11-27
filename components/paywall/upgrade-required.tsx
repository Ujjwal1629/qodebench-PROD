'use client';

import { useRouter } from 'next/navigation';
import { Lock, Sparkles, Zap, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface UpgradeRequiredProps {
  title?: string;
  description?: string;
  feature?: string;
  reason?: string;
  className?: string;
}

export function UpgradeRequired({
  title = 'Premium Feature',
  description = 'This feature is available for premium subscribers',
  feature,
  reason,
  className,
}: UpgradeRequiredProps) {
  const router = useRouter();

  const benefits = [
    {
      icon: Zap,
      title: 'Unlimited Access',
      description: 'All challenges and interview prep',
    },
    {
      icon: Sparkles,
      title: 'AI-Powered Feedback',
      description: 'Unlimited AI hints and evaluations',
    },
    {
      icon: Crown,
      title: 'Advanced Features',
      description: 'System design, coding interviews & more',
    },
  ];

  return (
    <Card className={className}>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Lock className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription className="text-base">
          {description}
        </CardDescription>
        {reason && (
          <p className="mt-2 text-sm text-muted-foreground">{reason}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {feature && (
          <div className="rounded-lg bg-muted p-4">
            <p className="text-center text-sm font-medium">
              Unlock: <span className="text-primary">{feature}</span>
            </p>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-center font-semibold">
            Upgrade to Premium and get:
          </h3>
          <div className="space-y-3">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-primary/10 p-2">
                  <benefit.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{benefit.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Button
            className="w-full"
            size="lg"
            onClick={() => router.push('/pricing')}
          >
            View Pricing Plans
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Starting at just ₹199 for 21-day launch offer
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
