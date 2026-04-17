"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import BookingOverlay from "@/components/opentable/BookingOverlay";

// Numeric RID confirmed via Playwright inspection on 2026-04-16
const OPENTABLE_WIDGET_URL =
  "https://www.opentable.co.uk/widget/reservation/loader?rid=325722&type=standard&theme=standard&color=1&dark=false&iframe=true&domain=co.uk&lang=en-GB&newtab=false&ot_source=Restaurant%20website";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/visit", label: "Visit" },
  { href: "/reservations", label: "Reservations" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

interface HeaderProps {
  openTableUrl?: string;
}

export default function Header({ openTableUrl = "https://www.opentable.co.uk/r/ramen-don-birmingham" }: HeaderProps = {}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#1A1714]/95 backdrop-blur-sm shadow-lg border-b border-[#3D3229]" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            {/* Circle icon mark */}
            <div style={{ mixBlendMode: "screen" }} className="w-8 h-8 shrink-0">
              <Image
                src="/images/logo/Ramen_Don_Logo_Cirlce.png"
                alt=""
                width={32}
                height={32}
                className="w-full h-full object-contain"
                style={{ filter: "invert(1) brightness(0.9)" }}
              />
            </div>
            {/* Wordmark */}
            <div style={{ mixBlendMode: "screen" }} className="h-7">
              <Image
                src="/images/logo/Ramen_Don_Logo_Alternative.png"
                alt="Ramen Don"
                width={168}
                height={28}
                className="h-full w-auto object-contain group-hover:opacity-80 transition-opacity"
                style={{ filter: "invert(1) brightness(0.9)" }}
                priority
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-sans text-sm tracking-wide text-[#A09488] hover:text-[#F0EBE3] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex">
            <BookingOverlay widgetUrl={OPENTABLE_WIDGET_URL}>
              <button
                type="button"
                className="bg-[#C8892A] text-[#1A1714] font-sans font-semibold text-sm tracking-wide px-5 py-2.5 hover:bg-[#d9992f] transition-colors"
              >
                Book a Table
              </button>
            </BookingOverlay>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="lg:hidden p-2 text-[#F0EBE3] cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
            style={{ touchAction: "manipulation" }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="lg:hidden bg-[#1A1714] border-t border-[#3D3229]">
          <nav className="px-4 py-4 flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-sans text-base text-[#F0EBE3] py-2 border-b border-[#3D3229] last:border-0"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <BookingOverlay widgetUrl={OPENTABLE_WIDGET_URL}>
              <button
                type="button"
                className="mt-2 bg-[#C8892A] text-[#1A1714] font-sans font-semibold text-sm tracking-wide px-5 py-3 text-center hover:bg-[#d9992f] transition-colors w-full"
              >
                Book a Table
              </button>
            </BookingOverlay>
          </nav>
        </div>
      )}
    </header>
  );
}
