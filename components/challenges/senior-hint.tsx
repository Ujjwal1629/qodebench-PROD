'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';

interface SeniorHintProps {
  hint: string;
}

export function SeniorHint({ hint }: SeniorHintProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <Card className="border border-amber-200 bg-amber-50/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-600" />
            <CardTitle className="text-sm font-semibold text-amber-900">
              Senior Developer Hint
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsRevealed(!isRevealed)}
            className="text-amber-700 hover:text-amber-900 hover:bg-amber-100"
          >
            {isRevealed ? (
              <>
                <EyeOff className="h-4 w-4 mr-1" />
                Hide
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-1" />
                Reveal
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      {isRevealed && (
        <CardContent>
          <p className="text-sm text-amber-800 leading-relaxed whitespace-pre-line">
            {hint}
          </p>
        </CardContent>
      )}

      {!isRevealed && (
        <CardContent>
          <p className="text-xs text-amber-600 italic">
            Click &quot;Reveal&quot; to see a hint from a senior developer. Try solving it yourself first!
          </p>
        </CardContent>
      )}
    </Card>
  );
}
