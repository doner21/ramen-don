import BookingCTA from "@/components/opentable/BookingCTA";
import { getOpeningHours } from "@/lib/data/fetchers";

const INSTAGRAM_URL = "https://www.instagram.com/ramen_don_/";

export const metadata = {
  title: "Contact — Ramen Don Birmingham",
  description:
    "Get in touch with Ramen Don Birmingham. Address, phone, and opening hours.",
};

export default async function ContactPage() {
  const hours = await getOpeningHours();
  return (
    <>
      {/* Header */}
      <div className="pt-20 pb-10 px-4 bg-[#2C231D] text-center border-b border-[#3D3229]">
        <p className="font-sans text-xs tracking-[0.4em] uppercase text-[#C8892A] mb-3">Get In Touch</p>
        <h1 className="font-display text-5xl lg:text-6xl font-semibold text-[#F0EBE3]">
          Contact Us
        </h1>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact details */}
          <div>
            <h2 className="font-display text-2xl font-semibold text-[#F0EBE3] mb-6">Reach Us</h2>
            <div className="space-y-6">
              <div>
                <p className="text-xs tracking-widest uppercase text-[#C8892A] mb-2">Address</p>
                <address className="not-italic text-[#A09488]">
                  <p>Unit 1A Regency Wharf</p>
                  <p>Birmingham, West Midlands</p>
                  <p>B1 2DS</p>
                </address>
              </div>
              <div>
                <p className="text-xs tracking-widest uppercase text-[#C8892A] mb-2">Phone</p>
                <a
                  href="tel:01217145565"
                  className="text-[#F0EBE3] text-lg hover:text-[#C8892A] transition-colors font-medium"
                  data-testid="phone-link"
                >
                  0121 714 5565
                </a>
              </div>
              <div>
                <p className="text-xs tracking-widest uppercase text-[#C8892A] mb-2">Instagram</p>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#F0EBE3] hover:text-[#C8892A] transition-colors"
                  data-testid="instagram-link"
                >
                  @ramen_don_
                </a>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h2 className="font-display text-2xl font-semibold text-[#F0EBE3] mb-6">Opening Hours</h2>
            <div className="space-y-2 text-sm">
              {hours.map((hour, index) => (
                <div
                  key={hour.day_of_week}
                  className={`flex justify-between py-2 border-b border-[#3D3229]${index === hours.length - 1 ? " border-b-0" : ""}${hour.is_closed ? " opacity-40" : ""}`}
                >
                  <span className={`text-[#F0EBE3]${hour.is_closed ? " line-through" : ""}`}>
                    {hour.day_name}
                  </span>
                  <span className={`text-[#A09488]${hour.is_closed ? " line-through" : ""}`}>
                    {hour.is_closed ? (
                      "Closed"
                    ) : hour.note ? (
                      hour.note
                    ) : (
                      <>
                        {hour.lunch_open && `${hour.lunch_open}–${hour.lunch_close}`}
                        {hour.lunch_open && hour.dinner_open && ", "}
                        {hour.dinner_open && `${hour.dinner_open}–${hour.dinner_close}`}
                      </>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <BookingCTA heading="Ready to Join Us?" subtext="Reserve your table at Ramen Don Birmingham." />
    </>
  );
}
