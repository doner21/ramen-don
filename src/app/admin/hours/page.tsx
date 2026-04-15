"use client";

import { useState, useEffect } from "react";
import type { OpeningHour } from "@/lib/data/types";
import Button from "@/components/ui/Button";

export default function HoursPage() {
  const [hours, setHours] = useState<OpeningHour[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHours();
  }, []);

  async function fetchHours() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/hours");
      const json = await res.json();
      setHours(json.data || []);
    } catch (err: any) {
      console.error("Error fetching opening hours:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const updateHour = (dayOfWeek: number, field: keyof OpeningHour, value: any) => {
    setHours(prev => prev.map(h => 
      h.day_of_week === dayOfWeek ? { ...h, [field]: value } : h
    ));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/hours", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hours }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Save failed");
      await fetch("/api/admin/revalidate", { method: "POST" });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      console.error("Error saving opening hours:", err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading && hours.length === 0) {
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
          <h1 className="font-display text-3xl font-semibold text-[#F0EBE3] mb-2">Opening Hours</h1>
          <p className="text-[#A09488]">Manage your restaurant's weekly trading schedule.</p>
        </div>
        <div className="flex items-center gap-4">
          {saved && (
            <span className="text-sm text-[#C8892A] flex items-center gap-1">
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

      <div className="grid grid-cols-1 gap-4">
        {hours.map((hour) => (
          <div key={hour.day_of_week} className="bg-[#2C231D] border border-[#3D3229] p-5 rounded-lg group hover:border-[#4D4239] transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-2 h-10 ${hour.is_closed ? 'bg-red-500/50' : 'bg-[#C8892A]'} rounded-full`}></div>
                <div>
                  <h3 className="font-display text-xl font-medium text-[#F0EBE3]">{hour.day_name}</h3>
                  <p className="text-xs text-[#A09488]">{hour.is_closed ? 'Closed all day' : 'Open for service'}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer group/toggle">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={!hour.is_closed}
                      onChange={(e) => updateHour(hour.day_of_week, "is_closed", !e.target.checked)}
                    />
                    <div className="w-10 h-5 bg-[#1A1714] border border-[#3D3229] rounded-full peer peer-checked:bg-[#C8892A]/20 peer-checked:border-[#C8892A]/50 transition-all"></div>
                    <div className="absolute top-1 left-1 w-3 h-3 bg-[#3D3229] rounded-full peer-checked:translate-x-5 peer-checked:bg-[#C8892A] transition-all"></div>
                  </div>
                  <span className="text-sm font-medium text-[#A09488] group-hover/toggle:text-[#F0EBE3] transition-colors">
                    {hour.is_closed ? "Closed" : "Open"}
                  </span>
                </label>

                {!hour.is_closed && (
                  <div className="flex flex-wrap items-center gap-4 border-l border-[#3D3229] pl-6">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-widest text-[#A09488]">Lunch</span>
                      <div className="flex items-center bg-[#1A1714] border border-[#3D3229] rounded overflow-hidden">
                        <input
                          type="time"
                          value={hour.lunch_open || ""}
                          onChange={(e) => updateHour(hour.day_of_week, "lunch_open", e.target.value || null)}
                          className="bg-transparent text-[#F0EBE3] text-xs px-2 py-1 focus:outline-none"
                        />
                        <span className="text-[#3D3229] text-[10px]">-</span>
                        <input
                          type="time"
                          value={hour.lunch_close || ""}
                          onChange={(e) => updateHour(hour.day_of_week, "lunch_close", e.target.value || null)}
                          className="bg-transparent text-[#F0EBE3] text-xs px-2 py-1 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-widest text-[#A09488]">Dinner</span>
                      <div className="flex items-center bg-[#1A1714] border border-[#3D3229] rounded overflow-hidden">
                        <input
                          type="time"
                          value={hour.dinner_open || ""}
                          onChange={(e) => updateHour(hour.day_of_week, "dinner_open", e.target.value || null)}
                          className="bg-transparent text-[#F0EBE3] text-xs px-2 py-1 focus:outline-none"
                        />
                        <span className="text-[#3D3229] text-[10px]">-</span>
                        <input
                          type="time"
                          value={hour.dinner_close || ""}
                          onChange={(e) => updateHour(hour.day_of_week, "dinner_close", e.target.value || null)}
                          className="bg-transparent text-[#F0EBE3] text-xs px-2 py-1 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {!hour.is_closed && (
              <div className="mt-4 pt-4 border-t border-[#3D3229]/50">
                <input
                  type="text"
                  placeholder="Add a special note (e.g. Bank Holiday hours, Kitchen closes early...)"
                  value={hour.note || ""}
                  onChange={(e) => updateHour(hour.day_of_week, "note", e.target.value || null)}
                  className="w-full bg-transparent text-xs text-[#A09488] italic focus:outline-none focus:text-[#F0EBE3] transition-colors"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
