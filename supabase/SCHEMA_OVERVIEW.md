# QodeBench Database Schema Overview

Complete database schema for the QodeBench platform - a coding practice platform with AI-powered interviews and challenges.

## 📋 Quick Start

1. **Execute the schema**: Copy `migrations/001_initial_schema.sql` into Supabase SQL Editor and run
2. **Load seed data**: Run `migrations/002_seed_data.sql` for sample challenges (optional)
3. **Verify setup**: Run `migrations/verify_setup.sql` to check everything is configured
4. **Generate types**: Run `npx supabase gen types typescript --linked > lib/supabase/database.types.ts`

## 📊 Database Tables (7 Total)

### 1. **profiles** - User Profiles
Extends `auth.users` with QodeBench-specific user data.

**Key Fields:**
- `username` - Unique username
- `experience_level` - 'intern' | 'junior' | 'mid' | 'senior'
- `total_points`, `weekly_points` - Gamification scores
- `current_streak`, `longest_streak` - Daily activity tracking
- `challenges_completed` - Total solved challenges

**Use Cases:**
- User profiles and settings
- Leaderboard display
- Progress tracking

---

### 2. **challenges** - Coding Challenges
Contains all coding challenges with test cases and metadata.

**Key Fields:**
- `slug` - URL-friendly identifier (unique)
- `difficulty` - 'easy' | 'medium' | 'hard'
- `category` - 'office' | 'python' | 'javascript' | 'react' | 'nextjs' | 'nodejs'
- `starter_code` - JSONB with code templates per language
- `test_cases` - JSONB array of test objects
- `hints` - JSONB array of hint strings
- `is_weekly_challenge` - Flag for weekly competitions
- `points` - Points awarded for completion

**Use Cases:**
- Challenge listing and filtering
- Challenge details page
- Code editor initialization
- Weekly challenge system

---

### 3. **submissions** - Code Submissions
Tracks all user code submissions with test results and AI feedback.

**Key Fields:**
- `code` - User's submitted code
- `status` - 'pending' | 'passed' | 'failed' | 'error'
- `ai_feedback` - AI-generated code review
- `score` - 0-100 quality score
- `passed_tests`, `total_tests` - Test execution results
- `points_earned` - Points awarded (0 if failed)

**Use Cases:**
- Submission history
- Test execution tracking
- AI feedback display
- Points calculation

**Important:** The `update_user_points()` trigger automatically updates points, leaderboard, and progress when status = 'passed'

---

### 4. **leaderboard_entries** - Rankings
Global, weekly, and monthly leaderboard data.

**Key Fields:**
- `total_points`, `weekly_points`, `monthly_points` - Score tracking
- `global_rank`, `weekly_rank` - Calculated rankings
- `last_submission_at` - Tiebreaker timestamp

**Use Cases:**
- Global leaderboard
- Weekly competitions
- User ranking display

**Important:** Rankings are recalculated by scheduled job every 30 minutes

---

### 5. **mock_interviews** - AI Interview Sessions
Stores AI-powered mock interview sessions with transcripts and evaluations.

**Key Fields:**
- `interview_type` - 'behavioral' | 'technical' | 'system_design'
- `difficulty` - 'junior' | 'mid' | 'senior'
- `transcript` - JSONB array of messages
- `ai_evaluation` - JSONB with scores and feedback
- `overall_score` - 0-100 interview performance

**Use Cases:**
- Interview practice feature
- Interview history
- Performance analytics

---

### 6. **roadmap_progress** - Learning Path Tracking
Tracks user progress through challenges (personalized learning roadmap).

**Key Fields:**
- `status` - 'not_started' | 'in_progress' | 'completed'
- `attempts` - Number of submission attempts
- `started_at`, `completed_at` - Time tracking

**Use Cases:**
- Personal dashboard
- Progress visualization
- Recommended next challenges

**Important:** Automatically updated by submission trigger

---

### 7. **weekly_challenge_participants** - Weekly Competition
Tracks participation in weekly challenges with rankings.

**Key Fields:**
- `week_start_date` - Week identifier (Monday)
- `best_score` - Best submission score for the week
- `rank` - Position in weekly competition

**Use Cases:**
- Weekly challenge leaderboard
- Competition tracking
- Prize distribution

---

## 🔒 Security (Row Level Security)

All tables have RLS enabled with appropriate policies:

