---
artifact_type: "RESEARCH"
role: "RESEARCHER"
run_id: "RUN_20260415-155909"
---

# Research — Hero Assignment Bug

## Investigation Scope

Traced the full data flow for hero image assignment:
- DB schema and hero flag storage
- Admin PATCH API route
- Admin gallery frontend star toggle
- Public landing page hero fetch
- Hero component render logic

## Key Findings

### 1. Hero flag IS stored on gallery_images table
`supabase/migrations/001_initial.sql` — `gallery_images` has `is_hero BOOLEAN DEFAULT false`
TypeScript type in `src/lib/data/types.ts` includes `is_hero?: boolean`

### 2. PATCH API exists and DOES persist correctly
`src/app/api/admin/gallery/route.ts` — PATCH handler calls
`supabase.from("gallery_images").update(fields).eq("id", id)`
This correctly persists `is_hero` to the database.

### 3. Admin gallery star click DOES call the API
`src/app/admin/gallery/page.tsx` — `toggleHero()` sends
`PATCH /api/admin/gallery { id, is_hero: !image.is_hero }` and updates local state.
Write side is functional.

### 4. Landing page Hero component uses a HARDCODED image path — THE ROOT CAUSE
`src/app/(public)/page.tsx` — fetches `homepage_sections` only; passes section to `<Hero>`
`src/components/sections/Hero.tsx` — renders `<Image src="/images/brand/hero_ramen.png" ...>`
The Hero component NEVER queries `gallery_images` or checks `is_hero`.

### 5. Additional: homepage_sections has an image_key field
The `homepage_sections` table has an `image_key TEXT` field (seed value: `hero_ramen.png`).
This field is never used by the Hero component — it is ignored entirely.

### 6. getGalleryImages() fetcher exists but is unused on the landing page
`src/lib/data/fetchers.ts` has `getGalleryImages()` used only by the public gallery page.

## Constraints Identified

- The admin gallery star toggle + PATCH API are working correctly — do NOT touch them
- Must not regress the public `/gallery` page
- The landing page is server-rendered (async page component) — hero fetch can be server-side
- Must handle the case where no image has `is_hero = true` (graceful fallback to hardcoded default)
- Admin auth must remain intact

## Recommendations

**Minimal, targeted fix:**
1. Add a `getHeroImage()` fetcher to `src/lib/data/fetchers.ts` that queries `gallery_images WHERE is_hero = true LIMIT 1`
2. Call it in `src/app/(public)/page.tsx` alongside the existing fetches
3. Pass the result to the `<Hero>` component as a prop
4. In `Hero.tsx`, use the dynamic image URL when available, fall back to hardcoded default otherwise

**Also fix the admin UX issue (star does not clear previous hero):**
The `toggleHero` handler only toggles the clicked image's flag. It does not clear `is_hero` on any previously-starred image. This means multiple images can have `is_hero = true` simultaneously. The fix: before setting `is_hero: true`, PATCH all other images to `is_hero: false` — OR add a DB-level "clear hero" step in the API (single-hero enforcement).

## Unknowns Remaining

- Whether Supabase RLS policies affect a public-facing query to `gallery_images` (may need the public/anon key, not just admin key)
- Exact URL format for Supabase storage images (need to verify the `url` or `storage_path` field on gallery_images rows)
