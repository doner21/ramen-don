import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

const KEY = "booking_overlay_image_id";

export async function GET() {
  try {
    const supabase = createSupabaseAdminClient();
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", KEY)
      .maybeSingle();
    return NextResponse.json({ data: data?.value ?? null });
  } catch {
    return NextResponse.json({ data: null });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const galleryImageId: string | null = body?.gallery_image_id ?? null;
    const supabase = createSupabaseAdminClient();
    if (!galleryImageId) {
      const { error } = await supabase.from("site_settings").delete().eq("key", KEY);
      if (error) return NextResponse.json({ success: false, message: error.message }, { status: 500 });
      return NextResponse.json({ success: true });
    }
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key: KEY, value: galleryImageId });
    if (error) return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, message: String(e) }, { status: 500 });
  }
}
