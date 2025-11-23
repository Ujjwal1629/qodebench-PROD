-- =============================================
-- Migration: Add Advanced Challenges 11-20
-- Description: Additional real-world debugging scenarios
-- Version: 048
-- Date: 2025-01-21
-- =============================================

-- Challenge 11: Distributed Rate Limiter Collapse
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Distributed Rate Limiter Collapse',
  'adv-rate-limiter',
  E'## 🧑‍💼 CTO MESSAGE\n\nGlobal API throttling is failing. Users in Asia aren''t rate-limited, and US users are blocked too early.\n\n## 📝 JIRA TICKET\n\n**Ticket:** CB-ADV-301\n**Summary:** Distributed rate limiter not applying correct thresholds\n**Priority:** P1 — API Abuse Risk\n\n## 🐛 Description\n\nRegion buckets are wrong, counters aren''t isolated, and threshold comparison is reversed.\n\n## ✅ Expected Behavior\n\n1. Keep region-specific counters\n2. Compare count > limit\n3. Reset counter after block\n4. Return "BLOCKED" or "ALLOWED"\n\n## ❌ Actual Behavior\n\n- Counters shared across all regions\n- >= used instead of >\n- Never resets\n\n## 📋 Acceptance Criteria\n\n- Each region must have its own counter bucket\n- Block when count > limit (not >=)\n- After 3 requests with limit=3, 4th request should be BLOCKED',
  'hard', 'javascript', 'advanced', 11, 150,
  '{"javascript": "// ----------------------------\n// buckets.js – rate limit buckets\n// ----------------------------\nexport const BUCKETS = {\n  us: 0,\n  eu: 0,\n  in: 0\n};\n\n\n// ----------------------------\n// limiter.js – rate limiter\n// ----------------------------\nexport function isBlocked(region, limit) {\n  // BUG: region ignored, using single bucket\n  const count = BUCKETS[\"us\"];\n\n  // BUG: wrong threshold comparison\n  if (count >= limit) return \"BLOCKED\";\n\n  BUCKETS[\"us\"]++;\n  return \"ALLOWED\";\n}\n\n\nexport function solution(region, limit) {\n  return isBlocked(region, limit);\n}"}',
  '[{"input": ["us", 3], "expected": "ALLOWED", "description": "First request allowed"}, {"input": ["us", 3], "expected": "ALLOWED", "description": "Second request allowed"}, {"input": ["us", 3], "expected": "ALLOWED", "description": "Third request allowed"}, {"input": ["us", 3], "expected": "BLOCKED", "description": "Fourth request blocked"}]',
  ARRAY['Rate limiting', 'Region isolation', 'Off-by-one logic', 'Distributed API protection'],
  25, true, 'code', 'javascript', 'test_cases', false
);

-- Challenge 12: Broken Order Reconciliation Engine
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Broken Order Reconciliation Engine',
  'adv-order-reconciliation',
  E'## 🧑‍💼 CTO MESSAGE\n\nFinance escalated: monthly order reports don''t match Stripe totals.\n\n## 📝 JIRA TICKET\n\n**Ticket:** CB-ADV-302\n**Summary:** Order reconciliation engine corrupting totals\n**Priority:** P0 — Financial Impact\n\n## 🐛 Description\n\nMerges orders incorrectly, grouping by wrong field.\n\n## ✅ Expected Behavior\n\n1. Merge orders by orderId\n2. Sum all payments\n3. Handle refunds correctly\n4. Return object with orderId as key and net total as value\n\n## ❌ Actual Behavior\n\n- Grouping by userId (which doesn''t exist)\n- Negative totals appearing\n- Orders not grouped correctly\n\n## 📋 Acceptance Criteria\n\n- Group by orderId (not userId)\n- Order 1: 100 - 100 + 100 = 100 (net)\n- Order 2: 200 (no refunds)\n- Return: { "1": 100, "2": 200 }',
  'hard', 'javascript', 'advanced', 12, 150,
  '{"javascript": "// ----------------------------\n// data.js – order data\n// ----------------------------\nconst ORDERS = [\n  { orderId: 1, amount: 100, type: \"payment\" },\n  { orderId: 1, amount: -100, type: \"refund\" },\n  { orderId: 1, amount: 100, type: \"payment\" },\n  { orderId: 2, amount: 200, type: \"payment\" }\n];\n\n\n// ----------------------------\n// reconcile.js – reconciliation logic\n// ----------------------------\nexport function reconcile() {\n  const result = {};\n\n  for (const o of ORDERS) {\n    // BUG: grouping by userId (doesn''t exist)\n    if (!result[o.userId]) result[o.userId] = 0;\n\n    // BUG: applies refunds incorrectly\n    result[o.userId] += o.amount;\n  }\n\n  return result;\n}\n\n\nexport function solution() {\n  return reconcile();\n}"}',
  '[{"input": [], "expected": {"1": 100, "2": 200}, "description": "Orders reconciled correctly by orderId"}]',
  ARRAY['Financial correctness', 'Deduplication', 'Grouping logic', 'Refund handling'],
  25, true, 'code', 'javascript', 'test_cases', false
);

