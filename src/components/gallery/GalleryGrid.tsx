import Image from "next/image";
import type { GalleryImage } from "@/lib/data/types";

interface GalleryGridProps {
  images: GalleryImage[];
}

export default function GalleryGrid({ images }: GalleryGridProps) {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
      {images.map((img, idx) => (
        <div key={img.id || img.filename || idx} className="break-inside-avoid relative overflow-hidden group">
          <div className="relative aspect-square lg:aspect-auto">
            <Image
              src={img.local_path || img.storage_url || "/images/brand/hero_ramen.png"}
              alt={img.alt_text}
              width={600}
              height={600}
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
              quality={85}
            />
          </div>
          <div className="absolute inset-0 bg-[#1A1714]/0 group-hover:bg-[#1A1714]/30 transition-all duration-300 flex items-end">
            <p className="p-4 text-sm text-[#F0EBE3] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {img.alt_text}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
