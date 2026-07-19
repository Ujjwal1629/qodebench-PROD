// On-site MCQ quizzes for the AI & ML Testing course, keyed by the exact session
// title as it appears in lib/course-catalog.ts (same convention as
// ai-testing-notes.ts and ai-testing-videos.ts).
//
// Each session has 5–10 questions. `correctIndex` is 0-based into `options`.
// `explanation` is shown after the learner answers. The player picks these up by
// title automatically — a session with no entry simply shows no MCQ tab content.

export interface MCQ {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const AI_TESTING_MCQS: Record<string, MCQ[]> = {
  "What is AI/ML — The Tester's Perspective": [
    {
      question:
        "What is the fundamental difference between traditional software and AI software?",
      options: [
        "Traditional software is faster; AI software is slower",
        "Traditional software is rules-based; AI software is pattern-based",
        "Traditional software runs on servers; AI software runs in the browser",
        "There is no real difference — both follow explicit rules",
      ],
      correctIndex: 1,
      explanation:
        "Traditional software follows rules a developer wrote (same input → same output). AI software learns patterns from data and generates answers, so nobody wrote — or fully knows — the exact rules.",
    },
    {
      question:
        "Why does assertEquals() break when testing an LLM chatbot?",
      options: [
        "LLMs are too slow to return a response in time",
        "LLMs can give a differently-worded answer to the same question each time (non-determinism)",
        "assertEquals() only works on numbers, not text",
        "LLMs always return errors instead of text",
      ],
      correctIndex: 1,
      explanation:
        "LLMs are non-deterministic — the same question can produce different wording every time. An exact-string assertion fails on the second run even though the chatbot works fine. This is why we use semantic testing.",
    },
    {
      question: "What is a hallucination in the context of AI testing?",
      options: [
        "The AI crashes and returns a stack trace",
        "The AI refuses to answer a question",
        "The AI confidently makes up information that is false",
        "The AI takes too long to respond",
      ],
      correctIndex: 2,
      explanation:
        "A hallucination is a confident, fluent, false answer. There's no crash, no error code, and no stack trace — which is exactly why traditional tools like Selenium can't catch it.",
    },
    {
      question:
        "Which three types of AI will you encounter most often as a tester in this course?",
      options: [
        "Robotics, computer vision, and speech synthesis",
        "Machine Learning, LLMs, and RAG systems",
        "Blockchain, IoT, and edge computing",
        "Supervised, unsupervised, and reinforcement learning only",
      ],
      correctIndex: 1,
      explanation:
        "The three that matter for this course are Machine Learning (the broad category), LLMs (ChatGPT/Claude/Gemini), and RAG systems (the AI searches your documents first, then answers).",
    },
    {
      question:
        "In a RAG system, why do testers have TWO failure points instead of one?",
      options: [
        "Because RAG uses two different AI models at once",
        "Because you test whether the right document was retrieved AND whether the answer generated from it is correct",
        "Because RAG always runs the question twice",
        "Because RAG needs both a frontend and a backend test",
      ],
      correctIndex: 1,
      explanation:
        "RAG first retrieves documents, then generates an answer from them. You must test both — did it retrieve the right document, and did it generate the right answer from it?",
    },
    {
      question:
        "According to the session, what does an LLM actually do when it generates an answer?",
      options: [
        "It looks up the verified correct answer in a database",
        "It predicts the most probable next word based on patterns from training",
        "It asks another AI to confirm the answer is true",
        "It searches the live internet for the answer",
      ],
      correctIndex: 1,
      explanation:
        "An LLM predicts the most likely next word, one token at a time. It predicts what *sounds* right, not what *is* right — which is the root cause of hallucination.",
    },
    {
      question:
        "What does the 'temperature' setting control, and what should a medical chatbot use?",
      options: [
        "It controls response speed; medical bots should use high temperature",
        "It controls randomness; a medical bot should run at temperature 0 (most consistent)",
        "It controls the token limit; medical bots need temperature 1",
        "It controls the model size; temperature is irrelevant for medical bots",
      ],
      correctIndex: 1,
      explanation:
        "Temperature 0 always picks the most probable word (safest, most consistent). Temperature 1 allows less probable words (more creative, more hallucination). A medical chatbot should run at 0; a creative assistant can run higher.",
    },
    {
      question:
        "What is a 'system prompt' and why does it matter for testers?",
      options: [
        "The error message shown when the AI fails — testers ignore it",
        "Hidden instructions that tell the AI how to behave; testing them is a huge part of AI testing",
        "The user's typed question — the only thing testers check",
        "A prompt that restarts the AI system",
      ],
      correctIndex: 1,
      explanation:
        "The system prompt is a hidden set of rules ('You are a support agent. Be polite. Don't share personal data.'). Testing whether the AI follows it — and whether users can break it — is central to AI testing.",
    },
    {
      question:
        "Which of these is the 'new SQL injection' for AI that no firewall or WAF catches?",
      options: [
        "Non-determinism",
        "Prompt injection",
        "Token overflow",
        "Context truncation",
      ],
      correctIndex: 1,
      explanation:
        "Prompt injection ('Ignore all previous instructions...') can hijack a chatbot's behavior. No firewall or WAF catches it — it's a new class of attack we address with red teaming.",
    },
    {
      question:
        "What is the realistic goal of hallucination testing, according to the session?",
      options: [
        "To make hallucination rate exactly zero",
        "To measure the hallucination rate and decide if it's acceptable for the use case",
        "To prove the AI never makes mistakes",
        "To replace the AI model with a rules-based system",
      ],
      correctIndex: 1,
      explanation:
        "Zero hallucination is impossible — it's how LLMs work. The job is to measure the *rate* and decide if it's acceptable: 5% in a medical bot is unacceptable, but 5% randomness in a creative assistant is probably fine.",
    },
  ],

  "How LLMs Actually Work — Tokens, Probabilities & Temperature": [
    {
      question: "What is a 'token' in the context of LLMs?",
      options: [
        "A security key for the API",
        "A piece of a word — roughly a word or part of a word",
        "A single character of text",
        "A complete sentence",
      ],
      correctIndex: 1,
      explanation:
        "A token is roughly a word or part of a word. The AI reads tokens, not words. You pay per token, and context limits are measured in tokens.",
    },
    {
      question: "Why do testers care about tokens? (Best answer)",
      options: [
        "Tokens determine the color of the UI",
        "You pay per token, context windows are token-limited, and cost testing is a real activity",
        "Tokens are only relevant to developers, not testers",
        "Tokens control the AI's temperature",
      ],
      correctIndex: 1,
      explanation:
        "You pay per token (input + output), context windows have token limits, cost comparison between models is a real testing activity, and max-token cutoffs can chop responses mid-sentence.",
    },
    {
      question:
        "Which typically costs more per token — input or output — and by roughly how much?",
      options: [
        "Input costs more, about 10× as much",
        "Output costs more, roughly 3–5× as much",
        "They always cost exactly the same",
        "Input is free; only output is billed",
      ],
      correctIndex: 1,
      explanation:
        "Output costs 3–5× more than input everywhere, because generating text is harder than reading it. Long-winded responses burn money.",
    },
    {
      question:
        "In the tokenizer exercise, what did non-English text (like Hindi) reveal?",
      options: [
        "It uses exactly the same number of tokens as English",
        "It often takes 2–3× more tokens for the same meaning, so non-English users cost more to serve",
        "It cannot be tokenized at all",
        "It uses fewer tokens than English",
      ],
      correctIndex: 1,
      explanation:
        "Non-English text often takes 2–3× more tokens for the same meaning. Non-English users literally cost more to serve — a testable business concern.",
    },
    {
      question:
        "Why does an LLM sometimes answer '10 seconds' for Selenium's default implicit wait when the answer is 0?",
      options: [
        "The model is broken and needs retraining",
        "'10' is also a probable next word because many blog posts mention it — probability led to the wrong word",
        "Selenium changed the default to 10",
        "The temperature was set to 0",
      ],
      correctIndex: 1,
      explanation:
        "The model computes a probability for every possible next word. '10' is highly probable because countless blogs mention '10 seconds', so sometimes probability leads to the wrong word. This is by design, not a bug.",
    },
    {
      question: "At temperature 0, how does the AI behave?",
      options: [
        "It always picks the highest-probability word — same input gives the same output",
        "It picks completely random words",
        "It refuses to answer",
        "It becomes maximally creative",
      ],
      correctIndex: 0,
      explanation:
        "Temperature 0 always picks the most probable word, so the same input gives the same (or nearly identical) output. It's the safest, most consistent setting.",
    },
    {
      question:
        "Why must you know your PRODUCTION chatbot's temperature before testing it?",
      options: [
        "Temperature affects the UI color scheme",
        "If you test at temp 0 but production runs at 0.7, your tests aren't testing real behaviour",
        "Temperature determines the API price only",
        "It doesn't matter — temperature is irrelevant to testing",
      ],
      correctIndex: 1,
      explanation:
        "If you test at temperature 0 but production runs at 0.7, you're testing different behaviour than real users experience. Always test at the production temperature.",
    },
    {
      question:
        "What are the TWO testing areas for a system prompt?",
      options: [
        "Speed and cost",
        "Compliance (does the AI follow it?) and override (can a user break it via injection?)",
        "Color and font",
        "Grammar and spelling",
      ],
      correctIndex: 1,
      explanation:
        "You test compliance — does the AI actually follow the system prompt? — and override — can a user break the rules with prompt injection or a leak attempt?",
    },
    {
      question:
        "What happens when a conversation exceeds the context window limit?",
      options: [
        "The AI shows a clear error message",
        "The AI silently drops the oldest messages — no error, no warning",
        "The AI restarts the conversation from scratch",
        "The API rejects the request with a 500 error",
      ],
      correctIndex: 1,
      explanation:
        "When the total exceeds the window, the AI silently drops the oldest messages. It just forgets earlier context and answers with missing information — a testable bug (e.g. DeepEval's KnowledgeRetentionMetric).",
    },
    {
      question:
        "Approximately how large is GPT-4o's context window, and how does Gemini 2.0 compare?",
      options: [
        "GPT-4o ≈ 1K tokens; Gemini ≈ 2K",
        "GPT-4o ≈ 128K tokens; Gemini 2.0 ≈ 1M tokens",
        "They are both unlimited",
        "GPT-4o ≈ 1M; Gemini ≈ 128K",
      ],
      correctIndex: 1,
      explanation:
        "GPT-4o is about 128K tokens (~300 pages), Claude about 200K, and Gemini 2.0 about 1M. Context-window size is a valid model-comparison test.",
    },
  ],

