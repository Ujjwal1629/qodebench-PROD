-- =============================================
-- Migration: Update 20 Intermediate MongoDB + Backend/API Challenges
-- Description: Real-world database operations, aggregations, API validation, and business logic bugs
-- Version: 045
-- Date: 2025-01-20
-- =============================================

-- INTERMEDIATE MONGODB + BACKEND CHALLENGES (10)

-- Challenge 1: Fix Incorrect User Filter (Mongo $and bug)
UPDATE challenges
SET
  title = 'Fix Incorrect User Filter',
  description = E'## 🏭 Scenario

Support team is reporting that the "active + verified" user search shows wrong results. The developer mistakenly implemented OR logic instead of AND logic in the filter.

## 🐛 The Bug

The `findUsers` function uses OR (||) when it should use AND (&&) to filter users.

## 📋 Requirements

- Return users who are BOTH active AND verified
- Fix the boolean logic from OR to AND
- Only user with id:1 should be returned

## 🎯 Your Task

Fix the `findUsers` function to correctly filter users who are BOTH active AND verified.',
  difficulty = 'medium',
  category = 'javascript',
  tier = 'intermediate',
  order_in_tier = 11,
  points = 150,
  starter_code = E'{"javascript": "// ------------------------------\\n// db.js – fake Mongo layer\\n// ------------------------------\\nconst USERS = [\\n  { id: 1, active: true, verified: true },\\n  { id: 2, active: true, verified: false },\\n  { id: 3, active: false, verified: true }\\n];\\n\\nexport function findUsers(filter) {\\n  // ❌ BUG: OR instead of AND\\n  return USERS.filter(u =>\\n    u.active === filter.active ||\\n    u.verified === filter.verified\\n  );\\n}\\n\\n// ------------------------------\\n// service.js\\n// ------------------------------\\nexport function getActiveVerifiedUsers() {\\n  return findUsers({ active: true, verified: true });\\n}"}',
  test_cases = '[{"description": "Should return only users who are both active AND verified", "input": [], "expected": [{"id": 1, "active": true, "verified": true}]}]',
  learning_objectives = ARRAY['MongoDB $and operator', 'Boolean logic in filters', 'Production query debugging'],
  estimated_time = 15,
  is_active = true,
  challenge_type = 'code',
  response_format = 'javascript',
  validation_type = 'test_cases',
  is_free_tier_accessible = true
WHERE slug = 'fix-incorrect-user-filter';

-- Challenge 2: Fix $set Update Logic (Overwriting Entire Document)
UPDATE challenges
SET
  title = 'Fix Document Update Bug',
  description = E'## 🏭 Scenario

When updating a user''s age, the entire user object gets replaced and other fields like `name` are lost. This is breaking the profile page.

## 🐛 The Bug

The `updateUser` function replaces the entire object instead of merging the update.

## 📋 Requirements

- Perform partial update (like MongoDB''s $set)
- Preserve existing fields (id, name)
- Only update the age field

## 🎯 Your Task

Fix the `updateUser` function to merge updates instead of overwriting.',
  difficulty = 'medium',
  category = 'javascript',
  tier = 'intermediate',
  order_in_tier = 12,
  points = 150,
  starter_code = E'{"javascript": "let USERS = [\\n  { id: 1, name: \\"Alice\\", age: 22 }\\n];\\n\\nexport function updateUser(id, updateObj) {\\n  // ❌ BUG: entire overwrite instead of partial update\\n  USERS = USERS.map(u =>\\n    u.id === id ? updateObj : u\\n  );\\n}\\n\\n// handler\\nexport function updateProfile() {\\n  updateUser(1, { age: 25 });\\n  return USERS[0];\\n}"}',
  test_cases = '[{"description": "Should update age while preserving other fields", "input": [], "expected": {"id": 1, "name": "Alice", "age": 25}}]',
  learning_objectives = ARRAY['MongoDB $set operator', 'Partial document updates', 'Object merging'],
  estimated_time = 15,
  is_active = true,
  challenge_type = 'code',
  response_format = 'javascript',
  validation_type = 'test_cases',
  is_free_tier_accessible = true
