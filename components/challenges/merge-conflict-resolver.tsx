'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';
import type {
  MergeConflictScenario,
  MergeConflictResolution,
  MergeConflictScenarioResponse
} from '@/types/challenges';

interface MergeConflictResolverProps {
  scenarios: MergeConflictScenario[];
  onComplete: (responses: MergeConflictScenarioResponse[]) => void;
  value?: string;
  onChange?: (value: string) => void;
  isSubmitting?: boolean;
}

export function MergeConflictResolver({
  scenarios,
  onComplete,
  value,
  onChange,
  isSubmitting = false
}: MergeConflictResolverProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<MergeConflictScenarioResponse[]>([]);
  const [selected, setSelected] = useState<MergeConflictResolution | null>(null);

  const current = scenarios[currentIndex];
  const isLast = currentIndex === scenarios.length - 1;
  const progress = ((currentIndex + 1) / scenarios.length) * 100;

  useEffect(() => {
    if (onChange) {
      onChange(JSON.stringify({ scenarios: responses }));
    }
  }, [responses, onChange]);

  const handleNext = () => {
    if (!selected) return;

    const newResponse: MergeConflictScenarioResponse = {
      id: current.id,
      selected,
      timeSpent: 0
    };

    const updated = [...responses, newResponse];
    setResponses(updated);

    if (isLast) {
      const finalData = JSON.stringify({ scenarios: updated });
      if (onChange) {
        onChange(finalData);
      }
      onComplete(updated);
    } else {
      setCurrentIndex(currentIndex + 1);
      setSelected(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            Question {currentIndex + 1} of {scenarios.length}
          </span>
          <span className="text-sm font-medium text-sky-600">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-blue-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Git Merge Conflict Scenario
        </h2>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
          <p className="text-gray-700 leading-relaxed">{current.context}</p>
        </div>
        <p className="text-lg text-gray-800 font-medium">
          {current.description}
        </p>
      </div>

      {/* Code Preview */}
      <div className="mb-8 space-y-4">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-5 rounded-r-lg">
          <div className="text-xs font-semibold text-green-700 mb-2 uppercase tracking-wide">
            {current.currentBranch}
          </div>
          <div className="font-mono text-sm text-gray-800 whitespace-pre-wrap break-all">
            {current.currentCode}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 p-5 rounded-r-lg">
          <div className="text-xs font-semibold text-blue-700 mb-2 uppercase tracking-wide">
            {current.incomingBranch}
          </div>
          <div className="font-mono text-sm text-gray-800 whitespace-pre-wrap break-all">
            {current.incomingCode}
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          How should this conflict be resolved?
        </h3>
        <div className="space-y-3">
          <label
            className={`flex items-start p-5 border-2 rounded-xl cursor-pointer transition-all ${
              selected === 'accept_current'
                ? 'border-sky-500 bg-sky-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <input
              type="radio"
              name="resolution"
              checked={selected === 'accept_current'}
              onChange={() => setSelected('accept_current')}
              className="mt-1 w-5 h-5 text-sky-600"
            />
            <div className="ml-4">
              <div className="font-semibold text-gray-900 mb-1">
                Accept Current Change
              </div>
              <div className="text-sm text-gray-600">
                Keep changes from {current.currentBranch}
              </div>
            </div>
          </label>

          <label
            className={`flex items-start p-5 border-2 rounded-xl cursor-pointer transition-all ${
              selected === 'accept_incoming'
                ? 'border-sky-500 bg-sky-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <input
              type="radio"
              name="resolution"
              checked={selected === 'accept_incoming'}
              onChange={() => setSelected('accept_incoming')}
              className="mt-1 w-5 h-5 text-sky-600"
            />
            <div className="ml-4">
              <div className="font-semibold text-gray-900 mb-1">
                Accept Incoming Change
              </div>
              <div className="text-sm text-gray-600">
                Keep changes from {current.incomingBranch}
              </div>
            </div>
          </label>

          <label
            className={`flex items-start p-5 border-2 rounded-xl cursor-pointer transition-all ${
              selected === 'accept_both'
                ? 'border-sky-500 bg-sky-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <input
              type="radio"
              name="resolution"
              checked={selected === 'accept_both'}
              onChange={() => setSelected('accept_both')}
              className="mt-1 w-5 h-5 text-sky-600"
            />
            <div className="ml-4">
              <div className="font-semibold text-gray-900 mb-1">
                Accept Both Changes
              </div>
              <div className="text-sm text-gray-600">
                Merge both sets of changes together
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Action Button */}
      <Button
        onClick={handleNext}
        disabled={!selected || isSubmitting}
        size="lg"
        className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 mr-3 animate-spin" />
            Submitting your answers...
          </>
        ) : isLast ? (
          <>
            <CheckCircle2 className="w-5 h-5 mr-3" />
            Submit All Answers
          </>
        ) : (
          <>
            Continue to Next Question
            <ChevronRight className="w-5 h-5 ml-3" />
          </>
        )}
      </Button>
    </div>
  );
}
