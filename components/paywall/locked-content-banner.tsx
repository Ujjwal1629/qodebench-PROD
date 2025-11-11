'use client';

import { useRouter } from 'next/navigation';
import { Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LockedContentBannerProps {
  message?: string;
  ctaText?: string;
  variant?: 'default' | 'destructive';
}

export function LockedContentBanner({
  message = 'This content requires a premium subscription',
  ctaText = 'Upgrade Now',
  variant = 'default',
}: LockedContentBannerProps) {
  const router = useRouter();

  return (
    <Alert
      variant={variant}
      className="border-primary/50 bg-gradient-to-r from-primary/10 to-accent/10"
    >
      <Lock className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span className="text-sm font-medium">{message}</span>
        <Button
          size="sm"
          variant="default"
          onClick={() => router.push('/pricing')}
          className="ml-4 gap-2"
        >
          {ctaText}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
}
