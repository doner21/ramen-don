"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase";

export default function AdminAuthWatcher() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        router.replace("/admin/login");
      }
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

  return null;
}
