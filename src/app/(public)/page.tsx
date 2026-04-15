import Hero from "@/components/sections/Hero";
import MenuHighlights from "@/components/sections/MenuHighlights";
import Story from "@/components/sections/Story";
import BookingCTA from "@/components/opentable/BookingCTA";
import VisitInfo from "@/components/sections/VisitInfo";
import { getHomepageSections, getOpeningHours, getHeroImage } from "@/lib/data/fetchers";

export const metadata = {
  title: "Ramen Don Birmingham — Authentic Japanese Ramen",
  description:
    "Handcrafted ramen broths and bold flavours in the heart of Birmingham. Visit Ramen Don at Regency Wharf and book your table today.",
};

export default async function HomePage() {
  const [sections, hours, heroImage] = await Promise.all([
    getHomepageSections(),
    getOpeningHours(),
    getHeroImage(),
  ]);

  const heroSection = sections.find((s) => s.slug === "hero");
  const storySection = sections.find((s) => s.slug === "story");

  return (
    <>
      {heroSection && <Hero section={heroSection} heroImage={heroImage} />}
      <MenuHighlights />
      <Story section={storySection} />
      <BookingCTA
        heading="Book Your Table"
        subtext="Reserve online in seconds — no deposit required."
      />
      <VisitInfo hours={hours} />

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
