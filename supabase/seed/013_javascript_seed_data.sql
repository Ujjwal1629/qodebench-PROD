-- =====================================================
-- JavaScript Essentials - Seed Data
-- =====================================================
-- This script seeds the database with JavaScript learning path,
-- lessons, and quiz questions

-- =====================================================
-- 1. CREATE LEARNING PATH
-- =====================================================

INSERT INTO ai_learning_paths (
  id,
  title,
  description,
  difficulty,
  target_role,
  tech_stack,
  estimated_duration_hours,
  learning_objectives,
  prerequisites,
  is_published,
  order_index,
  icon
) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890', -- Fixed UUID for reference
  'JavaScript Essentials',
  'Master JavaScript from fundamentals to advanced concepts. Learn modern ES6+ features, DOM manipulation, and asynchronous programming through interactive lessons and hands-on quizzes.',
  'beginner',
  ARRAY['frontend', 'fullstack'],
  ARRAY['javascript', 'es6', 'web-development'],
  20,
  ARRAY[
    'Understand JavaScript fundamentals and syntax',
    'Master arrays, objects, and built-in methods',
    'Work with functions, scope, and closures',
    'Manipulate the DOM and handle events',
    'Write modern JavaScript with ES6+ features',
    'Handle asynchronous operations with promises and async/await'
  ],
  ARRAY['HTML & CSS Fundamentals'],
  true,
  2,
  '⚡'
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 2. CREATE LESSONS
-- =====================================================

