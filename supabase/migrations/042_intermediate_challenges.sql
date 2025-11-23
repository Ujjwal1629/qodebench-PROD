-- =============================================
-- Migration: Add 10 Intermediate Challenges
-- Description: Real-world intermediate-level bug scenarios for production code
-- Version: 042
-- Date: 2025-01-20
-- =============================================

-- Challenge 1: Fix Debounce (Real UI Lag Issue)
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Fix Debounce Function',
  'intermediate-debounce-fix',
  E'## 🏭 Scenario\n\nSearch input triggers API calls on every keystroke, overwhelming the backend. The debounce function written by an old intern is broken.\n\n## 🐛 The Bug\n\nThe old timer is never cleared, so setTimeout accumulates and calls the function multiple times instead of just once.\n\n## 📋 Requirements\n\n- Clear the previous timer before setting a new one\n- Only call the function once after the delay period\n- Prevent multiple overlapping timers\n\n## 🎯 Your Task\n\nFix the debounce function to properly clear the old timer using clearTimeout.',
  'medium', 'javascript', 'intermediate', 1, 100,
  '{"javascript": "export function debounce(fn, delay) {\n  let timer = null;\n\n  return function (...args) {\n    // BUG: old timer never cleared → calls multiple times\n    timer = setTimeout(() => fn.apply(this, args), delay);\n  };\n}"}',
  '[]',
  ARRAY['Debounce logic', 'Timers & cleanup', 'Preventing excessive API calls'],
  15, true, 'code', 'javascript', 'ai_only', true
);

-- Challenge 2: Fix Pagination Logic (Classic Backend Bug)
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Fix Pagination Offset Bug',
  'intermediate-pagination-fix',
  E'## 🏭 Scenario\n\nThe API is returning wrong page results because the pagination offset calculation is incorrect.\n\n## 🐛 The Bug\n\nThe offset formula is wrong. Page 1 should start at index 0, page 2 at index 2 (for limit=2), but the current formula starts at index 2 for page 1.\n\n## 📋 Requirements\n\n- Page numbering starts at 1 (not 0)\n- Correct formula: start = (page - 1) × limit\n- Return correct slice of data for each page\n\n## 🎯 Your Task\n\nFix the offset calculation to return the correct page of results.',
  'medium', 'javascript', 'intermediate', 2, 100,
  '{"javascript": "export function paginate(data, page, limit) {\n  // BUG: wrong offset formula\n  const start = page * limit;\n  return data.slice(start, start + limit);\n}"}',
  '[{"input": [[1,2,3,4,5,6], 1, 2], "expected": [1,2]}, {"input": [[1,2,3,4,5,6], 2, 2], "expected": [3,4]}, {"input": [[1,2,3,4,5,6], 3, 2], "expected": [5,6]}]',
  ARRAY['Pagination mathematics', 'Understanding offset formulas', 'Common backend mistakes'],
  12, true, 'code', 'javascript', 'test_cases', true
);

-- Challenge 3: Fix Deep Clone Utility (Mutation Bug)
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Fix Deep Clone Bug',
  'intermediate-deep-clone',
  E'## 🏭 Scenario\n\nState updates are mutating the original object, causing React/Redux re-renders to break.\n\n## 🐛 The Bug\n\nThe spread operator only creates a shallow copy. Nested objects are still referenced, not cloned.\n\n## 📋 Requirements\n\n- Clone nested objects deeply\n- Changing the clone should NOT affect the original\n- Use JSON.parse(JSON.stringify()) or recursive cloning\n\n## 🎯 Your Task\n\nImplement proper deep cloning to prevent mutation bugs.',
  'medium', 'javascript', 'intermediate', 3, 100,
  '{"javascript": "export function deepClone(obj) {\n  // BUG: shallow copy only\n  return { ...obj };\n}"}',
  '[{"input": [{"a": 1, "nested": {"x": 2}}], "expected": {"a": 1, "nested": {"x": 2}}}]',
  ARRAY['Deep cloning vs shallow', 'Avoiding mutation bugs', 'Real React/Redux issue'],
  15, true, 'code', 'javascript', 'ai_only', true
);

