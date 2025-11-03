-- =============================================
-- Migration: Add Complete Content for Challenges 4-7
-- Description: Fill in detailed descriptions and starter code
-- Version: 020
-- =============================================

-- ============================================================================
-- Challenge #4: Handle Form Inputs in React
-- ============================================================================

UPDATE challenges
SET
  description = E'## Challenge\n\nYou have a login form component, but the inputs aren''t working correctly. Users can''t type into the form fields!\n\n## Bug Reports\n\n- Text inputs are "frozen" - typing doesn''t update them\n- Form submission doesn''t capture the current values\n- Console shows warnings about uncontrolled components\n\n## Requirements\n\n1. Convert the form inputs to controlled components\n2. Add proper state management for email and password\n3. Handle form submission correctly\n4. Display the submitted values in an alert (for demo purposes)\n\n## Expected Behavior\n\n```javascript\n// When user types "test@example.com" and "password123"\n// and clicks "Login", should alert:\n"Login attempted with:\nEmail: test@example.com\nPassword: password123"\n```\n\n## Your Task\n\nFix the component below to make it a proper controlled form.',

  starter_code = '{"javascript": "import { useState } from ''react'';\n\nfunction LoginForm() {\n  // TODO: Add state for email and password\n  \n  const handleSubmit = (e) => {\n    e.preventDefault();\n    // Bug: These values will be undefined!\n    alert(`Login attempted with:\\nEmail: ${email}\\nPassword: ${password}`);\n  };\n  \n  return (\n    <form onSubmit={handleSubmit}>\n      <div>\n        <label>Email:</label>\n        {/* Bug: Uncontrolled input - no value or onChange */}\n        <input type=\"email\" />\n      </div>\n      <div>\n        <label>Password:</label>\n        {/* Bug: Uncontrolled input - no value or onChange */}\n        <input type=\"password\" />\n      </div>\n      <button type=\"submit\">Login</button>\n    </form>\n  );\n}"}',

  test_cases = '[{
    "type": "ai_validation",
    "criteria": {
      "controlled_components": {
        "weight": 40,
        "description": "Properly implements controlled components with value and onChange"
      },
      "state_management": {
        "weight": 30,
        "description": "Correctly uses useState for form fields"
      },
      "functionality": {
        "weight": 30,
        "description": "Form submission works and captures current values"
      }
    }
  }]',

  learning_objectives = ARRAY[
    'Understand controlled vs uncontrolled components',
    'Implement form state management with useState',
    'Handle form submission in React',
    'Connect form inputs to component state'
  ]

WHERE slug = 'beginner-form-inputs';

-- ============================================================================
-- Challenge #5: Fix useEffect Dependencies
-- ============================================================================

UPDATE challenges
SET
  description = E'## Challenge\n\nThis component fetches user data from an API, but it''s causing an infinite loop! The browser is freezing and making endless API calls.\n\n## Bug Reports\n\n- Browser becomes unresponsive\n- Console shows "Warning: Maximum update depth exceeded"\n- Network tab shows hundreds of API calls per second\n- The user data keeps re-fetching continuously\n\n## The Problem\n\nThe `useEffect` hook has incorrect dependencies, causing it to run infinitely.\n\n## Requirements\n\n1. Fix the dependency array to prevent infinite loops\n2. Ensure the effect runs only when `userId` changes\n3. Keep the data fetching functionality working\n\n## Your Task\n\nFix the `useEffect` dependencies to stop the infinite loop while maintaining proper functionality.\n\n## Hints\n\n- Objects created inside the component are "new" on every render\n- The dependency array should include values that, when changed, should trigger the effect\n- Don''t include setters from useState (they''re stable)',

  starter_code = '{"javascript": "import { useState, useEffect } from ''react'';\n\nfunction UserProfile({ userId }) {\n  const [user, setUser] = useState(null);\n  const [loading, setLoading] = useState(false);\n  \n  // Bug: This causes an infinite loop!\n  useEffect(() => {\n    setLoading(true);\n    fetch(`/api/users/${userId}`)\n      .then(res => res.json())\n      .then(data => {\n        setUser(data);\n        setLoading(false);\n      });\n  }, [userId, user]); // Bug: ''user'' in dependencies causes infinite loop!\n  \n  if (loading) return <div>Loading...</div>;\n  if (!user) return <div>No user data</div>;\n  \n  return (\n    <div>\n      <h2>{user.name}</h2>\n      <p>{user.email}</p>\n    </div>\n  );\n}"}',

  test_cases = '[{
    "type": "ai_validation",
    "criteria": {
      "dependency_array": {
        "weight": 50,
        "description": "Correct dependency array that prevents infinite loops"
      },
      "understanding": {
        "weight": 30,
        "description": "Demonstrates understanding of useEffect dependencies"
      },
      "functionality": {
        "weight": 20,
        "description": "Effect runs when userId changes but not on every render"
      }
    }
  }]',

  learning_objectives = ARRAY[
    'Master useEffect dependency arrays',
    'Understand React re-render cycles',
    'Debug infinite loops in React',
    'Avoid common useEffect pitfalls'
  ]

