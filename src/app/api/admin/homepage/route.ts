import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import { HOMEPAGE_SECTIONS } from "@/lib/data/seed-data";

export async function GET() {
  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.from("homepage_sections").select("*").order("sort_order");
    if (error) return NextResponse.json({ data: HOMEPAGE_SECTIONS });
    return NextResponse.json({ data: data || HOMEPAGE_SECTIONS });
  } catch {
    return NextResponse.json({ data: HOMEPAGE_SECTIONS });
  }
}

export async function PATCH(request: Request) {
  try {
    const { sections } = await request.json();
    const supabase = createSupabaseAdminClient();
    for (const section of sections) {
      await supabase.from("homepage_sections").upsert(section, { onConflict: "slug" });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, message: String(e) }, { status: 500 });
  }
}
