-- =============================================
-- Migration: Add Advanced Challenges 6-10
-- Description: More real-world multi-layer debugging scenarios
-- Version: 047
-- Date: 2025-01-21
-- =============================================

-- Challenge 6: Distributed Cache Desync Crisis
-- (Multi-region cache invalidation bug)
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Distributed Cache Desync Crisis',
  'adv-cache-desync',
  E'## 🧑‍💼 CTO MESSAGE\n\nCache hit rate dropped from 92% to 41%.\nUsers are seeing stale product prices across regions.\n\n## 📝 JIRA TICKET\n\n**Ticket:** CB-ADV-201\n**Summary:** Distributed cache is returning stale entries\n**Priority:** P1 — Revenue Impact\n\n## 🐛 Description\n\nOur multi-region Redis cache layer is returning outdated product data because invalidation logic is broken.\n\n## ✅ Expected Behavior\n\n1. Load fresh product from DB\n2. Write to cache with region-specific key\n3. On update, invalidate all region caches\n4. Return newest product payload everywhere\n\n## ❌ Actual Behavior\n\n- Only US cache invalidates\n- EU cache stays stale\n- Cache key format wrong (region ignored)\n\n## 📋 Acceptance Criteria\n\n- `getCacheKey(productId, region)` must generate correct key including region\n- `invalidate(productId)` must clear all region keys (us, eu, in)\n- `syncProduct()` must always return fresh & cached value\n- Keys should follow format: `product_{id}_{region}`',
  'hard', 'javascript', 'advanced', 6, 150,
  '{"javascript": "// ----------------------------\n// db.js – simulated datastore\n// ----------------------------\nconst DB = {\n  1: { id: 1, name: \"Laptop\", price: 1200 },\n};\n\nfunction fetchProduct(id) {\n  return DB[id] || null;\n}\n\n\n// ----------------------------\n// cache.js – cache operations\n// ----------------------------\nconst CACHE = {};\n\nfunction getCache(key) {\n  return CACHE[key] || null;\n}\n\nfunction setCache(key, val) {\n  CACHE[key] = val;\n}\n\nfunction clearCache(key) {\n  delete CACHE[key];\n}\n\n\n// ----------------------------\n// utils.js – key generation\n// ----------------------------\nfunction getCacheKey(productId, region) {\n  // BUG: region ignored\n  return `product_${productId}`;\n}\n\n\n// ----------------------------\n// invalidate.js – cache invalidation\n// ----------------------------\nconst REGIONS = [\"us\", \"eu\", \"in\"];\n\nfunction invalidate(productId) {\n  // BUG: invalidates only us\n  clearCache(`product_${productId}_us`);\n}\n\n\n// ----------------------------\n// service.js – main sync logic\n// ----------------------------\nexport function syncProduct(productId, region) {\n  const key = getCacheKey(productId, region);\n\n  const cached = getCache(key);\n  if (cached) return cached; // might be stale\n\n  const fresh = fetchProduct(productId);\n  if (!fresh) return null;\n\n  setCache(key, fresh);\n  return fresh;\n}\n\nexport function solution(productId, region) {\n  return syncProduct(productId, region);\n}"}',
  '[{"input": [1, "us"], "expected": {"id": 1, "name": "Laptop", "price": 1200}, "description": "loads fresh for US"}, {"input": [1, "eu"], "expected": {"id": 1, "name": "Laptop", "price": 1200}, "description": "loads fresh for EU"}, {"input": [1, "in"], "expected": {"id": 1, "name": "Laptop", "price": 1200}, "description": "loads fresh for India"}]',
  ARRAY['Distributed caching', 'Multi-region invalidation', 'Avoiding stale reads', 'Correct cache key design'],
  30, true, 'code', 'javascript', 'test_cases', false
);

