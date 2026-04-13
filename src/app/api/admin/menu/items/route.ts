import { NextResponse } from "next/server";
import { isSupabaseConfigured, createSupabaseServiceClient } from "@/lib/supabase-server";
import { MENU_ITEMS } from "@/lib/data/seed-data";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ data: MENU_ITEMS });
  }
  try {
    const supabase = await createSupabaseServiceClient();
    const { data, error } = await supabase.from("menu_items").select("*").order("sort_order");
    if (error) return NextResponse.json({ data: MENU_ITEMS });
    return NextResponse.json({ data: data || MENU_ITEMS });
  } catch {
    return NextResponse.json({ data: MENU_ITEMS });
  }
}
