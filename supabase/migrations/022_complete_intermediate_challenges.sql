-- =============================================
-- Migration: Complete Intermediate Challenges (2-10)
-- Description: Add detailed content for all intermediate challenges
-- Version: 022
-- =============================================

-- ============================================================================
-- Challenge #2: Fix React Context Implementation
-- ============================================================================

UPDATE challenges
SET
  description = E'## Challenge\n\nYou have a user authentication context, but it''s causing performance issues and unnecessary re-renders!\n\n## Bug Reports\n\n- Entire app re-renders when any context value changes\n- Login form re-renders 10+ times on each keystroke\n- Performance is sluggish with 50+ components\n- Console shows "Too many re-renders" warnings\n\n## The Problem\n\nContext value is recreated on every render, causing all consumers to re-render unnecessarily.\n\n## Requirements\n\n1. Memoize context value to prevent unnecessary re-renders\n2. Separate authentication state from user data\n3. Use useMemo for context value object\n4. Optimize provider component\n\n## Expected Behavior\n\n- Login form only re-renders when its own state changes\n- Context consumers only re-render when auth state actually changes\n- No performance warnings in console\n\n## Your Task\n\nOptimize the AuthContext to prevent unnecessary re-renders.',

  starter_code = '{"javascript": "import { createContext, useState, useContext } from ''react'';\n\nconst AuthContext = createContext();\n\nexport function AuthProvider({ children }) {\n  const [user, setUser] = useState(null);\n  const [isLoading, setIsLoading] = useState(false);\n  \n  const login = async (email, password) => {\n    setIsLoading(true);\n    // ... login logic\n    setIsLoading(false);\n  };\n  \n  const logout = () => {\n    setUser(null);\n  };\n  \n  // Bug: This object is recreated on EVERY render!\n  // All consumers will re-render even if values haven''t changed\n  const value = {\n    user,\n    isLoading,\n    login,\n    logout\n  };\n  \n  return (\n    <AuthContext.Provider value={value}>\n      {children}\n    </AuthContext.Provider>\n  );\n}\n\nexport function useAuth() {\n  return useContext(AuthContext);\n}"}',

  test_cases = '[{
    "type": "ai_validation",
    "criteria": {
      "memoization": {
        "weight": 40,
        "description": "Uses useMemo to memoize context value"
      },
      "optimization": {
        "weight": 30,
        "description": "Prevents unnecessary re-renders"
      },
      "understanding": {
        "weight": 30,
        "description": "Demonstrates understanding of React performance"
      }
    }
  }]',

  learning_objectives = ARRAY[
    'Optimize React Context performance',
    'Use useMemo correctly',
    'Understand re-render cycles',
    'Implement efficient state management'
  ]

WHERE slug = 'intermediate-context-api';

-- ============================================================================
-- Challenge #3: Resolve API Error Handling
-- ============================================================================

UPDATE challenges
SET
  description = E'## Challenge\n\nYour API route for creating blog posts has poor error handling. Users get cryptic errors and the app crashes!\n\n## Bug Reports\n\n- Returns 500 for all errors (even validation issues)\n- Error messages are not user-friendly\n- Database errors expose sensitive info\n- No logging for debugging\n- Try-catch doesn''t handle all cases\n\n## Requirements\n\n1. Add comprehensive try-catch error handling\n2. Return appropriate HTTP status codes:\n   - 400 for validation errors\n   - 401 for authentication errors  \n   - 404 for not found\n   - 500 for server errors\n3. Return user-friendly error messages\n4. Log errors for debugging (don''t expose to client)\n5. Handle Supabase-specific errors\n\n## Expected API Responses\n\n**Missing title:**\n```json\n400: { "error": "Title is required" }\n```\n\n**Unauthorized:**\n```json\n401: { "error": "Authentication required" }\n```\n\n**Database error:**\n```json\n500: { "error": "Failed to create post" }\n// (logs full error server-side)\n```\n\n## Your Task\n\nAdd proper error handling with correct status codes.',

  starter_code = '{"javascript": "// app/api/posts/route.ts\nimport { NextRequest, NextResponse } from ''next/server'';\nimport { createClient } from ''@/lib/supabase/server'';\n\nexport async function POST(req: NextRequest) {\n  // Bug: No try-catch at all!\n  const { title, content } = await req.json();\n  \n  const supabase = await createClient();\n  \n  // Bug: No auth check!\n  const { data: { user } } = await supabase.auth.getUser();\n  \n  // Bug: No validation!\n  \n  // Bug: Error not handled!\n  const { data, error } = await supabase\n    .from(''posts'')\n    .insert({ title, content, user_id: user.id })\n    .select()\n    .single();\n  \n  // Bug: Always returns 200, even on error!\n  // Bug: Exposes database errors to client!\n  if (error) {\n    return NextResponse.json({ error: error.message });\n  }\n  \n  return NextResponse.json({ data });\n}"}',

  test_cases = '[{
    "type": "ai_validation",
    "criteria": {
      "error_handling": {
        "weight": 35,
        "description": "Comprehensive try-catch with proper error handling"
      },
      "status_codes": {
        "weight": 30,
        "description": "Returns appropriate HTTP status codes (400, 401, 500)"
      },
      "validation": {
        "weight": 20,
        "description": "Validates input and returns clear error messages"
      },
      "security": {
        "weight": 15,
        "description": "Doesn''t expose sensitive error details to client"
      }
    }
  }]',

  learning_objectives = ARRAY[
    'Implement robust error handling in APIs',
    'Use appropriate HTTP status codes',
    'Write user-friendly error messages',
    'Secure API error responses'
  ]

