'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CodeBlockWithCopyProps {
  code: string;
  language: string;
}

export function CodeBlockWithCopy({ code, language }: CodeBlockWithCopyProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="relative rounded-xl overflow-hidden my-8 border border-slate-700 shadow-lg group">
      {/* Language Badge */}
      <div className="absolute top-3 left-4 z-10">
        <span className="text-xs font-semibold text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-600">
          {language}
        </span>
      </div>

      {/* Copy Button */}
      <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600 h-8 px-3"
          aria-label={copied ? 'Code copied' : 'Copy code'}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-1.5 text-green-400" />
              <span className="text-xs">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-1.5" />
              <span className="text-xs">Copy</span>
            </>
          )}
        </Button>
      </div>

      {/* Code Block */}
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={language}
        PreTag="div"
        customStyle={{
          margin: 0,
          padding: '3rem 1.5rem 1.5rem',
          fontSize: '0.875rem',
          lineHeight: '1.6',
          borderRadius: 0,
          background: '#1e293b', // slate-800
        }}
        codeTagProps={{
          style: {
            fontFamily: "'Fira Code', 'Cascadia Code', 'Monaco', 'Consolas', monospace",
          },
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