-- Challenge 7: Email Queue Worker Race Condition
-- (Concurrency, locking, duplicate processing)
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Email Queue Worker Race Condition',
  'adv-email-queue-race',
  E'## 🧑‍💼 CTO MESSAGE\n\nUsers are receiving duplicate verification emails.\nThe queue worker is double-processing jobs.\n\n## 📝 JIRA TICKET\n\n**Ticket:** CB-ADV-202\n**Summary:** Email queue worker is double-processing jobs\n**Priority:** P0 — User Experience\n\n## 🐛 Description\n\nTwo worker threads process the same job due to missing lock mechanism.\n\n## ✅ Expected Behavior\n\n1. Lock job before processing\n2. Process exactly once\n3. Remove from queue after processing\n4. Release lock\n\n## ❌ Actual Behavior\n\n- Worker A processes job\n- Worker B also processes same job (no lock check)\n- Emails are duplicated\n\n## 📋 Acceptance Criteria\n\n- `acquireLock(jobId)` must properly check and set lock\n- Lock should prevent duplicate processing\n- First call to processJobs() should send email\n- Second call should return \"EMPTY\" (job already processed)',
  'hard', 'javascript', 'advanced', 7, 150,
  '{"javascript": "// ----------------------------\n// queue.js – job queue\n// ----------------------------\nlet JOBS = [\n  { id: 1, email: \"a@mail.com\", type: \"VERIFY\" },\n];\n\nfunction getNextJob() {\n  return JOBS[0] || null;\n}\n\nfunction removeJob(id) {\n  JOBS = JOBS.filter(j => j.id !== id);\n}\n\n\n// ----------------------------\n// lock.js – locking mechanism\n// ----------------------------\nlet LOCK = null;\n\nfunction acquireLock(jobId) {\n  // BUG: always returns true, no actual locking\n  return true;\n}\n\nfunction releaseLock() {\n  LOCK = null;\n}\n\n\n// ----------------------------\n// worker.js – job processor\n// ----------------------------\nexport function processJobs() {\n  const job = getNextJob();\n  if (!job) return \"EMPTY\";\n\n  if (!acquireLock(job.id)) return \"LOCKED\";\n\n  // simulate sending email\n  const result = `SENT_${job.email}`;\n\n  removeJob(job.id);\n  releaseLock();\n\n  return result;\n}\n\nexport function solution() {\n  return processJobs();\n}"}',
  '[{"input": [], "expected": "SENT_a@mail.com", "description": "First call processes and sends email"}, {"input": [], "expected": "EMPTY", "description": "Second call finds empty queue"}]',
  ARRAY['Concurrency patterns', 'Locking mechanisms', 'Race condition prevention', 'Queue worker design'],
  25, true, 'code', 'javascript', 'test_cases', false
);

