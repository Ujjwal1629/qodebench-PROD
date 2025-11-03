-- Seed Coding Challenges for Full-Stack Interview System
-- 15 Challenges: 5 per Experience Level (Fresher, Junior, Senior)
-- Languages: JavaScript, TypeScript, React/Next.js

-- =====================================================
-- FRESHER LEVEL CHALLENGES (5)
-- =====================================================

-- Challenge 1: Reverse String (JavaScript)
INSERT INTO interview_coding_challenges (
  experience_level,
  language,
  title,
  description,
  starter_code,
  test_cases,
  time_limit_minutes,
  difficulty_score,
  tags
) VALUES (
  'fresher',
  'javascript',
  'Reverse a String',
  'Write a function that takes a string as input and returns the string reversed.

**Example:**
- Input: "hello"
- Output: "olleh"

**Constraints:**
- The input string will only contain lowercase letters, numbers, and spaces
- String length will be between 1 and 1000 characters',
  'function reverseString(str) {
  // Write your code here

}',
  '[
    {"input": "hello", "expected_output": "olleh", "is_hidden": false},
    {"input": "world", "expected_output": "dlrow", "is_hidden": false},
    {"input": "javascript", "expected_output": "tpircsavaj", "is_hidden": true},
    {"input": "a", "expected_output": "a", "is_hidden": true},
    {"input": "hello world", "expected_output": "dlrow olleh", "is_hidden": true}
  ]'::jsonb,
  30,
  3,
  ARRAY['strings', 'basics', 'arrays']
);

-- Challenge 2: Sum Array (JavaScript)
INSERT INTO interview_coding_challenges (
  experience_level,
  language,
  title,
  description,
  starter_code,
  test_cases,
  time_limit_minutes,
  difficulty_score,
  tags
) VALUES (
  'fresher',
  'javascript',
  'Sum of Array Elements',
  'Write a function that takes an array of numbers and returns their sum.

**Example:**
- Input: [1, 2, 3, 4, 5]
- Output: 15

**Constraints:**
- Array length will be between 1 and 100
- All numbers are integers',
  'function sumArray(numbers) {
  // Write your code here

}',
  '[
    {"input": [1, 2, 3, 4, 5], "expected_output": 15, "is_hidden": false},
    {"input": [10, 20, 30], "expected_output": 60, "is_hidden": false},
    {"input": [0], "expected_output": 0, "is_hidden": true},
    {"input": [-5, 5, 10], "expected_output": 10, "is_hidden": true},
    {"input": [100, 200, 300, 400], "expected_output": 1000, "is_hidden": true}
  ]'::jsonb,
  30,
  2,
  ARRAY['arrays', 'basics', 'math']
);

-- Challenge 3: Find Maximum (JavaScript)
INSERT INTO interview_coding_challenges (
  experience_level,
  language,
  title,
  description,
  starter_code,
  test_cases,
  time_limit_minutes,
  difficulty_score,
  tags
) VALUES (
  'fresher',
  'javascript',
  'Find Maximum Number',
  'Write a function that finds the maximum number in an array.

**Example:**
- Input: [3, 7, 2, 9, 1]
- Output: 9

**Constraints:**
- Array will contain at least 1 element
- All elements are integers',
  'function findMax(numbers) {
  // Write your code here

}',
  '[
    {"input": [3, 7, 2, 9, 1], "expected_output": 9, "is_hidden": false},
    {"input": [1], "expected_output": 1, "is_hidden": false},
    {"input": [-10, -5, -20], "expected_output": -5, "is_hidden": true},
    {"input": [100, 99, 101, 50], "expected_output": 101, "is_hidden": true},
    {"input": [5, 5, 5, 5], "expected_output": 5, "is_hidden": true}
  ]'::jsonb,
  30,
  3,
  ARRAY['arrays', 'basics', 'math']
);

