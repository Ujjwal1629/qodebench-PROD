-- =============================================
-- Migration: Create Advanced Tier Challenges
-- Description: 5 advanced challenges simulating real production scenarios
-- Version: 026
-- =============================================

-- First, clear any existing advanced challenges that don't fit our new structure
UPDATE challenges
SET is_active = FALSE
WHERE tier = 'advanced' AND is_active = TRUE;

-- ============================================================================
-- SCENARIO 1: Production Bug - User Profile Issue (3 connected challenges)
-- ============================================================================

-- ============================================================================
-- Advanced Challenge #1: Fix React Hydration Mismatch
-- ============================================================================

INSERT INTO challenges (
  title,
  slug,
  description,
  difficulty,
  category,
  points,
  tier,
  order_in_tier,
  unlock_requirement_type,
  unlock_requirement_count,
  challenge_type,
  response_format,
  validation_type,
  starter_code,
  test_cases,
  learning_objectives,
  estimated_time,
  is_active
) VALUES (
  'Fix Production Bug: React Hydration Mismatch',
  'advanced-hydration-bug',
  E'## 🚨 Production Incident\n\n**Severity**: P1 (Critical)\n**Reported**: 45 minutes ago\n**Status**: Affecting 30% of users\n**Error**: "Text content does not match server-rendered HTML"\n\n## The Problem\n\nUsers are seeing a React hydration mismatch error on the profile page. The page renders correctly on the server, but when React hydrates on the client, it detects a mismatch and shows a warning.\n\n**User Impact**:\n- Profile page flashes/re-renders\n- User settings briefly show wrong data\n- Console flooded with warnings\n- Poor user experience\n\n## Error Details\n\n```\nWarning: Text content did not match. Server: "Joined 2 months ago" Client: "Joined 45 days ago"\nWarning: An error occurred during hydration. The server HTML was replaced with client content.\n```\n\n## Root Cause\n\nThe profile component is using JavaScript `Date` directly to format timestamps. The server renders the date in one timezone, but the client renders it in the user''s local timezone.\n\n## Code Location\n\n`components/UserProfile.tsx` - Line 15-20\n\n## Requirements\n\n1. **Fix the hydration mismatch** - Ensure server and client render the same HTML\n2. **Maintain functionality** - Date should still be human-readable\n3. **Follow React best practices** - Use proper SSR-safe patterns\n4. **No breaking changes** - Component API stays the same\n\n## Hints\n\n- Problem: Using `Date` objects directly causes SSR/client mismatches\n- Solution: Format dates consistently or use `useEffect` for client-only rendering\n- Consider: Should dates show relative time ("2 months ago") or absolute ("Jan 15, 2025")?\n\n## Your Task\n\nFix the hydration bug while maintaining the user experience.\n\n## Success Criteria\n\n✅ No hydration warnings in console\n✅ Dates render consistently\n✅ No layout shift on page load\n✅ Tests pass',
  'hard',
  'react',
  200,
  'advanced',
  1,
  'tier_completion',
  3,
  'code',
  'javascript',
  'ai_only',
  '{"javascript": "import { useState, useEffect } from ''react'';\n\ninterface UserProfileProps {\n  user: {\n    name: string;\n    email: string;\n    joinedDate: string; // ISO string: \"2024-11-15T10:00:00Z\"\n    lastActive: string; // ISO string: \"2025-01-15T14:30:00Z\"\n  };\n}\n\nexport function UserProfile({ user }: UserProfileProps) {\n  // Bug: This causes hydration mismatch!\n  // Server renders in UTC, client renders in local time\n  const formatRelativeTime = (dateString: string) => {\n    const date = new Date(dateString);\n    const now = new Date();\n    const diffMs = now.getTime() - date.getTime();\n    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));\n    \n    if (diffDays < 30) {\n      return `${diffDays} days ago`;\n    } else {\n      const diffMonths = Math.floor(diffDays / 30);\n      return `${diffMonths} months ago`;\n    }\n  };\n  \n  return (\n    <div className=\"profile\">\n      <h1>{user.name}</h1>\n      <p>{user.email}</p>\n      \n      {/* Bug: These cause hydration mismatch */}\n      <div className=\"profile-meta\">\n        <p>Joined: {formatRelativeTime(user.joinedDate)}</p>\n        <p>Last active: {formatRelativeTime(user.lastActive)}</p>\n      </div>\n    </div>\n  );\n}"}',
  '[{
    "type": "ai_validation",
    "criteria": {
      "hydration_fix": {
        "weight": 40,
        "description": "Eliminates hydration mismatch using SSR-safe patterns"
      },
      "react_patterns": {
        "weight": 30,
        "description": "Uses proper React patterns (useEffect, suppressHydrationWarning, or consistent formatting)"
      },
      "functionality": {
        "weight": 20,
        "description": "Maintains user-friendly date display"
      },
      "production_ready": {
        "weight": 10,
        "description": "Clean code with no console warnings"
      }
    }
  }]',
  ARRAY[
    'Debug React hydration mismatches',
    'Understand SSR vs client-side rendering',
    'Implement SSR-safe date formatting',
    'Fix production bugs efficiently'
  ],
  45,
  TRUE
);

