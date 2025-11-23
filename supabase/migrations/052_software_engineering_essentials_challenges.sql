-- =============================================
-- Migration: Add Software Engineering Essentials Challenges
-- Description: 20 real-world office/workplace scenario challenges
-- Version: 051
-- Date: 2025-01-21
-- =============================================

-- Challenge 1: Write a Pull Request Description
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Write a Pull Request Description',
  'see-pr-description',
  E'## Scenario\n\nYou fixed a UI crash where the dashboard broke when tasks were missing. Your senior asks for a clear PR description.\n\n## Problem Statement\n\nWrite a professional PR description explaining the fix.\n\n## Input (Code Change)\n\n```javascript\n- const totalTasks = data.tasks.length;\n+ const totalTasks = data?.tasks?.length || 0;\n```\n\n## Your Task\n\nWrite a complete PR description that includes:\n\n1. **Summary** - What did you fix?\n2. **Root Cause** - Why was it breaking?\n3. **Fix Description** - How did you solve it?\n4. **Testing Done** - How did you verify the fix?\n5. **Risk/Impact** - Any potential risks?',
  'easy', 'javascript', 'software-engineering-essentials', 1, 0,
  '{"text": "Write your PR description here..."}',
  '{"expected_answer": "Summary: Fix dashboard crash when tasks array is missing.\nRoot cause: Missing null check on data.tasks before accessing length property.\nFix: Added optional chaining (?.) and fallback value (|| 0) to handle undefined/null cases.\nTesting: Tested with 0 tasks, 5 tasks, and undefined data scenarios.\nRisk: Low - defensive programming approach with safe fallback.", "evaluation_criteria": ["Includes clear summary", "Identifies root cause correctly", "Explains the fix implementation", "Mentions testing approach", "Assesses risk level"]}',
  ARRAY['PR writing', 'Explaining code changes', 'Communicating root cause', 'Technical documentation'],
  15, true, 'document', 'text', 'ai_only', true
);

-- Challenge 2: Write a Root Cause Analysis (RCA)
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Write a Root Cause Analysis (RCA)',
  'see-rca-document',
  E'## Scenario\n\nProduction API returned 500 errors for 20 minutes. CTO wants a Root Cause Analysis document.\n\n## Incident Details\n\n**Cause:** Missing `await` in database call  \n**Impact:** Login API crashed  \n**Fix:** Added `await` and try/catch block\n\n## Your Task\n\nWrite a concise RCA document covering:\n\n1. **What Happened** - Describe the incident\n2. **Root Cause** - Explain the technical reason\n3. **Fix Implemented** - What solution was applied\n4. **Prevention Steps** - How to prevent this in future',
  'easy', 'javascript', 'software-engineering-essentials', 2, 0,
  '{"text": "Write your RCA document here..."}',
  '{"expected_answer": "What Happened: Login API failed for 20 minutes, returning 500 errors due to unhandled promise rejection.\nRoot Cause: Missing await keyword in database call caused promise to be unresolved, leading to undefined response handling.\nFix: Added await keyword to DB call and wrapped in try/catch block for proper error handling.\nPrevention: Add ESLint rule for floating promises, implement mandatory code review checklist for async operations, add integration tests for API endpoints.", "evaluation_criteria": ["Clear incident description", "Accurate root cause identification", "Practical fix explanation", "Actionable prevention steps"]}',
  ARRAY['RCA writing', 'Incident analysis', 'Technical communication', 'Problem-solving documentation'],
  15, true, 'document', 'text', 'ai_only', true
);

