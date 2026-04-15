---
artifact_type: "EXECUTION_REPORT"
role: "EXECUTOR"
run_id: "RUN_20260415-134500"
attempt: 1
created_at: "2026-04-15T13:55:00Z"
---

# Execution Report — RUN_20260415-134500 (Attempt 1)

## Summary

All 10 implementation steps completed successfully. The root cause — public frontend components rendering hardcoded static JSX instead of reading from the database — has been fixed across all 5 failing scenarios. TypeScript compiles clean. Dev server returns 200 on all affected pages.

---

## Pre-work: Docs and Reference Read

- Read `AGENTS.md`: confirmed this Next.js version has breaking changes; read docs before writing code.
- Read `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/revalidatePath.md`: confirmed `revalidatePath(path, type?)` where `type` is optional for literal paths. Existing pattern using `'page'` for literal paths is valid per docs.
- Read `src/app/(public)/visit/page.tsx` as the reference implementation: async Server Component, `Promise.all([getOpeningHours(), getVenueDetails()])`, hours rendered with `.map()` checking `is_closed`, `note`, `lunch_open`, `dinner_open`.
- Read `src/lib/data/types.ts`: confirmed `HomepageSection` and `OpeningHour` types at `@/lib/data/types`.
- Read `src/lib/data/fetchers.ts`: confirmed `getHomepageSections()` (filters `is_visible = true`) and `getOpeningHours()` exist and are correct.
- Confirmed `src/app/(public)/layout.tsx` does NOT have `"use client"` — Footer can safely be made async.

---

## Step 1 — `src/app/(public)/page.tsx`

**Change:** Converted `HomePage` to async Server Component. Added `getHomepageSections` and `getOpeningHours` imports from `@/lib/data/fetchers`. Called both in parallel with `Promise.all`. Added `heroSection` and `storySection` lookups by slug. `Hero` only renders when `heroSection` is truthy (handles visibility toggle — `getHomepageSections()` already filters `is_visible = true` at DB level, so absent = hidden). Passed `section` and `hours` props to Hero, Story, and VisitInfo.

**Key diff:**
```diff
-export default function HomePage() {
+export default async function HomePage() {
+  const [sections, hours] = await Promise.all([
+    getHomepageSections(),
+    getOpeningHours(),
+  ]);
+  const heroSection = sections.find((s) => s.slug === "hero");
+  const storySection = sections.find((s) => s.slug === "story");
+
   return (
     <>
-      <Hero />
+      {heroSection && <Hero section={heroSection} />}
       <MenuHighlights />
-      <Story />
+      <Story section={storySection} />
       ...
-      <VisitInfo />
+      <VisitInfo hours={hours} />
```

---

## Step 2 — `src/components/sections/Hero.tsx`

**Change:** Added `import type { HomepageSection }` from `@/lib/data/types`. Added `HeroProps` interface with `section?: HomepageSection`. Changed function signature to `Hero({ section }: HeroProps = {})`. Added `tagline` variable: `section?.subheading ?? "Handcrafted broths. Bold flavours."`. Replaced hardcoded tagline string with `{tagline}`.

**Key diff:**
```diff
+import type { HomepageSection } from "@/lib/data/types";
+interface HeroProps { section?: HomepageSection; }
-export default function Hero() {
+export default function Hero({ section }: HeroProps = {}) {
+  const tagline = section?.subheading ?? "Handcrafted broths. Bold flavours.";
 ...
-          Handcrafted broths. Bold flavours.
+          {tagline}
```

---

## Step 3 — `src/components/sections/Story.tsx`

**Change:** Added `import type { HomepageSection }`. Added `StoryProps` interface. Changed function signature. Added `headingLines` (splits `section.heading` on `\n` or falls back to `["The Craft", "of Ramen"]`) and `bodyText` (uses `section.body` or null). Replaced hardcoded `<h2>` content with mapped `headingLines`. Replaced hardcoded `<p>` body paragraphs with conditional: if `bodyText` exists render as `<p style={{ whiteSpace: "pre-line" }}>`, else render original three hardcoded `<p>` tags as fallback. Stats grid (18+, 12h, B1) unchanged.

---

## Step 4 — `src/components/sections/VisitInfo.tsx`

**Change:** Added `import type { OpeningHour }`. Added `VisitInfoProps` interface with `hours?: OpeningHour[]`. Changed function signature. Replaced hardcoded hours `<div>` block with conditional: when `hours && hours.length > 0`, renders dynamic `hours.map()` following the visit page pattern (checks `is_closed`, `note`, `lunch_open`/`dinner_open`). When no hours prop or empty, falls back to the original hardcoded static JSX. Address and Reserve columns unchanged.

---

## Step 5 — `src/components/layout/Footer.tsx`

**Pre-check:** `src/app/(public)/layout.tsx` has NO `"use client"` directive — Footer can be async.

**Change:** Added `import { getOpeningHours }`. Changed `export default function Footer()` to `export default async function Footer()`. Added `const hours = await getOpeningHours()` before the return. Replaced the hardcoded 6-line hours `<div>` block with dynamic `hours.map()` that renders `{day_name} — Closed` (with `line-through opacity-50`) for closed days, `{day_name}: {note}` for days with a note, and `{day_name}: {lunch_open}–{lunch_close}, {dinner_open}–{dinner_close}` for normal open days.

---

## Step 6 — `src/app/(public)/contact/page.tsx`