-- Challenge 4: Simple Counter Component (React)
INSERT INTO interview_coding_challenges (
  experience_level,
  language,
  title,
  description,
  starter_code,
  test_cases,
  time_limit_minutes,
  difficulty_score,
  tags
) VALUES (
  'fresher',
  'react',
  'Counter Component',
  'Create a React component that displays a counter with increment and decrement buttons.

**Requirements:**
- Display the current count (start at 0)
- "Increment" button that adds 1 to count
- "Decrement" button that subtracts 1 from count
- Use React hooks (useState)

**Testing:**
Your component will be tested to ensure buttons work correctly.',
  'import React, { useState } from ''react'';

function Counter() {
  // Write your code here

  return (
    <div>
      {/* Your JSX here */}
    </div>
  );
}

export default Counter;',
  '[
    {"input": "Initial render", "expected_output": "count is 0", "is_hidden": false},
    {"input": "Click increment once", "expected_output": "count is 1", "is_hidden": false},
    {"input": "Click decrement once", "expected_output": "count is -1", "is_hidden": true},
    {"input": "Click increment 5 times", "expected_output": "count is 5", "is_hidden": true},
    {"input": "Mixed operations", "expected_output": "count updates correctly", "is_hidden": true}
  ]'::jsonb,
  30,
  4,
  ARRAY['react', 'hooks', 'useState', 'components']
);

-- Challenge 5: Filter Array (TypeScript)
INSERT INTO interview_coding_challenges (
  experience_level,
  language,
  title,
  description,
  starter_code,
  test_cases,
  time_limit_minutes,
  difficulty_score,
  tags
) VALUES (
  'fresher',
  'typescript',
  'Filter Even Numbers',
  'Write a TypeScript function that filters out odd numbers from an array and returns only even numbers.

**Example:**
- Input: [1, 2, 3, 4, 5, 6]
- Output: [2, 4, 6]

**Requirements:**
- Use proper TypeScript types
- Return a new array',
  'function filterEvenNumbers(numbers: number[]): number[] {
  // Write your code here

}

export default filterEvenNumbers;',
  '[
    {"input": [1, 2, 3, 4, 5, 6], "expected_output": [2, 4, 6], "is_hidden": false},
    {"input": [1, 3, 5], "expected_output": [], "is_hidden": false},
    {"input": [2, 4, 6, 8], "expected_output": [2, 4, 6, 8], "is_hidden": true},
    {"input": [], "expected_output": [], "is_hidden": true},
    {"input": [0, 1, 2], "expected_output": [0, 2], "is_hidden": true}
  ]'::jsonb,
  30,
  3,
  ARRAY['typescript', 'arrays', 'filter']
);

-- =====================================================
-- JUNIOR LEVEL CHALLENGES (5)
-- =====================================================

-- Challenge 6: Two Sum (JavaScript)
INSERT INTO interview_coding_challenges (
  experience_level,
  language,
  title,
  description,
  starter_code,
  test_cases,
  time_limit_minutes,
  difficulty_score,
  tags
) VALUES (
  'junior',
  'javascript',
  'Two Sum',
  'Given an array of integers and a target value, return the indices of two numbers that add up to the target.

**Example:**
- Input: nums = [2, 7, 11, 15], target = 9
- Output: [0, 1] (because nums[0] + nums[1] = 2 + 7 = 9)

**Constraints:**
- Each input has exactly one solution
- You cannot use the same element twice
- Optimize for time complexity (hint: use a hash map)',
  'function twoSum(nums, target) {
  // Write your code here

}',
  '[
    {"input": {"nums": [2, 7, 11, 15], "target": 9}, "expected_output": [0, 1], "is_hidden": false},
    {"input": {"nums": [3, 2, 4], "target": 6}, "expected_output": [1, 2], "is_hidden": false},
    {"input": {"nums": [3, 3], "target": 6}, "expected_output": [0, 1], "is_hidden": true},
    {"input": {"nums": [1, 5, 3, 7, 9], "target": 12}, "expected_output": [2, 4], "is_hidden": true},
    {"input": {"nums": [-1, -2, -3, -4, -5], "target": -8}, "expected_output": [2, 4], "is_hidden": true}
  ]'::jsonb,
  25,
  6,
  ARRAY['javascript', 'arrays', 'hash-map', 'algorithms']
);

-- Challenge 7: Fetch and Display Users (React)
INSERT INTO interview_coding_challenges (
  experience_level,
  language,
  title,
  description,
  starter_code,
  test_cases,
  time_limit_minutes,
  difficulty_score,
  tags
) VALUES (
  'junior',
  'react',
  'User List Component',
  'Create a React component that fetches and displays a list of users from an API.

**Requirements:**
- Fetch users from: https://jsonplaceholder.typicode.com/users
- Display loading state while fetching
- Display error state if fetch fails
- Display user names in a list
- Use useEffect and useState hooks

**API Response:** Array of user objects with name, email, etc.',
  'import React, { useState, useEffect } from ''react'';

function UserList() {
  // Write your code here

  return (
    <div>
      {/* Your JSX here */}
    </div>
  );
}

export default UserList;',
  '[
    {"input": "Component mounts", "expected_output": "Shows loading state", "is_hidden": false},
    {"input": "API call succeeds", "expected_output": "Displays 10 user names", "is_hidden": false},
    {"input": "API call fails", "expected_output": "Shows error message", "is_hidden": true},
    {"input": "Check useEffect cleanup", "expected_output": "No memory leaks", "is_hidden": true},
    {"input": "Verify user name rendering", "expected_output": "All names displayed correctly", "is_hidden": true}
  ]'::jsonb,
  25,
  6,
  ARRAY['react', 'hooks', 'useEffect', 'async', 'api']
);

