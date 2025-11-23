-- =============================================
-- Migration: Add 20 More Beginner Challenges (11-30)
-- Description: Complete the beginner tier with 20 additional real-world bug scenarios
-- Version: 041
-- Date: 2025-01-20
-- =============================================

-- Challenge 11: Incorrect Fallback Value in Config
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Fix Incorrect Config Fallback',
  'beginner-fallback-config',
  E'## 🏭 Scenario\n\nA feature is failing because the fallback config value is wrong. When timeout config is missing, the system uses 0 instead of the safe default of 3000ms.\n\n## 🐛 The Bug\n\nThe fallback value is 0 when it should be 3000 (3 seconds).\n\n## 📋 Requirements\n\n- If config has timeout, use it\n- If config has no timeout, use 3000 as fallback\n- Handle missing config safely\n\n## 🎯 Your Task\n\nFix the getTimeout function to use the correct fallback value.',
  'easy', 'javascript', 'beginner', 11, 50,
  '{"javascript": "export function getTimeout(config) {\n  // BUG: wrong fallback (should be 3000)\n  return config.timeout || 0;\n}"}',
  '[{"input": [{"timeout": 5000}], "expected": 5000}, {"input": [{}], "expected": 3000}]',
  ARRAY['Handling fallback values safely', 'Understand truthy/falsy pitfalls'],
  8, true, 'code', 'javascript', 'test_cases', false
);

-- Challenge 12: Fix Broken Slug Generator
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Fix Broken Slug Generator',
  'beginner-slug-generator',
  E'## 🏭 Scenario\n\nBlog slugs show spaces and uppercase letters. The SEO team complained that URLs are not properly formatted!\n\n## 🐛 The Bug\n\nThe createSlug function returns the original title without any transformation.\n\n## 📋 Requirements\n\n- Convert to lowercase\n- Replace spaces with hyphens\n- Generate clean, SEO-friendly slugs\n\n## 🎯 Your Task\n\nImplement the slug generation logic to create proper URL-safe slugs.',
  'easy', 'javascript', 'beginner', 12, 50,
  '{"javascript": "export function createSlug(title) {\n  // BUG: returns original title\n  return title;\n}"}',
  '[{"input": ["Hello World"], "expected": "hello-world"}, {"input": ["API Rate Limits"], "expected": "api-rate-limits"}]',
  ARRAY['Basic string cleaning', 'Generate consistent slugs'],
  10, true, 'code', 'javascript', 'test_cases', false
);

-- Challenge 13: Incorrect Array Deduplication
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Fix Array Deduplication Bug',
  'beginner-array-dedupe',
  E'## 🏭 Scenario\n\nThe admin panel shows duplicate entries because the deduplication logic is broken.\n\n## 🐛 The Bug\n\nThe removeDuplicates function returns the original array without removing duplicates.\n\n## 📋 Requirements\n\n- Remove all duplicate values\n- Preserve order of first occurrence\n- Return array with unique values only\n\n## 🎯 Your Task\n\nImplement proper array deduplication using Set or other methods.',
  'easy', 'javascript', 'beginner', 13, 50,
  '{"javascript": "export function removeDuplicates(arr) {\n  // BUG: returns original array\n  return arr;\n}"}',
  '[{"input": [[1, 2, 2, 3]], "expected": [1, 2, 3]}, {"input": [[5, 5, 5]], "expected": [5]}]',
  ARRAY['Sets', 'Deduplication'],
  10, true, 'code', 'javascript', 'test_cases', false
);

-- Challenge 14: Fix Broken Null Safe Access
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Fix Null Safe Access Bug',
  'beginner-null-safe-access',
  E'## 🏭 Scenario\n\nThe app crashes with "Cannot read property city of undefined" when a user has no address.\n\n## 🐛 The Bug\n\nDirect property access without checking if address exists.\n\n## 📋 Requirements\n\n- Return city if user has address with city\n- Return "Unknown" if user has no address\n- Never crash on missing data\n\n## 🎯 Your Task\n\nImplement null-safe access to prevent crashes.',
  'easy', 'javascript', 'beginner', 14, 50,
  '{"javascript": "export function getCity(user) {\n  // BUG: crashes on user.address undefined\n  return user.address.city;\n}"}',
  '[{"input": [{"address": {"city": "Delhi"}}], "expected": "Delhi"}, {"input": [{}], "expected": "Unknown"}]',
  ARRAY['Defensive coding', 'Optional chaining patterns'],
  10, true, 'code', 'javascript', 'test_cases', false
);

