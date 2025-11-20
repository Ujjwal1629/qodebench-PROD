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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 gap-0 overflow-hidden">
        {/* Header with Score */}
        <DialogHeader className={`p-6 border-b bg-gradient-to-r ${getScoreColor()}`}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-white mb-2">
                {result.passed ? 'All Tests Passed! 🎉' : pointsEarned > 0 ? 'Some Tests Failed' : 'All Tests Failed'}
              </DialogTitle>
              <p className="text-sm text-white/90">
                {result.passed
                  ? 'Your solution is correct!'
                  : pointsEarned > 0
                  ? 'Fix the failing test cases to get full points'
                  : 'Review your code and fix the bugs'}
              </p>
            </div>

            {/* Animated Score Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className={`relative ${getScoreBorderColor()} border-4 rounded-full w-28 h-28 flex items-center justify-center shadow-2xl`}
            >
              <div className="text-center">
                <motion.div
                  key={animatedScore}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl font-bold"
                >
                  {animatedScore}
                </motion.div>
                <div className="text-xs font-semibold opacity-75">/{maxPoints}</div>
              </div>
            </motion.div>
          </div>

          {/* Test Summary Bar */}
          {testResults && (
            <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-3 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                <span className="font-semibold">Test Results:</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="font-bold">{testResults.passed}</span>
                  <span className="opacity-75">passed</span>
                </div>
                <div className="flex items-center gap-1">
                  <XCircle className="h-4 w-4" />
                  <span className="font-bold">{testResults.failed}</span>
                  <span className="opacity-75">failed</span>
                </div>
                <div className="font-mono bg-white/20 px-2 py-1 rounded">
                  {testResults.passed}/{testResults.total}
                </div>
              </div>
            </div>
          )}
        </DialogHeader>

        {/* Scrollable Content - Test Cases */}
        <ScrollArea className="h-[calc(90vh-320px)] p-6">
          <div className="space-y-4">
            {testResults && testResults.details.map((test, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`rounded-xl border-2 p-5 ${
                  test.passed
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                {/* Test Header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${
                    test.passed ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {test.passed ? (
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    ) : (
                      <XCircle className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        test.passed
                          ? 'bg-green-200 text-green-800'
                          : 'bg-red-200 text-red-800'
                      }`}>
                        Test #{index + 1}
                      </span>
                      <span className={`text-xs font-semibold ${
                        test.passed ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {test.passed ? 'PASSED' : 'FAILED'}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-900">
                      {test.description}
                    </h4>
                  </div>
                </div>

                {/* Test Details */}
                <div className="space-y-3 ml-14">
                  {/* Input */}
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                      Input:
                    </div>
                    <code className="text-sm text-gray-900 font-mono">
                      {JSON.stringify(test.input)}
                    </code>
                  </div>

                  {/* Expected vs Actual */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-lg p-3 border border-green-200">
                      <div className="text-xs font-semibold text-green-600 mb-1 uppercase tracking-wide">
                        Expected:
                      </div>
                      <code className="text-sm text-gray-900 font-mono break-all">
                        {JSON.stringify(test.expected)}
                      </code>
                    </div>
                    <div className={`bg-white rounded-lg p-3 border ${
                      test.passed ? 'border-green-200' : 'border-red-200'
                    }`}>
                      <div className={`text-xs font-semibold mb-1 uppercase tracking-wide ${
                        test.passed ? 'text-green-600' : 'text-red-600'
                      }`}>
                        Your Output:
                      </div>
                      <code className="text-sm text-gray-900 font-mono break-all">
                        {test.actual !== null && test.actual !== undefined
                          ? JSON.stringify(test.actual)
                          : 'null'}
                      </code>
                    </div>
                  </div>

                  {/* Error Message */}
                  {test.error && (
                    <div className="bg-red-100 border border-red-300 rounded-lg p-3">
                      <div className="text-xs font-semibold text-red-800 mb-1 uppercase tracking-wide">
                        Error:
                      </div>
                      <code className="text-sm text-red-700 font-mono">
                        {test.error}
                      </code>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {/* No test results - fallback */}
            {!testResults && (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No test results available</p>
              </div>
            )}

            {/* Code Quality Check - Only shown if all tests passed */}
            {result.qualityCheck && (
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
          </div>
        </ScrollArea>

        {/* Footer with Actions */}
        <DialogFooter className="p-6 border-t bg-gray-50 flex-row justify-between items-center">
          <Button
            variant="outline"
            onClick={onTryAgain}
            className="border-2"
          >
            Try Again
          </Button>

          {result.passed && onSubmit && (
            <Button
              onClick={onSubmit}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white shadow-md"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5 mr-2" />
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
