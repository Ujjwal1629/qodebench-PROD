'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Lightbulb, Loader2, AlertCircle, Crown } from 'lucide-react';
import Link from 'next/link';

interface HintSectionProps {
  challengeId: string;
  currentCode: string;
}

interface Hint {
  text: string;
  level: number;
}

export function HintSection({ challengeId, currentCode }: HintSectionProps) {
  const [hints, setHints] = useState<Hint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ message: string; requiresUpgrade: boolean } | null>(null);

  const getHint = async () => {
    setIsLoading(true);
    setError(null); // Clear previous errors
    try {
      const response = await fetch('/api/ai/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId,
          currentCode,
          hintsUsed: hints.length,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 429 && data.requiresUpgrade) {
          // Daily limit reached
          setError({ message: data.error, requiresUpgrade: true });
        } else {
          // Other errors
          setError({ message: data.error || 'Failed to get hint', requiresUpgrade: false });
        }
        return;
      }

      setHints([...hints, { text: data.hint, level: data.hintLevel }]);
    } catch (error) {
      console.error('Error getting hint:', error);
      setError({ message: 'Something went wrong. Please try again.', requiresUpgrade: false });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 rounded-lg border border-blue-200 bg-blue-50/50 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-slate-900">Need Help?</h3>
        </div>
        <Button
          onClick={getHint}
          disabled={isLoading || (error?.requiresUpgrade ?? false)}
          size="sm"
          className="gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Getting Hint...
            </>
          ) : (
            <>
              <Lightbulb className="h-4 w-4" />
              Get Hint ({hints.length + 1})
            </>
          )}
        </Button>
      </div>

      {/* Error Message Display */}
      {error && (
        <div className={`rounded-lg p-4 ${error.requiresUpgrade ? 'bg-amber-50 border border-amber-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex items-start gap-3">
            {error.requiresUpgrade ? (
              <Crown className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className={`text-sm font-medium ${error.requiresUpgrade ? 'text-amber-900' : 'text-red-900'} mb-1`}>
                {error.requiresUpgrade ? 'Daily AI Limit Reached' : 'Error'}
              </p>
              <p className={`text-sm ${error.requiresUpgrade ? 'text-amber-800' : 'text-red-800'}`}>
                {error.message}
              </p>
              {error.requiresUpgrade && (
                <Link href="/pricing">
                  <Button size="sm" variant="outline" className="mt-3 bg-white hover:bg-amber-50 border-amber-300">
                    <Crown className="h-4 w-4 mr-2" />
                    View Plans
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {hints.length === 0 && !error ? (
        <p className="text-sm text-slate-600">
          Stuck? Click the button above to get a helpful hint from your AI
          mentor!
        </p>
      ) : (
        <div className="space-y-3">
          {hints.map((hint, index) => (
            <div
              key={index}
              className="rounded-lg border border-blue-300 bg-white p-4"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                  Hint {hint.level}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-slate-700">
                {hint.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