-- Challenge 8: Palindrome Checker (TypeScript)
INSERT INTO interview_coding_challenges (
  experience_level,
  language,
  title,
  description,
  starter_code,
  test_cases,
  time_limit_minutes,
  difficulty_score,
  tags
) VALUES (
  'junior',
  'typescript',
  'Palindrome Checker',
  'Write a TypeScript function that checks if a string is a palindrome (reads the same forward and backward).

**Example:**
- Input: "racecar"
- Output: true

**Requirements:**
- Ignore case (treat "A" and "a" as same)
- Ignore spaces and special characters
- Use proper TypeScript types',
  'function isPalindrome(str: string): boolean {
  // Write your code here

}

export default isPalindrome;',
  '[
    {"input": "racecar", "expected_output": true, "is_hidden": false},
    {"input": "hello", "expected_output": false, "is_hidden": false},
    {"input": "A man a plan a canal Panama", "expected_output": true, "is_hidden": true},
    {"input": "race a car", "expected_output": false, "is_hidden": true},
    {"input": "", "expected_output": true, "is_hidden": true}
  ]'::jsonb,
  25,
  5,
  ARRAY['typescript', 'strings', 'algorithms']
);

-- Challenge 9: Debounce Function (JavaScript)
INSERT INTO interview_coding_challenges (
  experience_level,
  language,
  title,
  description,
  starter_code,
  test_cases,
  time_limit_minutes,
  difficulty_score,
  tags
) VALUES (
  'junior',
  'javascript',
  'Implement Debounce',
  'Implement a debounce function that delays invoking a function until after a specified wait time has elapsed since the last time it was invoked.

**Example:**
```javascript
const debouncedFn = debounce(() => console.log("Called"), 1000);
debouncedFn(); // Scheduled
debouncedFn(); // Previous cancelled, rescheduled
// After 1000ms, "Called" is logged once
```

**Requirements:**
- Return a debounced version of the function
- Clear previous timer when called again within wait time
- Execute after wait time has passed without new calls',
  'function debounce(func, wait) {
  // Write your code here

}',
  '[
    {"input": "Call once", "expected_output": "Executes after wait time", "is_hidden": false},
    {"input": "Multiple rapid calls", "expected_output": "Executes once after last call", "is_hidden": false},
    {"input": "Verify timer cleanup", "expected_output": "Previous timers cancelled", "is_hidden": true},
    {"input": "Test with arguments", "expected_output": "Function receives correct args", "is_hidden": true},
    {"input": "Edge case: zero wait", "expected_output": "Handles correctly", "is_hidden": true}
  ]'::jsonb,
  25,
  7,
  ARRAY['javascript', 'closures', 'timers', 'performance']
);

-- Challenge 10: Todo App with State (React)
INSERT INTO interview_coding_challenges (
  experience_level,
  language,
  title,
  description,
  starter_code,
  test_cases,
  time_limit_minutes,
  difficulty_score,
  tags
) VALUES (
  'junior',
  'react',
  'Todo List Component',
  'Create a todo list component with add, delete, and toggle functionality.

**Requirements:**
- Input field to add new todos
- Display list of todos
- Each todo has a checkbox to mark complete
- Delete button for each todo
- Use useState to manage state
- Use proper React patterns',
  'import React, { useState } from ''react'';

function TodoList() {
  // Write your code here

  return (
    <div>
      {/* Your JSX here */}
    </div>
  );
}

export default TodoList;',
  '[
    {"input": "Add todo", "expected_output": "Todo appears in list", "is_hidden": false},
    {"input": "Toggle complete", "expected_output": "Todo marked as complete", "is_hidden": false},
    {"input": "Delete todo", "expected_output": "Todo removed from list", "is_hidden": true},
    {"input": "Multiple operations", "expected_output": "State managed correctly", "is_hidden": true},
    {"input": "Empty input validation", "expected_output": "Does not add empty todos", "is_hidden": true}
  ]'::jsonb,
  25,
  6,
  ARRAY['react', 'state', 'forms', 'crud']
);

