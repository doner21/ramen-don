---
artifact_type: "EXECUTION_REPORT"
role: "EXECUTOR"
run_id: "RUN_20260414-232000"
attempt: 1
timestamp: "2026-04-14T23:30:00Z"
---

# ATT_1_EXECUTION — Run 5, Ramen Don Admin Panel

## Summary

Implemented all three changes specified in ATT_1_PLAN.md. No invariants were violated.

## Changes Made

### A) Fix upsert bug in `src/app/api/admin/hours/route.ts`

In the PATCH handler, destructured `id`, `created_at`, `updated_at` from each `hour` object before upserting, and changed the upsert call to use `onConflict: "day_of_week"` with a clean fields object.

**Before:**
```ts
const { error } = await supabase
  .from("opening_hours")
  .upsert(hour, { onConflict: "day_of_week" });
```

**After:**
```ts
const { id, created_at, updated_at, ...fields } = hour as any;
const { error } = await supabase
  .from("opening_hours")
  .upsert(
    { ...fields, day_of_week: hour.day_of_week },
    { onConflict: "day_of_week" }
  );
```

This prevents the upsert from passing `id` to Supabase, which was causing it to attempt a primary key insert rather than a conflict-based update on `day_of_week`, leading to duplicate rows.

### B) Add revalidation to hours save handler — `src/app/admin/hours/page.tsx`

After `if (!json.success) throw new Error(...)`, added:
```ts
await fetch("/api/admin/revalidate", { method: "POST" });
```

### C) Add revalidation to venue save handler — `src/app/admin/venue/page.tsx`

Same addition in the venue `handleSave` after `if (!json.success) throw new Error(...)`:
```ts
await fetch("/api/admin/revalidate", { method: "POST" });
```

## Files Changed

- `src/app/api/admin/hours/route.ts` — upsert fix (strip id/timestamps, explicit fields spread)
- `src/app/admin/hours/page.tsx` — added revalidation call after successful save
- `src/app/admin/venue/page.tsx` — added revalidation call after successful save

## Invariants Check

1. `middleware.ts`, `src/lib/supabase-server.ts`, `.env.local` — NOT touched.
2. All `/api/admin/*` routes continue using `createSupabaseAdminClient()` — hours route unchanged in this regard.
3. `GalleryGrid.tsx` — NOT touched.
4. Gallery upload flow — NOT touched.
5. Admin login/logout — NOT touched.

## Known Risks

- The `onConflict: "day_of_week"` upsert only works correctly if the `opening_hours` table has a UNIQUE constraint on `day_of_week`. If the constraint is missing, Supabase will insert new rows instead of updating. The plan noted this risk and suggested adding a UNIQUE index if needed.
- Existing duplicate rows in the database are NOT cleaned up by this code change alone. The plan described a SQL DELETE for duplicate cleanup (Step 5) but marked it as a SQL Editor operation — not a code change. The Verifier should check row counts and run the dedup SQL if necessary.
- The revalidation endpoint (`/api/admin/revalidate`) must exist and function. This was already present from prior runs; no change was made to it.

## What Still Feels Uncertain

- Whether duplicate rows already exist in `opening_hours` in the live DB. The fix prevents future duplicates but does not purge existing ones. The Verifier should call `GET /api/admin/hours` and count rows before any save.
- Whether the `day_of_week` UNIQUE constraint exists in Supabase. The upsert fix is correct TypeScript, but if the DB lacks the constraint, Supabase may still insert duplicates.
