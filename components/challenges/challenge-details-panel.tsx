'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SeniorHint } from './senior-hint';
import { CheckCircle2, ChevronLeft, ChevronRight, Target, ListChecks, BookOpen, Code } from 'lucide-react';
import type { AdvancedChallengeMetadata } from '@/types/challenges';

interface ChallengeDetailsPanelProps {
  title: string;
  metadata: AdvancedChallengeMetadata;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export function ChallengeDetailsPanel({
  title,
  metadata,
  isCollapsed = false,
  onToggle,
}: ChallengeDetailsPanelProps) {
  if (isCollapsed) {
    return (
      <div className="h-full bg-white border-r border-slate-200 flex flex-col items-center py-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="p-2 text-slate-500 hover:text-slate-700"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <div className="writing-mode-vertical text-xs font-medium text-slate-500 mt-4 rotate-180" style={{ writingMode: 'vertical-rl' }}>
          Challenge Details
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white border-r border-slate-200 flex flex-col w-[320px]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <h2 className="text-sm font-semibold text-slate-900">Challenge Details</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="p-1 h-auto text-slate-500 hover:text-slate-700"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Summary */}
          <Card className="border border-slate-200">
            <CardHeader className="pb-2 py-3">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-slate-500" />
                <CardTitle className="text-xs font-semibold text-slate-900">
                  Summary
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-slate-600 leading-relaxed">
                {title}
              </p>
            </CardContent>
          </Card>

          {/* Acceptance Criteria */}
          {metadata.acceptanceCriteria && metadata.acceptanceCriteria.length > 0 && (
            <Card className="border border-slate-200">
              <CardHeader className="pb-2 py-3">
                <div className="flex items-center gap-2">
                  <ListChecks className="h-4 w-4 text-slate-500" />
                  <CardTitle className="text-xs font-semibold text-slate-900">
                    Acceptance Criteria
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2">
                  {metadata.acceptanceCriteria.map((criteria, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs text-slate-600">
                      <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[0.625rem] text-slate-400">{index + 1}</span>
                      </div>
                      <span className="leading-relaxed">{criteria}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Learning Objectives */}
          {metadata.learningObjectives && metadata.learningObjectives.length > 0 && (
            <Card className="border border-slate-200">
              <CardHeader className="pb-2 py-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-slate-500" />
                  <CardTitle className="text-xs font-semibold text-slate-900">
                    Learning Objectives
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2">
                  {metadata.learningObjectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{objective}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Example Test Cases */}
          {metadata.exampleTestCases && metadata.exampleTestCases.length > 0 && (
            <Card className="border border-slate-200">
              <CardHeader className="pb-2 py-3">
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-slate-500" />
                  <CardTitle className="text-xs font-semibold text-slate-900">
                    Example Test Cases
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {metadata.exampleTestCases.map((testCase, index) => (
                  <div key={index} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                    <p className="text-xs font-medium text-slate-700 mb-2">
                      {testCase.description}
                    </p>
                    <div className="space-y-1 text-[0.625rem] font-mono">
                      <div>
                        <span className="text-slate-500">Input: </span>
                        <span className="text-slate-700">{testCase.input}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Expected: </span>
                        <span className="text-green-600">{testCase.expected}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Senior Hint */}
          {metadata.seniorHint && (
            <SeniorHint hint={metadata.seniorHint} />
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