-- Challenge 13: Webhook Retry Engine Malfunction
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Webhook Retry Engine Malfunction',
  'adv-webhook-retry',
  E'## 🧑‍💼 CTO MESSAGE\n\nExternal payment provider complains we''re spamming retries.\n\n## 📝 JIRA TICKET\n\n**Ticket:** CB-ADV-303\n**Summary:** Webhook retry logic never stops looping\n**Priority:** P1 — External Integration\n\n## 🐛 Description\n\nRetry counter never increases, causing infinite retry loops.\n\n## ✅ Expected Behavior\n\n1. Increment retry counter on each attempt\n2. Stop after 3 retries\n3. First call: "RETRYING" (retries: 0 → 1)\n4. Continue until retries >= 3\n5. Then return "STOP"\n\n## ❌ Actual Behavior\n\n- Retry counter never updated\n- Infinite loop potential\n- External services get spammed\n\n## 📋 Acceptance Criteria\n\n- Increment job.retries each attempt\n- First 3 calls return "RETRYING"\n- 4th call returns "STOP"',
  'hard', 'javascript', 'advanced', 13, 150,
  '{"javascript": "// ----------------------------\n// queue.js – webhook job queue\n// ----------------------------\nconst QUEUE = [\n  { id: 1, retries: 0, status: \"FAILED\" }\n];\n\n\n// ----------------------------\n// retry.js – retry logic\n// ----------------------------\nexport function retryWebhook(job) {\n  // BUG: retry counter never increases\n  while (job.status === \"FAILED\" && job.retries < 3) {\n    // BUG: job.retries not updated\n    // simulate retry\n    return \"RETRYING\";\n  }\n  return \"STOP\";\n}\n\n\nexport function solution() {\n  const job = QUEUE[0];\n  return retryWebhook(job);\n}"}',
  '[{"input": [], "expected": "RETRYING", "description": "First retry attempt"}, {"input": [], "expected": "RETRYING", "description": "Second retry attempt"}, {"input": [], "expected": "RETRYING", "description": "Third retry attempt"}, {"input": [], "expected": "STOP", "description": "Stop after 3 retries"}]',
  ARRAY['Retry strategy', 'Queue stability', 'Infinite loop prevention', 'Webhook handling'],
  25, true, 'code', 'javascript', 'test_cases', false
);

-- Challenge 14: Broken CSV Import Sanitizer
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Broken CSV Import Sanitizer',
  'adv-csv-sanitizer',
  E'## 🧑‍💼 CTO MESSAGE\n\nCSV imports store corrupt usernames (whitespace, wrong casing, invalid chars).\n\n## 📝 JIRA TICKET\n\n**Ticket:** CB-ADV-304\n**Summary:** Usernames invalid due to broken sanitizer\n**Priority:** High — Data Quality\n\n## 🐛 Description\n\nSanitizer doesn''t properly clean user input from CSV files.\n\n## ✅ Expected Behavior\n\n1. Trim whitespace from both sides\n2. Convert to uppercase\n3. Remove invalid characters (!, @, #, etc.)\n4. Return clean username\n\n## ❌ Actual Behavior\n\n- Only trims left side (trimStart)\n- Converts to lowercase instead of uppercase\n- Doesn''t remove invalid characters\n\n## 📋 Acceptance Criteria\n\n- Input: "  Alice!!" → Output: "ALICE"\n- Remove all non-alphanumeric characters\n- Trim both sides\n- Uppercase result',
  'hard', 'javascript', 'advanced', 14, 150,
  '{"javascript": "// ----------------------------\n// sanitizer.js – input sanitization\n// ----------------------------\nexport function sanitize(user) {\n  // BUG: trims only left side\n  const name = user.name.trimStart();\n\n  // BUG: wrong casing (should uppercase)\n  const cleaned = name.toLowerCase();\n\n  // BUG: not removing invalid chars\n  return cleaned;\n}\n\n\nexport function solution(user) {\n  return sanitize(user);\n}"}',
  '[{"input": [{"name": "  Alice!!"}], "expected": "ALICE", "description": "Sanitize username correctly"}]',
  ARRAY['Input validation', 'Sanitization pipelines', 'CSV import workflows', 'Data cleaning'],
  20, true, 'code', 'javascript', 'test_cases', false
);

