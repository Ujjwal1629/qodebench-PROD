'use client';

import { useState } from 'react';
import { ToolLayout } from '../tool-layout';
import { PythonRunner } from '@/components/testing-tools/python-runner';
import { cn } from '@/lib/utils';

// Two modes, matching the two things sessions 9 and 10 ask for: run a script,
// and run a pytest suite. Everything executes in the browser via Pyodide.

const STARTER_SCRIPT = `# Play with the basics.
name = "Hemant"
models = ["gpt-4o", "gpt-4o-mini"]

print(name)
print(models)
print("How many models?", len(models))

# A dict is how eval tools shape their test data.
case = {"question": "How many sick leaves?", "expected": "12"}
print(case["expected"])
`;

const STARTER_TESTS = `# Three tests: a number, some text, and a length.
# pytest finds any function whose name starts with test_

def test_maths():
    assert 2 + 2 == 4

def test_text_appears():
    answer = "You get 12 leaves per year"
    assert "12" in answer

def test_list_length():
    models = ["gpt-4o", "gpt-4o-mini"]
    assert len(models) == 2


# Now try this: change 4 to 5 above and run again.
# Read what pytest tells you — it shows what it got AND what it expected.
`;

const STARTER_SUITE = `# The shape every eval tool uses underneath: a list of dicts.

CASES = [
    {"question": "How many sick leaves?", "expected": "12"},
    {"question": "What is the notice period?", "expected": "60"},
    {"question": "How many WFH days?", "expected": "2"},
]


def get_answer(question):
    """A stub: returns a fixed answer so we can test the loop itself.
    Swap this for a real model call once the plumbing is proven."""
    lookup = {
        "How many sick leaves?": "You get 12 sick leaves per year.",
        "What is the notice period?": "The notice period is 60 days.",
        "How many WFH days?": "You can work from home 2 days a week.",
    }
    return lookup.get(question, "I don't know.")


def test_all_cases():
    for case in CASES:
        answer = get_answer(case["question"])
        assert case["expected"] in answer, f"Failed on: {case['question']}"
`;

type Mode = 'script' | 'tests' | 'suite';

const MODES: { id: Mode; label: string; hint: string; code: string; pytest: boolean }[] = [
  {
    id: 'script',
    label: 'Play with the basics',
    hint: 'Variables, lists, print. Just get comfortable.',
    code: STARTER_SCRIPT,
    pytest: false,
  },
  {
    id: 'tests',
    label: 'Write 3 test functions',
    hint: 'Three asserts, run with pytest. Then break one on purpose.',
    code: STARTER_TESTS,
    pytest: true,
  },
  {
    id: 'suite',
    label: 'Loop over test data',
    hint: 'A list of dicts plus a stub, the shape DeepEval builds on.',
    code: STARTER_SUITE,
    pytest: true,
  },
];

export default function PythonPlaygroundPage() {
  const [mode, setMode] = useState<Mode>('script');
  const active = MODES.find((m) => m.id === mode)!;

  return (
    <ToolLayout
      title="Python Playground"
      description="Write Python and run it right here, with pytest. Nothing to install, no virtual environment to set up — it runs in your browser."
      difficulty="Beginner"
      scenarios={[
        'Make a variable and a list, print them, and get comfortable with the syntax.',
        'Write three test functions with assert, then run pytest and read the report.',
        'Break a test on purpose and see what pytest tells you about the failure.',
        'Loop over a list of dicts, which is the shape every eval tool uses underneath.',
      ]}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={cn(
                'rounded-lg border px-3.5 py-2 text-[0.8125rem] font-medium transition-colors',
                mode === m.id
                  ? 'border-brand-500 bg-brand-50 text-brand-700'
                  : 'border-slate-200 text-slate-700 hover:border-brand-300 hover:bg-brand-50/40'
              )}
            >
              {m.label}
            </button>
          ))}
        </div>

        <p className="text-[0.8125rem] text-slate-600">{active.hint}</p>

        <PythonRunner key={mode} initialCode={active.code} pytest={active.pytest} />
      </div>
    </ToolLayout>
  );
}
