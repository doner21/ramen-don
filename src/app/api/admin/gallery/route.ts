import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import { GALLERY_IMAGES } from "@/lib/data/seed-data";

export async function GET() {
  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.from("gallery_images").select("*").order("sort_order");
    if (error) return NextResponse.json({ data: GALLERY_IMAGES });
    return NextResponse.json({ data: data || GALLERY_IMAGES });
  } catch {
    return NextResponse.json({ data: GALLERY_IMAGES });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;

    const supabase = createSupabaseAdminClient();

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from("gallery")
      .upload(fileName, buffer, { contentType: file.type });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: { publicUrl } } = supabase.storage.from("gallery").getPublicUrl(fileName);

    const { count } = await supabase
      .from("gallery_images")
      .select("id", { count: "exact", head: true });

    const { data, error: dbError } = await supabase
      .from("gallery_images")
      .insert([{
        filename: fileName,
        alt_text: file.name.replace(/\.[^.]+$/, ""),
        local_path: fileName,
        storage_url: publicUrl,
        sort_order: count ?? 0,
        is_hero: false,
      }])
      .select()
      .single();

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, ...fields } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase
      .from("gallery_images")
      .update(fields)
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id, local_path } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }
    const supabase = createSupabaseAdminClient();

    if (local_path) {
      await supabase.storage.from("gallery").remove([local_path]);
    }

    const { error } = await supabase.from("gallery_images").delete().eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
