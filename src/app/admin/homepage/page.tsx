"use client";

import { useState, useEffect } from "react";
import type { HomepageSection } from "@/lib/data/types";
import Button from "@/components/ui/Button";

export default function HomepageAdminPage() {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSections();
  }, []);

  async function fetchSections() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/homepage");
      const json = await res.json();
      setSections(json.data || []);
    } catch (err: any) {
      console.error("Error fetching homepage sections:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const updateSection = (id: string, field: keyof HomepageSection, value: any) => {
    setSections(prev => prev.map(s =>
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/homepage", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Save failed");
      await fetch("/api/admin/revalidate", { method: "POST" });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      console.error("Error saving homepage sections:", err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading && sections.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C8892A]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-[#F0EBE3] mb-2">Homepage Content</h1>
          <p className="text-[#A09488]">Edit the text and visibility of each section on your landing page.</p>
        </div>
        <div className="flex items-center gap-4">
          {saved && (
            <span className="text-sm text-[#C8892A] flex items-center gap-1 animate-pulse">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Saved
            </span>
          )}
          <Button onClick={handleSave} disabled={saving} size="sm">
            {saving ? "Saving..." : "Save All Changes"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded text-sm">
          {error}
        </div>
      )}

      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.id} className="bg-[#2C231D] border border-[#3D3229] rounded-lg overflow-hidden transition-all hover:border-[#4D4239]">
            <div className="bg-[#241C17] px-6 py-4 border-b border-[#3D3229] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#1A1714] border border-[#3D3229] flex items-center justify-center text-[10px] font-mono text-[#C8892A] rounded">
                  {section.sort_order}
                </div>
                <h3 className="font-display text-lg font-medium text-[#F0EBE3] capitalize">{section.slug.replace(/-/g, ' ')}</h3>
              </div>
              <label className="flex items-center gap-3 cursor-pointer group/toggle">
                <span className="text-xs font-medium text-[#A09488] group-hover/toggle:text-[#F0EBE3] transition-colors">
                  {section.is_visible ? "Visible" : "Hidden"}
                </span>
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={section.is_visible}
                    onChange={(e) => updateSection(section.id!, "is_visible", e.target.checked)}
                  />
                  <div className="w-10 h-5 bg-[#1A1714] border border-[#3D3229] rounded-full peer peer-checked:bg-[#C8892A]/20 peer-checked:border-[#C8892A]/50 transition-all"></div>
                  <div className="absolute top-1 left-1 w-3 h-3 bg-[#3D3229] rounded-full peer-checked:translate-x-5 peer-checked:bg-[#C8892A] transition-all"></div>
                </div>
              </label>
            </div>
            
            <div className={`p-6 space-y-6 transition-opacity duration-300 ${section.is_visible ? 'opacity-100' : 'opacity-40'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {section.heading !== undefined && (
                  <div className="md:col-span-2">
                    <label className="block text-[10px] uppercase tracking-widest text-[#A09488] mb-1.5 font-bold">Section Heading</label>
                    <input
                      type="text"
                      value={section.heading || ""}
                      onChange={(e) => updateSection(section.id!, "heading", e.target.value)}
                      className="w-full bg-[#1A1714] border border-[#3D3229] text-[#F0EBE3] px-4 py-2.5 text-sm focus:outline-none focus:border-[#C8892A] transition-colors"
                      placeholder="Enter heading..."
                    />
                  </div>
                )}
                
                {section.subheading !== undefined && (
                  <div className="md:col-span-2">
                    <label className="block text-[10px] uppercase tracking-widest text-[#A09488] mb-1.5 font-bold">Subheading / Intro</label>
                    <input
                      type="text"
                      value={section.subheading || ""}
                      onChange={(e) => updateSection(section.id!, "subheading", e.target.value)}
                      className="w-full bg-[#1A1714] border border-[#3D3229] text-[#F0EBE3] px-4 py-2.5 text-sm focus:outline-none focus:border-[#C8892A] transition-colors"
                      placeholder="Enter subheading..."
                    />
                  </div>
                )}

                {section.body !== undefined && (
                  <div className="md:col-span-2">
                    <label className="block text-[10px] uppercase tracking-widest text-[#A09488] mb-1.5 font-bold">Body Content</label>
                    <textarea
                      rows={5}
                      value={section.body || ""}
                      onChange={(e) => updateSection(section.id!, "body", e.target.value)}
                      className="w-full bg-[#1A1714] border border-[#3D3229] text-[#F0EBE3] px-4 py-3 text-sm focus:outline-none focus:border-[#C8892A] transition-colors resize-y leading-relaxed"
                      placeholder="Write the section content here..."
                    />
                  </div>
                )}

                {section.cta_text !== undefined && (
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#A09488] mb-1.5 font-bold">Button Text (CTA)</label>
                    <input
                      type="text"
                      value={section.cta_text || ""}
                      onChange={(e) => updateSection(section.id!, "cta_text", e.target.value)}
                      className="w-full bg-[#1A1714] border border-[#3D3229] text-[#F0EBE3] px-4 py-2.5 text-sm focus:outline-none focus:border-[#C8892A] transition-colors"
                      placeholder="e.g. View Menu"
                    />
                  </div>
                )}

                {section.cta_url !== undefined && (
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#A09488] mb-1.5 font-bold">Button Link (URL)</label>
                    <input
                      type="text"
                      value={section.cta_url || ""}
                      onChange={(e) => updateSection(section.id!, "cta_url", e.target.value)}
                      className="w-full bg-[#1A1714] border border-[#3D3229] text-[#F0EBE3] px-4 py-2.5 text-sm focus:outline-none focus:border-[#C8892A] transition-colors font-mono"
                      placeholder="e.g. /menu"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
