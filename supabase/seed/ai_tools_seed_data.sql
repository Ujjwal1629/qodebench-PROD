-- =====================================================
-- AI Tools Module - Seed Data
-- =====================================================
-- This file contains sample data to demonstrate the AI Tools Guide features
-- Run this after running the main schema migration

-- =====================================================
-- 1. SAMPLE LEARNING PATHS
-- =====================================================

INSERT INTO ai_learning_paths (title, description, difficulty, target_role, tech_stack, estimated_duration_hours, learning_objectives, prerequisites, is_published, order_index, icon) VALUES

('GitHub Copilot Mastery', 'Master GitHub Copilot to write code faster and smarter. Learn advanced prompting techniques, keyboard shortcuts, and best practices for pair programming with AI.', 'beginner', ARRAY['frontend', 'backend', 'fullstack'], ARRAY['javascript', 'python', 'typescript'], 4, ARRAY['Set up and configure GitHub Copilot', 'Write effective code comments for better suggestions', 'Use Copilot for test generation', 'Leverage Copilot Chat for explanations'], NULL, true, 1, '🤖'),

('Cursor Power User Guide', 'Become a power user of Cursor, the AI-first code editor. Learn to leverage its unique features for maximum productivity.', 'intermediate', ARRAY['frontend', 'backend', 'fullstack'], ARRAY['all'], 5, ARRAY['Navigate and use Cursor efficiently', 'Master Cmd+K for inline editing', 'Use codebase-wide AI chat', 'Leverage multi-file editing'], ARRAY['Basic familiarity with VS Code or similar editors'], true, 2, '✨'),

('ChatGPT for Developers', 'Learn how to use ChatGPT as your coding assistant. From debugging to architecture discussions, master the art of prompting for development tasks.', 'beginner', ARRAY['all'], ARRAY['all'], 3, ARRAY['Write effective prompts for coding tasks', 'Debug code with ChatGPT', 'Generate boilerplate code', 'Review and improve existing code'], NULL, true, 3, '💬'),

('Advanced Prompt Engineering', 'Master the art and science of prompt engineering for coding tasks. Learn techniques that work across all AI tools.', 'advanced', ARRAY['all'], ARRAY['all'], 6, ARRAY['Understand how AI models process prompts', 'Write zero-shot and few-shot prompts', 'Chain prompts for complex tasks', 'Optimize prompts for accuracy and efficiency'], ARRAY['Experience with at least one AI coding tool'], true, 4, '🎯'),

('AI-First Development Workflow', 'Build a complete development workflow powered by AI tools. Learn to combine multiple tools for maximum productivity.', 'intermediate', ARRAY['fullstack', 'backend', 'frontend'], ARRAY['all'], 8, ARRAY['Design an AI-augmented development workflow', 'Choose the right AI tool for each task', 'Integrate AI tools into your CI/CD', 'Measure and improve AI-assisted productivity'], ARRAY['Experience with multiple AI coding tools'], true, 5, '🚀');

-- =====================================================
-- 2. SAMPLE LESSONS FOR FIRST LEARNING PATH
-- =====================================================

INSERT INTO ai_learning_lessons (learning_path_id, title, description, content_type, content, duration_minutes, order_index, learning_objectives, resources) VALUES

-- GitHub Copilot Mastery - Lessons
((SELECT id FROM ai_learning_paths WHERE title = 'GitHub Copilot Mastery'),
 'Introduction to GitHub Copilot',
 'Learn what GitHub Copilot is, how it works, and how to install it in your favorite editor.',
 'article',
 '# Introduction to GitHub Copilot

GitHub Copilot is an AI pair programmer that helps you write code faster and with less work. Powered by OpenAI Codex, it suggests whole lines or entire functions right inside your editor.

## What is GitHub Copilot?

GitHub Copilot is trained on billions of lines of public code and can:
- Suggest code as you type
- Generate entire functions from comments
- Provide alternative implementations
- Help you learn new APIs and frameworks

## How It Works

Copilot analyzes:
- Your current file content
- Related files in your project
- Your cursor position
- Code comments and function names

## Installation

### VS Code
1. Install the GitHub Copilot extension
2. Sign in with your GitHub account
3. Start coding!

### JetBrains IDEs
1. Go to Settings > Plugins
2. Search for "GitHub Copilot"
3. Install and restart
4. Sign in with your GitHub account

## Your First Copilot Suggestion

Try this: Create a new JavaScript file and type:
```javascript
// Function to calculate factorial of a number
```

Watch Copilot suggest the implementation!

## Key Takeaways

- Copilot is an AI pair programmer, not a replacement for developers
- It learns from your coding patterns
- Clear comments lead to better suggestions
- Always review and test generated code',
 15,
 1,
 ARRAY['Understand what GitHub Copilot is', 'Install Copilot in your editor', 'Get your first AI-generated suggestion'],
 '{"links": ["https://github.com/features/copilot", "https://docs.github.com/en/copilot"]}'),

