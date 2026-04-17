import Link from "next/link";
import Image from "next/image";
import { getOpeningHours, getVenueDetails } from "@/lib/data/fetchers";
import FooterBookingButton from "@/components/opentable/FooterBookingButton";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/visit", label: "Visit" },
  { href: "/reservations", label: "Reservations" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export default async function Footer() {
  const hours = await getOpeningHours();
  const venue = await getVenueDetails();
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[#2C231D] border-t border-[#3D3229]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo + tagline */}
          <div>
            <Link href="/" className="inline-block group">
              <div style={{ mixBlendMode: "screen" }} className="h-8">
                <Image
                  src="/images/logo/Ramen_Don_Logo_Alternative.png"
                  alt="Ramen Don"
                  width={152}
                  height={32}
                  className="h-full w-auto object-contain group-hover:opacity-80 transition-opacity"
                  style={{ filter: "invert(1) brightness(0.9)" }}
                />
              </div>
            </Link>
            <p className="mt-3 text-sm text-[#A09488] leading-relaxed">
              Handcrafted broths.<br />Bold flavours.<br />Birmingham.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-display text-sm uppercase tracking-widest text-[#C8892A] mb-4">Navigate</h3>
            <nav className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm text-[#A09488] hover:text-[#F0EBE3] transition-colors">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-sm uppercase tracking-widest text-[#C8892A] mb-4">Find Us</h3>
            <address className="not-italic text-sm text-[#A09488] space-y-1">
              <p>{venue.address_line1}</p>
              <p>{venue.city}{venue.county ? `, ${venue.county}` : ""}</p>
              <p>{venue.postcode}</p>
              <p className="mt-3">
                <a href={`tel:${venue.phone.replace(/\s/g, "")}`} className="hover:text-[#F0EBE3] transition-colors">
                  {venue.phone}
                </a>
              </p>
              <p className="mt-2">
                <a href={venue.instagram_url} target="_blank" rel="noopener noreferrer" className="hover:text-[#C8892A] transition-colors">
                  {venue.instagram_url.replace(/https?:\/\/(www\.)?instagram\.com\//, "@").replace(/\/$/, "")}
                </a>
              </p>
            </address>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-display text-sm uppercase tracking-widest text-[#C8892A] mb-4">Opening Hours</h3>
            <div className="text-sm text-[#A09488] space-y-1">
              {hours.map((hour) => (
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
              ))}
            </div>
            <FooterBookingButton />
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#3D3229] text-center text-xs text-[#A09488]">
          © {year} Ramen Don. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
