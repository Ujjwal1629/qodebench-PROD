'use client';

import { ToolLayout } from '../tool-layout';
import { DriftChatbot } from './drift-chatbot';

const TOOL_SCENARIOS = [
  'Ask the bot about store policies (refunds, delivery, payments) and compare each answer with "What\'s true today".',
  'Ask about things that are new since 2023 (10-minute delivery, UPI Lite) — a drifted bot often denies they exist.',
  'Ask general questions whose answer changes over time (latest iPhone, a company\'s CEO) and check if the answer is stale.',
  'Ask the bot whether its information is up to date — notice it confidently says yes. Drifted AI rarely warns you.',
  'Mark every answer as Outdated or Still correct, and note which type of drift each one is.',
];

export default function DriftTestingTool() {
  return (
    <ToolLayout
      title="Drift Testing"
      description="Chat with an AI trained on old data and catch answers that no longer match the real world — the core of drift testing."
      difficulty="Beginner"
      scenarios={TOOL_SCENARIOS}
    >
      <DriftChatbot />
    </ToolLayout>
  );
}