### Public Read Access
- ✅ `challenges` (active challenges only)
- ✅ `leaderboard_entries` (all)
- ✅ `profiles` (all)
- ✅ `weekly_challenge_participants` (all)

### User-Scoped Access
- 🔒 `submissions` - Users can only see their own
- 🔒 `mock_interviews` - Users can only see their own
- 🔒 `roadmap_progress` - Users can only see their own

### Write Access
- ✏️ Users can insert/update their own data
- ✏️ Challenge creators can manage their challenges
- ✏️ System (service role) can update leaderboard

---

## ⚡ Performance Optimizations

### 21+ Indexes Created
- User lookups (username, experience_level)
- Submission queries (user_id + challenge_id composite)
- Challenge filtering (category, difficulty)
- Leaderboard sorting (points DESC)
- Weekly challenge queries (date + rank)
- Foreign key indexes (automatic)

### Optimized Queries
- Composite indexes for common join patterns
- Partial indexes for filtered queries
- B-tree indexes for range queries

---

## 🤖 Automated Functions & Triggers

### Automatic Triggers

#### 1. `update_user_points()` ⚡ CRITICAL
**Fires:** After `submissions` INSERT when status = 'passed'

**Actions:**
1. Updates `profiles` (total_points, weekly_points, challenges_completed)
2. Upserts `leaderboard_entries` (adds points, updates timestamp)
3. Upserts `roadmap_progress` (marks as completed)
4. Updates `weekly_challenge_participants` (if applicable)

**Usage:** Automatic - just insert submission with status='passed'

#### 2. `handle_new_user()`
**Fires:** After `auth.users` INSERT

**Actions:**
- Creates profile automatically on user signup
- Extracts username from email or metadata

**Usage:** Automatic on user registration

#### 3. `update_updated_at_column()`
**Fires:** Before UPDATE on profiles, challenges, leaderboard_entries

**Actions:**
- Updates `updated_at` timestamp

**Usage:** Automatic on any update

---

### Manual Functions (Call via RPC)

#### `update_leaderboard()`
Recalculates all global, weekly, and weekly challenge ranks.

```typescript
await supabase.rpc('update_leaderboard');
```

**Scheduled:** Every 30 minutes via pg_cron

---

#### `reset_weekly_points()`
Resets weekly points for all users.

```typescript
await supabase.rpc('reset_weekly_points');
```

**Scheduled:** Every Monday at midnight UTC

---

#### `reset_monthly_points()`
Resets monthly points for all users.

```typescript
await supabase.rpc('reset_monthly_points');
```

**Scheduled:** 1st of each month at midnight UTC

---

#### `update_user_streak()`
Calculates and updates user streaks based on daily activity.

```typescript
await supabase.rpc('update_user_streak');
```

**Scheduled:** Every day at 1 AM UTC

---

## 🕐 Scheduled Jobs (pg_cron)

After enabling pg_cron extension, schedule these jobs:

| Job | Schedule | Function | Purpose |
|-----|----------|----------|---------|
| reset-weekly-points | Mon 00:00 UTC | `reset_weekly_points()` | Weekly leaderboard reset |
| reset-monthly-points | 1st 00:00 UTC | `reset_monthly_points()` | Monthly leaderboard reset |
| update-leaderboard-ranks | */30 * * * * | `update_leaderboard()` | Recalculate rankings |
| update-user-streaks | Daily 01:00 UTC | `update_user_streak()` | Update activity streaks |

See `migrations/README.md` for setup commands.

---

## 📝 Sample Data

`migrations/002_seed_data.sql` includes 8 sample challenges:

1. **Two Sum** (JavaScript, Easy, 100 pts)
2. **Palindrome Checker** (JavaScript, Easy, 100 pts)
3. **Debounce Function** (JavaScript, Medium, 200 pts) - Weekly Challenge
4. **Custom useLocalStorage Hook** (React, Medium, 250 pts)
5. **Valid Anagram** (Python, Easy, 100 pts)
6. **Rate Limiter Middleware** (Node.js, Medium, 250 pts)
7. **Dynamic Route Handler with Validation** (Next.js, Medium, 250 pts)

All challenges include:
- Starter code
- Test cases
- Hints
- Solution explanations
- Learning objectives

---

## 🎯 Common Workflows

### 1. User Signs Up
```
auth.users INSERT
  ↓
handle_new_user() trigger
  ↓
profiles INSERT (automatic)
```

