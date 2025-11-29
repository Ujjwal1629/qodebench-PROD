'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle2, XCircle, Loader2, Trophy, AlertTriangle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface TestCaseResult {
  passed: boolean;
  input: any;
  expected: any;
  actual: any;
  description: string;
  error?: string;
}

interface QualityCheck {
  is_quality_good: boolean;
  reasons: string[];
}

interface SeniorFeedback {
  summary: string;
  strengths: string[];
  improvements: string[];
  tips?: string;
}

// New AI Feedback structure (pass or fail)
interface AIFeedback {
  status: 'passed' | 'failed';
  summary: string;
  // For passed submissions
  strengths?: string[];
  improvements?: string[];
  codeQualityScore?: number;
  // For failed submissions
  issues?: Array<{
    issue: string;
    location?: string;
    hint: string;
  }>;
  encouragement?: string;
  nextSteps?: string[];
}

interface ValidationResultsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: {
    passed: boolean;
    score: number;
    pointsEarned?: number;
    maxPoints?: number;
    testResults?: {
      total: number;
      passed: number;
      failed: number;
      details: TestCaseResult[];
    };
    qualityCheck?: QualityCheck;
    seniorFeedback?: SeniorFeedback;
    aiFeedback?: AIFeedback;
    detectedFunction?: string;
    isAdvanced?: boolean;
    // AI-only validation fields (from validate-hybrid endpoint)
    strengths?: string[];
    improvements?: Array<{
      issue: string;
      yourCode: string | null;
      betterApproach: string;
      explanation: string;
    }>;
    codeQuality?: string;
    scoreBreakdown?: {
      structure?: {
        score: number;
        weight: number;
        feedback: string[];
      };
      quality?: {
        score: number;
        weight: number;
        feedback: any;
      };
    };
  } | null;
  onSubmit?: () => void;
  onTryAgain?: () => void;
  isSubmitting?: boolean;
}

