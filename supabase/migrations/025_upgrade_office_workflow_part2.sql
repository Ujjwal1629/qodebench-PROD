-- =============================================
-- Migration: Upgrade Office Workflow Challenges Part 2
-- Description: Complete content for challenges 6-10
-- Version: 025
-- =============================================

-- ============================================================================
-- Challenge #6: Write Deployment Checklist
-- ============================================================================

UPDATE challenges
SET
  description = E'## Challenge\n\nYou''re preparing to deploy a major feature release to production. Create a comprehensive pre-deployment checklist to ensure nothing is forgotten.\n\n## Release Details\n\n**Feature**: Team Collaboration Platform (v2.0)\n**Deploy Date**: Friday, January 20, 2025 at 10:00 AM EST\n**Deploy Window**: 30 minutes\n**Expected Downtime**: 5 minutes (database migrations)\n\n**Changes**:\n- New database tables (teams, team_members, invites)\n- 3 new API endpoints\n- Updated frontend with team management UI\n- New WebSocket connections for real-time updates\n- Environment variable changes\n\n**Rollback Plan**: Can rollback within 1 hour if issues detected\n\n## Requirements\n\nYour checklist must cover:\n\n1. **Pre-Deployment** (Day Before)\n   - Code review completed\n   - All tests passing\n   - Database backup\n   - Rollback plan ready\n\n2. **Deployment Steps** (Sequential)\n   - Database migrations\n   - Deploy backend\n   - Deploy frontend\n   - Verify health checks\n\n3. **Post-Deployment Verification**\n   - Smoke tests\n   - Monitor error rates\n   - Check key metrics\n   - Verify new features work\n\n4. **Communication**\n   - Notify stakeholders\n   - Update status page\n   - Post-deployment email\n\n## Checklist Format\n\nUse checkboxes `- [ ]` for items that need to be completed.\n\n## Your Task\n\nCreate a detailed, actionable deployment checklist.',

  starter_code = '{"markdown": "# Deployment Checklist: [Feature Name] v[Version]\n\n**Deploy Date**: \n**Deploy Time**: \n**Expected Duration**: \n**Engineer(s)**: \n\n---\n\n## Pre-Deployment (Day Before)\n\n- [ ] All pull requests merged and reviewed\n- [ ] All CI/CD tests passing (unit, integration, E2E)\n- [ ] Database backup completed and verified\n- [ ] Staging environment tested and verified\n- [ ] Rollback plan documented and ready\n- [ ] Environment variables updated in production config\n- [ ] [Add more items specific to your release]\n\n## Deployment Steps (Execute in Order)\n\n### Step 1: Pre-Deploy Verification\n- [ ] Verify current production is healthy\n- [ ] Check database connection pool capacity\n- [ ] Confirm maintenance window with team\n\n### Step 2: Database Changes\n- [ ] Run database migrations (list them)\n- [ ] Verify migrations succeeded\n- [ ] Check database integrity\n\n### Step 3: Backend Deployment\n- [ ] Deploy backend services\n- [ ] Verify backend health checks pass\n- [ ] Check API response times\n\n### Step 4: Frontend Deployment\n- [ ] Deploy frontend build\n- [ ] Clear CDN cache\n- [ ] Verify static assets load\n\n### Step 5: Service Restart\n- [ ] Restart necessary services\n- [ ] Verify all services come back online\n\n## Post-Deployment Verification\n\n- [ ] Run smoke tests on critical flows\n- [ ] Check error monitoring dashboard (no spike in errors)\n- [ ] Verify key metrics (response times, throughput)\n- [ ] Test new features manually\n- [ ] Check database query performance\n- [ ] Verify third-party integrations work\n- [ ] Monitor for 30 minutes post-deployment\n\n## Communication\n\n- [ ] Update status page (\"Deployment in progress\")\n- [ ] Notify stakeholders that deployment started\n- [ ] Update status page (\"Deployment complete\")\n- [ ] Send post-deployment summary email\n- [ ] Update internal Slack channel\n\n## Rollback Plan (If Needed)\n\n- [ ] Trigger rollback if:\n  - Error rate > 5%\n  - Critical feature broken\n  - Database corruption detected\n\n- [ ] Rollback steps:\n  1. [Step 1]\n  2. [Step 2]\n  3. [Step 3]\n\n---\n\n**Deployment Notes**:\n- [Any special notes or gotchas]\n\n**Sign-off**:\n- [ ] Deployment completed successfully\n- [ ] All checks passed\n- [ ] Signed off by: [Name] at [Time]"}',

  test_cases = '[{
    "type": "ai_validation",
    "criteria": {
      "comprehensiveness": {
        "weight": 35,
        "description": "Covers all deployment phases (pre, during, post)"
      },
      "actionability": {
        "weight": 30,
        "description": "Items are specific and actionable with clear steps"
      },
      "organization": {
        "weight": 20,
        "description": "Well-organized with logical ordering and sections"
      },
      "risk_management": {
        "weight": 15,
        "description": "Includes verification steps and rollback plan"
      }
    }
  }]'

