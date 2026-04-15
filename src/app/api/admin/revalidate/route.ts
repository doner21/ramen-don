import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Public pages
    revalidatePath("/", "page");
    revalidatePath("/menu", "page");
    revalidatePath("/gallery", "page");
    revalidatePath("/reservations", "page");
    revalidatePath("/contact", "page");
    revalidatePath("/visit", "page");

    // Admin pages
    revalidatePath("/admin/menu", "page");
    revalidatePath("/admin/gallery", "page");
    revalidatePath("/admin/hours", "page");
    revalidatePath("/admin/venue", "page");
    revalidatePath("/admin/homepage", "page");

    return NextResponse.json({
      revalidated: true,
      now: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Revalidation failed", message: err.message },
      { status: 500 }
    );
  }
}