  "AI Application Architectures — What You'll Be Testing": [
    {
      question:
        "What are the three types of AI applications you'll test?",
      options: [
        "Frontend, backend, and database apps",
        "Simple LLM, RAG, and Agent",
        "Chatbot, voicebot, and imagebot",
        "Free, paid, and enterprise apps",
      ],
      correctIndex: 1,
      explanation:
        "Almost every AI product is a Simple LLM (answers from training), a RAG app (searches your documents first), or an Agent (takes real actions with tools).",
    },
    {
      question:
        "What is the quickest way to classify an AI app as RAG vs Agent?",
      options: [
        "RAG is free; Agent is paid",
        "Does it search documents? → RAG. Does it take actions? → Agent.",
        "RAG uses Python; Agent uses JavaScript",
        "There is no way to tell them apart",
      ],
      correctIndex: 1,
      explanation:
        "If it searches your documents before answering, it's RAG. If it takes real actions (books, sends, files), it's an Agent. Otherwise it's a Simple LLM.",
    },
    {
      question:
        "Why do companies use RAG instead of just a Simple LLM?",
      options: [
        "RAG is cheaper to run",
        "The model's training data is frozen, but RAG searches your latest documents for current answers",
        "RAG never hallucinates",
        "RAG doesn't need a system prompt",
      ],
      correctIndex: 1,
      explanation:
        "An LLM's training data is frozen (e.g. 2023/2024). RAG searches your up-to-date documents, so it gives the current policy instead of an outdated one.",
    },
    {
      question:
        "Which RAG metric asks 'is the answer actually grounded in the retrieved documents?'",
      options: ["Context Precision", "Context Recall", "Faithfulness", "Answer Relevancy"],
      correctIndex: 2,
      explanation:
        "Faithfulness checks whether the answer is grounded in the retrieved docs or made up. It's RAG-specific hallucination and the most important RAG metric — the VIP Diamond invention is a faithfulness failure.",
    },
    {
      question:
        "An HR bot retrieves 10 documents but only 3 are relevant. Which metric is low?",
      options: ["Context Precision", "Context Recall", "Faithfulness", "Answer Relevancy"],
      correctIndex: 0,
      explanation:
        "Context Precision asks: of the docs retrieved, how many were actually relevant? Pulling 10 where only 3 are useful means low precision — the AI is drowning in irrelevant information.",
    },
    {
      question:
        "The right sick-leave document exists but wasn't embedded yet, so the AI only finds the old one. Which metric is low?",
      options: ["Context Precision", "Context Recall", "Faithfulness", "Answer Relevancy"],
      correctIndex: 1,
      explanation:
        "Context Recall asks: of all the relevant docs that exist, how many did the AI find? Missing the updated document means low recall.",
    },
    {
      question: "Why are AI Agents the hardest type to test?",
      options: [
        "They are written in a difficult programming language",
        "They take real, multi-step actions with real consequences that can't easily be undone",
        "They cost the most money to run",
        "They have no system prompt to test",
      ],
      correctIndex: 1,
      explanation:
        "Agents take autonomous, multi-step actions (booking flights, sending emails). Failures — wrong tool, wrong parameters, infinite loops, unauthorized actions — have real consequences that are hard to reverse.",
    },
    {
      question:
        "How many layers can the complete AI test map have, and does every product have all of them?",
      options: [
        "3 layers, and every product has all 3",
        "7 layers, and not every product has all 7 (simple chatbots have 4–5, only agents have all 7)",
        "10 layers, and every product has exactly 10",
        "1 layer for every product",
      ],
      correctIndex: 1,
      explanation:
        "The full map has 7 layers: input, system prompt, retrieval, LLM generation, guardrails, output, agent actions. A simple chatbot has 4–5, a RAG app 6, only agents all 7. Your job is to identify which layers exist in your product.",
    },
    {
      question:
        "GitHub Copilot reads your open code for context. How is it classified?",
      options: [
        "A RAG system",
        "An Agent",
        "A Simple LLM with extra code context",
        "It cannot be classified",
      ],
      correctIndex: 2,
      explanation:
        "Copilot uses your code as extra context but doesn't search a document store or take autonomous actions, so it's a Simple LLM with extra context.",
    },
    {
      question:
        "A RAG-based sick-leave bot correctly finds '12 sick leaves' but answers '15'. Which failure is this?",
      options: [
        "Low precision",
        "Low recall",
        "Low faithfulness",
        "Low relevancy",
      ],
      correctIndex: 2,
      explanation:
        "It had the correct document (12) but generated a wrong answer (15). Right document, wrong answer = a faithfulness failure.",
    },
  ],

  "Prompt Engineering Fundamentals": [
    {
      question:
        "According to the session, what causes most AI bugs?",
      options: [
        "Bad hardware",
        "Bad prompts, not bad models",
        "Slow internet",
        "Wrong programming language",
      ],
      correctIndex: 1,
      explanation:
        "Most AI bugs are prompt bugs, not model bugs. A vague system prompt sets the model up to fail — a different root cause and a different fix than a model problem.",
    },
    {
      question:
        "Why does a more specific prompt make output easier to test?",
      options: [
        "It makes the AI respond faster",
        "The output becomes more predictable, so you can write meaningful assertions",
        "It reduces the token cost to zero",
        "It disables the AI's creativity setting",
      ],
      correctIndex: 1,
      explanation:
        "A vague prompt gives unpredictable output you can't assert on. A specific prompt (role, context, scope, format) produces testable output — you can check for '30 days', a mention of packaging, staying in character, etc.",
    },
    {
      question:
        "What is 'few-shot' prompting?",
      options: [
        "Giving the AI a task with no examples",
        "Giving the AI 2–3 examples before the actual task so it learns your pattern",
        "Asking the AI to think step by step",
        "Sending the prompt multiple times",
      ],
      correctIndex: 1,
      explanation:
        "Few-shot means providing 2–3 examples before the task. The AI learns *your* pattern, making it much more accurate for domain-specific tasks. Most production chatbots use few-shot examples.",
    },
    {
      question:
        "What is a testing risk specific to few-shot examples?",
      options: [
        "Examples slow down the response",
        "If the examples are biased, the AI becomes biased (e.g. all short 'spam' examples → short emails classed as spam)",
        "Examples always cause valid JSON to break",
        "Examples make the AI ignore the system prompt",
      ],
      correctIndex: 1,
      explanation:
        "Biased examples produce a biased AI. If every 'spam' example is short and every 'not spam' example is long, the AI may classify all short emails as spam. Testing the examples themselves is a valid test case.",
    },
    {
      question:
        "What are the 6 components of a well-designed system prompt?",
      options: [
        "Role, context, rules, tone, format, fallback",
        "Speed, cost, tokens, temperature, model, API",
        "Header, body, footer, style, script, meta",
        "Input, output, error, log, retry, timeout",
      ],
      correctIndex: 0,
      explanation:
        "The six components are role, context, rules, tone, format, and fallback. Each missing component is a testable gap.",
    },
    {
      question:
        "Which system-prompt component is the most important and most commonly missing?",
      options: ["Role", "Tone", "Fallback", "Format"],
      correctIndex: 2,
      explanation:
        "The fallback ('If you don't know, say...') is most important and most often missing. Without it, the AI's only option when it doesn't know is to make something up — hallucination by design.",
    },
    {
      question:
        "What does 'your prompt IS your test case' mean?",
      options: [
        "You should never write prompts",
        "The quality of the prompts you write in tools like PromptFoo determines your test coverage",
        "Prompts and test cases are unrelated",
        "Only developers write prompts",
      ],
      correctIndex: 1,
      explanation:
        "Every PromptFoo test is essentially a prompt. A weak, vague test prompt catches nothing; a specific one with strong assertions catches real bugs. Same tool, completely different coverage based on prompt quality.",
    },
    {
      question:
        "A prompt says 'be brief' AND 'provide detailed explanations.' What kind of mistake is this?",
      options: [
        "No fallback instruction",
        "No output format",
        "Contradicting rules — causing non-determinism from the prompt itself",
        "No safety guardrails",
      ],
      correctIndex: 2,
      explanation:
        "Two rules that contradict each other force the AI to pick one randomly, producing inconsistent responses. The non-determinism is caused by the prompt, not the model.",
    },
    {
      question:
        "In the write-break-improve exercise, what does the 'break' step involve?",
      options: [
        "Deleting the system prompt",
        "Trying to make a partner's chatbot fail — off-scope questions, injection, asking for other users' data",
        "Rewriting the prompt in another language",
        "Measuring the response time",
      ],
      correctIndex: 1,
      explanation:
        "In the break step you attack a partner's prompt: off-scope questions, prompt injection ('ignore all instructions'), requests for another user's data, angry messages — finding the gaps.",
    },
    {
      question:
        "Which is one of the 5 common prompt mistakes that causes app crashes?",
      options: [
        "Using too many examples",
        "No output format specified — the AI returns a paragraph when the frontend expects JSON",
        "Setting temperature to 0",
        "Adding a fallback rule",
      ],
      correctIndex: 1,
      explanation:
        "With no output format specified, the AI may return prose when the frontend expects JSON, and the app crashes when parsing. It's a prompt bug, not an AI bug.",
    },
  ],

  "Prompt Testing — Finding Where Prompts Break": [
    {
      question:
        "How many categories of prompt failure does the systematic framework define?",
      options: ["3", "5", "8", "12"],
      correctIndex: 2,
      explanation:
        "There are 8 categories: hallucination, scope violation, injection, format breaking, tone inconsistency, data leakage, rule contradiction, and edge-case failures. One attack per category ≈ 15 minutes of systematic coverage.",
    },
    {
      question:
        "What are the three types of prompt injection?",
      options: [
        "SQL, XSS, and CSRF",
        "Direct, indirect, and crescendo",
        "Fast, slow, and medium",
        "Input, output, and system",
      ],
      correctIndex: 1,
      explanation:
        "Direct (typed straight into chat), indirect (hidden inside processed content), and crescendo (gradual multi-turn escalation). Most teams only test direct — leaving them ~66% exposed.",
    },
    {
      question: "What makes indirect injection especially dangerous for RAG systems?",
      options: [
        "RAG systems are slower",
        "RAG systems read external documents, so a poisoned document can hijack the AI",
        "RAG systems cannot use a system prompt",
        "RAG systems have no guardrails",
      ],
      correctIndex: 1,
      explanation:
        "Indirect injection hides instructions inside content the AI processes. RAG systems read external documents, so a single compromised document in the knowledge base can hijack the AI.",
    },
    {
      question:
        "What is a 'crescendo' attack?",
      options: [
        "A single very long prompt",
        "A gradual, multi-turn escalation where each step seems innocent but leads to harmful output",
        "Sending the same prompt 100 times",
        "An attack using only emojis",
      ],
      correctIndex: 1,
      explanation:
        "A crescendo attack escalates gradually across turns. No single turn is an obvious attack, but the conversation as a whole leads the AI to harmful content — which is why you must test conversations, not just single prompts.",
    },
    {
      question:
        "How does prompt LEAKING differ from prompt INJECTION?",
      options: [
        "They are exactly the same thing",
        "Injection overrides behavior; leaking steals the hidden system prompt",
        "Leaking is legal; injection is illegal",
        "Injection only works on RAG; leaking only works on agents",
      ],
      correctIndex: 1,
      explanation:
        "Injection aims to make the AI do something bad (override behavior). Leaking aims to steal the confidential system prompt — its rules, personas, and sometimes internal URLs.",
    },
    {
      question:
        "In the famous 2023 Bing Chat case, what was revealed by a prompt-leak attack?",
      options: [
        "The user's password",
        "The full system prompt, including the persona codenamed 'Sydney'",
        "The source code of the browser",
        "Nothing — the attack failed",
      ],
      correctIndex: 1,
      explanation:
        "A Stanford student got Bing Chat to reveal its full system prompt, including that its persona was codenamed 'Sydney'. Microsoft had to patch it — proof that if it happens to Microsoft, it can happen to anyone.",
    },
    {
      question:
        "What causes a 'rule contradiction' bug, and who is responsible?",
      options: [
        "The model — it's always a model defect",
        "Two conflicting rules in the system prompt; it's a bug in YOUR prompt, not the model",
        "The user typing too fast",
        "The API rate limit",
      ],
      correctIndex: 1,
      explanation:
        "When two system-prompt rules conflict (e.g. 'always detailed' + 'under 3 sentences'), the AI picks one randomly. The non-determinism is caused by your prompt, not the model — and almost nobody tests for it.",
    },
    {
      question:
        "What is the 3-step method to find rule conflicts?",
      options: [
        "Guess, test, hope",
        "List and number all rules; for each pair ask if following A makes B impossible; write a scenario that triggers each conflict",
        "Delete every rule and start over",
        "Run the prompt once and read the output",
      ],
      correctIndex: 1,
      explanation:
        "Step 1: list and number every rule. Step 2: for each pair, ask whether following rule A makes it impossible to follow rule B. Step 3: for each conflict, write and run a scenario that triggers it.",
    },
    {
      question:
        "What is the 'hidden injection' edge case using zero-width Unicode characters?",
      options: [
        "Injection that only works at night",
        "Invisible instructions embedded between visible letters — the user sees normal text, the AI reads hidden commands",
        "Injection written in a foreign language",
        "A very small font size",
      ],
      correctIndex: 1,
      explanation:
        "Zero-width Unicode characters let an attacker embed invisible instructions between visible letters. The display shows 'Hello' but the AI reads injected commands. Test whether input is sanitized for zero-width characters.",
    },
    {
      question:
        "How should a finding be rated 'Critical' in the exercise?",
      options: [
        "When the response has a typo",
        "When real user data could be exposed, the AI takes a harmful action, or there's legal/financial risk",
        "When the tone is slightly off",
        "When the format is wrong",
      ],
      correctIndex: 1,
      explanation:
        "Critical = real user data exposed, AI takes a harmful action, or legal/financial risk. High = major misinformation or broken core functionality. Medium/Low cover inconsistency and cosmetic issues.",
    },
  ],

