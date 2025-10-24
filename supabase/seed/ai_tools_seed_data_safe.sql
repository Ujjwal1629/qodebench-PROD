-- =====================================================
-- AI Tools Module - Seed Data (SAFE VERSION)
-- =====================================================
-- This version inserts data with better error handling

-- =====================================================
-- 1. CLEAR EXISTING DATA (optional - comment out if you want to keep existing data)
-- =====================================================

-- TRUNCATE TABLE ai_learning_lessons CASCADE;
-- TRUNCATE TABLE ai_learning_paths CASCADE;
-- TRUNCATE TABLE ai_prompts CASCADE;
-- TRUNCATE TABLE ai_workflows CASCADE;
-- TRUNCATE TABLE ai_tools_catalog CASCADE;

-- =====================================================
-- 2. INSERT LEARNING PATHS
-- =====================================================

DO $$
DECLARE
  copilot_path_id UUID;
  cursor_path_id UUID;
  chatgpt_path_id UUID;
  prompt_eng_path_id UUID;
  workflow_path_id UUID;
BEGIN

-- Insert learning paths and store their IDs
INSERT INTO ai_learning_paths (title, description, difficulty, target_role, tech_stack, estimated_duration_hours, learning_objectives, prerequisites, is_published, order_index, icon)
VALUES ('GitHub Copilot Mastery', 'Master GitHub Copilot to write code faster and smarter. Learn advanced prompting techniques, keyboard shortcuts, and best practices for pair programming with AI.', 'beginner', ARRAY['frontend', 'backend', 'fullstack'], ARRAY['javascript', 'python', 'typescript'], 4, ARRAY['Set up and configure GitHub Copilot', 'Write effective code comments for better suggestions', 'Use Copilot for test generation', 'Leverage Copilot Chat for explanations'], NULL, true, 1, '🤖')
RETURNING id INTO copilot_path_id;

INSERT INTO ai_learning_paths (title, description, difficulty, target_role, tech_stack, estimated_duration_hours, learning_objectives, prerequisites, is_published, order_index, icon)
VALUES ('Cursor Power User Guide', 'Become a power user of Cursor, the AI-first code editor. Learn to leverage its unique features for maximum productivity.', 'intermediate', ARRAY['frontend', 'backend', 'fullstack'], ARRAY['all'], 5, ARRAY['Navigate and use Cursor efficiently', 'Master Cmd+K for inline editing', 'Use codebase-wide AI chat', 'Leverage multi-file editing'], ARRAY['Basic familiarity with VS Code or similar editors'], true, 2, '✨')
RETURNING id INTO cursor_path_id;

INSERT INTO ai_learning_paths (title, description, difficulty, target_role, tech_stack, estimated_duration_hours, learning_objectives, prerequisites, is_published, order_index, icon)
VALUES ('ChatGPT for Developers', 'Learn how to use ChatGPT as your coding assistant. From debugging to architecture discussions, master the art of prompting for development tasks.', 'beginner', ARRAY['all'], ARRAY['all'], 3, ARRAY['Write effective prompts for coding tasks', 'Debug code with ChatGPT', 'Generate boilerplate code', 'Review and improve existing code'], NULL, true, 3, '💬')
RETURNING id INTO chatgpt_path_id;

INSERT INTO ai_learning_paths (title, description, difficulty, target_role, tech_stack, estimated_duration_hours, learning_objectives, prerequisites, is_published, order_index, icon)
VALUES ('Advanced Prompt Engineering', 'Master the art and science of prompt engineering for coding tasks. Learn techniques that work across all AI tools.', 'advanced', ARRAY['all'], ARRAY['all'], 6, ARRAY['Understand how AI models process prompts', 'Write zero-shot and few-shot prompts', 'Chain prompts for complex tasks', 'Optimize prompts for accuracy and efficiency'], ARRAY['Experience with at least one AI coding tool'], true, 4, '🎯')
RETURNING id INTO prompt_eng_path_id;

INSERT INTO ai_learning_paths (title, description, difficulty, target_role, tech_stack, estimated_duration_hours, learning_objectives, prerequisites, is_published, order_index, icon)
VALUES ('AI-First Development Workflow', 'Build a complete development workflow powered by AI tools. Learn to combine multiple tools for maximum productivity.', 'intermediate', ARRAY['fullstack', 'backend', 'frontend'], ARRAY['all'], 8, ARRAY['Design an AI-augmented development workflow', 'Choose the right AI tool for each task', 'Integrate AI tools into your CI/CD', 'Measure and improve AI-assisted productivity'], ARRAY['Experience with multiple AI coding tools'], true, 5, '🚀')
RETURNING id INTO workflow_path_id;

RAISE NOTICE 'Inserted 5 learning paths';
RAISE NOTICE 'GitHub Copilot Path ID: %', copilot_path_id;

-- =====================================================
-- 3. INSERT LESSONS FOR GITHUB COPILOT MASTERY
-- =====================================================

INSERT INTO ai_learning_lessons (learning_path_id, title, description, content_type, content, duration_minutes, order_index, learning_objectives, resources)
VALUES
(
  copilot_path_id,
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
  '{"links": ["https://github.com/features/copilot", "https://docs.github.com/en/copilot"]}'
);

INSERT INTO ai_learning_lessons (learning_path_id, title, description, content_type, content, duration_minutes, order_index, learning_objectives, resources)
VALUES
(
  copilot_path_id,
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

The more specific you are, the better the results.

## Key Takeaways

- Clear, detailed comments = better suggestions
- Provide examples for complex logic
- Use type hints when available',
  20,
  2,
  ARRAY['Write effective code comments', 'Understand what makes a good prompt', 'Use context to improve suggestions'],
  '{"links": ["https://github.blog/2023-06-20-how-to-write-better-prompts-for-github-copilot/"]}'
);

INSERT INTO ai_learning_lessons (learning_path_id, title, description, content_type, content, duration_minutes, order_index, learning_objectives, resources)
VALUES
(
  copilot_path_id,
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

## Key Takeaways

- Tab is your friend
- Learn to navigate suggestions efficiently',
  15,
  3,
  ARRAY['Master essential Copilot keyboard shortcuts', 'Navigate suggestions efficiently', 'Use inline chat for quick edits'],
  '{"links": ["https://code.visualstudio.com/docs/editor/github-copilot"]}'
);

RAISE NOTICE 'Inserted 3 lessons for GitHub Copilot Mastery';

END $$;

-- =====================================================
-- 4. VERIFY INSERTION
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '===========================================';
  RAISE NOTICE 'AI Tools seed data inserted successfully!';
  RAISE NOTICE '===========================================';
  RAISE NOTICE 'Created:';
  RAISE NOTICE '- % learning paths', (SELECT COUNT(*) FROM ai_learning_paths);
  RAISE NOTICE '- % lessons', (SELECT COUNT(*) FROM ai_learning_lessons);
  RAISE NOTICE '===========================================';
END $$;

-- Show all data for verification
SELECT 'LEARNING PATHS' as type, id, title, difficulty, estimated_duration_hours as hours FROM ai_learning_paths ORDER BY order_index;

SELECT 'LESSONS' as type, id, title, duration_minutes as minutes, order_index FROM ai_learning_lessons ORDER BY order_index;
