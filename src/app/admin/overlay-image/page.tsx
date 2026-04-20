"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { GalleryImage } from "@/lib/data/types";
import Button from "@/components/ui/Button";

export default function OverlayImagePage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [previewReady, setPreviewReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const [galleryRes, settingRes] = await Promise.all([
        fetch("/api/admin/gallery"),
        fetch("/api/admin/overlay-image"),
      ]);
      const galleryJson = await galleryRes.json();
      const settingJson = await settingRes.json();
      setImages(galleryJson.data || []);
      setSelectedId(settingJson.data || null);
    } catch (err: any) {
      console.error("Error fetching overlay image data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const revalidate = async () => {
    try {
      await fetch("/api/admin/revalidate", { method: "POST" });
    } catch (err) {
      console.error("Revalidation failed:", err);
    }
  };

  const handleSelect = async (imageId: string) => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/overlay-image", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gallery_image_id: imageId }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Save failed");
      await revalidate();
      setSelectedId(imageId);
      setSaved(true);
      setPreviewReady(true);
      setTimeout(() => { setSaved(false); setPreviewReady(false); }, 3000);
    } catch (err: any) {
      console.error("Error selecting overlay image:", err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUseDefault = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/overlay-image", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gallery_image_id: null }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Save failed");
      await revalidate();
      setSelectedId(null);
      setSaved(true);
      setPreviewReady(true);
      setTimeout(() => { setSaved(false); setPreviewReady(false); }, 3000);
    } catch (err: any) {
      console.error("Error clearing overlay image:", err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
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
          <h1 className="font-display text-3xl font-semibold text-[#F0EBE3] mb-2">Booking Overlay Image</h1>
          <p className="text-[#A09488]">
            Choose the photo shown in the left panel when visitors open the booking modal.
            Defaults to the hero ramen image when none is selected.
          </p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          {saved && (
            <span className="text-sm text-[#C8892A] flex items-center gap-1 animate-pulse">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Saved
            </span>
          )}
          {previewReady && (
            <button
              type="button"
              onClick={() => window.open("/", "_blank")}
              className="text-sm text-[#F0EBE3] underline underline-offset-2 hover:text-[#C8892A] transition-colors"
            >
              Preview &rarr;
            </button>
          )}
          <Button
            onClick={handleUseDefault}
            disabled={saving || selectedId === null}
            className="min-w-[140px]"
          >
            Use Default
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded text-sm">
          {error}
        </div>
      )}

      {images.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-[#3D3229] rounded-lg">
          <p className="text-[#A09488] mb-4">No gallery photos yet. Upload photos first to select one for the booking overlay.</p>
          <Link
            href="/admin/gallery"
            className="inline-flex items-center gap-2 text-[#C8892A] hover:underline text-sm font-medium"
          >
            Go to Gallery
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </div>
      ) : (
        <>
          <p className="text-xs text-[#A09488] uppercase tracking-widest">
            Click a photo to select it as the booking overlay image
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {images.filter((img) => !!img.id).map((img) => {
              const imageId = img.id as string;
              const isSelected = imageId === selectedId;
              return (
                <button
                  key={imageId}
                  type="button"
                  onClick={() => handleSelect(imageId)}
                  disabled={saving}
                  className={`group relative aspect-square overflow-hidden rounded-lg border-2 transition-all focus:outline-none ${
                    isSelected
                      ? "border-[#C8892A] ring-2 ring-[#C8892A] ring-offset-2 ring-offset-[#1A1714]"
                      : "border-[#3D3229] hover:border-[#C8892A]/60"
                  }`}
                  title={img.alt_text || img.filename}
                >
                  <Image
                    src={img.storage_url || img.local_path || "/images/brand/hero_ramen.png"}
                    alt={img.alt_text}
                    fill
                    className="object-cover transition-transform group-hover:scale-105 duration-500"
                    sizes="(max-width: 768px) 50vw, 200px"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-[#C8892A]/20 flex items-center justify-center">
                      <div className="bg-[#C8892A] rounded-full p-1.5">
                        <svg className="w-4 h-4 text-[#1A1714]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}

      {selectedId === null && (
        <div className="bg-[#2C231D] border border-[#3D3229] rounded-lg p-4 flex items-center gap-4">
          <div className="relative w-16 h-16 shrink-0 rounded overflow-hidden">
            <Image
              src="/images/brand/hero_ramen.png"
              alt="Default overlay image"
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-[#F0EBE3]">Using default image</p>
            <p className="text-xs text-[#A09488] mt-0.5">/images/brand/hero_ramen.png</p>
          </div>
        </div>
      )}
    </div>
  );
}