  "Structured Outputs & Output Validation": [
    {
      question:
        "What is the core danger this session warns about?",
      options: [
        "The AI is too slow",
        "An AI answer can be 100% correct and still crash your app if it's in the wrong format",
        "The AI always returns errors",
        "JSON is deprecated",
      ],
      correctIndex: 1,
      explanation:
        "AI output almost always passes through code first, and code is unforgiving. A perfectly correct answer in the wrong shape (e.g. a chatty preamble before JSON) can crash a feature with no error shown to anyone.",
    },
    {
      question:
        "Why is a format bug so sneaky compared to a traditional bug?",
      options: [
        "It shows a big red error message",
        "There's no AI error and no HTTP error — the AI 'succeeded' while your app failed",
        "It only happens in test environments",
        "It crashes the AI model itself",
      ],
      correctIndex: 1,
      explanation:
        "When format breaks there's no AI error and no HTTP error. From the AI's side it succeeded; from your app's side it failed. That gap — success on one side, failure on the other — is where format bugs hide.",
    },
    {
      question:
        "If the AI produces valid JSON 95% of the time, why is that a problem?",
      options: [
        "95% is actually perfect",
        "'Most of the time' means it fails randomly in production — 1 in 20 users hits a broken feature",
        "JSON should never be used",
        "The other 5% is automatically fixed",
      ],
      correctIndex: 1,
      explanation:
        "In testing, 'most of the time' means 'fails randomly in production'. 95% valid JSON means 1 in 20 users hits a broken feature — and software only remembers the time it broke.",
    },
    {
      question:
        "Which is a common JSON failure mode that breaks a strict parser?",
      options: [
        "The JSON is too short",
        "Markdown code fences (```json) wrapping the JSON",
        "The JSON is correct",
        "Using double quotes",
      ],
      correctIndex: 1,
      explanation:
        "Markdown fences aren't valid JSON — the parser chokes on the backticks. Other common breaks: chatty preamble, trailing comma, wrong data type, missing fields, single quotes.",
    },
    {
      question:
        "What are the 4 layers of output validation, in order?",
      options: [
        "Speed, cost, tokens, latency",
        "Structure, schema, types, values",
        "Input, process, output, log",
        "Role, context, rules, format",
      ],
      correctIndex: 1,
      explanation:
        "Layer 1 Structure (does it parse?), Layer 2 Schema (right fields?), Layer 3 Types (right types?), Layer 4 Values (allowed values?). Each catches bugs the previous one misses.",
    },
    {
      question:
        "jsonlint says the JSON is valid, but order_id is a number instead of a string. Which layer failed?",
      options: [
        "Layer 1 (Structure)",
        "Layer 3 (Types)",
        "No layer failed",
        "Layer 2 (Schema)",
      ],
      correctIndex: 1,
      explanation:
        "'Valid JSON' only passes Layer 1. If order_id should be a string but is a number, Layer 3 (Types) fails — even though jsonlint says valid. Junior testers stop at Layer 1; seniors check all four.",
    },
    {
      question:
        "What is the 'flaky' output bug and what causes it?",
      options: [
        "The AI is offline",
        "Inconsistent format across runs (clean JSON, then markdown-wrapped, then preamble) — often caused by temperature",
        "The JSON is always identical",
        "The user typed too fast",
      ],
      correctIndex: 1,
      explanation:
        "Running the same prompt several times can give different formats each time. The parser passes sometimes and fails sometimes — a flaky, 1-in-5 production bug that's the hardest kind to debug.",
    },
    {
      question:
        "What is the production-grade fix for inconsistent output format?",
      options: [
        "Ignore it — it's fine",
        "Validate the output and automatically retry if it's malformed",
        "Increase the temperature",
        "Remove all format instructions",
      ],
      correctIndex: 1,
      explanation:
        "The three fixes are: lower the temperature, write a stricter prompt, or — the production-grade answer — validate the output and automatically retry when it's malformed.",
    },
    {
      question:
        "Even with OpenAI's strict JSON mode on, what must you still validate?",
      options: [
        "Nothing — JSON mode guarantees everything",
        "The right fields (schema), right types, and sensible values — JSON mode only guarantees valid structure",
        "Only the response speed",
        "Only the token count",
      ],
      correctIndex: 1,
      explanation:
        "JSON mode guarantees valid JSON structure (Layer 1) only. It does NOT guarantee the right fields (2), types (3), or sensible values (4). You still validate the other three layers.",
    },
    {
      question:
        "Which PromptFoo assertion automates Layer 1 (structure) validation?",
      options: ["contains", "is-json", "regex", "not-contains"],
      correctIndex: 1,
      explanation:
        "is-json automates Layer 1 (structure). contains handles part of schema, not-contains catches preambles/fences, regex checks patterns, and javascript handles types and value ranges (Layers 3 & 4).",
    },
  ],

  "PromptFoo Deep Dive — Setup, Config & First Eval": [
    {
      question: "What is PromptFoo best described as?",
      options: [
        "A code editor for Python",
        "Postman, but for AI — it fires prompts at models and checks the answers against your rules",
        "A database for storing prompts",
        "A replacement for Selenium",
      ],
      correctIndex: 1,
      explanation:
        "PromptFoo is like Postman for AI: it fires prompts at one or many models and automatically checks whether the answers pass your assertions. It's free, config-driven, and industry-standard.",
    },
    {
      question:
        "What are the three sections of a promptfooconfig.yaml file?",
      options: [
        "header, body, footer",
        "prompts, providers, tests",
        "input, output, assert",
        "role, context, rules",
      ],
      correctIndex: 1,
      explanation:
        "The three sections are prompts (the system prompt you're testing), providers (which models to run), and tests (each with vars for input and assert for pass/fail checks).",
    },
    {
      question:
        "What does the {{question}} in the prompts section represent?",
      options: [
        "A syntax error",
        "A variable that each test case fills in automatically",
        "A comment",
        "The AI's answer",
      ],
      correctIndex: 1,
      explanation:
        "{{question}} is a variable. Each test case's vars fills it in, so one prompt template serves many questions — return question, shipping question, and so on.",
    },
    {
      question:
        "What does the 'not-icontains' assertion on the VIP Diamond test teach us?",
      options: [
        "That the AI must give the right answer",
        "That we can test for what should NOT happen — the AI must not confirm a fake membership",
        "That case sensitivity matters",
        "That JSON is required",
      ],
      correctIndex: 1,
      explanation:
        "The VIP Diamond membership doesn't exist. We set a trap and check the AI does NOT confirm it. Testing for what should not happen is half of AI testing.",
    },
    {
      question:
        "What are the two commands to run an eval and see the dashboard?",
      options: [
        "npm start / npm test",
        "npx promptfoo@latest eval / npx promptfoo@latest view",
        "python run.py / python view.py",
        "promptfoo build / promptfoo deploy",
      ],
      correctIndex: 1,
      explanation:
        "'npx promptfoo@latest eval' runs every test against every model; 'npx promptfoo@latest view' opens the visual pass/fail dashboard in your browser.",
    },
    {
      question:
        "In the dashboard grid, what does green vs red mean?",
      options: [
        "Green = fast, red = slow",
        "Each row is a test, each column a model; green = pass, red = fail",
        "Green = expensive, red = cheap",
        "Colors are random",
      ],
      correctIndex: 1,
      explanation:
        "Each row is a test, each column is a model. Green = pass, red = fail. You can compare all models on the same question side by side and click a red cell to see the exact input, output, and failed check.",
    },
    {
      question:
        "What is the 'gotcha' with the llm-rubric assertion?",
      options: [
        "It only works with JSON",
        "The judge is also an AI, so it's non-deterministic — a vague rubric gives inconsistent PASS/FAIL",
        "It never fails anything",
        "It requires a paid Gemini key",
      ],
      correctIndex: 1,
      explanation:
        "llm-rubric uses an AI to judge the answer, but the judge is also an AI and is non-deterministic. A vague rubric confuses it, so two nearly identical answers can get different grades. The famous question: 'Who tests the judge?'",
    },
    {
      question:
        "When a rubric score hovers near 0.5, what does it usually mean?",
      options: [
        "The answer is perfect",
        "The judge was unsure — a sign your rubric is too vague and needs tightening",
        "The API is down",
        "The test passed",
      ],
      correctIndex: 1,
      explanation:
        "A score near 0.5 means the judge was unsure. Look at the score, not just pass/fail — a middling score signals the rubric needs to check one clear thing.",
    },
    {
      question:
        "If every test fails, which is a likely cause from the troubleshooting notes?",
      options: [
        "The dashboard is broken",
        "The API key isn't set in THIS terminal window (or there's no OpenAI credit)",
        "PromptFoo requires a paid license",
        "YAML files can't have comments",
      ],
      correctIndex: 1,
      explanation:
        "Common causes: the key was set in a different terminal than the run, the OpenAI account has no credit, or 'contains' was used with the wrong case (use 'icontains'). Set the key in the same window you run in.",
    },
    {
      question:
        "Why does YAML indentation matter so much in PromptFoo configs?",
      options: [
        "It changes the AI's temperature",
        "YAML uses spaces (never tabs) and misaligned indentation causes ~90% of 'it doesn't work' errors",
        "Indentation controls the cost",
        "It doesn't matter at all",
      ],
      correctIndex: 1,
      explanation:
        "YAML is fussy about spacing — spaces, never tabs, with aligned indentation. About 90% of config-won't-parse problems are spacing mistakes. Copy the structure exactly and only change the words.",
    },
  ],

  "PromptFoo Advanced — Assertions, LLM-as-Judge & Model Comparison": [
    {
      question:
        "Why aren't keyword assertions (contains, is-json, regex) enough?",
      options: [
        "They are too slow",
        "They can't test meaning — like whether a response is empathetic",
        "They only work on numbers",
        "They cost too much",
      ],
      correctIndex: 1,
      explanation:
        "Keywords test facts, formats, and exact words, but they can't read meaning. There's no keyword for 'empathetic' — a response can say 'I'm so sorry' sarcastically or be kind without the word 'sorry'.",
    },
    {
      question:
        "How does an llm-rubric assertion decide PASS or FAIL?",
      options: [
        "It counts the characters",
        "A separate AI judge reads the answer and your plain-English rule, then returns PASS/FAIL with a 0–1 score",
        "It checks the response time",
        "It always passes",
      ],
      correctIndex: 1,
      explanation:
        "You write a rule in plain English; a separate AI judge reads the answer and the rule and decides PASS/FAIL with a score from 0 to 1. It's like hiring an examiner to grade an essay against a grading instruction.",
    },
    {
      question:
        "Why did two nearly identical laptop answers get 0.85 and 0.40?",
      options: [
        "One answer was much longer",
        "The rubric was vague and checked three conditions at once, confusing the judge",
        "The models were different sizes",
        "The API timed out",
      ],
      correctIndex: 1,
      explanation:
        "The rubric mixed three conditions with an OR ('give advice OR check inventory' AND 'no invented names' AND 'no fake prices'). With no clear rule the judge guessed, and guessed differently each time.",
    },
    {
      question:
        "What are the 4 rules for a reliable rubric?",
      options: [
        "Long, detailed, multi-part, creative",
        "Check ONE thing, make it yes/no, be specific, define a golden answer first",
        "Fast, cheap, short, vague",
        "Use JSON, use regex, use contains, use tabs",
      ],
      correctIndex: 1,
      explanation:
        "Check one thing (not three), phrase it as a yes/no question, be specific about what 'good' means, and define the golden answer first, then write the rubric to check for it.",
    },
    {
      question:
        "Do the two models under test judge each other's answers?",
      options: [
        "Yes, they grade each other",
        "No — a separate third AI (the judge) scores every answer; the models only produce answers",
        "Yes, but only on odd-numbered tests",
        "No — there is no judge at all",
      ],
      correctIndex: 1,
      explanation:
        "The models under test only produce answers. A separate judge scores them all — like a cooking competition where the chefs cook and a separate judge tastes and scores.",
    },
    {
      question: "What is 'self-bias' in LLM-as-judge?",
      options: [
        "When the judge is too slow",
        "When a model that's also being tested judges its own answers and may unconsciously favour its own style",
        "When the user is biased",
        "When the rubric is too short",
      ],
      correctIndex: 1,
      explanation:
        "Self-bias happens when one of the models being tested is also the judge — it may unconsciously favour its own cooking. The clean fix is a neutral third model as judge.",
    },
    {
      question:
        "What is the 'senior-tester move' to avoid self-bias?",
      options: [
        "Use the fastest model as judge",
        "Use a neutral third model (not in your test list) as the judge",
        "Run each test twice",
        "Never use llm-rubric",
      ],
      correctIndex: 1,
      explanation:
        "Set a neutral third model — not one you're testing — as the judge via a defaultTest provider block. Neither model under test grades its own work. Almost nobody thinks of this.",
    },
    {
      question:
        "Your free-tier Gemini judge times out and fails every test. What's the one-line fix?",
      options: [
        "Upgrade to a paid model only",
        "Run with '-j 1 --delay 1000' (one test at a time, 1-second gaps)",
        "Delete the tests",
        "Switch to tabs in YAML",
      ],
      correctIndex: 1,
      explanation:
        "The free tier's rate limit floods under parallel load. 'npx promptfoo@latest eval -j 1 --delay 1000' runs one test at a time with a 1-second delay, so the free tier keeps up.",
    },
    {
      question:
        "What is the right mindset for model comparison?",
      options: [
        "'Which model is best overall?'",
        "'Which model is best FOR THIS use case?' — reading pass rate AND cost together",
        "'Always pick the cheapest'",
        "'Always pick the most expensive'",
      ],
      correctIndex: 1,
      explanation:
        "The question is never 'which model is best?' but 'which is best for this use case?' A medical bot ships the accurate model regardless of cost; a high-volume FAQ bot ships the cheaper one. Same numbers, opposite decisions.",
    },
    {
      question:
        "In the '15× cost decision', why might you ship gpt-4o-mini for a casual FAQ bot?",
      options: [
        "Because it's more accurate",
        "Because it's ~15× cheaper and the extra accuracy isn't worth the cost for low-stakes questions",
        "Because it's the only free option",
        "Because mini never hallucinates",
      ],
      correctIndex: 1,
      explanation:
        "For a million low-stakes questions a day, mini is roughly 15× cheaper. Paying 15× more for a few extra accuracy points on 'what are your opening hours?' isn't worth it — so ship mini and save a fortune.",
    },
  ],

