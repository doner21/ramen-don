"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: "◈" },
  { href: "/admin/hours", label: "Opening Hours", icon: "◷" },
  { href: "/admin/venue", label: "Venue Details", icon: "◎" },
  { href: "/admin/menu", label: "Menu", icon: "◻" },
  { href: "/admin/signature-bowls", label: "Signature Bowls", icon: "◉" },
  { href: "/admin/gallery", label: "Gallery", icon: "◫" },
  { href: "/admin/homepage", label: "Homepage", icon: "◱" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile sidebar when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const navLinks = NAV_ITEMS.map((item) => {
    const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
    return (
      <Link
        key={item.href}
        href={item.href}
        className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all ${
          isActive
            ? "bg-[#C8892A]/15 text-[#C8892A] border-l-2 border-[#C8892A]"
            : "text-[#A09488] hover:text-[#F0EBE3] hover:bg-[#3D2B1F]"
        }`}
      >
        <span>{item.icon}</span>
        {item.label}
      </Link>
    );
  });

  const sidebarInner = (
    <>
      <div className="p-6 border-b border-[#3D3229]">
        <Link href="/" className="font-display text-lg font-semibold tracking-[0.2em] uppercase text-[#F0EBE3] hover:text-[#C8892A] transition-colors">
          RAMEN DON
        </Link>
        <p className="text-xs text-[#A09488] mt-1">Admin</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navLinks}
      </nav>
      <div className="p-4 border-t border-[#3D3229]">
        <button
          onClick={handleSignOut}
          className="w-full text-left flex items-center gap-3 px-3 py-2.5 text-sm text-[#A09488] hover:text-red-400 transition-colors"
        >
          <span>⇥</span>
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile topbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-[#2C231D] border-b border-[#3D3229] flex items-center justify-between px-4">
        <Link href="/" className="font-display text-base font-semibold tracking-[0.2em] uppercase text-[#F0EBE3] hover:text-[#C8892A] transition-colors">
          RAMEN DON
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-[#F0EBE3] cursor-pointer"
          aria-label="Toggle navigation"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar (slide-in from left below topbar) */}
      <aside
        className={`lg:hidden fixed top-14 left-0 bottom-0 z-40 w-56 bg-[#2C231D] border-r border-[#3D3229] flex flex-col transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarInner}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-56 shrink-0 bg-[#2C231D] border-r border-[#3D3229] flex-col min-h-screen">
        {sidebarInner}
      </aside>
    </>
  );
}
