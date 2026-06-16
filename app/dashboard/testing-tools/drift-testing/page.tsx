'use client';

import { useState, useEffect } from 'react';
import { Loader2, Play, Trash2, TrendingDown, TrendingUp, Minus, ChevronDown, ChevronUp, Search, Activity, History, ArrowRight } from 'lucide-react';
import { ToolLayout } from '../tool-layout';

/* ─── Types ─── */
interface QuestionResult {
  question: string;
  answer: string;
  score: number;
  reason: string;
}

interface RunRecord {
  id: string;
  label: string;
  runAt: string;
  avgScore: number;
  suiteId: string;
  results: QuestionResult[];
}

interface Investigation {
  freshAnswer: string;
  rephrasedAnswer: string;
  knowledgeCutoff: string;
  selfEval: string;
}

/* ─── Static test suites ─── */
const SUITES = [
  {
    id: 'playwright-basics',
    label: 'Playwright Basics',
    description: 'Core Playwright API knowledge — methods, assertions, and configuration.',
    systemContext: 'You are a Playwright testing assistant.',
    questions: [
      'How do I take a screenshot of a page in Playwright?',
      'What is the correct way to wait for an element to be visible in Playwright?',
      'How do I run Playwright tests in headless mode?',
      'What method do I use to fill in a text input in Playwright?',
      'How do I handle a browser dialog (alert) in Playwright?',
    ],
  },
  {
    id: 'api-testing',
    label: 'API Testing',
    description: 'REST API testing fundamentals — status codes, methods, and validation.',
    systemContext: 'You are a REST API testing expert.',
    questions: [
      'What HTTP status code is returned when a resource is successfully created?',
      'What is the difference between PUT and PATCH in REST APIs?',
      'How do you test an API endpoint that requires authentication?',
      'What does a 429 HTTP status code mean?',
      'What is the purpose of the Content-Type header in an API request?',
    ],
  },
  {
    id: 'general-qa',
    label: 'General QA Knowledge',
    description: 'Core QA concepts — testing types, methodologies, and best practices.',
    systemContext: 'You are a senior QA engineer.',
    questions: [
      'What is the difference between regression testing and smoke testing?',
      'What is boundary value analysis in software testing?',
      'What does SDLC stand for and what are its phases?',
      'What is the difference between a bug and a defect in QA?',
      'What is exploratory testing and when should you use it?',
    ],
  },
  {
    id: 'custom',
    label: 'Custom Suite',
    description: 'Write your own questions to build a reusable test suite for your specific AI use case.',
    systemContext: '',
    questions: [],
  },
];

const STORAGE_KEY = 'qodebench_drift_runs';

function loadRuns(): RunRecord[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'); }
  catch { return []; }
}

function saveRuns(runs: RunRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(runs));
}

function scoreColor(score: number) {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-amber-600';
  return 'text-red-600';
}

function scoreBg(score: number) {
  if (score >= 80) return 'bg-green-50 border-green-200';
  if (score >= 60) return 'bg-amber-50 border-amber-200';
  return 'bg-red-50 border-red-200';
}

function DriftIndicator({ current, previous }: { current: number; previous?: number }) {
  if (previous === undefined) return null;
  const delta = current - previous;
  if (Math.abs(delta) < 2) return <span className="flex items-center gap-1 text-slate-400 text-xs"><Minus className="w-3 h-3" /> Stable</span>;
  if (delta > 0) return <span className="flex items-center gap-1 text-green-600 text-xs"><TrendingUp className="w-3 h-3" /> +{delta.toFixed(0)}pts</span>;
  return <span className="flex items-center gap-1 text-red-500 text-xs font-medium"><TrendingDown className="w-3 h-3" /> {delta.toFixed(0)}pts drift</span>;
}

const TOOL_SCENARIOS = [
  'Quality Drift tab: pick a question suite and click "Run Eval" — the AI answers every question and each is auto-scored 0–100. Re-run later to see if scores drop.',
  'When drift is detected, click "Investigate" on any low-scoring question to run 4 diagnostic probes (fresh re-run, rephrased, knowledge check, self-eval).',
  'Knowledge Cutoff tab: ask time-sensitive questions (e.g. "Who is the US president?") to an old-dataset AI vs a new-dataset AI and watch the answers drift (Biden → Trump).',
  'Change the cutoff dates to see how far back the AI\'s knowledge has to be before a fact goes stale.',
  'Lesson: AI has no live information — it only knows its frozen training data, so facts can silently go out of date.',
];