WHERE slug = 'intermediate-api-errors';

-- ============================================================================
-- Challenge #4: Fix Database Query in API Route
-- ============================================================================

UPDATE challenges
SET
  description = E'## Challenge\n\nYou have an API route that fetches user posts with comments, but the query is slow and returns incorrect data!\n\n## Bug Reports\n\n- Takes 5+ seconds to load 10 posts\n- N+1 query problem (100+ database queries)\n- Missing posts that should appear\n- Comments are duplicated\n- Pagination doesn''t work\n\n## The Problem\n\nSupabase query is poorly structured with missing joins and inefficient filtering.\n\n## Requirements\n\n1. Use proper Supabase joins to avoid N+1 queries\n2. Add correct filtering and sorting\n3. Implement pagination (limit & offset)\n4. Select only needed columns\n5. Handle query errors\n\n## Query Requirements\n\n- Fetch posts with their comments in ONE query\n- Only published posts\n- Sort by created_at DESC\n- Limit to 10 posts per page\n- Include author name\n\n## Your Task\n\nOptimize the Supabase query for performance and correctness.',

  starter_code = '{"javascript": "// app/api/posts/route.ts\nimport { NextRequest, NextResponse } from ''next/server'';\nimport { createClient } from ''@/lib/supabase/server'';\n\nexport async function GET(req: NextRequest) {\n  const supabase = await createClient();\n  const page = req.nextUrl.searchParams.get(''page'') || ''1'';\n  \n  // Bug: No pagination!\n  // Bug: Selects ALL columns (wasteful!)\n  // Bug: No filtering for published posts\n  const { data: posts, error } = await supabase\n    .from(''posts'')\n    .select(''*'');\n  \n  if (error) {\n    return NextResponse.json({ error }, { status: 500 });\n  }\n  \n  // Bug: N+1 query problem! Fetches comments for each post separately\n  const postsWithComments = await Promise.all(\n    posts.map(async (post) => {\n      const { data: comments } = await supabase\n        .from(''comments'')\n        .select(''*'')\n        .eq(''post_id'', post.id);\n      \n      return { ...post, comments };\n    })\n  );\n  \n  return NextResponse.json({ posts: postsWithComments });\n}"}',

  test_cases = '[{
    "type": "ai_validation",
    "criteria": {
      "query_optimization": {
        "weight": 40,
        "description": "Uses proper joins to avoid N+1 queries"
      },
      "pagination": {
        "weight": 25,
        "description": "Implements pagination with limit and offset"
      },
      "filtering": {
        "weight": 20,
        "description": "Filters and sorts correctly"
      },
      "performance": {
        "weight": 15,
        "description": "Selects only needed columns, efficient query"
      }
    }
  }]',

  learning_objectives = ARRAY[
    'Master Supabase query optimization',
    'Avoid N+1 query problems',
    'Implement efficient pagination',
    'Use database joins correctly'
  ]

WHERE slug = 'intermediate-db-query';

-- ============================================================================
-- Challenge #5: Debug Server vs Client Components
-- ============================================================================

