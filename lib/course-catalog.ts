// Module "kind" tells the player how to render the module and its items.
//   undefined  → a normal content module: video + revision notes + MCQ per lesson
//   'practice' → a hands-on practice module (one practice set per lesson)
//   'live-qa'  → a live Q&A module (scheduled sessions; dates announced later)
//   'mock-interview' → the capstone mock interview, locked until the phase is done
export type ModuleKind = 'practice' | 'live-qa' | 'mock-interview';

export interface CourseModule {
  title: string;
  detail: string; // e.g. "Weeks 1–2 · 3 Sessions"
  lessons: string[]; // session/topic/item titles; empty = not expandable yet
  kind?: ModuleKind;
  // For 'mock-interview': gate access until the whole phase is completed.
  lockedUntilPhaseComplete?: boolean;
}

export interface CoursePhase {
  name: string;
  detail: string;
  modules: CourseModule[];
}

export interface Course {
  slug: string;
  tag: string;
  status: string;
  statusColor: string;
  title: string;
  description: string;
  meta: { label: string; value: string }[];
  phases: CoursePhase[];
  /** When true the course is not yet open — cards show a "Coming soon" badge
   *  and are not clickable, and the player route redirects away. */
  comingSoon?: boolean;
}

export const COURSES: Course[] = [
  {
    slug: "playwright-test-automation",
    tag: "Flagship Course",
    status: "Coming soon",
    statusColor: "bg-slate-100 text-slate-600 border-slate-200",
    comingSoon: true,
    title: "Playwright Test Automation",
    description:
      "Learn end-to-end testing with Playwright and TypeScript through hands-on practice — from your first test to locators, assertions, hooks, iframes and Page Object Model.",
    meta: [
      { label: "Lessons", value: "10" },
      { label: "Duration", value: "5.5+ hours" },
      { label: "Level", value: "Beginner → Advanced" },
    ],
    phases: [
      {
        name: "Core Curriculum",
        detail: "10 lessons · hands-on practice in every lesson",
        modules: [
          {
            title: "Introduction to Playwright & Running First Test",
            detail: "Lesson 1 · 30 min",
            lessons: [
              "Install Playwright using npm init playwright@latest",
              "Understand the page fixture",
              "Run tests with npx playwright test",
              "Know the project folder structure",
            ],
          },
          {
            title: "Async/Await, Page Fixture & Locator Methods (XPath, CSS, Text)",
            detail: "Lesson 2 · 35 min",
            lessons: [
              "Understand why all Playwright actions need await",
              "Use the page fixture correctly",
              "Write XPath, CSS, and Text locators",
              "Know which locator type to use when",
            ],
          },
          {
            title: "Locator Options, GetBy Methods & Assertions",
            detail: "Lesson 3 · 40 min",
            lessons: [
              "Use locator options: has, hasNot, hasText, hasNotText",
              "Use all GetBy methods correctly",
              "Write assertions with expect()",
              "Choose the right locator strategy",
            ],
          },
          {
            title: "Complete Assertions & playwright.config.ts",
            detail: "Lesson 4 · 35 min",
            lessons: [
              "Use all Playwright assertions including attribute, class, and ID checks",
              "Understand soft assertions vs hard assertions",
              "Add custom error messages to assertions",
              "Configure playwright.config.ts for browsers, retries, and reporting",
            ],
          },
          {
            title: "test.only, test.skip & Test Organization",
            detail: "Lesson 5 · 30 min",
            lessons: [
              "Use test.only to isolate a single test during debugging",
              "Skip tests with test.skip and test.fixme",
              "Group related tests using test.describe",
              "Use tags and --grep for selective test execution",
            ],
          },
          {
            title: "Playwright Config File Deep Dive",
            detail: "Lesson 6 · 30 min",
            lessons: [
              "Configure cross-browser testing with projects",
              "Set global and per-test timeouts",
              "Configure trace, screenshot, and video recording",
              "Use environment variables in config",
            ],
          },
          {
            title: "Playwright Hooks (beforeAll, afterAll, beforeEach, afterEach)",
            detail: "Lesson 7 · 35 min",
            lessons: [
              "Use beforeEach to avoid repeating setup code",
              "Use beforeAll and afterAll for shared browser sessions",
              "Scope hooks with test.describe()",
              "Understand hook execution order",
            ],
          },
          {
            title: "EnterText, Click Types & iframes",
            detail: "Lesson 8 · 30 min",
            lessons: [
              "Use fill, pressSequentially, and press for text input",
              "Perform left click, double-click, and right-click",
              "Handle iframes with page.frame() and contentFrame()",
              "Know when to use each click and input method",
            ],
          },
          {
            title: "iFrame with FrameLocator & Dialogs (Alert, Confirm, Prompt)",
            detail: "Lesson 9 · 30 min",
            lessons: [
              "Use contentFrame() and frameLocator for robust iframe handling",
              "Intercept alert, confirm, and prompt dialogs",
              "Use dialog.accept() and dialog.dismiss() correctly",
              "Always register dialog listeners before triggering the action",
            ],
          },
          {
            title: "Page Object Model (POM) Design Pattern",
            detail: "Lesson 10 · 40 min",
            lessons: [
              "Understand why POM makes tests maintainable",
              "Create a page object class with locators and methods",
              "Use page objects in test files",
              "Apply POM best practices",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "ai-powered-testing",
    tag: "Professional Course",
    status: "First batch",
    statusColor: "bg-amber-50 text-amber-700 border-amber-200",
    title: "AI & ML Testing Professional Course",
    description:
      "Become the QA engineer who can test AI — prompts, RAG systems, agents and LLM APIs. Hands-on with PromptFoo, DeepEval, LangChain, red teaming and production observability.",
    meta: [
      { label: "Live sessions", value: "47" },
      { label: "Duration", value: "18 weeks · 2 phases" },
      { label: "Level", value: "Beginner → Advanced" },
    ],
    phases: [
      {
        name: "Phase 1 — Foundations",
        detail: "26 sessions · practice + live Q&A · mock interview · 10 weeks",
        modules: [
          // Module format: every recorded live session is its own lesson
          // (matching the recordings in Drive — one ~1h video per session),
          // followed by the module's practice sets + assignment inline.
          // Practice:/Assignment: items render the practice panel; everything
          // else renders as a content session (video + notes + MCQ).
          {
            title: "AI/ML Fundamentals for Testers",
            detail: "Weeks 1–2 · 3 sessions + practice",
            lessons: [
              "What is AI/ML — The Tester's Perspective",
              "How LLMs Actually Work — Tokens, Probabilities & Temperature",
              "AI Application Architectures — What You'll Be Testing",
              "Practice: What is AI/ML — The Tester's Perspective",
              "Practice: How LLMs Actually Work — Tokens, Probabilities & Temperature",
              "Practice: AI Application Architectures — What You'll Be Testing",
              "Assignment: Foundations of AI Testing",
            ],
          },
          {
            title: "LLM Behavior & Prompt Engineering",
            detail: "Weeks 2–3 · 3 sessions + practice",
            lessons: [
              "Prompt Engineering Fundamentals",
              "Prompt Testing — Finding Where Prompts Break",
              "Structured Outputs & Output Validation",
              "Practice: Prompt Engineering Fundamentals",
              "Practice: Prompt Testing — Finding Where Prompts Break",
              "Practice: Structured Outputs & Output Validation",
            ],
          },
          {
            title: "LLM Evaluation & Testing Tools",
            detail: "Weeks 3–5 · 7 sessions + practice",
            lessons: [
              "PromptFoo Deep Dive — Setup, Config & First Eval",
              "PromptFoo Advanced — Assertions, LLM-as-Judge & Model Comparison",
              "Python Foundations",
              "DeepEval — Pytest for LLMs",
              "Hallucination Detection — Techniques & Automation",
              "Hallucination Detection — Techniques & Automation (Part 2)",
              "Model Comparison & Regression Testing",
              "Practice: PromptFoo Deep Dive — Setup, Config & First Eval",
              "Practice: PromptFoo Advanced — Assertions, LLM-as-Judge & Model Comparison",
              "Practice: Python Foundations",
              "Practice: DeepEval — Pytest for LLMs",
              "Practice: Hallucination Detection — Techniques & Automation",
              "Practice: Model Comparison & Regression Testing",
            ],
          },
          {
            title: "RAG Basics, API & Automation Testing",
            detail: "Weeks 5–6 · 3 sessions + practice",
            lessons: [
              "RAG Testing Fundamentals",
              "LLM API Testing — OpenAI, Anthropic, Gemini Endpoints",
              "Chatbot UI Testing with Playwright",
              "Practice: RAG Testing Fundamentals",
              "Practice: LLM API Testing — OpenAI, Anthropic, Gemini Endpoints",
              "Practice: Chatbot UI Testing with Playwright",
            ],
          },
          {
            title: "Live Q&A — Course & Sessions",
            detail: "Live · Dates announced soon",
            kind: "live-qa",
            lessons: [
              "Live Q&A: Doubt-Clearing Session",
              "Live Q&A: Tools & Assignments Walkthrough",
            ],
          },
          {
            title: "Live Q&A — Career Counseling",
            detail: "Live · Dates announced soon",
            kind: "live-qa",
            lessons: [
              "Career Counseling: Roles, Portfolio & Interview Prep",
              "Career Counseling: 1-on-1 Guidance & Roadmap",
            ],
          },
          {
            title: "LangChain & LangGraph Testing",
            detail: "Week 6 · 2 sessions + practice",
            lessons: [
              "LangChain Fundamentals & Testing Chains",
              "LangGraph Agent Testing & Tracing",
              "Practice: LangChain Fundamentals & Testing Chains",
              "Practice: LangGraph Agent Testing & Tracing",
            ],
          },
          {
            title: "Security, Safety & Red Teaming",
            detail: "Week 7 · 3 sessions + practice",
            lessons: [
              "OWASP Top 10 for LLMs",
              "Red Teaming with PromptFoo & Giskard",
              "Guardrails, Output Validation & Bias Testing",
              "Practice: OWASP Top 10 for LLMs",
              "Practice: Red Teaming with PromptFoo & Giskard",
              "Practice: Guardrails, Output Validation & Bias Testing",
            ],
          },
          {
            title: "AI Test Planning, Metrics & Observability",
            detail: "Week 8 · 3 sessions + practice",
            lessons: [
              "AI Test Strategy & Planning",
              "AI Quality Metrics & Reporting",
              "AI Observability & Production Monitoring",
              "Practice: AI Test Strategy & Planning",
              "Practice: AI Quality Metrics & Reporting",
              "Practice: AI Observability & Production Monitoring",
            ],
          },
          {
            title: "Capstone Project & Career Kit",
            detail: "Weeks 9–10 · 4 sessions + practice",
            lessons: [
              "Capstone — Project Setup: Build the AI App",
              "Capstone — Full Test Pipeline",
              "Capstone — CI/CD Integration & Demo",
              "AI Testing Career Kit — Resume, Portfolio & Interviews",
              "Practice: Capstone — Project Setup: Build the AI App",
              "Practice: Capstone — Full Test Pipeline",
              "Practice: Capstone — CI/CD Integration & Demo",
              "Practice: AI Testing Career Kit — Resume, Portfolio & Interviews",
            ],
          },
          {
            title: "Final Mock Interview",
            detail: "Unlocks when Phase 1 is complete",
            kind: "mock-interview",
            lockedUntilPhaseComplete: true,
            lessons: [
              "AI Testing Mock Interview — Live Evaluation",
            ],
          },
        ],
      },
      {
        name: "Phase 2 — Mastery",
        detail: "21 sessions · 9 modules · 8 weeks",
        modules: [
          {
            title: "Advanced RAG System Testing",
            detail: "Weeks 1–2 · 3 Sessions",
            lessons: [],
          },
          {
            title: "Vector Database Testing",
            detail: "Week 3 · 2 Sessions",
            lessons: [],
          },
          {
            title: "Chatbot & Virtual Assistant Testing",
            detail: "Week 4 · 2 Sessions",
            lessons: [],
          },
          {
            title: "AI Agent Testing",
            detail: "Week 5 · 3 Sessions",
            lessons: [],
          },
          {
            title: "Multi-Modal & Fine-Tuned Model Testing",
            detail: "Week 6 · 2 Sessions",
            lessons: [],
          },
          {
            title: "DSPy & Synthetic Data Generation",
            detail: "Week 6 (continued) · 1 Session",
            lessons: [],
          },
          {
            title: "Advanced Observability & Monitoring",
            detail: "Week 7 · 2 Sessions",
            lessons: [],
          },
          {
            title: "Benchmarking, Performance & CI/CD",
            detail: "Week 7 (continued) · 2 Sessions",
            lessons: [],
          },
          {
            title: "Advanced End-to-End Capstone Project",
            detail: "Week 8 · 4 Sessions",
            lessons: [],
          },
        ],
      },
    ],
  },
];
