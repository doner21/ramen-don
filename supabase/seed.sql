-- RAMEN DON — Seed Data
-- Run after 001_initial.sql

-- Venue
INSERT INTO venue_details (name, address_line1, city, county, postcode, phone, instagram_url, opentable_url, tagline)
VALUES ('Ramen Don', 'Unit 1A Regency Wharf', 'Birmingham', 'West Midlands', 'B1 2DS', '0121 714 5565',
        'https://www.instagram.com/ramen_don_/', 'https://www.opentable.co.uk/r/ramen-don-birmingham',
        'Handcrafted broths. Bold flavours.');

-- Opening Hours
INSERT INTO opening_hours (day_of_week, day_name, is_closed) VALUES (0, 'Monday', true);
INSERT INTO opening_hours (day_of_week, day_name, is_closed, lunch_open, lunch_close, dinner_open, dinner_close)
  VALUES (1, 'Tuesday', false, '12:00', '15:00', '17:00', '22:00');
INSERT INTO opening_hours (day_of_week, day_name, is_closed, lunch_open, lunch_close, dinner_open, dinner_close)
  VALUES (2, 'Wednesday', false, '12:00', '15:00', '17:00', '22:00');
INSERT INTO opening_hours (day_of_week, day_name, is_closed, lunch_open, lunch_close, dinner_open, dinner_close)
  VALUES (3, 'Thursday', false, '12:00', '15:00', '17:00', '22:00');
INSERT INTO opening_hours (day_of_week, day_name, is_closed, lunch_open, lunch_close, dinner_open, dinner_close)
  VALUES (4, 'Friday', false, '12:00', '15:00', '17:00', '22:00');
INSERT INTO opening_hours (day_of_week, day_name, is_closed, lunch_open, lunch_close, dinner_open, dinner_close)
  VALUES (5, 'Saturday', false, '12:00', '15:00', '17:00', '23:00');
INSERT INTO opening_hours (day_of_week, day_name, is_closed, lunch_open, lunch_close, note)
  VALUES (6, 'Sunday', false, '12:00', '20:00', 'All day until 20:00');

-- Menu Categories
INSERT INTO menu_categories (slug, name, sort_order) VALUES
  ('plates', 'Plates', 1),
  ('bowls', 'Bowls', 2),
  ('soft-drinks', 'Soft Drinks', 3),
  ('beers', 'Beers', 4),
  ('cocktails', 'Cocktails', 5),
  ('sake', 'Saké', 6),
  ('wine', 'Wine', 7);

-- Menu Items — Plates
INSERT INTO menu_items (category_id, name, description, price, tags, sort_order)
SELECT id, 'Charred Edamame', 'Shichimi togarashi, Sesame soy', 6.00, ARRAY['vg'], 1 FROM menu_categories WHERE slug='plates';
INSERT INTO menu_items (category_id, name, description, price, sort_order)
SELECT id, 'Karaage (5)', 'Crispy fried chicken thigh, Spicy kewpie mayo, Fresh lemon', 8.50, 2 FROM menu_categories WHERE slug='plates';
INSERT INTO menu_items (category_id, name, description, price, sort_order)
SELECT id, 'Gyoza (5)', 'Chicken & Vegetable / Pork / Tofu & Vegetable', 8.00, 3 FROM menu_categories WHERE slug='plates';
INSERT INTO menu_items (category_id, name, description, price, tags, sort_order)
SELECT id, 'Katsu Bomb (4)', 'Fried rice balls, Curry filling', 7.00, ARRAY['v'], 4 FROM menu_categories WHERE slug='plates';

