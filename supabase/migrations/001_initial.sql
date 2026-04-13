-- RAMEN DON — Initial Database Migration
-- Run in Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: venue_details
-- ============================================================
CREATE TABLE IF NOT EXISTS venue_details (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL DEFAULT 'Ramen Don',
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  county TEXT,
  postcode TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  instagram_url TEXT,
  opentable_url TEXT,
  tagline TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE venue_details ENABLE ROW LEVEL SECURITY;
CREATE POLICY "venue_public_read" ON venue_details FOR SELECT USING (true);
CREATE POLICY "venue_auth_write" ON venue_details FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- TABLE: opening_hours
-- ============================================================
CREATE TABLE IF NOT EXISTS opening_hours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  day_of_week SMALLINT NOT NULL UNIQUE CHECK (day_of_week BETWEEN 0 AND 6),
  day_name TEXT NOT NULL,
  is_closed BOOLEAN NOT NULL DEFAULT false,
  lunch_open TIME,
  lunch_close TIME,
  dinner_open TIME,
  dinner_close TIME,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE opening_hours ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hours_public_read" ON opening_hours FOR SELECT USING (true);
CREATE POLICY "hours_auth_write" ON opening_hours FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- TABLE: menu_categories
-- ============================================================
CREATE TABLE IF NOT EXISTS menu_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  sort_order SMALLINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_menu_categories_sort ON menu_categories (sort_order);

ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories_public_read" ON menu_categories FOR SELECT USING (true);
CREATE POLICY "categories_auth_write" ON menu_categories FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- TABLE: menu_items
-- ============================================================
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES menu_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(8,2),
  price_variants JSONB,
  tags TEXT[],
  is_available BOOLEAN DEFAULT true,
  sort_order SMALLINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_menu_items_category ON menu_items (category_id);
CREATE INDEX idx_menu_items_sort ON menu_items (sort_order);

ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "items_public_read" ON menu_items FOR SELECT USING (is_available = true);
CREATE POLICY "items_auth_write" ON menu_items FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- TABLE: gallery_images
-- ============================================================
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  local_path TEXT,
  storage_url TEXT,
  is_hero BOOLEAN DEFAULT false,
  sort_order SMALLINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_gallery_sort ON gallery_images (sort_order);

ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gallery_public_read" ON gallery_images FOR SELECT USING (true);
CREATE POLICY "gallery_auth_write" ON gallery_images FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- TABLE: homepage_sections
-- ============================================================
CREATE TABLE IF NOT EXISTS homepage_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  heading TEXT,
  subheading TEXT,
  body TEXT,
  cta_text TEXT,
  cta_url TEXT,
  image_key TEXT,
  is_visible BOOLEAN DEFAULT true,
  sort_order SMALLINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "homepage_public_read" ON homepage_sections FOR SELECT USING (is_visible = true);
CREATE POLICY "homepage_auth_write" ON homepage_sections FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- TABLE: site_settings
-- ============================================================
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings_public_read" ON site_settings FOR SELECT USING (true);
CREATE POLICY "settings_auth_write" ON site_settings FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- Storage: gallery bucket (create manually in Supabase Dashboard)
-- Storage → New bucket → Name: "gallery" → Public: true
-- Then run:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true);
-- CREATE POLICY "gallery_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
-- CREATE POLICY "gallery_auth_upload" ON storage.objects FOR INSERT USING (auth.role() = 'authenticated' AND bucket_id = 'gallery');
-- ============================================================
