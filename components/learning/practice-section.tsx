'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronDown,
  Lightbulb,
  Target,
  Code2,
  CheckCircle2
} from 'lucide-react';
import { InlinePracticeEditor } from './inline-practice-editor';
import { cn } from '@/lib/utils';

interface PracticeStep {
  title: string;
  instruction: string;
  why: string;
  starterCode?: string;
  solutionCode?: string;
  hints?: string[];
}

interface PracticeSectionProps {
  title: string;
  description: string;
  goal: string;
  steps: PracticeStep[];
  language?: string;
  height?: string;
}

export function PracticeSection({
  title,
  description,
  goal,
  steps,
  language = 'typescript',
  height = '350px'
}: PracticeSectionProps) {
  const [expandedStep, setExpandedStep] = useState<number | null>(0);
  const [showSolution, setShowSolution] = useState<{ [key: number]: boolean }>({});
  const [showHints, setShowHints] = useState<{ [key: number]: boolean }>({});

  const toggleStep = (index: number) => {
    setExpandedStep(expandedStep === index ? null : index);
  };

  const toggleSolution = (index: number) => {
    setShowSolution(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleHints = (index: number) => {
    setShowHints(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="my-12 space-y-6"
    >
      {/* Header Section */}
      <div className="bg-gradient-to-br from-purple-50 via-white to-sky-50 rounded-2xl p-8 border-2 border-purple-200 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 bg-gradient-to-br from-purple-500 to-sky-600 p-3 rounded-xl shadow-md">
            <Code2 className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-600 leading-relaxed mb-4">{description}</p>
            <div className="flex items-start gap-2 bg-sky-50 border border-sky-200 rounded-lg p-4">
              <Target className="h-5 w-5 text-sky-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-sky-900 block mb-1">Goal:</span>
                <p className="text-sky-700 text-sm leading-relaxed">{goal}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border-2 border-slate-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"
          >
            {/* Step Header - Collapsible */}
            <button
              onClick={() => toggleStep(index)}
              className="w-full flex items-center gap-4 p-5 text-left hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold text-sm flex-shrink-0">
                {expandedStep === index ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  index + 1
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 text-lg">{step.title}</h4>
              </div>
              {expandedStep === index ? (
                <ChevronDown className="h-5 w-5 text-slate-400 flex-shrink-0" />
              ) : (
                <ChevronRight className="h-5 w-5 text-slate-400 flex-shrink-0" />
              )}
            </button>

            {/* Step Content - Expandable */}
            <AnimatePresence>
              {expandedStep === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 space-y-6 border-t border-slate-100 pt-5">
                    {/* What to Do */}
                    <div>
                      <h5 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                        <Code2 className="h-4 w-4 text-purple-600" />
                        What to do:
                      </h5>
                      <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
                        {step.instruction}
                      </p>
                    </div>

                    {/* Why This Matters */}
                    <div>
                      <h5 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-amber-500" />
                        Why this matters:
                      </h5>
                      <p className="text-slate-700 leading-relaxed bg-amber-50 p-4 rounded-lg border border-amber-200">
                        {step.why}
                      </p>
                    </div>

                    {/* Hints (if available) */}
                    {step.hints && step.hints.length > 0 && (
                      <div>
                        <button
                          onClick={() => toggleHints(index)}
                          className="font-semibold text-sky-600 hover:text-sky-700 mb-2 flex items-center gap-2 transition-colors"
                        >
                          <Lightbulb className="h-4 w-4" />
                          {showHints[index] ? 'Hide Hints' : 'Show Hints'}
                        </button>
                        <AnimatePresence>
                          {showHints[index] && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <ul className="space-y-2 bg-sky-50 p-4 rounded-lg border border-sky-200">
                                {step.hints.map((hint, hintIndex) => (
                                  <li key={hintIndex} className="text-sm text-sky-800 flex items-start gap-2">
                                    <span className="text-sky-600 font-bold">•</span>
                                    <span>{hint}</span>
                                  </li>
                                ))}
                              </ul>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {/* Practice Editor */}
                    <div>
                      <InlinePracticeEditor
                        initialCode={step.starterCode || ''}
                        language={language}
                        title={`Step ${index + 1}: ${step.title}`}
                        height={height}
                      />
                    </div>

                    {/* Solution (if available) */}
                    {step.solutionCode && (
                      <div>
                        <button
                          onClick={() => toggleSolution(index)}
                          className={cn(
                            "font-semibold mb-2 flex items-center gap-2 transition-colors",
                            showSolution[index]
                              ? "text-green-600 hover:text-green-700"
                              : "text-slate-600 hover:text-slate-700"
                          )}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          {showSolution[index] ? 'Hide Solution' : 'View Solution'}
                        </button>
                        <AnimatePresence>
                          {showSolution[index] && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <InlinePracticeEditor
                                initialCode={step.solutionCode}
                                language={language}
                                title={`Solution for Step ${index + 1}`}
                                height={height}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Completion Message */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="font-semibold text-green-900 mb-1">Great job!</h5>
            <p className="text-green-700 text-sm">
              Take your time with each step. There's no rush - the goal is to understand why each piece matters.
              Experiment with the code and make it your own!
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
