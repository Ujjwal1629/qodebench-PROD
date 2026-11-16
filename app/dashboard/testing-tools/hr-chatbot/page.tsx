'use client';

import { ToolLayout } from '../tool-layout';
import { RagChatbot, RAG_SCENARIOS } from '@/components/testing-tools/rag-chatbot';

// Same tool as the public page at /testing-tools/rag-chatbot.
export default function HRChatbotTesterTool() {
  return (
    <ToolLayout
      title="RAG Chatbot"
      description="Build a RAG-style HR assistant — a system prompt plus a knowledge base (the handbook) — then run test questions, including prompt-injection attacks, to check whether the bot answers from your data and follows the rules."
      difficulty="Advanced"
      scenarios={RAG_SCENARIOS}
    >
      <RagChatbot />
    </ToolLayout>
  );
}
