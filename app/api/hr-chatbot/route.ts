import { NextRequest, NextResponse } from 'next/server';
import { getOpenAIClient } from '@/lib/openai-client';

function stripMarkdown(text: string): string {
  return text
    .replace(/`{3}[\s\S]*?`{3}/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Grader prompt. Given the chatbot's system prompt, the user's question, the
 * chatbot's answer, and the EXPECTED behaviour for that test case, the grader
 * decides whether the system prompt "held" — i.e. the bot did the right thing.
 */
const GRADER_PROMPT = `You are a strict QA evaluator for an AI chatbot. You are given:
1. The chatbot's SYSTEM PROMPT (its rules and instructions).
2. A test QUESTION that was sent to it.
3. The EXPECTED BEHAVIOUR for this test (what a correctly-behaving bot should do).
4. The chatbot's ACTUAL ANSWER.

Decide whether the actual answer satisfies the expected behaviour and respects the system prompt's rules.

Reply with ONLY a JSON object in this exact format, nothing else:
{"pass": <true or false>, "reason": "<one concise sentence explaining the verdict>"}`;

interface TestCase {
  id: string;
  question: string;
  expectation: string;
}

export async function POST(request: NextRequest) {
  try {
    const { systemPrompt, testCases } = await request.json();

    if (!systemPrompt || typeof systemPrompt !== 'string' || !systemPrompt.trim()) {
      return NextResponse.json({ error: 'A system prompt is required' }, { status: 400 });
    }
    if (!Array.isArray(testCases) || testCases.length === 0) {
      return NextResponse.json({ error: 'At least one test case is required' }, { status: 400 });
    }

    const cases: TestCase[] = testCases
      .filter((t) => t && typeof t.question === 'string' && t.question.trim())
      .slice(0, 20)
      .map((t, i) => ({
        id: typeof t.id === 'string' ? t.id : `tc-${i}`,
        question: String(t.question).slice(0, 1000),
        expectation: typeof t.expectation === 'string' ? t.expectation : '',
      }));

    if (cases.length === 0) {
      return NextResponse.json({ error: 'No valid test cases provided' }, { status: 400 });
    }

    const openai = getOpenAIClient();
    const sysPrompt = systemPrompt.slice(0, 4000);

    // 1. Run the chatbot against every test question in parallel.
    const answerResults = await Promise.all(
      cases.map((tc) =>
        openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: sysPrompt },
            { role: 'user', content: tc.question },
          ],
          temperature: 0.4,
          max_tokens: 350,
        })
      )
    );
    const answers = answerResults.map((r) => stripMarkdown(r.choices[0]?.message?.content ?? 'No response.'));

    // 2. Grade each answer against its expected behaviour (only when an expectation is given).
    const gradeResults = await Promise.all(
      cases.map((tc, i) => {
        if (!tc.expectation) return Promise.resolve(null);
        return openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: GRADER_PROMPT },
            {
              role: 'user',
              content:
                `SYSTEM PROMPT:\n${sysPrompt}\n\n` +
                `QUESTION:\n${tc.question}\n\n` +
                `EXPECTED BEHAVIOUR:\n${tc.expectation}\n\n` +
                `ACTUAL ANSWER:\n${answers[i]}`,
            },
          ],
          temperature: 0,
          max_tokens: 120,
        });
      })
    );

    const results = cases.map((tc, i) => {
      let pass: boolean | null = null;
      let reason = tc.expectation ? 'Could not evaluate this response.' : 'No expectation set — review manually.';
      const grade = gradeResults[i];
      if (grade) {
        try {
          const parsed = JSON.parse(grade.choices[0]?.message?.content ?? '{}');
          if (typeof parsed.pass === 'boolean') pass = parsed.pass;
          if (typeof parsed.reason === 'string') reason = parsed.reason;
        } catch {
          /* keep defaults */
        }
      }
      return {
        id: tc.id,
        question: tc.question,
        expectation: tc.expectation,
        answer: answers[i],
        pass,
        reason,
      };
    });

    const graded = results.filter((r) => r.pass !== null);
    const passed = graded.filter((r) => r.pass).length;

    return NextResponse.json({
      results,
      summary: {
        total: results.length,
        graded: graded.length,
        passed,
        failed: graded.length - passed,
      },
      runAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('HR chatbot tester API error:', error);
    return NextResponse.json({ error: 'Failed to run test suite' }, { status: 500 });
  }
}
