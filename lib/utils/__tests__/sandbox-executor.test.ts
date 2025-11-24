/**
 * Test suite for the Sandbox Executor
 *
 * Run with: npx tsx lib/utils/__tests__/sandbox-executor.test.ts
 */

import {
  sandboxExecute,
  sandboxExecuteAsync,
  getDetectedFunctionName,
  validateSyntax,
} from '../sandbox-executor';
import { runTestCases } from '../test-runner';

// Test utilities
let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (error: any) {
    console.log(`❌ ${name}`);
    console.log(`   Error: ${error.message}`);
    failed++;
  }
}

function expect(actual: any) {
  return {
    toBe(expected: any) {
      if (actual !== expected) {
        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
      }
    },
    toEqual(expected: any) {
      const actualStr = JSON.stringify(actual);
      const expectedStr = JSON.stringify(expected);
      if (actualStr !== expectedStr) {
        throw new Error(`Expected ${expectedStr}, got ${actualStr}`);
      }
    },
    toBeTruthy() {
      if (!actual) {
        throw new Error(`Expected truthy value, got ${actual}`);
      }
    },
    toBeFalsy() {
      if (actual) {
        throw new Error(`Expected falsy value, got ${actual}`);
      }
    },
    toContain(expected: string) {
      if (!actual.includes(expected)) {
        throw new Error(`Expected "${actual}" to contain "${expected}"`);
      }
    },
  };
}

console.log('\n🧪 Testing Sandbox Executor\n');
console.log('='.repeat(60));

// ============================================================================
// Test 1: Simple function declaration
// ============================================================================
console.log('\n📦 Test Group: Simple Functions\n');

test('Simple function declaration works', () => {
  const code = `function solution(n) { return n * 2; }`;
  const result = sandboxExecute(code, [5]);
  expect(result.success).toBeTruthy();
  expect(result.result).toBe(10);
});

test('Function with multiple parameters', () => {
  const code = `function add(a, b) { return a + b; }`;
  const result = sandboxExecute(code, [3, 7]);
  expect(result.success).toBeTruthy();
  expect(result.result).toBe(10);
});

// ============================================================================
// Test 2: Arrow functions
// ============================================================================
console.log('\n📦 Test Group: Arrow Functions\n');

test('Arrow function assignment works', () => {
  const code = `const solution = (n) => n * 2;`;
  const result = sandboxExecute(code, [5]);
  expect(result.success).toBeTruthy();
  expect(result.result).toBe(10);
});

test('Arrow function with block body', () => {
  const code = `
    const solution = (n) => {
      const doubled = n * 2;
      return doubled + 1;
    };
  `;
  const result = sandboxExecute(code, [5]);
  expect(result.success).toBeTruthy();
  expect(result.result).toBe(11);
});

test('Let arrow function assignment', () => {
  const code = `let solution = (x) => x * x;`;
  const result = sandboxExecute(code, [4]);
  expect(result.success).toBeTruthy();
  expect(result.result).toBe(16);
});

// ============================================================================
// Test 3: Top-level const/let/var declarations (THE MAIN FIX)
// ============================================================================
console.log('\n📦 Test Group: Top-level Declarations (Main Fix)\n');

test('Top-level const declaration works', () => {
  const code = `
    const MULTIPLIER = 3;
    function solution(n) {
      return n * MULTIPLIER;
    }
  `;
  const result = sandboxExecute(code, [5]);
  expect(result.success).toBeTruthy();
  expect(result.result).toBe(15);
});

test('Top-level let declaration works', () => {
  const code = `
    let counter = 0;
    function solution(n) {
      counter += n;
      return counter;
    }
  `;
  const result = sandboxExecute(code, [5]);
  expect(result.success).toBeTruthy();
  expect(result.result).toBe(5);
});

test('Top-level var declaration works', () => {
  const code = `
    var config = { multiplier: 2 };
    function solution(n) {
      return n * config.multiplier;
    }
  `;
  const result = sandboxExecute(code, [5]);
  expect(result.success).toBeTruthy();
  expect(result.result).toBe(10);
});

test('Multiple top-level declarations work', () => {
  const code = `
    const A = 10;
    let B = 20;
    var C = 30;

    function solution(n) {
      return n + A + B + C;
    }
  `;
  const result = sandboxExecute(code, [5]);
  expect(result.success).toBeTruthy();
  expect(result.result).toBe(65);
});

// ============================================================================
// Test 4: Multiple helper functions
// ============================================================================
console.log('\n📦 Test Group: Multiple Helper Functions\n');

test('Multiple helper functions work', () => {
  const code = `
    function double(x) {
      return x * 2;
    }

    function triple(x) {
      return x * 3;
    }

    function solution(n) {
      return double(n) + triple(n);
    }
  `;
  const result = sandboxExecute(code, [5]);
  expect(result.success).toBeTruthy();
  expect(result.result).toBe(25); // 10 + 15
});

