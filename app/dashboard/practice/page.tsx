'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InlinePracticeEditor } from '@/components/learning/inline-practice-editor';
import {
  CheckCircle, CheckCircle2,
  Lightbulb, Code2, Rocket, ArrowRight, Lock, Crown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const FREE_CHALLENGES_PER_CATEGORY = 4;

type Difficulty = 'Easy' | 'Medium' | 'Hard';
type View = 'landing' | 'javascript' | 'typescript' | 'playwright';

interface Challenge {
  id: number;
  title: string;
  topic: string;
  difficulty: Difficulty;
  description: string;
  hint: string;
  starterCode: string;
  language: 'javascript' | 'typescript';
}

// ─── Challenges ───────────────────────────────────────────────────────────────

const JS_TS_CHALLENGES: Challenge[] = [
  {
    id: 1,
    title: 'Student Welcome Message',
    topic: 'Variables & Template Literals',
    difficulty: 'Easy',
    language: 'javascript',
    description: `Create a function called \`welcomeStudent\` that takes a student's name and course as parameters and returns a welcome message using a template literal.

**Example:**
\`\`\`
welcomeStudent("Govind", "Playwright")
// → "Welcome Govind! You have successfully enrolled in Playwright."
\`\`\`

**Requirements:**
- Use \`const\` or \`let\` for variables
- Use a template literal (backtick string) for the message
- Return the message from the function`,
    hint: 'Use backticks and ${} to embed variables in your string. e.g. `Hello ${name}`',
    starterCode: `// Challenge 1: Student Welcome Message
// Use template literals to build the message

function welcomeStudent(name, course) {
  // Write your code here

}

// Test your function
console.log(welcomeStudent("Govind", "Playwright"));
console.log(welcomeStudent("Anil", "JavaScript"));
console.log(welcomeStudent("Prameela", "TypeScript"));
`,
  },
  {
    id: 2,
    title: 'Ticket Price Calculator',
    topic: 'Functions & Conditionals',
    difficulty: 'Easy',
    language: 'javascript',
    description: `Write a function called \`calculateTicketPrice\` that takes an \`age\` parameter and returns the correct ticket price.

**Rules:**
- Under 12 → \`"$5 (Child)"\`
- 60 or above → \`"$10 (Senior)"\`
- Everyone else → \`"$20 (Adult)"\`

**Example:**
\`\`\`
calculateTicketPrice(7)  // → "$5 (Child)"
calculateTicketPrice(35) // → "$20 (Adult)"
calculateTicketPrice(65) // → "$10 (Senior)"
\`\`\``,
    hint: 'Use if / else if / else. The condition for seniors is age >= 60, and for children age < 12.',
    starterCode: `// Challenge 2: Ticket Price Calculator

function calculateTicketPrice(age) {
  // Write your code here

}

// Test all age groups
console.log(calculateTicketPrice(5));   // $5 (Child)
console.log(calculateTicketPrice(11));  // $5 (Child)
console.log(calculateTicketPrice(12));  // $20 (Adult)
console.log(calculateTicketPrice(35));  // $20 (Adult)
console.log(calculateTicketPrice(59));  // $20 (Adult)
console.log(calculateTicketPrice(60));  // $10 (Senior)
console.log(calculateTicketPrice(75));  // $10 (Senior)
`,
  },
  {
    id: 3,
    title: 'TypeScript User Profile Interface',
    topic: 'Interfaces & Types',
    difficulty: 'Medium',
    language: 'typescript',
    description: `Define a TypeScript \`interface\` called \`UserProfile\` with these fields:

| Field | Type | Required? |
|-------|------|-----------|
| userId | string | Yes |
| name | string | Yes |
| email | string | Yes |
| role | "admin" or "viewer" or "editor" | Yes |
| city | string | Optional |

Then create two objects satisfying this interface, and write a function \`describeUser(user: UserProfile): string\` that returns:

\`"[name] is a [role] from [city or Unknown]"\``,
    hint: 'Use ? for optional fields. For role, use a union type: "admin" | "viewer" | "editor". Use ?? to handle undefined city.',
    starterCode: `// Challenge 3: TypeScript User Profile Interface

interface UserProfile {
  // Add your fields here
}

// User 1: admin with all fields
const adminUser: UserProfile = {
  // fill this in
};

// User 2: viewer without city
const viewerUser: UserProfile = {
  // fill this in
};

function describeUser(user: UserProfile): string {
  // Return the formatted string
}

console.log(describeUser(adminUser));
console.log(describeUser(viewerUser));
`,
  },
  {
    id: 4,
    title: 'TypeScript BankAccount Class',
    topic: 'Classes & Access Modifiers',
    difficulty: 'Medium',
    language: 'typescript',
    description: `Build a \`BankAccount\` class with proper access modifiers:

**Properties:**
- \`accountNumber\` — public string
- \`balance\` — private number
- \`owner\` — public string

**Methods:**
- \`constructor(accountNumber, owner, initialBalance)\`
- \`deposit(amount): void\` — adds to balance
- \`withdraw(amount): string\` — returns \`"Success"\` or \`"Insufficient funds"\`
- \`getBalance(): number\` — returns current balance

**Rule:** balance must be private and cannot go below 0.`,
    hint: 'Use private balance: number. For withdraw, check if this.balance >= amount before deducting.',
    starterCode: `// Challenge 4: BankAccount Class

class BankAccount {
  // Declare properties with correct access modifiers

  constructor(accountNumber: string, owner: string, initialBalance: number) {
    // Initialise properties
  }

  deposit(amount: number): void {
    // Add to balance
  }

  withdraw(amount: number): string {
    // Return "Success" or "Insufficient funds"
  }

  getBalance(): number {
    // Return balance
  }
}

const account = new BankAccount("ACC001", "Hemant Gandhi", 1000);
console.log("Balance:", account.getBalance());        // 1000
account.deposit(500);
console.log("After deposit:", account.getBalance());  // 1500
console.log(account.withdraw(200));                   // Success
console.log("After withdraw:", account.getBalance()); // 1300
console.log(account.withdraw(5000));                  // Insufficient funds
console.log("Unchanged:", account.getBalance());      // 1300
`,
  },
  {
    id: 5,
    title: 'Async User Fetcher',
    topic: 'Async/Await & Promises',
    difficulty: 'Hard',
    language: 'typescript',
    description: `Simulate an async API call with Promises and async/await.

**Step 1:** Write \`fetchUser(userId: string): Promise<{name: string, email: string}>\`
- Resolves after 500ms if \`userId\` starts with \`"U"\`
- Rejects with \`"User not found"\` for any other ID

**Step 2:** Write \`async loadUser(userId: string): Promise<void>\`
- Uses \`await\` and \`try/catch\`
- Logs \`"Loaded: [name] ([email])"\` on success
- Logs \`"Error: [message]"\` on failure

**Example:**
\`\`\`
loadUser("U001") → Loaded: Hemant Gandhi (hemant@test.com)
loadUser("X999") → Error: User not found
\`\`\``,
    hint: 'Use new Promise((resolve, reject) => setTimeout(..., 500)). Check userId.startsWith("U"). In loadUser: try { const user = await fetchUser(id); } catch(e) { console.log("Error:", e); }',
    starterCode: `// Challenge 5: Async User Fetcher

const users: Record<string, {name: string, email: string}> = {
  "U001": { name: "Hemant Gandhi", email: "hemant@test.com" },
  "U002": { name: "Govind Sharma", email: "govind@test.com" },
  "U003": { name: "Prameela K",    email: "prameela@test.com" },
};

function fetchUser(userId: string): Promise<{name: string, email: string}> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // resolve or reject based on userId
    }, 500);
  });
}

async function loadUser(userId: string): Promise<void> {
  // try/catch with await
}

loadUser("U001"); // Loaded: Hemant Gandhi (hemant@test.com)
loadUser("U002"); // Loaded: Govind Sharma (govind@test.com)
loadUser("X999"); // Error: User not found
`,
  },
  {
    id: 6,
    title: 'TypeScript Function Overloads',
    topic: 'TypeScript Functions',
    difficulty: 'Medium',
    language: 'typescript',
    description: `Create a function \`formatValue\` that behaves differently based on input type — simulating TypeScript function overloads.

**Rules:**
- If passed a \`number\`, return it formatted with 2 decimal places as a string, e.g. \`"42.00"\`
- If passed a \`string\`, return it in UPPERCASE
- If passed a \`boolean\`, return \`"Yes"\` or \`"No"\`
- For anything else, return \`"Unknown"\`

**Example:**
\`\`\`
formatValue(3.14159)  // → "3.14"
formatValue("hello")  // → "HELLO"
formatValue(true)     // → "Yes"
\`\`\`

Also write a helper \`formatAll(values: any[]): string[]\` that maps an array through \`formatValue\`.`,
    hint: 'Use typeof to check input type. For numbers use .toFixed(2). For booleans, check value === true.',
    starterCode: `// Challenge: TypeScript Function Overloads
// Handle different input types with a single function

function formatValue(value: any): string {
  // Check typeof and return formatted string

}

function formatAll(values: any[]): string[] {
  // Map each value through formatValue

}

// Test cases
console.log(formatValue(42));          // "42.00"
console.log(formatValue(3.14159));     // "3.14"
console.log(formatValue("hello"));     // "HELLO"
console.log(formatValue("TypeScript")); // "TYPESCRIPT"
console.log(formatValue(true));        // "Yes"
console.log(formatValue(false));       // "No"
console.log(formatValue(null));        // "Unknown"

console.log(formatAll([10, "world", false, 99.9]));
// ["10.00", "WORLD", "No", "99.90"]
`,
  },
  {
    id: 7,
    title: 'Scope & Closure Counter',
    topic: 'Scope & Closures',
    difficulty: 'Medium',
    language: 'typescript',
    description: `Demonstrate understanding of TypeScript scope and closures by building a counter factory.

**Step 1:** Write \`createCounter(start: number)\` that returns an object with:
- \`increment()\` → increases count by 1, returns new value
- \`decrement()\` → decreases count by 1, returns new value
- \`reset()\` → resets to \`start\`, returns start value
- \`getCount()\` → returns current count

The internal count variable must be private (closure — not directly accessible).

**Step 2:** Write \`createRangeCounter(min: number, max: number)\` that works like the above but clamps the count between \`min\` and \`max\`.

**Example:**
\`\`\`
const c = createCounter(0);
c.increment() // → 1
c.increment() // → 2
c.decrement() // → 1
c.reset()     // → 0
\`\`\``,
    hint: 'Use a closure: let count = start inside createCounter, and return methods that capture count. For clamping use Math.min(max, Math.max(min, value)).',
    starterCode: `// Challenge: Scope & Closure Counter
// Use closures to create private state

function createCounter(start: number) {
  // Create a private count variable
  // Return an object with increment, decrement, reset, getCount

}

function createRangeCounter(min: number, max: number) {
  // Same as createCounter but clamps between min and max

}

// Test createCounter
const counter = createCounter(0);
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.increment()); // 3
console.log(counter.decrement()); // 2
console.log(counter.getCount());  // 2
console.log(counter.reset());     // 0

// Test createRangeCounter
const ranged = createRangeCounter(0, 3);
console.log(ranged.increment()); // 1
console.log(ranged.increment()); // 2
console.log(ranged.increment()); // 3
console.log(ranged.increment()); // 3 (clamped at max)
console.log(ranged.decrement()); // 2
console.log(ranged.decrement()); // 1
console.log(ranged.decrement()); // 0
console.log(ranged.decrement()); // 0 (clamped at min)
`,
  },
  {
    id: 8,
    title: 'Abstract Shape Calculator',
    topic: 'Abstract Classes & Inheritance',
    difficulty: 'Hard',
    language: 'typescript',
    description: `Use abstract classes and inheritance to build a shape calculator.

**Step 1:** Create an \`abstract class Shape\`:
- \`name: string\` (set via constructor)
- \`abstract area(): number\`
- \`abstract perimeter(): number\`
- \`describe(): string\` → returns \`"<name>: area=<area>, perimeter=<perimeter>"\` (both rounded to 2 decimals)

**Step 2:** Create \`Circle extends Shape\`:
- Constructor takes \`radius: number\`
- area = \`Math.PI * r * r\`
- perimeter = \`2 * Math.PI * r\`

**Step 3:** Create \`Rectangle extends Shape\`:
- Constructor takes \`width\` and \`height\`
- area = \`w * h\`, perimeter = \`2 * (w + h)\`

**Step 4:** Write \`function totalArea(shapes: Shape[]): number\` that sums all areas.`,
    hint: 'Use abstract keyword. Each subclass must implement area() and perimeter(). describe() calls this.area() and this.perimeter() with .toFixed(2).',
    starterCode: `// Challenge: Abstract Shape Calculator

abstract class Shape {
  // Constructor sets name
  // Abstract methods: area(), perimeter()
  // Concrete method: describe()
}

class Circle extends Shape {
  // Constructor takes radius, calls super("Circle")
  // Implement area and perimeter
}

class Rectangle extends Shape {
  // Constructor takes width and height, calls super("Rectangle")
  // Implement area and perimeter
}

function totalArea(shapes: Shape[]): number {
  // Sum all areas
}

// Test
const circle = new Circle(5);
const rect = new Rectangle(4, 6);

console.log(circle.describe());
// Circle: area=78.54, perimeter=31.42

console.log(rect.describe());
// Rectangle: area=24.00, perimeter=20.00

console.log("Total area:", totalArea([circle, rect]).toFixed(2));
// Total area: 102.54

// More shapes
const c2 = new Circle(3);
const r2 = new Rectangle(10, 2);
console.log(c2.describe());    // Circle: area=28.27, perimeter=18.85
console.log(r2.describe());    // Rectangle: area=20.00, perimeter=24.00
console.log("Total:", totalArea([circle, rect, c2, r2]).toFixed(2));
`,
  },
  {
    id: 9,
    title: 'Parallel Promise Runner',
    topic: 'Async Advanced Patterns',
    difficulty: 'Hard',
    language: 'typescript',
    description: `Build utility functions that demonstrate advanced async patterns.

**Step 1:** Write \`delay(ms: number): Promise<string>\`
- Resolves after \`ms\` milliseconds with \`"Done after <ms>ms"\`

**Step 2:** Write \`async runSequential(tasks: (() => Promise<string>)[]): Promise<string[]>\`
- Runs each task one after another, returns results in order

**Step 3:** Write \`async runParallel(tasks: (() => Promise<string>)[]): Promise<string[]>\`
- Runs all tasks at once using \`Promise.all\`

**Step 4:** Write \`async runRace(tasks: (() => Promise<string>)[]): Promise<string>\`
- Returns the result of the first task to finish using \`Promise.race\`

**Example:**
\`\`\`
await runSequential([() => delay(100), () => delay(50)])
// → ["Done after 100ms", "Done after 50ms"]
\`\`\``,
    hint: 'For sequential: use a for...of loop with await. For parallel: Promise.all(tasks.map(t => t())). For race: Promise.race(tasks.map(t => t())).',
    starterCode: `// Challenge: Parallel Promise Runner

function delay(ms: number): Promise<string> {
  // Return a promise that resolves after ms with "Done after <ms>ms"

}

async function runSequential(tasks: (() => Promise<string>)[]): Promise<string[]> {
  // Run tasks one by one, push results

}

async function runParallel(tasks: (() => Promise<string>)[]): Promise<string[]> {
  // Run all tasks simultaneously with Promise.all

}

async function runRace(tasks: (() => Promise<string>)[]): Promise<string> {
  // Return first completed with Promise.race

}

// Test
async function main() {
  // Sequential
  const seq = await runSequential([
    () => delay(100),
    () => delay(50),
    () => delay(75),
  ]);
  console.log("Sequential:", seq);
  // ["Done after 100ms", "Done after 50ms", "Done after 75ms"]

  // Parallel
  const par = await runParallel([
    () => delay(100),
    () => delay(50),
    () => delay(75),
  ]);
  console.log("Parallel:", par);
  // ["Done after 100ms", "Done after 50ms", "Done after 75ms"]

  // Race
  const winner = await runRace([
    () => delay(100),
    () => delay(50),
    () => delay(75),
  ]);
  console.log("Race winner:", winner);
  // "Done after 50ms"
}

main();
`,
  },
  {
    id: 10,
    title: 'Arrow Function Transformer',
    topic: 'Arrow Functions',
    difficulty: 'Easy',
    language: 'javascript',
    description: `Rewrite a set of traditional functions as arrow functions and demonstrate the differences.

**Task 1:** Convert to arrow functions:
\`\`\`
function double(n) { return n * 2; }
function greet(name) { return "Hi, " + name + "!"; }
function isEven(n) { return n % 2 === 0; }
\`\`\`

**Task 2:** Write these using arrow functions directly:
- \`filterPositive(arr)\` — returns only positive numbers
- \`sumArray(arr)\` — returns sum using \`.reduce()\`
- \`transformNames(names)\` — returns names in UPPER CASE

**Example:**
\`\`\`
filterPositive([-3, 0, 5, -1, 8]) // → [5, 8]
sumArray([1, 2, 3, 4])            // → 10
transformNames(["govind", "anil"]) // → ["GOVIND", "ANIL"]
\`\`\``,
    hint: 'Arrow syntax: const fn = (params) => expression. For single expressions you can omit {} and return. filter/reduce/map accept arrow callbacks.',
    starterCode: `// Challenge: Arrow Function Transformer

// Task 1: Convert these to arrow functions
// function double(n) { return n * 2; }
const double = // write arrow function

// function greet(name) { return "Hi, " + name + "!"; }
const greet = // write arrow function

// function isEven(n) { return n % 2 === 0; }
const isEven = // write arrow function

// Task 2: Write using arrow functions + array methods
const filterPositive = // (arr) => filter only positive numbers

const sumArray = // (arr) => use reduce to sum

const transformNames = // (names) => map to uppercase

// Tests
console.log(double(5));      // 10
console.log(double(0));      // 0
console.log(greet("Govind")); // Hi, Govind!
console.log(isEven(4));      // true
console.log(isEven(7));      // false

console.log(filterPositive([-3, 0, 5, -1, 8]));  // [5, 8]
console.log(filterPositive([1, 2, 3]));           // [1, 2, 3]
console.log(sumArray([1, 2, 3, 4]));              // 10
console.log(sumArray([10, 20, 30]));              // 60
console.log(transformNames(["govind", "anil"]));  // ["GOVIND", "ANIL"]
`,
  },
  // ─── Additional JavaScript Challenges ──────────────────────────────
  {
    id: 11,
    title: 'Array Filter & Map',
    topic: 'Arrays & Array Methods',
    difficulty: 'Easy',
    language: 'javascript',
    description: `Write two functions:

1. \`getPassingStudents(students)\` — takes an array of objects \`{ name, score }\` and returns an array of **names** of students who scored **70 or above**.

2. \`getAverageScore(students)\` — returns the average score rounded to 1 decimal place.

**Example:**
\`\`\`
const students = [
  { name: "Alice", score: 85 },
  { name: "Bob", score: 42 },
  { name: "Charlie", score: 91 },
  { name: "Diana", score: 67 }
];

getPassingStudents(students)
// → ["Alice", "Charlie"]

getAverageScore(students)
// → 71.3
\`\`\``,
    hint: 'Use .filter() to get students with score >= 70, then .map() to extract names. For average, use .reduce() to sum scores, then divide by length.',
    starterCode: `// Challenge: Array Filter & Map

function getPassingStudents(students) {
  // Filter students with score >= 70 and return their names
}

function getAverageScore(students) {
  // Calculate average score, rounded to 1 decimal
}

// Test data
const students = [
  { name: "Alice", score: 85 },
  { name: "Bob", score: 42 },
  { name: "Charlie", score: 91 },
  { name: "Diana", score: 67 }
];

console.log(getPassingStudents(students)); // ["Alice", "Charlie"]
console.log(getAverageScore(students));    // 71.3
`,
  },
  {
    id: 12,
    title: 'Object Destructuring',
    topic: 'Objects & Destructuring',
    difficulty: 'Easy',
    language: 'javascript',
    description: `Write a function \`formatUserCard(user)\` that takes a user object and returns a formatted string using destructuring.

**Example:**
\`\`\`
const user = { name: "Alice", age: 25, city: "Mumbai", role: "QA Engineer" };
formatUserCard(user)
// → "Alice (25) — QA Engineer from Mumbai"
\`\`\`

**Requirements:**
- Use object destructuring in the function parameter or body
- Handle missing \`city\` with default value \`"Unknown"\``,
    hint: 'Destructure with defaults: const { name, age, city = "Unknown", role } = user;',
    starterCode: `// Challenge: Object Destructuring

function formatUserCard(user) {
  // Destructure user and return formatted string
}

// Tests
console.log(formatUserCard({ name: "Alice", age: 25, city: "Mumbai", role: "QA Engineer" }));
// → "Alice (25) — QA Engineer from Mumbai"

console.log(formatUserCard({ name: "Bob", age: 30, role: "Developer" }));
// → "Bob (30) — Developer from Unknown"

console.log(formatUserCard({ name: "Charlie", age: 22, city: "Delhi", role: "Intern" }));
// → "Charlie (22) — Intern from Delhi"
`,
  },
  {
    id: 13,
    title: 'FizzBuzz',
    topic: 'Loops & Iteration',
    difficulty: 'Easy',
    language: 'javascript',
    description: `Write a function \`fizzBuzz(n)\` that returns an array of strings from 1 to n:

- If divisible by 3 → \`"Fizz"\`
- If divisible by 5 → \`"Buzz"\`
- If divisible by both → \`"FizzBuzz"\`
- Otherwise → the number as a string

**Example:**
\`\`\`
fizzBuzz(5) // → ["1", "2", "Fizz", "4", "Buzz"]
fizzBuzz(15) // last item → "FizzBuzz"
\`\`\``,
    hint: 'Use a for loop from 1 to n. Check divisible by 15 first (both 3 and 5), then 3, then 5.',
    starterCode: `// Challenge: FizzBuzz

function fizzBuzz(n) {
  // Return array of strings from 1 to n with FizzBuzz rules
}

// Tests
console.log(fizzBuzz(5));
// ["1", "2", "Fizz", "4", "Buzz"]

console.log(fizzBuzz(15));
// last item should be "FizzBuzz"

console.log(fizzBuzz(3));
// ["1", "2", "Fizz"]
`,
  },
  {
    id: 14,
    title: 'Error Handler',
    topic: 'Error Handling',
    difficulty: 'Medium',
    language: 'javascript',
    description: `Write a function \`safeDivide(a, b)\` that:
- Returns the result of a / b
- Throws an Error with message \`"Cannot divide by zero"\` if b is 0
- Throws a TypeError with message \`"Both arguments must be numbers"\` if either is not a number

Write another function \`safeJsonParse(str)\` that:
- Returns \`{ success: true, data: parsedValue }\` on success
- Returns \`{ success: false, error: errorMessage }\` on failure

**Example:**
\`\`\`
safeDivide(10, 2)        // → 5
safeJsonParse('{"a":1}') // → { success: true, data: { a: 1 } }
safeJsonParse('bad')     // → { success: false, error: "..." }
\`\`\``,
    hint: 'Use typeof to check if arguments are numbers. Use try/catch to wrap JSON.parse.',
    starterCode: `// Challenge: Error Handler

function safeDivide(a, b) {
  // Validate types and check for zero division
}

function safeJsonParse(str) {
  // Try to parse JSON, return { success, data/error }
}

// Tests
console.log(safeDivide(10, 2));   // 5
console.log(safeDivide(7, 3));    // 2.333...

try { safeDivide(10, 0); } catch (e) { console.log(e.message); }
// "Cannot divide by zero"

try { safeDivide("10", 2); } catch (e) { console.log(e.message); }
// "Both arguments must be numbers"

console.log(safeJsonParse('{"name": "Alice"}'));
// { success: true, data: { name: "Alice" } }

console.log(safeJsonParse('invalid json'));
// { success: false, error: "..." }
`,
  },
  {
    id: 15,
    title: 'Shopping Cart Class',
    topic: 'OOP: Classes & Objects',
    difficulty: 'Medium',
    language: 'javascript',
    description: `Create a \`ShoppingCart\` class with:

**Methods:**
- \`addItem(name, price, qty)\` — adds item to cart
- \`removeItem(name)\` — removes item by name
- \`getTotal()\` — returns total price (sum of price × qty)
- \`getItemCount()\` — returns total quantity of all items
- \`getSummary()\` — returns \`"3 items, Total: $45.50"\`

**Example:**
\`\`\`
const cart = new ShoppingCart();
cart.addItem("Shirt", 15.00, 2);
cart.addItem("Pants", 25.50, 1);
cart.getTotal()     // → 55.5
cart.getItemCount() // → 3
cart.getSummary()   // → "3 items, Total: $55.50"
\`\`\``,
    hint: 'Store items as { name, price, qty } objects. Use reduce() for getTotal and getItemCount.',
    starterCode: `// Challenge: Shopping Cart Class

class ShoppingCart {
  constructor() {
    // Initialize items array
  }

  addItem(name, price, qty) { }
  removeItem(name) { }
  getTotal() { }
  getItemCount() { }
  getSummary() { }
}

// Tests
const cart = new ShoppingCart();
cart.addItem("Shirt", 15.00, 2);
cart.addItem("Pants", 25.50, 1);
console.log(cart.getTotal());     // 55.5
console.log(cart.getItemCount()); // 3
console.log(cart.getSummary());   // "3 items, Total: $55.50"

cart.removeItem("Shirt");
console.log(cart.getTotal());     // 25.5
console.log(cart.getSummary());   // "1 items, Total: $25.50"
`,
  },
  {
    id: 16,
    title: 'Vehicle Inheritance',
    topic: 'OOP: Inheritance',
    difficulty: 'Medium',
    language: 'javascript',
    description: `Create a class hierarchy:

**\`Vehicle\`** — constructor takes \`make\`, \`model\`, \`year\`
- \`describe()\` → \`"2024 Toyota Camry"\`

**\`ElectricVehicle extends Vehicle\`** — also takes \`range\` (km)
- Override \`describe()\` → \`"2024 Tesla Model 3 (Electric, 580km range)"\`
- \`canComplete(distance)\` → returns boolean

**Example:**
\`\`\`
const ev = new ElectricVehicle("Tesla", "Model 3", 2024, 580);
ev.describe()       // → "2024 Tesla Model 3 (Electric, 580km range)"
ev.canComplete(500) // → true
\`\`\``,
    hint: 'Use extends and super(make, model, year) in the child constructor.',
    starterCode: `// Challenge: Vehicle Inheritance

class Vehicle {
  constructor(make, model, year) { }
  describe() { }
}

class ElectricVehicle extends Vehicle {
  constructor(make, model, year, range) { }
  describe() { }
  canComplete(distance) { }
}

// Tests
const car = new Vehicle("Toyota", "Camry", 2024);
console.log(car.describe()); // "2024 Toyota Camry"

const ev = new ElectricVehicle("Tesla", "Model 3", 2024, 580);
console.log(ev.describe());       // "2024 Tesla Model 3 (Electric, 580km range)"
console.log(ev.canComplete(500)); // true
console.log(ev.canComplete(600)); // false
console.log(ev instanceof Vehicle); // true
`,
  },
  {
    id: 17,
    title: 'Promise Chain',
    topic: 'Promises & Async/Await',
    difficulty: 'Hard',
    language: 'javascript',
    description: `Write an async function \`fetchUserData(userId)\` that simulates sequential API calls:

1. \`getUser(userId)\` → returns \`{ id, name, departmentId }\`
2. \`getDepartment(departmentId)\` → returns \`{ id, name, managerId }\`
3. \`getUser(managerId)\` → returns the manager object
4. Return: \`{ user, department, manager }\`

Also write \`fetchMultipleUsers(ids)\` using **Promise.all** for parallel fetching.

Helper functions are provided — just use them!`,
    hint: 'Use await sequentially for the chain. Use Promise.all([...ids.map(id => getUser(id))]) for parallel.',
    starterCode: `// Challenge: Promise Chain

// Simulated API (don't modify)
function getUser(id) {
  const users = {
    1: { id: 1, name: "Alice", departmentId: 10 },
    2: { id: 2, name: "Bob", departmentId: 20 },
    3: { id: 3, name: "Charlie", departmentId: 10 },
    99: { id: 99, name: "Manager Singh", departmentId: 10 }
  };
  return new Promise(r => setTimeout(() => r(users[id]), 100));
}

function getDepartment(id) {
  const depts = {
    10: { id: 10, name: "Engineering", managerId: 99 },
    20: { id: 20, name: "Marketing", managerId: 99 }
  };
  return new Promise(r => setTimeout(() => r(depts[id]), 100));
}

// Task 1: Sequential fetch
async function fetchUserData(userId) {
  // Fetch user → department → manager
}

// Task 2: Parallel fetch
async function fetchMultipleUsers(ids) {
  // Use Promise.all
}

// Tests
(async () => {
  const result = await fetchUserData(1);
  console.log(result.user.name);       // "Alice"
  console.log(result.department.name); // "Engineering"
  console.log(result.manager.name);    // "Manager Singh"

  const users = await fetchMultipleUsers([1, 2, 3]);
  console.log(users.map(u => u.name)); // ["Alice", "Bob", "Charlie"]
})();
`,
  },
  // ─── Additional TypeScript Challenges ──────────────────────────────
  {
    id: 18,
    title: 'Type Guard Validator',
    topic: 'Type Guards & Narrowing',
    difficulty: 'Medium',
    language: 'typescript',
    description: `Create type-safe validator functions using TypeScript type guards.

**Define types:**
- \`type ApiSuccess = { status: "success"; data: string[] }\`
- \`type ApiError = { status: "error"; message: string }\`
- \`type ApiResponse = ApiSuccess | ApiError\`

**Write a type guard** \`isSuccess(response): response is ApiSuccess\`

**Write** \`processResponse(response)\` that returns:
- Success → \`"Received X items"\`
- Error → \`"Error: <message>"\`

**Example:**
\`\`\`
processResponse({ status: "success", data: ["a", "b"] })
// → "Received 2 items"
\`\`\``,
    hint: 'A type guard returns `response is ApiSuccess` and checks response.status === "success".',
    starterCode: `// Challenge: Type Guard Validator

type ApiSuccess = { status: "success"; data: string[] };
type ApiError = { status: "error"; message: string };
type ApiResponse = ApiSuccess | ApiError;

function isSuccess(response: ApiResponse): response is ApiSuccess {
  // Check if response is a success
}

function processResponse(response: ApiResponse): string {
  // Use isSuccess() to narrow the type
}

// Tests
console.log(processResponse({ status: "success", data: ["user1", "user2", "user3"] }));
// "Received 3 items"

console.log(processResponse({ status: "error", message: "Not found" }));
// "Error: Not found"

console.log(processResponse({ status: "success", data: [] }));
// "Received 0 items"
`,
  },
  {
    id: 19,
    title: 'Generic Collection',
    topic: 'Generics',
    difficulty: 'Hard',
    language: 'typescript',
    description: `Build a generic \`Collection<T>\` class that works with any data type.

**Methods:**
- \`add(item: T): void\`
- \`getAll(): T[]\`
- \`findBy(predicate: (item: T) => boolean): T | undefined\`
- \`filterBy(predicate: (item: T) => boolean): T[]\`
- \`mapTo<U>(transform: (item: T) => U): U[]\`
- \`count(): number\`

**Example:**
\`\`\`
const users = new Collection<{ name: string; age: number }>();
users.add({ name: "Alice", age: 25 });
users.findBy(u => u.name === "Alice") // → { name: "Alice", age: 25 }
users.mapTo(u => u.name)              // → ["Alice"]
\`\`\``,
    hint: 'Use <T> on the class, and <U> on the mapTo method. Delegate to array methods on this.items.',
    starterCode: `// Challenge: Generic Collection

class Collection<T> {
  private items: T[] = [];

  add(item: T): void { }
  getAll(): T[] { }
  findBy(predicate: (item: T) => boolean): T | undefined { }
  filterBy(predicate: (item: T) => boolean): T[] { }
  mapTo<U>(transform: (item: T) => U): U[] { }
  count(): number { }
}

// Tests
interface User { name: string; age: number }
const users = new Collection<User>();
users.add({ name: "Alice", age: 25 });
users.add({ name: "Bob", age: 30 });
users.add({ name: "Charlie", age: 22 });

console.log(users.count());                        // 3
console.log(users.findBy(u => u.name === "Bob"));  // { name: "Bob", age: 30 }
console.log(users.filterBy(u => u.age > 23));      // [Alice, Bob]
console.log(users.mapTo(u => u.name));             // ["Alice", "Bob", "Charlie"]

const nums = new Collection<number>();
nums.add(10); nums.add(20); nums.add(30);
console.log(nums.filterBy(n => n > 15));  // [20, 30]
`,
  },
  {
    id: 20,
    title: 'Enum & Union Command Parser',
    topic: 'Enums & Union Types',
    difficulty: 'Medium',
    language: 'typescript',
    description: `Create a command parser using TypeScript enums and discriminated unions.

**Task 1:** Enum \`Action\` with: \`Click\`, \`Fill\`, \`Navigate\`, \`Assert\`

**Task 2:** Union type \`Command\` discriminated by \`action\` field

**Task 3:** \`describeCommand(cmd)\` that returns a readable string:
- Click → \`"Click on <selector>"\`
- Fill → \`"Fill <selector> with <value>"\`
- Navigate → \`"Navigate to <url>"\`
- Assert → \`"Assert <selector> equals <expected>"\``,
    hint: 'Use enum Action { Click, Fill, Navigate, Assert }. Discriminate union on action field.',
    starterCode: `// Challenge: Enum & Union Command Parser

enum Action {
  // Add: Click, Fill, Navigate, Assert
}

type Command =
  | { action: Action.Click; selector: string }
  // | Add Fill, Navigate, Assert variants

function describeCommand(cmd: Command): string {
  // Switch on cmd.action
}

// Tests
console.log(describeCommand({ action: Action.Click, selector: "#submit-btn" }));
// "Click on #submit-btn"

console.log(describeCommand({ action: Action.Fill, selector: "#email", value: "test@mail.com" }));
// "Fill #email with test@mail.com"

console.log(describeCommand({ action: Action.Navigate, url: "https://example.com" }));
// "Navigate to https://example.com"

console.log(describeCommand({ action: Action.Assert, selector: "#title", expected: "Welcome" }));
// "Assert #title equals Welcome"
`,
  },
];

const PLAYWRIGHT_CHALLENGES: Challenge[] = [
  {
    id: 101,
    title: 'Locator Strategy Selector',
    topic: 'Locators & Selectors',
    difficulty: 'Easy',
    language: 'typescript',
    description: `Playwright offers multiple locator strategies. Build a function \`getLocator\` that takes a strategy and value, and returns the correct Playwright locator string.

**Strategies to support:**

| Strategy | Output format |
|----------|--------------|
| css | \`css=<value>\` |
| xpath | \`xpath=<value>\` |
| text | \`text=<value>\` |
| role | \`role=<value>\` |
| testid | \`data-testid=<value>\` |

**Example:**
\`\`\`
getLocator("css", "#submit-btn")   // → "css=#submit-btn"
getLocator("testid", "login-form") // → "data-testid=login-form"
getLocator("text", "Sign In")      // → "text=Sign In"
\`\`\`

If the strategy is unknown, return \`"unknown strategy"\`.`,
    hint: 'Use a switch statement or an object map. The testid strategy maps to "data-testid=", not "testid=".',
    starterCode: `// Challenge: Locator Strategy Selector
// Maps Playwright locator strategies to their string format

type Strategy = "css" | "xpath" | "text" | "role" | "testid";

function getLocator(strategy: string, value: string): string {
  // Write your code here

}

// Test your function
console.log(getLocator("css", "#submit-btn"));      // css=#submit-btn
console.log(getLocator("xpath", "//div[@id='app']")); // xpath=//div[@id='app']
console.log(getLocator("text", "Sign In"));          // text=Sign In
console.log(getLocator("role", "button"));           // role=button
console.log(getLocator("testid", "login-form"));     // data-testid=login-form
console.log(getLocator("unknown", "test"));          // unknown strategy
`,
  },
  {
    id: 102,
    title: 'Assertion Result Checker',
    topic: 'Assertions & expect()',
    difficulty: 'Easy',
    language: 'typescript',
    description: `Playwright uses \`expect()\` for assertions. Simulate an assertion checker function.

Write a function \`checkAssertion\` that takes:
- \`actual\`: the actual value
- \`expected\`: the expected value
- \`matcher\`: one of \`"toBe"\`, \`"toContain"\`, \`"toHaveLength"\`

**Return:** An object \`{ passed: boolean, message: string }\`

**Rules:**
- \`toBe\`: strict equality (\`===\`)
- \`toContain\`: \`actual.includes(expected)\` (string or array)
- \`toHaveLength\`: \`actual.length === expected\`

**Example:**
\`\`\`
checkAssertion("Hello World", "World", "toContain")
// → { passed: true, message: "Assertion passed: toContain" }

checkAssertion([1, 2, 3], 4, "toHaveLength")
// → { passed: false, message: "Assertion failed: toHaveLength - expected 3 to be 4" }
\`\`\``,
    hint: 'For toContain, check if actual is a string or array and use .includes(). For toHaveLength, compare actual.length to expected.',
    starterCode: `// Challenge: Assertion Result Checker
// Simulate Playwright-style assertion matchers

interface AssertionResult {
  passed: boolean;
  message: string;
}

function checkAssertion(actual: any, expected: any, matcher: string): AssertionResult {
  // Write your code here

}

// Test cases
console.log(checkAssertion("Playwright", "Playwright", "toBe"));
// { passed: true, message: "Assertion passed: toBe" }

console.log(checkAssertion("Hello World", "World", "toContain"));
// { passed: true, message: "Assertion passed: toContain" }

console.log(checkAssertion("Hello", "xyz", "toContain"));
// { passed: false, message: "Assertion failed: toContain - expected ... to contain xyz" }

console.log(checkAssertion([1, 2, 3], 3, "toHaveLength"));
// { passed: true, message: "Assertion passed: toHaveLength" }

console.log(checkAssertion([1, 2], 5, "toHaveLength"));
// { passed: false, message: "Assertion failed: toHaveLength - expected 2 to be 5" }

console.log(checkAssertion(42, 99, "toBe"));
// { passed: false, message: "Assertion failed: toBe - expected 42 to be 99" }
`,
  },
  {
    id: 103,
    title: 'Playwright Config Builder',
    topic: 'Config & Test Settings',
    difficulty: 'Medium',
    language: 'typescript',
    description: `Build a \`PlaywrightConfig\` class that mimics building a \`playwright.config.ts\` configuration.

**Properties (all private):**
- \`timeout\` (default: 30000)
- \`retries\` (default: 0)
- \`workers\` (default: 1)
- \`browsers\` (default: \`["chromium"]\`)
- \`baseURL\` (default: \`""\`)

**Methods (builder pattern — each returns \`this\`):**
- \`setTimeout(ms: number)\`
- \`setRetries(n: number)\`
- \`setWorkers(n: number)\`
- \`addBrowser(name: string)\` — adds to array, no duplicates
- \`setBaseURL(url: string)\`
- \`build()\` — returns the config object

**Example:**
\`\`\`
new PlaywrightConfig()
  .setTimeout(60000)
  .setRetries(2)
  .addBrowser("firefox")
  .setBaseURL("https://example.com")
  .build()
// → { timeout: 60000, retries: 2, workers: 1,
//     browsers: ["chromium", "firefox"], baseURL: "https://example.com" }
\`\`\``,
    hint: 'Use the builder pattern: each setter method modifies a private field and returns "this". In addBrowser, check if the browser already exists using .includes() before pushing.',
    starterCode: `// Challenge: Playwright Config Builder
// Build a playwright.config.ts-style configuration using builder pattern

class PlaywrightConfig {
  // Declare private properties with defaults

  setTimeout(ms: number) {
    // Set timeout, return this
  }

  setRetries(n: number) {
    // Set retries, return this
  }

  setWorkers(n: number) {
    // Set workers, return this
  }

  addBrowser(name: string) {
    // Add browser if not duplicate, return this
  }

  setBaseURL(url: string) {
    // Set base URL, return this
  }

  build() {
    // Return the config object
  }
}

// Test 1: Default config
const defaultConfig = new PlaywrightConfig().build();
console.log("Default:", JSON.stringify(defaultConfig));
// { timeout: 30000, retries: 0, workers: 1, browsers: ["chromium"], baseURL: "" }

// Test 2: Custom config
const customConfig = new PlaywrightConfig()
  .setTimeout(60000)
  .setRetries(2)
  .setWorkers(4)
  .addBrowser("firefox")
  .addBrowser("webkit")
  .setBaseURL("https://demo.playwright.dev")
  .build();
console.log("Custom:", JSON.stringify(customConfig));

// Test 3: No duplicate browsers
const noDups = new PlaywrightConfig()
  .addBrowser("chromium")
  .addBrowser("firefox")
  .addBrowser("firefox")
  .build();
console.log("No dups:", JSON.stringify(noDups.browsers));
// ["chromium", "firefox"]
`,
  },
  {
    id: 104,
    title: 'Test Hook Execution Order',
    topic: 'Hooks & Test Lifecycle',
    difficulty: 'Medium',
    language: 'typescript',
    description: `Playwright hooks run in a specific order: \`beforeAll → beforeEach → test → afterEach → afterAll\`.

Build a \`TestRunner\` class that simulates this lifecycle:

**Methods:**
- \`beforeAll(fn: () => string)\` — register a beforeAll hook
- \`beforeEach(fn: () => string)\` — register a beforeEach hook
- \`afterEach(fn: () => string)\` — register an afterEach hook
- \`afterAll(fn: () => string)\` — register an afterAll hook
- \`addTest(name: string, fn: () => string)\` — register a test
- \`run(): string[]\` — execute everything in order, return array of log messages

**Execution order for 2 tests:**
\`\`\`
beforeAll
  beforeEach → Test 1 → afterEach
  beforeEach → Test 2 → afterEach
afterAll
\`\`\`

Each callback returns a string that gets pushed to the log.`,
    hint: 'Store hooks as functions. In run(), call beforeAll once, then loop tests calling beforeEach → test → afterEach for each, then call afterAll. Push each return value to a results array.',
    starterCode: `// Challenge: Test Hook Execution Order
// Simulate Playwright's beforeAll/beforeEach/afterEach/afterAll lifecycle

class TestRunner {
  // Store hooks and tests

  beforeAll(fn: () => string) {
    // Register beforeAll hook
  }

  beforeEach(fn: () => string) {
    // Register beforeEach hook
  }

  afterEach(fn: () => string) {
    // Register afterEach hook
  }

  afterAll(fn: () => string) {
    // Register afterAll hook
  }

  addTest(name: string, fn: () => string) {
    // Register a test
  }

  run(): string[] {
    // Execute in order: beforeAll, then (beforeEach, test, afterEach) for each test, then afterAll
    // Return array of log messages
    return [];
  }
}

// Test it
const runner = new TestRunner();

runner.beforeAll(() => "🔧 Setting up database");
runner.afterAll(() => "🧹 Cleaning up database");
runner.beforeEach(() => "📝 Opening browser page");
runner.afterEach(() => "❌ Closing browser page");

runner.addTest("Login Test", () => "✅ Login Test passed");
runner.addTest("Search Test", () => "✅ Search Test passed");

const log = runner.run();
log.forEach(msg => console.log(msg));

// Expected output:
// 🔧 Setting up database
// 📝 Opening browser page
// ✅ Login Test passed
// ❌ Closing browser page
// 📝 Opening browser page
// ✅ Search Test passed
// ❌ Closing browser page
// 🧹 Cleaning up database
`,
  },
  {
    id: 105,
    title: 'Page Object Model (POM)',
    topic: 'POM Design Pattern',
    difficulty: 'Hard',
    language: 'typescript',
    description: `The Page Object Model separates page interaction logic from test logic. Build a simulated POM.

**Step 1:** Create a \`BasePage\` class:
- Constructor takes a \`pageName: string\`
- \`navigate(url: string)\` → returns \`"Navigated to <url>"\`
- \`getTitle()\` → returns \`"<pageName> Page"\`

**Step 2:** Create \`LoginPage extends BasePage\`:
- Constructor calls super with \`"Login"\`
- \`login(user: string, pass: string)\` → returns \`"Logged in as <user>"\` if pass.length >= 6, else \`"Login failed: password too short"\`
- \`getWelcomeMessage(user: string)\` → returns \`"Welcome back, <user>!"\`

**Step 3:** Create \`DashboardPage extends BasePage\`:
- Constructor calls super with \`"Dashboard"\`
- \`getStats()\` → returns \`{ tests: 42, passed: 38, failed: 4 }\`
- \`getPassRate()\` → returns \`"90.5%"\` (based on getStats)

**Step 4:** Create an \`async\` function \`runTestFlow()\` that:
1. Creates both pages, navigates Login to \`"/login"\`, Dashboard to \`"/dashboard"\`
2. Attempts login with \`"admin"\` / \`"secret123"\`
3. Gets dashboard stats
4. Logs each step's result`,
    hint: 'Use class inheritance with extends and super(). For getPassRate, compute (passed/tests * 100).toFixed(1) + "%". Make runTestFlow async and log each result.',
    starterCode: `// Challenge: Page Object Model (POM)
// Simulate Playwright's POM design pattern with inheritance

class BasePage {
  // Constructor takes pageName
  // navigate(url) and getTitle() methods
}

class LoginPage extends BasePage {
  constructor() {
    // Call super with "Login"
  }

  login(user: string, pass: string): string {
    // Return success if password >= 6 chars, else failure
  }

  getWelcomeMessage(user: string): string {
    // Return welcome message
  }
}

class DashboardPage extends BasePage {
  constructor() {
    // Call super with "Dashboard"
  }

  getStats() {
    // Return { tests: 42, passed: 38, failed: 4 }
  }

  getPassRate(): string {
    // Calculate and return pass rate as percentage string
  }
}

// Test flow — simulates a real Playwright test using POM
async function runTestFlow() {
  const loginPage = new LoginPage();
  const dashboardPage = new DashboardPage();

  // Step 1: Navigate
  console.log(loginPage.navigate("/login"));
  console.log(dashboardPage.navigate("/dashboard"));

  // Step 2: Page titles
  console.log("Page:", loginPage.getTitle());
  console.log("Page:", dashboardPage.getTitle());

  // Step 3: Login
  console.log(loginPage.login("admin", "secret123"));
  console.log(loginPage.login("admin", "abc"));  // too short

  // Step 4: Welcome
  console.log(loginPage.getWelcomeMessage("admin"));

  // Step 5: Dashboard
  console.log("Stats:", JSON.stringify(dashboardPage.getStats()));
  console.log("Pass rate:", dashboardPage.getPassRate());
}

runTestFlow();
`,
  },
  {
    id: 106,
    title: 'Test Case Builder',
    topic: 'First Test & Page Fixture',
    difficulty: 'Easy',
    language: 'typescript',
    description: `Simulate the structure of a Playwright test file by building a test-case registry.

Write a \`TestSuite\` class:

**Methods:**
- \`describe(name: string)\` — sets the suite name
- \`addTest(name: string, steps: string[])\` — registers a test with its steps
- \`getSummary(): string[]\` — returns a formatted summary

**Expected output format:**
\`\`\`
"Suite: Login Tests"
"  Test: should login with valid credentials (3 steps)"
"  Test: should show error for wrong password (2 steps)"
\`\`\`

**Example:**
\`\`\`
const suite = new TestSuite();
suite.describe("Login Tests");
suite.addTest("should login with valid credentials", [
  "goto /login", "fill email", "fill password", "click submit"
]);
suite.getSummary();
// ["Suite: Login Tests", "  Test: should login... (4 steps)"]
\`\`\``,
    hint: 'Store suiteName as a string and tests as an array of {name, steps}. In getSummary, format each with template literals.',
    starterCode: `// Challenge: Test Case Builder
// Simulate building Playwright test suites

class TestSuite {
  // Properties to store suite name and tests

  describe(name: string) {
    // Set suite name
  }

  addTest(name: string, steps: string[]) {
    // Add a test with its steps
  }

  getSummary(): string[] {
    // Return formatted summary
  }
}

// Test
const suite = new TestSuite();
suite.describe("Login Tests");
suite.addTest("should login with valid credentials", [
  "goto /login", "fill email", "fill password", "click submit"
]);
suite.addTest("should show error for wrong password", [
  "goto /login", "fill wrong password", "click submit"
]);
suite.addTest("should redirect after login", [
  "login", "check URL"
]);

const summary = suite.getSummary();
summary.forEach(line => console.log(line));
// Suite: Login Tests
//   Test: should login with valid credentials (4 steps)
//   Test: should show error for wrong password (3 steps)
//   Test: should redirect after login (2 steps)
`,
  },
  {
    id: 107,
    title: 'Input Action Simulator',
    topic: 'enterText, Clicks & Inputs',
    difficulty: 'Medium',
    language: 'typescript',
    description: `Simulate Playwright's page interaction actions by building a \`PageSimulator\`.

**The simulator tracks a virtual DOM as a \`Record<string, string>\` of selector → value.**

**Methods:**
- \`fill(selector: string, value: string)\` — sets the element value
- \`clear(selector: string)\` — clears the element (sets to \`""\`)
- \`click(selector: string)\` — logs \`"Clicked <selector>"\` and returns it
- \`check(selector: string)\` — sets value to \`"checked"\`
- \`uncheck(selector: string)\` — sets value to \`"unchecked"\`
- \`getValue(selector: string)\` — returns the current value or \`"not found"\`
- \`getActions()\` — returns array of all actions performed as strings

**Example:**
\`\`\`
const page = new PageSimulator();
page.fill("#email", "test@example.com");
page.click("#submit");
page.getValue("#email") // → "test@example.com"
page.getActions()
// → ["fill #email = test@example.com", "click #submit"]
\`\`\``,
    hint: 'Use a Map or Record for elements and an array for action log. Each method pushes a description to the log and updates the element map.',
    starterCode: `// Challenge: Input Action Simulator
// Simulate Playwright page interactions

class PageSimulator {
  // Store elements and action log

  fill(selector: string, value: string) {
    // Set element value and log action
  }

  clear(selector: string) {
    // Clear element value and log
  }

  click(selector: string): string {
    // Log click and return message
  }

  check(selector: string) {
    // Set to "checked" and log
  }

  uncheck(selector: string) {
    // Set to "unchecked" and log
  }

  getValue(selector: string): string {
    // Return element value or "not found"
  }

  getActions(): string[] {
    // Return all actions performed
  }
}

// Test
const page = new PageSimulator();
page.fill("#email", "admin@test.com");
page.fill("#password", "secret123");
page.check("#remember-me");
page.click("#login-btn");

console.log(page.getValue("#email"));       // admin@test.com
console.log(page.getValue("#password"));    // secret123
console.log(page.getValue("#remember-me")); // checked
console.log(page.getValue("#unknown"));     // not found

page.clear("#password");
console.log(page.getValue("#password"));    // (empty)

page.uncheck("#remember-me");
console.log(page.getValue("#remember-me")); // unchecked

console.log("\\nAll actions:");
page.getActions().forEach(a => console.log(" ", a));
`,
  },
  {
    id: 108,
    title: 'iFrame Content Accessor',
    topic: 'iFrames & FrameLocator',
    difficulty: 'Medium',
    language: 'typescript',
    description: `Simulate Playwright's \`frameLocator()\` by building a nested frame system.

**Step 1:** Create a \`Frame\` class:
- \`name: string\`
- \`elements: Record<string, string>\` — selector → text content
- \`childFrames: Frame[]\`
- \`addElement(selector: string, text: string)\`
- \`addChild(frame: Frame)\`
- \`getText(selector: string): string | null\`

**Step 2:** Create a \`FrameNavigator\` class:
- Constructor takes the root \`Frame\`
- \`frameLocator(name: string): FrameNavigator\` — returns a new navigator pointing to the named child frame (throw \`"Frame not found: <name>"\` if missing)
- \`getText(selector: string): string | null\` — returns text from current frame's elements

**Example:**
\`\`\`
const main = new Frame("main");
const iframe = new Frame("ad-frame");
iframe.addElement("#banner", "Buy Now!");
main.addChild(iframe);

const nav = new FrameNavigator(main);
nav.frameLocator("ad-frame").getText("#banner") // → "Buy Now!"
\`\`\``,
    hint: 'frameLocator finds a child frame by name and returns a new FrameNavigator wrapping that child. Chain calls by returning new instances.',
    starterCode: `// Challenge: iFrame Content Accessor
// Simulate Playwright's frameLocator() API

class Frame {
  name: string;
  elements: Record<string, string> = {};
  childFrames: Frame[] = [];

  constructor(name: string) {
    this.name = name;
  }

  addElement(selector: string, text: string) {
    // Add element to this frame
  }

  addChild(frame: Frame) {
    // Add child frame
  }

  getText(selector: string): string | null {
    // Return element text or null
  }
}

class FrameNavigator {
  // Constructor takes a Frame

  frameLocator(name: string): FrameNavigator {
    // Find child frame and return new navigator
    // Throw "Frame not found: <name>" if missing
  }

  getText(selector: string): string | null {
    // Get text from current frame
  }
}

// Build a page with nested iframes
const mainPage = new Frame("main");
mainPage.addElement("#title", "Welcome to our site");

const adFrame = new Frame("ad-banner");
adFrame.addElement("#promo", "50% Off Today!");
adFrame.addElement("#cta", "Shop Now");

const videoFrame = new Frame("video-player");
videoFrame.addElement("#caption", "Introduction to Testing");

const nestedFrame = new Frame("controls");
nestedFrame.addElement("#play-btn", "Play");
videoFrame.addChild(nestedFrame);

mainPage.addChild(adFrame);
mainPage.addChild(videoFrame);

// Navigate
const nav = new FrameNavigator(mainPage);
console.log(nav.getText("#title"));
// "Welcome to our site"

console.log(nav.frameLocator("ad-banner").getText("#promo"));
// "50% Off Today!"

console.log(nav.frameLocator("ad-banner").getText("#cta"));
// "Shop Now"

console.log(nav.frameLocator("video-player").getText("#caption"));
// "Introduction to Testing"

// Nested: video-player > controls
console.log(nav.frameLocator("video-player").frameLocator("controls").getText("#play-btn"));
// "Play"

// Missing frame
try {
  nav.frameLocator("unknown");
} catch (e) {
  console.log(e); // Frame not found: unknown
}
`,
  },
  {
    id: 109,
    title: 'Dialog Handler',
    topic: 'Dialogs: Alert, Confirm, Prompt',
    difficulty: 'Hard',
    language: 'typescript',
    description: `Simulate Playwright's dialog handling (\`page.on('dialog')\`) by building an event-based dialog system.

**Step 1:** Create a \`DialogEvent\` type:
\`\`\`
{ type: "alert" | "confirm" | "prompt", message: string }
\`\`\`

**Step 2:** Create a \`DialogHandler\` class:
- \`onAlert(handler: (msg: string) => void)\`
- \`onConfirm(handler: (msg: string) => boolean)\` — returns accept/dismiss
- \`onPrompt(handler: (msg: string) => string | null)\` — returns input or null (dismiss)
- \`trigger(dialog: DialogEvent): string\` — fires the appropriate handler and returns:
  - Alert → \`"Alert handled: <message>"\`
  - Confirm → \`"Confirm <accepted/dismissed>: <message>"\`
  - Prompt → \`"Prompt answered: <answer>"\` or \`"Prompt dismissed: <message>"\`
- If no handler is registered, return \`"Unhandled <type>: <message>"\`

**Example:**
\`\`\`
handler.onConfirm(msg => msg.includes("delete") ? false : true);
handler.trigger({ type: "confirm", message: "delete file?" })
// → "Confirm dismissed: delete file?"
\`\`\``,
    hint: 'Store each handler as a property. In trigger(), check dialog.type and call the matching handler. Use conditional logic in the handlers themselves.',
    starterCode: `// Challenge: Dialog Handler
// Simulate Playwright's dialog event handling

interface DialogEvent {
  type: "alert" | "confirm" | "prompt";
  message: string;
}

class DialogHandler {
  // Store handlers for each dialog type

  onAlert(handler: (msg: string) => void) {
    // Register alert handler
  }

  onConfirm(handler: (msg: string) => boolean) {
    // Register confirm handler
  }

  onPrompt(handler: (msg: string) => string | null) {
    // Register prompt handler
  }

  trigger(dialog: DialogEvent): string {
    // Fire the handler and return result string
  }
}

// Test
const handler = new DialogHandler();

// Register handlers
handler.onAlert(msg => console.log("  [Alert seen]:", msg));
handler.onConfirm(msg => {
  if (msg.includes("delete")) return false; // dismiss dangerous ones
  return true; // accept others
});
handler.onPrompt(msg => {
  if (msg.includes("name")) return "Govind";
  return null; // dismiss unknown prompts
});

// Trigger dialogs
console.log(handler.trigger({ type: "alert", message: "Welcome!" }));
// Alert handled: Welcome!

console.log(handler.trigger({ type: "confirm", message: "Save changes?" }));
// Confirm accepted: Save changes?

console.log(handler.trigger({ type: "confirm", message: "delete file?" }));
// Confirm dismissed: delete file?

console.log(handler.trigger({ type: "prompt", message: "Enter your name" }));
// Prompt answered: Govind

console.log(handler.trigger({ type: "prompt", message: "Enter code" }));
// Prompt dismissed: Enter code

// Unhandled
const handler2 = new DialogHandler();
console.log(handler2.trigger({ type: "alert", message: "No handler!" }));
// Unhandled alert: No handler!
`,
  },
  {
    id: 110,
    title: 'GetBy Locator Engine',
    topic: 'GetBy Methods & Locator Options',
    difficulty: 'Easy',
    language: 'typescript',
    description: `Playwright provides \`getByRole\`, \`getByText\`, \`getByTestId\`, \`getByLabel\`, and \`getByPlaceholder\` locators.

Simulate this by building a \`LocatorEngine\` that searches through a list of virtual DOM elements.

**Element structure:**
\`\`\`
{ tag: string, role?: string, text?: string, testId?: string, label?: string, placeholder?: string }
\`\`\`

**Methods (all return matching element or \`null\`):**
- \`getByRole(role: string)\`
- \`getByText(text: string)\` — partial match (includes)
- \`getByTestId(testId: string)\` — exact match
- \`getByLabel(label: string)\`
- \`getByPlaceholder(placeholder: string)\`

**Example:**
\`\`\`
engine.getByRole("button")
// → { tag: "button", role: "button", text: "Submit" }
engine.getByText("Welcome")
// → { tag: "h1", text: "Welcome to QodeBench" }
\`\`\``,
    hint: 'Use .find() on the elements array. For getByText use element.text?.includes(text). For others use strict equality.',
    starterCode: `// Challenge: GetBy Locator Engine
// Simulate Playwright's getBy* locator methods

interface VirtualElement {
  tag: string;
  role?: string;
  text?: string;
  testId?: string;
  label?: string;
  placeholder?: string;
}

class LocatorEngine {
  // Store elements array

  constructor(elements: VirtualElement[]) {
    // Set elements
  }

  getByRole(role: string): VirtualElement | null {
    // Find by role (exact match)
  }

  getByText(text: string): VirtualElement | null {
    // Find by text (partial match — includes)
  }

  getByTestId(testId: string): VirtualElement | null {
    // Find by testId (exact match)
  }

  getByLabel(label: string): VirtualElement | null {
    // Find by label (exact match)
  }

  getByPlaceholder(placeholder: string): VirtualElement | null {
    // Find by placeholder (exact match)
  }
}

// Build a virtual page
const elements: VirtualElement[] = [
  { tag: "h1", text: "Welcome to QodeBench" },
  { tag: "input", placeholder: "Enter email", label: "Email", testId: "email-input" },
  { tag: "input", placeholder: "Enter password", label: "Password", testId: "password-input" },
  { tag: "button", role: "button", text: "Sign In", testId: "login-btn" },
  { tag: "a", role: "link", text: "Forgot Password?" },
  { tag: "input", role: "checkbox", label: "Remember me", testId: "remember-checkbox" },
];

const engine = new LocatorEngine(elements);

console.log(engine.getByRole("button"));
// { tag: "button", role: "button", text: "Sign In", testId: "login-btn" }

console.log(engine.getByText("Welcome"));
// { tag: "h1", text: "Welcome to QodeBench" }

console.log(engine.getByText("Forgot"));
// { tag: "a", role: "link", text: "Forgot Password?" }

console.log(engine.getByTestId("email-input"));
// { tag: "input", placeholder: "Enter email", label: "Email", testId: "email-input" }

console.log(engine.getByLabel("Password"));
// { tag: "input", placeholder: "Enter password", ... }

console.log(engine.getByPlaceholder("Enter email"));
// { tag: "input", placeholder: "Enter email", ... }

console.log(engine.getByRole("slider")); // null
console.log(engine.getByText("Not Here")); // null
`,
  },
];

// ─── Styles ───────────────────────────────────────────────────────────────────

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  Easy:   'bg-emerald-50 text-emerald-700 border-emerald-200',
  Medium: 'bg-amber-50 text-amber-700 border-amber-200',
  Hard:   'bg-red-50 text-red-700 border-red-200',
};

