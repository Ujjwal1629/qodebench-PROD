-- QodeBench Seed Data
-- Sample challenges for testing and development

-- ============================================================================
-- SAMPLE CHALLENGES
-- ============================================================================

-- JavaScript Challenges
INSERT INTO challenges (
    title,
    slug,
    description,
    difficulty,
    category,
    points,
    starter_code,
    test_cases,
    hints,
    solution_explanation,
    learning_objectives,
    estimated_time,
    is_active
) VALUES
(
    'Two Sum',
    'two-sum',
    'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

**Example 1:**
```
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
```

**Example 2:**
```
Input: nums = [3,2,4], target = 6
Output: [1,2]
```',
    'easy',
    'javascript',
    100,
    '{"javascript": "function twoSum(nums, target) {\n  // Your code here\n  return [];\n}"}',
    '[
        {"input": {"nums": [2,7,11,15], "target": 9}, "expected": [0,1], "description": "Basic case"},
        {"input": {"nums": [3,2,4], "target": 6}, "expected": [1,2], "description": "Different indices"},
        {"input": {"nums": [3,3], "target": 6}, "expected": [0,1], "description": "Same values"}
    ]',
    '[
        "Consider using a hash map to store numbers you''ve seen",
        "For each number, check if (target - number) exists in your hash map",
        "Store the index along with the number"
    ]',
    'Use a hash map (JavaScript object or Map) to store each number and its index as you iterate through the array. For each number, check if (target - current number) exists in the hash map. If it does, return both indices. This gives you O(n) time complexity instead of O(n²) from nested loops.',
    ARRAY['Hash maps', 'Array iteration', 'Time complexity optimization'],
    15,
    true
),
(
    'Palindrome Checker',
    'palindrome-checker',
    'Write a function that checks if a given string is a palindrome. A palindrome is a word, phrase, or sequence that reads the same backward as forward.

**Rules:**
- Ignore spaces, punctuation, and capitalization
- Empty strings are considered palindromes

**Example 1:**
```
Input: "racecar"
Output: true
```

**Example 2:**
```
Input: "A man, a plan, a canal: Panama"
Output: true
```',
    'easy',
    'javascript',
    100,
    '{"javascript": "function isPalindrome(str) {\n  // Your code here\n  return false;\n}"}',
    '[
        {"input": {"str": "racecar"}, "expected": true, "description": "Simple palindrome"},
        {"input": {"str": "hello"}, "expected": false, "description": "Not a palindrome"},
        {"input": {"str": "A man, a plan, a canal: Panama"}, "expected": true, "description": "Palindrome with spaces and punctuation"},
        {"input": {"str": ""}, "expected": true, "description": "Empty string"}
    ]',
    '[
        "First, remove all non-alphanumeric characters and convert to lowercase",
        "Compare the cleaned string with its reverse",
        "You can use two pointers from both ends"
    ]',
    'Clean the string by removing non-alphanumeric characters and converting to lowercase using regex and toLowerCase(). Then compare the cleaned string with its reverse, or use two pointers starting from both ends moving toward the center.',
    ARRAY['String manipulation', 'Regular expressions', 'Two pointers'],
    10,
    true
),
(
    'Debounce Function',
    'debounce-function',
    'Implement a debounce function that delays the execution of a function until after a specified wait time has elapsed since the last time it was invoked.

This is commonly used for search inputs, window resizing, and scroll events.

**Example:**
```javascript
const debouncedFn = debounce(() => console.log("Called!"), 500);
debouncedFn(); // Will not execute immediately
debouncedFn(); // Resets the timer
debouncedFn(); // Only this will execute after 500ms
```',
    'medium',
    'javascript',
    200,
    '{"javascript": "function debounce(func, wait) {\n  // Your code here\n  return function(...args) {\n    \n  };\n}"}',
    '[
        {"input": {"calls": [0, 100, 200], "wait": 300}, "expected": 1, "description": "Multiple calls within wait time"},
        {"input": {"calls": [0, 400, 800], "wait": 300}, "expected": 2, "description": "Calls with gaps"}
    ]',
    '[
        "You need to keep track of a timer ID",
        "Clear the previous timer on each call",
        "Set a new timer that calls the function after the wait time",
        "Remember to preserve the context (this) and arguments"
    ]',
    'Create a closure that stores a timer ID. On each call, clear the existing timer and set a new one. Use setTimeout to delay execution. Make sure to properly handle function context and arguments using apply() or spread operator.',
    ARRAY['Closures', 'setTimeout', 'Higher-order functions', 'Event handling'],
    20,
    true
),

-- React Challenges
(
    'Custom useLocalStorage Hook',
    'use-local-storage',
    'Create a custom React hook called `useLocalStorage` that synchronizes state with localStorage.

**Requirements:**
- Accept a key and initial value
- Return [value, setValue] like useState
- Automatically save to localStorage on updates
- Load from localStorage on mount
- Handle JSON serialization/deserialization

**Example Usage:**
```javascript
const [name, setName] = useLocalStorage("name", "Guest");
```',
    'medium',
    'react',
    250,
    '{"javascript": "import { useState, useEffect } from \"react\";\n\nfunction useLocalStorage(key, initialValue) {\n  // Your code here\n  \n  return [null, () => {}];\n}"}',
    '[
        {"input": {"key": "test", "initialValue": "hello"}, "expected": "hello", "description": "Returns initial value"},
        {"input": {"key": "test", "operations": [{"type": "set", "value": "world"}]}, "expected": "world", "description": "Updates localStorage"}
    ]',
    '[
        "Use useState to manage the state",
        "Use useEffect to sync with localStorage on mount",
        "Wrap localStorage access in try-catch for SSR safety",
        "Consider using JSON.stringify and JSON.parse"
    ]',
    'Use useState with a function initializer to read from localStorage. Use useEffect to save to localStorage whenever the state changes. Wrap localStorage operations in try-catch blocks to handle SSR and storage quota errors. Remember to serialize/deserialize with JSON.',
    ARRAY['React Hooks', 'localStorage', 'Custom hooks', 'Side effects'],
    25,
    true
),

