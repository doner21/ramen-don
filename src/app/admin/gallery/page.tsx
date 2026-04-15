"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import type { GalleryImage } from "@/lib/data/types";
import Button from "@/components/ui/Button";

export default function GalleryAdminPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const revalidate = async () => {
    try {
      await fetch("/api/admin/revalidate", { method: "POST" });
    } catch (err) {
      console.error("Revalidation failed:", err);
    }
  };

  async function fetchImages() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/gallery");
      const json = await res.json();
      setImages(json.data || []);
    } catch (err: any) {
      console.error("Error fetching gallery images:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");

      await revalidate();
      await fetchImages();
    } catch (err: any) {
      console.error("Error uploading image:", err);
      setError(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (image: GalleryImage) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const res = await fetch("/api/admin/gallery", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: image.id, local_path: image.local_path }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Delete failed");

      await revalidate();
      setImages(images.filter(img => img.id !== image.id));
    } catch (err: any) {
      alert("Error deleting image: " + err.message);
    }
  };

  const toggleHero = async (image: GalleryImage) => {
    const newValue = !image.is_hero;
    try {
      if (newValue === true) {
        const currentHeroes = images.filter(img => img.is_hero && img.id !== image.id);
        await Promise.all(
          currentHeroes.map(img =>
            fetch("/api/admin/gallery", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id: img.id, is_hero: false }),
            })
          )
        );
      }
      const res = await fetch("/api/admin/gallery", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: image.id, is_hero: newValue }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Update failed");
      await revalidate();
      setImages(images.map(img => {
        if (img.id === image.id) return { ...img, is_hero: newValue };
        if (newValue === true) return { ...img, is_hero: false };
        return img;
      }));
    } catch (err: any) {
      alert("Error updating image: " + err.message);
    }
  };

  const updateAltText = async (image: GalleryImage, newAlt: string) => {
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: image.id, alt_text: newAlt }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Update failed");

      await revalidate();
      setImages(images.map(img => img.id === image.id ? { ...img, alt_text: newAlt } : img));
    } catch (err: any) {
      console.error("Error updating alt text:", err);
    }
  };

  if (loading && images.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C8892A]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-[#F0EBE3] mb-2">Gallery Management</h1>
          <p className="text-[#A09488]">Manage brand photos and website imagery.</p>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleUpload}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="min-w-[160px]"
          >
            {uploading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-[#1A1714]" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </span>
            ) : "Upload Photo"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.map((img) => (
          <div key={img.id} className="group relative bg-[#2C231D] border border-[#3D3229] rounded-lg overflow-hidden flex flex-col">
            <div className="relative aspect-square">
              <Image
                src={img.storage_url || img.local_path || "/images/brand/hero_ramen.png"}
                alt={img.alt_text}
                fill
                className="object-cover transition-transform group-hover:scale-105 duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  onClick={() => toggleHero(img)}
                  className={`p-2 rounded-full ${img.is_hero ? 'bg-[#C8892A] text-[#1A1714]' : 'bg-[#1A1714] text-[#F0EBE3]'} hover:scale-110 transition-all`}
                  title={img.is_hero ? "Remove Hero Status" : "Mark as Hero"}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(img)}
                  className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 hover:scale-110 transition-all"
                  title="Delete Image"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              {img.is_hero && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-[#C8892A] text-[#1A1714] text-[10px] font-bold tracking-widest uppercase rounded-sm">
                  Hero
                </div>
              )}
            </div>
            <div className="p-4 space-y-3 bg-[#241C17] flex-1">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[#A09488] mb-1">Alt Text / Title</label>
                <input
                  type="text"
                  value={img.alt_text}
                  onChange={(e) => updateAltText(img, e.target.value)}
                  className="w-full bg-transparent border-b border-[#3D3229] text-[#F0EBE3] text-sm py-1 focus:outline-none focus:border-[#C8892A] transition-colors"
                  placeholder="Describe this image..."
                />
              </div>
              <p className="text-[10px] text-[#A09488] truncate opacity-50 font-mono">
                {img.filename}
              </p>
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && !loading && (
        <div className="text-center py-20 border-2 border-dashed border-[#3D3229] rounded-lg">
          <p className="text-[#A09488]">Your gallery is empty. Upload your first photo to get started.</p>
        </div>
      )}
    </div>
  );
}
