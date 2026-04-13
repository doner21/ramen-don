"use client";

import { useState, useEffect } from "react";
import type { MenuCategory, MenuItem } from "@/lib/data/types";
import { MENU_CATEGORIES, MENU_ITEMS } from "@/lib/data/seed-data";

export default function MenuAdminPage() {
  const [categories, setCategories] = useState<MenuCategory[]>(MENU_CATEGORIES);
  const [items, setItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [activeCategory, setActiveCategory] = useState(MENU_CATEGORIES[0]?.slug || "");

  useEffect(() => {
    fetch("/api/admin/menu/categories").then((r) => r.json()).then((d) => {
      if (d.data) setCategories(d.data);
    }).catch(() => {});
    fetch("/api/admin/menu/items").then((r) => r.json()).then((d) => {
      if (d.data) setItems(d.data);
    }).catch(() => {});
  }, []);

  const catItems = items.filter((i) => i.category_slug === activeCategory);

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-[#F0EBE3] mb-2">Menu Management</h1>
      <p className="text-[#A09488] mb-8">View and edit menu categories and items.</p>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => setActiveCategory(cat.slug)}
            className={`px-4 py-2 text-sm font-medium transition-all ${
              activeCategory === cat.slug
                ? "bg-[#C8892A] text-[#1A1714]"
                : "bg-[#2C231D] border border-[#3D3229] text-[#A09488] hover:text-[#F0EBE3]"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Items list */}
      <div className="bg-[#2C231D] border border-[#3D3229]">
        <div className="p-4 border-b border-[#3D3229] flex items-center justify-between gap-4">
          <h2 className="font-medium text-[#F0EBE3]">
            {categories.find((c) => c.slug === activeCategory)?.name} Items ({catItems.length})
          </h2>
          <a
            href={`/menu#cat-${activeCategory}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-xs text-[#C8892A] hover:text-[#d9992f] transition-colors flex items-center gap-1"
          >
            View on site
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
        <div className="divide-y divide-[#3D3229]">
          {catItems.map((item, idx) => (
            <div key={item.id || item.name || idx} className="p-4 flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-[#F0EBE3]">{item.name}</p>
                {item.description && (
                  <p className="text-xs text-[#A09488] mt-1">{item.description}</p>
                )}
                {item.tags?.length ? (
                  <div className="flex gap-1 mt-1">
                    {item.tags.map((t) => (
                      <span key={t} className="text-xs bg-[#3D2B1F] text-[#C8892A] px-2 py-0.5">{t}</span>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="text-right shrink-0">
                {item.price !== undefined ? (
                  <span className="text-[#C8892A] font-semibold">£{item.price.toFixed(2)}</span>
                ) : item.price_variants?.length ? (
                  <div className="text-xs text-[#A09488]">
                    {item.price_variants.map((pv) => (
                      <div key={pv.label}>{pv.label}: £{pv.price.toFixed(2)}</div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-6 text-xs text-[#A09488]">
        Full CRUD editing (add/edit/delete items) requires Supabase to be configured.
      </p>
    </div>
  );
}
