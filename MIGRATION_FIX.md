# Migration Error Fix

## Problem
When running the migration multiple times, you got this error:
```
ERROR: 42710: trigger "update_merch_items_updated_at" for relation "merch_items" already exists
```

## Solution
Made the migration **idempotent** (safe to run multiple times) by adding:

### 1. Drop Triggers Before Creating
```sql
DROP TRIGGER IF EXISTS update_merch_items_updated_at ON merch_items;
CREATE TRIGGER update_merch_items_updated_at...

DROP TRIGGER IF EXISTS update_redemptions_updated_at ON redemptions;
CREATE TRIGGER update_redemptions_updated_at...
```

### 2. Drop Policies Before Creating
```sql
DROP POLICY IF EXISTS "Anyone can view merch items" ON merch_items;
DROP POLICY IF EXISTS "Anyone can view active merch items" ON merch_items;
CREATE POLICY "Anyone can view merch items"...

DROP POLICY IF EXISTS "Users can view their own redemptions" ON redemptions;
CREATE POLICY "Users can view their own redemptions"...

DROP POLICY IF EXISTS "Users can create redemptions" ON redemptions;
CREATE POLICY "Users can create redemptions"...
```

### 3. Conditional Seed Data Insert
```sql
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM merch_items WHERE name = 'QodeBench Sticker Pack') THEN
    INSERT INTO merch_items...
  END IF;
END $$;
```

## How to Apply

### Option 1: Clean Slate (Recommended if tables are empty)
```sql
-- Delete existing data (ONLY if you haven't started using the system)
DROP TABLE IF EXISTS redemptions CASCADE;
DROP TABLE IF EXISTS merch_items CASCADE;
DROP TABLE IF EXISTS user_badges CASCADE;
DROP VIEW IF EXISTS leaderboard_all_time;
DROP VIEW IF EXISTS leaderboard_weekly;

-- Then run the updated migration
```

### Option 2: Update in Place (If you have data)
Just run the updated migration file - it will:
- ✓ Drop and recreate triggers (no data loss)
- ✓ Drop and recreate policies (no data loss)
- ✓ Skip seed data if already exists (no duplicates)
- ✓ Update functions with `CREATE OR REPLACE`
- ✓ Update views with `CREATE OR REPLACE VIEW`

## Files Updated
- ✅ `supabase/migrations/006_leaderboard_and_merch.sql` - Now fully idempotent
- ✅ `supabase/migrations/007_digital_badges.sql` - Now fully idempotent

## What Was Fixed

### Migration 006 (Leaderboard & Merch)
- ✅ Added `DROP TRIGGER IF EXISTS` before creating triggers
- ✅ Added `DROP POLICY IF EXISTS` before creating policies
- ✅ Wrapped seed data in `DO $$ IF NOT EXISTS` block
- ✅ Views already use `CREATE OR REPLACE` (already idempotent)
- ✅ Functions use `CREATE OR REPLACE` (already idempotent)

### Migration 007 (Digital Badges)
- ✅ Added `DROP TRIGGER IF EXISTS` before creating triggers
- ✅ Added `DROP POLICY IF EXISTS` before creating policies
- ✅ Beta tester badge insert uses `ON CONFLICT DO NOTHING`
- ✅ Indexes already use `IF NOT EXISTS` (already idempotent)
- ✅ Functions use `CREATE OR REPLACE` (already idempotent)

## Test Migration
To verify it works:

1. **In Supabase SQL Editor:**
```sql
-- Run migration first time
-- (Copy and paste entire 006_leaderboard_and_merch.sql)

-- Verify it worked
SELECT COUNT(*) FROM merch_items; -- Should be 8

-- Run migration AGAIN (should not error)
-- (Copy and paste entire 006_leaderboard_and_merch.sql again)

-- Verify no duplicates
SELECT COUNT(*) FROM merch_items; -- Should still be 8
```

## How to Apply Both Migrations

**In Supabase SQL Editor:**

### Step 1: Run Migration 006
```sql
-- Copy entire contents of:
-- supabase/migrations/006_leaderboard_and_merch.sql
-- Paste and execute
```

### Step 2: Run Migration 007
```sql
-- Copy entire contents of:
-- supabase/migrations/007_digital_badges.sql
-- Paste and execute
```

### Step 3: Verify
```sql
-- Check merch items
SELECT name, is_active, stock_quantity FROM merch_items;
-- Should show 8 items, only sticker pack active

-- Check badges table exists
SELECT COUNT(*) FROM user_badges;
-- Should show count of beta tester badges (1 per user)

-- Check triggers exist
SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public';
-- Should show all 4 triggers

-- Test idempotency - Run migrations AGAIN
-- Should complete without errors
```

## Success!
Both migrations are now **safe to run multiple times** without causing errors. You can:
- ✅ Re-run migrations during development
- ✅ Apply migrations to multiple environments
- ✅ Roll forward safely
- ✅ No duplicate data
- ✅ No trigger conflicts
