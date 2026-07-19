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
  "DeepEval — Pytest for LLMs": "", // Session 10
  "Hallucination Detection — Techniques & Automation": "", // Session 11
  "Hallucination Detection — Techniques & Automation (Part 2)": "", // Session 11 Part 2
  "Model Comparison & Regression Testing": "", // Session 12

  // ── Module 4 · RAG, API & Automation Testing ──
  "RAG Testing Fundamentals": "", // Session 12 (RAG)
  "LLM API Testing — OpenAI, Anthropic, Gemini Endpoints": "", // Session 13
  "Chatbot UI Testing with Playwright": "",

  // ── Module · LangChain & LangGraph Testing ──
  "LangChain Fundamentals & Testing Chains": "",
  "LangGraph Agent Testing & Tracing": "",

  // ── Module · Security, Safety & Red Teaming ──
  "OWASP Top 10 for LLMs": "",
  "Red Teaming with PromptFoo & Giskard": "",
  "Guardrails, Output Validation & Bias Testing": "",
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
};