UPDATE challenges
SET
  description = E'## Challenge\n\nYou''re using Next.js 15 App Router, but you''re getting errors about Server Components and Client Components!\n\n## Error Messages\n\n- "Error: useState can only be used in Client Components"\n- "You''re importing a component that needs useState"\n- "useEffect is not defined in Server Components"\n- Hydration mismatch errors\n\n## The Problem\n\nMixing Server and Client Component code without proper boundaries.\n\n## Requirements\n\n1. Add ''use client'' directive to Client Components\n2. Keep data fetching in Server Components\n3. Pass data as props from Server to Client\n4. Understand when to use each type\n\n## Component Structure\n\n```\napp/dashboard/page.tsx (Server Component)\n  └─ DashboardClient (Client Component) \n      └─ Uses useState for interactivity\n```\n\n## Your Task\n\nFix the Server/Client component boundaries.',

  starter_code = '{"javascript": "// app/dashboard/page.tsx\nimport { createClient } from ''@/lib/supabase/server'';\nimport { useState } from ''react'';  // Bug: Can''t use useState here!\n\nexport default async function DashboardPage() {\n  // This is a Server Component (async)\n  const supabase = await createClient();\n  const { data: stats } = await supabase\n    .from(''user_stats'')\n    .select(''*'')\n    .single();\n  \n  // Bug: Can''t use useState in Server Component!\n  const [isExpanded, setIsExpanded] = useState(false);\n  \n  return (\n    <div>\n      <h1>Dashboard</h1>\n      <div>Points: {stats.points}</div>\n      \n      <button onClick={() => setIsExpanded(!isExpanded)}>\n        Toggle Details\n      </button>\n      \n      {isExpanded && (\n        <div>\n          <p>Streak: {stats.streak} days</p>\n          <p>Completed: {stats.completed} challenges</p>\n        </div>\n      )}\n    </div>\n  );\n}"}',

  test_cases = '[{
    "type": "ai_validation",
    "criteria": {
      "component_separation": {
        "weight": 40,
        "description": "Properly separates Server and Client Components"
      },
      "use_client_directive": {
        "weight": 30,
        "description": "Adds ''use client'' where needed"
      },
      "data_flow": {
        "weight": 30,
        "description": "Passes data from Server to Client Components correctly"
      }
    }
  }]',

  learning_objectives = ARRAY[
    'Understand Server vs Client Components',
    'Use ''use client'' directive correctly',
    'Structure Next.js 15 apps properly',
    'Pass data between component types'
  ]

WHERE slug = 'intermediate-rsc';

-- ============================================================================
-- Challenge #6: Fix Authentication Flow
-- ============================================================================

UPDATE challenges
SET
  description = E'## Challenge\n\nYour Supabase authentication flow has bugs! Users can''t sign in, sessions aren''t persisted, and errors aren''t handled.\n\n## Bug Reports\n\n- Sign in succeeds but user is immediately logged out\n- Page refresh logs user out\n- Error messages not displayed\n- Redirect after login doesn''t work\n- Session not stored in cookies\n\n## The Problem\n\nIncomplete Supabase auth setup with missing session handling.\n\n## Requirements\n\n1. Properly handle sign-in with error catching\n2. Set up session persistence\n3. Redirect after successful login\n4. Display user-friendly error messages\n5. Handle auth state changes\n\n## Expected Flow\n\n1. User enters credentials\n2. Sign in with Supabase\n3. Store session\n4. Redirect to /dashboard\n5. Session persists across page refreshes\n\n## Your Task\n\nFix the authentication flow to work correctly.',

  starter_code = '{"javascript": "''use client'';\n\nimport { useState } from ''react'';\nimport { createClient } from ''@/lib/supabase/client'';\nimport { useRouter } from ''next/navigation'';\n\nexport function SignInForm() {\n  const [email, setEmail] = useState('''');\n  const [password, setPassword] = useState('''');\n  const router = useRouter();\n  const supabase = createClient();\n  \n  const handleSubmit = async (e: React.FormEvent) => {\n    e.preventDefault();\n    \n    // Bug: No error handling!\n    // Bug: Not checking if sign in succeeded!\n    const { data } = await supabase.auth.signInWithPassword({\n      email,\n      password,\n    });\n    \n    // Bug: Redirects even if login failed!\n    router.push(''/dashboard'');\n  };\n  \n  return (\n    <form onSubmit={handleSubmit}>\n      <input\n        type=\"email\"\n        value={email}\n        onChange={(e) => setEmail(e.target.value)}\n        placeholder=\"Email\"\n      />\n      <input\n        type=\"password\"\n        value={password}\n        onChange={(e) => setPassword(e.target.value)}\n        placeholder=\"Password\"\n      />\n      <button type=\"submit\">Sign In</button>\n      {/* Bug: No error message display! */}\n    </form>\n  );\n}"}',

  test_cases = '[{
    "type": "ai_validation",
    "criteria": {
      "error_handling": {
        "weight": 35,
        "description": "Properly handles and displays authentication errors"
      },
      "session_management": {
        "weight": 30,
        "description": "Correctly manages auth sessions"
      },
      "redirect_logic": {
        "weight": 20,
        "description": "Only redirects on successful login"
      },
      "user_experience": {
        "weight": 15,
        "description": "Shows loading states and error messages"
      }
    }
  }]',

  learning_objectives = ARRAY[
    'Implement Supabase authentication',
    'Handle auth errors properly',
    'Manage user sessions',
    'Create smooth auth flows'
  ]

