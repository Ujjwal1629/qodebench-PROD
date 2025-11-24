/**
 * Safe Sandbox Executor
 *
 * A more secure code execution environment that:
 * - Uses VM context for better isolation
 * - Has proper timeout enforcement
 * - Blocks dangerous operations
 * - Limits resource usage
 *
 * Note: For maximum security in production, consider using:
 * - isolated-vm package (V8 isolate)
 * - External sandbox service (like Judge0, Piston)
 * - Docker containers
 *
 * This implementation provides good security for a learning platform
 * while being simple to deploy.
 */

import * as vm from 'vm';

export interface ExecutionResult<T = any> {
  success: boolean;
  result?: T;
  error?: string;
  executionTime?: number;
}

export interface SandboxOptions {
  timeout?: number;
  functionName?: string;
  memoryLimit?: number; // In MB
}

// Blocked patterns in code - reject before execution
const BLOCKED_PATTERNS = [
  /process\s*\./i,
  /require\s*\(/i,
  /import\s+.*from/i,
  /eval\s*\(/i,
  /Function\s*\(/i,
  /globalThis/i,
  /Reflect\s*\./i,
  /Proxy\s*\(/i,
  /__proto__/i,
  /constructor\s*\[/i,
  /\.constructor/i,
];

/**
 * Deep freeze an object to prevent modification at runtime
 */
function deepFreeze<T>(obj: T): T {
  Object.freeze(obj);
  Object.getOwnPropertyNames(obj).forEach((prop) => {
    const value = (obj as any)[prop];
    if (value && typeof value === 'object' && !Object.isFrozen(value)) {
      deepFreeze(value);
    }
  });
  return obj;
}

/**
 * Create safe globals with prototype pollution protection
 */
function createSafeGlobals() {
  // Use Object.create(null) for truly isolated objects without prototype chain
  const safeConsole = Object.create(null);
  safeConsole.log = () => {};
  safeConsole.warn = () => {};
  safeConsole.error = () => {};
  safeConsole.info = () => {};
  deepFreeze(safeConsole);

  // Create safe Math object without prototype
  const safeMath = Object.create(null);
  Object.getOwnPropertyNames(Math).forEach((key) => {
    safeMath[key] = (Math as any)[key];
  });
  deepFreeze(safeMath);

  // Create safe JSON object
  const safeJSON = Object.create(null);
  safeJSON.parse = JSON.parse.bind(JSON);
  safeJSON.stringify = JSON.stringify.bind(JSON);
  deepFreeze(safeJSON);

  // Create safe Object with limited methods
  const safeObject = Object.create(null);
  safeObject.keys = Object.keys;
  safeObject.values = Object.values;
  safeObject.entries = Object.entries;
  safeObject.assign = Object.assign;
  safeObject.freeze = Object.freeze;
  // Explicitly block dangerous methods
  safeObject.defineProperty = undefined;
  safeObject.getOwnPropertyDescriptor = undefined;
  safeObject.setPrototypeOf = undefined;
  safeObject.getPrototypeOf = undefined;
  deepFreeze(safeObject);

  return {
    // Math and numbers (frozen)
    Math: safeMath,
    Number,
    parseInt,
    parseFloat,
    isNaN,
    isFinite,
    Infinity,
    NaN,

    // Strings
    String,
    encodeURI,
    encodeURIComponent,
    decodeURI,
    decodeURIComponent,

    // Arrays and safe Object
    Array,
    Object: safeObject,
    JSON: safeJSON,

    // Data structures
    Map,
    Set,
    WeakMap,
    WeakSet,

    // Typed arrays (safe)
    Int8Array,
    Uint8Array,
    Int16Array,
    Uint16Array,
    Int32Array,
    Uint32Array,
    Float32Array,
    Float64Array,

    // Other safe built-ins
    Boolean,
    Symbol,
    BigInt,
    Date,
    RegExp,
    Error,
    TypeError,
    RangeError,
    SyntaxError,
    ReferenceError,

    // Console (limited, frozen)
    console: safeConsole,

    // Undefined for dangerous globals
    process: undefined,
    require: undefined,
    module: undefined,
    exports: undefined,
    __dirname: undefined,
    __filename: undefined,
    global: undefined,
    globalThis: undefined,
    fetch: undefined,
    XMLHttpRequest: undefined,
    WebSocket: undefined,
    Worker: undefined,
    SharedArrayBuffer: undefined,
    Atomics: undefined,
    eval: undefined,
    Function: undefined,
  };
}

/**
 * Check code for dangerous patterns
 */
function validateCode(code: string): { safe: boolean; reason?: string } {
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(code)) {
      return {
        safe: false,
        reason: `Code contains blocked pattern: ${pattern.source}`,
      };
    }
  }
  return { safe: true };
}

/**
 * Detect the main function name from user code
 */
function detectMainFunction(code: string): string | null {
  // Remove comments
  const codeWithoutComments = code
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '');

  const patterns = [
    /function\s+(\w+)\s*\(/g,
    /(?:const|let|var)\s+(\w+)\s*=\s*(?:\([^)]*\)|[\w]+)\s*=>/g,
    /(?:const|let|var)\s+(\w+)\s*=\s*function\s*\(/g,
  ];

  const functions: { name: string; position: number }[] = [];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(codeWithoutComments)) !== null) {
      functions.push({ name: match[1], position: match.index });
    }
  }

  if (functions.length === 0) return null;

  functions.sort((a, b) => a.position - b.position);
  const uniqueNames = [...new Set(functions.map((f) => f.name))];

  // Priority: solution > main > getXxx > last function
  if (uniqueNames.includes('solution')) return 'solution';
  if (uniqueNames.includes('main')) return 'main';
  const getter = uniqueNames.find((n) => n.startsWith('get'));
  if (getter) return getter;

  return uniqueNames[uniqueNames.length - 1];
}

