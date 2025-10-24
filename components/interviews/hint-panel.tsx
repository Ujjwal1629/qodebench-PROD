'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getHint } from '@/app/actions/interviews';
import { Lightbulb, Lock, AlertTriangle, Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface HintPanelProps {
  sessionId: string;
  questionId: string;
}

export default function HintPanel({ sessionId, questionId }: HintPanelProps) {
  const queryClient = useQueryClient();
  const [hints, setHints] = useState<Array<{ level: number; text: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [pendingHintLevel, setPendingHintLevel] = useState<number | null>(null);

  const requestHint = async (level: number) => {
    setPendingHintLevel(level);
    setShowWarning(true);
  };

  const confirmHint = async () => {
    if (pendingHintLevel === null) return;

    setIsLoading(true);
    setShowWarning(false);

    const result = await getHint({
      sessionId,
      questionId,
      hintLevel: pendingHintLevel,
    });

    if (result.error) {
      alert(result.error);
    } else if (result.data) {
      setHints([...hints, { level: pendingHintLevel, text: result.data.hint_text }]);

      // Refetch session to update hints_used count
      queryClient.invalidateQueries({ queryKey: ['interview-session', sessionId] });
    }

    setIsLoading(false);
    setPendingHintLevel(null);
  };

  const cancelHint = () => {
    setShowWarning(false);
    setPendingHintLevel(null);
  };

  const getHintLevelInfo = (level: number) => {
    switch (level) {
      case 1:
        return {
          label: 'Small Hint',
          description: 'General direction',
          penalty: '5%',
          color: 'bg-yellow-500',
        };
      case 2:
        return {
          label: 'Medium Hint',
          description: 'More specific guidance',
          penalty: '5%',
          color: 'bg-orange-500',
        };
      case 3:
        return {
          label: 'Big Hint',
          description: 'Detailed approach',
          penalty: '5%',
          color: 'bg-red-500',
        };
      default:
        return {
          label: 'Hint',
          description: '',
          penalty: '5%',
          color: 'bg-slate-500',
        };
    }
  };

  const isHintRevealed = (level: number) => {
    return hints.some((h) => h.level === level);
  };

  const canRequestHint = (level: number) => {
    // Can only request next hint in sequence
    if (level === 1) return true;
    return isHintRevealed(level - 1);
  };

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-5 w-5 text-yellow-600" />
          <h3 className="font-semibold">Need Help?</h3>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Get progressive hints if you&apos;re stuck. Each hint reduces your score by 5%.
        </p>

        <div className="space-y-3">
          {[1, 2, 3].map((level) => {
            const hintInfo = getHintLevelInfo(level);
            const revealed = isHintRevealed(level);
            const canRequest = canRequestHint(level);
            const hintData = hints.find((h) => h.level === level);

            return (
              <div key={level}>
                {!revealed ? (
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => requestHint(level)}
                    disabled={!canRequest || isLoading}
                  >
                    {canRequest ? (
                      <Lightbulb className="h-4 w-4" />
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                    <span className="flex-1 text-left">
                      {hintInfo.label}
                      <span className="text-xs text-muted-foreground ml-2">
                        (-{hintInfo.penalty} score)
                      </span>
                    </span>
                  </Button>
                ) : (
                  <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`h-2 w-2 rounded-full ${hintInfo.color}`} />
                      <p className="text-xs font-medium text-yellow-900">{hintInfo.label}</p>
                    </div>
                    <p className="text-sm text-yellow-900">{hintData?.text}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {hints.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <span className="text-muted-foreground">
                Score penalty: <strong className="text-orange-600">-{hints.length * 5}%</strong>
              </span>
            </div>
          </div>
        )}
      </Card>

      {/* Warning Dialog */}
      <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Request a Hint?
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                {pendingHintLevel && (
                  <>
                    <p>
                      You are about to request a{' '}
                      <strong>{getHintLevelInfo(pendingHintLevel).label}</strong> which will provide{' '}
                      {getHintLevelInfo(pendingHintLevel).description.toLowerCase()}.
                    </p>
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-sm text-orange-900">
                        <strong>Score Impact:</strong> This will reduce your final score for this
                        question by <strong>5%</strong>.
                      </p>
                    </div>
                    <p className="text-sm">
                      Consider taking a moment to think through the problem before requesting a hint.
                    </p>
                  </>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelHint}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmHint}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Get Hint (-5% score)
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