WHERE slug = 'intermediate-auth-flow';

-- ============================================================================
-- Challenge #7: Resolve CORS Issues
-- ============================================================================

UPDATE challenges
SET
  description = E'## Challenge\n\nYour API is being called from a frontend on a different domain, but CORS is blocking the requests!\n\n## Error Messages\n\n- "Access-Control-Allow-Origin header is missing"\n- "CORS policy: No ''Access-Control-Allow-Origin'' header"\n- "Preflight request failed"\n- OPTIONS requests return 404\n\n## The Problem\n\nAPI routes don''t have proper CORS headers configured.\n\n## Requirements\n\n1. Add CORS headers to API responses\n2. Handle OPTIONS preflight requests\n3. Allow specific origins (don''t use * in production)\n4. Allow necessary HTTP methods and headers\n5. Handle credentials correctly\n\n## Allowed Configuration\n\n- Origins: localhost:3000, your-domain.com\n- Methods: GET, POST, PUT, DELETE\n- Headers: Content-Type, Authorization\n- Credentials: true\n\n## Your Task\n\nAdd proper CORS configuration to the API route.',

  starter_code = '{"javascript": "// app/api/data/route.ts\nimport { NextRequest, NextResponse } from ''next/server'';\nimport { createClient } from ''@/lib/supabase/server'';\n\nexport async function GET(req: NextRequest) {\n  const supabase = await createClient();\n  \n  const { data, error } = await supabase\n    .from(''data'')\n    .select(''*'');\n  \n  if (error) {\n    return NextResponse.json({ error }, { status: 500 });\n  }\n  \n  // Bug: No CORS headers!\n  return NextResponse.json({ data });\n}\n\nexport async function POST(req: NextRequest) {\n  const body = await req.json();\n  \n  // ... logic ...\n  \n  // Bug: No CORS headers!\n  return NextResponse.json({ success: true });\n}\n\n// Bug: No OPTIONS handler for preflight!"}',

  test_cases = '[{
    "type": "ai_validation",
    "criteria": {
      "cors_headers": {
        "weight": 40,
        "description": "Adds proper CORS headers (Access-Control-Allow-*)"
      },
      "preflight_handling": {
        "weight": 30,
        "description": "Handles OPTIONS preflight requests"
      },
      "security": {
        "weight": 20,
        "description": "Restricts origins appropriately, not using *"
      },
      "completeness": {
        "weight": 10,
        "description": "Covers all HTTP methods that need CORS"
      }
    }
  }]',

  learning_objectives = ARRAY[
    'Understand CORS and how it works',
    'Configure CORS in Next.js API routes',
    'Handle preflight requests',
    'Secure cross-origin requests'
  ]

WHERE slug = 'intermediate-cors';

-- ============================================================================
-- Challenge #8: Fix Data Fetching with React Query
-- ============================================================================

