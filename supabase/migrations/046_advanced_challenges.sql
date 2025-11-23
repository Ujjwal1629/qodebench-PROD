-- =============================================
-- Migration: Add 5 Advanced Challenges
-- Description: Real-world multi-layer debugging scenarios with office simulation
-- Version: 046
-- Date: 2025-01-21
-- =============================================

-- Challenge 1: User Onboarding Pipeline Corruption
-- (Broken multi-layer Mongo pipeline + masking logic bug)
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'User Onboarding Pipeline Corruption',
  'adv-onboarding-pipeline',
  E'## 🧑‍💼 CTO MESSAGE\n\nWe''re losing 12% of new signups.\nThe onboarding API is returning corrupted profile data for some users.\nMarketing escalated it, and PM wants a hotfix today.\n\n## 📝 JIRA TICKET\n\n**Ticket:** CB-ADV-101\n**Summary:** User onboarding payload is corrupted\n**Priority:** High\n**Reporter:** CTO\n\n## 🐛 Description\n\nYour onboarding API returns malformed user profiles.\nMarketing says new signup conversion dropped.\nFix the entire transformation pipeline across DB, utils, and service logic.\n\n## ✅ Expected Behavior\n\n1. Fetch user by ID\n2. Normalize fields (id, name, age, emailMasked)\n3. Mask email correctly (first char + ****)\n4. Compute correct age\n5. Determine eligibility (18+ = ELIGIBLE)\n6. Return final structured JSON\n\n## ❌ Actual Behavior\n\n- Missing name field\n- Wrong age calculation\n- Email mask broken\n- Eligibility score logic inverted\n\n## 📋 Acceptance Criteria\n\n- `getUserById()` must return correct user\n- `normalizeUser()` must return { id, name, age, emailMasked }\n- `calculateEligibility()` must process correctly (18+ = ELIGIBLE)\n- `buildResponse()` must merge all layers\n- Final output must be stable & match tests',
  'hard', 'javascript', 'advanced', 1, 150,
  '{"javascript": "// ----------------------------\n// db.js – simulated datastore\n// ----------------------------\nconst USERS = [\n  { id: 1, name: \"Alice\", birthYear: 2000, email: \"alice@mail.com\" },\n  { id: 2, name: \"Bob\",   birthYear: 1995, email: \"bob@mail.com\" }\n];\n\nfunction getUserById(id) {\n  // BUG: incorrect filtering\n  return USERS.find(u => u.id === 0) || null;\n}\n\n\n// ----------------------------\n// utils.js – transformation logic\n// ----------------------------\nfunction normalizeUser(user) {\n  if (!user) return null;\n\n  // BUGS:\n  const age = 2024 - (user.birthYear + 1);\n  const maskedEmail = user.email[0] + \"*****\";\n\n  return {\n    id: user.id,\n    name: null, // wrong\n    age,\n    emailMasked: maskedEmail\n  };\n}\n\n\n// ----------------------------\n// service.js – business logic\n// ----------------------------\nfunction calculateEligibility(age) {\n  // BUG: wrong logic\n  return age < 18 ? \"ELIGIBLE\" : \"BLOCKED\";\n}\n\nfunction buildResponse(user) {\n  const normalized = normalizeUser(user);\n  if (!normalized) return null;\n\n  return {\n    user: normalized,\n    eligibility: calculateEligibility(normalized.age)\n  };\n}\n\n\n// ----------------------------\n// controller.js – ENTRY POINT\n// ----------------------------\nexport function solution(id) {\n  const user = getUserById(id);\n  if (!user) return null;\n\n  return buildResponse(user);\n}"}',
  '[{"input": [1], "expected": {"user": {"id": 1, "name": "Alice", "age": 24, "emailMasked": "a****"}, "eligibility": "ELIGIBLE"}, "description": "Fetch and process Alice (age 24)"}, {"input": [2], "expected": {"user": {"id": 2, "name": "Bob", "age": 29, "emailMasked": "b****"}, "eligibility": "ELIGIBLE"}, "description": "Fetch and process Bob (age 29)"}, {"input": [999], "expected": null, "description": "Non-existent user returns null"}]',
  ARRAY['Multi-layer debugging', 'Transformation pipeline understanding', 'Email masking', 'Age calculation', 'Business rule validation'],
  30, true, 'code', 'javascript', 'test_cases', false
);