/**
 * Sanitize code by removing export keywords
 */
function sanitizeCode(code: string): string {
  return code.replace(/export\s+default\s+/g, '').replace(/export\s+/g, '');
}

/**
 * Execute user code safely in a VM context
 */
export function safeSandboxExecute<T = any>(
  userCode: string,
  args: any[],
  options: SandboxOptions = {}
): ExecutionResult<T> {
  const { timeout = 3000, functionName } = options;
  const startTime = Date.now();

  try {
    // Step 1: Validate code for dangerous patterns
    const validation = validateCode(userCode);
    if (!validation.safe) {
      return {
        success: false,
        error: `Security error: ${validation.reason}`,
      };
    }

    // Step 2: Sanitize code
    const sanitizedCode = sanitizeCode(userCode);

    // Step 3: Detect main function
    const mainFunctionName = functionName || detectMainFunction(sanitizedCode);
    if (!mainFunctionName) {
      return {
        success: false,
        error:
          'Could not find a function in your code. Please define a function named "solution" or any named function.',
      };
    }

    // Step 4: Create VM context with safe, isolated globals (prototype pollution protected)
    const context = vm.createContext(createSafeGlobals());

    // Step 5: Wrap user code to return the function
    const wrappedCode = `
      (function() {
        'use strict';
        ${sanitizedCode}

        if (typeof ${mainFunctionName} === 'function') {
          return ${mainFunctionName};
        }
        return null;
      })()
    `;

    // Step 6: Compile and run to get the function
    const script = new vm.Script(wrappedCode, {
      filename: 'user-code.js',
    });

    const userFunction = script.runInContext(context, {
      timeout: timeout,
      breakOnSigint: true,
    });

    if (typeof userFunction !== 'function') {
      return {
        success: false,
        error: `Function '${mainFunctionName}' was not found or is not callable.`,
      };
    }

    // Step 7: Create execution context for running the function
    const execGlobals = createSafeGlobals();
    const execContext = vm.createContext({
      ...execGlobals,
      __userFunction__: userFunction,
      __args__: args,
      __result__: undefined,
    });

    // Step 8: Execute the function with arguments
    const execScript = new vm.Script(
      `__result__ = __userFunction__(...__args__)`,
      { filename: 'exec-code.js' }
    );

    execScript.runInContext(execContext, {
      timeout: timeout,
      breakOnSigint: true,
    });

    const executionTime = Date.now() - startTime;

    return {
      success: true,
      result: execContext.__result__ as T,
      executionTime,
    };
  } catch (error: any) {
    const executionTime = Date.now() - startTime;

    let errorMessage = error.message || 'Unknown runtime error';

    // Handle timeout errors
    if (
      errorMessage.includes('Script execution timed out') ||
      errorMessage.includes('execution timed out')
    ) {
      return {
        success: false,
        error: `Execution timeout: Your code took longer than ${timeout}ms. This might indicate an infinite loop.`,
        executionTime,
      };
    }

    // Enhance common error messages
    if (errorMessage.includes('is not defined')) {
      errorMessage +=
        '. Make sure all variables and functions are properly declared.';
    } else if (errorMessage.includes('is not a function')) {
      errorMessage += '. Check that you are calling a function, not a variable.';
    }

    return {
      success: false,
      error: errorMessage,
      executionTime,
    };
  }
}

/**
 * Async version with Promise-based timeout
 */
export async function safeSandboxExecuteAsync<T = any>(
  userCode: string,
  args: any[],
  options: SandboxOptions = {}
): Promise<ExecutionResult<T>> {
  const { timeout = 3000 } = options;

  return new Promise((resolve) => {
    // Set a hard timeout
    const timeoutId = setTimeout(() => {
      resolve({
        success: false,
        error: `Execution timeout: Your code took longer than ${timeout}ms.`,
        executionTime: timeout,
      });
    }, timeout + 100); // Small buffer

    try {
      const result = safeSandboxExecute<T>(userCode, args, options);
      clearTimeout(timeoutId);
      resolve(result);
    } catch (error: any) {
      clearTimeout(timeoutId);
      resolve({
        success: false,
        error: error.message || 'Execution failed',
      });
    }
  });
}

/**
 * Validate syntax without executing
 */
export function validateSyntax(
  userCode: string
): { valid: boolean; error?: string } {
  try {
    const sanitizedCode = sanitizeCode(userCode);
    new vm.Script(`(function() { ${sanitizedCode} })`);
    return { valid: true };
  } catch (error: any) {
    return {
      valid: false,
      error: error.message || 'Syntax error in code',
    };
  }
}

/**
 * Get detected function name without executing
 */
export function getDetectedFunctionName(userCode: string): string | null {
  const sanitizedCode = sanitizeCode(userCode);
  return detectMainFunction(sanitizedCode);
}
