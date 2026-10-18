'use client';

import { ToolLayout } from '../tool-layout';
import { BiasChatbot } from './bias-chatbot';

const TOOL_SCENARIOS = [
  'Pick a bias type (Gender, Area, Age, Language) and ask a question — the bot answers it for two customers who differ only in that one thing.',
  'Compare the numbers: salary, loan amount, interest rate. Same situation should mean same numbers.',
  'Look for extra conditions given to only one customer (guarantor, more documents, visit a branch).',
  'Ask the same question again — AI bias can be inconsistent, so one fair answer does not prove the bot is fair.',
  'Mark each pair as Biased or Fair, and write down the exact difference as evidence for your bug report.',
];

export default function BiasDetectorTool() {
  return (
    <ToolLayout
      title="Bias Detector"
      description="Ask an AI the same question as two different people — change only gender, area, age or language — and catch where it treats them unfairly."
      difficulty="Beginner"
      scenarios={TOOL_SCENARIOS}
    >
      <BiasChatbot />
    </ToolLayout>
  );
}
