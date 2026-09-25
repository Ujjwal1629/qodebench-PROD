// Mux playback IDs for the AI & ML Testing course, keyed by the exact session
// title as it appears in lib/course-catalog.ts (same convention as ai-testing-notes.ts).
//
// To add a video for a session:
//   1. Upload the clip to Mux (Dashboard → Video → Assets → Upload, or `npm run mux:upload`).
//   2. Copy the asset's **Playback ID** (NOT the asset ID).
//   3. Add one line below: "Exact Session Title": "the-playback-id",
//
// The player picks it up automatically by title — no other change needed.
// A session with no entry keeps the "recording coming soon" placeholder.

import type { BatchId } from '@/lib/course-batches';

// Default recordings — shown to every learner unless their batch has its own
// recording for that session (see AI_TESTING_BATCH_VIDEOS below).
export const AI_TESTING_VIDEOS: Record<string, string> = {
  // Paste each session's Mux Playback ID between the quotes. Empty string = the
  // lesson keeps its "Recording coming soon" placeholder until you fill it.

  // ── Module 1 · AI/ML Fundamentals ──
  "What is AI/ML — The Tester's Perspective": "EV3L8hZVnwOU5LKGbxZ9mAUhIMJIj01oK3rsX5NnPJ02g", // Session 1
  "How LLMs Actually Work — Tokens, Probabilities & Temperature": "oF02nVIoa6SuBXy9Zxrzwbfc25VDwyAbHe8LkaMaJV100", // Session 2
  "AI Application Architectures — What You'll Be Testing": "YGOQ02HnqJOoW84i015WIFAlGG02oNayvW7IXPRky1CBRQ", // Session 3

  // ── Module 2 · LLM Behavior & Prompt Engineering ──
  "Prompt Engineering Fundamentals": "85CR01jkST3tyQDgm00rSR4VYFMd9Ocr02mdussJ01gvIQ8", // Session 4
  "Prompt Testing — Finding Where Prompts Break": "bZng601h541LP3MHM34hXNDq01u1GchE026CIt02N2PG8QQ", // Session 5
  "Structured Outputs & Output Validation": "qarxXGFoTYg3y00bHrsVSUhQJ3Fn2PTZd3zHzKmKA21o", // Session 6

  // ── Module 3 · LLM Evaluation & Testing Tools ──
  "PromptFoo Deep Dive — Setup, Config & First Eval": "RvNyLGfk6ufSUU00D502pONf00jg02bmIeSpe6KIzomT9y8", // Session 7
  "PromptFoo Advanced — Assertions, LLM-as-Judge & Model Comparison": "kpbRGaGXbf02FYWHI028fuPL027jy8jgnwkpXWnbmHQrbY", // Session 8
  "Python Foundations": "f6HbFyZ5jc602svqwEfk00avh02oe6m9TfQyx5w02vnbBjQ", // Session 9
  "DeepEval — Pytest for LLMs": "1iWxoes2Xgt8LK702YH002ypsbBYzubALW01KGryOVyCQM", // Session 10
  "Hallucination Detection — Techniques & Automation": "", // Session 11
  "Hallucination Detection — Techniques & Automation (Part 2)": "", // Session 11 Part 2
  "Model Comparison & Regression Testing": "", // Session 12

  // ── Module 4 · RAG, API & Automation Testing ──
  "RAG Testing Fundamentals": "WvsXIM1qZP02HDRg008vxBh1UzgubMbloQE3o2v9E9Tz00", // Session 12 (RAG)
  "LLM API Testing — OpenAI, Anthropic, Gemini Endpoints": "hqdXK1WrXdZRWeBuW2dLJZ8ETNaKjc59poAZZbxtIpk", // Session 13
  "Chatbot UI Testing with Playwright": "01zIMeShp00bCJn7xYNHHM4MfqKQT4AviBnD02HReW5Wig", // Session 14

  // ── Module · LangChain & LangGraph Testing ──
  "LangChain Fundamentals & Testing Chains": "3m01mHc9EgPZwi4sp1f96pmD5q1QL01EgRJJd02acZYnEo", // Session 15
  "LangGraph Agent Testing & Tracing": "lRGetrEDXsYLAWy00xoL700OOpPVj9mcvdG8L02MYVRPP8", // Session 16

  // ── Module · Security, Safety & Red Teaming ──
  "OWASP Top 10 for LLMs": "5CweDGulBVNa2qw1hjyUkKifdeUenUbNn02c6i7rv418", // Session 17
  "Red Teaming with PromptFoo & Giskard": "ljB01HINaVV016FEpCfm4Tt701n34jmC00LG00mLwQ00fmwFM", // Session 18
  "Guardrails, Output Validation & Bias Testing": "wXt7l01GFuvJjyiQob01v01iH8vbf5ipWkZgUUQhl02Bhyk", // Session 19

  // ── Module · AI Test Planning, Metrics & Observability ──
  // Session 20 has no recording yet — the lesson keeps its placeholder.
  "AI Test Strategy & Planning": "", // Session 20 (recording not yet available)
  "AI Quality Metrics & Reporting": "YpzQ00XcflqyIzlh00JXuKBcjT00r3MssTD5TTMpEgYiQk", // Session 21
  "AI Observability & Production Monitoring": "O2KLW3F1Ju5QcjZFSYIBjXVoVeYIS7X3DciGkMjVgxs", // Session 22
};

