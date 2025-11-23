-- =============================================
-- Migration: New Beginner Challenges (Real Office Scenarios)
-- Description: Replace old beginner challenges with 10 real-world bug fix scenarios
-- Version: 040
-- Date: 2025-01-20
-- =============================================

-- ============================================================================
-- STEP 1: Delete existing beginner challenges (including any partial inserts)
-- ============================================================================

-- Delete any existing challenges with these slugs (in case of partial migration)
DELETE FROM challenges
WHERE slug IN (
  'beginner-permission-logic',
  'beginner-tax-calculation',
  'beginner-name-formatting',
  'beginner-active-users-filter',
  'beginner-discount-logic',
  'beginner-age-sorting',
  'beginner-email-masking',
  'beginner-average-calculation',
  'beginner-capitalize-first',
  'beginner-clean-null-fields'
);

-- Also deactivate all other old beginner tier challenges
UPDATE challenges
SET is_active = FALSE
WHERE tier = 'beginner' AND is_active = TRUE;

-- ============================================================================
-- STEP 2: Insert 10 new beginner challenges (Real Office Bug Scenarios)
-- ============================================================================

-- Challenge 1: Incorrect Permission Logic
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Fix Permission Logic Bug',
  'beginner-permission-logic',
  E'## 🏭 Scenario\n\nA junior dev wrote wrong permission logic. Premium users are getting blocked from accessing features they should have access to!\n\n## 🐛 The Bug\n\nThe `canAccess` function is using incorrect boolean logic. It blocks premium users even when they''re not admins.\n\n## 📋 Requirements\n\n- Admin users should have access (regardless of premium status)\n- Premium users should have access (regardless of admin status)\n- Non-admin, non-premium users should NOT have access\n\n## 🎯 Your Task\n\nFix the boolean logic in the `canAccess` function so that either admins OR premium users can access the feature.',
  'easy', 'javascript', 'beginner', 1, 50,
  '{"javascript": "export function canAccess(isAdmin, isPremium) {\n  // BUG: blocks premium users even if not admin\n  if (!isAdmin || !isPremium) {\n    return false;\n  }\n  return true;\n}"}',
  '[{"input": [true, true], "expected": true}, {"input": [false, true], "expected": true}, {"input": [false, false], "expected": false}]',
  ARRAY['Master boolean logic', 'Avoid common permission mistakes', 'Understand OR vs AND in production logic'],
  10, true, 'code', 'javascript', 'test_cases', true
);

-- Challenge 2: Wrong Price Calculation
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Fix Tax Calculation Bug',
  'beginner-tax-calculation',
  E'## 🏭 Scenario\n\nThe pricing page is showing incorrect final prices. Customers are seeing lower prices than they should, causing revenue loss!\n\n## 🐛 The Bug\n\nThe tax is being SUBTRACTED instead of ADDED to the base price. This is a critical bug affecting actual revenue.\n\n## 📋 Requirements\n\n- Add tax percentage to base price (not subtract)\n- Formula: basePrice + (basePrice * taxPercent / 100)\n- Handle edge case of 0 base price correctly\n\n## 🎯 Your Task\n\nFix the calculateTotal function to correctly add tax instead of subtracting it.',
  'easy', 'javascript', 'beginner', 2, 50,
  '{"javascript": "export function calculateTotal(basePrice, taxPercent) {\n  // BUG: subtracting tax instead of adding\n  return basePrice - (basePrice * taxPercent / 100);\n}"}',
  '[{"input": [100, 10], "expected": 110}, {"input": [250, 18], "expected": 295}, {"input": [0, 5], "expected": 0}]',
  ARRAY['Tax calculations', 'Avoid arithmetic mistakes that affect real revenue'],
  8, true, 'code', 'javascript', 'test_cases', true
);

-- Challenge 3: Name Formatting Bug
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Fix Name Formatting in UI',
  'beginner-name-formatting',
  E'## 🏭 Scenario\n\nUser names are displaying as "john doe" instead of "John Doe" in the dashboard. This looks unprofessional and users are complaining!\n\n## 🐛 The Bug\n\nThe formatName function returns the name as-is without any formatting.\n\n## 📋 Requirements\n\n- Capitalize the first letter of each word\n- Handle single names (e.g., "alice" → "Alice")\n- Handle multiple words (e.g., "raj kumar" → "Raj Kumar")\n\n## 🎯 Your Task\n\nImplement proper title case formatting in the formatName function.',
  'easy', 'javascript', 'beginner', 3, 50,
  '{"javascript": "export function formatName(name) {\n  // BUG: returns name as-is, no formatting\n  return name;\n}"}',
  '[{"input": ["john doe"], "expected": "John Doe"}, {"input": ["alice"], "expected": "Alice"}, {"input": ["raj kumar"], "expected": "Raj Kumar"}]',
  ARRAY['Work with strings', 'Understand how UI formatting expectations work'],
  10, true, 'code', 'javascript', 'test_cases', true
);