### 2. User Submits Code
```typescript
// 1. Insert submission with status='pending'
const { data: submission } = await supabase
  .from('submissions')
  .insert({ user_id, challenge_id, code, status: 'pending', ... });

// 2. Run tests (your code execution service)
const results = await runTests(code, testCases);

// 3. Update submission with results
await supabase
  .from('submissions')
  .update({
    status: results.passed ? 'passed' : 'failed',
    passed_tests: results.passed,
    total_tests: results.total,
    points_earned: results.passed ? challenge.points : 0,
    ai_feedback: results.feedback
  })
  .eq('id', submission.id);

// update_user_points() trigger handles the rest automatically! 🎉
```

### 3. Weekly Leaderboard Reset
```
Monday 00:00 UTC
  ↓
reset_weekly_points() (scheduled)
  ↓
All weekly_points → 0
  ↓
update_leaderboard() (scheduled)
  ↓
Weekly ranks recalculated
```

---

## 📦 Files Included

```
qodebench/
├── supabase/
│   ├── migrations/
│   │   ├── README.md                  # Setup instructions
│   │   ├── 001_initial_schema.sql     # Complete schema (EXECUTE FIRST)
│   │   ├── 002_seed_data.sql          # Sample challenges (optional)
│   │   └── verify_setup.sql           # Verification script
│   ├── DATABASE_OPERATIONS.md         # Query examples & reference
│   └── SCHEMA_OVERVIEW.md             # This file
└── lib/
    └── supabase/
        └── database.types.ts          # TypeScript types
```

---

## ✅ Setup Checklist

- [ ] Execute `001_initial_schema.sql` in Supabase SQL Editor
- [ ] Run `verify_setup.sql` to check all tables/functions/triggers
- [ ] Execute `002_seed_data.sql` for sample data (optional)
- [ ] Enable `pg_cron` extension in Supabase Dashboard
- [ ] Schedule automated jobs (see README.md)
- [ ] Generate TypeScript types: `npx supabase gen types typescript --linked`
- [ ] Update `.env.local` with Supabase credentials
- [ ] Test authentication flow
- [ ] Test submission workflow
- [ ] Verify trigger automation works

---

## 🔗 Foreign Key Relationships

```
auth.users (Supabase Auth)
  ↓
profiles (1:1)
  ↓
├── challenges (1:many) - created_by
├── submissions (1:many) - user_id
├── leaderboard_entries (1:1) - user_id
├── mock_interviews (1:many) - user_id
├── roadmap_progress (1:many) - user_id
└── weekly_challenge_participants (1:many) - user_id

challenges
  ↓
├── submissions (1:many) - challenge_id
├── roadmap_progress (1:many) - challenge_id
└── weekly_challenge_participants (1:many) - challenge_id

submissions
  ↓
weekly_challenge_participants (1:1) - best_submission_id
```

---

## 🐛 Troubleshooting

### Issue: "permission denied for schema public"
**Fix:** Run GRANT commands at end of `001_initial_schema.sql`

### Issue: "function uuid_generate_v4() does not exist"
**Fix:** Ensure `uuid-ossp` extension is enabled

### Issue: Points not updating after submission
**Fix:** Check that submission status = 'passed' (trigger only fires on passed)

### Issue: Weekly points not resetting
**Fix:** Enable `pg_cron` and schedule `reset_weekly_points()` job

### Issue: RLS blocking queries
**Fix:** Ensure `auth.uid()` returns valid user ID (check authentication)

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Operations Reference](./DATABASE_OPERATIONS.md)

---

## 🎓 Architecture Decisions

### Why Separate Leaderboard Table?
- Optimized for read-heavy queries
- Pre-calculated ranks for performance
- Separate weekly/monthly tracking
- Allows for historical snapshots

### Why Triggers for Point Updates?
- Ensures data consistency
- Atomic operations
- Reduces client-side complexity
- Prevents points manipulation

### Why JSONB for Test Cases?
- Flexible schema for different test types
- Easy to add new test properties
- Efficient indexing and querying
- Supports complex input/output structures

### Why Weekly Challenge Participants Table?
- Separate from general leaderboard
- Historical tracking of weekly competitions
- Supports prize distribution
- Allows for multiple simultaneous competitions

---

**Created:** 2025-01-XX
**Version:** 1.0.0
**Author:** QodeBench Team
**License:** MIT
