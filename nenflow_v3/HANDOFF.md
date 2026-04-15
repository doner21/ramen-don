---
created_at: 2026-04-14T23:00:00Z
project: ramen-don
path: C:/Users/doner/ramen-don
---

# Handoff Document — Ramen Don Admin Panel

## Summary of All Work Done (Runs 1–4)

### Run 1 (PASS): Session Fix
- Removed singleton from `src/lib/supabase.ts`
- Created `src/lib/auth-errors.ts`
- Added `AdminAuthWatcher` to admin layout

### Run 2 (PASS): False Config Banner
- Removed `listBuckets()` from `checkConfiguration()` in `src/app/admin/page.tsx`

### Run 3 (PASS): RLS Writes via API Routes
- All admin pages were writing directly to Supabase from the browser using the anon key — RLS blocked these writes
- Routed all writes through `/api/admin/*` routes
- Those routes used `createSupabaseServiceClient` (broken — it still sent cookie-based user JWT)

### Run 4 (PASS): Proper Service Role Client
- **Root cause confirmed**: `createServerClient` from `@supabase/ssr` sends the user's cookie JWT as the `Authorization` header even when given the service role key, so RLS was never bypassed
- Created `src/lib/supabase-admin.ts` using `createClient` from `@supabase/supabase-js` with `persistSession: false` — this is the correct way to get a true service role client
- Migrated ALL admin API routes to use `createSupabaseAdminClient()`
- Gallery uploads now work end-to-end (confirmed by user: "uploading pictures to the gallery is working")
- Fixed `GalleryGrid.tsx` src priority: was `local_path || storage_url` — for uploaded images `local_path` is just a bare filename like `mvbrb5y831.jpg` which crashes `next/image`. Changed to `storage_url || local_path`
- Fixed `revalidate/route.ts` to revalidate ALL public pages (`/`, `/menu`, `/gallery`, `/reservations`) not just `/menu`

---

## Current State (as of Run 4)

**Working:**
- Admin login/logout
- Gallery upload (images appear in admin backend)
- API routes all use true service role client (RLS bypassed)
- `GalleryGrid.tsx` src order fixed (no more crash on gallery page)
- Revalidation now covers all public pages

**Still broken / not yet verified:**
1. **Gallery images not showing on public `/gallery` page** — was a revalidation bug (fixed in Run 4, not yet tested by user)
2. **Opening hours not updating on main site** — was a revalidation bug (fixed in Run 4, not yet tested by user)
3. **Venue details not updating on main site** — same revalidation bug
4. **Opening hours display grouping bug** — user reports Tue/Wed/Thu/Fri appear to be "in the same bucket". Likely a data issue (multiple rows with the same day_of_week, or the `upsert` with `onConflict: "day_of_week"` is creating duplicates instead of updating)

---

## What the Next Agent Must Do

### Step 1: Start the dev server and verify the gallery public page
```
npm run dev   # in C:/Users/doner/ramen-don
```
Navigate to `http://localhost:3000/gallery` — should now show uploaded images without crashing.

If it still crashes, check whether `storage_url` is actually set on records in Supabase. Open Supabase dashboard → Table Editor → `gallery_images` — confirm `storage_url` column has full `https://...` URLs.

### Step 2: Verify opening hours save and reflect on main site
1. Go to `http://localhost:3000/admin` → log in → Opening Hours
2. Change one day's time and click "Save All Changes"
3. Check the browser Network tab: the `PATCH /api/admin/hours` call should return `{"success":true}`
4. Navigate to the public homepage or wherever hours are displayed
5. Hard-refresh the page (Ctrl+Shift+R) — the new hours should show

If hours still don't update, the fetchers.ts uses `createSupabaseServerClient` (anon key, reads via RLS). Public read policy exists so this should work. If it doesn't, the fetcher itself may need to switch to `createSupabaseAdminClient`.

### Step 3: Diagnose the opening hours grouping bug
User says Tue/Wed/Thu/Fri appear grouped or identical. Possible causes:

