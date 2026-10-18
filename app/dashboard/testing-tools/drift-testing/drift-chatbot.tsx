'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2, Send, Bot, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  verdict?: 'ok' | 'drift';
}

// What is true TODAY (Oct 2026). The bot only knows the Jan 2023 version.
const TODAY_FACTS = [
  { topic: 'Refund window', value: '15 days from delivery' },
  { topic: 'Free delivery', value: 'Above ₹199 (else ₹25)' },
  { topic: 'Delivery speed', value: 'Same-day in 40 cities + “ShopEasy Now” 10-minute grocery delivery' },
  { topic: 'Plus membership', value: '₹1,499 / year' },
  { topic: 'Customer care', value: '24×7 in-app chat (phone line shut down)' },
  { topic: 'Payments', value: 'Also UPI Lite & Pay Later · COD fee ₹10 · EMI above ₹3,000' },
  { topic: 'Latest iPhone', value: 'iPhone 17 series' },
  { topic: 'Exchange offers', value: 'Phones, laptops and TVs' },
  { topic: 'CEO', value: 'Ananya Rao (since 2025)' },
];

const SUGGESTED = [
  'How many days do I have to return a product?',
  'What is the minimum order for free delivery?',
  'Do you have 10-minute delivery?',
  'Can I pay with UPI Lite?',
  'What is the latest iPhone you sell?',
  'How do I contact customer care at night?',
  'Who is the CEO of ShopEasy?',
  'Who is the CEO of Twitter?',
];

export function DriftChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages, loading]);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || loading) return;
    const next: Message[] = [...messages, { role: 'user', content: q }];
    setMessages(next);
    setInput('');
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/drift-testing/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.map(({ role, content }) => ({ role, content })) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed');
      setMessages((m) => [...m, { role: 'assistant', content: data.reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to reach the bot');
    } finally {
      setLoading(false);
    }
  };

  const mark = (i: number, verdict: Message['verdict']) =>
    setMessages((m) => m.map((msg, idx) => (idx === i ? { ...msg, verdict: msg.verdict === verdict ? undefined : verdict } : msg)));

  const driftCount = messages.filter((m) => m.verdict === 'drift').length;
  const okCount = messages.filter((m) => m.verdict === 'ok').length;

  return (
    <div className="space-y-4" data-testid="drift-chatbot">
      <div className="bg-sky-50 border border-sky-200 rounded-lg px-4 py-3 text-sm text-sky-800">
        <span className="font-medium">ShopEasy Assistant</span> was trained in <span className="font-medium">January 2023</span> and never updated.
        Since then the store changed its prices, policies and services — and the world moved on. Chat with the bot, compare its answers with
        <span className="font-medium"> “What’s true today”</span>, and mark every answer that has drifted.
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
        {/* Chat */}
        <div className="border border-slate-200 rounded-lg flex flex-col">
          <div className="px-4 py-2 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-700 flex items-center gap-2"><Bot className="w-4 h-4 text-sky-600" /> ShopEasy Assistant <span className="text-xs text-slate-400 font-normal">· trained Jan 2023</span></p>
            <p className="text-xs text-slate-500" data-testid="drift-count">
              <span className="text-red-600 font-medium">{driftCount} drifted</span> · <span className="text-green-600 font-medium">{okCount} correct</span>
            </p>
          </div>

          <div className="p-4 space-y-3 min-h-[320px] max-h-[480px] overflow-y-auto">
            {messages.length === 0 && (
              <div className="space-y-2">
                <p className="text-sm text-slate-400">Ask anything, or try one of these:</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED.map((s) => (
                    <button key={s} onClick={() => send(s)} className="text-xs px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:border-sky-300 hover:text-sky-700">{s}</button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) =>
              m.role === 'user' ? (
                <div key={i} className="flex justify-end">
                  <div className="bg-sky-500 text-white text-sm px-4 py-2 rounded-2xl rounded-br-sm max-w-[80%]">{m.content}</div>
                </div>
              ) : (
                <div key={i} className="space-y-1.5 max-w-[85%]" data-testid="drift-bot-message">
                  <div className={`text-sm px-4 py-2 rounded-2xl rounded-bl-sm border ${
                    m.verdict === 'drift' ? 'bg-red-50 border-red-200 text-red-800'
                    : m.verdict === 'ok' ? 'bg-green-50 border-green-200 text-green-800'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}>{m.content}</div>
                  <div className="flex gap-2">
                    <button onClick={() => mark(i, 'drift')} data-testid="mark-drift"
                      className={`flex items-center gap-1 text-xs px-2 py-1 rounded border ${m.verdict === 'drift' ? 'border-red-300 bg-red-50 text-red-600' : 'border-slate-200 text-slate-400 hover:text-red-600'}`}>
                      <AlertTriangle className="w-3 h-3" /> Outdated
                    </button>
                    <button onClick={() => mark(i, 'ok')} data-testid="mark-ok"
                      className={`flex items-center gap-1 text-xs px-2 py-1 rounded border ${m.verdict === 'ok' ? 'border-green-300 bg-green-50 text-green-600' : 'border-slate-200 text-slate-400 hover:text-green-600'}`}>
                      <CheckCircle2 className="w-3 h-3" /> Still correct
                    </button>
                  </div>
                </div>
              ),
            )}

            {loading && <div className="flex items-center gap-2 text-sm text-slate-400"><Loader2 className="w-4 h-4 animate-spin" /> Typing...</div>}
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-slate-200 p-2 flex gap-2">
            <input
              data-testid="drift-chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') send(input); }}
              placeholder="Ask the bot anything..."
              className="flex-1 text-sm px-3 py-2 focus:outline-none text-slate-700 placeholder-slate-400"
            />
            <button
              data-testid="drift-chat-send"
              onClick={() => send(input)}
              disabled={!input.trim() || loading}
              className="bg-sky-500 hover:bg-sky-600 disabled:opacity-40 text-white p-2.5 rounded-lg"
            ><Send className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Today's truth */}
        <div className="border border-slate-200 rounded-lg h-fit">
          <p className="px-4 py-2 border-b border-slate-200 bg-green-50 text-sm font-medium text-green-700">What’s true today (Oct 2026)</p>
          <dl className="divide-y divide-slate-100">
            {TODAY_FACTS.map((f) => (
              <div key={f.topic} className="px-4 py-2">
                <dt className="text-xs text-slate-400">{f.topic}</dt>
                <dd className="text-sm text-slate-700">{f.value}</dd>
              </div>
            ))}
          </dl>
          <p className="px-4 py-2 border-t border-slate-100 text-xs text-slate-400">For general questions (CEOs, latest versions, world events), use your own knowledge of today.</p>
        </div>
      </div>

      <div className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 space-y-1">
        <p className="font-medium text-slate-600">Types of drift you can catch here</p>
        <p><span className="font-medium">Outdated facts</span> — old prices, old product versions, old CEO.</p>
        <p><span className="font-medium">Policy drift</span> — the business rule changed (7 → 15 day refunds) but the bot still follows the old one.</p>
        <p><span className="font-medium">New things the bot never saw</span> — ask about 10-minute delivery or UPI Lite: it denies they exist.</p>
        <p className="pt-1">Fix in real projects: connect the bot to a live knowledge base (RAG), re-run a fixed set of test questions after every data or policy change, and alert when answers stop matching the source of truth.</p>
      </div>
    </div>
  );
}
