import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { QodeBenchChatbot } from '@/components/testing-tools/qodebench-chatbot';

export const metadata: Metadata = {
  title: 'QodeBench Chatbot',
  description: 'Ask a senior dev tutor about JavaScript, TypeScript, web development and QA automation.',
};

// Public, no-login version of the QodeBench Chatbot (listed in publicRoutes in lib/supabase/middleware.ts)
export default function PublicQodeBenchChatbotPage() {
  return (
    <div className="h-[100dvh] flex flex-col bg-slate-50">
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-200 bg-white flex-shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/qodebench.svg" alt="QodeBench" width={28} height={28} />
          <span className="font-bold text-slate-900">QodeBench Chatbot</span>
        </Link>
        <Link href="/signup" className="text-sm font-medium text-brand-600 hover:text-brand-700">
          Join QodeBench
        </Link>
      </header>
      <main className="flex-1 min-h-0 w-full max-w-4xl mx-auto sm:p-4">
        <div className="h-full sm:rounded-xl sm:border sm:border-slate-200 overflow-hidden shadow-sm">
          <QodeBenchChatbot />
        </div>
      </main>
    </div>
  );
}
