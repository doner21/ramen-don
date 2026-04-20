"use client";

import BookingOverlay from "@/components/opentable/BookingOverlay";

// Numeric RID confirmed via Playwright inspection on 2026-04-16
const OPENTABLE_WIDGET_URL =
  "https://www.opentable.co.uk/widget/reservation/loader?rid=325722&type=standard&theme=standard&color=1&dark=false&iframe=true&domain=co.uk&lang=en-GB&newtab=false&ot_source=Restaurant%20website";

interface BookingCTAProps {
  heading?: string;
  subtext?: string;
  body?: string;
  className?: string;
  ctaUrl?: string;
  overlayImage?: { src: string; alt: string } | null;
}

export default function BookingCTA({
  heading = "Ready to Visit?",
  subtext = "Reserve your table at Ramen Don Birmingham",
  body,
  className = "",
  ctaUrl: _ctaUrl = "https://www.opentable.co.uk/r/ramen-don-birmingham",
  overlayImage,
}: BookingCTAProps) {
  return (
    <section className={`bg-[#2C231D] border-y border-[#3D3229] py-16 px-4 text-center ${className}`}>
      <h2 className="font-display text-3xl lg:text-4xl font-semibold text-[#F0EBE3] mb-3">
        {heading}
      </h2>
      {body && (
        <p
          className="text-[#A09488] text-base mb-4 max-w-md mx-auto"
          data-testid="booking-cta-body"
        >
          {body}
        </p>
      )}
      <p className="text-[#A09488] text-base mb-8 max-w-md mx-auto">{subtext}</p>
      <BookingOverlay widgetUrl={OPENTABLE_WIDGET_URL} overlayImage={overlayImage}>
        <button
          type="button"
          className="inline-flex items-center gap-2 bg-[#C8892A] text-[#1A1714] font-sans font-semibold px-8 py-3 hover:bg-[#d9992f] transition-colors"
          data-testid="booking-cta"
        >
          Book a Table
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </button>
      </BookingOverlay>
    </section>
  );
}
