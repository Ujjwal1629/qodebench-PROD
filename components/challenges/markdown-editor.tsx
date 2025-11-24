'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import ReactMarkdown from 'react-markdown';
import { FileText, Eye } from 'lucide-react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  return (
    <div className="w-full rounded-lg border border-slate-200 bg-white overflow-hidden">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'write' | 'preview')} className="w-full">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-2">
          <TabsList className="bg-white">
            <TabsTrigger value="write" className="gap-2">
              <FileText className="h-4 w-4" />
              Write
            </TabsTrigger>
            <TabsTrigger value="preview" className="gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="write" className="m-0 p-0">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "Write your response in markdown...\n\nExample:\n## Section Title\n- Bullet point 1\n- Bullet point 2"}
            className="min-h-[300px] md:min-h-[500px] border-0 rounded-none font-mono text-sm resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </TabsContent>

        <TabsContent value="preview" className="m-0 p-0">
          <div className="min-h-[300px] max-h-[500px] md:min-h-[500px] md:max-h-[600px] overflow-y-auto p-6 bg-white">
            {value.trim() ? (
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown>{value}</ReactMarkdown>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 italic">
                Nothing to preview. Write something in the "Write" tab.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="border-t border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-600">
        <span className="font-medium">Tip:</span> Use markdown syntax for formatting.
        <span className="ml-2">
          <code className="bg-slate-200 px-1 py-0.5 rounded">## Heading</code>
          <code className="bg-slate-200 px-1 py-0.5 rounded ml-2">- Bullet</code>
          <code className="bg-slate-200 px-1 py-0.5 rounded ml-2">**Bold**</code>
        </span>
      </div>
    </div>
  );
}
