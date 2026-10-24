'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bot, Check, ExternalLink, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QodeBenchChatbot } from '@/components/testing-tools/qodebench-chatbot';

const PUBLIC_PATH = '/qodebench-chatbot';

export default function QodeBenchChatbotToolPage() {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}${PUBLIC_PATH}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <Link
        href="/dashboard/testing-tools"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Testing Tools
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Bot className="h-6 w-6 text-brand-600" />
            QodeBench Chatbot
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Your senior dev tutor for JavaScript, TypeScript, web development and QA automation.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopyLink}>
            {copied ? <Check className="h-4 w-4 mr-1.5" /> : <Link2 className="h-4 w-4 mr-1.5" />}
            {copied ? 'Copied!' : 'Copy public link'}
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={PUBLIC_PATH} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-1.5" />
              Open
            </a>
          </Button>
        </div>
      </div>

      <div className="h-[calc(100dvh-14rem)] min-h-[500px] rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <QodeBenchChatbot />
      </div>
    </div>
  );
}
