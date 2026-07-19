// JS, TS & Playwright Interview Questions for QA Automation Testers
// 178 questions organized into 30 sections

export interface InterviewQuestion {
  id: number;
  question: string;
  answer: string;
  example?: string;
}

export interface InterviewSection {
  id: number;
  title: string;
  icon: string;
  questions: InterviewQuestion[];
}

export const INTERVIEW_SECTIONS: InterviewSection[] = [
  // ─── SECTION 1: JAVASCRIPT FUNDAMENTALS ────────────────────────────
  {
    id: 1,
    title: 'JavaScript Fundamentals',
    icon: '📦',
    questions: [
      {
        id: 1,
        question: 'Difference between var, let, and const',
        answer: '`var` is function-scoped, hoisted with `undefined`, and can be re-declared. `let` is block-scoped, hoisted but not initialized (TDZ), and cannot be re-declared. `const` is like `let` but cannot be reassigned after initialization.',
        example: `var x = 1; var x = 2; // OK — re-declaration allowed
let y = 1; // let y = 2; // Error — cannot re-declare
const z = 1; // z = 2; // Error — cannot reassign

if (true) {
  var a = 10; // leaks out of block
  let b = 20; // stays inside block
}
console.log(a); // 10
// console.log(b); // ReferenceError`,
      },
      {
        id: 2,
        question: 'Why var is function-scoped and let/const are block-scoped',
        answer: '`var` was designed early in JavaScript when block scoping didn\'t exist — it\'s scoped to the nearest function (or global). `let` and `const` (ES6) introduced block scoping, meaning they\'re confined to the nearest `{}` block (if, for, while, etc.). This prevents accidental leaks and makes code more predictable.',
        example: `function demo() {
  for (var i = 0; i < 3; i++) {}
  console.log(i); // 3 — var leaks out of for block

  for (let j = 0; j < 3; j++) {}
  // console.log(j); // ReferenceError — let stays in block
}`,
      },
      {
        id: 3,
        question: 'What is Temporal Dead Zone (TDZ)',
        answer: 'The TDZ is the period between entering a block and the point where a `let` or `const` variable is declared. During this zone, accessing the variable throws a `ReferenceError`. This enforces that variables are used only after declaration.',
        example: `{
  // TDZ starts here for 'x'
  // console.log(x); // ReferenceError: Cannot access 'x' before initialization
  let x = 10; // TDZ ends
  console.log(x); // 10
}`,
      },
      {
        id: 4,
        question: 'Can const objects be mutated',
        answer: 'Yes. `const` prevents reassignment of the variable binding, not mutation of the value. Object properties, array elements, and other internal state can still be changed. Use `Object.freeze()` for shallow immutability.',
        example: `const user = { name: "Govind", age: 25 };
user.age = 26; // OK — mutating property
console.log(user.age); // 26

// user = {}; // Error — cannot reassign

const arr = [1, 2, 3];
arr.push(4); // OK — mutating array
// arr = []; // Error — cannot reassign

Object.freeze(user);
user.age = 30; // Silently fails (no error in non-strict)
console.log(user.age); // 26`,
      },
      {
        id: 5,
        question: 'What happens if you redeclare a let variable',
        answer: 'You get a `SyntaxError`. Unlike `var`, `let` does not allow re-declaration in the same scope. This prevents accidental overwrites.',
        example: `let x = 1;
// let x = 2; // SyntaxError: Identifier 'x' has already been declared

// But in different scopes it's fine:
let y = 1;
if (true) {
  let y = 2; // Different scope — OK
  console.log(y); // 2
}
console.log(y); // 1`,
      },
      {
        id: 6,
        question: 'Hoisting behavior of var, let, const',
        answer: 'All three are hoisted (the engine knows about them at the top of their scope). `var` is initialized to `undefined` during hoisting. `let` and `const` are hoisted but NOT initialized — accessing them before declaration causes a `ReferenceError` (TDZ).',
        example: `console.log(a); // undefined (var is hoisted + initialized)
var a = 5;

// console.log(b); // ReferenceError (let is hoisted but in TDZ)
let b = 10;

// console.log(c); // ReferenceError (const is hoisted but in TDZ)
const c = 15;`,
      },
      {
        id: 7,
        question: 'How scope works inside if, for, and functions',
        answer: '`var` is scoped to the enclosing function, ignoring `if`/`for` blocks. `let`/`const` respect block scope — they\'re confined to any `{}` block including `if`, `for`, `while`. Functions create their own scope for all variable types.',
        example: `function test() {
  if (true) {
    var x = 1;   // function-scoped
    let y = 2;   // block-scoped
    const z = 3; // block-scoped
  }
  console.log(x); // 1
  // console.log(y); // ReferenceError
  // console.log(z); // ReferenceError
}`,
      },
    ],
  },

  // ─── SECTION 2: DATA TYPES ─────────────────────────────────────────
  {
    id: 2,
    title: 'Data Types',
    icon: '🔢',
    questions: [
      {
        id: 8,
        question: 'Primitive vs non-primitive data types',
        answer: 'Primitives: `string`, `number`, `boolean`, `null`, `undefined`, `symbol`, `bigint` — stored by value, immutable. Non-primitives: `object`, `array`, `function` — stored by reference, mutable. Primitives are compared by value; objects are compared by reference.',
        example: `// Primitives — compared by value
let a = "hello";
let b = "hello";
console.log(a === b); // true

// Objects — compared by reference
let obj1 = { x: 1 };
let obj2 = { x: 1 };
console.log(obj1 === obj2); // false (different references)

let obj3 = obj1;
console.log(obj1 === obj3); // true (same reference)`,
      },
      {
        id: 9,
        question: 'Difference between null and undefined',
        answer: '`undefined` means a variable has been declared but not assigned a value — it\'s the default. `null` is an intentional assignment meaning "no value" or "empty". Both are falsy, but they have different types: `typeof undefined` is `"undefined"`, `typeof null` is `"object"` (a known JS bug).',
        example: `let x;
console.log(x);        // undefined
console.log(typeof x); // "undefined"

let y = null;
console.log(y);        // null
console.log(typeof y); // "object" (JS bug)

console.log(null == undefined);  // true (loose equality)
console.log(null === undefined); // false (strict equality)`,
      },
      {
        id: 10,
        question: 'Why typeof null is "object"',
        answer: 'This is a historical bug from the first version of JavaScript. Internally, values were represented with a type tag — objects had tag `0`, and `null` was represented as the NULL pointer (`0x00`), so its type tag was also `0`. This was never fixed for backward compatibility.',
      },
      {
        id: 11,
        question: 'What is NaN',
        answer: '`NaN` stands for "Not a Number" — it\'s the result of invalid numeric operations. Paradoxically, `typeof NaN` is `"number"`. `NaN` is NOT equal to itself (`NaN !== NaN`). Use `Number.isNaN()` to check for it (not the global `isNaN()` which coerces).',
        example: `console.log(0 / 0);           // NaN
console.log(parseInt("abc"));  // NaN
console.log(typeof NaN);       // "number"
console.log(NaN === NaN);      // false!
console.log(Number.isNaN(NaN)); // true
console.log(Number.isNaN("hello")); // false (no coercion)
console.log(isNaN("hello"));   // true (coerces to number first)`,
      },
      {
        id: 12,
        question: 'Difference between == and ===',
        answer: '`==` (loose equality) performs type coercion before comparison. `===` (strict equality) checks both value AND type with no coercion. Always prefer `===` to avoid unexpected coercion bugs.',
        example: `console.log(1 == "1");   // true (string coerced to number)
console.log(1 === "1");  // false (different types)
console.log(0 == false); // true
console.log(0 === false);// false
console.log(null == undefined); // true
console.log(null === undefined); // false`,
      },
      {
        id: 13,
        question: 'Truthy and falsy values',
        answer: 'Falsy values (evaluate to false): `false`, `0`, `-0`, `""`, `null`, `undefined`, `NaN`. Everything else is truthy, including `"0"`, `"false"`, empty arrays `[]`, and empty objects `{}`. This matters in conditionals and logical operators.',
        example: `// All falsy
if (!false && !0 && !"" && !null && !undefined && !NaN) {
  console.log("All falsy!"); // prints
}

// Surprisingly truthy
if ("0") console.log('"0" is truthy');     // prints
if ([]) console.log('[] is truthy');        // prints
if ({}) console.log('{} is truthy');        // prints`,
      },
      {
        id: 14,
        question: 'What is immutability',
        answer: 'Immutability means a value cannot be changed after creation. Primitive values are inherently immutable. For objects, you achieve immutability using `Object.freeze()` (shallow) or libraries like Immer. In Playwright/testing, immutable test data prevents tests from interfering with each other.',
        example: `// Strings are immutable
let str = "hello";
str[0] = "H"; // No effect
console.log(str); // "hello"

// Object.freeze for shallow immutability
const config = Object.freeze({ timeout: 30000, retries: 2 });
config.timeout = 60000; // Silently fails
console.log(config.timeout); // 30000`,
      },
    ],
  },

  // ─── SECTION 3: FUNCTIONS ──────────────────────────────────────────
  {
    id: 3,
    title: 'Functions',
    icon: '⚙️',
    questions: [
      {
        id: 15,
        question: 'Function declaration vs function expression',
        answer: 'A function declaration uses `function name() {}` — it\'s hoisted entirely (can be called before declaration). A function expression assigns a function to a variable (`const fn = function() {}`) — only the variable is hoisted (not the function), so calling before assignment throws an error.',
        example: `// Declaration — hoisted, callable anywhere
greet(); // "Hello!" — works!
function greet() { console.log("Hello!"); }

// Expression — NOT hoisted
// sayHi(); // TypeError: sayHi is not a function
const sayHi = function() { console.log("Hi!"); };
sayHi(); // "Hi!" — works after assignment`,
      },
      {
        id: 16,
        question: 'Arrow function vs normal function',
        answer: 'Arrow functions: no own `this` (inherits from parent), no `arguments` object, cannot be used as constructors (`new`), shorter syntax, implicit return for single expressions. Normal functions: have their own `this`, have `arguments`, can be constructors.',
        example: `const obj = {
  name: "Test",
  normal: function() { return this.name; },  // "Test"
  arrow: () => { return this.name; }          // undefined (inherits outer this)
};

// Implicit return
const double = (n) => n * 2;    // No {} or return needed
const add = (a, b) => a + b;`,
      },
      {
        id: 17,
        question: "Why arrow functions don't have their own this",
        answer: 'Arrow functions were designed to solve the common problem of losing `this` context in callbacks. Instead of creating their own `this` binding, they lexically capture `this` from the enclosing scope at definition time. This makes them ideal for callbacks in Playwright tests where you want to preserve the test context.',
        example: `class Page {
  url = "https://example.com";

  // Problem with normal function
  loadWithNormal() {
    setTimeout(function() {
      console.log(this.url); // undefined — 'this' is setTimeout's context
    }, 100);
  }

  // Solution with arrow function
  loadWithArrow() {
    setTimeout(() => {
      console.log(this.url); // "https://example.com" — inherits from Page
    }, 100);
  }
}`,
      },
      {
        id: 18,
        question: 'What is a callback function',
        answer: 'A callback is a function passed as an argument to another function, which is then invoked at a later time. Callbacks enable asynchronous programming and event handling. In Playwright, `page.on("dialog", callback)` is a classic example.',
        example: `// Sync callback
const numbers = [1, 2, 3];
numbers.forEach(function(n) { // callback
  console.log(n * 2);
});

// Async callback (Playwright-style)
function onDialog(callback) {
  // Simulating dialog event
  setTimeout(() => callback("Are you sure?"), 100);
}
onDialog((message) => console.log("Dialog:", message));`,
      },
      {
        id: 19,
        question: 'What is a higher-order function',
        answer: 'A higher-order function either takes a function as an argument OR returns a function (or both). Examples: `map`, `filter`, `reduce`, `forEach`, `setTimeout`. They enable functional programming patterns like composition and currying.',
        example: `// Takes a function as argument
const nums = [1, 2, 3, 4, 5];
const evens = nums.filter(n => n % 2 === 0); // [2, 4]

// Returns a function
function multiplier(factor) {
  return (n) => n * factor; // returns a function
}
const double = multiplier(2);
const triple = multiplier(3);
console.log(double(5));  // 10
console.log(triple(5));  // 15`,
      },
      {
        id: 20,
        question: 'What is IIFE',
        answer: 'IIFE (Immediately Invoked Function Expression) is a function that runs as soon as it\'s defined. Syntax: `(function() { ... })()`. It creates a private scope, avoiding global namespace pollution. Less common with ES6 modules but still used in legacy code.',
        example: `(function() {
  const secret = "hidden";
  console.log(secret); // "hidden"
})();
// console.log(secret); // ReferenceError

// With arrow function
(() => {
  console.log("IIFE with arrow!");
})();`,
      },
      {
        id: 21,
        question: 'Default parameters',
        answer: 'Default parameters allow function parameters to have fallback values when no argument is passed (or `undefined` is passed). They\'re evaluated left-to-right and can reference earlier parameters.',
        example: `function greet(name = "Guest", greeting = \`Hello, \${name}\`) {
  console.log(greeting);
}
greet();            // "Hello, Guest"
greet("Govind");    // "Hello, Govind"
greet(undefined);   // "Hello, Guest" (undefined triggers default)
greet(null);        // "Hello, null" (null does NOT trigger default)`,
      },
      {
        id: 22,
        question: 'Rest parameters vs spread operator',
        answer: 'Rest (`...args` in function parameters) collects multiple arguments into an array. Spread (`...array` in function calls or literals) expands an array/object into individual elements. Same syntax `...`, different context.',
        example: `// Rest — collects into array
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}
console.log(sum(1, 2, 3, 4)); // 10

// Spread — expands array
const arr1 = [1, 2];
const arr2 = [3, 4];
const combined = [...arr1, ...arr2]; // [1, 2, 3, 4]

// Spread — expands object
const base = { timeout: 30000 };
const config = { ...base, retries: 2 }; // { timeout: 30000, retries: 2 }`,
      },
      {
        id: 23,
        question: 'Function currying',
        answer: 'Currying transforms a function with multiple arguments into a series of functions each taking a single argument: `f(a, b, c)` becomes `f(a)(b)(c)`. It enables partial application — fixing some arguments to create specialized functions.',
        example: `// Regular function
const add = (a, b) => a + b;

// Curried version
const curriedAdd = (a) => (b) => a + b;
const add5 = curriedAdd(5); // Partial application
console.log(add5(3));  // 8
console.log(add5(10)); // 15

// Practical: creating test URL builders
const buildURL = (base) => (path) => \`\${base}\${path}\`;
const apiURL = buildURL("https://api.example.com");
console.log(apiURL("/users"));  // https://api.example.com/users
console.log(apiURL("/login"));  // https://api.example.com/login`,
      },
      {
        id: 24,
        question: 'Pure vs impure functions',
        answer: 'A pure function: (1) always returns the same output for the same input, (2) has no side effects (no mutation, no API calls, no console.log). An impure function has side effects or depends on external state. Pure functions are easier to test and debug.',
        example: `// Pure — same input always gives same output
function add(a, b) { return a + b; }

// Impure — depends on external state
let count = 0;
function increment() { return ++count; } // modifies external variable

// Impure — side effect
function logUser(name) {
  console.log(name); // side effect (I/O)
  return name;
}`,
      },
    ],
  },

  // ─── SECTION 4: THIS KEYWORD ───────────────────────────────────────
  {
    id: 4,
    title: 'this Keyword',
    icon: '👆',
    questions: [
      {
        id: 25,
        question: 'What is this',
        answer: '`this` is a special keyword that refers to the object that is currently executing the function. Its value depends on HOW the function is called (not where it\'s defined). In global scope: `window` (browser) or `global` (Node). In methods: the owning object. In arrow functions: inherited from enclosing scope.',
      },
      {
        id: 26,
        question: 'this in global scope',
        answer: 'In non-strict mode, `this` in global scope refers to the global object (`window` in browsers, `globalThis` universally). In strict mode (`"use strict"`), `this` is `undefined` in regular functions.',
        example: `// Browser global scope
console.log(this === window); // true

// Strict mode
"use strict";
function check() {
  console.log(this); // undefined
}`,
      },
      {
        id: 27,
        question: 'this inside object method',
        answer: 'When a function is called as a method of an object (`obj.method()`), `this` refers to that object. If the method is extracted and called standalone, `this` is lost.',
        example: `const user = {
  name: "Govind",
  greet() {
    console.log(this.name); // "Govind" — this = user
  }
};
user.greet();

// Extracted — this is lost
const fn = user.greet;
fn(); // undefined (this is global/undefined)`,
      },
      {
        id: 28,
        question: 'this inside arrow function',
        answer: 'Arrow functions don\'t have their own `this`. They inherit `this` from the enclosing lexical scope (where they were defined). This makes them ideal for callbacks where you want to preserve the outer `this`.',
        example: `const team = {
  name: "QA",
  members: ["A", "B"],
  show() {
    this.members.forEach((m) => {
      console.log(\`\${m} in \${this.name}\`); // arrow inherits 'this' from show()
    });
  }
};
team.show(); // "A in QA", "B in QA"`,
      },
      {
        id: 29,
        question: 'this inside constructor function',
        answer: 'In a constructor (called with `new`), `this` refers to the newly created instance. The constructor creates a new empty object, sets `this` to it, and returns it implicitly.',
        example: `function User(name) {
  this.name = name; // 'this' is the new object
}
const u = new User("Prameela");
console.log(u.name); // "Prameela"`,
      },
      {
        id: 30,
        question: 'this with call, apply, bind',
        answer: '`call(thisArg, arg1, arg2)` — calls function with explicit `this` and individual args. `apply(thisArg, [args])` — same but args as array. `bind(thisArg)` — returns a NEW function with `this` permanently bound (doesn\'t call it).',
        example: `function greet(greeting) {
  console.log(\`\${greeting}, \${this.name}\`);
}
const user = { name: "Hemant" };

greet.call(user, "Hello");   // "Hello, Hemant"
greet.apply(user, ["Hi"]);   // "Hi, Hemant"

const bound = greet.bind(user);
bound("Hey");                // "Hey, Hemant"`,
      },
      {
        id: 31,
        question: 'Why arrow functions are preferred in callbacks',
        answer: 'Arrow functions inherit `this` from their enclosing scope, so you don\'t lose context inside callbacks like `setTimeout`, `forEach`, `map`, or event listeners. With normal functions, you\'d need `bind`, a `self = this` variable, or `that = this` pattern.',
      },
      {
        id: 32,
        question: 'this in event handlers',
        answer: 'In DOM event handlers, `this` refers to the element that the listener is attached to. With arrow functions, `this` is inherited from the enclosing scope instead. In Playwright, this rarely matters since you use `page.on()` with arrow callbacks.',
      },
      {
        id: 33,
        question: 'Common this-related bugs in automation',
        answer: 'Common bugs: (1) Extracting a method from a page object and losing `this`. (2) Using `function()` instead of `() =>` in `setTimeout`/callbacks inside class methods. (3) Forgetting that arrow functions in object literals inherit outer `this`, not the object. Fix: use arrow functions or `.bind(this)`.',
      },
    ],
  },

  // ─── SECTION 5: OBJECTS & PROTOTYPES ───────────────────────────────
  {
    id: 5,
    title: 'Objects & Prototypes',
    icon: '🏗️',
    questions: [
      {
        id: 34,
        question: 'Object creation methods',
        answer: 'Four ways: (1) Object literal `{}`, (2) `new Object()`, (3) `Object.create(proto)` — creates with specified prototype, (4) Constructor function / class with `new`. Object literal is most common for simple objects; classes for complex ones.',
        example: `// 1. Literal
const a = { name: "A" };

// 2. Constructor
const b = new Object(); b.name = "B";

// 3. Object.create
const proto = { greet() { return "Hi"; } };
const c = Object.create(proto);

// 4. Class
class User { constructor(name) { this.name = name; } }
const d = new User("D");`,
      },
      {
        id: 35,
        question: 'Object literal vs constructor function',
        answer: 'Object literal creates a single object directly. Constructor function is a template for creating multiple objects with `new` — it sets up `this` and the prototype chain. Use literals for one-off objects, constructors/classes for reusable patterns like Page Object Models.',
      },
      {
        id: 36,
        question: 'What is prototype',
        answer: 'Every JS object has a hidden `[[Prototype]]` link (accessible via `__proto__` or `Object.getPrototypeOf()`). When you access a property that doesn\'t exist on an object, JS looks up the prototype chain. Functions have a `.prototype` property that becomes `__proto__` of instances created with `new`.',
      },
      {
        id: 37,
        question: 'Prototype chain',
        answer: 'The prototype chain is the linked list of objects JavaScript traverses when looking up a property. `obj → obj.__proto__ → obj.__proto__.__proto__ → ... → Object.prototype → null`. If a property isn\'t found anywhere in the chain, `undefined` is returned.',
      },
      {
        id: 38,
        question: 'How inheritance works in JS',
        answer: 'JavaScript uses prototypal inheritance (not classical). Objects inherit directly from other objects via the prototype chain. ES6 `class extends` is syntactic sugar over prototype-based inheritance. `super()` calls the parent constructor.',
        example: `class Animal {
  constructor(name) { this.name = name; }
  speak() { return \`\${this.name} makes a sound\`; }
}

class Dog extends Animal {
  speak() { return \`\${this.name} barks\`; }
}

const d = new Dog("Rex");
console.log(d.speak()); // "Rex barks"
console.log(d instanceof Animal); // true`,
      },
      {
        id: 39,
        question: 'hasOwnProperty',
        answer: '`obj.hasOwnProperty("key")` returns `true` only if the property exists directly on the object (not inherited from the prototype). Useful for filtering own properties in `for...in` loops.',
        example: `const obj = { a: 1 };
console.log(obj.hasOwnProperty("a"));        // true
console.log(obj.hasOwnProperty("toString")); // false (inherited)`,
      },
      {
        id: 40,
        question: 'Object.freeze vs Object.seal',
        answer: '`Object.freeze()`: No adding, removing, or modifying properties (fully immutable, shallow). `Object.seal()`: No adding or removing properties, but existing properties CAN be modified. Both are shallow — nested objects are not affected.',
        example: `const frozen = Object.freeze({ a: 1, b: { c: 2 } });
frozen.a = 99;    // Silently fails
frozen.b.c = 99;  // Works! (shallow freeze)

const sealed = Object.seal({ x: 1 });
sealed.x = 99;    // Works — modification allowed
// sealed.y = 2;  // Fails — no new properties`,
      },
      {
        id: 41,
        question: 'Shallow copy vs deep copy',
        answer: 'Shallow copy copies top-level properties; nested objects still share references. Deep copy recursively copies everything — no shared references. Shallow: spread, `Object.assign`. Deep: `structuredClone()`, `JSON.parse(JSON.stringify())` (loses functions/undefined), or libraries.',
        example: `// Shallow copy
const original = { a: 1, nested: { b: 2 } };
const shallow = { ...original };
shallow.nested.b = 99;
console.log(original.nested.b); // 99 — shared reference!

// Deep copy
const deep = structuredClone(original);
deep.nested.b = 42;
console.log(original.nested.b); // 99 — independent`,
      },
      {
        id: 42,
        question: 'Ways to clone objects',
        answer: 'Shallow: `{ ...obj }`, `Object.assign({}, obj)`. Deep: `structuredClone(obj)` (modern, handles circular refs), `JSON.parse(JSON.stringify(obj))` (loses functions, undefined, Date becomes string). Libraries: Lodash `_.cloneDeep()`.',
      },
      {
        id: 43,
        question: 'Object.assign vs spread operator',
        answer: 'Both create shallow copies. `Object.assign(target, ...sources)` mutates the target and returns it. Spread `{ ...obj }` always creates a new object. Spread is preferred for immutability. Both handle same-key overwrites left-to-right.',
        example: `const a = { x: 1 };
const b = { y: 2 };

// Object.assign mutates first argument
const result1 = Object.assign(a, b);
console.log(a); // { x: 1, y: 2 } — a is mutated!

// Spread creates new object
const result2 = { ...a, ...b };
// a is NOT mutated`,
      },
    ],
  },

  // ─── SECTION 6: ARRAYS ─────────────────────────────────────────────
  {
    id: 6,
    title: 'Arrays',
    icon: '📋',
    questions: [
      {
        id: 44,
        question: 'map vs forEach vs filter',
        answer: '`map` transforms each element and returns a NEW array. `forEach` executes a function for each element but returns `undefined` (side effects only). `filter` returns a NEW array with only elements that pass the test. Use `map` for transformation, `filter` for selection, `forEach` for side effects.',
        example: `const nums = [1, 2, 3, 4, 5];

const doubled = nums.map(n => n * 2);       // [2, 4, 6, 8, 10]
const evens = nums.filter(n => n % 2 === 0); // [2, 4]
nums.forEach(n => console.log(n));            // logs 1,2,3,4,5, returns undefined`,
      },
      {
        id: 45,
        question: 'When to use reduce',
        answer: 'Use `reduce` when you need to accumulate array elements into a single value: sum, product, grouping, flattening, building objects from arrays, counting occurrences, etc. It\'s the most versatile array method.',
        example: `const nums = [1, 2, 3, 4];
const sum = nums.reduce((acc, n) => acc + n, 0); // 10

// Group by property
const items = [{type: "a"}, {type: "b"}, {type: "a"}];
const grouped = items.reduce((acc, item) => {
  acc[item.type] = (acc[item.type] || 0) + 1;
  return acc;
}, {});
console.log(grouped); // { a: 2, b: 1 }`,
      },
      {
        id: 46,
        question: 'Implement map using reduce',
        answer: 'You can implement `map` with `reduce` by accumulating transformed elements into a new array.',
        example: `function myMap(arr, fn) {
  return arr.reduce((acc, item, index) => {
    acc.push(fn(item, index));
    return acc;
  }, []);
}

console.log(myMap([1, 2, 3], n => n * 2)); // [2, 4, 6]`,
      },
      {
        id: 47,
        question: 'find vs filter',
        answer: '`find` returns the FIRST element matching the condition (or `undefined`). `filter` returns ALL matching elements as an array (or empty array). Use `find` when you need one result, `filter` for multiple.',
        example: `const users = [{name: "A", age: 20}, {name: "B", age: 25}, {name: "C", age: 20}];

const first20 = users.find(u => u.age === 20);  // {name: "A", age: 20}
const all20 = users.filter(u => u.age === 20);  // [{name: "A"...}, {name: "C"...}]`,
      },
      {
        id: 48,
        question: 'some vs every',
        answer: '`some` returns `true` if at least ONE element passes the test (short-circuits on first match). `every` returns `true` only if ALL elements pass (short-circuits on first failure).',
        example: `const nums = [1, 2, 3, 4, 5];
console.log(nums.some(n => n > 4));  // true (5 > 4)
console.log(nums.every(n => n > 0)); // true (all positive)
console.log(nums.every(n => n > 3)); // false (1, 2, 3 fail)`,
      },
      {
        id: 49,
        question: 'slice vs splice',
        answer: '`slice(start, end)` returns a shallow copy of a portion — DOES NOT mutate. `splice(start, deleteCount, ...items)` modifies the original array — removes/inserts elements and MUTATES.',
        example: `const arr = [1, 2, 3, 4, 5];

// slice — non-mutating
const sliced = arr.slice(1, 3); // [2, 3]
console.log(arr);                // [1, 2, 3, 4, 5] — unchanged

// splice — mutating
const removed = arr.splice(1, 2); // removes [2, 3]
console.log(arr);                  // [1, 4, 5] — mutated!`,
      },
      {
        id: 50,
        question: 'indexOf vs findIndex',
        answer: '`indexOf(value)` searches by value using `===`. `findIndex(callback)` searches using a callback function — more flexible for objects and complex conditions.',
        example: `const nums = [10, 20, 30];
console.log(nums.indexOf(20));              // 1
console.log(nums.findIndex(n => n > 15));   // 1

const users = [{id: 1}, {id: 2}];
// indexOf won't work for objects
console.log(users.findIndex(u => u.id === 2)); // 1`,
      },
      {
        id: 51,
        question: 'Sorting numbers correctly',
        answer: 'Default `sort()` converts elements to strings and sorts lexicographically. For numbers, you MUST provide a comparator. `a - b` for ascending, `b - a` for descending.',
        example: `const nums = [10, 1, 21, 2];
console.log(nums.sort());          // [1, 10, 2, 21] — WRONG! (string sort)
console.log(nums.sort((a, b) => a - b)); // [1, 2, 10, 21] — correct`,
      },
      {
        id: 52,
        question: 'Remove duplicates from array',
        answer: 'Use `Set`: `[...new Set(array)]`. For objects, use `filter` with a `Set` tracking seen keys, or `reduce`.',
        example: `const arr = [1, 2, 2, 3, 3, 3];
const unique = [...new Set(arr)]; // [1, 2, 3]

// For objects by key
const users = [{id:1}, {id:2}, {id:1}];
const seen = new Set();
const uniqueUsers = users.filter(u => {
  if (seen.has(u.id)) return false;
  seen.add(u.id);
  return true;
});`,
      },
      {
        id: 53,
        question: 'Flatten array',
        answer: '`arr.flat(depth)` flattens nested arrays. `Infinity` for fully flat. Or use `reduce` + `concat` recursively.',
        example: `const nested = [1, [2, [3, [4]]]];
console.log(nested.flat());        // [1, 2, [3, [4]]]
console.log(nested.flat(2));       // [1, 2, 3, [4]]
console.log(nested.flat(Infinity)); // [1, 2, 3, 4]`,
      },
      {
        id: 54,
        question: 'Mutating vs non-mutating methods',
        answer: 'Mutating (change original): `push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`, `fill`. Non-mutating (return new): `map`, `filter`, `slice`, `concat`, `flat`, `reduce`, `find`, `every`, `some`. Prefer non-mutating for predictable code.',
      },
      {
        id: 55,
        question: 'Time complexity of array operations',
        answer: 'Access by index: O(1). `push`/`pop`: O(1). `shift`/`unshift`: O(n). `find`/`indexOf`/`includes`: O(n). `sort`: O(n log n). `splice` (middle): O(n). For frequent lookups by key, use `Map` or `Set` (O(1)) instead of arrays.',
      },
    ],
  },

  // ─── SECTION 7: CLOSURES ───────────────────────────────────────────
  {
    id: 7,
    title: 'Closures',
    icon: '🔒',
    questions: [
      {
        id: 56,
        question: 'What is closure',
        answer: 'A closure is a function that remembers and has access to variables from its outer (enclosing) scope, even after the outer function has returned. Every function in JS creates a closure. It\'s how private state works in JS.',
        example: `function createCounter() {
  let count = 0; // private via closure
  return {
    increment: () => ++count,
    getCount: () => count,
  };
}
const counter = createCounter();
counter.increment();
counter.increment();
console.log(counter.getCount()); // 2
// count is not accessible directly`,
      },
      {
        id: 57,
        question: 'Why closures are useful',
        answer: 'Closures enable: (1) Data privacy / encapsulation, (2) Factory functions, (3) Callback patterns, (4) Partial application / currying, (5) Module pattern. In Playwright, closures are used in fixtures, custom helpers, and maintaining test state.',
      },
      {
        id: 58,
        question: 'Real-world closure examples',
        answer: 'Rate limiters, memoization, event handlers with state, API request builders, test data generators, private variables in module pattern.',
        example: `// Memoization
function memoize(fn) {
  const cache = {};
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache[key]) return cache[key];
    return cache[key] = fn(...args);
  };
}
const expensiveCalc = memoize((n) => n * n);`,
      },
      {
        id: 59,
        question: 'Closures in loops',
        answer: 'Classic gotcha: `var` in a loop creates one shared variable. All closures reference the same `i`. Fix: use `let` (block-scoped) or an IIFE to capture the value per iteration.',
        example: `// Bug with var
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 3, 3, 3
}

// Fix with let
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 0, 1, 2
}`,
      },
      {
        id: 60,
        question: 'Memory leaks due to closures',
        answer: 'Closures keep references to outer variables alive, preventing garbage collection. If a closure references a large object that\'s no longer needed, it causes a memory leak. Fix: set references to `null` when done, avoid capturing unnecessary variables.',
      },
      {
        id: 61,
        question: 'Closures with setTimeout',
        answer: 'When `setTimeout` uses a closure, the callback captures variables from the outer scope. With `var`, all timeouts share the same variable. With `let`, each iteration gets its own copy.',
        example: `function delayedGreet(names) {
  names.forEach((name, i) => {
    setTimeout(() => {
      console.log(\`Hello, \${name}!\`); // closure captures 'name'
    }, i * 1000);
  });
}
delayedGreet(["A", "B", "C"]); // logs each 1s apart`,
      },
      {
        id: 62,
        question: 'Closure vs scope',
        answer: 'Scope determines where variables are accessible at definition time. Closure is when a function retains access to its scope even after the outer function returns. Scope is the rule; closure is the mechanism that preserves it.',
      },
    ],
  },

  // ─── SECTION 8: EVENT LOOP & ASYNC JS ──────────────────────────────
  {
    id: 8,
    title: 'Event Loop & Async JS',
    icon: '🔄',
    questions: [
      {
        id: 63,
        question: 'What is the event loop',
        answer: 'The event loop is the mechanism that allows JavaScript (single-threaded) to handle async operations. It continuously checks: (1) Is the call stack empty? (2) If yes, move tasks from the microtask queue, then the macrotask queue, to the call stack for execution.',
      },
      {
        id: 64,
        question: 'Call stack',
        answer: 'The call stack is a LIFO (Last In, First Out) data structure that tracks function execution. When a function is called, it\'s pushed onto the stack. When it returns, it\'s popped off. JavaScript is single-threaded — only one thing runs at a time on the call stack.',
      },
      {
        id: 65,
        question: 'Callback queue',
        answer: 'The callback queue (macrotask queue) holds callbacks from `setTimeout`, `setInterval`, I/O, and DOM events. The event loop moves these to the call stack only when the stack is empty AND all microtasks are done.',
      },
      {
        id: 66,
        question: 'Microtask queue',
        answer: 'The microtask queue has higher priority than the macrotask queue. It holds: Promise `.then`/`.catch`/`.finally` callbacks, `queueMicrotask()`, `MutationObserver`. ALL microtasks are processed before the next macrotask.',
      },
      {
        id: 67,
        question: 'Macrotask vs microtask',
        answer: 'Macrotasks: `setTimeout`, `setInterval`, I/O, UI rendering. Microtasks: `Promise` callbacks, `queueMicrotask`, `MutationObserver`. Microtasks run BEFORE the next macrotask. This means a resolved Promise callback runs before a `setTimeout(..., 0)` callback.',
        example: `console.log("1");
setTimeout(() => console.log("2"), 0);       // macrotask
Promise.resolve().then(() => console.log("3")); // microtask
console.log("4");

// Output: 1, 4, 3, 2`,
      },
      {
        id: 68,
        question: 'Execution order examples',
        answer: 'Sync code runs first, then all microtasks (promises), then macrotasks (setTimeout). Nested microtasks are also processed before any macrotask.',
        example: `console.log("start");

setTimeout(() => console.log("timeout"), 0);

Promise.resolve()
  .then(() => console.log("promise 1"))
  .then(() => console.log("promise 2"));

console.log("end");

// Output: start, end, promise 1, promise 2, timeout`,
      },
    ],
  },

  // ─── SECTION 9: CALLBACKS ──────────────────────────────────────────
  {
    id: 9,
    title: 'Callbacks',
    icon: '📞',
    questions: [
      {
        id: 69,
        question: 'Callback hell',
        answer: 'Callback hell is deeply nested callbacks that make code hard to read, maintain, and debug. It looks like a pyramid/triangle shape. Solved by Promises and async/await.',
        example: `// Callback hell
getData(function(a) {
  getMore(a, function(b) {
    getEvenMore(b, function(c) {
      doSomething(c, function(d) {
        // Deeply nested = hard to maintain
      });
    });
  });
});`,
      },
      {
        id: 70,
        question: 'Inversion of control',
        answer: 'When you pass a callback, you give control of your code\'s execution to a third party. You trust that they\'ll call it at the right time, with the right arguments, and exactly once. Promises solve this by giving you a standardized contract (resolve/reject, exactly once).',
      },
      {
        id: 71,
        question: 'Problems with callbacks',
        answer: '(1) Callback hell — poor readability. (2) Inversion of control — trust issues. (3) Error handling is manual (no built-in `.catch`). (4) Hard to run things in parallel or sequence. (5) No standardized way to handle success/failure. Promises and async/await solve all these.',
      },
    ],
  },

  // ─── SECTION 10: PROMISES ──────────────────────────────────────────
  {
    id: 10,
    title: 'Promises',
    icon: '🤝',
    questions: [
      {
        id: 72,
        question: 'What is a Promise',
        answer: 'A Promise is an object representing the eventual completion (or failure) of an asynchronous operation. It\'s a placeholder for a value that will be available in the future. Created with `new Promise((resolve, reject) => { ... })`.',
        example: `const promise = new Promise((resolve, reject) => {
  setTimeout(() => resolve("Done!"), 1000);
});

promise.then(result => console.log(result)); // "Done!" after 1s`,
      },
      {
        id: 73,
        question: 'Promise states',
        answer: 'Three states: `pending` (initial — not yet settled), `fulfilled` (resolve was called — success), `rejected` (reject was called — failure). A promise can only transition from `pending` to `fulfilled` OR `rejected` — never back, and never between the two. This is called being "settled".',
      },
      {
        id: 74,
        question: 'then, catch, finally',
        answer: '`.then(onFulfilled, onRejected)` handles success (and optionally rejection). `.catch(onRejected)` handles rejection only. `.finally(onFinally)` runs regardless of outcome (cleanup). All return new Promises, enabling chaining.',
        example: `fetch("/api/data")
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error("Failed:", err))
  .finally(() => console.log("Request complete"));`,
      },
      {
        id: 75,
        question: 'Promise chaining',
        answer: 'Each `.then()` returns a new Promise, allowing you to chain operations. The return value of one `.then` becomes the input to the next. This flattens callback hell into a readable chain.',
        example: `Promise.resolve(1)
  .then(n => n + 1)  // 2
  .then(n => n * 3)  // 6
  .then(n => console.log(n)); // 6`,
      },
      {
        id: 76,
        question: 'Error handling in promises',
        answer: 'Errors propagate down the chain until caught by `.catch()`. A single `.catch()` at the end handles errors from any `.then()` above it. Always add `.catch()` to avoid unhandled promise rejections.',
      },
      {
        id: 77,
        question: 'Promise.all',
        answer: '`Promise.all([p1, p2, p3])` runs promises in parallel and resolves when ALL resolve (returns array of results). If ANY promise rejects, the whole thing rejects with that error. Use for independent parallel tasks.',
        example: `const results = await Promise.all([
  fetch("/api/users"),
  fetch("/api/posts"),
  fetch("/api/comments"),
]);
// All 3 fetched in parallel`,
      },
      {
        id: 78,
        question: 'Promise.allSettled',
        answer: '`Promise.allSettled([p1, p2])` waits for ALL promises to settle (fulfill or reject). Never rejects. Returns array of `{status, value}` or `{status, reason}` objects. Use when you need results from all promises regardless of individual failures.',
        example: `const results = await Promise.allSettled([
  Promise.resolve("OK"),
  Promise.reject("Fail"),
]);
// [{status: "fulfilled", value: "OK"}, {status: "rejected", reason: "Fail"}]`,
      },
      {
        id: 79,
        question: 'Promise.race',
        answer: '`Promise.race([p1, p2])` resolves or rejects as soon as the FIRST promise settles. Use for timeouts or taking the fastest response.',
        example: `const result = await Promise.race([
  fetch("/api/data"),
  new Promise((_, reject) => setTimeout(() => reject("Timeout"), 5000)),
]);`,
      },
      {
        id: 80,
        question: 'Promise.any',
        answer: '`Promise.any([p1, p2])` resolves with the first fulfilled promise (ignores rejections). Only rejects if ALL promises reject (`AggregateError`). Use when you need at least one success.',
      },
      {
        id: 81,
        question: 'When Promise.all fails',
        answer: '`Promise.all` rejects immediately when any promise rejects — other pending promises continue running but their results are discarded. This is "fail-fast" behavior. If you need all results regardless, use `Promise.allSettled`.',
      },
      {
        id: 82,
        question: 'Promise vs callback',
        answer: 'Promises improve on callbacks: (1) Standardized contract (resolve/reject), (2) Chainable (no nesting), (3) Built-in error propagation with `.catch()`, (4) Composable (`all`, `race`, `any`), (5) Works with `async/await` for sync-like syntax.',
      },
    ],
  },

  // ─── SECTION 11: ASYNC / AWAIT ─────────────────────────────────────
  {
    id: 11,
    title: 'Async / Await',
    icon: '⏳',
    questions: [
      {
        id: 83,
        question: 'What is async/await',
        answer: '`async/await` is syntactic sugar over Promises. `async` before a function makes it return a Promise. `await` pauses execution until the Promise settles. It makes async code look and behave like synchronous code, improving readability.',
        example: `async function fetchUser(id) {
  const response = await fetch(\`/api/users/\${id}\`);
  const user = await response.json();
  return user;
}`,
      },
      {
        id: 84,
        question: 'How async/await works internally',
        answer: '`async` wraps the function\'s return value in `Promise.resolve()`. `await` suspends the function execution (not the thread!) and resumes when the awaited Promise settles. Internally, it uses Promise `.then()` chaining — the code after `await` is like a `.then()` callback.',
      },
      {
        id: 85,
        question: 'Error handling with async/await',
        answer: 'Use `try/catch` blocks. When an awaited Promise rejects, it throws the rejection reason as an error inside the `try` block, which is caught by `catch`. Always wrap `await` calls in `try/catch` for production code.',
        example: `async function loadData() {
  try {
    const data = await fetch("/api/data");
    return await data.json();
  } catch (error) {
    console.error("Failed:", error.message);
    return null;
  }
}`,
      },
      {
        id: 86,
        question: 'Sequential vs parallel execution',
        answer: 'Sequential: `await` each call one after another — total time is sum of all. Parallel: start all calls first, then `await Promise.all()` — total time is the slowest one. Use parallel for independent operations.',
        example: `// Sequential — slow (3s total)
const a = await fetch("/api/a"); // 1s
const b = await fetch("/api/b"); // 1s
const c = await fetch("/api/c"); // 1s

// Parallel — fast (1s total)
const [x, y, z] = await Promise.all([
  fetch("/api/a"),
  fetch("/api/b"),
  fetch("/api/c"),
]);`,
      },
      {
        id: 87,
        question: 'await inside loops',
        answer: '`await` in a `for` loop runs sequentially (one at a time). `await` in `forEach` does NOT work (forEach ignores returned promises). Use `for...of` for sequential, `Promise.all` with `map` for parallel.',
        example: `// Sequential (correct)
for (const url of urls) {
  await fetch(url);
}

// Parallel (correct)
await Promise.all(urls.map(url => fetch(url)));

// BROKEN — forEach doesn't await
urls.forEach(async (url) => {
  await fetch(url); // fires all at once, not awaited
});`,
      },
      {
        id: 88,
        question: 'Top-level await',
        answer: 'Available in ES modules (not CommonJS). Allows `await` at the module level without wrapping in an `async` function. The module\'s execution pauses until the awaited promise settles. Other modules that import it will wait.',
      },
      {
        id: 89,
        question: 'async function return value',
        answer: 'An `async` function always returns a Promise. If you return a value, it\'s wrapped in `Promise.resolve(value)`. If you throw, it\'s wrapped in `Promise.reject(error)`.',
        example: `async function getNumber() {
  return 42; // same as Promise.resolve(42)
}

getNumber().then(n => console.log(n)); // 42`,
      },
      {
        id: 90,
        question: 'Mixing promises with async/await',
        answer: 'You can mix them freely. `await` works on any thenable (Promise). `.then()` works on async function return values. But avoid mixing in the same function for readability — pick one style.',
        example: `// Mixing — works but avoid if possible
async function mixed() {
  const result = await fetch("/api/data")
    .then(r => r.json())
    .catch(e => null);
  return result;
}`,
      },
    ],
  },

  // ─── SECTION 12: ERROR HANDLING ────────────────────────────────────
  {
    id: 12,
    title: 'Error Handling',
    icon: '🚨',
    questions: [
      {
        id: 91,
        question: 'try/catch/finally',
        answer: '`try` wraps code that might throw. `catch(error)` handles the error. `finally` runs regardless — used for cleanup (closing connections, resetting state). `finally` runs even if `try` or `catch` has a `return`.',
        example: `try {
  const data = JSON.parse("invalid");
} catch (error) {
  console.error("Parse failed:", error.message);
} finally {
  console.log("Cleanup done"); // always runs
}`,
      },
      {
        id: 92,
        question: 'Sync vs async errors',
        answer: 'Sync errors are caught by `try/catch` around the throwing code. Async errors (in Promises) are NOT caught by surrounding `try/catch` — use `.catch()` or `try/catch` with `await`. Uncaught async errors trigger `unhandledrejection` event.',
      },
      {
        id: 93,
        question: 'Error object properties',
        answer: '`message`: human-readable description. `name`: error type (TypeError, ReferenceError, etc.). `stack`: stack trace string (non-standard but universally supported). `cause`: optional linked error (ES2022).',
      },
      {
        id: 94,
        question: 'Custom error classes',
        answer: 'Extend `Error` class to create domain-specific errors. Set `this.name` in constructor. Useful for distinguishing error types in `catch` blocks.',
        example: `class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

try {
  throw new ValidationError("email", "Invalid email format");
} catch (e) {
  if (e instanceof ValidationError) {
    console.log(\`\${e.field}: \${e.message}\`);
  }
}`,
      },
      {
        id: 95,
        question: 'throw vs return',
        answer: '`throw` immediately stops execution and propagates up the call stack until caught. `return` normally exits a function with a value. Use `throw` for unexpected/unrecoverable errors; use `return` with error objects/null for expected failures.',
      },
      {
        id: 96,
        question: 'Error bubbling',
        answer: 'When an error is thrown, it propagates up the call stack through each function until caught by a `try/catch`. If never caught, it becomes an uncaught exception and crashes the program (Node) or shows in console (browser).',
      },
      {
        id: 97,
        question: 'Global error handling',
        answer: 'Browser: `window.onerror` for sync, `window.onunhandledrejection` for async. Node.js: `process.on("uncaughtException")` and `process.on("unhandledRejection")`. In Playwright tests, unhandled errors fail the test automatically.',
      },
      {
        id: 98,
        question: 'Handling rejected promises',
        answer: 'Use `.catch()` on the promise chain or `try/catch` with `await`. Always handle rejections — unhandled rejections crash Node.js (v15+) and show warnings in browsers. Playwright treats unhandled rejections as test failures.',
      },
      {
        id: 99,
        question: 'Error handling best practices in automation',
        answer: '(1) Use `try/catch` around flaky operations. (2) Add meaningful error messages with context. (3) Take screenshots on failure. (4) Don\'t catch and swallow errors silently. (5) Use custom error classes for test failures vs infra failures. (6) Let assertion errors propagate naturally.',
      },
    ],
  },

  // ─── SECTION 13: ES6+ FEATURES ────────────────────────────────────
  {
    id: 13,
    title: 'ES6+ Features',
    icon: '✨',
    questions: [
      {
        id: 100,
        question: 'Destructuring',
        answer: 'Extract values from arrays/objects into distinct variables. Array destructuring uses position; object destructuring uses property names. Supports defaults, renaming, and nesting.',
        example: `// Object destructuring
const { name, age, city = "Unknown" } = { name: "Govind", age: 25 };

// Array destructuring
const [first, , third] = [1, 2, 3]; // skip second

// Renaming
const { name: userName } = { name: "Govind" };

// Nested
const { address: { street } } = { address: { street: "Main St" } };`,
      },
      {
        id: 101,
        question: 'Default values',
        answer: 'Destructuring defaults kick in when the value is `undefined` (not `null` or other falsy values). Function parameter defaults work the same way.',
        example: `const { x = 10, y = 20 } = { x: 5 };
console.log(x, y); // 5, 20

// null does NOT trigger default
const { z = 30 } = { z: null };
console.log(z); // null (not 30)`,
      },
      {
        id: 102,
        question: 'Spread operator',
        answer: 'Expands iterables (arrays, objects) into individual elements. Used for copying, merging, and passing array elements as function arguments.',
        example: `// Arrays
const a = [1, 2], b = [3, 4];
const merged = [...a, ...b]; // [1, 2, 3, 4]

// Objects
const base = { timeout: 30000 };
const config = { ...base, retries: 2 }; // merge

// Function args
const nums = [3, 1, 2];
console.log(Math.max(...nums)); // 3`,
      },
      {
        id: 103,
        question: 'Rest operator',
        answer: 'Collects remaining elements into an array (in function params) or object (in destructuring). Opposite of spread.',
        example: `// Function rest
function log(first, ...rest) {
  console.log(first); // 1
  console.log(rest);  // [2, 3, 4]
}
log(1, 2, 3, 4);

// Destructuring rest
const { a, ...others } = { a: 1, b: 2, c: 3 };
console.log(others); // { b: 2, c: 3 }`,
      },
      {
        id: 104,
        question: 'Template literals',
        answer: 'Backtick strings that support: embedded expressions `${expr}`, multi-line strings, and tagged templates. Far more readable than string concatenation.',
        example: `const name = "Govind";
const greeting = \`Hello, \${name}!
Welcome to the course.\`;
// Multi-line + interpolation

// Expression inside
console.log(\`Total: \${2 + 3}\`); // "Total: 5"`,
      },
      {
        id: 105,
        question: 'Optional chaining',
        answer: '`?.` safely accesses nested properties without throwing if intermediate values are `null` or `undefined`. Returns `undefined` instead of throwing. Works with properties, methods, and bracket notation.',
        example: `const user = { address: { city: "Mumbai" } };
console.log(user?.address?.city);    // "Mumbai"
console.log(user?.phone?.number);    // undefined (no error)
console.log(user?.getName?.());      // undefined (method doesn't exist)`,
      },
      {
        id: 106,
        question: 'Nullish coalescing',
        answer: '`??` returns the right-hand value only when the left is `null` or `undefined` (not for other falsy values like `0`, `""`, `false`). Use `??` for defaults where `0` or `""` are valid values.',
        example: `console.log(null ?? "default");   // "default"
console.log(undefined ?? "default"); // "default"
console.log(0 ?? "default");     // 0 (not falsy-triggered!)
console.log("" ?? "default");    // "" (not falsy-triggered!)

// Compare with ||
console.log(0 || "default");     // "default" (0 is falsy)`,
      },
      {
        id: 107,
        question: 'Modules',
        answer: 'ES Modules use `import/export` for code organization. Each file is a module with its own scope. `export` makes things available; `import` brings them in. Supports named exports, default exports, and re-exports.',
      },
      {
        id: 108,
        question: 'Named vs default exports',
        answer: 'Named: `export { thing }` / `import { thing }` — must match name, can have multiple per file. Default: `export default thing` / `import thing` — can use any name, only one per file. Prefer named exports for better tooling support.',
      },
      {
        id: 109,
        question: 'Tree shaking',
        answer: 'Tree shaking is dead code elimination — bundlers (Webpack, Vite) remove unused exports from the final bundle. Only works with ES modules (static `import/export`), not CommonJS `require()`. Named exports tree-shake better than default exports.',
      },
    ],
  },

  // ─── SECTION 14: TYPESCRIPT FUNDAMENTALS ───────────────────────────
  {
    id: 14,
    title: 'TypeScript Fundamentals',
    icon: '🔷',
    questions: [
      {
        id: 110,
        question: 'Why TypeScript',
        answer: 'TypeScript adds static types to JavaScript, catching errors at compile time instead of runtime. Benefits: better IDE support (autocomplete, refactoring), self-documenting code, fewer bugs, easier maintenance of large codebases. Essential for Playwright — the API is fully typed.',
      },
      {
        id: 111,
        question: 'JS vs TS',
        answer: 'JS is dynamically typed (types checked at runtime). TS is statically typed (types checked at compile time). TS is a superset of JS — all JS is valid TS. TS compiles to JS for execution. TS adds: types, interfaces, enums, generics, access modifiers, and more.',
      },
      {
        id: 112,
        question: 'What happens to TS at runtime',
        answer: 'Nothing — TypeScript types are completely erased during compilation. The runtime code is plain JavaScript. Types are development-time only. This means you cannot check types at runtime using TS syntax (use `typeof`, `instanceof`, or type guards instead).',
      },
      {
        id: 113,
        question: 'Type inference',
        answer: 'TypeScript automatically infers types from assigned values. You don\'t need to annotate everything. `let x = 5` infers `number`. Function return types are inferred from `return` statements. Hover over variables in your IDE to see inferred types.',
        example: `let name = "Govind";      // inferred: string
let count = 42;            // inferred: number
let items = [1, 2, 3];    // inferred: number[]
let user = { name: "A" }; // inferred: { name: string }

function add(a: number, b: number) {
  return a + b; // return type inferred as number
}`,
      },
      {
        id: 114,
        question: 'Explicit vs implicit typing',
        answer: 'Explicit: you annotate the type yourself (`let x: string = "hello"`). Implicit: TypeScript infers it (`let x = "hello"`). Best practice: let TS infer where obvious, annotate function parameters, complex types, and public APIs.',
      },
      {
        id: 115,
        question: 'any vs unknown',
        answer: '`any` disables all type checking — anything goes. `unknown` is the type-safe version: you must narrow the type before using it. Prefer `unknown` for values from external sources (API responses, user input).',
        example: `// any — dangerous, no checks
let x: any = "hello";
x.toFixed(2); // No error at compile time, crashes at runtime!

// unknown — safe, must narrow first
let y: unknown = "hello";
// y.toFixed(2); // Error: Object is of type 'unknown'
if (typeof y === "string") {
  y.toUpperCase(); // OK after narrowing
}`,
      },
      {
        id: 116,
        question: 'never type',
        answer: '`never` represents values that never occur. Used for: functions that never return (infinite loops, always throw), exhaustive type checking in switch statements. If a variable is `never`, all code paths have been handled.',
        example: `function throwError(msg: string): never {
  throw new Error(msg); // never returns
}

// Exhaustive check
type Status = "active" | "inactive";
function check(s: Status) {
  switch (s) {
    case "active": return "OK";
    case "inactive": return "OFF";
    default:
      const _exhaustive: never = s; // Error if a case is missing
  }
}`,
      },
      {
        id: 117,
        question: 'Union types',
        answer: 'A union type allows a variable to be one of several types: `string | number`. Use the `|` operator. Must narrow the type before using type-specific methods.',
        example: `function format(input: string | number): string {
  if (typeof input === "string") return input.toUpperCase();
  return input.toFixed(2);
}
console.log(format("hello")); // "HELLO"
console.log(format(3.14));    // "3.14"`,
      },
      {
        id: 118,
        question: 'Intersection types',
        answer: 'An intersection type combines multiple types into one: `TypeA & TypeB`. The result must satisfy ALL combined types. Used for mixing types together.',
        example: `type HasName = { name: string };
type HasAge = { age: number };
type Person = HasName & HasAge;

const p: Person = { name: "Govind", age: 25 }; // Must have both`,
      },
      {
        id: 119,
        question: 'Type alias vs interface',
        answer: 'Both define custom types. `interface` supports declaration merging (adding properties later) and `extends`. `type` supports unions, intersections, mapped types, and primitives. Use `interface` for object shapes, `type` for everything else.',
      },
      {
        id: 120,
        question: 'Optional properties',
        answer: 'Use `?` to mark a property as optional. The type becomes `T | undefined`. Optional properties don\'t need to be provided when creating the object.',
        example: `interface User {
  name: string;
  email: string;
  phone?: string; // optional
}

const u: User = { name: "A", email: "a@b.com" }; // OK without phone`,
      },
      {
        id: 121,
        question: 'Readonly properties',
        answer: '`readonly` prevents reassignment after initialization. Only enforced at compile time (not runtime). Use for constants, config objects, and immutable data.',
        example: `interface Config {
  readonly apiUrl: string;
  readonly timeout: number;
}

const config: Config = { apiUrl: "https://api.com", timeout: 30000 };
// config.apiUrl = "new"; // Error: Cannot assign to 'apiUrl'`,
      },
    ],
  },

  // ─── SECTION 15: ADVANCED TYPESCRIPT ───────────────────────────────
  {
    id: 15,
    title: 'Advanced TypeScript',
    icon: '🔶',
    questions: [
      { id: 122, question: 'Interface merging', answer: 'When two interfaces with the same name are declared in the same scope, TypeScript merges them — combining all properties. This is called declaration merging. Useful for extending third-party types. `type` aliases do NOT support merging.', example: `interface User { name: string; }\ninterface User { age: number; } // merged\n// User now has both name and age\nconst u: User = { name: "A", age: 25 };` },
      { id: 123, question: 'Interface vs type', answer: '`interface`: declaration merging, `extends`, better for object shapes and public APIs. `type`: unions (`|`), intersections (`&`), mapped types, primitives, tuples. Both can describe objects. Rule of thumb: use `interface` for objects, `type` for everything else.' },
      { id: 124, question: 'implements vs extends', answer: '`extends` creates a subclass that inherits implementation. `implements` forces a class to satisfy an interface\'s shape without inheriting any code. A class can `extends` one class and `implements` multiple interfaces.', example: `interface Printable { print(): void; }\nclass Report implements Printable {\n  print() { console.log("Printing..."); }\n}\n\nclass DetailedReport extends Report {\n  detail() { console.log("Details"); }\n}` },
      { id: 125, question: 'Abstract classes', answer: 'Abstract classes cannot be instantiated directly — they serve as base classes. They can have abstract methods (no implementation, subclasses must implement) and concrete methods (with implementation). Use for shared logic with enforced contracts.', example: `abstract class BasePage {\n  abstract url: string;\n  async navigate() { console.log(\`Going to \${this.url}\`); }\n}\n\nclass LoginPage extends BasePage {\n  url = "/login";\n}` },
      { id: 126, question: 'Access modifiers', answer: '`public` (default) — accessible everywhere. `private` — only within the class. `protected` — within class and subclasses. These are compile-time only (JS has no native private except `#`).', example: `class Account {\n  public name: string;\n  private balance: number;\n  protected id: string;\n\n  constructor(name: string, balance: number) {\n    this.name = name;\n    this.balance = balance;\n    this.id = crypto.randomUUID();\n  }\n\n  getBalance() { return this.balance; } // OK — same class\n}` },
      { id: 127, question: 'Static properties', answer: '`static` members belong to the class itself, not instances. Accessed via `ClassName.property`. Useful for utility methods, constants, and factory patterns.', example: `class Config {\n  static timeout = 30000;\n  static getDefault() { return { timeout: Config.timeout }; }\n}\nconsole.log(Config.timeout); // 30000` },
      { id: 128, question: 'Generics', answer: 'Generics allow creating reusable components that work with any type while maintaining type safety. Use `<T>` as a type parameter. Common in utility functions, data structures, and API responses.', example: `function first<T>(arr: T[]): T | undefined {\n  return arr[0];\n}\nconsole.log(first([1, 2, 3]));      // number\nconsole.log(first(["a", "b"]));     // string` },
      { id: 129, question: 'Generic constraints', answer: 'Use `extends` to constrain generics: `<T extends SomeType>`. This limits what types can be passed, while still being generic. Ensures the type has certain properties.', example: `function getLength<T extends { length: number }>(item: T): number {\n  return item.length;\n}\ngetLength("hello");  // 5\ngetLength([1, 2]);   // 2\n// getLength(42);    // Error: number has no length` },
      { id: 130, question: 'Utility types (Partial, Pick, Omit, Record)', answer: '`Partial<T>` — all properties optional. `Required<T>` — all required. `Pick<T, Keys>` — subset of properties. `Omit<T, Keys>` — exclude properties. `Record<K, V>` — object with keys K and values V.', example: `interface User {\n  name: string;\n  email: string;\n  age: number;\n}\n\ntype PartialUser = Partial<User>;        // all optional\ntype NameEmail = Pick<User, "name" | "email">;\ntype NoAge = Omit<User, "age">;\ntype Scores = Record<string, number>;    // { [key: string]: number }` },
      { id: 131, question: 'Enums', answer: 'Enums define a set of named constants. Numeric enums auto-increment from 0. String enums require explicit values. Use `const enum` for inline compilation (no runtime object). Prefer union types for simple cases.', example: `enum Status {\n  Pending = "PENDING",\n  Active = "ACTIVE",\n  Closed = "CLOSED",\n}\nconst s: Status = Status.Active; // "ACTIVE"` },
      { id: 132, question: 'Tuple vs array', answer: 'Arrays: variable-length, all elements same type (`number[]`). Tuples: fixed-length, each position has a specific type (`[string, number]`). Tuples are arrays with stricter typing.', example: `const pair: [string, number] = ["age", 25];\n// pair[0] is string, pair[1] is number\n// pair[2]; // Error — only 2 elements allowed` },
      { id: 133, question: 'Type narrowing', answer: 'Narrowing is refining a broad type to a more specific one inside a code block. TypeScript narrows automatically after type guards (`typeof`, `instanceof`, `in`), truthiness checks, and equality checks.', example: `function process(input: string | number) {\n  if (typeof input === "string") {\n    console.log(input.toUpperCase()); // narrowed to string\n  } else {\n    console.log(input.toFixed(2));    // narrowed to number\n  }\n}` },
      { id: 134, question: 'Type guards', answer: 'Type guards are expressions that narrow types at runtime. Built-in: `typeof`, `instanceof`, `in`. Custom: functions returning `value is Type` (type predicates).', example: `function isString(val: unknown): val is string {\n  return typeof val === "string";\n}\n\nfunction demo(x: unknown) {\n  if (isString(x)) {\n    console.log(x.toUpperCase()); // narrowed to string\n  }\n}` },
      { id: 135, question: 'instanceof vs typeof', answer: '`typeof` checks primitive types: `"string"`, `"number"`, `"boolean"`, `"object"`, `"function"`, `"undefined"`. `instanceof` checks if an object is an instance of a class/constructor (checks prototype chain). Use `typeof` for primitives, `instanceof` for classes.' },
      { id: 136, question: 'Non-null assertion', answer: 'The `!` postfix operator tells TypeScript a value is not `null` or `undefined`. Use sparingly — it bypasses type safety. Prefer proper null checks or optional chaining.', example: `const el = document.getElementById("app")!; // trust me, it exists\nel.textContent = "Hello"; // no null check needed` },
      { id: 137, question: 'Function overloading', answer: 'TypeScript supports function overloads — multiple signatures for different parameter types, with one implementation. The implementation must handle all overload cases.', example: `function format(value: string): string;\nfunction format(value: number): string;\nfunction format(value: string | number): string {\n  if (typeof value === "string") return value.toUpperCase();\n  return value.toFixed(2);\n}` },
    ],
  },

  // ─── SECTION 16: OOP CONCEPTS ──────────────────────────────────────
  {
    id: 16,
    title: 'OOP Concepts',
    icon: '🏛️',
    questions: [
      { id: 138, question: 'Class vs function constructor', answer: 'Classes (ES6) are syntactic sugar over function constructors. Both create objects with `new`. Classes: cleaner syntax, `extends`, `super`, access modifiers (TS), static methods. Function constructors: prototype-based, more flexible, older pattern.' },
      { id: 139, question: 'Constructor behavior', answer: 'The constructor runs when `new ClassName()` is called. It initializes instance properties. If no constructor is defined, a default empty one is used. In subclasses, `super()` MUST be called before using `this`.' },
      { id: 140, question: 'super keyword', answer: '`super()` in constructor calls the parent constructor. `super.method()` calls a parent method. In subclass constructors, `super()` must be called before accessing `this`.' },
      { id: 141, question: 'Method overriding', answer: 'A subclass can override a parent method by defining a method with the same name. The subclass version is called on instances. Use `super.method()` to call the parent\'s version within the override.' },
      { id: 142, question: 'Polymorphism', answer: 'Polymorphism means "many forms" — objects of different classes can be treated through a common interface. A parent type variable can hold instances of any subclass. Method calls are dispatched to the actual type at runtime.' },
      { id: 143, question: 'Encapsulation', answer: 'Encapsulation bundles data and methods together, hiding internal state behind a public API. In TS: `private` and `protected` fields. In JS: `#private` fields or closures. Prevents external code from depending on implementation details.' },
      { id: 144, question: 'Inheritance', answer: 'Inheritance allows a class to extend another, inheriting its properties and methods. Enables code reuse and specialization. Use `extends`. In Playwright, Page Object Model uses inheritance (BasePage → LoginPage).' },
      { id: 145, question: 'Abstraction', answer: 'Abstraction hides complex implementation details behind a simple interface. Users of a class don\'t need to know how it works internally. In TS, abstract classes and interfaces define contracts without implementation.' },
      { id: 146, question: 'Composition vs inheritance', answer: 'Inheritance: "is-a" relationship (Dog IS an Animal). Composition: "has-a" relationship (Car HAS an Engine). Composition is more flexible — combine behaviors by composing objects rather than building deep class hierarchies. Prefer composition over inheritance.', example: `// Composition\nclass Logger {\n  log(msg: string) { console.log(msg); }\n}\n\nclass TestHelper {\n  private logger = new Logger(); // HAS-A\n  run() { this.logger.log("Running test"); }\n}` },
    ],
  },

  // ─── SECTION 17: MEMORY & PERFORMANCE ──────────────────────────────
  {
    id: 17,
    title: 'Memory & Performance',
    icon: '⚡',
    questions: [
      { id: 147, question: 'Garbage collection', answer: 'JavaScript automatically frees memory when objects are no longer reachable (no references pointing to them). The GC uses mark-and-sweep: marks all reachable objects from roots (global, stack), then sweeps unmarked ones. You cannot control GC timing.' },
      { id: 148, question: 'Stack vs heap', answer: 'Stack: stores primitives and function call frames. Fixed size, fast (LIFO). Heap: stores objects and arrays. Dynamic size, slower. Variables on the stack hold references (pointers) to heap objects.' },
      { id: 149, question: 'Memory leaks', answer: 'Common causes: (1) Forgotten global variables, (2) Closures holding large objects, (3) Detached DOM nodes, (4) Event listeners not removed, (5) setInterval never cleared, (6) Large arrays/caches without eviction. In Playwright: not closing browser contexts leaks memory.' },
      { id: 150, question: 'Closures and memory', answer: 'Closures keep references to outer scope variables, preventing garbage collection. If a closure captures a large object it doesn\'t need, it causes a leak. Fix: only capture what you need, set large references to `null` after use.' },
      { id: 151, question: 'Performance optimization basics', answer: 'JS: avoid unnecessary object creation, use appropriate data structures (Map/Set for lookups), minimize DOM access, debounce/throttle events, use Web Workers for CPU tasks. Playwright: minimize page.evaluate calls, use locators (auto-wait), parallelize independent tests.' },
    ],
  },

  // ─── SECTION 18: PLAYWRIGHT-SPECIFIC JS/TS ─────────────────────────
  {
    id: 18,
    title: 'Playwright-Specific JS/TS',
    icon: '🎭',
    questions: [
      { id: 152, question: 'Why async/await is mandatory in Playwright', answer: 'All Playwright operations are asynchronous — they communicate with browsers over a protocol (CDP/WebSocket). Every action (click, fill, navigate) returns a Promise. Without `await`, actions fire without waiting for completion, causing race conditions and flaky tests.' },
      { id: 153, question: 'What happens if await is missed', answer: 'The action fires but code continues without waiting. This causes: (1) Actions executing out of order, (2) Assertions running before page updates, (3) Tests passing/failing randomly (flaky), (4) Unhandled promise rejections. Playwright will warn about floating promises.' },
      { id: 154, question: 'How Playwright auto-wait works', answer: 'Playwright automatically waits for elements to be actionable before performing actions. For clicks: waits for visible, stable, enabled, not obscured. For fill: waits for editable. For navigation: waits for load state. No need for manual waits in most cases.' },
      { id: 155, question: 'waitForTimeout vs auto-wait', answer: '`page.waitForTimeout(ms)` is a hard wait (anti-pattern) — wastes time or still too short. Auto-wait is intelligent — waits only as long as needed. Prefer auto-wait, `waitForSelector`, `waitForURL`, or `expect().toBeVisible()` over `waitForTimeout`.' },
      { id: 156, question: 'Error handling in Playwright', answer: 'Playwright throws on: timeout (element not found), navigation failure, assertion failure. Use `try/catch` for expected failures (e.g., optional elements). Let assertion errors propagate naturally for test failures. Use `test.fail()` for known broken tests.' },
      { id: 157, question: 'Retry mechanism', answer: 'Playwright config has `retries` setting — failed tests are automatically re-run. `expect` assertions have auto-retry with timeout. Use `toPass()` for custom retry logic. Don\'t retry inside tests — let the framework handle it.' },
      { id: 158, question: 'Handling flaky tests', answer: 'Root causes: timing issues, shared state, external dependencies, order-dependent tests. Fixes: (1) Use auto-wait properly, (2) Isolate test data, (3) Use `test.describe.serial` only when needed, (4) Add proper waits for network/animations, (5) Enable traces for debugging.' },
      { id: 159, question: 'Parallel execution issues', answer: 'Playwright runs tests in parallel workers by default. Issues: shared mutable state, database conflicts, port conflicts. Solutions: use unique test data per worker, use `test.describe.configure({ mode: "serial" })` for dependent tests, isolate state per worker.' },
      { id: 160, question: 'Promises inside loops', answer: 'Use `for...of` with `await` for sequential execution. Never use `forEach` with `async` callbacks (it doesn\'t await). Use `Promise.all` with `map` for parallel execution.', example: `// Correct: sequential\nfor (const item of items) {\n  await page.click(item);\n}\n\n// Correct: parallel\nawait Promise.all(urls.map(url => page.goto(url)));` },
      { id: 161, question: 'Why POM methods should be async', answer: 'Page Object Model methods wrap Playwright actions which are all async (Promises). If POM methods aren\'t async, callers can\'t `await` them, leading to floating promises and flaky tests. Always mark POM methods as `async` and `await` all Playwright calls inside them.' },
      { id: 162, question: 'Writing utilities in TS', answer: 'Type your utility functions: parameters, return types, generics. Export from a central `utils/` folder. Use interfaces for configs. Add proper error handling. Example utilities: retry helpers, data generators, custom waits, API helpers.' },
      { id: 163, question: 'TS benefits in Playwright', answer: 'Autocomplete for all Playwright APIs, catch selector/config typos at compile time, typed fixtures and page objects, better refactoring support, self-documenting test code, generic helpers with type safety.' },
      { id: 164, question: 'Custom fixtures', answer: 'Fixtures provide reusable setup/teardown for tests. Extend `test` with `test.extend<FixtureTypes>()`. Fixtures can be scoped to test or worker. They replace repetitive `beforeEach`/`afterEach` and support dependency injection.', example: `import { test as base } from "@playwright/test";\n\nconst test = base.extend<{ loginPage: LoginPage }>({\n  loginPage: async ({ page }, use) => {\n    const loginPage = new LoginPage(page);\n    await loginPage.goto();\n    await use(loginPage);\n  },\n});` },
      { id: 165, question: 'test.step usage', answer: '`test.step("name", async () => { ... })` groups actions into named steps in the test report. Makes reports more readable, helps identify which step failed. Steps can be nested.' },
    ],
  },

  // ─── SECTION 19: CODING QUESTIONS ──────────────────────────────────
  {
    id: 19,
    title: 'Coding Questions',
    icon: '💻',
    questions: [
      { id: 166, question: 'Reverse a string', answer: 'Split into characters, reverse the array, join back. Or use a loop from end to start.', example: `const reverse = (str: string) => str.split("").reverse().join("");\nconsole.log(reverse("Playwright")); // "thgirwyalP"\n\n// Without built-in reverse\nfunction reverseLoop(str: string): string {\n  let result = "";\n  for (let i = str.length - 1; i >= 0; i--) result += str[i];\n  return result;\n}` },
      { id: 167, question: 'Palindrome check', answer: 'Compare string with its reverse. Normalize by lowercasing and removing non-alphanumeric characters for real-world use.', example: `function isPalindrome(str: string): boolean {\n  const clean = str.toLowerCase().replace(/[^a-z0-9]/g, "");\n  return clean === clean.split("").reverse().join("");\n}\nconsole.log(isPalindrome("racecar"));  // true\nconsole.log(isPalindrome("A man a plan a canal Panama")); // true` },
      { id: 168, question: 'Count character occurrences', answer: 'Use a `Record` or `Map` to count each character.', example: `function countChars(str: string): Record<string, number> {\n  const counts: Record<string, number> = {};\n  for (const ch of str) {\n    counts[ch] = (counts[ch] || 0) + 1;\n  }\n  return counts;\n}\nconsole.log(countChars("hello")); // { h:1, e:1, l:2, o:1 }` },
      { id: 169, question: 'Remove duplicates from array', answer: 'Use `Set` for primitives. For objects, track seen keys with a `Set`.', example: `const unique = <T>(arr: T[]): T[] => [...new Set(arr)];\nconsole.log(unique([1, 2, 2, 3, 3])); // [1, 2, 3]` },
      { id: 170, question: 'Find max/min in array', answer: 'Use `Math.max/min` with spread, or `reduce`.', example: `const nums = [3, 1, 7, 2, 5];\nconsole.log(Math.max(...nums)); // 7\nconsole.log(Math.min(...nums)); // 1\n\n// With reduce\nconst max = nums.reduce((a, b) => a > b ? a : b);\nconsole.log(max); // 7` },
      { id: 171, question: 'Flatten nested array', answer: 'Use `Array.flat(Infinity)` or recursive reduce.', example: `const nested = [1, [2, [3, [4]]], 5];\nconsole.log(nested.flat(Infinity)); // [1, 2, 3, 4, 5]\n\n// Recursive\nfunction flatten(arr: any[]): any[] {\n  return arr.reduce((acc, item) =>\n    acc.concat(Array.isArray(item) ? flatten(item) : item), []);\n}` },
      { id: 172, question: 'Debounce function', answer: 'Debounce delays execution until after a pause in calls. Resets timer on each call. Used for search input, resize events.', example: `function debounce(fn: Function, delay: number) {\n  let timer: ReturnType<typeof setTimeout>;\n  return (...args: any[]) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), delay);\n  };\n}` },
      { id: 173, question: 'Throttle function', answer: 'Throttle limits execution to at most once per interval. Unlike debounce, it fires on the leading edge.', example: `function throttle(fn: Function, interval: number) {\n  let lastTime = 0;\n  return (...args: any[]) => {\n    const now = Date.now();\n    if (now - lastTime >= interval) {\n      lastTime = now;\n      fn(...args);\n    }\n  };\n}` },
      { id: 174, question: 'Deep clone object', answer: 'Use `structuredClone()` (modern), `JSON.parse(JSON.stringify())` (loses functions), or recursive clone.', example: `const original = { a: 1, nested: { b: 2 } };\nconst clone = structuredClone(original);\nclone.nested.b = 99;\nconsole.log(original.nested.b); // 2 (unchanged)` },
      { id: 175, question: 'Retry function', answer: 'Wrap an async function with retry logic — useful for flaky operations in tests.', example: `async function retry<T>(fn: () => Promise<T>, attempts: number): Promise<T> {\n  for (let i = 0; i < attempts; i++) {\n    try {\n      return await fn();\n    } catch (e) {\n      if (i === attempts - 1) throw e;\n      console.log(\`Retry \${i + 1}/\${attempts}\`);\n    }\n  }\n  throw new Error("Unreachable");\n}` },
      { id: 176, question: 'Promise timeout wrapper', answer: 'Race a promise against a timeout promise to enforce time limits.', example: `function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {\n  const timeout = new Promise<never>((_, reject) =>\n    setTimeout(() => reject(new Error(\`Timeout after \${ms}ms\`)), ms)\n  );\n  return Promise.race([promise, timeout]);\n}` },
      { id: 177, question: 'Custom waitForCondition', answer: 'Poll a condition function at intervals until it returns true or timeout.', example: `async function waitFor(\n  condition: () => boolean | Promise<boolean>,\n  timeout = 5000,\n  interval = 100\n): Promise<void> {\n  const start = Date.now();\n  while (Date.now() - start < timeout) {\n    if (await condition()) return;\n    await new Promise(r => setTimeout(r, interval));\n  }\n  throw new Error("Condition not met within timeout");\n}` },
      { id: 178, question: 'API retry logic with async/await', answer: 'Combine retry with backoff for API calls.', example: `async function fetchWithRetry(url: string, retries = 3): Promise<any> {\n  for (let i = 0; i < retries; i++) {\n    try {\n      const res = await fetch(url);\n      if (!res.ok) throw new Error(\`HTTP \${res.status}\`);\n      return await res.json();\n    } catch (e) {\n      if (i === retries - 1) throw e;\n      const delay = Math.pow(2, i) * 1000; // exponential backoff\n      await new Promise(r => setTimeout(r, delay));\n    }\n  }\n}` },
    ],
  },

  // ─── SECTIONS 20-30: Advanced/Playwright-specific (no numbered IDs in source) ──
  {
    id: 20,
    title: 'Test Runner & Execution Model',
    icon: '🏃',
    questions: [
      { id: 179, question: 'How Playwright test runner works internally', answer: 'Playwright Test uses worker processes (Node.js child processes) to run tests in parallel. Each worker gets a fresh Node.js environment. Tests in the same file run sequentially within a worker. Different files are distributed across workers.' },
      { id: 180, question: 'Worker process vs browser process', answer: 'Worker process: Node.js process running test code. Browser process: the actual Chromium/Firefox/WebKit. They communicate via WebSocket (CDP protocol). Test code runs in Node, browser actions run in the browser. They\'re separate processes.' },
      { id: 181, question: 'Test isolation per worker', answer: 'Each worker has its own memory space. Variables, imports, and state are isolated. Sharing state between workers requires external storage (files, databases). This prevents test interference but means you can\'t share in-memory data.' },
      { id: 182, question: 'How global variables behave in parallel tests', answer: 'Global variables are per-worker, not shared across workers. Each worker gets a fresh copy. Modifying a global in one test doesn\'t affect tests in other workers. Within the same worker, globals persist across test files — which can cause issues.' },
      { id: 183, question: 'Test lifecycle: beforeAll / beforeEach / afterEach / afterAll', answer: '`beforeAll`: runs once before all tests in a describe block (per worker). `beforeEach`: runs before every test. `afterEach`: runs after every test. `afterAll`: runs once after all tests. Use `beforeAll` for expensive setup (DB, login), `beforeEach` for per-test isolation.' },
      { id: 184, question: 'Why sharing state across tests is dangerous', answer: 'Tests should be independent. Sharing state means: (1) Test order matters, (2) One failure cascades, (3) Parallel execution breaks, (4) Debugging is harder. Each test should set up and tear down its own state.' },
      { id: 185, question: 'How Playwright handles retries internally', answer: 'On failure, Playwright re-runs the entire test (including beforeEach/afterEach). The test gets a fresh browser context. Previous attempts\' artifacts (traces, screenshots) are kept. `testInfo.retry` gives the current retry count.' },
    ],
  },

  {
    id: 21,
    title: 'Locators, Strict Mode & JS Implications',
    icon: '🎯',
    questions: [
      { id: 186, question: 'Why Playwright enforces strict mode by default', answer: 'Strict mode means locators must match exactly one element. If a locator matches multiple elements, Playwright throws an error instead of silently acting on the first one. This catches ambiguous selectors early, preventing tests from interacting with wrong elements.' },
      { id: 187, question: 'What happens if a locator resolves to multiple elements', answer: 'Playwright throws: "strict mode violation: locator resolved to N elements". Fix: make your locator more specific using `nth()`, `filter()`, `has()`, or more precise selectors like `getByRole` with name.' },
      { id: 188, question: 'Difference between locator vs elementHandle', answer: 'Locator: lazy, auto-waits, auto-retries, recommended. ElementHandle: eager (resolves immediately), can become stale if DOM changes, no auto-retry. Always prefer locators.' },
      { id: 189, question: 'Lazy evaluation of locators', answer: 'Locators don\'t query the DOM when created — they\'re lazy. The actual DOM query happens when you perform an action (click, fill) or assertion (toBeVisible). This means a locator created early can find elements added later.' },
      { id: 190, question: 'Why locators are not promises', answer: 'Creating a locator (`page.locator("...")`) is synchronous — no `await` needed. It\'s just building a query description. Only actions on locators (`.click()`, `.fill()`) are async and need `await`.' },
      { id: 191, question: 'Chained locators and evaluation timing', answer: 'Chained locators (`page.locator("div").locator("button")`) are also lazy. The full chain is evaluated together when an action is performed. Each part of the chain narrows the search scope.' },
      { id: 192, question: 'Auto-retries vs JS retry logic', answer: 'Playwright\'s `expect` assertions auto-retry for a configurable timeout. This is built into the assertion — no need for manual retry loops. Custom JS retry logic is only needed for non-standard scenarios like polling an API.' },
    ],
  },

  {
    id: 22,
    title: 'Async Pitfalls in Playwright',
    icon: '⚠️',
    questions: [
      { id: 193, question: 'Why await expect(locator).toBeVisible() works without await on locator', answer: 'The locator itself is synchronous (lazy). The `expect()` assertion is what\'s async — it polls the locator until the element matches the condition or times out. You only `await` the assertion, not the locator creation.' },
      { id: 194, question: 'Mixing .then() with await inside tests', answer: 'Mixing `.then()` and `await` in the same function creates confusing execution order. The `.then()` callback runs as a microtask, potentially interleaving with subsequent `await` calls. Stick to one style — prefer `await`.' },
      { id: 195, question: 'Using forEach with async callbacks (classic failure)', answer: '`Array.forEach` doesn\'t await async callbacks — all callbacks fire simultaneously, and forEach returns `undefined` immediately. Use `for...of` for sequential async, or `Promise.all(arr.map(...))` for parallel.' },
      { id: 196, question: 'Why Promise.all can break UI flows', answer: 'UI actions often must be sequential — click, then wait for navigation, then fill form. `Promise.all` runs them in parallel, causing race conditions. Use sequential `await` for dependent UI steps, `Promise.all` only for independent operations.' },
      { id: 197, question: 'Race conditions with navigation and clicks', answer: 'Clicking a link triggers navigation. If you `await click()` but don\'t `await` navigation, subsequent code may run on the old page. Use `Promise.all([page.waitForNavigation(), link.click()])` or `waitForURL` to handle this.' },
      { id: 198, question: 'Handling multiple tabs / popups', answer: 'Use `page.waitForEvent("popup")` before triggering the popup. The returned page object represents the new tab. Always `await` it. Close tabs explicitly to avoid resource leaks.', example: `const [popup] = await Promise.all([\n  page.waitForEvent("popup"),\n  page.click("a[target=_blank]"),\n]);\nawait popup.waitForLoadState();\nconsole.log(await popup.title());` },
      { id: 199, question: 'Why sleep-based waits cause flaky tests', answer: 'Hard waits (`waitForTimeout`) are either too short (test fails) or too long (wastes time). They don\'t account for variable load times, CI slowness, or network delays. Use auto-wait, `waitForSelector`, `waitForURL`, or assertion retries instead.' },
    ],
  },

  {
    id: 23,
    title: 'Fixtures, Context & Dependency Injection',
    icon: '🔧',
    questions: [
      { id: 200, question: 'What problem fixtures solve compared to beforeEach', answer: 'Fixtures: (1) Only set up when a test actually uses them (lazy), (2) Support dependency injection, (3) Can be scoped (test vs worker), (4) Encapsulate setup AND teardown together, (5) Are composable. `beforeEach` runs for ALL tests in a describe, even if not needed.' },
      { id: 201, question: 'Fixture scope (test vs worker)', answer: 'Test-scoped fixtures: fresh instance per test (default). Worker-scoped fixtures: shared across all tests in a worker — set up once, torn down when worker finishes. Use worker scope for expensive setup like authenticated state.' },
      { id: 202, question: 'Fixture teardown and async cleanup', answer: 'Everything after `await use(value)` in a fixture is teardown. It runs after the test completes, even on failure. Use for closing connections, cleaning up data, etc.', example: `const test = base.extend({\n  dbConnection: async ({}, use) => {\n    const db = await connect();\n    await use(db);       // test runs here\n    await db.close();    // teardown\n  },\n});` },
      { id: 203, question: 'Sharing authenticated state using fixtures', answer: 'Create a worker-scoped fixture that logs in once and saves the storage state. All tests in that worker reuse the authenticated context without logging in again.', example: `const test = base.extend({\n  authedPage: async ({ browser }, use) => {\n    const context = await browser.newContext({ storageState: "auth.json" });\n    const page = await context.newPage();\n    await use(page);\n    await context.close();\n  },\n});` },
      { id: 204, question: 'Overriding fixtures per test', answer: 'Tests can override fixture values for specific scenarios using `test.use()`. The override applies to all tests in that describe block.', example: `test.describe("mobile", () => {\n  test.use({ viewport: { width: 375, height: 667 } });\n  test("responsive layout", async ({ page }) => { /* ... */ });\n});` },
      { id: 205, question: 'Dependency injection pattern in Playwright', answer: 'Fixtures ARE dependency injection. Tests declare dependencies as parameters, and the framework provides them. Fixtures can depend on other fixtures, creating a dependency graph that\'s resolved automatically.' },
    ],
  },

  {
    id: 24,
    title: 'Configuration & ENV Management',
    icon: '⚙️',
    questions: [
      { id: 206, question: 'How Playwright config is executed (Node runtime)', answer: '`playwright.config.ts` runs in Node.js at startup. It\'s a regular TypeScript/JavaScript file — you can use logic, imports, environment variables, and async operations. The config object is evaluated before any tests run.' },
      { id: 207, question: 'Using environment variables safely', answer: 'Use `process.env.VAR_NAME` with fallbacks. Never commit secrets. Use `.env` files with `dotenv` for local dev. CI/CD should inject env vars directly. Validate required env vars at config load time.' },
      { id: 208, question: 'dotenv vs process.env', answer: '`process.env` is the Node.js environment variable object (always available). `dotenv` is a library that loads `.env` file contents into `process.env`. Without `dotenv`, only system-level env vars are available.' },
      { id: 209, question: 'Multiple configs per environment', answer: 'Create separate config files: `playwright.dev.config.ts`, `playwright.staging.config.ts`. Or use environment variables in a single config to switch settings. Run with `--config` flag or set via env var.' },
      { id: 210, question: 'Headless vs headed implications', answer: 'Headless (default): no visible browser, faster, works in CI. Headed: visible browser, slower, useful for debugging. Some behaviors differ (font rendering, GPU). Playwright recommends testing in headless for CI, headed for debugging.' },
    ],
  },

  {
    id: 25,
    title: 'Real-World Test Architecture',
    icon: '🏗️',
    questions: [
      { id: 211, question: 'Designing a scalable Playwright framework in TS', answer: 'Key elements: (1) Page Object Model for page abstractions, (2) Custom fixtures for reusable setup, (3) Typed test data with factories, (4) Shared utilities for common operations, (5) Layered config (base + overrides), (6) CI/CD integration with retries and parallelism.' },
      { id: 212, question: 'Folder structure reasoning', answer: 'Typical: `tests/` (test files), `pages/` (page objects), `fixtures/` (custom fixtures), `utils/` (helpers), `test-data/` (factories). Group by feature, not by type for larger projects. Keep `playwright.config.ts` at root.' },
      { id: 213, question: 'Where to put helpers vs utilities vs fixtures', answer: 'Fixtures: reusable setup/teardown with DI (authentication, database). Utilities: pure functions (date formatting, random data generation). Helpers: domain-specific functions that depend on page/context (login helper, navigation helper).' },
      { id: 214, question: 'Avoiding circular dependencies in TS', answer: 'Don\'t import between page objects. Use a shared types file. Depend on abstractions (interfaces) not implementations. Layer your imports: utils → pages → fixtures → tests. Use barrel exports (`index.ts`) carefully.' },
      { id: 215, question: 'Handling common waits centrally', answer: 'Create a utility for common wait conditions: `waitForNetworkIdle`, `waitForAnimation`, `waitForToast`. Wrap them in well-named functions. Don\'t use `waitForTimeout` — use condition-based waits.' },
    ],
  },

  {
    id: 26,
    title: 'Debugging & Failure Analysis',
    icon: '🔍',
    questions: [
      { id: 216, question: 'Debugging async failures', answer: 'Use Playwright Trace Viewer (shows every action with screenshots). Enable `trace: "on-first-retry"` in config. Check for missing `await`, race conditions, and timing issues. Use `page.pause()` to debug interactively.' },
      { id: 217, question: 'Understanding Playwright error stacks', answer: 'Playwright errors show: (1) The assertion/action that failed, (2) The locator used, (3) What was expected vs actual, (4) The timeout, (5) The call site in your test code. Read from the bottom — your test code is at the bottom of the stack.' },
      { id: 218, question: 'Using traces for async failures', answer: 'Traces capture every action, network request, and console log with timestamps. Enable in config: `use: { trace: "on-first-retry" }`. View with: `npx playwright show-trace trace.zip`. Traces show the exact state at each step.' },
      { id: 219, question: 'When test times out vs assertion times out', answer: 'Test timeout: the entire test exceeded its time limit (default 30s). Assertion timeout: a specific `expect()` exceeded its timeout (default 5s). Increase test timeout for long flows, assertion timeout for slow UI updates. Check which one via the error message.' },
      { id: 220, question: 'Debugging flaky tests logically', answer: '(1) Check if flaky only in CI → resource/timing issue. (2) Check if flaky in parallel → shared state. (3) Run with trace to see exact failure point. (4) Look for timing-dependent selectors. (5) Check for external dependencies (APIs, databases). (6) Never "fix" flaky tests by adding sleeps.' },
    ],
  },

  {
    id: 27,
    title: 'Security & API + UI Combination',
    icon: '🔐',
    questions: [
      { id: 221, question: 'Token handling in API + UI tests', answer: 'Get auth token via API login, store in context storage state. Reuse across tests. Don\'t hardcode tokens. Refresh before expiry. Store securely (not in git). Use worker-scoped fixtures for token management.' },
      { id: 222, question: 'Using request context properly', answer: 'Playwright\'s `request` fixture provides an API context independent of the browser. Use for: test data setup/cleanup, API testing alongside UI, getting auth tokens. Supports cookies and headers.' },
      { id: 223, question: 'Avoiding sensitive data leaks in logs', answer: 'Never log passwords or tokens. Mask sensitive data in screenshots. Don\'t commit `.env` files. Be careful with trace files (they capture network data). Use env vars for secrets, not config files.' },
      { id: 224, question: 'Async API setup before UI tests', answer: 'Use `beforeAll` or fixtures to call APIs before tests: create test data, seed database, get auth tokens. Use `request` context in fixtures. Ensure cleanup in `afterAll` or fixture teardown.' },
      { id: 225, question: 'Cleaning up test data safely', answer: 'Use `afterAll`/`afterEach` or fixture teardown. Delete test-created data via API calls. Use unique identifiers (timestamps, UUIDs) to avoid conflicts. Clean up even on failure — `finally` blocks or fixture teardown guarantees this.' },
    ],
  },

  {
    id: 28,
    title: 'Type-Safety for Testers',
    icon: '🛡️',
    questions: [
      { id: 226, question: 'Creating typed test data builders', answer: 'Use factory functions that return fully typed objects. Support overrides for specific test needs. Use `Partial<T>` for optional overrides.', example: `interface User {\n  name: string;\n  email: string;\n  role: "admin" | "user";\n}\n\nfunction createUser(overrides?: Partial<User>): User {\n  return {\n    name: "Test User",\n    email: \`test-\${Date.now()}@example.com\`,\n    role: "user",\n    ...overrides,\n  };\n}\n\nconst admin = createUser({ role: "admin" });` },
      { id: 227, question: 'Typing API responses', answer: 'Define interfaces for API responses. Use them with `fetch` or Playwright\'s `request` context. Validate at runtime if needed (the API might return unexpected data).' },
      { id: 228, question: 'Enforcing locator return types', answer: 'Type POM methods to return `Locator` from `@playwright/test`. This ensures callers can chain assertions. Return `Promise<void>` for action methods, `Locator` for getter methods.' },
      { id: 229, question: 'Preventing any in test code', answer: 'Enable `noImplicitAny` in `tsconfig.json`. Use ESLint rule `@typescript-eslint/no-explicit-any`. Replace `any` with `unknown` for external data, specific types for known data.' },
      { id: 230, question: 'Using generics in utilities', answer: 'Generic utilities work with any type while maintaining safety. Common patterns: generic retry, generic wait, generic data builder.', example: `async function retryAction<T>(action: () => Promise<T>, retries = 3): Promise<T> {\n  for (let i = 0; i < retries; i++) {\n    try { return await action(); } catch (e) {\n      if (i === retries - 1) throw e;\n    }\n  }\n  throw new Error("Unreachable");\n}` },
    ],
  },

  {
    id: 29,
    title: 'AI + JS/TS (New-Age)',
    icon: '🤖',
    questions: [
      { id: 231, question: 'Using JS/TS to validate AI outputs', answer: 'AI outputs are non-deterministic — use fuzzy matching, semantic similarity, or structured validation. Check for required fields, reasonable ranges, and format compliance rather than exact string matching.' },
      { id: 232, question: 'Handling non-deterministic responses', answer: 'Don\'t assert exact text. Instead: (1) Check structure (has required fields), (2) Check constraints (length, format), (3) Use regex for patterns, (4) Use semantic similarity scoring, (5) Validate against a schema (Zod, JSON Schema).' },
      { id: 233, question: 'Confidence thresholds in assertions', answer: 'Instead of binary pass/fail, score AI responses on quality metrics. Set thresholds: e.g., "response must score above 0.7 on relevance". Log scores for trend analysis.' },
      { id: 234, question: 'Statistical vs binary assertions', answer: 'Binary: pass or fail. Statistical: run multiple times, assert pass rate above threshold. Useful for AI/ML testing where individual results vary but overall quality should be consistent.' },
      { id: 235, question: 'Async polling for AI responses', answer: 'AI APIs may take variable time. Use polling with timeout instead of fixed waits. Check a status endpoint until the response is ready or timeout.', example: `async function pollForResult(id: string, timeout = 30000): Promise<any> {\n  const start = Date.now();\n  while (Date.now() - start < timeout) {\n    const res = await fetch(\`/api/result/\${id}\`);\n    const data = await res.json();\n    if (data.status === "complete") return data;\n    await new Promise(r => setTimeout(r, 1000));\n  }\n  throw new Error("AI response timeout");\n}` },
    ],
  },

  {
    id: 30,
    title: 'Interview Coding Tasks',
    icon: '🎯',
    questions: [
      { id: 236, question: 'Write a retry wrapper for flaky UI steps', answer: 'Wrap a Playwright action in a loop that catches and retries on failure, with configurable attempts and delay.', example: `async function retryStep(\n  action: () => Promise<void>,\n  retries = 3,\n  delay = 1000\n): Promise<void> {\n  for (let i = 0; i < retries; i++) {\n    try {\n      await action();\n      return;\n    } catch (e) {\n      if (i === retries - 1) throw e;\n      console.log(\`Retry \${i + 1}/\${retries}\`);\n      await new Promise(r => setTimeout(r, delay));\n    }\n  }\n}` },
      { id: 237, question: 'Write a smart wait utility', answer: 'A condition-based wait that polls until true or timeout — replaces hardcoded sleeps.', example: `async function smartWait(\n  condition: () => Promise<boolean>,\n  options = { timeout: 10000, interval: 250, message: "Condition not met" }\n): Promise<void> {\n  const start = Date.now();\n  while (Date.now() - start < options.timeout) {\n    if (await condition()) return;\n    await new Promise(r => setTimeout(r, options.interval));\n  }\n  throw new Error(options.message);\n}` },
      { id: 238, question: 'Create a reusable login fixture', answer: 'A fixture that logs in once per worker and reuses the authenticated state.', example: `import { test as base } from "@playwright/test";\n\nexport const test = base.extend({\n  authedPage: async ({ browser }, use) => {\n    const ctx = await browser.newContext({\n      storageState: "./auth-state.json"\n    });\n    const page = await ctx.newPage();\n    await use(page);\n    await ctx.close();\n  },\n});` },
      { id: 239, question: 'Implement soft assertions', answer: 'Soft assertions collect failures without stopping the test, then report all at the end.', example: `class SoftAssert {\n  private errors: string[] = [];\n\n  expect(actual: any, expected: any, message: string) {\n    if (actual !== expected) {\n      this.errors.push(\`\${message}: expected \${expected}, got \${actual}\`);\n    }\n  }\n\n  assertAll() {\n    if (this.errors.length > 0) {\n      throw new Error("Soft assertion failures:\\n" + this.errors.join("\\n"));\n    }\n  }\n}\n\nconst soft = new SoftAssert();\nsoft.expect(1, 1, "check 1"); // pass\nsoft.expect(2, 3, "check 2"); // fail, but continues\nsoft.assertAll(); // throws with all failures` },
      { id: 240, question: 'Parallel-safe data generator', answer: 'Generate unique test data per worker/test to avoid conflicts in parallel runs.', example: `function uniqueTestData(prefix = "test") {\n  const id = \`\${prefix}-\${Date.now()}-\${Math.random().toString(36).slice(2, 8)}\`;\n  return {\n    email: \`\${id}@test.com\`,\n    username: id,\n    password: "TestPass123!",\n  };\n}\n\n// Each parallel test gets unique data\nconst user1 = uniqueTestData("worker1");\nconst user2 = uniqueTestData("worker2");` },
      { id: 241, question: 'Capture network failures during test run', answer: 'Listen to request/response events and log failures for debugging.', example: `// In a Playwright test\nconst failures: string[] = [];\npage.on("response", (response) => {\n  if (response.status() >= 400) {\n    failures.push(\`\${response.status()} \${response.url()}\`);\n  }\n});\n\n// After test actions\nif (failures.length > 0) {\n  console.log("Network failures:", failures);\n}` },
    ],
  },
];

