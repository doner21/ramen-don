---
artifact_type: "VERIFICATION_REPORT"
role: "VERIFIER"
run_id: "RUN_20260415-155909"
verdict: "PASS"
---

# Verification Report — Hero Assignment Bug Fix

## Summary

All success criteria verified by direct file inspection and command execution.

---

## Criterion 1 — `getHeroImage()` in `fetchers.ts`

**PASS**

- Function is exported at line 89 of `src/lib/data/fetchers.ts`.
- Guards with `if (!isSupabaseConfigured()) return null;` at line 90.
- Uses `createSupabaseServerClient()` at line 92.
- Queries `gallery_images` with `.eq("is_hero", true).limit(1).maybeSingle()` at lines 94–98.
- Returns `null` on `error || !data` at line 99.
- Returns `data as GalleryImage` at line 100.
- Has `catch` block returning `null` at lines 101–103.

All sub-criteria confirmed.

---

## Criterion 2 — `page.tsx` integration

**PASS**

- `getHeroImage` is imported from `@/lib/data/fetchers` at line 6.
- `Promise.all` destructures `[sections, hours, heroImage]` with `getHeroImage()` as the third element at lines 15–19.
- `<Hero section={heroSection} heroImage={heroImage} />` at line 26 passes the prop correctly.

---

## Criterion 3 — `Hero.tsx` accepts dynamic image prop

**PASS**

- `import type { GalleryImage } from "@/lib/data/types";` present at line 3.
- `HeroProps` interface includes `heroImage?: GalleryImage | null` at line 9.
- Function signature destructures `heroImage` at line 12.
- `FALLBACK_IMAGE = "/images/brand/hero_ramen.png"` at line 14.
- `heroSrc = heroImage?.storage_url || heroImage?.local_path || FALLBACK_IMAGE` at line 15.
- Background `<Image>` uses `src={heroSrc}` and `alt={heroImage?.alt_text ?? "Ramen Don atmospheric counter bar"}` at lines 20–21.

---

## Criterion 4 — Fallback to hardcoded image

**PASS**

When `heroImage` is `null` or `undefined`, `heroSrc` resolves to `FALLBACK_IMAGE` (`/images/brand/hero_ramen.png`) via the `||` chain. Verified by reading line 15 of `Hero.tsx`.

---

## Criterion 5 — `toggleHero` clears other heroes

**PASS**

`admin/gallery/page.tsx` lines 89–120:
- `const newValue = !image.is_hero` at line 90.
- When `newValue === true`: filters `images` for currently-starred images excluding the clicked one (`img.is_hero && img.id !== image.id`) and sends `Promise.all` PATCH with `is_hero: false` for each at lines 92–103.
- Then sends PATCH for the clicked image with `newValue` at lines 104–110.
- Calls `await revalidate()` at line 111.
- `setImages` maps: clicked image gets `newValue`; if `newValue === true`, all others get `is_hero: false`; if `newValue === false`, others are unchanged at lines 112–116.
- `catch (err: any)` calls `alert(...)` at lines 117–119.

All sub-criteria confirmed.

---

## Criterion 6 — TypeScript compiles without errors

**PASS**

`npx tsc --noEmit` produced zero output (zero errors).

---

## Invariant: `route.ts` not touched

**PASS**

`git diff HEAD -- src/app/api/admin/gallery/route.ts` produced no output — the file was not modified. No hero-clearing logic was added to the API route. The PATCH handler remains a simple generic update.

---

## Invariant: Public gallery page unaffected

**PASS**

`src/app/(public)/gallery/page.tsx` imports only `getGalleryImages` from `@/lib/data/fetchers` — an export that was not removed or altered. The page continues to work correctly.

---

VERDICT: PASS
