"use client";

import { useState, useEffect } from "react";
import type { OpeningHour } from "@/lib/data/types";
import { OPENING_HOURS } from "@/lib/data/seed-data";

export default function HoursPage() {
  const [hours, setHours] = useState<OpeningHour[]>(OPENING_HOURS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/hours").then((r) => r.json()).then((d) => {
      if (d.data) setHours(d.data);
    }).catch(() => {});
  }, []);

  const update = (idx: number, field: string, value: string | boolean) => {
    setHours((prev) => prev.map((h, i) => i === idx ? { ...h, [field]: value } : h));
  };

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/hours", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hours }),
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

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl font-semibold text-[#F0EBE3] mb-2">Opening Hours</h1>
      <p className="text-[#A09488] mb-8">Edit your trading hours. Changes are saved to Supabase.</p>

      <div className="space-y-4">
        {hours.map((hour, idx) => (
          <div key={hour.day_of_week} className="bg-[#2C231D] border border-[#3D3229] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-[#F0EBE3]">{hour.day_name}</h3>
              <label className="flex items-center gap-2 text-sm text-[#A09488]">
                <input
                  type="checkbox"
                  checked={hour.is_closed}
                  onChange={(e) => update(idx, "is_closed", e.target.checked)}
                  className="accent-[#C8892A]"
                />
                Closed
              </label>
            </div>
            {!hour.is_closed && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="text-xs text-[#A09488] uppercase tracking-wider block mb-1">Lunch Open</label>
                  <input type="time" value={hour.lunch_open || ""} onChange={(e) => update(idx, "lunch_open", e.target.value)}
                    className="w-full bg-[#1A1714] border border-[#3D3229] text-[#F0EBE3] px-3 py-2 focus:outline-none focus:border-[#C8892A]" />
                </div>
                <div>
                  <label className="text-xs text-[#A09488] uppercase tracking-wider block mb-1">Lunch Close</label>
                  <input type="time" value={hour.lunch_close || ""} onChange={(e) => update(idx, "lunch_close", e.target.value)}
                    className="w-full bg-[#1A1714] border border-[#3D3229] text-[#F0EBE3] px-3 py-2 focus:outline-none focus:border-[#C8892A]" />
                </div>
                <div>
                  <label className="text-xs text-[#A09488] uppercase tracking-wider block mb-1">Dinner Open</label>
                  <input type="time" value={hour.dinner_open || ""} onChange={(e) => update(idx, "dinner_open", e.target.value)}
                    className="w-full bg-[#1A1714] border border-[#3D3229] text-[#F0EBE3] px-3 py-2 focus:outline-none focus:border-[#C8892A]" />
                </div>
                <div>
                  <label className="text-xs text-[#A09488] uppercase tracking-wider block mb-1">Dinner Close</label>
                  <input type="time" value={hour.dinner_close || ""} onChange={(e) => update(idx, "dinner_close", e.target.value)}
                    className="w-full bg-[#1A1714] border border-[#3D3229] text-[#F0EBE3] px-3 py-2 focus:outline-none focus:border-[#C8892A]" />
                </div>
              </div>
            )}
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
