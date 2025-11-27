'use client';

import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ArrowLeft, CheckCircle2, BookOpen, Lightbulb, AlertCircle, Code2, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ImprovedTheoryPanelProps {
  lesson: {
    title: string;
    description: string;
    content: string;
    order_index: number;
    duration_minutes: number;
  };
  backHref: string;
  quizQuestionsCount: number;
}

export function ImprovedTheoryPanel({ lesson, backHref, quizQuestionsCount }: ImprovedTheoryPanelProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar - W3Schools style */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Lessons
          </Link>
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              Lesson {lesson.order_index}
            </span>
            <span className="text-slate-300">•</span>
            <span>{lesson.duration_minutes} min</span>
            <span className="text-slate-300">•</span>
            <span>{quizQuestionsCount} quiz questions</span>
          </div>
        </div>
      </div>

      {/* Main Content - W3Schools style with better spacing and typography */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Lesson Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full mb-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700">Currently Learning</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4 leading-tight">
            {lesson.title}
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-3xl">
            {lesson.description}
          </p>
        </div>

        {/* Theory Content with W3Schools-inspired styling */}
        <div className="w3-theory-content space-y-6">
          <style jsx global>{`
            /* W3Schools-inspired theory styling */
            .w3-theory-content {
              font-family: 'Inter', -apple-system, system-ui, sans-serif;
              font-size: 16px;
              line-height: 1.8;
              color: #1e293b;
            }

            .w3-theory-content h1 {
              font-size: 2rem;
              font-weight: 700;
              color: #0f172a;
              margin-top: 3rem;
              margin-bottom: 1.5rem;
              padding-bottom: 0.75rem;
              border-bottom: 3px solid #0ea5e9;
            }

            .w3-theory-content h2 {
              font-size: 1.75rem;
              font-weight: 700;
              color: #0ea5e9;
              margin-top: 2.5rem;
              margin-bottom: 1.25rem;
              display: flex;
              align-items: center;
              gap: 0.75rem;
            }

            .w3-theory-content h2::before {
              content: '';
              display: inline-block;
              width: 4px;
              height: 1.75rem;
              background: linear-gradient(to bottom, #0ea5e9, #06b6d4);
              border-radius: 2px;
            }

            .w3-theory-content h3 {
              font-size: 1.375rem;
              font-weight: 600;
              color: #334155;
              margin-top: 2rem;
              margin-bottom: 1rem;
            }

            .w3-theory-content p {
              margin-bottom: 1.25rem;
              color: #475569;
              line-height: 1.8;
            }

            .w3-theory-content strong {
              font-weight: 600;
              color: #0f172a;
            }

            .w3-theory-content em {
              font-style: italic;
              color: #64748b;
            }

            .w3-theory-content a {
              color: #0ea5e9;
              text-decoration: underline;
              text-underline-offset: 2px;
              transition: color 0.2s;
            }

            .w3-theory-content a:hover {
              color: #0284c7;
            }

            /* Lists - W3Schools style */
            .w3-theory-content ul {
              margin: 1.5rem 0;
              padding-left: 0;
              list-style: none;
            }

            .w3-theory-content ul li {
              position: relative;
              padding-left: 2rem;
              margin-bottom: 0.875rem;
              line-height: 1.7;
            }

            .w3-theory-content ul li::before {
              content: '✓';
              position: absolute;
              left: 0;
              top: 0;
              width: 1.5rem;
              height: 1.5rem;
              background: #10b981;
              color: white;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 0.75rem;
              font-weight: 600;
            }

            .w3-theory-content ol {
              margin: 1.5rem 0;
              padding-left: 2rem;
              counter-reset: item;
              list-style: none;
            }

            .w3-theory-content ol li {
              position: relative;
              padding-left: 1.5rem;
              margin-bottom: 0.875rem;
              counter-increment: item;
              line-height: 1.7;
            }

            .w3-theory-content ol li::before {
              content: counter(item);
              position: absolute;
              left: 0;
              top: 0;
              width: 1.75rem;
              height: 1.75rem;
              background: linear-gradient(135deg, #0ea5e9, #06b6d4);
              color: white;
              border-radius: 6px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 0.875rem;
              font-weight: 600;
            }

            /* Inline code - W3Schools style */
            .w3-theory-content code:not(pre code) {
              background: #fef3c7;
              color: #92400e;
              padding: 0.2rem 0.5rem;
              border-radius: 4px;
              font-family: 'Monaco', 'Courier New', monospace;
              font-size: 0.9em;
              font-weight: 500;
              border: 1px solid #fde68a;
            }

            /* Blockquotes - Info boxes like W3Schools */
            .w3-theory-content blockquote {
              margin: 1.5rem 0;
              padding: 1.25rem 1.5rem;
              background: linear-gradient(to right, #dbeafe, #e0f2fe);
              border-left: 5px solid #0ea5e9;
              border-radius: 8px;
              font-style: normal;
            }

            .w3-theory-content blockquote p {
              margin: 0;
              color: #0c4a6e;
            }

            .w3-theory-content blockquote::before {
              content: 'ℹ️';
              font-size: 1.25rem;
              margin-right: 0.5rem;
            }

            /* Tables - W3Schools style */
            .w3-theory-content table {
              width: 100%;
              border-collapse: collapse;
              margin: 1.5rem 0;
              background: white;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }

            .w3-theory-content th {
              background: linear-gradient(to bottom, #0ea5e9, #0284c7);
              color: white;
              font-weight: 600;
              padding: 0.875rem 1rem;
              text-align: left;
              font-size: 0.9375rem;
            }

            .w3-theory-content td {
              padding: 0.875rem 1rem;
              border-bottom: 1px solid #e2e8f0;
              color: #475569;
            }

            .w3-theory-content tr:hover td {
              background: #f8fafc;
            }

            .w3-theory-content tr:last-child td {
              border-bottom: none;
            }
          `}</style>

          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <CodeBlock
                    language={match[1]}
                    code={String(children).replace(/\n$/, '')}
                  />
                ) : (
                  <code {...props}>{children}</code>
                );
              },
            }}
          >
            {lesson.content}
          </ReactMarkdown>
        </div>

        {/* Quiz CTA - W3Schools style */}
        {quizQuestionsCount > 0 && (
          <div className="mt-12 bg-gradient-to-br from-sky-50 via-white to-purple-50 rounded-3xl p-8">
            <div className="flex flex-col items-center text-center">
              <div className="flex-shrink-0 bg-gradient-to-br from-sky-500 to-purple-600 p-4 rounded-2xl shadow-lg mb-6">
                <CheckCircle2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                  Ready to Test Your Knowledge?
                </h2>
                <p className="text-base text-slate-600 leading-relaxed max-w-2xl mx-auto mb-6">
                  Complete the quiz to reinforce what you have learned. You can move to the next lesson anytime - scoring well helps track your progress and mastery!
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl text-sm font-medium text-slate-700 shadow-sm">
                    <Code2 className="h-4 w-4 text-sky-600" />
                    {quizQuestionsCount} Questions
                  </span>
                  <span className="text-sm text-slate-500 font-medium">
                    Switch to the Quiz tab to get started →
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Code Block Component with VS Code-style UI and copy button
function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-slate-700 shadow-xl">
      {/* Code header - W3Schools/VS Code style */}
      <div className="flex items-center justify-between bg-slate-800 px-4 py-2 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="ml-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">
            {language}
          </span>
        </div>
        <Button
          onClick={handleCopy}
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-slate-400 hover:text-white hover:bg-slate-700"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 mr-1.5" />
              <span className="text-xs">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 mr-1.5" />
              <span className="text-xs">Copy</span>
            </>
          )}
        </Button>
      </div>

      {/* Code content */}
      <div className="relative">
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={language}
          PreTag="div"
          customStyle={{
            margin: 0,
            padding: '1.5rem',
            fontSize: '0.9375rem',
            lineHeight: '1.6',
            background: '#1e1e1e',
            borderRadius: 0,
          }}
          showLineNumbers={true}
          lineNumberStyle={{
            minWidth: '3em',
            paddingRight: '1.5em',
            color: '#858585',
            userSelect: 'none',
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
