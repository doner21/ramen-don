# Verifier Brief — Hero Assignment Bug Fix
run_id: RUN_20260415-155909

## What Was Changed

Four files were modified. One file was explicitly left untouched (`src/app/api/admin/gallery/route.ts`).

---

## Verification Checklist

### 1. `src/lib/data/fetchers.ts`

Check that `getHeroImage()` exists and:
- Is exported
- Guards with `isSupabaseConfigured()` returning `null` when unconfigured
- Uses `createSupabaseServerClient()`
- Queries `gallery_images` with `.eq("is_hero", true).limit(1).maybeSingle()`
- Returns `null` on `error || !data`
- Returns `data as GalleryImage` on success
- Has a `catch` block returning `null`

### 2. `src/app/(public)/page.tsx`

Check that:
- `getHeroImage` is in the import from `@/lib/data/fetchers`
- The `Promise.all` destructures `[sections, hours, heroImage]` with `getHeroImage()` as the third element
- `<Hero>` receives `heroImage={heroImage}` prop

### 3. `src/components/sections/Hero.tsx`

Check that:
- `import type { GalleryImage } from "@/lib/data/types";` is present
- `HeroProps` interface includes `heroImage?: GalleryImage | null`
- Function signature destructures `heroImage`
- `FALLBACK_IMAGE` is defined as `"/images/brand/hero_ramen.png"`
- `heroSrc` is derived as `heroImage?.storage_url || heroImage?.local_path || FALLBACK_IMAGE`
- The background `<Image>` uses `src={heroSrc}` and `alt={heroImage?.alt_text ?? "Ramen Don atmospheric counter bar"}`
- No other JSX in the component was changed

### 4. `src/app/admin/gallery/page.tsx`

Check that `toggleHero`:
- Declares `const newValue = !image.is_hero`
- When `newValue === true`: filters `images` for currently-starred images (excluding clicked), sends PATCH `is_hero: false` for each via `Promise.all`
- Then sends PATCH for the clicked image with `newValue`
- Calls `await revalidate()` after the main PATCH
- Updates local state: clicked image gets `newValue`; if `newValue === true`, all others get `is_hero: false`; if `newValue === false`, others are unchanged
- Has `catch (err: any)` calling `alert(...)`

### 5. TypeScript

Run `npx tsc --noEmit` from the repo root. Expect zero output (zero errors).

### 6. Untouched file

Confirm `src/app/api/admin/gallery/route.ts` has NOT been modified (check git diff).

---

## Success Criteria (from Plan)

1. After starring image X in admin, refreshing `/` shows image X as hero background.
2. After starring image X, no other image retains `is_hero = true` in DB.
3. Toggle-off sets `is_hero: false` and landing page reverts to hardcoded fallback.
4. When DB has no `is_hero = true` row, landing page shows `/images/brand/hero_ramen.png` without error.
5. Public `/gallery` page continues to display all images.
6. TypeScript compiles without errors.

---

## Key File Paths

- `src/lib/data/fetchers.ts`
- `src/app/(public)/page.tsx`
- `src/components/sections/Hero.tsx`
- `src/app/admin/gallery/page.tsx`
- `src/app/api/admin/gallery/route.ts` (should be unmodified)
