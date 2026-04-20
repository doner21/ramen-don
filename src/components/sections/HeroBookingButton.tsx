"use client";

import BookingOverlay from "@/components/opentable/BookingOverlay";

// Numeric RID confirmed via Playwright inspection on 2026-04-16
const OPENTABLE_WIDGET_URL =
  "https://www.opentable.co.uk/widget/reservation/loader?rid=325722&type=standard&theme=standard&color=1&dark=false&iframe=true&domain=co.uk&lang=en-GB&newtab=false&ot_source=Restaurant%20website";

interface HeroBookingButtonProps {
  overlayImage?: { src: string; alt: string } | null;
}

export default function HeroBookingButton({ overlayImage }: HeroBookingButtonProps = {}) {
  return (
    <BookingOverlay widgetUrl={OPENTABLE_WIDGET_URL} overlayImage={overlayImage}>
      <button
        type="button"
        className="bg-[#C8892A] text-[#1A1714] font-sans font-semibold px-8 py-3.5 hover:bg-[#d9992f] transition-colors tracking-wide"
        data-testid="hero-booking-cta"
      >
        Book a Table
      </button>
    </BookingOverlay>
  );
}