UPDATE challenges
SET
  description = E'## Challenge\n\nYou''re using React Query (TanStack Query) for data fetching, but it''s not working correctly!\n\n## Bug Reports\n\n- Data doesn''t refresh when it should\n- Loading states are incorrect\n- Stale data shows up\n- Cache isn''t invalidated after mutations\n- Error states not handled\n\n## The Problem\n\nReact Query hooks are misconfigured with wrong query keys and missing invalidation.\n\n## Requirements\n\n1. Use proper query keys (arrays with dependencies)\n2. Configure staleTime and cacheTime appropriately\n3. Invalidate queries after mutations\n4. Handle loading and error states\n5. Use useQuery and useMutation correctly\n\n## Expected Behavior\n\n- Fetch user data on mount\n- Show loading spinner while fetching\n- Display error if fetch fails\n- After updating user, refetch automatically\n- Don''t refetch unnecessarily\n\n## Your Task\n\nFix the React Query implementation.',

  starter_code = '{"javascript": "''use client'';\n\nimport { useQuery, useMutation } from ''@tanstack/react-query'';\nimport { createClient } from ''@/lib/supabase/client'';\n\nexport function UserProfile({ userId }: { userId: string }) {\n  const supabase = createClient();\n  \n  // Bug: Query key is static, won''t refetch when userId changes!\n  const { data: user, isLoading, error } = useQuery({\n    queryKey: [''user''],  // Should include userId!\n    queryFn: async () => {\n      const { data } = await supabase\n        .from(''users'')\n        .select(''*'')\n        .eq(''id'', userId)\n        .single();\n      return data;\n    },\n    // Bug: No staleTime configured, refetches too often!\n  });\n  \n  // Bug: Doesn''t invalidate query after mutation!\n  const updateMutation = useMutation({\n    mutationFn: async (updates: any) => {\n      const { data } = await supabase\n        .from(''users'')\n        .update(updates)\n        .eq(''id'', userId)\n        .select()\n        .single();\n      return data;\n    },\n    // Missing onSuccess to invalidate!\n  });\n  \n  // Bug: No loading or error states handled!\n  return (\n    <div>\n      <h2>{user?.name}</h2>\n      <p>{user?.email}</p>\n      <button onClick={() => updateMutation.mutate({ name: ''New Name'' })}>\n        Update Name\n      </button>\n    </div>\n  );\n}"}',

  test_cases = '[{
    "type": "ai_validation",
    "criteria": {
      "query_keys": {
        "weight": 30,
        "description": "Uses proper query keys with dependencies"
      },
      "cache_management": {
        "weight": 25,
        "description": "Configures staleTime/cacheTime and invalidates correctly"
      },
      "state_handling": {
        "weight": 25,
        "description": "Handles loading and error states properly"
      },
      "mutations": {
        "weight": 20,
        "description": "Properly uses useMutation with invalidation"
      }
    }
  }]',

  learning_objectives = ARRAY[
    'Master React Query fundamentals',
    'Configure query keys correctly',
    'Manage cache and stale data',
    'Implement mutations with cache invalidation'
  ]

WHERE slug = 'intermediate-react-query';

-- ============================================================================
-- Challenge #9: Debug Middleware Logic
-- ============================================================================

UPDATE challenges
SET
  description = E'## Challenge\n\nYour Next.js middleware for auth protection isn''t working! Protected routes are accessible without login, and auth routes redirect incorrectly.\n\n## Bug Reports\n\n- /dashboard accessible without authentication\n- Signed-in users can still access /signin\n- Infinite redirect loops on some pages\n- Middleware not running on certain routes\n- Session check is slow\n\n## The Problem\n\nMiddleware logic has incorrect path matching and auth verification.\n\n## Requirements\n\n1. Protect /dashboard/* routes (require auth)\n2. Redirect /signin and /signup to /dashboard if already logged in\n3. Allow public routes (/, /about)\n4. Avoid redirect loops\n5. Use efficient session checking\n\n## Route Logic\n\n```\n/ → Public\n/about → Public\n/signin → Redirect to /dashboard if authenticated\n/dashboard → Require auth, redirect to /signin if not\n/dashboard/settings → Require auth\n```\n\n## Your Task\n\nFix the middleware route protection logic.',

  starter_code = '{"javascript": "// middleware.ts\nimport { NextResponse } from ''next/server'';\nimport type { NextRequest } from ''next/server'';\nimport { createClient } from ''@/lib/supabase/middleware'';\n\nexport async function middleware(request: NextRequest) {\n  const { pathname } = request.nextUrl;\n  \n  // Bug: This is slow! Checks auth on EVERY request\n  const supabase = createClient(request);\n  const { data: { user } } = await supabase.auth.getUser();\n  \n  // Bug: Logic is backwards!\n  if (pathname.startsWith(''/dashboard'')) {\n    // Should redirect to /signin if NOT logged in\n    if (user) {\n      return NextResponse.redirect(new URL(''/signin'', request.url));\n    }\n  }\n  \n  // Bug: No check for auth routes!\n  // Signed-in users should be redirected away from /signin\n  \n  return NextResponse.next();\n}\n\nexport const config = {\n  // Bug: Matches too many routes, including static files!\n  matcher: ''/:path*'',\n};"}',

  test_cases = '[{
    "type": "ai_validation",
    "criteria": {
      "route_protection": {
        "weight": 35,
        "description": "Correctly protects dashboard routes"
      },
      "auth_redirect": {
        "weight": 30,
        "description": "Redirects auth pages when already logged in"
      },
      "public_routes": {
        "weight": 20,
        "description": "Allows public routes without auth"
      },
      "performance": {
        "weight": 15,
        "description": "Efficient matcher pattern, no unnecessary checks"
      }
    }
  }]',

  learning_objectives = ARRAY[
    'Master Next.js middleware',
    'Implement route protection',
    'Handle authentication in middleware',
    'Configure matcher patterns efficiently'
  ]