-- Challenge 2: Broken Payment Ledger Reconciliation
-- (Multi-layer finance bug + aggregation issues)
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Broken Payment Ledger Reconciliation',
  'adv-ledger-reconciliation',
  E'## 🧑‍💼 CTO MESSAGE\n\nThe finance team reports mismatched numbers in the monthly ledger.\nThe reconciliation script is returning wrong totals and duplicate entries.\nFix it before finance closes their books.\n\n## 📝 JIRA TICKET\n\n**Ticket:** CB-ADV-102\n**Summary:** Ledger reconciliation returning incorrect totals\n**Priority:** Critical\n\n## 🐛 Description\n\nFinance team reports mismatched monthly totals.\nYour ledger reconciliation process is broken, and duplicates create wrong totals.\n\n## ✅ Expected Behavior\n\n1. Remove duplicate transactions (by ID)\n2. Sum amounts by category\n3. Return accurate totals\n\n## ❌ Actual Behavior\n\n- Duplicates are not removed\n- Category totals are overwritten instead of summed\n\n## 📋 Acceptance Criteria\n\n- `dedupe()` must remove duplicate entries by ID\n- `sumByCategory()` must sum amounts, not overwrite\n- `solution()` must return correct totals per category\n- food: 150 (100 + 50, after removing duplicate)\n- travel: 300',
  'hard', 'javascript', 'advanced', 2, 150,
  '{"javascript": "// db.js\nconst TXNS = [\n  { id: 1, category: \"food\", amount: 100 },\n  { id: 1, category: \"food\", amount: 100 }, // duplicate\n  { id: 2, category: \"travel\", amount: 300 },\n  { id: 3, category: \"food\", amount: 50 }\n];\n\nfunction dedupe(list) {\n  // BUG: fails dedupe\n  return list;\n}\n\nfunction sumByCategory(list) {\n  const result = {};\n  for (const t of list) {\n    // BUG: overwrites instead of adding\n    result[t.category] = t.amount;\n  }\n  return result;\n}\n\nexport function solution() {\n  const clean = dedupe(TXNS);\n  return sumByCategory(clean);\n}"}',
  '[{"input": [], "expected": {"food": 150, "travel": 300}, "description": "Reconciled ledger with correct totals"}]',
  ARRAY['Deduplication', 'Aggregations', 'Financial correctness', 'Data integrity handling'],
  25, true, 'code', 'javascript', 'test_cases', false
);

-- Challenge 3: Notification Delivery Breakdown
-- (Queue + batching logic defective)
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Notification Delivery Breakdown',
  'adv-notification-delivery',
  E'## 🧑‍💼 CTO MESSAGE\n\nNotifications have a 40% failure rate.\nSome users are receiving no messages at all, others are getting duplicates.\nFix the queue batching logic ASAP.\n\n## 📝 JIRA TICKET\n\n**Ticket:** CB-ADV-103\n**Summary:** Notification delivery failing for 40% of users\n**Priority:** High\n\n## 🐛 Description\n\nNotifications are sending duplicates, wrong grouping, missing messages, etc.\n\n## ✅ Expected Behavior\n\n1. Group notifications by userId\n2. Remove duplicate messages per user\n3. Maintain message ordering\n4. Return map of userId → unique messages\n\n## ❌ Actual Behavior\n\n- Events grouped by message instead of user\n- Duplicates not removed\n- Output structure is wrong\n\n## 📋 Acceptance Criteria\n\n- Group by userId, not by message\n- Remove duplicate messages per user\n- Output: { \"1\": [\"A\", \"C\"], \"2\": [\"B\"] }\n- Ordering must be preserved',
  'hard', 'javascript', 'advanced', 3, 150,
  '{"javascript": "const EVENTS = [\n  { userId: 1, msg: \"A\" },\n  { userId: 1, msg: \"A\" }, // duplicate\n  { userId: 2, msg: \"B\" },\n  { userId: 1, msg: \"C\" }\n];\n\nfunction group(events) {\n  // BUG: groups by msg incorrectly\n  const out = {};\n  for (const e of events) {\n    out[e.msg] = [e.userId];\n  }\n  return out;\n}\n\nfunction dedupe(list) {\n  // BUG\n  return list;\n}\n\nexport function solution() {\n  const grouped = {};\n\n  for (const e of EVENTS) {\n    if (!grouped[e.userId]) grouped[e.userId] = [];\n    grouped[e.userId].push(e.msg);\n  }\n\n  return grouped;\n}"}',
  '[{"input": [], "expected": {"1": ["A", "C"], "2": ["B"]}, "description": "Notifications grouped by user with duplicates removed"}]',
  ARRAY['Queue processing', 'Message grouping', 'Deduplication logic', 'Multi-user systems'],
  25, true, 'code', 'javascript', 'test_cases', false
);

