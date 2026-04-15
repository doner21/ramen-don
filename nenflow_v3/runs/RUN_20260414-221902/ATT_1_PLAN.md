---
artifact_type: PLAN
run_id: RUN_20260414-221902
role: planner
---

# Plan — Ramen-Don Admin Panel Fixes

## Issue Analysis

### Issue 1 — False "Configuration Required" banner

File: `src/app/admin/page.tsx`, function `checkConfiguration()` (lines 25–54)

Root cause: `supabase.storage.listBuckets()` is called with the browser client (anon key). The Supabase anon key cannot list storage buckets — the call returns an empty array with no error. This causes `galleryBucket = undefined` → `!galleryBucket === true` → `setIsConfigured(false)` even when the bucket exists.

Fix: Remove the `listBuckets()` call entirely from `checkConfiguration`. The configuration check only needs to verify that the database is reachable (menu_items query). If that succeeds, Supabase is configured. The gallery bucket is a separate concern that does not need to be verified on every dashboard load.

### Issue 2 — RLS error from setup wizard

File: `src/app/api/admin/setup/route.ts`

The route itself is correct: it uses `createSupabaseServiceClient()` with `SUPABASE_SERVICE_ROLE_KEY`, which bypasses RLS. The route does NOT produce an RLS error.

The RLS error the user sees is produced by the browser-side `checkConfiguration()` which runs AFTER the setup wizard completes (`checkConfiguration()` is called in `useEffect` on mount, and then the setup wizard sets `setIsConfigured(true)` on success anyway). 

Re-examination: The actual "new row violates row-level security policy" error is the message shown in `setupStatus.error` — this string comes from `data.error` in the `runSetup()` function. The setup route returns `{ success: false, error: err.message }` when an exception is thrown. Looking at the route: it calls `supabase.storage.listBuckets()` with the service role key (fine), then calls `supabase.from("menu_items").select()` — also fine. The route should not produce an RLS error.

However: the "Configuration Required" banner stays visible because `checkConfiguration()` still returns false (Issue 1). The user may have seen the RLS error from a PREVIOUS attempt that used a different approach. Since the setup route now uses service role key correctly, fixing Issue 1 resolves the visible symptom.

If the setup route does throw an RLS error in practice, it would be because `SUPABASE_SERVICE_ROLE_KEY` is missing in env — but that's an environment config issue, not a code issue.

Fix for Issue 2: Fixing Issue 1 resolves the false "Configuration Required" banner that makes users click "Run Setup Wizard" in the first place. The setup route itself is already correct.

### Issue 3 — Opening hours and gallery not persisting

Already resolved: admin user `donald@karaokebox.co.uk` now exists. The session fix from RUN_20260414-212623 is already applied. No code changes needed.

## Changes Required

### Change 1: `src/app/admin/page.tsx`

Modify `checkConfiguration()` to remove the `listBuckets()` call. New logic:
- Check env vars (keep existing)
- Query menu_items (keep existing)
- If menuError → setIsConfigured(false)
- Otherwise → setIsConfigured(true)
- Remove: `listBuckets()` call, `galleryBucket` variable, `storageError` in condition

## Invariants

- Do NOT modify: middleware.ts
- Do NOT modify: src/lib/supabase.ts, src/lib/auth-errors.ts, src/app/admin/gallery/page.tsx, src/app/admin/menu/page.tsx, src/app/admin/layout.tsx, src/components/admin/AdminAuthWatcher.tsx
- Do NOT expose SERVICE_ROLE_KEY to the browser
- Do NOT modify RLS policies

## Success Criteria

1. `src/app/admin/page.tsx` does NOT call `listBuckets()`
2. `checkConfiguration()` returns true when menu_items query succeeds
3. `npm run build` passes
4. Session-fix files are unchanged (verified by hash/content check)