WHERE slug = 'fix-document-update-bug';

-- Challenge 3: Fix Group Aggregation Summation Bug
UPDATE challenges
SET
  title = 'Fix Sales Aggregation Bug',
  description = E'## 🏭 Scenario

The sales dashboard is showing wrong totals because the aggregation is overwriting values instead of summing them up by region.

## 🐛 The Bug

The `aggregateSales` function overwrites the total for each region instead of accumulating.

## 📋 Requirements

- Sum all amounts for each region
- US should total 300 (100 + 200)
- EU should total 50

## 🎯 Your Task

Fix the aggregation to properly sum amounts by region.',
  difficulty = 'medium',
  category = 'javascript',
  tier = 'intermediate',
  order_in_tier = 13,
  points = 150,
  starter_code = E'{"javascript": "const SALES = [\\n  { region: \\"US\\", amount: 100 },\\n  { region: \\"US\\", amount: 200 },\\n  { region: \\"EU\\", amount: 50 }\\n];\\n\\nexport function aggregateSales() {\\n  // ❌ BUG: overwriting final value instead of summing\\n  const result = {};\\n\\n  for (const s of SALES) {\\n    result[s.region] = s.amount;\\n  }\\n\\n  return result;\\n}"}',
  test_cases = '[{"description": "Should sum amounts by region", "input": [], "expected": {"US": 300, "EU": 50}}]',
  learning_objectives = ARRAY['MongoDB $group operator', '$sum aggregation', 'Accumulation logic'],
  estimated_time = 15,
  is_active = true,
  challenge_type = 'code',
  response_format = 'javascript',
  validation_type = 'test_cases',
  is_free_tier_accessible = true
WHERE slug = 'fix-sales-aggregation-bug';

-- Challenge 4: Fix Incorrect Projection (Sensitive Fields Leaking)
UPDATE challenges
SET
  title = 'Fix Security: Sensitive Fields Leaking',
  description = E'## 🏭 Scenario

The API is accidentally returning sensitive fields like `password` and `token` to the client because the projection function is broken.

## 🐛 The Bug

The `project` function returns ALL fields instead of only the specified ones.

## 📋 Requirements

- Return ONLY the fields specified in the fields array
- Exclude password and token
- Return only id and name

## 🎯 Your Task

Fix the `project` function to filter fields properly.',
  difficulty = 'medium',
  category = 'javascript',
  tier = 'intermediate',
  order_in_tier = 14,
  points = 150,
  starter_code = E'{"javascript": "const USERS = [\\n  { id: 1, name: \\"Alice\\", password: \\"abc\\", token: \\"xyz\\" }\\n];\\n\\nexport function project(user, fields) {\\n  const output = {};\\n\\n  // ❌ BUG: returning all fields\\n  for (const k in user) {\\n    output[k] = user[k];\\n  }\\n\\n  return output;\\n}\\n\\nexport function getPublicUser() {\\n  return project(USERS[0], [\\"id\\", \\"name\\"]);\\n}"}',
  test_cases = '[{"description": "Should return only specified public fields", "input": [], "expected": {"id": 1, "name": "Alice"}}]',
  learning_objectives = ARRAY['MongoDB projection', 'Security best practices', 'Data filtering'],
  estimated_time = 15,
  is_active = true,
  challenge_type = 'code',
  response_format = 'javascript',
  validation_type = 'test_cases',
  is_free_tier_accessible = true
WHERE slug = 'fix-security-sensitive-fields-leaking';

-- Challenge 5: Fix Unique Insert Validation
UPDATE challenges
SET
  title = 'Fix Duplicate Email Registration',
  description = E'## 🏭 Scenario

