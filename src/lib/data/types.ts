export interface VenueDetails {
  id?: string;
  name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  county: string;
  postcode: string;
  phone: string;
  email?: string;
  instagram_url: string;
  opentable_url: string;
  tagline?: string;
}

export interface OpeningHour {
  id?: string;
  day_of_week: number; // 0=Monday, 6=Sunday
  day_name: string;
  is_closed: boolean;
  lunch_open?: string | null;
  lunch_close?: string | null;
  dinner_open?: string | null;
  dinner_close?: string | null;
  note?: string | null;
}

export interface PriceVariant {
  label: string;
  price: number;
}

export interface MenuItem {
  id?: string;
  category_id?: string;
  category_slug?: string;
  name: string;
  description?: string;
  price?: number;
  price_variants?: PriceVariant[];
  tags?: string[];
  is_available?: boolean;
  sort_order?: number;
}

export interface MenuCategory {
  id?: string;
  slug: string;
  name: string;
  description?: string;
  sort_order?: number;
  items?: MenuItem[];
}

export interface GalleryImage {
  id?: string;
  filename: string;
  alt_text: string;
  local_path: string;
  storage_url?: string;
  is_hero?: boolean;
  sort_order?: number;
}

export interface HomepageSection {
  id?: string;
  slug: string;
  heading?: string;
  subheading?: string;
  body?: string;
  cta_text?: string;
  cta_url?: string;
  image_key?: string;
  is_visible?: boolean;
  sort_order?: number;
}

export interface SiteSetting {
  key: string;
  value: string;
}

export interface SignatureBowl {
  id?: string;
  name: string;
  description: string;
  price?: string | null;
  badge_label?: string | null;
  gallery_image_id?: string | null;
  alt_text?: string | null;
  sort_order?: number;
  is_visible?: boolean;
  // resolved from join (not stored in DB):
  image_url?: string | null;
  image_local_path?: string | null;
  image_alt_text?: string | null;
}
