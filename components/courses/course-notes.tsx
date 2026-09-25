'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlockWithCopy } from '@/components/learning/code-block-with-copy';
import { cn } from '@/lib/utils';

interface CourseNotesProps {
  content: string;
  className?: string;
}

// A markdown renderer tuned to the course player's current theme: tight, refined
// typography on the brand/slate palette, clean tables, and hairline borders — a
// calmer, denser look than the animated learning-module renderer. Kept separate
// from EnhancedMarkdownRenderer so the other learning pages are unaffected.
export function CourseNotes({ content, className }: CourseNotesProps) {
  return (
    <div className={cn('max-w-4xl text-slate-700', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-[1.625rem] font-bold tracking-tight text-slate-950 mt-0 mb-4 leading-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-[1.1875rem] font-bold tracking-tight text-slate-900 mt-9 mb-3 pb-1.5 border-b border-slate-200 leading-snug">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-[0.9688rem] font-semibold text-slate-900 mt-6 mb-2.5 leading-snug">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-[0.875rem] font-semibold text-slate-800 mt-5 mb-2">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="text-[0.9062rem] leading-[1.7] text-slate-700 my-3.5">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="my-3.5 space-y-1.5 list-disc marker:text-slate-400 pl-5">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-3.5 space-y-1.5 list-decimal marker:text-slate-400 pl-5">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-[0.9062rem] leading-[1.65] text-slate-700 pl-1">{children}</li>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-slate-950">{children}</strong>
          ),
          em: ({ children }) => <em className="italic text-slate-800">{children}</em>,
          a: ({ children, ...props }) => (
            <a
              className="text-brand-600 font-medium underline decoration-brand-300 underline-offset-2 hover:text-brand-700 hover:decoration-brand-500 transition-colors"
              target={props.href?.startsWith('http') ? '_blank' : undefined}
              rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              {...props}
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-5 rounded-r-lg border-l-[3px] border-brand-500 bg-brand-50/60 px-4 py-3 text-[0.875rem] leading-[1.65] text-slate-800 [&>p]:my-0 [&>p]:text-slate-800">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-8 border-t border-slate-200" />,
          code({ inline, className: codeClass, children, ...props }: any) {
            const match = /language-(\w+)/.exec(codeClass || '');
            const codeString = String(children).replace(/\n$/, '');
            if (!inline && match) {
              return <CodeBlockWithCopy code={codeString} language={match[1]} />;
            }
            return (
              <code
                className="rounded-[5px] bg-slate-100 px-1.5 py-0.5 text-[0.8125rem] font-mono font-medium text-brand-700 border border-slate-200"
                {...props}
              >
                {children}
              </code>
            );
          },
          table: ({ children }) => (
            <div className="my-5 overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full border-collapse text-[0.8438rem]">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-slate-50">{children}</thead>,
          tbody: ({ children }) => (
            <tbody className="divide-y divide-slate-100">{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-slate-50/70 transition-colors">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="px-3.5 py-2.5 text-left font-semibold text-slate-900 border-b border-slate-200">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3.5 py-2.5 align-top text-slate-700">{children}</td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