// ---------------------------------------------------------------------------
// Sessions whose recording covers additional curriculum topics.
//
// The course normally has one ~1h recording per session (1:1 with its lesson
// title — the default, no entry needed here). If a particular recording spans
// several topics, list it here: session title → topics covered. The course
// page then merges those topics' revision notes and MCQs under that session.

export const SESSION_COVERS: Record<string, string[]> = {};

// ---------------------------------------------------------------------------
// Chapters (timestamps) for full-session recordings, keyed by the same session
// title as AI_TESTING_VIDEOS. Optional — a video with no entry simply has no
// chapter list.
//
// To add chapters for a session:
//   1. Watch/skim the recording and note where each topic starts.
//   2. Add an entry below. `time` accepts "m:ss" or "h:mm:ss" (e.g. "12:30",
//      "1:05:00"). Chapters must be in ascending time order.
//
// They show up two ways: markers on the player's seek bar, and a clickable
// "In this session" list under the video.

export interface VideoChapter {
  /** "m:ss" or "h:mm:ss", e.g. "12:30" or "1:05:00" */
  time: string;
  title: string;
}

/** "1:05:30" | "12:30" → seconds. Returns null for a malformed timestamp. */
export function parseTimestamp(time: string): number | null {
  const parts = time.split(':').map((p) => Number(p));
  if (parts.some((n) => Number.isNaN(n) || n < 0)) return null;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return null;
}

