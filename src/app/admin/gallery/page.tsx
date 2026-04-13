"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { GalleryImage } from "@/lib/data/types";
import { GALLERY_IMAGES } from "@/lib/data/seed-data";

export default function GalleryAdminPage() {
  const [images, setImages] = useState<GalleryImage[]>(GALLERY_IMAGES);

  useEffect(() => {
    fetch("/api/admin/gallery").then((r) => r.json()).then((d) => {
      if (d.data) setImages(d.data);
    }).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-[#F0EBE3] mb-2">Gallery</h1>
      <p className="text-[#A09488] mb-8">Manage brand photos. Upload via Supabase Storage.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img, idx) => (
          <div key={img.id || img.filename || idx} className="bg-[#2C231D] border border-[#3D3229] overflow-hidden">
            <div className="relative aspect-square">
              <Image
                src={img.local_path || "/images/brand/hero_ramen.png"}
                alt={img.alt_text}
                fill
                className="object-cover"
                quality={70}
              />
              {img.is_hero && (
                <span className="absolute top-2 left-2 bg-[#C8892A] text-[#1A1714] text-xs font-bold px-2 py-0.5">HERO</span>
              )}
            </div>
            <div className="p-3">
              <p className="text-xs text-[#F0EBE3] truncate">{img.filename}</p>
              <p className="text-xs text-[#A09488] mt-1 line-clamp-2">{img.alt_text}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 text-xs text-[#A09488]">
        Image upload and management requires Supabase Storage to be configured.
      </p>
    </div>
  );
}