WHERE slug = 'office-deployment-checklist';

-- ============================================================================
-- Challenge #7: Create API Documentation
-- ============================================================================

UPDATE challenges
SET
  description = E'## Challenge\n\nYou built a new REST API for user management. Now you need to document it so other developers can use it.\n\n## API Endpoints to Document\n\n### Endpoint 1: Get User by ID\n- **Method**: GET\n- **Path**: `/api/users/:id`\n- **Auth**: Required (Bearer token)\n- **Response**: User object with profile data\n\n### Endpoint 2: Create New User\n- **Method**: POST\n- **Path**: `/api/users`\n- **Auth**: Required (Admin only)\n- **Body**: `{ email, name, role }`\n- **Response**: Created user object\n\n### Endpoint 3: Update User\n- **Method**: PUT\n- **Path**: `/api/users/:id`\n- **Auth**: Required (user or admin)\n- **Body**: `{ name?, bio?, avatar? }`\n- **Response**: Updated user object\n\n## Requirements\n\nFor EACH endpoint, document:\n\n1. **Endpoint Details**\n   - HTTP method\n   - URL path\n   - Authentication requirements\n\n2. **Request Format**\n   - Headers needed\n   - Path parameters\n   - Query parameters\n   - Request body (with example)\n\n3. **Response Format**\n   - Success response (200, 201)\n   - Error responses (400, 401, 404, 500)\n   - Response body examples\n\n4. **Example Code**\n   - curl command\n   - JavaScript fetch example\n\n## Documentation Style\n\nUse clear formatting:\n- Headers for each endpoint\n- Code blocks for examples\n- Tables for parameters\n- Clear success/error response examples\n\n## Your Task\n\nWrite complete API documentation for all 3 endpoints.',

  starter_code = '{"markdown": "# User Management API Documentation\n\n## Base URL\n```\nhttps://api.example.com/v1\n```\n\n## Authentication\n\nAll endpoints require authentication using Bearer tokens:\n\n```\nAuthorization: Bearer YOUR_API_TOKEN\n```\n\n---\n\n## Endpoints\n\n### 1. Get User by ID\n\nRetrieve a user''s profile information by their ID.\n\n**Request**\n```\nGET /api/users/:id\n```\n\n**Path Parameters**\n| Parameter | Type | Required | Description |\n|-----------|------|----------|-------------|\n| id | string | Yes | User''s unique ID |\n\n**Headers**\n```\nAuthorization: Bearer YOUR_TOKEN\nContent-Type: application/json\n```\n\n**Success Response (200 OK)**\n```json\n{\n  \"id\": \"123\",\n  \"email\": \"user@example.com\",\n  \"name\": \"John Doe\",\n  \"role\": \"user\",\n  \"createdAt\": \"2025-01-15T10:00:00Z\"\n}\n```\n\n**Error Responses**\n\n*404 Not Found*\n```json\n{\n  \"error\": \"User not found\"\n}\n```\n\n*401 Unauthorized*\n```json\n{\n  \"error\": \"Invalid or missing authentication token\"\n}\n```\n\n**Example Request (curl)**\n```bash\ncurl -X GET \"https://api.example.com/v1/api/users/123\" \\\n  -H \"Authorization: Bearer YOUR_TOKEN\"\n```\n\n**Example Request (JavaScript)**\n```javascript\nconst response = await fetch(''https://api.example.com/v1/api/users/123'', {\n  headers: {\n    ''Authorization'': ''Bearer YOUR_TOKEN''\n  }\n});\nconst user = await response.json();\n```\n\n---\n\n### 2. Create New User\n\n[DOCUMENT THIS ENDPOINT]\n\n---\n\n### 3. Update User\n\n[DOCUMENT THIS ENDPOINT]\n\n---\n\n## Rate Limiting\n\n- 100 requests per minute per API key\n- Rate limit headers included in response\n\n## Error Codes\n\n| Code | Description |\n|------|-------------|\n| 200 | Success |\n| 201 | Created |\n| 400 | Bad Request |\n| 401 | Unauthorized |\n| 404 | Not Found |\n| 500 | Server Error |"}',

  test_cases = '[{
    "type": "ai_validation",
    "criteria": {
      "completeness": {
        "weight": 35,
        "description": "Documents all endpoints with all required information"
      },
      "clarity": {
        "weight": 30,
        "description": "Clear, easy-to-understand documentation"
      },
      "examples": {
        "weight": 20,
        "description": "Includes working code examples (curl, JavaScript)"
      },
      "formatting": {
        "weight": 15,
        "description": "Well-formatted with proper markdown, tables, code blocks"
      }
    }
  }]'

