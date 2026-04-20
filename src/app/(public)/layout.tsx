export const dynamic = "force-dynamic";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getVenueDetails, getBookingOverlayImage } from "@/lib/data/fetchers";
import { BOOKING_OVERLAY_FALLBACK_IMAGE, BOOKING_OVERLAY_FALLBACK_ALT } from "@/lib/data/constants";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [venue, rawOverlayImage] = await Promise.all([
    getVenueDetails(),
    getBookingOverlayImage(),
  ]);

  const overlayImage = rawOverlayImage
    ? {
        src: rawOverlayImage.storage_url || rawOverlayImage.local_path || BOOKING_OVERLAY_FALLBACK_IMAGE,
        alt: rawOverlayImage.alt_text || BOOKING_OVERLAY_FALLBACK_ALT,
      }
    : null;

  return (
    <>
      <Header openTableUrl={venue.opentable_url} overlayImage={overlayImage} />
      <main className="flex-1">{children}</main>
      <Footer overlayImage={overlayImage} />
    </>
  );
}