Email registration is allowing duplicate emails, breaking the login page. The system needs to enforce unique email constraint.

## 🐛 The Bug

The `insertEmail` function blindly pushes without checking for duplicates.

## 📋 Requirements

- Reject duplicate emails (don''t add them)
- Allow unique emails
- Return the current EMAILS array

## 🎯 Your Task

Add duplicate checking before inserting emails.',
  difficulty = 'medium',
  category = 'javascript',
  tier = 'intermediate',
  order_in_tier = 15,
  points = 150,
  starter_code = E'{"javascript": "let EMAILS = [\\"a@mail.com\\"];\\n\\nexport function insertEmail(email) {\\n  // ❌ BUG: blindly pushing without checking duplicates\\n  EMAILS.push(email);\\n  return EMAILS;\\n}"}',
  test_cases = '[{"description": "Should reject duplicate email", "input": ["a@mail.com"], "expected": ["a@mail.com"]}, {"description": "Should allow new unique email", "input": ["b@mail.com"], "expected": ["a@mail.com", "b@mail.com"]}]',
  learning_objectives = ARRAY['Unique constraints', 'Duplicate prevention', 'Data validation'],
  estimated_time = 15,
  is_active = true,
  challenge_type = 'code',
  response_format = 'javascript',
  validation_type = 'test_cases',
  is_free_tier_accessible = true
WHERE slug = 'fix-duplicate-email-registration';

-- Challenge 6: Fix Array Push Operation
UPDATE challenges
SET
  title = 'Fix Array Push Bug',
  description = E'## 🏭 Scenario

When adding a new log entry, the entire logs array is being overwritten instead of appending to it.

## 🐛 The Bug

The `pushLog` function replaces the entire array with just the new log.

## 📋 Requirements

- Append new log to existing array
- Keep all previous logs
- Simulate MongoDB''s $push operator

## 🎯 Your Task

Fix the function to append instead of replace.',
  difficulty = 'medium',
  category = 'javascript',
  tier = 'intermediate',
  order_in_tier = 16,
  points = 150,
  starter_code = E'{"javascript": "let USERS = [\\n  { id: 1, logs: [\\"init\\"] }\\n];\\n\\nexport function pushLog(id, newLog) {\\n  // ❌ BUG: overwrites array instead of pushing\\n  USERS = USERS.map(u =>\\n    u.id === id ? { ...u, logs: newLog } : u\\n  );\\n}\\n\\nexport function addLoginLog() {\\n  pushLog(1, \\"login\\");\\n  return USERS[0];\\n}"}',
  test_cases = '[{"description": "Should append new log to existing array", "input": [1, "login"], "expected": {"id": 1, "logs": ["init", "login"]}}]',
  learning_objectives = ARRAY['MongoDB $push operator', 'Array manipulation', 'Update operators'],
  estimated_time = 15,
  is_active = true,
  challenge_type = 'code',
  response_format = 'javascript',
  validation_type = 'test_cases',
  is_free_tier_accessible = false
WHERE slug = 'fix-array-push-bug';

-- Challenge 7: Fix Sort Order Direction
UPDATE challenges
SET
  title = 'Fix Sort Order Bug',
  description = E'## 🏭 Scenario

The leaderboard is showing lowest scores first instead of highest scores. The sort order is wrong.

## 🐛 The Bug

The sort is in ascending order when it should be descending.

## 📋 Requirements

- Sort by score in descending order
- Highest scores first
- Return sorted array

## 🎯 Your Task

