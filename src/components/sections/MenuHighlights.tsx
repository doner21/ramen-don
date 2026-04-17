import Image from "next/image";
import Link from "next/link";
import type { HomepageSection, SignatureBowl } from "@/lib/data/types";

interface MenuHighlightsProps {
  section?: HomepageSection;
  bowls: SignatureBowl[];
}

export default function MenuHighlights({ section, bowls }: MenuHighlightsProps) {
  return (
    <section className="py-20 px-4 bg-[#1A1714]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="font-sans text-xs tracking-[0.4em] uppercase text-[#C8892A] mb-3">{section?.subheading || "Our Kitchen"}</p>
          <h2 className="font-display text-4xl lg:text-5xl font-semibold text-[#F0EBE3]">
            {section?.heading || "Signature Bowls"}
          </h2>
          {section?.body && (
            <p
              className="font-sans text-sm text-[#A09488] mt-4 max-w-xl mx-auto leading-relaxed"
              data-testid="signature-dishes-body"
            >
              {section.body}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bowls.map((bowl) => (
            <div key={bowl.name} className="bg-[#2C231D] border border-[#3D3229] overflow-hidden group">
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={bowl.image_url || bowl.image_local_path || "/images/brand/signature_bowl.png"}
                  alt={bowl.alt_text || bowl.image_alt_text || bowl.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  quality={85}
                />
                {bowl.badge_label && (
                  <span className="absolute top-3 left-3 bg-[#C8892A] text-[#1A1714] text-xs font-semibold px-2 py-1">
                    {bowl.badge_label}
                  </span>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-display text-xl font-semibold text-[#F0EBE3]">{bowl.name}</h3>
                  {bowl.price && (
                    <span className="font-sans font-semibold text-[#C8892A] ml-2 shrink-0">{bowl.price}</span>
                  )}
                </div>
                <p className="text-sm text-[#A09488] leading-relaxed">{bowl.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 border border-[#C8892A] text-[#C8892A] font-sans font-medium px-8 py-3 hover:bg-[#C8892A] hover:text-[#1A1714] transition-all"
          >
            View Full Menu
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
