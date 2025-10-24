# QodeBench Database Migrations

## How to Execute the Initial Schema Migration

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `001_initial_schema.sql`
5. Paste into the SQL editor
6. Click **Run** to execute the migration

### Option 2: Using Supabase CLI

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Initialize Supabase in your project (if not already done)
supabase init

# Link to your remote project
supabase link --project-ref your-project-ref

# Push the migration
supabase db push
```

## What's Included

### Tables Created (7 total)

1. **profiles** - User profiles extending auth.users
2. **challenges** - Coding challenges with test cases
3. **submissions** - User code submissions with results
4. **leaderboard_entries** - Global, weekly, and monthly rankings
5. **mock_interviews** - AI-powered interview sessions
6. **roadmap_progress** - User learning path tracking
7. **weekly_challenge_participants** - Weekly challenge rankings

### Indexes (21 total)

Performance indexes on:
- User lookups (username, experience_level)
- Submission queries (user_id, challenge_id, status)
- Challenge filtering (category, difficulty, slug)
- Leaderboard sorting (points DESC)
- Weekly challenge queries

### Row Level Security (RLS)

All tables have RLS enabled with policies for:
- **Public read**: challenges (active), leaderboard, profiles, weekly participants
- **User-scoped read**: submissions, mock_interviews, roadmap_progress (own data only)
- **User-scoped write**: All tables (users can only insert/update their own data)

### Functions & Triggers

#### Automatic Triggers
- `update_user_points()` - Fires after submission insert if passed
  - Updates profile points and stats
  - Updates leaderboard entries
  - Updates roadmap progress
  - Updates weekly challenge best scores

- `handle_new_user()` - Fires after auth.users insert
  - Automatically creates profile for new users

- `update_updated_at_column()` - Fires before update
  - Auto-updates updated_at timestamps

#### Manual Functions
- `update_leaderboard()` - Recalculate all ranks
- `reset_weekly_points()` - Reset weekly leaderboard
- `reset_monthly_points()` - Reset monthly leaderboard
- `update_user_streak()` - Update user streaks

## Post-Migration Setup

### 1. Enable pg_cron Extension

In Supabase Dashboard → Database → Extensions:
- Enable `pg_cron` extension

### 2. Schedule Automated Jobs

Run these commands in SQL Editor after enabling pg_cron:

```sql
-- Reset weekly points every Monday at midnight UTC
SELECT cron.schedule(
    'reset-weekly-points',
    '0 0 * * 1',
    $$ SELECT reset_weekly_points(); $$
);

-- Reset monthly points on 1st of each month at midnight UTC
SELECT cron.schedule(
    'reset-monthly-points',
    '0 0 1 * *',
    $$ SELECT reset_monthly_points(); $$
);

-- Update leaderboard ranks every 30 minutes
SELECT cron.schedule(
    'update-leaderboard-ranks',
    '*/30 * * * *',
    $$ SELECT update_leaderboard(); $$
);

-- Update user streaks daily at 1 AM UTC
SELECT cron.schedule(
    'update-user-streaks',
    '0 1 * * *',
    $$ SELECT update_user_streak(); $$
);
```

### 3. Verify Installation

Run these queries to verify everything is set up:

```sql
-- Check all tables exist
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;

-- Check RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- Check indexes
SELECT indexname, tablename FROM pg_indexes WHERE schemaname = 'public';

-- Check scheduled jobs (if pg_cron enabled)
SELECT * FROM cron.job;
```

## TypeScript Types

After running the migration, generate TypeScript types:

```bash
# Generate types from database schema
npx supabase gen types typescript --linked > lib/supabase/database.types.ts
```

## Seed Data (Optional)

To add sample challenges and test data, create a new file `002_seed_data.sql` with:

```sql
-- Example challenge
INSERT INTO challenges (
    title,
    slug,
    description,
    difficulty,
    category,
    points,
    starter_code,
    test_cases,
    hints,
    solution_explanation,
    learning_objectives,
    estimated_time
) VALUES (
    'Two Sum',
    'two-sum',
    'Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.',
    'easy',
    'javascript',
    100,
    '{"javascript": "function twoSum(nums, target) {\n  // Your code here\n}"}',
    '[{"input": {"nums": [2,7,11,15], "target": 9}, "expected": [0,1]}]',
    '["Consider using a hash map for O(n) solution"]',
    'Use a hash map to store numbers and their indices as you iterate.',
    ARRAY['Hash maps', 'Array manipulation', 'Time complexity'],
    15
);
```

## Troubleshooting

### Issue: "permission denied for schema public"
**Solution**: Run the GRANT commands at the end of the migration

### Issue: "function uuid_generate_v4() does not exist"
**Solution**: Ensure `uuid-ossp` extension is enabled

### Issue: "relation auth.users does not exist"
**Solution**: Supabase automatically creates auth schema - verify you're using Supabase

### Issue: RLS preventing access
**Solution**: Verify user is authenticated with `auth.uid()` in policies

## Next Steps

1. ✅ Execute the migration
2. ✅ Enable pg_cron extension
3. ✅ Schedule automated jobs
4. ✅ Generate TypeScript types
5. ✅ Add seed data (optional)
6. ✅ Test authentication flow
7. ✅ Test submission workflow

## Support

For issues with this migration:
- Check Supabase logs in Dashboard → Logs
- Review RLS policies if access denied
- Ensure environment variables are set correctly
- Verify auth user exists before testing