-- ============================================================================
-- Advanced Challenge #2: Write Database Migration
-- ============================================================================

INSERT INTO challenges (
  title,
  slug,
  description,
  difficulty,
  category,
  points,
  tier,
  order_in_tier,
  unlock_requirement_type,
  previous_challenge_id,
  challenge_type,
  response_format,
  validation_type,
  starter_code,
  test_cases,
  learning_objectives,
  estimated_time,
  is_active
) VALUES (
  'Write Database Migration for Profile Enhancement',
  'advanced-db-migration',
  E'## 📦 Feature Request\n\n**Ticket**: FEAT-2847\n**Priority**: High\n**Sprint**: Q1 2025\n**Story Points**: 5\n\n## Context\n\nAfter fixing the hydration bug, Product wants to add new fields to user profiles:\n\n1. **Bio** (text, optional, max 500 chars)\n2. **Location** (text, optional, max 100 chars)\n3. **Website** (text, optional, must be valid URL)\n4. **Profile Visibility** (enum: public/private/friends-only, default: public)\n\n## Database: PostgreSQL (Supabase)\n\n**Current Schema**:\n```sql\nCREATE TABLE profiles (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  user_id UUID REFERENCES auth.users(id) NOT NULL,\n  full_name TEXT NOT NULL,\n  avatar_url TEXT,\n  created_at TIMESTAMP DEFAULT NOW(),\n  updated_at TIMESTAMP DEFAULT NOW()\n);\n```\n\n## Requirements\n\n### 1. Add New Columns\n- `bio` - TEXT, nullable, check length <= 500\n- `location` - TEXT, nullable, check length <= 100\n- `website` - TEXT, nullable\n- `profile_visibility` - TEXT, not null, default ''public'', check constraint\n\n### 2. Add Constraints\n- Bio max 500 characters\n- Location max 100 characters\n- profile_visibility must be one of: [''public'', ''private'', ''friends-only'']\n\n### 3. Add Index\n- Index on `profile_visibility` for filtering\n\n### 4. Update Existing Rows\n- Set `profile_visibility` to ''public'' for all existing users\n\n### 5. Migration Safety\n- Must be reversible (write DOWN migration)\n- Must handle existing data\n- Must be idempotent (safe to re-run)\n- Add comments explaining each step\n\n## Your Task\n\nWrite a production-ready database migration.\n\n## Success Criteria\n\n✅ All new columns added with correct types\n✅ Constraints are enforced\n✅ Existing data is migrated\n✅ Index created for performance\n✅ Migration is reversible\n✅ Safe to run in production',
  'hard',
  'nextjs',
  200,
  'advanced',
  2,
  'previous',
  (SELECT id FROM challenges WHERE slug = 'advanced-hydration-bug'),
  'code',
  'text',
  'ai_only',
  '{"text": "-- =====================================================\n-- Migration: Add profile enhancement fields\n-- Version: 20250115_add_profile_fields\n-- Description: Add bio, location, website, visibility\n-- =====================================================\n\n-- UP Migration\n-- TODO: Add new columns\n-- TODO: Add constraints\n-- TODO: Create index\n-- TODO: Update existing rows\n\n\n-- DOWN Migration (Rollback)\n-- TODO: Drop columns and constraints"}',
  '[{
    "type": "ai_validation",
    "criteria": {
      "correctness": {
        "weight": 35,
        "description": "Adds all columns with correct types and constraints"
      },
      "safety": {
        "weight": 30,
        "description": "Handles existing data, includes rollback, is idempotent"
      },
      "performance": {
        "weight": 20,
        "description": "Adds appropriate indexes"
      },
      "best_practices": {
        "weight": 15,
        "description": "Well-commented, follows migration conventions"
      }
    }
  }]',
  ARRAY[
    'Write production-ready database migrations',
    'Add columns with constraints safely',
    'Handle existing data in migrations',
    'Implement rollback strategies'
  ],
  40,
  TRUE
);

