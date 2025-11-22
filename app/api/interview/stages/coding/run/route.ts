import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyInterviewAPIAccess } from '@/lib/utils/api-access-checks';
import {
  sandboxExecuteAsync,
  getDetectedFunctionName,
} from '@/lib/utils/sandbox-executor';

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
  executionTime?: number;
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

    // Detect function name once for all test cases
    const detectedFunction = getDetectedFunctionName(code);

    if (!detectedFunction) {
      return NextResponse.json({
        results: [],
        consoleOutput: [
          'ERROR: Could not find a function in your code.',
          'Please define a function named "solution" or any named function.',
        ],
        error:
          'No function found in code. Please define a function named "solution" or any named function.',
      });
    }

    // Only run visible test cases for the "Run Tests" button
    const visibleTestCases = testCases.filter(tc => !tc.is_hidden);

    for (const testCase of visibleTestCases) {
      // Prepare arguments - handle both array and single value inputs
      const args = Array.isArray(testCase.input)
        ? testCase.input
        : [testCase.input];

      // Execute using sandbox with async timeout support
      const execution = await sandboxExecuteAsync(code, args, {
        timeout: 5000,
        functionName: detectedFunction,
      });

      if (!execution.success) {
        results.push({
          passed: false,
          input: testCase.input,
          expected: testCase.expected_output,
          actual: null,
          error: execution.error,
          isHidden: false,
          executionTime: execution.executionTime,
        });

        consoleOutput.push(
          `Test ${results.length}: ERROR - ${execution.error || 'Unknown error'}`
        );
      } else {
        const passed = deepEqual(execution.result, testCase.expected_output);

        results.push({
          passed,
          input: testCase.input,
          expected: testCase.expected_output,
          actual: execution.result,
          isHidden: false,
          executionTime: execution.executionTime,
        });

        consoleOutput.push(
          `Test ${results.length}: ${passed ? 'PASSED' : 'FAILED'}${
            execution.executionTime ? ` (${execution.executionTime}ms)` : ''
          }`
        );
      }
    }

    return NextResponse.json({
      results,
      consoleOutput,
      detectedFunction,
    });
  } catch (error) {
    console.error('Error running tests:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
