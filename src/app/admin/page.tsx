import Link from "next/link";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase-server";

const SECTIONS = [
  { href: "/admin/hours", title: "Opening Hours", desc: "Edit restaurant trading hours" },
  { href: "/admin/venue", title: "Venue Details", desc: "Update address, phone, social links" },
  { href: "/admin/menu", title: "Menu", desc: "Manage categories, items, and prices" },
  { href: "/admin/gallery", title: "Gallery", desc: "Upload and manage brand photos" },
  { href: "/admin/homepage", title: "Homepage", desc: "Edit hero, story, and section content" },
];

export const metadata = {
  title: "Admin Dashboard — Ramen Don",
};

export default function AdminDashboard() {
  // Server-side redirect if Supabase not configured
  if (!isSupabaseConfigured()) {
    redirect("/admin/login?notice=not_configured");
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-[#F0EBE3] mb-2">Dashboard</h1>
      <p className="text-[#A09488] mb-10">Welcome back. Manage your restaurant content below.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="bg-[#2C231D] border border-[#3D3229] p-6 hover:border-[#C8892A] transition-colors group"
          >
            <h2 className="font-display text-xl font-semibold text-[#F0EBE3] group-hover:text-[#C8892A] transition-colors mb-2">
              {s.title}
            </h2>
            <p className="text-sm text-[#A09488]">{s.desc}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 p-4 bg-[#2C231D] border border-[#3D3229] text-sm text-[#A09488]">
        <p className="font-medium text-[#F0EBE3] mb-1">About this admin</p>
        <p>Changes made here update Supabase in real time. If Supabase is not configured, the site displays static fallback data from seed-data.ts.</p>
        <p className="mt-2">
          <a href="/" className="text-[#C8892A] hover:underline">View live site →</a>
        </p>
      </div>
    </div>
  );
}
