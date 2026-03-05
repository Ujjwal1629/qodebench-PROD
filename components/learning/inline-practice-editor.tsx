'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  FileCode,
  Copy,
  Check,
  Code2,
  RotateCcw,
  Play
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

interface InlinePracticeEditorProps {
  initialCode?: string;
  language?: string;
  title?: string;
  height?: string;
}

export function InlinePracticeEditor({
  initialCode = '',
  language = 'typescript',
  title = 'Try it yourself',
  height = '300px'
}: InlinePracticeEditorProps) {
  const [value, setValue] = useState(initialCode);
  const [copied, setCopied] = useState(false);
  const [lineCount, setLineCount] = useState(1);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, col: 1 });
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Track mount state to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update line count whenever value changes
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

  // Initialize cursor position on mount and value change
  useEffect(() => {
    updateCursorPosition();
  }, [value, updateCursorPosition]);

  // Get intelligent language display name
  const getLanguageDisplay = () => {
    const code = value || '';

    // Check for TypeScript
    if (language === 'typescript' || code.includes(': string') || code.includes(': number') ||
        code.includes('interface ') || code.includes('type ')) {
      return 'TypeScript';
    }

    // Default to JavaScript or the provided language
    return language.charAt(0).toUpperCase() + language.slice(1);
  };

  const displayLanguage = getLanguageDisplay();

  // Get file extension
  const getFileExtension = () => {
    if (displayLanguage === 'TypeScript') return 'ts';
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
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput([]);

    try {
      // Strip TypeScript type annotations for basic execution
      let jsCode = value || '';

      // Helper function to remove balanced braces (for nested object types)
      function removeObjectTypes(code: string): string {
        // Match : { ... } but handle nested braces correctly
        // ONLY remove type annotations (before =), not object literals (after =)
        let result = code;
        let changed = true;

        while (changed) {
          changed = false;
          // Find all ': {' patterns
          const pattern = /:\s*\{/g;
          let match;

          while ((match = pattern.exec(result)) !== null) {
            const startIdx = match.index;
            let braceCount = 1;
            let endIdx = match.index + match[0].length;

            // Find matching closing brace
            while (endIdx < result.length && braceCount > 0) {
              if (result[endIdx] === '{') braceCount++;
              else if (result[endIdx] === '}') braceCount--;
              endIdx++;
            }

            // Check if this is a type annotation (followed by = sign, not property value)
            // Look for = AFTER the closing brace to confirm it's a type annotation
            if (braceCount === 0) {
              // Skip whitespace after closing brace
              let checkIdx = endIdx;
              while (checkIdx < result.length && /\s/.test(result[checkIdx])) {
                checkIdx++;
              }

              // Only remove if followed by '=' (type annotation), not if it's an object literal
              if (result[checkIdx] === '=') {
                result = result.substring(0, startIdx) + result.substring(endIdx);
                changed = true;
                break; // Restart search
              }
            }
          }
        }

        return result;
      }

      // Remove generic types like Promise<string>, Array<number>
      jsCode = jsCode.replace(/:\s*\w+<[^>]+>/g, '');

      // Remove function return types: ): type => or ): type {
      jsCode = jsCode.replace(/\)\s*:\s*\w+(<[^>]+>)?\s*(?=[={])/g, ')');

      // Remove array type annotations like string[], number[] (must be before basic types)
      jsCode = jsCode.replace(/:\s*(string|number|boolean|any|void|unknown|never)\s*\[\s*\]/g, '');

      // Remove object type annotations with nested braces
      jsCode = removeObjectTypes(jsCode);

      // Remove type annotations from variable declarations and parameters
      jsCode = jsCode.replace(/:\s*(string|number|boolean|any|void|unknown|never)\b/g, '');

      // Remove interface declarations (just strip them out)
      jsCode = jsCode.replace(/interface\s+\w+\s*\{[^}]*\}/g, '');

      // Remove type aliases
      jsCode = jsCode.replace(/type\s+\w+\s*=\s*[^;]+;/g, '');

      // Remove 'as' type assertions
      jsCode = jsCode.replace(/\s+as\s+\w+(<[^>]+>)?/g, '');

      // Remove parameter types in arrow functions more aggressively
      jsCode = jsCode.replace(/\(([^)]+)\)\s*:/g, (match, params) => {
        // Remove types from parameters
        const cleanParams = params.replace(/:\s*[^,)]+/g, '');
        return `(${cleanParams})`;
      });

      // Capture console.log output
      const logs: string[] = [];
      const originalLog = console.log;

      console.log = (...args) => {
        logs.push(args.map(arg =>
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '));
      };

      // Wrap in async IIFE to support await
      const asyncCode = `
        (async () => {
          ${jsCode}
        })();
      `;

      // Execute the transpiled code
      await eval(asyncCode);

      // Restore console.log
      console.log = originalLog;

      setOutput(logs.length > 0 ? logs : ['✅ Code executed successfully (no output)']);
    } catch (error: any) {
      setOutput([`❌ Error: ${error.message}`]);
    } finally {
      setIsRunning(false);
    }
  };

  // Check if code has been modified from initial
  const isModified = initialCode && value !== initialCode;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle Tab key
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      setValue(newValue);

      // Set cursor position after the inserted tab
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
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
            <Play className="h-4 w-4 text-purple-400" />
            <span className="text-sm text-slate-300 font-medium">
              {title}
            </span>
          </div>
        </div>

        {/* Right - Editor Actions */}
        <div className="flex items-center gap-1">
          {/* Run Button */}
          <Button
            onClick={handleRun}
            disabled={isRunning || !value}
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-green-400 hover:text-green-300 hover:bg-slate-700 transition-colors disabled:opacity-50"
            title="Run code (Ctrl+Enter)"
          >
            <Play className="h-3.5 w-3.5 mr-1.5" />
            <span className="text-xs">{isRunning ? 'Running...' : 'Run'}</span>
          </Button>
          {/* Reset Button - Only show if code is modified */}
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
          <FileCode className="h-3.5 w-3.5 text-purple-400" />
          <span className="text-xs text-slate-300">
            practice.{fileExtension}
          </span>
          {isModified && <div className="w-1 h-1 bg-slate-500 rounded-full ml-1"></div>}
        </div>
      </div>

      {/* Editor Content Area */}
      <div
        ref={scrollContainerRef}
        className="relative bg-[#1e1e1e] overflow-auto scroll-smooth"
        style={{
          height: height,
          scrollbarWidth: 'thin',
          scrollbarColor: '#424242 #1e1e1e'
        }}
      >
        {/* Inner content wrapper */}
        <div className="relative flex" style={{ minHeight: '100%' }}>
          {/* Line Numbers */}
          <div
            className="flex-shrink-0 bg-[#1e1e1e] border-r border-slate-800 select-none"
            style={{ width: '56px' }}
          >
            <div
              ref={lineNumbersRef}
              className="py-4 px-3"
            >
              {Array.from({ length: lineCount }, (_, i) => (
                <div
                  key={i + 1}
                  className="text-slate-500 text-right font-mono leading-[21px] whitespace-nowrap"
                  style={{
                    fontSize: '13px',
                    height: '21px',
                    userSelect: 'none'
                  }}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Code Editor Area */}
          <div className="flex-1 relative min-w-0">
            {/* Textarea */}
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
                pointerEvents: 'auto'
              }}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              placeholder="// Start typing your code here...\n// Use Tab for indentation"
            />
          </div>
        </div>
      </div>

      {/* VS Code Status Bar */}
      <div className="flex items-center justify-between bg-[#7c3aed] px-4 py-1.5 text-xs text-white flex-shrink-0">
        {/* Left Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Code2 className="h-3 w-3" />
            <span className="font-semibold">{displayLanguage}</span>
          </div>
          <span className="opacity-90">UTF-8</span>
          <span className="opacity-90">Ln {cursorPosition.line}, Col {cursorPosition.col}</span>
        </div>

        {/* Right Status */}
        <div className="flex items-center gap-4 opacity-90">
          <span>{lineCount} lines</span>
          {isMounted && <span>{(value || '').length} chars</span>}
        </div>
      </div>

      {/* Hint Text Below Editor */}
      <div className="flex items-center gap-2 px-4 py-3 bg-purple-50 border-t border-purple-200 text-xs text-slate-600">
        <Play className="h-3.5 w-3.5 text-purple-600" />
        <span>
          <strong className="text-slate-700">Interactive Practice:</strong> Try modifying the code above to experiment and learn
        </span>
      </div>

      {/* Custom Scrollbar & Editor Styles */}
      <style jsx global>{`
        /* Webkit Scrollbar Styling */
        .inline-practice-editor-container > div:nth-child(3)::-webkit-scrollbar {
          width: 14px;
          height: 14px;
        }

        .inline-practice-editor-container > div:nth-child(3)::-webkit-scrollbar-track {
          background: #1e1e1e;
        }

        .inline-practice-editor-container > div:nth-child(3)::-webkit-scrollbar-thumb {
          background: #424242;
          border: 3px solid #1e1e1e;
          border-radius: 10px;
        }

        .inline-practice-editor-container > div:nth-child(3)::-webkit-scrollbar-thumb:hover {
          background: #4e4e4e;
        }

        .inline-practice-editor-container > div:nth-child(3)::-webkit-scrollbar-corner {
          background: #1e1e1e;
        }

        /* Textarea Styling */
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

      {/* Console Output */}
      {output.length > 0 && (
        <div className="bg-[#1e1e1e] border-t border-slate-700">
          <div className="px-4 py-2 bg-[#252526] border-b border-slate-700">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-2">
              <Code2 className="h-3.5 w-3.5" />
              Console Output
            </span>
          </div>
          <div className="px-4 py-3 max-h-[200px] overflow-auto font-mono text-sm">
            {output.map((line, i) => (
              <div
                key={i}
                className={cn(
                  'leading-relaxed',
                  line.startsWith('❌') ? 'text-red-400' : 'text-green-400'
                )}
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reset Confirmation Dialog */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-amber-500" />
              Reset to Original Code?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will discard all your changes and restore the original code. This action cannot be undone.
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