((SELECT id FROM ai_learning_paths WHERE title = 'GitHub Copilot Mastery'),
 'Writing Better Prompts',
 'Learn how to write effective code comments that generate high-quality Copilot suggestions.',
 'article',
 '# Writing Better Prompts for Copilot

The quality of Copilot''s suggestions depends heavily on the context you provide. Let''s learn how to write prompts that get you the best results.

## The Comment-Driven Development Approach

Instead of writing code first, write comments describing what you want:

### Bad Example
```javascript
// make API call
```

### Good Example
```javascript
// Fetch user data from /api/users/:id endpoint
// Handle loading, success, and error states
// Return the user object or null if not found
```

## Be Specific

The more specific you are, the better the results:

### Vague
```python
# sort array
```

### Specific
```python
# Sort array of user objects by last_name in ascending order,
# then by first_name if last_name is the same
```

## Provide Examples

For complex logic, provide an example:

```javascript
// Convert hex color to RGB
// Example: "#FF5733" -> { r: 255, g: 87, b: 51 }
```

## Use Type Hints

In TypeScript, type hints greatly improve suggestions:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

// Function to validate user email format
function validateEmail(user: User): boolean {
```

## Prompt Patterns That Work

1. **Function signature + comment**
   ```javascript
   function calculateMonthlyPayment(principal, rate, years) {
     // Calculate monthly mortgage payment using the formula
     // M = P[r(1+r)^n]/[(1+r)^n-1]
   ```

2. **Test-first approach**
   ```javascript
   test("should format currency correctly", () => {
     expect(formatCurrency(1234.56)).toBe("$1,234.56");
     expect(formatCurrency(0)).toBe("$0.00");
     // Function implementation will be suggested below
   ```

3. **Example-driven**
   ```python
   # Parse date string in multiple formats
   # "2024-01-15" -> datetime(2024, 1, 15)
   # "01/15/2024" -> datetime(2024, 1, 15)
   # "Jan 15, 2024" -> datetime(2024, 1, 15)
   ```

## Exercise

Try writing prompts for these scenarios:
1. A function to debounce user input
2. A React hook for fetching data
3. A utility to deep clone an object

## Key Takeaways

- Clear, detailed comments = better suggestions
- Provide examples for complex logic
- Use type hints when available
- Think about what context would help a human developer',
 20,
 2,
 ARRAY['Write effective code comments', 'Understand what makes a good prompt', 'Use context to improve suggestions'],
 '{"links": ["https://github.blog/2023-06-20-how-to-write-better-prompts-for-github-copilot/"]}'),

((SELECT id FROM ai_learning_paths WHERE title = 'GitHub Copilot Mastery'),
 'Copilot Keyboard Shortcuts',
 'Master essential keyboard shortcuts to use Copilot efficiently without breaking your flow.',
 'interactive',
 '# Copilot Keyboard Shortcuts

Speed is everything. Learn these shortcuts to use Copilot without touching your mouse.

## Essential Shortcuts (VS Code)

### Accept Suggestions
- `Tab` - Accept the entire suggestion
- `Cmd/Ctrl + →` - Accept next word
- `Esc` - Dismiss suggestion

### Navigate Suggestions
- `Alt/Option + ]` - Next suggestion
- `Alt/Option + [` - Previous suggestion
- `Alt/Option + \` - Trigger suggestion manually

### Copilot Chat
- `Cmd/Ctrl + I` - Open inline chat
- `Cmd/Ctrl + Shift + I` - Open chat panel

## Workflow Example

Let''s see these in action:

1. Type a comment: `// Function to validate email`
2. Press `Enter` and wait for suggestion
3. Press `Alt + ]` to see alternative suggestions
4. Press `Tab` to accept
5. If not quite right, use `Cmd + I` to refine with chat

## Practice Exercises

Try these scenarios to build muscle memory:

### Exercise 1: Navigate Suggestions
1. Write: `// Function to capitalize first letter of each word`
2. When suggestion appears, cycle through alternatives
3. Find the best implementation

### Exercise 2: Partial Accept
1. Write: `// Fetch user data with error handling and retry logic`
2. When suggestion appears, accept word-by-word
3. Make adjustments as needed

### Exercise 3: Inline Chat Refinement
1. Generate a function with Copilot
2. Use inline chat to modify it: "Add input validation"
3. Accept the improved version

## Tips for Speed

1. **Don''t wait for suggestions** - Keep typing if you know what you want
2. **Use partial accepts** - Accept what''s right, skip what''s not
3. **Trigger manually** - Use `Alt + \` when suggestions don''t appear
4. **Chat for modifications** - Faster than rewriting

## Customizing Shortcuts

You can customize these in VS Code:
1. Open Command Palette (`Cmd/Ctrl + Shift + P`)
2. Search "Preferences: Open Keyboard Shortcuts"
3. Search for "copilot"
4. Modify as needed

## Key Takeaways

- `Tab` is your friend - it''s the fastest way to accept
- Learn to navigate suggestions without breaking flow
- Use inline chat for quick modifications
- Customize shortcuts to match your workflow',
 15,
 3,
 ARRAY['Master essential Copilot keyboard shortcuts', 'Navigate suggestions efficiently', 'Use inline chat for quick edits'],
 '{"links": ["https://code.visualstudio.com/docs/editor/github-copilot"]}');

-- =====================================================
-- 3. SAMPLE PROMPTS
-- =====================================================

INSERT INTO ai_prompts (title, description, content, category, use_case, tech_stack, ai_tools, upvotes, usage_count, success_rate, tags, is_featured, is_public) VALUES

('Debug Production Error', 'Comprehensive prompt for debugging production issues with stack traces', 'I have a production error with the following stack trace:

[PASTE STACK TRACE HERE]

Context:
- Environment: [production/staging]
- Last deployment: [time]
- Affected users: [percentage]
- Error frequency: [rate]

Please help me:
1. Identify the root cause
2. Suggest immediate fixes
3. Recommend preventive measures
4. Point out any security concerns

Code context:
[PASTE RELEVANT CODE]', 'debugging', 'Quickly debug production errors with AI assistance', ARRAY['all'], ARRAY['ChatGPT', 'Claude', 'Cursor'], 127, 456, 89.5, ARRAY['debugging', 'production', 'troubleshooting'], true, true),

('Generate React Component', 'Create a fully-typed React component with TypeScript', 'Create a React component with the following requirements:

Component Name: [NAME]
Props:
- [prop1]: [type] - [description]
- [prop2]: [type] - [description]

Functionality:
- [Describe what the component should do]

Requirements:
- Use TypeScript with strict types
- Include PropTypes or Zod validation
- Add inline comments for complex logic
- Follow React best practices (hooks, memo, etc.)
- Make it accessible (ARIA labels where needed)
- Include basic CSS/Tailwind styling

Example usage:
```jsx
<[NAME] [prop1]="" [prop2]="" />
```', 'code_generation', 'Generate production-ready React components', ARRAY['react', 'typescript', 'javascript'], ARRAY['Copilot', 'ChatGPT', 'Cursor'], 203, 892, 92.3, ARRAY['react', 'typescript', 'component', 'frontend'], true, true),

('Code Review Checklist', 'Systematic code review with AI assistance', 'Please review this code with focus on:

**Code:**
```[language]
[PASTE CODE HERE]
```

**Review Checklist:**
1. **Correctness**: Does it solve the problem correctly?
2. **Performance**: Any performance bottlenecks?
3. **Security**: Any security vulnerabilities?
4. **Readability**: Is the code easy to understand?
5. **Maintainability**: Easy to modify and extend?
6. **Best Practices**: Follows language/framework conventions?
7. **Testing**: Edge cases handled?
8. **Documentation**: Needs more comments?

For each issue found, provide:
- Severity (Critical/High/Medium/Low)
- Specific line numbers
- Suggested fix
- Explanation', 'code_review', 'Thorough code review with structured feedback', ARRAY['all'], ARRAY['ChatGPT', 'Claude'], 156, 634, 87.2, ARRAY['code-review', 'quality', 'best-practices'], true, true),

('API Documentation Generator', 'Generate comprehensive API documentation', 'Generate API documentation for the following endpoint:

**Endpoint:** [METHOD] /api/[path]

**Code:**
```[language]
[PASTE API HANDLER CODE]
```

Please generate:
1. **Overview**: Brief description of what this endpoint does
2. **Authentication**: Required auth (if any)
3. **Request Format**:
   - Headers
   - Query parameters
   - Body schema (with examples)
4. **Response Format**:
   - Success responses (with examples)
   - Error responses (with codes and examples)
5. **Example cURL Request**
6. **Example Response**
7. **Notes/Warnings**: Any important considerations

Format: [Markdown/OpenAPI/JSDoc]', 'documentation', 'Auto-generate API documentation from code', ARRAY['nodejs', 'python', 'java'], ARRAY['ChatGPT', 'Claude', 'Copilot'], 98, 423, 85.6, ARRAY['documentation', 'api', 'backend'], false, true),

('Refactor Legacy Code', 'Modernize and improve legacy code', 'I have this legacy code that needs refactoring:

```[language]
[PASTE LEGACY CODE]
```

Please refactor this code to:
1. Use modern [language] features (ES6+, Python 3.10+, etc.)
2. Improve naming and structure
3. Remove code duplication
4. Add error handling
5. Make it more testable
6. Add type hints/annotations
7. Improve performance where possible

Requirements:
- Maintain the same functionality
- Add comments explaining significant changes
- Suggest tests for the refactored code
- Highlight any breaking changes', 'refactoring', 'Modernize legacy codebases with AI', ARRAY['javascript', 'python', 'java'], ARRAY['Claude', 'ChatGPT'], 145, 567, 91.0, ARRAY['refactoring', 'modernization', 'clean-code'], false, true),

('Generate Unit Tests', 'Create comprehensive unit tests for any function', 'Generate unit tests for this function:

```[language]
[PASTE FUNCTION CODE]
```

Requirements:
1. Test framework: [Jest/Pytest/JUnit/etc.]
2. Cover all code paths
3. Include edge cases:
   - Null/undefined inputs
   - Empty arrays/objects
   - Boundary values
   - Invalid inputs
4. Test error conditions
5. Use descriptive test names
6. Include setup/teardown if needed
7. Add comments for complex test cases

Format tests as:
- Arrange (setup)
- Act (execute)
- Assert (verify)', 'testing', 'Generate comprehensive unit tests', ARRAY['javascript', 'python', 'java', 'typescript'], ARRAY['Copilot', 'ChatGPT'], 189, 723, 88.9, ARRAY['testing', 'unit-tests', 'tdd'], false, true),

('SQL Query Optimization', 'Optimize slow SQL queries', 'I have a slow SQL query that needs optimization:

```sql
[PASTE SQL QUERY]
```

**Context:**
- Database: [PostgreSQL/MySQL/etc.]
- Table sizes: [approximate row counts]
- Existing indexes: [list indexes]
- Query execution time: [current time]
- Expected result set size: [rows]

Please:
1. Identify performance bottlenecks
2. Suggest optimized query
3. Recommend indexes to add
4. Explain the improvements
5. Estimate performance gain
6. Point out any potential issues with the optimization', 'optimization', 'Optimize database queries for better performance', ARRAY['sql', 'postgresql', 'mysql'], ARRAY['ChatGPT', 'Claude'], 112, 389, 86.7, ARRAY['sql', 'optimization', 'database', 'performance'], false, true),

('Explain Complex Code', 'Get clear explanations of complex code', 'Please explain this code in detail:

```[language]
[PASTE COMPLEX CODE]
```

Explain:
1. **High-level overview**: What does this code do?
2. **Step-by-step breakdown**: Explain each section
3. **Key concepts**: Any design patterns or algorithms used?
4. **Dependencies**: What external libraries/APIs does it use?
5. **Gotchas**: Any tricky parts or edge cases?
6. **Improvements**: Could this be written better?

Target audience: [Junior/Mid/Senior] developer
Explanation style: [ELI5/Technical/Academic]', 'learning', 'Understand complex code with detailed explanations', ARRAY['all'], ARRAY['ChatGPT', 'Claude'], 167, 891, 93.4, ARRAY['learning', 'explanation', 'documentation'], false, true);

-- =====================================================
-- 4. SAMPLE WORKFLOWS
-- =====================================================

INSERT INTO ai_workflows (title, description, problem_statement, solution_overview, tools_used, tech_stack, difficulty, estimated_time_saved_minutes, steps, prerequisites, tips_and_tricks, common_pitfalls, upvotes, view_count, save_count, tags, is_featured, is_public) VALUES

('Rapid API Development with AI', 'Build a complete REST API in 30 minutes using AI tools', 'Need to build a CRUD API quickly for a new feature, including models, controllers, tests, and documentation.', 'Use ChatGPT to design the API structure, Copilot to implement it, and AI tools to generate tests and docs. This workflow takes what would normally be 2-3 hours down to 30 minutes.', ARRAY['ChatGPT', 'GitHub Copilot', 'Cursor'], ARRAY['nodejs', 'express', 'typescript'], 'intermediate', 90,
'[
  {
    "step": 1,
    "title": "Design API Structure with ChatGPT",
    "description": "Use ChatGPT to plan your API endpoints and data models",
    "prompt": "I need to build a REST API for [resource]. Suggest: 1) Database schema, 2) API endpoints with HTTP methods, 3) Request/response formats, 4) Validation rules. Tech stack: Node.js + Express + PostgreSQL + TypeScript",
    "expectedOutput": "Complete API structure with endpoints, schemas, and validation rules",
    "timeMinutes": 5
  },
  {
    "step": 2,
    "title": "Generate Database Models",
    "description": "Use Copilot to create TypeScript models",
    "prompt": "Write this comment in your editor: // TypeScript interface for [Resource] with fields: [list fields with types]",
    "expectedOutput": "Type-safe model definitions",
    "timeMinutes": 3
  },
  {
    "step": 3,
    "title": "Implement CRUD Endpoints",
    "description": "Use Copilot to generate Express route handlers",
    "prompt": "Write: // Express router for [Resource] with GET, POST, PUT, DELETE endpoints, including validation and error handling",
    "expectedOutput": "Complete route handlers with validation",
    "timeMinutes": 10
  },
  {
    "step": 4,
    "title": "Generate Tests",
    "description": "Use ChatGPT/Copilot to create test suite",
    "prompt": "Generate Jest tests for these API endpoints: [paste your routes code]. Include tests for success cases, validation errors, and edge cases.",
    "expectedOutput": "Comprehensive test suite",
    "timeMinutes": 7
  },
  {
    "step": 5,
    "title": "Generate API Documentation",
    "description": "Use ChatGPT to create OpenAPI/Swagger docs",
    "prompt": "Generate OpenAPI 3.0 specification for these endpoints: [paste code]. Include examples and descriptions.",
    "expectedOutput": "Complete API documentation",
    "timeMinutes": 5
  }
]'::jsonb,
ARRAY['Basic Express.js knowledge', 'Familiarity with REST APIs'],
ARRAY['Review AI-generated code carefully before committing', 'Use AI for boilerplate, add business logic manually', 'Run tests to verify functionality'],
ARRAY['AI might miss business-specific validation rules', 'Always review security-sensitive code', 'Generated tests might not cover all edge cases'],
87, 342, 64, ARRAY['api', 'nodejs', 'productivity', 'backend'], true, true),

('Debug Production Issue 10x Faster', 'Use AI to quickly identify and fix production bugs', 'Production issue causing 5xx errors. Need to identify root cause and deploy fix ASAP.', 'Combine error logs, stack traces, and AI analysis to quickly pinpoint the issue. What would take 1-2 hours of debugging reduced to 10-15 minutes.', ARRAY['ChatGPT', 'Claude'], ARRAY['all'], 'intermediate', 75,
'[
  {
    "step": 1,
    "title": "Collect Error Context",
    "description": "Gather all relevant error information",
    "prompt": "Collect: 1) Full stack trace, 2) Recent code changes, 3) Error frequency/pattern, 4) Affected users/endpoints",
    "expectedOutput": "Complete error context",
    "timeMinutes": 3
  },
  {
    "step": 2,
    "title": "AI-Powered Root Cause Analysis",
    "description": "Use ChatGPT/Claude for initial analysis",
    "prompt": "I have a production error: [paste stack trace]. Recent changes: [list changes]. Error started: [time]. Help identify: 1) Root cause, 2) Why it passed tests, 3) Quick fix, 4) Long-term solution",
    "expectedOutput": "Likely root causes ranked by probability",
    "timeMinutes": 3
  },
  {
    "step": 3,
    "title": "Verify with Code Context",
    "description": "Paste relevant code for deeper analysis",
    "prompt": "Here is the code around line [X]: [paste code]. Given the error [error message], what is the exact issue?",
    "expectedOutput": "Specific line and cause identified",
    "timeMinutes": 2
  },
  {
    "step": 4,
    "title": "Generate Fix",
    "description": "Use AI to suggest fix with explanation",
    "prompt": "Provide a fix for this issue: [describe issue]. Requirements: 1) Minimal changes, 2) Backward compatible, 3) Add error handling, 4) Explain why this fixes it",
    "expectedOutput": "Code fix with explanation",
    "timeMinutes": 3
  },
  {
    "step": 5,
    "title": "Generate Test Case",
    "description": "Create test to prevent regression",
    "prompt": "Generate a test case that would have caught this bug: [describe bug and fix]",
    "expectedOutput": "Regression test",
    "timeMinutes": 4
  }
]'::jsonb,
ARRAY['Access to production logs', 'Understanding of the codebase'],
ARRAY['Include complete stack traces for better analysis', 'Mention recent deployments/changes', 'Ask AI to explain WHY a fix works', 'Always test the fix in staging first'],
ARRAY['AI might suggest fixes that work but mask underlying issues', 'Always understand the fix before deploying', 'Don''t skip writing the regression test'],
134, 521, 98, ARRAY['debugging', 'production', 'troubleshooting'], true, true),

('AI-Assisted Code Review', 'Review pull requests thoroughly in minutes', 'Code reviews are time-consuming but critical. Need to review PRs quickly without missing important issues.', 'Use AI to perform initial code review, catching common issues, suggesting improvements, and highlighting security concerns. Reduces review time from 30 minutes to 10 minutes while improving quality.', ARRAY['ChatGPT', 'Claude'], ARRAY['all'], 'beginner', 20,
'[
  {
    "step": 1,
    "title": "Get PR Context",
    "description": "Understand what the PR is trying to accomplish",
    "prompt": "Review the PR description and linked issues to understand: 1) What problem is being solved, 2) What approach was taken, 3) What areas are most critical",
    "expectedOutput": "Clear understanding of PR goals",
    "timeMinutes": 2
  },
  {
    "step": 2,
    "title": "AI Security Review",
    "description": "Check for security vulnerabilities",
    "prompt": "Review this code for security issues: [paste diff]. Check for: SQL injection, XSS, authentication bypasses, sensitive data exposure, CSRF, insecure dependencies. Highlight any concerns.",
    "expectedOutput": "Security issue report",
    "timeMinutes": 3
  },
  {
    "step": 3,
    "title": "Code Quality Check",
    "description": "Review code quality and best practices",
    "prompt": "Review this code for: 1) Readability, 2) Naming conventions, 3) Code duplication, 4) Error handling, 5) Edge cases, 6) Best practices for [language/framework]. Code: [paste diff]",
    "expectedOutput": "Quality improvement suggestions",
    "timeMinutes": 3
  },
  {
    "step": 4,
    "title": "Test Coverage Analysis",
    "description": "Verify tests are adequate",
    "prompt": "Are these tests sufficient? Tests: [paste test code]. Original code: [paste implementation]. What edge cases are missing?",
    "expectedOutput": "Test gap analysis",
    "timeMinutes": 2
  }
]'::jsonb,
ARRAY['Understanding of the codebase', 'Knowledge of security best practices'],
ARRAY['Always combine AI review with human review', 'Focus AI on catching common issues', 'Use AI to learn about security patterns', 'Ask AI to explain why something is an issue'],
ARRAY['Don''t blindly trust AI security findings', 'AI might miss context-specific issues', 'Still need to understand the business logic yourself'],
92, 412, 73, ARRAY['code-review', 'quality', 'security'], false, true);

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE 'AI Tools seed data inserted successfully!';
  RAISE NOTICE 'Created:';
  RAISE NOTICE '- % learning paths', (SELECT COUNT(*) FROM ai_learning_paths);
  RAISE NOTICE '- % lessons', (SELECT COUNT(*) FROM ai_learning_lessons);
  RAISE NOTICE '- % prompts', (SELECT COUNT(*) FROM ai_prompts);
  RAISE NOTICE '- % workflows', (SELECT COUNT(*) FROM ai_workflows);
  RAISE NOTICE '- % AI tools', (SELECT COUNT(*) FROM ai_tools_catalog);
END $$;
