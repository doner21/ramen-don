---
artifact_type: "PLAN"
role: "PLANNER"
run_id: "RUN_20260414-232000"
attempt: 1
timestamp: "2026-04-14T23:25:00Z"
task_summary: "Verify gallery/hours/venue fixes from Run 4, diagnose and fix hours grouping bug, add missing revalidation calls"
---

# ATT_1_PLAN — Run 5, Ramen Don Admin Panel

## Task Statement

Verify and fix three post-Run-4 outstanding issues:

A. Confirm the public `/gallery` page now shows uploaded images (revalidation fix untested).
B. Diagnose and fix the opening hours grouping bug — Tue/Wed/Thu/Fri appear bunched in the admin display, indicating duplicate rows in the DB or a broken upsert.
C. Confirm that saving hours and venue details via the admin panel propagates to the public site after revalidation.

## Invariants (must not break)

1. Do NOT modify `middleware.ts`, `src/lib/supabase-server.ts`, or `.env.local`.
2. All `/api/admin/*` routes must continue using `createSupabaseAdminClient()` (the `@supabase/supabase-js` client with `persistSession: false`).
3. `GalleryGrid.tsx` src priority must remain `storage_url || local_path`.
4. Gallery upload flow (confirmed working) must not regress.
5. Admin login/logout must remain working.
6. Public fetchers (`fetchers.ts`) use `createSupabaseServerClient()` with the anon key — do not change this file.

## Implementation Steps

### Phase 1 — Start Dev Server and Verify Gallery

**Step 1.** Start the dev server: `npm run dev` in `C:/Users/doner/ramen-don`. Wait for ready on port 3000.

**Step 2.** Call `GET /api/admin/gallery` to inspect DB records. Check whether `storage_url` is a full `https://` URL or null/empty on each record.
- If `storage_url` is populated: navigate to `http://localhost:3000/gallery` and confirm images load.
- If `storage_url` is null for all records but `local_path` is a proper root-relative path (e.g., `/images/brand/hero_ramen.png`): page should still load — verify.
- If any record has a bare filename (no leading `/`) as `local_path` AND no `storage_url`: those rows will crash `next/image`. Fix by patching `storage_url` to the full Supabase public URL: `https://usponfmwsloozdccugmb.supabase.co/storage/v1/object/public/gallery/<filename>`.

### Phase 2 — Diagnose and Fix the Hours Grouping Bug

**Step 3.** Call `GET /api/admin/hours`. Count rows returned. Check whether any `day_of_week` value appears more than once.

**Step 4.** Check the Supabase `opening_hours` table for duplicates by running this SQL in Supabase SQL Editor:
```sql
SELECT day_of_week, day_name, COUNT(*) as cnt
FROM opening_hours
GROUP BY day_of_week, day_name
ORDER BY day_of_week;
```

**Step 5 — If duplicate rows exist:** Delete duplicates, keeping the most recent per day:
```sql
DELETE FROM opening_hours
WHERE id NOT IN (
  SELECT DISTINCT ON (day_of_week) id
  FROM opening_hours
  ORDER BY day_of_week, updated_at DESC NULLS LAST
);
```

**Step 6 — Fix the upsert logic in `src/app/api/admin/hours/route.ts`** (PATCH handler).
Strip `id`, `created_at`, `updated_at` before upserting to prevent future duplicates and silent conflict failures. Change:
```ts
const { error } = await supabase
  .from("opening_hours")
  .upsert(hour, { onConflict: "day_of_week" });
```
To:
```ts
const { id, created_at, updated_at, ...fields } = hour as any;
const { error } = await supabase
  .from("opening_hours")
  .upsert(
    { ...fields, day_of_week: hour.day_of_week },
    { onConflict: "day_of_week" }
  );
```

**Step 7.** Re-fetch `GET /api/admin/hours`. Confirm exactly 7 rows, one per `day_of_week` 0–6, no duplicates.

### Phase 3 — Add Missing Revalidation Calls

**Step 8.** Check `src/app/admin/hours/page.tsx` `handleSave` function. Confirm whether it calls `POST /api/admin/revalidate` after a successful save. It currently does NOT.

**Step 9.** In `src/app/admin/hours/page.tsx`, inside `handleSave`, after confirming `json.success`, add:
```ts
await fetch("/api/admin/revalidate", { method: "POST" });
```

**Step 10.** Apply the same revalidation call to `src/app/admin/venue/page.tsx` — it has the same missing revalidation step in its `handleSave` function.

### Phase 4 — Verify End-to-End: Hours and Venue on Public Site

**Step 11.** Log in to admin at `http://localhost:3000/admin` (`donald@karaokebox.co.uk` / `18Frithst!!!!`). Navigate to Opening Hours. Change one time field. Click Save All Changes.

**Step 12.** Confirm PATCH returns `{"success":true}` (check Network tab or curl).

**Step 13.** Navigate to public page that shows hours (likely `http://localhost:3000/visit`). Hard-refresh (Ctrl+Shift+R). Confirm the updated time appears.

**Step 14.** In admin, navigate to Venue Details. Change one field. Click Save. Confirm PATCH `/api/admin/venue` returns `{"success":true}`. Hard-refresh the public visit page. Confirm the venue data is updated.

### Phase 5 — Regression Check

**Step 15.** Confirm admin gallery page still loads.
**Step 16.** Confirm admin login/logout still works.

## Success Criteria (Verifier Checklist)

1. `GET /api/admin/gallery` returns at least one record with a non-null `storage_url` starting with `https://`, OR the gallery page loads without error with images visible from `local_path`.
2. `GET http://localhost:3000/gallery` loads without a `next/image` runtime error; at least one image is visible.
3. `GET /api/admin/hours` returns exactly 7 objects with distinct `day_of_week` values 0–6.
4. `PATCH /api/admin/hours` with a valid payload returns `{"success":true}`.
5. After the revalidation fix, saving hours in admin causes the updated hours to appear on the public `/visit` page after hard-refresh.
6. `PATCH /api/admin/venue` returns `{"success":true}` and the public `/visit` page reflects saved venue data after hard-refresh.
7. No regressions: admin login works, gallery upload API unchanged, `GalleryGrid.tsx` still uses `storage_url || local_path`.

## Handoff Notes

**Key files to change:**
- `src/app/api/admin/hours/route.ts` — upsert fix (strip `id`/timestamps)
- `src/app/admin/hours/page.tsx` — add revalidation call after save
- `src/app/admin/venue/page.tsx` — add revalidation call after save

**Key files to read (do not modify):**
- `src/app/(public)/visit/page.tsx` — confirm this is the public hours/venue display page
- `src/app/(public)/gallery/page.tsx` — confirm gallery public page structure

**Risks:**
1. `opening_hours` table may lack a UNIQUE constraint on `day_of_week`. If so, add one: `CREATE UNIQUE INDEX IF NOT EXISTS opening_hours_day_of_week_key ON opening_hours (day_of_week);`
2. `venue_details` table may have multiple rows from prior bad upserts. Run `SELECT COUNT(*) FROM venue_details` and delete extras if needed.
3. Public RLS `SELECT` policy must exist on `opening_hours` and `venue_details`. If public pages show empty data while admin API returns data, a missing policy is the cause.
4. Hours and venue details display on `/visit` route — not `/` (homepage). Revalidation of `/` is still correct for gallery, but verification of hours/venue must target `/visit`.
