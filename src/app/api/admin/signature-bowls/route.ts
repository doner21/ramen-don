import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import { SIGNATURE_BOWLS } from "@/lib/data/seed-data";

export async function GET() {
  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("signature_bowls")
      .select("*, gallery_images(storage_url, local_path, alt_text)")
      .order("sort_order");
    if (error) return NextResponse.json({ data: SIGNATURE_BOWLS });
    const mapped = (data || []).map((row: any) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      price: row.price,
      badge_label: row.badge_label,
      gallery_image_id: row.gallery_image_id,
      alt_text: row.alt_text,
      sort_order: row.sort_order,
      is_visible: row.is_visible,
      image_url: row.gallery_images?.storage_url ?? null,
      image_local_path: row.gallery_images?.local_path ?? null,
      image_alt_text: row.gallery_images?.alt_text ?? null,
    }));
    return NextResponse.json({ data: mapped.length > 0 ? mapped : SIGNATURE_BOWLS });
  } catch {
    return NextResponse.json({ data: SIGNATURE_BOWLS });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("signature_bowls")
      .insert([body])
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, ...fields } = await request.json();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("signature_bowls")
      .update(fields)
      .eq("id", id)
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.from("signature_bowls").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
