"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import type { SignatureBowl, GalleryImage } from "@/lib/data/types";
import Button from "@/components/ui/Button";

export default function SignatureBowlsAdminPage() {
  const [bowls, setBowls] = useState<SignatureBowl[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBowl, setEditingBowl] = useState<SignatureBowl | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const revalidate = async () => {
    try {
      await fetch("/api/admin/revalidate", { method: "POST" });
    } catch (err) {
      console.error("Revalidation failed:", err);
    }
  };

  async function fetchData() {
    setLoading(true);
    try {
      const [bowlsRes, galleryRes] = await Promise.all([
        fetch("/api/admin/signature-bowls"),
        fetch("/api/admin/gallery"),
      ]);
      const [bowlsJson, galleryJson] = await Promise.all([bowlsRes.json(), galleryRes.json()]);
      setBowls(bowlsJson.data || []);
      setGalleryImages(galleryJson.data || []);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this bowl?")) return;
    try {
      const res = await fetch("/api/admin/signature-bowls", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Delete failed");
      await revalidate();
      setBowls(bowls.filter((b) => b.id !== id));
    } catch (err: any) {
      alert("Error deleting bowl: " + err.message);
    }
  };

  if (loading && bowls.length === 0) {
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
          <h1 className="font-display text-3xl font-semibold text-[#F0EBE3] mb-2">Signature Bowls</h1>
          <p className="text-[#A09488]">Manage the featured bowls shown on the homepage.</p>
        </div>
        <Button
          onClick={() => {
            setEditingBowl(null);
            setIsModalOpen(true);
          }}
        >
          Add Bowl
        </Button>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {bowls.map((bowl) => {
          const imgSrc = bowl.image_url || bowl.image_local_path || "/images/brand/signature_bowl.png";
          const imgAlt = bowl.alt_text || bowl.image_alt_text || bowl.name;
          return (
            <div key={bowl.id || bowl.name} className="group relative bg-[#2C231D] border border-[#3D3229] rounded-lg overflow-hidden flex flex-col">
              <div className="relative aspect-square">
                <Image
                  src={imgSrc}
                  alt={imgAlt}
                  fill
                  className="object-cover transition-transform group-hover:scale-105 duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                {bowl.badge_label && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-[#C8892A] text-[#1A1714] text-[10px] font-bold tracking-widest uppercase rounded-sm">
                    {bowl.badge_label}
                  </div>
                )}
                {!bowl.is_visible && (
                  <div className="absolute top-2 right-2 px-2 py-1 bg-[#3D3229] text-[#A09488] text-[10px] font-bold tracking-widest uppercase rounded-sm">
                    Hidden
                  </div>
                )}
              </div>
              <div className="p-4 flex-1 space-y-2 bg-[#241C17]">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-[#F0EBE3] text-sm">{bowl.name}</p>
                  {bowl.price && (
                    <span className="text-[#C8892A] font-semibold text-xs shrink-0">{bowl.price}</span>
                  )}
                </div>
                <p className="text-xs text-[#A09488] line-clamp-2">{bowl.description}</p>
                <p className="text-[10px] text-[#A09488] opacity-50 font-mono">Order: {bowl.sort_order ?? 0}</p>
              </div>
              <div className="p-3 border-t border-[#3D3229] bg-[#241C17] flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setEditingBowl(bowl);
                    setIsModalOpen(true);
                  }}
                  className="text-[#A09488] hover:text-[#C8892A] p-1 transition-colors"
                  title="Edit Bowl"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                {bowl.id && (
                  <button
                    onClick={() => handleDelete(bowl.id!)}
                    className="text-[#A09488] hover:text-red-500 p-1 transition-colors"
                    title="Delete Bowl"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {bowls.length === 0 && !loading && (
        <div className="text-center py-20 border-2 border-dashed border-[#3D3229] rounded-lg">
          <p className="text-[#A09488]">No signature bowls yet. Add your first bowl.</p>
        </div>
      )}

      {isModalOpen && (
        <BowlModal
          bowl={editingBowl}
          galleryImages={galleryImages}
          onGalleryUpdate={(newImage) => setGalleryImages((prev) => [newImage, ...prev])}
          onClose={() => setIsModalOpen(false)}
          onSave={async () => {
            await revalidate();
            await fetchData();
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

function BowlModal({
  bowl,
  galleryImages,
  onGalleryUpdate,
  onClose,
  onSave,
}: {
  bowl: SignatureBowl | null;
  galleryImages: GalleryImage[];
  onGalleryUpdate: (image: GalleryImage) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const [formData, setFormData] = useState<Partial<SignatureBowl>>(
    bowl
      ? {
          name: bowl.name,
          description: bowl.description,
          price: bowl.price ?? "",
          badge_label: bowl.badge_label ?? "",
          gallery_image_id: bowl.gallery_image_id ?? null,
          alt_text: bowl.alt_text ?? "",
          sort_order: bowl.sort_order ?? 0,
          is_visible: bowl.is_visible ?? true,
        }
      : {
          name: "",
          description: "",
          price: "",
          badge_label: "",
          gallery_image_id: null,
          alt_text: "",
          sort_order: 0,
          is_visible: true,
        }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload: any = {
        name: formData.name,
        description: formData.description,
        price: formData.price || null,
        badge_label: formData.badge_label || null,
        gallery_image_id: formData.gallery_image_id || null,
        alt_text: formData.alt_text || null,
        sort_order: formData.sort_order ?? 0,
        is_visible: formData.is_visible ?? true,
      };

      let res: Response;
      if (bowl?.id) {
        res = await fetch("/api/admin/signature-bowls", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: bowl.id, ...payload }),
        });
      } else {
        res = await fetch("/api/admin/signature-bowls", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed");
      onSave();
    } catch (err: any) {
      alert("Error saving bowl: " + (err.message || "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        body: formDataUpload,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");

      const newImage: GalleryImage = json.data;
      onGalleryUpdate(newImage);
      setFormData((prev) => ({ ...prev, gallery_image_id: newImage.id ?? null }));
    } catch (err: any) {
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-start justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-[#2C231D] border border-[#3D3229] p-6 rounded-lg w-full max-w-2xl my-8">
        <h3 className="text-xl font-semibold text-[#F0EBE3] mb-6">
          {bowl ? "Edit Signature Bowl" : "Add Signature Bowl"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-[#A09488] mb-1">Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#1A1714] border border-[#3D3229] text-[#F0EBE3] px-3 py-2 text-sm focus:outline-none focus:border-[#C8892A]"
              placeholder="e.g. Kotteri Pork"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-[#A09488] mb-1">Description *</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#1A1714] border border-[#3D3229] text-[#F0EBE3] px-3 py-2 text-sm focus:outline-none focus:border-[#C8892A] h-20"
              placeholder="Describe the bowl..."
            />
          </div>

          {/* Price + Badge */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#A09488] mb-1">Price</label>
              <input
                type="text"
                value={formData.price ?? ""}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-[#1A1714] border border-[#3D3229] text-[#F0EBE3] px-3 py-2 text-sm focus:outline-none focus:border-[#C8892A]"
                placeholder="£16"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#A09488] mb-1">Badge Label</label>
              <input
                type="text"
                value={formData.badge_label ?? ""}
                onChange={(e) => setFormData({ ...formData, badge_label: e.target.value })}
                className="w-full bg-[#1A1714] border border-[#3D3229] text-[#F0EBE3] px-3 py-2 text-sm focus:outline-none focus:border-[#C8892A]"
                placeholder="Chef's Pick"
              />
            </div>
          </div>

          {/* Sort order + Visible */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#A09488] mb-1">Sort Order</label>
              <input
                type="number"
                value={formData.sort_order ?? 0}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                className="w-full bg-[#1A1714] border border-[#3D3229] text-[#F0EBE3] px-3 py-2 text-sm focus:outline-none focus:border-[#C8892A]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#A09488] mb-1">Visibility</label>
              <label className="flex items-center mt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_visible ?? true}
                  onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-[#1A1714] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#A09488] after:border-[#A09488] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C8892A] peer-checked:after:bg-[#1A1714]"></div>
                <span className="ml-3 text-sm text-[#F0EBE3]">{formData.is_visible ? "Visible" : "Hidden"}</span>
              </label>
            </div>
          </div>

          {/* Alt text override */}
          <div>
            <label className="block text-xs font-medium text-[#A09488] mb-1">Alt Text Override</label>
            <input
              type="text"
              value={formData.alt_text ?? ""}
              onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
              className="w-full bg-[#1A1714] border border-[#3D3229] text-[#F0EBE3] px-3 py-2 text-sm focus:outline-none focus:border-[#C8892A]"
              placeholder="Leave blank to use gallery image alt text"
            />
          </div>

          {/* Image picker */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-medium text-[#A09488]">Image</label>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleUpload}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="text-xs text-[#C8892A] border border-[#C8892A] px-2 py-1 hover:bg-[#C8892A] hover:text-[#1A1714] transition-all disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : "Upload new"}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto border border-[#3D3229] p-2 bg-[#1A1714]">
              {/* No image option */}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, gallery_image_id: null })}
                className={`relative aspect-square border-2 flex items-center justify-center text-[10px] text-[#A09488] transition-all ${
                  !formData.gallery_image_id
                    ? "border-[#C8892A] bg-[#C8892A]/10"
                    : "border-[#3D3229] hover:border-[#A09488]"
                }`}
              >
                None
              </button>
              {galleryImages.map((img) => {
                const isSelected = formData.gallery_image_id === img.id;
                return (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, gallery_image_id: img.id ?? null })}
                    className={`relative aspect-square border-2 overflow-hidden transition-all ${
                      isSelected
                        ? "border-[#C8892A]"
                        : "border-[#3D3229] hover:border-[#A09488]"
                    }`}
                    title={img.alt_text}
                  >
                    <Image
                      src={img.storage_url || img.local_path || "/images/brand/hero_ramen.png"}
                      alt={img.alt_text}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                );
              })}
            </div>
            {galleryImages.length === 0 && (
              <p className="text-xs text-[#A09488] mt-1">No gallery images yet. Upload one above.</p>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-[#A09488] hover:text-[#F0EBE3]"
              disabled={isSubmitting || uploading}
            >
              Cancel
            </button>
            <Button type="submit" size="sm" disabled={isSubmitting || uploading}>
              {isSubmitting ? "Saving..." : bowl ? "Update Bowl" : "Create Bowl"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