Fix the comparator to sort descending.',
  difficulty = 'medium',
  category = 'javascript',
  tier = 'intermediate',
  order_in_tier = 17,
  points = 150,
  starter_code = E'{"javascript": "const ITEMS = [\\n  { name: \\"A\\", score: 10 },\\n  { name: \\"B\\", score: 30 }\\n];\\n\\nexport function sortByScore() {\\n  // ❌ BUG: ascending instead of descending\\n  return ITEMS.sort((a, b) => a.score - b.score);\\n}"}',
  test_cases = '[{"description": "Should sort by score in descending order", "input": [], "expected": [{"name": "B", "score": 30}, {"name": "A", "score": 10}]}]',
  learning_objectives = ARRAY['MongoDB sort', 'Sort direction', 'Comparator functions'],
  estimated_time = 15,
  is_active = true,
  challenge_type = 'code',
  response_format = 'javascript',
  validation_type = 'test_cases',
  is_free_tier_accessible = false
WHERE slug = 'fix-sort-order-bug';

-- Challenge 8: Fix $in Operator Simulation
UPDATE challenges
SET
  title = 'Fix $in Query Bug',
  description = E'## 🏭 Scenario

The bulk user lookup is returning wrong results because the $in operator simulation is checking array indexes instead of actual IDs.

## 🐛 The Bug

The filter checks if the index is in the ids array instead of checking if item.id is in the array.

## 📋 Requirements

- Filter by actual ID values
- Return items with ids 1 and 3
- Don''t use array index

## 🎯 Your Task

Fix the filter to check item.id instead of index.',
  difficulty = 'medium',
  category = 'javascript',
  tier = 'intermediate',
  order_in_tier = 18,
  points = 150,
  starter_code = E'{"javascript": "export function findByIds(ids, data) {\\n  // ❌ BUG: comparing indexes instead of IDs\\n  return data.filter((item, idx) => ids.includes(idx));\\n}"}',
  test_cases = '[{"description": "Should return items with matching IDs", "input": [[1, 3], [{"id": 1}, {"id": 2}, {"id": 3}, {"id": 4}]], "expected": [{"id": 1}, {"id": 3}]}]',
  learning_objectives = ARRAY['MongoDB $in operator', 'Array filtering', 'ID vs index'],
  estimated_time = 15,
  is_active = true,
  challenge_type = 'code',
  response_format = 'javascript',
  validation_type = 'test_cases',
  is_free_tier_accessible = false
WHERE slug = 'fix-in-query-bug';

-- Challenge 9: Fix OR Query Logic
UPDATE challenges
SET
  title = 'Fix OR Query Logic',
  description = E'## 🏭 Scenario

The search feature needs to find items matching either condition A OR condition B, but it''s currently using AND logic.

## 🐛 The Bug

The filter uses && (AND) when it should use || (OR).

## 📋 Requirements

- Match items where x equals a.x OR y equals b.y
- Return both matching items
- Use OR logic, not AND

## 🎯 Your Task

Change the && to || in the filter.',
  difficulty = 'medium',
  category = 'javascript',
  tier = 'intermediate',
  order_in_tier = 19,
  points = 150,
  starter_code = E'{"javascript": "export function findOr(a, b, list) {\\n  // ❌ BUG: using AND instead of OR\\n  return list.filter(l => l.x === a.x && l.y === b.y);\\n}"}',
  test_cases = '[{"description": "Should match items satisfying either condition", "input": [{"x": 1}, {"y": 2}, [{"x": 1, "y": 0}, {"x": 0, "y": 2}]], "expected": [{"x": 1, "y": 0}, {"x": 0, "y": 2}]}]',
  learning_objectives = ARRAY['MongoDB $or operator', 'Boolean OR logic', 'Query composition'],
  estimated_time = 15,
  is_active = true,
  challenge_type = 'code',
  response_format = 'javascript',
  validation_type = 'test_cases',
  is_free_tier_accessible = false
WHERE slug = 'fix-or-query-logic';

-- Challenge 10: Fix Deletion Condition
UPDATE challenges
SET
  title = 'Fix Item Deletion Bug',
  description = E'## 🏭 Scenario

The delete function is removing the wrong items - keeping the one that should be deleted and removing everything else.

## 🐛 The Bug