-- =====================================================
-- SENIOR LEVEL CHALLENGES (5)
-- =====================================================

-- Challenge 11: LRU Cache (TypeScript)
INSERT INTO interview_coding_challenges (
  experience_level,
  language,
  title,
  description,
  starter_code,
  test_cases,
  time_limit_minutes,
  difficulty_score,
  tags
) VALUES (
  'senior',
  'typescript',
  'LRU Cache Implementation',
  'Design and implement a data structure for Least Recently Used (LRU) cache.

**Requirements:**
- `get(key)`: Get the value of the key if exists, otherwise return -1
- `put(key, value)`: Set or insert the value. If cache is at capacity, evict the least recently used item
- Both operations must be O(1) average time complexity
- Use TypeScript with proper types

**Example:**
```typescript
const cache = new LRUCache(2); // capacity 2
cache.put(1, 1);
cache.put(2, 2);
cache.get(1);    // returns 1
cache.put(3, 3); // evicts key 2
cache.get(2);    // returns -1
```',
  'class LRUCache {
  private capacity: number;

  constructor(capacity: number) {
    this.capacity = capacity;
    // Write your code here
  }

  get(key: number): number {
    // Write your code here
  }

  put(key: number, value: number): void {
    // Write your code here
  }
}

export default LRUCache;',
  '[
    {"input": "Basic operations", "expected_output": "get/put work correctly", "is_hidden": false},
    {"input": "Eviction test", "expected_output": "LRU item evicted", "is_hidden": false},
    {"input": "Update existing key", "expected_output": "Value updated, item marked recent", "is_hidden": true},
    {"input": "Large capacity test", "expected_output": "Handles many items", "is_hidden": true},
    {"input": "Time complexity", "expected_output": "Operations are O(1)", "is_hidden": true}
  ]'::jsonb,
  20,
  9,
  ARRAY['typescript', 'data-structures', 'algorithms', 'optimization']
);

-- Challenge 12: Deep Clone Object (JavaScript)
INSERT INTO interview_coding_challenges (
  experience_level,
  language,
  title,
  description,
  starter_code,
  test_cases,
  time_limit_minutes,
  difficulty_score,
  tags
) VALUES (
  'senior',
  'javascript',
  'Deep Clone Object',
  'Implement a function that creates a deep clone of a JavaScript object, handling nested objects, arrays, dates, and circular references.

**Requirements:**
- Handle nested objects and arrays
- Handle primitive types, Date objects
- Handle circular references (object referencing itself)
- Do NOT use JSON.parse(JSON.stringify())

**Example:**
```javascript
const obj = { a: 1, b: { c: 2 }, d: [3, 4] };
const clone = deepClone(obj);
clone.b.c = 99;
console.log(obj.b.c); // 2 (original unchanged)
```',
  'function deepClone(obj) {
  // Write your code here

}',
  '[
    {"input": {"a": 1, "b": {"c": 2}}, "expected_output": "Deep clone created", "is_hidden": false},
    {"input": {"arr": [1, 2, 3]}, "expected_output": "Array cloned correctly", "is_hidden": false},
    {"input": "Object with Date", "expected_output": "Date cloned correctly", "is_hidden": true},
    {"input": "Circular reference", "expected_output": "Handles without infinite loop", "is_hidden": true},
    {"input": "Complex nested structure", "expected_output": "All levels cloned", "is_hidden": true}
  ]'::jsonb,
  20,
  8,
  ARRAY['javascript', 'recursion', 'objects', 'algorithms']
);

-- Challenge 13: Infinite Scroll Component (React)
INSERT INTO interview_coding_challenges (
  experience_level,
  language,
  title,
  description,
  starter_code,
  test_cases,
  time_limit_minutes,
  difficulty_score,
  tags
) VALUES (
  'senior',
  'react',
  'Infinite Scroll List',
  'Implement an infinite scroll component that loads more data as the user scrolls.

**Requirements:**
- Load initial 20 items
- Detect when user scrolls near bottom
- Load next 20 items automatically
- Show loading indicator while fetching
- Use IntersectionObserver or scroll events
- Optimize for performance (avoid memory leaks)
- Handle edge cases (end of data, errors)

**API:** Mock API provided that returns paginated data',
  'import React, { useState, useEffect, useRef } from ''react'';

function InfiniteScrollList() {
  // Mock API
  const fetchItems = async (page) => {
    const response = await fetch(`/api/items?page=${page}`);
    return response.json();
  };

  // Write your code here

  return (
    <div>
      {/* Your JSX here */}
    </div>
  );
}

export default InfiniteScrollList;',
  '[
    {"input": "Initial load", "expected_output": "Loads first 20 items", "is_hidden": false},
    {"input": "Scroll to bottom", "expected_output": "Loads next page", "is_hidden": false},
    {"input": "Multiple scrolls", "expected_output": "Continues loading pages", "is_hidden": true},
    {"input": "Cleanup on unmount", "expected_output": "No memory leaks", "is_hidden": true},
    {"input": "End of data", "expected_output": "Stops loading when no more data", "is_hidden": true}
  ]'::jsonb,
  20,
  8,
  ARRAY['react', 'performance', 'scroll', 'optimization']
);

