import type { OpeningHour } from "@/lib/data/types";

const OPENTABLE_URL = "https://www.opentable.co.uk/r/ramen-don-birmingham";

interface VisitInfoProps {
  hours?: OpeningHour[];
}

export default function VisitInfo({ hours }: VisitInfoProps = {}) {
  return (
    <section className="bg-[#1A1714] border-y border-[#3D3229] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:divide-x md:divide-[#3D3229]">
          {/* Address */}
          <div className="md:pr-10">
            <h3 className="font-display text-xs tracking-[0.3em] uppercase text-[#C8892A] mb-4">Find Us</h3>
            <address className="not-italic text-[#F0EBE3] space-y-1">
              <p className="font-medium">Unit 1A Regency Wharf</p>
              <p className="text-[#A09488]">Birmingham, West Midlands</p>
              <p className="text-[#A09488]">B1 2DS</p>
            </address>
            <a href="tel:01217145565" className="mt-3 block text-[#A09488] hover:text-[#C8892A] transition-colors">
              0121 714 5565
            </a>
          </div>

          {/* Hours */}
          <div className="md:px-10">
            <h3 className="font-display text-sm uppercase tracking-widest text-[#C8892A] mb-4">Opening Hours</h3>
            <div className="text-sm text-[#A09488] space-y-1">
              {hours && hours.length > 0 ? (
                hours.map((hour) => (
                  <p key={hour.day_of_week} className={hour.is_closed ? "line-through opacity-50" : undefined}>
                    {hour.is_closed ? (
                      `${hour.day_name} — Closed`
                    ) : hour.note ? (
                      `${hour.day_name}: ${hour.note}`
                    ) : (
                      <>
                        {`${hour.day_name}: `}
                        {hour.lunch_open && `${hour.lunch_open}–${hour.lunch_close}`}
                        {hour.lunch_open && hour.dinner_open && ", "}
                        {hour.dinner_open && `${hour.dinner_open}–${hour.dinner_close}`}
                      </>
                    )}
                  </p>
                ))
              ) : (
                <>
                  <p className="line-through opacity-50">Monday — Closed</p>
                  <p>Tuesday: 12:00–15:00, 17:00–22:00</p>
                  <p className="line-through opacity-50">Wednesday — Closed</p>
                  <p>Thu–Fri: 12:00–15:00, 17:00–22:00</p>
                  <p>Saturday: 12:00–15:00, 17:00–23:00</p>
                  <p>Sunday: 12:00–20:00</p>
                </>
              )}
            </div>
          </div>

          {/* Reserve */}
          <div className="md:pl-10 flex flex-col justify-center">
            <h3 className="font-display text-xs tracking-[0.3em] uppercase text-[#C8892A] mb-4">Reserve</h3>
            <p className="text-sm text-[#A09488] mb-5">
              Book your table online via OpenTable — no deposit required.
            </p>
            <a
              href={OPENTABLE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#C8892A] text-[#1A1714] font-sans font-semibold text-sm px-6 py-3 hover:bg-[#d9992f] transition-colors self-start"
              data-testid="visit-booking-cta"
            >
              Book a Table
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