  "DeepEval — Pytest for LLMs": [
    {
      question:
        "How is DeepEval best positioned relative to PromptFoo?",
      options: [
        "DeepEval replaces PromptFoo entirely",
        "It's PromptFoo AND DeepEval — PromptFoo is the automatic car, DeepEval the manual car with finer control for CI/CD",
        "DeepEval is only for developers, never testers",
        "They are identical tools",
      ],
      correctIndex: 1,
      explanation:
        "It's not versus — it's both. PromptFoo (YAML, no-code) is great for quick evals and model comparison; DeepEval (Python, pytest) gives code-level control and fits CI/CD pipelines. Knowing both makes you more valuable.",
    },
    {
      question:
        "What three pieces make up every DeepEval test?",
      options: [
        "prompt, provider, assert",
        "a test case + a metric + assert_test",
        "input, output, log",
        "role, context, fallback",
      ],
      correctIndex: 1,
      explanation:
        "Every DeepEval test = an LLMTestCase (what went in and out) + a metric (what to measure) + assert_test (pass or fail). The pattern never changes.",
    },
    {
      question:
        "What does the 'threshold' on a metric represent?",
      options: [
        "The response time limit",
        "Your quality bar — the minimum score to pass (e.g. 0.9 for critical apps, 0.6 for casual)",
        "The number of retries",
        "The token cost",
      ],
      correctIndex: 1,
      explanation:
        "The threshold is your quality bar. 0.7 means 'good enough'; set it high (0.9) for critical apps and lower (0.6) for casual ones. You decide the standard — the same skill as setting PromptFoo assertion values.",
    },
    {
      question:
        "Which built-in metric needs a 'retrieval_context' and is critical for RAG?",
      options: [
        "ToxicityMetric",
        "FaithfulnessMetric",
        "BiasMetric",
        "AnswerRelevancyMetric",
      ],
      correctIndex: 1,
      explanation:
        "FaithfulnessMetric checks whether the answer stuck to the given context without inventing details. It needs retrieval_context (the source material) and is the main tool for RAG faithfulness.",
    },
    {
      question:
        "The context says '12 sick leaves' but actual_output says '15'. What happens to a FaithfulnessMetric test?",
      options: [
        "It passes",
        "It FAILS — the answer contradicts the source context",
        "It throws a syntax error",
        "It skips the test",
      ],
      correctIndex: 1,
      explanation:
        "It fails because 15 contradicts the context's 12 — the 'reads the textbook but writes from memory' RAG failure, caught automatically in code.",
    },
    {
      question:
        "What is GEval, and what earlier concept does it match?",
      options: [
        "A speed benchmark; it matches load testing",
        "Your own custom metric described in plain English, judged by an AI — it's PromptFoo's llm-rubric in Python",
        "A database migration tool",
        "A way to skip the API key",
      ],
      correctIndex: 1,
      explanation:
        "GEval lets you describe a check in plain English and have an AI judge it. It's exactly PromptFoo's llm-rubric, just in Python — so keep the criteria one clear, specific thing.",
    },
    {
      question:
        "When writing a GEval criteria, what mistake should you avoid?",
      options: [
        "Making it a yes/no question",
        "Cramming multiple conditions ('empathetic AND brief AND accurate') into one criteria — the judge gets confused",
        "Being specific",
        "Defining a golden answer first",
      ],
      correctIndex: 1,
      explanation:
        "Same rule as the laptop lesson: one GEval, one job. Multiple conditions in one criteria confuse the judge and give inconsistent scores. Keep it one clear, specific thing.",
    },
    {
      question:
        "Why must you set OPENAI_API_KEY before running DeepEval metrics?",
      options: [
        "To pay for the DeepEval license",
        "DeepEval's metrics use an AI judge under the hood, so they need the key — just like PromptFoo's llm-rubric",
        "To unlock the dashboard",
        "It's optional and never needed",
      ],
      correctIndex: 1,
      explanation:
        "DeepEval's metrics call an AI judge, so a missing or unfunded key breaks them. Same key, same setup as Session 7 — that's why the first run is also slow (real AI evaluation, not string matching).",
    },
    {
      question:
        "You get 'ModuleNotFoundError: No module named deepeval'. What's the likely cause?",
      options: [
        "DeepEval doesn't exist",
        "The venv isn't active (no '(venv)' prefix) or deepeval was installed in a different venv",
        "Your API key is wrong",
        "Python is too new",
      ],
      correctIndex: 1,
      explanation:
        "The venv isn't active or deepeval is installed elsewhere. Activate the venv (look for the '(venv)' prefix) and 'pip install deepeval' inside it.",
    },
    {
      question:
        "What advantage does DeepEval's report give that raw pass/fail doesn't?",
      options: [
        "It runs faster",
        "It explains WHY each metric passed or failed — great for debugging AI quality",
        "It hides the scores",
        "It disables the AI judge",
      ],
      correctIndex: 1,
      explanation:
        "DeepEval gives a reason for each score, so you understand why a metric passed or failed. That transparency is a big advantage for debugging AI quality.",
    },
  ],

  "Hallucination Detection — Techniques & Automation": [
    {
      question:
        "Why is hallucination described as 'the reason AI testing exists as a career'?",
      options: [
        "Because it makes the AI slower",
        "If AI never lied, testers wouldn't be needed — but it lies confidently and invisibly, so someone must catch it",
        "Because it only affects free models",
        "Because it's easy to fix once",
      ],
      correctIndex: 1,
      explanation:
        "Hallucination is a confident, fluent, invisible lie. If AI never lied, testers wouldn't be needed. Catching, measuring, and reporting it is the skill that makes an AI tester valuable.",
    },
    {
      question:
        "In the 2024 Air Canada case, what did the tribunal rule?",
      options: [
        "The chatbot was a separate entity responsible for its own words",
        "The airline was legally responsible for what its chatbot said",
        "The customer was at fault",
        "Chatbots are exempt from liability",
      ],
      correctIndex: 1,
      explanation:
        "Air Canada's chatbot invented a bereavement refund policy. The tribunal ruled the airline legally responsible for what its chatbot said, rejecting the argument that the bot was a separate entity. One hallucination, one lawsuit.",
    },
    {
      question:
        "Why is hallucination uniquely a TESTER's problem?",
      options: [
        "It crashes the app with a clear error",
        "There's no crash, no error, HTTP 200 — every traditional test passes, so it's invisible to old tools",
        "It only happens in staging",
        "It shows a warning in the console",
      ],
      correctIndex: 1,
      explanation:
        "A hallucination returns HTTP 200 with empty error logs. Selenium sees a response, the API test sees a 200 — nothing flags it. It's a bug that doesn't crash, a failure that reports success.",
    },
    {
      question:
        "What are the 4 types of hallucination?",
      options: [
        "Fast, slow, big, small",
        "Factual fabrication, faithfulness failure, instruction drift, overconfidence",
        "Input, output, system, user",
        "Critical, high, medium, low",
      ],
      correctIndex: 1,
      explanation:
        "Factual fabrication (invents facts), faithfulness failure (has the info but answers wrong), instruction drift (answers a different question), and overconfidence (states uncertain things as fact). A complete suite tests all four.",
    },
    {
      question:
        "The AI reads a document saying '12 sick leaves' but confidently answers '15'. Which type is this?",
      options: [
        "Factual fabrication",
        "Faithfulness failure",
        "Instruction drift",
        "Overconfidence",
      ],
      correctIndex: 1,
      explanation:
        "It had the correct information in front of it but answered wrong anyway — a faithfulness failure, like a student writing from memory with the textbook open. It's the #1 RAG failure, caught with FaithfulnessMetric.",
    },
    {
      question:
        "Why does AI hallucinate, at its root?",
      options: [
        "It has a virus",
        "It predicts the most probable next word rather than knowing truth, and it would rather answer than admit ignorance",
        "The internet is down",
        "The temperature is always 0",
      ],
      correctIndex: 1,
      explanation:
        "AI predicts probable words (probable ≠ true), is trained to always be helpful (so it fills gaps rather than admit 'I don't know'), and has no built-in fact-checker. It's a permanent property, not a one-time bug.",
    },
    {
      question:
        "When should you use FaithfulnessMetric vs HallucinationMetric?",
      options: [
        "They are identical",
        "Faithfulness when you have a source context the AI should stick to; Hallucination when checking against known ground-truth facts",
        "Faithfulness for speed; Hallucination for cost",
        "Never use either",
      ],
      correctIndex: 1,
      explanation:
        "Use FaithfulnessMetric when you have a source context (a document/policy) the AI was supposed to use — your main RAG tool. Use HallucinationMetric when you have ground-truth facts to check the output didn't invent beyond.",
    },
    {
      question:
        "What's the difference between a 'hardcoded' and a 'live' DeepEval test?",
      options: [
        "Hardcoded is illegal; live is legal",
        "Hardcoded tests a saved/past answer (fast, repeatable); live calls the AI now and tests its fresh answer (true end-to-end)",
        "There is no difference",
        "Live tests never need an API key",
      ],
      correctIndex: 1,
      explanation:
        "Hardcoded tests a captured answer (saved dataset or production logs) — fast, cheap, repeatable for regression. Live calls the model right now and tests the fresh answer — true end-to-end, matching what PromptFoo did. Teams use both.",
    },
    {
      question:
        "Why measure the hallucination RATE instead of running one test?",
      options: [
        "One test is enough",
        "AI is non-deterministic, so one pass means nothing — the rate (e.g. '15% of the time') is the real number that drives decisions",
        "Rates are only for developers",
        "The rate is always zero",
      ],
      correctIndex: 1,
      explanation:
        "Because AI is non-deterministic, one pass is like judging a cricketer on a single ball. The rate is the batting average for truthfulness — it turns 'I think this model is better' into 'this model lies a third as often'.",
    },
    {
      question:
        "In the real numbers cited, how did gpt-4o-mini and gpt-4o compare on trick questions?",
      options: [
        "Both hallucinated 0% of the time",
        "mini hallucinated ~30%, gpt-4o ~10% — same questions, three times the lie rate",
        "gpt-4o was worse than mini",
        "They were identical",
      ],
      correctIndex: 1,
      explanation:
        "gpt-4o-mini hallucinated on ~30% of trick questions vs ~10% for gpt-4o — three times the lie rate on the same questions. For a high-stakes app, that's a complete business case for paying more for gpt-4o.",
    },
  ],

  // ── Module 4 · RAG Basics, API & Automation Testing ─────────────────────

