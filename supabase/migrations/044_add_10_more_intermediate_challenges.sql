-- =============================================
-- Migration: Add 10 More Intermediate Challenges
-- Description: Additional real-world intermediate-level bug scenarios
-- Version: 044
-- Date: 2025-01-20
-- =============================================

-- Challenge 11: Fix User Analytics Aggregator (Multiple Functions)
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Fix User Analytics Aggregator',
  'intermediate-analytics-aggregator',
  E'## 🏭 Scenario\n\nAnalytics dashboard showing wrong totals because junior dev messed up aggregation, filtering, and merging logic.\n\n## 🐛 The Bugs\n\n1. filterActive() filters inactive users instead of active\n2. sumAges() sums wrong field (years instead of age)\n3. getAverageAge() uses wrong divisor\n4. All these bugs compound in getAnalytics()\n\n## 📋 Requirements\n\n- Fix filterActive to return users where active === true\n- Fix sumAges to sum the age field (not years)\n- Fix getAverageAge to divide by users.length (not users.length + 10)\n- Ensure getAnalytics returns correct activeCount and avgAge\n\n## 🎯 Your Task\n\nFix all four functions to make the analytics aggregation work correctly.',
  'medium', 'javascript', 'intermediate', 11, 120,
  '{"javascript": "export function filterActive(users) {\n  // BUG: filtering inactive instead of active\n  return users.filter(u => !u.active);\n}\n\nexport function sumAges(users) {\n  // BUG: summing wrong field\n  return users.reduce((a, u) => a + (u.years || 0), 0);\n}\n\nexport function getAverageAge(users) {\n  const total = sumAges(users);\n  // BUG: wrong divisor\n  return total / (users.length + 10);\n}\n\nexport function getAnalytics(users) {\n  const active = filterActive(users);\n  return {\n    activeCount: active.length,\n    avgAge: getAverageAge(active)\n  };\n}"}',
  '[{"input": [[{"name": "A", "age": 20, "active": true}, {"name": "B", "age": 30, "active": false}, {"name": "C", "age": 25, "active": true}]], "expected": {"activeCount": 2, "avgAge": 22.5}}]',
  ARRAY['Multi-function debugging', 'Correct aggregation pipelines', 'Chained logic fixes', 'Real analytics dashboard workflow'],
  20, true, 'code', 'javascript', 'test_cases', false
);

-- Challenge 12: Fix E-commerce Order Processor
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Fix E-commerce Order Processor',
  'intermediate-ecommerce-order',
  E'## 🏭 Scenario\n\nInvoices showing wrong totals because discount, tax, and quantity logic is broken.\n\n## 🐛 The Bugs\n\n1. calculateItemTotal ignores quantity\n2. Discount is added instead of subtracted\n3. Tax calculation is wrong (subtracts instead of adds)\n\n## 📋 Requirements\n\n- Apply quantity: subtotal = price × quantity\n- Apply discount: afterDiscount = subtotal - (subtotal × discount / 100)\n- Apply tax: final = afterDiscount + (afterDiscount × tax / 100)\n- Return correct final total\n\n## 🎯 Your Task\n\nFix the price → quantity → discount → tax → total pipeline.',
  'medium', 'javascript', 'intermediate', 12, 120,
  '{"javascript": "export function calculateItemTotal(item) {\n  // BUG: ignores quantity\n  const subtotal = item.price;\n\n  // BUG: discount added instead of subtracted\n  const afterDiscount = subtotal + (subtotal * item.discount / 100);\n\n  // BUG: wrong tax calculation\n  const final = afterDiscount - item.tax;\n  return final;\n}\n\nexport function calculateOrder(items) {\n  let total = 0;\n  for (const item of items) {\n    total += calculateItemTotal(item);\n  }\n  return total;\n}"}',
  '[{"input": [[{"price": 100, "quantity": 2, "discount": 10, "tax": 18}, {"price": 200, "quantity": 1, "discount": 0, "tax": 36}]], "expected": 418}]',
  ARRAY['Solving multi-step business logic', 'Fixing price calculation pipeline', 'Real e-commerce production logic'],
  20, true, 'code', 'javascript', 'test_cases', false
);