WHERE slug = 'beginner-useeffect-deps';

-- ============================================================================
-- Challenge #6: Implement Basic Next.js Routing
-- ============================================================================

UPDATE challenges
SET
  description = E'## Challenge\n\nYou''re building a blog with Next.js 15 (App Router), but the navigation and routing aren''t working!\n\n## Issues\n\n- Clicking navigation links causes full page reloads (slow!)\n- The "View Post" buttons use wrong routing syntax\n- Active link highlighting doesn''t work\n- Dynamic routes aren''t set up correctly\n\n## Requirements\n\n1. Fix navigation to use Next.js Link component (client-side navigation)\n2. Add active link highlighting using usePathname\n3. Fix the dynamic route syntax for blog posts\n4. Ensure no full page reloads when navigating\n\n## File Structure\n\n```\napp/\n  layout.tsx\n  page.tsx\n  blog/\n    page.tsx       ← List of posts\n    [slug]/        ← Dynamic route\n      page.tsx     ← Individual post\n```\n\n## Expected Behavior\n\n- Clicking links = instant client-side navigation\n- Current page link should be highlighted\n- URLs like `/blog/my-first-post` should work\n\n## Your Task\n\nFix the navigation component to use proper Next.js App Router patterns.',

  starter_code = '{"javascript": "// components/Navigation.jsx\nimport { usePathname } from ''next/navigation'';\n\nfunction Navigation() {\n  const pathname = usePathname();\n  \n  return (\n    <nav>\n      {/* Bug: Using <a> instead of Link - causes full page reload! */}\n      <a href=\"/\">Home</a>\n      <a href=\"/blog\">Blog</a>\n      <a href=\"/about\">About</a>\n      \n      {/* Bug: No active state highlighting */}\n    </nav>\n  );\n}\n\n// app/blog/page.jsx\nfunction BlogList() {\n  const posts = [\n    { id: 1, slug: ''first-post'', title: ''My First Post'' },\n    { id: 2, slug: ''second-post'', title: ''Second Post'' }\n  ];\n  \n  return (\n    <div>\n      <h1>Blog Posts</h1>\n      {posts.map(post => (\n        <div key={post.id}>\n          <h2>{post.title}</h2>\n          {/* Bug: Wrong routing syntax for dynamic routes */}\n          <a href={`/blog?slug=${post.slug}`}>Read More</a>\n        </div>\n      ))}\n    </div>\n  );\n}"}',

  test_cases = '[{
    "type": "ai_validation",
    "criteria": {
      "link_component": {
        "weight": 35,
        "description": "Uses Next.js Link component instead of <a> tags"
      },
      "active_state": {
        "weight": 25,
        "description": "Implements active link highlighting with usePathname"
      },
      "dynamic_routes": {
        "weight": 25,
        "description": "Correct dynamic route syntax (/blog/[slug])"
      },
      "client_side_nav": {
        "weight": 15,
        "description": "Ensures client-side navigation without full page reloads"
      }
    }
  }]',

  learning_objectives = ARRAY[
    'Master Next.js App Router navigation',
    'Use Link component for client-side routing',
    'Implement dynamic routes correctly',
    'Add active link states with usePathname'
  ]

