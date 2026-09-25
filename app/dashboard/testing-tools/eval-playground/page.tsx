'use client';

import { useState } from 'react';
import { Loader2, Play, RotateCcw, Plus, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { ToolLayout } from '../tool-layout';
import { getCSRFHeaders } from '@/lib/utils/csrf-client';

/* ─── Types ─── */
type AssertType =
  | 'icontains'
  | 'contains'
  | 'not-icontains'
  | 'is-json'
  | 'max-length';

interface Assertion {
  id: string;
  type: AssertType;
  value: string;
}

interface TestCase {
  id: string;
  question: string;
  assertions: Assertion[];
}

interface AssertionResult {
  type: string;
  value?: string;
  pass: boolean;
  reason: string;
}

interface ResultRow {
  promptIndex: number;
  testIndex: number;
  vars: Record<string, string>;
  output: string;
  assertions: AssertionResult[];
  pass: boolean;
}

const uid = () => Math.random().toString(36).slice(2, 9);

/* ─── Defaults: a working config the learner can run immediately ─── */
const DEFAULT_PROMPT =
  'You are a support agent for an online store. Answer the customer question in 2 sentences.\n\nQuestion: {{question}}';

const DEFAULT_TESTS: TestCase[] = [
  {
    id: uid(),
    question: 'What is your return policy?',
    assertions: [
      { id: uid(), type: 'icontains', value: 'return' },
      { id: uid(), type: 'icontains', value: 'days' },
    ],
  },
  {
    id: uid(),
    question: 'Do you offer a VIP Diamond membership?',
    assertions: [{ id: uid(), type: 'not-icontains', value: 'VIP Diamond' }],
  },
];

const ASSERT_LABELS: Record<AssertType, string> = {
  icontains: 'contains (ignore case)',
  contains: 'contains (exact case)',
  'not-icontains': 'must NOT contain',
  'is-json': 'output is valid JSON',
  'max-length': 'max length (chars)',
};

export default function EvalPlaygroundPage() {
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [tests, setTests] = useState<TestCase[]>(DEFAULT_TESTS);
  const [model, setModel] = useState<'gpt-4o-mini' | 'gpt-4o'>('gpt-4o-mini');
  const [rows, setRows] = useState<ResultRow[] | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTest = () =>
    setTests((t) => [
      ...t,
      { id: uid(), question: '', assertions: [{ id: uid(), type: 'icontains', value: '' }] },
    ]);

  const removeTest = (id: string) => setTests((t) => t.filter((x) => x.id !== id));

  const setQuestion = (id: string, question: string) =>
    setTests((t) => t.map((x) => (x.id === id ? { ...x, question } : x)));

  const addAssertion = (testId: string) =>
    setTests((t) =>
      t.map((x) =>
        x.id === testId
          ? { ...x, assertions: [...x.assertions, { id: uid(), type: 'icontains', value: '' }] }
          : x
      )
    );

  const removeAssertion = (testId: string, aId: string) =>
    setTests((t) =>
      t.map((x) =>
        x.id === testId ? { ...x, assertions: x.assertions.filter((a) => a.id !== aId) } : x
      )
    );

  const setAssertion = (testId: string, aId: string, patch: Partial<Assertion>) =>
    setTests((t) =>
      t.map((x) =>
        x.id === testId
          ? { ...x, assertions: x.assertions.map((a) => (a.id === aId ? { ...a, ...patch } : a)) }
          : x
      )
    );

  const run = async () => {
    setRunning(true);
    setError(null);
    setRows(null);
    try {
      const res = await fetch('/api/eval-playground', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getCSRFHeaders() },
        body: JSON.stringify({
          prompts: [prompt],
          model,
          tests: tests
            .filter((t) => t.question.trim())
            .map((t) => ({
              vars: { question: t.question },
              assert: t.assertions
                .filter((a) => a.type === 'is-json' || a.value.trim())
                .map((a) => ({ type: a.type, value: a.value })),
            })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? 'Run failed');
        return;
      }
      setRows(data.rows);
    } catch {
      setError('Could not reach the server');
    } finally {
      setRunning(false);
    }
  };

  const reset = () => {
    setRows(null);
    setError(null);
  };

  const passed = rows?.filter((r) => r.pass).length ?? 0;
  const total = rows?.length ?? 0;
  const passRate = total ? Math.round((passed / total) * 100) : 0;

  return (
    <ToolLayout
      title="Eval Playground"
      description="Write a prompt, add test cases with assertions, and run a real eval. Same model as PromptFoo, same idea, no install needed."
      difficulty="Intermediate"
      scenarios={[
        'Write two icontains assertions so an answer must mention both "return" and "days".',
        'Set a trap: assert the bot does NOT confirm a product tier that does not exist.',
        'Ask for JSON and add an "output is valid JSON" assertion. Run it a few times.',
        'Run the same tests on gpt-4o-mini and gpt-4o, and compare the pass rates.',
      ]}
    >
      <div className="space-y-5">
        {/* Prompt */}
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[0.8125rem] font-semibold text-slate-800">
              Prompt template
            </label>
            <span className="text-[0.75rem] text-slate-500">
              Use <code className="bg-slate-100 px-1 rounded">{'{{question}}'}</code> where the test value goes
            </span>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-slate-200 p-3 font-mono text-[0.8125rem] focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Tests */}
        <div className="space-y-3">
          {tests.map((t, ti) => (
            <div key={t.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-start gap-2 mb-3">
                <span className="font-mono text-[0.75rem] text-slate-400 mt-2">{ti + 1}.</span>
                <input
                  value={t.question}
                  onChange={(e) => setQuestion(t.id, e.target.value)}
                  placeholder="The question to send"
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-[0.875rem] focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button
                  onClick={() => removeTest(t.id)}
                  className="p-2 text-slate-400 hover:text-red-600"
                  aria-label="Remove test"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="pl-6 space-y-2">
                {t.assertions.map((a) => (
                  <div key={a.id} className="flex items-center gap-2">
                    <select
                      value={a.type}
                      onChange={(e) => setAssertion(t.id, a.id, { type: e.target.value as AssertType })}
                      className="rounded-md border border-slate-200 px-2 py-1.5 text-[0.75rem] bg-white"
                    >
                      {Object.entries(ASSERT_LABELS).map(([v, label]) => (
                        <option key={v} value={v}>
                          {label}
                        </option>
                      ))}
                    </select>
                    {a.type !== 'is-json' && (
                      <input
                        value={a.value}
                        onChange={(e) => setAssertion(t.id, a.id, { value: e.target.value })}
                        placeholder={a.type === 'max-length' ? 'e.g. 300' : 'expected text'}
                        className="flex-1 rounded-md border border-slate-200 px-2 py-1.5 text-[0.75rem] font-mono"
                      />
                    )}
                    <button
                      onClick={() => removeAssertion(t.id, a.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600"
                      aria-label="Remove assertion"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addAssertion(t.id)}
                  className="inline-flex items-center gap-1 text-[0.75rem] font-medium text-brand-600 hover:text-brand-700"
                >
                  <Plus className="h-3.5 w-3.5" /> Add assertion
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={addTest}
            className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-4 py-2 text-[0.8125rem] font-medium text-slate-600 hover:bg-slate-50"
          >
            <Plus className="h-4 w-4" /> Add test case
          </button>
        </div>

        {/* Run bar */}
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3">
          <select
            value={model}
            onChange={(e) => setModel(e.target.value as 'gpt-4o-mini' | 'gpt-4o')}
            className="rounded-md border border-slate-200 px-3 py-1.5 text-[0.8125rem] bg-white"
          >
            <option value="gpt-4o-mini">gpt-4o-mini (cheaper)</option>
            <option value="gpt-4o">gpt-4o (stronger)</option>
          </select>
          <button
            onClick={run}
            disabled={running}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2 text-[0.8438rem] font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            {running ? 'Running...' : 'Run eval'}
          </button>
          {rows && (
            <>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[0.7812rem] font-semibold ${
                  passRate >= 70 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}
              >
                {passed}/{total} passed | {passRate}%
              </span>
              <button
                onClick={reset}
                className="inline-flex items-center gap-1.5 text-[0.7812rem] font-medium text-brand-600 hover:text-brand-700"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Clear
              </button>
            </>
          )}
          <span className="ml-auto text-[0.75rem] text-slate-500">
            Runs at temperature 0, so a failure means your prompt changed, not the dice.
          </span>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[0.8125rem] text-red-700">
            {error}
          </div>
        )}

        {/* Results */}
        {rows && (
          <div className="space-y-3">
            {rows.map((r, i) => (
              <div
                key={i}
                className={`rounded-xl border p-4 ${
                  r.pass ? 'border-emerald-200 bg-emerald-50/40' : 'border-red-200 bg-red-50/30'
                }`}
              >
                <div className="flex items-start gap-2">
                  {r.pass ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.8125rem] font-semibold text-slate-800">
                      {r.vars.question}
                    </p>
                    <p className="mt-1.5 text-[0.8125rem] text-slate-700 whitespace-pre-wrap">
                      {r.output || '(empty response)'}
                    </p>
                    <div className="mt-2.5 space-y-1">
                      {r.assertions.map((a, ai) => (
                        <div key={ai} className="flex items-center gap-1.5 text-[0.75rem]">
                          {a.pass ? (
                            <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                          ) : (
                            <XCircle className="h-3 w-3 text-red-600 shrink-0" />
                          )}
                          <code className="bg-white/70 px-1.5 py-0.5 rounded border border-slate-200">
                            {a.type}
                            {a.value ? `: ${a.value}` : ''}
                          </code>
                          <span className="text-slate-500">{a.reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