-- Challenge 13: Fix API Response Normalizer (Nested Fields)
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Fix API Response Normalizer',
  'intermediate-api-normalizer',
  E'## 🏭 Scenario\n\nYour backend returns inconsistent shapes; the normalizer MUST clean them.\n\n## 🐛 The Bugs\n\n1. ID field could be either uid or id\n2. Active status returns "yes" instead of false for inactive users\n3. Missing null handling for nested membership.planName\n\n## 📋 Requirements\n\n- Try raw.id first, fallback to raw.uid\n- Convert status: "active" → true, anything else → false\n- Handle missing membership object safely\n- Return plan as null if membership is empty\n\n## 🎯 Your Task\n\nImplement robust normalization that handles all backend inconsistencies.',
  'medium', 'javascript', 'intermediate', 13, 120,
  '{"javascript": "export function normalizeUser(raw) {\n  return {\n    id: raw.uid,  // BUG: sometimes id is raw.id\n    name: raw.fullName || raw.name || null,\n    email: raw.emailId,\n    plan: raw.membership?.planName,\n    active: raw.status === \"active\" ? true : \"yes\"   // BUG: wrong fallback\n  };\n}\n\nexport function normalizeResponse(response) {\n  return response.users.map(u => normalizeUser(u));\n}"}',
  '[{"input": [{"users": [{"id": 1, "name": "A", "emailId": "a@mail.com", "membership": {"planName": "pro"}, "status": "active"}, {"uid": 2, "fullName": "B", "emailId": "b@mail.com", "membership": {}, "status": "inactive"}]}], "expected": [{"id": 1, "name": "A", "email": "a@mail.com", "plan": "pro", "active": true}, {"id": 2, "name": "B", "email": "b@mail.com", "plan": null, "active": false}]}]',
  ARRAY['Handling inconsistent backend shapes', 'Nested data access', 'Defensive programming'],
  20, true, 'code', 'javascript', 'test_cases', false
);

-- Challenge 14: Fix State Machine (Signup Flow)
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Fix State Machine Signup Flow',
  'intermediate-state-machine',
  E'## 🏭 Scenario\n\nSignup flow state machine transitions are broken - users are stuck in loops.\n\n## 🐛 The Bugs\n\n1. From "verify" state, should go to "details" but goes back to "start"\n2. From "details" state, should go to "review" but goes to "start"\n\n## 📋 Requirements\n\nCorrect flow:\n- start → verify\n- verify → details\n- details → review\n- review → complete (optional)\n\n## 🎯 Your Task\n\nFix the state transition logic to follow the correct signup flow.',
  'medium', 'javascript', 'intermediate', 14, 100,
  '{"javascript": "export function nextStep(current, action) {\n  if (current === \"start\") {\n    return \"verify\";\n  }\n\n  if (current === \"verify\") {\n    // BUG: goes back instead of forward\n    return \"start\";\n  }\n\n  if (current === \"details\") {\n    // BUG: should go to \"review\"\n    return \"start\";\n  }\n\n  return \"start\";\n}\n\nexport function runFlow(actions) {\n  let state = \"start\";\n  for (const a of actions) {\n    state = nextStep(state, a);\n  }\n  return state;\n}"}',
  '[{"input": [["continue", "continue", "continue"]], "expected": "review"}]',
  ARRAY['State machines', 'Transition logic', 'Onboarding workflow issues'],
  15, true, 'code', 'javascript', 'test_cases', false
);

