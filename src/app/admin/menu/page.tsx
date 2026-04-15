"use client";

import { useState, useEffect } from "react";
import type { MenuCategory, MenuItem } from "@/lib/data/types";
import Button from "@/components/ui/Button";

export default function MenuAdminPage() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);

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
      const [catsRes, itemsRes] = await Promise.all([
        fetch("/api/admin/menu/categories"),
        fetch("/api/admin/menu/items"),
      ]);
      const [catsJson, itemsJson] = await Promise.all([catsRes.json(), itemsRes.json()]);
      const cats: MenuCategory[] = catsJson.data || [];
      const menuItems: MenuItem[] = itemsJson.data || [];
      setCategories(cats);
      setItems(menuItems);
      if (cats.length > 0 && !activeCategory) {
        setActiveCategory(cats[0].id || null);
      }
    } catch (err: any) {
      console.error("Error fetching menu data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await fetch("/api/admin/menu/items", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Delete failed");
      await revalidate();
      setItems(items.filter((i) => i.id !== id));
    } catch (err: any) {
      alert("Error deleting item: " + err.message);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? All items in this category will also be deleted.")) return;
    try {
      const res = await fetch("/api/admin/menu/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Delete failed");
      await revalidate();
      setCategories(categories.filter((c) => c.id !== id));
      setItems(items.filter((i) => i.category_id !== id));
      if (activeCategory === id) {
        setActiveCategory(categories.find((c) => c.id !== id)?.id || null);
      }
    } catch (err: any) {
      alert("Error deleting category: " + err.message);
    }
  };

  const activeCategoryData = categories.find((c) => c.id === activeCategory);
  const catItems = items.filter((i) => i.category_id === activeCategory);

  if (loading && categories.length === 0) {
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
          <h1 className="font-display text-3xl font-semibold text-[#F0EBE3] mb-2">Menu Management</h1>
          <p className="text-[#A09488]">Manage categories and items in your menu.</p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setEditingCategory(null);
              setIsCategoryModalOpen(true);
            }}
          >
            Add Category
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setEditingItem(null);
              setIsItemModalOpen(true);
            }}
          >
            Add Item
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded text-sm">
          {error}
        </div>
      )}

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <div key={cat.id} className="group relative">
            <button
              onClick={() => setActiveCategory(cat.id || null)}
              className={`px-4 py-2 text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? "bg-[#C8892A] text-[#1A1714]"
                  : "bg-[#2C231D] border border-[#3D3229] text-[#A09488] hover:text-[#F0EBE3]"
              }`}
            >
              {cat.name}
            </button>
            {activeCategory === cat.id && (
              <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => {
                    setEditingCategory(cat);
                    setIsCategoryModalOpen(true);
                  }}
                  className="bg-[#2C231D] p-1 border border-[#3D3229] text-[#C8892A] hover:text-[#F0EBE3]"
                  title="Edit Category"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteCategory(cat.id!)}
                  className="bg-[#2C231D] p-1 border border-[#3D3229] text-red-500 hover:text-red-400"
                  title="Delete Category"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Items list */}
      {activeCategory && (
        <div className="bg-[#2C231D] border border-[#3D3229] rounded-lg overflow-hidden">
          <div className="p-4 border-b border-[#3D3229] flex items-center justify-between bg-[#241C17]">
            <div>
              <h2 className="font-medium text-[#F0EBE3]">{activeCategoryData?.name}</h2>
              <p className="text-xs text-[#A09488]">{activeCategoryData?.description}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-[#A09488]">{catItems.length} items</span>
              <a
                href={`/menu#cat-${activeCategoryData?.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#C8892A] hover:underline flex items-center gap-1"
              >
                View on site
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
          <div className="divide-y divide-[#3D3229]">
            {catItems.length === 0 ? (
              <div className="p-8 text-center text-[#A09488]">
                No items in this category yet.
              </div>
            ) : (
              catItems.map((item) => (
                <div key={item.id} className="p-4 flex items-start justify-between gap-4 hover:bg-[#342A22] transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-[#F0EBE3]">{item.name}</p>
                      {!item.is_available && (
                        <span className="text-[10px] bg-red-900/30 text-red-400 px-1.5 py-0.5 border border-red-900/50">OUT OF STOCK</span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-xs text-[#A09488] mt-1 line-clamp-2">{item.description}</p>
                    )}
                    {item.tags?.length ? (
                      <div className="flex gap-1 mt-2">
                        {item.tags.map((t) => (
                          <span key={t} className="text-[10px] bg-[#3D2B1F] text-[#C8892A] px-2 py-0.5 border border-[#4D3B2F]">{t}</span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <div className="flex flex-col items-end gap-3 shrink-0">
                    <div className="text-right">
                      {item.price !== undefined && item.price !== null ? (
                        <span className="text-[#C8892A] font-semibold">£{Number(item.price).toFixed(2)}</span>
                      ) : item.price_variants?.length ? (
                        <div className="text-xs text-[#A09488]">
                          {item.price_variants.map((pv, i) => (
                            <div key={i}>{pv.label}: £{Number(pv.price).toFixed(2)}</div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-[#A09488]">No price set</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setIsItemModalOpen(true);
                        }}
                        className="text-[#A09488] hover:text-[#C8892A] p-1 transition-colors"
                        title="Edit Item"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id!)}
                        className="text-[#A09488] hover:text-red-500 p-1 transition-colors"
                        title="Delete Item"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Item Modal */}
      {isItemModalOpen && (
        <ItemModal
          item={editingItem}
          categories={categories}
          currentCategoryId={activeCategory || undefined}
          onClose={() => setIsItemModalOpen(false)}
          onSave={async () => {
            await revalidate();
            fetchData();
            setIsItemModalOpen(false);
          }}
        />
      )}

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <CategoryModal
          category={editingCategory}
          onClose={() => setIsCategoryModalOpen(false)}
          onSave={async () => {
            await revalidate();
            fetchData();
            setIsCategoryModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

function ItemModal({
  item,
  categories,
  currentCategoryId,
  onClose,
  onSave,
}: {
  item: MenuItem | null;
  categories: MenuCategory[];
  currentCategoryId?: string;
  onClose: () => void;
  onSave: () => void;
}) {
  const [formData, setFormData] = useState<Partial<MenuItem>>(
    item || {
      name: "",
      description: "",
      price: undefined,
      category_id: currentCategoryId,
      tags: [],
      is_available: true,
      price_variants: [],
    }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const cleanData = { ...formData } as any;
      delete cleanData.id;
      delete cleanData.created_at;
      delete cleanData.updated_at;
      delete cleanData.category_slug;

      let res: Response;
      if (item?.id) {
        res = await fetch("/api/admin/menu/items", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: item.id, ...cleanData }),
        });
      } else {
        res = await fetch("/api/admin/menu/items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cleanData),
        });
      }

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed");
      onSave();
    } catch (err: any) {
      alert("Error saving item: " + (err.message || "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...(formData.tags || []), tagInput.trim()] });
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags?.filter((t) => t !== tag) });
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-[#2C231D] border border-[#3D3229] p-6 rounded-lg w-full max-w-lg">
        <h3 className="text-xl font-semibold text-[#F0EBE3] mb-6">
          {item ? "Edit Menu Item" : "Add New Menu Item"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#A09488] mb-1">Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#1A1714] border border-[#3D3229] text-[#F0EBE3] px-3 py-2 text-sm focus:outline-none focus:border-[#C8892A]"
              placeholder="e.g. Signature Shoyu Ramen"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#A09488] mb-1">Category</label>
            <select
              required
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full bg-[#1A1714] border border-[#3D3229] text-[#F0EBE3] px-3 py-2 text-sm focus:outline-none focus:border-[#C8892A]"
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#A09488] mb-1">Description</label>
            <textarea
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#1A1714] border border-[#3D3229] text-[#F0EBE3] px-3 py-2 text-sm focus:outline-none focus:border-[#C8892A] h-20"
              placeholder="Describe the dish..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#A09488] mb-1">Price (£)</label>
              <input
                type="number"
                step="0.01"
                value={formData.price || ""}
                onChange={(e) => setFormData({ ...formData, price: e.target.value ? parseFloat(e.target.value) : undefined })}
                className="w-full bg-[#1A1714] border border-[#3D3229] text-[#F0EBE3] px-3 py-2 text-sm focus:outline-none focus:border-[#C8892A]"
                placeholder="12.50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#A09488] mb-1">Availability</label>
              <label className="flex items-center mt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_available}
                  onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#1A1714] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#A09488] after:border-[#A09488] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C8892A] peer-checked:after:bg-[#1A1714]"></div>
                <span className="ml-3 text-sm text-[#F0EBE3]">{formData.is_available ? "In Stock" : "Out of Stock"}</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#A09488] mb-1">Tags (e.g. Vegan, Spicy)</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                className="flex-1 bg-[#1A1714] border border-[#3D3229] text-[#F0EBE3] px-3 py-2 text-sm focus:outline-none focus:border-[#C8892A]"
                placeholder="Add a tag..."
              />
              <button
                type="button"
                onClick={addTag}
                className="bg-[#2C231D] border border-[#3D3229] text-[#C8892A] px-3 py-2 text-sm"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
              {formData.tags?.map((t) => (
                <span key={t} className="text-[10px] bg-[#3D2B1F] text-[#C8892A] px-2 py-0.5 border border-[#4D3B2F] flex items-center gap-1">
                  {t}
                  <button type="button" onClick={() => removeTag(t)} className="hover:text-[#F0EBE3]">×</button>
                </span>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-[#A09488] hover:text-[#F0EBE3]"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : item ? "Update Item" : "Create Item"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CategoryModal({
  category,
  onClose,
  onSave,
}: {
  category: MenuCategory | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [formData, setFormData] = useState<Partial<MenuCategory>>(
    category || {
      name: "",
      slug: "",
      description: "",
      sort_order: 0,
    }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const finalData = {
      ...formData,
      slug: formData.slug || formData.name?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
    } as any;

    const cleanData = { ...finalData };
    delete cleanData.id;
    delete cleanData.created_at;
    delete cleanData.updated_at;

    try {
      let res: Response;
      if (category?.id) {
        res = await fetch("/api/admin/menu/categories", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: category.id, ...cleanData }),
        });
      } else {
        res = await fetch("/api/admin/menu/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cleanData),
        });
      }

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed");
      onSave();
    } catch (err: any) {
      alert("Error saving category: " + (err.message || "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-[#2C231D] border border-[#3D3229] p-6 rounded-lg w-full max-w-md">
        <h3 className="text-xl font-semibold text-[#F0EBE3] mb-6">
          {category ? "Edit Category" : "Add New Category"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#A09488] mb-1">Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#1A1714] border border-[#3D3229] text-[#F0EBE3] px-3 py-2 text-sm focus:outline-none focus:border-[#C8892A]"
              placeholder="e.g. Ramen Bowls"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#A09488] mb-1">Description</label>
            <textarea
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#1A1714] border border-[#3D3229] text-[#F0EBE3] px-3 py-2 text-sm focus:outline-none focus:border-[#C8892A] h-20"
              placeholder="Short description of this category..."
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#A09488] mb-1">Sort Order</label>
            <input
              type="number"
              value={formData.sort_order}
              onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
              className="w-full bg-[#1A1714] border border-[#3D3229] text-[#F0EBE3] px-3 py-2 text-sm focus:outline-none focus:border-[#C8892A]"
            />
          </div>
          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-[#A09488] hover:text-[#F0EBE3]"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : category ? "Update Category" : "Create Category"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
