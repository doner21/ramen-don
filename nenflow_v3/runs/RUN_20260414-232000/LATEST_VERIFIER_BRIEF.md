---
artifact_type: "VERIFIER_BRIEF"
role: "EXECUTOR"
run_id: "RUN_20260414-232000"
attempt: 1
timestamp: "2026-04-14T23:30:00Z"
---

# ATT_1_VERIFIER_BRIEF — Run 5, Ramen Don Admin Panel

## What to Verify

Three changes were made:

1. **Upsert fix** in `src/app/api/admin/hours/route.ts` — strips `id`/`created_at`/`updated_at` before upserting to `opening_hours`.
2. **Revalidation call** added to `src/app/admin/hours/page.tsx` `handleSave` after successful save.
3. **Revalidation call** added to `src/app/admin/venue/page.tsx` `handleSave` after successful save.

---

## Pre-Condition Check

Before running any live verification, confirm the dev server is running:

```
npm run dev
```

Confirm it comes up on `http://localhost:3000`.

---

## Verification Steps

### Step 1 — Confirm code changes are in place

**File: `src/app/api/admin/hours/route.ts`**

Lines 20–26 should read:
```ts
for (const hour of hours) {
  const { id, created_at, updated_at, ...fields } = hour as any;
  const { error } = await supabase
    .from("opening_hours")
    .upsert(
      { ...fields, day_of_week: hour.day_of_week },
      { onConflict: "day_of_week" }
    );
```

**File: `src/app/admin/hours/page.tsx`**

In `handleSave`, after `if (!json.success) throw new Error(...)`, confirm:
```ts
await fetch("/api/admin/revalidate", { method: "POST" });
```
is present.

**File: `src/app/admin/venue/page.tsx`**

Same: after `if (!json.success) throw new Error(...)` in `handleSave`, confirm:
```ts
await fetch("/api/admin/revalidate", { method: "POST" });
```
is present.

---

### Step 2 — DB row count check (hours)

Call:
```
GET http://localhost:3000/api/admin/hours
```

Count the objects in `data`. Expect exactly 7, with `day_of_week` values 0 through 6, each appearing exactly once.

If there are more than 7 rows (duplicates exist from prior runs), run the following SQL in Supabase SQL Editor:
```sql
DELETE FROM opening_hours
WHERE id NOT IN (
  SELECT DISTINCT ON (day_of_week) id
  FROM opening_hours
  ORDER BY day_of_week, updated_at DESC NULLS LAST
);
```

Then re-call `GET /api/admin/hours` and confirm exactly 7 rows.

---

### Step 3 — Gallery page loads

Navigate to `http://localhost:3000/gallery`.

Confirm:
- No Next.js runtime error / red screen
- At least one image is visible (from `storage_url` or `local_path`)

Take a screenshot as evidence.

---

### Step 4 — Admin login

Navigate to `http://localhost:3000/admin`.

Log in with:
- Email: `donald@karaokebox.co.uk`
- Password: `18Frithst!!!!`

Confirm redirect to admin dashboard (not stuck on login).

---

### Step 5 — Hours save + revalidation

1. Navigate to `http://localhost:3000/admin/hours`
2. Confirm 7 distinct day rows are visible (Monday–Sunday)
3. Change one time field on any day (e.g., change Monday dinner_open from `17:00` to `17:30`)
4. Click "Save All Changes"
5. Confirm a success indicator appears ("Saved" checkmark)
6. In browser Network tab (or via curl), confirm the PATCH response body is `{"success":true}`
7. Also confirm that a second request to `/api/admin/revalidate` was made immediately after the PATCH

---

### Step 6 — Public hours update visible

After Step 5:

1. Navigate to `http://localhost:3000/visit`
2. Hard-refresh (Ctrl+Shift+R or equivalent)
3. Confirm the time change made in Step 5 is reflected in the public hours display

Take a screenshot as evidence.

---

### Step 7 — Venue save + revalidation

1. Navigate to `http://localhost:3000/admin/venue`
2. Change one field (e.g., phone number or tagline by a single character)
3. Click "Save Changes"
4. Confirm success indicator
5. Confirm PATCH `/api/admin/venue` returns `{"success":true}`
6. Hard-refresh `http://localhost:3000/visit`
7. Confirm the venue change is visible on the public page

---

### Step 8 — Invariant regression checks

- `middleware.ts` — confirm it was NOT modified (check `git diff middleware.ts`)
- `src/lib/supabase-server.ts` — confirm NOT modified
- `src/components/gallery/GalleryGrid.tsx` — confirm `storage_url || local_path` priority still present

---

## Pass Criteria

| Check | Expected |
|---|---|
| `GET /api/admin/hours` | Exactly 7 objects, distinct `day_of_week` 0–6 |
| `PATCH /api/admin/hours` | Returns `{"success":true}` |
| `/api/admin/revalidate` called after hours save | Confirmed in Network tab |
| `PATCH /api/admin/venue` | Returns `{"success":true}` |
| `/api/admin/revalidate` called after venue save | Confirmed in Network tab |
| `/gallery` public page | Loads without crash, at least one image |
| `/visit` public page | Reflects saved hours and venue data after hard-refresh |
| `middleware.ts` unchanged | `git diff middleware.ts` shows no changes |
| `GalleryGrid.tsx` unchanged | `storage_url \|\| local_path` still present |

---

## Known Risks for Verifier

1. **Duplicate rows in DB** — The code fix prevents future duplicates but does NOT purge existing ones. If `GET /api/admin/hours` returns more than 7 rows, the dedup SQL in Step 2 must be run before testing the upsert.
2. **Missing UNIQUE constraint on `day_of_week`** — If the Supabase table lacks this constraint, the `onConflict: "day_of_week"` upsert will silently insert instead of update. Verify by checking the Supabase table definition or running `SHOW CREATE TABLE opening_hours` equivalent.
3. **`/api/admin/revalidate` availability** — This endpoint was created in a prior run. Verify it exists and returns a 200. If it returns 404, the revalidation calls added in this run will silently fail (they do not throw on failure).

---

## Files Changed (for diff verification)

```
src/app/api/admin/hours/route.ts
src/app/admin/hours/page.tsx
src/app/admin/venue/page.tsx
```

Run `git diff` on these three files to confirm only the expected lines changed.