WHERE slug = 'office-api-docs';

-- ============================================================================
-- Challenge #8: Write Technical Design Document
-- ============================================================================

UPDATE challenges
SET
  description = E'## Challenge\n\nYour team needs to build a new feature: **Real-time Notifications System**. Before coding, you need to write a technical design document.\n\n## Feature Requirements\n\n**Goal**: Notify users of important events in real-time\n\n**Events to notify**:\n- New message received\n- Task assigned to you\n- Comment on your post\n- Deadline approaching\n\n**User Requirements**:\n- See notifications instantly (< 1 second delay)\n- Mark notifications as read\n- Notification history (last 30 days)\n- Desktop and email notification options\n\n**Scale**: 10,000 active users, ~500 notifications/second at peak\n\n## Requirements\n\nYour design doc must include:\n\n1. **Overview** - What are we building and why?\n\n2. **Technical Architecture**\n   - System components\n   - Data flow diagram\n   - Technology choices (WebSockets vs polling, etc.)\n\n3. **Database Schema**\n   - Tables needed\n   - Key fields\n   - Indexes\n\n4. **API Design**\n   - Endpoints needed\n   - Request/response formats\n\n5. **Implementation Plan**\n   - Phase 1, 2, 3\n   - Timeline estimates\n\n6. **Security Considerations**\n   - Authentication\n   - Authorization\n   - Rate limiting\n\n7. **Testing Strategy**\n   - Unit tests\n   - Integration tests\n   - Load testing\n\n8. **Risks & Mitigation**\n   - What could go wrong?\n   - How do we handle it?\n\n## Your Task\n\nWrite a comprehensive technical design document.',

  starter_code = '{"markdown": "# Technical Design Document: [Feature Name]\n\n**Author**: [Your Name]\n**Date**: [Date]\n**Status**: Draft\n**Reviewers**: [Tag relevant people]\n\n---\n\n## 1. Overview\n\n### Problem Statement\n[What problem are we solving?]\n\n### Goals\n- [Goal 1]\n- [Goal 2]\n- [Goal 3]\n\n### Non-Goals\n[What are we explicitly NOT doing in this version?]\n\n---\n\n## 2. Technical Architecture\n\n### System Components\n\n```\n[Draw/describe architecture]\nClient <-> API Gateway <-> Backend Service <-> Database\n                             |\n                             v\n                        Notification Service\n```\n\n### Technology Choices\n\n| Component | Technology | Justification |\n|-----------|------------|---------------|\n| Real-time connection | [WebSockets/Polling] | [Why?] |\n| Database | [PostgreSQL/MongoDB] | [Why?] |\n| Message Queue | [Redis/RabbitMQ] | [Why?] |\n\n### Data Flow\n\n1. [Step 1: Event occurs]\n2. [Step 2: Event published to queue]\n3. [Step 3: Notification service processes]\n4. [Step 4: Notification sent to user]\n\n---\n\n## 3. Database Schema\n\n### `notifications` Table\n\n```sql\nCREATE TABLE notifications (\n  id UUID PRIMARY KEY,\n  user_id UUID NOT NULL,\n  type VARCHAR(50) NOT NULL,\n  title TEXT NOT NULL,\n  message TEXT,\n  read BOOLEAN DEFAULT FALSE,\n  created_at TIMESTAMP DEFAULT NOW()\n);\n\nCREATE INDEX idx_notifications_user_id ON notifications(user_id);\n```\n\n[Add more tables as needed]\n\n---\n\n## 4. API Design\n\n### Get User Notifications\n```\nGET /api/notifications?limit=20&offset=0\n```\n\n### Mark Notification as Read\n```\nPUT /api/notifications/:id/read\n```\n\n[Define all endpoints]\n\n---\n\n## 5. Implementation Plan\n\n### Phase 1: Basic Notifications (Week 1-2)\n- [ ] Database schema\n- [ ] API endpoints\n- [ ] Basic UI\n\n### Phase 2: Real-time Updates (Week 3)\n- [ ] WebSocket connection\n- [ ] Real-time delivery\n\n### Phase 3: Advanced Features (Week 4)\n- [ ] Email notifications\n- [ ] Notification preferences\n\n---\n\n## 6. Security Considerations\n\n- **Authentication**: [How do we verify users?]\n- **Authorization**: [Who can see what?]\n- **Rate Limiting**: [Prevent abuse]\n- **Data Privacy**: [PII handling]\n\n---\n\n## 7. Testing Strategy\n\n- **Unit Tests**: [What to test]\n- **Integration Tests**: [End-to-end flows]\n- **Load Tests**: [Can handle 500 notif/sec?]\n- **Security Tests**: [Pen testing]\n\n---\n\n## 8. Risks & Mitigation\n\n| Risk | Impact | Likelihood | Mitigation |\n|------|--------|------------|------------|\n| WebSocket connections drop | High | Medium | [Reconnection logic] |\n| Database overload | High | Low | [Caching, read replicas] |\n| [Add more risks] | | | |\n\n---\n\n## 9. Open Questions\n\n- [ ] Question 1?\n- [ ] Question 2?\n\n---\n\n## 10. References\n\n- [Link to requirements doc]\n- [Link to design mockups]\n- [External documentation]"}',

  test_cases = '[{
    "type": "ai_validation",
    "criteria": {
      "completeness": {
        "weight": 30,
        "description": "Covers all required sections with sufficient detail"
      },
      "technical_depth": {
        "weight": 30,
        "description": "Shows deep technical understanding and makes informed choices"
      },
      "clarity": {
        "weight": 25,
        "description": "Clear writing that both technical and non-technical stakeholders can understand"
      },
      "practicality": {
        "weight": 15,
        "description": "Realistic implementation plan and risk assessment"
      }
    }
  }]'