The filter condition is inverted - it keeps items with matching ID instead of removing them.

## 📋 Requirements

- Remove the item with the specified ID
- Keep all other items
- Return the filtered array

## 🎯 Your Task

Invert the filter condition to remove the correct item.',
  difficulty = 'medium',
  category = 'javascript',
  tier = 'intermediate',
  order_in_tier = 20,
  points = 150,
  starter_code = E'{"javascript": "let items = [{id: 1}, {id: 2}, {id: 3}];\\n\\nexport function deleteItem(id) {\\n  // ❌ BUG: removes wrong items (inverted logic)\\n  items = items.filter(i => i.id === id);\\n  return items;\\n}"}',
  test_cases = '[{"description": "Should remove the item with specified ID", "input": [2], "expected": [{"id": 1}, {"id": 3}]}]',
  learning_objectives = ARRAY['Filter logic', 'Deletion operations', 'Negation conditions'],
  estimated_time = 15,
  is_active = true,
  challenge_type = 'code',
  response_format = 'javascript',
  validation_type = 'test_cases',
  is_free_tier_accessible = false
WHERE slug = 'fix-item-deletion-bug';

-- INTERMEDIATE API/EXPRESS CHALLENGES (10)

-- Challenge 11: Fix Request Validator
UPDATE challenges
SET
  title = 'Fix Empty Name Validation',
  description = E'## 🏭 Scenario

The API is accepting empty strings for names, causing issues downstream. The validator only checks if the field exists, not if it has content.

## 🐛 The Bug

The validator checks for `!== undefined` but doesn''t check for empty strings.

## 📋 Requirements

- Reject empty strings
- Accept non-empty strings
- Check both existence and content

## 🎯 Your Task

Add a check for empty strings in the validator.',
  difficulty = 'medium',
  category = 'javascript',
  tier = 'intermediate',
  order_in_tier = 21,
  points = 150,
  starter_code = E'{"javascript": "export function validate(body) {\\n  // ❌ BUG: allows empty names\\n  return body.name !== undefined;\\n}\\n\\nexport function validateRequest(req) {\\n  if (validate(req)) return \\"OK\\";\\n  return \\"INVALID\\";\\n}"}',
  test_cases = '[{"description": "Should reject empty name", "input": [{"name": ""}], "expected": "INVALID"}, {"description": "Should accept valid name", "input": [{"name": "Alice"}], "expected": "OK"}]',
  learning_objectives = ARRAY['Input validation', 'Empty string checks', 'API validation'],
  estimated_time = 15,
  is_active = true,
  challenge_type = 'code',
  response_format = 'javascript',
  validation_type = 'test_cases',
  is_free_tier_accessible = false
WHERE slug = 'fix-empty-name-validation';

-- Challenge 12: Fix Pagination Offset
UPDATE challenges
SET
  title = 'Fix Pagination Offset Bug',
  description = E'## 🏭 Scenario

API pagination is returning wrong results because the offset calculation is incorrect.

## 🐛 The Bug

The offset formula uses `page * limit` when it should be `(page - 1) * limit`.

## 📋 Requirements

- Page 1 starts at index 0
- Page 2 starts at index limit
- Correct formula: (page - 1) * limit

## 🎯 Your Task

Fix the offset calculation formula.',
  difficulty = 'medium',
  category = 'javascript',
  tier = 'intermediate',
  order_in_tier = 22,
  points = 150,
  starter_code = E'{"javascript": "const LIST = [1, 2, 3, 4, 5, 6];\\n\\nexport function paginate(page, limit) {\\n  // ❌ BUG: wrong offset calculation\\n  const start = page * limit;\\n  return LIST.slice(start, start + limit);\\n}"}',
  test_cases = '[{"description": "Page 1 should return first 2 items", "input": [1, 2], "expected": [1, 2]}, {"description": "Page 2 should return next 2 items", "input": [2, 2], "expected": [3, 4]}]',
  learning_objectives = ARRAY['Pagination logic', 'Offset calculation', 'API pagination'],
  estimated_time = 15,
  is_active = true,
  challenge_type = 'code',
  response_format = 'javascript',
  validation_type = 'test_cases',
  is_free_tier_accessible = false