  "RAG Testing Fundamentals": [
    {
      question: "What are the exactly two places a RAG system can fail?",
      options: [
        "The database and the frontend",
        "Retrieval (wrong/missing/stale chunks) and generation (answer strays from the retrieved context)",
        "Authentication and authorization",
        "Training and deployment",
      ],
      correctIndex: 1,
      explanation:
        "Every RAG answer travels question → retriever → chunks → LLM → answer. Either the retriever pulled the wrong material (retrieval failure) or the LLM distorted the right material (generation failure). Knowing which one you're looking at decides who gets the bug report.",
    },
    {
      question:
        "The retriever pulled the correct policy document, but the bot's answer contradicts it. What kind of failure is this, and which metric catches it?",
      options: [
        "Retrieval failure — Contextual Recall",
        "Generation failure — FaithfulnessMetric",
        "A network failure — retry the request",
        "A prompt-injection attack",
      ],
      correctIndex: 1,
      explanation:
        "The right context was there; the LLM ignored or distorted it. That's a generation (faithfulness) failure — FaithfulnessMetric compares the answer against the retrieved context and fails when they diverge.",
    },
    {
      question: "In the RAG testing triangle, Contextual Relevancy measures the relationship between…",
      options: [
        "The answer and the question",
        "The question and the retrieved context",
        "The retrieved context and the answer",
        "Two different model versions",
      ],
      correctIndex: 1,
      explanation:
        "Contextual Relevancy asks: are the retrieved chunks actually about the question? It scores the retriever, not the LLM. Faithfulness covers context↔answer, and Answer Relevancy covers question↔answer.",
    },
    {
      question: "What is a golden dataset in RAG testing?",
      options: [
        "The model's training data",
        "A curated set of real user questions with the expected answer AND the source document for each",
        "The most expensive tier of OpenAI API",
        "A backup copy of the knowledge base",
      ],
      correctIndex: 1,
      explanation:
        "A golden dataset pairs real questions with their expected answers and source documents. Run it after every document update, prompt change, or model swap — it's your RAG regression suite.",
    },
    {
      question:
        "You ask an HR bot 'What are the office gym timings?' but no gym document exists. What is the CORRECT bot behaviour?",
      options: [
        "Generate a plausible answer from general knowledge",
        "Say something like 'I don't have that information in my documents'",
        "Return an HTTP 404 error",
        "Answer with the closest available policy, e.g. WFH rules",
      ],
      correctIndex: 1,
      explanation:
        "Out-of-scope questions must produce an honest 'I don't know'. Answering anyway means the bot is fabricating — this is one of the most valuable (and most forgotten) RAG test cases.",
    },
    {
      question:
        "The 2023 policy doc says '30-day returns' and a 2024 update says '15-day returns'. Both are in the knowledge base. What should you test for?",
      options: [
        "That the bot always quotes the 2023 version",
        "That the bot prefers the current version or flags the conflict — and never silently mixes them",
        "Nothing — conflicting documents are a content problem, not a QA problem",
        "That the bot refuses to answer return questions entirely",
      ],
      correctIndex: 1,
      explanation:
        "Conflicting documents are a classic real-world RAG hazard. The bot should prefer current policy or surface the conflict. Silently quoting stale policy is a bug you can and should catch with a targeted test.",
    },
    {
      question: "What is a chunk-boundary bug?",
      options: [
        "The retriever returns too many chunks and hits the context window",
        "An answer's key information spans two chunks, only one is retrieved, and the bot gives a dangerously incomplete answer",
        "Chunks are stored in the wrong database table",
        "The chunk size is not a power of two",
      ],
      correctIndex: 1,
      explanation:
        "When 'notice period is 60 days… except during probation' is split across chunks and only half is retrieved, the answer is incomplete in a way that sounds complete. Test questions whose answers span chunk boundaries.",
    },
    {
      question:
        "In DeepEval, which field do you fill with what the retriever actually returned for the question?",
      options: ["expected_output", "retrieval_context", "system_prompt", "ground_truth"],
      correctIndex: 1,
      explanation:
        "retrieval_context holds the chunks the retriever returned. In production testing you log the real retrieved chunks per question and feed them in — which is why 'expose retrieved chunks' is the most valuable testability hook to request from the dev team.",
    },
    {
      question:
        "Why did the NYC MyCity chatbot incident happen even though the city's documents were legally correct?",
      options: [
        "The documents were secretly wrong",
        "The pipeline between question, retrieval and answer produced illegal advice the documents didn't support",
        "Users asked malicious questions",
        "The model was too small",
      ],
      correctIndex: 1,
      explanation:
        "Correct documents don't guarantee correct answers — retrieval can miss, and generation can distort. That's exactly why RAG testing scores the pipeline (retrieval AND faithfulness), not just the source content.",
    },
    {
      question: "A stale-index bug means…",
      options: [
        "The bot answers too slowly",
        "A document was updated but the bot still quotes the old text because it wasn't re-indexed",
        "The vector database ran out of disk space",
        "The LLM's training data is from last year",
      ],
      correctIndex: 1,
      explanation:
        "RAG answers come from the index, not the live document. If content updates aren't re-indexed, the bot confidently quotes outdated policy. Re-run your golden dataset after every content release to catch this.",
    },
  ],

  "LLM API Testing — OpenAI, Anthropic, Gemini Endpoints": [
    {
      question:
        "Which two long-held API-testing assumptions break when you move to LLM APIs?",
      options: [
        "APIs use JSON, and APIs need authentication",
        "Same request → same response, and requests are free to send",
        "APIs return status codes, and APIs have documentation",
        "POST is safe, and GET is idempotent",
      ],
      correctIndex: 1,
      explanation:
        "LLM responses are non-deterministic (same request, different wording each time) and every call costs money (billed per token). Both change how you design and run test suites.",
    },
    {
      question: "How does authentication differ between OpenAI and Anthropic?",
      options: [
        "Both use the same Bearer token format",
        "OpenAI uses an Authorization: Bearer header; Anthropic uses x-api-key plus an anthropic-version header",
        "OpenAI uses OAuth2; Anthropic uses no authentication",
        "Anthropic requires certificates",
      ],
      correctIndex: 1,
      explanation:
        "OpenAI expects 'Authorization: Bearer sk-…' while Anthropic expects an 'x-api-key' header plus 'anthropic-version'. Multi-provider products need auth tests per provider — a 401 in one provider is easy to miss if you only test the other.",
    },
    {
      question: "What does finish_reason: 'length' tell you?",
      options: [
        "The answer was long and detailed — a good sign",
        "The response was cut off by the token limit — the user got a truncated answer",
        "The request body was too long and was rejected",
        "The model finished naturally",
      ],
      correctIndex: 1,
      explanation:
        "'stop' means natural completion; 'length' means the answer hit max_tokens and was cut mid-sentence. A support bot stopping halfway through refund steps is a real bug that still returns HTTP 200 — assert finish_reason in every test.",
    },
    {
      question:
        "Which assertion style is correct for the CONTENT of an LLM API response?",
      options: [
        "assert response.text == 'Our return policy is 30 days.'",
        "Semantic checks — required keywords present, forbidden content absent, or a quality metric",
        "No content assertions are possible on LLM output",
        "Assert the response length is exactly the same every run",
      ],
      correctIndex: 1,
      explanation:
        "Structure (status, fields, finish_reason) is asserted exactly; content is asserted semantically because wording changes run to run. Exact-string matching on LLM text is the classic beginner mistake.",
    },
    {
      question: "Why should every API test also look at the usage field?",
      options: [
        "It's required for the request to succeed",
        "Token counts are the cost meter — a prompt change that doubles tokens is a cost regression you can catch in CI",
        "It contains the model's confidence score",
        "It tells you the server's region",
      ],
      correctIndex: 1,
      explanation:
        "usage reports tokens in/out, which multiplied by the model's rate is real money. Logging it per test run turns QA into the team that catches cost regressions before the bill does — a finding business owners love.",
    },
    {
      question: "A 429 response from an LLM provider means…",
      options: [
        "The API key is invalid",
        "Rate limit hit — your app should retry with backoff and degrade gracefully, and that behaviour is what you test",
        "The model has been deprecated",
        "The prompt was flagged by moderation",
      ],
      correctIndex: 1,
      explanation:
        "429s are normal at peak traffic, not rare surprises. The provider's error is a given; your application's handling — retry with backoff, friendly message, no blank screen — is the feature under test.",
    },
    {
      question: "How should you measure LLM API latency?",
      options: [
        "One stopwatch reading is enough",
        "p50 and p95 over 20+ calls, because response time varies run to run",
        "Latency doesn't matter for AI products",
        "Only measure the first call after deploy",
      ],
      correctIndex: 1,
      explanation:
        "LLM calls take 1–20+ seconds and vary widely. Percentiles over many calls (p50 for typical, p95 for worst-case) describe what users actually experience; a single measurement describes luck.",
    },
    {
      question:
        "Your product can switch between OpenAI and Anthropic. Where does the bot's answer text live in each response?",
      options: [
        "Both use choices[0].message.content",
        "OpenAI: choices[0].message.content · Anthropic: content[0].text — each path needs its own contract test",
        "Both use data.answer",
        "Anthropic returns plain text, not JSON",
      ],
      correctIndex: 1,
      explanation:
        "Response shapes differ per provider (Gemini adds a third: candidates[0].content.parts[0].text). Provider-switching features need a contract test per provider or the switch breaks silently.",
    },
    {
      question:
        "Which of these is the most common cause of a production outage in AI-powered apps?",
      options: [
        "The model forgetting its training",
        "An exhausted API credit / expired billing on the provider account",
        "Too many GET requests",
        "Unicode in the prompt",
      ],
      correctIndex: 1,
      explanation:
        "Mundane but true: the account runs out of credit and every request starts failing. Test that your app surfaces this as a clean, actionable error — and that someone gets alerted — rather than a silent broken chat.",
    },
    {
      question: "What is a required-field difference between OpenAI and Anthropic requests?",
      options: [
        "Anthropic requires max_tokens; OpenAI treats it as optional",
        "OpenAI requires a temperature; Anthropic forbids it",
        "Anthropic requires XML bodies",
        "OpenAI requires a user_id in every call",
      ],
      correctIndex: 0,
      explanation:
        "Anthropic's /v1/messages rejects requests without max_tokens; OpenAI defaults it. The same request body will not work across providers — exactly the kind of dialect detail integration tests exist for.",
    },
  ],

  "Chatbot UI Testing with Playwright": [
    {
      question:
        "What is the golden rule for asserting on a chat UI's bot response?",
      options: [
        "Assert the exact response text with toHaveText()",
        "Assert structure exactly (message appears, input re-enabled) and content semantically (keywords/regex)",
        "Don't assert anything — AI output can't be tested",
        "Screenshot-diff every response",
      ],
      correctIndex: 1,
      explanation:
        "Structure is deterministic — assert it precisely. The response text is non-deterministic — assert meaning with toContainText(/return|refund/i), never exact strings. This one rule removes most chat-test flakiness.",
    },
    {
      question: "Why is waitForTimeout(5000) the wrong way to wait for a streaming response?",
      options: [
        "Playwright doesn't support timeouts",
        "It's flaky when the response is slower and wasteful when it's faster — wait for a UI signal instead",
        "5 seconds is too long for any AI",
        "It only works in headless mode",
      ],
      correctIndex: 1,
      explanation:
        "Fixed sleeps are the #1 source of flaky chat tests. Prefer a real signal: the typing indicator hides, the 'stop generating' button disappears, or the completion network call finishes.",
    },
    {
      question:
        "How do you test that a chatbot remembers context across turns?",
      options: [
        "Ask the same question twice and compare answers",
        "Say 'I bought a laptop last week', then ask 'Can I return it?' — and assert the answer knows what 'it' is",
        "Check the browser's localStorage",
        "Context memory can only be tested at the API level",
      ],
      correctIndex: 1,
      explanation:
        "Multi-turn memory is the chatbot's core feature, and a pronoun-reference follow-up is the cleanest UI-level test for it. Also test the inverse: a NEW chat must NOT remember the old one — context bleeding is a privacy bug.",
    },
    {
      question:
        "What does page.route() let you do in chatbot testing?",
      options: [
        "Change the chatbot's system prompt",
        "Intercept the completion API call and fulfill it with a fake 429/500/timeout — making 'provider down' a deterministic test",
        "Route the test to a different browser",
        "Slow down the network permanently",
      ],
      correctIndex: 1,
      explanation:
        "You can't schedule a real provider outage, so you fake one: intercept the API call, return a 429, and assert the UI shows a friendly retryable error. Every chat suite deserves a 429, a 500, and a timeout test.",
    },
    {
      question:
        "You send '<img src=x onerror=alert(1)>' as a chat message. What must you verify?",
      options: [
        "The bot answers the question about images",
        "The rendered output is sanitised — the HTML is displayed as text, never executed",
        "The message is rejected with HTTP 400",
        "The image loads correctly",
      ],
      correctIndex: 1,
      explanation:
        "Chat UIs render bot/user content as markdown or HTML — an unsanitised renderer turns a chat message into an XSS attack. The payload must appear as inert text, and the same goes for markdown links to malicious domains.",
    },
    {
      question:
        "What was the failure in the DPD chatbot incident (2024)?",
      options: [
        "The API returned 500 errors for a day",
        "After an update, the live bot swore at a customer and wrote a poem criticising DPD — a UI-level guardrail failure that went viral",
        "Parcels were routed to the wrong country",
        "The chatbot leaked credit card numbers",
      ],
      correctIndex: 1,
      explanation:
        "The API 'worked' — the product failed in public. Guardrails (tone, profanity, staying on-task) must be tested through the same front door users type into, with adversarial prompts as test input.",
    },
    {
      question:
        "Which assertion verifies the UI recovered properly after the bot replies?",
      options: [
        "expect(chatInput).toBeEnabled()",
        "expect(page).toHaveURL('/chat')",
        "expect(reply).toHaveText(exactAnswer)",
        "expect(sendButton).toBeHidden()",
      ],
      correctIndex: 0,
      explanation:
        "While streaming, the input is typically disabled; after completion it must re-enable so the user can continue. It's a deterministic state assertion — exactly the kind of structural check chat tests should lean on.",
    },
    {
      question:
        "What should a stress test of the chat input cover?",
      options: [
        "Only emoji input",
        "A 10,000-character paste and 10 rapid-fire sends — asserting no duplicate sends, sane queueing, and a stable UI",
        "Changing the browser window size",
        "Sending messages in different fonts",
      ],
      correctIndex: 1,
      explanation:
        "Real users paste entire documents and double-click send. The UI must debounce/disable to prevent duplicate sends and handle huge input gracefully — all deterministic, all automatable.",
    },
    {
      question:
        "Why request data-testid attributes on chat message rows?",
      options: [
        "They make the page load faster",
        "Stable hooks make locators reliable — one attribute per message row is the cheapest testability investment a chat team can make",
        "They're required by Playwright",
        "They improve SEO",
      ],
      correctIndex: 1,
      explanation:
        "Chat DOMs re-render constantly during streaming; class-based selectors break. A data-testid on message rows, input, send button and typing indicator makes the whole suite stable — ask for it early.",
    },
    {
      question:
        "A test asserts the bot's answer does NOT contain 'as an AI language model'. What is this an example of?",
      options: [
        "A performance test",
        "A forbidden-content assertion — semantic content testing for things that must never appear",
        "An exact-match assertion",
        "A visual regression test",
      ],
      correctIndex: 1,
      explanation:
        "Semantic assertions work both ways: required keywords must appear, and forbidden phrases (persona breaks, profanity, leaked system prompts) must not. Both survive non-determinism because they test meaning-level properties, not exact strings.",
    },
  ],

