"use client";

import { useState, useEffect } from "react";
import type { VenueDetails } from "@/lib/data/types";
import Button from "@/components/ui/Button";

export default function VenuePage() {
  const [venue, setVenue] = useState<VenueDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVenue();
  }, []);

  async function fetchVenue() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/venue");
      const json = await res.json();
      setVenue(json.data || null);
    } catch (err: any) {
      console.error("Error fetching venue details:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const updateField = (field: keyof VenueDetails, value: string) => {
    if (!venue) return;
    setVenue({ ...venue, [field]: value });
  };

  const handleSave = async () => {
    if (!venue) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/venue", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(venue),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Save failed");
      await fetch("/api/admin/revalidate", { method: "POST" });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      console.error("Error saving venue details:", err);
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

  const fields: { key: keyof VenueDetails; label: string; type?: string }[] = [
    { key: "name", label: "Restaurant Name" },
    { key: "tagline", label: "Tagline" },
    { key: "address_line1", label: "Address Line 1" },
    { key: "address_line2", label: "Address Line 2" },
    { key: "city", label: "City" },
    { key: "county", label: "County" },
    { key: "postcode", label: "Postcode" },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email", type: "email" },
    { key: "instagram_url", label: "Instagram URL" },
    { key: "opentable_url", label: "OpenTable URL" },
  ];

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-[#F0EBE3] mb-2">Venue Details</h1>
        <p className="text-[#A09488]">Update your restaurant's contact information and address.</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded text-sm">
          {error}
        </div>
      )}

      <div className="bg-[#2C231D] border border-[#3D3229] p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map(({ key, label, type }) => (
            <div key={key} className={key === "tagline" || key === "opentable_url" || key === "instagram_url" ? "md:col-span-2" : ""}>
              <label className="block text-xs font-medium text-[#A09488] mb-1.5 uppercase tracking-wider">{label}</label>
              <input
                type={type || "text"}
                value={(venue?.[key] as string) || ""}
                onChange={(e) => updateField(key, e.target.value)}
                className="w-full bg-[#1A1714] border border-[#3D3229] text-[#F0EBE3] px-4 py-2.5 text-sm focus:outline-none focus:border-[#C8892A] transition-colors"
                placeholder={`Enter ${label.toLowerCase()}...`}
              />
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-[#3D3229] flex items-center justify-between">
          <p className="text-xs text-[#A09488]">
            Last updated: {venue?.id ? "Live on site" : "Not yet saved"}
          </p>
          <div className="flex items-center gap-4">
            {saved && (
              <span className="text-sm text-[#C8892A] flex items-center gap-1 animate-pulse">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Changes saved successfully
              </span>
            )}
            <Button
              onClick={handleSave}
              disabled={saving}
              className="min-w-[140px]"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-[#1A1714]" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
