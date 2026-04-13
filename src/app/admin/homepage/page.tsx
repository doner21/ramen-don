"use client";

import { useState, useEffect } from "react";
import type { HomepageSection } from "@/lib/data/types";
import { HOMEPAGE_SECTIONS } from "@/lib/data/seed-data";

export default function HomepageAdminPage() {
  const [sections, setSections] = useState<HomepageSection[]>(HOMEPAGE_SECTIONS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/homepage").then((r) => r.json()).then((d) => {
      if (d.data) setSections(d.data);
    }).catch(() => {});
  }, []);

  const update = (idx: number, field: keyof HomepageSection, value: string | boolean) => {
    setSections((prev) => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };

  const save = async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/homepage", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl font-semibold text-[#F0EBE3] mb-2">Homepage Sections</h1>
      <p className="text-[#A09488] mb-8">Edit homepage section content and visibility.</p>

      <div className="space-y-6">
        {sections.map((section, idx) => (
          <div key={section.slug} className="bg-[#2C231D] border border-[#3D3229] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-[#C8892A] uppercase tracking-wider text-sm">{section.slug}</h3>
              <label className="flex items-center gap-2 text-sm text-[#A09488]">
                <input
                  type="checkbox"
                  checked={section.is_visible ?? true}
                  onChange={(e) => update(idx, "is_visible", e.target.checked)}
                  className="accent-[#C8892A]"
                />
                Visible
              </label>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {section.heading !== undefined && (
                <div>
                  <label className="text-xs text-[#A09488] uppercase tracking-wider block mb-1">Heading</label>
                  <input
                    type="text"
                    value={section.heading || ""}
                    onChange={(e) => update(idx, "heading", e.target.value)}
                    className="w-full bg-[#1A1714] border border-[#3D3229] text-[#F0EBE3] px-3 py-2 text-sm focus:outline-none focus:border-[#C8892A]"
                  />
                </div>
              )}
              {section.body !== undefined && (
                <div>
                  <label className="text-xs text-[#A09488] uppercase tracking-wider block mb-1">Body Text</label>
                  <textarea
                    rows={3}
                    value={section.body || ""}
                    onChange={(e) => update(idx, "body", e.target.value)}
                    className="w-full bg-[#1A1714] border border-[#3D3229] text-[#F0EBE3] px-3 py-2 text-sm focus:outline-none focus:border-[#C8892A] resize-y"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="mt-6 bg-[#C8892A] text-[#1A1714] font-semibold px-8 py-3 hover:bg-[#d9992f] transition-colors disabled:opacity-50"
      >
        {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
      </button>
    </div>
  );
}
