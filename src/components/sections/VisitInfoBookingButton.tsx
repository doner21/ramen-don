"use client";

import BookingOverlay from "@/components/opentable/BookingOverlay";

// Numeric RID confirmed via Playwright inspection on 2026-04-16
const OPENTABLE_WIDGET_URL =
  "https://www.opentable.co.uk/widget/reservation/loader?rid=325722&type=standard&theme=standard&color=1&dark=false&iframe=true&domain=co.uk&lang=en-GB&newtab=false&ot_source=Restaurant%20website";

export default function VisitInfoBookingButton() {
  return (
    <BookingOverlay widgetUrl={OPENTABLE_WIDGET_URL}>
      <button
        type="button"
        className="inline-flex items-center gap-2 bg-[#C8892A] text-[#1A1714] font-sans font-semibold text-sm px-6 py-3 hover:bg-[#d9992f] transition-colors self-start"
        data-testid="visit-booking-cta"
      >
        Book a Table
      </button>
    </BookingOverlay>
  );
}