-- Challenge 4: Search Relevance Engine Failure
-- (Broken scoring + filter pipeline)
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Search Relevance Engine Failure',
  'adv-search-relevance',
  E'## 🧑‍💼 CTO MESSAGE\n\nSearch is returning irrelevant results.\nPM says the scoring algorithm is broken after last refactor.\nFix search score calculation + filtering pipeline.\n\n## 📝 JIRA TICKET\n\n**Ticket:** CB-ADV-104\n**Summary:** Search relevance scoring broken\n**Priority:** High\n\n## 🐛 Description\n\nYour search engine returns irrelevant results; scoring logic is broken.\n\n## ✅ Expected Behavior\n\n1. Filter items that match the query (case-insensitive)\n2. Score based on relevance (not views)\n3. Return only matching items with relevance scores\n\n## ❌ Actual Behavior\n\n- No filtering applied\n- Score based on views, not relevance\n- All items returned regardless of query\n\n## 📋 Acceptance Criteria\n\n- `filterItems()` must filter by query match (case-insensitive)\n- `score()` must calculate relevance score based on query\n- For query \"app\": Apple → score 2, Application → score 5\n- Banana should NOT be returned for query \"app\"',
  'hard', 'javascript', 'advanced', 4, 150,
  '{"javascript": "const ITEMS = [\n  { name: \"Apple\", views: 100 },\n  { name: \"Application\", views: 50 },\n  { name: \"Banana\", views: 200 }\n];\n\nfunction score(query, item) {\n  // BUG: not using query at all\n  return item.views;\n}\n\nfunction filterItems(query) {\n  // BUG: no filtering\n  return ITEMS;\n}\n\nexport function solution(q) {\n  const filtered = filterItems(q);\n  \n  return filtered.map(i => ({\n    name: i.name,\n    score: score(q, i)\n  }));\n}"}',
  '[{"input": ["app"], "expected": [{"name": "Apple", "score": 2}, {"name": "Application", "score": 5}], "description": "Search for app returns Apple (score 2) and Application (score 5)"}]',
  ARRAY['Query-based scoring', 'Filter logic', 'Search relevance systems'],
  30, true, 'code', 'javascript', 'test_cases', false
);

-- Challenge 5: Role-Based Access System (RBAC) Breakdown
-- (Auth, role validation, permissions engine broken)
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Role-Based Access System (RBAC) Breakdown',
  'adv-rbac-system',
  E'## 🧑‍💼 CTO MESSAGE\n\nUnauthorized users gained access to admin pages.\nRBAC engine is malfunctioning.\nFix role resolution + permission mapping.\n\n## 📝 JIRA TICKET\n\n**Ticket:** CB-ADV-105\n**Summary:** RBAC permissions check failing\n**Priority:** Critical (Security)\n\n## 🐛 Description\n\nUnauthorized users gained access. Fix RBAC lookup and permissions.\n\n## ✅ Expected Behavior\n\n1. Get user by ID\n2. Get permissions array for user''s role\n3. Check if action exists in permissions array\n4. Return true/false\n\n## ❌ Actual Behavior\n\n- User lookup broken (finds by role, not ID)\n- Returns entire permissions object instead of array\n- Access check crashes or returns wrong result\n\n## 📋 Acceptance Criteria\n\n- `getUser()` must find user by ID\n- `getPermissions()` must return array for the role\n- `solution(1, \"delete\")` → true (admin)\n- `solution(2, \"delete\")` → false (editor)\n- `solution(3, \"write\")` → false (user)\n- `solution(3, \"read\")` → true (user)',
  'hard', 'javascript', 'advanced', 5, 150,
  '{"javascript": "const USERS = [\n  { id: 1, role: \"admin\" },\n  { id: 2, role: \"editor\" },\n  { id: 3, role: \"user\" }\n];\n\nconst PERMS = {\n  admin: [\"read\",\"write\",\"delete\"],\n  editor: [\"read\",\"write\"],\n  user: [\"read\"]\n};\n\nfunction getUser(id) {\n  // BUG: wrong lookup\n  return USERS.find(u => u.role === id);\n}\n\nfunction getPermissions(role) {\n  // BUG: returns whole map\n  return PERMS;\n}\n\nexport function solution(id, action) {\n  const user = getUser(id);\n  if (!user) return false;\n\n  const userPerms = getPermissions(user.role);\n  return userPerms.includes(action);\n}"}',
  '[{"input": [1, "delete"], "expected": true, "description": "Admin can delete"}, {"input": [2, "delete"], "expected": false, "description": "Editor cannot delete"}, {"input": [3, "write"], "expected": false, "description": "User cannot write"}, {"input": [3, "read"], "expected": true, "description": "User can read"}]',
  ARRAY['Role resolution', 'Permission mapping', 'Correct RBAC logic', 'Access control flows'],
  30, true, 'code', 'javascript', 'test_cases', false
);

-- ============================================================================
-- VERIFICATION QUERIES (commented out to avoid migration errors)
-- Run these manually in Supabase SQL Editor after migration
-- ============================================================================

-- Check all advanced challenges
-- SELECT
--   order_in_tier,
--   title,
--   slug,
--   points,
--   validation_type,
--   is_active
-- FROM challenges
-- WHERE tier = 'advanced' AND is_active = TRUE
-- ORDER BY order_in_tier;

-- Count total advanced challenges
-- SELECT COUNT(*) as total_advanced_challenges
-- FROM challenges
-- WHERE tier = 'advanced' AND is_active = TRUE;