-- Challenge 3: Code Review Task — Identify Issues
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Code Review Task — Identify Issues',
  'see-code-review-bugs',
  E'## Scenario\n\nA junior developer pushed code for review. You need to identify issues and provide constructive feedback.\n\n## Code Under Review\n\n```javascript\nfunction calcPrice(price, tax) {\n  return price + tax || 0;\n}\n```\n\n## Your Task\n\nWrite review comments covering:\n\n1. **Logical Bug** - Identify the calculation error\n2. **Missing Validations** - What edge cases are not handled?\n3. **Improvement Suggestions** - How can this be better?',
  'easy', 'javascript', 'software-engineering-essentials', 3, 0,
  '{"text": "Write your code review comments here..."}',
  '{"expected_answer": "Bug: The expression (price + tax || 0) has incorrect operator precedence. When tax is 0, the result will be 0 instead of price + 0. The || operator evaluates the entire sum, not just tax.\nFix: Use parentheses or nullish coalescing: return (price ?? 0) + (tax ?? 0).\nMissing Validations: No checks for negative numbers, NaN, or non-numeric inputs.\nImprovements: Add input validation, use TypeScript for type safety, add JSDoc comments, consider using Number.isFinite() checks.", "evaluation_criteria": ["Identifies the operator precedence bug", "Suggests proper fix", "Notes missing validation", "Provides constructive improvements"]}',
  ARRAY['Code review', 'Bug identification', 'Logic analysis', 'Constructive feedback'],
  15, true, 'document', 'text', 'ai_only', true
);

-- Challenge 4: Write Sprint Update Email
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Write Sprint Update Email',
  'see-sprint-update',
  E'## Scenario\n\nYour Product Manager asks for an end-of-day status update.\n\n## Your Work Notes\n\n- **Completed:** Login bug fix (#234)\n- **In Progress:** Dashboard UI redesign (~60% done)\n- **Blocked:** API contract missing from backend team\n\n## Your Task\n\nConvert these notes into a professional email update that:\n\n1. Clearly states completed work\n2. Shows progress on ongoing tasks\n3. Highlights blockers with appropriate urgency',
  'easy', 'javascript', 'software-engineering-essentials', 4, 0,
  '{"text": "Write your sprint update email here..."}',
  '{"expected_answer": "Hi [PM Name],\n\nHere is my end-of-day update:\n\nCompleted:\n- Fixed login bug (#234) and deployed to staging\n\nIn Progress:\n- Dashboard UI redesign is approximately 60% complete, on track for Friday delivery\n\nBlocked:\n- Awaiting API contract from backend team to proceed with integration. This is blocking the final 40% of dashboard work. Could we get an ETA?\n\nLet me know if you need any clarification.\n\nThanks,\n[Your Name]", "evaluation_criteria": ["Professional email format", "Clear status sections", "Specific completion details", "Highlights blocker with actionable request"]}',
  ARRAY['Professional communication', 'Status reporting', 'Email writing', 'Blocker escalation'],
  10, true, 'document', 'text', 'ai_only', true
);

-- Challenge 5: Create Git Commit Message
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Create Git Commit Message',
  'see-commit-message',
  E'## Scenario\n\nYou fixed a null pointer bug in the user profile section.\n\n## Code Change\n\n```javascript\n- const name = user.profile.name;\n+ const name = user?.profile?.name || "";\n```\n\n## Your Task\n\nWrite a clean commit message following **Conventional Commits** format:\n\n```\n<type>(<scope>): <subject>\n```\n\nTypes: `fix`, `feat`, `docs`, `refactor`, `test`, `chore`',
  'easy', 'javascript', 'software-engineering-essentials', 5, 0,
  '{"text": "Write your commit message here..."}',
  '{"expected_answer": "fix(profile): prevent crash by adding null checks to profile.name\n\nOR\n\nfix(user): add optional chaining to prevent null reference error in profile.name", "evaluation_criteria": ["Uses conventional commit format", "Correct type (fix)", "Appropriate scope", "Clear and concise subject", "Describes the what, not the how"]}',
  ARRAY['Git best practices', 'Conventional commits', 'Commit message writing', 'Version control'],
  10, true, 'document', 'text', 'ai_only', true
);