-- Lesson 1: Introduction to JavaScript
INSERT INTO ai_learning_lessons (
  id,
  learning_path_id,
  title,
  description,
  content_type,
  content,
  duration_minutes,
  order_index,
  learning_objectives,
  resources
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Introduction to JavaScript',
  'Learn what JavaScript is, where it runs, and write your first JavaScript code.',
  'quiz',
  '# Introduction to JavaScript

## What is JavaScript?

JavaScript is a **versatile programming language** that runs in web browsers, making websites interactive and dynamic. Originally created in 1995, it''s now one of the most popular programming languages in the world.

### Where JavaScript Runs

JavaScript runs in three main environments:

1. **Web Browsers** - Chrome, Firefox, Safari, Edge
2. **Servers** - Node.js allows JavaScript to run on servers
3. **Mobile Apps** - React Native, Ionic use JavaScript

## Your First JavaScript Code

### Using the Browser Console

Every browser has a built-in JavaScript console. Press `F12` or `Cmd+Option+I` (Mac) to open it.

```javascript
// Your first JavaScript command
console.log("Hello, JavaScript!");
```

**Output:** `Hello, JavaScript!`

### Variables Store Data

Variables are like labeled boxes that hold values:

```javascript
let name = "Alex";
let age = 25;
let isStudent = true;

console.log(name);    // Alex
console.log(age);     // 25
console.log(isStudent); // true
```

### Basic Math Operations

JavaScript can perform calculations:

```javascript
let price = 50;
let quantity = 3;
let total = price * quantity;

console.log(total); // 150
console.log(10 + 5); // 15
console.log(20 - 8); // 12
console.log(6 / 2);  // 3
```

### Comments Make Code Readable

Comments are notes for humans, ignored by JavaScript:

```javascript
// This is a single-line comment

/*
  This is a
  multi-line comment
*/

let x = 10; // You can add comments after code
```

## Best Practices

✅ **Use console.log() for debugging** - See what your code is doing
✅ **Write comments** - Explain complex logic
✅ **Use meaningful variable names** - `userName` not `x`
✅ **Test in the console** - Experiment and learn

## Common Pitfalls

❌ **Forgetting semicolons** - While optional, they prevent bugs
❌ **Case sensitivity** - `myVariable` ≠ `myvariable`
❌ **Typos in console.log** - It''s `console.log()` not `console.log()`
',
  40,
  1,
  ARRAY[
    'Understand what JavaScript is and where it runs',
    'Use the browser console to run JavaScript code',
    'Create variables and use console.log()',
    'Write comments to document your code'
  ],
  '{"external_links": ["https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide", "https://javascript.info/intro"]}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Lesson 2: Variables and Data Types
INSERT INTO ai_learning_lessons (
  id,
  learning_path_id,
  title,
  description,
  content_type,
  content,
  duration_minutes,
  order_index,
  learning_objectives,
  resources
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Variables and Data Types',
  'Master variable declarations with let, const, and var, and understand JavaScript data types.',
  'quiz',
  '# Variables and Data Types

## Declaring Variables

JavaScript has three ways to declare variables: `let`, `const`, and `var`.

### let - For Values That Change

Use `let` when the value will change:

```javascript
let score = 0;
score = 10;  // ✅ Can reassign
score = 20;  // ✅ Can reassign again

let userName = "Alice";
userName = "Bob"; // ✅ Allowed
```

### const - For Values That Don''t Change

Use `const` for constants (values that never change):

```javascript
const PI = 3.14159;
PI = 3.14; // ❌ Error! Cannot reassign

const apiKey = "abc123xyz";
// apiKey = "new"; // ❌ Error!

const maxUsers = 100;
```

### var - The Old Way (Avoid)

`var` is the old way of declaring variables. Use `let` and `const` instead:

```javascript
var oldStyle = "Don''t use var";
// var has confusing scoping rules - stick with let/const
```

## JavaScript Data Types

### 1. Numbers

JavaScript has one number type for integers and decimals:

```javascript
let age = 25;              // Integer
let price = 19.99;         // Decimal
let temperature = -5;      // Negative
let billion = 1_000_000_000; // Can use _ for readability

console.log(age + 5);      // 30
console.log(price * 2);    // 39.98
```

### 2. Strings

Strings are text enclosed in quotes:

```javascript
let firstName = "John";     // Double quotes
let lastName = ''Smith'';     // Single quotes
let message = `Hello!`;     // Template literals (backticks)

// Template literals allow embedded expressions
let fullName = `${firstName} ${lastName}`;
console.log(fullName); // "John Smith"

let greeting = `Hello, ${firstName}! You are ${age} years old.`;
```

### 3. Booleans

Booleans represent true or false:

```javascript
let isLoggedIn = true;
let hasPermission = false;
let isAdult = age >= 18; // Comparison results in boolean

if (isLoggedIn) {
  console.log("Welcome back!");
}
```

### 4. Null and Undefined

Special values representing "nothing":

```javascript
let empty = null;        // Intentionally empty
let notDefined;          // undefined (no value assigned)

console.log(empty);      // null
console.log(notDefined); // undefined
```

## Checking Data Types

Use `typeof` to check a variable''s type:

```javascript
console.log(typeof 42);          // "number"
console.log(typeof "hello");     // "string"
console.log(typeof true);        // "boolean"
console.log(typeof undefined);   // "undefined"
console.log(typeof null);        // "object" (JavaScript quirk!)
```

## Best Practices

✅ **Use const by default** - Only use let when you need to reassign
✅ **Prefer template literals** - Use backticks for string interpolation
✅ **Use descriptive names** - `userAge` not `ua`
✅ **Initialize variables** - Don''t leave them undefined

## Common Pitfalls

❌ **Reassigning const** - Will throw an error
❌ **Mixing quotes** - `"hello''` is invalid
❌ **Forgetting declaration** - Always use let/const
❌ **Using var** - It has confusing scope rules
',
  45,
  2,
  ARRAY[
    'Declare variables using let, const, and var',
    'Understand when to use let vs const',
    'Work with numbers, strings, and booleans',
    'Use template literals for string interpolation',
    'Check data types with typeof'
  ],
  '{"external_links": ["https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures", "https://javascript.info/variables"]}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Lesson 3: Operators and Expressions
INSERT INTO ai_learning_lessons (
  id,
  learning_path_id,
  title,
  description,
  content_type,
  content,
  duration_minutes,
  order_index,
  learning_objectives,
  resources
) VALUES (
  '33333333-3333-3333-3333-333333333333',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Operators and Expressions',
  'Learn about arithmetic, comparison, logical, and assignment operators in JavaScript.',
  'quiz',
  '# Operators and Expressions

## Arithmetic Operators

Perform mathematical calculations:

```javascript
let x = 10;
let y = 3;

console.log(x + y);  // 13 (Addition)
console.log(x - y);  // 7  (Subtraction)
console.log(x * y);  // 30 (Multiplication)
console.log(x / y);  // 3.333... (Division)
console.log(x % y);  // 1  (Remainder/Modulo)
console.log(x ** y); // 1000 (Exponentiation: 10^3)
```

### Increment and Decrement

```javascript
let count = 5;
count++;  // count = count + 1; Now count is 6
count--;  // count = count - 1; Now count is 5

// Pre vs Post increment
let a = 5;
let b = a++;  // b = 5, then a becomes 6
let c = ++a;  // a becomes 7, then c = 7
```

## Comparison Operators

Compare values and return true or false:

```javascript
let age = 18;

console.log(age == 18);   // true  (Equal to)
console.log(age === 18);  // true  (Strictly equal - recommended)
console.log(age != 20);   // true  (Not equal)
console.log(age !== 20);  // true  (Strictly not equal)
console.log(age > 16);    // true  (Greater than)
console.log(age >= 18);   // true  (Greater than or equal)
console.log(age < 21);    // true  (Less than)
console.log(age <= 18);   // true  (Less than or equal)
```

### == vs === (Important!)

```javascript
console.log(5 == "5");   // true  (Type coercion)
console.log(5 === "5");  // false (Different types)

console.log(0 == false);  // true  (Coercion)
console.log(0 === false); // false (Different types)

// ✅ Always use === for exact comparison
```

## Logical Operators

Combine multiple conditions:

```javascript
let age = 25;
let hasLicense = true;

// AND (&&) - Both must be true
console.log(age >= 18 && hasLicense); // true

// OR (||) - At least one must be true
let isWeekend = false;
let isHoliday = true;
console.log(isWeekend || isHoliday); // true

// NOT (!) - Flips the boolean
console.log(!hasLicense);  // false
console.log(!isWeekend);   // true
```

### Short-Circuit Evaluation

```javascript
let userName = "";
let displayName = userName || "Guest"; // "Guest" (fallback)

let user = { name: "Alice" };
let greeting = user && `Hello, ${user.name}`; // "Hello, Alice"
```

## Assignment Operators

Shortcuts for updating variables:

```javascript
let x = 10;

x += 5;  // x = x + 5;  Now x is 15
x -= 3;  // x = x - 3;  Now x is 12
x *= 2;  // x = x * 2;  Now x is 24
x /= 4;  // x = x / 4;  Now x is 6
x %= 4;  // x = x % 4;  Now x is 2
```

## Ternary Operator

A shorthand for if-else:

```javascript
let age = 20;
let status = age >= 18 ? "Adult" : "Minor";
console.log(status); // "Adult"

// Equivalent to:
let status2;
if (age >= 18) {
  status2 = "Adult";
} else {
  status2 = "Minor";
}
```

## Operator Precedence

Some operators execute before others:

```javascript
let result = 2 + 3 * 4;   // 14 (not 20, * comes first)
let result2 = (2 + 3) * 4; // 20 (parentheses override)

// Order: () > ** > * / % > + - > comparisons > && > ||
```

## Best Practices

✅ **Use === instead of ==** - Avoid type coercion bugs
✅ **Use parentheses for clarity** - `(a && b) || c`
✅ **Use += and friends** - Cleaner than `x = x + 5`
✅ **Use ternary for simple conditions** - More concise

## Common Pitfalls

❌ **Confusing = and ==** - `=` assigns, `==` compares
❌ **Using == instead of ===** - Can cause unexpected behavior
❌ **Forgetting operator precedence** - Use parentheses when unsure
❌ **Chaining assignments wrong** - `x = y = 5` works, but confusing
',
  40,
  3,
  ARRAY[
    'Use arithmetic operators for calculations',
    'Compare values with comparison operators',
    'Understand == vs === and always use ===',
    'Combine conditions with logical operators',
    'Write concise code with ternary operator'
  ],
  '{"external_links": ["https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators", "https://javascript.info/operators"]}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Lesson 4: Control Flow
INSERT INTO ai_learning_lessons (
  id,
  learning_path_id,
  title,
  description,
  content_type,
  content,
  duration_minutes,
  order_index,
  learning_objectives,
  resources
) VALUES (
  '44444444-4444-4444-4444-444444444444',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Control Flow',
  'Master conditional statements including if/else, switch statements, and the ternary operator.',
  'quiz',
  '# Control Flow

## If Statements

Control which code runs based on conditions:

### Basic If Statement

```javascript
let age = 20;

if (age >= 18) {
  console.log("You can vote!");
}

let temperature = 30;
if (temperature > 25) {
  console.log("It''s hot outside!");
}
```

### If-Else Statement

Provide an alternative when the condition is false:

```javascript
let score = 75;

if (score >= 60) {
  console.log("You passed!");
} else {
  console.log("You need to retake the exam.");
}

let isWeekend = false;
if (isWeekend) {
  console.log("Time to relax!");
} else {
  console.log("Time to work!");
}
```

### Else If Chains

Test multiple conditions:

```javascript
let grade = 85;

if (grade >= 90) {
  console.log("Grade: A");
} else if (grade >= 80) {
  console.log("Grade: B");
} else if (grade >= 70) {
  console.log("Grade: C");
} else if (grade >= 60) {
  console.log("Grade: D");
} else {
  console.log("Grade: F");
}
```

### Nested If Statements

```javascript
let age = 25;
let hasLicense = true;

if (age >= 18) {
  if (hasLicense) {
    console.log("You can drive!");
  } else {
    console.log("You need a license first.");
  }
} else {
  console.log("You''re too young to drive.");
}

// Better: Use logical operators to avoid nesting
if (age >= 18 && hasLicense) {
  console.log("You can drive!");
} else if (age >= 18) {
  console.log("You need a license first.");
} else {
  console.log("You''re too young to drive.");
}
```

## Switch Statements

Cleaner than multiple else-if when checking one value against many options:

```javascript
let day = "Monday";

switch (day) {
  case "Monday":
    console.log("Start of work week");
    break;
  case "Tuesday":
  case "Wednesday":
  case "Thursday":
    console.log("Midweek days");
    break;
  case "Friday":
    console.log("Almost weekend!");
    break;
  case "Saturday":
  case "Sunday":
    console.log("Weekend!");
    break;
  default:
    console.log("Invalid day");
}
```

### Switch with Returns

When used in functions, return eliminates need for break:

```javascript
function getSeasonMessage(month) {
  switch (month) {
    case "December":
    case "January":
    case "February":
      return "Winter season";
    case "March":
    case "April":
    case "May":
      return "Spring season";
    case "June":
    case "July":
    case "August":
      return "Summer season";
    case "September":
    case "October":
    case "November":
      return "Fall season";
    default:
      return "Invalid month";
  }
}

console.log(getSeasonMessage("July")); // "Summer season"
```

## Ternary Operator

A concise way to write simple if-else statements:

```javascript
let age = 20;
let status = age >= 18 ? "Adult" : "Minor";
console.log(status); // "Adult"

// Equivalent to:
let status2;
if (age >= 18) {
  status2 = "Adult";
} else {
  status2 = "Minor";
}
```

### Nested Ternary (Use Sparingly)

```javascript
let score = 85;
let grade = score >= 90 ? "A" :
            score >= 80 ? "B" :
            score >= 70 ? "C" :
            score >= 60 ? "D" : "F";

console.log(grade); // "B"

// This is harder to read - consider if-else for complex logic
```

### Practical Ternary Examples

```javascript
// Set default value
let userName = inputName || "Guest";
let displayName = userName ? userName : "Anonymous";

// Conditional rendering (common in React)
let isLoggedIn = true;
let message = isLoggedIn ? "Welcome back!" : "Please log in";

// Inline calculations
let price = 100;
let discount = price > 50 ? price * 0.1 : 0;
console.log(discount); // 10
```

## Truthy and Falsy Values

JavaScript converts values to boolean in conditions:

```javascript
// Falsy values (evaluate to false):
if (false) { }        // false
if (0) { }            // zero
if ("") { }           // empty string
if (null) { }         // null
if (undefined) { }    // undefined
if (NaN) { }          // Not a Number

// Everything else is truthy:
if (true) { }         // ✅
if (1) { }            // ✅ any non-zero number
if ("hello") { }      // ✅ any non-empty string
if ([]) { }           // ✅ arrays
if ({}) { }           // ✅ objects

// Practical use:
let userName = "";
if (!userName) {
  console.log("Name is required!");
}
```

## Best Practices

✅ **Avoid deep nesting** - Use logical operators or early returns
✅ **Use switch for multiple values** - Cleaner than many else-if
✅ **Keep ternary simple** - Only for simple conditions
✅ **Use === in conditions** - Avoid type coercion
✅ **Handle default cases** - Always include else or default

## Common Pitfalls

❌ **Forgetting break in switch** - Code falls through to next case
❌ **Assignment vs comparison** - `if (x = 5)` assigns, not compares
❌ **Complex nested ternary** - Hard to read and maintain
❌ **Too much nesting** - Refactor into separate functions
❌ **Truthy/falsy confusion** - `0` and `""` are falsy

## When to Use Each

- **If-else**: Most common, good for 1-3 conditions
- **Else-if chains**: Multiple related conditions
- **Switch**: Many possible values for one variable
- **Ternary**: Simple two-way decisions, especially for assignment
- **Logical operators**: Quick checks with default values
',
  45,
  4,
  ARRAY[
    'Write conditional statements with if/else',
    'Use else-if chains for multiple conditions',
    'Implement switch statements for multiple values',
    'Apply ternary operators for concise conditions',
    'Understand truthy and falsy values'
  ],
  '{"external_links": ["https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else", "https://javascript.info/ifelse"]}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Lesson 5: Loops and Iteration
INSERT INTO ai_learning_lessons (
  id,
  learning_path_id,
  title,
  description,
  content_type,
  content,
  duration_minutes,
  order_index,
  learning_objectives,
  resources
) VALUES (
  '55555555-5555-5555-5555-555555555555',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Loops and Iteration',
  'Learn how to repeat code execution with for, while, and do-while loops, and control loop flow.',
  'quiz',
  '# Loops and Iteration

## For Loops

The most common loop for repeating code a specific number of times:

### Basic For Loop

```javascript
// Print numbers 1 to 5
for (let i = 1; i <= 5; i++) {
  console.log(i);
}
// Output: 1 2 3 4 5

// Calculate sum of numbers 1 to 10
let sum = 0;
for (let i = 1; i <= 10; i++) {
  sum += i;
}
console.log(sum); // 55
```

**Anatomy of a for loop:**
- `let i = 1` - Initialize counter
- `i <= 5` - Condition to continue
- `i++` - Update counter after each iteration

### Looping Through Arrays

```javascript
let fruits = ["apple", "banana", "orange", "grape"];

for (let i = 0; i < fruits.length; i++) {
  console.log(`Fruit ${i + 1}: ${fruits[i]}`);
}
// Output:
// Fruit 1: apple
// Fruit 2: banana
// Fruit 3: orange
// Fruit 4: grape

// Loop backwards
for (let i = fruits.length - 1; i >= 0; i--) {
  console.log(fruits[i]);
}
// Output: grape, orange, banana, apple
```

### For Loop Variations

```javascript
// Count by 2s
for (let i = 0; i <= 10; i += 2) {
  console.log(i); // 0, 2, 4, 6, 8, 10
}

// Nested loops (multiplication table)
for (let i = 1; i <= 3; i++) {
  for (let j = 1; j <= 3; j++) {
    console.log(`${i} x ${j} = ${i * j}`);
  }
}
```

## While Loops

Repeat code while a condition is true:

```javascript
let count = 1;
while (count <= 5) {
  console.log(`Count: ${count}`);
  count++;
}
// Output: Count: 1, Count: 2, ..., Count: 5

// Wait for valid input
let password = "";
while (password.length < 8) {
  password = prompt("Enter password (min 8 chars):");
}

// Process items until done
let items = ["task1", "task2", "task3"];
while (items.length > 0) {
  let task = items.pop();
  console.log(`Processing: ${task}`);
}
```

### While vs For

```javascript
// For loop: Know iterations in advance
for (let i = 0; i < 10; i++) {
  console.log(i);
}

// While loop: Unknown iterations
let found = false;
let attempts = 0;
while (!found && attempts < 10) {
  found = Math.random() > 0.8; // Random condition
  attempts++;
}
console.log(`Found after ${attempts} attempts`);
```

## Do-While Loops

Execute code at least once, then check condition:

```javascript
let userInput;
do {
  userInput = prompt("Enter ''yes'' to continue:");
} while (userInput !== "yes");

// Always runs at least once
let num = 10;
do {
  console.log(num);
  num++;
} while (num < 5);
// Output: 10 (even though condition is false)

// Compare with while:
let num2 = 10;
while (num2 < 5) {
  console.log(num2); // Never runs
  num2++;
}
```

## Break Statement

Exit a loop early:

```javascript
// Find first even number
for (let i = 1; i <= 10; i++) {
  if (i % 2 === 0) {
    console.log(`First even: ${i}`);
    break; // Exit loop
  }
}
// Output: First even: 2

// Search in array
let users = ["Alice", "Bob", "Charlie", "Diana"];
let searchName = "Charlie";
let found = false;

for (let i = 0; i < users.length; i++) {
  if (users[i] === searchName) {
    console.log(`Found at index ${i}`);
    found = true;
    break;
  }
}

// Break in while loop
let count = 0;
while (true) { // Infinite loop
  count++;
  if (count > 5) {
    break; // Exit when count > 5
  }
  console.log(count);
}
```

## Continue Statement

Skip current iteration and move to next:

```javascript
// Print only odd numbers
for (let i = 1; i <= 10; i++) {
  if (i % 2 === 0) {
    continue; // Skip even numbers
  }
  console.log(i);
}
// Output: 1, 3, 5, 7, 9

// Process valid items only
let scores = [85, -1, 92, 0, 78, -5, 88];
for (let i = 0; i < scores.length; i++) {
  if (scores[i] < 0) {
    console.log("Invalid score, skipping");
    continue;
  }
  console.log(`Processing score: ${scores[i]}`);
}

// Skip empty strings
let names = ["Alice", "", "Bob", "", "Charlie"];
for (let name of names) {
  if (!name) continue;
  console.log(`Hello, ${name}!`);
}
```

## Modern Loop Methods

JavaScript arrays have built-in iteration methods:

```javascript
let numbers = [1, 2, 3, 4, 5];

// forEach - execute function for each element
numbers.forEach(num => {
  console.log(num * 2);
});

// for...of - loop through values
for (let num of numbers) {
  console.log(num);
}

// for...in - loop through indices (avoid for arrays)
for (let index in numbers) {
  console.log(`Index ${index}: ${numbers[index]}`);
}
```

## Best Practices

✅ **Use for loops for counting** - Clear iteration count
✅ **Use while for unknown iterations** - Waiting for condition
✅ **Avoid infinite loops** - Always have exit condition
✅ **Use appropriate loop type** - Match loop to use case
✅ **Cache array length** - `let len = arr.length` in large loops
✅ **Use break/continue wisely** - Makes intent clear

## Common Pitfalls

❌ **Off-by-one errors** - `i <= arr.length` goes too far
❌ **Infinite loops** - Forgetting to update condition
❌ **Modifying loop variable wrong** - `i++` in wrong place
❌ **Wrong condition** - `i < 10` vs `i <= 10`
❌ **Nested loops performance** - O(n²) can be slow
❌ **Breaking wrong loop** - In nested loops, break only exits inner

## Infinite Loop Warning

```javascript
// ❌ DANGER: This never stops!
// while (true) {
//   console.log("Forever!");
// }

// ✅ CORRECT: Always have exit condition
let count = 0;
while (true) {
  console.log(count);
  count++;
  if (count >= 10) break;
}

// ❌ DANGER: Forgot to increment
// let i = 0;
// while (i < 10) {
//   console.log(i);
//   // Forgot i++; - infinite loop!
// }
```
',
  45,
  5,
  ARRAY[
    'Write for loops to iterate specific times',
    'Use while and do-while loops appropriately',
    'Control loop execution with break and continue',
    'Avoid off-by-one errors and infinite loops',
    'Choose the right loop type for each situation'
  ],
  '{"external_links": ["https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration", "https://javascript.info/while-for"]}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Lesson 6: Functions Basics
INSERT INTO ai_learning_lessons (
  id,
  learning_path_id,
  title,
  description,
  content_type,
  content,
  duration_minutes,
  order_index,
  learning_objectives,
  resources
) VALUES (
  '66666666-6666-6666-6666-666666666666',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Functions Basics',
  'Master function declarations, expressions, parameters, return values, and default parameters.',
  'quiz',
  '# Functions Basics

## What Are Functions?

Functions are reusable blocks of code that perform specific tasks:

```javascript
// Define a function
function greet() {
  console.log("Hello, World!");
}

// Call the function
greet(); // Output: Hello, World!
greet(); // Can call multiple times
greet();
```

**Benefits of Functions:**
- ✅ Reuse code without repetition
- ✅ Organize code into logical units
- ✅ Make code easier to test and debug
- ✅ Break complex problems into smaller pieces

## Function Declarations

The traditional way to create functions:

```javascript
function sayHello() {
  console.log("Hello!");
}

function calculateArea(width, height) {
  let area = width * height;
  console.log(`Area: ${area}`);
}

calculateArea(5, 10); // Output: Area: 50

// Functions can call other functions
function greetUser() {
  sayHello();
  console.log("Welcome to our app!");
}

greetUser();
// Output:
// Hello!
// Welcome to our app!
```

## Parameters and Arguments

Pass data into functions:

```javascript
// Parameter: name in function definition
function greet(name) {
  console.log(`Hello, ${name}!`);
}

// Argument: actual value passed
greet("Alice");   // Hello, Alice!
greet("Bob");     // Hello, Bob!

// Multiple parameters
function introduce(name, age, city) {
  console.log(`I''m ${name}, ${age} years old, from ${city}.`);
}

introduce("Alice", 25, "New York");
// Output: I''m Alice, 25 years old, from New York.

// Order matters
introduce("Tokyo", "Bob", 30); // Wrong order!
// Output: I''m Tokyo, Bob years old, from 30. (incorrect)
```

### Default Parameters

Provide default values for parameters:

```javascript
function greet(name = "Guest") {
  console.log(`Hello, ${name}!`);
}

greet("Alice");  // Hello, Alice!
greet();         // Hello, Guest! (uses default)

function createUser(name, role = "user", active = true) {
  console.log(`User: ${name}, Role: ${role}, Active: ${active}`);
}

createUser("Alice");                    // User: Alice, Role: user, Active: true
createUser("Bob", "admin");             // User: Bob, Role: admin, Active: true
createUser("Charlie", "moderator", false); // User: Charlie, Role: moderator, Active: false

// Default with expressions
function calculatePrice(price, discount = price * 0.1) {
  return price - discount;
}

console.log(calculatePrice(100));     // 90 (10% discount)
console.log(calculatePrice(100, 20)); // 80 (explicit discount)
```

## Return Values

Functions can return values to the caller:

```javascript
function add(a, b) {
  return a + b;
}

let result = add(5, 3);
console.log(result); // 8

// Use return value directly
console.log(add(10, 20)); // 30
let total = add(15, 25) + add(10, 5); // 55

// Multiple return statements
function getGrade(score) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

console.log(getGrade(85)); // "B"

// Without return, function returns undefined
function sayHello(name) {
  console.log(`Hello, ${name}`);
  // No return statement
}

let result2 = sayHello("Alice"); // Hello, Alice
console.log(result2); // undefined
```

### Early Returns

Exit function early when condition is met:

```javascript
function checkAge(age) {
  if (age < 0) {
    return "Invalid age";
  }
  if (age < 18) {
    return "Minor";
  }
  if (age < 65) {
    return "Adult";
  }
  return "Senior";
}

// Returning objects
function createUser(name, email) {
  return {
    name: name,
    email: email,
    createdAt: new Date()
  };
}

let user = createUser("Alice", "alice@example.com");
console.log(user.name); // Alice
```

## Function Expressions

Assign functions to variables:

```javascript
// Function expression
const greet = function(name) {
  console.log(`Hello, ${name}!`);
};

greet("Alice"); // Hello, Alice!

// Can pass function expressions as arguments
const add = function(a, b) {
  return a + b;
};

const multiply = function(a, b) {
  return a * b;
};

function calculate(operation, x, y) {
  return operation(x, y);
}

console.log(calculate(add, 5, 3));      // 8
console.log(calculate(multiply, 5, 3)); // 15
```

## Arrow Functions

Shorter syntax for function expressions:

```javascript
// Traditional function expression
const add = function(a, b) {
  return a + b;
};

// Arrow function
const add2 = (a, b) => {
  return a + b;
};

// Even shorter (implicit return)
const add3 = (a, b) => a + b;

console.log(add3(5, 3)); // 8

// Single parameter doesn''t need parentheses
const square = x => x * x;
console.log(square(5)); // 25

// No parameters need empty parentheses
const greet = () => console.log("Hello!");
greet(); // Hello!

// Returning objects (need parentheses)
const createUser = (name, age) => ({ name: name, age: age });
console.log(createUser("Alice", 25)); // { name: "Alice", age: 25 }
```

## Function Scope

Variables inside functions are local:

```javascript
function calculate() {
  let result = 10 + 5; // Local variable
  console.log(result);
}

calculate(); // 15
// console.log(result); // ❌ Error: result is not defined

// Function parameters are also local
function greet(name) {
  console.log(name);
}

greet("Alice"); // Alice
// console.log(name); // ❌ Error: name is not defined

// Global vs local
let globalVar = "I''m global";

function test() {
  let localVar = "I''m local";
  console.log(globalVar); // ✅ Can access global
  console.log(localVar);  // ✅ Can access local
}

test();
console.log(globalVar); // ✅ Can access global
// console.log(localVar); // ❌ Error: localVar is not defined
```

## Best Practices

✅ **Single Responsibility** - Each function does one thing
✅ **Descriptive names** - Use verbs: `calculateTotal`, `getUserData`
✅ **Keep functions short** - Ideally under 20 lines
✅ **Use return values** - Don''t just console.log
✅ **Default parameters** - Handle missing arguments
✅ **Avoid side effects** - Don''t modify global state when possible

## Common Pitfalls

❌ **Forgetting to return** - Function returns undefined
❌ **Wrong parameter order** - Arguments must match parameters
❌ **Modifying parameters** - Can cause unexpected behavior
❌ **Too many parameters** - Use objects for 4+ parameters
❌ **Not calling function** - `greet` vs `greet()` - forgot parentheses
❌ **Parameter vs argument confusion** - Parameters are placeholders, arguments are values

## Function vs Function Expression vs Arrow

```javascript
// Declaration: Hoisted (can call before definition)
greet1("Alice"); // ✅ Works
function greet1(name) {
  console.log(`Hello, ${name}`);
}

// Expression: Not hoisted
// greet2("Bob"); // ❌ Error: Cannot access before initialization
const greet2 = function(name) {
  console.log(`Hello, ${name}`);
};

// Arrow: Not hoisted, shorter syntax
const greet3 = name => console.log(`Hello, ${name}`);

// When to use:
// - Declarations: Top-level functions, need hoisting
// - Expressions: Callbacks, passing functions
// - Arrow: Short callbacks, modern code
```

## Practical Examples

```javascript
// Validation function
function isValidEmail(email) {
  return email.includes("@") && email.includes(".");
}

console.log(isValidEmail("user@example.com")); // true
console.log(isValidEmail("invalid-email"));     // false

// Calculation function
function calculateDiscount(price, discountPercent = 10) {
  let discount = price * (discountPercent / 100);
  return price - discount;
}

console.log(calculateDiscount(100));     // 90
console.log(calculateDiscount(100, 20)); // 80

// Array processing
function getTotal(numbers) {
  let sum = 0;
  for (let num of numbers) {
    sum += num;
  }
  return sum;
}

console.log(getTotal([1, 2, 3, 4, 5])); // 15

// String formatting
function formatName(firstName, lastName) {
  return `${lastName}, ${firstName}`;
}

console.log(formatName("John", "Doe")); // "Doe, John"
```
',
  50,
  6,
  ARRAY[
    'Create and call functions using declarations',
    'Use parameters and arguments to pass data',
    'Return values from functions',
    'Apply default parameters for optional arguments',
    'Write arrow functions with concise syntax'
  ],
  '{"external_links": ["https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions", "https://javascript.info/function-basics"]}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Lesson 7: Arrays and Array Methods
INSERT INTO ai_learning_lessons (
  id,
  learning_path_id,
  title,
  description,
  content_type,
  content,
  duration_minutes,
  order_index,
  learning_objectives,
  resources
) VALUES (
  '77777777-7777-7777-7777-777777777777',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Arrays and Array Methods',
  'Master JavaScript arrays, array manipulation, and essential array methods like map, filter, and reduce.',
  'quiz',
  '# Arrays and Array Methods

## What Are Arrays?

Arrays store multiple values in a single variable, organized by position (index):

```javascript
// Creating arrays
let fruits = ["apple", "banana", "orange"];
let numbers = [1, 2, 3, 4, 5];
let mixed = [1, "hello", true, null];
let empty = [];

// Arrays can hold any type of value
let users = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 }
];
```

## Accessing Array Elements

Arrays use zero-based indexing:

```javascript
let colors = ["red", "green", "blue", "yellow"];

console.log(colors[0]);  // "red" (first element)
console.log(colors[1]);  // "green"
console.log(colors[3]);  // "yellow" (last element)
console.log(colors[4]);  // undefined (doesn''t exist)

// Negative indices don''t work in regular access
console.log(colors[-1]); // undefined

// Get array length
console.log(colors.length); // 4

// Access last element
console.log(colors[colors.length - 1]); // "yellow"
```

## Modifying Arrays

### Adding Elements

```javascript
let fruits = ["apple", "banana"];

// push() - Add to end
fruits.push("orange");
console.log(fruits); // ["apple", "banana", "orange"]

// Can push multiple elements
fruits.push("grape", "mango");
console.log(fruits); // ["apple", "banana", "orange", "grape", "mango"]

// unshift() - Add to beginning
fruits.unshift("strawberry");
console.log(fruits); // ["strawberry", "apple", "banana", "orange", "grape", "mango"]

// Direct assignment
fruits[fruits.length] = "kiwi"; // Add to end
console.log(fruits);
```

### Removing Elements

```javascript
let numbers = [1, 2, 3, 4, 5];

// pop() - Remove from end
let lastNum = numbers.pop();
console.log(lastNum);  // 5
console.log(numbers);  // [1, 2, 3, 4]

// shift() - Remove from beginning
let firstNum = numbers.shift();
console.log(firstNum); // 1
console.log(numbers);  // [2, 3, 4]

// splice() - Remove from middle
let removed = numbers.splice(1, 1); // Remove 1 element at index 1
console.log(removed);  // [3]
console.log(numbers);  // [2, 4]
```

## Essential Array Methods

### map() - Transform Each Element

Creates a new array by transforming each element:

```javascript
let numbers = [1, 2, 3, 4, 5];

// Double each number
let doubled = numbers.map(num => num * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// Original array unchanged
console.log(numbers); // [1, 2, 3, 4, 5]

// Convert to strings
let strings = numbers.map(num => `Number: ${num}`);
console.log(strings); // ["Number: 1", "Number: 2", ...]

// Extract property from objects
let users = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 },
  { name: "Charlie", age: 35 }
];

let names = users.map(user => user.name);
console.log(names); // ["Alice", "Bob", "Charlie"]

let ages = users.map(user => user.age);
console.log(ages); // [25, 30, 35]
```

### filter() - Select Elements

Creates a new array with elements that pass a test:

```javascript
let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Get even numbers
let evens = numbers.filter(num => num % 2 === 0);
console.log(evens); // [2, 4, 6, 8, 10]

// Get numbers greater than 5
let large = numbers.filter(num => num > 5);
console.log(large); // [6, 7, 8, 9, 10]

// Filter objects
let users = [
  { name: "Alice", age: 25, active: true },
  { name: "Bob", age: 30, active: false },
  { name: "Charlie", age: 35, active: true }
];

let activeUsers = users.filter(user => user.active);
console.log(activeUsers);
// [{ name: "Alice", age: 25, active: true },
//  { name: "Charlie", age: 35, active: true }]

let adults = users.filter(user => user.age >= 30);
console.log(adults);
// [{ name: "Bob", age: 30, active: false },
//  { name: "Charlie", age: 35, active: true }]
```

### reduce() - Combine Elements

Reduces array to a single value:

```javascript
let numbers = [1, 2, 3, 4, 5];

// Sum all numbers
let sum = numbers.reduce((total, num) => total + num, 0);
console.log(sum); // 15

// Multiply all numbers
let product = numbers.reduce((result, num) => result * num, 1);
console.log(product); // 120

// Find maximum
let max = numbers.reduce((max, num) => num > max ? num : max, numbers[0]);
console.log(max); // 5

// Count occurrences
let fruits = ["apple", "banana", "apple", "orange", "banana", "apple"];
let count = fruits.reduce((acc, fruit) => {
  acc[fruit] = (acc[fruit] || 0) + 1;
  return acc;
}, {});
console.log(count); // { apple: 3, banana: 2, orange: 1 }

// Group by property
let users = [
  { name: "Alice", role: "admin" },
  { name: "Bob", role: "user" },
  { name: "Charlie", role: "admin" }
];

let grouped = users.reduce((acc, user) => {
  if (!acc[user.role]) acc[user.role] = [];
  acc[user.role].push(user);
  return acc;
}, {});
console.log(grouped);
// { admin: [{name: "Alice", ...}, {name: "Charlie", ...}],
//   user: [{name: "Bob", ...}] }
```

## Other Useful Array Methods

### find() and findIndex()

```javascript
let users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" }
];

// Find first matching element
let user = users.find(u => u.id === 2);
console.log(user); // { id: 2, name: "Bob" }

// Find index of first matching element
let index = users.findIndex(u => u.name === "Charlie");
console.log(index); // 2

// Returns undefined/−1 if not found
let notFound = users.find(u => u.id === 99);
console.log(notFound); // undefined
```

### includes() and indexOf()

```javascript
let fruits = ["apple", "banana", "orange"];

// Check if element exists
console.log(fruits.includes("banana")); // true
console.log(fruits.includes("grape"));  // false

// Get index of element
console.log(fruits.indexOf("orange")); // 2
console.log(fruits.indexOf("grape"));  // -1 (not found)

// Case sensitive
console.log(fruits.includes("Apple")); // false
```

### slice() - Extract Portion

```javascript
let numbers = [1, 2, 3, 4, 5];

// Get elements from index 1 to 3 (not including 3)
let sliced = numbers.slice(1, 3);
console.log(sliced);  // [2, 3]
console.log(numbers); // [1, 2, 3, 4, 5] (original unchanged)

// From index to end
let fromTwo = numbers.slice(2);
console.log(fromTwo); // [3, 4, 5]

// Last 2 elements
let lastTwo = numbers.slice(-2);
console.log(lastTwo); // [4, 5]

// Copy entire array
let copy = numbers.slice();
console.log(copy); // [1, 2, 3, 4, 5]
```

## Chaining Array Methods

Combine multiple methods for powerful operations:

```javascript
let users = [
  { name: "Alice", age: 25, score: 85 },
  { name: "Bob", age: 30, score: 92 },
  { name: "Charlie", age: 35, score: 78 },
  { name: "Diana", age: 28, score: 95 }
];

// Get names of users with score >= 85, sorted
let topScorers = users
  .filter(user => user.score >= 85)
  .map(user => user.name)
  .sort();

console.log(topScorers); // ["Alice", "Bob", "Diana"]

// Calculate average score of users under 30
let youngAverage = users
  .filter(user => user.age < 30)
  .map(user => user.score)
  .reduce((sum, score) => sum + score, 0) /
  users.filter(user => user.age < 30).length;

console.log(youngAverage); // 90 (avg of 85 and 95)
```

## Best Practices

✅ **Use const for arrays** - Prevents reassignment (can still modify elements)
✅ **Use appropriate method** - map for transformation, filter for selection
✅ **Don''t mutate when not needed** - Use methods that return new arrays
✅ **Check length before accessing** - Avoid undefined errors
✅ **Chain methods** - Cleaner than multiple statements
✅ **Use arrow functions** - Concise callback syntax

## Common Pitfalls

❌ **Confusing push/unshift** - push adds to end, unshift to beginning
❌ **Forgetting return in map/filter** - Must return value in callback
❌ **Mutating during iteration** - Can cause unexpected behavior
❌ **Using wrong method** - forEach doesn''t return array, map does
❌ **Off-by-one with length** - Last index is length - 1
❌ **Modifying original with splice** - Use slice for non-mutating copy

## Array Method Comparison

```javascript
let numbers = [1, 2, 3, 4, 5];

// forEach - Execute function, returns undefined
numbers.forEach(num => console.log(num)); // Prints 1-5, returns undefined

// map - Transform elements, returns new array
let doubled = numbers.map(num => num * 2); // Returns [2, 4, 6, 8, 10]

// filter - Select elements, returns new array
let evens = numbers.filter(num => num % 2 === 0); // Returns [2, 4]

// reduce - Combine to single value
let sum = numbers.reduce((acc, num) => acc + num, 0); // Returns 15

// find - First matching element
let found = numbers.find(num => num > 3); // Returns 4

// some - Check if any match
let hasEven = numbers.some(num => num % 2 === 0); // Returns true

// every - Check if all match
let allPositive = numbers.every(num => num > 0); // Returns true
```

## Practical Examples

```javascript
// Remove duplicates
let numbers = [1, 2, 2, 3, 4, 4, 5];
let unique = [...new Set(numbers)];
console.log(unique); // [1, 2, 3, 4, 5]

// Flatten nested array
let nested = [[1, 2], [3, 4], [5, 6]];
let flat = nested.reduce((acc, arr) => acc.concat(arr), []);
console.log(flat); // [1, 2, 3, 4, 5, 6]

// Sort numbers (correct way)
let nums = [10, 5, 40, 25, 100];
nums.sort((a, b) => a - b); // Ascending
console.log(nums); // [5, 10, 25, 40, 100]

// Reverse without mutating
let original = [1, 2, 3];
let reversed = [...original].reverse();
console.log(original); // [1, 2, 3]
console.log(reversed); // [3, 2, 1]
```
',
  50,
  7,
  ARRAY[
    'Create and manipulate arrays with push, pop, shift, and unshift',
    'Transform arrays using map, filter, and reduce',
    'Find elements with find, findIndex, and includes',
    'Chain array methods for complex operations',
    'Understand when to use mutating vs non-mutating methods'
  ],
  '{"external_links": ["https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array", "https://javascript.info/array-methods"]}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Lesson 8: Objects and Properties
INSERT INTO ai_learning_lessons (
  id,
  learning_path_id,
  title,
  description,
  content_type,
  content,
  duration_minutes,
  order_index,
  learning_objectives,
  resources
) VALUES (
  '88888888-8888-8888-8888-888888888888',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Objects and Properties',
  'Master JavaScript objects, property access, object manipulation, and working with nested structures.',
  'quiz',
  '# Objects and Properties

## What Are Objects?

Objects store collections of key-value pairs (properties):

```javascript
// Creating objects with object literals
let user = {
  name: "Alice",
  age: 25,
  email: "alice@example.com",
  isActive: true
};

// Empty object
let emptyObj = {};

// Objects can contain any type
let person = {
  name: "Bob",
  age: 30,
  hobbies: ["reading", "coding"],
  address: {
    city: "New York",
    country: "USA"
  },
  greet: function() {
    console.log("Hello!");
  }
};
```

## Accessing Properties

### Dot Notation

Use dot notation for simple property names:

```javascript
let user = {
  name: "Alice",
  age: 25,
  email: "alice@example.com"
};

console.log(user.name);  // "Alice"
console.log(user.age);   // 25
console.log(user.email); // "alice@example.com"

// Access nested properties
let person = {
  name: "Bob",
  address: {
    city: "New York",
    zipCode: "10001"
  }
};

console.log(person.address.city); // "New York"
```

### Bracket Notation

Use bracket notation for dynamic or complex property names:

```javascript
let user = {
  name: "Alice",
  age: 25,
  "favorite color": "blue" // Property with space
};

// Bracket notation with strings
console.log(user["name"]); // "Alice"
console.log(user["age"]);  // 25
console.log(user["favorite color"]); // "blue"

// Dynamic property access
let propertyName = "email";
let user2 = { email: "alice@example.com" };
console.log(user2[propertyName]); // "alice@example.com"

// Computed property names
let key = "score";
console.log(user2[key]); // Access property dynamically

// With variables
let fields = ["name", "age", "email"];
fields.forEach(field => {
  console.log(`${field}: ${user[field]}`);
});
```

## Adding and Updating Properties

```javascript
let user = {
  name: "Alice"
};

// Add new properties
user.age = 25;
user.email = "alice@example.com";
user["favorite color"] = "blue";

console.log(user);
// { name: "Alice", age: 25, email: "alice@example.com", "favorite color": "blue" }

// Update existing properties
user.age = 26;
user.name = "Alicia";

console.log(user.age);  // 26
console.log(user.name); // "Alicia"

// Add method
user.greet = function() {
  console.log(`Hello, I''m ${this.name}`);
};

user.greet(); // "Hello, I''m Alicia"
```

## Deleting Properties

```javascript
let user = {
  name: "Alice",
  age: 25,
  email: "alice@example.com",
  tempData: "to be removed"
};

// Delete property
delete user.tempData;
console.log(user.tempData); // undefined

delete user.email;
console.log(user);
// { name: "Alice", age: 25 }

// Checking if property exists after deletion
console.log("email" in user); // false
```

## Object Methods

### Object.keys() - Get Property Names

```javascript
let user = {
  name: "Alice",
  age: 25,
  email: "alice@example.com"
};

let keys = Object.keys(user);
console.log(keys); // ["name", "age", "email"]

// Iterate over keys
Object.keys(user).forEach(key => {
  console.log(`${key}: ${user[key]}`);
});
// Output:
// name: Alice
// age: 25
// email: alice@example.com
```

### Object.values() - Get Property Values

```javascript
let user = {
  name: "Alice",
  age: 25,
  email: "alice@example.com"
};

let values = Object.values(user);
console.log(values); // ["Alice", 25, "alice@example.com"]

// Sum numeric values
let scores = { math: 85, science: 90, english: 88 };
let total = Object.values(scores).reduce((sum, score) => sum + score, 0);
console.log(total); // 263
```

### Object.entries() - Get Key-Value Pairs

```javascript
let user = {
  name: "Alice",
  age: 25,
  email: "alice@example.com"
};

let entries = Object.entries(user);
console.log(entries);
// [["name", "Alice"], ["age", 25], ["email", "alice@example.com"]]

// Iterate with destructuring
Object.entries(user).forEach(([key, value]) => {
  console.log(`${key}: ${value}`);
});

// Convert to Map
let userMap = new Map(Object.entries(user));
console.log(userMap.get("name")); // "Alice"
```

## Nested Objects

Working with objects inside objects:

```javascript
let company = {
  name: "Tech Corp",
  employees: {
    engineering: {
      count: 50,
      lead: "Alice"
    },
    sales: {
      count: 30,
      lead: "Bob"
    }
  },
  revenue: 1000000
};

// Access nested properties
console.log(company.employees.engineering.lead); // "Alice"
console.log(company.employees.sales.count);      // 30

// Update nested properties
company.employees.engineering.count = 55;
company.employees.engineering.newHire = "Charlie";

console.log(company.employees.engineering);
// { count: 55, lead: "Alice", newHire: "Charlie" }

// Add new nested object
company.employees.marketing = {
  count: 20,
  lead: "Diana"
};
```

### Safe Property Access

Avoid errors when accessing potentially undefined properties:

```javascript
let user = {
  name: "Alice",
  address: {
    city: "New York"
  }
};

// ❌ Unsafe - throws error if address is undefined
// console.log(user.address.zipCode.value); // Error!

// ✅ Safe with conditional checks
if (user.address && user.address.zipCode) {
  console.log(user.address.zipCode.value);
}

// ✅ Safe with optional chaining (modern JavaScript)
console.log(user.address?.zipCode?.value); // undefined (no error)

// ✅ Provide defaults
let city = user.address?.city || "Unknown";
console.log(city); // "New York"

let country = user.address?.country || "USA";
console.log(country); // "USA"
```

## Object Destructuring

Extract properties into variables:

```javascript
let user = {
  name: "Alice",
  age: 25,
  email: "alice@example.com"
};

// Extract properties
let { name, age, email } = user;
console.log(name);  // "Alice"
console.log(age);   // 25
console.log(email); // "alice@example.com"

// Rename variables
let { name: userName, age: userAge } = user;
console.log(userName); // "Alice"
console.log(userAge);  // 25

// Default values
let { name: n, role = "user" } = user;
console.log(n);    // "Alice"
console.log(role); // "user" (default)

// Nested destructuring
let person = {
  name: "Bob",
  address: {
    city: "New York",
    country: "USA"
  }
};

let { name, address: { city, country } } = person;
console.log(name);    // "Bob"
console.log(city);    // "New York"
console.log(country); // "USA"
```

## Copying Objects

### Shallow Copy

```javascript
let original = {
  name: "Alice",
  age: 25
};

// Spread operator (shallow copy)
let copy1 = { ...original };
copy1.age = 26;

console.log(original.age); // 25 (unchanged)
console.log(copy1.age);    // 26

// Object.assign (shallow copy)
let copy2 = Object.assign({}, original);

// Add properties while copying
let extended = { ...original, email: "alice@example.com" };
console.log(extended);
// { name: "Alice", age: 25, email: "alice@example.com" }
```

### Deep Copy Warning

```javascript
let original = {
  name: "Alice",
  address: {
    city: "New York"
  }
};

// Shallow copy - nested objects are referenced
let shallow = { ...original };
shallow.address.city = "Boston";

console.log(original.address.city); // "Boston" (changed!)

// Deep copy - need special handling
let deep = JSON.parse(JSON.stringify(original));
deep.address.city = "Chicago";

console.log(original.address.city); // "Boston" (unchanged)
```

## Checking Properties

```javascript
let user = {
  name: "Alice",
  age: 25
};

// Check if property exists
console.log("name" in user);   // true
console.log("email" in user);  // false

// hasOwnProperty
console.log(user.hasOwnProperty("name")); // true
console.log(user.hasOwnProperty("email")); // false

// Accessing non-existent property
console.log(user.email); // undefined

// Check with typeof
if (typeof user.email !== "undefined") {
  console.log(user.email);
}
```

## Best Practices

✅ **Use dot notation when possible** - More readable
✅ **Use bracket notation for dynamic access** - With variables
✅ **Use const for objects** - Prevents reassignment
✅ **Use destructuring** - Cleaner code when extracting properties
✅ **Check for undefined** - Use optional chaining (?.)
✅ **Use meaningful property names** - Descriptive keys

## Common Pitfalls

❌ **Forgetting quotes in bracket notation** - user["name"] not user[name]
❌ **Mutating objects unintentionally** - Shallow copies share references
❌ **Accessing undefined nested properties** - Use optional chaining
❌ **Using reserved keywords as keys** - Can cause issues
❌ **Assuming property order** - Objects don''t guarantee order
❌ **Comparing objects with ==** - Compares reference, not value

## Practical Examples

```javascript
// Merge objects
let defaults = { theme: "light", fontSize: 14 };
let userPrefs = { theme: "dark" };
let settings = { ...defaults, ...userPrefs };
console.log(settings); // { theme: "dark", fontSize: 14 }

// Transform object
let prices = { apple: 1.5, banana: 0.8, orange: 1.2 };
let discounted = Object.fromEntries(
  Object.entries(prices).map(([key, value]) => [key, value * 0.9])
);
console.log(discounted); // All prices reduced by 10%

// Filter object properties
let user = { name: "Alice", age: 25, temp: null };
let cleaned = Object.fromEntries(
  Object.entries(user).filter(([key, value]) => value !== null)
);
console.log(cleaned); // { name: "Alice", age: 25 }

// Count property values
let votes = { alice: "yes", bob: "no", charlie: "yes", diana: "yes" };
let count = Object.values(votes).reduce((acc, vote) => {
  acc[vote] = (acc[vote] || 0) + 1;
  return acc;
}, {});
console.log(count); // { yes: 3, no: 1 }
```
',
  45,
  8,
  ARRAY[
    'Create objects with object literals',
    'Access and modify properties using dot and bracket notation',
    'Use Object.keys(), Object.values(), and Object.entries()',
    'Work with nested objects safely',
    'Apply object destructuring for cleaner code'
  ],
  '{"external_links": ["https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object", "https://javascript.info/object"]}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Lesson 9: String Methods and Template Literals
INSERT INTO ai_learning_lessons (
  id,
  learning_path_id,
  title,
  description,
  content_type,
  content,
  duration_minutes,
  order_index,
  learning_objectives,
  resources
) VALUES (
  '99999999-9999-9999-9999-999999999999',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'String Methods and Template Literals',
  'Learn essential string manipulation methods and master template literals for dynamic string creation.',
  'quiz',
  '# String Methods and Template Literals

## String Basics

Strings are sequences of characters used for text:

```javascript
let single = ''Hello'';
let double = "World";
let template = `Hello World`;

// Strings are immutable
let text = "Hello";
text[0] = "h"; // Doesn''t work
console.log(text); // Still "Hello"

// String length
let message = "Hello World";
console.log(message.length); // 11

// Strings are zero-indexed
console.log(message[0]);  // "H"
console.log(message[6]);  // "W"
console.log(message[10]); // "d"
```

## Essential String Methods

### Case Conversion

```javascript
let text = "Hello World";

console.log(text.toUpperCase()); // "HELLO WORLD"
console.log(text.toLowerCase()); // "hello world"

// Original unchanged
console.log(text); // "Hello World"

// Practical use: case-insensitive comparison
let input = "ALICE";
let expected = "alice";
console.log(input.toLowerCase() === expected); // true

// Title case (capitalize first letter)
let name = "alice smith";
let titleCase = name.split(" ")
  .map(word => word[0].toUpperCase() + word.slice(1))
  .join(" ");
console.log(titleCase); // "Alice Smith"
```

### trim() - Remove Whitespace

```javascript
let text = "   Hello World   ";

console.log(text.trim());      // "Hello World"
console.log(text.trimStart()); // "Hello World   "
console.log(text.trimEnd());   // "   Hello World"

// Practical use: clean user input
let userInput = "  alice@example.com  ";
let email = userInput.trim().toLowerCase();
console.log(email); // "alice@example.com"

// Remove all whitespace
let code = " let x = 5; ";
let cleaned = code.replace(/\s/g, "");
console.log(cleaned); // "letx=5;"
```

### slice() - Extract Substring

```javascript
let text = "Hello World";

// slice(start, end) - end not included
console.log(text.slice(0, 5));   // "Hello"
console.log(text.slice(6, 11));  // "World"
console.log(text.slice(6));      // "World" (to end)

// Negative indices - count from end
console.log(text.slice(-5));     // "World"
console.log(text.slice(-5, -1)); // "Worl"

// Get last N characters
let filename = "document.pdf";
let extension = filename.slice(-3);
console.log(extension); // "pdf"

// Get first N characters
let preview = "This is a long text".slice(0, 10);
console.log(preview + "..."); // "This is a..."
```

### split() - Convert to Array

```javascript
let text = "apple,banana,orange";

// Split by delimiter
let fruits = text.split(",");
console.log(fruits); // ["apple", "banana", "orange"]

// Split into characters
let word = "Hello";
let chars = word.split("");
console.log(chars); // ["H", "e", "l", "l", "o"]

// Split by spaces
let sentence = "The quick brown fox";
let words = sentence.split(" ");
console.log(words); // ["The", "quick", "brown", "fox"]

// Limit splits
let limited = text.split(",", 2);
console.log(limited); // ["apple", "banana"]

// Practical: parse CSV
let csv = "Alice,25,alice@example.com";
let [name, age, email] = csv.split(",");
console.log(name, age, email); // Alice 25 alice@example.com
```

### includes() - Check for Substring

```javascript
let text = "Hello World";

console.log(text.includes("World")); // true
console.log(text.includes("world")); // false (case-sensitive)
console.log(text.includes("o"));     // true

// Start searching from position
console.log(text.includes("o", 5));  // true (finds "o" in "World")
console.log(text.includes("o", 8));  // false (past "o" in "World")

// Practical: validation
let email = "user@example.com";
let isValid = email.includes("@") && email.includes(".");
console.log(isValid); // true

// Filter array of strings
let emails = ["alice@gmail.com", "bob@yahoo.com", "charlie@gmail.com"];
let gmailUsers = emails.filter(email => email.includes("@gmail.com"));
console.log(gmailUsers); // ["alice@gmail.com", "charlie@gmail.com"]
```

### indexOf() and lastIndexOf()

```javascript
let text = "Hello World, Hello Universe";

// Find first occurrence
console.log(text.indexOf("Hello"));     // 0
console.log(text.indexOf("World"));     // 6
console.log(text.indexOf("Goodbye"));   // -1 (not found)

// Find last occurrence
console.log(text.lastIndexOf("Hello")); // 13

// Start searching from position
console.log(text.indexOf("Hello", 5));  // 13 (skips first)

// Practical: check if string starts/ends with
function startsWith(str, prefix) {
  return str.indexOf(prefix) === 0;
}
console.log(startsWith("Hello World", "Hello")); // true

// Extract substring between markers
let html = "<div>Content here</div>";
let start = html.indexOf(">") + 1;
let end = html.lastIndexOf("<");
let content = html.slice(start, end);
console.log(content); // "Content here"
```

## Template Literals

Create strings with embedded expressions:

### Basic Template Literals

```javascript
// Use backticks
let name = "Alice";
let age = 25;

// Embed variables
let greeting = `Hello, ${name}!`;
console.log(greeting); // "Hello, Alice!"

// Embed expressions
let message = `${name} is ${age} years old`;
console.log(message); // "Alice is 25 years old"

// Calculations inside template
let price = 100;
let tax = 0.08;
let total = `Total: $${price + (price * tax)}`;
console.log(total); // "Total: $108"

// Function calls
let upper = `Name: ${name.toUpperCase()}`;
console.log(upper); // "Name: ALICE"
```

### Multi-line Strings

```javascript
// Traditional (hard to read)
let html1 = "<div>\n" +
            "  <h1>Title</h1>\n" +
            "  <p>Content</p>\n" +
            "</div>";

// Template literal (easier)
let html2 = `
<div>
  <h1>Title</h1>
  <p>Content</p>
</div>
`;

console.log(html2);

// SQL query example
let userId = 123;
let query = `
  SELECT name, email, age
  FROM users
  WHERE id = ${userId}
  ORDER BY name
`;
```

### Nested Templates

```javascript
let users = [
  { name: "Alice", score: 85 },
  { name: "Bob", score: 92 },
  { name: "Charlie", score: 78 }
];

// Generate HTML list
let html = `
<ul>
  ${users.map(user => `
    <li>${user.name}: ${user.score} points</li>
  `).join("")}
</ul>
`;

console.log(html);
// <ul>
//   <li>Alice: 85 points</li>
//   <li>Bob: 92 points</li>
//   <li>Charlie: 78 points</li>
// </ul>
```

### Conditional Content

```javascript
let user = { name: "Alice", isPremium: true };

let message = `
  Welcome, ${user.name}!
  ${user.isPremium ? "You have premium access." : "Upgrade to premium!"}
`;

console.log(message);
// Welcome, Alice!
// You have premium access.

// Complex conditions
let status = `Status: ${user.isPremium ? "Premium" : "Free"}`;
console.log(status); // "Status: Premium"
```

## Practical String Operations

### String Reversal

```javascript
function reverseString(str) {
  return str.split("").reverse().join("");
}

console.log(reverseString("Hello")); // "olleH"

// Palindrome check
function isPalindrome(str) {
  let cleaned = str.toLowerCase().replace(/[^a-z]/g, "");
  return cleaned === reverseString(cleaned);
}

console.log(isPalindrome("racecar")); // true
console.log(isPalindrome("hello"));   // false
```

### Word Count

```javascript
function wordCount(text) {
  return text.trim().split(/\s+/).length;
}

console.log(wordCount("Hello World"));           // 2
console.log(wordCount("  Multiple   spaces  ")); // 2

// Character count (excluding spaces)
function charCount(text) {
  return text.replace(/\s/g, "").length;
}

console.log(charCount("Hello World")); // 10
```

### Capitalize and Format

```javascript
// Capitalize first letter
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

console.log(capitalize("hELLO")); // "Hello"

// Title case
function toTitleCase(str) {
  return str.toLowerCase()
    .split(" ")
    .map(word => capitalize(word))
    .join(" ");
}

console.log(toTitleCase("hello world")); // "Hello World"

// Slug generation
function slugify(str) {
  return str.toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

console.log(slugify("Hello World! 123")); // "hello-world-123"
```

## Best Practices

✅ **Use template literals** - More readable than concatenation
✅ **Chain methods** - `str.trim().toLowerCase().split(" ")`
✅ **Cache results** - Don''t call expensive methods repeatedly
✅ **Use includes() for checks** - More readable than indexOf() !== -1
✅ **Validate before processing** - Check if string exists
✅ **Use appropriate method** - slice() for substrings, split() for arrays

## Common Pitfalls

❌ **Strings are immutable** - Methods return new strings
❌ **Case sensitivity** - includes("World") ≠ includes("world")
❌ **0-based indexing** - First character is index 0
❌ **Empty string vs undefined** - Check both conditions
❌ **Forgetting trim()** - User input often has whitespace
❌ **Wrong slice indices** - End index not included

## Method Chaining Example

```javascript
let userInput = "  ALICE@EXAMPLE.COM  ";

// Clean and format email
let email = userInput
  .trim()              // Remove whitespace
  .toLowerCase()       // Convert to lowercase
  .replace(/\s/g, ""); // Remove any internal spaces

console.log(email); // "alice@example.com"

// Process text
let text = "  Hello World  ";
let processed = text
  .trim()
  .split(" ")
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ");

console.log(processed); // "Hello World"
```
',
  40,
  9,
  ARRAY[
    'Manipulate strings with essential methods like trim, slice, and split',
    'Search strings using includes, indexOf, and lastIndexOf',
    'Create dynamic strings with template literals',
    'Build multi-line strings and embedded expressions',
    'Chain string methods for complex transformations'
  ],
  '{"external_links": ["https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String", "https://javascript.info/string"]}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Lesson 10: Scope and Hoisting
INSERT INTO ai_learning_lessons (
  id,
  learning_path_id,
  title,
  description,
  content_type,
  content,
  duration_minutes,
  order_index,
  learning_objectives,
  resources
) VALUES (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Scope and Hoisting',
  'Understand variable scope, lexical scope, hoisting behavior, and the temporal dead zone.',
  'quiz',
  '# Scope and Hoisting

## What is Scope?

Scope determines where variables and functions are accessible in your code:

```javascript
// Global scope - accessible everywhere
let globalVar = "I''m global";

function test() {
  // Function scope - only inside this function
  let localVar = "I''m local";
  console.log(globalVar); // ✅ Can access global
  console.log(localVar);  // ✅ Can access local
}

test();
console.log(globalVar); // ✅ Can access global
// console.log(localVar); // ❌ Error: localVar is not defined
```

## Types of Scope

### 1. Global Scope

Variables declared outside any function:

```javascript
let userName = "Alice"; // Global
const API_KEY = "abc123"; // Global

function greet() {
  console.log(userName); // Can access global
}

function updateUser() {
  userName = "Bob"; // Can modify global
}

greet(); // "Alice"
updateUser();
greet(); // "Bob"

// Window object in browsers (avoid this!)
var oldStyle = "accessible via window.oldStyle";
console.log(window.oldStyle); // Works but not recommended
```

### 2. Function Scope

Variables declared inside functions:

```javascript
function calculate() {
  let result = 10 + 5; // Function-scoped
  var oldResult = 20;  // Also function-scoped

  console.log(result); // ✅ Works

  if (true) {
    console.log(result); // ✅ Still accessible
  }
}

calculate();
// console.log(result); // ❌ Error: not defined

// Nested functions
function outer() {
  let outerVar = "outer";

  function inner() {
    let innerVar = "inner";
    console.log(outerVar); // ✅ Can access parent scope
    console.log(innerVar); // ✅ Can access own scope
  }

  inner();
  // console.log(innerVar); // ❌ Error: not defined
}

outer();
```

### 3. Block Scope

Variables declared with let/const inside {} blocks:

```javascript
// if block
if (true) {
  let blockVar = "I''m in a block";
  const blockConst = "Me too";
  var notBlocked = "I escape!";

  console.log(blockVar); // ✅ Works inside block
}

// console.log(blockVar); // ❌ Error: not defined
console.log(notBlocked); // ✅ var ignores block scope!

// for loop block
for (let i = 0; i < 3; i++) {
  console.log(i); // 0, 1, 2
}
// console.log(i); // ❌ Error: i is not defined

// Compare with var
for (var j = 0; j < 3; j++) {
  console.log(j); // 0, 1, 2
}
console.log(j); // ✅ 3 (var ignores block scope!)

// while block
while (true) {
  let temp = "temporary";
  break;
}
// console.log(temp); // ❌ Error: not defined
```

## Lexical Scope

Functions can access variables from their parent scope:

```javascript
let global = "global";

function outer() {
  let outerVar = "outer";

  function middle() {
    let middleVar = "middle";

    function inner() {
      let innerVar = "inner";

      // Can access all parent scopes
      console.log(global);     // ✅ "global"
      console.log(outerVar);   // ✅ "outer"
      console.log(middleVar);  // ✅ "middle"
      console.log(innerVar);   // ✅ "inner"
    }

    inner();
    // console.log(innerVar); // ❌ Error: can''t access child scope
  }

  middle();
}

outer();

// Practical example: closure
function createCounter() {
  let count = 0; // Private variable

  return {
    increment: function() {
      count++;
      return count;
    },
    decrement: function() {
      count--;
      return count;
    },
    getCount: function() {
      return count;
    }
  };
}

let counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.getCount());  // 2
// console.log(count); // ❌ Error: count is private
```

## Hoisting

JavaScript moves declarations to the top of their scope during compilation:

### Variable Hoisting with var

```javascript
// What you write:
console.log(x); // undefined (not error!)
var x = 5;
console.log(x); // 5

// How JavaScript interprets it:
var x; // Declaration hoisted
console.log(x); // undefined
x = 5; // Assignment stays
console.log(x); // 5

// Function scope hoisting
function test() {
  console.log(y); // undefined
  var y = 10;
  console.log(y); // 10
}

test();
```

### Variable Hoisting with let/const

```javascript
// Temporal Dead Zone (TDZ)
// console.log(a); // ❌ ReferenceError: Cannot access before initialization
let a = 5;
console.log(a); // 5

// const has same behavior
// console.log(b); // ❌ ReferenceError
const b = 10;

// Block scope with TDZ
{
  // TDZ starts
  // console.log(temp); // ❌ Error
  let temp = "value"; // TDZ ends
  console.log(temp); // ✅ "value"
}

// The TDZ exists to prevent bugs
function example() {
  // console.log(x); // ❌ Error
  let x = 10;
  console.log(x); // ✅ 10
}
```

### Function Hoisting

```javascript
// Function declarations are fully hoisted
greet("Alice"); // ✅ Works before declaration
console.log(greet); // ✅ [Function: greet]

function greet(name) {
  console.log(`Hello, ${name}!`);
}

// Function expressions are NOT hoisted like declarations
// sayHi("Bob"); // ❌ Error: Cannot access before initialization

const sayHi = function(name) {
  console.log(`Hi, ${name}!`);
};

sayHi("Bob"); // ✅ Works after declaration

// Arrow functions are also NOT hoisted
// greetArrow("Charlie"); // ❌ Error

const greetArrow = (name) => console.log(`Hey, ${name}!`);
```

## Scope Chain

JavaScript searches for variables through nested scopes:

```javascript
let level1 = "L1";

function outer() {
  let level2 = "L2";

  function inner() {
    let level3 = "L3";

    // Scope chain: inner → outer → global
    console.log(level3); // Found in inner scope
    console.log(level2); // Found in outer scope
    console.log(level1); // Found in global scope
    // console.log(level4); // ❌ Error: not found in chain
  }

  inner();
}

outer();

// Shadowing - inner variable hides outer
let name = "Global";

function test() {
  let name = "Local"; // Shadows global
  console.log(name); // "Local"

  function nested() {
    let name = "Nested"; // Shadows both
    console.log(name); // "Nested"
  }

  nested();
  console.log(name); // "Local"
}

test();
console.log(name); // "Global"
```

## Practical Examples

### Module Pattern with Scope

```javascript
const Calculator = (function() {
  // Private variables
  let result = 0;

  // Private function
  function log(operation, value) {
    console.log(`${operation}: ${value}`);
  }

  // Public API
  return {
    add: function(x) {
      result += x;
      log("Added", x);
      return this;
    },
    subtract: function(x) {
      result -= x;
      log("Subtracted", x);
      return this;
    },
    getResult: function() {
      return result;
    },
    reset: function() {
      result = 0;
      return this;
    }
  };
})();

Calculator.add(10).add(5).subtract(3);
console.log(Calculator.getResult()); // 12
// console.log(result); // ❌ Error: result is private
```

### Iterator with Closure

```javascript
function createIterator(array) {
  let index = 0;

  return {
    next: function() {
      if (index < array.length) {
        return { value: array[index++], done: false };
      }
      return { value: undefined, done: true };
    },
    reset: function() {
      index = 0;
    }
  };
}

let numbers = createIterator([1, 2, 3]);
console.log(numbers.next()); // { value: 1, done: false }
console.log(numbers.next()); // { value: 2, done: false }
console.log(numbers.next()); // { value: 3, done: false }
console.log(numbers.next()); // { value: undefined, done: true }
```

## Best Practices

✅ **Minimize global variables** - Reduce namespace pollution
✅ **Use block scope** - Prefer let/const over var
✅ **Declare before use** - Avoid hoisting confusion
✅ **Use const by default** - Only use let when needed
✅ **Keep functions small** - Easier to track scope
✅ **Use closures wisely** - For private data and encapsulation

## Common Pitfalls

❌ **var hoisting confusion** - Use let/const instead
❌ **Temporal dead zone** - Can''t access let/const before declaration
❌ **Accidental globals** - Always use let/const/var
❌ **Closure memory leaks** - Unreleased references
❌ **Shadowing variables** - Can make code confusing
❌ **Loop variable scope** - Use let in for loops, not var

## Scope Debugging

```javascript
// Check if variable exists
if (typeof myVar !== "undefined") {
  console.log(myVar);
}

// Use strict mode to catch scope errors
"use strict";

function test() {
  // x = 5; // ❌ Error in strict mode: x is not defined
  let x = 5; // ✅ Must declare
}

// Avoid global namespace pollution
(function() {
  // All code here is in function scope
  let privateVar = "not global";
  // ... your code
})();

// Modern module approach
export function myFunction() {
  // Function scope, not global
}
```

## var vs let vs const Summary

```javascript
// var: function scope, hoisted with undefined
var a = 1;
if (true) {
  var a = 2; // Same variable!
}
console.log(a); // 2

// let: block scope, TDZ
let b = 1;
if (true) {
  let b = 2; // Different variable
}
console.log(b); // 1

// const: block scope, TDZ, can''t reassign
const c = 1;
// c = 2; // ❌ Error: can''t reassign
if (true) {
  const c = 2; // Different variable
}
console.log(c); // 1

// const with objects (can mutate)
const obj = { name: "Alice" };
obj.name = "Bob"; // ✅ Can modify properties
// obj = {}; // ❌ Can''t reassign
```
',
  45,
  10,
  ARRAY[
    'Understand global, function, and block scope',
    'Explain lexical scope and the scope chain',
    'Recognize hoisting behavior with var, let, const, and functions',
    'Avoid temporal dead zone errors',
    'Apply scope effectively for encapsulation and closures'
  ],
  '{"external_links": ["https://developer.mozilla.org/en-US/docs/Glossary/Scope", "https://javascript.info/closure"]}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Lesson 11: Arrow Functions and Callbacks
INSERT INTO ai_learning_lessons (
  id,
  learning_path_id,
  title,
  description,
  content_type,
  content,
  duration_minutes,
  order_index,
  learning_objectives,
  resources
) VALUES (
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Arrow Functions and Callbacks',
  'Master arrow function syntax, understand callbacks, and work with higher-order functions.',
  'quiz',
  '# Arrow Functions and Callbacks

## Arrow Function Syntax

Arrow functions provide a shorter syntax for writing functions:

### Basic Syntax

```javascript
// Traditional function
function add(a, b) {
  return a + b;
}

// Arrow function
const add = (a, b) => {
  return a + b;
};

// Even shorter with implicit return
const add = (a, b) => a + b;

console.log(add(5, 3)); // 8

// Single parameter - parentheses optional
const square = x => x * x;
console.log(square(5)); // 25

// No parameters - parentheses required
const greet = () => "Hello!";
console.log(greet()); // "Hello!"

// Multiple statements - need braces
const calculate = (x, y) => {
  const sum = x + y;
  const product = x * y;
  return { sum, product };
};

console.log(calculate(3, 4)); // { sum: 7, product: 12 }
```

### Implicit Return

```javascript
// Implicit return with expression
const double = x => x * 2;
const isEven = n => n % 2 === 0;
const getName = user => user.name;

console.log(double(5));           // 10
console.log(isEven(4));           // true
console.log(getName({ name: "Alice" })); // "Alice"

// Returning objects - need parentheses
const createUser = (name, age) => ({ name: name, age: age });
const createPoint = (x, y) => ({ x, y }); // Shorthand property names

console.log(createUser("Alice", 25)); // { name: "Alice", age: 25 }
console.log(createPoint(10, 20));     // { x: 10, y: 20 }

// Without parentheses - error!
// const wrong = (x, y) => { x, y }; // ❌ This is a block, not object
```

### Arrow Functions vs Regular Functions

```javascript
// Regular function
function regularFunc() {
  console.log(arguments); // ✅ Has arguments object
  console.log(this);      // ✅ Has own this
}

// Arrow function
const arrowFunc = () => {
  // console.log(arguments); // ❌ No arguments object
  // console.log(this);      // Uses lexical this
};

// Can use rest parameters instead
const arrowWithRest = (...args) => {
  console.log(args); // ✅ Works like arguments
};

arrowWithRest(1, 2, 3); // [1, 2, 3]
```

## Callbacks

A callback is a function passed as an argument to another function:

### Basic Callbacks

```javascript
// Function that takes a callback
function greet(name, callback) {
  console.log(`Hello, ${name}!`);
  callback();
}

// Pass function as callback
function sayGoodbye() {
  console.log("Goodbye!");
}

greet("Alice", sayGoodbye);
// Output:
// Hello, Alice!
// Goodbye!

// Inline callback
greet("Bob", function() {
  console.log("Nice to meet you!");
});

// Arrow function callback
greet("Charlie", () => console.log("See you later!"));
```

### Callbacks with Arguments

```javascript
function calculate(a, b, operation) {
  return operation(a, b);
}

// Different operations as callbacks
const add = (x, y) => x + y;
const multiply = (x, y) => x * y;
const power = (x, y) => x ** y;

console.log(calculate(5, 3, add));      // 8
console.log(calculate(5, 3, multiply)); // 15
console.log(calculate(5, 3, power));    // 125

// Inline callbacks
console.log(calculate(10, 2, (a, b) => a - b)); // 8
console.log(calculate(10, 2, (a, b) => a / b)); // 5
```

### Asynchronous Callbacks

```javascript
// Simulate async operation
function fetchData(callback) {
  console.log("Fetching data...");
  setTimeout(() => {
    const data = { id: 1, name: "Alice" };
    callback(data);
  }, 1000);
}

// Use callback to handle result
fetchData((user) => {
  console.log("Data received:", user);
  // Output after 1 second: Data received: { id: 1, name: "Alice" }
});

// Error handling with callbacks
function fetchWithError(success, onSuccess, onError) {
  setTimeout(() => {
    if (success) {
      onSuccess({ data: "Success!" });
    } else {
      onError({ error: "Failed!" });
    }
  }, 1000);
}

fetchWithError(
  true,
  (result) => console.log(result.data),  // Success callback
  (error) => console.log(error.error)    // Error callback
);
```

## Higher-Order Functions

Functions that take or return functions:

### Functions Returning Functions

```javascript
// Function that returns a function
function multiplier(factor) {
  return (number) => number * factor;
}

const double = multiplier(2);
const triple = multiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15

// Practical example: create validators
function createValidator(pattern) {
  return (value) => pattern.test(value);
}

const isEmail = createValidator(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
const isPhone = createValidator(/^\d{3}-\d{3}-\d{4}$/);

console.log(isEmail("test@example.com")); // true
console.log(isPhone("555-123-4567"));     // true

// Function factory
function createGreeter(greeting) {
  return (name) => `${greeting}, ${name}!`;
}

const sayHello = createGreeter("Hello");
const sayHi = createGreeter("Hi");

console.log(sayHello("Alice")); // "Hello, Alice!"
console.log(sayHi("Bob"));      // "Hi, Bob!"
```

## Array Methods with Callbacks

### forEach() - Iterate Over Elements

```javascript
let numbers = [1, 2, 3, 4, 5];

// Traditional loop
for (let i = 0; i < numbers.length; i++) {
  console.log(numbers[i]);
}

// forEach with callback
numbers.forEach((num) => {
  console.log(num);
});

// forEach with index and array
numbers.forEach((num, index, array) => {
  console.log(`Index ${index}: ${num} of ${array.length}`);
});

// Practical: update DOM elements
let users = ["Alice", "Bob", "Charlie"];
users.forEach((user) => {
  console.log(`Welcome, ${user}!`);
});
```

### map() - Transform Array

```javascript
let numbers = [1, 2, 3, 4, 5];

// Square each number
let squared = numbers.map(num => num ** 2);
console.log(squared); // [1, 4, 9, 16, 25]

// Extract property from objects
let users = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 },
  { name: "Charlie", age: 35 }
];

let names = users.map(user => user.name);
console.log(names); // ["Alice", "Bob", "Charlie"]

// Transform with index
let indexed = numbers.map((num, index) => ({
  index: index,
  value: num,
  squared: num ** 2
}));

console.log(indexed);
// [{ index: 0, value: 1, squared: 1 }, ...]
```

### filter() - Select Elements

```javascript
let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Get even numbers
let evens = numbers.filter(num => num % 2 === 0);
console.log(evens); // [2, 4, 6, 8, 10]

// Get numbers greater than 5
let large = numbers.filter(num => num > 5);
console.log(large); // [6, 7, 8, 9, 10]

// Filter objects
let users = [
  { name: "Alice", age: 25, active: true },
  { name: "Bob", age: 17, active: false },
  { name: "Charlie", age: 30, active: true }
];

let activeAdults = users.filter(user => user.active && user.age >= 18);
console.log(activeAdults);
// [{ name: "Alice", age: 25, active: true },
//  { name: "Charlie", age: 30, active: true }]
```

### reduce() - Combine Elements

```javascript
let numbers = [1, 2, 3, 4, 5];

// Sum
let sum = numbers.reduce((total, num) => total + num, 0);
console.log(sum); // 15

// Product
let product = numbers.reduce((result, num) => result * num, 1);
console.log(product); // 120

// Max value
let max = numbers.reduce((max, num) => num > max ? num : max);
console.log(max); // 5

// Build object from array
let users = ["Alice", "Bob", "Charlie"];
let userObj = users.reduce((obj, name, index) => {
  obj[index] = name;
  return obj;
}, {});
console.log(userObj); // { 0: "Alice", 1: "Bob", 2: "Charlie" }
```

### find() and some()/every()

```javascript
let numbers = [1, 2, 3, 4, 5];

// Find first matching element
let firstEven = numbers.find(num => num % 2 === 0);
console.log(firstEven); // 2

// Check if any element matches
let hasEven = numbers.some(num => num % 2 === 0);
console.log(hasEven); // true

// Check if all elements match
let allPositive = numbers.every(num => num > 0);
console.log(allPositive); // true

let allEven = numbers.every(num => num % 2 === 0);
console.log(allEven); // false

// Practical: validation
let users = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 }
];

let hasUnderage = users.some(user => user.age < 18);
console.log(hasUnderage); // false

let allAdults = users.every(user => user.age >= 18);
console.log(allAdults); // true
```

## Chaining Callbacks

```javascript
let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Chain multiple operations
let result = numbers
  .filter(num => num % 2 === 0)     // [2, 4, 6, 8, 10]
  .map(num => num ** 2)              // [4, 16, 36, 64, 100]
  .reduce((sum, num) => sum + num, 0); // 220

console.log(result); // 220

// Complex data transformation
let users = [
  { name: "Alice", age: 25, score: 85 },
  { name: "Bob", age: 17, score: 92 },
  { name: "Charlie", age: 30, score: 78 },
  { name: "Diana", age: 22, score: 95 }
];

let topAdultScorers = users
  .filter(user => user.age >= 18)
  .filter(user => user.score >= 85)
  .map(user => user.name)
  .sort();

console.log(topAdultScorers); // ["Alice", "Diana"]
```

## Best Practices

✅ **Use arrow functions for callbacks** - Cleaner syntax
✅ **Keep callbacks simple** - Extract complex logic to named functions
✅ **Use descriptive names** - Even for callback parameters
✅ **Chain when appropriate** - More readable than intermediate variables
✅ **Use implicit return** - When callback is single expression
✅ **Avoid deeply nested callbacks** - Leads to "callback hell"

## Common Pitfalls

❌ **Forgetting return** - map/filter callbacks must return value
❌ **Wrong this binding** - Arrow functions have lexical this
❌ **Mutating in callbacks** - Avoid side effects when possible
❌ **Callback hell** - Too many nested callbacks (use Promises)
❌ **Missing parentheses** - Returning object needs ({\})
❌ **Confusing () and {}** - Parentheses for implicit return, braces for block

## Practical Examples

```javascript
// Event handlers (common use of callbacks)
const button = { addEventListener: (event, callback) => callback() };
button.addEventListener("click", () => {
  console.log("Button clicked!");
});

// Data processing pipeline
const processData = (data) =>
  data
    .map(item => item.trim())
    .filter(item => item.length > 0)
    .map(item => item.toLowerCase())
    .sort();

let input = ["  Hello  ", "World", "", "  JavaScript  "];
console.log(processData(input)); // ["hello", "javascript", "world"]

// Custom array method
Array.prototype.customMap = function(callback) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    result.push(callback(this[i], i, this));
  }
  return result;
};

let nums = [1, 2, 3];
let doubled = nums.customMap(n => n * 2);
console.log(doubled); // [2, 4, 6]
```
',
  50,
  11,
  ARRAY[
    'Write arrow functions with various syntax forms',
    'Use callbacks to pass functions as arguments',
    'Apply higher-order functions for flexible code',
    'Work with array methods using callbacks (map, filter, reduce)',
    'Chain array methods for data transformation'
  ],
  '{"external_links": ["https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions", "https://javascript.info/arrow-functions-basics"]}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Lesson 12: DOM Manipulation Basics
INSERT INTO ai_learning_lessons (
  id,
  learning_path_id,
  title,
  description,
  content_type,
  content,
  duration_minutes,
  order_index,
  learning_objectives,
  resources
) VALUES (
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'DOM Manipulation Basics',
  'Learn to select, modify, and create HTML elements using JavaScript DOM manipulation.',
  'quiz',
  '# DOM Manipulation Basics

## What is the DOM?

The **Document Object Model (DOM)** is a tree-like representation of your HTML that JavaScript can interact with:

```javascript
// The DOM is represented as a tree:
// document
//   └── html
//       ├── head
//       │   └── title
//       └── body
//           ├── h1
//           ├── p
//           └── div
//               └── button

// JavaScript can access any element in this tree
console.log(document); // The entire document
console.log(document.body); // The <body> element
console.log(document.title); // The page title
```

## Selecting Elements

### querySelector() - Select First Match

```javascript
// Select by tag name
let heading = document.querySelector("h1");
console.log(heading); // First <h1> element

// Select by class
let button = document.querySelector(".btn");
console.log(button); // First element with class "btn"

// Select by ID
let header = document.querySelector("#header");
console.log(header); // Element with id="header"

// Complex selectors (like CSS)
let firstLink = document.querySelector("nav a");
let submitBtn = document.querySelector("form button[type=''submit'']");

// Returns null if not found
let notFound = document.querySelector(".nonexistent");
console.log(notFound); // null
```

### querySelectorAll() - Select All Matches

```javascript
// Select all matching elements
let paragraphs = document.querySelectorAll("p");
console.log(paragraphs); // NodeList of all <p> elements

// Returns NodeList (array-like)
console.log(paragraphs.length); // Number of paragraphs

// Iterate with forEach
paragraphs.forEach((p, index) => {
  console.log(`Paragraph ${index}: ${p.textContent}`);
});

// Convert to array for more methods
let pArray = Array.from(paragraphs);
let filteredPs = pArray.filter(p => p.textContent.length > 50);

// Select with class
let buttons = document.querySelectorAll(".btn");
buttons.forEach(btn => {
  console.log(btn.textContent);
});
```

### getElementById() - Legacy Method

```javascript
// Select by ID (legacy but still useful)
let element = document.getElementById("myElement");
// No # symbol needed

// More efficient than querySelector for IDs
let header = document.getElementById("header");

// Returns null if not found
let notFound = document.getElementById("nonexistent");
console.log(notFound); // null
```

## Reading and Modifying Content

### textContent - Plain Text

```javascript
let heading = document.querySelector("h1");

// Read text content
console.log(heading.textContent); // "Welcome"

// Set text content
heading.textContent = "Hello, World!";

// Strips HTML tags
let div = document.querySelector(".content");
div.textContent = "<strong>Bold</strong>"; // Displays as plain text

// Practical: update multiple elements
let prices = document.querySelectorAll(".price");
prices.forEach(price => {
  let value = parseFloat(price.textContent);
  price.textContent = `$${value.toFixed(2)}`;
});
```

### innerHTML - HTML Content

```javascript
let container = document.querySelector(".container");

// Read HTML content
console.log(container.innerHTML); // "<p>Content</p>"

// Set HTML content (renders as HTML)
container.innerHTML = "<strong>Bold text</strong>";

// Add to existing content
container.innerHTML += "<p>New paragraph</p>";

// ⚠️ Security warning: be careful with user input
let userInput = "<script>alert(''hack'')</script>";
// container.innerHTML = userInput; // ❌ Dangerous!

// Safer: use textContent for user input
container.textContent = userInput; // ✅ Displays as text

// Practical: create list from array
let fruits = ["Apple", "Banana", "Orange"];
let list = document.querySelector("#fruit-list");
list.innerHTML = fruits.map(fruit => `<li>${fruit}</li>`).join("");
```

## Working with Attributes

### getAttribute() and setAttribute()

```javascript
let link = document.querySelector("a");

// Get attribute value
let href = link.getAttribute("href");
console.log(href); // "https://example.com"

let title = link.getAttribute("title");
console.log(title);

// Set attribute value
link.setAttribute("href", "https://newurl.com");
link.setAttribute("target", "_blank");
link.setAttribute("rel", "noopener");

// Check if attribute exists
if (link.hasAttribute("href")) {
  console.log("Link has href");
}

// Remove attribute
link.removeAttribute("title");

// Practical: update all images
let images = document.querySelectorAll("img");
images.forEach(img => {
  img.setAttribute("loading", "lazy");
  if (!img.hasAttribute("alt")) {
    img.setAttribute("alt", "Image");
  }
});
```

### Direct Property Access

```javascript
let input = document.querySelector("input");

// Access common attributes directly
console.log(input.value);     // Input value
console.log(input.type);      // "text"
console.log(input.placeholder); // Placeholder text

// Modify properties
input.value = "New value";
input.placeholder = "Enter text";
input.disabled = true;

// Checkbox/radio
let checkbox = document.querySelector("input[type=''checkbox'']");
console.log(checkbox.checked); // true/false
checkbox.checked = true;

// Image properties
let img = document.querySelector("img");
console.log(img.src);   // Full URL
console.log(img.width); // Image width
img.src = "new-image.jpg";
```

## Working with Classes

### classList API

```javascript
let element = document.querySelector(".box");

// Add class
element.classList.add("active");
element.classList.add("highlight", "featured"); // Multiple

// Remove class
element.classList.remove("inactive");

// Toggle class
element.classList.toggle("visible"); // Add if not present, remove if present

// Check if class exists
if (element.classList.contains("active")) {
  console.log("Element is active");
}

// Replace class
element.classList.replace("old-class", "new-class");

// Practical: toggle menu
let menuBtn = document.querySelector(".menu-btn");
let nav = document.querySelector("nav");

menuBtn.addEventListener("click", () => {
  nav.classList.toggle("open");
});
```

### className - Legacy Approach

```javascript
let element = document.querySelector(".box");

// Get all classes as string
console.log(element.className); // "box active"

// Set classes (replaces all)
element.className = "box highlight";

// Add class (concatenate)
element.className += " new-class";

// ✅ Prefer classList for better control
element.classList.add("new-class"); // Better way
```

## Creating and Adding Elements

### createElement() and appendChild()

```javascript
// Create new element
let div = document.createElement("div");
div.textContent = "New div";
div.className = "box";

// Append to body
document.body.appendChild(div);

// Create and append paragraph
let p = document.createElement("p");
p.textContent = "This is a new paragraph";
document.querySelector(".container").appendChild(p);

// Create complex element
let article = document.createElement("article");
article.innerHTML = `
  <h2>Article Title</h2>
  <p>Article content goes here.</p>
  <button>Read More</button>
`;
document.querySelector("main").appendChild(article);

// Practical: create list from array
let tasks = ["Buy groceries", "Walk dog", "Study JavaScript"];
let ul = document.createElement("ul");

tasks.forEach(task => {
  let li = document.createElement("li");
  li.textContent = task;
  ul.appendChild(li);
});

document.body.appendChild(ul);
```

### insertBefore() and insertAdjacentHTML()

```javascript
let container = document.querySelector(".container");

// Insert before existing element
let newP = document.createElement("p");
newP.textContent = "Inserted paragraph";

let referenceNode = container.querySelector("p");
container.insertBefore(newP, referenceNode);

// insertAdjacentHTML - flexible insertion
let element = document.querySelector("#target");

// beforebegin: before the element
element.insertAdjacentHTML("beforebegin", "<p>Before</p>");

// afterbegin: first child
element.insertAdjacentHTML("afterbegin", "<p>First child</p>");

// beforeend: last child
element.insertAdjacentHTML("beforeend", "<p>Last child</p>");

// afterend: after the element
element.insertAdjacentHTML("afterend", "<p>After</p>");
```

## Removing Elements

```javascript
let element = document.querySelector(".to-remove");

// Remove element
element.remove();

// Remove child (older method)
let parent = document.querySelector(".parent");
let child = parent.querySelector(".child");
parent.removeChild(child);

// Remove all children
let container = document.querySelector(".container");
container.innerHTML = ""; // Quick way

// Or with loop
while (container.firstChild) {
  container.removeChild(container.firstChild);
}

// Practical: remove all items with class
let items = document.querySelectorAll(".item");
items.forEach(item => item.remove());
```

## Modifying Styles

```javascript
let box = document.querySelector(".box");

// Set individual styles
box.style.color = "blue";
box.style.backgroundColor = "lightgray";
box.style.fontSize = "20px";
box.style.padding = "10px";

// Get computed style
let computedStyle = window.getComputedStyle(box);
console.log(computedStyle.color); // "rgb(0, 0, 255)"

// Set multiple styles
Object.assign(box.style, {
  width: "200px",
  height: "200px",
  border: "2px solid black",
  borderRadius: "10px"
});

// Remove style
box.style.color = "";

// ✅ Better: use classes for styling
box.classList.add("styled-box"); // Defined in CSS
```

## Practical Examples

### Dynamic List Creation

```javascript
function createTodoList(tasks) {
  let ul = document.createElement("ul");
  ul.className = "todo-list";

  tasks.forEach(task => {
    let li = document.createElement("li");
    li.innerHTML = `
      <input type="checkbox">
      <span>${task}</span>
      <button class="delete">Delete</button>
    `;
    ul.appendChild(li);
  });

  return ul;
}

let tasks = ["Learn JavaScript", "Build project", "Deploy app"];
let list = createTodoList(tasks);
document.querySelector("#app").appendChild(list);
```

### Show/Hide Content

```javascript
function toggleVisibility(elementId) {
  let element = document.getElementById(elementId);
  element.classList.toggle("hidden"); // CSS: .hidden { display: none; }
}

// Or with style
function toggleElement(elementId) {
  let element = document.getElementById(elementId);
  let isHidden = element.style.display === "none";
  element.style.display = isHidden ? "block" : "none";
}
```

## Best Practices

✅ **Cache selectors** - Don''t query DOM repeatedly
✅ **Use textContent over innerHTML** - When possible, safer
✅ **Use classList API** - More reliable than className
✅ **Batch DOM updates** - Minimize reflows/repaints
✅ **Check if element exists** - Before manipulating
✅ **Use semantic HTML** - Easier to select and style

## Common Pitfalls

❌ **Selecting before DOM loads** - Wait for DOMContentLoaded
❌ **innerHTML security risks** - Don''t trust user input
❌ **Querying in loops** - Cache elements outside loops
❌ **Forgetting null checks** - querySelector returns null if not found
❌ **Modifying style directly** - Use CSS classes instead
❌ **Not removing event listeners** - Can cause memory leaks

## DOM Ready Pattern

```javascript
// Wait for DOM to load before manipulating
document.addEventListener("DOMContentLoaded", () => {
  // Safe to manipulate DOM here
  let heading = document.querySelector("h1");
  heading.textContent = "DOM is ready!";

  // Initialize your app
  initApp();
});

function initApp() {
  // Your code here
  console.log("App initialized");
}

// Or check if already loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
```
',
  50,
  12,
  ARRAY[
    'Select elements using querySelector and querySelectorAll',
    'Modify element content with textContent and innerHTML',
    'Manipulate attributes and classes dynamically',
    'Create and append new elements to the DOM',
    'Apply best practices for safe and efficient DOM manipulation'
  ],
  '{"external_links": ["https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction", "https://javascript.info/dom-nodes"]}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Lesson 13: Events and Event Handling
INSERT INTO ai_learning_lessons (
  id,
  learning_path_id,
  title,
  description,
  content_type,
  content,
  duration_minutes,
  order_index,
  learning_objectives,
  resources
) VALUES (
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Events and Event Handling',
  'Master event handling in JavaScript - from basic click events to advanced patterns like event delegation and custom events.',
  'quiz',
  '# Events and Event Handling

## What are Events?

Events are actions or occurrences that happen in the browser - user clicks, key presses, page loads, form submissions, etc. JavaScript allows us to **listen** for these events and **respond** with custom code.

### Event-Driven Programming

JavaScript in the browser follows an event-driven model:

1. **User action occurs** (click, type, scroll)
2. **Browser fires an event**
3. **JavaScript listener catches the event**
4. **Handler function executes**

## addEventListener Method

The modern way to attach event handlers:

```javascript
// Syntax: element.addEventListener(event, handler)
let button = document.querySelector("#myButton");

button.addEventListener("click", function() {
  console.log("Button clicked!");
});

// With arrow function (modern style)
button.addEventListener("click", () => {
  console.log("Button clicked!");
});

// With named function (reusable, easier to remove)
function handleClick() {
  console.log("Button clicked!");
}
button.addEventListener("click", handleClick);
```

**Why addEventListener over onclick?**
- Can attach **multiple handlers** to same event
- Easier to **remove** handlers
- Better **separation** of HTML and JS
- Works with **event options** (capture, once, passive)

## Common Event Types

### Mouse Events

```javascript
let box = document.querySelector("#box");

box.addEventListener("click", () => {
  console.log("Clicked!");
});

box.addEventListener("dblclick", () => {
  console.log("Double clicked!");
});

box.addEventListener("mouseover", () => {
  box.style.backgroundColor = "lightblue";
});

box.addEventListener("mouseout", () => {
  box.style.backgroundColor = "";
});

box.addEventListener("mousedown", () => {
  console.log("Mouse button pressed");
});

box.addEventListener("mouseup", () => {
  console.log("Mouse button released");
});

box.addEventListener("mousemove", (e) => {
  console.log(`Mouse at: ${e.clientX}, ${e.clientY}`);
});
```

### Keyboard Events

```javascript
let input = document.querySelector("#searchInput");

// Fires when key is pressed down
input.addEventListener("keydown", (e) => {
  console.log(`Key pressed: ${e.key}`);

  // Check for specific keys
  if (e.key === "Enter") {
    console.log("Enter pressed - submit search!");
  }

  if (e.key === "Escape") {
    input.value = ""; // Clear input on Escape
  }
});

// Fires when key is released
input.addEventListener("keyup", (e) => {
  console.log(`Key released: ${e.key}`);
});

// Fires when printable character is entered
input.addEventListener("keypress", (e) => {
  console.log(`Character: ${e.key}`);
});

// Practical: Live search with debounce
let searchTimeout;
input.addEventListener("keyup", (e) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    performSearch(e.target.value);
  }, 300); // Wait 300ms after typing stops
});
```

### Form Events

```javascript
let form = document.querySelector("#myForm");
let emailInput = document.querySelector("#email");

// Form submission
form.addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent page reload!

  let formData = new FormData(form);
  let email = formData.get("email");

  console.log("Submitting:", email);
  // Send to server...
});

// Input change (after blur)
emailInput.addEventListener("change", (e) => {
  console.log("Email changed to:", e.target.value);
});

// Input value change (real-time)
emailInput.addEventListener("input", (e) => {
  console.log("Typing:", e.target.value);
  validateEmail(e.target.value);
});

// Focus events
emailInput.addEventListener("focus", () => {
  emailInput.style.borderColor = "blue";
});

emailInput.addEventListener("blur", () => {
  emailInput.style.borderColor = "";
});
```

### Page Events

```javascript
// DOM fully loaded and parsed
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM is ready!");
  initializeApp();
});

// Page fully loaded (including images, styles)
window.addEventListener("load", () => {
  console.log("Page fully loaded!");
});

// Before page unload
window.addEventListener("beforeunload", (e) => {
  // Show confirmation dialog
  e.preventDefault();
  e.returnValue = ""; // Chrome requires this
});

// Page scrolled
window.addEventListener("scroll", () => {
  let scrollY = window.scrollY;
  console.log(`Scrolled to: ${scrollY}px`);

  // Show/hide navbar on scroll
  if (scrollY > 100) {
    navbar.classList.add("fixed");
  } else {
    navbar.classList.remove("fixed");
  }
});

// Window resized
window.addEventListener("resize", () => {
  console.log(`Window size: ${window.innerWidth}x${window.innerHeight}`);
});
```

## The Event Object

Every event handler receives an **event object** with details about the event:

```javascript
button.addEventListener("click", (event) => {
  console.log(event); // Full event object

  // Common properties
  console.log(event.type);        // "click"
  console.log(event.target);      // Element that triggered event
  console.log(event.currentTarget); // Element listener is attached to
  console.log(event.timeStamp);   // When event occurred

  // Mouse events
  console.log(event.clientX);     // X coordinate relative to viewport
  console.log(event.clientY);     // Y coordinate relative to viewport
  console.log(event.pageX);       // X coordinate relative to document
  console.log(event.pageY);       // Y coordinate relative to document

  // Keyboard events
  console.log(event.key);         // Key pressed ("a", "Enter", "Escape")
  console.log(event.code);        // Physical key ("KeyA", "Enter", "Escape")
  console.log(event.shiftKey);    // Was Shift pressed?
  console.log(event.ctrlKey);     // Was Ctrl pressed?
  console.log(event.altKey);      // Was Alt pressed?
  console.log(event.metaKey);     // Was Cmd/Win pressed?
});
```

## preventDefault()

Stops the default browser behavior:

```javascript
// Prevent link navigation
let link = document.querySelector("a");
link.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("Link clicked but not navigating!");
  // Custom handling...
});

// Prevent form submission
form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!isValid()) {
    showError("Please fix errors");
    return;
  }

  // Submit via AJAX instead
  submitFormAjax();
});

// Prevent context menu
document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  showCustomMenu(e.clientX, e.clientY);
});

// Prevent text selection
document.addEventListener("selectstart", (e) => {
  e.preventDefault();
});
```

## stopPropagation()

Stops event from bubbling up to parent elements:

```javascript
let outer = document.querySelector("#outer");
let inner = document.querySelector("#inner");

outer.addEventListener("click", () => {
  console.log("Outer clicked");
});

inner.addEventListener("click", (e) => {
  console.log("Inner clicked");
  e.stopPropagation(); // Outer handler won''t run!
});

// Click inner: Only "Inner clicked" logs
// Click outer: Only "Outer clicked" logs
```

**Event Propagation Phases:**

1. **Capture phase** - Event travels down from window to target
2. **Target phase** - Event reaches the target element
3. **Bubble phase** - Event bubbles up from target to window

```javascript
// Listen in capture phase (rare)
element.addEventListener("click", handler, true);

// Listen in bubble phase (default)
element.addEventListener("click", handler, false);
element.addEventListener("click", handler); // Same as false
```

## Event Delegation

Instead of attaching listeners to many elements, attach **one listener to a parent**:

```javascript
// ❌ Bad: Listener on every button
let buttons = document.querySelectorAll(".delete-btn");
buttons.forEach(button => {
  button.addEventListener("click", (e) => {
    deleteItem(e.target.dataset.id);
  });
});

// ✅ Good: One listener on parent using delegation
let list = document.querySelector("#todoList");
list.addEventListener("click", (e) => {
  // Check if clicked element is delete button
  if (e.target.matches(".delete-btn")) {
    deleteItem(e.target.dataset.id);
  }
});

// Works for dynamically added elements too!
function addTodoItem(text) {
  let li = document.createElement("li");
  li.innerHTML = `
    <span>${text}</span>
    <button class="delete-btn" data-id="${Date.now()}">Delete</button>
  `;
  list.appendChild(li); // New button automatically works!
}
```

**Benefits of Event Delegation:**
- **Less memory** - One listener instead of hundreds
- **Works with dynamic content** - New elements automatically handled
- **Simpler code** - Single place to manage events

## Practical Examples

### Interactive Todo List

```javascript
let todoList = document.querySelector("#todoList");
let todoInput = document.querySelector("#todoInput");
let addBtn = document.querySelector("#addBtn");

// Add new todo
addBtn.addEventListener("click", () => {
  let text = todoInput.value.trim();
  if (!text) return;

  let li = document.createElement("li");
  li.innerHTML = `
    <input type="checkbox" class="todo-checkbox">
    <span class="todo-text">${text}</span>
    <button class="delete-btn">Delete</button>
  `;

  todoList.appendChild(li);
  todoInput.value = "";
});

// Handle all interactions with delegation
todoList.addEventListener("click", (e) => {
  let li = e.target.closest("li");

  // Toggle completed
  if (e.target.matches(".todo-checkbox")) {
    li.querySelector(".todo-text").classList.toggle("completed");
  }

  // Delete todo
  if (e.target.matches(".delete-btn")) {
    li.remove();
  }
});

// Submit on Enter key
todoInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addBtn.click();
  }
});
```

### Modal Dialog

```javascript
let modal = document.querySelector("#modal");
let openBtn = document.querySelector("#openModal");
let closeBtn = document.querySelector("#closeModal");

// Open modal
openBtn.addEventListener("click", () => {
  modal.classList.add("active");
  document.body.style.overflow = "hidden"; // Prevent scroll
});

// Close modal
closeBtn.addEventListener("click", () => {
  modal.classList.remove("active");
  document.body.style.overflow = "";
});

// Close on outside click
modal.addEventListener("click", (e) => {
  if (e.target === modal) { // Clicked backdrop
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
});

// Close on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("active")) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
});
```

## Removing Event Listeners

Important for preventing memory leaks:

```javascript
// Named function required to remove
function handleClick() {
  console.log("Clicked!");
}

button.addEventListener("click", handleClick);

// Later...
button.removeEventListener("click", handleClick);

// ❌ Can''t remove anonymous functions
button.addEventListener("click", () => {
  console.log("Can''t remove this!");
});

// ✅ Use AbortController for easy cleanup
let controller = new AbortController();

button.addEventListener("click", handleClick, {
  signal: controller.signal
});

input.addEventListener("keyup", handleKeyup, {
  signal: controller.signal
});

// Remove all listeners at once
controller.abort();
```

## Best Practices

✅ **Use event delegation** - For lists and dynamic content
✅ **Remove unused listeners** - Prevent memory leaks
✅ **Use named functions** - Easier to debug and remove
✅ **Debounce expensive operations** - Search, resize, scroll
✅ **Call preventDefault() early** - Before conditional logic
✅ **Use passive listeners** - For scroll/touch events on mobile

## Common Pitfalls

❌ **Forgetting preventDefault()** - Form submits, page reloads
❌ **Using inline handlers** - Mixing HTML and JS, hard to maintain
❌ **Not removing listeners** - Memory leaks, especially with SPAs
❌ **Overusing stopPropagation()** - Can break other features
❌ **Anonymous functions everywhere** - Can''t remove or reuse
❌ **Heavy handlers on scroll/resize** - Causes jank, use debounce

## Event Options

Advanced addEventListener options:

```javascript
element.addEventListener("click", handler, {
  once: true,        // Run only once, then auto-remove
  capture: true,     // Listen in capture phase
  passive: true,     // Won''t call preventDefault (performance)
  signal: abortSignal // AbortController signal for cleanup
});

// Example: One-time welcome message
showWelcome.addEventListener("click", () => {
  alert("Welcome!");
}, { once: true });

// Example: Passive scroll listener (better performance)
window.addEventListener("scroll", handleScroll, {
  passive: true // Browser can optimize scrolling
});
```

## Summary

Events are the foundation of interactive web applications. Master addEventListener, understand the event object, use event delegation for efficiency, and always clean up listeners to prevent memory leaks. With these skills, you can build responsive, interactive user interfaces.
',
  50,
  13,
  ARRAY[
    'Attach event listeners using addEventListener method',
    'Handle common events like click, submit, keypress, and mouseover',
    'Use the event object to access event details and control propagation',
    'Implement event delegation for efficient and dynamic event handling',
    'Apply best practices for memory management and performance'
  ],
  '{"external_links": ["https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener", "https://javascript.info/events"]}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Lesson 14: Array Advanced Methods
INSERT INTO ai_learning_lessons (
  id,
  learning_path_id,
  title,
  description,
  content_type,
  content,
  duration_minutes,
  order_index,
  learning_objectives,
  resources
) VALUES (
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Array Advanced Methods',
  'Master powerful array methods like find, some, every, and sort. Learn to chain methods and write clean, functional code.',
  'quiz',
  '# Array Advanced Methods

## Beyond map, filter, reduce

You''ve learned map, filter, and reduce. Now let''s explore more powerful array methods that solve specific problems elegantly.

## find() and findIndex()

Find the **first element** or its **index** that matches a condition:

```javascript
let users = [
  { id: 1, name: "Alice", age: 25 },
  { id: 2, name: "Bob", age: 30 },
  { id: 3, name: "Charlie", age: 35 }
];

// find() - Returns first matching element (or undefined)
let user = users.find(u => u.id === 2);
console.log(user); // { id: 2, name: "Bob", age: 30 }

let adult = users.find(u => u.age >= 21);
console.log(adult); // { id: 1, name: "Alice", age: 25 } (first match)

let notFound = users.find(u => u.age > 50);
console.log(notFound); // undefined

// findIndex() - Returns index of first match (or -1)
let index = users.findIndex(u => u.name === "Charlie");
console.log(index); // 2

let notFoundIndex = users.findIndex(u => u.name === "David");
console.log(notFoundIndex); // -1
```

**When to use:**
- `find()` - Get the actual object/element
- `findIndex()` - Need the position for later manipulation
- `indexOf()` - When searching for primitive value (not object)

## some() and every()

Test if **some** or **every** element matches a condition:

```javascript
let numbers = [1, 2, 3, 4, 5];

// some() - True if AT LEAST ONE element passes test
let hasEven = numbers.some(n => n % 2 === 0);
console.log(hasEven); // true

let hasNegative = numbers.some(n => n < 0);
console.log(hasNegative); // false

// every() - True if ALL elements pass test
let allPositive = numbers.every(n => n > 0);
console.log(allPositive); // true

let allEven = numbers.every(n => n % 2 === 0);
console.log(allEven); // false

// Practical: Form validation
let formFields = [
  { name: "email", value: "test@example.com", valid: true },
  { name: "password", value: "12345", valid: false },
  { name: "username", value: "john", valid: true }
];

let hasInvalidField = formFields.some(field => !field.valid);
let allFieldsValid = formFields.every(field => field.valid);

console.log(hasInvalidField); // true
console.log(allFieldsValid);  // false

if (!allFieldsValid) {
  console.log("Please fix errors before submitting");
}
```

**Quick Reference:**
- `some()` - "Is there at least one?"
- `every()` - "Are all of them?"

## sort()

Sort array elements (mutates the original array!):

```javascript
// ⚠️ sort() MUTATES the original array!

// Strings - alphabetical by default
let fruits = ["banana", "apple", "cherry"];
fruits.sort();
console.log(fruits); // ["apple", "banana", "cherry"]

// Numbers - REQUIRES COMPARATOR!
let numbers = [10, 5, 40, 25, 1000, 1];

// ❌ WRONG: Sorts as strings!
numbers.sort();
console.log(numbers); // [1, 10, 1000, 25, 40, 5] (wrong!)

// ✅ CORRECT: Use comparator
numbers.sort((a, b) => a - b); // Ascending
console.log(numbers); // [1, 5, 10, 25, 40, 1000]

numbers.sort((a, b) => b - a); // Descending
console.log(numbers); // [1000, 40, 25, 10, 5, 1]
```

**How the comparator works:**
- `a - b < 0` → a comes before b (ascending)
- `a - b > 0` → b comes before a
- `a - b === 0` → order unchanged

### Sorting Objects

```javascript
let users = [
  { name: "Charlie", age: 35 },
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 }
];

// Sort by age (ascending)
users.sort((a, b) => a.age - b.age);
console.log(users);
// [{ name: "Alice", age: 25 }, { name: "Bob", age: 30 }, { name: "Charlie", age: 35 }]

// Sort by name (alphabetical)
users.sort((a, b) => a.name.localeCompare(b.name));
console.log(users);
// [{ name: "Alice", ... }, { name: "Bob", ... }, { name: "Charlie", ... }]

// Sort by multiple criteria
users.sort((a, b) => {
  // First by age
  if (a.age !== b.age) {
    return a.age - b.age;
  }
  // Then by name if ages are equal
  return a.name.localeCompare(b.name);
});
```

### Non-Mutating Sort

```javascript
// Create sorted copy without mutating original
let original = [3, 1, 4, 1, 5];

// Option 1: Spread then sort
let sorted = [...original].sort((a, b) => a - b);

// Option 2: slice() then sort
let sorted2 = original.slice().sort((a, b) => a - b);

console.log(original); // [3, 1, 4, 1, 5] (unchanged)
console.log(sorted);   // [1, 1, 3, 4, 5]
```

## reverse()

Reverse array in place (mutates!):

```javascript
let arr = [1, 2, 3, 4, 5];

arr.reverse();
console.log(arr); // [5, 4, 3, 2, 1]

// Non-mutating version
let original = [1, 2, 3, 4, 5];
let reversed = [...original].reverse();
console.log(original); // [1, 2, 3, 4, 5] (unchanged)
console.log(reversed); // [5, 4, 3, 2, 1]
```

## includes()

Check if array contains a value:

```javascript
let fruits = ["apple", "banana", "cherry"];

console.log(fruits.includes("banana")); // true
console.log(fruits.includes("grape"));  // false

// With start position
console.log(fruits.includes("apple", 1)); // false (starts searching from index 1)

// Case sensitive!
console.log(fruits.includes("Apple")); // false

// Works with numbers
let numbers = [1, 2, 3, 4, 5];
console.log(numbers.includes(3)); // true

// Practical: Tag/permission checking
let userPermissions = ["read", "write", "delete"];

function canDelete() {
  return userPermissions.includes("delete");
}

console.log(canDelete()); // true
```

**includes() vs indexOf():**

```javascript
let arr = ["a", "b", "c"];

// includes() - Returns boolean
arr.includes("b"); // true
arr.includes("d"); // false

// indexOf() - Returns index or -1
arr.indexOf("b");  // 1
arr.indexOf("d");  // -1

// includes() handles NaN correctly
let withNaN = [1, NaN, 3];
console.log(withNaN.includes(NaN)); // true
console.log(withNaN.indexOf(NaN));  // -1 (doesn''t work with NaN)
```

## slice() vs splice()

Two methods with similar names but very different behaviors:

### slice() - Extract Portion (Non-Mutating)

```javascript
let arr = ["a", "b", "c", "d", "e"];

// slice(start, end) - end not included
let portion = arr.slice(1, 4);
console.log(portion); // ["b", "c", "d"]
console.log(arr);     // ["a", "b", "c", "d", "e"] (unchanged)

// Negative indices (count from end)
let last2 = arr.slice(-2);
console.log(last2); // ["d", "e"]

// Copy entire array
let copy = arr.slice();
console.log(copy); // ["a", "b", "c", "d", "e"]
```

### splice() - Add/Remove Elements (Mutates!)

```javascript
let arr = ["a", "b", "c", "d", "e"];

// splice(start, deleteCount, ...itemsToAdd)

// Remove 2 elements starting at index 1
let removed = arr.splice(1, 2);
console.log(removed); // ["b", "c"]
console.log(arr);     // ["a", "d", "e"] (mutated!)

// Insert without removing
arr = ["a", "b", "c"];
arr.splice(1, 0, "x", "y"); // Insert at index 1, remove 0
console.log(arr); // ["a", "x", "y", "b", "c"]

// Replace elements
arr = ["a", "b", "c"];
arr.splice(1, 1, "x"); // Remove 1, add "x"
console.log(arr); // ["a", "x", "c"]

// Remove from index to end
arr = ["a", "b", "c", "d"];
arr.splice(2); // Remove from index 2 onwards
console.log(arr); // ["a", "b"]
```

**Memory trick:**
- **slice** → Non-mutating (like "slice of pizza" - doesn''t change the whole pizza)
- **splice** → Mutates (like "splice a rope" - permanently changes it)

## Method Chaining

Combine multiple array methods for powerful transformations:

```javascript
let users = [
  { name: "Alice", age: 25, active: true },
  { name: "Bob", age: 30, active: false },
  { name: "Charlie", age: 35, active: true },
  { name: "David", age: 28, active: true }
];

// Get names of active users over 25, sorted alphabetically
let result = users
  .filter(u => u.active)           // Active users only
  .filter(u => u.age > 25)         // Over 25
  .map(u => u.name)                // Extract names
  .sort();                         // Sort alphabetically

console.log(result); // ["Charlie", "David"]

// Get sum of ages of active users
let totalAge = users
  .filter(u => u.active)
  .map(u => u.age)
  .reduce((sum, age) => sum + age, 0);

console.log(totalAge); // 88

// Check if any inactive user exists
let hasInactive = users.some(u => !u.active);
console.log(hasInactive); // true

// Get oldest active user
let oldestActive = users
  .filter(u => u.active)
  .sort((a, b) => b.age - a.age)[0]; // Sort descending, take first

console.log(oldestActive); // { name: "Charlie", age: 35, active: true }
```

## Practical Examples

### Search and Filter

```javascript
let products = [
  { id: 1, name: "Laptop", price: 999, category: "electronics" },
  { id: 2, name: "Mouse", price: 25, category: "electronics" },
  { id: 3, name: "Desk", price: 300, category: "furniture" },
  { id: 4, name: "Chair", price: 150, category: "furniture" }
];

// Search by ID
function getProductById(id) {
  return products.find(p => p.id === id);
}

// Filter by category and price range
function searchProducts(category, maxPrice) {
  return products
    .filter(p => p.category === category)
    .filter(p => p.price <= maxPrice)
    .sort((a, b) => a.price - b.price);
}

let affordable = searchProducts("electronics", 500);
console.log(affordable);
// [{ id: 2, name: "Mouse", price: 25, category: "electronics" }]
```

### Sorting and Ranking

```javascript
let scores = [
  { player: "Alice", score: 1500 },
  { player: "Bob", score: 2000 },
  { player: "Charlie", score: 1800 }
];

// Add rank to each player
let ranked = scores
  .sort((a, b) => b.score - a.score) // Descending
  .map((item, index) => ({
    ...item,
    rank: index + 1
  }));

console.log(ranked);
// [
//   { player: "Bob", score: 2000, rank: 1 },
//   { player: "Charlie", score: 1800, rank: 2 },
//   { player: "Alice", score: 1500, rank: 3 }
// ]
```

### Data Validation

```javascript
function validateForm(fields) {
  // Check if all required fields are filled
  let allFilled = fields.every(f => f.value.trim() !== "");

  // Check if any field has validation errors
  let hasErrors = fields.some(f => !f.valid);

  // Get list of invalid field names
  let invalidFields = fields
    .filter(f => !f.valid)
    .map(f => f.name);

  return {
    isValid: allFilled && !hasErrors,
    errors: invalidFields
  };
}

let formData = [
  { name: "email", value: "test@example.com", valid: true },
  { name: "password", value: "12345", valid: false },
  { name: "username", value: "", valid: false }
];

let validation = validateForm(formData);
console.log(validation);
// { isValid: false, errors: ["password", "username"] }
```

## Best Practices

✅ **Understand mutating vs non-mutating** - Know which methods change the array
✅ **Use find() over filter()[0]** - More efficient and clearer intent
✅ **Chain methods for clarity** - Readable pipeline of transformations
✅ **Provide comparators for sort()** - Always use comparator for numbers
✅ **Use includes() for existence checks** - More readable than indexOf() !== -1
✅ **Copy before mutating** - Use spread or slice() to avoid side effects

## Common Pitfalls

❌ **Forgetting sort() comparator** - Numbers sort as strings without it
❌ **Confusing slice() and splice()** - Very different behaviors!
❌ **Mutating when you meant to copy** - sort(), reverse(), splice() mutate
❌ **Not handling undefined from find()** - Check result before using
❌ **Assuming includes() is case-insensitive** - It''s not!
❌ **Overusing chaining** - Too many chains can hurt readability

## Performance Tips

```javascript
// ✅ Good: Single pass with filter
let results = items.filter(item => {
  return item.active && item.price < 100;
});

// ❌ Bad: Multiple passes
let results = items
  .filter(item => item.active)
  .filter(item => item.price < 100);

// ✅ Good: Early return with find()
let user = users.find(u => u.id === targetId);

// ❌ Bad: Full iteration with filter
let user = users.filter(u => u.id === targetId)[0];

// ✅ Good: For existence check only
let hasAdmin = users.some(u => u.role === "admin");

// ❌ Bad: Full filtering for existence check
let hasAdmin = users.filter(u => u.role === "admin").length > 0;
```

## Summary

Advanced array methods provide powerful tools for working with data. Remember: find/findIndex for locating elements, some/every for testing conditions, sort for ordering (with comparators!), and slice/splice for extraction and modification. Chain these methods together for elegant, functional code. Always be aware of which methods mutate and which return new arrays.
',
  45,
  14,
  ARRAY[
    'Use find() and findIndex() to locate elements in arrays',
    'Apply some() and every() for conditional checks across arrays',
    'Sort arrays with custom comparator functions',
    'Differentiate between mutating and non-mutating array methods',
    'Chain array methods for elegant data transformations'
  ],
  '{"external_links": ["https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array", "https://javascript.info/array-methods"]}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Lesson 15: ES6+ Features
INSERT INTO ai_learning_lessons (
  id,
  learning_path_id,
  title,
  description,
  content_type,
  content,
  duration_minutes,
  order_index,
  learning_objectives,
  resources
) VALUES (
  'ffffffff-ffff-ffff-ffff-ffffffffffff',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'ES6+ Features',
  'Learn modern JavaScript syntax introduced in ES6 and beyond - destructuring, spread/rest operators, and enhanced object literals.',
  'quiz',
  '# ES6+ Features

## Modern JavaScript

ES6 (ECMAScript 2015) introduced major improvements to JavaScript. These features make code more concise, readable, and expressive. Let''s explore the most important ones.

## Destructuring

Extract values from arrays and objects into variables:

### Array Destructuring

```javascript
// Without destructuring
let arr = [1, 2, 3];
let a = arr[0];
let b = arr[1];
let c = arr[2];

// ✅ With destructuring
let [a, b, c] = [1, 2, 3];
console.log(a, b, c); // 1 2 3

// Skip elements
let [first, , third] = [1, 2, 3];
console.log(first, third); // 1 3

// Rest of array
let [head, ...tail] = [1, 2, 3, 4, 5];
console.log(head); // 1
console.log(tail); // [2, 3, 4, 5]

// Default values
let [x = 10, y = 20] = [5];
console.log(x, y); // 5 20

// Swapping variables
let a = 1, b = 2;
[a, b] = [b, a];
console.log(a, b); // 2 1

// From function returns
function getCoordinates() {
  return [100, 200];
}
let [x, y] = getCoordinates();
console.log(x, y); // 100 200
```

### Object Destructuring

```javascript
// Without destructuring
let user = { name: "Alice", age: 25, city: "NYC" };
let name = user.name;
let age = user.age;

// ✅ With destructuring
let { name, age } = { name: "Alice", age: 25, city: "NYC" };
console.log(name, age); // "Alice" 25

// Rename variables
let { name: userName, age: userAge } = user;
console.log(userName, userAge); // "Alice" 25

// Default values
let { name, country = "USA" } = { name: "Alice" };
console.log(name, country); // "Alice" "USA"

// Nested destructuring
let data = {
  user: {
    name: "Alice",
    contact: {
      email: "alice@example.com"
    }
  }
};

let { user: { name, contact: { email } } } = data;
console.log(name, email); // "Alice" "alice@example.com"

// Rest properties
let { name, ...rest } = { name: "Alice", age: 25, city: "NYC" };
console.log(name); // "Alice"
console.log(rest); // { age: 25, city: "NYC" }
```

### Destructuring in Function Parameters

```javascript
// Array destructuring in params
function printCoords([x, y]) {
  console.log(`X: ${x}, Y: ${y}`);
}
printCoords([10, 20]); // "X: 10, Y: 20"

// Object destructuring in params
function greetUser({ name, age }) {
  console.log(`Hello ${name}, you are ${age} years old`);
}
greetUser({ name: "Alice", age: 25 });

// With defaults
function createUser({ name, role = "user", active = true }) {
  return { name, role, active };
}
console.log(createUser({ name: "Bob" }));
// { name: "Bob", role: "user", active: true }

// Practical: API response handling
function handleResponse({ data, status, error = null }) {
  if (status === "success") {
    return data;
  } else {
    throw new Error(error);
  }
}
```

## Spread Operator (...)

Expand iterables (arrays, objects) into individual elements:

### Array Spread

```javascript
// Combine arrays
let arr1 = [1, 2, 3];
let arr2 = [4, 5, 6];
let combined = [...arr1, ...arr2];
console.log(combined); // [1, 2, 3, 4, 5, 6]

// Copy array (shallow copy)
let original = [1, 2, 3];
let copy = [...original];
copy.push(4);
console.log(original); // [1, 2, 3] (unchanged)
console.log(copy);     // [1, 2, 3, 4]

// Insert elements
let arr = [1, 2, 5];
let newArr = [1, 2, 3, 4, 5];
// Easier than splice!
let result = [...arr.slice(0, 2), 3, 4, ...arr.slice(2)];

// Convert string to array
let str = "hello";
let chars = [...str];
console.log(chars); // ["h", "e", "l", "l", "o"]

// Pass array as function arguments
let numbers = [5, 10, 15];
console.log(Math.max(...numbers)); // 15
// Same as: Math.max(5, 10, 15)

// Remove duplicates (with Set)
let withDupes = [1, 2, 2, 3, 3, 4];
let unique = [...new Set(withDupes)];
console.log(unique); // [1, 2, 3, 4]
```

### Object Spread

```javascript
// Combine objects
let user = { name: "Alice", age: 25 };
let location = { city: "NYC", country: "USA" };
let profile = { ...user, ...location };
console.log(profile);
// { name: "Alice", age: 25, city: "NYC", country: "USA" }

// Copy object (shallow copy)
let original = { x: 1, y: 2 };
let copy = { ...original };
copy.z = 3;
console.log(original); // { x: 1, y: 2 } (unchanged)

// Override properties
let defaults = { theme: "light", fontSize: 14 };
let userPrefs = { fontSize: 16 };
let settings = { ...defaults, ...userPrefs };
console.log(settings); // { theme: "light", fontSize: 16 }

// Add/update properties
let user = { name: "Alice", age: 25 };
let updated = { ...user, age: 26, city: "NYC" };
console.log(updated);
// { name: "Alice", age: 26, city: "NYC" }

// Conditional properties
let includeEmail = true;
let user = {
  name: "Alice",
  ...(includeEmail && { email: "alice@example.com" })
};
console.log(user);
// { name: "Alice", email: "alice@example.com" }
```

**⚠️ Spread creates shallow copies:**

```javascript
let original = {
  name: "Alice",
  address: { city: "NYC" }
};

let copy = { ...original };
copy.address.city = "LA"; // Modifies original too!

console.log(original.address.city); // "LA" (changed!)

// Deep copy requires different approach
let deepCopy = JSON.parse(JSON.stringify(original));
// Or use libraries like lodash cloneDeep
```

## Rest Parameters

Collect remaining arguments into an array:

```javascript
// Without rest
function sum(a, b, c) {
  return a + b + c;
}

// ✅ With rest (any number of args)
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}
console.log(sum(1, 2, 3, 4, 5)); // 15

// Mix regular params with rest
function greet(greeting, ...names) {
  return `${greeting} ${names.join(", ")}!`;
}
console.log(greet("Hello", "Alice", "Bob", "Charlie"));
// "Hello Alice, Bob, Charlie!"

// Rest must be last parameter
function example(a, b, ...rest, c) {} // ❌ SyntaxError

// Practical: Flexible functions
function createUser(name, role = "user", ...permissions) {
  return {
    name,
    role,
    permissions
  };
}
let user = createUser("Alice", "admin", "read", "write", "delete");
console.log(user);
// { name: "Alice", role: "admin", permissions: ["read", "write", "delete"] }
```

**Rest vs Spread:**
- **Rest** - Collects multiple elements into array (function params)
- **Spread** - Expands array into individual elements (function calls, literals)

```javascript
// Spread: Array → Elements
let arr = [1, 2, 3];
console.log(...arr); // 1 2 3

// Rest: Elements → Array
function sum(...numbers) { // numbers is array
  return numbers.reduce((a, b) => a + b);
}
```

## Default Parameters

Provide default values for function parameters:

```javascript
// Old way
function greet(name) {
  name = name || "Guest";
  return `Hello ${name}`;
}

// ✅ ES6 way
function greet(name = "Guest") {
  return `Hello ${name}`;
}
console.log(greet());        // "Hello Guest"
console.log(greet("Alice")); // "Hello Alice"

// Multiple defaults
function createUser(name, role = "user", active = true) {
  return { name, role, active };
}

// Defaults can reference earlier params
function greet(firstName, lastName, fullName = `${firstName} ${lastName}`) {
  return `Hello ${fullName}`;
}
console.log(greet("Alice", "Smith"));
// "Hello Alice Smith"

// Defaults can be expressions
function getValue() {
  console.log("Computing default...");
  return 42;
}
function example(x = getValue()) {
  console.log(x);
}
example();    // Logs: "Computing default..." then 42
example(100); // Logs: 100 (default not evaluated)

// With destructuring
function config({
  host = "localhost",
  port = 3000,
  secure = false
} = {}) {
  console.log(`${secure ? "https" : "http"}://${host}:${port}`);
}
config(); // "http://localhost:3000"
config({ host: "example.com", secure: true }); // "https://example.com:3000"
```

## Enhanced Object Literals

Cleaner syntax for creating objects:

### Property Shorthand

```javascript
let name = "Alice";
let age = 25;

// Old way
let user = {
  name: name,
  age: age
};

// ✅ ES6 shorthand
let user = { name, age };
console.log(user); // { name: "Alice", age: 25 }

// Practical: Returning objects from functions
function createPoint(x, y) {
  return { x, y }; // Same as { x: x, y: y }
}
```

### Method Shorthand

```javascript
// Old way
let obj = {
  sayHi: function() {
    return "Hi!";
  }
};

// ✅ ES6 shorthand
let obj = {
  sayHi() {
    return "Hi!";
  }
};

// Practical example
let calculator = {
  add(a, b) {
    return a + b;
  },
  subtract(a, b) {
    return a - b;
  },
  multiply(a, b) {
    return a * b;
  }
};
console.log(calculator.add(5, 3)); // 8
```

### Computed Property Names

```javascript
// Dynamic property names
let propName = "score";
let obj = {
  [propName]: 100
};
console.log(obj); // { score: 100 }

// With expressions
let prefix = "user";
let user = {
  [`${prefix}Name`]: "Alice",
  [`${prefix}Age`]: 25
};
console.log(user); // { userName: "Alice", userAge: 25 }

// From variables
let key = "dynamicKey";
let value = "dynamicValue";
let obj = {
  [key]: value
};
console.log(obj); // { dynamicKey: "dynamicValue" }

// Practical: API response mapping
function mapResponse(data, idKey) {
  return data.map(item => ({
    [idKey]: item.id,
    name: item.name
  }));
}
```

## Practical Examples

### API Request with Defaults

```javascript
async function fetchData({
  url,
  method = "GET",
  headers = {},
  body = null,
  timeout = 5000
} = {}) {
  let options = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers
    },
    ...(body && { body: JSON.stringify(body) })
  };

  let response = await fetch(url, options);
  return response.json();
}

// Usage
fetchData({ url: "/api/users" });
fetchData({
  url: "/api/users",
  method: "POST",
  body: { name: "Alice" }
});
```

### Object Merging and Updating

```javascript
// Immutable state updates
let state = {
  user: { name: "Alice", age: 25 },
  settings: { theme: "dark" },
  count: 0
};

// Update nested object
let newState = {
  ...state,
  user: {
    ...state.user,
    age: 26
  },
  count: state.count + 1
};

console.log(state.user.age);    // 25 (unchanged)
console.log(newState.user.age); // 26
```

### Function Argument Flexibility

```javascript
function createArticle({
  title,
  author = "Anonymous",
  tags = [],
  published = false,
  ...metadata
}) {
  return {
    title,
    author,
    tags,
    published,
    metadata, // All other properties
    createdAt: new Date()
  };
}

let article = createArticle({
  title: "ES6 Features",
  tags: ["javascript", "es6"],
  category: "tutorial",
  difficulty: "intermediate"
});

console.log(article);
// {
//   title: "ES6 Features",
//   author: "Anonymous",
//   tags: ["javascript", "es6"],
//   published: false,
//   metadata: { category: "tutorial", difficulty: "intermediate" },
//   createdAt: [Date object]
// }
```

### Array Operations

```javascript
// Remove item from array immutably
let todos = ["Learn JS", "Build project", "Deploy"];
let index = 1;
let newTodos = [
  ...todos.slice(0, index),
  ...todos.slice(index + 1)
];
console.log(newTodos); // ["Learn JS", "Deploy"]

// Insert item immutably
let newTodos2 = [
  ...todos.slice(0, index),
  "New item",
  ...todos.slice(index)
];
console.log(newTodos2);
// ["Learn JS", "New item", "Build project", "Deploy"]

// Update item immutably
let users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" }
];
let updated = users.map(user =>
  user.id === 1 ? { ...user, name: "Alice Smith" } : user
);
```

## Best Practices

✅ **Use destructuring for clarity** - Makes function signatures self-documenting
✅ **Spread for copying** - Simple shallow copies of arrays/objects
✅ **Rest for flexible functions** - Accept variable number of arguments
✅ **Default parameters** - Avoid undefined/null checks
✅ **Object shorthand** - Less repetitive code
✅ **Computed properties** - Dynamic object keys

## Common Pitfalls

❌ **Shallow copy confusion** - Spread doesn''t deep copy nested objects
❌ **Destructuring undefined** - Check if object exists before destructuring
❌ **Rest must be last** - Can''t have parameters after rest parameter
❌ **Spread order matters** - Later properties override earlier ones
❌ **Default parameter evaluation** - Defaults evaluated every time if called
❌ **Destructuring null/undefined** - Will throw error

## Avoiding Errors

```javascript
// ❌ Destructuring null throws error
let { name } = null; // TypeError!

// ✅ Provide default
let { name } = null || {};

// ✅ Optional chaining (ES2020)
let { name } = data?.user || {};

// ❌ Wrong spread order
let config = { ...userSettings, ...defaultSettings };
// User settings get overridden!

// ✅ Correct order
let config = { ...defaultSettings, ...userSettings };
// User settings override defaults
```

## Summary

ES6+ features dramatically improve JavaScript code quality. Use destructuring to extract values clearly, spread to copy and combine data structures, rest parameters for flexible functions, and enhanced object literals for concise object creation. These features are now standard in modern JavaScript and should be used consistently in your code.
',
  50,
  15,
  ARRAY[
    'Destructure arrays and objects to extract values into variables',
    'Use spread operator to copy and combine arrays and objects',
    'Implement rest parameters for flexible function signatures',
    'Apply default parameters to handle optional arguments',
    'Write concise code with enhanced object literal syntax'
  ],
  '{"external_links": ["https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment", "https://javascript.info/destructuring-assignment"]}'::jsonb
)
,

-- Lesson 16: Asynchronous JavaScript Basics
(
  'b0b0b0b0-b0b0-b0b0-b0b0-b0b0b0b0b0b0',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Asynchronous JavaScript Basics',
  'Master asynchronous programming with callbacks, promises, async/await, and the Fetch API.',
  'quiz',
  '# Asynchronous JavaScript Basics

## Understanding Asynchronous Code

JavaScript is **single-threaded**, meaning it executes one thing at a time. Asynchronous code allows long-running operations (like fetching data) to run without blocking other code.

### Synchronous vs Asynchronous

**Synchronous** - Code runs line by line, waiting for each line to finish:

```javascript
console.log("First");
console.log("Second");
console.log("Third");
// Output: First, Second, Third
```

**Asynchronous** - Some code runs later, allowing other code to continue:

```javascript
console.log("First");
setTimeout(() => {
  console.log("Second");
}, 1000);
console.log("Third");
// Output: First, Third, Second (after 1 second)
```

## Timing Functions

### setTimeout - Run Once After Delay

```javascript
// Run after 2 seconds
setTimeout(() => {
  console.log("2 seconds passed!");
}, 2000);

// Pass parameters
setTimeout((name) => {
  console.log(`Hello, ${name}!`);
}, 1000, "Alice");

// Save reference to cancel
let timerId = setTimeout(() => {
  console.log("This won''t run");
}, 5000);
clearTimeout(timerId); // Cancel it
```

### setInterval - Run Repeatedly

```javascript
// Run every second
let count = 0;
let intervalId = setInterval(() => {
  count++;
  console.log(`Count: ${count}`);

  if (count === 5) {
    clearInterval(intervalId); // Stop after 5
  }
}, 1000);

// Countdown timer
let seconds = 10;
let countdown = setInterval(() => {
  console.log(seconds);
  seconds--;

  if (seconds < 0) {
    clearInterval(countdown);
    console.log("Done!");
  }
}, 1000);
```

## Callbacks and Callback Hell

Callbacks are functions passed to other functions to run later:

```javascript
function fetchUser(userId, callback) {
  setTimeout(() => {
    callback({ id: userId, name: "Alice" });
  }, 1000);
}

fetchUser(1, (user) => {
  console.log(user); // { id: 1, name: "Alice" }
});
```

**Callback Hell** - Nested callbacks become hard to read:

```javascript
// ❌ Callback hell - hard to read and maintain
fetchUser(1, (user) => {
  fetchPosts(user.id, (posts) => {
    fetchComments(posts[0].id, (comments) => {
      console.log(comments);
      // Nested 3 levels deep!
    });
  });
});
```

## Promises - Better Async

Promises represent a value that will be available later:

```javascript
// Creating a promise
let promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    let success = true;
    if (success) {
      resolve("Operation succeeded!");
    } else {
      reject("Operation failed!");
    }
  }, 1000);
});

// Using promises with then/catch
promise
  .then((result) => {
    console.log(result); // "Operation succeeded!"
  })
  .catch((error) => {
    console.error(error);
  });
```

### Chaining Promises

```javascript
function fetchUser(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: userId, name: "Alice" });
    }, 1000);
  });
}

function fetchPosts(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, title: "Post 1" },
        { id: 2, title: "Post 2" }
      ]);
    }, 1000);
  });
}