-- Challenge 15: Caching Layer Writes Wrong TTL
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Caching Layer Writes Wrong TTL',
  'adv-cache-ttl',
  E'## 🧑‍💼 CTO MESSAGE\n\nSessions never expire. Users remain logged in forever.\n\n## 📝 JIRA TICKET\n\n**Ticket:** CB-ADV-305\n**Summary:** Cache TTL always set to 0\n**Priority:** P1 — Security Risk\n\n## 🐛 Description\n\nCache TTL parameter is ignored, always set to 0.\n\n## ✅ Expected Behavior\n\n1. Accept key, value, and TTL (in seconds)\n2. Store value with correct TTL\n3. Return true on success\n4. TTL should be stored as provided (not 0)\n\n## ❌ Actual Behavior\n\n- TTL parameter ignored\n- Always sets ttl: 0\n- Sessions never expire\n\n## 📋 Acceptance Criteria\n\n- `setWithTTL("token", "abc", 60)` should store { val: "abc", ttl: 60 }\n- TTL must be the value passed in, not hardcoded 0\n- Return object should match: { "val": "abc", "ttl": 60 }',
  'hard', 'javascript', 'advanced', 15, 150,
  '{"javascript": "// ----------------------------\n// cache.js – caching layer\n// ----------------------------\nconst CACHE = {};\n\n\nexport function setWithTTL(key, val, ttlSec) {\n  // BUG: ttl parameter ignored\n  CACHE[key] = { val, ttl: 0 };\n  return true;\n}\n\n\nexport function get(key) {\n  return CACHE[key] || null;\n}\n\n\nexport function solution(key, val, ttlSec) {\n  setWithTTL(key, val, ttlSec);\n  return get(key);\n}"}',
  '[{"input": ["token", "abc", 60], "expected": {"val": "abc", "ttl": 60}, "description": "Store with correct TTL"}]',
  ARRAY['TTL management', 'Session expiry', 'Cache optimization', 'Security'],
  20, true, 'code', 'javascript', 'test_cases', false
);

-- Challenge 16: API Pagination Engine Broken
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'API Pagination Engine Broken',
  'adv-pagination',
  E'## 🧑‍💼 CTO MESSAGE\n\nFrontend loads duplicate pages.\n\n## 📝 JIRA TICKET\n\n**Ticket:** CB-ADV-306\n**Summary:** Pagination uses page number incorrectly\n**Priority:** High — User Experience\n\n## 🐛 Description\n\nPagination logic uses page number as array index instead of calculating offset.\n\n## ✅ Expected Behavior\n\n1. Convert page number to offset: `offset = (page - 1) * size`\n2. Slice array from offset to offset + size\n3. Page 1, size 3 → items 0-2 (indices 0,1,2)\n4. Page 2, size 3 → items 3-5 (indices 3,4,5)\n\n## ❌ Actual Behavior\n\n- Using page as start index directly\n- Page 1 returns [2,3,4] instead of [1,2,3]\n- Wrong items returned\n\n## 📋 Acceptance Criteria\n\n- Page 1, size 3 → [1,2,3]\n- Page 2, size 3 → [4,5,6]\n- Formula: start = (page - 1) * size',
  'hard', 'javascript', 'advanced', 16, 150,
  '{"javascript": "// ----------------------------\n// data.js – sample data\n// ----------------------------\nconst DATA = [1, 2, 3, 4, 5, 6, 7, 8, 9];\n\n\n// ----------------------------\n// paginate.js – pagination logic\n// ----------------------------\nexport function paginate(page, size) {\n  // BUG: using page as index not offset\n  const start = page;\n  return DATA.slice(start, start + size);\n}\n\n\nexport function solution(page, size) {\n  return paginate(page, size);\n}"}',
  '[{"input": [1, 3], "expected": [1, 2, 3], "description": "Page 1 returns first 3 items"}, {"input": [2, 3], "expected": [4, 5, 6], "description": "Page 2 returns next 3 items"}]',
  ARRAY['Page to offset conversion', 'Pagination correctness', 'API design', 'Data slicing'],
  20, true, 'code', 'javascript', 'test_cases', false
);

