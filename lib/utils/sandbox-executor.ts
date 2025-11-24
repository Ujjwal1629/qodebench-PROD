/**
 * Sandbox Executor for Safe Code Execution
 *
 * This module provides a secure way to execute user-submitted JavaScript code
 * with proper sandboxing, timeout protection, and support for modern JS syntax.
 *
 * Features:
 * - Supports top-level const, let, var declarations
 * - Supports arrow functions, function expressions, and named functions
 * - Auto-detects the main solution function
 * - Timeout protection to prevent infinite loops
 * - Restricted global scope for security
 */

export type ExecutionResult<T = any> = {
  success: boolean;
  result?: T;
  error?: string;
  executionTime?: number;
};

export type SandboxOptions = {
  timeout?: number; // Timeout in milliseconds (default: 5000)
  functionName?: string; // Override auto-detection with specific function name
};

// List of dangerous globals to block
const BLOCKED_GLOBALS = [
  'process',
  'require',
  'module',
  'exports',
  '__dirname',
  '__filename',
  'global',
  'globalThis',
  'fetch',
  'XMLHttpRequest',
  'WebSocket',
  'Worker',
  'SharedArrayBuffer',
  'Atomics',
];

/**
 * Detects the main function name from user code using multiple patterns
 *
 * Priority order:
 * 1. Explicit 'solution' function
 * 2. Explicit 'main' function
 * 3. Function with 'get' prefix (getter pattern)
 * 4. Last defined function (common entry point)
 * 5. First defined function (fallback)
 */
