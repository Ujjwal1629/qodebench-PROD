'use client';

import { useState } from 'react';
import { Play, RotateCcw, CheckCircle, XCircle, Clock, ChevronDown, ChevronRight } from 'lucide-react';
import { executePlaywrightCode, type ExecutionResult, type StepResult } from '@/lib/testing-tools/playwright-executor';

interface PlaywrightRunnerProps {
  starterCode: string;
  containerSelector?: string;
}

export function PlaywrightRunner({ starterCode, containerSelector }: PlaywrightRunnerProps) {
  const [code, setCode] = useState(starterCode);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [running, setRunning] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleRun = async () => {
    setRunning(true);
    setResult(null);

    // Small delay so UI updates before execution
    await new Promise((r) => setTimeout(r, 100));

    try {
      const res = await executePlaywrightCode(code, containerSelector);
      setResult(res);
    } catch (err: any) {
      setResult({
        steps: [{ line: 0, code: 'Execution', status: 'fail', message: err.message, duration: 0 }],
        passed: 0,
        failed: 1,
        duration: 0,
      });
    }

    setRunning(false);
  };

  const handleReset = () => {
    setCode(starterCode);
    setResult(null);
  };

  return (
    <div className="border-t border-slate-200 mt-6 pt-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎭</span>
          <h3 className="font-semibold text-slate-900">Playwright Editor</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
          <button
            onClick={handleRun}
            disabled={running}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
          >
            <Play className="h-3 w-3" />
            {running ? 'Running...' : 'Run Test'}
          </button>
        </div>
      </div>

      {/* Hint */}
      <button
        onClick={() => setShowHint(!showHint)}
        className="flex items-center gap-1 text-xs text-sky-600 hover:text-sky-700"
      >
        {showHint ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        Supported commands
      </button>
      {showHint && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 space-y-1">
          <p><strong>Locators:</strong> page.getByTestId(&apos;id&apos;), page.getByRole(&apos;button&apos;, {'{ name: "X" }'}), page.getByText(&apos;text&apos;), page.getByLabel(&apos;label&apos;), page.locator(&apos;css&apos;)</p>
          <p><strong>Actions:</strong> .fill(&apos;value&apos;), .click(), .check(), .uncheck(), .selectOption(&apos;value&apos;), .clear()</p>
          <p><strong>Assertions:</strong> expect(...).toBeVisible(), .toHaveText(&apos;x&apos;), .toContainText(&apos;x&apos;), .toHaveAttribute(&apos;attr&apos;, &apos;val&apos;), .toBeChecked(), .toHaveValue(&apos;x&apos;)</p>
          <p><strong>Negation:</strong> expect(...).not.toBeVisible(), etc.</p>
        </div>
      )}

      {/* Code Editor */}
      <div className="relative">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          className="w-full h-64 bg-slate-900 text-slate-100 font-mono text-xs p-4 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-y leading-relaxed"
          placeholder="Write your Playwright test code here..."
        />
        <div className="absolute top-2 right-2 text-[0.625rem] text-slate-500 font-mono">
          playwright test
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-3">
          {/* Summary */}
          <div className={`flex items-center justify-between rounded-lg px-4 py-3 ${
            result.failed === 0
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center gap-2">
              {result.failed === 0 ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <span className={`font-semibold text-sm ${result.failed === 0 ? 'text-green-800' : 'text-red-800'}`}>
                {result.failed === 0 ? 'All tests passed!' : `${result.failed} step(s) failed`}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-green-600">{result.passed} passed</span>
              {result.failed > 0 && <span className="text-red-600">{result.failed} failed</span>}
              <span className="text-slate-500 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {result.duration}ms
              </span>
            </div>
          </div>

          {/* Step Details */}
          <div className="space-y-1">
            {result.steps.map((step, i) => (
              <StepRow key={i} step={step} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StepRow({ step }: { step: StepResult }) {
  const [expanded, setExpanded] = useState(step.status === 'fail');

  return (
    <div
      className={`rounded-lg border text-xs font-mono ${
        step.status === 'pass'
          ? 'border-green-200 bg-green-50/50'
          : 'border-red-200 bg-red-50/50'
      }`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 px-3 py-2 text-left"
      >
        {step.status === 'pass' ? (
          <CheckCircle className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
        ) : (
          <XCircle className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />
        )}
        <span className="flex-1 truncate text-slate-700">{step.code}</span>
        <span className="text-slate-400 flex-shrink-0">{step.duration}ms</span>
      </button>
      {expanded && step.message && (
        <div className="px-3 pb-2 pl-8 text-red-600">
          {step.message}
        </div>
      )}
    </div>
  );
}
