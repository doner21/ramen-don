import Image from "next/image";
import type { HomepageSection } from "@/lib/data/types";
import type { GalleryImage } from "@/lib/data/types";

interface HeroProps {
  section?: HomepageSection;
  heroImage?: GalleryImage | null;
}

export default function Hero({ section, heroImage }: HeroProps = {}) {
  const tagline = section?.subheading ?? "Handcrafted broths. Bold flavours.";
  const FALLBACK_IMAGE = "/images/brand/hero_ramen.png";
  const heroSrc = heroImage?.storage_url || heroImage?.local_path || FALLBACK_IMAGE;
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <Image
        src={heroSrc}
        alt={heroImage?.alt_text ?? "Ramen Don atmospheric counter bar"}
        fill
        className="object-cover"
        priority
        quality={85}
      />
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A1714]/70 via-[#1A1714]/50 to-[#1A1714]/80" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <p className="font-sans text-xs tracking-[0.4em] uppercase text-[#C8892A] mb-6">
          Birmingham · Est. Since Day One
        </p>
        {/* Wordmark */}
        <h1 className="mb-6 flex justify-center">
          <div style={{ mixBlendMode: "screen" }} className="w-full max-w-[420px] sm:max-w-[520px] lg:max-w-[600px]">
            <Image
              src="/images/logo/Ramen_Don_Logo_Alternative.png"
              alt="Ramen Don"
              width={600}
              height={62}
              className="w-full h-auto"
              style={{ filter: "invert(1) brightness(1.05)" }}
              priority
            />
          </div>
        </h1>
        <p className="font-display text-xl sm:text-2xl italic text-[#A09488] mb-6">
          {tagline}
        </p>
        {section?.body && (
          <p
            className="font-sans text-sm text-[#A09488] mb-6 max-w-xl mx-auto leading-relaxed"
            data-testid="hero-body"
          >
            {section.body}
          </p>
        )}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={section?.cta_url ?? "https://www.opentable.co.uk/r/ramen-don-birmingham"}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#C8892A] text-[#1A1714] font-sans font-semibold px-8 py-3.5 hover:bg-[#d9992f] transition-colors tracking-wide"
            data-testid="hero-booking-cta"
          >
            Book a Table
          </a>
          <a
            href="/menu"
            className="border border-[#F0EBE3]/40 text-[#F0EBE3] font-sans px-8 py-3.5 hover:border-[#C8892A] hover:text-[#C8892A] transition-colors tracking-wide"
          >
            View Menu
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-5 h-5 text-[#A09488]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