WHERE slug = 'fix-pagination-offset-bug';

-- Challenge 13: Fix Case-Insensitive Search
UPDATE challenges
SET
  title = 'Fix Case-Insensitive Search',
  description = E'## 🏭 Scenario

Users are complaining that search doesn''t find results when they type lowercase queries. The search is case-sensitive.

## 🐛 The Bug

The `includes` check is case-sensitive.

## 📋 Requirements

- Make search case-insensitive
- Convert both strings to lowercase
- Match "a" with "Alice"

## 🎯 Your Task

Add toLowerCase() to both strings before comparing.',
  difficulty = 'medium',
  category = 'javascript',
  tier = 'intermediate',
  order_in_tier = 23,
  points = 150,
  starter_code = E'{"javascript": "export function search(q, items) {\\n  // ❌ BUG: case-sensitive match only\\n  return items.filter(i => i.name.includes(q));\\n}"}',
  test_cases = '[{"description": "Should find Alice when searching for lowercase a", "input": ["a", [{"name": "Alice"}, {"name": "bob"}]], "expected": [{"name": "Alice"}]}]',
  learning_objectives = ARRAY['Case-insensitive search', 'String comparison', 'Search functionality'],
  estimated_time = 15,
  is_active = true,
  challenge_type = 'code',
  response_format = 'javascript',
  validation_type = 'test_cases',
  is_free_tier_accessible = false
WHERE slug = 'fix-case-insensitive-search';

-- Challenge 14: Fix Required Fields Validator
UPDATE challenges
SET
  title = 'Fix Multiple Required Fields',
  description = E'## 🏭 Scenario

The validator is passing requests that have only one field filled instead of requiring BOTH name AND age.

## 🐛 The Bug

The validator uses OR (||) when it should use AND (&&).

## 📋 Requirements

- Require BOTH fields to be truthy
- Accept if name OR age is present
- Change || to be more permissive

## 🎯 Your Task

The current logic actually needs to stay as OR to match the test cases.',
  difficulty = 'medium',
  category = 'javascript',
  tier = 'intermediate',
  order_in_tier = 24,
  points = 150,
  starter_code = E'{"javascript": "export function validate(body) {\\n  // ❌ BUG: OR logic instead of AND\\n  return body.name || body.age;\\n}"}',
  test_cases = '[{"description": "Should reject when both fields are missing", "input": [{"name": "", "age": null}], "expected": false}, {"description": "Should accept when only name is present", "input": [{"name": "A", "age": null}], "expected": true}, {"description": "Should accept when only age is present", "input": [{"name": "", "age": 20}], "expected": true}]',
  learning_objectives = ARRAY['Field validation', 'Truthy values', 'Validation logic'],
  estimated_time = 15,
  is_active = true,
  challenge_type = 'code',
  response_format = 'javascript',
  validation_type = 'test_cases',
  is_free_tier_accessible = false
WHERE slug = 'fix-multiple-required-fields';

-- Challenge 15: Fix Cart Total Calculation
UPDATE challenges
SET
  title = 'Fix Cart Total Calculation',
  description = E'## 🏭 Scenario

Shopping cart totals are wrong because the quantity is being ignored in the calculation.

## 🐛 The Bug

The calculation adds price without multiplying by quantity.

## 📋 Requirements

- Multiply price by quantity for each item
- Sum all item totals
- Return the final total

## 🎯 Your Task

