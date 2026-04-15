import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const supabase = createSupabaseAdminClient();

    // 1. Create the 'gallery' bucket if it doesn't exist
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    if (listError) throw listError;

    const galleryBucket = buckets?.find((b) => b.id === "gallery");
    if (!galleryBucket) {
      const { error: createError } = await supabase.storage.createBucket("gallery", {
        public: true,
      });
      if (createError) throw createError;
    }

    // 2. Setup Storage Policies
    // We can't easily run SQL DDL via the JS client for storage policies if they aren't there,
    // but the 002 migration file exists for that.
    
    // 3. Verify database tables exist by trying to select from them
    const { error: tableError } = await supabase.from("menu_items").select("id").limit(1);
    if (tableError) {
       // Table might not exist
       return NextResponse.json({ 
         success: false, 
         error: "Database tables missing. Please run migrations/001_initial.sql in the Supabase SQL Editor.",
         code: tableError.code
       });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Gallery bucket ensured. Database tables are present." 
    });
  } catch (err: any) {
    console.error("Setup error:", err);
    return NextResponse.json({ 
      success: false, 
      error: err.message 
    }, { status: 500 });
  }
}
