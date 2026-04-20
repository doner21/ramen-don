import { getMenuCategories, getBookingOverlayImage } from "@/lib/data/fetchers";
import MenuCategory from "@/components/menu/MenuCategory";
import MenuNav from "@/components/menu/MenuNav";
import BookingCTA from "@/components/opentable/BookingCTA";
import { BOOKING_OVERLAY_FALLBACK_IMAGE, BOOKING_OVERLAY_FALLBACK_ALT } from "@/lib/data/constants";

export const metadata = {
  title: "Menu — Ramen Don Birmingham",
  description:
    "Explore our full menu of handcrafted ramen bowls, plates, cocktails, sake and more.",
};

export default async function MenuPage() {
  const [categories, rawOverlayImage] = await Promise.all([
    getMenuCategories(),
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
      {/* Hero banner */}
      <div className="pt-20 pb-10 px-4 bg-[#2C231D] text-center border-b border-[#3D3229]">
        <p className="font-sans text-xs tracking-[0.4em] uppercase text-[#C8892A] mb-3">Discover</p>
        <h1 className="font-display text-5xl lg:text-6xl font-semibold text-[#F0EBE3]">
          Our Menu
        </h1>
        <p className="mt-3 text-[#A09488] max-w-lg mx-auto">
          Handcrafted broths, bold flavours, and Japanese-inspired plates.
        </p>
      </div>

      <MenuNav categories={categories.map((c) => ({ slug: c.slug, name: c.name }))} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {categories.map((category) => (
          <MenuCategory key={category.slug} category={category} />
        ))}
      </div>

      <BookingCTA heading="Enjoyed the Menu?" subtext="Reserve your table and experience it in person." overlayImage={overlayImage} />
    </>
  );
}
