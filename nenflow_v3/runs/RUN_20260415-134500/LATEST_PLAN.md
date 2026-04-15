---
artifact_type: "PLAN"
role: "PLANNER"
run_id: "RUN_20260415-134500"
attempt: 1
created_at: "2026-04-15T13:50:00Z"
---

# Plan — RUN_20260415-134500 (Attempt 1)

## Task Statement

Fix the Ramen Don admin panel so that all save operations persist and are reflected on the live frontend (localhost). Five things are broken:

1. Admin Home — section heading does not save/reflect
2. Admin Home — subheading does not save/reflect
3. Admin Home — story text does not save/reflect
4. Admin Home — hero image visibility toggle does not save/reflect
5. Opening hours — changes in admin do not reflect on any public page

**Root cause (same for all 5):** Public frontend components render hardcoded static JSX. They never read from the database. The admin PATCH APIs write to Supabase correctly. The frontend ignores those writes.

---

## Invariants

1. Do NOT alter visual design, layout, CSS classes, or styling of any public page or component.
2. Do NOT break authentication or session handling.
3. Do NOT alter the database schema (`supabase/migrations/001_initial.sql`).
4. Do NOT break existing admin panel pages that already work (hours admin already calls revalidate — keep that pattern).
5. All changes must remain on branch `ramen-don_alpha`.
6. The `/visit` page is the reference implementation — follow its async Server Component pattern exactly.
7. Do NOT convert any admin page components from `"use client"` — admin pages are already correct client components.
8. Do NOT add `"use client"` to any public page component (they must remain Server Components).
9. Hero, Story, VisitInfo components must continue to accept no props (or new optional props) — must remain backward compatible so they render static fallback content when called without props (defensive coding).
10. Next.js version in this project may have breaking changes — always follow the `/visit` page pattern. Do not invent patterns. `revalidatePath` second argument: use `'page'` for literal paths with no dynamic segments, omit type for literal paths (both work per docs; the existing revalidate route already uses `'page'` — match that pattern).

---

## Success Criteria

1. After navigating to `/admin/homepage`, editing the "hero" section heading, and clicking "Save All Changes", a hard reload of `http://localhost:3000/` shows the new heading rendered on the public homepage.
2. After editing the "hero" section subheading in admin and saving, a reload of `http://localhost:3000/` shows the new subheading.
3. After editing the "story" section body text in admin and saving, a reload of `http://localhost:3000/` shows the new text.
4. After toggling the "hero" section visibility to Hidden in admin and saving, a reload of `http://localhost:3000/` does NOT render the Hero component (or renders it hidden/absent).
5. After navigating to `/admin/hours`, changing Tuesday dinner close time, and saving, reloads of `http://localhost:3000/` (VisitInfo section), `/contact`, the footer on any page, and `/visit` all show the updated hours.
6. No TypeScript compilation errors introduced.
7. No console errors in browser during save operations.
8. Playwright tests added to `tests/e2e/admin.spec.ts` covering the save-and-reflect scenarios (or a new spec file `tests/e2e/admin-save.spec.ts` — Executor's choice; lean toward adding to existing file if it doesn't exceed reason).

---

## Implementation Steps

### Step 0 — Read the Next.js docs before writing any code

Read `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/revalidatePath.md` and the async Server Component guide. Confirm the pattern used in `/visit/page.tsx` is valid. Only then proceed.

---

### Step 1 — Update `src/app/(public)/page.tsx`

Convert `HomePage` to an async Server Component. Call `getHomepageSections()` and `getOpeningHours()` in parallel. Pass section data as props to Hero, Story, and VisitInfo.

```
// Pseudocode — Executor must follow /visit page.tsx pattern exactly
export default async function HomePage() {
  const [sections, hours] = await Promise.all([
    getHomepageSections(),
    getOpeningHours(),
  ]);

  const heroSection = sections.find(s => s.slug === 'hero');
  const storySection = sections.find(s => s.slug === 'story');

  return (
    <>
      {heroSection?.is_visible !== false && <Hero section={heroSection} />}
      <MenuHighlights />
      {storySection && <Story section={storySection} />}
      ...
      <VisitInfo hours={hours} />
      ...
    </>
  );
}
```

**Important:** `getHomepageSections()` already filters `is_visible = true` at the DB level. If `heroSection` is undefined (hidden/not found), do not render Hero. This handles the visibility toggle requirement.

---

### Step 2 — Update `src/components/sections/Hero.tsx`

Add an optional `section?: HomepageSection` prop. When provided, use `section.subheading` as the tagline text. The heading for Hero is actually the wordmark image (not text), so `section.heading` is not visually rendered as a text `<h1>` — the logo image always shows. The subheading maps to the italic tagline `"Handcrafted broths. Bold flavours."`. The `is_visible` check is handled upstream in `page.tsx` (if section is absent from DB query, Hero is not rendered).

