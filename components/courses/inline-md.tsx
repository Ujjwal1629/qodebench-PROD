'use client';

import { Fragment, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

// Inline-only markdown for practice/quiz copy: **bold**, `code`, *italic*.
// Deliberately not a full markdown renderer — practice prompts are single
// paragraphs, so pulling in ReactMarkdown here would cost more than it gives.
// Anything unmatched renders as-is, so plain strings pass through untouched.
//
// Backticks are matched first: code spans win over emphasis, so a snippet like
// `a ** b` keeps its asterisks instead of turning into bold.
const TOKEN = /`([^`]+)`|\*\*([^*]+)\*\*|\*([^*\n]+)\*/g;

export function InlineMd({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return <span className={className}>{render(children)}</span>;
}

function render(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;

  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const [, code, bold, italic] = m;

    if (code !== undefined) {
      out.push(
        <code
          key={m.index}
          className={cn(
            'rounded-[4px] border border-slate-200 bg-slate-100 px-1 py-px',
            'font-mono text-[0.9em] font-medium text-brand-700'
          )}
        >
          {code}
        </code>
      );
    } else if (bold !== undefined) {
      out.push(
        <strong key={m.index} className="font-semibold text-slate-950">
          {bold}
        </strong>
      );
    } else {
      out.push(
        <em key={m.index} className="italic">
          {italic}
        </em>
      );
    }
    last = m.index + m[0].length;
  }

  if (last < text.length) out.push(text.slice(last));
  return out.map((n, i) => <Fragment key={i}>{n}</Fragment>);
}