-- Challenge 4: Filtering Active Users
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Fix Active Users Filter',
  'beginner-active-users-filter',
  E'## 🏭 Scenario\n\nThe admin dashboard is showing inactive users instead of active ones! An intern reversed the filter condition and now the dashboard is useless.\n\n## 🐛 The Bug\n\nThe filter condition checks for active === false instead of active === true.\n\n## 📋 Requirements\n\n- Return only users where active === true\n- Filter out all inactive users\n- Preserve the original array structure\n\n## 🎯 Your Task\n\nFix the filter condition in getActiveUsers to return only active users.',
  'easy', 'javascript', 'beginner', 4, 50,
  '{"javascript": "export function getActiveUsers(users) {\n  // BUG: returns inactive users\n  return users.filter(u => u.active === false);\n}"}',
  '[{"input": [[{"name": "A", "active": true}, {"name": "B", "active": false}]], "expected": [{"name": "A", "active": true}]}]',
  ARRAY['Fix simple logic error in real dashboards', 'Work with arrays & filters'],
  8, true, 'code', 'javascript', 'test_cases', true
);

-- Challenge 5: Wrong Discount Logic
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Fix E-commerce Discount Bug',
  'beginner-discount-logic',
  E'## 🏭 Scenario\n\nThe e-commerce site is showing INCREASED prices when applying discount codes! Customers are angry and abandonments are through the roof.\n\n## 🐛 The Bug\n\nThe discount is being ADDED to the price instead of SUBTRACTED.\n\n## 📋 Requirements\n\n- Subtract the discount amount from the original price\n- Formula: price - (price * discountPercent / 100)\n- Return the discounted price\n\n## 🎯 Your Task\n\nFix the applyDiscount function to correctly subtract the discount.',
  'easy', 'javascript', 'beginner', 5, 50,
  '{"javascript": "export function applyDiscount(price, discountPercent) {\n  // BUG: discount added instead of subtracted\n  return price + (price * discountPercent / 100);\n}"}',
  '[{"input": [100, 10], "expected": 90}, {"input": [500, 20], "expected": 400}]',
  ARRAY['Fix money-related logic', 'Common intern mistake in e-commerce features'],
  8, true, 'code', 'javascript', 'test_cases', false
);

-- Challenge 6: Sorting by Age Bug
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Fix User Age Sorting Bug',
  'beginner-age-sorting',
  E'## 🏭 Scenario\n\nThe user table is sorting ages incorrectly! Users aged 2 appear AFTER users aged 12. This is a classic string vs number sorting bug.\n\n## 🐛 The Bug\n\nThe sort comparator is using string comparison (lexicographic) instead of numeric comparison.\n\n## 📋 Requirements\n\n- Sort users by age in ascending order (youngest first)\n- Use proper numeric comparison (not string comparison)\n- Return the sorted array\n\n## 🎯 Your Task\n\nFix the sortByAge function to use numeric sorting instead of lexicographic sorting.',
  'easy', 'javascript', 'beginner', 6, 50,
  '{"javascript": "export function sortByAge(users) {\n  // BUG: lexicographic sort\n  return users.sort((a, b) => a.age > b.age ? 1 : -1);\n}"}',
  '[{"input": [[{"name": "A", "age": 12}, {"name": "B", "age": 2}]], "expected": [{"name": "B", "age": 2}, {"name": "A", "age": 12}]}]',
  ARRAY['Understand numeric vs lexicographic sorting', 'Common real-production table sorting bug'],
  12, true, 'code', 'javascript', 'test_cases', false
);

-- Challenge 7: Broken Email Masking
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Fix Email Masking for Privacy',
  'beginner-email-masking',
  E'## 🏭 Scenario\n\nFor privacy, we need to mask user emails like john***@gmail.com. But the function is broken and showing full emails everywhere!\n\n## 🐛 The Bug\n\nThe maskEmail function returns the full email without any masking.\n\n## 📋 Requirements\n\n- Keep the first 4 characters of the email username\n- Replace the rest with ***\n- Keep the domain unchanged\n- Example: john@gmail.com → john***@gmail.com\n\n## 🎯 Your Task\n\nImplement proper email masking in the maskEmail function.',
  'easy', 'javascript', 'beginner', 7, 50,
  '{"javascript": "export function maskEmail(email) {\n  // BUG: returns full email without masking\n  return email;\n}"}',
  '[{"input": ["john@gmail.com"], "expected": "john***@gmail.com"}, {"input": ["alice@yahoo.com"], "expected": "alice***@yahoo.com"}]',
  ARRAY['String manipulation', 'Privacy masking patterns'],
  12, true, 'code', 'javascript', 'test_cases', false
);

