'use client';

import { CheckCircle, XCircle, Trophy, TrendingUp } from 'lucide-react';

interface ValidationResultProps {
  result: {
    passed: boolean;
    score: number;
    comparedToPrevious?: string;
    codeChanges?: string;
    scoreChange?: number;
    scoreJustification?: string;
    strengths?: string[];
    improvements?: string[];
    codeQuality?: string;
    suggestions?: string[];
    pointsEarned?: number;
    maxPoints?: number;
  };
}

export function ValidationResult({ result }: ValidationResultProps) {
  const { passed, score, comparedToPrevious, codeChanges, scoreChange, scoreJustification, strengths, improvements, codeQuality, suggestions, pointsEarned, maxPoints } =
    result;

  return (
    <div className="space-y-4 rounded-lg border-2 border-slate-200 bg-white p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {passed ? (
            <CheckCircle className="h-8 w-8 text-green-600" />
          ) : (
            <XCircle className="h-8 w-8 text-orange-600" />
          )}
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {passed ? 'Great Work!' : 'Keep Going!'}
            </h3>
            <p className="text-sm text-slate-600">
              {passed
                ? 'Your solution passed validation'
                : 'Your solution needs some improvements'}
            </p>
          </div>
        </div>

        {/* Score Badge */}
        <div className="text-center">
          <div
            className={`rounded-full px-4 py-2 text-2xl font-bold ${
              score >= 80
                ? 'bg-green-100 text-green-700'
                : score >= 60
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-orange-100 text-orange-700'
            }`}
          >
            {score}
          </div>
          <p className="mt-1 text-xs text-slate-500">Score</p>
        </div>
      </div>

      {/* Points Earned */}
      {pointsEarned !== undefined && (
        <div className="flex items-center gap-2 rounded-lg bg-amber-50 p-3">
          <Trophy className="h-5 w-5 text-amber-600" />
          <span className="font-semibold text-amber-900">
            {pointsEarned} {maxPoints && `/ ${maxPoints}`} points earned
          </span>
        </div>
      )}

      {/* Comparison with Previous Attempts */}
      {comparedToPrevious && (
        <div className="space-y-3">
          <div className={`rounded-lg border p-4 ${
            scoreChange && scoreChange > 0
              ? 'bg-green-50 border-green-200'
              : scoreChange && scoreChange < 0
                ? 'bg-red-50 border-red-200'
                : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className={`flex items-center gap-2 font-semibold ${
                scoreChange && scoreChange > 0
                  ? 'text-green-900'
                  : scoreChange && scoreChange < 0
                    ? 'text-red-900'
                    : 'text-blue-900'
              }`}>
                📊 Compared to Previous Attempt
              </h4>
              {scoreChange !== undefined && scoreChange !== 0 && (
                <span className={`text-sm font-bold ${
                  scoreChange > 0 ? 'text-green-700' : 'text-red-700'
                }`}>
                  {scoreChange > 0 ? '+' : ''}{scoreChange} points
                </span>
              )}
              {scoreChange === 0 && (
                <span className="text-sm font-bold text-blue-700">
                  No change
                </span>
              )}
            </div>
            <p className={`text-sm leading-relaxed ${
              scoreChange && scoreChange > 0
                ? 'text-green-800'
                : scoreChange && scoreChange < 0
                  ? 'text-red-800'
                  : 'text-blue-800'
            }`}>
              {comparedToPrevious}
            </p>
          </div>

          {codeChanges && (
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
              <h4 className="mb-2 font-semibold text-slate-900">
                🔍 Code Changes Detected
              </h4>
              <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-line">
                {codeChanges}
              </p>
            </div>
          )}

          {scoreJustification && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
              <h4 className="mb-2 font-semibold text-amber-900">
                ⚖️ Why This Score?
              </h4>
              <p className="text-sm leading-relaxed text-amber-800">
                {scoreJustification}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Code Quality */}
      {codeQuality && (
        <div className="rounded-lg bg-slate-50 p-4">
          <h4 className="mb-2 flex items-center gap-2 font-semibold text-slate-900">
            <TrendingUp className="h-4 w-4" />
            Overall Assessment
          </h4>
          <p className="text-sm leading-relaxed text-slate-700">
            {codeQuality}
          </p>
        </div>
      )}

      {/* Strengths */}
      {strengths && strengths.length > 0 && (
        <div>
          <h4 className="mb-2 font-semibold text-green-700">
            ✓ What You Did Well
          </h4>
          <ul className="space-y-1.5">
            {strengths.map((strength, index) => (
              <li
                key={index}
                className="flex gap-2 text-sm text-slate-700"
              >
                <span className="text-green-600">•</span>
                {strength}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Improvements */}
      {improvements && improvements.length > 0 && (
        <div>
          <h4 className="mb-2 font-semibold text-orange-700">
            → Areas to Improve
          </h4>
          <ul className="space-y-1.5">
            {improvements.map((improvement, index) => (
              <li
                key={index}
                className="flex gap-2 text-sm text-slate-700"
              >
                <span className="text-orange-600">•</span>
                {improvement}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <div>
          <h4 className="mb-2 font-semibold text-blue-700">
            💡 Suggestions
          </h4>
          <ul className="space-y-1.5">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="flex gap-2 text-sm text-slate-700"
              >
                <span className="text-blue-600">•</span>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
