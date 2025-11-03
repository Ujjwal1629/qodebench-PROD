-- =============================================
-- Migration: Fix Contradictory Challenge Requirements
-- Description: Align requirements with examples in challenges 1-3
-- Version: 019
-- =============================================

-- Fix Challenge #1: Remove reduce() requirement since example doesn't need it
UPDATE challenges
SET description = E'## Challenge\n\nYou have a function that processes user data, but the array methods are incorrectly used. Fix the implementation.\n\n## Requirements\n\n1. Use `filter()` to remove invalid entries (non-active users and minors)\n2. Use `map()` to transform the data (uppercase names, keep only needed fields)\n\n## Example\n\n```javascript\nconst users = [\n  { name: "Alice", age: 25, active: true },\n  { name: "Bob", age: 17, active: false },\n  { name: "Charlie", age: 30, active: true }\n];\n\n// Should return only active adult users with formatted names\nprocessUsers(users);\n// Expected: [{ name: "ALICE", age: 25 }, { name: "CHARLIE", age: 30 }]\n```\n\n## Your Task\n\nFix the buggy implementation below so it correctly filters and transforms the user data.',
    learning_objectives = ARRAY[
      'Master JavaScript array methods',
      'Use map() and filter() correctly',
      'Chain array methods effectively'
    ]
WHERE slug = 'beginner-js-array-methods';

-- Fix Challenge #2: Clarify what bugs need fixing
UPDATE challenges
SET description = E'## Challenge\n\nThis UserCard component has rendering issues. Users report seeing outdated information and console warnings.\n\n## Bug Reports\n\n- Missing key prop warning in console for list items\n- Conditional rendering logic is reversed (shows "Active" for inactive users)\n\n## Your Task\n\nFix the bugs in the component below. The component should:\n1. Display user name correctly\n2. Show "Active" badge ONLY for active users\n3. Render badges list with proper keys to avoid warnings',
    starter_code = '{"javascript": "function UserCard({ user }) {\n  return (\n    <div>\n      <h2>{user.name}</h2>\n      {!user.isActive && <span className=\"badge\">Active</span>} {/* Bug: condition reversed! */}\n      <ul>\n        {user.badges.map(badge => (\n          <li>{badge}</li> {/* Bug: missing key prop */}\n        ))}\n      </ul>\n    </div>\n  );\n}"}'
WHERE slug = 'beginner-react-rendering';

-- Fix Challenge #3: Clarify useState bugs
UPDATE challenges
SET description = E'## Challenge\n\nThis counter component has bugs with useState. The counter behaves unexpredictably.\n\n## Issues\n\n- The "+2" button should increment by 2, but it only increments by 1\n- The reset button doesn''t work at all\n\n## Your Task\n\nFix the two bugs in the code below:\n\n1. Make the "+2" button actually increment by 2 (hint: use functional updates)\n2. Fix the reset function (hint: don''t mutate state directly)\n\n## Expected Behavior\n\n- Clicking "+2" should increase count by 2 each time\n- Clicking "Reset" should set count back to 0',
    starter_code = '{"javascript": "import { useState } from ''react'';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  \n  const increment = () => {\n    // Bug: This won''t increment by 2 due to stale closure\n    setCount(count + 1);\n    setCount(count + 1);\n  };\n  \n  const reset = () => {\n    // Bug: Direct mutation doesn''t trigger re-render\n    count = 0;\n  };\n  \n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={increment}>+2</button>\n      <button onClick={reset}>Reset</button>\n    </div>\n  );\n}"}'
WHERE slug = 'beginner-usestate-hook';

-- Verify the updates
SELECT slug, title,
       CASE
         WHEN description LIKE '%reduce()%' THEN 'Still mentions reduce()'
         ELSE 'Fixed'
       END as status
FROM challenges
WHERE slug IN ('beginner-js-array-methods', 'beginner-react-rendering', 'beginner-usestate-hook');