WHERE slug = 'intermediate-middleware';

-- ============================================================================
-- Challenge #10: Fix Form Validation with Zod
-- ============================================================================

UPDATE challenges
SET
  description = E'## Challenge\n\nYou have a user registration form, but validation isn''t working! Invalid data gets submitted and error messages don''t show.\n\n## Bug Reports\n\n- Form submits with empty fields\n- Email validation doesn''t work\n- Password requirements not enforced\n- Error messages not displayed\n- TypeScript types don''t match validation\n\n## The Problem\n\nZod schema is incomplete and not properly integrated with React Hook Form.\n\n## Requirements\n\n1. Create comprehensive Zod schema:\n   - Email: valid format\n   - Password: min 8 chars, 1 uppercase, 1 number\n   - Name: min 2 chars, max 50 chars\n   - Age: number between 13-120\n2. Integrate with React Hook Form using zodResolver\n3. Display field-specific error messages\n4. Show validation errors in real-time\n5. TypeScript types from Zod schema\n\n## Expected Validation\n\n```\nEmail: "test" → "Invalid email format"\nPassword: "weak" → "Password must be at least 8 characters"\nName: "A" → "Name must be at least 2 characters"\nAge: "5" → "Age must be at least 13"\n```\n\n## Your Task\n\nImplement complete form validation with Zod.',

  starter_code = '{"javascript": "''use client'';\n\nimport { useForm } from ''react-hook-form'';\nimport { zodResolver } from ''@hookform/resolvers/zod'';\nimport { z } from ''zod'';\n\n// Bug: Schema is incomplete and weak!\nconst schema = z.object({\n  email: z.string(),  // No email validation!\n  password: z.string(),  // No length/complexity requirements!\n  name: z.string(),  // No min/max length!\n  age: z.number(),  // No range validation!\n});\n\ntype FormData = z.infer<typeof schema>;\n\nexport function RegistrationForm() {\n  const {\n    register,\n    handleSubmit,\n    formState: { errors },\n  } = useForm<FormData>({\n    // Bug: No resolver!\n  });\n  \n  const onSubmit = (data: FormData) => {\n    console.log(data);\n  };\n  \n  return (\n    <form onSubmit={handleSubmit(onSubmit)}>\n      <div>\n        <input {...register(''email'')} placeholder=\"Email\" />\n        {/* Bug: Error not displayed! */}\n      </div>\n      \n      <div>\n        <input {...register(''password'')} type=\"password\" placeholder=\"Password\" />\n        {/* Bug: Error not displayed! */}\n      </div>\n      \n      <div>\n        <input {...register(''name'')} placeholder=\"Name\" />\n      </div>\n      \n      <div>\n        <input {...register(''age'', { valueAsNumber: true })} type=\"number\" placeholder=\"Age\" />\n      </div>\n      \n      <button type=\"submit\">Register</button>\n    </form>\n  );\n}"}',

  test_cases = '[{
    "type": "ai_validation",
    "criteria": {
      "schema_validation": {
        "weight": 40,
        "description": "Comprehensive Zod schema with all validations"
      },
      "integration": {
        "weight": 30,
        "description": "Properly integrates with React Hook Form using zodResolver"
      },
      "error_display": {
        "weight": 20,
        "description": "Shows field-specific error messages"
      },
      "typescript": {
        "weight": 10,
        "description": "Uses TypeScript types from Zod schema"
      }
    }
  }]',

  learning_objectives = ARRAY[
    'Master Zod schema validation',
    'Integrate Zod with React Hook Form',
    'Create complex validation rules',
    'Display validation errors effectively'
  ]

WHERE slug = 'intermediate-zod-validation';

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
WHERE slug LIKE 'intermediate-%'
  AND tier = 'intermediate'
ORDER BY order_in_tier;