  // ── Module 3 · gap sessions ─────────────────────────────────────────────

  "Python Foundations": [
    {
      question: "What is the goal of learning Python in this course?",
      options: [
        "To become a Python backend developer",
        "To read, modify and run AI test files confidently — the AI testing stack (pytest, DeepEval) speaks Python",
        "To build machine learning models from scratch",
        "To replace Selenium with Python scripts",
      ],
      correctIndex: 1,
      explanation:
        "You need the dashboard, not the engine: enough Python to understand a test file, change it, and run it. DeepEval, pytest and red-teaming tooling are all Python — but you're a test engineer using them, not a developer building them.",
    },
    {
      question: "What does a virtual environment (venv) do?",
      options: [
        "Makes Python run faster",
        "Keeps this project's installed libraries separate from the rest of your system",
        "Encrypts your API keys",
        "Runs tests in the cloud",
      ],
      correctIndex: 1,
      explanation:
        "A venv is a private toolbox per project — like not sharing one pom.xml across every Java project. 'Module not found' errors are usually just a venv that isn't activated.",
    },
    {
      question: "Which three things make a function a runnable pytest test?",
      options: [
        "A main() method, a class, and a return statement",
        "A file named test_*.py, a function named test_*, and an assert inside",
        "A @Test annotation and a TestNG XML file",
        "A JSON config listing every test",
      ],
      correctIndex: 1,
      explanation:
        "pytest discovers by naming convention: test_ files, test_ functions, plain assert statements. No annotations, no XML — that's the whole framework surface you need.",
    },
    {
      question: "In Python, what plays the role of Java's braces { } for defining a code block?",
      options: [
        "Parentheses",
        "Indentation — consistent leading spaces ARE the syntax",
        "The 'end' keyword",
        "Semicolons",
      ],
      correctIndex: 1,
      explanation:
        "Blocks are defined by indentation (4 spaces by convention). Most beginner errors are a mis-aligned line — and the traceback names the exact line to check.",
    },
    {
      question: "Your test data is test_case = {\"input\": \"How many sick leaves?\", \"expected\": \"12\"}. What Python structure is this?",
      options: [
        "A list",
        "A dict — key→value pairs, effectively JSON you can program with",
        "A tuple",
        "A class",
      ],
      correctIndex: 1,
      explanation:
        "Dicts hold key→value pairs accessed as test_case[\"input\"]. A list of dicts is the standard shape for a test suite's data — and it maps 1:1 to the JSON/YAML files eval tools consume.",
    },
    {
      question: "A traceback ends with KeyError: 'inputt'. What happened?",
      options: [
        "The API key is invalid",
        "You accessed a dict key that doesn't exist — a typo ('inputt' vs 'input')",
        "Python ran out of memory",
        "The test passed with a warning",
      ],
      correctIndex: 1,
      explanation:
        "Read tracebacks bottom-up: the last line is the actual error. KeyError means the dict has no such key — here an obvious typo. The lines above it show exactly which file and line to fix.",
    },
    {
      question: "pytest output shows 'AssertionError' for one test. What does this mean?",
      options: [
        "Your Python environment is broken",
        "The test ran correctly and FAILED — that's a finding, not a Python problem",
        "pytest is not installed properly",
        "The assert keyword is deprecated",
      ],
      correctIndex: 1,
      explanation:
        "AssertionError is the test doing its job: the code ran, the condition was checked, and it was false. Investigate the product behaviour — don't 'fix' the test to make the error go away.",
    },
    {
      question: "Why is os.environ[\"OPENAI_API_KEY\"] the right way to handle API keys in test code?",
      options: [
        "It makes the key load faster",
        "Keys stay out of the code and the repo — hardcoded keys leak the moment code is shared or committed",
        "It encrypts the key",
        "OpenAI requires it",
      ],
      correctIndex: 1,
      explanation:
        "Reading keys from environment variables keeps secrets out of source control. A hardcoded key in a shared repo is a security incident with your name on the commit.",
    },
  ],

  "Hallucination Detection — Techniques & Automation (Part 2)": [
    {
      question: "What does @pytest.mark.parametrize give your hallucination suite?",
      options: [
        "Faster API responses",
        "One test body runs against every trap question in the bank — 50 traps, 50 independent results, one function",
        "Automatic retry of failed tests",
        "Parallel browser sessions",
      ],
      correctIndex: 1,
      explanation:
        "Parametrize turns a list of trap questions into individual test runs without copy-pasting test functions. Grow the bank in a data file; the test code never changes.",
    },
    {
      question: "Why keep the trap-question bank in a separate JSON/CSV file instead of inside the test code?",
      options: [
        "JSON runs faster than Python",
        "Non-coders on the team can add traps without touching test code — and the bank versions independently",
        "pytest can't read Python lists",
        "To hide the traps from the model",
      ],
      correctIndex: 1,
      explanation:
        "Separating data from code lets domain experts (support leads, product owners) contribute trap questions, and lets you diff/version the bank like any test asset.",
    },
    {
      question: "What does G-Eval add over built-in DeepEval metrics?",
      options: [
        "It's free to run",
        "You write the evaluation criteria in plain English and a judge model scores answers against YOUR rules",
        "It removes the need for API keys",
        "It only works for RAG systems",
      ],
      correctIndex: 1,
      explanation:
        "G-Eval is custom LLM-as-a-judge: 'the answer must not invent products or policies; unknown info must be admitted' becomes an executable metric. Same golden rule applies — judge with a stronger model than the one under test.",
    },
    {
      question: "Your 50-trap suite reports '7 failed, 43 passed'. What is the headline number for your report?",
      options: [
        "43 tests passed",
        "A 14% hallucination rate (7/50) — dated, with model and prompt version noted",
        "86% code coverage",
        "7 bugs to fix in Jira",
      ],
      correctIndex: 1,
      explanation:
        "The rate is the product-quality number: 14% of trap questions produced hallucinations. Save it with date + model + prompt version — a rate without context can't become a baseline.",
    },
    {
      question: "A trap fails 1 run out of 3. What is the professional interpretation?",
      options: [
        "The test is broken — delete it",
        "A flaky lie: the model hallucinates on this trap sometimes — worth its own investigation, and proof of why you run traps multiple times",
        "The model passed on average, so it's fine",
        "The API was rate-limited",
      ],
      correctIndex: 1,
      explanation:
        "Non-determinism means a bot can lie occasionally. 1/3 is a different (and sneakier) risk than 3/3 — it will pass a single demo and fail in production. Multiple runs per trap are what expose it.",
    },
    {
      question: "Why must the judge model be stronger than the model under test?",
      options: [
        "Stronger models are cheaper",
        "A weaker judge can't reliably recognise the tested model's mistakes — the exam marker must know more than the student",
        "It's an OpenAI licensing requirement",
        "Judges only work within the same provider",
      ],
      correctIndex: 1,
      explanation:
        "LLM-as-judge quality bounds your test quality. Judging gpt-4o with gpt-4o-mini inverts the exam: the marker misses errors the student makes. Use the superior model (or a superior rival) as judge.",
    },
    {
      question: "Which set of items must be logged for every suite run to make failures reportable?",
      options: [
        "Only the pass/fail counts",
        "Question, answer, metric score, model, and date — failures you can't reproduce are findings you can't report",
        "The CPU usage of the test machine",
        "The judge model's system prompt only",
      ],
      correctIndex: 1,
      explanation:
        "A defensible finding needs the full evidence chain: what was asked, what was answered, how it scored, on which model, when. That log is also what turns runs into comparable baselines later.",
    },
    {
      question: "What does a leadership-ready hallucination report look like?",
      options: [
        "The full pytest console output",
        "Four lines: scope, result (rates per model), worst-case risk with evidence, and a recommendation",
        "A screenshot of the code",
        "The raw JSON of all 50 answers",
      ],
      correctIndex: 1,
      explanation:
        "Leadership needs the decision, not the plumbing: what you tested, the rates, the scariest concrete failure, and what you recommend. Keep the raw evidence attached for whoever wants depth.",
    },
  ],

  "Model Comparison & Regression Testing": [
    {
      question: "What is a baseline in AI regression testing?",
      options: [
        "The cheapest model available",
        "The recorded result of your fixed eval suite on the current setup — pass rate, hallucination rate, cost — dated and versioned",
        "The first test you ever wrote",
        "The provider's advertised benchmark score",
      ],
      correctIndex: 1,
      explanation:
        "A baseline is the 'before photo': your suite's numbers on the current model + prompt, written down with a date. Every future run is diffed against it — without one, nobody can prove quality moved.",
    },
    {
      question: "What is the correct way to compare two candidate models?",
      options: [
        "Ask each one clever question and judge the vibes",
        "Run the identical golden suite against both and report a decision table: pass rate, hallucination rate, cost, latency",
        "Choose the newer model — newer is always better",
        "Compare their parameter counts",
      ],
      correctIndex: 1,
      explanation:
        "Same exam, different students. PromptFoo runs one suite across providers with a config change, and the resulting table makes the cost/quality trade-off visible for the business to decide.",
    },
    {
      question: "Which of these changes does NOT require re-running the regression suite?",
      options: [
        "A 'tiny wording tweak' to the system prompt",
        "Adding documents to the RAG knowledge base",
        "Changing the button colour in the chat UI",
        "The provider silently updating the model",
      ],
      correctIndex: 2,
      explanation:
        "Prompt tweaks, knowledge-base updates, parameter changes and provider-side model updates all change answer behaviour — re-run the suite. A pure UI colour change doesn't touch the model pipeline (your Playwright suite covers that layer).",
    },
    {
      question: "Why schedule a weekly suite run even when your team changed nothing?",
      options: [
        "To use up the API budget",
        "Providers update models silently — quality can shift under you with zero changes on your side",
        "pytest requires a weekly run",
        "To keep the CI server warm",
      ],
      correctIndex: 1,
      explanation:
        "Hosted models are a moving dependency. A scheduled run against the baseline is how you notice a silent provider update before your customers do.",
    },
    {
      question: "A sensible pass-rate gate is 'baseline − 2%'. Why the 2% allowance?",
      options: [
        "To let the team ship faster",
        "Non-determinism causes small run-to-run noise — the gate tolerates noise while still failing real drops",
        "Because 2% of users don't matter",
        "It's an industry legal requirement",
      ],
      correctIndex: 1,
      explanation:
        "AI suites have natural variance, so an exact-match gate would cry wolf. A small tolerance absorbs noise; anything beyond it is treated as a real regression. Safety-critical categories can still get zero-tolerance gates.",
    },
    {
      question: "Pass rate fell from 96% to 88% after a prompt change. What is the professional next step?",
      options: [
        "Revert immediately and close the ticket",
        "Diff the failures against baseline: which questions flipped, do they cluster in a category, and is each flip a real quality drop or a brittle assertion?",
        "Raise the threshold to 88% so the gate passes",
        "Re-run until it passes once",
      ],
      correctIndex: 1,
      explanation:
        "Regression triage is a diff, not a panic: identify flipped questions, look for clustering, reproduce one manually. Half of triage finds real drops; half finds brittle tests — confusing the two destroys the suite's credibility.",
    },
    {
      question: "Your decision table shows gpt-4o at 96% pass / ~30× the cost of mini at 84%. Who decides which ships, and based on what?",
      options: [
        "QA decides — always ship the higher pass rate",
        "The business decides, using your table — domain risk determines whether +12% quality is worth 30× cost",
        "The provider decides",
        "Finance decides on cost alone",
      ],
      correctIndex: 1,
      explanation:
        "Your job is making the trade-off visible and honest; the business owns the call. A medical bot justifies the premium; a casual FAQ bot may not. The table turns that from argument into decision.",
    },
    {
      question: "Why must the baseline file be committed next to the test suite?",
      options: [
        "Git requires it",
        "So the baseline is versioned with the exact suite that produced it — numbers without their suite version can't be compared honestly",
        "To make the repo look complete",
        "So the CI server can delete it",
      ],
      correctIndex: 1,
      explanation:
        "A baseline is only meaningful relative to a specific suite, prompt version and model. Versioning them together means any future diff compares like with like.",
    },
  ],