-- Challenge 15: Broken Boolean Toggle
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Fix Boolean Toggle Bug',
  'beginner-boolean-toggle',
  E'## 🏭 Scenario\n\nA feature flag toggle is broken - it always returns true regardless of current state.\n\n## 🐛 The Bug\n\nThe toggle function always returns true instead of flipping the boolean value.\n\n## 📋 Requirements\n\n- If input is true, return false\n- If input is false, return true\n- Implement proper boolean negation\n\n## 🎯 Your Task\n\nFix the toggle function to properly flip boolean values.',
  'easy', 'javascript', 'beginner', 15, 50,
  '{"javascript": "export function toggle(flag) {\n  // BUG: always returns true\n  return true;\n}"}',
  '[{"input": [true], "expected": false}, {"input": [false], "expected": true}]',
  ARRAY['Boolean operations', 'Simple toggling mechanic'],
  8, true, 'code', 'javascript', 'test_cases', false
);

-- Challenge 16: Wrong User Greeting
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Fix User Greeting Bug',
  'beginner-user-greeting',
  E'## 🏭 Scenario\n\nThe login greeting is wrong - it always shows "Hello, Guest" even for logged-in users!\n\n## 🐛 The Bug\n\nThe greeting function ignores the user object and always returns "Hello, Guest".\n\n## 📋 Requirements\n\n- If user exists and has name, greet with their name\n- If user is null/undefined, greet as "Guest"\n- Format: "Hello, [Name]"\n\n## 🎯 Your Task\n\nImplement proper conditional greeting based on user data.',
  'easy', 'javascript', 'beginner', 16, 50,
  '{"javascript": "export function greet(user) {\n  return \"Hello, Guest\";\n}"}',
  '[{"input": [{"name": "Hunny"}], "expected": "Hello, Hunny"}, {"input": [null], "expected": "Hello, Guest"}]',
  ARRAY['Basic conditional rendering', 'Null/undefined checks'],
  8, true, 'code', 'javascript', 'test_cases', false
);

-- Challenge 17: Broken Cart Total Calculation
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Fix Cart Total Calculation',
  'beginner-cart-total',
  E'## 🏭 Scenario\n\nThe shopping cart shows incorrect totals because it only uses the first item price!\n\n## 🐛 The Bug\n\nThe function returns only the first item price instead of summing all items.\n\n## 📋 Requirements\n\n- Sum all item prices in the cart\n- Handle empty carts (return 0)\n- Work with any number of items\n\n## 🎯 Your Task\n\nImplement proper cart total calculation by summing all item prices.',
  'easy', 'javascript', 'beginner', 17, 50,
  '{"javascript": "export function getCartTotal(items) {\n  // BUG: returns first item only\n  return items[0]?.price || 0;\n}"}',
  '[{"input": [[{"price": 10}, {"price": 20}]], "expected": 30}, {"input": [[]], "expected": 0}]',
  ARRAY['Reduce() basics', 'Proper cart total logic'],
  12, true, 'code', 'javascript', 'test_cases', false
);

-- Challenge 18: Broken Temperature Converter
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Fix Temperature Converter',
  'beginner-temperature-converter',
  E'## 🏭 Scenario\n\nThe weather widget shows wrong temperatures because the Celsius to Fahrenheit formula is incomplete.\n\n## 🐛 The Bug\n\nThe formula is missing the +32 offset. It only multiplies by 1.8.\n\n## 📋 Requirements\n\n- Convert Celsius to Fahrenheit correctly\n- Formula: (C × 1.8) + 32\n- 0°C should be 32°F, 25°C should be 77°F\n\n## 🎯 Your Task\n\nFix the temperature conversion formula.',
  'easy', 'javascript', 'beginner', 18, 50,
  '{"javascript": "export function toFahrenheit(celsius) {\n  // BUG: wrong formula\n  return celsius * 1.8;\n}"}',
  '[{"input": [0], "expected": 32}, {"input": [25], "expected": 77}]',
  ARRAY['Basic arithmetic', 'Learn formula correctness'],
  8, true, 'code', 'javascript', 'test_cases', false
);