-- Challenge 14: Async Queue (TypeScript)
INSERT INTO interview_coding_challenges (
  experience_level,
  language,
  title,
  description,
  starter_code,
  test_cases,
  time_limit_minutes,
  difficulty_score,
  tags
) VALUES (
  'senior',
  'typescript',
  'Async Task Queue',
  'Implement an async task queue that limits concurrent execution.

**Requirements:**
- Accept async tasks (functions that return Promises)
- Limit concurrent execution (e.g., max 3 tasks at once)
- Queue additional tasks until slots are available
- Return results in order tasks were added
- Handle errors gracefully
- Use TypeScript with proper types

**Example:**
```typescript
const queue = new AsyncQueue(2); // max 2 concurrent
queue.add(() => fetchUser(1));
queue.add(() => fetchUser(2));
queue.add(() => fetchUser(3)); // waits for slot
```',
  'type Task<T> = () => Promise<T>;

class AsyncQueue {
  private concurrency: number;

  constructor(concurrency: number) {
    this.concurrency = concurrency;
    // Write your code here
  }

  async add<T>(task: Task<T>): Promise<T> {
    // Write your code here
  }
}

export default AsyncQueue;',
  '[
    {"input": "Add 3 tasks with concurrency 2", "expected_output": "Max 2 run concurrently", "is_hidden": false},
    {"input": "Verify execution order", "expected_output": "Results in correct order", "is_hidden": false},
    {"input": "Handle task errors", "expected_output": "Error does not stop queue", "is_hidden": true},
    {"input": "Many tasks", "expected_output": "Processes all tasks", "is_hidden": true},
    {"input": "Edge case: concurrency 1", "expected_output": "Sequential execution", "is_hidden": true}
  ]'::jsonb,
  20,
  9,
  ARRAY['typescript', 'async', 'concurrency', 'promises']
);

-- Challenge 15: Custom useFetch Hook (React)
INSERT INTO interview_coding_challenges (
  experience_level,
  language,
  title,
  description,
  starter_code,
  test_cases,
  time_limit_minutes,
  difficulty_score,
  tags
) VALUES (
  'senior',
  'react',
  'Custom useFetch Hook with Cache',
  'Create a custom React hook for data fetching with caching, loading, and error states.

**Requirements:**
- Return { data, loading, error, refetch }
- Cache responses (same URL = return cached data)
- Handle loading and error states
- Support manual refetch
- Cancel in-flight requests on unmount
- Handle race conditions (later requests overriding earlier ones)
- TypeScript generics for type safety

**Advanced:** Implement stale-while-revalidate pattern',
  'import { useState, useEffect, useRef } from ''react'';

type UseFetchResult<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
};

function useFetch<T>(url: string): UseFetchResult<T> {
  // Write your code here

}

export default useFetch;',
  '[
    {"input": "Fetch data", "expected_output": "Returns data, loading, error", "is_hidden": false},
    {"input": "Caching test", "expected_output": "Same URL uses cache", "is_hidden": false},
    {"input": "Refetch functionality", "expected_output": "Refetch updates data", "is_hidden": true},
    {"input": "Cleanup on unmount", "expected_output": "Cancels pending requests", "is_hidden": true},
    {"input": "Race condition handling", "expected_output": "Latest request wins", "is_hidden": true}
  ]'::jsonb,
  20,
  9,
  ARRAY['react', 'hooks', 'custom-hooks', 'async', 'caching']
);

-- =====================================================
-- SEED COMPLETE
-- =====================================================

COMMENT ON TABLE interview_coding_challenges IS 'Seeded with 15 real-world coding challenges: 5 Fresher, 5 Junior, 5 Senior across JS/TS/React';