-- Challenge 6: Explain a Merge Conflict Resolution
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Explain a Merge Conflict Resolution',
  'see-merge-conflict',
  E'## Scenario\n\nYour feature branch conflicts with main when you try to merge.\n\n## Conflict Snippet\n\n```javascript\n<<<<<<< HEAD\nconst limit = 5;\n=======\nconst limit = 10;\n>>>>>>> main\n```\n\n## Your Task\n\nExplain your resolution approach:\n\n1. **Which value to keep?** (5 or 10)\n2. **Why?** (What''s your reasoning)\n3. **How would you resolve it?** (Steps)',
  'easy', 'javascript', 'software-engineering-essentials', 6, 0,
  '{"text": "Write your merge conflict resolution explanation here..."}',
  '{"expected_answer": "Which value to keep: Keep 10 (from main branch)\n\nWhy: The main branch contains the updated value approved by the team/PM. Product requirements changed to increase the limit from 5 to 10.\n\nHow to resolve:\n1. Check with team/PM to confirm which value is correct\n2. Remove conflict markers (<<<<<<, =======, >>>>>>>)\n3. Keep const limit = 10;\n4. Stage the resolved file: git add <filename>\n5. Complete merge: git commit\n6. Verify functionality with new limit", "evaluation_criteria": ["Makes informed decision", "Provides valid reasoning", "Describes resolution steps", "Mentions communication with team", "Follows git merge process"]}',
  ARRAY['Merge conflict resolution', 'Git workflow', 'Decision making', 'Team collaboration'],
  15, true, 'document', 'text', 'ai_only', false
);

-- Challenge 7: Write an API Contract Document
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Write an API Contract Document',
  'see-api-contract',
  E'## Scenario\n\nBackend team asks you to define a simple API contract for a new feature.\n\n## Feature Requirement\n\n**"Get user profile by ID"**\n\n## Your Task\n\nDefine a clear API contract including:\n\n1. **Endpoint** - URL path\n2. **Method** - HTTP method\n3. **Request Parameters** - What inputs are needed\n4. **Response Fields** - What data is returned\n5. **Error Cases** - What errors can occur',
  'easy', 'javascript', 'software-engineering-essentials', 7, 0,
  '{"text": "Write your API contract here..."}',
  '{"expected_answer": "Endpoint: GET /api/user/:id\n\nMethod: GET\n\nRequest Parameters:\n- id (path parameter, required, integer): User ID\n\nResponse (200 OK):\n{\n  \"id\": number,\n  \"name\": string,\n  \"email\": string\n}\n\nError Cases:\n- 404 Not Found: User with given ID does not exist\n- 400 Bad Request: Invalid ID format\n- 401 Unauthorized: Authentication required", "evaluation_criteria": ["Correct endpoint format", "Proper HTTP method", "Clear parameter definition", "Well-structured response format", "Includes error cases"]}',
  ARRAY['API design', 'Technical documentation', 'REST principles', 'Contract definition'],
  15, true, 'document', 'text', 'ai_only', false
);

-- Challenge 8: Review a PR Title and Suggest Fix
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Review a PR Title and Suggest Fix',
  'see-pr-title-review',
  E'## Scenario\n\nA teammate created a PR with this title:\n\n**"fixed stuff"**\n\n## Your Task\n\n1. Explain why this PR title is problematic\n2. Suggest a better PR title following best practices',
  'easy', 'javascript', 'software-engineering-essentials', 8, 0,
  '{"text": "Write your review and suggestion here..."}',
  '{"expected_answer": "Why it is bad:\n- Vague and uninformative (\"stuff\" is not descriptive)\n- No context about what was fixed\n- Does not follow conventional commit format\n- Not helpful for git history or release notes\n- Impossible to understand the change without reading the code\n\nSuggested fix:\nfix(auth): resolve login failure on empty password\n\nOR\n\nfix(validation): add empty password check to login form\n\nThis follows conventional commits format with clear type, scope, and description.", "evaluation_criteria": ["Identifies vagueness issue", "Explains lack of context", "Suggests conventional commit format", "Provides specific, descriptive alternative", "Includes type and scope"]}',
  ARRAY['PR best practices', 'Code review', 'Communication standards', 'Git conventions'],
  10, true, 'document', 'text', 'ai_only', false
);