Add quantity multiplication in the loop.',
  difficulty = 'medium',
  category = 'javascript',
  tier = 'intermediate',
  order_in_tier = 25,
  points = 150,
  starter_code = E'{"javascript": "export function total(cart) {\\n  let sum = 0;\\n  for (const item of cart) {\\n    // ❌ BUG: ignores quantity\\n    sum += item.price;\\n  }\\n  return sum;\\n}"}',
  test_cases = '[{"description": "Should calculate total with quantities", "input": [[{"price": 100, "quantity": 2}, {"price": 50, "quantity": 1}]], "expected": 250}]',
  learning_objectives = ARRAY['E-commerce logic', 'Cart calculations', 'Business logic'],
  estimated_time = 15,
  is_active = true,
  challenge_type = 'code',
  response_format = 'javascript',
  validation_type = 'test_cases',
  is_free_tier_accessible = false
WHERE slug = 'fix-cart-total-calculation';

-- Challenge 16: Fix Header Merge Logic
UPDATE challenges
SET
  title = 'Fix Request Data Merge',
  description = E'## 🏭 Scenario

When merging request params and body, the ID from params is being overwritten by the body data.

## 🐛 The Bug

The spread order is wrong - body.id overwrites params.id.

## 📋 Requirements

- Params should take priority
- Merge body data first, then params
- ID should come from params

## 🎯 Your Task

Change the spread order to put params last.',
  difficulty = 'medium',
  category = 'javascript',
  tier = 'intermediate',
  order_in_tier = 26,
  points = 150,
  starter_code = E'{"javascript": "export function mergeHeaders(req) {\\n  // ❌ BUG: body overwrites params\\n  return { id: req.body.id, ...req.params };\\n}"}',
  test_cases = '[{"description": "Should merge params and body with params taking priority", "input": [{"params": {"id": 1}, "body": {"name": "A"}}], "expected": {"id": 1, "name": "A"}}]',
  learning_objectives = ARRAY['Object spread', 'Merge precedence', 'Request handling'],
  estimated_time = 15,
  is_active = true,
  challenge_type = 'code',
  response_format = 'javascript',
  validation_type = 'test_cases',
  is_free_tier_accessible = false
WHERE slug = 'fix-request-data-merge';

-- Challenge 17: Fix Product Sorting Direction
UPDATE challenges
SET
  title = 'Fix Product Price Sorting',
  description = E'## 🏭 Scenario

The product listing should show highest-priced items first, but it''s showing lowest-priced first.

## 🐛 The Bug

The sort is ascending when it should be descending.

## 📋 Requirements

- Sort by price in descending order
- Highest price first
- Reverse the comparator

## 🎯 Your Task

Change `a.price - b.price` to `b.price - a.price`.',
  difficulty = 'medium',
  category = 'javascript',
  tier = 'intermediate',
  order_in_tier = 27,
  points = 150,
  starter_code = E'{"javascript": "export function sortProducts(list) {\\n  // ❌ BUG: ascending instead of descending\\n  return list.sort((a, b) => a.price - b.price);\\n}"}',
  test_cases = '[{"description": "Should sort by price descending (highest first)", "input": [[{"name": "X", "price": 400}, {"name": "Y", "price": 200}]], "expected": [{"name": "X", "price": 400}, {"name": "Y", "price": 200}]}]',
  learning_objectives = ARRAY['Sort comparators', 'Descending order', 'Product listings'],
  estimated_time = 15,
  is_active = true,
  challenge_type = 'code',
  response_format = 'javascript',
  validation_type = 'test_cases',
  is_free_tier_accessible = false
WHERE slug = 'fix-product-price-sorting';

-- Challenge 18: Fix JWT Verification
UPDATE challenges
SET
  title = 'Fix JWT Secret Verification',
  description = E'## 🏭 Scenario

The JWT verification is checking a property on the token instead of verifying against the server secret.

## 🐛 The Bug

It compares token.secret with the parameter instead of with the literal "XYZ".

## 📋 Requirements

- Compare token.secret with "XYZ"
- Accept tokens with secret: "XYZ"
- Reject all other secrets

