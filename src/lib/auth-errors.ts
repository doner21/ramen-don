// Detects whether an error thrown by a Supabase client call is auth-related
// (expired/invalid session, missing JWT). Used by admin pages to trigger a
// clean redirect to /admin/login instead of showing a cryptic database error.
export function isAuthError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const e = err as { status?: number; code?: string; message?: string; name?: string };

  // HTTP 401 from PostgREST / Storage
  if (e.status === 401) return true;

  // Supabase auth error codes / names
  if (e.name === "AuthSessionMissingError") return true;
  if (e.name === "AuthApiError" && (e.status === 401 || e.status === 403)) return true;

  // Common message fragments returned by supabase-js / gotrue
  const msg = (e.message || "").toLowerCase();
  if (msg.includes("jwt expired")) return true;
  if (msg.includes("invalid jwt")) return true;
  if (msg.includes("invalid refresh token")) return true;
  if (msg.includes("refresh token not found")) return true;
  if (msg.includes("not authenticated")) return true;

  return false;
}