WHERE slug = 'office-tech-design';

-- ============================================================================
-- Challenge #9: Create Bug Report
-- ============================================================================

UPDATE challenges
SET
  description = E'## Challenge\n\nYou discovered a critical bug in the production application. Write a detailed bug report so developers can reproduce and fix it.\n\n## Bug Discovery\n\nWhile testing the user profile page, you noticed:\n\n1. Clicked on "Edit Profile" button\n2. Changed your name from "John" to "John Smith"\n3. Clicked "Save"\n4. Page refreshed, but name still shows "John"\n5. Checked database - name IS updated to "John Smith"\n6. After hard refresh (Ctrl+F5), correct name appears\n\n**Conclusion**: Profile data is cached somewhere and not invalidating after updates.\n\n## Additional Info\n\n- **Environment**: Production (app.example.com)\n- **Browser**: Chrome 120 on Windows 11\n- **User Role**: Regular user (not admin)\n- **Frequency**: Happens 100% of the time\n- **Workaround**: Hard refresh (Ctrl+F5) shows correct data\n- **First Noticed**: January 15, 2025\n\n## Impact\n\n- **Severity**: High\n- **Users Affected**: All users who edit their profiles\n- **Business Impact**: Users think their changes aren''t saving, causing confusion and support tickets\n\n## Requirements\n\nYour bug report must include:\n\n1. **Title** - Clear, concise summary\n2. **Description** - What''s wrong?\n3. **Steps to Reproduce** - Exact steps (numbered)\n4. **Expected Behavior** - What should happen?\n5. **Actual Behavior** - What actually happens?\n6. **Environment** - Browser, OS, version, etc.\n7. **Severity** - Critical/High/Medium/Low\n8. **Screenshots/Videos** - Visual proof (describe what would be shown)\n9. **Additional Context** - Any other relevant info\n\n## Your Task\n\nWrite a clear, detailed bug report that developers can use to fix the issue.',

  starter_code = '{"markdown": "# Bug Report: [Clear, concise title]\n\n**Status**: Open\n**Priority**: [Critical/High/Medium/Low]\n**Reported By**: [Your name]\n**Date**: [Date]\n**Assigned To**: [Leave blank or suggest team]\n\n---\n\n## Description\n\n[Describe the bug in 2-3 sentences. What''s wrong?]\n\n---\n\n## Steps to Reproduce\n\n1. [First step]\n2. [Second step]\n3. [Third step]\n4. [What triggers the bug?]\n\n---\n\n## Expected Behavior\n\n[What should happen?]\n\n---\n\n## Actual Behavior\n\n[What actually happens instead?]\n\n---\n\n## Environment\n\n- **Browser**: [Chrome/Firefox/Safari + version]\n- **Operating System**: [Windows/Mac/Linux + version]\n- **App Version**: [Version number]\n- **User Role**: [Admin/User/Guest]\n- **URL**: [Exact URL where bug occurs]\n\n---\n\n## Severity Assessment\n\n**Severity**: [Critical/High/Medium/Low]\n\n**Impact**:\n- [Who is affected?]\n- [How many users?]\n- [What can''t they do?]\n\n**Frequency**: [Always/Sometimes/Rarely]\n\n---\n\n## Screenshots/Videos\n\n[Describe what screenshots would show]\n\n**Screenshot 1**: [Before the bug]\n**Screenshot 2**: [After reproducing the bug]\n**Screenshot 3**: [Console errors, if any]\n\n---\n\n## Additional Context\n\n### Workaround\n[Is there a temporary workaround users can use?]\n\n### Possible Cause\n[Your hypothesis about what might be causing this]\n\n### Related Issues\n[Link to similar bugs or related tickets]\n\n---\n\n## Technical Details\n\n### Console Errors\n```\n[Paste any console errors here]\n```\n\n### Network Requests\n[Any relevant API calls, response codes]\n\n### Database State\n[What does the data look like in the database?]\n\n---\n\n**Tags**: #bug #profile #cache #high-priority"}',

  test_cases = '[{
    "type": "ai_validation",
    "criteria": {
      "reproducibility": {
        "weight": 35,
        "description": "Clear steps that anyone can follow to reproduce the bug"
      },
      "completeness": {
        "weight": 30,
        "description": "Includes all required information (environment, severity, expected vs actual)"
      },
      "clarity": {
        "weight": 20,
        "description": "Easy to understand with no ambiguity"
      },
      "actionability": {
        "weight": 15,
        "description": "Provides enough context for developers to fix it"
      }
    }
  }]'

