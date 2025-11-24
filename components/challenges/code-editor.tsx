'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play,
  FileCode,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Code2,
  RotateCcw
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

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  placeholder?: string;
  starterCode?: string;
  onReset?: () => void;
}

export function CodeEditor({
  value,
  onChange,
  language,
  placeholder,
  starterCode,
  onReset,
}: CodeEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lineCount, setLineCount] = useState(1);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, col: 1 });
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

    // Check for React indicators
    if (code.includes('import React') || code.includes('from "react"') || code.includes('from \'react\'') ||
        code.includes('useState') || code.includes('useEffect') || code.includes('<')) {
      return 'React';
    }

    // Check for Next.js indicators
    if (code.includes('next/') || code.includes('from "next') || code.includes('from \'next')) {
      return 'Next.js';
    }

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
    if (displayLanguage === 'React' || displayLanguage === 'Next.js') return 'jsx';
    if (language === 'json') return 'json';
    return 'js';
  };

  const fileExtension = getFileExtension();

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    updateCursorPosition();
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetConfirm = () => {
    if (onReset) {
      onReset();
      setShowResetDialog(false);
    }
  };

  // Check if code has been modified from starter
  const isModified = starterCode && value !== starterCode;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle Tab key
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);

      // Set cursor position after the inserted tab
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  // No scroll handler needed - line numbers scroll naturally with the container

  return (
    <div className={`vscode-editor-container ${isFullscreen ? 'fixed inset-0 z-50 bg-[#1e1e1e]' : 'rounded-lg overflow-hidden border border-slate-700 shadow-xl'}`}>
      {/* VS Code Title Bar */}
      <div className="flex items-center justify-between bg-[#323233] border-b border-slate-700 px-4 py-2">
        {/* Left - Window Controls & File Name */}
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff5f57]/80 cursor-pointer"></div>
            <div className="w-3 h-3 rounded-full bg-[#febc2e] hover:bg-[#febc2e]/80 cursor-pointer"></div>
            <div className="w-3 h-3 rounded-full bg-[#28c840] hover:bg-[#28c840]/80 cursor-pointer"></div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <FileCode className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-slate-300 font-medium">
              solution.{fileExtension}
            </span>
          </div>
        </div>

        {/* Right - Editor Actions */}
        <div className="flex items-center gap-1">
          {/* Reset Button - Only show if starter code exists and code is modified */}
          {isMounted && onReset && isModified && (
            <Button
              onClick={() => setShowResetDialog(true)}
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-amber-400 hover:text-amber-300 hover:bg-slate-700 transition-colors"
              title="Reset to starter code"
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
          <Button
            onClick={() => setIsFullscreen(!isFullscreen)}
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            {isFullscreen ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>

      {/* VS Code Tab Bar */}
      <div className="flex items-center bg-[#252526] border-b border-slate-700">
        <div className="flex items-center gap-2 px-4 py-2 bg-[#1e1e1e] border-r border-slate-700">
          <FileCode className="h-3.5 w-3.5 text-blue-400" />
          <span className="text-xs text-slate-300">
            solution.{fileExtension}
          </span>
          <div className="w-1 h-1 bg-slate-500 rounded-full ml-1"></div>
        </div>
      </div>

      {/* Editor Content Area - COMPLETELY REDESIGNED */}
      <div
        ref={scrollContainerRef}
        className={cn(
          "relative bg-[#1e1e1e] overflow-auto scroll-smooth",
          isFullscreen ? "h-[calc(100vh-80px)]" : "h-[400px] md:h-[500px]"
        )}
        style={{
          // Custom scrollbar styling
          scrollbarWidth: 'thin',
          scrollbarColor: '#424242 #1e1e1e'
        }}
      >
        {/* Inner content wrapper - this creates the scrollable height */}
        <div className="relative flex" style={{ minHeight: '100%' }}>
          {/* Line Numbers - Scrolls naturally with content */}
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
            {/* Textarea - static positioned, scrolls with container */}
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
                padding: '16px 96px 16px 16px', // Right padding for minimap
                fontFamily: '"Fira Code", "Cascadia Code", "Consolas", "Monaco", monospace',
                fontSize: '14px',
                lineHeight: '21px',
                tabSize: 2,
                MozTabSize: 2,
                letterSpacing: '0.2px',
                border: 'none',
                outline: 'none',
                resize: 'none',
                overflow: 'visible', // Allow content to create scroll area
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
              placeholder={placeholder || "// Start typing your code here...\n// Use Tab for indentation"}
            />

            {/* Editor Minimap (visual indicator only) */}
            <div className="absolute top-0 right-0 w-20 h-full bg-[#1e1e1e]/60 border-l border-slate-800 pointer-events-none opacity-40">
              <div className="space-y-[2px] p-2">
                {Array.from({ length: Math.min(lineCount, 100) }, (_, i) => {
                  // Deterministic width based on line index
                  const width = 40 + ((i * 7) % 60);
                  return (
                    <div
                      key={i}
                      className="h-[3px] bg-slate-600 rounded-full"
                      style={{ width: `${width}%` }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VS Code Status Bar */}
      <div className="flex items-center justify-between bg-[#007acc] px-4 py-1.5 text-xs text-white flex-shrink-0">
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
      {!isFullscreen && (
        <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500">
          <Play className="h-3.5 w-3.5 text-sky-600" />
          <span>
            <strong className="text-slate-700">Tip:</strong> Write your solution above and click <strong className="text-sky-600">Validate</strong> when ready
          </span>
        </div>
      )}

      {/* Custom Scrollbar & Editor Styles */}
      <style jsx global>{`
        /* Webkit Scrollbar Styling */
        .vscode-editor-container > div:nth-child(3)::-webkit-scrollbar {
          width: 14px;
          height: 14px;
        }

        .vscode-editor-container > div:nth-child(3)::-webkit-scrollbar-track {
          background: #1e1e1e;
        }

        .vscode-editor-container > div:nth-child(3)::-webkit-scrollbar-thumb {
          background: #424242;
          border: 3px solid #1e1e1e;
          border-radius: 10px;
        }

        .vscode-editor-container > div:nth-child(3)::-webkit-scrollbar-thumb:hover {
          background: #4e4e4e;
        }

        .vscode-editor-container > div:nth-child(3)::-webkit-scrollbar-corner {
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

        /* CRITICAL: Remove ALL focus-related styles that could interfere with scrolling */
        .editor-textarea:focus {
          outline: none !important;
          box-shadow: none !important;
          border: none !important;
        }

        /* Remove any default textarea scrollbar - container handles it */
        .editor-textarea::-webkit-scrollbar {
          display: none;
        }

        /* Ensure textarea doesn't create its own scroll */
        .editor-textarea {
          overflow: visible !important;
        }

        /* Smooth scrolling for the container */
        .vscode-editor-container > div:nth-child(3) {
          scroll-behavior: auto;
        }
      `}</style>

      {/* Reset Confirmation Dialog */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-amber-500" />
              Reset to Starter Code?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will discard all your current changes and restore the original starter code. This action cannot be undone.
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
