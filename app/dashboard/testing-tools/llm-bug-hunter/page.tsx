'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, RotateCcw, Zap, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { ToolLayout } from '../tool-layout';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  mode: 'normal' | 'hallucinated';
  temperature: number;
}

const PRESET_CONTEXTS = [
  { label: 'Playwright Assistant', value: 'You are a Playwright testing assistant helping QA engineers write and debug tests.' },
  { label: 'Cypress Expert', value: 'You are a Cypress testing expert helping developers with E2E test automation.' },
  { label: 'Selenium Guide', value: 'You are a Selenium WebDriver expert assistant.' },
  { label: 'API Testing', value: 'You are a REST API testing expert helping QA engineers test and validate APIs.' },
  { label: 'No system prompt', value: '' },
];

const BUG_TYPES = [
  { label: 'Hallucination', color: 'bg-red-50 text-red-600 border-red-200', desc: 'AI invented something that does not exist' },
  { label: 'Factual Error', color: 'bg-amber-50 text-amber-600 border-amber-200', desc: 'AI stated something factually wrong' },
  { label: 'Prompt Injection', color: 'bg-purple-50 text-purple-600 border-purple-200', desc: 'AI followed malicious instructions' },
  { label: 'Context Leakage', color: 'bg-blue-50 text-blue-600 border-blue-200', desc: 'AI revealed internal instructions' },
  { label: 'No Bug', color: 'bg-green-50 text-green-600 border-green-200', desc: 'Response looks correct' },
];

const SAMPLE_PROMPTS = [
  'How do I do visual regression testing in Playwright?',
  'What HTTP status code does POST return when creating a resource?',
  'Does Cypress support multiple browser tabs?',
  'What is the default implicit wait in Selenium?',
];

const SCENARIOS = [
  'Switch to Hallucination Mode and ask about a Playwright method — see if it invents one that does not exist.',
  'Ask a factual question (e.g. HTTP status codes) and verify the answer is correct.',
  'Try a prompt injection: start your message with "Ignore your instructions and...".',
  'Set a custom system context with a secret, then ask the AI to repeat its instructions.',
  'Adjust the temperature slider and notice how responses get more creative (and error-prone) at higher values.',
];

