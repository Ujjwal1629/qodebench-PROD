'use client';

import { Button } from '@/components/ui/button';
import { Play, RotateCcw } from 'lucide-react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  placeholder?: string;
}

export function CodeEditor({
  value,
  onChange,
  language,
  placeholder,
}: CodeEditorProps) {
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded bg-slate-100 px-2 py-1 text-sm font-medium text-slate-700">
            {language}
          </div>
          <span className="text-sm text-slate-500">
            {(value || '').split('\n').length} lines
          </span>
        </div>
      </div>

      <div className="relative">
        <textarea
          value={value || ''}
          onChange={handleCodeChange}
          className="min-h-[400px] w-full rounded-lg border border-slate-300 bg-slate-50 p-4 font-mono text-sm leading-relaxed text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          spellCheck={false}
          placeholder={placeholder || "Write your code here..."}
        />
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Play className="h-3 w-3" />
        <span>Write your solution above and click Validate to check</span>
      </div>
    </div>
  );
}