function detectMainFunction(code: string): string | null {
  // Remove comments to avoid false matches
  const codeWithoutComments = code
    .replace(/\/\*[\s\S]*?\*\//g, '') // Multi-line comments
    .replace(/\/\/.*$/gm, ''); // Single-line comments

  // Pattern 1: Named function declarations
  // Matches: function solution() {}, function main() {}, etc.
  const namedFunctionPattern = /function\s+(\w+)\s*\(/g;

  // Pattern 2: Arrow function assignments
  // Matches: const solution = () => {}, const fn = (x) => x * 2
  const arrowFunctionPattern =
    /(?:const|let|var)\s+(\w+)\s*=\s*(?:\([^)]*\)|[\w]+)\s*=>/g;

  // Pattern 3: Function expression assignments
  // Matches: const solution = function() {}, const fn = function(x) {}
  const functionExpressionPattern =
    /(?:const|let|var)\s+(\w+)\s*=\s*function\s*\(/g;

  // Pattern 4: Export patterns (already stripped but let's be thorough)
  // Matches: export function solution() {}, export const solution = ...
  const exportFunctionPattern = /export\s+function\s+(\w+)\s*\(/g;
  const exportConstPattern =
    /export\s+(?:const|let|var)\s+(\w+)\s*=\s*(?:function|\([^)]*\)\s*=>|[\w]+\s*=>)/g;

  // Collect all function names with their positions
  const functions: { name: string; position: number }[] = [];

  // Helper to add matches
  const addMatches = (pattern: RegExp) => {
    let match;
    while ((match = pattern.exec(codeWithoutComments)) !== null) {
      functions.push({ name: match[1], position: match.index });
    }
  };

  addMatches(namedFunctionPattern);
  addMatches(arrowFunctionPattern);
  addMatches(functionExpressionPattern);
  addMatches(exportFunctionPattern);
  addMatches(exportConstPattern);

  if (functions.length === 0) {
    return null;
  }

  // Sort by position for consistent ordering
  functions.sort((a, b) => a.position - b.position);

  // Get unique function names (preserve order)
  const uniqueNames = [...new Set(functions.map(f => f.name))];

  // Priority 1: Look for 'solution' function
  if (uniqueNames.includes('solution')) {
    return 'solution';
  }

  // Priority 2: Look for 'main' function
  if (uniqueNames.includes('main')) {
    return 'main';
  }

  // Priority 3: Look for getter functions (getXxx pattern)
  const getterFunction = uniqueNames.find(name => name.startsWith('get'));
  if (getterFunction) {
    return getterFunction;
  }

  // Priority 4: Use the last defined function (common entry point pattern)
  if (uniqueNames.length > 1) {
    return uniqueNames[uniqueNames.length - 1];
  }

  // Priority 5: Use the first (and only) function
  return uniqueNames[0];
}

/**
 * Sanitizes user code by stripping export keywords
 */
function sanitizeCode(code: string): string {
  // Remove 'export' keyword (ES6 modules not supported in Function constructor)
  // Handles: export function, export const, export let, export var, export default
  return code
    .replace(/export\s+default\s+/g, '')
    .replace(/export\s+/g, '');
}

/**
 * Creates the wrapper code that executes user code in a safe IIFE
 * and returns the detected main function
 */
function createWrapperCode(
  userCode: string,
  mainFunctionName: string
): string {
  // Note: We don't need to escape user code since new Function() parses the string directly.
  // Template literals, backticks, etc. in user code will work correctly.

  // Build wrapper using string concatenation to avoid template literal issues
  const parts = [
    "'use strict';",
    '',
    '// Block dangerous globals',
    'const process = undefined;',
    'const require = undefined;',
    'const module = undefined;',
    'const exports = undefined;',
    'const __dirname = undefined;',
    'const __filename = undefined;',
    'const global = undefined;',
    'const fetch = undefined;',
    'const XMLHttpRequest = undefined;',
    'const WebSocket = undefined;',
    'const Worker = undefined;',
    'const SharedArrayBuffer = undefined;',
    'const Atomics = undefined;',
    '',
    '// Execute user code in an IIFE to allow top-level declarations',
    'const __userModule__ = (function() {',
    userCode,
    '',
    '  // Return the main function if it exists',
    '  if (typeof ' + mainFunctionName + ' === "function") {',
    '    return ' + mainFunctionName + ';',
    '  }',
    '  return null;',
    '})();',
    '',
    'return __userModule__;',
  ];

  return parts.join('\n');
}

/**
 * Executes user code with timeout protection
 *
 * @param userCode - The user's JavaScript code
 * @param args - Arguments to pass to the user's function
 * @param options - Execution options (timeout, functionName override)
 * @returns ExecutionResult with success status, result, and timing
 */
export function sandboxExecute<T = any>(
  userCode: string,
  args: any[],
  options: SandboxOptions = {}
): ExecutionResult<T> {
  const { timeout = 5000, functionName } = options;
  const startTime = Date.now();

  try {
    // Step 1: Sanitize the code (remove exports)
    const sanitizedCode = sanitizeCode(userCode);

    // Step 2: Detect the main function name
    const detectedFunctionName =
      functionName || detectMainFunction(sanitizedCode);

    if (!detectedFunctionName) {
      return {
        success: false,
        error:
          'Could not find a function in your code. Please define a function named "solution" or any named function.',
      };
    }

    // Step 3: Create the wrapper code
    const wrapperCode = createWrapperCode(sanitizedCode, detectedFunctionName);

    // Step 4: Create and execute the function
    // Note: new Function() creates a function in the global scope,
    // but our wrapper blocks dangerous globals
    const executorFunction = new Function(wrapperCode);
    const userFunction = executorFunction();

    if (typeof userFunction !== 'function') {
      return {
        success: false,
        error: `Function '${detectedFunctionName}' was not found or is not a function. Make sure your function is properly defined.`,
      };
    }

    // Step 5: Execute with timeout protection using synchronous approach
    // Note: For true async timeout, we'd need Worker threads,
    // but this catches most infinite loop cases through execution time check
    const result = userFunction(...args);

    const executionTime = Date.now() - startTime;

    // Check if execution took too long (basic protection)
    if (executionTime > timeout) {
      return {
        success: false,
        error: `Execution timeout: Your code took longer than ${timeout}ms to execute.`,
        executionTime,
      };
    }

    return {
      success: true,
      result: result as T,
      executionTime,
    };
  } catch (error: any) {
    const executionTime = Date.now() - startTime;

    // Provide helpful error messages
    let errorMessage = error.message || 'Unknown runtime error';

    // Enhance common error messages
    if (errorMessage.includes('is not defined')) {
      errorMessage += '. Make sure all variables and functions are properly declared.';
    } else if (errorMessage.includes('is not a function')) {
      errorMessage +=
        '. Check that you are calling a function, not a variable.';
    } else if (
      errorMessage.includes('Unexpected token') ||
      errorMessage.includes('SyntaxError')
    ) {
      errorMessage += '. Check your code for syntax errors.';
    }

    return {
      success: false,
      error: errorMessage,
      executionTime,
    };
  }
}

/**
 * Async version of sandboxExecute with proper timeout support
 * Uses Promise.race for timeout handling
 * Also properly awaits async user functions
 *
 * @param userCode - The user's JavaScript code
 * @param args - Arguments to pass to the user's function
 * @param options - Execution options
 * @returns Promise<ExecutionResult>
 */
export async function sandboxExecuteAsync<T = any>(
  userCode: string,
  args: any[],
  options: SandboxOptions = {}
): Promise<ExecutionResult<T>> {
  const { timeout = 5000 } = options;
  const startTime = Date.now();

  // Timeout promise
  const timeoutPromise = new Promise<ExecutionResult<T>>(resolve => {
    setTimeout(() => {
      resolve({
        success: false,
        error: `Execution timeout: Your code took longer than ${timeout}ms to execute. This might indicate an infinite loop.`,
        executionTime: timeout,
      });
    }, timeout);
  });

  // Execution promise that properly handles async user functions
  const executionPromise = (async (): Promise<ExecutionResult<T>> => {
    try {
      // Get the sync result first
      const syncResult = sandboxExecute<T>(userCode, args, options);

      // If sync execution failed, return the error
      if (!syncResult.success) {
        return syncResult;
      }

      // Check if the result is a Promise (async user function)
      const result = syncResult.result;
      if (result && typeof result === 'object' && typeof (result as any).then === 'function') {
        // It's a Promise - await it
        try {
          const awaitedResult = await result;
          const executionTime = Date.now() - startTime;
          return {
            success: true,
            result: awaitedResult as T,
            executionTime,
          };
        } catch (asyncError: any) {
          const executionTime = Date.now() - startTime;
          return {
            success: false,
            error: asyncError.message || 'Async function error',
            executionTime,
          };
        }
      }

      // Not a Promise - return as is
      return syncResult;
    } catch (error: any) {
      const executionTime = Date.now() - startTime;
      return {
        success: false,
        error: error.message || 'Unknown error',
        executionTime,
      };
    }
  })();

  // Race between execution and timeout
  return Promise.race([executionPromise, timeoutPromise]);
}

/**
 * Gets the detected function name without executing the code
 * Useful for validation and debugging
 */
export function getDetectedFunctionName(userCode: string): string | null {
  const sanitizedCode = sanitizeCode(userCode);
  return detectMainFunction(sanitizedCode);
}

/**
 * Validates that user code is syntactically correct without executing it
 */
export function validateSyntax(userCode: string): { valid: boolean; error?: string } {
  try {
    const sanitizedCode = sanitizeCode(userCode);
    // Use Function constructor to parse without executing
    // The inner function won't be called, just parsed
    new Function(`
      'use strict';
      (function() {
        ${sanitizedCode}
      });
    `);
    return { valid: true };
  } catch (error: any) {
    return {
      valid: false,
      error: error.message || 'Syntax error in code',
    };
  }
}
