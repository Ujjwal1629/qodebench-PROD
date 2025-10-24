# Migration Guide: Updating to New Database Schema

## What Changed?

Your application code has been updated from the simple `user_profiles` table to the comprehensive `profiles` table with full QodeBench features.

### Old Schema (user_profiles)
- ❌ Simple table with just username and experience_level
- ❌ No points, challenges, or gamification
- ❌ No leaderboard support

### New Schema (profiles)
- ✅ Comprehensive user profiles with stats
- ✅ Points system (total_points, weekly_points)
- ✅ Streak tracking
- ✅ Challenges completed counter
- ✅ Full support for leaderboard, submissions, mock interviews
- ✅ 6 additional tables for complete functionality

## Files Updated

✅ **lib/auth/index.ts** - Now uses `profiles` table instead of `user_profiles`
✅ **types/supabase.ts** - Updated with comprehensive database types
✅ **Removed** - Old `001_create_user_profiles.sql` migration

## Required Actions

### 1. Drop Old Schema (If Exists)

If you already ran the old migration, drop it first:

```sql
-- Run this in Supabase SQL Editor
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TYPE IF EXISTS experience_level CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
```

### 2. Execute New Schema

Run the complete new schema in Supabase SQL Editor:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/oyxolzcwymcvmjzqonmf/sql)
2. Click **SQL Editor** → **New Query**
3. Copy contents of `supabase/migrations/001_initial_schema.sql`
4. Paste and click **Run**

### 3. Verify Setup

Run verification script to ensure everything is set up correctly:

```sql
-- Copy contents of supabase/migrations/verify_setup.sql and run
```

### 4. Load Sample Data (Optional)

To get started with sample challenges:

```sql
-- Copy contents of supabase/migrations/002_seed_data.sql and run
```

### 5. Update Experience Level Values

**IMPORTANT:** The experience level values changed:
- ❌ Old: `'Intern' | 'Junior' | 'Mid-Level' | 'Senior'`
- ✅ New: `'intern' | 'junior' | 'mid' | 'senior'`

If you have existing signup forms, update them to use lowercase values.

### 6. Test Authentication

Try signing up a new user to test the flow:
1. Go to `/signup` in your app
2. Create a test account
3. Verify profile is created automatically via trigger
4. Check that username availability check works

## Breaking Changes

### 1. Experience Level Values
```typescript
// Old
const level: ExperienceLevel = 'Junior';

// New
const level: ExperienceLevel = 'junior';
```

### 2. Table Name
```typescript
// Old
await supabase.from('user_profiles').select('*');

// New
await supabase.from('profiles').select('*');
```

### 3. Additional Profile Fields
The profile now includes many more fields:
```typescript
interface Profile {
  // Old fields
  id: string;
  username: string;
  experience_level: ExperienceLevel;
  created_at: string;
  updated_at: string;

  // New fields
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  total_points: number;
  weekly_points: number;
  current_streak: number;
  longest_streak: number;
  challenges_completed: number;
}
```

## New Features Available

After migration, you'll have access to:

1. **Challenges System** - Browse and solve coding challenges
2. **Submissions** - Track code submissions with AI feedback
3. **Leaderboard** - Global, weekly, and monthly rankings
4. **Mock Interviews** - AI-powered interview practice
5. **Learning Roadmap** - Track progress through challenges
6. **Weekly Competitions** - Compete in weekly challenges
7. **Gamification** - Points, streaks, and achievements

## Database Operations Reference

See `supabase/DATABASE_OPERATIONS.md` for:
- Query examples for all tables
- Common operations
- Real-time subscriptions
- Performance tips

## Troubleshooting

### Error: "relation user_profiles does not exist"
**Solution:** Code has been updated to use `profiles`. Make sure you restart your dev server.

### Error: "invalid input value for enum experience_level"
**Solution:** Update your forms to use lowercase values: `'intern' | 'junior' | 'mid' | 'senior'`

### Error: 500 on signup
**Solution:** Execute the new schema migration in Supabase Dashboard first. The `handle_new_user()` trigger needs the `profiles` table to exist.

### Error: 406 on API calls
**Solution:** This was caused by the table name mismatch. It's now fixed. Restart your dev server to pick up the changes.

## Next Steps

1. ✅ Execute new schema migration in Supabase
2. ✅ Restart your dev server: `npm run dev`
3. ✅ Test signup/signin flow
4. ✅ Start building challenge features!

## Need Help?

- Review schema details: `supabase/SCHEMA_OVERVIEW.md`
- Check database operations: `supabase/DATABASE_OPERATIONS.md`
- Setup instructions: `supabase/migrations/README.md`

---

**Migration completed!** Your application is now ready for the full QodeBench feature set. 🎉
