-- =============================================
-- Migration: Upgrade Office Workflow Challenges
-- Description: Add comprehensive content to all office workflow challenges
-- Version: 024
-- =============================================

-- ============================================================================
-- Challenge #1: Write PR Description
-- ============================================================================

UPDATE challenges
SET
  description = E'## Challenge\n\nYou just finished implementing a new feature: user authentication with JWT tokens. Now you need to write a professional pull request description for code review.\n\n## What You Implemented\n\n**Feature**: JWT-based authentication system\n- Added login/signup endpoints\n- Implemented JWT token generation and validation\n- Created authentication middleware\n- Added protected routes\n- Wrote unit tests for auth functions\n\n**Technical Details**:\n- Using `jsonwebtoken` library\n- Tokens expire after 7 days\n- Passwords hashed with bcrypt\n- Added refresh token mechanism\n\n**Files Changed**: 8 files (+450 lines, -20 lines)\n\n## Requirements\n\nYour PR description must include:\n\n1. **Summary** - What does this PR do? (2-3 sentences)\n2. **Changes Made** - Bullet list of key changes\n3. **Testing** - How did you test this?\n4. **Breaking Changes** - Any breaking changes? (if yes, explain)\n5. **Related Issues** - Link to issue/ticket (use "Fixes #123" format)\n\n## Example Structure\n\n```markdown\n## Summary\n[Explain what and why]\n\n## Changes Made\n- Change 1\n- Change 2\n\n## Testing\n[How you tested it]\n\n## Breaking Changes\n[Yes/No and details]\n\n## Related Issues\nFixes #123\n```\n\n## Your Task\n\nWrite a complete, professional PR description using the template above.',

  starter_code = '{"markdown": "## Summary\n\n[Write 2-3 sentences explaining what this PR does and why it''s needed]\n\n## Changes Made\n\n- [List key changes made in this PR]\n- \n- \n\n## Testing\n\n[Explain how you tested these changes]\n\n- [ ] Unit tests pass\n- [ ] Manual testing completed\n- [ ] \n\n## Breaking Changes\n\n[Are there any breaking changes? If yes, explain what breaks and how to migrate]\n\n## Related Issues\n\nFixes #[issue-number]\n\n---\n**Reviewers**: @[tag relevant team members]\n**Deployment Notes**: [Any special deployment steps?]"}',

  test_cases = '[{
    "type": "ai_validation",
    "criteria": {
      "completeness": {
        "weight": 30,
        "description": "Includes all required sections (Summary, Changes, Testing, Breaking Changes, Related Issues)"
      },
      "clarity": {
        "weight": 30,
        "description": "Clear, concise writing that explains what and why"
      },
      "professionalism": {
        "weight": 25,
        "description": "Professional tone, proper formatting, no typos"
      },
      "technical_detail": {
        "weight": 15,
        "description": "Provides sufficient technical context for reviewers"
      }
    }
  }]'

WHERE slug = 'office-pr-description';

-- ============================================================================
-- Challenge #2: Write Root Cause Analysis (RCA)
-- ============================================================================