Prop contract:
```typescript
interface HeroProps {
  section?: HomepageSection;
}
```

Fallback: if `section` is undefined or `section.subheading` is nullish, use the current hardcoded string `"Handcrafted broths. Bold flavours."`.

---

### Step 3 — Update `src/components/sections/Story.tsx`

Add an optional `section?: HomepageSection` prop. Map:
- `section.heading` → the `<h2>` text (currently `"The Craft\nof Ramen"`)
- `section.body` → the story body paragraphs

The body field may contain multi-paragraph text. Render it as a single `<p>` or split on newlines — use a `<p>` with `whitespace-pre-line` or split by `\n\n` into multiple `<p>` tags. Keep the existing stats grid (18+, 12h, B1) hardcoded — these are not editable via the current admin schema.

Prop contract:
```typescript
interface StoryProps {
  section?: HomepageSection;
}
```

Fallback: if `section` is undefined or fields are nullish, render the current hardcoded values.

---

### Step 4 — Update `src/components/sections/VisitInfo.tsx`

Add an optional `hours?: OpeningHour[]` prop. When provided, render the opening hours dynamically using the same rendering pattern as `/visit/page.tsx` (map over hours, check `is_closed`, render `lunch_open`–`lunch_close`, `dinner_open`–`dinner_close`, or `note`).

Prop contract:
```typescript
interface VisitInfoProps {
  hours?: OpeningHour[];
}
```

