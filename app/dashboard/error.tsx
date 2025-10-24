'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console for debugging
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[600px] items-center justify-center">
      <Card className="max-w-md">
        <CardContent className="p-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">
                Something went wrong!
              </h2>
              <p className="text-slate-600">
                We encountered an error while loading your dashboard. Please try again.
              </p>
              {error.digest && (
                <p className="text-xs text-slate-500">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={reset}>Try Again</Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = '/')}
              >
                Go Home
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