export const AI_TESTING_CHAPTERS: Record<string, VideoChapter[]> = {
  "What is AI/ML — The Tester's Perspective": [
    { time: "0:00", title: "Welcome & introductions" },
    { time: "7:30", title: "Course approach & today's agenda" },
    { time: "8:45", title: "What is AI? Traditional vs AI software" },
    { time: "19:00", title: "Three types of AI — machine learning in the wild" },
    { time: "28:00", title: "LLMs & RAG systems" },
    { time: "41:30", title: "How LLMs work — tokens, prediction & temperature" },
    { time: "1:02:30", title: "AI testing vocabulary — 6 terms you'll use daily" },
    { time: "1:25:00", title: "Traditional testing vs AI testing" },
    { time: "1:27:40", title: "Live demo — same prompt, different answers" },
    { time: "1:33:30", title: "QodeBench demo — hallucination & temperature" },
    { time: "1:48:00", title: "Non-determinism, hallucination & prompt injection" },
    { time: "1:51:00", title: "Homework, OWASP Top 10 & wrap-up" },
  ],

  "How LLMs Actually Work — Tokens, Probabilities & Temperature": [
    { time: "0:00", title: "Homework debrief — same prompt across GPT, Gemini & Claude" },
    { time: "8:03", title: "Why tokens matter — cost, limits & cut-offs" },
    { time: "12:06", title: "OpenAI tokenizer — counting tokens live" },
    { time: "16:32", title: "Non-English prompts cost more — the Hindi test" },
    { time: "22:35", title: "You pay for input & output — system prompts count too" },
    { time: "24:00", title: "Model pricing — 4o vs 4o-mini vs Gemini Flash" },
    { time: "26:02", title: "Probabilities — predicting the next word" },
    { time: "33:02", title: "Temperature — from deterministic to creative" },
    { time: "35:34", title: "Live demo — hallucinated Playwright methods" },
    { time: "43:36", title: "Match production temperature — ask your devs" },
    { time: "45:02", title: "System prompts — the AI rulebook" },
    { time: "47:35", title: "Extracting system prompts — ChatGPT, Gemini & QodeBench" },
    { time: "1:02:34", title: "Context window — the refund-chat example" },
    { time: "1:09:00", title: "Context sizes & token exhaustion" },
    { time: "1:12:41", title: "Recap & tokenizer assignment" },
  ],

  "AI Application Architectures — What You'll Be Testing": [
    { time: "0:00", title: "Homework debrief — probing system prompts" },
    { time: "14:33", title: "Q&A — temperature, tokens & response length" },
    { time: "22:49", title: "Three types of AI apps you'll test" },
    { time: "24:03", title: "Type 1 — plain LLM apps & training-data limits" },
    { time: "26:01", title: "Type 2 — RAG, retrieval augmented generation" },
    { time: "32:04", title: "Four RAG failure modes" },
    { time: "35:03", title: "Type 3 — AI agents (flight-booking example)" },
    { time: "42:32", title: "The layer model — input, system prompt, LLM, guardrails" },
    { time: "44:36", title: "Input-layer testing — empty, special chars, long text" },
    { time: "49:02", title: "Latency & consistency checks" },
    { time: "56:02", title: "RAG pipeline — chunks, retrieval, generation" },
    { time: "59:37", title: "Retrieval metrics — precision & recall" },
    { time: "1:03:38", title: "Groundedness — is the answer from the documents?" },
    { time: "1:14:34", title: "Failure walkthrough — outdated policy & low relevancy" },
    { time: "1:18:03", title: "Agent testing — what can go wrong" },
    { time: "1:24:32", title: "The layer-by-layer testing checklist" },
    { time: "1:28:38", title: "Q&A & wrap-up" },
  ],

  "Prompt Engineering Fundamentals": [
    { time: "0:00", title: "Homework debrief — AI tools in your teams" },
    { time: "10:30", title: "Why prompts matter — bad prompt, bad output" },
    { time: "14:31", title: "The prompt pipeline — user, system prompt, LLM" },
    { time: "16:03", title: "Vague vs specific — the returns experiment" },
    { time: "25:32", title: "Better prompts enable assertions" },
    { time: "33:41", title: "Zero-shot — plain instructions" },
    { time: "37:07", title: "Few-shot — teaching with examples" },
    { time: "42:34", title: "Bias from training data" },
    { time: "46:31", title: "Chain-of-thought — think step by step" },
    { time: "49:43", title: "Live test — classifying a bug report" },
    { time: "58:00", title: "Six components of a system prompt" },
    { time: "1:15:12", title: "Google AI Studio — building the HR bot" },
    { time: "1:19:45", title: "Attacking the HR bot — leaves, salaries, jailbreaks" },
    { time: "1:31:31", title: "Good vs bad prompts" },
    { time: "1:43:01", title: "Assignment — write & attack your own system prompt" },
  ],

  "Prompt Testing — Finding Where Prompts Break": [
    { time: "0:00", title: "Homework recap — hardening the HR system prompt" },
    { time: "4:02", title: "Adversarial prompts — thinking like an attacker" },
    { time: "10:07", title: "Air Canada lawsuit — when hallucination gets legal" },
    { time: "15:08", title: "Domain boundaries & polite redirection" },
    { time: "17:36", title: "Prompt injection — the three types" },
    { time: "20:34", title: "Playgrounds — Hugging Face Spaces & QodeBench" },
    { time: "25:32", title: "Tone testing with a frustrated user" },
    { time: "30:00", title: "Inside a real system prompt" },
    { time: "35:40", title: "Data leakage — the Samsung ChatGPT lesson" },
    { time: "44:36", title: "Direct injection — live jailbreak demo" },
    { time: "56:31", title: "Indirect injection — poisoned docs & EchoLeak" },
    { time: "1:09:03", title: "Crescendo attack — multi-turn testing demo" },
    { time: "1:20:00", title: "Prompt leaking — the Bing \"Sydney\" story" },
    { time: "1:25:38", title: "Wrap-up & assignments" },
  ],

  "Structured Outputs & Output Validation": [
    { time: "0:00", title: "Recap — a correct answer can still crash your app" },
    { time: "2:00", title: "Homework debrief — injection wins from the group" },
    { time: "9:37", title: "Where AI output goes — the application pipeline" },
    { time: "13:00", title: "Food-delivery example — chat message to JSON" },
    { time: "16:03", title: "Chatty wrappers break parsers" },
    { time: "22:11", title: "Live demo — JSON output on ChatGPT, Gemini & QodeBench" },
    { time: "33:00", title: "Common JSON failures to test for" },
    { time: "41:01", title: "The 4-layer validation ladder — airport analogy" },
    { time: "48:04", title: "Hands-on — JSONLint, schema, types & values" },
    { time: "55:03", title: "Instruction-following & length checks" },
    { time: "58:07", title: "Consistency across temperatures — flakiness" },
    { time: "1:03:03", title: "Token usage & cost Q&A" },
    { time: "1:14:32", title: "Writing a classifier prompt — fields & allowed values" },
    { time: "1:23:33", title: "Fixing chatty output with stricter prompts" },
    { time: "1:28:34", title: "Tools, API pricing & assignment" },
  ],

  "PromptFoo Deep Dive — Setup, Config & First Eval": [
    { time: "0:00", title: "Why automate — from manual checks to PromptFoo" },
    { time: "1:03", title: "Setup — Node & installing PromptFoo" },
    { time: "5:00", title: "Getting API keys — OpenAI paid vs free Gemini" },
    { time: "13:30", title: "What is PromptFoo — Postman for LLM testing" },
    { time: "16:39", title: "Creating the project & YAML config" },
    { time: "20:34", title: "System prompt & the {{question}} variable" },
    { time: "26:02", title: "Providers — choosing models to test" },
    { time: "30:17", title: "First test cases — vars & contains assertions" },
    { time: "34:40", title: "Hallucination test — the fake VIP membership" },
    { time: "36:49", title: "LLM rubric — AI as judge, first look" },
    { time: "50:34", title: "Running the eval & the web view" },
    { time: "52:39", title: "Reading the dashboard — tokens, latency, failures" },
    { time: "57:31", title: "Tightening assertions & re-running" },
    { time: "1:12:33", title: "Temperature & config Q&A" },
    { time: "1:20:00", title: "The 10-test suite & model comparison" },
    { time: "1:30:03", title: "Real-world Q&A — judges, tags & wrap-up" },
  ],

  "PromptFoo Advanced — Assertions, LLM-as-Judge & Model Comparison": [
    { time: "0:00", title: "Recap — the confusing laptop verdicts" },
    { time: "4:01", title: "Homework debrief" },
    { time: "10:33", title: "Why keyword checks aren't enough" },
    { time: "15:07", title: "How LLM-as-judge works" },
    { time: "21:05", title: "Judges are non-deterministic too" },
    { time: "23:30", title: "Anatomy of a weak rubric" },
    { time: "28:30", title: "Rewriting to a single yes/no rule" },
    { time: "38:14", title: "Live iteration — strengthening the rubric" },
    { time: "45:00", title: "Rules for a reliable rubric" },
    { time: "48:02", title: "Exercise — fix the bad rubric" },
    { time: "55:36", title: "Self-bias — who judges whom (chef analogy)" },
    { time: "59:30", title: "Forcing a neutral judge" },
    { time: "1:05:30", title: "Rate limits & adding delay" },
    { time: "1:08:00", title: "Model comparison — pass rate vs cost" },
    { time: "1:11:30", title: "Cost decisions by domain — healthcare vs e-commerce" },
    { time: "1:16:00", title: "Task & group debugging — multiple YAML configs" },
  ],

  "Python Foundations": [
    { time: "0:00", title: "Why Python for AI testing" },
    { time: "3:00", title: "Virtual environments — venv setup" },
    { time: "10:04", title: "Variables & basic types" },
    { time: "11:30", title: "Lists & dictionaries" },
    { time: "14:30", title: "Functions & assertions" },
    { time: "17:01", title: "pytest — project setup in VS Code" },
    { time: "19:02", title: "Writing your first test functions" },
    { time: "22:01", title: "Running pytest — passes & a failing assert" },
    { time: "27:11", title: "Troubleshooting — venv, pip & module errors" },
    { time: "29:00", title: "Live debugging on Mac & Windows" },
    { time: "47:04", title: "Wrap-up & next session" },
  ],
};

