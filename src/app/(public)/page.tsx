import Hero from "@/components/sections/Hero";
import MenuHighlights from "@/components/sections/MenuHighlights";
import Story from "@/components/sections/Story";
import BookingCTA from "@/components/opentable/BookingCTA";
import VisitInfo from "@/components/sections/VisitInfo";
import { getHomepageSections, getOpeningHours, getHeroImage, getVenueDetails, getSignatureBowls, getBookingOverlayImage } from "@/lib/data/fetchers";
import { BOOKING_OVERLAY_FALLBACK_IMAGE, BOOKING_OVERLAY_FALLBACK_ALT } from "@/lib/data/constants";

export const metadata = {
  title: "Ramen Don Birmingham — Authentic Japanese Ramen",
  description:
    "Handcrafted ramen broths and bold flavours in the heart of Birmingham. Visit Ramen Don at Regency Wharf and book your table today.",
};

export default async function HomePage() {
  const [sections, hours, heroImage, venue, bowls, rawOverlayImage] = await Promise.all([
    getHomepageSections(),
    getOpeningHours(),
    getHeroImage(),
    getVenueDetails(),
    getSignatureBowls(),
    getBookingOverlayImage(),
  ]);

  const overlayImage = rawOverlayImage
    ? {
        src: rawOverlayImage.storage_url || rawOverlayImage.local_path || BOOKING_OVERLAY_FALLBACK_IMAGE,
        alt: rawOverlayImage.alt_text || BOOKING_OVERLAY_FALLBACK_ALT,
      }
    : null;

  const heroSection = sections.find((s) => s.slug === "hero");
  const storySection = sections.find((s) => s.slug === "story");
  const ctaSection = sections.find((s) => s.slug === "visit-cta");
  const signatureSection = sections.find((s) => s.slug === "signature-dishes");

  return (
    <>
      {heroSection && <Hero section={heroSection} heroImage={heroImage} overlayImage={overlayImage} />}
      <MenuHighlights section={signatureSection} bowls={bowls} />
      <Story section={storySection} />
      <BookingCTA
        heading={ctaSection?.heading || "Book Your Table"}
        subtext={ctaSection?.subheading || "Reserve online in seconds — no deposit required."}
        body={ctaSection?.body}
        ctaUrl={ctaSection?.cta_url}
        overlayImage={overlayImage}
      />
      <VisitInfo hours={hours} venue={venue} overlayImage={overlayImage} />

      {/* Instagram teaser */}
      <section className="py-16 px-4 bg-[#2C231D] text-center">
        <p className="font-sans text-xs tracking-[0.4em] uppercase text-[#C8892A] mb-3">Follow Us</p>
        <h2 className="font-display text-3xl font-semibold text-[#F0EBE3] mb-4">
          @ramen_don_
        </h2>
        <p className="text-[#A09488] mb-6 max-w-sm mx-auto text-sm">
          Follow our journey on Instagram for behind-the-scenes, new dishes, and daily specials.
        </p>
        <a
          href="https://www.instagram.com/ramen_don_/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 border border-[#C8892A] text-[#C8892A] font-sans font-medium text-sm px-6 py-2.5 hover:bg-[#C8892A] hover:text-[#1A1714] transition-all"
        >
          View on Instagram
        </a>
      </section>
    </>
  );
}