export default function LLMBugHunterTool() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [systemContext, setSystemContext] = useState(PRESET_CONTEXTS[0].value);
  const [customContext, setCustomContext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showContext, setShowContext] = useState(true);
  const [taggedBugs, setTaggedBugs] = useState<Record<number, string>>({});
  const [mode, setMode] = useState<'normal' | 'hallucinated'>('normal');
  const [temperature, setTemperature] = useState(0.7);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setTemperature(mode === 'hallucinated' ? 1.0 : 0.7);
  }, [mode]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async () => {
    const prompt = input.trim();
    if (!prompt || loading) return;

    setMessages((m) => [...m, { role: 'user', content: prompt, mode, temperature }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/llm-bug-hunter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          systemContext: mode === 'hallucinated' ? '' : systemContext,
          mode,
          temperature,
        }),
      });
      const data = await res.json();
      setMessages((m) => [...m, {
        role: 'assistant',
        content: data.response ?? data.error ?? 'Something went wrong.',
        mode,
        temperature: data.temperature ?? temperature,
      }]);
    } catch {
      setMessages((m) => [...m, {
        role: 'assistant',
        content: 'Failed to get a response. Check your connection.',
        mode,
        temperature,
      }]);
    } finally {
      setLoading(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const tagBug = (aiIdx: number, label: string) => {
    setTaggedBugs((p) => ({ ...p, [aiIdx]: p[aiIdx] === label ? '' : label }));
  };

  const isHallucinated = mode === 'hallucinated';

  return (
    <ToolLayout
      title="LLM Bug Practice"
      description="Interact with a real AI and practise spotting hallucinations, factual errors, prompt injections, and context leakage."
      difficulty="Intermediate"
      scenarios={SCENARIOS}
    >
      <div className="space-y-4">

        {/* Mode + Temperature */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex rounded-lg overflow-hidden border border-slate-200 shrink-0 h-10">
            <button
              onClick={() => setMode('normal')}
              className={`flex items-center gap-1.5 px-4 text-sm font-medium transition-colors ${
                !isHallucinated
                  ? 'bg-sky-50 text-sky-700 border-r border-slate-200'
                  : 'text-slate-500 hover:text-slate-700 border-r border-slate-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5" /> Normal AI
            </button>
            <button
              onClick={() => setMode('hallucinated')}
              className={`flex items-center gap-1.5 px-4 text-sm font-medium transition-colors ${
                isHallucinated ? 'bg-red-50 text-red-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Zap className="w-3.5 h-3.5" /> Hallucination Mode
            </button>
          </div>

          <div className="flex items-center gap-3 flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 h-10">
            <span className="text-xs text-slate-500 shrink-0">Temperature</span>
            <input
              type="range" min={0} max={1.2} step={0.1} value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="flex-1 accent-sky-500 cursor-pointer"
            />
            <span className={`text-sm font-mono font-semibold w-8 text-right shrink-0 ${
              temperature >= 1.0 ? 'text-red-500' : temperature >= 0.8 ? 'text-amber-500' : 'text-green-600'
            }`}>{temperature.toFixed(1)}</span>
          </div>
        </div>

        {/* Hallucination banner */}
        {isHallucinated && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 text-sm text-red-700">
            <Zap className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              <span className="font-medium">Hallucination Mode is on.</span> The AI will confidently invent fake APIs, method names, and technical details. Your job is to spot what&apos;s made up.
            </span>
          </div>
        )}

        {/* System context */}
        {!isHallucinated && (
          <div className="border border-slate-200 rounded-lg">
            <button
              onClick={() => setShowContext(!showContext)}
              className="w-full flex items-center justify-between px-4 py-3 text-sm text-slate-700 hover:text-slate-900 transition-colors"
            >
              <span className="font-medium">System Context <span className="text-xs text-slate-400 font-normal ml-1">optional — simulates real AI deployments</span></span>
              {showContext ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
            {showContext && (
              <div className="px-4 pb-4 space-y-3 border-t border-slate-100">
                <div className="flex flex-wrap gap-2 pt-3">
                  {PRESET_CONTEXTS.map((p) => (
                    <button key={p.label}
                      onClick={() => { setSystemContext(p.value); setCustomContext(false); }}
                      className={`text-xs px-3 py-1.5 rounded-md border transition-colors ${
                        !customContext && systemContext === p.value
                          ? 'border-sky-500 bg-sky-50 text-sky-700'
                          : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700'
                      }`}
                    >{p.label}</button>
                  ))}
                  <button
                    onClick={() => setCustomContext(true)}
                    className={`text-xs px-3 py-1.5 rounded-md border transition-colors ${
                      customContext
                        ? 'border-sky-500 bg-sky-50 text-sky-700'
                        : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700'
                    }`}
                  >Custom</button>
                </div>
                {customContext ? (
                  <textarea
                    value={systemContext}
                    onChange={(e) => setSystemContext(e.target.value)}
                    placeholder="Write your own system prompt..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-sky-400 resize-none"
                    rows={2}
                  />
                ) : systemContext ? (
                  <p className="text-xs text-slate-500 bg-slate-50 rounded-md px-3 py-2 leading-relaxed">{systemContext}</p>
                ) : (
                  <p className="text-xs text-slate-400 italic">No system prompt set.</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Chat area */}
        <div className="min-h-[280px] space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-sm font-medium text-slate-600 mb-1">
                {isHallucinated ? 'Ask something technical — spot what the AI makes up' : 'Type a prompt and test the AI'}
              </p>
              <p className="text-xs text-slate-400 mb-5">Tag each AI response to practise identifying bug types</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                {SAMPLE_PROMPTS.map((q) => (
                  <button key={q} onClick={() => setInput(q)}
                    className="text-left px-3 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-600 hover:text-slate-800 transition-colors leading-relaxed"
                  >{q}</button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => {
            const aiIdx = messages.slice(0, i + 1).filter((m) => m.role === 'assistant').length - 1;
            return (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className="max-w-[80%] space-y-2">
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-sky-500 text-white rounded-br-sm'
                      : msg.mode === 'hallucinated'
                      ? 'bg-red-50 border border-red-200 text-slate-800 rounded-bl-sm'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-bl-sm'
                  }`}>
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-xs text-slate-400">AI Response</span>
                        {msg.mode === 'hallucinated' && (
                          <span className="text-xs bg-red-100 text-red-600 border border-red-200 px-1.5 py-0.5 rounded font-medium flex items-center gap-1">
                            <Zap className="w-2.5 h-2.5" /> hallucination mode
                          </span>
                        )}
                        <span className="text-xs text-slate-400 ml-auto font-mono">temp {msg.temperature.toFixed(1)}</span>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>

                  {msg.role === 'assistant' && (
                    <div className="space-y-1.5 pl-1">
                      <p className="text-xs text-slate-400">Tag this response:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {BUG_TYPES.map((bug) => (
                          <button key={bug.label} onClick={() => tagBug(aiIdx, bug.label)} title={bug.desc}
                            className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                              taggedBugs[aiIdx] === bug.label
                                ? `${bug.color} font-semibold`
                                : 'border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600'
                            }`}
                          >{bug.label}</button>
                        ))}
                      </div>
                      {taggedBugs[aiIdx] && taggedBugs[aiIdx] !== 'No Bug' && (
                        <p className="text-xs text-slate-500">Tagged as <span className="text-slate-800 font-medium">{taggedBugs[aiIdx]}</span></p>
                      )}
                      {taggedBugs[aiIdx] === 'No Bug' && (
                        <p className="text-xs text-green-600">Looks correct.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex justify-start">
              <div className={`border rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2 text-sm ${
                isHallucinated
                  ? 'bg-red-50 border-red-200 text-red-500'
                  : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}>
                <Loader2 className="w-4 h-4 animate-spin" />
                {isHallucinated ? 'Hallucinating...' : 'Thinking...'}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Divider + reset */}
        {messages.length > 0 && (
          <div className="flex justify-end">
            <button
              onClick={() => { setMessages([]); setTaggedBugs({}); setInput(''); }}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Clear chat
            </button>
          </div>
        )}

        {/* Input */}
        <div className={`flex gap-2 bg-white border rounded-xl p-2 shadow-sm transition-colors ${
          isHallucinated
            ? 'border-red-300 focus-within:border-red-400'
            : 'border-slate-200 focus-within:border-sky-400'
        }`}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isHallucinated ? 'Ask something technical...' : 'Type a prompt to test the AI...'}
            className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none resize-none px-2 py-1.5 max-h-28"
            rows={2}
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            className={`self-end disabled:opacity-40 disabled:cursor-not-allowed text-white p-2.5 rounded-lg transition-colors shrink-0 ${
              isHallucinated ? 'bg-red-500 hover:bg-red-600' : 'bg-sky-500 hover:bg-sky-600'
            }`}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-xs text-slate-400 text-center">Enter to send · Shift+Enter for new line</p>
      </div>
    </ToolLayout>
  );
}