-- Challenge 4: Fix API Error Normalizer
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Fix Error Normalizer',
  'intermediate-error-normalizer',
  E'## 🏭 Scenario\n\nDifferent backend services return inconsistent error shapes. The frontend must normalize them for consistent display.\n\n## 🐛 The Bug\n\nThe function assumes all errors have a message property, causing crashes when errors have different structures.\n\n## 📋 Requirements\n\n- Handle errors with message property\n- Handle errors with error property\n- Handle plain string errors\n- Return "Unknown error" for anything else\n\n## 🎯 Your Task\n\nImplement defensive error normalization that handles all error shapes.',
  'medium', 'javascript', 'intermediate', 4, 100,
  '{"javascript": "export function normalizeError(err) {\n  // BUG: assumes all errors have message\n  return err.message;\n}"}',
  '[{"input": [{"message": "Invalid"}], "expected": "Invalid"}, {"input": [{"error": "Unauthorized"}], "expected": "Unauthorized"}, {"input": ["Something broke"], "expected": "Something broke"}, {"input": [{}], "expected": "Unknown error"}]',
  ARRAY['Error shaping', 'Defensive checks', 'Consistent frontend error display'],
  12, true, 'code', 'javascript', 'test_cases', true
);

-- Challenge 5: Fix Rate Limiter Counter
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Fix Rate Limiter Logic',
  'intermediate-rate-limiter',
  E'## 🏭 Scenario\n\nThe analytics endpoint is getting spammed because the rate limiter threshold check is incorrect.\n\n## 🐛 The Bug\n\nThe condition blocks at >= limit, which is correct, but the logic needs to account for the current request count properly.\n\n## 📋 Requirements\n\n- Allow requests when count < limit\n- Block requests when count >= limit\n- Handle edge case when count equals limit\n\n## 🎯 Your Task\n\nVerify the rate limiter threshold logic is working correctly.',
  'medium', 'javascript', 'intermediate', 5, 100,
  '{"javascript": "export function rateLimit(count, limit) {\n  // BUG: resets at wrong threshold\n  if (count >= limit) {\n    return \"BLOCKED\";\n  }\n  return \"OK\";\n}"}',
  '[{"input": [0, 3], "expected": "OK"}, {"input": [2, 3], "expected": "OK"}, {"input": [3, 3], "expected": "BLOCKED"}, {"input": [5, 3], "expected": "BLOCKED"}]',
  ARRAY['Understand thresholds', 'Preventing abuse', 'Handling edge conditions'],
  10, true, 'code', 'javascript', 'test_cases', true
);

-- Challenge 6: Fix Config Merging Logic
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Fix Config Deep Merge',
  'intermediate-config-merge',
  E'## 🏭 Scenario\n\nMultiple config files need to merge, but nested objects are being completely overridden instead of merged deeply.\n\n## 🐛 The Bug\n\nSpread operator only does shallow merge. When override has a nested object, it completely replaces the base nested object.\n\n## 📋 Requirements\n\n- Merge nested objects deeply\n- Override specific nested keys while preserving others\n- Maintain top-level keys from both objects\n\n## 🎯 Your Task\n\nImplement deep merge logic for config objects.',
  'medium', 'javascript', 'intermediate', 6, 100,
  '{"javascript": "export function mergeConfig(base, override) {\n  // BUG: override erases entire nested objects\n  return { ...base, ...override };\n}"}',
  '[{"input": [{"a": 1, "nested": {"x": 1, "y": 2}}, {"nested": {"x": 3}}], "expected": {"a": 1, "nested": {"x": 3, "y": 2}}}]',
  ARRAY['Shallow vs deep merge', 'Handling nested configs'],
  15, true, 'code', 'javascript', 'ai_only', false
);

-- Challenge 7: Fix UUID Generator Fallback
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Fix UUID Generator Fallback',
  'intermediate-uuid-generator',
  E'## 🏭 Scenario\n\nIf native crypto.randomUUID() fails, the fallback must generate a valid unique ID. Currently it returns a plain number which causes collisions.\n\n## 🐛 The Bug\n\nMath.random() returns a number like 0.123456, not a unique string ID. This causes ID collisions in production.\n\n## 📋 Requirements\n\n- Try crypto.randomUUID() first\n- On failure, generate a fallback UUID-like string\n- Format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx\n- Use Date.now() + Math.random() for uniqueness\n\n## 🎯 Your Task\n\nImplement a production-safe fallback ID generator.',
  'medium', 'javascript', 'intermediate', 7, 100,
  '{"javascript": "export function generateId() {\n  try {\n    return crypto.randomUUID();\n  } catch (e) {\n    // BUG: invalid fallback\n    return Math.random();\n  }\n}"}',
  '[{"input": [], "expected": "string"}]',
  ARRAY['Prepared fallbacks', 'Unique keys generation', 'Production-safe identifiers'],
  15, true, 'code', 'javascript', 'ai_only', false
);