**A) Duplicate rows in the database**
The `upsert` with `onConflict: "day_of_week"` should prevent duplicates, but run this in Supabase SQL Editor to check:
```sql
SELECT day_of_week, day_name, COUNT(*) FROM opening_hours GROUP BY day_of_week, day_name ORDER BY day_of_week;
```
If any `day_of_week` appears more than once, delete the duplicates:
```sql
DELETE FROM opening_hours WHERE id NOT IN (
  SELECT DISTINCT ON (day_of_week) id FROM opening_hours ORDER BY day_of_week, created_at
);
```

**B) The hours page renders stale/grouped data**
If the fetcher returns rows in wrong order, the display groups them oddly. The query orders by `day_of_week` ASC. Verify the 7 rows exist with correct day numbers (0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat).

**C) Upsert is silently failing, not updating**
The `PATCH /api/admin/hours` route iterates and calls `upsert(hour, { onConflict: "day_of_week" })` for each row. If the `id` field is included in the upsert payload AND there's a conflict on both `id` and `day_of_week`, Postgres may get confused. Fix: strip `id`, `created_at`, `updated_at` before upserting:
```ts
// In src/app/api/admin/hours/route.ts PATCH handler:
for (const hour of hours) {
  const { id, created_at, updated_at, ...fields } = hour;
  await supabase.from("opening_hours").upsert(
    { ...fields, day_of_week: hour.day_of_week },
    { onConflict: "day_of_week" }
  );
}
```

### Step 4: Verify venue details save and show on main site
Same pattern as hours — PATCH `/api/admin/venue` should return `{success:true}` and after revalidation the public site should show updated data.

---

## Key Architecture (confirmed correct as of Run 4)

```
Browser (admin pages)
  → fetch("/api/admin/*")
  → createSupabaseAdminClient()  ← src/lib/supabase-admin.ts
  → createClient(url, SERVICE_ROLE_KEY, { auth: { persistSession: false } })
  → Supabase (RLS bypassed entirely)

Public pages (SSR)
  → fetchers.ts → createSupabaseServerClient()  ← uses anon key + cookies
  → Supabase (RLS applies, public read policies allow SELECT)
```

---

## Files Changed in Run 4

```
src/lib/supabase-admin.ts               ← NEW: true service role client
src/app/api/admin/gallery/route.ts      ← uses admin client; POST/PATCH/DELETE added
src/app/api/admin/hours/route.ts        ← uses admin client
src/app/api/admin/venue/route.ts        ← uses admin client
src/app/api/admin/homepage/route.ts     ← uses admin client
src/app/api/admin/menu/items/route.ts   ← uses admin client; POST/PATCH/DELETE added
src/app/api/admin/menu/categories/route.ts ← uses admin client; POST/PATCH/DELETE added
src/app/api/admin/setup/route.ts        ← uses admin client
src/app/api/admin/revalidate/route.ts   ← now revalidates ALL public pages
src/app/admin/hours/page.tsx            ← writes via PATCH /api/admin/hours
src/app/admin/gallery/page.tsx          ← all reads/writes via /api/admin/gallery
src/app/admin/venue/page.tsx            ← all reads/writes via /api/admin/venue
src/app/admin/homepage/page.tsx         ← all reads/writes via /api/admin/homepage
src/app/admin/menu/page.tsx             ← all reads/writes via /api/admin/menu/*; supabase prop removed from modals
src/app/admin/page.tsx                  ← health check via API route
src/components/gallery/GalleryGrid.tsx  ← src priority: storage_url first, then local_path
```

## DO NOT CHANGE
- `middleware.ts`
- `src/lib/supabase-server.ts`
- `.env.local`

## Credentials
- Admin login: `donald@karaokebox.co.uk` / `18Frithst!!!!`
- Supabase project ref: `usponfmwsloozdccugmb`
- Dev server: `npm run dev` in `C:/Users/doner/ramen-don` → `http://localhost:3000`

## Start a fresh /nenflow_v3 session

Invoke `/nenflow_v3` with:
"Ramen Don admin panel — Run 5. Read the full handoff at C:/Users/doner/ramen-don/nenflow_v3/HANDOFF.md. The gallery page crash and revalidation are fixed but not yet tested. The opening hours display grouping bug (Tue/Wed/Thu/Fri appear bunched) still needs diagnosis. Venue details and hours may not yet be reflecting updates on the public site. Use Playwright to verify each issue live."