-- Challenge 8: Incorrect Average Calculation
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Fix Analytics Average Bug',
  'beginner-average-calculation',
  E'## 🏭 Scenario\n\nThe analytics dashboard is showing totally wrong averages! Instead of showing 20 as the average of [10, 20, 30], it shows 60.\n\n## 🐛 The Bug\n\nThe function is returning the SUM instead of the AVERAGE. It''s missing the division by array length.\n\n## 📋 Requirements\n\n- Calculate the sum of all numbers\n- Divide by the count of numbers\n- Return the average\n\n## 🎯 Your Task\n\nFix the getAverage function to return the actual average, not the sum.',
  'easy', 'javascript', 'beginner', 8, 50,
  '{"javascript": "export function getAverage(numbers) {\n  // BUG: missing divide by length\n  return numbers.reduce((a,b) => a+b, 0);\n}"}',
  '[{"input": [[10, 20, 30]], "expected": 20}, {"input": [[5, 15]], "expected": 10}]',
  ARRAY['Numeric logic', 'Analytics calculations'],
  8, true, 'code', 'javascript', 'test_cases', false
);

-- Challenge 9: Capitalize First Letter Only Bug
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Fix Blog Title Capitalization',
  'beginner-capitalize-first',
  E'## 🏭 Scenario\n\nBlog titles must capitalize ONLY the first letter, not the entire string. But our function is making titles look like "HELLO WORLD" instead of "Hello world".\n\n## 🐛 The Bug\n\nThe function uses toUpperCase() which capitalizes the entire string.\n\n## 📋 Requirements\n\n- Capitalize only the first character\n- Keep the rest of the string in lowercase\n- Example: "hello world" → "Hello world"\n\n## 🎯 Your Task\n\nFix the capitalize function to only capitalize the first letter.',
  'easy', 'javascript', 'beginner', 9, 50,
  '{"javascript": "export function capitalize(str) {\n  // BUG: uppercase whole string\n  return str.toUpperCase();\n}"}',
  '[{"input": ["hello world"], "expected": "Hello world"}, {"input": ["api dashboard"], "expected": "Api dashboard"}]',
  ARRAY['Small string transformation tasks', 'UI formatting consistency'],
  8, true, 'code', 'javascript', 'test_cases', false
);

-- Challenge 10: Remove Null Values from API Response
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Clean Null Fields from API',
  'beginner-clean-null-fields',
  E'## 🏭 Scenario\n\nThe API is returning objects with null values, and the frontend is breaking! We need to remove all null fields before sending the response.\n\n## 🐛 The Bug\n\nThe cleanResponse function returns the object as-is without removing null values.\n\n## 📋 Requirements\n\n- Remove all properties with null values\n- Keep all properties with actual values (including 0, false, "")\n- Return the cleaned object\n\n## 🎯 Your Task\n\nImplement the logic to filter out null properties from the object.',
  'easy', 'javascript', 'beginner', 10, 50,
  '{"javascript": "export function cleanResponse(obj) {\n  // BUG: returns object without removing nulls\n  return obj;\n}"}',
  '[{"input": [{"name": "A", "age": null}], "expected": {"name": "A"}}, {"input": [{"x": null, "y": 5}], "expected": {"y": 5}}]',
  ARRAY['Work with objects', 'API data cleaning', 'Common backend task'],
  12, true, 'code', 'javascript', 'test_cases', false
);

-- ============================================================================
-- VERIFICATION QUERIES (commented out to avoid migration errors)
-- Run these manually in Supabase SQL Editor after migration
-- ============================================================================

-- Check all challenges inserted correctly
-- SELECT
--   order_in_tier,
--   title,
--   slug,
--   points,
--   validation_type,
--   response_format,
--   challenge_type,
--   is_free_tier_accessible,
--   is_active,
--   CASE
--     WHEN starter_code::jsonb ? 'javascript' THEN '✅ Has JS starter'
--     ELSE '❌ Missing JS starter'
--   END as starter_code_check,
--   jsonb_array_length(test_cases::jsonb) as test_case_count
-- FROM challenges
-- WHERE tier = 'beginner' AND is_active = TRUE
-- ORDER BY order_in_tier;

-- DEBUG: Check actual starter_code for first challenge
-- SELECT
--   slug,
--   starter_code->>'javascript' as extracted_code,
--   test_cases
-- FROM challenges
-- WHERE slug = 'beginner-permission-logic'
-- LIMIT 1;
