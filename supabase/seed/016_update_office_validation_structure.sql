-- =====================================================
-- Update Office Fundamentals Challenges with Hybrid Validation
-- =====================================================
-- This script updates existing Office Fundamentals challenges to use
-- the new hybrid validation structure with structure + AI quality checks

-- =====================================================
-- 1. UPDATE PR DESCRIPTION GENERATOR (Document Challenge)
-- =====================================================
UPDATE challenges
SET
  test_cases = '[
    {
      "type": "hybrid_validation",
      "structure_validation": {
        "weight": 50,
        "required_sections": [
          "## Summary",
          "## Changes Made",
          "## Testing"
        ],
        "min_length": 200,
        "format_checks": [
          "has_headings",
          "has_bullet_points",
          "proper_markdown"
        ]
      },
      "ai_quality_check": {
        "weight": 50,
        "criteria": {
          "clarity": {
            "weight": 30,
            "description": "Clear and concise communication"
          },
          "completeness": {
            "weight": 40,
            "description": "All important details covered including what, why, and how"
          },
          "professionalism": {
            "weight": 30,
            "description": "Professional tone and well-structured format"
          }
        }
      }
    }
  ]'::jsonb,
  starter_code = '{
    "markdown": "## Summary\\n\\nBriefly describe what this PR does and why.\\n\\n## Changes Made\\n\\n- Change 1\\n- Change 2\\n\\n## Testing\\n\\nHow was this tested?\\n\\n## Related Issues\\n\\nFixes #",
    "javascript": "function generatePRDescription(data) {\\n  // data = { title, type, changes, issueNumbers, hasUIChanges, testsAdded }\\n  // Return markdown-formatted PR description string\\n  \\n  return `## Summary\\n\\nTODO: Add description`;\\n}"
  }'::jsonb
WHERE slug = 'pr-description-generator';

-- =====================================================
-- 2. UPDATE ROOT CAUSE ANALYSIS VALIDATOR (Document Challenge)
-- =====================================================
UPDATE challenges
SET
  test_cases = '[
    {
      "type": "hybrid_validation",
      "structure_validation": {
        "weight": 50,
        "required_sections": [
          "## Incident Summary",
          "## Root Cause",
          "## Action Items"
        ],
        "min_length": 300,
        "format_checks": [
          "has_headings",
          "has_bullet_points",
          "proper_markdown"
        ]
      },
      "ai_quality_check": {
        "weight": 50,
        "criteria": {
          "analysis_depth": {
            "weight": 35,
            "description": "Thorough root cause analysis using proper methods (5 Whys, Fishbone, etc.)"
          },
          "actionability": {
            "weight": 35,
            "description": "Clear, specific, and actionable remediation steps"
          },
          "clarity": {
            "weight": 30,
            "description": "Clear communication of timeline, impact, and learnings"
          }
        }
      }
    }
  ]'::jsonb,
  starter_code = '{
    "markdown": "## Incident Summary\\n\\n**Date:** YYYY-MM-DD\\n**Duration:** \\n**Impact:** \\n\\n## Timeline\\n\\n- Time 1: Event\\n- Time 2: Event\\n\\n## Root Cause\\n\\n### 5 Whys Analysis\\n\\n1. Why did X happen?\\n2. Why did that cause Y?\\n\\n## Action Items\\n\\n- [ ] Action 1\\n- [ ] Action 2",
    "javascript": "function validateRCA(document) {\\n  // Validate RCA document completeness\\n  return {\\n    complete: false,\\n    missingFields: [],\\n    score: 0\\n  };\\n}"
  }'::jsonb
WHERE slug = 'rca-document-validator';