test('Helper functions with const', () => {
  const code = `
    const helper = (x) => x + 1;

    function solution(n) {
      return helper(helper(n));
    }
  `;
  const result = sandboxExecute(code, [5]);
  expect(result.success).toBeTruthy();
  expect(result.result).toBe(7);
});

test('Nested helper calls work', () => {
  const code = `
    const add = (a, b) => a + b;
    const multiply = (a, b) => a * b;
    const square = (x) => multiply(x, x);

    function solution(n) {
      return add(square(n), n);
    }
  `;
  const result = sandboxExecute(code, [5]);
  expect(result.success).toBeTruthy();
  expect(result.result).toBe(30); // 25 + 5
});

// ============================================================================
// Test 5: Classes and objects
// ============================================================================
console.log('\n📦 Test Group: Classes and Objects\n');

test('Class definition works', () => {
  const code = `
    class Calculator {
      add(a, b) {
        return a + b;
      }

      multiply(a, b) {
        return a * b;
      }
    }

    function solution(a, b) {
      const calc = new Calculator();
      return calc.add(a, b) + calc.multiply(a, b);
    }
  `;
  const result = sandboxExecute(code, [3, 4]);
  expect(result.success).toBeTruthy();
  expect(result.result).toBe(19); // 7 + 12
});

test('Object literal helper works', () => {
  const code = `
    const utils = {
      double: (x) => x * 2,
      triple: (x) => x * 3
    };

    function solution(n) {
      return utils.double(n) + utils.triple(n);
    }
  `;
  const result = sandboxExecute(code, [5]);
  expect(result.success).toBeTruthy();
  expect(result.result).toBe(25);
});

// ============================================================================
// Test 6: Export patterns
// ============================================================================
console.log('\n📦 Test Group: Export Patterns\n');

test('Export function works', () => {
  const code = `export function solution(n) { return n * 2; }`;
  const result = sandboxExecute(code, [5]);
  expect(result.success).toBeTruthy();
  expect(result.result).toBe(10);
});

test('Export const arrow function works', () => {
  const code = `export const solution = (n) => n * 3;`;
  const result = sandboxExecute(code, [5]);
  expect(result.success).toBeTruthy();
  expect(result.result).toBe(15);
});

test('Export default works', () => {
  const code = `export default function solution(n) { return n + 1; }`;
  const result = sandboxExecute(code, [5]);
  expect(result.success).toBeTruthy();
  expect(result.result).toBe(6);
});

// ============================================================================
// Test 7: Function detection
// ============================================================================
console.log('\n📦 Test Group: Function Detection\n');

test('Detects "solution" function by name', () => {
  const code = `
    function helper() {}
    function solution(x) { return x; }
    function another() {}
  `;
  const detected = getDetectedFunctionName(code);
  expect(detected).toBe('solution');
});

test('Detects "main" function by name', () => {
  const code = `
    function helper() {}
    function main(x) { return x; }
  `;
  const detected = getDetectedFunctionName(code);
  expect(detected).toBe('main');
});

test('Detects getter function (getXxx pattern)', () => {
  const code = `
    function filterData() {}
    function getActiveUsers(users) { return users; }
    function processData() {}
  `;
  const detected = getDetectedFunctionName(code);
  expect(detected).toBe('getActiveUsers');
});

test('Falls back to last function when no special name', () => {
  const code = `
    function first() {}
    function second() {}
    function third(x) { return x; }
  `;
  const detected = getDetectedFunctionName(code);
  expect(detected).toBe('third');
});

// ============================================================================
// Test 8: Array and object returns
// ============================================================================
console.log('\n📦 Test Group: Complex Return Types\n');

test('Returns array correctly', () => {
  const code = `
    function solution(arr) {
      return arr.map(x => x * 2);
    }
  `;
  const result = sandboxExecute(code, [[1, 2, 3]]);
  expect(result.success).toBeTruthy();
  expect(result.result).toEqual([2, 4, 6]);
});

test('Returns object correctly', () => {
  const code = `
    function solution(name, age) {
      return { name, age, adult: age >= 18 };
    }
  `;
  const result = sandboxExecute(code, ['Alice', 25]);
  expect(result.success).toBeTruthy();
  expect(result.result).toEqual({ name: 'Alice', age: 25, adult: true });
});

test('Returns nested structure correctly', () => {
  const code = `
    function solution(data) {
      return {
        items: data.map(x => ({ value: x, doubled: x * 2 })),
        count: data.length
      };
    }
  `;
  const result = sandboxExecute(code, [[1, 2, 3]]);
  expect(result.success).toBeTruthy();
  expect(result.result).toEqual({
    items: [
      { value: 1, doubled: 2 },
      { value: 2, doubled: 4 },
      { value: 3, doubled: 6 },
    ],
    count: 3,
  });
});

// ============================================================================
// Test 9: Test runner integration
// ============================================================================
console.log('\n📦 Test Group: Test Runner Integration\n');

