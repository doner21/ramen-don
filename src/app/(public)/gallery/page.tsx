import GalleryGrid from "@/components/gallery/GalleryGrid";
import { getGalleryImages } from "@/lib/data/fetchers";

export const metadata = {
  title: "Gallery — Ramen Don Birmingham",
  description:
    "Take a look inside Ramen Don Birmingham — our bowls, atmosphere, and craft.",
};

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <>
      {/* Header */}
      <div className="pt-20 pb-10 px-4 bg-[#2C231D] text-center border-b border-[#3D3229]">
        <p className="font-sans text-xs tracking-[0.4em] uppercase text-[#C8892A] mb-3">Inside Ramen Don</p>
        <h1 className="font-display text-5xl lg:text-6xl font-semibold text-[#F0EBE3]">
          The Restaurant
        </h1>
        <p className="mt-3 text-[#A09488] max-w-md mx-auto">
          A glimpse into our world — from the kitchen to the table.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <GalleryGrid images={images} />
      </div>
    </>
  );
}
