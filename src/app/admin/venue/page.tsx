"use client";

import { useState, useEffect } from "react";
import type { VenueDetails } from "@/lib/data/types";
import { VENUE_DETAILS } from "@/lib/data/seed-data";

export default function VenuePage() {
  const [venue, setVenue] = useState<VenueDetails>(VENUE_DETAILS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/venue").then((r) => r.json()).then((d) => {
      if (d.data) setVenue(d.data);
    }).catch(() => {});
  }, []);

  const update = (field: keyof VenueDetails, value: string) => {
    setVenue((prev) => ({ ...prev, [field]: value }));
  };

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/venue", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(venue),
      });
      if (!res.ok) throw new Error("Failed to save");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError(String(e));
    } finally {
      setSaving(false);
    }
  };

  const fields: { key: keyof VenueDetails; label: string; type?: string }[] = [
    { key: "name", label: "Restaurant Name" },
    { key: "address_line1", label: "Address Line 1" },
    { key: "address_line2", label: "Address Line 2" },
    { key: "city", label: "City" },
    { key: "county", label: "County" },
    { key: "postcode", label: "Postcode" },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email", type: "email" },
    { key: "instagram_url", label: "Instagram URL" },
    { key: "opentable_url", label: "OpenTable URL" },
    { key: "tagline", label: "Tagline" },
  ];

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl font-semibold text-[#F0EBE3] mb-2">Venue Details</h1>
      <p className="text-[#A09488] mb-8">Update your restaurant information.</p>

      <div className="bg-[#2C231D] border border-[#3D3229] p-6 space-y-5">
        {fields.map(({ key, label, type }) => (
          <div key={key}>
            <label className="block text-xs tracking-widest uppercase text-[#A09488] mb-2">{label}</label>
            <input
              type={type || "text"}
              value={(venue[key] as string) || ""}
              onChange={(e) => update(key, e.target.value)}
              className="w-full bg-[#1A1714] border border-[#3D3229] text-[#F0EBE3] px-4 py-2.5 text-sm focus:outline-none focus:border-[#C8892A] transition-colors"
            />
          </div>
        ))}
      </div>

      {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}

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
