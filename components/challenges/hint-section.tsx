'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Lightbulb, Loader2 } from 'lucide-react';

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

  const getHint = async () => {
    setIsLoading(true);
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

      if (!response.ok) {
        throw new Error('Failed to get hint');
      }

      const data = await response.json();
      setHints([...hints, { text: data.hint, level: data.hintLevel }]);
    } catch (error) {
      console.error('Error getting hint:', error);
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
          disabled={isLoading}
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

      {hints.length === 0 ? (
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