-- Challenge 9: Identify Bad Commit Message
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Identify Bad Commit Message',
  'see-bad-commit',
  E'## Scenario\n\nYou see this commit in git history:\n\n```\ncommit abc123\nAuthor: Developer\nDate: Today\n\n    update update update\n```\n\n## Your Task\n\n1. Explain why this commit message is bad\n2. Suggest a corrected commit message (assume it was a navbar design change)',
  'easy', 'javascript', 'software-engineering-essentials', 9, 0,
  '{"text": "Write your analysis and suggestion here..."}',
  '{"expected_answer": "Why it is bad:\n- Completely meaningless - \"update\" repeated three times provides no information\n- No context about what was updated\n- Does not follow any commit message convention\n- Makes git history useless for debugging or understanding changes\n- Fails to communicate intent to other developers\n\nCorrected commit message:\nfeat(ui): update navbar design with new color scheme and logo\n\nOR\n\nstyle(navbar): redesign navigation bar layout", "evaluation_criteria": ["Identifies lack of meaningful information", "Explains impact on git history", "Provides specific corrected version", "Uses conventional commit format", "Describes actual change clearly"]}',
  ARRAY['Git best practices', 'Commit messages', 'Version control', 'Code history'],
  10, true, 'document', 'text', 'ai_only', false
);

-- Challenge 10: Document Environment Setup Steps
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Document Environment Setup Steps',
  'see-env-setup',
  E'## Scenario\n\nA new intern joins your team tomorrow.\n\n## Project Stack\n\n- **Runtime:** Node.js 18\n- **Database:** Supabase\n- **Build Tool:** Vite\n- **Package Manager:** npm\n\n## Your Task\n\nWrite clear onboarding steps for the intern to set up the development environment.',
  'easy', 'javascript', 'software-engineering-essentials', 10, 0,
  '{"text": "Write your setup documentation here..."}',
  '{"expected_answer": "Development Environment Setup\n\nPrerequisites:\n- Install Node.js 18 or higher from nodejs.org\n- Install Git\n\nSetup Steps:\n\n1. Clone the repository:\n   git clone <repo-url>\n   cd <project-name>\n\n2. Install dependencies:\n   npm install\n\n3. Set up environment variables:\n   - Copy .env.example to .env\n   - Add Supabase credentials:\n     VITE_SUPABASE_URL=your-supabase-url\n     VITE_SUPABASE_ANON_KEY=your-anon-key\n\n4. Start development server:\n   npm run dev\n\n5. Open browser and navigate to:\n   http://localhost:5173\n\nTroubleshooting:\n- If port 5173 is in use, Vite will suggest an alternative port\n- Ensure Node version is 18+ by running: node --version", "evaluation_criteria": ["Includes prerequisites", "Clear step-by-step instructions", "Covers environment variables", "Mentions how to run the project", "Includes troubleshooting tips"]}',
  ARRAY['Technical documentation', 'Onboarding', 'Developer experience', 'Setup guides'],
  15, true, 'document', 'text', 'ai_only', false
);

-- Challenge 11: Write QA Test Cases (Basic)
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Write QA Test Cases (Basic)',
  'see-qa-test-cases',
  E'## Scenario\n\nYou built a login form and need to write test cases for QA.\n\n## Form Details\n\n**Fields:**\n- Email (text input)\n- Password (password input)\n\n**Button:**\n- Login (submit button)\n\n## Your Task\n\nWrite 3 functional test cases covering:\n- Valid scenario\n- Invalid scenario\n- Edge case',
  'easy', 'javascript', 'software-engineering-essentials', 11, 0,
  '{"text": "Write your test cases here..."}',
  '{"expected_answer": "Test Case 1: Valid Login\nInput: Valid email (user@example.com) and correct password\nExpected: User is authenticated and redirected to dashboard\nPriority: High\n\nTest Case 2: Invalid Password\nInput: Valid email but incorrect password\nExpected: Error message displayed \"Invalid credentials\" and user remains on login page\nPriority: High\n\nTest Case 3: Empty Email Field\nInput: Empty email field, any password\nExpected: Validation error shown \"Email is required\" and form is not submitted\nPriority: Medium", "evaluation_criteria": ["Clear test case structure", "Covers valid scenario", "Includes invalid scenario", "Tests edge case", "Specifies expected outcomes"]}',
  ARRAY['QA testing', 'Test case writing', 'Quality assurance', 'Functional testing'],
  15, true, 'document', 'text', 'ai_only', false
);

