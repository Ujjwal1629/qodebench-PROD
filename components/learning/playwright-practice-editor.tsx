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
  AlertCircle,
  CheckCircle2,
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
import { WebContainer } from '@webcontainer/api';
import {
  initializePlaywrightContainer,
  runPlaywrightTest,
  parseTestOutput,
  DEFAULT_PLAYWRIGHT_TEST,
} from '@/lib/webcontainer/playwright-config';

interface PlaywrightPracticeEditorProps {
  initialCode?: string;
  language?: string;
  title?: string;
  height?: string;
  testUrl?: string;
}

// Global WebContainer instance (shared across all editors in session)
let globalWebContainer: WebContainer | null = null;
let initializationPromise: Promise<WebContainer> | null = null;

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
  const [isInitializing, setIsInitializing] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [initProgress, setInitProgress] = useState<string>('');
  const [isEnvironmentReady, setIsEnvironmentReady] = useState(false);
  const [testResults, setTestResults] = useState<{
    passed: number;
    failed: number;
    executionTime: number;
  } | null>(null);
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

  // Initialize WebContainer (once per session, shared globally)
  useEffect(() => {
    if (globalWebContainer) {
      setIsEnvironmentReady(true);
      return;
    }

    if (initializationPromise) {
      // Initialization already in progress
      initializationPromise.then(() => {
        setIsEnvironmentReady(true);
      });
      return;
    }

    // Start initialization
    setIsInitializing(true);
    initializationPromise = initializePlaywrightContainer((progress) => {
      setInitProgress(progress);
    });

    initializationPromise
      .then((container) => {
        globalWebContainer = container;
        setIsEnvironmentReady(true);
        setIsInitializing(false);
        setInitProgress('');
      })
      .catch((error) => {
        console.error('Failed to initialize Playwright:', error);
        setIsInitializing(false);
        setInitProgress('');
        setOutput([
          '❌ Failed to initialize Playwright environment',
          'Please refresh the page to try again',
          `Error: ${error.message}`,
        ]);
      });
  }, []);

  const getFileExtension = () => {
    if (language === 'typescript') return 'ts';
    if (language === 'json') return 'json';
    return 'js';
  };

  const fileExtension = getFileExtension();

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    updateCursorPosition();
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetConfirm = () => {
    setValue(initialCode);
    setShowResetDialog(false);
    setOutput([]);
    setTestResults(null);
  };

  const handleRunPlaywright = async () => {
    if (!globalWebContainer || !isEnvironmentReady) {
      setOutput(['❌ Playwright environment not ready. Please wait for initialization.']);
      return;
    }

    setIsRunning(true);
    setOutput([]);
    setTestResults(null);

    try {
      const result = await runPlaywrightTest(globalWebContainer, value, (line) => {
        setOutput((prev) => [...prev, line]);
      });

      const parsed = parseTestOutput(result.output);

      setTestResults({
        passed: parsed.passed,
        failed: parsed.failed,
        executionTime: result.executionTime,
      });

      if (!result.success && parsed.errors.length > 0) {
        setOutput((prev) => [...prev, '', '❌ Errors:', ...parsed.errors]);
      }
    } catch (error: any) {
      setOutput((prev) => [
        ...prev,
        '',
        `❌ Error: ${error.message || 'Unknown error occurred'}`,
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  const isModified = initialCode && value !== initialCode;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle Tab key
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      setValue(newValue);

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }

    // Ctrl+Enter to run
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (isEnvironmentReady && !isRunning) {
        handleRunPlaywright();
      }
    }
  };

  return (
    <div className="rounded-lg overflow-hidden border border-slate-700 shadow-xl my-6">
      {/* VS Code Title Bar */}
      <div className="flex items-center justify-between bg-[#323233] border-b border-slate-700 px-4 py-2">
        {/* Left - Window Controls & File Name */}
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
            <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Play className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-slate-300 font-medium">{title}</span>
          </div>
        </div>

        {/* Right - Editor Actions */}
        <div className="flex items-center gap-1">
          {/* Run Button */}
          <Button
            onClick={handleRunPlaywright}
            disabled={isRunning || !isEnvironmentReady || isInitializing}
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-green-400 hover:text-green-300 hover:bg-slate-700 transition-colors disabled:opacity-50"
            title="Run Playwright test (Ctrl+Enter)"
          >
            {isRunning ? (
              <>
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                <span className="text-xs">Running...</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 mr-1.5" />
                <span className="text-xs">Run</span>
              </>
            )}
          </Button>
          {/* Reset Button */}
          {isMounted && isModified && (
            <Button
              onClick={() => setShowResetDialog(true)}
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-amber-400 hover:text-amber-300 hover:bg-slate-700 transition-colors"
              title="Reset to original code"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
              <span className="text-xs">Reset</span>
            </Button>
          )}
          <Button
            onClick={handleCopy}
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 mr-1.5" />
                <span className="text-xs">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 mr-1.5" />
                <span className="text-xs">Copy</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* VS Code Tab Bar */}
      <div className="flex items-center bg-[#252526] border-b border-slate-700">
        <div className="flex items-center gap-2 px-4 py-2 bg-[#1e1e1e] border-r border-slate-700">
          <FileCode className="h-3.5 w-3.5 text-blue-400" />
          <span className="text-xs text-slate-300">test.spec.{fileExtension}</span>
          {isModified && <div className="w-1 h-1 bg-slate-500 rounded-full ml-1"></div>}
        </div>
      </div>

      {/* Initialization Progress */}
      {isInitializing && (
        <div className="bg-[#1e1e1e] border-b border-slate-700 px-4 py-3">
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
            <div className="flex-1">
              <div className="font-medium">Initializing Playwright Environment...</div>
              <div className="text-xs text-slate-500 mt-1">{initProgress}</div>
            </div>
          </div>
        </div>
      )}

      {/* Editor Content Area */}
      <div
        ref={scrollContainerRef}
        className="relative bg-[#1e1e1e] overflow-auto scroll-smooth"
        style={{
          height: height,
          scrollbarWidth: 'thin',
          scrollbarColor: '#424242 #1e1e1e',
        }}
      >
        <div className="relative flex" style={{ minHeight: '100%' }}>
          {/* Line Numbers */}
          <div
            className="flex-shrink-0 bg-[#1e1e1e] border-r border-slate-800 select-none"
            style={{ width: '56px' }}
          >
            <div ref={lineNumbersRef} className="py-4 px-3">
              {Array.from({ length: lineCount }, (_, i) => (
                <div
                  key={i + 1}
                  className="text-slate-500 text-right font-mono leading-[21px] whitespace-nowrap"
                  style={{
                    fontSize: '13px',
                    height: '21px',
                    userSelect: 'none',
                  }}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Code Editor Area */}
          <div className="flex-1 relative min-w-0">
            <textarea
              ref={textareaRef}
              value={value || ''}
              onChange={handleCodeChange}
              onKeyDown={handleKeyDown}
              onClick={updateCursorPosition}
              onKeyUp={updateCursorPosition}
              className="editor-textarea"
              style={{
                display: 'block',
                width: '100%',
                minHeight: '100%',
                backgroundColor: 'transparent',
                color: '#d4d4d4',
                padding: '16px 16px 16px 16px',
                fontFamily: '"Fira Code", "Cascadia Code", "Consolas", "Monaco", monospace',
                fontSize: '14px',
                lineHeight: '21px',
                tabSize: 2,
                MozTabSize: 2,
                letterSpacing: '0.2px',
                border: 'none',
                outline: 'none',
                resize: 'none',
                overflow: 'visible',
                whiteSpace: 'pre',
                wordWrap: 'normal',
                overflowWrap: 'normal',
                caretColor: '#ffffff',
                pointerEvents: 'auto',
              }}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              placeholder="// Write your Playwright test here...\n// Press Ctrl+Enter to run"
            />
          </div>
        </div>
      </div>

      {/* VS Code Status Bar */}
      <div className="flex items-center justify-between bg-[#0ea5e9] px-4 py-1.5 text-xs text-white flex-shrink-0">
        {/* Left Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Code2 className="h-3 w-3" />
            <span className="font-semibold">Playwright</span>
          </div>
          <span className="opacity-90">UTF-8</span>
          <span className="opacity-90">
            Ln {cursorPosition.line}, Col {cursorPosition.col}
          </span>
          {isEnvironmentReady && (
            <span className="flex items-center gap-1 opacity-90">
              <CheckCircle2 className="h-3 w-3" />
              Ready
            </span>
          )}
        </div>

        {/* Right Status */}
        <div className="flex items-center gap-4 opacity-90">
          <span>{lineCount} lines</span>
          {isMounted && <span>{(value || '').length} chars</span>}
        </div>
      </div>

      {/* Hint Text */}
      <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 border-t border-blue-200 text-xs text-slate-600">
        <Play className="h-3.5 w-3.5 text-blue-600" />
        <span>
          <strong className="text-slate-700">Interactive Playwright:</strong> Write test code and
          click Run to execute in a real browser environment
          {!isEnvironmentReady && ' (environment initializing...)'}
        </span>
      </div>

      {/* Test Results Summary */}
      {testResults && (
        <div
          className={cn(
            'px-4 py-3 border-t flex items-center justify-between',
            testResults.failed > 0
              ? 'bg-red-50 border-red-200'
              : 'bg-green-50 border-green-200'
          )}
        >
          <div className="flex items-center gap-2 text-sm font-medium">
            {testResults.failed > 0 ? (
              <AlertCircle className="h-4 w-4 text-red-600" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            )}
            <span
              className={testResults.failed > 0 ? 'text-red-700' : 'text-green-700'}
            >
              {testResults.passed} passed
              {testResults.failed > 0 && `, ${testResults.failed} failed`}
            </span>
          </div>
          <span className="text-xs text-slate-600">
            Completed in {(testResults.executionTime / 1000).toFixed(2)}s
          </span>
        </div>
      )}

      {/* Console Output */}
      {output.length > 0 && (
        <div className="bg-[#1e1e1e] border-t border-slate-700">
          <div className="px-4 py-2 bg-[#252526] border-b border-slate-700">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-2">
              <Code2 className="h-3.5 w-3.5" />
              Test Output
            </span>
          </div>
          <div className="px-4 py-3 max-h-[300px] overflow-auto font-mono text-xs">
            {output.map((line, i) => (
              <div
                key={i}
                className={cn(
                  'leading-relaxed',
                  line.startsWith('❌') || line.includes('Error')
                    ? 'text-red-400'
                    : line.startsWith('✅') || line.includes('✓')
                    ? 'text-green-400'
                    : 'text-slate-300'
                )}
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Styles */}
      <style jsx global>{`
        .editor-textarea::placeholder {
          color: #6a9955;
          font-style: italic;
          opacity: 0.6;
        }

        .editor-textarea::selection {
          background: #264f78;
          color: inherit;
        }

        .editor-textarea:focus {
          outline: none !important;
          box-shadow: none !important;
          border: none !important;
        }

        .editor-textarea::-webkit-scrollbar {
          display: none;
        }

        .editor-textarea {
          overflow: visible !important;
        }
      `}</style>

      {/* Reset Confirmation Dialog */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-amber-500" />
              Reset to Original Code?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will discard all your changes and restore the original code. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleResetConfirm}
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              Reset Code
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