WHERE slug = 'beginner-nextjs-routing';

-- ============================================================================
-- Challenge #7: Fix API Route Handler
-- ============================================================================

UPDATE challenges
SET
  description = E'## Challenge\n\nYou have a Next.js API route for user registration, but it''s broken! The API returns errors and doesn''t validate input properly.\n\n## Bug Reports\n\n- API returns 500 error even with valid data\n- No input validation - accepts empty/invalid emails\n- Missing error handling for database operations\n- Doesn''t return proper HTTP status codes\n- Password is stored in plain text (security issue!)\n\n## Requirements\n\n1. Add proper input validation (email format, password length)\n2. Return appropriate HTTP status codes (400 for bad input, 201 for success, 500 for server errors)\n3. Hash the password before storing (use bcrypt)\n4. Add try-catch error handling\n5. Return JSON responses in consistent format\n\n## Expected API Behavior\n\n**Valid request:**\n```json\nPOST /api/register\n{ "email": "user@example.com", "password": "securepass123" }\n\nResponse: 201 Created\n{ "success": true, "message": "User registered", "userId": "123" }\n```\n\n**Invalid request:**\n```json\nPOST /api/register\n{ "email": "invalid", "password": "123" }\n\nResponse: 400 Bad Request\n{ "success": false, "error": "Invalid email format" }\n```\n\n## Your Task\n\nFix the API route handler below to properly validate input, handle errors, and return correct responses.',

  starter_code = '{"javascript": "// app/api/register/route.ts\nimport { NextRequest, NextResponse } from ''next/server'';\nimport { createClient } from ''@/lib/supabase/server'';\n\nexport async function POST(req: NextRequest) {\n  const { email, password } = await req.json();\n  \n  // Bug: No input validation!\n  // Bug: No try-catch error handling!\n  // Bug: No email format validation!\n  // Bug: Password stored in plain text!\n  \n  const supabase = await createClient();\n  \n  const { data, error } = await supabase\n    .from(''users'')\n    .insert({ email, password }) // Bug: Plain text password!\n    .select()\n    .single();\n  \n  // Bug: Always returns 200, even on errors\n  return NextResponse.json({ data, error });\n}"}',

  test_cases = '[{
    "type": "ai_validation",
    "criteria": {
      "input_validation": {
        "weight": 30,
        "description": "Validates email format and password requirements"
      },
      "error_handling": {
        "weight": 25,
        "description": "Uses try-catch and handles errors appropriately"
      },
      "status_codes": {
        "weight": 20,
        "description": "Returns proper HTTP status codes (400, 201, 500)"
      },
      "security": {
        "weight": 25,
        "description": "Hashes password before storing (mentions bcrypt or similar)"
      }
    }
  }]',

  learning_objectives = ARRAY[
    'Build secure API routes in Next.js',
    'Implement input validation',
    'Use proper HTTP status codes',
    'Handle errors gracefully',
    'Understand password hashing basics'
  ]

WHERE slug = 'beginner-api-route';

-- Verify all updates
SELECT
  slug,
  title,
  CASE
    WHEN starter_code IS NULL THEN '❌ Missing starter_code'
    WHEN test_cases IS NULL THEN '❌ Missing test_cases'
    WHEN LENGTH(description) < 200 THEN '❌ Description too short'
    ELSE '✅ Complete'
  END as status
FROM challenges
WHERE slug IN (
  'beginner-form-inputs',
  'beginner-useeffect-deps',
  'beginner-nextjs-routing',
  'beginner-api-route'
)
ORDER BY order_in_tier;
