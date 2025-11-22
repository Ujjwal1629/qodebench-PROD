/**
 * Test Runner for Challenge Validation
 *
 * Executes user code against test cases using a sandboxed environment
 * Returns detailed results for each test case
 *
 * Features:
 * - Supports modern JavaScript (const, let, arrow functions, classes)
 * - Auto-detects solution function
 * - Timeout protection
 * - Secure sandboxed execution
 */

import {
  sandboxExecute,
  getDetectedFunctionName,
  type SandboxOptions,
} from './sandbox-executor';

export type TestCase = {
  input: any; // Can be array of args or object with named params
  expected: any;
  description?: string; // Optional - will auto-generate if missing
};

export type TestResult = {
  passed: boolean;
  input: any;
  expected: any;
  actual: any;
  description: string;
  error?: string;
  executionTime?: number;
};

export type ValidationResult = {
  passed: boolean; // All tests passed
  score: number; // 0-100
  totalTests: number;
  passedTests: number;
  failedTests: number;
  results: TestResult[];
  pointsEarned: number;
  detectedFunction?: string; // The function name that was detected and executed
};

/**
 * Deep equality check for comparing test results
 */
function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;

  if (a === null || b === null) return a === b;
  if (a === undefined || b === undefined) return a === b;

  if (typeof a !== typeof b) return false;

  // Handle arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((val, idx) => deepEqual(val, b[idx]));
  }

  // Handle objects
  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a).sort();
    const keysB = Object.keys(b).sort();

    if (keysA.length !== keysB.length) return false;
    if (!keysA.every((key, idx) => key === keysB[idx])) return false;

    return keysA.every(key => deepEqual(a[key], b[key]));
  }

  return false;
}

/**
 * Execute user code against test cases
 *
 * This function now uses the sandbox executor which supports:
 * - Top-level const, let, var declarations
 * - Arrow functions and function expressions
 * - Multiple helper functions
 * - Classes and objects
 * - Modern JavaScript syntax
 *
 * @param userCode - The user's JavaScript/TypeScript code
 * @param testCases - Array of test cases with input and expected output
 * @param maxPoints - Maximum points for this challenge (default: 50)
 * @param options - Optional sandbox configuration
 */
export function runTestCases(
  userCode: string,
  testCases: TestCase[],
  maxPoints: number = 50,
  options: SandboxOptions = {}
): ValidationResult {
  const results: TestResult[] = [];
  let passedCount = 0;

  // Detect the function name once (for efficiency and consistency)
  const detectedFunction = getDetectedFunctionName(userCode);

  if (!detectedFunction) {
    // No function found - return early with all failures
    return {
      passed: false,
      score: 0,
      totalTests: testCases.length,
      passedTests: 0,
      failedTests: testCases.length,
      results: testCases.map((testCase, i) => ({
        passed: false,
        input: testCase.input,
        expected: testCase.expected,
        actual: null,
        description: testCase.description || `Test case ${i + 1}`,
        error:
          'Could not find a function in your code. Please define a function named "solution" or any named function.',
      })),
      pointsEarned: 0,
    };
  }

  // Use detected function name in options
  const execOptions: SandboxOptions = {
    ...options,
    functionName: detectedFunction,
    timeout: options.timeout || 5000,
  };

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    // Generate description if missing
    const description = testCase.description || `Test case ${i + 1}`;

    try {
      // Prepare arguments - handle both array and single value inputs
      const args = Array.isArray(testCase.input)
        ? testCase.input
        : [testCase.input];

      // Execute using sandbox
      const execution = sandboxExecute(userCode, args, execOptions);

      if (!execution.success) {
        results.push({
          passed: false,
          input: testCase.input,
          expected: testCase.expected,
          actual: null,
          description,
          error: execution.error,
          executionTime: execution.executionTime,
        });
        continue;
      }

      const actual = execution.result;

      // Compare result
      const passed = deepEqual(actual, testCase.expected);

      if (passed) passedCount++;

      results.push({
        passed,
        input: testCase.input,
        expected: testCase.expected,
        actual,
        description,
        executionTime: execution.executionTime,
      });
    } catch (error: any) {
      // Unexpected error (shouldn't happen with sandbox, but just in case)
      results.push({
        passed: false,
        input: testCase.input,
        expected: testCase.expected,
        actual: null,
        description,
        error: error.message || 'Runtime error',
      });
    }
  }

  const totalTests = testCases.length;
  const failedTests = totalTests - passedCount;
  const score =
    totalTests > 0 ? Math.round((passedCount / totalTests) * 100) : 0;
  const pointsEarned =
    totalTests > 0 ? Math.round((passedCount / totalTests) * maxPoints) : 0;

  return {
    passed: passedCount === totalTests,
    score,
    totalTests,
    passedTests: passedCount,
    failedTests,
    results,
    pointsEarned,
    detectedFunction,
  };
}

/**
 * Format test result for display
 */
export function formatTestResult(result: TestResult): string {
  const status = result.passed ? '✅' : '❌';
  const inputStr = JSON.stringify(result.input);
  const expectedStr = JSON.stringify(result.expected);
  const actualStr = result.actual !== null ? JSON.stringify(result.actual) : 'null';

  let message = `${status} ${result.description}\n`;
  message += `   Input: ${inputStr}\n`;
  message += `   Expected: ${expectedStr}\n`;
  message += `   Got: ${actualStr}`;

  if (result.error) {
    message += `\n   Error: ${result.error}`;
  }

  if (result.executionTime !== undefined) {
    message += `\n   Time: ${result.executionTime}ms`;
  }

  return message;
}

/**
 * Quick validation helper - runs a single test case
 * Useful for quick checks without full test suite
 */
export function runSingleTest(
  userCode: string,
  input: any,
  expected: any,
  options: SandboxOptions = {}
): TestResult {
  const result = runTestCases(
    userCode,
    [{ input, expected, description: 'Single test' }],
    100,
    options
  );
  return result.results[0];
}