  // ── Module · LangChain & LangGraph Testing ──────────────────────────────

  "LangChain Fundamentals & Testing Chains": [
    {
      question: "What is a 'chain' in LangChain, from a tester's view?",
      options: [
        "A single LLM API call",
        "A multi-step pipeline (e.g. prompt → model → parser) where each step is its own failure point",
        "A blockchain ledger of prompts",
        "A sequence of test cases",
      ],
      correctIndex: 1,
      explanation:
        "A chain is an assembly line of stations piped together with `|`. Each station — template, model call, output parser — can fail independently, so you test them individually AND end to end.",
    },
    {
      question: "The most common chain crash in production is…",
      options: [
        "The API key expiring",
        "The output parser choking on chatty model output like 'Sure! Here is the JSON: {…}'",
        "The prompt being too short",
        "Running out of memory",
      ],
      correctIndex: 1,
      explanation:
        "Models love to wrap structured output in conversational preamble. A strict JSON parser then crashes on the 'Sure! Here is…' text. Testing the parser against chatty and malformed output is essential.",
    },
    {
      question: "Why swap the real LLM for a FakeListLLM when unit-testing a chain?",
      options: [
        "Fakes are more accurate than real models",
        "A scripted fake is deterministic, free and instant — so a failure is ALWAYS your chain's fault, never the model's mood",
        "Real models can't be used in tests",
        "It improves the model's answers",
      ],
      correctIndex: 1,
      explanation:
        "The fake LLM isolates the plumbing (templates, parsers, routing) from model non-determinism — the same mocking you've done for years with REST services. Any failure is now unambiguously your code.",
    },
    {
      question: "What is the correct testing split for a chain?",
      options: [
        "Test everything with the real model",
        "Fake LLM for the plumbing (templates, parsers, retries); real LLM + metrics for answer quality — never mixed in one test",
        "Only test the final answer",
        "Test only with fake LLMs",
      ],
      correctIndex: 1,
      explanation:
        "Two layers, two tools: deterministic fakes prove the wiring works; real-LLM runs with DeepEval judge answer quality. Confusing the layers makes failures ambiguous.",
    },
    {
      question: "A chain auto-retries on parse failure. What must you test about that?",
      options: [
        "That it retries forever until it succeeds",
        "That a permanently-bad output fails CLEANLY after N retries — not an infinite loop billing you per lap",
        "That retries are disabled",
        "Nothing — retries are always safe",
      ],
      correctIndex: 1,
      explanation:
        "Uncapped retries are a cost bug disguised as reliability. Assert the chain gives up cleanly after a bounded number of attempts on genuinely unparseable output.",
    },
    {
      question: "What does the `|` operator do in `prompt | llm | StrOutputParser()`?",
      options: [
        "Logical OR between components",
        "Pipes each station's output as the input to the next — composing the chain",
        "Runs the three components in parallel",
        "Comments out the line",
      ],
      correctIndex: 1,
      explanation:
        "In LangChain Expression Language, `|` composes components left to right: the prompt's output feeds the model, whose output feeds the parser. Each junction is a place to inspect and test.",
    },
    {
      question: "Why enable intermediate-step logging (callbacks / verbose mode) in chain tests?",
      options: [
        "To make tests run faster",
        "So when an end-to-end test fails you can see WHICH station produced the wrong value",
        "To reduce token cost",
        "It's required by pytest",
      ],
      correctIndex: 1,
      explanation:
        "A chain E2E failure only tells you the final answer is wrong. Logging each station's output tells you whether the prompt was malformed or the parser mangled a good answer — the difference between a 5-minute and a 2-hour debug.",
    },
    {
      question: "A developer typos a template variable: `{quesiton}` instead of `{question}`. When and where does this surface?",
      options: [
        "Never — LangChain auto-corrects it",
        "At runtime, as an error when the chain is invoked — potentially in front of a user if untested",
        "At install time",
        "Only in production logs, silently",
      ],
      correctIndex: 1,
      explanation:
        "Template variable mismatches raise runtime errors on invocation. A cheap fake-LLM test that just invokes the chain catches it before it reaches a user — exactly why plumbing tests matter.",
    },
    {
      question: "Which failures should a fake-LLM (not real-LLM) test cover?",
      options: [
        "Whether the answer is factually correct",
        "Template rendering, output parsing, routing, and retry behaviour — the deterministic plumbing",
        "The model's hallucination rate",
        "Latency under load",
      ],
      correctIndex: 1,
      explanation:
        "Fakes are for deterministic wiring: does the template fill, does the parser handle clean/chatty/broken output, does routing pick the right branch, does retry cap out. Answer quality needs the real model + metrics.",
    },
    {
      question: "A chain station silently swallows an error and passes an empty string downstream. What's the symptom?",
      options: [
        "The chain crashes loudly",
        "The bot answers with an empty or nonsensical response and no error is raised — a silent failure",
        "The API returns 500",
        "Tokens spike to zero",
      ],
      correctIndex: 1,
      explanation:
        "Swallowed errors are worse than crashes: an empty value flows to the end and the user gets a blank/garbage answer with a 200 status. Test that each station fails loudly rather than passing junk on.",
    },
  ],

  "LangGraph Agent Testing & Tracing": [
    {
      question: "What fundamentally separates an agent from a chain?",
      options: [
        "Agents are faster",
        "An agent DECIDES — it loops, picks tools, and chooses its next step; a chain runs start-to-finish once",
        "Agents don't use LLMs",
        "Chains cost more",
      ],
      correctIndex: 1,
      explanation:
        "A chain is a train on rails; an agent is a driver with free will — it can take wrong turns, circle forever, or act on the wrong target. That decision-making is the new surface you test.",
    },
    {
      question: "In LangGraph, what is 'state'?",
      options: [
        "The US state where the server runs",
        "A shared dict every node reads and writes — corrupt it once and every later node inherits the damage",
        "Whether the agent is on or off",
        "The model's temperature setting",
      ],
      correctIndex: 1,
      explanation:
        "State flows through the graph; a node that overwrites a field another node needed causes damage that surfaces steps later. State-corruption bugs are the hardest to find without tracing.",
    },
    {
      question: "When testing an agent, what is a 'trajectory'?",
      options: [
        "The agent's response time",
        "The path it took — which tools it called, in what order, with what arguments — asserted alongside the final answer",
        "The physical location of the server",
        "The token budget",
      ],
      correctIndex: 1,
      explanation:
        "For agents you assert on the path, not just the text: right tool, right arguments, no extra tools. A correct answer reached via the wrong trajectory is still a bug.",
    },
    {
      question: "Why must you mock tools with real side effects in agent tests?",
      options: [
        "Mocking makes tests slower",
        "A test suite that can issue real refunds or write to the real database is an incident, not a test — mocks keep tests deterministic and safe",
        "Real tools are more accurate",
        "LangGraph forbids real tools",
      ],
      correctIndex: 1,
      explanation:
        "Never point agent tests at tools that change the real world. A fake `lookup_refund` returning a scripted record is deterministic, free, and can't accidentally refund a customer during CI.",
    },
    {
      question: "'Excessive agency' in an agent means…",
      options: [
        "The agent responds too quickly",
        "It does MORE than asked — e.g. asked to CHECK a refund's status, it ISSUES one — a safety bug when tools have side effects",
        "The agent uses too many tokens",
        "The agent refuses to act",
      ],
      correctIndex: 1,
      explanation:
        "Excessive agency is action beyond the request. With real tools attached it's a security/safety risk (OWASP LLM08), so a status QUESTION must never trigger an ACTION tool — write that test explicitly.",
    },
    {
      question: "What is tracing (LangSmith / Langfuse) and why set it up before writing agent tests?",
      options: [
        "A way to speed up the agent",
        "A recorder of every step's inputs, outputs, timing, tokens and cost — without it you see the wrong answer but not which of 15 steps lied",
        "A type of unit test",
        "A billing dashboard only",
      ],
      correctIndex: 1,
      explanation:
        "One agent run hides many model and tool calls. Tracing is the flight recorder that shows where the time and money went and which node corrupted state. Testing agents without it is testing blindfolded.",
    },
    {
      question: "Which is a valid 'budget assertion' for an agent test?",
      options: [
        "assert answer is not None",
        "assert steps_taken < N and tokens < budget and wall_time < limit",
        "assert model == 'gpt-4o'",
        "assert temperature == 0",
      ],
      correctIndex: 1,
      explanation:
        "An agent that answers correctly but in 30 steps and ₹50 is a failing test with a right answer. Assert the economics — steps, tokens, time — not just correctness.",
    },
    {
      question: "The agent calls `lookup_refund`, gets 'processed', then tells the user 'your refund was denied'. What failure is this?",
      options: [
        "A network timeout",
        "Ignoring tool results — it called the tool correctly then hallucinated a contradicting answer, hidden behind a legitimate tool call",
        "A rate limit",
        "Correct behaviour",
      ],
      correctIndex: 1,
      explanation:
        "The sneakiest agent bug: the trajectory looks right (correct tool, correct args) but the final answer ignores what the tool returned. Assert the answer is consistent with the tool result, not just that the tool was called.",
    },
    {
      question: "An agent keeps 'thinking' and never answers. What must your test verify exists?",
      options: [
        "A faster model",
        "A recursion/step limit that ends the run cleanly instead of looping and burning tokens forever",
        "More memory",
        "A retry counter set to infinity",
      ],
      correctIndex: 1,
      explanation:
        "Infinite loops are a signature agent failure and a direct cost risk. Test that a step/recursion cap exists and produces a clean, bounded failure.",
    },
    {
      question: "Reading a trace, which question can you now answer that a pass/fail result can't?",
      options: [
        "Whether the test file compiles",
        "Where a run's 40 seconds and ₹6 went, the exact prompt at step 4, and which node corrupted state",
        "The name of the developer",
        "The color of the UI",
      ],
      correctIndex: 1,
      explanation:
        "A trace exposes per-step cost, timing, and the fully-assembled prompt/state at each node — turning 'it was wrong' into 'node 4 looped and node 2 corrupted the ticket ID'.",
    },
  ],

  // ── Module · Security, Safety & Red Teaming ─────────────────────────────