/* ─── RCA Panel ─── */
function InvestigatePanel({
  question,
  oldAnswer,
  oldScore,
  systemContext,
}: {
  question: string;
  oldAnswer: string;
  oldScore: number;
  systemContext: string;
}) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Investigation | null>(null);
  const [rcaCause, setRcaCause] = useState('');

  const run = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/drift-testing/investigate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, oldAnswer, systemContext }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ freshAnswer: 'Failed.', rephrasedAnswer: 'Failed.', knowledgeCutoff: 'Failed.', selfEval: 'Failed.' });
    } finally {
      setLoading(false);
    }
  };

  const CAUSES = [
    { id: 'model', label: 'Model update', desc: 'Provider silently pushed a new model version — prompts behave differently' },
    { id: 'stale', label: 'Stale knowledge', desc: 'AI knowledge cutoff — facts have changed since training' },
    { id: 'sensitivity', label: 'Prompt sensitivity', desc: 'Small wording changes cause very different answers' },
    { id: 'degraded', label: 'Quality degraded', desc: 'Same prompt, genuinely worse answer — no obvious reason' },
  ];

  return (
    <div className="mt-3 border border-orange-200 bg-orange-50 rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-orange-200 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide">Root Cause Investigation</p>
          <p className="text-xs text-orange-600 mt-0.5">Old score: <span className="font-bold">{oldScore}/100</span> — Running 4 diagnostic probes to find why this drifted</p>
        </div>
        {!result && (
          <button
            onClick={run}
            disabled={loading}
            className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors"
          >
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
            {loading ? 'Investigating...' : 'Investigate'}
          </button>
        )}
      </div>

      {loading && (
        <div className="px-4 py-4 space-y-2">
          {['Re-running question fresh...', 'Testing with rephrased prompt...', 'Checking knowledge cutoff...', 'Self-evaluating old answer...'].map((step) => (
            <div key={step} className="flex items-center gap-2 text-xs text-orange-600">
              <Loader2 className="w-3 h-3 animate-spin shrink-0" /> {step}
            </div>
          ))}
        </div>
      )}

      {result && (
        <div className="divide-y divide-orange-200">

          {/* Probe 1: Fresh re-run */}
          <div className="px-4 py-3 space-y-2">
            <p className="text-xs font-semibold text-slate-700">Probe 1 — Fresh re-run (same question, right now)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="bg-white border border-slate-200 rounded-lg p-3">
                <p className="text-xs text-slate-400 mb-1">Old answer (scored {oldScore}/100)</p>
                <p className="text-xs text-slate-600 leading-relaxed">{oldAnswer}</p>
              </div>
              <div className="bg-white border border-sky-200 rounded-lg p-3">
                <p className="text-xs text-sky-600 mb-1">Fresh answer (just now)</p>
                <p className="text-xs text-slate-700 leading-relaxed">{result.freshAnswer}</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 italic">If these are very different → the model is behaving inconsistently or was updated.</p>
          </div>

          {/* Probe 2: Rephrased */}
          <div className="px-4 py-3 space-y-2">
            <p className="text-xs font-semibold text-slate-700">Probe 2 — Rephrased question (prompt sensitivity test)</p>
            <div className="bg-white border border-slate-200 rounded-lg p-3">
              <p className="text-xs text-slate-400 mb-1">Answer to: &quot;Can you explain: {question}&quot;</p>
              <p className="text-xs text-slate-700 leading-relaxed">{result.rephrasedAnswer}</p>
            </div>
            <p className="text-xs text-slate-500 italic">If this is much better/worse than the original → the AI is prompt-sensitive, which is a quality risk.</p>
          </div>

          {/* Probe 3: Knowledge cutoff */}
          <div className="px-4 py-3 space-y-2">
            <p className="text-xs font-semibold text-slate-700">Probe 3 — Knowledge freshness check</p>
            <div className="bg-white border border-slate-200 rounded-lg p-3">
              <p className="text-xs text-slate-700 leading-relaxed">{result.knowledgeCutoff}</p>
            </div>
            <p className="text-xs text-slate-500 italic">If the AI admits its knowledge may be outdated → the drift is likely world knowledge drift.</p>
          </div>

          {/* Probe 4: Self evaluation */}
          <div className="px-4 py-3 space-y-2">
            <p className="text-xs font-semibold text-slate-700">Probe 4 — AI self-evaluation of old answer</p>
            <div className="bg-white border border-slate-200 rounded-lg p-3">
              <p className="text-xs text-slate-700 leading-relaxed">{result.selfEval}</p>
            </div>
            <p className="text-xs text-slate-500 italic">What the AI itself thinks was wrong or missing in the old answer.</p>
          </div>

          {/* RCA conclusion */}
          <div className="px-4 py-3 space-y-2">
            <p className="text-xs font-semibold text-slate-700">Your root cause conclusion</p>
            <div className="grid grid-cols-2 gap-2">
              {CAUSES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setRcaCause(rcaCause === c.id ? '' : c.id)}
                  className={`text-left px-3 py-2 rounded-lg border text-xs transition-all ${
                    rcaCause === c.id
                      ? 'border-orange-400 bg-orange-100 text-orange-800'
                      : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700'
                  }`}
                >
                  <p className="font-medium">{c.label}</p>
                  <p className="text-xs opacity-70 mt-0.5">{c.desc}</p>
                </button>
              ))}
            </div>
            {rcaCause && (
              <div className="bg-white border border-orange-200 rounded-lg px-3 py-2 text-xs text-orange-800">
                <span className="font-semibold">Root cause tagged: </span>
                {CAUSES.find(c => c.id === rcaCause)?.label} — {CAUSES.find(c => c.id === rcaCause)?.desc}.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main page (tab shell) ─── */
export default function DriftTestingTool() {
  const [tab, setTab] = useState<'eval' | 'cutoff'>('eval');

  return (
    <ToolLayout
      title="Drift Testing"
      description="Track if AI response quality drifts over time — from silent model updates, prompt sensitivity, or an outdated training dataset that no longer reflects the real world."
      difficulty="Advanced"
      scenarios={TOOL_SCENARIOS}
    >
      {/* Tab switcher */}
      <div className="flex rounded-lg overflow-hidden border border-slate-200 w-fit mb-5">
        <button
          onClick={() => setTab('eval')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-r border-slate-200 ${
            tab === 'eval' ? 'bg-sky-50 text-sky-700' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Activity className="w-3.5 h-3.5" /> Quality Drift
        </button>
        <button
          onClick={() => setTab('cutoff')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
            tab === 'cutoff' ? 'bg-sky-50 text-sky-700' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <History className="w-3.5 h-3.5" /> Knowledge Cutoff
        </button>
      </div>

      {tab === 'eval' ? <DriftEvalTab /> : <KnowledgeCutoffTab />}
    </ToolLayout>
  );
}

/* ─── Quality Drift tab (the original eval flow) ─── */
function DriftEvalTab() {
  const [selectedSuiteId, setSelectedSuiteId] = useState(SUITES[0].id);
  const [runs, setRuns] = useState<RunRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedRun, setExpandedRun] = useState<string | null>(null);
  const [investigatingKey, setInvestigatingKey] = useState<string | null>(null);

  const [customContext, setCustomContext] = useState('');
  const [customQuestions, setCustomQuestions] = useState(['', '', '', '', '']);
  const [runLabel, setRunLabel] = useState('');

  useEffect(() => { setRuns(loadRuns()); }, []);

  const suite = SUITES.find((s) => s.id === selectedSuiteId)!;
  const isCustom = selectedSuiteId === 'custom';
  const activeQuestions = isCustom ? customQuestions.filter((q) => q.trim().length > 0) : suite.questions;
  const activeContext = isCustom ? customContext : suite.systemContext;

  const suiteRuns = runs
    .filter((r) => r.suiteId === selectedSuiteId)
    .sort((a, b) => new Date(b.runAt).getTime() - new Date(a.runAt).getTime());

  const runEval = async () => {
    if (activeQuestions.length === 0 || loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/drift-testing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions: activeQuestions, systemContext: activeContext }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const newRun: RunRecord = {
        id: crypto.randomUUID(),
        label: runLabel.trim() || `Run ${suiteRuns.length + 1}`,
        runAt: data.runAt,
        avgScore: data.avgScore,
        suiteId: selectedSuiteId,
        results: data.results,
      };
      const updated = [...runs, newRun];
      setRuns(updated);
      saveRuns(updated);
      setExpandedRun(newRun.id);
      setRunLabel('');
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const deleteRun = (id: string) => {
    const updated = runs.filter((r) => r.id !== id);
    setRuns(updated);
    saveRuns(updated);
    if (expandedRun === id) setExpandedRun(null);
  };

  const latestRun = suiteRuns[0];
  const previousRun = suiteRuns[1];
  const overallDrift = latestRun && previousRun ? latestRun.avgScore - previousRun.avgScore : null;
  const driftDetected = overallDrift !== null && overallDrift < -5;

  return (
    <div className="space-y-5">

        {/* Suite picker */}
        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">Question suite</p>
          <div className="flex flex-wrap gap-2">
            {SUITES.map((s) => (
              <button key={s.id}
                onClick={() => { setSelectedSuiteId(s.id); setExpandedRun(null); setInvestigatingKey(null); }}
                className={`text-xs px-3 py-1.5 rounded-md border transition-colors ${
                  selectedSuiteId === s.id ? 'border-sky-500 bg-sky-50 text-sky-700 font-medium' : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700'
                }`}
              >{s.label}</button>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-2">{suite.description}</p>
        </div>

        {/* Custom suite editor */}
        {isCustom && (
          <div className="space-y-3 border border-slate-200 rounded-lg p-4 bg-slate-50">
            <div>
              <p className="text-xs font-medium text-slate-600 mb-1">System context <span className="font-normal text-slate-400">(optional)</span></p>
              <input value={customContext} onChange={(e) => setCustomContext(e.target.value)}
                placeholder="e.g. You are a customer support chatbot for an e-commerce store."
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-sky-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-600 mb-2">Questions <span className="font-normal text-slate-400">(up to 8)</span></p>
              <div className="space-y-2">
                {customQuestions.map((q, i) => (
                  <input key={i} value={q}
                    onChange={(e) => { const u = [...customQuestions]; u[i] = e.target.value; setCustomQuestions(u); }}
                    placeholder={`Question ${i + 1}`}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-sky-400" />
                ))}
              </div>
              {customQuestions.length < 8 && (
                <button onClick={() => setCustomQuestions((q) => [...q, ''])}
                  className="mt-2 text-xs text-sky-600 hover:text-sky-700 font-medium">+ Add question</button>
              )}
            </div>
          </div>
        )}

        {/* Preview questions */}
        {!isCustom && (
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Questions in this suite</p>
            </div>
            <ol className="divide-y divide-slate-100">
              {suite.questions.map((q, i) => (
                <li key={i} className="px-4 py-2.5 text-sm text-slate-700 flex items-start gap-3">
                  <span className="text-xs text-slate-400 font-mono mt-0.5 shrink-0">Q{i + 1}</span>
                  {q}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Run controls */}
        <div className="flex flex-wrap items-center gap-3">
          <input value={runLabel} onChange={(e) => setRunLabel(e.target.value)}
            placeholder={`Run label (e.g. "Week 1", "After update")`}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-sky-400 w-56" />
          <button onClick={runEval} disabled={activeQuestions.length === 0 || loading}
            className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {loading ? `Scoring ${activeQuestions.length} questions...` : 'Run Eval'}
          </button>
        </div>

        {loading && (
          <div className="bg-sky-50 border border-sky-200 rounded-lg px-4 py-3 text-sm text-sky-700 flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            Sending {activeQuestions.length} questions and auto-scoring each response — takes 10–20 seconds.
          </div>
        )}

        {/* Score history */}
        {suiteRuns.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-700">Score history</p>
              <div className="flex items-center gap-3">
                {overallDrift !== null && (
                  <span className={`text-xs font-medium flex items-center gap-1 ${driftDetected ? 'text-red-600' : overallDrift > 5 ? 'text-green-600' : 'text-slate-400'}`}>
                    {driftDetected && <TrendingDown className="w-3.5 h-3.5" />}
                    {overallDrift > 5 && <TrendingUp className="w-3.5 h-3.5" />}
                    {driftDetected ? `Drift detected: ${overallDrift.toFixed(0)}pts drop` :
                     overallDrift > 5 ? `Improved: +${overallDrift.toFixed(0)}pts` : 'Stable'}
                  </span>
                )}
                {suiteRuns.length > 1 && (
                  <button onClick={() => { setRuns(runs.filter((r) => r.suiteId !== selectedSuiteId)); saveRuns(runs.filter((r) => r.suiteId !== selectedSuiteId)); setExpandedRun(null); }}
                    className="text-xs text-slate-400 hover:text-red-500 transition-colors">Clear all</button>
                )}
              </div>
            </div>

            {/* Drift alert */}
            {driftDetected && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700 flex items-start gap-2">
                <TrendingDown className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Drift detected — score dropped {Math.abs(overallDrift!).toFixed(0)} points since last run.</p>
                  <p className="text-xs mt-1 text-red-600">Expand the latest run below and click &quot;Investigate&quot; on any low-scoring question to find out why.</p>
                </div>
              </div>
            )}

            {/* Bar chart */}
            {suiteRuns.length >= 2 && (
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                <div className="flex items-end gap-2 h-20">
                  {[...suiteRuns].reverse().map((run) => (
                    <div key={run.id} className="flex flex-col items-center gap-1 flex-1 min-w-0">
                      <span className={`text-xs font-mono font-semibold ${scoreColor(run.avgScore)}`}>{run.avgScore}</span>
                      <div className={`w-full rounded-t transition-all ${run.avgScore >= 80 ? 'bg-green-400' : run.avgScore >= 60 ? 'bg-amber-400' : 'bg-red-400'}`}
                        style={{ height: `${(run.avgScore / 100) * 48}px`, minHeight: '4px' }} />
                      <span className="text-xs text-slate-400 truncate w-full text-center">{run.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Run list */}
            <div className="space-y-2">
              {suiteRuns.map((run, idx) => {
                const prevRun = suiteRuns[idx + 1];
                const isExpanded = expandedRun === run.id;
                const runDrifted = prevRun && (run.avgScore - prevRun.avgScore) < -5;

                return (
                  <div key={run.id} className={`border rounded-lg overflow-hidden ${scoreBg(run.avgScore)}`}>
                    <div className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`text-lg font-bold ${scoreColor(run.avgScore)}`}>{run.avgScore}</span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">{run.label}</p>
                          <p className="text-xs text-slate-400">{new Date(run.runAt).toLocaleString()} · {run.results.length} questions</p>
                        </div>
                        <DriftIndicator current={run.avgScore} previous={prevRun?.avgScore} />
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => setExpandedRun(isExpanded ? null : run.id)}
                          className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1 border border-current/20 px-2.5 py-1 rounded-md transition-colors">
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          {isExpanded ? 'Hide' : 'Details'}
                        </button>
                        <button onClick={() => deleteRun(run.id)} className="text-slate-400 hover:text-red-500 transition-colors p-1">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-current/10 divide-y divide-current/10">
                        {run.results.map((r, i) => {
                          const ikey = `${run.id}-${i}`;
                          const showInvestigate = investigatingKey === ikey;
                          const questionDrifted = r.score < 70;

                          return (
                            <div key={i} className="px-4 py-3 space-y-1.5">
                              <div className="flex items-start justify-between gap-3">
                                <p className="text-xs font-medium text-slate-600 flex-1">{r.question}</p>
                                <div className="flex items-center gap-2 shrink-0">
                                  {(runDrifted || questionDrifted) && (
                                    <button
                                      onClick={() => setInvestigatingKey(showInvestigate ? null : ikey)}
                                      className="flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700 border border-orange-300 hover:border-orange-400 bg-orange-50 px-2 py-0.5 rounded-md transition-colors font-medium"
                                    >
                                      <Search className="w-3 h-3" />
                                      {showInvestigate ? 'Close' : 'Investigate'}
                                    </button>
                                  )}
                                  <span className={`text-sm font-bold ${scoreColor(r.score)}`}>{r.score}/100</span>
                                </div>
                              </div>
                              <p className="text-sm text-slate-700 leading-relaxed">{r.answer}</p>
                              <p className="text-xs text-slate-400 italic">{r.reason}</p>

                              {showInvestigate && (
                                <InvestigatePanel
                                  question={r.question}
                                  oldAnswer={r.answer}
                                  oldScore={r.score}
                                  systemContext={activeContext}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {suiteRuns.length === 0 && !loading && (
          <div className="text-center py-10 border border-dashed border-slate-200 rounded-lg">
            <p className="text-sm text-slate-400 font-medium">No runs yet for this suite</p>
            <p className="text-xs text-slate-400 mt-1">Click &quot;Run Eval&quot; to take your first baseline score.</p>
          </div>
        )}
    </div>
  );
}

/* ─── Knowledge Cutoff tab ─── */
interface CutoffPair {
  question: string;
  oldAnswer: string;
  newAnswer: string;
  drifted: boolean;
}

const CUTOFF_PRESETS = [
  'Who is the current President of the United States?',
  'What is the latest iPhone model released by Apple?',
  'Who is the current CEO of Twitter (X)?',
  'What is the most recent Summer Olympics host city?',
  'What is the latest major version of React?',
  'Who won the most recent FIFA World Cup?',
];

const OLD_CUTOFFS = ['January 2022', 'September 2021', 'January 2023'];
const NEW_CUTOFFS = ['June 2025', 'January 2025', 'December 2024'];

function KnowledgeCutoffTab() {
  const [oldCutoff, setOldCutoff] = useState(OLD_CUTOFFS[0]);
  const [newCutoff, setNewCutoff] = useState(NEW_CUTOFFS[0]);
  const [questions, setQuestions] = useState<string[]>(CUTOFF_PRESETS);
  const [pairs, setPairs] = useState<CutoffPair[]>([]);
  const [meta, setMeta] = useState<{ oldCutoff: string; newCutoff: string; driftCount: number; total: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updateQuestion = (i: number, value: string) => {
    setQuestions((prev) => prev.map((q, idx) => (idx === i ? value : q)));
  };
  const addQuestion = () => setQuestions((prev) => [...prev, '']);
  const removeQuestion = (i: number) => setQuestions((prev) => prev.filter((_, idx) => idx !== i));

  const run = async () => {
    const valid = questions.filter((q) => q.trim());
    if (valid.length === 0 || loading) return;
    setLoading(true);
    setError('');
    setPairs([]);
    setMeta(null);
    try {
      const res = await fetch('/api/drift-testing/knowledge-cutoff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions: valid, oldCutoff, newCutoff }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Failed to run comparison.');
      } else {
        setPairs(data.pairs ?? []);
        setMeta({ oldCutoff: data.oldCutoff, newCutoff: data.newCutoff, driftCount: data.driftCount, total: data.total });
      }
    } catch {
      setError('Failed to reach the AI. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const canRun = questions.some((q) => q.trim());

  return (
    <div className="space-y-5">
      {/* Explainer */}
      <div className="bg-sky-50 border border-sky-200 rounded-lg px-4 py-3 text-sm text-sky-800">
        AI models don&apos;t know live information — they only know what was in their training dataset, frozen at a
        <span className="font-medium"> knowledge cutoff date</span>. Here we ask the same question to an AI with an
        <span className="font-medium"> old dataset</span> and one with a <span className="font-medium">newer dataset</span>.
        When the world has changed since the old cutoff, the answers drift apart — that&apos;s <span className="font-medium">knowledge drift</span>.
      </div>

      {/* Cutoff pickers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <p className="text-xs font-medium text-slate-600 mb-1.5">Old dataset cutoff</p>
          <div className="flex flex-wrap gap-2">
            {OLD_CUTOFFS.map((c) => (
              <button key={c} onClick={() => setOldCutoff(c)}
                className={`text-xs px-3 py-1.5 rounded-md border transition-colors ${
                  oldCutoff === c ? 'border-amber-400 bg-amber-50 text-amber-700 font-medium' : 'border-slate-200 text-slate-500 hover:border-slate-300'
                }`}>{c}</button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-600 mb-1.5">New dataset cutoff</p>
          <div className="flex flex-wrap gap-2">
            {NEW_CUTOFFS.map((c) => (
              <button key={c} onClick={() => setNewCutoff(c)}
                className={`text-xs px-3 py-1.5 rounded-md border transition-colors ${
                  newCutoff === c ? 'border-green-400 bg-green-50 text-green-700 font-medium' : 'border-slate-200 text-slate-500 hover:border-slate-300'
                }`}>{c}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Questions editor */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-medium text-slate-700">Time-sensitive questions <span className="text-slate-400 font-normal">({questions.length})</span></p>
          {questions.length < 10 && (
            <button onClick={addQuestion} className="text-xs text-sky-600 hover:text-sky-700 font-medium">+ Add question</button>
          )}
        </div>
        <p className="text-xs text-slate-400 mb-2">
          Use questions whose answer <span className="font-medium text-slate-500">changes over time</span> (e.g. &quot;Who is the US president?&quot;).
          Timeless questions like &quot;is Playwright good for testing?&quot; will correctly show &quot;Same&quot; — there&apos;s nothing to drift.
        </p>
        <div className="space-y-2">
          {questions.map((q, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono w-7 shrink-0">Q{i + 1}</span>
              <input value={q} onChange={(e) => updateQuestion(i, e.target.value)}
                placeholder="e.g. Who is the current President of the United States?"
                className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-sky-400" />
              <button onClick={() => removeQuestion(i)} className="text-slate-300 hover:text-red-500 transition-colors shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Run */}
      <div className="flex items-center gap-3">
        <button onClick={run} disabled={!canRun || loading}
          className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          {loading ? 'Comparing datasets...' : 'Compare Old vs New'}
        </button>
        {meta && !loading && (
          <span className={`text-sm font-medium flex items-center gap-1 ${meta.driftCount > 0 ? 'text-red-600' : 'text-slate-400'}`}>
            {meta.driftCount > 0 && <TrendingDown className="w-4 h-4" />}
            {meta.driftCount > 0 ? `${meta.driftCount} of ${meta.total} answers drifted` : 'No knowledge drift detected'}
          </span>
        )}
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      {loading && (
        <div className="bg-sky-50 border border-sky-200 rounded-lg px-4 py-3 text-sm text-sky-700 flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          Asking each question to the old-dataset AI and the new-dataset AI...
        </div>
      )}

      {/* Results */}
      {pairs.length > 0 && meta && (
        <div className="space-y-3 border-t border-slate-100 pt-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium uppercase tracking-wide">
            <div className="text-amber-600 flex items-center gap-1.5"><History className="w-3.5 h-3.5" /> Old dataset ({meta.oldCutoff})</div>
            <div className="text-green-600 flex items-center gap-1.5"><History className="w-3.5 h-3.5" /> New dataset ({meta.newCutoff})</div>
          </div>
          {meta.driftCount === 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-600">
              No drift here — these questions aren&apos;t time-sensitive, so both datasets agree. Try a fact that changed between {meta.oldCutoff} and {meta.newCutoff}, like &quot;Who is the US president?&quot; or &quot;What is the latest iPhone?&quot;
            </div>
          )}
          {pairs.map((p, i) => (
            <div key={i} className={`border rounded-lg overflow-hidden ${p.drifted ? 'border-red-200' : 'border-slate-200'}`}>
              <div className={`px-4 py-2 flex items-center justify-between gap-3 border-b ${p.drifted ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                <p className="text-sm font-medium text-slate-800">{p.question}</p>
                {p.drifted ? (
                  <span className="shrink-0 flex items-center gap-1 text-xs font-semibold text-red-600">
                    <ArrowRight className="w-3.5 h-3.5" /> Knowledge drift
                  </span>
                ) : (
                  <span className="shrink-0 flex items-center gap-1 text-xs font-medium text-slate-400">
                    <Minus className="w-3.5 h-3.5" /> Same
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                <div className="px-4 py-3 bg-amber-50/40">
                  <p className="text-xs text-amber-600 mb-1 font-medium">Old dataset says</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{p.oldAnswer}</p>
                </div>
                <div className="px-4 py-3 bg-green-50/40">
                  <p className="text-xs text-green-600 mb-1 font-medium">New dataset says</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{p.newAnswer}</p>
                </div>
              </div>
            </div>
          ))}
          <p className="text-xs text-slate-400 italic pt-1">
            Lesson: an AI is only as fresh as its training data. If your app relies on facts that change over time,
            the same prompt can silently go stale — that&apos;s why drift testing matters.
          </p>
        </div>
      )}

      {pairs.length === 0 && !loading && (
        <div className="text-center py-10 border border-dashed border-slate-200 rounded-lg">
          <p className="text-sm text-slate-400 font-medium">No comparison run yet</p>
          <p className="text-xs text-slate-400 mt-1">Pick two cutoff dates and click &quot;Compare Old vs New&quot;.</p>
        </div>
      )}
    </div>
  );
}