Fallback: if `hours` is undefined or empty, render the current hardcoded static hours (so the component doesn't break if called without props).

The Address and Reserve columns remain hardcoded (venue address is not part of this task).

---

### Step 5 — Update `src/components/layout/Footer.tsx`

Convert `Footer` to an async Server Component. Call `getOpeningHours()`. Render the hours dynamically using the same pattern as `/visit/page.tsx`.

```typescript
// Pattern to follow:
import { getOpeningHours } from "@/lib/data/fetchers";

export default async function Footer() {
  const hours = await getOpeningHours();
  const year = new Date().getFullYear();
  // ... render hours dynamically
}
```

Format for the footer (compact): for each hour that is NOT closed, show `{day_name}: {lunch_open}–{lunch_close}, {dinner_open}–{dinner_close}` or `note` if present. For closed days, show `{day_name} — Closed` with `line-through opacity-50` (match existing CSS class pattern).

**Important:** Footer is used in a layout file. Making it async is valid in Next.js App Router — async Server Components are supported anywhere in the component tree that is not a Client Component subtree. Confirm the layout does not have `"use client"` before making Footer async.

---

### Step 6 — Update `src/app/(public)/contact/page.tsx`

Convert `ContactPage` to an async Server Component. Call `getOpeningHours()`. Render the hours dynamically using the same pattern as `/visit/page.tsx` (map, `is_closed` check, `lunch_open`/`dinner_open`/`note`).

```typescript
export default async function ContactPage() {
  const hours = await getOpeningHours();
  ...
}
```

Preserve all existing JSX structure — only replace the hardcoded hours `<div>` block with a dynamic map. Match existing CSS classes exactly.

---

### Step 7 — Add revalidate call to `src/app/admin/homepage/page.tsx`

In `handleSave()`, after a successful PATCH response, call `POST /api/admin/revalidate` before setting `setSaved(true)`. Mirror the pattern used in `src/app/admin/hours/page.tsx`.

```typescript
// After successful PATCH:
await fetch("/api/admin/revalidate", { method: "POST" });
setSaved(true);
```

---

### Step 8 — Update `src/app/api/admin/revalidate/route.ts`

Add `/contact` and `/visit` to the list of revalidated paths (they are currently missing). The footer is rendered via a layout — revalidating `"/"` with type `"layout"` would cover all pages, but to be precise and safe, add the missing literal paths.

Current missing paths: `/contact`, `/visit`.

Also consider: revalidating `"/"` as a layout would cover footer on all pages. Use `revalidatePath("/", "layout")` as a comprehensive invalidation. But be conservative — only add the two missing literal paths to avoid unintended side effects. The existing `revalidatePath("/", "page")` is already there for the homepage.

---

### Step 9 — Add Playwright tests

Add new test scenarios to `tests/e2e/admin.spec.ts` (or `tests/e2e/admin-save.spec.ts`).

**Test strategy:** Because Supabase credentials may not be available in the test environment, and authenticated admin save tests require a valid session, the Playwright tests should:

1. Test that the public homepage, footer, contact page, and visit page can load without error (smoke tests — no auth required).
2. Describe the save-and-reflect tests as `test.skip()` with a clear comment explaining they require `SUPABASE_SERVICE_ROLE_KEY` and a seeded database. This is acceptable — the task requires tests to be added, and dead tests are worse than skipped tests with clear rationale.

**Alternatively (preferred):** If `SUPABASE_SERVICE_ROLE_KEY` is available in `.env.local`, write unskipped tests using Playwright's API request context to directly seed a known value into Supabase, navigate to the admin page, verify the value appears, then navigate to the public page and verify the value there too.

The Executor must check whether `.env.local` has credentials and whether a test user exists, then decide on the auth strategy.

**Minimum required test scenarios (add as `test.skip` if auth not available):**

1. Public homepage loads and renders without console errors.
2. Public homepage footer contains opening hours text.
3. Public `/contact` page loads and contains opening hours.
4. Public `/visit` page loads and contains opening hours.
5. Admin save-and-reflect: edit homepage heading → verify on public homepage (requires auth).
6. Admin save-and-reflect: edit opening hours → verify on `/visit`, `/contact`, footer (requires auth).

---

## File Change Summary

| File | Change |
|------|--------|
| `src/app/(public)/page.tsx` | Convert to async Server Component; call `getHomepageSections()` + `getOpeningHours()`; pass props to Hero, Story, VisitInfo |
| `src/components/sections/Hero.tsx` | Add optional `section?: HomepageSection` prop; use `section.subheading` for tagline with fallback |
| `src/components/sections/Story.tsx` | Add optional `section?: HomepageSection` prop; use `section.heading` + `section.body` with fallback |
| `src/components/sections/VisitInfo.tsx` | Add optional `hours?: OpeningHour[]` prop; render hours dynamically with fallback |
| `src/components/layout/Footer.tsx` | Convert to async Server Component; call `getOpeningHours()`; render hours dynamically |
| `src/app/(public)/contact/page.tsx` | Convert to async Server Component; call `getOpeningHours()`; render hours dynamically |
| `src/app/admin/homepage/page.tsx` | Add `POST /api/admin/revalidate` call after successful save |
| `src/app/api/admin/revalidate/route.ts` | Add `/contact` and `/visit` to revalidated paths |
| `tests/e2e/admin.spec.ts` (or new file) | Add smoke tests + save-and-reflect tests (skipped if no auth) |

---

## Handoff Notes for Executor

### Critical: Read AGENTS.md first
The project uses a non-standard Next.js version. Read `node_modules/next/dist/docs/` before writing any code. The `/visit/page.tsx` is the reference — copy its async pattern exactly.

### Critical: revalidatePath signature
From the docs in this version: `revalidatePath(path: string, type?: 'page' | 'layout')`. For literal paths (e.g. `/contact`), omit `type`. For dynamic route patterns, include `type`. The existing revalidate route passes `'page'` for literal paths — that is consistent with the docs (both work for literal paths).

### Critical: Footer async Server Component
The Footer is imported in a layout. Async Server Components are valid in Next.js App Router layouts UNLESS the parent layout has `"use client"`. Check `src/app/(public)/layout.tsx` — if it does NOT have `"use client"`, Footer can safely be made async. If it DOES, the Footer cannot be async (would need a wrapper approach). Research artifact does not flag this, so it is likely safe.

### Critical: getHomepageSections() visibility filter
`getHomepageSections()` already filters `is_visible = true` at the DB level. If a section slug is not found in the returned array, it means the section is hidden or doesn't exist. The homepage page component must NOT render that section. This is how the visibility toggle (issue #4) is fixed.

### Do NOT use `export const dynamic = 'force-dynamic'`
The `/visit` page does not use this directive. Do not add it unless needed. Async data fetching in Server Components is sufficient.

### Playwright test authentication
Check if `tests/e2e/` has any auth helpers or `storageState` files. Check `playwright.config.ts` for test credentials. If none exist, write save-and-reflect tests as `test.skip()` with a `TODO: requires authenticated session` comment.

### TypeScript imports
When using `HomepageSection` and `OpeningHour` types in component files, import from `@/lib/data/types`:
```typescript
import type { HomepageSection } from "@/lib/data/types";
import type { OpeningHour } from "@/lib/data/types";
```

### Verifier will check
1. `src/app/(public)/page.tsx` is async and calls both fetchers
2. Hero, Story, VisitInfo accept optional props and use them
3. Footer is async and calls `getOpeningHours()`
4. `/contact/page.tsx` is async and calls `getOpeningHours()`
5. Admin homepage `handleSave` calls revalidate
6. Revalidate route includes `/contact` and `/visit`
7. New Playwright tests exist
8. TypeScript compiles without errors (`npx tsc --noEmit`)
9. Dev server starts and public pages load