test('runTestCases works with simple code', () => {
  const code = `function solution(n) { return n * 2; }`;
  const testCases = [
    { input: 5, expected: 10 },
    { input: 0, expected: 0 },
    { input: -3, expected: -6 },
  ];
  const result = runTestCases(code, testCases, 100);
  expect(result.passed).toBeTruthy();
  expect(result.score).toBe(100);
  expect(result.passedTests).toBe(3);
});

test('runTestCases works with top-level const', () => {
  const code = `
    const MULTIPLIER = 3;
    function solution(n) {
      return n * MULTIPLIER;
    }
  `;
  const testCases = [
    { input: 5, expected: 15 },
    { input: 2, expected: 6 },
  ];
  const result = runTestCases(code, testCases, 100);
  expect(result.passed).toBeTruthy();
  expect(result.score).toBe(100);
});

test('runTestCases works with array input (multiple args)', () => {
  const code = `function add(a, b, c) { return a + b + c; }`;
  const testCases = [
    { input: [1, 2, 3], expected: 6 },
    { input: [10, 20, 30], expected: 60 },
  ];
  const result = runTestCases(code, testCases, 100);
  expect(result.passed).toBeTruthy();
  expect(result.score).toBe(100);
});

test('runTestCases handles partial failures correctly', () => {
  const code = `function solution(n) { return n * 2; }`;
  const testCases = [
    { input: 5, expected: 10 },
    { input: 3, expected: 999 }, // Wrong expectation
  ];
  const result = runTestCases(code, testCases, 100);
  expect(result.passed).toBeFalsy();
  expect(result.passedTests).toBe(1);
  expect(result.failedTests).toBe(1);
  expect(result.score).toBe(50);
});

// ============================================================================
// Test 10: Error handling
// ============================================================================
console.log('\n📦 Test Group: Error Handling\n');

test('Reports syntax errors', () => {
  const code = `function solution(n { return n; }`;  // Missing )
  const result = sandboxExecute(code, [5]);
  expect(result.success).toBeFalsy();
  expect(result.error).toContain('Unexpected');
});

test('Reports runtime errors', () => {
  const code = `
    function solution(n) {
      return undefinedVariable * n;
    }
  `;
  const result = sandboxExecute(code, [5]);
  expect(result.success).toBeFalsy();
  expect(result.error).toContain('is not defined');
});

test('Reports no function found', () => {
  const code = `const x = 5;`;  // No function
  const result = sandboxExecute(code, [5]);
  expect(result.success).toBeFalsy();
  expect(result.error).toContain('Could not find');
});

// ============================================================================
// Test 11: Security checks
// ============================================================================
console.log('\n📦 Test Group: Security\n');

test('process is blocked', () => {
  const code = `
    function solution() {
      return typeof process;
    }
  `;
  const result = sandboxExecute(code, []);
  expect(result.success).toBeTruthy();
  expect(result.result).toBe('undefined');
});

test('require is blocked', () => {
  const code = `
    function solution() {
      return typeof require;
    }
  `;
  const result = sandboxExecute(code, []);
  expect(result.success).toBeTruthy();
  expect(result.result).toBe('undefined');
});

// ============================================================================
// Test 12: Advanced challenge pattern
// ============================================================================
console.log('\n📦 Test Group: Advanced Challenge Pattern\n');

test('Complex multi-layer code works (like advanced challenges)', () => {
  const code = `
    // Constants
    const TAX_RATE = 0.1;
    const DISCOUNT_THRESHOLD = 100;
    const DISCOUNT_RATE = 0.05;

    // Helper functions
    const calculateTax = (amount) => amount * TAX_RATE;

    const calculateDiscount = (amount) => {
      if (amount >= DISCOUNT_THRESHOLD) {
        return amount * DISCOUNT_RATE;
      }
      return 0;
    };

    const roundToTwoDecimals = (num) => Math.round(num * 100) / 100;

    // Main solution
    function solution(items) {
      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const discount = calculateDiscount(subtotal);
      const taxableAmount = subtotal - discount;
      const tax = calculateTax(taxableAmount);
      const total = taxableAmount + tax;

      return {
        subtotal: roundToTwoDecimals(subtotal),
        discount: roundToTwoDecimals(discount),
        tax: roundToTwoDecimals(tax),
        total: roundToTwoDecimals(total)
      };
    }
  `;

  const items = [
    { price: 50, quantity: 2 },  // 100
    { price: 25, quantity: 2 },  // 50
  ];
  // subtotal: 150, discount: 7.5 (5% of 150), taxable: 142.5, tax: 14.25, total: 156.75

  const result = sandboxExecute(code, [items]);
  expect(result.success).toBeTruthy();
  expect(result.result).toEqual({
    subtotal: 150,
    discount: 7.5,
    tax: 14.25,
    total: 156.75,
  });
});

// ============================================================================
// Summary
// ============================================================================
console.log('\n' + '='.repeat(60));
console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed\n`);

if (failed > 0) {
  process.exit(1);
}
