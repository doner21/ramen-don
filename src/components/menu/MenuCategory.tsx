import type { MenuCategory as MenuCategoryType } from "@/lib/data/types";
import MenuItemComponent from "./MenuItem";

interface MenuCategoryProps {
  category: MenuCategoryType;
}

export default function MenuCategory({ category }: MenuCategoryProps) {
  return (
    <section id={`cat-${category.slug}`} className="py-12">
      <div className="mb-6">
        <h2 className="font-display text-3xl font-semibold text-[#F0EBE3] mb-1">
          {category.name}
        </h2>
        {category.description && (
          <p className="text-sm text-[#A09488]">{category.description}</p>
        )}
        <div className="mt-3 h-px bg-gradient-to-r from-[#C8892A] to-transparent" />
      </div>
      <div>
        {category.items?.map((item, idx) => (
          <MenuItemComponent key={item.id || item.name || idx} item={item} />
        ))}
      </div>
    </section>
  );
}