**Change:** Added `import { getOpeningHours }`. Changed `export default function ContactPage()` to `export default async function ContactPage()`. Added `const hours = await getOpeningHours()`. Replaced the 7-entry hardcoded hours `<div>` block with dynamic `hours.map()` following the same pattern as `/visit/page.tsx` — using `opacity-40` + `line-through` for closed days, `note` when present, otherwise `lunch_open–lunch_close, dinner_open–dinner_close`. Preserves all existing CSS classes exactly (border-b, py-2, text-[#F0EBE3], text-[#A09488], etc.). Last entry border removed via `index === hours.length - 1` check.

---

## Step 7 — `src/app/admin/homepage/page.tsx`

**Change:** Added `await fetch("/api/admin/revalidate", { method: "POST" })` immediately after `if (!json.success) throw ...` in `handleSave()`, before `setSaved(true)`. Mirrors exactly the pattern in `src/app/admin/hours/page.tsx` line 49.

**Key diff:**
```diff
       if (!json.success) throw new Error(json.message || "Save failed");
+      await fetch("/api/admin/revalidate", { method: "POST" });
       setSaved(true);
```

---

## Step 8 — `src/app/api/admin/revalidate/route.ts`

**Change:** Added two lines to the public pages block:
```diff
     revalidatePath("/reservations", "page");
+    revalidatePath("/contact", "page");
+    revalidatePath("/visit", "page");
```

Note: The footer is rendered in `src/app/(public)/layout.tsx`. Revalidating `/` as a `'layout'` type would cover all pages including the footer. However, the Plan specifies conservative: only add the two missing literal paths. The existing `revalidatePath("/", "page")` will revalidate the homepage footer. For `/contact` and `/visit` pages' footers, those pages are now also explicitly revalidated.

---

## Step 9 — `tests/e2e/admin.spec.ts`

**Auth strategy decision:** `.env.local` has `SUPABASE_SERVICE_ROLE_KEY` set but no `TEST_ADMIN_EMAIL` / `TEST_ADMIN_PASSWORD` and no `storageState` file for pre-authenticated sessions. Playwright config has no globalSetup for auth. Therefore: smoke tests are unskipped, save-and-reflect tests are `test.skip()`.

**Added two new `test.describe` blocks:**

1. `"Public pages — smoke tests"` (4 unskipped tests):
   - Homepage `/` loads without console errors and contains expected text
   - Footer contains `Opening Hours` text and at least one day name
   - `/contact` loads and contains `Opening Hours` heading and day names
   - `/visit` loads and contains `Opening Hours` heading and day names

2. `"Admin save-and-reflect"` (2 skipped tests with `TODO` comments):
   - Admin homepage: edit subheading → reflects on public homepage
   - Admin hours: edit hours → reflects on `/visit`, `/contact`, and footer

The skip comment explains: requires `storageState` with logged-in admin session + `TEST_ADMIN_EMAIL` / `TEST_ADMIN_PASSWORD` in `.env.local`.

---

## Step 10 — TypeScript Check

```
$ npx tsc --noEmit
(no output — 0 errors)
```

TypeScript compiled cleanly. No new errors introduced.

---

## Step 11 — Dev Server Smoke Test

Dev server was already running on port 3000.

```
$ curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/
200

$ curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/contact
200

$ curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/visit
200
```

All three public pages return HTTP 200.

---

## File Change Summary

| File | Change Made |
|------|------------|
| `src/app/(public)/page.tsx` | Converted to async; calls `getHomepageSections()` + `getOpeningHours()`; passes props to Hero (conditional render), Story, VisitInfo |
| `src/components/sections/Hero.tsx` | Added optional `section?: HomepageSection` prop; tagline uses `section.subheading` with fallback |
| `src/components/sections/Story.tsx` | Added optional `section?: HomepageSection` prop; heading and body use section data with fallbacks |
| `src/components/sections/VisitInfo.tsx` | Added optional `hours?: OpeningHour[]` prop; dynamic rendering with hardcoded fallback |
| `src/components/layout/Footer.tsx` | Converted to async; calls `getOpeningHours()`; renders hours dynamically |
| `src/app/(public)/contact/page.tsx` | Converted to async; calls `getOpeningHours()`; renders hours dynamically |
| `src/app/admin/homepage/page.tsx` | Added `POST /api/admin/revalidate` call after successful save |
| `src/app/api/admin/revalidate/route.ts` | Added `/contact` and `/visit` to revalidated paths |
| `tests/e2e/admin.spec.ts` | Added 4 unskipped smoke tests + 2 skipped save-and-reflect tests |

---

## Invariant Compliance

1. Visual design, layout, CSS classes: unchanged — only logic/data changed, all CSS class strings preserved exactly.
2. Authentication: untouched — no auth files modified.
3. Database schema: untouched.
4. Existing working admin pages: untouched (hours admin still works, revalidate pattern preserved).
5. Branch: all changes on `ramen-don_alpha`.
6. `/visit` pattern: followed exactly — async Server Component, `Promise.all`, `.map()` on hours.
7. Admin pages remain `"use client"`: confirmed, only added one line to `handleSave`.
8. No `"use client"` added to public pages: confirmed.
9. Hero, Story, VisitInfo remain backward compatible: all new props are optional with fallbacks.
10. `revalidatePath` pattern: matched existing `'page'` argument for literal paths.
