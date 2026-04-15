---
artifact_type: "PLAN"
role: "PLANNER"
run_id: "RUN_20260415-155909"
---

# Plan — Hero Assignment Bug Fix

## Task Statement

Two related bugs must be fixed in the gallery hero-image assignment flow:

**Issue 1 (Read side):** The public landing page `Hero` component always renders a hardcoded image path (`/images/brand/hero_ramen.png`) and never reads the `is_hero` flag from the database. Starring an image in the admin panel has no visible effect on the live site.

**Issue 2 (Write side):** The admin `toggleHero` handler only patches the clicked image's `is_hero` flag. It does not clear `is_hero` on any previously-starred image. This allows multiple rows in `gallery_images` to have `is_hero = true` simultaneously, producing an ambiguous "hero" record.

The fix must be minimal and targeted. No broader refactoring.

---

## Invariants (must not break)

- The public `/gallery` page must continue to render all gallery images correctly.
- The admin upload, delete, and alt-text-update flows must remain unaffected.
- Admin authentication must remain intact.
- When no image has `is_hero = true` (or Supabase is not configured), the landing page must gracefully fall back to the existing hardcoded image `/images/brand/hero_ramen.png`.
- The `revalidate()` call in the admin must continue to fire after any hero toggle so that ISR/server cache is cleared.
- TypeScript must compile without errors on the changed files.

---

## Success Criteria

1. After starring image X in the admin gallery, refreshing the public landing page (`/`) shows image X as the hero background.
2. After starring image X, no other image retains `is_hero = true` in the database.
3. Starring a currently-starred image (toggle off) sets it to `is_hero = false` and the landing page reverts to the hardcoded fallback image.
4. When the database has no `is_hero = true` row, the landing page shows the hardcoded fallback `/images/brand/hero_ramen.png` without error.
5. The public `/gallery` page continues to display all images.
6. `npm run build` (or `next build`) completes without TypeScript or compilation errors.

---

## Implementation Steps

### Step 1 — Add `getHeroImage()` fetcher

**File:** `src/lib/data/fetchers.ts`

Add a new exported async function after `getGalleryImages()`:

```ts
export async function getHeroImage(): Promise<GalleryImage | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .eq("is_hero", true)
      .limit(1)
      .maybeSingle();
    if (error || !data) return null;
    return data as GalleryImage;
  } catch {
    return null;
  }
}
```

Notes:
- Uses `maybeSingle()` (not `single()`) — returns `null` instead of an error when zero rows match.
- Returns `null` on any error or when Supabase is unconfigured; callers must handle null.
- Import of `GalleryImage` is already present in `fetchers.ts` (line 10).

---

### Step 2 — Fetch hero image on the landing page

**File:** `src/app/(public)/page.tsx`

2a. Add `getHeroImage` to the existing import from `@/lib/data/fetchers` (line 6).

2b. Add `getHeroImage()` to the `Promise.all` call so it runs in parallel with the existing fetches:

```ts
const [sections, hours, heroImage] = await Promise.all([
  getHomepageSections(),
  getOpeningHours(),
  getHeroImage(),
]);
```

2c. Pass `heroImage` as a prop to the `<Hero>` component:

```tsx
{heroSection && <Hero section={heroSection} heroImage={heroImage} />}
```

---

### Step 3 — Make `Hero` component use the dynamic image

**File:** `src/components/sections/Hero.tsx`

3a. Add `GalleryImage` to the import (add `import type { GalleryImage } from "@/lib/data/types";`).

3b. Extend the `HeroProps` interface:

```ts
interface HeroProps {
  section?: HomepageSection;
  heroImage?: GalleryImage | null;
}
```

3c. Destructure `heroImage` in the function signature:

```ts
export default function Hero({ section, heroImage }: HeroProps = {}) {
```

3d. Derive the image source before the return statement:

```ts
const FALLBACK_IMAGE = "/images/brand/hero_ramen.png";
const heroSrc = heroImage?.storage_url || heroImage?.local_path || FALLBACK_IMAGE;
```

3e. Replace the hardcoded `src` on the background `<Image>` tag:

