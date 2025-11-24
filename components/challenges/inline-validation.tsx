'use client';

import { useState } from 'react';
import { ChevronRight, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface ValidationResult {
  passed: boolean;
  score: number;
  strengths?: string[];
  improvements?: Array<string | { text: string; line?: number }>;
  suggestions?: string[];
  structureScore?: number;
  qualityScore?: number;
  pointsEarned?: number;
}

interface InlineValidationProps {
  result: ValidationResult;
}

export function InlineValidation({ result }: InlineValidationProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm font-medium text-gray-900 w-full hover:text-gray-700 transition-colors"
      >
        <ChevronRight
          className={`h-4 w-4 transition-transform ${expanded ? 'rotate-90' : ''}`}
        />
        Validation Results
        <span className="ml-auto text-gray-600">
          Score: {result.score}/100
        </span>
      </button>

      {expanded && (
        <div className="mt-4 space-y-2 text-sm">
          {/* Success items */}
          {result.strengths && result.strengths.length > 0 && (
            <>
              {result.strengths.map((item, index) => (
                <div key={`strength-${index}`} className="flex items-start gap-2 text-gray-700">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </>
          )}

          {/* Error items */}
          {result.improvements && result.improvements.length > 0 && (
            <>
              {result.improvements.map((item, index) => (
                <div key={`improvement-${index}`} className="flex items-start gap-2 text-gray-700">
                  <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>{typeof item === 'string' ? item : item.text}</span>
                </div>
              ))}
            </>
          )}

          {/* Warning items */}
          {result.suggestions && result.suggestions.length > 0 && (
            <>
              {result.suggestions.map((item, index) => (
                <div key={`suggestion-${index}`} className="flex items-start gap-2 text-gray-700">
                  <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </>
          )}

          {/* Score breakdown */}
          <div className="pt-3 border-t border-gray-200 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Final Score:</span>
              <span className="font-medium text-gray-900">{result.score}/100</span>
              {result.passed && (
                <span className="text-green-600 font-medium">• Passed</span>
              )}
            </div>
            {result.structureScore !== undefined && result.qualityScore !== undefined && (
              <div className="text-xs text-gray-600 space-y-0.5">
                <div>Structure: {result.structureScore}/50</div>
                <div>Quality: {result.qualityScore}/50</div>
              </div>
            )}
            {result.pointsEarned && (
              <div className="text-gray-600">
                Points Earned: +{result.pointsEarned}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
