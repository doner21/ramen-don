import type { MenuItem as MenuItemType } from "@/lib/data/types";

interface MenuItemProps {
  item: MenuItemType;
}

const TAG_LABELS: Record<string, string> = {
  v: "V",
  vg: "VG",
  spicy: "Spicy",
  "Vol 15%": "15%",
  "Vol 16%": "16%",
};

const TAG_COLORS: Record<string, string> = {
  v: "bg-green-800/40 text-green-300",
  vg: "bg-green-700/40 text-green-200",
  spicy: "bg-red-800/40 text-red-300",
};

export default function MenuItemComponent({ item }: MenuItemProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-[#3D3229] last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center flex-wrap gap-2 mb-1">
          <h3 className="font-sans font-medium text-[#F0EBE3]">{item.name}</h3>
          {item.tags?.map((tag) => (
            <span
              key={tag}
              className={`text-xs px-2 py-0.5 font-medium ${
                TAG_COLORS[tag.toLowerCase()] || "bg-[#3D3229] text-[#A09488]"
              }`}
            >
              {TAG_LABELS[tag] || tag}
            </span>
          ))}
        </div>
        {item.description && (
          <p className="text-sm text-[#A09488] leading-relaxed">{item.description}</p>
        )}
        {item.price_variants && item.price_variants.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-3">
            {item.price_variants.map((pv) => (
              <span key={pv.label} className="text-sm">
                <span className="text-[#A09488]">{pv.label}</span>{" "}
                <span className="text-[#C8892A] font-medium">£{pv.price.toFixed(2)}</span>
              </span>
            ))}
          </div>
        )}
      </div>
      {item.price !== undefined && !item.price_variants?.length && (
        <span className="font-sans font-semibold text-[#C8892A] shrink-0 text-base">
          £{item.price.toFixed(2)}
        </span>
      )}
    </div>
  );
}