```tsx
<Image
  src={heroSrc}
  alt={heroImage?.alt_text ?? "Ramen Don atmospheric counter bar"}
  fill
  className="object-cover"
  priority
  quality={85}
/>
```

The `OPENTABLE_URL` constant and all other JSX remain unchanged.

---

### Step 4 — Fix the write side: enforce single hero in `toggleHero`

**File:** `src/app/admin/gallery/page.tsx`

The current `toggleHero` function only PATCHes the clicked image. Replace it so that:

- When turning a hero **on** (`!image.is_hero` is `true`): first clear `is_hero` on all other images by sending a PATCH for each image currently marked `is_hero: true`, then set the clicked image to `is_hero: true`.
- When turning a hero **off** (`!image.is_hero` is `false`): simply set the clicked image to `is_hero: false` (no other images need touching).

Replacement logic:

```ts
const toggleHero = async (image: GalleryImage) => {
  const newValue = !image.is_hero;
  try {
    // If turning ON, first clear any currently-starred images
    if (newValue === true) {
      const currentHeroes = images.filter(img => img.is_hero && img.id !== image.id);
      await Promise.all(
        currentHeroes.map(img =>
          fetch("/api/admin/gallery", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: img.id, is_hero: false }),
          })
        )
      );
    }

    // Now patch the clicked image
    const res = await fetch("/api/admin/gallery", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: image.id, is_hero: newValue }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Update failed");

    await revalidate();
    // Update local state: clear all heroes then set the new one
    setImages(images.map(img => {
      if (img.id === image.id) return { ...img, is_hero: newValue };
      if (newValue === true) return { ...img, is_hero: false };
      return img;
    }));
  } catch (err: any) {
    alert("Error updating image: " + err.message);
  }
};
```

Notes:
- The `Promise.all` clear-step fires in parallel for efficiency.
- Local state update mirrors the DB state — all other images are set to `false` when turning one on.
- No changes to any other function in this file.

---

### Step 5 — Verify build

After all edits, run:

```
npm run build
```

Confirm zero TypeScript/compilation errors. No test changes are required — the existing Playwright tests do not assert the hero image source.

---

## Handoff Notes

### Key file paths
- `src/lib/data/fetchers.ts` — add `getHeroImage()` here
- `src/app/(public)/page.tsx` — import and call `getHeroImage()`, pass result to `<Hero>`
- `src/components/sections/Hero.tsx` — accept `heroImage` prop, use `storage_url` with fallback
- `src/app/admin/gallery/page.tsx` — replace `toggleHero` to clear previous hero before setting new one
- `src/app/api/admin/gallery/route.ts` — **do not touch**; PATCH already works correctly

### GalleryImage shape (confirmed from types.ts)
```ts
interface GalleryImage {
  id?: string;
  filename: string;
  alt_text: string;
  local_path: string;
  storage_url?: string;  // Supabase Storage public URL — use this first
  is_hero?: boolean;
  sort_order?: number;
}
```
The correct field for the public Supabase Storage URL is `storage_url`. Use `storage_url || local_path || FALLBACK_IMAGE` as the priority chain.

### Supabase client note
`getHeroImage()` uses `createSupabaseServerClient` (server-side client with anon/service key), consistent with all other public fetchers. This is correct for a server component query. If RLS on `gallery_images` is restrictive, the anon key may not be able to read this table — in that case the function returns `null` and the fallback image is shown. The Executor should note this as a possible runtime edge case but it is not a code change.

### No `maybeSingle` vs `single` confusion
`.maybeSingle()` returns `{ data: null, error: null }` when no rows match. `.single()` returns an error when no rows match. Always use `.maybeSingle()` here to avoid false error returns when no hero is set.

### Image `alt` text fallback
When `heroImage` is available, use `heroImage.alt_text` as the `alt` attribute. Fall back to the current hardcoded string `"Ramen Don atmospheric counter bar"` when `heroImage` is null.

### Local state consistency in admin
After the `toggleHero` fix, local React state must match DB state exactly. The `setImages` call maps over all images: the clicked image gets `newValue`; if `newValue` is `true`, all others get `false`; if `newValue` is `false`, others are unchanged.

### No migration needed
The `is_hero` column already exists on `gallery_images` (per `supabase/migrations/001_initial.sql`). No schema changes required.
