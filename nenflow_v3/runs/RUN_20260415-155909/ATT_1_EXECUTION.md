---
artifact_type: "EXECUTION_REPORT"
role: "EXECUTOR"
run_id: "RUN_20260415-155909"
---

# Execution Report — Hero Assignment Bug Fix

## Summary

All 4 implementation steps completed successfully. TypeScript compiled with zero errors.

---

## Step-by-Step Results

### Step 1 — `getHeroImage()` added to `src/lib/data/fetchers.ts`

Inserted after `getGalleryImages()` (before `getHomepageSections()`). Uses `isSupabaseConfigured()` guard (matching all other fetchers in the file), `createSupabaseServerClient()` for the DB client, `.maybeSingle()` to avoid false errors on zero rows, and returns `null` on any error or when Supabase is unconfigured.

**Status: DONE**

---

### Step 2 — `src/app/(public)/page.tsx` updated

- Added `getHeroImage` to the import from `@/lib/data/fetchers`.
- Expanded `Promise.all` to `[sections, hours, heroImage]`.
- Passed `heroImage={heroImage}` prop to `<Hero>`.

**Status: DONE**

---

### Step 3 — `src/components/sections/Hero.tsx` updated

- Added `import type { GalleryImage } from "@/lib/data/types";`
- Added `heroImage?: GalleryImage | null` to the existing `HeroProps` interface.
- Destructured `heroImage` in the function signature.
- Added `FALLBACK_IMAGE` constant and `heroSrc` derivation (`storage_url || local_path || FALLBACK_IMAGE`).
- Replaced hardcoded `src` and `alt` on the background `<Image>` with `src={heroSrc}` and `alt={heroImage?.alt_text ?? "Ramen Don atmospheric counter bar"}`.

**Status: DONE**

---

### Step 4 — `toggleHero` replaced in `src/app/admin/gallery/page.tsx`

Replaced the old single-PATCH handler with the new logic that:
1. When turning hero ON: first clears `is_hero` on all currently-starred images (parallel PATCH requests).
2. Then patches the clicked image to its new value.
3. Updates local React state to mirror DB state (all others set to `false` when enabling, unchanged when disabling).

**Status: DONE**

---

### Step 5 — TypeScript check

Command: `npx tsc --noEmit`
Output: (empty — zero errors)

**Status: PASS**

---

## Files Modified

- `src/lib/data/fetchers.ts` — added `getHeroImage()` function
- `src/app/(public)/page.tsx` — import, Promise.all, Hero prop
- `src/components/sections/Hero.tsx` — GalleryImage import, HeroProps extension, dynamic src/alt
- `src/app/admin/gallery/page.tsx` — replaced `toggleHero` with single-hero enforcement logic

## Files NOT Modified (per plan invariant)

- `src/app/api/admin/gallery/route.ts` — untouched

---

## Edge Cases Noted

- If Supabase RLS restricts the anon key from reading `gallery_images`, `getHeroImage()` returns `null` and the landing page falls back to `/images/brand/hero_ramen.png` — this is expected and correct per plan invariants.
- When no row has `is_hero = true`, `.maybeSingle()` returns `{ data: null, error: null }` — the `if (error || !data) return null` guard handles this cleanly.
