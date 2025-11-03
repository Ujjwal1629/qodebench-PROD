'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  Code2,
  FileCode,
  Settings,
  Maximize2,
  Minimize2,
  Copy,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VSCodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  placeholder?: string;
}

export function VSCodeEditor({
  value,
  onChange,
  language,
  placeholder,
}: VSCodeEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lineCount, setLineCount] = useState(1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update line count whenever value changes
  useEffect(() => {
    const lines = (value || '').split('\n').length;
    setLineCount(lines);
  }, [value]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
              solution.{language === 'javascript' ? 'js' : language === 'typescript' ? 'ts' : language === 'json' ? 'json' : 'txt'}
            </span>
          </div>
        </div>

        {/* Right - Editor Actions */}
        <div className="flex items-center gap-1">
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
            solution.{language === 'javascript' ? 'js' : language === 'typescript' ? 'ts' : 'txt'}
          </span>
          <div className="w-1 h-1 bg-slate-500 rounded-full ml-1"></div>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="flex bg-[#1e1e1e]" style={{ height: isFullscreen ? 'calc(100vh - 80px)' : '500px' }}>
        {/* Line Numbers */}
        <div className="flex-shrink-0 bg-[#1e1e1e] border-r border-slate-800 py-4 px-2 select-none">
          <div className="space-y-0 font-mono text-right" style={{ fontSize: '13px', lineHeight: '21px' }}>
            {Array.from({ length: Math.max(lineCount, 20) }, (_, i) => (
              <div
                key={i + 1}
                className="text-slate-600 pr-2"
                style={{ minWidth: '40px' }}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Text Editor */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={value || ''}
            onChange={handleCodeChange}
            onKeyDown={handleKeyDown}
            className="w-full h-full bg-[#1e1e1e] text-slate-100 p-4 font-mono resize-none focus:outline-none"
            style={{
              fontSize: '14px',
              lineHeight: '21px',
              tabSize: 2,
              letterSpacing: '0.2px',
            }}
            spellCheck={false}
            placeholder={placeholder || "// Start typing your code here...\n// Use Tab for indentation\n"}
          />

          {/* Editor Minimap (visual indicator only) */}
          <div className="absolute top-0 right-0 w-20 h-full bg-[#1e1e1e]/60 border-l border-slate-800 pointer-events-none opacity-40">
            <div className="space-y-[2px] p-2">
              {Array.from({ length: Math.min(lineCount, 50) }, (_, i) => {
                // Deterministic width based on line index to avoid hydration mismatch
                const width = 40 + ((i * 7) % 60);
                return (
                  <div
                    key={i}
                    className="h-[4px] bg-slate-600 rounded-full"
                    style={{ width: `${width}%` }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* VS Code Status Bar */}
      <div className="flex items-center justify-between bg-[#007acc] px-4 py-1 text-xs text-white">
        {/* Left Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Code2 className="h-3 w-3" />
            <span className="font-medium">{language.toUpperCase()}</span>
          </div>
          <span>UTF-8</span>
          <span>Ln {(value || '').split('\n').length}, Col 1</span>
        </div>

        {/* Right Status */}
        <div className="flex items-center gap-4">
          <span>{lineCount} lines</span>
          <span>{(value || '').length} chars</span>
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

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .vscode-editor-container textarea::-webkit-scrollbar {
          width: 14px;
          height: 14px;
        }

        .vscode-editor-container textarea::-webkit-scrollbar-track {
          background: #1e1e1e;
        }

        .vscode-editor-container textarea::-webkit-scrollbar-thumb {
          background: #424242;
          border: 3px solid #1e1e1e;
          border-radius: 10px;
        }

        .vscode-editor-container textarea::-webkit-scrollbar-thumb:hover {
          background: #4e4e4e;
        }

        .vscode-editor-container textarea::placeholder {
          color: #6a9955;
          font-style: italic;
        }

        /* VS Code-like selection */
        .vscode-editor-container textarea::selection {
          background: #264f78;
        }
      `}</style>
    </div>
  );
}
