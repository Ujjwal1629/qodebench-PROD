-- =============================================
-- Migration: Tier-Based Progressive Challenge System
-- Description: Transform from category-based to tier-based with sequential unlocking
-- Version: 017
-- Created: 2025-02-01
-- =============================================

-- ============================================================================
-- STEP 0: Clean up any previous partial migration attempts
-- ============================================================================

-- Delete any challenges that were created in previous migration attempts
DELETE FROM challenges WHERE tier IS NOT NULL;

-- Also delete challenges by slug pattern (tier-based challenges have specific slug patterns)
DELETE FROM challenges WHERE slug LIKE 'beginner-%'
   OR slug LIKE 'intermediate-%'
   OR slug LIKE 'office-%';

-- ============================================================================
-- STEP 1: Add new tier-related columns (safe to re-run)
-- ============================================================================

-- Drop existing check constraints if they exist (to allow re-running migration)
ALTER TABLE challenges DROP CONSTRAINT IF EXISTS challenges_tier_check;
ALTER TABLE challenges DROP CONSTRAINT IF EXISTS challenges_unlock_requirement_type_check;

-- Add columns (only if they don't exist)
ALTER TABLE challenges
ADD COLUMN IF NOT EXISTS tier TEXT,
ADD COLUMN IF NOT EXISTS order_in_tier INTEGER,
ADD COLUMN IF NOT EXISTS unlock_requirement_type TEXT DEFAULT 'previous',
ADD COLUMN IF NOT EXISTS unlock_requirement_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS previous_challenge_id UUID REFERENCES challenges(id) ON DELETE SET NULL;

-- Add check constraints
ALTER TABLE challenges
ADD CONSTRAINT challenges_tier_check CHECK (tier IN ('beginner', 'intermediate', 'office-workflow', 'advanced'));

ALTER TABLE challenges
ADD CONSTRAINT challenges_unlock_requirement_type_check CHECK (unlock_requirement_type IN ('none', 'previous', 'tier_completion'));

-- Add comments
COMMENT ON COLUMN challenges.tier IS 'Challenge tier: beginner → intermediate → office-workflow → advanced';
COMMENT ON COLUMN challenges.order_in_tier IS 'Sequential order within the tier (1-10)';
COMMENT ON COLUMN challenges.unlock_requirement_type IS 'How to unlock: none (always unlocked), previous (complete previous challenge), tier_completion (complete X challenges from previous tier)';
COMMENT ON COLUMN challenges.unlock_requirement_count IS 'Number of challenges to complete for tier_completion type';
COMMENT ON COLUMN challenges.previous_challenge_id IS 'Previous challenge in sequence (for unlock_requirement_type = previous)';

-- ============================================================================
-- STEP 2: Clean up existing data and remove constraint temporarily
-- ============================================================================

-- Drop old constraint first to avoid conflicts
ALTER TABLE challenges DROP CONSTRAINT IF EXISTS challenges_category_check;

-- Mark weekly challenges as inactive
UPDATE challenges
SET is_active = FALSE
WHERE is_weekly_challenge = TRUE;

-- Mark python challenges as inactive
UPDATE challenges
SET is_active = FALSE
WHERE category = 'python';

-- Update 'office' to 'office-fundamentals' for consistency
UPDATE challenges
SET category = 'office-fundamentals'
WHERE category = 'office';

-- Mark all existing office-fundamentals challenges as inactive (will recreate as office-workflow)
UPDATE challenges
SET is_active = FALSE
WHERE category IN ('office-fundamentals', 'office');

-- ============================================================================
-- STEP 3: Add new category constraint (only web dev stack categories)
-- ============================================================================

-- Add new constraint - only allow categories we're actively using
ALTER TABLE challenges
ADD CONSTRAINT challenges_category_check
CHECK (
  (is_active = FALSE) OR
  (category IN ('javascript', 'react', 'nextjs', 'nodejs', 'office-fundamentals'))
);

-- ============================================================================
-- STEP 4: Create Beginner Tier Challenges (10 challenges)
-- All unlocked by default, sequential within tier
-- ============================================================================

-- Beginner #1: Fix JavaScript Array Methods
INSERT INTO challenges (
  title,
  slug,
  description,
  difficulty,
  category,
  points,
  tier,
  order_in_tier,
  unlock_requirement_type,
  unlock_requirement_count,
  challenge_type,
  response_format,
  validation_type,
  starter_code,
  test_cases,
  learning_objectives,
  estimated_time,
  is_active
) VALUES (
  'Fix JavaScript Array Methods',
  'beginner-js-array-methods',
  E'## Challenge\n\nYou have a function that processes user data, but the array methods are incorrectly used. Fix the implementation.\n\n## Requirements\n\n1. Use `map()` to transform the data\n2. Use `filter()` to remove invalid entries\n3. Use `reduce()` to calculate totals\n\n## Example\n\n```javascript\nconst users = [\n  { name: "Alice", age: 25, active: true },\n  { name: "Bob", age: 17, active: false },\n  { name: "Charlie", age: 30, active: true }\n];\n\n// Should return only active adult users with formatted names\nprocessUsers(users);\n// Expected: [{ name: "ALICE", age: 25 }, { name: "CHARLIE", age: 30 }]\n```',
  'easy',
  'javascript',
  50,
  'beginner',
  1,
  'none',
  0,
  'code',
  'javascript',
  'ai_only',
  '{"javascript": "function processUsers(users) {\n  // TODO: Fix the array methods below\n  const adults = users.map(user => user.age >= 18); // Wrong method!\n  const active = adults.filter(user => user.name.toUpperCase()); // Wrong logic!\n  return active;\n}"}',
  '[{"type": "ai_validation", "criteria": {"correctness": {"weight": 40, "description": "Uses correct array methods"}, "logic": {"weight": 30, "description": "Proper filtering and transformation logic"}, "code_quality": {"weight": 30, "description": "Clean, readable code"}}}]',
  ARRAY['Understand JavaScript array methods', 'Use map(), filter(), and reduce() correctly', 'Chain array methods effectively'],
  15,
  TRUE
);

-- Beginner #2: Debug React Component Rendering
INSERT INTO challenges (
  title,
  slug,
  description,
  difficulty,
  category,
  points,
  tier,
  order_in_tier,
  unlock_requirement_type,
  previous_challenge_id,
  challenge_type,
  response_format,
  validation_type,
  starter_code,
  test_cases,
  learning_objectives,
  estimated_time,
  is_active
) VALUES (
  'Debug React Component Rendering',
  'beginner-react-rendering',
  E'## Challenge\n\nThis UserCard component has rendering issues. Users report seeing outdated information.\n\n## Bug Reports\n\n- Component doesn\'t re-render when props change\n- Missing key prop warning in console\n- Conditional rendering broken\n\n## Fix Requirements\n\n1. Fix the re-rendering issue\n2. Add proper keys to list items\n3. Fix conditional rendering logic',
  'easy',
  'react',
  50,
  'beginner',
  2,
  'previous',
  (SELECT id FROM challenges WHERE slug = 'beginner-js-array-methods'),
  'code',
  'javascript',
  'ai_only',
  '{"javascript": "function UserCard({ user }) {\n  // Bug: Component doesn\'t update\n  const displayName = user.name;\n  \n  return (\n    <div>\n      <h2>{displayName}</h2>\n      {user.isActive && <span>Active</span>} {/* Bug: condition reversed */}\n      <ul>\n        {user.badges.map(badge => <li>{badge}</li>)} {/* Bug: missing key */}\n      </ul>\n    </div>\n  );\n}"}',
  '[{"type": "ai_validation", "criteria": {"correctness": {"weight": 40, "description": "Fixes all rendering bugs"}, "react_best_practices": {"weight": 30, "description": "Follows React patterns"}, "code_quality": {"weight": 30, "description": "Clean code"}}}]',
  ARRAY['Understand React component lifecycle', 'Use keys in lists correctly', 'Debug rendering issues'],
  20,
  TRUE
);

-- Beginner #3: Fix useState Hook Usage
INSERT INTO challenges (
  title,
  slug,
  description,
  difficulty,
  category,
  points,
  tier,
  order_in_tier,
  unlock_requirement_type,
  previous_challenge_id,
  challenge_type,
  response_format,
  validation_type,
  starter_code,
  test_cases,
  learning_objectives,
  estimated_time,
  is_active
) VALUES (
  'Fix useState Hook Usage',
  'beginner-usestate-hook',
  E'## Challenge\n\nThis counter component has bugs with useState. The counter behaves unpredictably.\n\n## Issues\n\n- Increment doesn\'t work as expected\n- State updates are being lost\n- Reset function has issues\n\n## Fix It\n\nMake the counter work correctly with proper useState usage.',
  'easy',
  'react',
  50,
  'beginner',
  3,
  'previous',
  (SELECT id FROM challenges WHERE slug = 'beginner-react-rendering'),
  'code',
  'javascript',
  'ai_only',
  '{"javascript": "function Counter() {\n  const [count, setCount] = useState(0);\n  \n  const increment = () => {\n    setCount(count + 1); // Bug: stale closure\n    setCount(count + 1); // Bug: won\'t increment by 2\n  };\n  \n  const reset = () => {\n    count = 0; // Bug: direct mutation\n  };\n  \n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={increment}>+2</button>\n      <button onClick={reset}>Reset</button>\n    </div>\n  );\n}"}',
  '[{"type": "ai_validation", "criteria": {"correctness": {"weight": 50, "description": "Counter works correctly"}, "hooks_understanding": {"weight": 30, "description": "Proper useState usage"}, "code_quality": {"weight": 20, "description": "Clean implementation"}}}]',
  ARRAY['Master useState hook', 'Understand state updates and closures', 'Avoid common useState pitfalls'],
  20,
  TRUE
);

-- Continue with remaining beginner challenges...
-- I'll create a condensed version for the plan, but in full implementation would add all 10

-- Beginner #4-10 placeholders (to be filled with full content)
-- IMPORTANT: Each INSERT must be separate so previous_challenge_id can reference the just-inserted challenge

INSERT INTO challenges (title, slug, description, difficulty, category, points, tier, order_in_tier, unlock_requirement_type, previous_challenge_id, challenge_type, response_format, validation_type, learning_objectives, estimated_time, is_active)
VALUES ('Handle Form Inputs in React', 'beginner-form-inputs', 'Fix form input handling and controlled components', 'easy', 'react', 50, 'beginner', 4, 'previous', (SELECT id FROM challenges WHERE slug = 'beginner-usestate-hook'), 'code', 'javascript', 'ai_only', ARRAY['Handle form inputs', 'Controlled components'], 20, TRUE);

INSERT INTO challenges (title, slug, description, difficulty, category, points, tier, order_in_tier, unlock_requirement_type, previous_challenge_id, challenge_type, response_format, validation_type, learning_objectives, estimated_time, is_active)
VALUES ('Fix useEffect Dependencies', 'beginner-useeffect-deps', 'Fix useEffect dependency issues and infinite loops', 'easy', 'react', 50, 'beginner', 5, 'previous', (SELECT id FROM challenges WHERE slug = 'beginner-form-inputs'), 'code', 'javascript', 'ai_only', ARRAY['Use useEffect correctly', 'Manage dependencies'], 20, TRUE);

INSERT INTO challenges (title, slug, description, difficulty, category, points, tier, order_in_tier, unlock_requirement_type, previous_challenge_id, challenge_type, response_format, validation_type, learning_objectives, estimated_time, is_active)
VALUES ('Implement Basic Routing in Next.js', 'beginner-nextjs-routing', 'Set up basic routing with Next.js App Router', 'easy', 'nextjs', 50, 'beginner', 6, 'previous', (SELECT id FROM challenges WHERE slug = 'beginner-useeffect-deps'), 'code', 'javascript', 'ai_only', ARRAY['Next.js routing basics', 'App Router'], 25, TRUE);

INSERT INTO challenges (title, slug, description, difficulty, category, points, tier, order_in_tier, unlock_requirement_type, previous_challenge_id, challenge_type, response_format, validation_type, learning_objectives, estimated_time, is_active)
VALUES ('Fix API Route Handler', 'beginner-api-route', 'Debug and fix a Next.js API route handler', 'easy', 'nextjs', 50, 'beginner', 7, 'previous', (SELECT id FROM challenges WHERE slug = 'beginner-nextjs-routing'), 'code', 'javascript', 'ai_only', ARRAY['API routes', 'Request handling'], 25, TRUE);

INSERT INTO challenges (title, slug, description, difficulty, category, points, tier, order_in_tier, unlock_requirement_type, previous_challenge_id, challenge_type, response_format, validation_type, learning_objectives, estimated_time, is_active)
VALUES ('Debug Props Passing in React', 'beginner-props-passing', 'Fix props drilling and prop types issues', 'easy', 'react', 50, 'beginner', 8, 'previous', (SELECT id FROM challenges WHERE slug = 'beginner-api-route'), 'code', 'javascript', 'ai_only', ARRAY['Props passing', 'Component communication'], 20, TRUE);

INSERT INTO challenges (title, slug, description, difficulty, category, points, tier, order_in_tier, unlock_requirement_type, previous_challenge_id, challenge_type, response_format, validation_type, learning_objectives, estimated_time, is_active)
VALUES ('Fix Event Handler Binding', 'beginner-event-handlers', 'Fix event handler binding and synthetic events', 'easy', 'react', 50, 'beginner', 9, 'previous', (SELECT id FROM challenges WHERE slug = 'beginner-props-passing'), 'code', 'javascript', 'ai_only', ARRAY['Event handling', 'Event binding'], 20, TRUE);

INSERT INTO challenges (title, slug, description, difficulty, category, points, tier, order_in_tier, unlock_requirement_type, previous_challenge_id, challenge_type, response_format, validation_type, learning_objectives, estimated_time, is_active)
VALUES ('Implement Simple State Management', 'beginner-state-management', 'Create a simple state management solution with Context', 'easy', 'react', 50, 'beginner', 10, 'previous', (SELECT id FROM challenges WHERE slug = 'beginner-event-handlers'), 'code', 'javascript', 'ai_only', ARRAY['State management', 'React Context'], 25, TRUE);

-- ============================================================================
-- STEP 5: Create Intermediate Tier Challenges (10 challenges)
-- Unlocked after completing 5 beginner challenges
-- ============================================================================

-- First intermediate challenge (unlocked by tier completion)
INSERT INTO challenges (title, slug, description, difficulty, category, points, tier, order_in_tier, unlock_requirement_type, unlock_requirement_count, challenge_type, response_format, validation_type, learning_objectives, estimated_time, is_active)
VALUES
('Debug Async/Await in API Calls', 'intermediate-async-await', 'Fix async/await patterns and error handling in API calls', 'medium', 'javascript', 75, 'intermediate', 1, 'tier_completion', 5, 'code', 'javascript', 'ai_only', ARRAY['Async/await patterns', 'Error handling'], 30, TRUE);

-- Remaining intermediate challenges (unlocked by previous challenge) - SEPARATE INSERTS
INSERT INTO challenges (title, slug, description, difficulty, category, points, tier, order_in_tier, unlock_requirement_type, previous_challenge_id, challenge_type, response_format, validation_type, learning_objectives, estimated_time, is_active)
VALUES ('Fix React Context Implementation', 'intermediate-context-api', 'Debug and optimize React Context usage', 'medium', 'react', 75, 'intermediate', 2, 'previous', (SELECT id FROM challenges WHERE slug = 'intermediate-async-await'), 'code', 'javascript', 'ai_only', ARRAY['Context API', 'Performance optimization'], 30, TRUE);

INSERT INTO challenges (title, slug, description, difficulty, category, points, tier, order_in_tier, unlock_requirement_type, previous_challenge_id, challenge_type, response_format, validation_type, learning_objectives, estimated_time, is_active)
VALUES ('Resolve API Error Handling', 'intermediate-api-errors', 'Implement proper error handling in Next.js API routes', 'medium', 'nextjs', 75, 'intermediate', 3, 'previous', (SELECT id FROM challenges WHERE slug = 'intermediate-context-api'), 'code', 'javascript', 'ai_only', ARRAY['Error handling', 'HTTP status codes'], 30, TRUE);

INSERT INTO challenges (title, slug, description, difficulty, category, points, tier, order_in_tier, unlock_requirement_type, previous_challenge_id, challenge_type, response_format, validation_type, learning_objectives, estimated_time, is_active)
VALUES ('Fix Database Query in API Route', 'intermediate-db-query', 'Debug Supabase queries and fix data fetching issues', 'medium', 'nextjs', 75, 'intermediate', 4, 'previous', (SELECT id FROM challenges WHERE slug = 'intermediate-api-errors'), 'code', 'javascript', 'ai_only', ARRAY['Database queries', 'Supabase'], 35, TRUE);

INSERT INTO challenges (title, slug, description, difficulty, category, points, tier, order_in_tier, unlock_requirement_type, previous_challenge_id, challenge_type, response_format, validation_type, learning_objectives, estimated_time, is_active)
VALUES ('Debug Server vs Client Components', 'intermediate-rsc', 'Fix Next.js Server/Client component boundaries', 'medium', 'nextjs', 75, 'intermediate', 5, 'previous', (SELECT id FROM challenges WHERE slug = 'intermediate-db-query'), 'code', 'javascript', 'ai_only', ARRAY['Server Components', 'Client Components'], 30, TRUE);

INSERT INTO challenges (title, slug, description, difficulty, category, points, tier, order_in_tier, unlock_requirement_type, previous_challenge_id, challenge_type, response_format, validation_type, learning_objectives, estimated_time, is_active)
VALUES ('Fix Authentication Flow', 'intermediate-auth-flow', 'Debug authentication flow with Supabase', 'medium', 'nextjs', 75, 'intermediate', 6, 'previous', (SELECT id FROM challenges WHERE slug = 'intermediate-rsc'), 'code', 'javascript', 'ai_only', ARRAY['Authentication', 'Session management'], 35, TRUE);

INSERT INTO challenges (title, slug, description, difficulty, category, points, tier, order_in_tier, unlock_requirement_type, previous_challenge_id, challenge_type, response_format, validation_type, learning_objectives, estimated_time, is_active)
VALUES ('Resolve CORS Issues', 'intermediate-cors', 'Fix CORS configuration in API routes', 'medium', 'nodejs', 75, 'intermediate', 7, 'previous', (SELECT id FROM challenges WHERE slug = 'intermediate-auth-flow'), 'code', 'javascript', 'ai_only', ARRAY['CORS', 'API security'], 25, TRUE);

INSERT INTO challenges (title, slug, description, difficulty, category, points, tier, order_in_tier, unlock_requirement_type, previous_challenge_id, challenge_type, response_format, validation_type, learning_objectives, estimated_time, is_active)
VALUES ('Fix Data Fetching with React Query', 'intermediate-react-query', 'Debug React Query setup and caching', 'medium', 'react', 75, 'intermediate', 8, 'previous', (SELECT id FROM challenges WHERE slug = 'intermediate-cors'), 'code', 'javascript', 'ai_only', ARRAY['React Query', 'Caching'], 30, TRUE);

INSERT INTO challenges (title, slug, description, difficulty, category, points, tier, order_in_tier, unlock_requirement_type, previous_challenge_id, challenge_type, response_format, validation_type, learning_objectives, estimated_time, is_active)
VALUES ('Debug Middleware Logic', 'intermediate-middleware', 'Fix Next.js middleware for route protection', 'medium', 'nextjs', 75, 'intermediate', 9, 'previous', (SELECT id FROM challenges WHERE slug = 'intermediate-react-query'), 'code', 'javascript', 'ai_only', ARRAY['Middleware', 'Route protection'], 30, TRUE);

INSERT INTO challenges (title, slug, description, difficulty, category, points, tier, order_in_tier, unlock_requirement_type, previous_challenge_id, challenge_type, response_format, validation_type, learning_objectives, estimated_time, is_active)
VALUES ('Fix Form Validation with Zod', 'intermediate-zod-validation', 'Implement form validation using Zod schema', 'medium', 'javascript', 75, 'intermediate', 10, 'previous', (SELECT id FROM challenges WHERE slug = 'intermediate-middleware'), 'code', 'javascript', 'ai_only', ARRAY['Form validation', 'Zod schemas'], 30, TRUE);

-- ============================================================================
-- STEP 6: Create Office Workflow Tier Challenges (10 challenges)
-- Unlocked after completing 8 intermediate challenges
-- ============================================================================

-- First office workflow challenge (unlocked by tier completion)
INSERT INTO challenges (title, slug, description, difficulty, category, points, tier, order_in_tier, unlock_requirement_type, unlock_requirement_count, challenge_type, response_format, validation_type, learning_objectives, estimated_time, is_active)
VALUES
('Write PR Description', 'office-pr-description', E'Write a professional pull request description\n\n## Context\nYou implemented user authentication with JWT tokens.\n\n## Write\n- Summary of changes\n- Testing done\n- Related issues', 'medium', 'office-fundamentals', 100, 'office-workflow', 1, 'tier_completion', 8, 'document', 'markdown', 'hybrid', ARRAY['PR descriptions', 'Technical writing'], 30, TRUE);

-- Remaining office workflow challenges (unlocked by previous challenge) - SEPARATE INSERTS
INSERT INTO challenges (title, slug, description, difficulty, category, points, tier, order_in_tier, unlock_requirement_type, previous_challenge_id, challenge_type, response_format, validation_type, learning_objectives, estimated_time, is_active)
VALUES ('Write Root Cause Analysis', 'office-rca', E'Write RCA for production incident\n\n## Incident\nAPI endpoint returning 500 errors\n\n## Include\n- Timeline\n- Root cause\n- Action items', 'medium', 'office-fundamentals', 100, 'office-workflow', 2, 'previous', (SELECT id FROM challenges WHERE slug = 'office-pr-description'), 'document', 'markdown', 'hybrid', ARRAY['RCA documents', 'Incident analysis'], 40, TRUE);

INSERT INTO challenges (title, slug, description, difficulty, category, points, tier, order_in_tier, unlock_requirement_type, previous_challenge_id, challenge_type, response_format, validation_type, learning_objectives, estimated_time, is_active)
VALUES ('Create Meeting Notes', 'office-meeting-notes', 'Structure meeting notes from a sprint planning meeting', 'medium', 'office-fundamentals', 100, 'office-workflow', 3, 'previous', (SELECT id FROM challenges WHERE slug = 'office-rca'), 'document', 'markdown', 'hybrid', ARRAY['Meeting documentation', 'Note-taking'], 25, TRUE);

INSERT INTO challenges (title, slug, description, difficulty, category, points, tier, order_in_tier, unlock_requirement_type, previous_challenge_id, challenge_type, response_format, validation_type, learning_objectives, estimated_time, is_active)
VALUES ('Write Incident Communication', 'office-incident-comm', 'Write stakeholder communication for outage', 'medium', 'office-fundamentals', 100, 'office-workflow', 4, 'previous', (SELECT id FROM challenges WHERE slug = 'office-meeting-notes'), 'document', 'markdown', 'hybrid', ARRAY['Incident communication', 'Stakeholder updates'], 25, TRUE);

INSERT INTO challenges (title, slug, description, difficulty, category, points, tier, order_in_tier, unlock_requirement_type, previous_challenge_id, challenge_type, response_format, validation_type, learning_objectives, estimated_time, is_active)
VALUES ('Resolve Git Merge Conflict', 'office-merge-conflict', 'Resolve a complex merge conflict in feature branch', 'medium', 'office-fundamentals', 100, 'office-workflow', 5, 'previous', (SELECT id FROM challenges WHERE slug = 'office-incident-comm'), 'code', 'javascript', 'ai_only', ARRAY['Git conflicts', 'Version control'], 30, TRUE);

INSERT INTO challenges (title, slug, description, difficulty, category, points, tier, order_in_tier, unlock_requirement_type, previous_challenge_id, challenge_type, response_format, validation_type, learning_objectives, estimated_time, is_active)
VALUES ('Write Deployment Checklist', 'office-deployment-checklist', 'Create pre-deployment checklist for production release', 'medium', 'office-fundamentals', 100, 'office-workflow', 6, 'previous', (SELECT id FROM challenges WHERE slug = 'office-merge-conflict'), 'document', 'markdown', 'hybrid', ARRAY['Deployment planning', 'Checklists'], 25, TRUE);

INSERT INTO challenges (title, slug, description, difficulty, category, points, tier, order_in_tier, unlock_requirement_type, previous_challenge_id, challenge_type, response_format, validation_type, learning_objectives, estimated_time, is_active)
VALUES ('Create API Documentation', 'office-api-docs', 'Document REST API endpoints with examples', 'medium', 'office-fundamentals', 100, 'office-workflow', 7, 'previous', (SELECT id FROM challenges WHERE slug = 'office-deployment-checklist'), 'document', 'markdown', 'hybrid', ARRAY['API documentation', 'Technical writing'], 35, TRUE);

INSERT INTO challenges (title, slug, description, difficulty, category, points, tier, order_in_tier, unlock_requirement_type, previous_challenge_id, challenge_type, response_format, validation_type, learning_objectives, estimated_time, is_active)
VALUES ('Write Technical Design Doc', 'office-tech-design', 'Write technical design document for new feature', 'medium', 'office-fundamentals', 100, 'office-workflow', 8, 'previous', (SELECT id FROM challenges WHERE slug = 'office-api-docs'), 'document', 'markdown', 'hybrid', ARRAY['Design docs', 'System design'], 40, TRUE);

INSERT INTO challenges (title, slug, description, difficulty, category, points, tier, order_in_tier, unlock_requirement_type, previous_challenge_id, challenge_type, response_format, validation_type, learning_objectives, estimated_time, is_active)
VALUES ('Create Bug Report', 'office-bug-report', 'Write detailed bug report with reproduction steps', 'medium', 'office-fundamentals', 100, 'office-workflow', 9, 'previous', (SELECT id FROM challenges WHERE slug = 'office-tech-design'), 'document', 'markdown', 'hybrid', ARRAY['Bug reporting', 'Issue tracking'], 20, TRUE);

INSERT INTO challenges (title, slug, description, difficulty, category, points, tier, order_in_tier, unlock_requirement_type, previous_challenge_id, challenge_type, response_format, validation_type, learning_objectives, estimated_time, is_active)
VALUES ('Write Code Review Comments', 'office-code-review', 'Provide constructive code review feedback', 'medium', 'office-fundamentals', 100, 'office-workflow', 10, 'previous', (SELECT id FROM challenges WHERE slug = 'office-bug-report'), 'document', 'markdown', 'hybrid', ARRAY['Code review', 'Feedback'], 30, TRUE);

-- ============================================================================
-- STEP 7: Update existing Advanced challenges
-- Lock them behind office workflow completion
-- ============================================================================

UPDATE challenges
SET
  tier = 'advanced',
  order_in_tier = 1,
  unlock_requirement_type = 'tier_completion',
  unlock_requirement_count = 3,
  is_active = TRUE
WHERE slug LIKE '%mock%interview%' OR slug LIKE '%advanced%'
  AND is_active = FALSE;

-- ============================================================================
-- STEP 8: Clean up old fields (optional, can keep for compatibility)
-- ============================================================================

-- Don't drop columns yet, mark for future cleanup
COMMENT ON COLUMN challenges.is_weekly_challenge IS 'DEPRECATED - Use tier system instead';
COMMENT ON COLUMN challenges.weekly_challenge_date IS 'DEPRECATED - Use tier system instead';

-- ============================================================================
-- STEP 9: Create indexes for performance
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_challenges_tier ON challenges(tier);
CREATE INDEX IF NOT EXISTS idx_challenges_tier_order ON challenges(tier, order_in_tier);
CREATE INDEX IF NOT EXISTS idx_challenges_previous ON challenges(previous_challenge_id);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check tier distribution
SELECT tier, COUNT(*) as count
FROM challenges
WHERE is_active = TRUE
GROUP BY tier
ORDER BY
  CASE tier
    WHEN 'beginner' THEN 1
    WHEN 'intermediate' THEN 2
    WHEN 'office-workflow' THEN 3
    WHEN 'advanced' THEN 4
  END;

-- Check unlock chain
SELECT
  tier,
  order_in_tier,
  title,
  unlock_requirement_type,
  unlock_requirement_count
FROM challenges
WHERE is_active = TRUE
ORDER BY tier, order_in_tier;
