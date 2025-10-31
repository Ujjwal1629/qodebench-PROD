# Troubleshooting: Only 5 Backend Lessons Showing

## Quick Fix

The seed file is very large. If only 5 lessons appeared, lessons 6-14 weren't inserted.

### Option 1: Run the supplemental file (EASIEST)

```bash
cd /Users/hunnychahar/Desktop/qodebench

# Run just lessons 6-14
psql YOUR_DATABASE_CONNECTION_STRING -f supabase/seed/016_backend_lessons_6_14.sql
```

Or in Supabase SQL Editor, run the contents of: `supabase/seed/016_backend_lessons_6_14.sql`

### Option 2: Verify what's in database

Run this query in Supabase SQL Editor:

```sql
SELECT 
    order_index,
    LEFT(title, 50) as title
FROM ai_learning_lessons 
WHERE learning_path_id = 'f5e4d3c2-b1a0-9876-5432-10fedcba9876'
ORDER BY order_index;
```

Expected: 14 rows (order_index 1-14)
If you see only 5 rows, lessons 6-14 need to be added.

### Option 3: Full database reset

```bash
cd /Users/hunnychahar/Desktop/qodebench
supabase db reset
```

This will run all migrations and seeds fresh.

### After fixing, refresh your browser

Once lessons are in the database, refresh the learning page to see all 14 lessons!