-- Challenge 8: Fix Search Filter Logic (Multiple Filters)
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Fix Multi-Filter Search',
  'intermediate-search-filter',
  E'## 🏭 Scenario\n\nThe search panel applies only ONE filter while the UI shows multiple filters as active. Users expect AND logic between filters.\n\n## 🐛 The Bug\n\nThe function only filters by name, ignoring all other filter properties like active status.\n\n## 📋 Requirements\n\n- Apply ALL filters provided\n- Use AND logic (user must match all filters)\n- Handle optional filters (undefined/null)\n- Filter by name if provided, active status if provided, etc.\n\n## 🎯 Your Task\n\nImplement combined filter logic that respects all filter fields.',
  'medium', 'javascript', 'intermediate', 8, 100,
  '{"javascript": "export function filterUsers(users, filters) {\n  // BUG: applies only name filter\n  return users.filter(u => u.name.includes(filters.name || \"\"));\n}"}',
  '[{"input": [[{"name": "Alice", "active": true}, {"name": "Bob", "active": false}], {"active": true}], "expected": [{"name": "Alice", "active": true}]}, {"input": [[{"name": "Alice", "active": true}, {"name": "Alicia", "active": false}], {"name": "Ali"}], "expected": [{"name": "Alice", "active": true}, {"name": "Alicia", "active": false}]}]',
  ARRAY['Combining filters', 'Real search panel logic', 'Boolean AND logic'],
  15, true, 'code', 'javascript', 'test_cases', false
);

-- Challenge 9: Fix Notification Sorting (Timestamp Bug)
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Fix Notification Timestamp Sort',
  'intermediate-notification-sort',
  E'## 🏭 Scenario\n\nNotifications appear in random order because timestamps are being sorted as strings instead of numbers.\n\n## 🐛 The Bug\n\nThe comparison uses string comparison (>) instead of numeric subtraction, causing incorrect sorting.\n\n## 📋 Requirements\n\n- Sort notifications by timestamp (newest first)\n- Use numeric comparison: b.timestamp - a.timestamp\n- Larger timestamps should appear first\n\n## 🎯 Your Task\n\nFix the sort comparator to use numeric comparison instead of string comparison.',
  'medium', 'javascript', 'intermediate', 9, 100,
  '{"javascript": "export function sortNotifications(items) {\n  // BUG: string-based sort\n  return items.sort((a, b) => a.timestamp > b.timestamp ? -1 : 1);\n}"}',
  '[{"input": [[{"msg": "A", "timestamp": 100}, {"msg": "B", "timestamp": 200}, {"msg": "C", "timestamp": 150}]], "expected": [{"msg": "B", "timestamp": 200}, {"msg": "C", "timestamp": 150}, {"msg": "A", "timestamp": 100}]}]',
  ARRAY['Numeric timestamp sorting', 'Real production notifications ordering bug'],
  12, true, 'code', 'javascript', 'test_cases', false
);

-- Challenge 10: Fix Async Retry Logic (Real Backend Issue)
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Fix Async Retry Logic',
  'intermediate-async-retry',
  E'## 🏭 Scenario\n\nA service retries failed API calls, but there is no delay between retries, causing instant hammering of the failing endpoint.\n\n## 🐛 The Bug\n\nThere is no delay between retry attempts. The function should wait before retrying to avoid overwhelming the failing service.\n\n## 📋 Requirements\n\n- Add delay between retry attempts\n- Use exponential backoff (delay increases each retry)\n- Wait at least 100ms before first retry, 200ms before second, etc.\n- Keep retry loop logic\n\n## 🎯 Your Task\n\nAdd proper delay logic between retry attempts using setTimeout or a delay helper.',
  'medium', 'javascript', 'intermediate', 10, 100,
  '{"javascript": "export async function retry(fn, retries) {\n  for (let i = 0; i < retries; i++) {\n    try {\n      return await fn();\n    } catch (e) {\n      // BUG: no delay between retries\n      continue;\n    }\n  }\n  throw new Error(\"Failed\");\n}"}',
  '[{"input": ["async function", 3], "expected": "async"}]',
  ARRAY['Async logic', 'Retry patterns', 'Production recovery logic'],
  18, true, 'code', 'javascript', 'ai_only', false
);

-- ============================================================================
-- VERIFICATION QUERIES (commented out to avoid migration errors)
-- Run these manually in Supabase SQL Editor after migration
-- ============================================================================

-- Check all intermediate challenges
-- SELECT
--   order_in_tier,
--   title,
--   slug,
--   points,
--   validation_type,
--   is_active
-- FROM challenges
-- WHERE tier = 'intermediate' AND is_active = TRUE
-- ORDER BY order_in_tier;

-- Count total intermediate challenges
-- SELECT COUNT(*) as total_intermediate_challenges
-- FROM challenges
-- WHERE tier = 'intermediate' AND is_active = TRUE;
