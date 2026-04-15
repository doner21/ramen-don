---
artifact_type: "VERIFIER_BRIEF"
role: "EXECUTOR"
run_id: "RUN_20260415-134500"
attempt: 1
created_at: "2026-04-15T13:55:00Z"
---

# Verifier Brief — RUN_20260415-134500 (Attempt 1)

You are the Verifier. Start fresh. Do not rely on the Executor's narrative — independently inspect every file listed below and run the TypeScript check and dev server check yourself.

---

## What Was Claimed

All 5 save failures were fixed by making public frontend components read from the database instead of rendering hardcoded static JSX.

---

## Exact Files Changed — Check Each One

### 1. `src/app/(public)/page.tsx`

**What to verify:**
- Function signature is `export default async function HomePage()`
- Imports `getHomepageSections` and `getOpeningHours` from `@/lib/data/fetchers`
- Calls `await Promise.all([getHomepageSections(), getOpeningHours()])`
- `heroSection = sections.find((s) => s.slug === "hero")`
- `storySection = sections.find((s) => s.slug === "story")`
- Hero is rendered as `{heroSection && <Hero section={heroSection} />}` — NOT rendered if heroSection is undefined
- Story is rendered as `<Story section={storySection} />`
- VisitInfo is rendered as `<VisitInfo hours={hours} />`

### 2. `src/components/sections/Hero.tsx`

**What to verify:**
- Imports `type { HomepageSection }` from `@/lib/data/types`
- Has `interface HeroProps { section?: HomepageSection; }`
- Function signature is `export default function Hero({ section }: HeroProps = {})`
- Has `const tagline = section?.subheading ?? "Handcrafted broths. Bold flavours.";`
- The italic tagline `<p>` renders `{tagline}` instead of the hardcoded string
- No other visual changes — heading is still the logo image, all CTA buttons unchanged

### 3. `src/components/sections/Story.tsx`

**What to verify:**
- Imports `type { HomepageSection }` from `@/lib/data/types`
- Has `interface StoryProps { section?: HomepageSection; }`
- Function signature is `export default function Story({ section }: StoryProps = {})`
- Has `headingLines` variable splitting `section?.heading` on `\n` with fallback to `["The Craft", "of Ramen"]`
- Has `bodyText = section?.body ?? null`
- `<h2>` renders mapped `headingLines`
- Body conditionally renders `<p style={{ whiteSpace: "pre-line" }}>{bodyText}</p>` when bodyText is set, else renders original 3 hardcoded `<p>` elements as fallback
- Stats grid (18+, 12h, B1) unchanged

### 4. `src/components/sections/VisitInfo.tsx`

**What to verify:**
- Imports `type { OpeningHour }` from `@/lib/data/types`
- Has `interface VisitInfoProps { hours?: OpeningHour[]; }`
- Function signature is `export default function VisitInfo({ hours }: VisitInfoProps = {})`
- Hours column renders dynamically when `hours && hours.length > 0` — checking `is_closed`, `note`, `lunch_open`/`dinner_open`
- Falls back to original 6-entry hardcoded JSX when no hours prop
- Address and Reserve columns unchanged

### 5. `src/components/layout/Footer.tsx`

**What to verify:**
- Imports `getOpeningHours` from `@/lib/data/fetchers`
- Function signature is `export default async function Footer()`
- Has `const hours = await getOpeningHours()` inside the function body
- Hours column renders `hours.map(...)` dynamically instead of hardcoded strings
- Closed days get `className="line-through opacity-50"`
- No other visual changes

### 6. `src/app/(public)/contact/page.tsx`

**What to verify:**
- Imports `getOpeningHours` from `@/lib/data/fetchers`
- Function signature is `export default async function ContactPage()`
- Has `const hours = await getOpeningHours()` inside the function body
- Hours grid renders `hours.map(...)` with `is_closed` check, `note`, `lunch_open`/`dinner_open`
- Closed days get `opacity-40` class
- All other JSX structure unchanged

### 7. `src/app/admin/homepage/page.tsx`

**What to verify:**
- In `handleSave()`, after `if (!json.success) throw ...`, before `setSaved(true)`, there is exactly:
  ```
  await fetch("/api/admin/revalidate", { method: "POST" });
  ```
- File still starts with `"use client"`
- No other changes

### 8. `src/app/api/admin/revalidate/route.ts`

**What to verify:**
- Contains `revalidatePath("/contact", "page");`
- Contains `revalidatePath("/visit", "page");`
- These appear within the public pages block, after the existing `/reservations` line
- All original revalidation calls remain present

### 9. `tests/e2e/admin.spec.ts`

**What to verify:**
- Contains a `test.describe("Public pages — smoke tests", ...)` block with 4 unskipped tests:
  1. Homepage `/` loads without console errors and contains expected text
  2. Footer contains `Opening Hours` text and a day name
  3. `/contact` loads and contains `Opening Hours` heading
  4. `/visit` loads and contains `Opening Hours` heading
- Contains a `test.describe("Admin save-and-reflect", ...)` block with 2 `test.skip()` tests:
  1. Admin homepage: edit subheading → reflects on public homepage
  2. Admin hours: edit hours → reflects on `/visit`, `/contact`, footer
- Skip comments reference `TODO: requires authenticated session`
- Original 3 tests in `test.describe("Admin", ...)` remain unchanged

---

## Commands to Run

### TypeScript check (should produce zero output = no errors):
```bash
cd /c/Users/doner/ramen-don && npx tsc --noEmit
```

### Dev server check (should all return 200):
```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/contact
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/visit
```

### Playwright smoke tests (optional — requires dev server running):
```bash
cd /c/Users/doner/ramen-don && npx playwright test tests/e2e/admin.spec.ts --grep "Public pages"
```

---

## Success Criteria Mapping

| Criterion | Fix Applied | File |
|-----------|-------------|------|
| 1. Homepage heading saves/reflects | `page.tsx` async + `Story` reads `section.heading` | Steps 1, 3 |
| 2. Homepage subheading saves/reflects | `page.tsx` async + `Hero` reads `section.subheading` | Steps 1, 2 |
| 3. Story body text saves/reflects | `page.tsx` async + `Story` reads `section.body` | Steps 1, 3 |
| 4. Hero visibility toggle saves/reflects | `heroSection &&` conditional in `page.tsx` | Step 1 |
| 5. Opening hours reflect everywhere | Footer, VisitInfo, `/contact` now call `getOpeningHours()` | Steps 4, 5, 6 |
| 6. No TypeScript errors | `npx tsc --noEmit` = no output | Step 10 |
| 7. No console errors during saves | Admin homepage now calls revalidate; revalidate now covers `/contact`, `/visit` | Steps 7, 8 |
| 8. Playwright tests added | 4 unskipped smoke tests + 2 skipped save-and-reflect tests | Step 9 |

---

## Known Limitations / Deferred Items

- Save-and-reflect Playwright tests are `test.skip()` — requires pre-authenticated session setup (`TEST_ADMIN_EMAIL`, `TEST_ADMIN_PASSWORD` in `.env.local`, global setup for `storageState`). This is documented in the test file with a clear `TODO` comment.
- The footer is in a layout (`src/app/(public)/layout.tsx`). Revalidating `/`, `/contact`, and `/visit` individually will revalidate those pages' footers. However, the footer on other pages (e.g., `/menu`, `/gallery`) is NOT revalidated when hours change — only if the admin hours `POST /api/admin/revalidate` is called, which already does revalidate `/menu` and `/gallery`. All pages covered.
