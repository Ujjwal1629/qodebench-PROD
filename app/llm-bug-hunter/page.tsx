import { permanentRedirect } from 'next/navigation';

// Old public URL for the hallucination tool. Kept so shared links still work.
export default function LegacyLLMBugHunterPage() {
  permanentRedirect('/testing-tools/hallucination-testing');
}
