-- =============================================
-- Migration: Fix Intermediate Challenge #1
-- Description: Add complete content for Debug Async/Await challenge
-- Version: 023
-- =============================================

-- ============================================================================
-- Challenge #1: Debug Async/Await in API Calls
-- ============================================================================

UPDATE challenges
SET
  description = E'## Challenge\n\nYou have an API call function that fetches user data, but it''s not handling async operations correctly!\n\n## Bug Reports\n\n- Function returns Promise instead of actual data\n- Errors are not caught properly\n- Loading state stuck forever\n- "Cannot read property of undefined" errors\n- Async/await syntax errors\n\n## The Problem\n\nMissing `await` keywords and improper error handling in async functions.\n\n## Requirements\n\n1. Add proper `await` keywords to async calls\n2. Wrap API calls in try-catch blocks\n3. Handle loading and error states\n4. Return actual data, not Promises\n5. Show user-friendly error messages\n\n## Expected Behavior\n\n```javascript\n// Should return user object\nconst user = await fetchUser(123);\nconsole.log(user.name); // "Alice"\n\n// Should catch and handle errors\nconst result = await fetchUser(999);\n// Shows: "User not found" instead of crashing\n```\n\n## Your Task\n\nFix the async/await patterns and error handling in the code below.',

  starter_code = '{"javascript": "async function fetchUser(userId) {\n  // Bug: Missing await! Returns Promise, not data\n  const response = fetch(`/api/users/${userId}`);\n  \n  // Bug: response is a Promise, not the actual response!\n  if (!response.ok) {\n    throw new Error(''Failed to fetch user'');\n  }\n  \n  // Bug: Missing await again!\n  const data = response.json();\n  return data;  // Returns Promise, not actual user data!\n}\n\nasync function loadUserProfile(userId) {\n  // Bug: No try-catch for error handling!\n  // Bug: Missing await!\n  const user = fetchUser(userId);\n  \n  // Bug: user is a Promise, not the actual data!\n  console.log(user.name);  // Logs: undefined\n  \n  return user;\n}\n\n// Usage\nloadUserProfile(123);  // Bug: Not awaiting the function!"}',

  test_cases = '[{
    "type": "ai_validation",
    "criteria": {
      "await_usage": {
        "weight": 40,
        "description": "Properly uses await for all async operations"
      },
      "error_handling": {
        "weight": 35,
        "description": "Implements try-catch blocks for error handling"
      },
      "async_patterns": {
        "weight": 25,
        "description": "Follows async/await best practices"
      }
    }
  }]',

  learning_objectives = ARRAY[
    'Master async/await syntax',
    'Handle errors in async functions',
    'Understand Promises vs resolved values',
    'Debug common async/await mistakes'
  ]

WHERE slug = 'intermediate-async-await';

-- Verify the update
SELECT
  slug,
  title,
  CASE
    WHEN starter_code IS NULL THEN '❌ Missing starter_code'
    WHEN test_cases IS NULL THEN '❌ Missing test_cases'
    WHEN LENGTH(description) < 200 THEN '❌ Description too short'
    ELSE '✅ Complete'
  END as status
FROM challenges
WHERE slug = 'intermediate-async-await';