-- Challenge 19: Broken Username Validator
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Fix Username Validator',
  'beginner-username-validator',
  E'## 🏭 Scenario\n\nUsernames shorter than 3 characters are being allowed, violating our validation rules.\n\n## 🐛 The Bug\n\nThe validation function always returns true without checking username length.\n\n## 📋 Requirements\n\n- Usernames must be at least 3 characters long\n- Return true if valid, false if invalid\n- Check length property\n\n## 🎯 Your Task\n\nImplement proper username length validation.',
  'easy', 'javascript', 'beginner', 19, 50,
  '{"javascript": "export function isValidUsername(name) {\n  // BUG: always true\n  return true;\n}"}',
  '[{"input": ["ab"], "expected": false}, {"input": ["john"], "expected": true}]',
  ARRAY['Input validation basics', 'Form logic reliability'],
  8, true, 'code', 'javascript', 'test_cases', false
);

-- Challenge 20: Broken Date Formatter
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Fix Date Formatter',
  'beginner-date-formatter',
  E'## 🏭 Scenario\n\nDates appear in wrong format on the dashboard. They should show as "DD Mon YYYY" but they show as "YYYY-MM-DD".\n\n## 🐛 The Bug\n\nThe formatDate function returns the date string without any formatting.\n\n## 📋 Requirements\n\n- Convert "2024-02-01" to "01 Feb 2024"\n- Convert "2023-12-25" to "25 Dec 2023"\n- Parse date and format properly\n\n## 🎯 Your Task\n\nImplement date formatting to match the required output format.',
  'easy', 'javascript', 'beginner', 20, 50,
  '{"javascript": "export function formatDate(dateStr) {\n  return dateStr; // no formatting\n}"}',
  '[{"input": ["2024-02-01"], "expected": "01 Feb 2024"}, {"input": ["2023-12-25"], "expected": "25 Dec 2023"}]',
  ARRAY['Date formatting basics', 'Readable UI output'],
  12, true, 'code', 'javascript', 'test_cases', false
);

-- Challenge 21: Broken Array Reverser
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Fix Array Reverser',
  'beginner-array-reverser',
  E'## 🏭 Scenario\n\nThe history list is supposed to show items in reverse order, but it shows them in the original order.\n\n## 🐛 The Bug\n\nThe reverseArray function returns the array as-is without reversing.\n\n## 📋 Requirements\n\n- Reverse the order of array elements\n- [1,2,3] should become [3,2,1]\n- Handle empty arrays correctly\n\n## 🎯 Your Task\n\nImplement array reversal using .reverse() or other methods.',
  'easy', 'javascript', 'beginner', 21, 50,
  '{"javascript": "export function reverseArray(arr) {\n  // BUG: returns same array\n  return arr;\n}"}',
  '[{"input": [[1,2,3]], "expected": [3,2,1]}, {"input": [[]], "expected": []}]',
  ARRAY['Basic array operations', 'Understanding .reverse() and non-mutating patterns'],
  8, true, 'code', 'javascript', 'test_cases', false
);

-- Challenge 22: Fix Broken Trim Helper
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Fix Trim Helper',
  'beginner-trim-helper',
  E'## 🏭 Scenario\n\nSearch input fails because extra spaces are not being removed from user input.\n\n## 🐛 The Bug\n\nThe cleanInput function returns the string without removing leading/trailing whitespace.\n\n## 📋 Requirements\n\n- Remove leading spaces\n- Remove trailing spaces\n- "  hello " should become "hello"\n\n## 🎯 Your Task\n\nImplement input sanitization using the trim() method.',
  'easy', 'javascript', 'beginner', 22, 50,
  '{"javascript": "export function cleanInput(str) {\n  return str; // missing trim\n}"}',
  '[{"input": ["  hello "], "expected": "hello"}, {"input": [" world"], "expected": "world"}]',
  ARRAY['Input sanitization', 'Avoid user-side errors'],
  8, true, 'code', 'javascript', 'test_cases', false
);

