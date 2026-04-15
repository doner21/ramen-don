import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import { MENU_ITEMS } from "@/lib/data/seed-data";

export async function GET() {
  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.from("menu_items").select("*").order("sort_order");
    if (error) return NextResponse.json({ data: MENU_ITEMS });
    return NextResponse.json({ data: data || MENU_ITEMS });
  } catch {
    return NextResponse.json({ data: MENU_ITEMS });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.from("menu_items").insert([body]).select().single();
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
    const { data, error } = await supabase.from("menu_items").update(fields).eq("id", id).select().single();
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
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
