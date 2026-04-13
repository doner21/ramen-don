import OpenTableWidget from "@/components/opentable/OpenTableWidget";
import Image from "next/image";

const OPENTABLE_URL = "https://www.opentable.co.uk/r/ramen-don-birmingham";

export const metadata = {
  title: "Reservations — Ramen Don Birmingham",
  description:
    "Book your table at Ramen Don Birmingham via OpenTable. Easy online reservations.",
};

export default function ReservationsPage() {
  return (
    <>
      {/* Hero */}
      <div className="relative pt-20 pb-16 px-4 overflow-hidden">
        <Image
          src="/images/brand/hero_Hawksmoor_ramen.png"
          alt="Candlelit Ramen Don restaurant"
          fill
          className="object-cover opacity-30"
          quality={85}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1714]/80 to-[#1A1714]" />
        <div className="relative text-center max-w-2xl mx-auto">
          <p className="font-sans text-xs tracking-[0.4em] uppercase text-[#C8892A] mb-3">Reserve</p>
          <h1 className="font-display text-5xl lg:text-6xl font-semibold text-[#F0EBE3] mb-4">
            Book a Table
          </h1>
          <p className="text-[#A09488] text-base max-w-md mx-auto">
            Reserve your table at Ramen Don Birmingham. No deposit required — just turn up and enjoy.
          </p>
        </div>
      </div>

      {/* Widget section */}
      <div className="bg-[#2C231D] border-y border-[#3D3229]" data-testid="opentable-section">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <OpenTableWidget />
        </div>
      </div>

      {/* What to expect */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="font-display text-3xl font-semibold text-[#F0EBE3] mb-10 text-center">
          What to Expect
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Warm Welcome", body: "Our team will greet you at the door and guide you to your table." },
            { title: "The Broth Experience", body: "Each bowl is served fresh from our kitchen — rich, hot, and full of character." },
            { title: "No Rush", body: "Savour every sip. We never turn tables — enjoy your evening at your own pace." },
          ].map((item) => (
            <div key={item.title} className="bg-[#2C231D] border border-[#3D3229] p-6">
              <h3 className="font-display text-xl font-semibold text-[#C8892A] mb-3">{item.title}</h3>
              <p className="text-sm text-[#A09488] leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-[#A09488] mb-4">
            Walk-ins welcome subject to availability. For large groups (8+), please call us directly.
          </p>
          <a
            href="tel:01217145565"
            className="text-[#C8892A] font-medium hover:underline"
          >
            0121 714 5565
          </a>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-[#2C231D] border-t border-[#3D3229] py-12 px-4 text-center">
        <a
          href={OPENTABLE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#C8892A] text-[#1A1714] font-sans font-semibold px-8 py-3.5 hover:bg-[#d9992f] transition-colors text-base"
        >
          Reserve Now on OpenTable
        </a>
      </div>
    </>
  );
}