UPDATE challenges
SET
  description = E'## Challenge\n\nYour production API experienced an outage last night. The `/api/users/profile` endpoint started returning 500 errors, affecting 2,500 users for 45 minutes. Now you need to write a Root Cause Analysis document.\n\n## Incident Details\n\n**Date**: January 15, 2025\n**Start Time**: 2:15 AM UTC\n**End Time**: 3:00 AM UTC\n**Duration**: 45 minutes\n**Affected Users**: ~2,500 users (12% of active users)\n**Impact**: Unable to access user profiles, causing login failures\n\n## Timeline\n\n- **2:15 AM** - Monitoring alerts triggered for high error rate\n- **2:18 AM** - On-call engineer investigates, sees 500 errors in logs\n- **2:25 AM** - Identified database connection pool exhausted (max 20 connections)\n- **2:30 AM** - Found a bug in profile fetching code causing connection leaks\n- **2:40 AM** - Deployed hotfix increasing pool size to 50\n- **2:45 AM** - Deployed proper fix: added connection release in error handling\n- **3:00 AM** - Error rate back to normal, incident resolved\n\n## Root Cause Found\n\nThe bug was in the profile API handler:\n```javascript\nif (error) {\n  throw error;  // Bug: Didn''t release DB connection!\n}\n```\n\n## Requirements\n\nYour RCA must include:\n\n1. **Incident Summary** - Date, duration, impact\n2. **Timeline** - Chronological events with timestamps\n3. **Root Cause** - What caused it and why it happened\n4. **Resolution** - How it was fixed\n5. **Action Items** - Prevent this from happening again (3-5 items)\n\n## Your Task\n\nWrite a complete RCA document that explains what happened and how to prevent it.',

  starter_code = '{"markdown": "# Root Cause Analysis: [Incident Title]\n\n## Incident Summary\n\n**Date**: \n**Duration**: \n**Severity**: [Critical/High/Medium]\n**Impact**: \n**Status**: Resolved\n\n## Timeline\n\n- **[Time]**: [Event description]\n- **[Time]**: \n- **[Time]**: \n\n## Root Cause\n\n### What Happened\n\n[Explain the technical issue that caused the incident]\n\n### Why It Happened\n\n[Explain why this issue occurred - was it a bug? Missing monitoring? etc.]\n\n## Resolution\n\n### Immediate Fix\n\n[What was done to resolve the incident immediately?]\n\n### Permanent Fix\n\n[What long-term fix was/will be implemented?]\n\n## Action Items\n\n- [ ] [Action item 1 - assign owner and deadline]\n- [ ] [Action item 2]\n- [ ] [Action item 3]\n\n## Lessons Learned\n\n[What did we learn? How do we prevent this in the future?]"}',

  test_cases = '[{
    "type": "ai_validation",
    "criteria": {
      "structure": {
        "weight": 25,
        "description": "Follows RCA format with all required sections"
      },
      "root_cause_analysis": {
        "weight": 35,
        "description": "Clearly identifies and explains the root cause"
      },
      "action_items": {
        "weight": 25,
        "description": "Provides specific, actionable prevention steps"
      },
      "clarity": {
        "weight": 15,
        "description": "Clear writing that non-technical stakeholders can understand"
      }
    }
  }]'

WHERE slug = 'office-rca';

-- ============================================================================
-- Challenge #3: Create Meeting Notes
-- ============================================================================

UPDATE challenges
SET
  description = E'## Challenge\n\nYou just attended a Sprint Planning meeting for an upcoming feature release. Now you need to document the meeting in structured notes for the team.\n\n## Meeting Context\n\n**Meeting**: Sprint Planning - Q1 2025 Feature Release\n**Attendees**: Engineering team (6 people), Product Manager, Designer\n**Duration**: 1.5 hours\n**Date**: January 15, 2025\n\n## Discussion Points\n\n1. **Feature Overview** - Product Manager presented the new "Team Collaboration" feature\n   - Goal: Allow users to create teams and share projects\n   - Target: Launch by end of Q1 (March 31)\n\n2. **Technical Architecture** - Team discussed implementation approach\n   - Use existing PostgreSQL database\n   - Add new tables: teams, team_members, team_invites\n   - Implement real-time updates with WebSockets\n   - Estimated: 3 weeks of work\n\n3. **Design Review** - Designer showed mockups\n   - Create Team modal\n   - Team dashboard\n   - Member management UI\n   - Some concerns about mobile responsiveness raised\n\n4. **Concerns Raised**\n   - Sarah: "Do we have capacity for this in Q1?"\n   - Mike: "WebSockets might be complex, consider polling first"\n   - Lisa: "Need to clarify permissions model"\n\n5. **Decisions Made**\n   - Start with polling, add WebSockets in Q2\n   - Sarah will create technical spec by Jan 20\n   - Mike will prototype team creation flow\n   - Review permissions model in Monday''s meeting\n\n## Requirements\n\nYour meeting notes must include:\n\n1. **Meeting Info** - Title, date, attendees\n2. **Objectives** - What was the meeting about?\n3. **Key Discussion Points** - Organized by topic\n4. **Decisions Made** - Clear decisions with context\n5. **Action Items** - Who does what by when\n6. **Open Questions** - Anything unresolved\n\n## Your Task\n\nCreate structured meeting notes that the team can reference later.',

  starter_code = '{"markdown": "# Meeting Notes: [Meeting Title]\n\n**Date**: \n**Time**: \n**Attendees**: \n**Note Taker**: \n\n## Objectives\n\n[What was the purpose of this meeting?]\n\n## Discussion Summary\n\n### Topic 1: [Topic Name]\n\n- [Discussion point]\n- [Discussion point]\n\n### Topic 2: [Topic Name]\n\n- [Discussion point]\n- [Discussion point]\n\n## Decisions Made\n\n- ✅ **Decision 1**: [What was decided and why]\n- ✅ **Decision 2**: \n\n## Action Items\n\n- [ ] **[Owner Name]**: [Action item] - Due: [Date]\n- [ ] **[Owner Name]**: [Action item] - Due: [Date]\n- [ ] **[Owner Name]**: [Action item] - Due: [Date]\n\n## Open Questions\n\n- ❓ [Unresolved question 1]\n- ❓ [Unresolved question 2]\n\n## Next Steps\n\n[What happens next? Follow-up meetings?]"}',

  test_cases = '[{
    "type": "ai_validation",
    "criteria": {
      "organization": {
        "weight": 30,
        "description": "Well-organized with clear sections and headings"
      },
      "completeness": {
        "weight": 30,
        "description": "Captures all key points, decisions, and action items"
      },
      "actionability": {
        "weight": 25,
        "description": "Action items are specific with owners and deadlines"
      },
      "clarity": {
        "weight": 15,
        "description": "Easy to scan and find information quickly"
      }
    }
  }]'

