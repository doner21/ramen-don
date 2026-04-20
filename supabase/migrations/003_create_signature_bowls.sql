-- RAMEN DON — Migration 003: Signature Bowls
-- Additive, idempotent — does not touch existing tables

-- ============================================================
-- TABLE: signature_bowls
-- ============================================================
CREATE TABLE IF NOT EXISTS signature_bowls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price TEXT,
  badge_label TEXT,
  gallery_image_id UUID REFERENCES gallery_images(id) ON DELETE SET NULL,
  alt_text TEXT,
  sort_order SMALLINT DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_signature_bowls_sort ON signature_bowls (sort_order);

ALTER TABLE signature_bowls ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bowls_public_read" ON signature_bowls FOR SELECT USING (is_visible = true);
CREATE POLICY "bowls_auth_write" ON signature_bowls FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- SEED: four bowls matching the current hard-coded FEATURED_BOWLS
-- gallery_image_id resolved via subquery on filename; NULL if image missing
-- Migration is idempotent: DO NOTHING if name already exists
-- ============================================================
INSERT INTO signature_bowls (name, description, price, badge_label, gallery_image_id, alt_text, sort_order)
SELECT
  'Kotteri Pork',
  'Pork bone broth, Chashu pork belly, House menma, Hanjuku egg',
  '£16',
  NULL,
  (SELECT id FROM gallery_images WHERE filename = 'signature_bowl.png' LIMIT 1),
  'Kotteri pork ramen in dark ceramic bowl',
  1
WHERE NOT EXISTS (SELECT 1 FROM signature_bowls WHERE name = 'Kotteri Pork');

INSERT INTO signature_bowls (name, description, price, badge_label, gallery_image_id, alt_text, sort_order)
SELECT
  'Kara Miso',
  'Spicy miso tare, Kimchi, Sweetcorn, Shichimi togarashi',
  '£16',
  '🌶 Spicy',
  (SELECT id FROM gallery_images WHERE filename = 'spicy_fire.png' LIMIT 1),
  'Spicy kara miso ramen',
  2
WHERE NOT EXISTS (SELECT 1 FROM signature_bowls WHERE name = 'Kara Miso');

INSERT INTO signature_bowls (name, description, price, badge_label, gallery_image_id, alt_text, sort_order)
SELECT
  'Shoyu Ramen',
  'Sweet soy chicken, Hanjuku egg, Spring onion, Nori',
  '£16',
  NULL,
  (SELECT id FROM gallery_images WHERE filename = 'shoyu_essence.png' LIMIT 1),
  'Shoyu ramen overhead',
  3
WHERE NOT EXISTS (SELECT 1 FROM signature_bowls WHERE name = 'Shoyu Ramen');

INSERT INTO signature_bowls (name, description, price, badge_label, gallery_image_id, alt_text, sort_order)
SELECT
  'Kishu Ramen',
  'Pink duck, House menma, Hanjuku egg, Spring onion',
  '£18.95',
  'Chef''s Pick',
  (SELECT id FROM gallery_images WHERE filename = 'truffle_shio.png' LIMIT 1),
  'Premium Kishu ramen',
  4
WHERE NOT EXISTS (SELECT 1 FROM signature_bowls WHERE name = 'Kishu Ramen');
