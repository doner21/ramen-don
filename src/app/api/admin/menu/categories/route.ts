import { NextResponse } from "next/server";
import { isSupabaseConfigured, createSupabaseServiceClient } from "@/lib/supabase-server";
import { MENU_CATEGORIES } from "@/lib/data/seed-data";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ data: MENU_CATEGORIES });
  }
  try {
    const supabase = await createSupabaseServiceClient();
    const { data, error } = await supabase.from("menu_categories").select("*").order("sort_order");
    if (error) return NextResponse.json({ data: MENU_CATEGORIES });
    return NextResponse.json({ data: data || MENU_CATEGORIES });
  } catch {
    return NextResponse.json({ data: MENU_CATEGORIES });
  }
}
