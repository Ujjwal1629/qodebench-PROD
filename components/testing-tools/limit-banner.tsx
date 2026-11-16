'use client';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';

/**
 * Shown when a free (not signed-in) visitor uses up their runs on a public AI
 * tool. Turns the limit into a sign-up prompt instead of a dead end.
 */
export function LimitBanner({ message }: { message: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-lg border border-brand-200 bg-brand-50 px-4 py-3">
      <Sparkles className="hidden sm:block h-5 w-5 shrink-0 text-brand-600" />
      <p className="flex-1 text-sm text-slate-700">{message}</p>
      <Link
        href="/signup"
        className="shrink-0 rounded-lg bg-brand-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
      >
        Sign up free
      </Link>
    </div>
  );
}