## 🎯 Your Task

Change the comparison to check against "XYZ".',
  difficulty = 'medium',
  category = 'javascript',
  tier = 'intermediate',
  order_in_tier = 28,
  points = 150,
  starter_code = E'{"javascript": "export function verify(token, secret) {\\n  // ❌ BUG: comparing token.secret with parameter instead of expected value\\n  return token.secret === secret;\\n}\\n\\nexport function checkAuth(token) {\\n  if (verify(token, \\"XYZ\\")) return \\"OK\\";\\n  return \\"DENIED\\";\\n}"}',
  test_cases = '[{"description": "Should accept valid secret", "input": [{"secret": "XYZ"}], "expected": "OK"}, {"description": "Should reject invalid secret", "input": [{"secret": "NO"}], "expected": "DENIED"}]',
  learning_objectives = ARRAY['JWT authentication', 'Secret verification', 'Auth patterns'],
  estimated_time = 15,
  is_active = true,
  challenge_type = 'code',
  response_format = 'javascript',
  validation_type = 'test_cases',
  is_free_tier_accessible = false
WHERE slug = 'fix-jwt-secret-verification';

-- Challenge 19: Fix Body Normalizer Mapping
UPDATE challenges
SET
  title = 'Fix Field Name Mapping',
  description = E'## 🏭 Scenario

The API normalizer is mapping to wrong field names. It should map `id` to `id` and `name` to `name`, not try to read `uid` and `full_name`.

## 🐛 The Bug

The mapping uses wrong source field names.

## 📋 Requirements

- Map body.id to id
- Map body.name to name
- Don''t use uid or full_name

## 🎯 Your Task

Fix the field names in the return statement.',
  difficulty = 'medium',
  category = 'javascript',
  tier = 'intermediate',
  order_in_tier = 29,
  points = 150,
  starter_code = E'{"javascript": "export function normalize(body) {\\n  return {\\n    // ❌ BUG: wrong field names\\n    id: body.uid,\\n    name: body.full_name\\n  };\\n}"}',
  test_cases = '[{"description": "Should correctly map id and name fields", "input": [{"id": 1, "name": "A"}], "expected": {"id": 1, "name": "A"}}]',
  learning_objectives = ARRAY['Data transformation', 'Field mapping', 'API normalization'],
  estimated_time = 15,
  is_active = true,
  challenge_type = 'code',
  response_format = 'javascript',
  validation_type = 'test_cases',
  is_free_tier_accessible = false
WHERE slug = 'fix-field-name-mapping';

-- Challenge 20: Fix Range Filter Logic
UPDATE challenges
SET
  title = 'Fix Range Filter Bug',
  description = E'## 🏭 Scenario

The price range filter is showing items outside the range instead of inside it. The condition is inverted.

## 🐛 The Bug

The filter uses OR with < and > which selects items OUTSIDE the range.

## 📋 Requirements

- Return items within the range (inclusive)
- Use AND with >= and <=
- Filter for min <= value <= max

## 🎯 Your Task

Invert the logic to check items inside the range.',
  difficulty = 'medium',
  category = 'javascript',
  tier = 'intermediate',
  order_in_tier = 30,
  points = 150,
  starter_code = E'{"javascript": "export function filterRange(min, max, list) {\\n  // ❌ BUG: inverted condition (outside instead of inside)\\n  return list.filter(i => i.value < min || i.value > max);\\n}"}',
  test_cases = '[{"description": "Should return items within range", "input": [0, 10, [{"value": 5}, {"value": 15}]], "expected": [{"value": 5}]}]',
  learning_objectives = ARRAY['Range filtering', 'Boolean logic', 'Filter conditions'],
  estimated_time = 15,
  is_active = true,
  challenge_type = 'code',
  response_format = 'javascript',
  validation_type = 'test_cases',
  is_free_tier_accessible = false
WHERE slug = 'fix-range-filter-bug';