-- Menu Items — Bowls
INSERT INTO menu_items (category_id, name, description, price, sort_order)
SELECT id, 'Kotteri Pork', 'Pork bone broth, Chashu pork belly, House menma, Hanjuku egg, Spring onions, Beni Shoga, Nori', 16.00, 1 FROM menu_categories WHERE slug='bowls';
INSERT INTO menu_items (category_id, name, description, price, sort_order)
SELECT id, 'Chicken Paitan', 'Chicken with vegetable broth, Sweet soy chicken thigh, Hanjuku egg, Spring onion, House menma, Beni Shoga, Nori', 16.00, 2 FROM menu_categories WHERE slug='bowls';
INSERT INTO menu_items (category_id, name, description, price, sort_order)
SELECT id, 'Miso', 'Pork Bone broth or Chicken with vegetable broth, Chashu pork belly or Sweet soy chicken, Sweetcorn, Miso cabbage, Spring onion', 16.00, 3 FROM menu_categories WHERE slug='bowls';
INSERT INTO menu_items (category_id, name, description, price, tags, sort_order)
SELECT id, 'Kara Miso', 'Pork Bone broth or Chicken with vegetable broth, Chashu pork belly or Sweet soy chicken, Spicy miso & toasted sesame tare, Kimchi, Sweetcorn, Spring onion, Shichimi togarashi', 16.00, ARRAY['spicy'], 4 FROM menu_categories WHERE slug='bowls';
INSERT INTO menu_items (category_id, name, description, price, sort_order)
SELECT id, 'Chicken Katsu Curry', 'Panko chicken, Potatoes, Carrot, Rich curry sauce, Sticky Japanese rice, Spring onion, Beni Shoga', 13.50, 5 FROM menu_categories WHERE slug='bowls';
INSERT INTO menu_items (category_id, name, description, price, tags, sort_order)
SELECT id, 'Veg Curry', 'Sweet potato croquette, Tofu, Butternut Squash, Potatoes, Carrot, Rich curry sauce, Sticky Japanese rice, Spring onion, Beni Shoga', 12.50, ARRAY['vg'], 6 FROM menu_categories WHERE slug='bowls';
INSERT INTO menu_items (category_id, name, description, price, tags, sort_order)
SELECT id, 'Kotteri Veg', 'Shio tare, Chilli oil, Soy milk, Kikurage, Sautéed cabbage, Menma, Spring onion, Sweetcorn, Beni shoga, Shichimi togarashi, Tofu, Hanjuku egg optional', 15.00, ARRAY['vg'], 7 FROM menu_categories WHERE slug='bowls';
INSERT INTO menu_items (category_id, name, description, price, tags, sort_order)
SELECT id, 'Veg Kara Miso', 'Soy sesame tare, Chilli oil, Soy milk, Kikurage, Sautéed cabbage, Menma, Spring onion, Sweetcorn, Beni shoga, Shichimi togarashi, Tofu, Hanjuku egg optional', 15.00, ARRAY['vg','spicy'], 8 FROM menu_categories WHERE slug='bowls';
INSERT INTO menu_items (category_id, name, description, price, sort_order)
SELECT id, 'Shoyu Ramen', 'Chicken with vegetable broth, Sweet soy chicken thigh, Hanjuku egg, Spring onion, Beni Shoga, Nori', 16.00, 9 FROM menu_categories WHERE slug='bowls';
INSERT INTO menu_items (category_id, name, description, price, sort_order)
SELECT id, 'Kishu Ramen', 'Chicken with vegetable broth, Pink duck, House menma, Hanjuku egg, Spring onion, Nori', 18.95, 10 FROM menu_categories WHERE slug='bowls';

-- Soft Drinks
INSERT INTO menu_items (category_id, name, price, sort_order)
SELECT id, 'Orange / Apple / Cranberry / Ginger Beer / Lemonade', 2.50, 1 FROM menu_categories WHERE slug='soft-drinks';
INSERT INTO menu_items (category_id, name, price, sort_order)
SELECT id, 'Coca-Cola / Diet Coke', 3.50, 2 FROM menu_categories WHERE slug='soft-drinks';
INSERT INTO menu_items (category_id, name, price, sort_order)
SELECT id, 'Still / Sparkling Water', 3.00, 3 FROM menu_categories WHERE slug='soft-drinks';

-- Beers
INSERT INTO menu_items (category_id, name, description, price, sort_order)
SELECT id, 'Asahi 330ml Bottle', 'Abv 5.2%', 4.50, 1 FROM menu_categories WHERE slug='beers';
INSERT INTO menu_items (category_id, name, description, price, sort_order)
SELECT id, 'Sapporo Pint Draft', '4.7%', 6.50, 2 FROM menu_categories WHERE slug='beers';

-- Cocktails
INSERT INTO menu_items (category_id, name, description, price, sort_order)
SELECT id, 'Moscow Mule', 'Vodka, Ginger beer, Lime', 9.50, 1 FROM menu_categories WHERE slug='cocktails';
INSERT INTO menu_items (category_id, name, description, price, sort_order)
SELECT id, 'Izuku Midoriya Sour', 'Midori, Vodka, Yuzu, Gomme syrup', 11.50, 2 FROM menu_categories WHERE slug='cocktails';
INSERT INTO menu_items (category_id, name, description, price, sort_order)
SELECT id, 'Smokey Bob', 'Rum bar overproof rum, Passion fruit, Coconut syrup, Yuzu, Ginger beer', 12.50, 3 FROM menu_categories WHERE slug='cocktails';

-- Saké
INSERT INTO menu_items (category_id, name, description, price_variants, tags, sort_order)
SELECT id, 'Yuzu Shu', 'Yuzu, Citrus notes, Crisp',
  '[{"label":"30ml","price":3.50},{"label":"360ml","price":21.50},{"label":"720ml","price":48.00}]'::jsonb,
  ARRAY['Vol 15%'], 1 FROM menu_categories WHERE slug='sake';
