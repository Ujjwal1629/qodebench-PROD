-- =============================================
-- Migration: Add Product & Feature Planning Challenges
-- Description: 15 real-world product and feature planning scenarios
-- Version: 053
-- Date: 2025-01-21
-- =============================================

-- Challenge 1: Feature Planning — Simple File Upload Module
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Feature Planning — Simple File Upload Module',
  'pfp-file-upload',
  E'## PM Message\n\n"Users need to upload PDFs/images. Please plan the basic implementation."\n\n## JIRA Summary\n\nAdd simple file upload support.\n\n## Team Discussion Highlights\n\n**Lead:** "Keep flow simple, FE validate → BE save."\n\n## Your Task\n\nPlan the implementation covering:\n\n1. **Problem** - What problem are we solving?\n2. **File Types + Size** - What formats and size limits?\n3. **Flow** - Describe the user flow step by step\n4. **Errors** - What error cases to handle?\n5. **Estimate** - How many days to implement?',
  'easy', 'javascript', 'product-planning', 1, 50,
  '{"text": "Write your feature plan here..."}',
  '{"expected_answer": "Problem: No upload option.\nTypes: PDF/JPG/PNG/DOCX up to 5MB.\nFlow: select → validate → upload API → store → return success.\nErrors: size, type, network.\nEstimate: 4–5 days.", "evaluation_criteria": ["Identifies the problem clearly", "Specifies file types and size limits", "Describes complete user flow", "Lists error handling scenarios", "Provides realistic time estimate"]}',
  ARRAY['Feature planning', 'User flow design', 'Error handling', 'Time estimation'],
  20, true, 'document', 'text', 'ai_only', false
);

-- Challenge 2: Add "Resend OTP" Feature
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Add "Resend OTP" Feature',
  'pfp-resend-otp',
  E'## PM Message\n\n"Users keep complaining that OTP is not coming. Add a resend button."\n\n## JIRA Summary\n\nImplement resend-OTP with cooldown.\n\n## Team Discussion Highlights\n\n**QA:** "Add cooldown to avoid spam."\n\n## Your Task\n\nPlan the implementation covering:\n\n1. **Problem** - What problem are we solving?\n2. **Cooldown Logic** - What cooldown period?\n3. **Flow** - Describe the user flow\n4. **Errors** - What error cases to handle?\n5. **Estimate** - How many days to implement?',
  'easy', 'javascript', 'product-planning', 2, 50,
  '{"text": "Write your feature plan here..."}',
  '{"expected_answer": "Problem: Users can''t retry OTP.\nCooldown: 30–60 seconds.\nFlow: click resend → backend generates OTP → send → show timer.\nErrors: too many attempts, invalid number.\nEstimate: 2–3 days.", "evaluation_criteria": ["Identifies the problem clearly", "Specifies cooldown logic", "Describes complete flow with timer", "Lists error scenarios including rate limiting", "Provides realistic estimate"]}',
  ARRAY['OTP flow design', 'Rate limiting', 'User experience', 'Error handling'],
  15, true, 'document', 'text', 'ai_only', false
);

-- Challenge 3: Implement Basic Search Bar (Client → Server)
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Implement Basic Search Bar (Client → Server)',
  'pfp-search-bar',
  E'## PM Message\n\n"We need search in the dashboard table."\n\n## JIRA Summary\n\nCreate name-based search.\n\n## Team Discussion Highlights\n\n**Lead:** "Use debounce, keep it simple."\n\n## Your Task\n\nPlan the implementation covering:\n\n1. **Problem** - What problem are we solving?\n2. **Flow** - Describe the search flow\n3. **Fields** - What fields to search?\n4. **Errors** - What error cases to handle?\n5. **Estimate** - How many days to implement?',
  'easy', 'javascript', 'product-planning', 3, 50,
  '{"text": "Write your feature plan here..."}',
  '{"expected_answer": "Problem: Can''t search long lists.\nFlow: user types → debounce → API search → show results.\nFields: name.\nErrors: slow API, no results.\nEstimate: 2 days.", "evaluation_criteria": ["Identifies the problem", "Mentions debouncing for performance", "Describes API flow", "Lists error cases", "Realistic estimate"]}',
  ARRAY['Search implementation', 'Debouncing', 'API design', 'Performance optimization'],
  15, true, 'document', 'text', 'ai_only', false
);

