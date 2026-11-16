'use client';

import { HallucinationTester } from '@/components/testing-tools/hallucination-tester';
import { RagChatbot } from '@/components/testing-tools/rag-chatbot';
import { QodeBenchChatbot } from '@/components/testing-tools/qodebench-chatbot';
import type { PublicToolSlug } from '@/lib/public-tools';

// The live, interactive tool for a public tool page.
export function ToolEmbed({ slug }: { slug: PublicToolSlug }) {
  switch (slug) {
    case 'hallucination-testing':
      return <HallucinationTester />;
    case 'rag-chatbot':
      return <RagChatbot />;
    case 'qodebench-chatbot':
      return (
        <div className="h-[620px] -m-4 sm:-m-6 overflow-hidden rounded-xl">
          <QodeBenchChatbot />
        </div>
      );
  }
}
