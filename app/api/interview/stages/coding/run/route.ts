import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyInterviewAPIAccess } from '@/lib/utils/api-access-checks';

interface TestCase {
  input: any;
  expected_output: any;
  is_hidden: boolean;
}

interface TestResult {
  passed: boolean;
  input: any;
  expected: any;
  actual: any;
  error?: string;
  isHidden: boolean;
}

// Safe code execution with timeout
function executeCode(code: string, input: any, timeout = 5000): Promise<any> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('Execution timeout'));
    }, timeout);

    try {
      // Create a safe execution context
      const wrappedCode = `
        'use strict';
        ${code}

        // Find the main function (usually the first function defined)
        const functionMatch = ${JSON.stringify(code)}.match(/function\\s+(\\w+)/);
        const funcName = functionMatch ? functionMatch[1] : null;

        if (funcName && typeof eval(funcName) === 'function') {
          return eval(funcName)(${JSON.stringify(input)});
        }

        throw new Error('No valid function found in code');
      `;

      const func = new Function(wrappedCode);
      const result = func();

      clearTimeout(timeoutId);
      resolve(result);
    } catch (error) {
      clearTimeout(timeoutId);
      reject(error);
    }
  });
}

// Deep equality check for test results
function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((val, idx) => deepEqual(val, b[idx]));
  }

  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    return keysA.every(key => deepEqual(a[key], b[key]));
  }

  return false;
}

export async function POST(request: NextRequest) {
  try {
    // SECURITY CHECK: Verify user has access to interview prep
    const { user, error: accessError } = await verifyInterviewAPIAccess();
    if (accessError) return accessError;

    const supabase = await createClient();

    const body = await request.json();
    const { sessionId, challengeId, code, language } = body;

    if (!sessionId || !challengeId || !code) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify session
    const { data: session, error: sessionError } = await supabase
      .from('interview_sessions')
      .select('id, user_id')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Fetch challenge with test cases
    const { data: challenge, error: challengeError } = await supabase
      .from('interview_coding_challenges')
      .select('test_cases')
      .eq('id', challengeId)
      .single();

    if (challengeError || !challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      );
    }

    const testCases = challenge.test_cases as TestCase[];
    const results: TestResult[] = [];
    const consoleOutput: string[] = [];

    // Only run visible test cases for the "Run Tests" button
    const visibleTestCases = testCases.filter(tc => !tc.is_hidden);

    for (const testCase of visibleTestCases) {
      try {
        const actual = await executeCode(code, testCase.input);
        const passed = deepEqual(actual, testCase.expected_output);

        results.push({
          passed,
          input: testCase.input,
          expected: testCase.expected_output,
          actual,
          isHidden: false,
        });

        consoleOutput.push(
          `Test ${results.length}: ${passed ? 'PASSED' : 'FAILED'}`
        );
      } catch (error: any) {
        results.push({
          passed: false,
          input: testCase.input,
          expected: testCase.expected_output,
          actual: null,
          error: error.message || 'Execution error',
          isHidden: false,
        });

        consoleOutput.push(
          `Test ${results.length}: ERROR - ${error.message || 'Unknown error'}`
        );
      }
    }

    return NextResponse.json({ results, consoleOutput });
  } catch (error) {
    console.error('Error running tests:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