-- Challenge 17: Feature Flag Resolver Incorrect
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Feature Flag Resolver Incorrect',
  'adv-feature-flags',
  E'## 🧑‍💼 CTO MESSAGE\n\nFeature flags enabling for wrong users.\n\n## 📝 JIRA TICKET\n\n**Ticket:** CB-ADV-307\n**Summary:** Rollout logic uses wrong hashing\n**Priority:** High — Feature Deployment\n\n## 🐛 Description\n\nHash function always returns 1, so all users get same treatment.\n\n## ✅ Expected Behavior\n\n1. Hash userId to get value 0-99\n2. If hash < rollout percentage, enable feature\n3. Rollout 50% means ~50% of users enabled\n4. Different userIds produce different hashes\n\n## ❌ Actual Behavior\n\n- Hash always returns 1\n- All users treated the same\n- Not distributed correctly\n\n## 📋 Acceptance Criteria\n\n- Hash must vary by userId: `hash = userId % 100`\n- User 10, rollout 50 → true (10 < 50)\n- User 99, rollout 10 → false (99 >= 10)',
  'hard', 'javascript', 'advanced', 17, 150,
  '{"javascript": "// ----------------------------\n// feature-flags.js – feature rollout\n// ----------------------------\nexport function shouldEnable(userId, rollout) {\n  // BUG: bad hash (everyone gets same value)\n  const hash = 1;\n\n  return hash < rollout;\n}\n\n\nexport function solution(userId, rollout) {\n  return shouldEnable(userId, rollout);\n}"}',
  '[{"input": [10, 50], "expected": true, "description": "User 10 with 50% rollout enabled"}, {"input": [99, 10], "expected": false, "description": "User 99 with 10% rollout disabled"}]',
  ARRAY['Feature rollouts', 'Hashing strategies', 'Canary deployments', 'A/B testing'],
  25, true, 'code', 'javascript', 'test_cases', false
);

-- Challenge 18: Audit Log Recorder Mishandling Events
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Audit Log Recorder Mishandling Events',
  'adv-audit-log',
  E'## 🧑‍💼 CTO MESSAGE\n\nLogs show duplicated and missing events.\n\n## 📝 JIRA TICKET\n\n**Ticket:** CB-ADV-308\n**Summary:** Audit logger overwriting entries\n**Priority:** P1 — Compliance Risk\n\n## 🐛 Description\n\nAudit logger overwrites previous entries instead of appending.\n\n## ✅ Expected Behavior\n\n1. Store events in arrays by type\n2. Append new events (don''t overwrite)\n3. Each event type has array of userIds\n4. LOGIN: [1, 2] means user 1 and 2 both logged in\n\n## ❌ Actual Behavior\n\n- Always overwrites previous entry\n- LOG[type] = user (not an array)\n- Previous events lost\n\n## 📋 Acceptance Criteria\n\n- First call: {"type":"LOGIN","user":1} → {"LOGIN":[1]}\n- Second call: {"type":"LOGIN","user":2} → {"LOGIN":[1,2]}\n- Must append, not overwrite',
  'hard', 'javascript', 'advanced', 18, 150,
  '{"javascript": "// ----------------------------\n// audit.js – audit logging\n// ----------------------------\nconst LOG = {};\n\n\nexport function record(event) {\n  // BUG: always overwrites\n  LOG[event.type] = event.user;\n  return LOG;\n}\n\n\nexport function solution(event) {\n  return record(event);\n}"}',
  '[{"input": [{"type": "LOGIN", "user": 1}], "expected": {"LOGIN": [1]}, "description": "First event recorded"}, {"input": [{"type": "LOGIN", "user": 2}], "expected": {"LOGIN": [1, 2]}, "description": "Second event appended"}]',
  ARRAY['Immutable logs', 'Append-only systems', 'Event recording', 'Compliance'],
  25, true, 'code', 'javascript', 'test_cases', false
);

