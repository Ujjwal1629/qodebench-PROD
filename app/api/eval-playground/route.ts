import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getOpenAIClient } from '@/lib/openai-client';

// Eval Playground: run a PromptFoo-style config in the browser.
//
// The learner writes prompts + tests (vars & assertions), we call the model once
// per prompt/test pair and evaluate the assertions IN CODE — no AI judge, so a
// run costs exactly the completions it makes and grading is deterministic.

export const dynamic = 'force-dynamic';

const MAX_PROMPTS = 3;
const MAX_TESTS = 6;

type Assertion =
  | { type: 'contains' | 'icontains' | 'not-contains' | 'not-icontains' | 'equals'; value: string }
  | { type: 'is-json' }
  | { type: 'max-length'; value: string };

interface TestCase {
  vars: Record<string, string>;
  assert: Assertion[];
}

export interface AssertionResult {
  type: string;
  value?: string;
  pass: boolean;
  reason: string;
}

// Evaluate one assertion against the model's output. Pure function, no AI.
function runAssertion(a: Assertion, output: string): AssertionResult {
  const out = output ?? '';
  switch (a.type) {
    case 'contains': {
      const pass = out.includes(a.value);
      return { type: a.type, value: a.value, pass, reason: pass ? 'found' : `"${a.value}" not in output` };
    }
    case 'icontains': {
      const pass = out.toLowerCase().includes(a.value.toLowerCase());
      return { type: a.type, value: a.value, pass, reason: pass ? 'found (case-insensitive)' : `"${a.value}" not in output` };
    }
    case 'not-contains': {
      const pass = !out.includes(a.value);
      return { type: a.type, value: a.value, pass, reason: pass ? 'correctly absent' : `"${a.value}" should NOT appear` };
    }
    case 'not-icontains': {
      const pass = !out.toLowerCase().includes(a.value.toLowerCase());
      return { type: a.type, value: a.value, pass, reason: pass ? 'correctly absent' : `"${a.value}" should NOT appear` };
    }
    case 'equals': {
      const pass = out.trim() === a.value.trim();
      return { type: a.type, value: a.value, pass, reason: pass ? 'exact match' : 'output differs from expected' };
    }
    case 'is-json': {
      try {
        JSON.parse(out.trim());
        return { type: a.type, pass: true, reason: 'parsed as JSON' };
      } catch {
        return { type: a.type, pass: false, reason: 'not valid JSON (fences or prose around it?)' };
      }
    }
    case 'max-length': {
      const limit = parseInt(a.value, 10);
      const pass = out.length <= limit;
      return { type: a.type, value: a.value, pass, reason: pass ? `${out.length} <= ${limit}` : `${out.length} chars, over ${limit}` };
    }
    default:
      return { type: (a as Assertion).type, pass: false, reason: 'unknown assertion type' };
  }
}

// Substitute {{var}} placeholders in a prompt template.
function render(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_m, k) => vars[k] ?? '');
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  let body: { prompts?: string[]; tests?: TestCase[]; model?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const prompts = (body.prompts ?? []).filter((p) => p?.trim()).slice(0, MAX_PROMPTS);
  const tests = (body.tests ?? []).slice(0, MAX_TESTS);
  const model = body.model === 'gpt-4o' ? 'gpt-4o' : 'gpt-4o-mini';

  if (!prompts.length) return NextResponse.json({ error: 'Add at least one prompt' }, { status: 400 });
  if (!tests.length) return NextResponse.json({ error: 'Add at least one test' }, { status: 400 });

  const openai = getOpenAIClient();
  const rows = [];
  let passed = 0;

  for (let pi = 0; pi < prompts.length; pi++) {
    for (let ti = 0; ti < tests.length; ti++) {
      const test = tests[ti];
      const rendered = render(prompts[pi], test.vars ?? {});
      let output = '';
      let error: string | null = null;

      try {
        const res = await openai.chat.completions.create({
          model,
          messages: [{ role: 'user', content: rendered }],
          temperature: 0, // deterministic, so a failure means the prompt changed
          max_tokens: 400,
        });
        output = res.choices[0]?.message?.content ?? '';
      } catch (e) {
        error = e instanceof Error ? e.message : 'model call failed';
      }

      const assertions = error
        ? [{ type: 'error', pass: false, reason: error }]
        : (test.assert ?? []).map((a) => runAssertion(a, output));
      const pass = assertions.length > 0 && assertions.every((a) => a.pass);
      if (pass) passed++;

      rows.push({
        promptIndex: pi,
        testIndex: ti,
        vars: test.vars ?? {},
        output,
        assertions,
        pass,
      });
    }
  }

  return NextResponse.json({
    rows,
    total: rows.length,
    passed,
    passRate: rows.length ? Math.round((passed / rows.length) * 100) : 0,
    model,
  });
}
