import { createBrowserClient } from "@supabase/ssr";

// Intentionally NOT cached at module level. Each call returns a fresh
// browser client that reads the current auth cookies at invocation time.
// Multiple instances share the same cookie storage (document.cookie), so
// this is safe and avoids the "stale in-memory refresh token" bug that
// occurs when middleware rotates tokens but the singleton keeps the old RT.
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