-- =====================================================
-- 3. UPDATE MEETING NOTES STRUCTURER (Document Challenge)
-- =====================================================
UPDATE challenges
SET
  test_cases = '[
    {
      "type": "hybrid_validation",
      "structure_validation": {
        "weight": 50,
        "required_sections": [
          "## Meeting Info",
          "## Attendees",
          "## Discussion Points",
          "## Action Items"
        ],
        "min_length": 200,
        "format_checks": [
          "has_headings",
          "has_bullet_points"
        ]
      },
      "ai_quality_check": {
        "weight": 50,
        "criteria": {
          "organization": {
            "weight": 35,
            "description": "Well-organized with clear sections and flow"
          },
          "completeness": {
            "weight": 35,
            "description": "Captures all key discussion points and decisions"
          },
          "actionability": {
            "weight": 30,
            "description": "Clear action items with owners and deadlines"
          }
        }
      }
    }
  ]'::jsonb,
  starter_code = '{
    "markdown": "## Meeting Info\\n\\n**Date:** \\n**Time:** \\n**Type:** \\n\\n## Attendees\\n\\n- Person 1\\n- Person 2\\n\\n## Discussion Points\\n\\n### Topic 1\\n\\n- Point 1\\n- Point 2\\n\\n## Decisions Made\\n\\n- Decision 1\\n\\n## Action Items\\n\\n- [ ] Task 1 (@owner, due date)\\n- [ ] Task 2 (@owner, due date)",
    "javascript": "function structureMeetingNotes(notes) {\\n  // Structure meeting notes\\n  return {\\n    structured: false,\\n    sections: []\\n  };\\n}"
  }'::jsonb
WHERE slug = 'meeting-notes-parser';

-- =====================================================
-- 4. UPDATE INCIDENT COMMUNICATION GENERATOR (Document Challenge)
-- =====================================================
UPDATE challenges
SET
  test_cases = '[
    {
      "type": "hybrid_validation",
      "structure_validation": {
        "weight": 50,
        "required_sections": [
          "## Incident Status",
          "## Impact",
          "## Next Steps"
        ],
        "min_length": 150,
        "format_checks": [
          "has_headings",
          "has_bullet_points"
        ]
      },
      "ai_quality_check": {
        "weight": 50,
        "criteria": {
          "clarity": {
            "weight": 35,
            "description": "Clear, jargon-free communication for stakeholders"
          },
          "transparency": {
            "weight": 30,
            "description": "Honest about status, impact, and timeline"
          },
          "professionalism": {
            "weight": 35,
            "description": "Professional, calm tone appropriate for incidents"
          }
        }
      }
    }
  ]'::jsonb,
  starter_code = '{
    "markdown": "## Incident Status\\n\\n**Status:** [Investigating/Identified/Monitoring/Resolved]\\n**Started:** \\n**Last Update:** \\n\\n## Impact\\n\\n- Affected services:\\n- Number of users affected:\\n- Severity:\\n\\n## What Happened\\n\\nBrief description...\\n\\n## Current Actions\\n\\n- Action 1\\n- Action 2\\n\\n## Next Steps\\n\\n- Expected resolution time:\\n- Next update:",
    "javascript": "function generateIncidentComm(data) {\\n  // Generate incident communication\\n  return `## Incident Status\\n\\nTODO`;\\n}"
  }'::jsonb
WHERE slug = 'incident-communication-generator';

-- =====================================================
-- 5. UPDATE GIT COMMIT MESSAGE VALIDATOR (Code Challenge - Hybrid)
-- =====================================================
UPDATE challenges
SET
  test_cases = '[
    {
      "type": "hybrid_validation",
      "test_cases": [
        {
          "input": "feat: add user authentication",
          "expected": { "valid": true, "errors": [] },
          "weight": 15
        },
        {
          "input": "fix(api): resolve null pointer exception",
          "expected": { "valid": true, "errors": [] },
          "weight": 15
        },
        {
          "input": "added new feature",
          "expected": { "valid": false },
          "weight": 10
        },
        {
          "input": "feat: Add Feature.",
          "expected": { "valid": false },
          "weight": 10
        }
      ],
      "ai_quality_check": {
        "weight": 50,
        "criteria": {
          "correctness": {
            "weight": 30,
            "description": "Validates conventional commit format correctly"
          },
          "code_quality": {
            "weight": 35,
            "description": "Clean, maintainable code with proper error handling"
          },
          "completeness": {
            "weight": 35,
            "description": "Handles all edge cases and returns descriptive errors"
          }
        }
      }
    }
  ]'::jsonb
WHERE slug = 'git-commit-message-validator';

-- =====================================================
-- Verify the updates
-- =====================================================
SELECT
  title,
  slug,
  challenge_type,
  response_format,
  validation_type,
  jsonb_pretty(test_cases) as validation_structure
FROM challenges
WHERE slug IN (
  'pr-description-generator',
  'rca-document-validator',
  'meeting-notes-parser',
  'incident-communication-generator',
  'git-commit-message-validator'
)
ORDER BY challenge_type, title;