// One neutral accent for every topic — the dashboard uses a single brand blue,
// not a rainbow of per-topic colors.
const TOPIC_ICON_STYLE = 'bg-brand-50 text-brand-600';

// ─── Description renderer ─────────────────────────────────────────────────────

function InlineText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**'))
          return <strong key={i} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
        if (part.startsWith('`') && part.endsWith('`'))
          return <code key={i} className="bg-brand-50 text-brand-700 px-1.5 py-0.5 rounded text-xs font-mono">{part.slice(1, -1)}</code>;
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

function DescriptionRenderer({ text }: { text: string }) {
  const lines = text.split('\n');
  const result: React.ReactNode[] = [];
  let lineIdx = 0;
  let key = 0;
  const k = () => `d${key++}`;

  while (lineIdx < lines.length) {
    const line = lines[lineIdx];

    if (line.startsWith('```')) {
      const codeLines: string[] = [];
      lineIdx++;
      while (lineIdx < lines.length && !lines[lineIdx].startsWith('```')) {
        codeLines.push(lines[lineIdx++]);
      }
      result.push(
        <pre key={k()} className="bg-slate-900 text-slate-100 rounded-lg p-3 text-xs overflow-x-auto my-2 font-mono">
          {codeLines.join('\n')}
        </pre>
      );
      lineIdx++;
      continue;
    }

    if (line.startsWith('|')) {
      const tableLines: string[] = [];
      while (lineIdx < lines.length && lines[lineIdx].startsWith('|')) {
        tableLines.push(lines[lineIdx++]);
      }
      const [header, , ...rows] = tableLines;
      const headers = header.split('|').filter(c => c.trim()).map(c => c.trim());
      result.push(
        <div key={k()} className="overflow-x-auto my-2">
          <table className="w-full text-xs border-collapse">
            <thead className="bg-slate-50">
              <tr>{headers.map((h, j) => <th key={j} className="px-3 py-2 text-left font-semibold text-slate-700 border border-slate-200">{h}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-50">
                  {row.split('|').filter(c => c.trim()).map((cell, cIdx) => (
                    <td key={cIdx} className="px-3 py-2 text-slate-700 border border-slate-200">
                      <InlineText text={cell.trim()} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    if (!line.trim()) { result.push(<div key={k()} className="h-1" />); lineIdx++; continue; }

    result.push(<p key={k()} className="text-sm text-slate-700 leading-relaxed"><InlineText text={line} /></p>);
    lineIdx++;
  }

  return <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 space-y-1">{result}</div>;
}

// ─── Challenge detail (expanded view) ────────────────────────────────────────

function ChallengeDetail({ challenge, onClose }: { challenge: Challenge; onClose: () => void }) {
  const [showHint, setShowHint] = useState(false);

  return (
    <div className="space-y-5">
      <DescriptionRenderer text={challenge.description} />

      <div>
        <Button
          variant="outline" size="sm"
          className="gap-2 text-amber-700 border-amber-300 bg-amber-50 hover:bg-amber-100"
          onClick={() => setShowHint(h => !h)}
        >
          <Lightbulb className="h-4 w-4" />
          {showHint ? 'Hide Hint' : 'Show Hint'}
        </Button>
        {showHint && (
          <div className="mt-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800">
            💡 {challenge.hint}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-700">Write your solution:</p>
        <InlinePracticeEditor
          initialCode={challenge.starterCode}
          language={challenge.language}
          title={challenge.title}
          height="380px"
        />
      </div>

      <div className="pt-2 border-t border-slate-200">
        <Button variant="outline" size="sm" onClick={onClose}>
          ← Back to challenges
        </Button>
      </div>
    </div>
  );
}

// ─── Challenge card (same style as learning page) ─────────────────────────────

function ChallengeCard({
  challenge,
  onOpen,
  completed,
  isLocked,
}: {
  challenge: Challenge;
  index: number;
  onOpen: () => void;
  completed: boolean;
  onToggleComplete: () => void;
  isLocked: boolean;
}) {
  const iconStyle = TOPIC_ICON_STYLE;

  return (
    <Card
      className={cn(
        'relative overflow-hidden h-full border cursor-pointer transition-all hover:shadow-sm',
        isLocked
          ? 'border-slate-200 bg-slate-50 opacity-70 hover:border-slate-300'
          : completed
            ? 'border-emerald-200 bg-white hover:border-emerald-300'
            : 'border-slate-200 bg-white hover:border-slate-300'
      )}
      onClick={onOpen}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          {/* Icon */}
          <div className={cn('rounded-lg p-3', iconStyle)}>
            <Code2 className="h-6 w-6" />
          </div>
          {/* Badges */}
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className={cn('text-xs', DIFFICULTY_STYLES[challenge.difficulty])}>
              {challenge.difficulty}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {challenge.language === 'typescript' ? 'TS' : 'JS'}
            </Badge>
            {isLocked && (
              <Badge className="text-xs bg-amber-100 text-amber-700 hover:bg-amber-100 gap-1">
                <Crown className="h-3 w-3" />
                Premium
              </Badge>
            )}
          </div>
        </div>
        <CardTitle className="mt-4 text-base">
          {challenge.title}
        </CardTitle>
        <CardDescription>{challenge.topic}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between">
          {isLocked ? (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Lock className="h-4 w-4" />
              Locked
            </div>
          ) : completed ? (
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
              <CheckCircle className="h-4 w-4" />
              Completed
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm font-medium text-brand-700">
              <CheckCircle className="h-4 w-4" />
              Start Challenge
            </div>
          )}
          <ArrowRight className="h-5 w-5 text-brand-600" />
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Challenge list view (shared between JS/TS and Playwright) ──────────────

function ChallengeListView({
  challenges,
  completed,
  openChallenge,
  onOpenChallenge,
  onToggleComplete,
  onBack,
  title,
  categoryLabel,
  isPaidUser,
}: {
  challenges: Challenge[];
  completed: Set<number>;
  openChallenge: Challenge | null;
  onOpenChallenge: (c: Challenge | null) => void;
  onToggleComplete: (id: number) => void;
  onBack: () => void;
  title: string;
  categoryLabel: string;
  isPaidUser: boolean;
}) {
  const completedCount = challenges.filter(c => completed.has(c.id)).length;

  if (openChallenge) {
    return (
      <div className="space-y-4">
        {/* Back button at the top */}
        <button
          onClick={() => onOpenChallenge(null)}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 transition-colors font-medium"
        >
          <ArrowRight className="h-4 w-4 rotate-180" />
          Back to challenges
        </button>

        <div className="flex items-center gap-3">
          <div className={cn('rounded-lg p-3', TOPIC_ICON_STYLE)}>
            <Code2 className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{openChallenge.title}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className={cn('text-xs', DIFFICULTY_STYLES[openChallenge.difficulty])}>
                {openChallenge.difficulty}
              </Badge>
              <Badge variant="outline" className="text-xs">{openChallenge.topic}</Badge>
              <Badge variant="outline" className="text-xs font-mono">{categoryLabel}</Badge>
            </div>
          </div>
          <div className="ml-auto">
            <Button
              size="sm"
              className={cn('gap-2', completed.has(openChallenge.id) ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-brand-600 hover:bg-brand-700')}
              onClick={() => onToggleComplete(openChallenge.id)}
            >
              <CheckCircle2 className="h-4 w-4" />
              {completed.has(openChallenge.id) ? 'Completed ✓' : 'Mark Complete'}
            </Button>
          </div>
        </div>
        <ChallengeDetail
          challenge={openChallenge}
          onClose={() => onOpenChallenge(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <button onClick={onBack} className="hover:text-brand-600 transition-colors">
          Practice
        </button>
        <span>/</span>
        <span>{title}</span>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{title}</h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          Solve challenges to master the concepts you&apos;ve learnt in the lessons.
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-200">
        <div className="flex-1 space-y-1">
          <div className="flex justify-between text-sm font-medium text-slate-700">
            <span>Your Progress</span>
            <span>{completedCount} / {challenges.length} completed</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full bg-brand-600 transition-all duration-500"
              style={{ width: `${(completedCount / challenges.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Cards grid */}
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-4">Challenges</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {challenges.map((challenge, i) => {
            const isLocked = i >= FREE_CHALLENGES_PER_CATEGORY && !isPaidUser;
            return (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                index={i}
                onOpen={() => onOpenChallenge(challenge)}
                completed={completed.has(challenge.id)}
                onToggleComplete={() => onToggleComplete(challenge.id)}
                isLocked={isLocked}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'practice_completed_challenges';

function loadCompleted(): Set<number> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return new Set(JSON.parse(stored) as number[]);
  } catch { /* ignore */ }
  return new Set();
}

function saveCompleted(set: Set<number>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  } catch { /* ignore */ }
}

export default function PracticePage() {
  const router = useRouter();
  const [view, setView]                   = useState<View>('landing');
  const [openChallenge, setOpenChallenge] = useState<Challenge | null>(null);
  const [completed, setCompleted]         = useState<Set<number>>(new Set());
  const [isPaidUser, setIsPaidUser]       = useState(false);

  // Load persisted completed state from localStorage on mount
  useEffect(() => {
    setCompleted(loadCompleted());
  }, []);

  // Fetch subscription status on mount
  useEffect(() => {
    fetch('/api/payments/subscription-status')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.subscription?.isActive) {
          setIsPaidUser(true);
        }
      })
      .catch(() => { /* stay as free user on error */ });
  }, []);

  const toggleComplete = (id: number) => {
    setCompleted(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      saveCompleted(next);
      return next;
    });
  };

  const goToLanding = () => {
    setView('landing');
    setOpenChallenge(null);
  };

  // Wrapper: if the challenge is locked, redirect to /pricing
  const handleOpenChallenge = (challenge: Challenge, index: number) => {
    if (index >= FREE_CHALLENGES_PER_CATEGORY && !isPaidUser) {
      router.push('/pricing');
      return;
    }
    setOpenChallenge(challenge);
  };

  const jsChallenges = JS_TS_CHALLENGES.filter(c => c.language === 'javascript');
  const tsChallenges = JS_TS_CHALLENGES.filter(c => c.language === 'typescript');

  const jsCompletedCount = jsChallenges.filter(c => completed.has(c.id)).length;
  const tsCompletedCount = tsChallenges.filter(c => completed.has(c.id)).length;
  const pwCompleted  = PLAYWRIGHT_CHALLENGES.filter(c => completed.has(c.id)).length;

  const categories = [
    {
      id: 'javascript' as View,
      icon: Code2,
      title: 'JavaScript',
      description: 'Variables, functions, arrays, objects, loops, and async patterns',
      count: jsChallenges.length,
      completedCount: jsCompletedCount,
    },
    {
      id: 'typescript' as View,
      icon: Code2,
      title: 'TypeScript',
      description: 'Interfaces, generics, classes, type system, and advanced TypeScript patterns',
      count: tsChallenges.length,
      completedCount: tsCompletedCount,
    },
    {
      id: 'playwright' as View,
      icon: Rocket,
      title: 'Playwright',
      description: 'Practice locators, assertions, config building, hooks, and Page Object Model',
      count: PLAYWRIGHT_CHALLENGES.length,
      completedCount: pwCompleted,
    },
  ];

  // ─── Landing view ──────────────────────────────────────────────────
  if (view === 'landing') {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Practice Sessions</h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Solve challenges to master the concepts you&apos;ve learnt in the lessons.
          </p>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-4">Choose a Track</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Card
                  key={cat.id}
                  className="relative overflow-hidden h-full border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm cursor-pointer transition-all"
                  onClick={() => setView(cat.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="rounded-lg p-3 bg-brand-50">
                        <Icon className="h-6 w-6 text-brand-600" />
                      </div>
                      <Badge variant="secondary">{cat.count} challenges</Badge>
                    </div>
                    <CardTitle className="mt-4">{cat.title}</CardTitle>
                    <CardDescription>{cat.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      {cat.completedCount > 0 ? (
                        <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                          <CheckCircle className="h-4 w-4" />
                          {cat.completedCount} / {cat.count} completed
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-sm font-medium text-brand-700">
                          <CheckCircle className="h-4 w-4" />
                          Start Practicing
                        </div>
                      )}
                      <ArrowRight className="h-5 w-5 text-brand-600" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ─── JavaScript view ───────────────────────────────────────────────
  if (view === 'javascript') {
    return (
      <div className="space-y-8">
        <ChallengeListView
          challenges={jsChallenges}
          completed={completed}
          openChallenge={openChallenge}
          onOpenChallenge={(c) => c ? handleOpenChallenge(c, jsChallenges.indexOf(c)) : setOpenChallenge(null)}
          onToggleComplete={toggleComplete}
          onBack={goToLanding}
          title="JavaScript Challenges"
          categoryLabel="JavaScript"
          isPaidUser={isPaidUser}
        />
      </div>
    );
  }

  // ─── TypeScript view ──────────────────────────────────────────────
  if (view === 'typescript') {
    return (
      <div className="space-y-8">
        <ChallengeListView
          challenges={tsChallenges}
          completed={completed}
          openChallenge={openChallenge}
          onOpenChallenge={(c) => c ? handleOpenChallenge(c, tsChallenges.indexOf(c)) : setOpenChallenge(null)}
          onToggleComplete={toggleComplete}
          onBack={goToLanding}
          title="TypeScript Challenges"
          categoryLabel="TypeScript"
          isPaidUser={isPaidUser}
        />
      </div>
    );
  }

  // ─── Playwright view ───────────────────────────────────────────────
  return (
    <div className="space-y-8">
      <ChallengeListView
        challenges={PLAYWRIGHT_CHALLENGES}
        completed={completed}
        openChallenge={openChallenge}
        onOpenChallenge={(c) => c ? handleOpenChallenge(c, PLAYWRIGHT_CHALLENGES.indexOf(c)) : setOpenChallenge(null)}
        onToggleComplete={toggleComplete}
        onBack={goToLanding}
        title="Playwright Challenges"
        categoryLabel="Playwright"
        isPaidUser={isPaidUser}
      />
    </div>
  );
}
