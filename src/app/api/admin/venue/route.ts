import { NextResponse } from "next/server";
import { isSupabaseConfigured, createSupabaseServiceClient } from "@/lib/supabase-server";
import { VENUE_DETAILS } from "@/lib/data/seed-data";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ data: VENUE_DETAILS });
  }
  try {
    const supabase = await createSupabaseServiceClient();
    const { data, error } = await supabase.from("venue_details").select("*").single();
    if (error) return NextResponse.json({ data: VENUE_DETAILS });
    return NextResponse.json({ data: data || VENUE_DETAILS });
  } catch {
    return NextResponse.json({ data: VENUE_DETAILS });
  }
}

export async function PATCH(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ success: false, message: "Supabase not configured" }, { status: 503 });
  }
  try {
    const body = await request.json();
    const supabase = await createSupabaseServiceClient();
    const { error } = await supabase.from("venue_details").upsert(body);
    if (error) return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, message: String(e) }, { status: 500 });
  }
}