export function ValidationResultsModal({
  open,
  onOpenChange,
  result,
  onSubmit,
  onTryAgain,
  isSubmitting = false,
}: ValidationResultsModalProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  // Animate score counting
  useEffect(() => {
    if (open && result) {
      setAnimatedScore(0);
      const duration = 1000; // 1 second
      const steps = 50;
      const targetScore = result.pointsEarned || result.score;
      const increment = targetScore / steps;
      const stepDuration = duration / steps;

      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        if (currentStep >= steps) {
          setAnimatedScore(targetScore);
          clearInterval(timer);
        } else {
          setAnimatedScore(Math.floor(increment * currentStep));
        }
      }, stepDuration);

      return () => clearInterval(timer);
    }
  }, [open, result?.pointsEarned, result?.score]);

  if (!result) return null;

  const maxPoints = result.maxPoints || 50;
  const pointsEarned = result.pointsEarned || 0;
  const testResults = result.testResults;

  // Check if this is an AI-only validation (no test cases)
  const isAIOnlyValidation = !testResults && (result.strengths || result.improvements || result.scoreBreakdown);

  const getScoreColor = () => {
    if (result.passed) return 'from-green-500 to-emerald-600';
    if (pointsEarned > 0) return 'from-orange-500 to-amber-600';
    return 'from-red-500 to-rose-600';
  };

  const getScoreBorderColor = () => {
    if (result.passed) return 'border-green-600 bg-green-50 text-green-600';
    if (pointsEarned > 0) return 'border-orange-600 bg-orange-50 text-orange-600';
    return 'border-red-600 bg-red-50 text-red-600';
  };

  const getHeaderTitle = () => {
    if (isAIOnlyValidation) {
      return result.passed ? 'Validation Passed! 🎉' : pointsEarned > 0 ? 'Good Effort!' : 'Needs Improvement';
    }
    return result.passed ? 'All Tests Passed! 🎉' : pointsEarned > 0 ? 'Some Tests Failed' : 'All Tests Failed';
  };

  const getHeaderSubtitle = () => {
    if (isAIOnlyValidation) {
      return result.passed
        ? 'Your solution meets the requirements!'
        : pointsEarned > 0
        ? 'Review the feedback to improve your answer'
        : 'Please revise your answer and try again';
    }
    return result.passed
      ? 'Your solution is correct!'
      : pointsEarned > 0
      ? 'Fix the failing test cases to get full points'
      : 'Review your code and fix the bugs';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] p-0 gap-0 overflow-hidden w-[95vw] sm:w-full rounded-2xl">
        {/* Header with Score */}
        <DialogHeader className={`p-4 sm:p-6 border-b bg-gradient-to-r ${getScoreColor()} rounded-t-2xl`}>
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:justify-between">
            <div className="flex-1 text-center sm:text-left">
              <DialogTitle className="text-lg sm:text-2xl font-bold text-white mb-1 sm:mb-2">
                {getHeaderTitle()}
              </DialogTitle>
              <p className="text-xs sm:text-sm text-white/90">
                {getHeaderSubtitle()}
              </p>
            </div>

            {/* Animated Score Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className={`relative ${getScoreBorderColor()} border-4 rounded-full w-20 h-20 sm:w-28 sm:h-28 flex items-center justify-center shadow-2xl flex-shrink-0`}
            >
              <div className="text-center">
                <motion.div
                  key={animatedScore}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl sm:text-4xl font-bold"
                >
                  {animatedScore}
                </motion.div>
                <div className="text-[10px] sm:text-xs font-semibold opacity-75">/{maxPoints}</div>
              </div>
            </motion.div>
          </div>

          {/* Test Summary Bar */}
          {testResults && (
            <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 flex flex-col sm:flex-row items-center sm:justify-between gap-2 sm:gap-0 text-white">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base font-semibold">Test Results:</span>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="font-bold">{testResults.passed}</span>
                  <span className="opacity-75">passed</span>
                </div>
                <div className="flex items-center gap-1">
                  <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="font-bold">{testResults.failed}</span>
                  <span className="opacity-75">failed</span>
                </div>
                <div className="font-mono bg-white/20 px-2 py-1 rounded text-xs sm:text-sm">
                  {testResults.passed}/{testResults.total}
                </div>
              </div>
            </div>
          )}
        </DialogHeader>

        {/* Scrollable Content - Test Cases */}
        <ScrollArea className="max-h-[45vh] overflow-y-auto p-3 sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            {testResults && testResults.details.map((test, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`rounded-xl border-2 p-3 sm:p-5 ${
                  test.passed
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                {/* Test Header */}
                <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${
                    test.passed ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {test.passed ? (
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    ) : (
                      <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded ${
                        test.passed
                          ? 'bg-green-200 text-green-800'
                          : 'bg-red-200 text-red-800'
                      }`}>
                        Test #{index + 1}
                      </span>
                      <span className={`text-[10px] sm:text-xs font-semibold ${
                        test.passed ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {test.passed ? 'PASSED' : 'FAILED'}
                      </span>
                    </div>
                    <h4 className="text-sm sm:text-base font-semibold text-gray-900">
                      {test.description}
                    </h4>
                  </div>
                </div>

                {/* Test Details */}
                <div className="space-y-2 sm:space-y-3 ml-0 sm:ml-14">
                  {/* Input */}
                  <div className="bg-white rounded-lg p-2 sm:p-3 border border-gray-200">
                    <div className="text-[10px] sm:text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                      Input:
                    </div>
                    <code className="text-xs sm:text-sm text-gray-900 font-mono break-all">
                      {JSON.stringify(test.input)}
                    </code>
                  </div>

                  {/* Expected vs Actual */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    <div className="bg-white rounded-lg p-2 sm:p-3 border border-green-200">
                      <div className="text-[10px] sm:text-xs font-semibold text-green-600 mb-1 uppercase tracking-wide">
                        Expected:
                      </div>
                      <code className="text-xs sm:text-sm text-gray-900 font-mono break-all">
                        {JSON.stringify(test.expected)}
                      </code>
                    </div>
                    <div className={`bg-white rounded-lg p-2 sm:p-3 border ${
                      test.passed ? 'border-green-200' : 'border-red-200'
                    }`}>
                      <div className={`text-[10px] sm:text-xs font-semibold mb-1 uppercase tracking-wide ${
                        test.passed ? 'text-green-600' : 'text-red-600'
                      }`}>
                        Your Output:
                      </div>
                      <code className="text-xs sm:text-sm text-gray-900 font-mono break-all">
                        {test.actual !== null && test.actual !== undefined
                          ? JSON.stringify(test.actual)
                          : 'null'}
                      </code>
                    </div>
                  </div>

                  {/* Error Message */}
                  {test.error && (
                    <div className="bg-red-100 border border-red-300 rounded-lg p-2 sm:p-3">
                      <div className="text-[10px] sm:text-xs font-semibold text-red-800 mb-1 uppercase tracking-wide">
                        Error:
                      </div>
                      <code className="text-xs sm:text-sm text-red-700 font-mono break-all">
                        {test.error}
                      </code>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {/* AI Validation Feedback - For challenges without test cases */}
            {!testResults && isAIOnlyValidation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`rounded-xl border-2 p-6 ${
                  result.passed
                    ? 'bg-gradient-to-br from-emerald-50 to-green-50 border-green-300'
                    : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300'
                }`}
              >
                {/* Header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className={`p-2.5 rounded-lg ${
                    result.passed ? 'bg-green-500' : 'bg-blue-500'
                  }`}>
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      AI Validation Feedback
                    </h3>
                    <p className="text-sm text-gray-700">
                      {result.codeQuality || 'Your submission has been reviewed'}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 ml-14">
                  {/* Strengths */}
                  {result.strengths && result.strengths.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-green-700 mb-2">✅ Strengths</h4>
                      <div className="space-y-2">
                        {result.strengths.map((strength: string, index: number) => (
                          <div
                            key={index}
                            className="flex items-start gap-2 bg-white rounded-lg p-3 border border-green-200"
                          >
                            <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-gray-700 leading-relaxed">{strength}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Improvements */}
                  {result.improvements && result.improvements.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-amber-700 mb-2">💡 Suggestions for Improvement</h4>
                      <div className="space-y-3">
                        {result.improvements.map((improvement: any, index: number) => (
                          <div
                            key={index}
                            className="bg-white rounded-lg p-4 border border-amber-200"
                          >
                            <div className="flex items-start gap-2 mb-2">
                              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900">{improvement.issue}</p>
                                {improvement.yourCode && (
                                  <div className="mt-2 bg-red-50 border border-red-200 rounded p-2">
                                    <p className="text-xs font-semibold text-red-800 mb-1">Your approach:</p>
                                    <code className="text-xs text-red-700">{improvement.yourCode}</code>
                                  </div>
                                )}
                              </div>
                            </div>
                            {improvement.betterApproach && (
                              <div className="ml-7 bg-green-50 border border-green-200 rounded p-2 mb-2">
                                <p className="text-xs font-semibold text-green-800 mb-1">Better approach:</p>
                                <code className="text-xs text-green-700">{improvement.betterApproach}</code>
                              </div>
                            )}
                            {improvement.explanation && (
                              <div className="ml-7 bg-blue-50 border border-blue-200 rounded p-2">
                                <p className="text-xs font-semibold text-blue-800 mb-1">💬 Explanation:</p>
                                <p className="text-sm text-blue-700">{improvement.explanation}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Score Breakdown */}
                  {result.scoreBreakdown && (
                    <div>
                      <h4 className="text-sm font-semibold text-slate-700 mb-2">📊 Score Breakdown</h4>
                      <div className="bg-white rounded-lg p-4 border border-slate-200">
                        {result.scoreBreakdown.structure && (
                          <div className="mb-3 pb-3 border-b border-slate-100">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">Structure</span>
                              <span className="text-sm font-bold text-gray-900">
                                {result.scoreBreakdown.structure.score}/{result.scoreBreakdown.structure.weight}
                              </span>
                            </div>
                            {result.scoreBreakdown.structure.feedback && result.scoreBreakdown.structure.feedback.length > 0 && (
                              <ul className="space-y-1">
                                {result.scoreBreakdown.structure.feedback.map((fb: string, i: number) => (
                                  <li key={i} className="text-xs text-gray-600">{fb}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}
                        {result.scoreBreakdown.quality && (
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-700">Quality</span>
                              <span className="text-sm font-bold text-gray-900">
                                {result.scoreBreakdown.quality.score}/{result.scoreBreakdown.quality.weight}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* No feedback available - fallback */}
            {!testResults && !isAIOnlyValidation && (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No validation feedback available</p>
              </div>
            )}

            {/* AI Feedback - Always shown when available */}
            {result.aiFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`rounded-xl border-2 p-6 mt-6 ${
                  result.aiFeedback.status === 'passed'
                    ? 'bg-gradient-to-br from-emerald-50 to-green-50 border-green-300'
                    : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300'
                }`}
              >
                {/* Header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className={`p-2.5 rounded-lg ${
                    result.aiFeedback.status === 'passed'
                      ? 'bg-green-500'
                      : 'bg-blue-500'
                  }`}>
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-gray-900">
                        Senior Developer Feedback
                      </h3>
                      {result.aiFeedback.codeQualityScore && (
                        <span className="px-2 py-0.5 text-xs font-bold bg-green-200 text-green-800 rounded">
                          Quality: {result.aiFeedback.codeQualityScore}/10
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700">
                      {result.aiFeedback.summary}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 ml-14">
                  {/* Encouragement - For failed submissions */}
                  {result.aiFeedback.encouragement && (
                    <div className="bg-blue-100 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-800 font-medium">
                        💪 {result.aiFeedback.encouragement}
                      </p>
                    </div>
                  )}

                  {/* Issues - For failed submissions */}
                  {result.aiFeedback.issues && result.aiFeedback.issues.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-red-700 mb-2">Issues Found</h4>
                      <div className="space-y-3">
                        {result.aiFeedback.issues.map((issue, index) => (
                          <div
                            key={index}
                            className="bg-white rounded-lg p-4 border border-red-200"
                          >
                            <div className="flex items-start gap-2 mb-2">
                              <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900">{issue.issue}</p>
                                {issue.location && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    📍 Location: {issue.location}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="ml-7 bg-amber-50 border border-amber-200 rounded p-2">
                              <p className="text-xs font-semibold text-amber-800 mb-1">💡 Hint:</p>
                              <p className="text-sm text-amber-700">{issue.hint}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Next Steps - For failed submissions */}
                  {result.aiFeedback.nextSteps && result.aiFeedback.nextSteps.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-blue-700 mb-2">Next Steps to Try</h4>
                      <div className="space-y-2">
                        {result.aiFeedback.nextSteps.map((step, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-2 bg-white rounded-lg p-3 border border-blue-200"
                          >
                            <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                              {index + 1}
                            </span>
                            <p className="text-sm text-gray-700 leading-relaxed">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Strengths - For passed submissions */}
                  {result.aiFeedback.strengths && result.aiFeedback.strengths.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-green-700 mb-2">Strengths</h4>
                      <div className="space-y-2">
                        {result.aiFeedback.strengths.map((strength, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-2 bg-white rounded-lg p-3 border border-green-200"
                          >
                            <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-gray-700 leading-relaxed">{strength}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Improvements - For passed submissions */}
                  {result.aiFeedback.improvements && result.aiFeedback.improvements.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-amber-700 mb-2">Suggestions for Improvement</h4>
                      <div className="space-y-2">
                        {result.aiFeedback.improvements.map((improvement, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-2 bg-white rounded-lg p-3 border border-amber-200"
                          >
                            <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-gray-700 leading-relaxed">{improvement}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Legacy Code Quality Check - Fallback if no aiFeedback */}
            {!result.aiFeedback && result.qualityCheck && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`rounded-xl border-2 p-6 mt-6 ${
                  result.qualityCheck.is_quality_good
                    ? 'bg-gradient-to-br from-emerald-50 to-green-50 border-green-300'
                    : 'bg-gradient-to-br from-amber-50 to-orange-50 border-orange-300'
                }`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className={`p-2.5 rounded-lg ${
                    result.qualityCheck.is_quality_good
                      ? 'bg-green-500'
                      : 'bg-orange-500'
                  }`}>
                    {result.qualityCheck.is_quality_good ? (
                      <Sparkles className="h-6 w-6 text-white" />
                    ) : (
                      <AlertTriangle className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      Senior Developer Code Review
                    </h3>
                    <p className={`text-sm font-semibold ${
                      result.qualityCheck.is_quality_good
                        ? 'text-green-700'
                        : 'text-orange-700'
                    }`}>
                      {result.qualityCheck.is_quality_good
                        ? '✓ Production-Ready'
                        : '⚠ Needs Improvement'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 ml-14">
                  {result.qualityCheck.reasons.map((reason, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 bg-white rounded-lg p-3 border border-gray-200"
                    >
                      <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${
                        result.qualityCheck!.is_quality_good
                          ? 'bg-green-500'
                          : 'bg-orange-500'
                      }`} />
                      <p className="text-sm text-gray-700 leading-relaxed">{reason}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Senior Developer Feedback - For Advanced Challenges */}
            {result.seniorFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="rounded-xl border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-purple-100 p-6 mt-6"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2.5 rounded-lg bg-purple-500">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      Senior Developer Feedback
                    </h3>
                    <p className="text-sm text-purple-700">
                      {result.seniorFeedback.summary}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 ml-14">
                  {/* Strengths */}
                  {result.seniorFeedback.strengths && result.seniorFeedback.strengths.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-green-700 mb-2">Strengths</h4>
                      <div className="space-y-2">
                        {result.seniorFeedback.strengths.map((strength, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-2 bg-white rounded-lg p-3 border border-green-200"
                          >
                            <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-gray-700 leading-relaxed">{strength}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Areas for Improvement */}
                  {result.seniorFeedback.improvements && result.seniorFeedback.improvements.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-orange-700 mb-2">Areas for Improvement</h4>
                      <div className="space-y-2">
                        {result.seniorFeedback.improvements.map((improvement, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-2 bg-white rounded-lg p-3 border border-orange-200"
                          >
                            <AlertTriangle className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-gray-700 leading-relaxed">{improvement}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pro Tips */}
                  {result.seniorFeedback.tips && (
                    <div className="bg-purple-100 rounded-lg p-4 border border-purple-200">
                      <h4 className="text-sm font-semibold text-purple-800 mb-1">Pro Tip</h4>
                      <p className="text-sm text-purple-700">{result.seniorFeedback.tips}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>

        {/* Footer with Actions */}
        <DialogFooter className="p-3 sm:p-6 border-t bg-gray-50 flex-col sm:flex-row gap-3 sm:gap-4 justify-between items-stretch sm:items-center rounded-b-2xl">
          <Button
            variant="outline"
            onClick={onTryAgain}
            className="border-2 w-full sm:w-auto rounded-xl"
            size="default"
          >
            Try Again
          </Button>

          {result.passed && onSubmit && (
            <Button
              onClick={onSubmit}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white shadow-md w-full sm:w-auto rounded-xl"
              size="default"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Submit Challenge
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