// ---------------------------------------------------------------------------
// Per-batch recordings (Morning / Afternoon / Evening).
//
// Each batch attends its own live class, so each has its own recording. A
// learner's batch comes from the `course_enrollments` table (migration 075).
//
// Fill these in gradually: for any session a batch has no entry for, that
// batch's learners fall back to the default in AI_TESTING_VIDEOS above. So you
// can add one batch's videos module by module without breaking anything.
//
// Same convention as above: "Exact Session Title": "mux-playback-id".

export const AI_TESTING_BATCH_VIDEOS: Record<BatchId, Record<string, string>> = {
  morning: {},
  afternoon: {},
  evening: {},
};

// Chapters for batch recordings. Timestamps differ between recordings, so a
// batch video only shows chapters listed here — never the default ones.
export const AI_TESTING_BATCH_CHAPTERS: Record<BatchId, Record<string, VideoChapter[]>> = {
  morning: {},
  afternoon: {},
  evening: {},
};

export interface ResolvedSessionVideo {
  playbackId: string;
  chapters: VideoChapter[];
}

/** The recording a learner in `batch` should see for a session, if any. */
export function resolveSessionVideo(
  title: string,
  batch: BatchId | null
): ResolvedSessionVideo | null {
  const batchId = batch ? AI_TESTING_BATCH_VIDEOS[batch][title] : '';
  if (batch && batchId) {
    return { playbackId: batchId, chapters: AI_TESTING_BATCH_CHAPTERS[batch][title] ?? [] };
  }
  const defaultId = AI_TESTING_VIDEOS[title];
  if (defaultId) {
    return { playbackId: defaultId, chapters: AI_TESTING_CHAPTERS[title] ?? [] };
  }
  return null;
}

/** Every playback ID a learner in `batch` is allowed to stream. */
export function allowedPlaybackIds(batch: BatchId | null): Set<string> {
  const titles = new Set([
    ...Object.keys(AI_TESTING_VIDEOS),
    ...(batch ? Object.keys(AI_TESTING_BATCH_VIDEOS[batch]) : []),
  ]);
  const ids = new Set<string>();
  for (const title of titles) {
    const video = resolveSessionVideo(title, batch);
    if (video) ids.add(video.playbackId);
  }
  return ids;
}