-- Challenge 23: Incorrect Minimum Finder
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Fix Minimum Finder',
  'beginner-find-min',
  E'## 🏭 Scenario\n\nThe analytics module shows the wrong minimum value - it shows the maximum instead!\n\n## 🐛 The Bug\n\nThe function uses Math.max instead of Math.min.\n\n## 📋 Requirements\n\n- Find the smallest number in the array\n- Use Math.min correctly\n- Handle arrays of any size\n\n## 🎯 Your Task\n\nFix the math function to find the minimum value instead of maximum.',
  'easy', 'javascript', 'beginner', 23, 50,
  '{"javascript": "export function findMin(arr) {\n  // BUG: returns max instead of min\n  return Math.max(...arr);\n}"}',
  '[{"input": [[5,3,1]], "expected": 1}, {"input": [[10,2,8]], "expected": 2}]',
  ARRAY['Fix simple math mistakes', 'Use Math.min'],
  8, true, 'code', 'javascript', 'test_cases', false
);

-- Challenge 24: Fix Broken Even Checker
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Fix Even Number Checker',
  'beginner-even-checker',
  E'## 🏭 Scenario\n\nThe even number validator is marking odd numbers as even! The logic is completely wrong.\n\n## 🐛 The Bug\n\nThe function checks if number is positive (n > 0) instead of checking if it is even.\n\n## 📋 Requirements\n\n- Return true if number is even\n- Return false if number is odd\n- Use modulo operator (%) correctly\n\n## 🎯 Your Task\n\nImplement proper even number check using the modulo operator.',
  'easy', 'javascript', 'beginner', 24, 50,
  '{"javascript": "export function isEven(n) {\n  // BUG: checks > 0 instead of even\n  return n > 0;\n}"}',
  '[{"input": [2], "expected": true}, {"input": [3], "expected": false}]',
  ARRAY['Modulo operator basics', 'Classic beginner bug'],
  8, true, 'code', 'javascript', 'test_cases', false
);

-- Challenge 25: Fix Incorrect Initials Generator
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Fix Initials Generator',
  'beginner-initials-generator',
  E'## 🏭 Scenario\n\nProfile cards show the full name instead of initials in the avatar.\n\n## 🐛 The Bug\n\nThe getInitials function returns the full name without extracting initials.\n\n## 📋 Requirements\n\n- Extract first letter of each word\n- "John Doe" should return "JD"\n- "Alice" should return "A"\n- Make initials uppercase\n\n## 🎯 Your Task\n\nImplement initials extraction by splitting name and taking first letters.',
  'easy', 'javascript', 'beginner', 25, 50,
  '{"javascript": "export function getInitials(name) {\n  return name; // buggy\n}"}',
  '[{"input": ["John Doe"], "expected": "JD"}, {"input": ["Alice"], "expected": "A"}]',
  ARRAY['String splitting', 'Initial generation'],
  10, true, 'code', 'javascript', 'test_cases', false
);

-- Challenge 26: Broken Password Strength Checker
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Fix Password Strength Checker',
  'beginner-password-strength',
  E'## 🏭 Scenario\n\nWeak passwords like "abc" are marked as strong, allowing users to set insecure passwords.\n\n## 🐛 The Bug\n\nThe validation function always returns true without checking password strength.\n\n## 📋 Requirements\n\n- Strong password: length >= 6 AND contains letters AND numbers\n- "abc" should return false (too short, no numbers)\n- "Abc123!" should return true (meets all criteria)\n\n## 🎯 Your Task\n\nImplement basic password strength validation.',
  'easy', 'javascript', 'beginner', 26, 50,
  '{"javascript": "export function isStrong(password) {\n  return true; // terrible logic\n}"}',
  '[{"input": ["abc"], "expected": false}, {"input": ["Abc123!"], "expected": true}]',
  ARRAY['Basic pattern matching', 'Validation logic'],
  12, true, 'code', 'javascript', 'test_cases', false
);

