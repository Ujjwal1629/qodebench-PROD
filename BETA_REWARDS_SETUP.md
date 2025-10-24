# Beta Rewards System - Setup Guide

## What's Implemented

A **beta-restricted rewards system** that balances user engagement with minimal cost during the beta phase.

---

## Beta Restrictions

### Physical Merch (Limited)
✅ **Available Now:**
- **QodeBench Sticker Pack** (100 points)
  - Stock: 50 units
  - Limited to first 50 beta users
  - 1 redemption per user

🔒 **Coming in v1.0** (Preview Only):
- QodeBench Pen (200 points)
- Coffee Mug (500 points)
- Laptop Sticker (300 points)
- Developer Notebook (400 points)
- Water Bottle (750 points)
- T-Shirt (1000 points)
- Hoodie (2000 points)

### Digital Rewards (Unlimited)
✅ **Available Now - Auto-Awarded:**
- 🚀 **Beta Tester Badge** - All beta users
- 💯 **100 Points Club** - Earn 100+ points
- ⭐ **500 Points Champion** - Earn 500+ points
- 🏆 **1K Points Elite** - Earn 1000+ points
- 🎯 **Challenge Solver** - Complete 10+ challenges
- 🔥 **Challenge Master** - Complete 50+ challenges
- 🔥 **Week Warrior** - 7 day coding streak
- 👑 **Consistency King** - 30 day coding streak
- 🎁 **First Reward** - Redeem first item

---

## User Experience

### Rewards Store Page
1. **Beta Announcement Banner** (Top of page)
   - Explains beta limitations
   - Shows "1,000 active users" unlock goal
   - Highlights: ✓ Stickers Now, ✓ 1 Per User, ✓ Limited 50

2. **Points Balance Card**
   - Shows current points
   - Link to redemption history

3. **Merch Cards**
   - **Beta Available Items**: Green badge "Beta Available"
   - **Coming Soon Items**: Blue/purple overlay "Coming in v1.0"
   - Disabled redemption button: "Available in v1.0"

### Redemption Flow
1. User clicks "Redeem Now" on sticker pack
2. Modal opens with shipping form
3. System validates:
   - ✓ User hasn't redeemed before (1 per user limit)
   - ✓ Item is active (beta restriction)
   - ✓ Stock available (50 units)
   - ✓ User has enough points (100 points)
4. Confirmation and points deduction
5. Auto-awards "First Reward" badge

### Leaderboard Integration
- User profiles show earned badges
- Achievements section displays badge icons
- Encourages competition and engagement

---

## Database Migrations

### Migration 1: Leaderboard & Merch (`006_leaderboard_and_merch.sql`)
**Changes for Beta:**
- Only sticker pack has `is_active = true`
- Stock: 50 units (vs 1000 in original)
- All other items: `is_active = false`, `stock_quantity = 0`
- Updated descriptions: "Available in v1.0"

### Migration 2: Digital Badges (`007_digital_badges.sql`)
**New Features:**
- `user_badges` table
- Auto-award triggers on profile updates
- Auto-award on first redemption
- 9 badge types total
- All existing users get "Beta Tester" badge

---

## Cost Analysis

### Beta Phase Cost (First 50 Users)
```
Sticker Packs:
- Cost per pack: $2-3 (bulk order)
- Shipping: ~$1-2 per package (US)
- Total per redemption: $3-5

Maximum Cost:
- 50 packs × $5 = $250 maximum

Realistic Cost (assuming 60% redemption):
- 30 packs × $5 = $150
```

### Digital Rewards Cost
```
Zero Cost
- Badges auto-awarded via database triggers
- Displayed in user profiles
- Infinite scalability
```

### Total Beta Investment: **$150-250**
- Low risk
- High engagement value
- Creates social proof (users share stickers)
- Builds loyalty with early adopters

---

## How to Apply Beta Setup

### 1. Apply Database Migrations

**In Supabase Dashboard:**

1. Go to SQL Editor
2. Create new query
3. Copy and paste `supabase/migrations/006_leaderboard_and_merch.sql`
4. Execute
5. Create another new query
6. Copy and paste `supabase/migrations/007_digital_badges.sql`
7. Execute

**Verify:**
```sql
-- Check merch items
SELECT name, is_active, stock_quantity FROM merch_items;

-- Check badges table
SELECT * FROM user_badges LIMIT 5;

-- Verify all users have beta tester badge
SELECT COUNT(*) FROM user_badges WHERE badge_type = 'beta_tester';
```

### 2. Verify UI

1. Visit `/dashboard/rewards`
2. Verify:
   - ✓ Orange beta banner shows
   - ✓ Sticker pack has green "Beta Available" badge
   - ✓ Premium items show "Coming in v1.0" overlay
   - ✓ Premium items button says "Available in v1.0"

### 3. Test Redemption Flow

**As a Test User:**
1. Earn 100+ points (complete challenges)
2. Go to `/dashboard/rewards`
3. Click "Redeem Now" on sticker pack
4. Fill shipping form
5. Confirm redemption
6. Verify:
   - ✓ Points deducted
   - ✓ Redemption appears in history
   - ✓ "First Reward" badge auto-awarded
   - ✓ Stock decremented

**Test Limitations:**
1. Try to redeem second item (should fail with "Beta limit: Only 1 redemption per user")
2. Try to redeem premium item (button should be disabled)
3. Check stock reaches 0 (out of stock message appears)

