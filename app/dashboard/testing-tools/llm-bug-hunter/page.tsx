'use client';

import { ToolLayout } from '../tool-layout';
import { HallucinationTester, HALLUCINATION_SCENARIOS } from '@/components/testing-tools/hallucination-tester';

// Same tool as the public page at /testing-tools/hallucination-testing.
export default function LLMBugHunterTool() {
  return (
    <ToolLayout
      title="Hallucination Testing"
      description="Interact with a real AI and practise spotting hallucinations, factual errors, prompt injections, and context leakage."
      difficulty="Intermediate"
      scenarios={HALLUCINATION_SCENARIOS}
    >
      <HallucinationTester />
    </ToolLayout>
  );
}