-- Challenge 27: Broken Array Sum
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Fix Array Sum',
  'beginner-array-sum',
  E'## 🏭 Scenario\n\nThe finance module shows incorrect totals because the sum function always returns 0.\n\n## 🐛 The Bug\n\nThe sum function returns 0 instead of calculating the actual sum of array elements.\n\n## 📋 Requirements\n\n- Sum all numbers in the array\n- [1,2,3] should return 6\n- [10,20] should return 30\n\n## 🎯 Your Task\n\nImplement array summation using reduce or a loop.',
  'easy', 'javascript', 'beginner', 27, 50,
  '{"javascript": "export function sum(arr) {\n  return 0; // always wrong\n}"}',
  '[{"input": [[1,2,3]], "expected": 6}, {"input": [[10,20]], "expected": 30}]',
  ARRAY['Reduce basics', 'Summation'],
  10, true, 'code', 'javascript', 'test_cases', false
);

-- Challenge 28: Fix Broken Case-Insensitive Search
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Fix Case-Insensitive Search',
  'beginner-case-insensitive-search',
  E'## 🏭 Scenario\n\nThe search bar does not match uppercase/lowercase names. Searching "hello" does not find "Hello".\n\n## 🐛 The Bug\n\nThe search uses case-sensitive includes() which fails when cases don\'t match exactly.\n\n## 📋 Requirements\n\n- Match regardless of case\n- "Hello" should match "hello"\n- "World" should match "WORLD"\n\n## 🎯 Your Task\n\nImplement case-insensitive search by normalizing both strings to lowercase.',
  'easy', 'javascript', 'beginner', 28, 50,
  '{"javascript": "export function includesIgnoreCase(str, search) {\n  return str.includes(search);\n}"}',
  '[{"input": ["Hello", "hello"], "expected": true}, {"input": ["World", "WORLD"], "expected": true}]',
  ARRAY['Case normalization', 'Search logic'],
  10, true, 'code', 'javascript', 'test_cases', false
);

-- Challenge 29: Broken Range Checker
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Fix Range Checker',
  'beginner-range-checker',
  E'## 🏭 Scenario\n\nSystem error: age validation is failing because the range check logic is inverted.\n\n## 🐛 The Bug\n\nThe condition uses AND (&&) instead of OR (||), making it impossible to satisfy.\n\n## 📋 Requirements\n\n- Return true if n is between min and max (inclusive)\n- 5 should be in range [0, 10]\n- 15 should NOT be in range [0, 10]\n\n## 🎯 Your Task\n\nFix the range check logic to use correct comparison operators.',
  'easy', 'javascript', 'beginner', 29, 50,
  '{"javascript": "export function inRange(n, min, max) {\n  // BUG: wrong condition\n  return n < min && n > max;\n}"}',
  '[{"input": [5, 0, 10], "expected": true}, {"input": [15, 0, 10], "expected": false}]',
  ARRAY['Correct comparison logic', 'Range conditions'],
  10, true, 'code', 'javascript', 'test_cases', false
);

-- Challenge 30: Broken Merge of Two Arrays
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Fix Array Merge',
  'beginner-array-merge',
  E'## 🏭 Scenario\n\nThe notification list is missing items because the array merge is broken - it only returns the first array.\n\n## 🐛 The Bug\n\nThe merge function returns arr1 without combining it with arr2.\n\n## 📋 Requirements\n\n- Combine both arrays into one\n- [1,2] + [3,4] should become [1,2,3,4]\n- Handle empty arrays correctly\n\n## 🎯 Your Task\n\nImplement array merging using spread operator or concat.',
  'easy', 'javascript', 'beginner', 30, 50,
  '{"javascript": "export function merge(arr1, arr2) {\n  return arr1; // incorrect\n}"}',
  '[{"input": [[1,2], [3,4]], "expected": [1,2,3,4]}, {"input": [[], [5]], "expected": [5]}]',
  ARRAY['Spread operator basics', 'Combining arrays'],
  10, true, 'code', 'javascript', 'test_cases', false
);

-- ============================================================================
-- VERIFICATION QUERIES (commented out to avoid migration errors)
-- Run these manually in Supabase SQL Editor after migration
-- ============================================================================

-- Check all 30 beginner challenges
-- SELECT
--   order_in_tier,
--   title,
--   slug,
--   points,
--   validation_type,
--   is_active
-- FROM challenges
-- WHERE tier = 'beginner' AND is_active = TRUE
-- ORDER BY order_in_tier;

-- Count total beginner challenges
-- SELECT COUNT(*) as total_beginner_challenges
-- FROM challenges
-- WHERE tier = 'beginner' AND is_active = TRUE;