-- Challenge 12: Code Review — Security Issue
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Code Review — Security Issue',
  'see-security-review',
  E'## Scenario\n\nDuring code review, you spot a security issue in a teammate''s code.\n\n## Code Under Review\n\n```javascript\nconst API_KEY = "sk_live_123456789abcdef";\n\nfetch(url, {\n  headers: { Authorization: API_KEY }\n});\n```\n\n## Your Task\n\nWrite review comments addressing:\n1. The security risk\n2. Proper solution\n3. Immediate action needed',
  'medium', 'javascript', 'software-engineering-essentials', 12, 0,
  '{"text": "Write your security review comments here..."}',
  '{"expected_answer": "Security Risk:\nHardcoding API keys in source code is a critical security vulnerability. This key will be:\n- Committed to version control (git history)\n- Visible to anyone with repo access\n- Exposed in production builds\n- Difficult to rotate without code changes\n\nProper Solution:\n1. Remove hardcoded key immediately\n2. Move API key to environment variables (.env file)\n3. Access via process.env.API_KEY or import.meta.env.VITE_API_KEY\n4. Add .env to .gitignore\n5. Document required env vars in .env.example\n\nImmediate Action:\n- Rotate/invalidate the exposed API key immediately through the provider''s dashboard\n- Check git history and remove key from all commits (use git filter-branch or BFG Repo-Cleaner)\n- Audit access logs for any unauthorized usage", "evaluation_criteria": ["Identifies security risk clearly", "Explains why it is dangerous", "Provides correct solution with env variables", "Emphasizes immediate key rotation", "Mentions git history cleanup"]}',
  ARRAY['Security best practices', 'Code review', 'Environment variables', 'Secret management'],
  15, true, 'document', 'text', 'ai_only', false
);

-- Challenge 13: Write Escalation Message to Backend Team
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Write Escalation Message to Backend Team',
  'see-escalation-message',
  E'## Scenario\n\nYour frontend work is blocked because a required API is not ready.\n\n## Context\n\n- **Missing API:** `/users/stats`\n- **Your Deadline:** Today (end of day)\n- **Impact:** Cannot complete dashboard feature\n\n## Your Task\n\nWrite a polite but firm escalation message to the backend team.',
  'medium', 'javascript', 'software-engineering-essentials', 13, 0,
  '{"text": "Write your escalation message here..."}',
  '{"expected_answer": "Hi Backend Team,\n\nI am currently blocked on the dashboard feature due to the missing /users/stats API endpoint.\n\nCurrent Status:\n- Frontend integration is ready and waiting\n- All UI components completed\n- Blocked on API integration\n\nDeadline:\nThis feature is scheduled for release today (EOD). Without the API, we cannot complete the delivery.\n\nRequest:\nCould you please provide:\n1. Current status of the /users/stats endpoint\n2. Updated ETA for completion\n3. If delayed, an interim solution or mock data approach\n\nLet me know how I can help expedite this. Happy to pair program or test the endpoint as soon as it is available.\n\nThanks,\n[Your Name]", "evaluation_criteria": ["Polite but clear tone", "States the blocker specifically", "Mentions deadline and impact", "Requests specific information (ETA)", "Offers to help/collaborate"]}',
  ARRAY['Escalation skills', 'Professional communication', 'Cross-team collaboration', 'Deadline management'],
  10, true, 'document', 'text', 'ai_only', false
);