-- Python Challenges
(
    'Valid Anagram',
    'valid-anagram',
    'Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.

An anagram is a word formed by rearranging the letters of a different word, using all the original letters exactly once.

**Example 1:**
```
Input: s = "anagram", t = "nagaram"
Output: true
```

**Example 2:**
```
Input: s = "rat", t = "car"
Output: false
```',
    'easy',
    'python',
    100,
    '{"python": "def isAnagram(s: str, t: str) -> bool:\n    # Your code here\n    pass"}',
    '[
        {"input": {"s": "anagram", "t": "nagaram"}, "expected": true, "description": "Valid anagram"},
        {"input": {"s": "rat", "t": "car"}, "expected": false, "description": "Not an anagram"},
        {"input": {"s": "a", "t": "a"}, "expected": true, "description": "Single character"}
    ]',
    '[
        "You can sort both strings and compare them",
        "Or use a hash map to count character frequencies",
        "Python''s Counter class from collections can be helpful"
    ]',
    'The simplest approach is to sort both strings and compare them. More efficient: use a hash map (dict or Counter) to count character frequencies in both strings, then compare the counts. This gives O(n) time complexity.',
    ARRAY['Hash maps', 'String manipulation', 'Sorting'],
    10,
    true
),

-- Node.js Challenges
(
    'Rate Limiter Middleware',
    'rate-limiter-middleware',
    'Implement a rate limiting middleware for Express.js that limits the number of requests from a single IP address.

**Requirements:**
- Limit requests per IP address
- Configurable time window and max requests
- Return 429 (Too Many Requests) when limit exceeded
- Track requests using a Map or simple cache

**Example:**
```javascript
const limiter = rateLimit({ windowMs: 60000, maxRequests: 10 });
app.use(limiter);
```',
    'medium',
    'nodejs',
    250,
    '{"javascript": "function rateLimit({ windowMs, maxRequests }) {\n  // Your code here\n  \n  return function(req, res, next) {\n    // Implement middleware logic\n    next();\n  };\n}"}',
    '[
        {"input": {"windowMs": 60000, "maxRequests": 3, "requests": 2}, "expected": "allow", "description": "Within limit"},
        {"input": {"windowMs": 60000, "maxRequests": 3, "requests": 4}, "expected": "block", "description": "Exceeds limit"}
    ]',
    '[
        "Use a Map to store IP addresses and their request counts",
        "Store timestamp of first request in the window",
        "Check if current time exceeds window, then reset counter",
        "Return 429 status when limit exceeded"
    ]',
    'Use a Map where keys are IP addresses and values are objects containing request count and window start time. On each request, check if we''re still in the same window. If yes, increment counter and check limit. If window expired, reset. Use req.ip to get client IP.',
    ARRAY['Express middleware', 'Rate limiting', 'Maps', 'Error handling'],
    30,
    true
),

-- Next.js Challenges
(
    'Dynamic Route Handler with Validation',
    'nextjs-route-handler',
    'Create a Next.js App Router API route handler that validates incoming POST requests using Zod.

**Requirements:**
- Handle POST requests at /api/users
- Validate request body with Zod schema
- Return 400 for invalid data with error details
- Return 201 with created user on success
- Use proper TypeScript types

**Schema:**
```typescript
{
  name: string (min 2 chars),
  email: string (valid email),
  age: number (min 18)
}
```',
    'medium',
    'nextjs',
    250,
    '{"typescript": "import { NextRequest, NextResponse } from \"next/server\";\nimport { z } from \"zod\";\n\n// Define your schema here\n\nexport async function POST(request: NextRequest) {\n  // Your code here\n  \n  return NextResponse.json({ message: \"Not implemented\" });\n}"}',
    '[
        {"input": {"name": "John Doe", "email": "john@example.com", "age": 25}, "expected": {"status": 201}, "description": "Valid data"},
        {"input": {"name": "J", "email": "invalid", "age": 15}, "expected": {"status": 400}, "description": "Invalid data"}
    ]',
    '[
        "Define a Zod schema with z.object()",
        "Parse the request body with await request.json()",
        "Use schema.safeParse() to validate",
        "Return appropriate status codes with NextResponse"
    ]',
    'Create a Zod schema with proper validations. Parse the request JSON, then use safeParse() for validation. If validation fails, return NextResponse with status 400 and error details. If successful, return 201 with the validated data.',
    ARRAY['Next.js App Router', 'API Routes', 'Zod validation', 'TypeScript'],
    25,
    true
);

-- ============================================================================
-- WEEKLY CHALLENGE (Example)
-- ============================================================================

-- Set one challenge as this week's challenge
UPDATE challenges
SET
    is_weekly_challenge = true,
    weekly_challenge_date = DATE_TRUNC('week', CURRENT_DATE)::DATE
WHERE slug = 'debounce-function';

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE challenges IS 'Seeded with sample challenges for development and testing';

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Uncomment to verify seed data:
-- SELECT id, title, difficulty, category, points FROM challenges ORDER BY category, difficulty;
-- SELECT * FROM challenges WHERE is_weekly_challenge = true;