// ✅ Much cleaner than callbacks
fetchUser(1)
  .then((user) => {
    console.log(user);
    return fetchPosts(user.id);
  })
  .then((posts) => {
    console.log(posts);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
```

## Async/Await - Even Better

Async/await makes asynchronous code look synchronous:

```javascript
// Async function returns a promise
async function getUserData() {
  try {
    let user = await fetchUser(1);
    console.log(user);

    let posts = await fetchPosts(user.id);
    console.log(posts);

    return { user, posts };
  } catch (error) {
    console.error("Error:", error);
  }
}

// Call async function
getUserData().then((data) => {
  console.log("All data:", data);
});
```

### Multiple Parallel Operations

```javascript
// Run multiple promises at once
async function fetchAllData() {
  try {
    // Wait for all to complete
    let [users, posts, comments] = await Promise.all([
      fetchUsers(),
      fetchPosts(),
      fetchComments()
    ]);

    console.log(users, posts, comments);
  } catch (error) {
    console.error("One failed:", error);
  }
}

// Race - first to complete wins
async function fetchFastest() {
  let result = await Promise.race([
    fetchFromServer1(),
    fetchFromServer2(),
    fetchFromServer3()
  ]);
  console.log("Fastest result:", result);
}
```

## Fetch API Basics

Fetch is the modern way to make HTTP requests:

```javascript
// Simple GET request
async function getUsers() {
  try {
    let response = await fetch("https://api.example.com/users");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let users = await response.json();
    console.log(users);
    return users;
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

// POST request with data
async function createUser(userData) {
  try {
    let response = await fetch("https://api.example.com/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData)
    });

    let newUser = await response.json();
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
  }
}

// Usage
createUser({ name: "Alice", email: "alice@example.com" });
```

## Practical Examples

### Loading Indicator

```javascript
async function loadData() {
  let loadingElement = document.getElementById("loading");
  let contentElement = document.getElementById("content");

  try {
    loadingElement.style.display = "block";

    let data = await fetch("/api/data").then(r => r.json());

    contentElement.innerHTML = data.map(item =>
      `<div>${item.name}</div>`
    ).join("");
  } catch (error) {
    contentElement.innerHTML = "Error loading data";
  } finally {
    loadingElement.style.display = "none";
  }
}
```

### Retry Logic

```javascript
async function fetchWithRetry(url, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      let response = await fetch(url);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      console.log(`Retry ${i + 1}/${maxRetries}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}
```

### Sequential vs Parallel

```javascript
// ❌ Sequential - slow (6 seconds total)
async function loadSequential() {
  let user = await fetchUser();      // 2 seconds
  let posts = await fetchPosts();    // 2 seconds
  let comments = await fetchComments(); // 2 seconds
  return { user, posts, comments };
}

// ✅ Parallel - fast (2 seconds total)
async function loadParallel() {
  let [user, posts, comments] = await Promise.all([
    fetchUser(),      // All run at once
    fetchPosts(),
    fetchComments()
  ]);
  return { user, posts, comments };
}
```

## Best Practices

✅ **Use async/await** - Cleaner than promise chains
✅ **Always handle errors** - Use try/catch with async/await
✅ **Check response.ok** - Fetch doesn''t throw on HTTP errors
✅ **Parallel when possible** - Use Promise.all for independent operations
✅ **Clear timeouts/intervals** - Prevent memory leaks

## Common Pitfalls

❌ **Forgetting await** - Async functions return promises
❌ **Not handling promise rejections** - Unhandled rejections crash apps
❌ **Sequential when parallel works** - Slower than necessary
❌ **Assuming fetch throws on HTTP errors** - Check response.ok
❌ **Forgetting async keyword** - Can''t use await without it

## Avoiding Errors

```javascript
// ❌ Forgot await - returns Promise, not value
async function wrong() {
  let data = fetchData(); // Missing await!
  console.log(data); // Promise { <pending> }
}

// ✅ With await
async function correct() {
  let data = await fetchData();
  console.log(data); // Actual data
}

// ❌ Fetch doesn''t throw on 404
let response = await fetch("/api/data");
let data = await response.json(); // Might be error page HTML!

// ✅ Check response first
let response = await fetch("/api/data");
if (!response.ok) {
  throw new Error(`HTTP ${response.status}`);
}
let data = await response.json();

// ❌ Unhandled rejection
async function risky() {
  await mightFail(); // If this throws, app crashes
}

// ✅ Proper error handling
async function safe() {
  try {
    await mightFail();
  } catch (error) {
    console.error("Handled:", error);
  }
}
```

## Summary

Asynchronous JavaScript is essential for modern web development. Use setTimeout/setInterval for timing, promises for async operations, and async/await for clean, readable async code. The Fetch API simplifies HTTP requests. Always handle errors properly and use parallel execution when operations are independent.
',
  55,
  16,
  ARRAY[
    'Understand the difference between synchronous and asynchronous code execution',
    'Use setTimeout and setInterval for delayed and repeated execution',
    'Write and chain promises to handle asynchronous operations',
    'Apply async/await syntax for cleaner asynchronous code',
    'Make HTTP requests using the Fetch API with proper error handling'
  ],
  '{"external_links": ["https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous", "https://javascript.info/async"]}'::jsonb
),

-- Lesson 17: Error Handling
(
  'b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b1',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Error Handling',
  'Learn to handle errors gracefully with try/catch, throw custom errors, and debug effectively.',
  'quiz',
  '# Error Handling

## Why Error Handling Matters

Errors are inevitable in programming. **Good error handling** makes your code robust, maintainable, and user-friendly by preventing crashes and providing helpful feedback.

### Types of Errors

1. **Syntax Errors** - Code won''t run (missing brackets, typos)
2. **Runtime Errors** - Code runs but fails (accessing undefined)
3. **Logical Errors** - Code runs but produces wrong results

## Try/Catch/Finally

The try/catch statement handles runtime errors gracefully:

```javascript
// Basic try/catch
try {
  // Code that might fail
  let data = JSON.parse(''{ invalid json }'');
  console.log(data);
} catch (error) {
  // Runs if error occurs
  console.error("Parsing failed:", error.message);
}

console.log("Program continues!");
```

### The Finally Block

Finally **always runs**, whether error occurs or not:

```javascript
function processFile(filename) {
  let file;

  try {
    file = openFile(filename);
    let data = file.read();
    return processData(data);
  } catch (error) {
    console.error("Error processing file:", error);
    return null;
  } finally {
    // Always runs - cleanup code
    if (file) {
      file.close();
      console.log("File closed");
    }
  }
}
```

### Practical Example - API Call

```javascript
async function fetchUserData(userId) {
  try {
    let response = await fetch(`/api/users/${userId}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    let data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch user:", error.message);

    // Return default value or rethrow
    return { id: userId, name: "Unknown" };
  }
}
```

## Throwing Errors

Use `throw` to signal that something went wrong:

```javascript
function divide(a, b) {
  if (b === 0) {
    throw new Error("Cannot divide by zero");
  }
  return a / b;
}

try {
  console.log(divide(10, 2)); // 5
  console.log(divide(10, 0)); // Throws error
} catch (error) {
  console.error("Error:", error.message);
}
```

### When to Throw

```javascript
function validateEmail(email) {
  // Check for null/undefined
  if (email == null) {
    throw new Error("Email is required");
  }

  // Check type
  if (typeof email !== "string") {
    throw new TypeError("Email must be a string");
  }

  // Check format
  if (!email.includes("@")) {
    throw new Error("Invalid email format");
  }

  return true;
}

// Usage
try {
  validateEmail("invalid-email");
} catch (error) {
  console.error(error.message); // "Invalid email format"
}
```

## Error Types

JavaScript has built-in error types:

```javascript
// Generic Error
throw new Error("Something went wrong");

// TypeError - wrong type
function double(x) {
  if (typeof x !== "number") {
    throw new TypeError("Expected a number");
  }
  return x * 2;
}

// RangeError - value out of range
function setAge(age) {
  if (age < 0 || age > 150) {
    throw new RangeError("Age must be between 0 and 150");
  }
}

// ReferenceError - accessing undefined variable
try {
  console.log(nonExistentVariable);
} catch (error) {
  console.log(error instanceof ReferenceError); // true
}

// SyntaxError - invalid syntax
try {
  eval("{ invalid syntax");
} catch (error) {
  console.log(error instanceof SyntaxError); // true
}
```

## Creating Custom Errors

Custom error classes provide more context:

```javascript
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

class NetworkError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = "NetworkError";
    this.statusCode = statusCode;
  }
}

// Using custom errors
function validateUser(user) {
  if (!user.name) {
    throw new ValidationError("Name is required", "name");
  }
  if (!user.email) {
    throw new ValidationError("Email is required", "email");
  }
}

// Catching custom errors
try {
  validateUser({ name: "Alice" });
} catch (error) {
  if (error instanceof ValidationError) {
    console.error(`${error.field}: ${error.message}`);
    // Show field-specific error in UI
  } else {
    console.error("Unexpected error:", error);
  }
}
```

## Debugging with Console Methods

Beyond console.log, there are many debugging tools:

```javascript
// console.error - Red error message
console.error("This is an error!");

// console.warn - Yellow warning
console.warn("This is a warning!");

// console.table - Display arrays/objects as table
let users = [
  { id: 1, name: "Alice", age: 25 },
  { id: 2, name: "Bob", age: 30 }
];
console.table(users);

// console.group - Group related logs
console.group("User Details");
console.log("Name:", "Alice");
console.log("Age:", 25);
console.log("Email:", "alice@example.com");
console.groupEnd();

// console.time - Measure execution time
console.time("fetchData");
await fetchData();
console.timeEnd("fetchData"); // fetchData: 234.56ms

// console.trace - Show call stack
function a() { b(); }
function b() { c(); }
function c() { console.trace("How did we get here?"); }
a(); // Shows: c > b > a

// console.assert - Log only if condition is false
let age = 15;
console.assert(age >= 18, "User must be 18 or older");
```

## Practical Error Handling Patterns

### Centralized Error Handler

```javascript
class ErrorHandler {
  static handle(error, context = "") {
    // Log error details
    console.error(`[${new Date().toISOString()}] ${context}`);
    console.error(error);

    // Track in analytics (in real app)
    // analytics.trackError(error);

    // Show user-friendly message
    if (error instanceof ValidationError) {
      return this.showValidationError(error);
    }
    if (error instanceof NetworkError) {
      return this.showNetworkError(error);
    }
    return this.showGenericError();
  }

  static showValidationError(error) {
    alert(`Validation Error: ${error.message}`);
  }

  static showNetworkError(error) {
    alert(`Network Error: Please check your connection`);
  }

  static showGenericError() {
    alert("An unexpected error occurred. Please try again.");
  }
}

// Usage throughout app
try {
  await saveUser(userData);
} catch (error) {
  ErrorHandler.handle(error, "saveUser");
}
```

### Retry with Exponential Backoff

```javascript
async function fetchWithRetry(url, maxRetries = 3) {
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      let response = await fetch(url);
      if (response.ok) {
        return await response.json();
      }
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;

      if (attempt < maxRetries - 1) {
        // Exponential backoff: 1s, 2s, 4s
        let delay = Math.pow(2, attempt) * 1000;
        console.log(`Retry ${attempt + 1} after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw new Error(`Failed after ${maxRetries} attempts: ${lastError.message}`);
}
```

## Best Practices

✅ **Fail fast** - Validate input early, throw errors immediately
✅ **Descriptive error messages** - Help users and developers understand what went wrong
✅ **Use finally for cleanup** - Close files, connections, clear timers
✅ **Create custom error types** - Easier to handle specific scenarios
✅ **Log errors properly** - Include context, timestamp, stack trace
✅ **Never swallow errors silently** - At minimum, log them

## Common Pitfalls

❌ **Empty catch blocks** - Errors disappear silently
❌ **Generic error messages** - "An error occurred" helps no one
❌ **Not rethrowing** - Catch errors you can''t handle, but rethrow them
❌ **Throwing strings** - Always throw Error objects, not strings
❌ **Too broad try/catch** - Catch specific operations, not entire functions

## Avoiding Errors

```javascript
// ❌ Swallowing errors
try {
  riskyOperation();
} catch (error) {
  // Error disappears!
}

// ✅ At least log it
try {
  riskyOperation();
} catch (error) {
  console.error("Operation failed:", error);
  throw error; // Rethrow if you can''t handle it
}

// ❌ Throwing string
throw "Something went wrong"; // Bad!

// ✅ Throw Error object
throw new Error("Something went wrong"); // Good!

// ❌ Generic message
throw new Error("Error"); // Useless

// ✅ Descriptive message
throw new Error(`Failed to fetch user ${userId}: ${response.statusText}`);

// ❌ Too broad catch
try {
  validateInput();
  saveToDatabase();
  sendEmail();
  updateUI();
} catch (error) {
  // Which operation failed?
}

// ✅ Specific catches
try {
  validateInput();
} catch (error) {
  throw new ValidationError(error.message);
}

try {
  await saveToDatabase();
} catch (error) {
  throw new DatabaseError(error.message);
}
```

## Summary

Effective error handling is crucial for robust applications. Use try/catch/finally to handle errors gracefully, throw descriptive errors when things go wrong, create custom error types for specific scenarios, and use console methods for debugging. Always provide context in error messages and never silently swallow errors.
',
  40,
  17,
  ARRAY[
    'Use try/catch/finally blocks to handle runtime errors gracefully',
    'Throw errors with descriptive messages to indicate problems',
    'Understand different error types (Error, TypeError, RangeError)',
    'Create custom error classes for application-specific errors',
    'Debug effectively using console methods beyond console.log'
  ],
  '{"external_links": ["https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch", "https://javascript.info/try-catch"]}'::jsonb
),

-- Lesson 18: Modern JavaScript Practices
(
  'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Modern JavaScript Practices',
  'Master modern JavaScript development with ES modules, code organization, and best practices.',
  'quiz',
  '# Modern JavaScript Practices

## ES Modules (Import/Export)

Modern JavaScript uses **modules** to organize code into separate files, making code reusable, maintainable, and preventing global scope pollution.

### Named Exports

Export multiple values from a file:

```javascript
// utils.js
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

export const PI = 3.14159;

export class Calculator {
  multiply(a, b) {
    return a * b;
  }
}
```

```javascript
// main.js
import { add, subtract, PI, Calculator } from ''./utils.js'';

console.log(add(5, 3));        // 8
console.log(subtract(10, 4));  // 6
console.log(PI);               // 3.14159

let calc = new Calculator();
console.log(calc.multiply(4, 5)); // 20
```

### Default Exports

Each file can have **one default export**:

```javascript
// User.js
export default class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  greet() {
    return `Hello, I''m ${this.name}`;
  }
}
```

```javascript
// main.js
import User from ''./User.js'';

let user = new User("Alice", "alice@example.com");
console.log(user.greet()); // Hello, I''m Alice
```

### Mixing Default and Named Exports

```javascript
// api.js
export default async function fetchUsers() {
  let response = await fetch(''/api/users'');
  return response.json();
}

export async function fetchUser(id) {
  let response = await fetch(`/api/users/${id}`);
  return response.json();
}

export const API_BASE_URL = ''https://api.example.com'';
```

```javascript
// main.js
import fetchUsers, { fetchUser, API_BASE_URL } from ''./api.js'';

let users = await fetchUsers();
let user = await fetchUser(1);
console.log(API_BASE_URL);
```

### Import Aliases

Rename imports to avoid conflicts:

```javascript
import { add as addNumbers } from ''./math.js'';
import { add as addStrings } from ''./strings.js'';

console.log(addNumbers(5, 3));     // 8
console.log(addStrings(''Hello '', ''World'')); // Hello World
```

### Import Everything

```javascript
// math.js
export function add(a, b) { return a + b; }
export function subtract(a, b) { return a - b; }
export const PI = 3.14159;

// main.js
import * as Math from ''./math.js'';

console.log(Math.add(5, 3));   // 8
console.log(Math.PI);          // 3.14159
```

## Code Organization

### File Structure Best Practices

```
project/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── Button.js
│   │   ├── Card.js
│   │   └── Modal.js
│   ├── utils/          # Helper functions
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   └── api.js
│   ├── services/       # Business logic
│   │   ├── UserService.js
│   │   └── AuthService.js
│   ├── constants/      # App-wide constants
│   │   └── config.js
│   └── main.js         # Entry point
├── tests/              # Test files
└── package.json
```

### Single Responsibility Principle

Each file/module should do **one thing well**:

```javascript
// ✅ Good - Focused validators
// validators.js
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPassword(password) {
  return password.length >= 8 && /\d/.test(password);
}

// ✅ Good - Focused formatters
// formatters.js
export function formatDate(date) {
  return new Intl.DateTimeFormat(''en-US'').format(date);
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat(''en-US'', {
    style: ''currency'',
    currency: ''USD''
  }).format(amount);
}
```

### Barrel Exports

Create index.js files to simplify imports:

```javascript
// components/index.js
export { default as Button } from ''./Button.js'';
export { default as Card } from ''./Card.js'';
export { default as Modal } from ''./Modal.js'';

// main.js - Clean single import
import { Button, Card, Modal } from ''./components/index.js'';
```

## Naming Conventions

### Variables and Functions

```javascript
// camelCase for variables and functions
let userName = "Alice";
let userAge = 25;

function getUserData() {
  return { name: userName, age: userAge };
}

// UPPER_CASE for constants
const MAX_LOGIN_ATTEMPTS = 3;
const API_BASE_URL = ''https://api.example.com'';
const DEFAULT_TIMEOUT = 5000;
```

### Classes and Constructors

```javascript
// PascalCase for classes
class UserAccount {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
}

class ShoppingCart {
  constructor() {
    this.items = [];
  }
}
```

### Booleans

```javascript
// Prefix with is/has/can/should
let isLoggedIn = true;
let hasPermission = false;
let canEdit = true;
let shouldRefresh = false;

function isValidEmail(email) {
  return email.includes(''@'');
}
```

### Private Fields (ES2022)

```javascript
class BankAccount {
  #balance = 0; // Private field

  deposit(amount) {
    if (amount > 0) {
      this.#balance += amount;
    }
  }

  getBalance() {
    return this.#balance;
  }
}

let account = new BankAccount();
account.deposit(100);
console.log(account.getBalance()); // 100
// console.log(account.#balance); // SyntaxError!
```

## Comments and Documentation

### When to Comment

```javascript
// ✅ Good comments explain WHY, not WHAT
// Retry failed requests up to 3 times to handle temporary network issues
const MAX_RETRIES = 3;

// ✅ Document complex algorithms
function quickSort(arr) {
  // Using Hoare partition scheme for better performance
  // on arrays with many duplicate elements
  if (arr.length <= 1) return arr;
  // ... implementation
}

// ❌ Bad comments state the obvious
// Increment i by 1
i++;

// ❌ Commented-out code - delete it instead
// let oldFunction = () => {
//   // old implementation
// };
```

### JSDoc for Documentation

```javascript
/**
 * Fetches user data from the API
 * @param {number} userId - The user''s ID
 * @param {Object} options - Optional configuration
 * @param {boolean} options.includeProfile - Include profile data
 * @returns {Promise<Object>} User data object
 * @throws {Error} If user not found
 */
async function fetchUser(userId, options = {}) {
  let url = `/api/users/${userId}`;
  if (options.includeProfile) {
    url += ''?include=profile'';
  }

  let response = await fetch(url);
  if (!response.ok) {
    throw new Error(''User not found'');
  }

  return response.json();
}
```

## Const vs Let vs Var

### Modern JavaScript: Use const by default

```javascript
// ✅ Use const for values that don''t change
const API_URL = ''https://api.example.com'';
const users = []; // Array reference doesn''t change
users.push({ name: ''Alice'' }); // Contents can change

// ✅ Use let for values that change
let counter = 0;
counter++;

for (let i = 0; i < 10; i++) {
  console.log(i);
}

// ❌ Never use var in modern JavaScript
var oldStyle = ''avoid this''; // Has confusing scope rules
```

### Why const is better

```javascript
// const prevents accidental reassignment
const maxUsers = 100;
// maxUsers = 200; // Error! Good - prevents bugs

// let allows reassignment when needed
let currentUser = null;
currentUser = { id: 1, name: ''Alice'' }; // OK
```

## Code Style Best Practices

### Consistent Formatting

```javascript
// ✅ Good - Consistent style
function processUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name.toUpperCase(),
    email: user.email.toLowerCase()
  };
}

// ✅ Use template literals
let message = `Hello, ${user.name}!`;

// ❌ Avoid string concatenation
let message = ''Hello, '' + user.name + ''!'';

// ✅ Use arrow functions for callbacks
users.filter(user => user.active)
     .map(user => user.name)
     .forEach(name => console.log(name));
```

### Guard Clauses

```javascript
// ❌ Nested conditions - hard to read
function processOrder(order) {
  if (order) {
    if (order.items.length > 0) {
      if (order.isPaid) {
        // Process order
        return processItems(order.items);
      }
    }
  }
  return null;
}

// ✅ Guard clauses - return early
function processOrder(order) {
  if (!order) return null;
  if (order.items.length === 0) return null;
  if (!order.isPaid) return null;

  return processItems(order.items);
}
```

## Best Practices

✅ **Use ES modules** - Import/export for code organization
✅ **Meaningful names** - Variables and functions should be self-documenting
✅ **Consistent formatting** - Use a formatter like Prettier
✅ **const by default** - Only use let when reassignment needed
✅ **Single responsibility** - Each function/module does one thing
✅ **Comment why, not what** - Code shows what, comments explain why

## Common Pitfalls

❌ **Circular dependencies** - File A imports B, B imports A
❌ **Poor naming** - Abbreviations, single letters (except loop counters)
❌ **Global pollution** - Variables in global scope
❌ **Inconsistent style** - Mixing patterns within same project
❌ **Over-commenting** - Explaining obvious code
❌ **Under-commenting** - Complex logic without explanation

## Avoiding Errors

```javascript
// ❌ Circular dependency
// user.js
import { log } from ''./logger.js'';
export class User { }

// logger.js
import { User } from ''./user.js''; // Circular!
export function log() { }

// ✅ Extract shared dependencies
// user.js
import { log } from ''./logger.js'';
export class User { }

// logger.js (no user import)
export function log() { }

// ❌ Poor naming
let x = getU();
let d = new Date();

// ✅ Descriptive naming
let currentUser = getCurrentUser();
let currentDate = new Date();

// ❌ Global variables
var globalCounter = 0; // Accessible everywhere!

// ✅ Module scope
let moduleCounter = 0; // Only in this module

// ❌ Mixed styles
const user_name = ''Alice''; // snake_case
const UserAge = 25;          // PascalCase
const user-email = ''...'';  // kebab-case (invalid!)

// ✅ Consistent camelCase
const userName = ''Alice'';
const userAge = 25;
const userEmail = ''alice@example.com'';
```

## Summary

Modern JavaScript development relies on ES modules for code organization, consistent naming conventions for readability, and best practices for maintainability. Use const by default, follow naming conventions (camelCase for variables, PascalCase for classes), organize code into focused modules, and write comments that explain why, not what. These practices lead to clean, maintainable, professional code.
',
  45,
  18,
  ARRAY[
    'Organize code using ES modules with import and export statements',
    'Apply consistent naming conventions for variables, functions, and classes',
    'Write meaningful comments that explain complex logic and decisions',
    'Use const by default and let only when reassignment is needed',
    'Structure projects with clear file organization and single responsibility'
  ],
  '{"external_links": ["https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules", "https://javascript.info/modules-intro"]}'::jsonb
);

-- =====================================================
-- 3. QUIZ QUESTIONS
-- =====================================================

-- Lesson 1: Introduction to JavaScript (5 questions)
INSERT INTO javascript_quiz_questions (lesson_id, question_text, question_type, options, correct_answer, explanation, order_index, difficulty) VALUES
('11111111-1111-1111-1111-111111111111', 'What is the primary purpose of JavaScript in web development?', 'multiple_choice', '{"A": "To style web pages", "B": "To make websites interactive and dynamic", "C": "To structure web content", "D": "To manage databases"}', 'B', 'JavaScript is a programming language designed to make websites interactive and dynamic. HTML structures content, CSS styles it, and JavaScript adds behavior and interactivity. While JavaScript can work with databases (through backend technologies), its primary purpose in web development is client-side interactivity.', 1, 'easy'),

('11111111-1111-1111-1111-111111111111', 'Which of the following is NOT a valid place where JavaScript can run?', 'multiple_choice', '{"A": "Web browsers like Chrome and Firefox", "B": "Servers using Node.js", "C": "Mobile apps with React Native", "D": "Inside CSS stylesheets"}', 'D', 'JavaScript runs in browsers (client-side), on servers (Node.js), and in mobile apps (React Native, Ionic). However, JavaScript cannot run inside CSS stylesheets - CSS is a styling language, not a programming environment. CSS has its own syntax and cannot execute JavaScript code.', 2, 'easy'),

('11111111-1111-1111-1111-111111111111', 'What will be the output of console.log(2 + 2)?', 'multiple_choice', '{"A": "22", "B": "4", "C": "2 + 2", "D": "undefined"}', 'B', 'console.log(2 + 2) outputs 4 because JavaScript evaluates the arithmetic expression 2 + 2 before logging it. The + operator performs addition when both operands are numbers. If they were strings ("2" + "2"), the result would be "22" due to string concatenation.', 3, 'medium'),

('11111111-1111-1111-1111-111111111111', 'JavaScript was originally created in 1995 and is now one of the most popular programming languages in the world.', 'true_false', '{"true": "True", "false": "False"}', 'true', 'This statement is true. JavaScript was created by Brendan Eich in 1995 for Netscape Navigator. Despite its age, JavaScript has evolved significantly and is now one of the most widely used programming languages globally, powering both frontend and backend development.', 4, 'easy'),

('11111111-1111-1111-1111-111111111111', 'What happens when you assign a new value to a variable declared with const?', 'multiple_choice', '{"A": "The value updates successfully", "B": "JavaScript throws an error", "C": "The old value is preserved", "D": "The variable becomes undefined"}', 'B', 'Variables declared with const cannot be reassigned. Attempting to reassign a const variable throws a TypeError: "Assignment to constant variable." This is a key difference from let and var, which allow reassignment. However, note that const objects and arrays can still have their properties/elements modified - only reassignment is blocked.', 5, 'medium'),

-- Lesson 2: Variables and Data Types (5 questions)
('22222222-2222-2222-2222-222222222222', 'Which keyword should you use by default when declaring variables in modern JavaScript?', 'multiple_choice', '{"A": "var", "B": "let", "C": "const", "D": "variable"}', 'C', 'You should use const by default in modern JavaScript. This prevents accidental reassignment and makes your code more predictable. Only use let when you know the variable will need to be reassigned. Avoid var due to its function-scoping issues and hoisting behavior. "variable" is not a valid JavaScript keyword.', 1, 'easy'),

('22222222-2222-2222-2222-222222222222', 'What is the data type of null in JavaScript?', 'multiple_choice', '{"A": "null", "B": "undefined", "C": "object", "D": "boolean"}', 'C', 'Interestingly, typeof null returns "object" in JavaScript. This is actually a famous bug from the early days of JavaScript that was never fixed for backward compatibility reasons. Despite this quirk, null represents the intentional absence of any value and is a primitive value, not actually an object.', 2, 'hard'),

('22222222-2222-2222-2222-222222222222', 'Which of the following variable names follows JavaScript naming conventions?', 'multiple_choice', '{"A": "user_name", "B": "UserName", "C": "userName", "D": "username-var"}', 'C', 'JavaScript uses camelCase for variable names (userName). PascalCase (UserName) is reserved for class names. snake_case (user_name) is not conventional in JavaScript. Hyphens (username-var) are not allowed in variable names as they would be interpreted as subtraction operators.', 3, 'medium'),

('22222222-2222-2222-2222-222222222222', 'Variables declared with let can be reassigned new values.', 'true_false', '{"true": "True", "false": "False"}', 'true', 'This is true. The let keyword creates variables that can be reassigned. Unlike const, which prevents reassignment, let allows you to change the value stored in the variable. This makes let useful for counters, accumulators, and other values that need to change during program execution.', 4, 'easy'),

('22222222-2222-2222-2222-222222222222', 'What is the result of typeof [1, 2, 3] in JavaScript?', 'multiple_choice', '{"A": "array", "B": "object", "C": "list", "D": "collection"}', 'B', 'Arrays in JavaScript are actually objects, so typeof [1, 2, 3] returns "object". This is technically correct since arrays are a special type of object with numeric keys and a length property. To specifically check if something is an array, use Array.isArray() instead of typeof.', 5, 'medium'),

-- Lesson 3: Operators and Expressions (5 questions)
('33333333-3333-3333-3333-333333333333', 'What is the result of 5 + "5" in JavaScript?', 'multiple_choice', '{"A": "10", "B": "55", "C": "NaN", "D": "Error"}', 'B', 'JavaScript uses type coercion to convert the number 5 to a string and concatenates them, resulting in "55". When the + operator is used with a string, JavaScript treats it as concatenation rather than addition. To get numeric addition, both operands must be numbers: Number("5") + 5 would give 10.', 1, 'medium'),

('33333333-3333-3333-3333-333333333333', 'What does the === operator check for?', 'multiple_choice', '{"A": "Only value equality", "B": "Only type equality", "C": "Both value and type equality", "D": "Reference equality"}', 'C', 'The === operator (strict equality) checks both value and type without type coercion. For example, 5 === "5" is false because they have different types (number vs string). In contrast, == (loose equality) performs type coercion, so 5 == "5" is true. Always prefer === to avoid unexpected type coercion bugs.', 2, 'easy'),

('33333333-3333-3333-3333-333333333333', 'The || (OR) operator returns true only if both operands are true.', 'true_false', '{"true": "True", "false": "False"}', 'false', 'This is false. The || (OR) operator returns true if at least ONE operand is true. It only returns false when both operands are false. The operator that requires both operands to be true is && (AND). Additionally, || can be used for providing default values: let name = userName || "Guest".', 3, 'easy'),

('33333333-3333-3333-3333-333333333333', 'What is the purpose of the % (modulo) operator?', 'multiple_choice', '{"A": "Calculate percentages", "B": "Return the remainder of division", "C": "Perform floating-point division", "D": "Convert to percentage format"}', 'B', 'The % (modulo) operator returns the remainder after division. For example, 10 % 3 returns 1 because 10 divided by 3 is 3 with a remainder of 1. This is commonly used to check if numbers are even (n % 2 === 0) or to cycle through array indices (index % array.length).', 4, 'medium'),

('33333333-3333-3333-3333-333333333333', 'Which operator has the highest precedence in JavaScript?', 'multiple_choice', '{"A": "Addition (+)", "B": "Multiplication (*)", "C": "Assignment (=)", "D": "Logical OR (||)"}', 'B', 'Multiplication (*), division (/), and modulo (%) have higher precedence than addition and subtraction. This means in the expression 2 + 3 * 4, JavaScript evaluates 3 * 4 first (getting 12), then adds 2 to get 14. Assignment operators have very low precedence, and logical operators are evaluated after arithmetic operators. Use parentheses to make precedence explicit.', 5, 'hard'),

-- Lesson 4: Control Flow (5 questions)
('44444444-4444-4444-4444-444444444444', 'Which statement allows you to execute code only if a condition is true?', 'multiple_choice', '{"A": "for", "B": "while", "C": "if", "D": "switch"}', 'C', 'The if statement executes code conditionally based on whether an expression evaluates to true. While for and while are for loops (repetition), and switch handles multiple conditions, only if provides basic conditional execution. Combined with else and else if, if statements form the foundation of decision-making in JavaScript.', 1, 'easy'),

('44444444-4444-4444-4444-444444444444', 'What will this code output: if (0) { console.log("Yes"); } else { console.log("No"); }', 'multiple_choice', '{"A": "Yes", "B": "No", "C": "0", "D": "Error"}', 'B', 'This outputs "No" because 0 is a falsy value in JavaScript. Falsy values (0, "", null, undefined, NaN, false) evaluate to false in conditional statements. The if block is skipped and the else block executes. Only truthy values (everything except falsy values) cause the if block to execute.', 2, 'medium'),

('44444444-4444-4444-4444-444444444444', 'The switch statement uses strict equality (===) to compare cases.', 'true_false', '{"true": "True", "false": "False"}', 'true', 'This is true. The switch statement uses strict equality (===) when comparing the switch expression to case values, meaning both type and value must match. For example, switch(1) with case "1": will not match because 1 (number) !== "1" (string). This prevents unexpected type coercion bugs.', 3, 'easy'),

('44444444-4444-4444-4444-444444444444', 'What is the purpose of the break statement in a switch?', 'multiple_choice', '{"A": "To end the entire program", "B": "To exit the current function", "C": "To stop checking further cases", "D": "To skip to the next case"}', 'C', 'The break statement stops execution and exits the switch block, preventing "fall-through" to subsequent cases. Without break, JavaScript continues executing all following cases until it hits a break or the end of the switch. This is usually unwanted behavior, which is why break is essential after each case (unless intentional fall-through is desired).', 4, 'medium'),

('44444444-4444-4444-4444-444444444444', 'What does the ternary operator (? :) provide?', 'multiple_choice', '{"A": "A way to loop three times", "B": "A shorthand for if-else statements", "C": "A method to define three variables", "D": "A way to compare three values"}', 'B', 'The ternary operator (condition ? valueIfTrue : valueIfFalse) is a concise way to write if-else statements. It evaluates a condition and returns one of two values. For example, let status = age >= 18 ? "adult" : "minor" is equivalent to if (age >= 18) { status = "adult"; } else { status = "minor"; }. Use it for simple conditions; prefer if-else for complex logic.', 5, 'hard'),

-- Lesson 5: Loops and Iteration (5 questions)
('55555555-5555-5555-5555-555555555555', 'Which loop is best when you know exactly how many times you need to iterate?', 'multiple_choice', '{"A": "while", "B": "do...while", "C": "for", "D": "forEach"}', 'C', 'The for loop is ideal when you know the iteration count in advance. Its syntax (for (let i = 0; i < 5; i++)) clearly shows initialization, condition, and increment in one line. While loops are better when the iteration count is unknown, and forEach is specifically for arrays. do...while guarantees at least one execution.', 1, 'easy'),

('55555555-5555-5555-5555-555555555555', 'What is the difference between break and continue statements?', 'multiple_choice', '{"A": "break exits the loop, continue skips to the next iteration", "B": "break skips to the next iteration, continue exits the loop", "C": "They both exit the loop", "D": "They both skip to the next iteration"}', 'A', 'break terminates the loop entirely and moves to the code after the loop. continue skips the remaining code in the current iteration and jumps to the next iteration. For example, in a loop processing numbers, continue might skip negative numbers while break might stop processing entirely when encountering an error.', 2, 'easy'),

('55555555-5555-5555-5555-555555555555', 'A do...while loop always executes at least once, even if the condition is initially false.', 'true_false', '{"true": "True", "false": "False"}', 'true', 'This is true. Unlike while loops that check the condition before executing, do...while loops check the condition after execution. This guarantees the code block runs at least once. This is useful for scenarios like menu systems where you want to display options at least once before checking if the user wants to continue.', 3, 'medium'),

('55555555-5555-5555-5555-555555555555', 'What will this code output: for (let i = 0; i < 3; i++) { console.log(i); }', 'multiple_choice', '{"A": "0 1 2 3", "B": "1 2 3", "C": "0 1 2", "D": "0 0 0"}', 'C', 'This outputs 0, 1, 2 (on separate lines). The loop starts with i = 0, continues while i < 3, and increments i after each iteration. When i becomes 3, the condition i < 3 is false, so the loop stops. The value 3 is never logged because the condition is checked before logging.', 4, 'medium'),

('55555555-5555-5555-5555-555555555555', 'Which method is the most modern and recommended way to iterate over array elements?', 'multiple_choice', '{"A": "for (let i = 0; i < arr.length; i++)", "B": "for...in loop", "C": "for...of loop or forEach()", "D": "while (i < arr.length)"}', 'C', 'Modern JavaScript prefers for...of or forEach() for array iteration. for...of provides clean syntax: for (const item of array) { }. forEach() is functional: array.forEach(item => { }). Traditional for loops work but are verbose. for...in is for object properties, not arrays (it can cause issues with arrays). These modern methods are more readable and less error-prone.', 5, 'hard'),

-- Lesson 6: Functions Basics (5 questions)
('66666666-6666-6666-6666-666666666666', 'What is the main purpose of functions in JavaScript?', 'multiple_choice', '{"A": "To store data permanently", "B": "To reuse code and organize logic", "C": "To style web pages", "D": "To create variables"}', 'B', 'Functions are reusable blocks of code that perform specific tasks. They help organize code, reduce repetition, and make programs more maintainable. Instead of writing the same code multiple times, you write it once in a function and call it whenever needed. Functions can also accept inputs (parameters) and return outputs (return values).', 1, 'easy'),

('66666666-6666-6666-6666-666666666666', 'What is the difference between parameters and arguments?', 'multiple_choice', '{"A": "There is no difference", "B": "Parameters are in the function definition, arguments are values passed when calling", "C": "Parameters are for arrow functions, arguments are for regular functions", "D": "Arguments are in the function definition, parameters are values passed when calling"}', 'B', 'Parameters are the placeholders in the function definition (function greet(name) { }), while arguments are the actual values passed when calling the function (greet("Alice")). In this example, name is the parameter and "Alice" is the argument. This distinction helps clarify function design and usage.', 2, 'medium'),

('66666666-6666-6666-6666-666666666666', 'Functions can return values using the return statement.', 'true_false', '{"true": "True", "false": "False"}', 'true', 'This is true. The return statement specifies what value a function should output. For example, function add(a, b) { return a + b; } returns the sum. Without a return statement, functions return undefined by default. The return statement also immediately exits the function, preventing any code after it from running.', 3, 'easy'),

('66666666-6666-6666-6666-666666666666', 'What happens when you call a function without providing all required arguments?', 'multiple_choice', '{"A": "JavaScript throws an error", "B": "The missing parameters are undefined", "C": "JavaScript uses 0 for missing numbers", "D": "The function refuses to run"}', 'B', 'JavaScript assigns undefined to parameters that don''t receive arguments. For example, calling function greet(name, greeting) { } as greet("Alice") makes greeting undefined. This can cause bugs, so you can use default parameters: function greet(name, greeting = "Hello") { } to provide fallback values for missing arguments.', 4, 'medium'),

('66666666-6666-6666-6666-666666666666', 'What is a function expression?', 'multiple_choice', '{"A": "A function without a name", "B": "A function assigned to a variable", "C": "A mathematical expression in a function", "D": "A function that returns an expression"}', 'B', 'A function expression assigns a function to a variable: const greet = function(name) { }. Unlike function declarations (function greet(name) { }), function expressions are not hoisted and can be anonymous. Arrow functions (const greet = (name) => { }) are a modern, concise form of function expressions introduced in ES6.', 5, 'hard'),

-- Lesson 7: Arrays and Array Methods (5 questions)
('77777777-7777-7777-7777-777777777777', 'How do you access the first element of an array in JavaScript?', 'multiple_choice', '{"A": "array[1]", "B": "array[0]", "C": "array.first()", "D": "array.get(0)"}', 'B', 'Arrays use zero-based indexing, meaning the first element is at index 0. So array[0] accesses the first element. array[1] would be the second element. JavaScript doesn''t have array.first() or array.get() methods by default. To get the last element, you can use array[array.length - 1] or the modern array.at(-1).', 1, 'easy'),

('77777777-7777-7777-7777-777777777777', 'Which method adds elements to the end of an array?', 'multiple_choice', '{"A": "unshift()", "B": "push()", "C": "pop()", "D": "shift()"}', 'B', 'push() adds one or more elements to the end of an array and returns the new length. unshift() adds to the beginning. pop() removes from the end. shift() removes from the beginning. Example: let arr = [1, 2]; arr.push(3) makes arr become [1, 2, 3]. These methods modify the original array (mutation).', 2, 'easy'),

('77777777-7777-7777-7777-777777777777', 'The map() method modifies the original array.', 'true_false', '{"true": "True", "false": "False"}', 'false', 'This is false. map() creates and returns a new array with transformed elements, leaving the original array unchanged. This is a key principle of functional programming - immutability. For example: let doubled = numbers.map(n => n * 2) creates a new array without changing numbers. Methods like push(), pop(), and splice() do modify the original array.', 3, 'medium'),

('77777777-7777-7777-7777-777777777777', 'What does the filter() method return?', 'multiple_choice', '{"A": "The first matching element", "B": "A new array with elements that pass a test", "C": "True or false based on the condition", "D": "The count of matching elements"}', 'B', 'filter() returns a new array containing only elements that pass the test function. For example: let evens = [1,2,3,4].filter(n => n % 2 === 0) returns [2, 4]. It doesn''t modify the original array. To get just the first match, use find(). To get a boolean, use some() or every(). To get a count, combine filter() with .length.', 4, 'medium'),

('77777777-7777-7777-7777-777777777777', 'Which method is best for transforming every element in an array to a new value?', 'multiple_choice', '{"A": "forEach()", "B": "filter()", "C": "map()", "D": "reduce()"}', 'C', 'map() is specifically designed to transform each element and return a new array with the transformed values. forEach() iterates but doesn''t return anything. filter() selects elements but doesn''t transform them. reduce() can transform arrays but is more complex and typically used for aggregation (like summing values). Use map() when you need a 1-to-1 transformation of array elements.', 5, 'hard'),

-- Lesson 8: Objects and Properties (5 questions)
('88888888-8888-8888-8888-888888888888', 'What is the correct way to access the property "name" of an object "user"?', 'multiple_choice', '{"A": "user->name", "B": "user.name or user[\"name\"]", "C": "user::name", "D": "user(name)"}', 'B', 'JavaScript offers two ways to access object properties: dot notation (user.name) and bracket notation (user["name"]). Dot notation is cleaner and preferred when property names are valid identifiers. Bracket notation is necessary when property names have spaces, start with numbers, or are stored in variables. user->name and user::name are syntax from other languages like PHP and C++.', 1, 'easy'),

('88888888-8888-8888-8888-888888888888', 'What does Object.keys() return?', 'multiple_choice', '{"A": "An array of an object\'s property values", "B": "An array of an object\'s property names", "C": "The number of properties in an object", "D": "A string of property names"}', 'B', 'Object.keys() returns an array containing all the enumerable property names (keys) of an object. For example, Object.keys({name: "Alice", age: 25}) returns ["name", "age"]. To get values, use Object.values(). To get both keys and values as pairs, use Object.entries(). These methods are essential for iterating over objects.', 2, 'medium'),

('88888888-8888-8888-8888-888888888888', 'Objects in JavaScript are passed by reference, not by value.', 'true_false', '{"true": "True", "false": "False"}', 'true', 'This is true. When you assign an object to another variable or pass it to a function, you''re copying the reference (memory address), not creating a new object. Changes to the object through any reference affect all references. Example: let a = {x: 1}; let b = a; b.x = 2; makes a.x also 2. To create independent copies, use spread operator {...obj} or Object.assign().', 3, 'medium'),

('88888888-8888-8888-8888-888888888888', 'What is the purpose of object destructuring?', 'multiple_choice', '{"A": "To delete properties from objects", "B": "To extract properties into individual variables", "C": "To combine multiple objects into one", "D": "To sort object properties"}', 'B', 'Destructuring extracts object properties into individual variables with concise syntax. Instead of let name = user.name; let age = user.age;, you write let {name, age} = user;. This is especially useful in function parameters: function greet({name, age}) { } automatically extracts these properties. You can also provide default values and rename variables during destructuring.', 4, 'easy'),

('88888888-8888-8888-8888-888888888888', 'What will this code output: console.log({} === {})?', 'multiple_choice', '{"A": "true", "B": "false", "C": "undefined", "D": "Error"}', 'B', 'This outputs false because {} === {} compares two different object references, not their contents. Each {} creates a new object in memory, so they have different references even though they look identical. The === operator checks if both sides refer to the exact same object in memory. To compare object contents, you need to compare properties individually or use a deep equality library like Lodash''s isEqual().', 5, 'hard'),

-- Lesson 9: String Methods and Template Literals (5 questions)
('99999999-9999-9999-9999-999999999999', 'What character is used to create template literals in JavaScript?', 'multiple_choice', '{"A": "Single quotes ('')", "B": "Double quotes (\"\")", "C": "Backticks (``)", "D": "Parentheses (())"}', 'C', 'Template literals use backticks (``) and enable string interpolation with ${} syntax. For example: `Hello, ${name}!` inserts the value of name. Template literals also support multi-line strings without \n. Single and double quotes create regular strings that don''t support interpolation or easy multi-line formatting.', 1, 'easy'),

('99999999-9999-9999-9999-999999999999', 'Which method returns a portion of a string without modifying the original?', 'multiple_choice', '{"A": "splice()", "B": "split()", "C": "slice()", "D": "replace()"}', 'C', 'slice() extracts a section of a string and returns it as a new string without modifying the original. Example: "Hello".slice(1, 4) returns "ell". splice() is for arrays, not strings. split() converts a string to an array. replace() returns a new string with replacements. Remember: strings are immutable in JavaScript - no method modifies the original string.', 2, 'medium'),

('99999999-9999-9999-9999-999999999999', 'String methods in JavaScript modify the original string.', 'true_false', '{"true": "True", "false": "False"}', 'false', 'This is false. Strings are immutable in JavaScript, meaning they cannot be changed after creation. All string methods return new strings without modifying the original. For example: let str = "hello"; str.toUpperCase() returns "HELLO" but str remains "hello". To "modify" a string, you must reassign: str = str.toUpperCase().', 3, 'easy'),

('99999999-9999-9999-9999-999999999999', 'What does the trim() method do?', 'multiple_choice', '{"A": "Removes all spaces from a string", "B": "Removes whitespace from both ends of a string", "C": "Reduces a string to a specific length", "D": "Removes duplicate characters"}', 'B', 'trim() removes whitespace (spaces, tabs, newlines) from the beginning and end of a string, not from the middle. For example: "  hello  ".trim() returns "hello". This is useful for cleaning user input. To remove all spaces including middle ones, use replace(/\\s/g, ""). Related methods: trimStart() removes only leading whitespace, trimEnd() removes only trailing whitespace.', 4, 'medium'),

('99999999-9999-9999-9999-999999999999', 'What is the best way to check if a string contains a specific substring in modern JavaScript?', 'multiple_choice', '{"A": "indexOf() !== -1", "B": "includes()", "C": "match()", "D": "search()"}', 'B', 'includes() is the modern, readable method for checking if a string contains a substring. It returns a boolean: "hello world".includes("world") returns true. While indexOf() !== -1 works (legacy approach), includes() is more explicit and readable. match() and search() are for regular expressions and more complex pattern matching, making them overkill for simple substring checks.', 5, 'hard'),

-- Lesson 10: Scope and Hoisting (5 questions)
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'What is the scope of a variable declared with let inside a block?', 'multiple_choice', '{"A": "Global scope", "B": "Function scope", "C": "Block scope", "D": "Module scope"}', 'C', 'Variables declared with let have block scope, meaning they only exist within the nearest enclosing block (between { }). For example, if (true) { let x = 5; } - x is not accessible outside this block. This is different from var, which has function scope. Block scoping helps prevent bugs by limiting variable visibility and preventing accidental reuse of variable names.', 1, 'easy'),

('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'What is hoisting in JavaScript?', 'multiple_choice', '{"A": "Moving variables to the top of the file", "B": "The behavior where declarations are moved to the top of their scope during compilation", "C": "A method to optimize code performance", "D": "A way to export variables between files"}', 'B', 'Hoisting is JavaScript''s behavior of moving variable and function declarations to the top of their containing scope during the compilation phase. However, only declarations are hoisted, not initializations. For example, console.log(x); var x = 5; doesn''t throw an error - x is hoisted but undefined until the assignment. Function declarations are fully hoisted (both name and body), while let and const are hoisted but in a "temporal dead zone" until their declaration line.', 2, 'easy'),

('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Variables declared with var are hoisted and initialized with undefined.', 'true_false', '{"true": "True", "false": "False"}', 'true', 'This is true. When var declarations are hoisted, they''re initialized with undefined. This is why you can reference a var variable before its declaration line without getting a ReferenceError (though it will be undefined). For example: console.log(x); var x = 5; logs undefined. In contrast, let and const are hoisted but remain uninitialized in the temporal dead zone, causing ReferenceErrors if accessed before declaration.', 3, 'medium'),

('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'What happens when you try to access a let variable before its declaration?', 'multiple_choice', '{"A": "It returns undefined", "B": "It returns null", "C": "It throws a ReferenceError", "D": "It returns 0"}', 'C', 'Attempting to access a let or const variable before its declaration line throws a ReferenceError due to the temporal dead zone (TDZ). The TDZ is the period between entering scope and the actual declaration. For example: console.log(x); let x = 5; throws "ReferenceError: Cannot access ''x'' before initialization". This is a safeguard against the confusing behavior of var hoisting and helps catch bugs early.', 4, 'medium'),

('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Which statement best describes the difference between lexical scope and dynamic scope?', 'multiple_choice', '{"A": "Lexical scope is determined by code structure, dynamic scope by call stack", "B": "Lexical scope is for variables, dynamic scope is for functions", "C": "They are the same thing with different names", "D": "Lexical scope is faster than dynamic scope"}', 'A', 'JavaScript uses lexical (static) scoping, where variable scope is determined by where functions and blocks are written in the code, not where they''re called from. This means nested functions have access to variables in their outer scopes based on code structure. Dynamic scoping (not used in JavaScript) would determine scope based on the call stack - who called the function. Lexical scoping is more predictable and easier to reason about.', 5, 'hard'),

-- Lesson 11: Arrow Functions and Callbacks (5 questions)
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'What is the main syntax difference between arrow functions and regular functions?', 'multiple_choice', '{"A": "Arrow functions use => instead of function keyword", "B": "Arrow functions can''t have parameters", "C": "Arrow functions always return values", "D": "Arrow functions are faster"}', 'A', 'Arrow functions use the => syntax instead of the function keyword, providing a more concise syntax. For example: const add = (a, b) => a + b; versus function add(a, b) { return a + b; }. When the function body is a single expression, arrow functions have implicit return (no return keyword needed). They can also omit parentheses when there''s exactly one parameter: const double = x => x * 2.', 1, 'easy'),

('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'How does this binding differ between arrow functions and regular functions?', 'multiple_choice', '{"A": "Arrow functions create their own this binding", "B": "Arrow functions inherit this from the enclosing scope", "C": "There is no difference", "D": "Arrow functions always have this as undefined"}', 'B', 'Arrow functions don''t have their own this binding - they lexically inherit this from the enclosing scope. This is particularly useful in callbacks and event handlers where you want to preserve the outer this. Regular functions create their own this based on how they''re called. For example, in object methods, arrow functions won''t work as expected because they don''t bind to the object - they keep the this from where they were defined.', 2, 'hard'),

('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Arrow functions can be used as constructors with the new keyword.', 'true_false', '{"true": "True", "false": "False"}', 'false', 'This is false. Arrow functions cannot be used as constructors and will throw a TypeError if you try to use them with new. They don''t have a prototype property and don''t create their own this binding, which are both essential for constructors. If you need a constructor, use regular function declarations or the class syntax. Arrow functions are designed for concise function expressions, not object construction.', 3, 'easy'),

('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'What is a callback function?', 'multiple_choice', '{"A": "A function that calls itself recursively", "B": "A function passed as an argument to be executed later", "C": "A function that returns another function", "D": "A function that can only be called once"}', 'B', 'A callback is a function passed as an argument to another function, to be executed at a later time or after a specific event. Callbacks are fundamental to asynchronous JavaScript and higher-order functions. Examples: setTimeout(callback, 1000), array.map(callback), button.addEventListener(''click'', callback). Callbacks enable flexible, reusable code where the calling function controls when and how the callback executes.', 4, 'easy'),

('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Which scenario is NOT a good use case for arrow functions?', 'multiple_choice', '{"A": "Array methods like map, filter, reduce", "B": "Object methods that need to access this", "C": "Simple inline callbacks", "D": "Functions that don''t need their own this"}', 'B', 'Arrow functions are NOT suitable for object methods that need to access the object via this, because arrow functions don''t bind their own this. For example: const obj = { count: 0, increment: () => { this.count++; } } won''t work as expected - this won''t refer to obj. Use regular function syntax for object methods. Arrow functions excel in callbacks, array methods, and any scenario where you want to preserve the outer this context.', 5, 'medium'),

-- Lesson 12: DOM Manipulation Basics (5 questions)
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Which method is the modern way to select a single element by CSS selector?', 'multiple_choice', '{"A": "getElementById()", "B": "getElementsByClassName()", "C": "querySelector()", "D": "querySelectorAll()"}', 'C', 'querySelector() is the modern, flexible method for selecting a single element using any CSS selector. For example: document.querySelector(''.my-class''), document.querySelector(''#myId''), or document.querySelector(''div > p''). It returns the first matching element or null. While getElementById() works for IDs, querySelector() handles any CSS selector, making it more versatile. querySelectorAll() returns all matches, not just the first.', 1, 'easy'),

('cccccccc-cccc-cccc-cccc-cccccccccccc', 'What is the difference between textContent and innerHTML?', 'multiple_choice', '{"A": "They are exactly the same", "B": "textContent gets/sets text only, innerHTML gets/sets HTML markup", "C": "innerHTML is faster than textContent", "D": "textContent works on all elements, innerHTML only on divs"}', 'B', 'textContent gets or sets the text content of an element, treating everything as plain text. innerHTML gets or sets HTML markup, parsing it as HTML. For example, element.innerHTML = "<strong>Hi</strong>" creates bold text, while element.textContent = "<strong>Hi</strong>" displays the literal text with angle brackets. Use textContent for security (prevents XSS attacks) when dealing with user input, and innerHTML only when you need to insert HTML markup.', 2, 'medium'),

('cccccccc-cccc-cccc-cccc-cccccccccccc', 'querySelector() returns a live HTMLCollection that updates automatically when the DOM changes.', 'true_false', '{"true": "True", "false": "False"}', 'false', 'This is false. querySelector() and querySelectorAll() return static NodeLists, not live collections. They capture elements at the moment of the query and don''t update if the DOM changes. In contrast, methods like getElementsByClassName() and getElementsByTagName() return live HTMLCollections that automatically reflect DOM changes. Static NodeLists are generally safer and more predictable, though live collections can be useful when you need automatic updates.', 3, 'medium'),

('cccccccc-cccc-cccc-cccc-cccccccccccc', 'How do you add a CSS class to an element using JavaScript?', 'multiple_choice', '{"A": "element.class = \"my-class\"", "B": "element.addClass(\"my-class\")", "C": "element.classList.add(\"my-class\")", "D": "element.className.push(\"my-class\")"}', 'C', 'Use element.classList.add("my-class") to add a class. The classList API provides methods like add(), remove(), toggle(), and contains() for managing classes. This is better than manipulating className directly (which is a string) because classList handles multiple classes cleanly. For example: element.classList.add("active", "highlighted") adds both classes. classList.toggle("active") adds the class if absent, removes it if present.', 4, 'easy'),

('cccccccc-cccc-cccc-cccc-cccccccccccc', 'What is the safest way to create and insert new elements into the DOM?', 'multiple_choice', '{"A": "Using innerHTML with user input directly", "B": "Using document.write()", "C": "Using createElement() and appendChild()", "D": "Using eval() with HTML strings"}', 'C', 'createElement() combined with appendChild() or append() is the safest way to add elements. This approach: const div = document.createElement("div"); div.textContent = userInput; parent.appendChild(div); prevents XSS attacks because textContent escapes HTML. innerHTML with user input is dangerous as it can execute scripts. document.write() is obsolete and overwrites the page. eval() with HTML is extremely dangerous. Modern alternatives include append() which is more flexible than appendChild().', 5, 'hard'),

-- Lesson 13: Events and Event Handling (5 questions)
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'What method is used to attach an event listener to an element?', 'multiple_choice', '{"A": "element.onClick()", "B": "element.attachEvent()", "C": "element.addEventListener()", "D": "element.on()"}', 'C', 'addEventListener() is the standard method for attaching event listeners: element.addEventListener("click", callback). It allows multiple listeners for the same event, supports event capture/bubbling, and can be removed with removeEventListener(). While onclick attribute works, it only allows one handler and doesn''t support advanced options. attachEvent() was an old IE method. on() is jQuery syntax, not native JavaScript.', 1, 'easy'),

('dddddddd-dddd-dddd-dddd-dddddddddddd', 'What is event bubbling?', 'multiple_choice', '{"A": "When events are canceled", "B": "When events propagate from the target element up through its ancestors", "C": "When multiple events fire simultaneously", "D": "When events are queued for later execution"}', 'B', 'Event bubbling is the propagation phase where an event travels from the target element up through its ancestors in the DOM tree. For example, clicking a button inside a div triggers the button''s click handler first, then the div''s, then the body''s, etc. This enables event delegation - attaching one listener to a parent to handle events from multiple children. Use event.stopPropagation() to prevent bubbling if needed.', 2, 'medium'),

('dddddddd-dddd-dddd-dddd-dddddddddddd', 'The preventDefault() method stops event propagation through the DOM.', 'true_false', '{"true": "True", "false": "False"}', 'false', 'This is false. preventDefault() prevents the browser''s default action for an event (like following a link or submitting a form), but it doesn''t stop propagation. To stop propagation (prevent bubbling/capturing), use stopPropagation(). To do both, use stopImmediatePropagation(). For example, in a form submit handler, event.preventDefault() prevents form submission, but the event still bubbles up unless you also call stopPropagation().', 3, 'medium'),

('dddddddd-dddd-dddd-dddd-dddddddddddd', 'What information does the event object provide?', 'multiple_choice', '{"A": "Only the event type", "B": "Details about the event including target, coordinates, and keys pressed", "C": "Just the element that was clicked", "D": "Only the timestamp"}', 'B', 'The event object contains comprehensive information about the event: event.type (event name), event.target (element that triggered it), event.currentTarget (element with the listener), mouse coordinates (clientX, clientY), keyboard keys (key, keyCode), and methods like preventDefault() and stopPropagation(). Different event types provide specific properties - MouseEvent has button info, KeyboardEvent has key info, etc. This object is automatically passed to event handlers as the first parameter.', 4, 'easy'),

('dddddddd-dddd-dddd-dddd-dddddddddddd', 'What is event delegation and why is it useful?', 'multiple_choice', '{"A": "Delegating events to other developers", "B": "Attaching one listener to a parent to handle events from multiple children", "C": "Automatically copying events between elements", "D": "Scheduling events for future execution"}', 'B', 'Event delegation attaches a single event listener to a parent element to handle events from multiple children, leveraging event bubbling. Instead of adding listeners to 100 list items, add one to the ul and check event.target. Benefits: better performance, works with dynamically added elements, less memory usage. Example: ul.addEventListener("click", e => { if (e.target.matches("li")) { /* handle */ } }). This pattern is essential for efficient event handling in dynamic interfaces.', 5, 'hard'),

-- Lesson 14: Array Advanced Methods (5 questions)
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'What does the reduce() method return?', 'multiple_choice', '{"A": "A new array with transformed elements", "B": "A single accumulated value", "C": "A boolean indicating if conditions are met", "D": "The first matching element"}', 'B', 'reduce() accumulates array elements into a single value by applying a reducer function. For example: [1,2,3,4].reduce((sum, n) => sum + n, 0) returns 10. The second argument (0) is the initial value. reduce() is powerful for summing, flattening arrays, grouping data, and complex transformations. Unlike map() which returns an array, reduce() returns whatever type you accumulate - number, string, object, or even array.', 1, 'medium'),

('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'What is the difference between find() and filter()?', 'multiple_choice', '{"A": "find() returns the first match, filter() returns all matches", "B": "find() is for objects, filter() is for arrays", "C": "They do the same thing", "D": "find() returns an array, filter() returns a single item"}', 'A', 'find() returns the first element that passes the test function, or undefined if none match: [1,2,3,4].find(n => n > 2) returns 3. filter() returns a new array with all matching elements: [1,2,3,4].filter(n => n > 2) returns [3, 4]. Use find() when you need just one item (like finding a user by ID), filter() when you need all matches (like all active users). findIndex() is similar to find() but returns the index instead.', 2, 'easy'),

('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'The some() method returns true if at least one element passes the test.', 'true_false', '{"true": "True", "false": "False"}', 'true', 'This is true. some() returns true if at least one element satisfies the test function, false otherwise. For example: [1,2,3,4].some(n => n > 3) returns true because 4 passes the test. It stops checking once it finds a match (short-circuits), making it efficient. The opposite is every(), which requires all elements to pass. Use some() to check "does any element meet this condition?" instead of filter().length > 0 for better performance and clarity.', 3, 'easy'),

('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'How does the sort() method affect the original array?', 'multiple_choice', '{"A": "It doesn''t modify the original array", "B": "It creates a sorted copy and modifies the original", "C": "It sorts the original array in place", "D": "It only works on copies"}', 'C', 'sort() modifies the original array in place and also returns a reference to it. For example: let arr = [3,1,2]; arr.sort() changes arr to [1,2,3]. By default, sort() converts elements to strings and sorts lexicographically, so [10, 2, 5].sort() gives [10, 2, 5] not [2, 5, 10]. For numeric sorting, provide a comparator: arr.sort((a, b) => a - b). To avoid mutation, copy first: [...arr].sort() or arr.slice().sort().', 4, 'medium'),

('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'What is the most efficient way to check if all elements in an array satisfy a condition?', 'multiple_choice', '{"A": "filter().length === array.length", "B": "every()", "C": "reduce() with boolean accumulator", "D": "Loop with break"}', 'B', 'every() is the most efficient and readable method: [2,4,6].every(n => n % 2 === 0) returns true. It short-circuits (stops checking) as soon as it finds a false case, making it more efficient than filter().length === array.length, which checks every element. reduce() works but is unnecessarily complex. Manual loops with break work but are verbose. every() clearly expresses intent and leverages built-in optimizations.', 5, 'hard'),

-- Lesson 15: ES6+ Features (5 questions)
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'What is the spread operator used for?', 'multiple_choice', '{"A": "To multiply numbers", "B": "To expand iterables into individual elements", "C": "To create loops", "D": "To declare variables"}', 'B', 'The spread operator (...) expands iterables (arrays, strings, objects) into individual elements. Common uses: array copying ([...arr]), array concatenation ([...arr1, ...arr2]), passing array elements as function arguments (Math.max(...numbers)), and object cloning ({...obj}). It''s called "spread" because it spreads out the elements. For example, [1, ...[2, 3], 4] produces [1, 2, 3, 4]. Essential for immutable updates in React and functional programming.', 1, 'easy'),

('ffffffff-ffff-ffff-ffff-ffffffffffff', 'What is destructuring assignment?', 'multiple_choice', '{"A": "Deleting object properties", "B": "Extracting values from arrays/objects into variables", "C": "Breaking arrays into smaller pieces", "D": "Converting objects to arrays"}', 'B', 'Destructuring extracts values from arrays or objects into variables with concise syntax. Array destructuring: const [a, b] = [1, 2] assigns a=1, b=2. Object destructuring: const {name, age} = user extracts these properties. You can provide defaults: const {name = "Anonymous"} = user, skip items: const [a, , c] = [1, 2, 3], rename: const {name: userName} = user, and use rest: const {a, ...rest} = obj. This makes working with complex data structures much cleaner.', 2, 'medium'),

('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Default parameters are only used when the argument is undefined, not when it is null.', 'true_false', '{"true": "True", "false": "False"}', 'true', 'This is true. Default parameters only apply when an argument is undefined or not provided. If you explicitly pass null, the default is not used. For example: function greet(name = "Guest") { } - greet() and greet(undefined) use "Guest", but greet(null) uses null. This distinction is important for API design. If you want to treat null like undefined, you need explicit checks: function greet(name) { name = name ?? "Guest"; }.', 3, 'hard'),

('ffffffff-ffff-ffff-ffff-ffffffffffff', 'What does the rest parameter (...args) do in function parameters?', 'multiple_choice', '{"A": "Pauses function execution", "B": "Collects remaining arguments into an array", "C": "Spreads an array into arguments", "D": "Creates optional parameters"}', 'B', 'The rest parameter (...args) collects all remaining arguments into an array. For example: function sum(...numbers) { } can accept any number of arguments, accessible as the numbers array inside the function. It must be the last parameter. This replaces the old arguments object with a cleaner, true array. Example: sum(1, 2, 3) makes numbers equal [1, 2, 3]. Don''t confuse with spread operator - rest collects, spread expands.', 4, 'easy'),

('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Which ES6+ feature allows you to define object properties using variable names dynamically?', 'multiple_choice', '{"A": "Object spread", "B": "Computed property names", "C": "Object destructuring", "D": "Property shorthand"}', 'B', 'Computed property names use [] to dynamically compute property names: const key = "name"; const obj = { [key]: "Alice" } creates {name: "Alice"}. This is powerful for dynamic object creation: { [variable + "_count"]: 10 }, or using constants: { [Symbol.iterator]: function*() {} }. Property shorthand (const {name} when name variable exists) is different. Object spread copies properties. Destructuring extracts properties. Computed property names are essential for dynamic, data-driven object construction.', 5, 'hard'),

-- Lesson 16: Asynchronous JavaScript Basics (5 questions)
('b0b0b0b0-b0b0-b0b0-b0b0-b0b0b0b0b0b0', 'What is the purpose of the async keyword?', 'multiple_choice', '{"A": "To make functions run faster", "B": "To make a function return a Promise", "C": "To pause function execution", "D": "To run functions in parallel"}', 'B', 'The async keyword makes a function return a Promise automatically. For example: async function getData() { return "data"; } returns a Promise that resolves to "data". This enables using await inside the function. async functions always return Promises - if you return a non-Promise value, it''s wrapped in Promise.resolve(). This is the foundation of modern asynchronous JavaScript, making async code look synchronous and easier to read.', 1, 'easy'),

('b0b0b0b0-b0b0-b0b0-b0b0-b0b0b0b0b0b0', 'What does the await keyword do?', 'multiple_choice', '{"A": "Waits for a specified number of milliseconds", "B": "Pauses execution until a Promise resolves", "C": "Creates a new Promise", "D": "Cancels a pending Promise"}', 'B', 'await pauses async function execution until a Promise resolves, then returns the resolved value. For example: const data = await fetch(url) waits for the fetch to complete. await can only be used inside async functions (or top-level in modules). If the Promise rejects, await throws the error, which you can catch with try/catch. This makes asynchronous code read like synchronous code, avoiding callback hell and .then() chains.', 2, 'easy'),

('b0b0b0b0-b0b0-b0b0-b0b0-b0b0b0b0b0b0', 'Promises can only be in one of three states: pending, fulfilled, or rejected.', 'true_false', '{"true": "True", "false": "False"}', 'true', 'This is true. A Promise starts in the pending state, then transitions to either fulfilled (resolved successfully with a value) or rejected (failed with an error). Once settled (fulfilled or rejected), a Promise cannot change state - it''s immutable. This state model ensures predictable asynchronous behavior. You handle fulfilled with .then() or await, and rejected with .catch() or try/catch with await.', 3, 'easy'),

('b0b0b0b0-b0b0-b0b0-b0b0-b0b0b0b0b0b0', 'What happens if you don''t handle a rejected Promise?', 'multiple_choice', '{"A": "JavaScript ignores the error", "B": "The program crashes immediately", "C": "An unhandled Promise rejection warning occurs", "D": "The Promise automatically retries"}', 'C', 'Unhandled Promise rejections trigger warnings in the console and fire the unhandledrejection event. Modern Node.js versions crash the process by default. Always handle Promise rejections with .catch(), try/catch with await, or return the Promise to the caller. Unhandled rejections are common sources of bugs - your code continues running but errors are silently lost. In production, monitor unhandledrejection events to catch these issues.', 4, 'medium'),

('b0b0b0b0-b0b0-b0b0-b0b0-b0b0b0b0b0b0', 'How do you run multiple async operations in parallel?', 'multiple_choice', '{"A": "await each operation sequentially", "B": "Use Promise.all() with an array of Promises", "C": "Use multiple async keywords", "D": "Use setTimeout with each operation"}', 'B', 'Promise.all() runs multiple Promises in parallel and waits for all to complete: const results = await Promise.all([fetch(url1), fetch(url2), fetch(url3)]) runs all three fetches simultaneously. This is much faster than sequential await calls. Promise.all() rejects if any Promise rejects. For partial success, use Promise.allSettled() which waits for all Promises regardless of outcome. For the first to complete, use Promise.race().', 5, 'hard'),

-- Lesson 17: Error Handling (5 questions)
('b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b1', 'What is the purpose of the try...catch statement?', 'multiple_choice', '{"A": "To make code run faster", "B": "To handle runtime errors gracefully", "C": "To test code before execution", "D": "To create custom errors"}', 'B', 'try...catch handles runtime errors, preventing them from crashing your program. Code in the try block executes normally; if an error occurs, execution jumps to the catch block where you can handle it gracefully. For example: try { JSON.parse(invalidJSON); } catch (error) { console.log("Parse failed:", error.message); }. This is essential for robust applications that can recover from errors or provide useful error messages to users.', 1, 'easy'),

('b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b1', 'What does the finally block do in try...catch...finally?', 'multiple_choice', '{"A": "Catches errors that try...catch missed", "B": "Executes only if no errors occur", "C": "Executes regardless of whether an error occurred", "D": "Retries the code in the try block"}', 'C', 'The finally block executes regardless of whether the try block succeeds or throws an error, and regardless of whether catch handles it. This is perfect for cleanup operations like closing files, removing loading spinners, or releasing resources. For example: try { loadData(); } catch (e) { handleError(e); } finally { hideSpinner(); }. The finally block runs even if catch throws or returns - it''s guaranteed execution.', 2, 'medium'),

('b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b1', 'You can create custom error types by extending the Error class.', 'true_false', '{"true": "True", "false": "False"}', 'true', 'This is true. Creating custom error types helps categorize errors for better handling. Example: class ValidationError extends Error { constructor(message) { super(message); this.name = "ValidationError"; } }. You can then throw new ValidationError("Invalid email") and catch specifically: catch (error) { if (error instanceof ValidationError) { } }. Custom errors can include additional properties and methods, making error handling more sophisticated and maintainable in large applications.', 3, 'medium'),

('b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b1', 'How do you handle errors in async/await code?', 'multiple_choice', '{"A": "Use .catch() after await", "B": "Wrap await in try...catch", "C": "Use error callbacks", "D": "Errors cannot be handled with async/await"}', 'B', 'Use try...catch to handle errors with async/await: try { const data = await fetchData(); } catch (error) { console.error(error); }. If the Promise rejects, await throws the error which catch handles. This makes async error handling look like synchronous error handling. You can also use .catch() on the Promise before awaiting, but try...catch is more readable. Always handle async errors - unhandled Promise rejections cause warnings.', 4, 'easy'),

('b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b1', 'What is the best practice for error messages in production applications?', 'multiple_choice', '{"A": "Show detailed stack traces to users", "B": "Display generic messages to users, log details for developers", "C": "Hide all errors from users", "D": "Show error messages only in console"}', 'B', 'Best practice: show user-friendly, generic messages to users ("Something went wrong. Please try again."), while logging detailed error information for developers (stack traces, context, user actions). Never expose sensitive information like database queries, file paths, or API keys in error messages. Use error monitoring services (Sentry, LogRocket) to collect detailed errors. Different error types might need different handling - validation errors can show specifics, system errors should not.', 5, 'hard'),

-- Lesson 18: Modern JavaScript Practices (5 questions)
('b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 'What is the main benefit of using const by default for variable declarations?', 'multiple_choice', '{"A": "Better performance", "B": "Prevents accidental reassignment and makes code more predictable", "C": "Required by modern browsers", "D": "Allows variables to be used before declaration"}', 'B', 'Using const by default prevents accidental reassignment, making code more predictable and easier to reason about. If a variable needs reassignment, you must consciously choose let, which signals mutability. This practice catches bugs where you accidentally overwrite a variable. Note that const prevents reassignment, not mutation - const objects and arrays can still be modified. Only use let when reassignment is genuinely needed. Avoid var entirely in modern JavaScript.', 1, 'easy'),

('b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 'What is optional chaining (?.) used for?', 'multiple_choice', '{"A": "To make properties optional in objects", "B": "To safely access nested properties that might not exist", "C": "To chain multiple functions", "D": "To create conditional loops"}', 'B', 'Optional chaining (?.) safely accesses nested properties without throwing errors if intermediate values are null or undefined. For example: user?.address?.street returns undefined if user or address don''t exist, instead of throwing "Cannot read property ''address'' of undefined". This replaces verbose checks: user && user.address && user.address.street. Works with functions too: obj.method?.(). This makes code cleaner and prevents null reference errors.', 2, 'medium'),

('b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 'The nullish coalescing operator (??) returns the right operand only when the left is null or undefined, not for other falsy values.', 'true_false', '{"true": "True", "false": "False"}', 'true', 'This is true. The ?? operator only treats null and undefined as nullish, unlike || which treats all falsy values (0, "", false, null, undefined, NaN) as falsy. For example: 0 ?? 10 returns 0 (not 10), while 0 || 10 returns 10. This is important when 0, "", or false are valid values. Use ?? for providing default values when you want to preserve falsy values except null/undefined: const count = userInput ?? 0.', 3, 'hard'),

('b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 'What is the purpose of modules in JavaScript?', 'multiple_choice', '{"A": "To make files smaller", "B": "To organize code into reusable, encapsulated units", "C": "To improve performance", "D": "To enable async operations"}', 'B', 'Modules organize code into separate files with their own scope, preventing global namespace pollution. Each module exports specific values/functions (export const foo = 1), which other modules import (import { foo } from "./module"). Benefits: code organization, reusability, encapsulation, dependency management, and enabling tree-shaking (removing unused code). Modern JavaScript uses ES6 modules (import/export). Modules also execute in strict mode by default and have their own scope.', 4, 'easy'),

('b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 'Which approach best represents modern JavaScript functional programming principles?', 'multiple_choice', '{"A": "Mutating arrays and objects directly for performance", "B": "Using immutable data patterns with map, filter, reduce", "C": "Always using for loops instead of array methods", "D": "Avoiding function parameters"}', 'B', 'Modern JavaScript favors functional programming with immutable data: use map() instead of loops that mutate arrays, use {...obj, updated: true} instead of obj.updated = true, prefer filter() over splice(). Benefits: predictable code, easier testing, better debugging, enables time-travel debugging, works well with React and modern frameworks. Key principles: pure functions (no side effects), immutability, function composition. This doesn''t mean never mutate - balance immutability with performance, but default to immutable patterns.', 5, 'hard');

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Verify the data was inserted
DO $$
DECLARE
  path_count INTEGER;
  lesson_count INTEGER;
  question_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO path_count FROM ai_learning_paths WHERE id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
  SELECT COUNT(*) INTO lesson_count FROM ai_learning_lessons WHERE learning_path_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
  SELECT COUNT(*) INTO question_count FROM javascript_quiz_questions;

  RAISE NOTICE 'JavaScript Seed Data Summary:';
  RAISE NOTICE '  - Learning Paths: %', path_count;
  RAISE NOTICE '  - Lessons: %', lesson_count;
  RAISE NOTICE '  - Quiz Questions: %', question_count;

  IF path_count = 1 AND lesson_count = 18 AND question_count = 90 THEN
    RAISE NOTICE 'SUCCESS: All data seeded correctly!';
  ELSE
    RAISE WARNING 'Some data may not have been seeded correctly.';
  END IF;
END $$;
