import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import { VENUE_DETAILS } from "@/lib/data/seed-data";

export async function GET() {
  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.from("venue_details").select("*").single();
    if (error) return NextResponse.json({ data: VENUE_DETAILS });
    return NextResponse.json({ data: data || VENUE_DETAILS });
  } catch {
    return NextResponse.json({ data: VENUE_DETAILS });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.from("venue_details").upsert(body);
    if (error) return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, message: String(e) }, { status: 500 });
  }
}