WHERE slug = 'office-meeting-notes';

-- ============================================================================
-- Challenge #4: Write Incident Communication
-- ============================================================================

UPDATE challenges
SET
  description = E'## Challenge\n\nYour SaaS platform just experienced a 2-hour outage. Now you need to write a stakeholder communication email to explain what happened.\n\n## Incident Details\n\n**What Happened**: Database server crashed, causing complete service outage\n**Duration**: 2 hours (1:00 PM - 3:00 PM EST)\n**Impact**: \n  - 100% of users unable to access the platform\n  - No data lost\n  - All data backups are safe\n  - Service now fully restored\n\n**Cause**: Database server ran out of disk space due to unexpected log growth\n\n**Resolution**: \n  - Increased disk space\n  - Implemented log rotation\n  - Added disk space monitoring alerts\n  - Service restored at 3:00 PM EST\n\n**Prevention**: \n  - Added proactive disk monitoring\n  - Scheduled automatic log cleanup\n  - Increased disk space by 50%\n\n## Audience\n\nThis email goes to:\n- Paying customers\n- Free tier users\n- Stakeholders\n- Non-technical audience\n\n## Requirements\n\nYour communication must:\n\n1. **Acknowledge the issue** - Be transparent and apologetic\n2. **Explain what happened** - In simple terms (no jargon)\n3. **State the impact** - Who was affected and how\n4. **Explain the resolution** - What we did to fix it\n5. **Outline prevention** - How we''re preventing it in the future\n6. **Professional tone** - Empathetic, clear, accountable\n\n## Tone Guidelines\n\n✅ **Do**:\n- Be honest and transparent\n- Acknowledge the inconvenience\n- Use simple language\n- Take accountability\n- Explain preventive measures\n\n❌ **Don''t**:\n- Make excuses\n- Use technical jargon\n- Blame others\n- Minimize the impact\n- Be defensive\n\n## Your Task\n\nWrite a professional stakeholder communication email about this incident.',

  starter_code = '{"markdown": "**Subject**: [Clear subject line about the incident]\n\n---\n\nDear [Customers/Users],\n\n[Opening paragraph: Acknowledge the issue and apologize]\n\n## What Happened\n\n[Explain the issue in simple terms - avoid technical jargon]\n\n## Impact\n\n[Who was affected? For how long? What couldn''t they do?]\n\n## Resolution\n\n[What did we do to fix it? When was service restored?]\n\n## What We''re Doing to Prevent This\n\n[List concrete steps to prevent this from happening again]\n\n- [Prevention measure 1]\n- [Prevention measure 2]\n- [Prevention measure 3]\n\n## Moving Forward\n\n[Reassure users, invite feedback, provide support contact]\n\nIf you have any questions or concerns, please don''t hesitate to reach out to our support team at [contact info].\n\nThank you for your patience and understanding.\n\nSincerely,\n[Your name]\n[Your title]\n[Company name]"}',

  test_cases = '[{
    "type": "ai_validation",
    "criteria": {
      "transparency": {
        "weight": 30,
        "description": "Honest and clear about what happened"
      },
      "tone": {
        "weight": 25,
        "description": "Professional, empathetic, and accountable"
      },
      "clarity": {
        "weight": 25,
        "description": "Easy to understand for non-technical audience"
      },
      "completeness": {
        "weight": 20,
        "description": "Covers all required elements (what, impact, resolution, prevention)"
      }
    }
  }]'

