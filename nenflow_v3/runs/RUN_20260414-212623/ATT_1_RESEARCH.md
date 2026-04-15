---
artifact_type: RESEARCH
run_id: RUN_20260414-212623
role: researcher
---

# Research Brief — Admin Session Expiry Bug

## Environment Variables Found

File: `.env.local` (present in project root)
- `NEXT_PUBLIC_SUPABASE_URL` — set (valid)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — set (valid)
- `SUPABASE_SERVICE_ROLE_KEY` — set (valid)

**No missing or placeholder env vars.** The issue is NOT a misconfigured `.env.local`.

---

## Supabase Client Setup

### Browser client — `src/lib/supabase.ts`

MODULE-LEVEL SINGLETON. Client created once, cached forever. Initializes in-memory session from cookies on first creation. If middleware later refreshes tokens (consuming old refresh token, issuing new ones in response cookies), the singleton retains the OLD in-memory refresh token — causing refresh token rotation conflict.

### Server client — `src/lib/supabase-server.ts`
Uses `createServerClient` with proper cookie handlers. Correct pattern.

---

## Middleware Analysis — `middleware.ts`

- Uses `createServerClient` with cookie handlers
- Calls `getUser()` — if access token expired, server side consumes old refresh token and issues new tokens via `setAll`
- Sets new auth cookies with `httpOnly: false` (required for browser client to read via `document.cookie`)
- Has harmless `oldCookies` no-op step
- Matcher: `/admin`, `/admin/:path*`

Functionally correct. The middleware IS refreshing sessions properly but this creates the rotation conflict with the singleton browser client.

---

## Admin Panel Structure

All admin pages are `"use client"` components. No server components in admin. Admin layout has NO auth provider or session listener.

Error sources (exact lines):
- `src/app/admin/gallery/page.tsx` lines 57-63: explicit `getUser()` guard before upload
- `src/app/admin/menu/page.tsx` lines 348-354: explicit `getUser()` guard in ItemModal
- `src/app/admin/menu/page.tsx` lines 548-551: explicit `getSession()` guard in CategoryModal

All three error sources are "diagnostic checks" that throw `"Your session has expired. Please log in again."` when user is null.

---

## Root Cause — Refresh Token Rotation Conflict

1. User logs in → singleton browser client created → reads RT₀ from cookies into memory
2. AT₀ (access token) expires after 1 hour
3. User navigates → middleware runs → server-side `getUser()` consumes RT₀, issues AT₁+RT₁, sets new cookies in response
4. Browser receives AT₁, RT₁ in cookies
5. Page renders — singleton is returned from cache, still has AT₀+RT₀ in memory
6. User saves something → explicit `getUser()` check fires
7. Singleton tries to refresh with RT₀ (in-memory, stale) — but RT₀ was consumed by middleware
8. Supabase: "Invalid Refresh Token" → session cleared → `getUser()` returns null → error thrown

---

## Key Files for Planner

**Must fix:**
1. `src/lib/supabase.ts` — Remove singleton
2. `src/app/admin/gallery/page.tsx` — Remove explicit `getUser()` guard; handle auth errors from actual operations
3. `src/app/admin/menu/page.tsx` — Remove explicit `getUser()`/`getSession()` guards in both modals

**Must check (likely same pattern):**
4. `src/app/admin/hours/page.tsx`
5. `src/app/admin/venue/page.tsx`
6. `src/app/admin/homepage/page.tsx`

**Consider improving:**
7. `src/app/admin/layout.tsx` — Add `onAuthStateChange` to redirect on genuine session expiry

**No change needed:**
8. `middleware.ts` — Functionally correct
9. `.env.local` — Correctly configured

---

## Unknowns / Gaps

- Whether hours/venue/homepage pages have same explicit auth guard pattern (likely yes — verify during execution)
- RLS policies cannot be verified from static analysis alone