// Total question count
export const TOTAL_QUESTIONS = INTERVIEW_SECTIONS.reduce(
  (sum, section) => sum + section.questions.length, 0
);

// ═══════════════════════════════════════════════════════════════════════════════
// PLAYWRIGHT FRAMEWORK INTERVIEW QUESTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const PLAYWRIGHT_FRAMEWORK_SECTIONS: InterviewSection[] = [
  {
    id: 101,
    title: 'Framework Architecture & Design',
    icon: '🏛️',
    questions: [
      { id: 1001, question: 'What is Playwright framework architecture?', answer: 'Playwright uses a client-server architecture. The test code (client) runs in Node.js and communicates with browsers via the Chrome DevTools Protocol (CDP) or similar protocols. Playwright launches browser processes, creates browser contexts (isolated sessions), and pages within them. The architecture supports multiple browsers (Chromium, Firefox, WebKit) through a unified API.' },
      { id: 1002, question: 'How is your Playwright framework structured?', answer: 'A typical structure: `tests/` (test specs organized by feature), `pages/` (Page Object Models), `fixtures/` (custom test fixtures), `utils/` (helpers and utilities), `test-data/` (JSON/CSV data files), `playwright.config.ts` (configuration). Tests import page objects, which encapsulate locators and actions. Fixtures handle setup/teardown.' },
      { id: 1003, question: 'Why did you choose this folder structure?', answer: 'Separation of concerns: tests focus on behavior, page objects encapsulate UI interaction, fixtures handle setup, utilities are reusable. This makes the framework maintainable — changing a locator only affects one page object, not multiple tests. It also supports parallel development by different team members.' },
      { id: 1004, question: 'What design pattern do you use in Playwright?', answer: 'Page Object Model (POM) is the primary pattern. Each page/component has a class encapsulating its locators and actions. Combined with: Factory pattern for test data, Fixture pattern for dependency injection, Builder pattern for complex test setup. Some teams also use the Screenplay pattern for BDD-style tests.' },
      { id: 1005, question: 'Explain Page Object Model in Playwright', answer: 'POM separates test logic from page interaction. Each page class: (1) Receives `page` via constructor, (2) Defines locators as properties, (3) Exposes action methods (login, search, etc.), (4) Methods are async and await Playwright calls. Tests create page objects and call their methods, making tests readable and DRY.', example: `class LoginPage {\n  constructor(private page: Page) {}\n\n  private emailInput = this.page.getByLabel("Email");\n  private passwordInput = this.page.getByLabel("Password");\n  private submitBtn = this.page.getByRole("button", { name: "Sign in" });\n\n  async login(email: string, password: string) {\n    await this.emailInput.fill(email);\n    await this.passwordInput.fill(password);\n    await this.submitBtn.click();\n  }\n}` },
      { id: 1006, question: 'Where do you keep assertions and why?', answer: 'Assertions belong in test files, NOT in page objects. Reasoning: (1) Page objects represent capabilities ("I can login"), not expectations ("login should succeed"). (2) The same page object method might be called in tests expecting success or failure. (3) Keeps page objects reusable across different test scenarios.' },
      { id: 1007, question: 'Difference between Page Object Model and Test Layer', answer: 'Page Object layer: encapsulates UI interaction (locators, actions). Knows HOW to interact with the page. Test layer: defines test scenarios and assertions. Knows WHAT to verify. The test layer uses page objects but adds business logic and assertions on top.' },
      { id: 1008, question: 'How do you ensure framework scalability?', answer: '(1) Modular page objects (one per page/component), (2) Custom fixtures for reusable setup, (3) Shared utilities for common operations, (4) Data-driven tests with external data sources, (5) Parallel execution support, (6) Environment-agnostic configuration, (7) CI/CD integration from day one.' },
      { id: 1009, question: 'How do you handle code reusability?', answer: 'Through: (1) Page objects — reuse across tests, (2) Custom fixtures — reuse setup/teardown, (3) Helper utilities — common operations like date formatting, (4) Base page class — shared methods like navigation, (5) Data factories — reusable test data generation, (6) Shared locator components — for UI elements used across pages.' },
      { id: 1010, question: 'How do you maintain your framework for long term?', answer: '(1) Follow consistent coding standards, (2) Regular code reviews for test code, (3) Update Playwright version regularly, (4) Refactor page objects when UI changes, (5) Monitor test stability metrics, (6) Document framework conventions, (7) Retire/archive obsolete tests, (8) Track and fix flaky tests promptly.' },
    ],
  },
  {
    id: 102,
    title: 'Playwright Config',
    icon: '⚙️',
    questions: [
      { id: 1011, question: 'What is playwright.config.ts?', answer: 'The central configuration file for Playwright Test. It defines: browser settings, timeouts, retries, parallel workers, test directory, reporter, screenshots/videos, base URL, and project-specific overrides. It\'s a TypeScript file that runs in Node.js — you can use logic and environment variables.' },
      { id: 1012, question: 'What configurations have you used?', answer: 'Common configs: `testDir` (test folder), `timeout` (per-test limit), `retries` (retry count), `workers` (parallel count), `use: { baseURL, screenshot, video, trace }`, `projects` (multi-browser), `reporter` (HTML/Allure/JSON), `expect: { timeout }` (assertion timeout).' },
      { id: 1013, question: 'How do you handle retries?', answer: '`retries: 2` in config retries failed tests up to 2 times. In CI, increase retries. Use `retries: process.env.CI ? 2 : 0` for different local/CI behavior. Each retry gets a fresh browser context. `testInfo.retry` in test code tells you which attempt you\'re on.' },
      { id: 1014, question: 'How do you control timeouts?', answer: '`timeout: 30000` for entire test. `expect: { timeout: 5000 }` for assertions. `actionTimeout: 10000` for individual actions. Per-test override with `test.setTimeout(60000)`. Per-assertion with `expect(locator).toBeVisible({ timeout: 10000 })`.', example: `// playwright.config.ts\nexport default defineConfig({\n  timeout: 30_000,\n  expect: { timeout: 5_000 },\n  use: { actionTimeout: 10_000 },\n});` },
      { id: 1015, question: 'Difference between timeout and expect timeout', answer: '`timeout` is the maximum time for the ENTIRE test (including all actions and assertions). `expect.timeout` is the maximum time for a SINGLE assertion to retry and pass. Test timeout is typically 30s; expect timeout is typically 5s. A test can fail by expect timeout (assertion never matches) even if test timeout hasn\'t been reached.' },
      { id: 1016, question: 'How do you enable screenshots and videos?', answer: '`use: { screenshot: "only-on-failure" }` captures screenshots on failure. `use: { video: "retain-on-failure" }` records video, keeps only for failed tests. Options: `"on"`, `"off"`, `"only-on-failure"`, `"retain-on-failure"`. Screenshots and videos are attached to reports automatically.' },
      { id: 1017, question: 'What is use block?', answer: 'The `use` object in config sets default options for all tests: `baseURL`, `headless`, `screenshot`, `video`, `trace`, `viewport`, `actionTimeout`, `locale`, `permissions`, etc. These can be overridden per project or per test with `test.use({})`.', example: `use: {\n  baseURL: "https://example.com",\n  headless: true,\n  screenshot: "only-on-failure",\n  trace: "on-first-retry",\n  viewport: { width: 1280, height: 720 },\n}` },
      { id: 1018, question: 'How do you configure multiple browsers?', answer: 'Use `projects` array in config. Each project specifies a browser and can override other settings.', example: `projects: [\n  { name: "chromium", use: { ...devices["Desktop Chrome"] } },\n  { name: "firefox", use: { ...devices["Desktop Firefox"] } },\n  { name: "webkit", use: { ...devices["Desktop Safari"] } },\n  { name: "mobile", use: { ...devices["iPhone 13"] } },\n]` },
      { id: 1019, question: 'How do you run tests in headless or headed mode?', answer: '`use: { headless: false }` for headed (visible browser). Default is headless. CLI override: `npx playwright test --headed`. For debugging: `npx playwright test --debug` (opens inspector). In CI, always use headless.' },
      { id: 1020, question: 'How do you configure baseURL?', answer: '`use: { baseURL: "https://staging.example.com" }` in config. Then in tests, use relative URLs: `await page.goto("/login")`. Switch environments with env vars: `baseURL: process.env.BASE_URL || "http://localhost:3000"`. This makes tests environment-agnostic.' },
    ],
  },
  {
    id: 103,
    title: 'Test Execution & Setup',
    icon: '🚀',
    questions: [
      { id: 1021, question: 'How do you run Playwright tests?', answer: '`npx playwright test` — runs all tests. `npx playwright test --headed` — visible browser. `npx playwright test --ui` — interactive UI mode. `npx playwright test --debug` — step-through debugger. `npx playwright show-report` — view HTML report after run.' },
      { id: 1022, question: 'How do you run a single test?', answer: '`npx playwright test path/to/test.spec.ts` — run one file. `npx playwright test -g "test name"` — run by name grep. `test.only("name", ...)` — mark a single test to run. `npx playwright test --project=chromium` — run only in one browser.' },
      { id: 1023, question: 'How do you run tests in parallel?', answer: 'Playwright runs tests in parallel by default using worker processes. Control with `workers` config: `workers: 4` or `workers: "50%"` (of CPU cores). Tests in different files run in parallel; tests in the same file run sequentially (unless `test.describe.configure({ mode: "parallel" })`).' },
      { id: 1024, question: 'How does Playwright handle parallel execution?', answer: 'Playwright spawns multiple worker processes (Node.js child processes). Each worker runs test files independently with its own browser instance. Workers don\'t share memory. Tests are distributed across workers by file. This ensures isolation — one test can\'t affect another.' },
      { id: 1025, question: 'What is a worker?', answer: 'A worker is a Node.js child process that runs tests. Each worker has its own browser instance, memory space, and global state. Worker-scoped fixtures are shared within a worker but isolated between workers. Default: one worker per CPU core.' },
      { id: 1026, question: 'How do you control number of workers?', answer: '`workers: 4` (fixed), `workers: "50%"` (percentage of cores), `workers: 1` (sequential). CLI override: `npx playwright test --workers=2`. In CI with limited resources, reduce workers. For debugging, use `workers: 1` to avoid interleaved output.' },
      { id: 1027, question: 'How do you tag tests?', answer: 'Use `test.describe` or test titles with tags: `test("login @smoke", ...)`. Run tagged tests: `npx playwright test --grep @smoke`. Exclude tags: `--grep-invert @slow`. Or use annotations: `test("name", { tag: ["@smoke"] }, ...)`.', example: `test("user can login @smoke @auth", async ({ page }) => {\n  // ...\n});\n\n// Run: npx playwright test --grep @smoke` },
      { id: 1028, question: 'How do you run smoke vs regression?', answer: 'Tag tests with `@smoke` or `@regression` in titles. Run smoke: `npx playwright test --grep @smoke`. Run regression: `npx playwright test` (all tests). Or create separate projects in config with `testMatch` patterns filtering files.' },
      { id: 1029, question: 'How do you skip tests conditionally?', answer: '`test.skip()` — skip unconditionally. `test.skip(condition, reason)` — skip with condition. `test.fixme()` — mark as known broken. `test.fail()` — expect to fail. `test.slow()` — triple the timeout.', example: `test("feature X", async ({ page, browserName }) => {\n  test.skip(browserName === "firefox", "Not supported in Firefox");\n  // ...\n});` },
      { id: 1030, question: 'How do you retry only failed tests?', answer: '`npx playwright test --last-failed` reruns only tests that failed in the previous run. In CI, use `retries: 2` in config — Playwright automatically retries failures. Use `--retries=2` CLI flag for one-off retries.' },
    ],
  },
  {
    id: 104,
    title: 'Page Object Model (Deep Dive)',
    icon: '📄',
    questions: [
      { id: 1031, question: 'What should NOT be inside Page Objects?', answer: 'Assertions (belongs in tests), test data/fixtures, test flow logic (ordering multiple pages), console.log/debugging, hardcoded waits. Page objects should only know how to interact with their page — not what the test expects.' },
      { id: 1032, question: 'Should Page Objects contain assertions?', answer: 'Generally no. Page objects represent capabilities, not expectations. Exception: "verification" methods that return state (e.g., `isLoggedIn(): Promise<boolean>`) are OK. But `expect()` calls should be in tests, not page objects.' },
      { id: 1033, question: 'How do you pass page to Page Objects?', answer: 'Via constructor injection. The test creates the page object with the Playwright `page` fixture. For fixtures, create the page object inside a custom fixture.', example: `class LoginPage {\n  constructor(private page: Page) {}\n  // ...\n}\n\n// In test:\ntest("login", async ({ page }) => {\n  const loginPage = new LoginPage(page);\n  await loginPage.login("user", "pass");\n});` },
      { id: 1034, question: 'How do you manage locators?', answer: 'Define locators as properties or getter methods in page objects. Prefer Playwright-specific locators (`getByRole`, `getByLabel`, `getByTestId`) over CSS/XPath. Keep locators private — expose actions, not selectors. Use descriptive names.' },
      { id: 1035, question: 'How do you handle dynamic locators?', answer: 'Use parameterized methods that build locators dynamically. Use `filter()`, `nth()`, `has()`, or template literals for selectors.', example: `class ProductPage {\n  constructor(private page: Page) {}\n\n  getProductByName(name: string) {\n    return this.page.getByRole("listitem").filter({ hasText: name });\n  }\n\n  async addToCart(name: string) {\n    await this.getProductByName(name).getByRole("button", { name: "Add" }).click();\n  }\n}` },
      { id: 1036, question: 'How do you reuse Page Objects?', answer: 'Create them in custom fixtures for automatic instantiation. Use a base page class for shared methods (navigation, waiting). Compose page objects for complex pages (HeaderComponent, FooterComponent used across pages).' },
      { id: 1037, question: 'How do you handle common actions like login?', answer: 'Create a login fixture that authenticates via API and saves storage state. Reuse across all tests that need authentication. Avoids repeating UI login in every test, saving significant execution time.', example: `// auth.setup.ts\ntest("authenticate", async ({ page }) => {\n  await page.goto("/login");\n  await page.fill("#email", process.env.USER!);\n  await page.fill("#password", process.env.PASS!);\n  await page.click("#submit");\n  await page.context().storageState({ path: "auth.json" });\n});` },
      { id: 1038, question: 'How do you avoid code duplication?', answer: '(1) Page objects for UI actions, (2) Base page class for common methods, (3) Fixtures for reusable setup, (4) Utility functions for data/formatting, (5) Shared components for headers/modals/nav used across pages.' },
      { id: 1039, question: 'How do you structure Page Objects for large apps?', answer: 'Split by page/feature, not by element type. Use component-level page objects for reusable UI components (Navbar, Modal, DataTable). Compose them in page-level objects. Keep a flat hierarchy — avoid deep inheritance chains.' },
      { id: 1040, question: 'Difference between POM and Screenplay pattern', answer: 'POM: page-centric — one class per page with actions. Screenplay: user-centric — models actors performing tasks. Screenplay is more flexible but more complex. POM is simpler and widely adopted. For most Playwright projects, POM is sufficient.' },
    ],
  },
  {
    id: 105,
    title: 'Fixtures & Hooks',
    icon: '🔧',
    questions: [
      { id: 1041, question: 'What are fixtures in Playwright?', answer: 'Fixtures are reusable setup/teardown units injected into tests as parameters. Playwright provides built-in fixtures (`page`, `browser`, `context`, `request`). You can create custom fixtures for page objects, authenticated sessions, test data, etc.' },
      { id: 1042, question: 'Why use fixtures instead of beforeEach?', answer: 'Fixtures: (1) Only run when requested (lazy), (2) Encapsulate setup AND teardown together, (3) Support dependency injection, (4) Can be scoped (test/worker), (5) Are composable. `beforeEach` runs for ALL tests even if not needed, and teardown is separate in `afterEach`.' },
      { id: 1043, question: 'How do you create custom fixtures?', answer: 'Use `test.extend<{}>()` to define custom fixtures. Each fixture is a function that receives dependencies and a `use` callback.', example: `import { test as base } from "@playwright/test";\nimport { LoginPage } from "./pages/login";\n\nexport const test = base.extend<{ loginPage: LoginPage }>({\n  loginPage: async ({ page }, use) => {\n    const lp = new LoginPage(page);\n    await lp.goto();\n    await use(lp);\n    // teardown runs here\n  },\n});` },
      { id: 1044, question: 'How do fixtures improve reusability?', answer: 'Define once, use everywhere. Any test can request a fixture by name. Fixtures compose — a fixture can depend on other fixtures. When page objects change, update the fixture once, all tests benefit.' },
      { id: 1045, question: 'How do fixtures help parallel execution?', answer: 'Test-scoped fixtures create fresh instances per test — no shared state. Worker-scoped fixtures share within a worker but isolate between workers. This makes tests naturally parallel-safe without manual state management.' },
      { id: 1046, question: 'Difference between fixtures and hooks', answer: 'Hooks (`beforeEach`/`afterEach`): run for all tests in scope, separate setup/teardown, no dependency injection. Fixtures: on-demand (lazy), combined setup+teardown, dependency injection, composable, scoped (test/worker). Fixtures are the recommended approach.' },
      { id: 1047, question: 'What is fixture scope?', answer: 'Test scope (default): fresh instance per test. Worker scope: shared across all tests in a worker, created once. Use worker scope for expensive setup (browser login, database connection). Set with `{ scope: "worker" }` option.' },
      { id: 1048, question: 'How do you share data safely between tests?', answer: 'Don\'t share mutable state. For read-only data: worker-scoped fixtures. For unique data per test: test-scoped fixtures with factories. For external state (databases): use unique identifiers per test to avoid conflicts.' },
      { id: 1049, question: 'How do you implement login fixture?', answer: 'Authenticate once via API or UI, save storage state to a file. Use that file in a fixture to create pre-authenticated contexts. This avoids logging in for every test.', example: `// fixture\nauthedPage: async ({ browser }, use) => {\n  const context = await browser.newContext({\n    storageState: "./auth-state.json"\n  });\n  const page = await context.newPage();\n  await use(page);\n  await context.close();\n}` },
      { id: 1050, question: 'How do you override default fixtures?', answer: 'Use `test.use({})` to override built-in fixtures for a describe block. For custom fixtures, re-extend and provide new implementation. Per-project overrides in config `projects[].use`.', example: `test.describe("mobile tests", () => {\n  test.use({\n    viewport: { width: 375, height: 667 },\n    isMobile: true,\n  });\n});` },
    ],
  },
  {
    id: 106,
    title: 'Locators',
    icon: '🎯',
    questions: [
      { id: 1051, question: 'What types of locators are available?', answer: 'Playwright-specific: `getByRole`, `getByText`, `getByLabel`, `getByPlaceholder`, `getByTestId`, `getByAltText`, `getByTitle`. CSS: `page.locator("css=selector")`. XPath: `page.locator("xpath=//...")`. Text: `page.locator("text=...")`. Recommended priority: role > label > testId > CSS > XPath.' },
      { id: 1052, question: 'CSS vs XPath in Playwright', answer: 'Both work. CSS is generally faster and more readable. XPath is more powerful for complex traversals (parent, sibling, text content). Playwright-specific locators (`getByRole`, etc.) are preferred over both — they\'re resilient to DOM changes and accessible by default.' },
      { id: 1053, question: 'What are Playwright-specific locators?', answer: '`getByRole("button", { name: "Submit" })` — by ARIA role. `getByLabel("Email")` — by associated label. `getByPlaceholder("Enter email")` — by placeholder. `getByText("Welcome")` — by text content. `getByTestId("login-form")` — by data-testid attribute. These are resilient and accessibility-friendly.' },
      { id: 1054, question: 'What is getByRole and why preferred?', answer: '`getByRole` locates elements by their ARIA role (button, link, heading, textbox, etc.) and accessible name. Preferred because: (1) Tests match user perspective, (2) Catches accessibility issues, (3) Resilient to CSS/DOM changes, (4) Works with ARIA labels.' },
      { id: 1055, question: 'What is strict mode?', answer: 'Playwright locators are strict by default — if a locator matches multiple elements, actions throw an error. This prevents silently acting on the wrong element. Use `.first()`, `.last()`, `.nth(n)`, or `.filter()` to narrow down when multiple matches are expected.' },
      { id: 1056, question: 'How do you handle multiple matching elements?', answer: 'Use `.first()`, `.last()`, `.nth(index)` to select one. Use `.filter({ hasText: "..." })` or `.filter({ has: childLocator })` to narrow down. Use `.all()` to get all matches as an array for iteration.' },
      { id: 1057, question: 'How do you locate dynamic elements?', answer: 'Use `getByRole` with name patterns. Use `filter()` with dynamic text. Use `locator()` with parameterized selectors. Use `waitFor()` to wait for dynamic elements to appear. Avoid hardcoding indices — use meaningful attributes.' },
      { id: 1058, question: 'How do you handle Shadow DOM?', answer: 'Playwright pierces Shadow DOM by default for CSS locators. No extra configuration needed. `getByRole` and other semantic locators also work across shadow boundaries. This is a significant advantage over Selenium.' },
      { id: 1059, question: 'How do you test iframe elements?', answer: 'Use `page.frameLocator("iframe#name")` to scope into an iframe. Then chain regular locators. Frame locators are lazy and auto-wait like regular locators.', example: `const frame = page.frameLocator("#payment-iframe");\nawait frame.getByLabel("Card number").fill("4242...");\nawait frame.getByRole("button", { name: "Pay" }).click();` },
      { id: 1060, question: 'How do you debug locator issues?', answer: '`npx playwright codegen` — generates locators interactively. `page.pause()` — opens inspector to explore the DOM. `locator.highlight()` — highlights the element. Playwright Test UI mode shows locator matches. VS Code extension shows locator highlights inline.' },
    ],
  },
  {
    id: 107,
    title: 'Auto-Waiting & Synchronization',
    icon: '⏱️',
    questions: [
      { id: 1061, question: 'What is auto-waiting?', answer: 'Playwright automatically waits for elements to be ready before performing actions. For click: waits for visible, stable (no animation), enabled, and not obscured. For fill: waits for editable. For navigation: waits for load event. This eliminates most manual waits.' },
      { id: 1062, question: 'How does Playwright auto-wait internally?', answer: 'When you call an action (click, fill), Playwright polls the DOM at high frequency checking actionability conditions. It retries until conditions are met or timeout expires. This happens at the protocol level — no JavaScript polling in your test code.' },
      { id: 1063, question: 'Why avoid waitForTimeout?', answer: '`waitForTimeout` is a hard/fixed wait — it always waits the full duration regardless of whether the element is ready. Problems: wastes time when element is ready earlier, still too short on slow CI, makes tests flaky and slow. Use auto-wait, `waitForSelector`, or assertion retries instead.' },
      { id: 1064, question: 'Auto-wait vs implicit wait', answer: 'Auto-wait (Playwright): per-action, checks specific actionability conditions (visible, enabled, stable). Implicit wait (Selenium): global setting, only checks existence. Auto-wait is smarter — it knows what conditions each action type needs.' },
      { id: 1065, question: 'How do you wait for network response?', answer: 'Use `page.waitForResponse()` to wait for a specific API response. Can filter by URL pattern, status code, or custom predicate.', example: `const response = await page.waitForResponse(\n  resp => resp.url().includes("/api/users") && resp.status() === 200\n);\nconst data = await response.json();` },
      { id: 1066, question: 'How do you wait for API call?', answer: 'Use `Promise.all` to wait for the API call triggered by a UI action.', example: `const [response] = await Promise.all([\n  page.waitForResponse("**/api/search*"),\n  page.getByRole("button", { name: "Search" }).click(),\n]);\nconsole.log(await response.json());` },
      { id: 1067, question: 'How do you handle loading spinners?', answer: 'Wait for the spinner to disappear: `await page.locator(".spinner").waitFor({ state: "hidden" })`. Or wait for the content to appear: `await expect(page.getByText("Results")).toBeVisible()`. Don\'t use `waitForTimeout`.' },
      { id: 1068, question: 'How do you wait for navigation?', answer: '`await page.waitForURL("**/dashboard")` — wait for specific URL. `await page.waitForLoadState("networkidle")` — wait for no network activity. For click-triggered navigation: `await Promise.all([page.waitForNavigation(), link.click()])`.  ' },
      { id: 1069, question: 'How do you handle animations?', answer: 'Playwright auto-waits for element stability (no ongoing animation) before clicking. For complex animations, use `page.waitForFunction()` to check animation state, or disable animations globally with CSS: `*, *::before, *::after { animation: none !important; }`.' },
      { id: 1070, question: 'How do you fix flaky synchronization issues?', answer: '(1) Ensure proper `await` on all actions. (2) Use web-first assertions (`expect(locator).toBeVisible()`) — they auto-retry. (3) Wait for network responses after triggering actions. (4) Don\'t use `waitForTimeout`. (5) Use `waitForLoadState` after navigation. (6) Check for race conditions between actions.' },
    ],
  },
  {
    id: 108,
    title: 'Assertions',
    icon: '✅',
    questions: [
      { id: 1071, question: 'What assertion library does Playwright use?', answer: 'Playwright has its own built-in assertion library via `expect()`. It provides web-first assertions that auto-retry: `toBeVisible()`, `toHaveText()`, `toHaveURL()`, etc. These are different from Jest/Node assertions — they poll the DOM until the condition is met or timeout.' },
      { id: 1072, question: 'Hard vs soft assertions', answer: 'Hard assertion (default): test stops immediately on failure. Soft assertion (`expect.soft()`): failure is recorded but test continues. Use soft assertions when you want to check multiple things and see all failures at once, not just the first one.', example: `await expect.soft(page.getByText("Name")).toBeVisible();\nawait expect.soft(page.getByText("Email")).toBeVisible();\n// Both are checked even if first fails` },
      { id: 1073, question: 'How do you validate text?', answer: '`await expect(locator).toHaveText("exact text")` — exact match. `await expect(locator).toContainText("partial")` — substring. Both auto-retry. Use regex for patterns: `toHaveText(/Welcome \\w+/)`.', },
      { id: 1074, question: 'How do you validate visibility?', answer: '`await expect(locator).toBeVisible()` — element is visible. `await expect(locator).toBeHidden()` — not visible. `await expect(locator).not.toBeVisible()` — same as hidden. These auto-retry with default expect timeout.' },
      { id: 1075, question: 'How do you validate URL and title?', answer: '`await expect(page).toHaveURL("**/dashboard")` — URL match (supports glob). `await expect(page).toHaveTitle("Dashboard")` — title match. Both auto-retry.' },
      { id: 1076, question: 'How do you validate API response?', answer: 'Use `page.waitForResponse()` to capture the response, then assert on status, headers, and body.', example: `const resp = await page.waitForResponse("**/api/users");\nexpect(resp.status()).toBe(200);\nconst body = await resp.json();\nexpect(body.users).toHaveLength(10);` },
      { id: 1077, question: 'Where should assertions be placed?', answer: 'In test files, NOT in page objects. Tests define expectations; page objects define capabilities. Exception: helper methods that return values which tests then assert on.' },
      { id: 1078, question: 'How do you handle conditional assertions?', answer: 'Use `isVisible()`, `isEnabled()`, etc. to check state without failing, then conditionally assert. Or use `expect.soft()` for non-blocking checks. Avoid complex conditional logic in tests — keep tests linear and predictable.' },
      { id: 1079, question: 'How do you retry assertions?', answer: 'Playwright assertions auto-retry by default (polling for up to `expect.timeout`). For custom retry: use `expect.toPass()` to retry a block of assertions.', example: `await expect(async () => {\n  const response = await page.request.get("/api/status");\n  expect(response.status()).toBe(200);\n}).toPass({ timeout: 10_000 });` },
      { id: 1080, question: 'How do you debug assertion failures?', answer: 'Check the error message (shows expected vs actual). Use trace viewer for DOM state at failure time. Use `page.pause()` before the assertion to inspect manually. Check screenshots attached to report. Increase timeout to rule out timing issues.' },
    ],
  },
  {
    id: 109,
    title: 'Error Handling & Debugging',
    icon: '🐛',
    questions: [
      { id: 1081, question: 'How do you handle failures?', answer: 'Let assertion failures propagate naturally (don\'t catch them). Use `try/catch` only for expected failures (optional elements, flaky third-party). Capture screenshots/videos/traces on failure via config. Use retries for genuinely flaky tests. Fix root causes, don\'t mask failures.' },
      { id: 1082, question: 'What happens when a test fails?', answer: 'Playwright captures: screenshot (if configured), video (if configured), trace (if configured). Test is marked as failed in the report. If retries are configured, it runs again. `afterEach`/fixture teardown still runs. Other tests continue.' },
      { id: 1083, question: 'How do you capture screenshots on failure?', answer: '`use: { screenshot: "only-on-failure" }` in config. Screenshots are auto-attached to HTML/Allure reports. For manual capture: `await page.screenshot({ path: "debug.png" })`. Full page: `{ fullPage: true }`.' },
      { id: 1084, question: 'How do you capture videos?', answer: '`use: { video: "retain-on-failure" }` — records all tests, keeps only failed. `video: "on"` — keeps all. Videos are saved per test and attached to reports. Size: `{ size: { width: 1280, height: 720 } }`.' },
      { id: 1085, question: 'What is trace viewer?', answer: 'Trace viewer is a GUI tool that records and replays test execution step by step. Shows: action timeline, DOM snapshots, network requests, console logs. Enable: `use: { trace: "on-first-retry" }`. View: `npx playwright show-trace trace.zip`. Invaluable for debugging CI failures.' },
      { id: 1086, question: 'How do you debug flaky tests?', answer: '(1) Enable traces to see exact failure point. (2) Run with `--repeat-each=10` to reproduce. (3) Check for timing issues (missing await, race conditions). (4) Check for shared state between tests. (5) Check CI resource constraints. (6) Use `test.describe.serial` if order matters.' },
      { id: 1087, question: 'How do you retry failed steps?', answer: 'Use `expect.toPass()` for retrying assertion blocks. For UI actions, Playwright auto-retries internally. For custom retry: write a utility function with loop + try/catch + delay. Don\'t retry at the test level — let config `retries` handle that.' },
      { id: 1088, question: 'How do you handle unexpected popups?', answer: 'Register a dialog handler: `page.on("dialog", d => d.accept())`. For popups/new tabs: `page.waitForEvent("popup")`. For cookie banners: dismiss in `beforeEach` or a fixture. Handle before the action that triggers them.' },
      { id: 1089, question: 'How do you clean up after failures?', answer: 'Use fixture teardown (code after `await use()`) — it runs even on failure. Use `afterEach`/`afterAll` hooks. Delete test data via API calls. Close browser contexts. Fixture teardown is preferred because setup and cleanup are together.' },
      { id: 1090, question: 'How do you log errors?', answer: 'Use `console.log` for debugging (shows in terminal). Use `test.info().attach()` to add logs to the report. Use `page.on("console")` to capture browser console. Use trace viewer for comprehensive logging. In CI, configure reporters to capture output.' },
    ],
  },
  {
    id: 110,
    title: 'Reporting',
    icon: '📊',
    questions: [
      { id: 1091, question: 'What reporting tools have you used?', answer: 'Built-in: HTML reporter (default, interactive), list reporter (terminal), JSON reporter (machine-readable). Third-party: Allure (rich dashboards, history), JUnit XML (CI integration), custom reporters. Most common combo: HTML for local dev + Allure for CI.' },
      { id: 1092, question: 'HTML vs Allure reports', answer: 'HTML reporter: built-in, zero config, shows traces/screenshots, interactive. Allure: more features — history trends, categories, environment info, custom steps, dashboard. HTML is simpler; Allure is better for teams and CI pipelines.' },
      { id: 1093, question: 'How do you integrate Allure?', answer: 'Install `allure-playwright`. Set reporter in config: `reporter: [["allure-playwright"]]`. Run tests, then `allure serve allure-results` to view. In CI: `allure generate` to create static HTML.' },
      { id: 1094, question: 'What artifacts are attached in reports?', answer: 'Screenshots (on failure), videos (on failure), traces (zip files), console logs, custom attachments via `testInfo.attach()`. Allure also supports: steps, links, environment info, categories.' },
      { id: 1095, question: 'How do you share reports?', answer: 'HTML reporter: serve as static files (S3, GitHub Pages, Netlify). Allure: deploy to Allure server or generate static HTML. CI: publish as pipeline artifact. Use Slack/email notifications with report links.' },
    ],
  },
  {
    id: 111,
    title: 'Test Data Management',
    icon: '📁',
    questions: [
      { id: 1096, question: 'How do you manage test data?', answer: 'Use JSON files for static data, factory functions for dynamic data, environment variables for secrets, API calls for setup/teardown. Keep data separate from tests. Use unique data per test for parallel safety.' },
      { id: 1097, question: 'JSON vs Excel – which and why?', answer: 'JSON: version-control friendly, easy to parse, works with TypeScript types, no extra dependencies. Excel: familiar for non-developers, good for large datasets. Prefer JSON for automation; use Excel only if business stakeholders need to edit data directly.' },
      { id: 1098, question: 'How do you make test data environment-specific?', answer: 'Use env variables (`process.env.API_URL`), separate data files per environment (`data.staging.json`), or a data factory that adapts based on environment. Never hardcode URLs or credentials.' },
      { id: 1099, question: 'How do you generate random test data?', answer: 'Use libraries like Faker.js for realistic random data. Or simple factories with timestamps/UUIDs for uniqueness.', example: `function createTestUser() {\n  const id = Date.now();\n  return {\n    email: \`test-\${id}@example.com\`,\n    name: \`User \${id}\`,\n    password: "Test123!",\n  };\n}` },
      { id: 1100, question: 'How do you handle sensitive data?', answer: 'Never commit secrets to git. Use environment variables, CI/CD secret stores, or vault services. Mask in logs and screenshots. Use `.env` files locally (gitignored). In CI, inject via pipeline secrets.' },
    ],
  },
  {
    id: 112,
    title: 'Environment & CI/CD',
    icon: '🌍',
    questions: [
      { id: 1101, question: 'How do you manage multiple environments?', answer: 'Use `baseURL` with env variable: `baseURL: process.env.BASE_URL`. Create `.env.staging`, `.env.production` files. Switch with `dotenv` or CI pipeline variables. All tests use relative URLs (`/login` not full URL).' },
      { id: 1102, question: 'How do you integrate Playwright with CI?', answer: 'GitHub Actions: use `mcr.microsoft.com/playwright` Docker image. Jenkins/GitLab/Azure: install Playwright and browsers in the pipeline. Run `npx playwright install --with-deps` then `npx playwright test`. Store results as artifacts.' },
      { id: 1103, question: 'How do you trigger tests on PR?', answer: 'Configure CI to run on PR events. GitHub Actions: `on: pull_request`. Run smoke tests on every PR, full regression on merge to main. Use `--grep @smoke` for fast PR feedback.' },
      { id: 1104, question: 'How do you handle flaky tests in CI?', answer: '(1) Use `retries: 2` in CI config. (2) Enable traces for first retry. (3) Track flaky test metrics. (4) Quarantine chronically flaky tests. (5) Fix root causes (timing, shared state). (6) Don\'t just add retries — investigate and fix.' },
      { id: 1105, question: 'How do you optimize pipeline execution time?', answer: '(1) Run in parallel (increase workers). (2) Use sharding across CI machines. (3) Run smoke on PR, full suite on merge. (4) Cache browser binaries. (5) Use API for test setup instead of UI. (6) Skip unnecessary browser projects in PR checks.' },
    ],
  },
  {
    id: 113,
    title: 'API + UI Integration',
    icon: '🔗',
    questions: [
      { id: 1106, question: 'Why combine API and UI testing?', answer: 'Speed: use API for test data setup/cleanup instead of UI. Reliability: API is more stable than UI for preconditions. Coverage: test API responses alongside UI rendering. Efficiency: authenticate via API, test features in UI.' },
      { id: 1107, question: 'How do you authenticate using API?', answer: 'Call login API endpoint, get token/session, set it in browser storage state. Saves time vs UI login for every test.', example: `const response = await request.post("/api/login", {\n  data: { email: "user@test.com", password: "pass" },\n});\nconst { token } = await response.json();\nawait page.goto("/");\nawait page.evaluate(t => localStorage.setItem("token", t), token);` },
      { id: 1108, question: 'How do you mock API responses?', answer: 'Use `page.route()` to intercept and mock network requests.', example: `await page.route("**/api/users", route => {\n  route.fulfill({\n    status: 200,\n    contentType: "application/json",\n    body: JSON.stringify([{ id: 1, name: "Mock User" }]),\n  });\n});` },
      { id: 1109, question: 'How do you intercept network calls?', answer: '`page.route(pattern, handler)` intercepts matching requests. You can: fulfill with mock data, abort, modify request/response. `page.on("response")` listens to responses without intercepting. `page.waitForResponse()` waits for specific responses.' },
      { id: 1110, question: 'How do you speed up UI tests using API?', answer: '(1) Login via API (save storage state), (2) Create test data via API (don\'t navigate through UI), (3) Clean up via API (faster than UI clicks), (4) Mock slow API responses for UI testing, (5) Skip setup screens by setting state directly.' },
    ],
  },
  {
    id: 114,
    title: 'Advanced & Tricky',
    icon: '🧩',
    questions: [
      { id: 1111, question: 'Playwright vs Selenium', answer: 'Playwright: auto-waits, built-in assertions, native parallelism, multi-browser from one API, built-in trace/video, modern architecture. Selenium: larger community, more language support, more browser support (IE), established ecosystem. Playwright is faster and more reliable for modern web apps.' },
      { id: 1112, question: 'When NOT to automate?', answer: 'One-time tests, highly visual tests (use visual comparison instead), exploratory testing, frequently changing features (high maintenance cost), tests that provide no value (trivial assertions), tests where manual testing is faster.' },
      { id: 1113, question: 'Context vs page', answer: 'BrowserContext is an isolated session (like an incognito window) — has its own cookies, storage, and cache. Page is a tab within a context. Multiple pages can share a context (share auth state). Use new contexts for test isolation.' },
      { id: 1114, question: 'How Playwright ensures isolation?', answer: 'Each test gets a fresh BrowserContext (default fixture). Contexts don\'t share cookies, storage, or cache. Workers run in separate Node.js processes. File system and database state must be managed by tests themselves.' },
      { id: 1115, question: 'How do you handle file upload/download?', answer: 'Upload: `page.setInputFiles("input[type=file]", "path/to/file")`. Download: listen for download event.', example: `// Upload\nawait page.setInputFiles("#file-input", "test-data/report.pdf");\n\n// Download\nconst [download] = await Promise.all([\n  page.waitForEvent("download"),\n  page.click("#download-btn"),\n]);\nconst path = await download.path();` },
    ],
  },
  {
    id: 115,
    title: 'Coding & Scenario Questions',
    icon: '💡',
    questions: [
      { id: 1116, question: 'Login test using POM', answer: 'Create a LoginPage class, write a test that uses it.', example: `class LoginPage {\n  constructor(private page: Page) {}\n  async login(email: string, password: string) {\n    await this.page.goto("/login");\n    await this.page.getByLabel("Email").fill(email);\n    await this.page.getByLabel("Password").fill(password);\n    await this.page.getByRole("button", { name: "Sign in" }).click();\n  }\n}\n\ntest("successful login", async ({ page }) => {\n  const loginPage = new LoginPage(page);\n  await loginPage.login("user@test.com", "password123");\n  await expect(page).toHaveURL(/dashboard/);\n});` },
      { id: 1117, question: 'Handle dynamic tables', answer: 'Use locators to find rows by content, not index.', example: `// Find row containing "John" and click its edit button\nconst row = page.getByRole("row").filter({ hasText: "John" });\nawait row.getByRole("button", { name: "Edit" }).click();\n\n// Get all rows\nconst rows = page.getByRole("row");\nconst count = await rows.count();\nconsole.log(\`Table has \${count} rows\`);` },
      { id: 1118, question: 'Data-driven test example', answer: 'Use arrays or JSON to parameterize tests.', example: `const testCases = [\n  { email: "valid@test.com", password: "pass123", expected: "/dashboard" },\n  { email: "bad@test.com", password: "wrong", expected: "/login" },\n];\n\nfor (const tc of testCases) {\n  test(\`login with \${tc.email}\`, async ({ page }) => {\n    await page.goto("/login");\n    await page.getByLabel("Email").fill(tc.email);\n    await page.getByLabel("Password").fill(tc.password);\n    await page.getByRole("button", { name: "Sign in" }).click();\n    await expect(page).toHaveURL(new RegExp(tc.expected));\n  });\n}` },
      { id: 1119, question: 'Handle iframe example', answer: 'Use `frameLocator` to scope into an iframe.', example: `test("interact with iframe", async ({ page }) => {\n  await page.goto("/page-with-iframe");\n  const frame = page.frameLocator("#my-iframe");\n  await frame.getByLabel("Name").fill("Test User");\n  await frame.getByRole("button", { name: "Submit" }).click();\n  await expect(frame.getByText("Success")).toBeVisible();\n});` },
      { id: 1120, question: 'Environment-based execution', answer: 'Use env variables to switch configs.', example: `// playwright.config.ts\nconst env = process.env.TEST_ENV || "staging";\nconst urls = {\n  staging: "https://staging.example.com",\n  production: "https://example.com",\n};\n\nexport default defineConfig({\n  use: { baseURL: urls[env] },\n});` },
    ],
  },
  {
    id: 116,
    title: 'Experience-Based Questions',
    icon: '🎤',
    questions: [
      { id: 1121, question: 'Explain your Playwright framework', answer: 'Structure your answer: (1) Architecture: POM + custom fixtures + utilities. (2) Config: multi-browser, retries, traces. (3) CI: GitHub Actions/Jenkins with parallel execution. (4) Reporting: HTML + Allure. (5) Data management: factories + env vars. (6) Key decisions: why you chose specific patterns. Tailor to the interviewer\'s stack.' },
      { id: 1122, question: 'Biggest challenge faced', answer: 'Common answers: (1) Flaky tests due to timing — fixed with proper auto-wait and network waits. (2) Parallel test interference — fixed with unique test data. (3) CI failures that pass locally — fixed with traces and resource constraints. (4) Third-party iframe/popup handling. Be specific about your fix.' },
      { id: 1123, question: 'How did you fix flaky tests?', answer: 'Process: (1) Enabled traces to capture exact failure state. (2) Identified root cause (timing, shared state, external dependency). (3) Fixed with proper waits/assertions, isolated test data, or mock external services. (4) Monitored with retry metrics. Never just added sleeps.' },
      { id: 1124, question: 'How did you speed up execution?', answer: 'Strategies used: (1) Increased parallel workers. (2) API-based authentication instead of UI login. (3) API-based test data setup. (4) Removed unnecessary waits. (5) Sharded tests across CI machines. (6) Cached browser installations. Quantify improvement (e.g., "reduced from 45 to 12 minutes").' },
      { id: 1125, question: 'How did you drive Playwright adoption?', answer: 'Steps: (1) Built a proof of concept with key scenarios. (2) Demonstrated benefits vs existing tool (speed, reliability). (3) Created a starter template/boilerplate. (4) Conducted team workshops. (5) Migrated gradually — new tests in Playwright, old tests maintained. (6) Shared metrics showing improvement.' },
    ],
  },
];

export const TOTAL_PLAYWRIGHT_FRAMEWORK_QUESTIONS = PLAYWRIGHT_FRAMEWORK_SECTIONS.reduce(
  (sum, section) => sum + section.questions.length, 0
);