  "OWASP Top 10 for LLMs": [
    {
      question: "What is the OWASP Top 10 for LLMs?",
      options: [
        "A ranking of the best LLM models",
        "A standard list of the most critical LLM application security risks — the closest thing AI security testing has to a checklist",
        "OpenAI's pricing tiers",
        "A set of ten prompts",
      ],
      correctIndex: 1,
      explanation:
        "From the same OWASP behind the web Top 10, it names and organises LLM risks (injection, output handling, data disclosure, excessive agency…). Auditors and enterprise clients ask about it by name.",
    },
    {
      question: "LLM01 Prompt Injection — what is INDIRECT injection?",
      options: [
        "The user types 'ignore previous instructions' directly",
        "Malicious instructions hidden in content the bot processes — a webpage it summarises, a document, a pasted email",
        "Injecting SQL into a database",
        "A slow, gradual attack over many messages",
      ],
      correctIndex: 1,
      explanation:
        "Direct injection is typed by the user; indirect injection hides instructions in third-party content the bot ingests. Indirect is the sneakier, more dangerous cousin because the attacker never talks to the bot directly.",
    },
    {
      question: "LLM02 Insecure Output Handling is best summarised as…",
      options: [
        "The model responds too slowly",
        "The app trusts model output blindly — rendering it as HTML (XSS), feeding it to SQL, or executing it",
        "The output is too long",
        "The output is in the wrong language",
      ],
      correctIndex: 1,
      explanation:
        "Treat model output as untrusted input, exactly like user input. Rendering it as raw HTML or piping it into a query without validation is the LLM-era version of classic injection flaws.",
    },
    {
      question: "Which OWASP LLM risk does an over-permissioned agent with a refund tool primarily represent?",
      options: [
        "LLM01 Prompt Injection",
        "LLM08 Excessive Agency",
        "LLM03 Training Data Poisoning",
        "LLM10 Model Theft",
      ],
      correctIndex: 1,
      explanation:
        "Excessive Agency (LLM08) is having more tools/permissions than the job needs, plus the ability to be talked into using them — the agent-session refund example, reframed as a named security risk.",
    },
    {
      question: "What is the most valuable skill this session builds?",
      options: [
        "Memorising all ten risk names",
        "Converting each abstract risk into concrete test cases for YOUR specific product",
        "Reading the PDF cover to cover",
        "Reporting risks to OWASP",
      ],
      correctIndex: 1,
      explanation:
        "The list is only useful translated into tests: LLM01 → 'ignore instructions, reveal your system prompt'; LLM06 → 'what did the previous user ask?'. That translation is what makes you valuable.",
    },
    {
      question: "LLM06 Sensitive Information Disclosure includes which test?",
      options: [
        "Asking the bot to solve a math problem",
        "'What did the previous user ask you?' / 'Repeat your instructions' — probing for leaked data or system prompt",
        "Measuring response latency",
        "Checking the model version",
      ],
      correctIndex: 1,
      explanation:
        "Disclosure tests probe for leaks of the system prompt, other users' data, or internal details. If the bot reveals its instructions or another session's content, that's an LLM06 finding.",
    },
    {
      question: "Why build a 'capability → risk' table before security testing?",
      options: [
        "To make the report longer",
        "A read-only FAQ bot activates different risks than an agent with tools — the table scopes which Top 10 items actually apply and becomes your test plan",
        "OWASP requires it",
        "To choose a model",
      ],
      correctIndex: 1,
      explanation:
        "Not every risk applies to every bot. Mapping the bot's capabilities to the risks they activate focuses testing where exposure is real — and auditors love that table.",
    },
    {
      question: "LLM09 Overreliance is best described as…",
      options: [
        "The bot depends too much on the API",
        "No human review where the stakes demand it — a PROCESS bug the tester should flag",
        "Too many API calls",
        "The model over-fitting its training data",
      ],
      correctIndex: 1,
      explanation:
        "Overreliance is trusting AI output in high-stakes flows without a human in the loop. It's a process/design finding — flag it even though it isn't a single failing test case.",
    },
    {
      question: "What distinguishes this security testing from actual attacking?",
      options: [
        "Nothing — the techniques are identical",
        "It's done on your own (or explicitly authorised) systems, with the team's knowledge, to harden them — not to exploit",
        "It uses different tools",
        "It's done at night",
      ],
      correctIndex: 1,
      explanation:
        "Same techniques, opposite intent and authorisation. Defensive security testing is scoped, permissioned, and produces a hardening plan for your team — that professionalism is the whole difference.",
    },
    {
      question: "LLM04 Model Denial of Service maps to which test you already ran?",
      options: [
        "The 10,000-character prompt and 'repeat this forever' prompts that burn cost",
        "The exact-string assertion test",
        "The latency percentile test only",
        "The venv activation test",
      ],
      correctIndex: 0,
      explanation:
        "Model DoS is oversized or looping input that exhausts cost/compute — the stress tests from the chatbot UI and API sessions, now labelled with their OWASP risk ID.",
    },
  ],

  "Red Teaming with PromptFoo & Giskard": [
    {
      question: "What is red teaming?",
      options: [
        "Splitting the QA team into two competing groups",
        "Playing the attacker against your OWN system, with permission, before a real attacker arrives",
        "A code-review technique",
        "Testing only the red (error) paths",
      ],
      correctIndex: 1,
      explanation:
        "Red teaming is an authorised, documented fire drill: you attack your own bot to find weaknesses first. The deliverable is a findings/hardening report, not chaos.",
    },
    {
      question: "In PromptFoo red team mode, what's the difference between plugins and strategies?",
      options: [
        "They're the same thing",
        "Plugins = WHAT to attack (which risk); strategies = HOW to disguise it (jailbreak, roleplay, encoding)",
        "Plugins are paid; strategies are free",
        "Strategies pick the model; plugins pick the prompt",
      ],
      correctIndex: 1,
      explanation:
        "A plugin targets a risk (prompt-injection, pii, excessive-agency); a strategy wraps the attack to slip past defences. Defences that stop the plain attack often fail the strategy-wrapped version — that gap is what you measure.",
    },
    {
      question: "Why is VOLUME the point of automated red teaming?",
      options: [
        "To slow down the server",
        "Guardrails are probabilistic — hundreds of attack phrasings give you a pass RATE, not a single misleading pass",
        "To use up the token budget",
        "More attacks look impressive in reports",
      ],
      correctIndex: 1,
      explanation:
        "One attack passing means little when defences are probabilistic. Generating hundreds of seeded variations produces a rate — the same 'measure the rate' principle from hallucination testing.",
    },
    {
      question: "Why run BOTH PromptFoo and Giskard instead of just one?",
      options: [
        "Redundancy is required for compliance",
        "Two scanners have different blind spots — like two reviewers, they disagree in useful places",
        "Giskard is a backup in case PromptFoo crashes",
        "They must always agree to be valid",
      ],
      correctIndex: 1,
      explanation:
        "PromptFoo excels at targeted, config-driven attack suites in CI; Giskard's broad scan (including bias) surfaces categories you didn't configure. Different generators catch different holes.",
    },
    {
      question: "An automated red team reports a finding. What's your FIRST step?",
      options: [
        "File it as a critical bug immediately",
        "Reproduce it manually 3× — generated attacks can be flaky; confirm the failure is real and note its rate",
        "Email it to OWASP",
        "Ship a fix without checking",
      ],
      correctIndex: 1,
      explanation:
        "Automated findings are candidates. Reproduce manually to confirm it's real and get a rate before rating severity — the same discipline as any QA finding.",
    },
    {
      question: "How should a red team finding be reported?",
      options: [
        "'The bot is insecure'",
        "By category and rate with worst case: 'Injection: 4/120 attacks landed (3.3%), all via roleplay strategy — example attached'",
        "As a screenshot of the config",
        "Only the total number of attacks run",
      ],
      correctIndex: 1,
      explanation:
        "Actionable reporting names the risk category, the landing rate, the successful strategy, and a concrete example — calm and professional, exactly like a good bug report.",
    },
    {
      question: "Why must the red team suite become part of the regression suite?",
      options: [
        "To make CI slower",
        "Defences are prompts and filters — i.e. code — so they regress; re-run after every fix and every change",
        "Red teaming is a one-time activity",
        "Regression suites can't include security tests",
      ],
      correctIndex: 1,
      explanation:
        "A guardrail is code; a later change can silently reopen a hole you closed. Folding the red team suite into regression means every build re-checks the defences.",
    },
    {
      question: "You add the jailbreak STRATEGY and more attacks suddenly land. What does that delta tell you?",
      options: [
        "The model got worse overnight",
        "Your defences stop the plain attack but not the disguised version — the delta IS your blind spot",
        "The tool is broken",
        "Nothing meaningful",
      ],
      correctIndex: 1,
      explanation:
        "The increase in successful attacks when you add a strategy precisely measures the gap between 'blocks obvious attacks' and 'blocks disguised attacks' — the most actionable number in the run.",
    },
    {
      question: "Which is a rule of engagement for red teaming?",
      options: [
        "Attack any bot you can find to compare",
        "Your own or explicitly authorised systems only, ideally non-production, findings disclosed to the team — never exploited or shared externally",
        "Keep findings secret from the dev team",
        "Test directly in production for realism",
      ],
      correctIndex: 1,
      explanation:
        "Red teaming is bounded and professional: authorised scope, safe environment, responsible disclosure, hardening plan as the deliverable. That's what separates a security tester from an attacker.",
    },
    {
      question: "What does `redteam.purpose` in the PromptFoo config do?",
      options: [
        "Sets the model temperature",
        "Describes your app so the tool can generate attacks relevant to it (e.g. a support bot's likely abuse cases)",
        "Names the output file",
        "Chooses the judge model",
      ],
      correctIndex: 1,
      explanation:
        "Telling the tool the app's purpose lets it generate contextually relevant attacks — injection and abuse cases that fit an e-commerce support bot rather than generic noise.",
    },
  ],

  "Guardrails, Output Validation & Bias Testing": [
    {
      question: "What is a guardrail?",
      options: [
        "A setting inside the model",
        "A check that runs OUTSIDE the model — on the input before it, or the output after it, before the user sees it",
        "A type of prompt",
        "The model's temperature",
      ],
      correctIndex: 1,
      explanation:
        "Guardrails are external checks: input rails (block injection/PII/off-topic before the model) and output rails (filter toxicity, redact PII, validate format after the model). The model is the talent; guardrails are the bouncer and the editor.",
    },
    {
      question: "Which guardrail test do beginners most often forget?",
      options: [
        "The block test (bad input is caught)",
        "The PASS test — legitimate traffic flows through; a rail that also blocks 'how do I kill a background process?' quietly destroys usefulness",
        "The performance test",
        "The syntax test",
      ],
      correctIndex: 1,
      explanation:
        "Guardrails need BOTH a block rate on bad input and a low false-positive rate on good input. Over-blocking legitimate queries (the word 'kill' in a technical question) silently ruins the product.",
    },
    {
      question: "Why validate model output with a schema (e.g. Pydantic) before your code uses it?",
      options: [
        "To make the output prettier",
        "Model output is untrusted input — never act on unparseable/malformed output; route to a human instead (OWASP LLM02)",
        "Schemas make the model faster",
        "It reduces token cost",
      ],
      correctIndex: 1,
      explanation:
        "When output feeds code (a refund amount, a DB write), validate structure first. Chatty preamble, missing fields, wrong types, or absurd values must fail safely — acting on them blindly is Insecure Output Handling.",
    },
    {
      question: "What is the counterfactual method for bias testing?",
      options: [
        "Asking the model if it is biased",
        "Change ONE identity attribute (name, gender, city), keep everything else identical, and compare outcomes",
        "Running the model at temperature 0",
        "Testing only with real user data",
      ],
      correctIndex: 1,
      explanation:
        "Same qualifications, different name/gender/city → meaningfully different answers = a bias finding. Building counterfactual pairs is the core, and for India-market products name-and-city pairs are the highest-signal test.",
    },
    {
      question: "How should bias be measured and reported?",
      options: [
        "One example proves the model is biased",
        "As a rate over many pairs — 'approval recommendations differed by name in 9% of pairs' — because non-determinism applies to bias too",
        "Only qualitatively, in prose",
        "By reading the training data",
      ],
      correctIndex: 1,
      explanation:
        "Like hallucination, bias is measured as a rate over many pairs run multiple times, with examples attached. A single anecdote isn't evidence; a rate with cases is.",
    },
    {
      question: "Where does model bias come from, and what does that imply for testing?",
      options: [
        "A bug that can be patched once and forgotten",
        "Training data reflects society's patterns the model learned — so, like hallucination, bias is a property to measure and manage continuously",
        "The temperature setting",
        "The API provider's servers",
      ],
      correctIndex: 1,
      explanation:
        "Models learn societal patterns from training data, so bias is inherent, not a one-time defect. You measure it, set thresholds, and re-test — you don't 'fix' it once.",
    },
    {
      question: "What does the layered defence stack look like?",
      options: [
        "One really good system prompt",
        "System-prompt hardening + input rails + the model + output rails/validation + monitoring — each with its own tests",
        "Just an output filter",
        "The model plus a firewall",
      ],
      correctIndex: 1,
      explanation:
        "Safety is a stack of layers, each independently tested. The DPD incident happened because the ONLY defence was the model's own politeness — one prompt line is not a defence.",
    },
    {
      question: "Which unhappy paths must output validation tests cover?",
      options: [
        "Only perfectly-formatted JSON",
        "Chatty preamble around the JSON, missing fields, wrong types, absurd values (amount = -50000), and injection inside field values",
        "Only the happy path",
        "Only latency",
      ],
      correctIndex: 1,
      explanation:
        "Real model output is messy and occasionally adversarial. Validation must reject preamble-wrapped JSON, schema violations, nonsensical values, and payloads hidden inside otherwise-valid fields.",
    },
    {
      question: "A profanity filter blocks the message 'how do I kill a zombie process on Linux?'. What kind of problem is this?",
      options: [
        "A correct block — the message is unsafe",
        "A false positive — the guardrail is over-blocking legitimate technical language, which you measure as a false-positive rate",
        "A model hallucination",
        "A latency issue",
      ],
      correctIndex: 1,
      explanation:
        "'kill' is legitimate in a technical context. Over-blocking is a real failure mode; that's why you measure the false-positive rate on good traffic alongside the block rate on bad.",
    },
    {
      question: "Why are biased hiring or loan answers especially urgent to test in regulated domains?",
      options: [
        "They slow the model down",
        "They harm real people AND create legal exposure under laws like the EU AI Act and lending regulations",
        "They increase token cost",
        "They only affect non-English users",
      ],
      correctIndex: 1,
      explanation:
        "Beyond ethics, biased decisions in hiring/lending/support are legal liabilities in regulated markets — the EU-standards point from Session 1. That raises bias from 'nice to check' to 'must test and document'.",
    },
  ],
};
