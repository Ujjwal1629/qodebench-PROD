'use client';

import { Textarea } from '@/components/ui/textarea';
import { AlignLeft } from 'lucide-react';

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function TextEditor({ value, onChange, placeholder }: TextEditorProps) {
  const wordCount = value.trim().split(/\s+/).filter(Boolean).length;
  const charCount = value.length;

  return (
    <div className="w-full rounded-lg border border-slate-200 bg-white overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-2 flex items-center gap-2">
        <AlignLeft className="h-4 w-4 text-slate-600" />
        <span className="text-sm font-medium text-slate-700">Plain Text Editor</span>
      </div>

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Write your response here..."}
        className="min-h-[500px] border-0 rounded-none text-sm resize-none focus-visible:ring-0 focus-visible:ring-offset-0 p-6"
      />

      <div className="border-t border-slate-200 bg-slate-50 px-4 py-2 flex items-center justify-between text-xs text-slate-600">
        <span>
          <span className="font-medium">Words:</span> {wordCount}
          <span className="ml-4 font-medium">Characters:</span> {charCount}
        </span>
      </div>
    </div>
  );
}