-- ============================================================================
-- Advanced Challenge #3: Update API Handler
-- ============================================================================

INSERT INTO challenges (
  title,
  slug,
  description,
  difficulty,
  category,
  points,
  tier,
  order_in_tier,
  unlock_requirement_type,
  previous_challenge_id,
  challenge_type,
  response_format,
  validation_type,
  starter_code,
  test_cases,
  learning_objectives,
  estimated_time,
  is_active
) VALUES (
  'Update API to Support New Profile Fields',
  'advanced-api-update',
  E'## 🔄 API Enhancement\n\n**Ticket**: FEAT-2847 (continued)\n**Status**: Database migration complete ✅\n**Next**: Update API endpoints\n\n## Context\n\nThe database now has new profile fields (bio, location, website, profile_visibility). Now we need to update the API handler to support these fields.\n\n## API Endpoint\n\n**Route**: `PUT /api/profile`\n**Purpose**: Update user profile information\n**Auth**: Required (user must be logged in)\n\n## Current Implementation\n\nThe API currently only updates `full_name` and `avatar_url`. It needs to support the new fields.\n\n## Requirements\n\n### 1. Input Validation\n- ✅ **Bio**: Optional, max 500 chars\n- ✅ **Location**: Optional, max 100 chars\n- ✅ **Website**: Optional, must be valid URL format\n- ✅ **Profile Visibility**: Optional, must be one of [''public'', ''private'', ''friends-only'']\n\n### 2. Error Handling\n- Return 400 for validation errors with clear messages\n- Return 401 if user not authenticated\n- Return 500 for database errors (with safe error messages)\n\n### 3. Security\n- Users can only update their own profile\n- Sanitize input to prevent XSS\n- Validate URL format for website field\n\n### 4. Response Format\n```json\n{\n  "success": true,\n  "profile": {\n    "id": "uuid",\n    "full_name": "John Doe",\n    "bio": "Software engineer",\n    "location": "San Francisco",\n    "website": "https://example.com",\n    "profile_visibility": "public",\n    "updated_at": "2025-01-15T10:00:00Z"\n  }\n}\n```\n\n### 5. Database Query\n- Use Supabase client\n- Update only provided fields (partial updates)\n- Return updated profile data\n\n## Your Task\n\nUpdate the API route handler to support all new profile fields with proper validation and error handling.\n\n## Success Criteria\n\n✅ Validates all input fields\n✅ Returns appropriate status codes\n✅ Handles errors gracefully\n✅ Prevents unauthorized updates\n✅ Sanitizes user input\n✅ Returns complete profile data',
  'hard',
  'nextjs',
  200,
  'advanced',
  3,
  'previous',
  (SELECT id FROM challenges WHERE slug = 'advanced-db-migration'),
  'code',
  'javascript',
  'ai_only',
  '{"javascript": "// app/api/profile/route.ts\nimport { NextRequest, NextResponse } from ''next/server'';\nimport { createClient } from ''@/lib/supabase/server'';\n\nexport async function PUT(req: NextRequest) {\n  try {\n    const supabase = await createClient();\n    \n    // Check authentication\n    const { data: { user }, error: authError } = await supabase.auth.getUser();\n    \n    if (authError || !user) {\n      return NextResponse.json(\n        { error: ''Unauthorized'' },\n        { status: 401 }\n      );\n    }\n    \n    // Get request body\n    const body = await req.json();\n    const { full_name, avatar_url } = body;\n    \n    // TODO: Add validation for new fields:\n    // - bio (optional, max 500 chars)\n    // - location (optional, max 100 chars)\n    // - website (optional, valid URL)\n    // - profile_visibility (optional, enum)\n    \n    // TODO: Validate input\n    // - Check field lengths\n    // - Validate URL format for website\n    // - Validate profile_visibility enum\n    \n    // Current implementation (incomplete)\n    const { data: profile, error: updateError } = await supabase\n      .from(''profiles'')\n      .update({\n        full_name,\n        avatar_url,\n        updated_at: new Date().toISOString()\n      })\n      .eq(''user_id'', user.id)\n      .select()\n      .single();\n    \n    if (updateError) {\n      return NextResponse.json(\n        { error: ''Failed to update profile'' },\n        { status: 500 }\n      );\n    }\n    \n    return NextResponse.json({\n      success: true,\n      profile\n    });\n    \n  } catch (error) {\n    console.error(''Profile update error:'', error);\n    return NextResponse.json(\n      { error: ''Internal server error'' },\n      { status: 500 }\n    );\n  }\n}"}',
  '[{
    "type": "ai_validation",
    "criteria": {
      "validation": {
        "weight": 35,
        "description": "Properly validates all input fields with appropriate checks"
      },
      "error_handling": {
        "weight": 30,
        "description": "Handles errors gracefully with proper status codes and messages"
      },
      "security": {
        "weight": 20,
        "description": "Prevents unauthorized access and sanitizes input"
      },
      "completeness": {
        "weight": 15,
        "description": "Supports all new fields and returns complete data"
      }
    }
  }]',
  ARRAY[
    'Build robust API endpoints',
    'Implement comprehensive input validation',
    'Handle errors with proper HTTP status codes',
    'Secure API routes against common vulnerabilities'
  ],
  50,
  TRUE
);

