'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  FileCode,
  Copy,
  Check,
  Code2,
  RotateCcw,
  Play,
  Loader2,
  CheckCircle2,
  XCircle,
  Image as ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { cn } from '@/lib/utils';

interface PlaywrightPracticeEditorProps {
  initialCode?: string;
  language?: string;
  title?: string;
  height?: string;
  testUrl?: string;
}

const DEFAULT_PLAYWRIGHT_TEST = `import { test, expect } from '@playwright/test';

test('basic test example', async ({ page }) => {
  await page.goto('https://playwright.dev');

  await expect(page).toHaveTitle(/Playwright/);

  console.log('✅ Test passed!');
});`;

export function PlaywrightPracticeEditor({
  initialCode = DEFAULT_PLAYWRIGHT_TEST,
  language = 'typescript',
  title = 'Try Playwright',
  height = '400px',
  testUrl,
}: PlaywrightPracticeEditorProps) {
  const [value, setValue] = useState(initialCode);
  const [copied, setCopied] = useState(false);
  const [lineCount, setLineCount] = useState(1);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, col: 1 });
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<{
    passed: number;
    failed: number;
    executionTime: number;
  } | null>(null);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Track mount state
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update line count
  useEffect(() => {
    const lines = (value || '').split('\n').length;
    setLineCount(Math.max(lines, 1));
  }, [value]);

  // Update cursor position
  const updateCursorPosition = useCallback(() => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const cursorPos = textarea.selectionStart;
    const textBeforeCursor = value.substring(0, cursorPos);
    const lines = textBeforeCursor.split('\n');
    const currentLine = lines.length;
    const currentCol = lines[lines.length - 1].length + 1;

    setCursorPosition({ line: currentLine, col: currentCol });
  }, [value]);

  useEffect(() => {
    updateCursorPosition();
  }, [value, updateCursorPosition]);

  const getFileExtension = () => {
    if (language === 'typescript') return 'ts';
    if (language === 'json') return 'json';
    return 'js';
  };

  const fileExtension = getFileExtension();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleReset = () => {
    setValue(initialCode);
    setShowResetDialog(false);
    setOutput([]);
    setTestResults(null);
    setScreenshot(null);
  };

  const handleRunPlaywright = async () => {
    setIsRunning(true);
    setOutput(['⏳ Executing Playwright test on server...']);
    setTestResults(null);
    setScreenshot(null);

    try {
      const response = await fetch('/api/learning/playwright/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: value,
          captureScreenshot: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setOutput([
          '❌ Execution failed',
          data.error || 'Unknown error',
          ...(data.details ? [data.details] : []),
        ]);
        return;
      }

      setOutput(data.output || []);
      setTestResults(data.results);
      if (data.screenshot) {
        setScreenshot(`data:image/png;base64,${data.screenshot}`);
      }

    } catch (error) {
      console.error('Playwright execution error:', error);
      setOutput([
        '❌ Failed to execute test',
        error instanceof Error ? error.message : 'Unknown error',
        'Please try again',
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);

      setValue(newValue);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }

    // Ctrl/Cmd + Enter to run
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRunPlaywright();
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  if (!isMounted) {
    return (
      <div className="bg-[#1e1e1e] rounded-lg p-4 text-white">
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading editor...</span>
        </div>
      </div>
    );
  }

  const hasModifications = value !== initialCode;

  return (
    <>
      <div className="my-6 rounded-lg overflow-hidden border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <div className="bg-[#2d2d30] px-4 py-2 flex items-center justify-between border-b border-[#454545]">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
              <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FileCode className="w-4 h-4 text-sky-400" />
              <span className="text-gray-300 font-medium">{title}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {hasModifications && (
              <Button
                onClick={() => setShowResetDialog(true)}
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white hover:bg-[#3e3e42]"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>
            )}
            <Button
              onClick={handleCopy}
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white hover:bg-[#3e3e42]"
            >
              {copied ? (
                <Check className="w-4 h-4 mr-1 text-green-400" />
              ) : (
                <Copy className="w-4 h-4 mr-1" />
              )}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            <Button
              onClick={handleRunPlaywright}
              disabled={isRunning}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-1" />
                  Run
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Status bar */}
        <div className="bg-[#007acc] px-4 py-1 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4 text-white">
            <div className="flex items-center gap-2">
              <Code2 className="w-3 h-3" />
              <span>Playwright</span>
            </div>
            <div>UTF-8</div>
            <div>Ln {cursorPosition.line}, Col {cursorPosition.col}</div>
          </div>
          <div className="flex items-center gap-2 text-white">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span>Ready</span>
            </div>
            <div className="text-white/80">{lineCount} lines</div>
            <div className="text-white/80">{value.length} chars</div>
          </div>
        </div>

        {/* Editor */}
        <div className="relative flex">
          {/* Line numbers */}
          <div
            ref={lineNumbersRef}
            className="bg-[#1e1e1e] text-[#858585] text-right py-4 px-2 select-none overflow-hidden"
            style={{ height }}
          >
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i + 1} className="font-mono text-sm leading-6">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Code editor */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-auto"
            style={{ height }}
          >
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onClick={updateCursorPosition}
              spellCheck={false}
              className={cn(
                'w-full h-full bg-[#1e1e1e] text-gray-100 font-mono text-sm',
                'leading-6 px-4 py-4 resize-none outline-none',
                'placeholder:text-gray-500'
              )}
              style={{
                tabSize: 2,
                minHeight: height,
              }}
            />
          </div>
        </div>

        {/* Output section */}
        {output.length > 0 && (
          <div className="border-t border-slate-200 bg-slate-50">
            <div className="bg-[#2d2d30] px-4 py-2 flex items-center justify-between border-b border-[#454545]">
              <div className="text-sm text-gray-300 font-medium flex items-center gap-2">
                <Code2 className="w-4 h-4" />
                Test Output
              </div>
              {testResults && (
                <div className="flex items-center gap-3 text-xs">
                  {testResults.passed > 0 && (
                    <div className="flex items-center gap-1 text-green-400">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{testResults.passed} passed</span>
                    </div>
                  )}
                  {testResults.failed > 0 && (
                    <div className="flex items-center gap-1 text-red-400">
                      <XCircle className="w-3 h-3" />
                      <span>{testResults.failed} failed</span>
                    </div>
                  )}
                  <div className="text-gray-400">
                    Completed in {(testResults.executionTime / 1000).toFixed(1)}s
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 max-h-80 overflow-y-auto">
              <div className="font-mono text-sm space-y-1">
                {output.map((line, i) => (
                  <div
                    key={i}
                    className={cn(
                      'whitespace-pre-wrap',
                      line.includes('✅') || line.includes('passed') ? 'text-green-600' : '',
                      line.includes('❌') || line.includes('failed') || line.includes('Error') ? 'text-red-600' : '',
                      !line.includes('✅') && !line.includes('❌') ? 'text-slate-700' : ''
                    )}
                  >
                    {line}
                  </div>
                ))}
              </div>

              {/* Screenshot preview */}
              {screenshot && (
                <div className="mt-4 border-t border-slate-200 pt-4">
                  <div className="flex items-center gap-2 mb-2 text-sm text-slate-600">
                    <ImageIcon className="w-4 h-4" />
                    <span>Screenshot</span>
                  </div>
                  <img
                    src={screenshot}
                    alt="Test screenshot"
                    className="max-w-full border border-slate-200 rounded"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Interactive hint */}
        <div className="bg-sky-50 border-t border-sky-200 px-4 py-2 text-xs text-sky-700">
          <span className="inline-flex items-center gap-1.5">
            <Code2 className="w-3 h-3" />
            <span className="font-medium">Interactive Playwright:</span>
            <span>Write test code and click Run to execute in a real browser environment</span>
          </span>
        </div>
      </div>

      {/* Reset confirmation dialog */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Code?</AlertDialogTitle>
            <AlertDialogDescription>
              This will discard your changes and restore the original code. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReset}>Reset</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
