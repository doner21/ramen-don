"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

const SECTIONS = [
  { href: "/admin/hours", title: "Opening Hours", desc: "Edit restaurant trading hours" },
  { href: "/admin/venue", title: "Venue Details", desc: "Update address, phone, social links" },
  { href: "/admin/menu", title: "Menu", desc: "Manage categories, items, and prices" },
  { href: "/admin/gallery", title: "Gallery", desc: "Upload and manage brand photos" },
  { href: "/admin/homepage", title: "Homepage", desc: "Edit hero, story, and section content" },
];

export default function AdminDashboard() {
  const [setupStatus, setSetupStatus] = useState<{ loading: boolean; error?: string; success?: string }>({ loading: false });
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);
  const [missingEnvVars, setMissingEnvVars] = useState<string[]>([]);

  useEffect(() => {
    checkConfiguration();
  }, []);

  async function checkConfiguration() {
    const missing: string[] = [];
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) missing.push("NEXT_PUBLIC_SUPABASE_URL");
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
    
    if (missing.length > 0) {
      setMissingEnvVars(missing);
      setIsConfigured(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/menu/items");
      setIsConfigured(res.ok);
    } catch (err) {
      console.error("Configuration check failed:", err);
      setIsConfigured(false);
    }
  }

  async function runSetup() {
    setSetupStatus({ loading: true });
    try {
      const res = await fetch("/api/admin/setup", { method: "POST" });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      
      setSetupStatus({ loading: false, success: data.message });
      setIsConfigured(true);
    } catch (err: any) {
      setSetupStatus({ loading: false, error: err.message });
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-[#F0EBE3] mb-2">Dashboard</h1>
      <p className="text-[#A09488] mb-10">Welcome back. Manage your restaurant content below.</p>

      {/* Missing Env Vars Help */}
      {missingEnvVars.length > 0 && (
        <div className="mb-10 p-6 bg-[#2C231D] border border-red-900/50 rounded-lg">
          <div className="flex items-start gap-4">
            <div className="bg-red-900/20 p-2 rounded text-red-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-[#F0EBE3] mb-1">Environment Variables Missing</h2>
              <p className="text-sm text-[#A09488] mb-4">
                The following variables are not set in your <code className="text-[#C8892A]">.env.local</code> file:
              </p>
              <ul className="list-disc list-inside text-xs text-red-400 mb-6 space-y-1">
                {missingEnvVars.map(v => <li key={v}>{v}</li>)}
              </ul>
              
              <div className="space-y-4 text-sm text-[#A09488]">
                <p>1. Open (or create) the file <code className="text-[#C8892A]">.env.local</code> in your project root.</p>
                <p>2. Add your keys from the <a href="https://supabase.com/dashboard/project/_/settings/api" target="_blank" className="text-[#C8892A] hover:underline">Supabase Dashboard</a>:</p>
                <pre className="bg-[#1A1714] p-3 text-xs text-[#F0EBE3] border border-[#3D3229]">
{`NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key`}
                </pre>
                <p className="text-xs italic">Restart your dev server (Ctrl+C then npm run dev) after saving the file.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Setup Wizard / Warning */}
      {isConfigured === false && missingEnvVars.length === 0 && (
        <div className="mb-10 p-6 bg-[#2C231D] border border-red-900/50 rounded-lg">
          <div className="flex items-start gap-4">
            <div className="bg-red-900/20 p-2 rounded text-red-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-[#F0EBE3] mb-1">Configuration Required</h2>
              <p className="text-sm text-[#A09488] mb-4">
                It looks like your Supabase project is not fully configured. The gallery bucket or database tables may be missing.
              </p>
              
              {setupStatus.error && (
                <div className="mb-4 text-xs bg-red-900/10 border border-red-900/30 text-red-400 p-3 rounded">
                  {setupStatus.error}
                </div>
              )}

              {setupStatus.success && (
                <div className="mb-4 text-xs bg-green-900/10 border border-green-900/30 text-green-400 p-3 rounded">
                  {setupStatus.success}
                </div>
              )}

              <Button 
                onClick={runSetup} 
                disabled={setupStatus.loading}
                size="sm"
              >
                {setupStatus.loading ? "Running Setup..." : "Run Setup Wizard"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className={`bg-[#2C231D] border border-[#3D3229] p-6 hover:border-[#C8892A] transition-colors group ${
              isConfigured === false ? "opacity-50 grayscale" : ""
            }`}
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