-- Challenge 4: Add "Edit Profile" Feature
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Add "Edit Profile" Feature',
  'pfp-edit-profile',
  E'## PM Message\n\n"Users want to update name, phone, avatar."\n\n## JIRA Summary\n\nAdd profile update page.\n\n## Team Discussion Highlights\n\n**QA:** "Phone validation required."\n\n## Your Task\n\nPlan the implementation covering:\n\n1. **Editable Fields** - What fields can users edit?\n2. **Flow** - Describe the edit flow\n3. **Validations** - What validations needed?\n4. **Errors** - What error cases to handle?\n5. **Estimate** - How many days to implement?',
  'easy', 'javascript', 'product-planning', 4, 50,
  '{"text": "Write your feature plan here..."}',
  '{"expected_answer": "Fields: name, phone, avatar.\nFlow: fetch → edit → submit → update API.\nValidations: phone/email.\nErrors: invalid phone, image too large.\nEstimate: 3–4 days.", "evaluation_criteria": ["Lists all editable fields", "Describes complete CRUD flow", "Specifies validation requirements", "Lists error scenarios", "Provides realistic estimate"]}',
  ARRAY['Profile management', 'Form validation', 'CRUD operations', 'UX design'],
  20, true, 'document', 'text', 'ai_only', false
);

-- Challenge 5: Implement Pagination for Dashboard List
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Implement Pagination for Dashboard List',
  'pfp-pagination',
  E'## PM Message\n\n"We have 400+ entries. Add pagination."\n\n## JIRA Summary\n\nAdd pagination to dashboard list.\n\n## Your Task\n\nPlan the implementation covering:\n\n1. **Problem** - What problem are we solving?\n2. **Page Size** - How many items per page?\n3. **Flow** - Describe the pagination flow\n4. **Errors** - What error cases to handle?\n5. **Estimate** - How many days to implement?',
  'easy', 'javascript', 'product-planning', 5, 50,
  '{"text": "Write your feature plan here..."}',
  '{"expected_answer": "Page size: 10–20.\nFlow: FE sends page X → BE returns limit/offset.\nErrors: out-of-range page.\nEstimate: 1–1.5 days.", "evaluation_criteria": ["Identifies the problem", "Specifies appropriate page size", "Describes pagination API pattern", "Lists edge cases", "Realistic estimate"]}',
  ARRAY['Pagination design', 'API parameters', 'Data fetching', 'Performance'],
  15, true, 'document', 'text', 'ai_only', false
);

-- Challenge 6: Add Basic Notification Center
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Add Basic Notification Center',
  'pfp-notification-center',
  E'## PM Message\n\n"Users should see notifications inside the app."\n\n## Team Discussion\n\n**Lead:** "Simple pull-based notifications."\n\n## Your Task\n\nPlan the implementation covering:\n\n1. **Events** - What events trigger notifications?\n2. **Format** - What data structure for notifications?\n3. **Flow** - Describe the notification flow\n4. **Errors** - What error cases to handle?\n5. **Estimate** - How many days to implement?',
  'medium', 'javascript', 'product-planning', 6, 75,
  '{"text": "Write your feature plan here..."}',
  '{"expected_answer": "Events: task assigned, comment, alert.\nFormat: title/body/timestamp.\nFlow: fetch → list → mark read.\nErrors: empty list, slow API.\nEstimate: 3 days.", "evaluation_criteria": ["Lists relevant notification events", "Specifies data structure", "Describes complete flow including read status", "Lists error scenarios", "Realistic estimate"]}',
  ARRAY['Notification system design', 'Event handling', 'State management', 'UX patterns'],
  20, true, 'document', 'text', 'ai_only', false
);

-- Challenge 7: Add "Two-Step Delete Confirmation"
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Add "Two-Step Delete Confirmation"',
  'pfp-delete-confirmation',
  E'## Scenario\n\nUsers accidentally delete items.\n\n## Your Task\n\nPlan the implementation covering:\n\n1. **Problem** - What problem are we solving?\n2. **Flow** - Describe the confirmation flow\n3. **Errors** - What error cases to handle?\n4. **Estimate** - How many days to implement?',
  'easy', 'javascript', 'product-planning', 7, 50,
  '{"text": "Write your feature plan here..."}',
  '{"expected_answer": "Flow: click delete → show popup → confirm.\nErrors: accidental double click, missing item.\nEstimate: 1 day.", "evaluation_criteria": ["Describes two-step confirmation pattern", "Mentions modal/dialog UI", "Lists edge cases", "Realistic estimate"]}',
  ARRAY['Confirmation patterns', 'UX safety', 'Modal design', 'Error prevention'],
  15, true, 'document', 'text', 'ai_only', false
);

