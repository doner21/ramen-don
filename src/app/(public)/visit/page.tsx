import BookingCTA from "@/components/opentable/BookingCTA";
import { getOpeningHours, getVenueDetails } from "@/lib/data/fetchers";

export const metadata = {
  title: "Visit Us — Ramen Don Birmingham",
  description:
    "Find Ramen Don at Unit 1A Regency Wharf, Birmingham. Opening hours, directions, and how to get here.",
};

export default async function VisitPage() {
  const [hours, venue] = await Promise.all([getOpeningHours(), getVenueDetails()]);

  return (
    <>
      {/* Hero */}
      <div className="pt-20 pb-10 px-4 bg-[#2C231D] text-center border-b border-[#3D3229]">
        <p className="font-sans text-xs tracking-[0.4em] uppercase text-[#C8892A] mb-3">Come See Us</p>
        <h1 className="font-display text-5xl lg:text-6xl font-semibold text-[#F0EBE3]">
          Visit Us
        </h1>
        <p className="mt-3 text-[#A09488] max-w-md mx-auto">
          {venue.address_line1}, {venue.city}
        </p>
        {venue.tagline && (
          <p className="mt-2 text-[#C8892A] text-sm font-medium tracking-widest uppercase">{venue.tagline}</p>
        )}
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Address */}
          <div>
            <h2 className="font-display text-2xl font-semibold text-[#F0EBE3] mb-6">
              Address
            </h2>
            <address className="not-italic text-[#A09488] space-y-2 text-base leading-relaxed">
              <p className="text-[#F0EBE3] font-medium">{venue.name}</p>
              <p>{venue.address_line1}</p>
              {venue.address_line2 && <p>{venue.address_line2}</p>}
              <p>{venue.city}, {venue.county}</p>
              <p>{venue.postcode}</p>
              <p className="mt-4">
                <a href={`tel:${venue.phone.replace(/\s/g, "")}`} className="text-[#C8892A] hover:underline">
                  {venue.phone}
                </a>
              </p>
            </address>

            <h2 className="font-display text-2xl font-semibold text-[#F0EBE3] mb-4 mt-10">
              Getting Here
            </h2>
            <div className="text-sm text-[#A09488] space-y-3">
              <p><span className="text-[#F0EBE3]">By Train:</span> New Street Station is a 10-minute walk via Broad Street.</p>
              <p><span className="text-[#F0EBE3]">By Bus:</span> Multiple routes stop on Broad Street, 2 minutes away.</p>
              <p><span className="text-[#F0EBE3]">By Car:</span> Brindleyplace car parks are a 5-minute walk. Limited street parking on Regency Wharf.</p>
              <p><span className="text-[#F0EBE3]">By Tram:</span> Centenary Square stop is a 5-minute walk.</p>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h2 className="font-display text-2xl font-semibold text-[#F0EBE3] mb-6">
              Opening Hours
            </h2>
            <div className="space-y-3">
              {hours.map((hour) => (
                <div
                  key={hour.day_of_week}
                  className={`flex items-start justify-between py-3 border-b border-[#3D3229] last:border-0 ${hour.is_closed ? "opacity-40" : ""}`}
                >
                  <span className="font-medium text-[#F0EBE3]">{hour.day_name}</span>
                  <div className="text-right text-sm text-[#A09488]">
                    {hour.is_closed ? (
                      <span className="line-through">Closed</span>
                    ) : hour.note ? (
                      <span>{hour.note}</span>
                    ) : (
                      <>
                        {hour.lunch_open && <p>Lunch: {hour.lunch_open}–{hour.lunch_close}</p>}
                        {hour.dinner_open && <p>Dinner: {hour.dinner_open}–{hour.dinner_close}</p>}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <BookingCTA heading="Plan Your Visit" subtext="Book ahead to guarantee your table." />
    </>
  );
}