-- Challenge 8: Inventory Deduction Breakdown (High Traffic Bug)
-- (Race-safe inventory, input validation)
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Inventory Deduction Breakdown',
  'adv-inventory-deduction',
  E'## 🧑‍💼 CTO MESSAGE\n\nDuring flash sale, inventory went into negative numbers.\nWe oversold 200 units and now have angry customers.\n\n## 📝 JIRA TICKET\n\n**Ticket:** CB-ADV-203\n**Summary:** Inventory deduction race condition\n**Priority:** P0 — Revenue Loss\n\n## 🐛 Description\n\nInventory system allows purchases even when stock is insufficient, resulting in negative stock values.\n\n## ✅ Expected Behavior\n\n1. Validate purchase amount (must be positive)\n2. Check if sufficient stock exists\n3. Deduct only if stock >= amount\n4. Return \"OK\" for successful purchase\n5. Return \"NEGATIVE_STOCK\" if insufficient\n\n## ❌ Actual Behavior\n\n- No validation on purchase amount (allows 0 and negative)\n- No lower bound check on stock\n- Stock goes negative\n\n## 📋 Acceptance Criteria\n\n- `validate(amount)` must reject 0 and negative amounts\n- `reduceStock(amount)` must check stock >= amount before deducting\n- `purchase(2)` with 5 stock → \"OK\" (3 remaining)\n- `purchase(3)` with 3 stock → \"OK\" (0 remaining)\n- `purchase(1)` with 0 stock → \"NEGATIVE_STOCK\"',
  'hard', 'javascript', 'advanced', 8, 150,
  '{"javascript": "// ----------------------------\n// stock.js – inventory management\n// ----------------------------\nlet STOCK = { productId: 1, qty: 5 };\n\nfunction getStock() {\n  return STOCK.qty;\n}\n\nfunction reduceStock(amount) {\n  // BUG: no lower bound check\n  STOCK.qty = STOCK.qty - amount;\n  return STOCK.qty;\n}\n\n\n// ----------------------------\n// validator.js – input validation\n// ----------------------------\nfunction validate(amount) {\n  // BUG: allows 0 and negative\n  return true;\n}\n\n\n// ----------------------------\n// service.js – purchase logic\n// ----------------------------\nexport function purchase(amount) {\n  if (!validate(amount)) return \"INVALID\";\n  \n  const currentStock = getStock();\n  if (currentStock < amount) return \"NEGATIVE_STOCK\";\n  \n  reduceStock(amount);\n  return \"OK\";\n}\n\nexport function solution(amount) {\n  return purchase(amount);\n}"}',
  '[{"input": [2], "expected": "OK", "description": "Purchase 2 from 5 stock succeeds"}, {"input": [3], "expected": "OK", "description": "Purchase 3 from 3 stock succeeds"}, {"input": [1], "expected": "NEGATIVE_STOCK", "description": "Purchase 1 from 0 stock fails"}]',
  ARRAY['Race-safe inventory logic', 'Transactional deductions', 'Input validation', 'Preventing negative stock'],
  25, true, 'code', 'javascript', 'test_cases', false
);

-- Challenge 9: Broken Analytics Funnel Aggregator
-- (Funnel analytics, unique user tracking)
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Broken Analytics Funnel Aggregator',
  'adv-funnel-aggregator',
  E'## 🧑‍💼 CTO MESSAGE\n\nFunnels showing 0% conversion. PM is furious.\nThe analytics dashboard is completely broken.\n\n## 📝 JIRA TICKET\n\n**Ticket:** CB-ADV-204\n**Summary:** Funnel step aggregator broken\n**Priority:** High — Product Analytics\n\n## 🐛 Description\n\nThe funnel aggregator counts total events instead of unique users per step, causing incorrect conversion metrics.\n\n## ✅ Expected Behavior\n\n1. Count unique users per funnel step\n2. Each user counted once per step (even if they triggered multiple events)\n3. Return { step: uniqueUserCount }\n\n## ❌ Actual Behavior\n\n- Counts total events, not unique users\n- Same user counted multiple times\n- Conversion rates are inflated/wrong\n\n## 📋 Acceptance Criteria\n\n- `aggregateFunnel()` must count unique users per step\n- User 1 with 2 \"view\" events = count as 1 view\n- Expected output: { \"view\": 2, \"click\": 2, \"purchase\": 1 }\n  - 2 unique users viewed\n  - 2 unique users clicked\n  - 1 unique user purchased',
  'hard', 'javascript', 'advanced', 9, 150,
  '{"javascript": "// ----------------------------\n// events.js – event data\n// ----------------------------\nconst EVENTS = [\n  { userId: 1, step: \"view\" },\n  { userId: 1, step: \"click\" },\n  { userId: 1, step: \"purchase\" },\n  { userId: 2, step: \"view\" },\n  { userId: 2, step: \"click\" }\n];\n\n\n// ----------------------------\n// aggregator.js – funnel logic\n// ----------------------------\nfunction aggregateFunnel(events) {\n  // BUG: counts events, not unique users\n  const result = {};\n\n  for (const e of events) {\n    result[e.step] = (result[e.step] || 0) + 1;\n  }\n\n  return result;\n}\n\n\nexport function solution() {\n  return aggregateFunnel(EVENTS);\n}"}',
  '[{"input": [], "expected": {"view": 2, "click": 2, "purchase": 1}, "description": "Funnel counts unique users per step"}]',
  ARRAY['Funnel analytics', 'Unique-user step tracking', 'Aggregation logic', 'Product metrics'],
  25, true, 'code', 'javascript', 'test_cases', false
);

