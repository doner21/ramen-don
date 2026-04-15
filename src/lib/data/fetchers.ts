import { isSupabaseConfigured, createSupabaseServerClient } from "../supabase-server";
import {
  VENUE_DETAILS,
  OPENING_HOURS,
  MENU_CATEGORIES,
  MENU_ITEMS,
  GALLERY_IMAGES,
  HOMEPAGE_SECTIONS,
} from "./seed-data";
import type { VenueDetails, OpeningHour, MenuCategory, GalleryImage, HomepageSection } from "./types";

export async function getVenueDetails(): Promise<VenueDetails> {
  if (!isSupabaseConfigured()) return VENUE_DETAILS;
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.from("venue_details").select("*").single();
    if (error || !data) return VENUE_DETAILS;
    return data as VenueDetails;
  } catch {
    return VENUE_DETAILS;
  }
}

export async function getOpeningHours(): Promise<OpeningHour[]> {
  if (!isSupabaseConfigured()) return OPENING_HOURS;
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("opening_hours")
      .select("*")
      .order("day_of_week");
    if (error || !data) return OPENING_HOURS;
    return data as OpeningHour[];
  } catch {
    return OPENING_HOURS;
  }
}

export async function getMenuCategories(): Promise<MenuCategory[]> {
  if (!isSupabaseConfigured()) {
    return MENU_CATEGORIES.map((cat) => ({
      ...cat,
      items: MENU_ITEMS.filter((item) => item.category_slug === cat.slug),
    }));
  }
  try {
    const supabase = await createSupabaseServerClient();
    const { data: cats, error: catError } = await supabase
      .from("menu_categories")
      .select("*")
      .order("sort_order");
    if (catError || !cats) {
      return MENU_CATEGORIES.map((cat) => ({
        ...cat,
        items: MENU_ITEMS.filter((item) => item.category_slug === cat.slug),
      }));
    }
    const { data: items } = await supabase
      .from("menu_items")
      .select("*")
      .order("sort_order");
    return cats.map((cat: MenuCategory) => ({
      ...cat,
      items: (items || []).filter((item: { category_id: string }) => item.category_id === cat.id),
    }));
  } catch {
    return MENU_CATEGORIES.map((cat) => ({
      ...cat,
      items: MENU_ITEMS.filter((item) => item.category_slug === cat.slug),
    }));
  }
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  if (!isSupabaseConfigured()) return GALLERY_IMAGES;
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .order("sort_order");
    if (error || !data) return GALLERY_IMAGES;
    return data as GalleryImage[];
  } catch {
    return GALLERY_IMAGES;
  }
}

export async function getHeroImage(): Promise<GalleryImage | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .eq("is_hero", true)
      .limit(1)
      .maybeSingle();
    if (error || !data) return null;
    return data as GalleryImage;
  } catch {
    return null;
  }
}

export async function getHomepageSections(): Promise<HomepageSection[]> {
  if (!isSupabaseConfigured()) return HOMEPAGE_SECTIONS;
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("homepage_sections")
      .select("*")
      .eq("is_visible", true)
      .order("sort_order");
    if (error || !data) return HOMEPAGE_SECTIONS;
    return data as HomepageSection[];
  } catch {
    return HOMEPAGE_SECTIONS;
  }
}
