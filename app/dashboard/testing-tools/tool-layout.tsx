'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ChevronDown, ChevronRight, Copy, Check } from 'lucide-react';

interface PlaywrightExample {
  title: string;
  code: string;
}

interface ToolLayoutProps {
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  scenarios: string[];
  playwrightExamples?: PlaywrightExample[];
  children: React.ReactNode;
}

const difficultyColor: Record<string, string> = {
  Beginner: 'bg-green-100 text-green-700 border-green-200',
  Intermediate: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Advanced: 'bg-red-100 text-red-700 border-red-200',
};

function CodeBlock({ title, code }: { title: string; code: string }) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
      >
        <span className="text-sm font-medium text-slate-800">{title}</span>
        {open ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
      </button>
      {open && (
        <div className="relative">
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-1.5 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors z-10"
            title="Copy code"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
          <pre className="bg-slate-900 text-slate-100 p-4 text-xs overflow-x-auto font-mono leading-relaxed">
            {code}
          </pre>
        </div>
      )}
    </div>
  );
}

export function ToolLayout({ title, description, difficulty, scenarios, playwrightExamples, children }: ToolLayoutProps) {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/dashboard/testing-tools" className="hover:text-sky-600 transition-colors flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" />
          Testing Tools
        </Link>
        <span>/</span>
        <span>{title}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        </div>
        <Badge variant="outline" className={difficultyColor[difficulty]}>{difficulty}</Badge>
      </div>

      {/* Tool Content */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm" data-testid="tool-container">
        {children}
      </div>

      {/* Playwright Code Examples */}
      {playwrightExamples && playwrightExamples.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🎭</span>
            <h3 className="font-semibold text-slate-900">Playwright Code Examples</h3>
          </div>
          <p className="text-sm text-slate-600 mb-4">
            Copy these examples and run them against this page. All elements use <code className="bg-slate-100 px-1 rounded text-xs">data-testid</code> attributes for reliable selectors.
          </p>
          <div className="space-y-3">
            {playwrightExamples.map((ex, i) => (
              <CodeBlock key={i} title={ex.title} code={ex.code} />
            ))}
          </div>
        </div>
      )}

      {/* Test Scenarios */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
        <h3 className="font-semibold text-slate-900 mb-3">Suggested Test Scenarios</h3>
        <ol className="text-sm text-slate-600 space-y-2 list-decimal list-inside">
          {scenarios.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}
