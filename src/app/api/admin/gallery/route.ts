import { NextResponse } from "next/server";
import { isSupabaseConfigured, createSupabaseServiceClient } from "@/lib/supabase-server";
import { GALLERY_IMAGES } from "@/lib/data/seed-data";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ data: GALLERY_IMAGES });
  }
  try {
    const supabase = await createSupabaseServiceClient();
    const { data, error } = await supabase.from("gallery_images").select("*").order("sort_order");
    if (error) return NextResponse.json({ data: GALLERY_IMAGES });
    return NextResponse.json({ data: data || GALLERY_IMAGES });
  } catch {
    return NextResponse.json({ data: GALLERY_IMAGES });
  }
}