-- Challenge 14: Write a Bug Report (Minimal Template)
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Write a Bug Report',
  'see-bug-report',
  E'## Scenario\n\nApp crashes when users click the "Save" button on the profile page.\n\n## Details You Know\n\n- **Steps:** Open profile → Click Save button\n- **Expected:** Data should save successfully\n- **Actual:** App crashes/freezes\n\n## Your Task\n\nWrite a proper bug report using standard format:\n- Steps to reproduce\n- Expected behavior\n- Actual behavior\n- Priority\n- Additional context',
  'easy', 'javascript', 'software-engineering-essentials', 14, 0,
  '{"text": "Write your bug report here..."}',
  '{"expected_answer": "Bug Report: App Crashes on Profile Save\n\nSteps to Reproduce:\n1. Navigate to user profile page\n2. Make any change to profile fields\n3. Click the \"Save\" button\n\nExpected Behavior:\n- Profile data saves successfully\n- Success message displayed\n- UI remains responsive\n\nActual Behavior:\n- App crashes/freezes on Save button click\n- No error message shown\n- User forced to refresh page\n\nEnvironment:\n- Browser: [e.g., Chrome 120]\n- OS: [e.g., macOS]\n- App Version: [e.g., v1.2.3]\n\nPriority: High (affects core functionality)\n\nAdditional Context:\n- Issue occurs 100% of the time\n- Screenshots: [Attach if available]\n- Console errors: [Include if available]", "evaluation_criteria": ["Clear reproduction steps", "Defines expected vs actual behavior", "Includes environment details", "Sets appropriate priority", "Well-structured format"]}',
  ARRAY['Bug reporting', 'Issue tracking', 'Technical writing', 'Quality assurance'],
  10, true, 'document', 'text', 'ai_only', false
);

-- Challenge 15: Evaluate a Teammate''s PR for Readability
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Evaluate a Teammate''s PR for Readability',
  'see-readability-review',
  E'## Scenario\n\nYou''re reviewing a PR and find code that works but is hard to read.\n\n## Code Under Review\n\n```javascript\nfunction a(x){return x?x:0;}\n```\n\n## Your Task\n\nSuggest improvements for:\n1. Function naming\n2. Code formatting\n3. Readability enhancements',
  'easy', 'javascript', 'software-engineering-essentials', 15, 0,
  '{"text": "Write your readability review comments here..."}',
  '{"expected_answer": "Readability Improvements:\n\n1. Function Naming:\n   - \"a\" is not descriptive\n   - Suggest: \"getValue\" or \"getValueOrDefault\"\n\n2. Code Formatting:\n   - Missing spaces around operators\n   - No line breaks for clarity\n   - Suggested formatting:\n   ```javascript\n   function getValue(x) {\n     return x ? x : 0;\n   }\n   ```\n\n3. Readability Enhancements:\n   - Use nullish coalescing operator (clearer intent):\n   ```javascript\n   function getValue(value) {\n     return value ?? 0;\n   }\n   ```\n   - Add JSDoc comment:\n   ```javascript\n   /**\n    * Returns the value or 0 if undefined/null\n    * @param {number} value - Input value\n    * @returns {number} Value or 0\n    */\n   ```\n\n4. Consider renaming parameter \"x\" to something descriptive like \"value\" or \"input\"", "evaluation_criteria": ["Identifies poor naming", "Suggests descriptive function name", "Recommends proper formatting", "Suggests modern syntax (??)", "Mentions documentation"]}',
  ARRAY['Code readability', 'Naming conventions', 'Code review', 'Clean code principles'],
  10, true, 'document', 'text', 'ai_only', false
);

-- Challenge 16: Create a Release Notes Entry
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Create a Release Notes Entry',
  'see-release-notes',
  E'## Scenario\n\nYou shipped version 2.5.0 with new features and fixes.\n\n## Changes in This Release\n\n- Dark mode feature added to settings\n- Search functionality improved (faster results)\n- Fixed crash when logging out\n\n## Your Task\n\nWrite user-facing release notes in a clear, concise format.',
  'easy', 'javascript', 'software-engineering-essentials', 16, 0,
  '{"text": "Write your release notes here..."}',
  '{"expected_answer": "Release Notes - Version 2.5.0\n\nNew Features:\n✨ Dark mode is now available! Toggle it in Settings > Appearance\n✨ Improved search with faster and more accurate results\n\nBug Fixes:\n🐛 Fixed app crash that occurred when logging out\n\nImprovements:\n- Enhanced performance across the app\n- Better error handling\n\nHow to Update:\n- Web: Refresh your browser\n- Mobile: Update from App Store/Play Store\n\nFeedback:\nHave questions or suggestions? Reach out to support@company.com", "evaluation_criteria": ["User-friendly language (not technical)", "Categorized sections (Features, Fixes)", "Clear and concise descriptions", "Includes update instructions", "Professional formatting"]}',
  ARRAY['Release management', 'User documentation', 'Technical writing', 'Customer communication'],
  10, true, 'document', 'text', 'ai_only', false
);

