'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Eye, ArrowRight } from 'lucide-react';

interface SuccessMessageProps {
  points: number;
  onNext?: () => void;
  onViewSolution?: () => void;
  autoDismiss?: boolean;
}

export function SuccessMessage({
  points,
  onNext,
  onViewSolution,
  autoDismiss = false,
}: SuccessMessageProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoDismiss) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss]);

  if (!visible) return null;

  return (
    <div className="px-6 py-4 bg-green-50 border-l-4 border-green-600">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
          <span className="text-sm font-medium text-gray-900">
            Challenge Completed • +{points} points
          </span>
        </div>
        <div className="flex items-center gap-3">
          {onViewSolution && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onViewSolution}
              className="text-gray-700 hover:text-gray-900"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Solution
            </Button>
          )}
          {onNext && (
            <Button
              size="sm"
              onClick={onNext}
              className="bg-sky-500 hover:bg-sky-600"
            >
              Next Challenge
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