-- Challenge 8: Add "Download Invoice" Feature
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Add "Download Invoice" Feature',
  'pfp-download-invoice',
  E'## PM Message\n\n"Users want to download invoice PDF."\n\n## Your Task\n\nPlan the implementation covering:\n\n1. **Problem** - What problem are we solving?\n2. **Flow** - Describe the download flow\n3. **Errors** - What error cases to handle?\n4. **Estimate** - How many days to implement?',
  'easy', 'javascript', 'product-planning', 8, 50,
  '{"text": "Write your feature plan here..."}',
  '{"expected_answer": "Flow: user clicks → FE calls invoice API → BE returns PDF → FE downloads file.\nErrors: missing invoice, timeout.\nEstimate: 2–3 days.", "evaluation_criteria": ["Describes complete download flow", "Mentions PDF generation/retrieval", "Lists error cases", "Realistic estimate"]}',
  ARRAY['File download', 'PDF handling', 'API design', 'Error handling'],
  15, true, 'document', 'text', 'ai_only', false
);

-- Challenge 9: Basic Analytics Widget (Count Only)
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Basic Analytics Widget (Count Only)',
  'pfp-analytics-widget',
  E'## PM Message\n\n"Add simple metrics: total users, active users."\n\n## Your Task\n\nPlan the implementation covering:\n\n1. **Metrics** - What metrics to display?\n2. **Flow** - Describe the data fetching flow\n3. **Errors** - What error cases to handle?\n4. **Estimate** - How many days to implement?',
  'easy', 'javascript', 'product-planning', 9, 50,
  '{"text": "Write your feature plan here..."}',
  '{"expected_answer": "Metrics: total users, active users.\nFlow: FE calls stats API.\nErrors: empty DB, backend error.\nEstimate: 2 days.", "evaluation_criteria": ["Lists appropriate metrics", "Describes API flow", "Lists error scenarios", "Realistic estimate"]}',
  ARRAY['Analytics design', 'Data visualization', 'API integration', 'Dashboard widgets'],
  15, true, 'document', 'text', 'ai_only', false
);

-- Challenge 10: Implement "Change Password" Flow
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Implement "Change Password" Flow',
  'pfp-change-password',
  E'## Scenario\n\nUsers need to update their password from settings.\n\n## Your Task\n\nPlan the implementation covering:\n\n1. **Flow** - Describe the password change flow\n2. **Validations** - What validations needed?\n3. **Errors** - What error cases to handle?\n4. **Estimate** - How many days to implement?',
  'easy', 'javascript', 'product-planning', 10, 50,
  '{"text": "Write your feature plan here..."}',
  '{"expected_answer": "Flow: old pwd → new pwd → confirm → API → success.\nValidations: strong password, mismatch.\nErrors: incorrect old password.\nEstimate: 2 days.", "evaluation_criteria": ["Describes complete flow with verification", "Lists validation requirements", "Mentions password strength requirements", "Lists error cases", "Realistic estimate"]}',
  ARRAY['Password management', 'Security', 'Form validation', 'UX flows'],
  15, true, 'document', 'text', 'ai_only', false
);

-- Challenge 11: Add UI Loading States
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Add UI Loading States',
  'pfp-loading-states',
  E'## Scenario\n\nPages feel "laggy".\n\n## Your Task\n\nPlan the implementation covering:\n\n1. **Solution** - How to show loading states?\n2. **Flow** - Describe the loading flow\n3. **Errors** - What error cases to handle?\n4. **Estimate** - How many days to implement?',
  'easy', 'javascript', 'product-planning', 11, 50,
  '{"text": "Write your feature plan here..."}',
  '{"expected_answer": "Add loading spinner for API calls.\nFlow: start loading → API → stop.\nErrors: infinite loader.\nEstimate: 1 day.", "evaluation_criteria": ["Describes loading UI pattern", "Mentions spinner/skeleton", "Lists error states", "Realistic estimate"]}',
  ARRAY['Loading states', 'UX patterns', 'State management', 'User feedback'],
  10, true, 'document', 'text', 'ai_only', false
);

