import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import { OPENING_HOURS } from "@/lib/data/seed-data";

export async function GET() {
  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.from("opening_hours").select("*").order("day_of_week");
    if (error) return NextResponse.json({ data: OPENING_HOURS });
    return NextResponse.json({ data: data || OPENING_HOURS });
  } catch {
    return NextResponse.json({ data: OPENING_HOURS });
  }
}

export async function PATCH(request: Request) {
  try {
    const { hours } = await request.json();
    const supabase = createSupabaseAdminClient();
    for (const hour of hours) {
      const { id, created_at, updated_at, ...fields } = hour as any;
      const { error } = await supabase
        .from("opening_hours")
        .upsert(
          { ...fields, day_of_week: hour.day_of_week },
          { onConflict: "day_of_week" }
        );
      if (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
      }
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, message: String(e) }, { status: 500 });
  }
}
