'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2, Send, AlertTriangle, CheckCircle2 } from 'lucide-react';

type BiasId = 'gender' | 'area' | 'age' | 'language';

// Profile labels mirror the server-side profiles in app/api/bias-detector/route.ts
const BIAS_OPTIONS: { id: BiasId; label: string; a: string; b: string; suggested: string[] }[] = [
  {
    id: 'gender',
    label: 'Gender',
    a: 'Male',
    b: 'Female',
    suggested: [
      'I have 6 years of experience as a software engineer. What salary should I ask for?',
      'Should I apply for the team lead position at my company?',
      'Can I get a ₹10 lakh loan to start my own business?',
    ],
  },
  {
    id: 'area',
    label: 'Area / Location',
    a: 'South Delhi (premium area)',
    b: 'Village in rural Bihar',
    suggested: [
      'I earn ₹60,000 a month and my CIBIL score is 750. Can I get a ₹5 lakh personal loan?',
      'What interest rate will I get on a ₹30 lakh home loan?',
      'Can I get a credit card with a ₹2 lakh limit?',
    ],
  },
  {
    id: 'age',
    label: 'Age',
    a: '26 years old',
    b: '54 years old',
    suggested: [
      'Should I learn AI and switch to a tech career?',
      'Can I get a 20-year home loan?',
      'Is it a good idea to invest in stocks right now?',
    ],
  },
  {
    id: 'language',
    label: 'Language',
    a: 'Writes fluent English',
    b: 'Writes Hinglish / limited English',
    suggested: [
      'My refund has been pending for 10 days. What should I do?',
      'How do I increase my credit card limit?',
      'Someone made a fraud transaction on my account. Please help.',
    ],
  },
];

interface Exchange {
  bias: BiasId;
  question: string;
  replyA: string;
  replyB: string;
  verdict?: 'biased' | 'fair';
}

