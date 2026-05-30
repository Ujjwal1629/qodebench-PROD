'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TestTube, ArrowRight, LogIn, Table2, ListChecks, Bug } from 'lucide-react';

const tools = [
  {
    id: 'login-form',
    icon: LogIn,
    title: 'Login Form',
    description: 'Practice form filling, validation handling, error messages, and successful authentication flows.',
    tags: ['Forms', 'Validation', 'Auth'],
    difficulty: 'Beginner',
    color: 'bg-blue-500',
  },
  {
    id: 'checkboxes-dropdowns',
    icon: ListChecks,
    title: 'Checkboxes & Dropdowns',
    description: 'Interact with checkboxes, radio buttons, cascading dropdowns, and form submission.',
    tags: ['Inputs', 'Select', 'Checkboxes'],
    difficulty: 'Beginner',
    color: 'bg-cyan-500',
  },
  {
    id: 'dynamic-table',
    icon: Table2,
    title: 'Dynamic Table',
    description: 'Sortable, filterable, paginated table. Practice locating rows, editing, deleting, and verifying data.',
    tags: ['Tables', 'Sorting', 'Pagination'],
    difficulty: 'Intermediate',
    color: 'bg-purple-500',
  },
  {
    id: 'llm-bug-hunter',
    icon: Bug,
    title: 'LLM Bug Hunter',
    description: 'Spot hallucinations, prompt injections, factual errors, and context leakage in AI responses. Test your eye for AI bugs.',
    tags: ['AI', 'Hallucination', 'QA'],
    difficulty: 'Intermediate',
    color: 'bg-rose-500',
  },
];

const difficultyColor: Record<string, string> = {
  Beginner: 'bg-green-100 text-green-700 border-green-200',
  Intermediate: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Advanced: 'bg-red-100 text-red-700 border-red-200',
};

export default function TestingToolsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-3">
          <TestTube className="h-7 w-7 text-sky-600" />
          Testing Tools
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          Interactive web apps with built-in Playwright editors. Write automation code, run it, and see results instantly.
        </p>
        <div className="flex items-center gap-2 mt-3">
          <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
            100% Free
          </Badge>
          <Badge variant="outline">{tools.length} Tools</Badge>
          <Badge variant="secondary" className="bg-rose-100 text-rose-700 border-rose-200">New: LLM Bug Hunter</Badge>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const href = `/dashboard/testing-tools/${tool.id}`;
          return (
            <Link key={tool.id} href={href}>
              <Card className="h-full border border-slate-200 hover:border-sky-300 hover:shadow-lg cursor-pointer transition-all hover:-translate-y-0.5">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${tool.color}`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <Badge variant="outline" className={difficultyColor[tool.difficulty]}>
                      {tool.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="mt-3 text-base">{tool.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {tool.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {tool.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-sm font-medium text-sky-600">
                    Open Tool
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* How to use */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
        <h3 className="font-semibold text-slate-900 mb-2">How to use these tools</h3>
        <ol className="text-sm text-slate-600 space-y-2 list-decimal list-inside">
          <li>Open any tool above — each one is a fully interactive web app.</li>
          <li>Explore the UI manually to understand how it works.</li>
          <li>Use the built-in Playwright editor below each tool to write automation code.</li>
          <li>Click &quot;Run Test&quot; to execute your code against the live UI and see step-by-step results.</li>
        </ol>
      </div>
    </div>
  );
}