WHERE slug = 'office-bug-report';

-- ============================================================================
-- Challenge #10: Write Code Review Comments
-- ============================================================================

UPDATE challenges
SET
  description = E'## Challenge\n\nA junior developer submitted a pull request. You need to review their code and provide constructive feedback.\n\n## The Pull Request\n\n**Title**: "Add user authentication"\n**Changes**: Login form component\n\n**Code Submitted**:\n\n```javascript\n// LoginForm.jsx\nimport { useState } from ''react'';\n\nfunction LoginForm() {\n  const [email, setEmail] = useState('''');\n  const [password, setPassword] = useState('''');\n\n  const handleSubmit = async () => {\n    // Issue 1: No event.preventDefault()\n    // Issue 2: No error handling\n    // Issue 3: Hardcoded API URL\n    const res = await fetch(''http://localhost:3000/api/login'', {\n      method: ''POST'',\n      body: JSON.stringify({ email, password })\n      // Issue 4: Missing Content-Type header\n    });\n    \n    const data = await res.json();\n    // Issue 5: Doesn''t check if login succeeded\n    // Issue 6: Stores token in localStorage (security issue)\n    localStorage.setItem(''token'', data.token);\n    // Issue 7: No user feedback (loading, success, error)\n    window.location.href = ''/dashboard'';\n  };\n\n  return (\n    <form onSubmit={handleSubmit}>\n      {/* Issue 8: No labels for accessibility */}\n      <input \n        type=\"text\"  {/* Issue 9: Should be type=\"email\" */}\n        value={email}\n        onChange={(e) => setEmail(e.target.value)}\n        placeholder=\"Email\"\n      />\n      <input \n        type=\"password\"\n        value={password}\n        onChange={(e) => setPassword(e.target.value)}\n        placeholder=\"Password\"\n      />\n      <button type=\"submit\">Login</button>\n      {/* Issue 10: No password visibility toggle */}\n    </form>\n  );\n}\n```\n\n## Issues Found\n\n1. No `preventDefault()` on form submit\n2. No error handling (try-catch)\n3. Hardcoded API URL (should use env variable)\n4. Missing `Content-Type: application/json` header\n5. Doesn''t check response status\n6. Stores token in localStorage (XSS vulnerable)\n7. No loading/error/success states\n8. Missing labels (accessibility issue)\n9. Input type should be "email"\n10. No password visibility toggle\n\n## Requirements\n\nWrite code review comments that:\n\n1. **Point out issues** - What''s wrong?\n2. **Explain why** - Why is it a problem?\n3. **Suggest solutions** - How to fix it?\n4. **Be constructive** - Helpful, not critical\n5. **Prioritize** - What''s critical vs nice-to-have?\n6. **Provide examples** - Show code snippets where helpful\n\n## Tone Guidelines\n\n✅ **Good**: "Consider adding error handling here. If the API is down, users won''t see any feedback. You could add a try-catch and show an error message."\n\n❌ **Bad**: "This code is terrible. You forgot error handling."\n\n## Your Task\n\nWrite constructive code review comments for this pull request.',

  starter_code = '{"markdown": "# Code Review: Add user authentication\n\n**Reviewer**: [Your name]\n**Date**: [Date]\n**PR**: #123\n**Overall**: [Needs changes / Approved with comments / Approved]\n\n---\n\n## Summary\n\n[2-3 sentences summarizing the PR and your overall thoughts]\n\n---\n\n## Critical Issues (Must Fix)\n\n### 1. Missing Form Submit Prevention\n\n**Issue**: The form will cause a page refresh because `event.preventDefault()` is missing.\n\n**Why it matters**: Users will lose their input and see a full page reload instead of smooth authentication.\n\n**Suggestion**:\n```javascript\nconst handleSubmit = async (e) => {\n  e.preventDefault(); // Add this\n  // ... rest of code\n};\n```\n\n### 2. [Next critical issue]\n\n[Explain issue, why it matters, and how to fix]\n\n---\n\n## High Priority (Should Fix)\n\n### 3. [High priority issue]\n\n[Explain and provide solution]\n\n---\n\n## Nice to Have (Consider for Future)\n\n### [Improvement suggestion]\n\n[Explain benefit and provide example]\n\n---\n\n## Positive Feedback\n\n- ✅ [Something they did well]\n- ✅ [Another good thing]\n- ✅ [Encouragement]\n\n---\n\n## Recommended Changes\n\n- [ ] Add error handling with try-catch\n- [ ] Move API URL to environment variable\n- [ ] Add loading state\n- [ ] Add accessibility labels\n- [ ] [Add more]\n\n---\n\n## Questions\n\n- Question 1?\n- Question 2?\n\n---\n\n## Additional Resources\n\n- [Link to security best practices]\n- [Link to React form handling guide]\n- [Link to accessibility guidelines]"}',

  test_cases = '[{
    "type": "ai_validation",
    "criteria": {
      "constructiveness": {
        "weight": 30,
        "description": "Feedback is helpful and encouraging, not harsh or dismissive"
      },
      "specificity": {
        "weight": 30,
        "description": "Points out specific issues with clear examples"
      },
      "actionability": {
        "weight": 25,
        "description": "Provides concrete solutions and code examples"
      },
      "prioritization": {
        "weight": 15,
        "description": "Separates critical issues from nice-to-haves"
      }
    }
  }]'

WHERE slug = 'office-code-review';

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
WHERE slug LIKE 'office-%'
  AND tier = 'office-workflow'
ORDER BY order_in_tier;