-- Challenge 17: Document API Error Codes
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Document API Error Codes',
  'see-error-docs',
  E'## Scenario\n\nYour API returns multiple error types that frontend developers need to understand.\n\n## Error Codes\n\n- `400` - `invalid_email`\n- `401` - `unauthorized`\n- `404` - `not_found`\n- `500` - `internal_error`\n\n## Your Task\n\nCreate clear error documentation for API consumers.',
  'easy', 'javascript', 'software-engineering-essentials', 17, 0,
  '{"text": "Write your error documentation here..."}',
  '{"expected_answer": "API Error Codes Documentation\n\n400 Bad Request - invalid_email\nDescription: The email format is invalid\nExample: \"user@\" or \"notanemail\"\nAction: Validate email format before submitting\n\n401 Unauthorized - unauthorized\nDescription: User is not authenticated or session expired\nAction: User must log in again to access this resource\n\n404 Not Found - not_found\nDescription: The requested resource does not exist\nExample: User ID not found in database\nAction: Verify the resource ID is correct\n\n500 Internal Server Error - internal_error\nDescription: Unexpected server error occurred\nAction: Retry the request. If error persists, contact support\n\nError Response Format:\n{\n  \"error\": \"invalid_email\",\n  \"message\": \"The email format is invalid\",\n  \"statusCode\": 400\n}", "evaluation_criteria": ["Documents all error codes", "Clear descriptions for each error", "Includes user action/resolution", "Shows error response format", "Professional structure"]}',
  ARRAY['API documentation', 'Error handling', 'Developer experience', 'Technical writing'],
  15, true, 'document', 'text', 'ai_only', false
);

-- Challenge 18: Write a Standup Update Message
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Write a Standup Update Message',
  'see-standup-update',
  E'## Scenario\n\nDaily standup is in 5 minutes and you need to post your async update in Slack.\n\n## Your Work Notes\n\n- **Yesterday:** Worked on shopping cart bug (#456)\n- **Today:** Working on checkout flow implementation\n- **Blockers:** None\n\n## Your Task\n\nWrite a concise standup update following the standard format.',
  'easy', 'javascript', 'software-engineering-essentials', 18, 0,
  '{"text": "Write your standup update here..."}',
  '{"expected_answer": "Daily Standup Update\n\n✅ Yesterday:\n- Fixed shopping cart bug (#456) where items were duplicating on refresh\n- Code reviewed 2 PRs from the team\n\n🚀 Today:\n- Implementing checkout flow UI\n- Integrating payment gateway API\n- Target: Complete checkout form by EOD\n\n🚫 Blockers:\n- None\n\nAvailable for: Pairing on payment integration if anyone needs help", "evaluation_criteria": ["Follows standup format (Yesterday/Today/Blockers)", "Specific about completed work", "Clear about today is goals", "Mentions no blockers", "Concise and scannable"]}',
  ARRAY['Agile practices', 'Team communication', 'Daily standups', 'Status updates'],
  10, true, 'document', 'text', 'ai_only', false
);

