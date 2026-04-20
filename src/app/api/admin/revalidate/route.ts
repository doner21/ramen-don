import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Invalidate the root layout and ALL nested segments beneath it (covers (public)/layout.tsx
    // which fetches getBookingOverlayImage() for Header and Footer — without this, the layout's
    // cached data fetch does not refresh and Header/Footer keep showing the stale overlay image).
    revalidatePath("/", "layout");

    // Public pages — redundant for data fetch after layout revalidation above,
    // but kept to ensure page-only caching layers are also busted.
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
    revalidatePath("/admin/signature-bowls", "page");
    revalidatePath("/admin/overlay-image", "page");

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