-- Challenge 10: API Gateway JWT Failure
-- (JWT verification, token expiry, security)
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'API Gateway JWT Failure',
  'adv-jwt-gateway',
  E'## 🧑‍💼 CTO MESSAGE\n\nGateway rejecting valid users. Sessions dying early.\nSecurity team flagged potential vulnerabilities.\n\n## 📝 JIRA TICKET\n\n**Ticket:** CB-ADV-205\n**Summary:** JWT verification bug in API gateway\n**Priority:** P1 — Security\n\n## 🐛 Description\n\nThe API gateway is using `jwt.decode()` instead of `jwt.verify()`, which means tokens are not being cryptographically verified. Additionally, expired tokens are being accepted.\n\n## ✅ Expected Behavior\n\n1. Use `jwt.verify()` with secret to validate signature\n2. Check token expiration (exp claim)\n3. Return \"OK\" only for valid, non-expired tokens\n4. Return \"UNAUTHORIZED\" for invalid or expired tokens\n\n## ❌ Actual Behavior\n\n- Using `jwt.decode()` (no signature verification)\n- Expired tokens still allowed through\n- Security vulnerability!\n\n## 📋 Acceptance Criteria\n\n- `verifyToken()` must use `jwt.verify()` not `jwt.decode()`\n- Must check `exp` claim against current time\n- Valid token → \"OK\"\n- Expired token → \"UNAUTHORIZED\"\n- Invalid/tampered token → \"UNAUTHORIZED\"',
  'hard', 'javascript', 'advanced', 10, 150,
  '{"javascript": "// ----------------------------\n// auth.js – JWT handling\n// ----------------------------\n// Note: In real code, you would use the jsonwebtoken library\n// For this challenge, we simulate JWT operations\n\nconst SECRET = \"super_secret\";\n\n// Simulated tokens for testing\nconst TOKENS = {\n  VALID_TOKEN: { userId: 1, exp: Date.now() + 3600000, valid: true },\n  EXPIRED_TOKEN: { userId: 1, exp: Date.now() - 3600000, valid: true },\n  INVALID_TOKEN: { userId: 1, exp: Date.now() + 3600000, valid: false }\n};\n\nfunction verifyToken(token) {\n  // BUG: using decode (no verification) - simulated\n  const data = TOKENS[token];\n  if (!data) return null;\n  \n  // BUG: not checking signature validity\n  // BUG: not checking expiration\n  return data;\n}\n\n\n// ----------------------------\n// gateway.js – API gateway handler\n// ----------------------------\nfunction gatewayHandler(token) {\n  const data = verifyToken(token);\n  if (!data) return \"UNAUTHORIZED\";\n\n  // BUG: expired tokens still allowed\n  return \"OK\";\n}\n\n\nexport function solution(token) {\n  return gatewayHandler(token);\n}"}',
  '[{"input": ["VALID_TOKEN"], "expected": "OK", "description": "Valid non-expired token returns OK"}, {"input": ["EXPIRED_TOKEN"], "expected": "UNAUTHORIZED", "description": "Expired token returns UNAUTHORIZED"}, {"input": ["INVALID_TOKEN"], "expected": "UNAUTHORIZED", "description": "Invalid/tampered token returns UNAUTHORIZED"}, {"input": ["UNKNOWN_TOKEN"], "expected": "UNAUTHORIZED", "description": "Unknown token returns UNAUTHORIZED"}]',
  ARRAY['JWT verification', 'Token expiry handling', 'API gateway authentication', 'Security best practices'],
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

-- Count total advanced challenges (should now be 10)
-- SELECT COUNT(*) as total_advanced_challenges
-- FROM challenges
-- WHERE tier = 'advanced' AND is_active = TRUE;