WHERE slug = 'office-incident-comm';

-- ============================================================================
-- Challenge #5: Resolve Git Merge Conflict
-- ============================================================================

UPDATE challenges
SET
  description = E'## Challenge\n\nYou''re trying to merge your feature branch into main, but you have a merge conflict! Two developers modified the same file.\n\n## The Scenario\n\n**Your branch**: `feature/user-profile-page`\n**Target branch**: `main`\n**Conflicting file**: `components/UserProfile.tsx`\n\n## What Happened\n\n- You added a "Bio" section to the user profile\n- Another developer (on main) added an "Activity Feed" section\n- Both modified the same file at similar locations\n- Git can''t automatically merge them\n\n## The Conflict\n\n```javascript\nfunction UserProfile({ user }) {\n  return (\n    <div>\n      <h1>{user.name}</h1>\n      <p>{user.email}</p>\n      \n<<<<<<< HEAD (your changes)\n      <div className=\"bio-section\">\n        <h2>Bio</h2>\n        <p>{user.bio || ''No bio yet''}</p>\n      </div>\n=======\n      <div className=\"activity-feed\">\n        <h2>Recent Activity</h2>\n        <ActivityList userId={user.id} />\n      </div>\n>>>>>>> main\n      \n      <div className=\"user-stats\">\n        <p>Joined: {user.joinedDate}</p>\n      </div>\n    </div>\n  );\n}\n```\n\n## Requirements\n\n1. **Resolve the conflict** - Keep BOTH features (Bio AND Activity Feed)\n2. **Maintain code quality** - Proper ordering, formatting, and structure\n3. **Test the result** - Ensure both features work\n4. **Logical ordering** - Put sections in a sensible order\n\n## Expected Result\n\nThe resolved component should have:\n1. User header (name, email)\n2. Bio section\n3. Activity Feed section\n4. User stats\n\n## Your Task\n\nProvide the resolved code with both features properly integrated.',

  starter_code = '{"javascript": "function UserProfile({ user }) {\n  return (\n    <div>\n      <h1>{user.name}</h1>\n      <p>{user.email}</p>\n      \n      {/* TODO: Resolve the conflict below */}\n      {/* Keep BOTH the Bio section AND the Activity Feed */}\n      {/* Remove the conflict markers (<<<<<<, =======, >>>>>>>) */}\n      \n<<<<<<< HEAD (your changes)\n      <div className=\"bio-section\">\n        <h2>Bio</h2>\n        <p>{user.bio || ''No bio yet''}</p>\n      </div>\n=======\n      <div className=\"activity-feed\">\n        <h2>Recent Activity</h2>\n        <ActivityList userId={user.id} />\n      </div>\n>>>>>>> main\n      \n      <div className=\"user-stats\">\n        <p>Joined: {user.joinedDate}</p>\n      </div>\n    </div>\n  );\n}"}',

  test_cases = '[{
    "type": "ai_validation",
    "criteria": {
      "conflict_resolution": {
        "weight": 40,
        "description": "Successfully merges both features without losing functionality"
      },
      "code_quality": {
        "weight": 30,
        "description": "Clean code with proper formatting and structure"
      },
      "completeness": {
        "weight": 20,
        "description": "Removes all conflict markers and maintains all features"
      },
      "logical_ordering": {
        "weight": 10,
        "description": "Sections are in a logical, user-friendly order"
      }
    }
  }]'

WHERE slug = 'office-merge-conflict';

-- Continue in next part due to length...