-- Challenge 15: Fix Log Grouping (Backend Logs Processor)
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Fix Log Grouping Processor',
  'intermediate-log-grouping',
  E'## 🏭 Scenario\n\nDevOps team complains that logs are NOT getting grouped by level.\n\n## 🐛 The Bugs\n\n1. Reading log.type instead of log.level\n2. Overwriting result[level] instead of pushing to array\n\n## 📋 Requirements\n\n- Group logs by their level property\n- Each level should have an array of all matching logs\n- Don\'t overwrite - accumulate logs into arrays\n\n## 🎯 Your Task\n\nImplement proper log grouping by level with array accumulation.',
  'medium', 'javascript', 'intermediate', 15, 120,
  '{"javascript": "export function groupLogs(logs) {\n  const result = {};\n\n  for (const log of logs) {\n    // BUG: wrong log.level path\n    const level = log.type || \"info\";\n\n    // BUG: overwriting instead of pushing\n    result[level] = log;\n  }\n\n  return result;\n}"}',
  '[{"input": [[{"level": "info", "msg": "A"}, {"level": "error", "msg": "B"}, {"level": "info", "msg": "C"}]], "expected": {"info": [{"level": "info", "msg": "A"}, {"level": "info", "msg": "C"}], "error": [{"level": "error", "msg": "B"}]}}]',
  ARRAY['Object grouping', 'Avoid overwriting logic', 'Real DevOps/logging pipeline'],
  18, true, 'code', 'javascript', 'test_cases', false
);

-- Challenge 16: Fix Transform + Filter Pipeline
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Fix Transform + Filter Pipeline',
  'intermediate-transform-filter',
  E'## 🏭 Scenario\n\nThe transformation pipeline returns incomplete + wrongly filtered data.\n\n## 🐛 The Bugs\n\n1. transform() uses wrong field name: u.isActive instead of u.active\n2. filterAdults() filters wrong direction (keeping under 18 instead of 18+)\n\n## 📋 Requirements\n\n- Transform: lowercase name, copy age, map isActive → active\n- Filter: keep only users with age > 18\n- Pipeline: transform first, then filter\n\n## 🎯 Your Task\n\nFix the transform and filter functions to work correctly together.',
  'medium', 'javascript', 'intermediate', 16, 120,
  '{"javascript": "export function transform(u) {\n  return {\n    name: u.name.toLowerCase(),\n    age: u.age,\n    active: u.isActive  // BUG: wrong field name\n  };\n}\n\nexport function filterAdults(users) {\n  // BUG: filtering under 18 incorrectly\n  return users.filter(u => u.age <= 18);\n}\n\nexport function process(users) {\n  const t = users.map(transform);\n  return filterAdults(t);\n}"}',
  '[{"input": [[{"name": "A", "age": 20, "isActive": true}, {"name": "B", "age": 16, "isActive": false}]], "expected": [{"name": "a", "age": 20, "active": true}]}]',
  ARRAY['Fixing full data pipelines', 'Transform then filter sequence', 'Production-level mapping flow'],
  18, true, 'code', 'javascript', 'test_cases', false
);

-- Challenge 17: Fix CSV Exporter
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Fix CSV Exporter',
  'intermediate-csv-exporter',
  E'## 🏭 Scenario\n\nCSV is corrupted because quoting, ordering, and separator logic is wrong.\n\n## 🐛 The Bug\n\nValues containing commas (like "John, Jr") break CSV structure because they are not quoted.\n\n## 📋 Requirements\n\n- Wrap values containing commas in double quotes\n- Keep header row\n- Remove trailing newline\n- Maintain column order\n\n## 🎯 Your Task\n\nImplement proper CSV value quoting for values containing commas.',
  'medium', 'javascript', 'intermediate', 17, 120,
  '{"javascript": "export function convertToCSV(rows) {\\n  let csv = \"\";\\n\\n  const headers = Object.keys(rows[0]);\\n  csv += headers.join(\",\") + \"\\\\n\";\\n\\n  for (const r of rows) {\\n    // BUG: values may contain commas → need quotes\\n    csv += Object.values(r).join(\",\") + \"\\\\n\";\\n  }\\n\\n  // BUG: missing trim/newline cleanup\\n  return csv;\\n}"}',
  '[]',
  ARRAY['CSV formatting', 'Handling commas inside values', 'Proper newline management'],
  20, true, 'code', 'javascript', 'ai_only', false
);

