"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const notice = searchParams.get("notice");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        setError(authError.message);
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1714] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl font-semibold tracking-[0.2em] uppercase text-[#F0EBE3] mb-2">
            RAMEN DON
          </h1>
          <p className="text-sm text-[#A09488]">Admin Login</p>
        </div>

        {notice === "not_configured" && (
          <div className="mb-6 p-4 bg-[#8B4B3A]/20 border border-[#8B4B3A] text-sm text-[#F0EBE3]">
            Supabase is not configured. Please set up your environment variables.
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-[#2C231D] border border-[#3D3229] p-8 space-y-5">
          {error && (
            <div className="p-3 bg-red-900/20 border border-red-800 text-red-300 text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-xs tracking-widest uppercase text-[#A09488] mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#1A1714] border border-[#3D3229] text-[#F0EBE3] px-4 py-3 text-sm focus:outline-none focus:border-[#C8892A] transition-colors"
              placeholder="admin@ramendon.co.uk"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs tracking-widest uppercase text-[#A09488] mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#1A1714] border border-[#3D3229] text-[#F0EBE3] px-4 py-3 text-sm focus:outline-none focus:border-[#C8892A] transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C8892A] text-[#1A1714] font-sans font-semibold py-3 hover:bg-[#d9992f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#1A1714]" />}>
      <LoginForm />
    </Suspense>
  );
}
