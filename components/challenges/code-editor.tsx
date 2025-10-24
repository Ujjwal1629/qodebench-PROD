'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw } from 'lucide-react';

interface CodeEditorProps {
  starterCode: string;
  language: string;
  onCodeChange: (code: string) => void;
}

export function CodeEditor({
  starterCode,
  language,
  onCodeChange,
}: CodeEditorProps) {
  const [code, setCode] = useState(starterCode);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    onCodeChange(newCode);
  };

  const handleReset = () => {
    setCode(starterCode);
    onCodeChange(starterCode);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded bg-slate-100 px-2 py-1 text-sm font-medium text-slate-700">
            {language}
          </div>
          <span className="text-sm text-slate-500">
            {code.split('\n').length} lines
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>

      <div className="relative">
        <textarea
          value={code}
          onChange={handleCodeChange}
          className="min-h-[400px] w-full rounded-lg border border-slate-300 bg-slate-50 p-4 font-mono text-sm leading-relaxed text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          spellCheck={false}
          placeholder="Write your code here..."
        />
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Play className="h-3 w-3" />
        <span>Write your solution above and click Validate to check</span>
      </div>
    </div>
  );
}