-- Challenge 19: Pricing Engine Wrong Tier Selection
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Pricing Engine Wrong Tier Selection',
  'adv-pricing-tiers',
  E'## 🧑‍💼 CTO MESSAGE\n\nSubscription renewals charging wrong tier.\n\n## 📝 JIRA TICKET\n\n**Ticket:** CB-ADV-309\n**Summary:** Tier lookup uses wrong comparator\n**Priority:** P0 — Billing Error\n\n## 🐛 Description\n\nTier selection logic has inverted comparison operators.\n\n## ✅ Expected Behavior\n\n1. Find tier where amount >= min AND amount <= max\n2. Amount 50 → BASIC (0-100)\n3. Amount 200 → PRO (101-500)\n4. Amount 700 → ENTERPRISE (501-999)\n\n## ❌ Actual Behavior\n\n- Using < and > instead of >= and <=\n- Wrong tiers returned\n- Billing errors\n\n## 📋 Acceptance Criteria\n\n- Amount 50 → "BASIC"\n- Amount 200 → "PRO"\n- Amount 700 → "ENTERPRISE"\n- Logic: amount >= t.min && amount <= t.max',
  'hard', 'javascript', 'advanced', 19, 150,
  '{"javascript": "// ----------------------------\n// tiers.js – pricing tiers\n// ----------------------------\nconst TIERS = [\n  { min: 0,   max: 100, name: \"BASIC\" },\n  { min: 101, max: 500, name: \"PRO\" },\n  { min: 501, max: 999, name: \"ENTERPRISE\" }\n];\n\n\n// ----------------------------\n// pricing.js – tier selection\n// ----------------------------\nexport function getTier(amount) {\n  // BUG: wrong comparison (inverted)\n  return TIERS.find(t => amount < t.min && amount > t.max)?.name || null;\n}\n\n\nexport function solution(amount) {\n  return getTier(amount);\n}"}',
  '[{"input": [50], "expected": "BASIC", "description": "50 falls in BASIC tier"}, {"input": [200], "expected": "PRO", "description": "200 falls in PRO tier"}, {"input": [700], "expected": "ENTERPRISE", "description": "700 falls in ENTERPRISE tier"}]',
  ARRAY['Tier calculation', 'Range logic', 'Comparator correctness', 'Billing systems'],
  25, true, 'code', 'javascript', 'test_cases', false
);

-- Challenge 20: Session Replay Prevention Bug
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Session Replay Prevention Bug',
  'adv-session-replay',
  E'## 🧑‍💼 CTO MESSAGE\n\nUsers can reuse old session tokens.\n\n## 📝 JIRA TICKET\n\n**Ticket:** CB-ADV-310\n**Summary:** Replay prevention checksum broken\n**Priority:** P0 — Security Breach\n\n## 🐛 Description\n\nChecksum validation compares entire token instead of extracting checksum portion.\n\n## ✅ Expected Behavior\n\n1. Token format: PREFIX + CHECKSUM (e.g., "ABC123")\n2. Extract last 3 chars as checksum\n3. Compare extracted checksum with expected\n4. "ABC123" with checksum "123" → true (match)\n5. "ABC123" with checksum "456" → false (no match)\n\n## ❌ Actual Behavior\n\n- Comparing entire token string to checksum\n- "ABC123" === "123" → false (wrong!)\n- Replay attacks possible\n\n## 📋 Acceptance Criteria\n\n- Extract last 3 chars from token\n- Compare with checksum parameter\n- "ABC123" + "123" → true\n- "XYZ456" + "456" → true\n- "ABC123" + "456" → false',
  'hard', 'javascript', 'advanced', 20, 150,
  '{"javascript": "// ----------------------------\n// replay.js – replay prevention\n// ----------------------------\nexport function isReplay(token, checksum) {\n  // BUG: comparing entire token\n  return token === checksum;\n}\n\n\nexport function solution(token, checksum) {\n  // Extract checksum from token and compare\n  const extracted = token.slice(-3);\n  return extracted === checksum;\n}"}',
  '[{"input": ["ABC123", "123"], "expected": true, "description": "Valid checksum matches"}, {"input": ["XYZ456", "456"], "expected": true, "description": "Another valid checksum"}, {"input": ["ABC123", "456"], "expected": false, "description": "Invalid checksum rejected"}]',
  ARRAY['Security', 'Checksums', 'Replay attack prevention', 'Token validation'],
  25, true, 'code', 'javascript', 'test_cases', false
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

-- Count total advanced challenges (should now be 20)
-- SELECT COUNT(*) as total_advanced_challenges
-- FROM challenges
-- WHERE tier = 'advanced' AND is_active = TRUE;
