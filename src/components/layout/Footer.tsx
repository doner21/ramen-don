import Link from "next/link";
import Image from "next/image";

const OPENTABLE_URL = "https://www.opentable.co.uk/r/ramen-don-birmingham";
const INSTAGRAM_URL = "https://www.instagram.com/ramen_don_/";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/visit", label: "Visit" },
  { href: "/reservations", label: "Reservations" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
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
              <p>Unit 1A Regency Wharf</p>
              <p>Birmingham, West Midlands</p>
              <p>B1 2DS</p>
              <p className="mt-3">
                <a href="tel:01217145565" className="hover:text-[#F0EBE3] transition-colors">
                  0121 714 5565
                </a>
              </p>
              <p className="mt-2">
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[#C8892A] transition-colors">
                  @ramen_don_
                </a>
              </p>
            </address>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-display text-sm uppercase tracking-widest text-[#C8892A] mb-4">Opening Hours</h3>
            <div className="text-sm text-[#A09488] space-y-1">
              <p className="line-through opacity-50">Monday — Closed</p>
              <p>Tue–Fri: 12:00–15:00, 17:00–22:00</p>
              <p>Sat: 12:00–15:00, 17:00–23:00</p>
              <p>Sun: 12:00–20:00</p>
            </div>
            <a
              href={OPENTABLE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block bg-[#C8892A] text-[#1A1714] font-sans font-semibold text-sm px-5 py-2.5 hover:bg-[#d9992f] transition-colors"
            >
              Book a Table
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#3D3229] text-center text-xs text-[#A09488]">
          © {year} Ramen Don. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