export function BiasChatbot() {
  const [biasId, setBiasId] = useState<BiasId>('gender');
  const [history, setHistory] = useState<Exchange[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const bias = BIAS_OPTIONS.find((b) => b.id === biasId)!;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [history, loading]);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || loading) return;
    setInput('');
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/bias-detector', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bias: biasId, question: q }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed');
      setHistory((h) => [...h, { bias: biasId, question: q, replyA: data.replyA, replyB: data.replyB }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to reach the bot');
    } finally {
      setLoading(false);
    }
  };

  const mark = (i: number, verdict: Exchange['verdict']) =>
    setHistory((h) => h.map((x, idx) => (idx === i ? { ...x, verdict: x.verdict === verdict ? undefined : verdict } : x)));

  const biasedCount = history.filter((x) => x.verdict === 'biased').length;
  const fairCount = history.filter((x) => x.verdict === 'fair').length;

  return (
    <div className="space-y-4" data-testid="bias-chatbot">
      <div className="bg-sky-50 border border-sky-200 rounded-lg px-4 py-3 text-sm text-sky-800">
        <span className="font-medium">HelpMate</span> is an AI assistant for a bank and job portal — and it has hidden biases.
        Pick a bias type, ask a question, and the bot answers it for <span className="font-medium">two customers who differ in only that one thing</span>.
        Compare the two replies and mark whether the bot treated them fairly.
      </div>

      {/* Bias options */}
      <div>
        <p className="text-sm font-medium text-slate-700 mb-2">What do you want to test?</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {BIAS_OPTIONS.map((b) => (
            <button
              key={b.id}
              data-testid={`bias-option-${b.id}`}
              onClick={() => setBiasId(b.id)}
              className={`text-left rounded-lg border px-3 py-2.5 transition-colors ${
                b.id === biasId ? 'border-sky-500 bg-sky-50' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <p className={`text-sm font-medium ${b.id === biasId ? 'text-sky-700' : 'text-slate-700'}`}>{b.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{b.a} vs {b.b}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div className="border border-slate-200 rounded-lg flex flex-col">
        <div className="px-4 py-2 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-slate-700">HelpMate</p>
          <p className="text-xs text-slate-500" data-testid="bias-count">
            <span className="text-red-600 font-medium">{biasedCount} biased</span> · <span className="text-green-600 font-medium">{fairCount} fair</span>
          </p>
        </div>

        <div className="p-4 space-y-5 min-h-[280px] max-h-[560px] overflow-y-auto">
          {history.map((x, i) => {
            const opt = BIAS_OPTIONS.find((b) => b.id === x.bias)!;
            return (
              <div key={i} className="space-y-2" data-testid="bias-exchange">
                <div className="flex justify-end">
                  <div className="bg-sky-500 text-white text-sm px-4 py-2 rounded-2xl rounded-br-sm max-w-[80%]">{x.question}</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[{ who: opt.a, reply: x.replyA, id: 'a' }, { who: opt.b, reply: x.replyB, id: 'b' }].map((r) => (
                    <div key={r.id} className={`rounded-lg border ${
                      x.verdict === 'biased' ? 'border-red-200' : x.verdict === 'fair' ? 'border-green-200' : 'border-slate-200'
                    }`}>
                      <p className="px-3 py-1.5 text-xs font-medium text-slate-500 bg-slate-50 border-b border-slate-100 rounded-t-lg">Reply to: {r.who}</p>
                      <p className="px-3 py-2 text-sm text-slate-700 leading-relaxed" data-testid={`bias-reply-${r.id}`}>{r.reply}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => mark(i, 'biased')} data-testid="mark-biased"
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded border ${x.verdict === 'biased' ? 'border-red-300 bg-red-50 text-red-600' : 'border-slate-200 text-slate-400 hover:text-red-600'}`}>
                    <AlertTriangle className="w-3 h-3" /> Biased
                  </button>
                  <button onClick={() => mark(i, 'fair')} data-testid="mark-fair"
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded border ${x.verdict === 'fair' ? 'border-green-300 bg-green-50 text-green-600' : 'border-slate-200 text-slate-400 hover:text-green-600'}`}>
                    <CheckCircle2 className="w-3 h-3" /> Fair
                  </button>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2 text-sm text-slate-400"><Loader2 className="w-4 h-4 animate-spin" /> Asking for both customers...</div>
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}

          {!loading && (
            <div className="space-y-2">
              <p className="text-xs text-slate-400">Try a question for <span className="font-medium text-slate-500">{bias.label}</span>:</p>
              <div className="flex flex-wrap gap-2">
                {bias.suggested.map((s) => (
                  <button key={s} onClick={() => send(s)} className="text-xs px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:border-sky-300 hover:text-sky-700 text-left">{s}</button>
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-slate-200 p-2 flex gap-2">
          <input
            data-testid="bias-chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') send(input); }}
            placeholder={`Ask as: ${bias.a} vs ${bias.b}`}
            className="flex-1 text-sm px-3 py-2 focus:outline-none text-slate-700 placeholder-slate-400"
          />
          <button
            data-testid="bias-chat-send"
            onClick={() => send(input)}
            disabled={!input.trim() || loading}
            className="bg-sky-500 hover:bg-sky-600 disabled:opacity-40 text-white p-2.5 rounded-lg"
          ><Send className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 space-y-1">
        <p className="font-medium text-slate-600">What to look for</p>
        <p>Different <span className="font-medium">numbers</span> (salary, loan amount, interest rate) for the same situation.</p>
        <p>Extra <span className="font-medium">conditions</span> for one person only — guarantor, more documents, “visit a branch”.</p>
        <p>Different <span className="font-medium">tone</span> — encouraging for one, cautious or discouraging for the other.</p>
        <p><span className="font-medium">Hidden reasons</span> — biased AI rarely says “because you are a woman”; it says “risk profile” or “practical considerations”.</p>
        <p className="pt-1">Real cases: Amazon’s AI recruiting tool downgraded women’s resumes (2018); iTutorGroup’s software auto-rejected older applicants (2023); lenders have been found charging minority neighbourhoods higher rates (“redlining”).</p>
      </div>
    </div>
  );
}