-- Challenge 12: Build Simple Activity Log
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Build Simple Activity Log',
  'pfp-activity-log',
  E'## Scenario\n\nPM wants audit trail.\n\n## Your Task\n\nPlan the implementation covering:\n\n1. **Events** - What events to log?\n2. **Fields** - What data to store?\n3. **Flow** - Describe the logging flow\n4. **Estimate** - How many days to implement?',
  'medium', 'javascript', 'product-planning', 12, 75,
  '{"text": "Write your feature plan here..."}',
  '{"expected_answer": "Events: login/logout/update.\nFields: userId/action/timestamp.\nFlow: BE logs events → FE displays.\nEstimate: 2–3 days.", "evaluation_criteria": ["Lists relevant events to log", "Specifies data schema", "Describes backend and frontend flow", "Realistic estimate"]}',
  ARRAY['Activity logging', 'Audit trails', 'Data persistence', 'System design'],
  20, true, 'document', 'text', 'ai_only', false
);

-- Challenge 13: Implement Role-Based UI Controls (Frontend Only)
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Implement Role-Based UI Controls (Frontend Only)',
  'pfp-role-based-ui',
  E'## Scenario\n\nAdmin sees extra buttons.\n\n## Your Task\n\nPlan the implementation covering:\n\n1. **Roles** - What roles to support?\n2. **Flow** - Describe the role checking flow\n3. **Errors** - What error cases to handle?\n4. **Estimate** - How many days to implement?',
  'medium', 'javascript', 'product-planning', 13, 75,
  '{"text": "Write your feature plan here..."}',
  '{"expected_answer": "Roles: admin/editor/viewer.\nFlow: fetch role → conditionally render.\nErrors: missing role.\nEstimate: 1–2 days.", "evaluation_criteria": ["Defines role hierarchy", "Describes conditional rendering approach", "Mentions role fetching", "Lists error cases", "Realistic estimate"]}',
  ARRAY['Role-based access', 'Conditional rendering', 'Authorization', 'UI controls'],
  20, true, 'document', 'text', 'ai_only', false
);

-- Challenge 14: Implement "Save as Draft" in Form
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Implement "Save as Draft" in Form',
  'pfp-save-draft',
  E'## Scenario\n\nLong form → users lose progress.\n\n## Your Task\n\nPlan the implementation covering:\n\n1. **Flow** - Describe the save draft flow\n2. **Storage** - Where to save drafts?\n3. **Errors** - What error cases to handle?\n4. **Estimate** - How many days to implement?',
  'medium', 'javascript', 'product-planning', 14, 75,
  '{"text": "Write your feature plan here..."}',
  '{"expected_answer": "Flow: autosave every X seconds OR user clicks Save Draft.\nFields saved locally or via API.\nErrors: offline, expired draft.\nEstimate: 3–4 days.", "evaluation_criteria": ["Describes autosave or manual save", "Mentions storage strategy (localStorage/API)", "Lists error cases like offline", "Realistic estimate"]}',
  ARRAY['Draft management', 'Autosave', 'Local storage', 'UX optimization'],
  20, true, 'document', 'text', 'ai_only', false
);

-- Challenge 15: Add "Email Verification Required" Banner
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Add "Email Verification Required" Banner',
  'pfp-email-verification',
  E'## Scenario\n\nUnverified users must see banner.\n\n## Your Task\n\nPlan the implementation covering:\n\n1. **Flow** - Describe the verification flow\n2. **Actions** - What actions available?\n3. **Errors** - What error cases to handle?\n4. **Estimate** - How many days to implement?',
  'easy', 'javascript', 'product-planning', 15, 50,
  '{"text": "Write your feature plan here..."}',
  '{"expected_answer": "Flow: FE checks user.isVerified → show/hide banner.\nActions: resend verification.\nErrors: resend spam.\nEstimate: 1–1.5 days.", "evaluation_criteria": ["Describes conditional banner display", "Mentions verification check", "Lists resend action with spam prevention", "Realistic estimate"]}',
  ARRAY['Email verification', 'Banner UI', 'User onboarding', 'Rate limiting'],
  15, true, 'document', 'text', 'ai_only', false
);

-- ============================================================================
-- VERIFICATION QUERIES (commented out to avoid migration errors)
-- Run these manually in Supabase SQL Editor after migration
-- ============================================================================

-- Check all product planning challenges
-- SELECT
--   order_in_tier,
--   title,
--   slug,
--   points,
--   difficulty,
--   validation_type,
--   is_active
-- FROM challenges
-- WHERE tier = 'product-planning' AND is_active = TRUE
-- ORDER BY order_in_tier;

-- Count total product planning challenges
-- SELECT COUNT(*) as total_product_planning_challenges
-- FROM challenges
-- WHERE tier = 'product-planning' AND is_active = TRUE;
