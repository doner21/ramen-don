import Image from "next/image";
import Link from "next/link";
import type { HomepageSection } from "@/lib/data/types";

const FEATURED_BOWLS = [
  {
    name: "Kotteri Pork",
    description: "Pork bone broth, Chashu pork belly, House menma, Hanjuku egg",
    price: "£16",
    image: "/images/brand/signature_bowl.png",
    alt: "Kotteri pork ramen in dark ceramic bowl",
  },
  {
    name: "Kara Miso",
    description: "Spicy miso tare, Kimchi, Sweetcorn, Shichimi togarashi",
    price: "£16",
    image: "/images/brand/spicy_fire.png",
    alt: "Spicy kara miso ramen",
    tag: "🌶 Spicy",
  },
  {
    name: "Shoyu Ramen",
    description: "Sweet soy chicken, Hanjuku egg, Spring onion, Nori",
    price: "£16",
    image: "/images/brand/shoyu_essence.png",
    alt: "Shoyu ramen overhead",
  },
  {
    name: "Kishu Ramen",
    description: "Pink duck, House menma, Hanjuku egg, Spring onion",
    price: "£18.95",
    image: "/images/brand/truffle_shio.png",
    alt: "Premium Kishu ramen",
    tag: "Chef's Pick",
  },
];

interface MenuHighlightsProps {
  section?: HomepageSection;
}

export default function MenuHighlights({ section }: MenuHighlightsProps = {}) {
  return (
    <section className="py-20 px-4 bg-[#1A1714]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="font-sans text-xs tracking-[0.4em] uppercase text-[#C8892A] mb-3">{section?.subheading || "Our Kitchen"}</p>
          <h2 className="font-display text-4xl lg:text-5xl font-semibold text-[#F0EBE3]">
            {section?.heading || "Signature Bowls"}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_BOWLS.map((bowl) => (
            <div key={bowl.name} className="bg-[#2C231D] border border-[#3D3229] overflow-hidden group">
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={bowl.image}
                  alt={bowl.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  quality={85}
                />
                {bowl.tag && (
                  <span className="absolute top-3 left-3 bg-[#C8892A] text-[#1A1714] text-xs font-semibold px-2 py-1">
                    {bowl.tag}
                  </span>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-display text-xl font-semibold text-[#F0EBE3]">{bowl.name}</h3>
                  <span className="font-sans font-semibold text-[#C8892A] ml-2 shrink-0">{bowl.price}</span>
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