INSERT INTO menu_items (category_id, name, description, price_variants, tags, sort_order)
SELECT id, 'Ume Shu', 'Plum, Sweet, Ripe',
  '[{"label":"30ml","price":3.50},{"label":"360ml","price":18.50},{"label":"720ml","price":40.50}]'::jsonb,
  ARRAY['Vol 15%'], 2 FROM menu_categories WHERE slug='sake';
INSERT INTO menu_items (category_id, name, description, price_variants, tags, sort_order)
SELECT id, 'Kawatsuru Junmai Muroka', 'Grape, Dark Plum, Creamy, Warm or Chilled',
  '[{"label":"60ml","price":4.00},{"label":"360ml","price":18.50},{"label":"1.8L","price":98.00}]'::jsonb,
  ARRAY['Vol 16%'], 3 FROM menu_categories WHERE slug='sake';
INSERT INTO menu_items (category_id, name, description, price_variants, tags, sort_order)
SELECT id, 'Katsujama Ken', 'Dry, Melon, White peach, Crisp',
  '[{"label":"60ml","price":6.00},{"label":"360ml","price":35.00},{"label":"1.8L","price":75.00}]'::jsonb,
  ARRAY['Vol 15%'], 4 FROM menu_categories WHERE slug='sake';

-- Wine
INSERT INTO menu_items (category_id, name, description, price_variants, sort_order)
SELECT id, 'Montanes Malbec', 'Red, Argentina',
  '[{"label":"175ml","price":5.00},{"label":"250ml","price":6.60}]'::jsonb,
  1 FROM menu_categories WHERE slug='wine';
INSERT INTO menu_items (category_id, name, description, price_variants, sort_order)
SELECT id, 'Pinot Grigio Rosato', 'Rosé, Italy',
  '[{"label":"175ml","price":5.30},{"label":"250ml","price":6.90}]'::jsonb,
  2 FROM menu_categories WHERE slug='wine';

-- Gallery Images
INSERT INTO gallery_images (filename, alt_text, local_path, is_hero, sort_order) VALUES
  ('hero_ramen.png', 'Atmospheric counter bar with warm amber lighting', '/images/brand/hero_ramen.png', true, 1),
  ('chef_craft.png', 'Chef hands crafting ramen in a dark kitchen with steam', '/images/brand/chef_craft.png', false, 2),
  ('signature_bowl.png', 'Overhead view of tonkotsu ramen in dark ceramic bowl', '/images/brand/signature_bowl.png', false, 3),
  ('spicy_fire.png', 'Spicy miso ramen with dramatic presentation', '/images/brand/spicy_fire.png', false, 4),
  ('shoyu_essence.png', 'Overhead view of shoyu ramen with dark tones', '/images/brand/shoyu_essence.png', false, 5),
  ('truffle_shio.png', 'Premium truffle shio ramen in white ceramic bowl', '/images/brand/truffle_shio.png', false, 6),
  ('hero_Hawksmoor_ramen.png', 'Candlelit atmospheric ramen restaurant interior', '/images/brand/hero_Hawksmoor_ramen.png', false, 7);

-- Homepage Sections
INSERT INTO homepage_sections (slug, heading, subheading, cta_text, cta_url, image_key, is_visible, sort_order) VALUES
  ('hero', 'RAMEN DON', 'Handcrafted broths. Bold flavours.',
   'Book a Table', 'https://www.opentable.co.uk/r/ramen-don-birmingham', 'hero_ramen.png', true, 1);
INSERT INTO homepage_sections (slug, heading, body, image_key, is_visible, sort_order) VALUES
  ('story', 'The Craft of Ramen',
   'Every bowl at Ramen Don begins with a broth simmered for hours — rich, deep, and layered with umami.',
   'chef_craft.png', true, 2);
INSERT INTO homepage_sections (slug, heading, subheading, is_visible, sort_order) VALUES
  ('signature-dishes', 'Signature Bowls', 'From our kitchen to your table', true, 3);
INSERT INTO homepage_sections (slug, heading, subheading, cta_text, cta_url, is_visible, sort_order) VALUES
  ('visit-cta', 'Find Us in Birmingham', 'Unit 1A Regency Wharf, Birmingham B1 2DS',
   'Reserve Your Table', 'https://www.opentable.co.uk/r/ramen-don-birmingham', true, 4);

-- Site Settings
INSERT INTO site_settings (key, value) VALUES
  ('site_name', 'Ramen Don'),
  ('opentable_url', 'https://www.opentable.co.uk/r/ramen-don-birmingham'),
  ('instagram_url', 'https://www.instagram.com/ramen_don_/');
