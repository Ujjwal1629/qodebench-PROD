-- Leaderboard and Merch Rewards Migration
-- Creates tables for merch items, redemptions, and optimizes leaderboard queries

-- =====================================================
-- 1. CREATE MERCH ITEMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS merch_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL CHECK (category IN ('apparel', 'accessories', 'office', 'tech')),
  point_cost INTEGER NOT NULL CHECK (point_cost > 0),
  image_url TEXT,
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  sizes JSONB, -- For clothing items: ["S", "M", "L", "XL", "XXL"]
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. CREATE REDEMPTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  merch_item_id UUID NOT NULL REFERENCES merch_items(id) ON DELETE RESTRICT,
  points_spent INTEGER NOT NULL CHECK (points_spent > 0),
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  size VARCHAR(10), -- For clothing items
  address_details JSONB NOT NULL, -- {name, address_line1, address_line2, city, state, zip, country, phone}
  tracking_number VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fulfilled_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Leaderboard indexes
CREATE INDEX IF NOT EXISTS idx_profiles_total_points ON profiles(total_points DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_weekly_points ON profiles(weekly_points DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_username_search ON profiles(username);

-- Redemptions indexes
CREATE INDEX IF NOT EXISTS idx_redemptions_user_id ON redemptions(user_id);
CREATE INDEX IF NOT EXISTS idx_redemptions_status ON redemptions(status);
CREATE INDEX IF NOT EXISTS idx_redemptions_created_at ON redemptions(created_at DESC);

-- Merch items indexes
CREATE INDEX IF NOT EXISTS idx_merch_items_category ON merch_items(category);
CREATE INDEX IF NOT EXISTS idx_merch_items_active ON merch_items(is_active) WHERE is_active = true;

-- =====================================================
-- 4. CREATE FUNCTION TO UPDATE TIMESTAMPS
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 5. CREATE TRIGGERS FOR AUTO-UPDATE TIMESTAMPS
-- =====================================================
DROP TRIGGER IF EXISTS update_merch_items_updated_at ON merch_items;
CREATE TRIGGER update_merch_items_updated_at
  BEFORE UPDATE ON merch_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_redemptions_updated_at ON redemptions;
CREATE TRIGGER update_redemptions_updated_at
  BEFORE UPDATE ON redemptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 6. CREATE FUNCTION TO HANDLE REDEMPTION
-- =====================================================
CREATE OR REPLACE FUNCTION process_redemption(
  p_user_id UUID,
  p_merch_item_id UUID,
  p_size VARCHAR DEFAULT NULL,
  p_address_details JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_point_cost INTEGER;
  v_user_points INTEGER;
  v_redemption_id UUID;
BEGIN
  -- Get merch item cost
  SELECT point_cost INTO v_point_cost
  FROM merch_items
  WHERE id = p_merch_item_id AND is_active = true;

  IF v_point_cost IS NULL THEN
    RAISE EXCEPTION 'Merch item not found or not active';
  END IF;

  -- Get user's current points
  SELECT total_points INTO v_user_points
  FROM profiles
  WHERE id = p_user_id;

  -- Check if user has enough points
  IF v_user_points < v_point_cost THEN
    RAISE EXCEPTION 'Insufficient points. Required: %, Available: %', v_point_cost, v_user_points;
  END IF;

  -- Deduct points from user
  UPDATE profiles
  SET total_points = total_points - v_point_cost,
      updated_at = NOW()
  WHERE id = p_user_id;

  -- Decrease stock
  UPDATE merch_items
  SET stock_quantity = stock_quantity - 1,
      updated_at = NOW()
  WHERE id = p_merch_item_id AND stock_quantity > 0;

  -- Create redemption record
  INSERT INTO redemptions (user_id, merch_item_id, points_spent, size, address_details, status)
  VALUES (p_user_id, p_merch_item_id, v_point_cost, p_size, p_address_details, 'pending')
  RETURNING id INTO v_redemption_id;

  RETURN v_redemption_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 7. SEED INITIAL MERCH ITEMS (BETA PHASE)
-- =====================================================
-- Only stickers available during beta (is_active = true)
-- Premium items shown but not redeemable until v1.0 (is_active = false)
-- Only insert if items don't exist (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM merch_items WHERE name = 'QodeBench Sticker Pack') THEN
    INSERT INTO merch_items (name, description, category, point_cost, image_url, stock_quantity, sizes, is_active) VALUES
    ('QodeBench Sticker Pack', 'Pack of 5 premium vinyl stickers featuring QodeBench branding and coding quotes. Available during beta!', 'accessories', 100, '/merch/stickers.jpg', 50, NULL, true),
    ('QodeBench Pen', 'Premium quality ballpoint pen with QodeBench logo. Writes smooth, codes smoother. Available in v1.0', 'office', 200, '/merch/pen.jpg', 0, NULL, false),
    ('Coffee Mug - "Powered by Coffee & Code"', 'Ceramic mug with motivational coding quote. Microwave and dishwasher safe. Available in v1.0', 'office', 500, '/merch/mug.jpg', 0, NULL, false),
    ('Laptop Sticker - Holographic Logo', 'Large holographic QodeBench logo sticker for your laptop or water bottle. Available in v1.0', 'accessories', 300, '/merch/laptop-sticker.jpg', 0, NULL, false),
    ('Developer Notebook', 'Premium lined notebook for algorithms, ideas, and debugging notes. Available in v1.0', 'office', 400, '/merch/notebook.jpg', 0, NULL, false),
    ('Insulated Water Bottle', 'Stainless steel insulated bottle. Keeps drinks cold for 24h, hot for 12h. Available in v1.0', 'accessories', 750, '/merch/water-bottle.jpg', 0, NULL, false),
    ('QodeBench T-Shirt', 'Comfortable cotton t-shirt with QodeBench logo. Perfect for coding sessions. Available in v1.0', 'apparel', 1000, '/merch/tshirt.jpg', 0, '["S", "M", "L", "XL", "XXL"]', false),
    ('QodeBench Hoodie', 'Premium zip hoodie with embroidered logo. Cozy coding companion. Available in v1.0', 'apparel', 2000, '/merch/hoodie.jpg', 0, '["S", "M", "L", "XL", "XXL"]', false);
  END IF;
END $$;

-- =====================================================
-- 8. CREATE VIEW FOR LEADERBOARD (OPTIMIZED)
-- =====================================================
CREATE OR REPLACE VIEW leaderboard_all_time AS
SELECT
  p.id,
  p.username,
  p.full_name,
  p.avatar_url,
  p.experience_level,
  p.total_points,
  p.challenges_completed,
  p.current_streak,
  p.longest_streak,
  ROW_NUMBER() OVER (ORDER BY p.total_points DESC, p.challenges_completed DESC, p.created_at ASC) as rank
FROM profiles p
WHERE p.total_points > 0
ORDER BY rank
LIMIT 1000;

CREATE OR REPLACE VIEW leaderboard_weekly AS
SELECT
  p.id,
  p.username,
  p.full_name,
  p.avatar_url,
  p.experience_level,
  p.weekly_points,
  p.challenges_completed,
  p.current_streak,
  p.longest_streak,
  ROW_NUMBER() OVER (ORDER BY p.weekly_points DESC, p.challenges_completed DESC, p.created_at ASC) as rank
FROM profiles p
WHERE p.weekly_points > 0
ORDER BY rank
LIMIT 1000;

-- =====================================================
-- 9. GRANT PERMISSIONS
-- =====================================================
-- Allow authenticated users to read merch items
GRANT SELECT ON merch_items TO authenticated;

-- Allow authenticated users to read their own redemptions
GRANT SELECT ON redemptions TO authenticated;
GRANT INSERT ON redemptions TO authenticated;

-- Allow reading leaderboard views
GRANT SELECT ON leaderboard_all_time TO authenticated;
GRANT SELECT ON leaderboard_weekly TO authenticated;

-- =====================================================
-- 10. ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS on tables
ALTER TABLE merch_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE redemptions ENABLE ROW LEVEL SECURITY;

-- Merch items: Anyone can view all items (even inactive ones for preview)
DROP POLICY IF EXISTS "Anyone can view merch items" ON merch_items;
DROP POLICY IF EXISTS "Anyone can view active merch items" ON merch_items;
CREATE POLICY "Anyone can view merch items"
  ON merch_items FOR SELECT
  USING (true);

-- Redemptions: Users can only view their own
DROP POLICY IF EXISTS "Users can view their own redemptions" ON redemptions;
CREATE POLICY "Users can view their own redemptions"
  ON redemptions FOR SELECT
  USING (auth.uid() = user_id);

-- Redemptions: Users can create their own
DROP POLICY IF EXISTS "Users can create redemptions" ON redemptions;
CREATE POLICY "Users can create redemptions"
  ON redemptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
COMMENT ON TABLE merch_items IS 'Stores QodeBench merchandise available for redemption';
COMMENT ON TABLE redemptions IS 'Tracks user merchandise redemptions and fulfillment status';
COMMENT ON FUNCTION process_redemption IS 'Handles complete redemption flow: validation, point deduction, and record creation';
