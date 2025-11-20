/**
 * Test Runner for Challenge Validation
 *
 * Executes user code against test cases in a sandboxed environment
 * Returns detailed results for each test case
 */

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
};

export type ValidationResult = {
  passed: boolean; // All tests passed
  score: number; // 0-100
  totalTests: number;
  passedTests: number;
  failedTests: number;
  results: TestResult[];
  pointsEarned: number;
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
 * SECURITY NOTE: This runs user code using Function constructor
 * In production, you should use a proper sandboxing solution like:
 * - isolated-vm
 * - vm2 (deprecated but safer than Function)
 * - Worker threads with resource limits
 * - External sandboxing service (e.g., Judge0, Piston)
 */
export function runTestCases(
  userCode: string,
  testCases: TestCase[],
  maxPoints: number = 50
): ValidationResult {
  const results: TestResult[] = [];
  let passedCount = 0;

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    // Generate description if missing
    const description = testCase.description || `Test case ${i + 1}`;

    try {
      // Strip 'export' keyword from user code (new Function() doesn't support ES6 modules)
      // User code format: export function functionName(...args) { ... }
      const codeWithoutExport = userCode.replace(/export\s+/g, '');

      // Extract all function names from code
      const functionMatches = codeWithoutExport.matchAll(/function\s+(\w+)\s*\(/g);
      const functionNames = Array.from(functionMatches).map(m => m[1]);

      if (functionNames.length === 0) {
        results.push({
          passed: false,
          input: testCase.input,
          expected: testCase.expected,
          actual: null,
          description,
          error: 'Could not find function in your code',
        });
        continue;
      }

      // For challenges with multiple functions, find the main entry point
      // Priority: function with "get" prefix, then last function, then first function
      let mainFunctionName = functionNames[0];

      // Check for getter functions (getActiveVerifiedUsers, etc.)
      const getterFunction = functionNames.find(name => name.startsWith('get'));
      if (getterFunction) {
        mainFunctionName = getterFunction;
      } else if (functionNames.length > 1) {
        // If multiple functions and no getter, use the last one (usually the entry point)
        mainFunctionName = functionNames[functionNames.length - 1];
      }

      // Execute all code in a single scope
      // This ensures variables, constants, and all functions can reference each other
      const wrappedCode = `
        ${codeWithoutExport}
        return ${mainFunctionName};
      `;

      const userFunction = new Function(wrappedCode)();

      if (typeof userFunction !== 'function') {
        results.push({
          passed: false,
          input: testCase.input,
          expected: testCase.expected,
          actual: null,
          description,
          error: `Function '${mainFunctionName}' not found in your code`,
        });
        continue;
      }

      // Execute function with test inputs
      let actual: any;
      if (Array.isArray(testCase.input)) {
        // Input is array of arguments: [arg1, arg2, ...]
        actual = userFunction(...testCase.input);
      } else {
        // Input is single value or object
        actual = userFunction(testCase.input);
      }

      // Compare result
      const passed = deepEqual(actual, testCase.expected);

      if (passed) passedCount++;

      results.push({
        passed,
        input: testCase.input,
        expected: testCase.expected,
        actual,
        description,
      });

    } catch (error: any) {
      // Runtime error in user code
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
  const score = totalTests > 0 ? Math.round((passedCount / totalTests) * 100) : 0;
  const pointsEarned = totalTests > 0 ? Math.round((passedCount / totalTests) * maxPoints) : 0;

  return {
    passed: passedCount === totalTests,
    score,
    totalTests,
    passedTests: passedCount,
    failedTests,
    results,
    pointsEarned,
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

  return message;
}
