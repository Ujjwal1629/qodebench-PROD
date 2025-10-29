'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function AssessmentBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-sky-50">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className="rounded-lg bg-blue-100 p-2.5 flex-shrink-0">
            <Brain className="h-5 w-5 text-blue-600" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 text-sm sm:text-base">
              Take the Skill Assessment
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Complete a quick 2-minute quiz to get personalized challenge recommendations based on your skill level
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button asChild size="sm" className="hidden sm:flex">
              <Link href="/onboarding/quiz">
                Take Assessment
              </Link>
            </Button>
            <Button asChild size="sm" className="sm:hidden">
              <Link href="/onboarding/quiz">
                Start
              </Link>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setDismissed(true)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Dismiss</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