-- Challenge 18: Fix Multi-Level Category Flattener
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Fix Multi-Level Category Flattener',
  'intermediate-category-flattener',
  E'## 🏭 Scenario\n\nCategory tree must be flattened for a dropdown menu, but order is wrong.\n\n## 🐛 The Bug\n\nThe function only handles 2 levels deep. Categories nested deeper than that are ignored.\n\n## 📋 Requirements\n\n- Flatten ALL levels of nesting (use recursion)\n- Maintain depth-first order (A → B → C)\n- Handle categories without children\n- Return flat array of category names\n\n## 🎯 Your Task\n\nImplement recursive flattening to handle unlimited nesting depth.',
  'medium', 'javascript', 'intermediate', 18, 120,
  '{"javascript": "export function flattenCategories(categories) {\n  let result = [];\n\n  for (const c of categories) {\n    result.push(c.name);\n\n    // BUG: ignores nested categories deeper than 1 level\n    if (c.children) {\n      for (const child of c.children) {\n        result.push(child.name);\n      }\n    }\n  }\n\n  return result;\n}"}',
  '[{"input": [[{"name": "A", "children": [{"name": "B", "children": [{"name": "C"}]}]}]], "expected": ["A", "B", "C"]}]',
  ARRAY['Recursion basics', 'Tree flattening', 'UI category structure handling'],
  20, true, 'code', 'javascript', 'test_cases', false
);

-- Challenge 19: Fix Token Expiry Checker
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Fix Token Expiry Checker',
  'intermediate-token-expiry',
  E'## 🏭 Scenario\n\nAuth token expiration check is broken, causing forced logouts.\n\n## 🐛 The Bug\n\nThe comparison direction is reversed. token.exp > Date.now() returns true when token is still valid, but function treats it as expired.\n\n## 📋 Requirements\n\n- Token is expired when: token.exp < Date.now()\n- Token is valid when: token.exp >= Date.now()\n- Return "EXPIRED" or "VALID" accordingly\n\n## 🎯 Your Task\n\nFix the timestamp comparison logic.',
  'medium', 'javascript', 'intermediate', 19, 100,
  '{"javascript": "export function isExpired(token) {\n  // BUG: wrong comparison direction\n  return token.exp > Date.now();\n}\n\nexport function validateToken(token) {\n  if (isExpired(token)) {\n    return \"EXPIRED\";\n  }\n  return \"VALID\";\n}"}',
  '[{"input": [{"exp": 1000}], "mockNow": 2000, "expected": "EXPIRED"}, {"input": [{"exp": 5000}], "mockNow": 2000, "expected": "VALID"}]',
  ARRAY['Timestamp comparisons', 'Authentication flow basics'],
  12, true, 'code', 'javascript', 'test_cases', false
);

-- Challenge 20: Fix Notification Merging (Duplicate Removal)
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Fix Notification Merging',
  'intermediate-notification-merge',
  E'## 🏭 Scenario\n\nDuplicate notifications show up because merge logic is wrong.\n\n## 🐛 The Bugs\n\n1. Simply concatenates arrays without deduplication\n2. Deduplicates by message instead of by id\n\n## 📋 Requirements\n\n- Merge both arrays\n- Remove duplicates based on id (not message)\n- Preserve original order\n- Keep first occurrence of each unique id\n\n## 🎯 Your Task\n\nImplement proper id-based deduplication for notification merging.',
  'medium', 'javascript', 'intermediate', 20, 120,
  '{"javascript": "export function mergeNotifications(oldList, newList) {\n  // BUG: simply concatenates → duplicates\n  const merged = oldList.concat(newList);\n\n  // BUG: wrong dedupe (based on msg only)\n  const unique = [];\n  for (const n of merged) {\n    if (!unique.find(u => u.msg === n.msg)) {\n      unique.push(n);\n    }\n  }\n\n  return unique;\n}"}',
  '[{"input": [[{"id": 1, "msg": "A"}, {"id": 2, "msg": "B"}], [{"id": 2, "msg": "B"}, {"id": 3, "msg": "C"}]], "expected": [{"id": 1, "msg": "A"}, {"id": 2, "msg": "B"}, {"id": 3, "msg": "C"}]}]',
  ARRAY['Merge + dedup flow', 'Handling multiple keys (id-based)', 'Notification systems'],
  20, true, 'code', 'javascript', 'test_cases', false
);

-- ============================================================================
-- VERIFICATION QUERIES (commented out to avoid migration errors)
-- Run these manually in Supabase SQL Editor after migration
-- ============================================================================

-- Check all intermediate challenges (should show 20 total)
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