-- Challenge 19: Create a Simple KT (Knowledge Transfer) Note
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Create a Knowledge Transfer (KT) Note',
  'see-kt-document',
  E'## Scenario\n\nYou''re going on vacation and need to hand off a feature you''ve been working on.\n\n## Feature Details\n\n- **Feature:** Shopping cart functionality\n- **Location:** `/src/cart` directory\n- **Main File:** `cart.js`\n- **Status:** 80% complete\n- **Pending Work:** Discount logic implementation\n\n## Your Task\n\nWrite a KT (Knowledge Transfer) document for the developer taking over.',
  'medium', 'javascript', 'software-engineering-essentials', 19, 0,
  '{"text": "Write your KT document here..."}',
  '{"expected_answer": "Knowledge Transfer: Shopping Cart Feature\n\nOverview:\nShopping cart feature allowing users to add/remove items and proceed to checkout.\n\nCode Location:\n- Repository: main repo\n- Directory: /src/cart\n- Main file: cart.js\n- Related components: CartItem.jsx, CartSummary.jsx\n\nHow to Run:\n1. npm install\n2. npm run dev\n3. Navigate to /cart route\n\nKey Functions:\n- addItem(product): Adds product to cart\n- removeItem(itemId): Removes item from cart\n- updateQuantity(itemId, quantity): Updates item quantity\n- calculateTotal(): Computes cart total\n\nCompleted:\n✅ Add/remove items functionality\n✅ Cart persistence (localStorage)\n✅ Quantity update logic\n✅ Total calculation\n\nPending Work:\n❌ Discount code logic (priority: high)\n   - Function stub exists at line 145\n   - Requirements doc: /docs/discount-feature.md\n   - API endpoint ready: POST /api/apply-discount\n\nKnown Issues:\n- Cart flickers on page load (performance issue, low priority)\n\nContacts:\n- Questions: Reach me at [email] or Slack\n- Product context: Talk to PM [Name]\n\nTimeline:\nDiscount feature needs completion by next Friday for beta release.", "evaluation_criteria": ["Clear overview of feature", "Specific code locations", "Setup/run instructions", "Lists completed vs pending work", "Includes known issues", "Provides contact information"]}',
  ARRAY['Knowledge transfer', 'Documentation', 'Team handoff', 'Project continuity'],
  20, true, 'document', 'text', 'ai_only', false
);

-- Challenge 20: Analyze Git History to Find Mistake
INSERT INTO challenges (
  title, slug, description, difficulty, category, tier, order_in_tier, points,
  starter_code, test_cases, learning_objectives, estimated_time, is_active,
  challenge_type, response_format, validation_type, is_free_tier_accessible
) VALUES (
  'Analyze Git History to Find Mistake',
  'see-git-history',
  E'## Scenario\n\nA bug appeared in production. You need to analyze git history to find what went wrong.\n\n## Git History\n\n```\ncommit 3 (latest): removed validation\ncommit 2: added validation\ncommit 1: initial commit\n```\n\n## Your Task\n\n1. Identify the problematic commit\n2. Explain what went wrong\n3. Suggest how to fix it',
  'easy', 'javascript', 'software-engineering-essentials', 20, 0,
  '{"text": "Write your git history analysis here..."}',
  '{"expected_answer": "Git History Analysis:\n\nProblematic Commit: Commit 3 (\"removed validation\")\n\nWhat Went Wrong:\nCommit 2 added important validation logic, but commit 3 accidentally removed it. This likely happened due to:\n- Merge conflict resolved incorrectly\n- Accidental deletion during refactoring\n- Developer unaware of validation importance\n- No code review caught the removal\n\nImpact:\n- Validation is now missing from production\n- Users can submit invalid data\n- Potential data integrity issues\n\nHow to Fix:\n1. Immediate: Revert commit 3\n   git revert <commit-3-hash>\n   \n2. Alternative: Cherry-pick commit 2\n   git cherry-pick <commit-2-hash>\n   \n3. Create hotfix branch and deploy\n\n4. Long-term prevention:\n   - Add required tests for validation logic\n   - Make validation removal require explicit PR discussion\n   - Add breaking change detection in CI/CD\n\nRecommended Command:\ngit revert <commit-3-hash> -m \"Restore validation removed in commit 3\"", "evaluation_criteria": ["Correctly identifies commit 3 as problematic", "Explains why validation removal is bad", "Provides git revert solution", "Mentions prevention strategies", "Considers impact on production"]}',
  ARRAY['Git debugging', 'Version control', 'Root cause analysis', 'Problem solving'],
  15, true, 'document', 'text', 'ai_only', false
);

-- ============================================================================
-- Verification Query
-- ============================================================================

-- SELECT slug, title, tier, order_in_tier, validation_type, is_free_tier_accessible
-- FROM challenges
-- WHERE tier = 'software-engineering-essentials'
-- ORDER BY order_in_tier;

-- Count total
-- SELECT COUNT(*) as total FROM challenges WHERE tier = 'software-engineering-essentials';
