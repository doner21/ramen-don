import { NextResponse } from "next/server";
import { isSupabaseConfigured, createSupabaseServiceClient } from "@/lib/supabase-server";
import { OPENING_HOURS } from "@/lib/data/seed-data";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ data: OPENING_HOURS });
  }
  try {
    const supabase = await createSupabaseServiceClient();
    const { data, error } = await supabase.from("opening_hours").select("*").order("day_of_week");
    if (error) return NextResponse.json({ data: OPENING_HOURS });
    return NextResponse.json({ data: data || OPENING_HOURS });
  } catch {
    return NextResponse.json({ data: OPENING_HOURS });
  }
}

export async function PATCH(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ success: false, message: "Supabase not configured" }, { status: 503 });
  }
  try {
    const { hours } = await request.json();
    const supabase = await createSupabaseServiceClient();
    for (const hour of hours) {
      await supabase.from("opening_hours").upsert(hour, { onConflict: "day_of_week" });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, message: String(e) }, { status: 500 });
  }
}