-- ============================================================================
-- SCENARIO 2: Performance Crisis (2 connected challenges)
-- ============================================================================

-- ============================================================================
-- Advanced Challenge #4: Fix N+1 Query Performance
-- ============================================================================

INSERT INTO challenges (
  title,
  slug,
  description,
  difficulty,
  category,
  points,
  tier,
  order_in_tier,
  unlock_requirement_type,
  previous_challenge_id,
  challenge_type,
  response_format,
  validation_type,
  starter_code,
  test_cases,
  learning_objectives,
  estimated_time,
  is_active
) VALUES (
  'Emergency: Fix Slow Dashboard Performance',
  'advanced-n-plus-one',
  E'## 🚨 Performance Emergency\n\n**Alert**: Dashboard loading taking 8+ seconds\n**Impact**: All users (10,000+ affected)\n**Severity**: P0 (Critical)\n**SLA**: Fix within 2 hours\n\n## The Problem\n\n**Dashboard endpoint** is timing out during peak hours. Database monitoring shows:\n\n```\nRequest time: 8.2 seconds\nDatabase queries: 1,247 queries per request\nCPU: 95% utilization\nMemory: 3.2 GB consumed\n```\n\n## Root Cause: Classic N+1 Query Problem\n\nThe dashboard shows:\n1. User''s projects (10 projects)\n2. For each project, show team members\n3. For each member, show their avatar and name\n\n**Current Flow**:\n```\n1. Query: Fetch 10 projects → 1 query\n2. For each project (10 times):\n   - Query: Fetch team members → 10 queries\n3. For each member (avg 5 per project = 50 total):\n   - Query: Fetch user details → 50 queries\n\nTotal: 1 + 10 + 50 = 61 queries for 10 projects!\n```\n\n**With 100 projects**: 1 + 100 + 500 = 601 queries!\n\n## Performance Requirements\n\n- ⏱️ Response time: < 500ms\n- 🔢 Database queries: < 5 queries total\n- 💾 Memory usage: < 100 MB\n- 📊 Handle 1000+ projects efficiently\n\n## The Code\n\n**File**: `app/api/dashboard/route.ts`\n\nThe API fetches projects, then loops through each to fetch team members, then loops through each member to fetch user details.\n\n## Solution Strategy\n\n**Use Database Joins!**\n\n1. Fetch projects WITH their team members in ONE query (using joins)\n2. Fetch all user details in ONE query (using WHERE IN)\n3. Combine data in application code\n\n**Supabase Query Optimization**:\n- Use `.select(''*, team_members(*, users(*))'')` for nested joins\n- Or use multiple queries with `.in()` for WHERE IN pattern\n\n## Your Task\n\nOptimize the dashboard API to use joins instead of N+1 queries.\n\n## Success Criteria\n\n✅ Reduces queries from 61+ to < 5\n✅ Response time < 500ms\n✅ Same data returned (no breaking changes)\n✅ Works with 1000+ projects',
  'hard',
  'nodejs',
  200,
  'advanced',
  4,
  'previous',
  (SELECT id FROM challenges WHERE slug = 'advanced-api-update'),
  'code',
  'javascript',
  'ai_only',
  '{"javascript": "// app/api/dashboard/route.ts\nimport { NextRequest, NextResponse } from ''next/server'';\nimport { createClient } from ''@/lib/supabase/server'';\n\nexport async function GET(req: NextRequest) {\n  try {\n    const supabase = await createClient();\n    \n    const { data: { user } } = await supabase.auth.getUser();\n    if (!user) {\n      return NextResponse.json({ error: ''Unauthorized'' }, { status: 401 });\n    }\n    \n    // Bug: N+1 Query Problem!\n    \n    // Query 1: Fetch user''s projects\n    const { data: projects } = await supabase\n      .from(''projects'')\n      .select(''*'')\n      .eq(''owner_id'', user.id);\n    \n    // Bug: Loop through each project and fetch team members\n    const projectsWithTeams = await Promise.all(\n      projects.map(async (project) => {\n        // Query 2-11: One query per project (N queries)\n        const { data: teamMembers } = await supabase\n          .from(''team_members'')\n          .select(''user_id'')\n          .eq(''project_id'', project.id);\n        \n        // Bug: Loop through each member and fetch user details\n        const membersWithDetails = await Promise.all(\n          teamMembers.map(async (member) => {\n            // Query 12-61+: One query per member (N*M queries)\n            const { data: userDetails } = await supabase\n              .from(''users'')\n              .select(''id, name, avatar_url'')\n              .eq(''id'', member.user_id)\n              .single();\n            \n            return userDetails;\n          })\n        );\n        \n        return {\n          ...project,\n          team: membersWithDetails\n        };\n      })\n    );\n    \n    return NextResponse.json({\n      projects: projectsWithTeams\n    });\n    \n  } catch (error) {\n    console.error(''Dashboard error:'', error);\n    return NextResponse.json(\n      { error: ''Failed to load dashboard'' },\n      { status: 500 }\n    );\n  }\n}"}',
  '[{
    "type": "ai_validation",
    "criteria": {
      "query_optimization": {
        "weight": 45,
        "description": "Eliminates N+1 queries using joins or batched queries"
      },
      "supabase_patterns": {
        "weight": 30,
        "description": "Uses Supabase features correctly (nested selects or .in() queries)"
      },
      "performance": {
        "weight": 15,
        "description": "Reduces queries to < 5 total"
      },
      "correctness": {
        "weight": 10,
        "description": "Returns same data structure (no breaking changes)"
      }
    }
  }]',
  ARRAY[
    'Identify and fix N+1 query problems',
    'Optimize database queries with joins',
    'Use Supabase advanced query patterns',
    'Debug production performance issues'
  ],
  60,
  TRUE
);