---

## Beta Redemption Limits

### Code Implementation

**File: `app/actions/rewards.ts`**

```typescript
// Check redemption limit per user
const { count: userRedemptionCount } = await supabase
  .from('redemptions')
  .select('*', { count: 'exact', head: true })
  .eq('user_id', user.id)
  .neq('status', 'cancelled');

if (userRedemptionCount && userRedemptionCount >= 1) {
  return {
    success: false,
    error: 'Beta limit: Only 1 redemption per user. More items coming in v1.0!'
  };
}

// Only active items can be redeemed
if (!item.is_active) {
  return {
    success: false,
    error: 'This item will be available in v1.0. Keep earning points!'
  };
}
```

---

## Transitioning to v1.0 (Post-Beta)

### When to Launch Full Store

**Suggested Triggers:**
- ✓ 1,000 active users achieved
- ✓ Beta testing complete (2-3 months)
- ✓ Revenue model validated
- ✓ Subscription tiers ready

### How to Enable Full Store

**1. Update Database:**
```sql
-- Enable all merch items
UPDATE merch_items
SET is_active = true,
    stock_quantity = CASE
      WHEN category = 'apparel' THEN 100
      WHEN category = 'office' THEN 200
      WHEN category = 'accessories' THEN 300
      ELSE stock_quantity
    END;

-- Remove beta description suffix
UPDATE merch_items
SET description = REPLACE(description, '. Available in v1.0', '');
```

**2. Update Code:**
```typescript
// In app/actions/rewards.ts - Remove or increase redemption limit
if (userRedemptionCount && userRedemptionCount >= 5) { // Changed from 1
  return {
    success: false,
    error: 'Maximum 5 redemptions per month'
  };
}
```

**3. Update UI:**
```tsx
// In components/rewards/rewards-client.tsx - Update banner
<h3>Premium Store Now Open!</h3>
<p>All merch items now available. Redeem with your earned points!</p>
```

---

## Analytics to Track

### During Beta

**Key Metrics:**
1. **Redemption Rate**: % of users who redeem
2. **Points Distribution**: Average points per user
3. **Badge Engagement**: Which badges users earn most
4. **Stock Depletion Rate**: How fast stickers sell out
5. **User Retention**: Do redeemers stay active longer?

**SQL Queries:**
```sql
-- Redemption rate
SELECT
  COUNT(DISTINCT user_id)::float / (SELECT COUNT(*) FROM auth.users) * 100 as redemption_rate_percent
FROM redemptions
WHERE status != 'cancelled';

-- Average points
SELECT AVG(total_points) as avg_points FROM profiles;

-- Most common badges
SELECT badge_type, COUNT(*) as count
FROM user_badges
GROUP BY badge_type
ORDER BY count DESC;

-- Stock status
SELECT name, stock_quantity,
  (50 - stock_quantity) as redeemed
FROM merch_items
WHERE name LIKE '%Sticker%';
```

---

## Marketing Angle

### Beta Launch Messaging

**Landing Page:**
> "Join QodeBench Beta: Earn points, win exclusive stickers!
> Be among the first 50 beta users to redeem limited-edition merch.
> Premium items (T-shirts, Hoodies) unlock at 1,000 users!"

**Social Media:**
> "🚀 QodeBench Beta is LIVE!
> ✓ Solve coding challenges
> ✓ Earn points
> ✓ Redeem exclusive stickers (limited to first 50!)
> Join now: [link]"

**User Emails:**
> "Subject: You're a QodeBench Beta Tester! 🎉
>
> Congratulations! You've been awarded the exclusive Beta Tester badge.
>
> As a thank you, earn 100 points and redeem your free sticker pack.
> (Limited to first 50 users - claim yours before they're gone!)"

---

## Success Criteria

### Beta Goals
- ✓ 500+ registered users
- ✓ 30+ sticker redemptions
- ✓ 70%+ positive feedback
- ✓ Average 200+ points per active user
- ✓ 40%+ weekly retention

### Post-Beta Upgrade Triggers
- ✓ 1,000 active users
- ✓ All 50 stickers redeemed
- ✓ Subscription model validated
- ✓ Revenue from premium features

---

## Files Modified

### New Files
1. `supabase/migrations/007_digital_badges.sql`
2. `app/actions/badges.ts`
3. `components/badges/user-badges.tsx`

### Modified Files
1. `supabase/migrations/006_leaderboard_and_merch.sql` - Beta restrictions
2. `app/actions/rewards.ts` - Redemption limits, active item check
3. `components/rewards/merch-card.tsx` - Coming soon overlay, badges
4. `components/rewards/rewards-client.tsx` - Beta announcement banner
5. `components/leaderboard/user-profile-modal.tsx` - Badge display

---

## Summary

✅ **Low Risk**: Only $150-250 investment in stickers
✅ **High Engagement**: Points + badges motivate users
✅ **Social Proof**: Users share stickers, creating buzz
✅ **Scalable**: Digital badges cost $0, work forever
✅ **Future-Proof**: Premium items ready to enable at v1.0
✅ **Data-Driven**: Track what users want before investing

**You're ready to launch the beta rewards system!** 🚀

Apply the migrations, verify the UI, and start engaging your early adopters with a fun, low-cost rewards program that drives retention and creates buzz.
