import { NextResponse } from "next/server";
import { isSupabaseConfigured, createSupabaseServiceClient } from "@/lib/supabase-server";
import { HOMEPAGE_SECTIONS } from "@/lib/data/seed-data";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ data: HOMEPAGE_SECTIONS });
  }
  try {
    const supabase = await createSupabaseServiceClient();
    const { data, error } = await supabase.from("homepage_sections").select("*").order("sort_order");
    if (error) return NextResponse.json({ data: HOMEPAGE_SECTIONS });
    return NextResponse.json({ data: data || HOMEPAGE_SECTIONS });
  } catch {
    return NextResponse.json({ data: HOMEPAGE_SECTIONS });
  }
}

export async function PATCH(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ success: false, message: "Supabase not configured" }, { status: 503 });
  }
  try {
    const { sections } = await request.json();
    const supabase = await createSupabaseServiceClient();
    for (const section of sections) {
      await supabase.from("homepage_sections").upsert(section, { onConflict: "slug" });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, message: String(e) }, { status: 500 });
  }
}