-- ============================================================================
-- Advanced Challenge #5: Write Performance Post-Mortem
-- ============================================================================

INSERT INTO challenges (
  title,
  slug,
  description,
  difficulty,
  category,
  points,
  tier,
  order_in_tier,
  unlock_requirement_type,
  previous_challenge_id,
  challenge_type,
  response_format,
  validation_type,
  starter_code,
  test_cases,
  learning_objectives,
  estimated_time,
  is_active
) VALUES (
  'Write Performance Post-Mortem Document',
  'advanced-postmortem',
  E'## 📊 Post-Incident Report\n\n**Incident**: Dashboard Performance Degradation\n**Resolution Time**: 90 minutes\n**Status**: Resolved ✅\n\n## Context\n\nAfter fixing the N+1 query issue, your engineering manager asks you to write a post-mortem document. This will be shared with:\n- Engineering team\n- Product team\n- CTO\n- Potentially customers (public version)\n\n## Incident Summary\n\n**What Happened**:\n- Dashboard loading times increased from 300ms to 8+ seconds\n- Affected all 10,000+ active users\n- Database CPU spiked to 95%\n- 1,247 database queries per request detected\n\n**When**:\n- Started: 2:00 PM EST (detected)\n- Resolved: 3:30 PM EST\n- Duration: 90 minutes\n\n**Impact**:\n- 100% of users affected\n- Dashboard unusable during peak hours\n- Support tickets increased 400%\n- No data loss or corruption\n\n**Root Cause**:\n- N+1 query problem in dashboard API\n- Fetching team members individually instead of using joins\n- Problem existed since launch but only surfaced at scale\n\n**Fix**:\n- Rewrote query to use Supabase nested joins\n- Reduced queries from 1,247 to 3\n- Response time dropped from 8s to 280ms\n\n**Prevention**:\n- Added query monitoring alerts\n- Implemented query count limits in tests\n- Scheduled performance review of all APIs\n- Added load testing to CI/CD pipeline\n\n## Requirements\n\nYour post-mortem must include:\n\n### 1. Executive Summary (2-3 sentences)\nWhat happened, impact, and resolution\n\n### 2. Timeline\nChronological events with timestamps\n\n### 3. Root Cause Analysis\n- What caused the issue?\n- Why did it happen?\n- Why wasn''t it caught earlier?\n\n### 4. Resolution\n- How was it fixed?\n- Why does this fix work?\n\n### 5. Impact Analysis\n- Who was affected?\n- Business impact (lost revenue, churn, etc.)\n- Engineering impact (time spent, opportunity cost)\n\n### 6. Lessons Learned\nWhat did we learn?\n\n### 7. Action Items\n- Immediate fixes (done)\n- Short-term prevention (this sprint)\n- Long-term improvements (this quarter)\n- Owners and deadlines for each\n\n## Tone Requirements\n\n✅ **Do**:\n- Be factual and objective\n- Focus on systems, not individuals\n- Explain technical details clearly\n- Propose concrete action items\n\n❌ **Don''t**:\n- Blame individuals\n- Make excuses\n- Use excessive jargon\n- Skip action items\n\n## Your Task\n\nWrite a comprehensive, professional post-mortem document.\n\n## Success Criteria\n\n✅ Clear executive summary\n✅ Detailed timeline\n✅ Thorough root cause analysis\n✅ Specific, actionable prevention steps\n✅ Professional, blameless tone',
  'hard',
  'office-fundamentals',
  200,
  'advanced',
  5,
  'previous',
  (SELECT id FROM challenges WHERE slug = 'advanced-n-plus-one'),
  'document',
  'markdown',
  'hybrid',
  '{"markdown": "# Post-Mortem: [Incident Title]\n\n**Date**: \n**Author**: \n**Severity**: \n**Duration**: \n**Status**: Resolved\n\n---\n\n## Executive Summary\n\n[2-3 sentences: What happened, impact, and how it was resolved]\n\n---\n\n## Timeline\n\n| Time | Event | Action Taken |\n|------|-------|-------------|\n| 2:00 PM | [Event] | [Action] |\n| 2:15 PM | [Event] | [Action] |\n| 2:30 PM | [Event] | [Action] |\n| 3:00 PM | [Event] | [Action] |\n| 3:30 PM | [Event] | [Action] |\n\n---\n\n## Root Cause Analysis\n\n### What Caused the Issue\n\n[Technical explanation of the root cause]\n\n### Why It Happened\n\n[Why did this issue occur? Was it a bug? Design flaw? Missing monitoring?]\n\n### Why It Wasn''t Caught Earlier\n\n[What allowed this to reach production?]\n\n---\n\n## Impact Analysis\n\n### User Impact\n- **Users Affected**: [Number and percentage]\n- **Duration**: [How long were they affected?]\n- **Severity**: [What couldn''t they do?]\n\n### Business Impact\n- **Revenue**: [Estimated revenue impact]\n- **Support**: [Support ticket volume]\n- **Reputation**: [User sentiment, social media]\n\n### Engineering Impact\n- **Time Spent**: [Engineering hours]\n- **Opportunity Cost**: [What didn''t get done?]\n\n---\n\n## Resolution\n\n### Immediate Fix\n\n[What was done to resolve the incident?]\n\n```\n[Include relevant code or configuration changes]\n```\n\n### Why This Fix Works\n\n[Explain the technical solution]\n\n### Metrics After Fix\n\n- **Response Time**: Before: [X]ms → After: [Y]ms\n- **Database Queries**: Before: [X] → After: [Y]\n- **Error Rate**: Before: [X]% → After: [Y]%\n\n---\n\n## Lessons Learned\n\n### What Went Well ✅\n\n- [Positive 1]\n- [Positive 2]\n- [Positive 3]\n\n### What Went Wrong ❌\n\n- [Issue 1]\n- [Issue 2]\n- [Issue 3]\n\n### What We Learned 💡\n\n- [Lesson 1]\n- [Lesson 2]\n- [Lesson 3]\n\n---\n\n## Action Items\n\n### Completed ✅\n\n- [x] **[Owner]**: [Action item] - Completed [Date]\n- [x] **[Owner]**: [Action item] - Completed [Date]\n\n### In Progress 🔄\n\n- [ ] **[Owner]**: [Action item] - Due: [Date]\n- [ ] **[Owner]**: [Action item] - Due: [Date]\n\n### Planned 📋\n\n- [ ] **[Owner]**: [Action item] - Due: [Date]\n- [ ] **[Owner]**: [Action item] - Due: [Date]\n\n---\n\n## Prevention Measures\n\n### Immediate (This Week)\n\n1. [Action 1]\n2. [Action 2]\n\n### Short-term (This Sprint)\n\n1. [Action 1]\n2. [Action 2]\n\n### Long-term (This Quarter)\n\n1. [Action 1]\n2. [Action 2]\n\n---\n\n## Appendix\n\n### Related Issues\n- [Link to incident ticket]\n- [Link to fix PR]\n- [Link to monitoring dashboard]\n\n### References\n- [Documentation]\n- [External resources]"}',
  '[{
    "type": "ai_validation",
    "criteria": {
      "completeness": {
        "weight": 30,
        "description": "Includes all required sections with sufficient detail"
      },
      "root_cause_depth": {
        "weight": 30,
        "description": "Thoroughly explains what, why, and why not caught earlier"
      },
      "actionability": {
        "weight": 25,
        "description": "Action items are specific, assigned, and time-bound"
      },
      "professionalism": {
        "weight": 15,
        "description": "Blameless, objective tone appropriate for stakeholders"
      }
    }
  }]',
  ARRAY[
    'Write professional post-mortem documents',
    'Conduct thorough root cause analysis',
    'Create actionable prevention plans',
    'Communicate technical issues to stakeholders'
  ],
  45,
  TRUE
);

-- Verify all advanced challenges
SELECT
  slug,
  title,
  order_in_tier,
  CASE
    WHEN starter_code IS NULL THEN '❌ Missing starter_code'
    WHEN test_cases IS NULL THEN '❌ Missing test_cases'
    WHEN LENGTH(description) < 200 THEN '❌ Description too short'
    ELSE '✅ Complete'
  END as status
FROM challenges
WHERE tier = 'advanced'
  AND is_active = TRUE
ORDER BY order_in_tier;
