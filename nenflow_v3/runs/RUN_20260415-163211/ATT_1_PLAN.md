---
artifact_type: "PLAN"
role: "PLANNER"
run_id: "RUN_20260415-163211"
---

# NenFlow v3 Plan: Wire Admin Homepage Editor to Public Homepage

## Task Statement

The admin homepage editor exposes fields (`cta_text`, `cta_url`, `subheading`, `heading`) for each `homepage_sections` DB row, and the PATCH API correctly persists changes via upsert. However, the public homepage (`src/app/(public)/page.tsx`) and its `Hero` component ignore most of these fields in favour of hardcoded strings. The task is to wire all four disconnected in-scope fields so that every admin save produces a visible, observable change on the live public homepage.

**In-scope fixes (4 items):**
1. Hero CTA button text — currently hardcoded `"Book a Table"` in `Hero.tsx:60`
2. Hero CTA button URL — currently hardcoded constant `OPENTABLE_URL` in `Hero.tsx:54`
3. Hero tagline ("Birmingham · Est. Since Day One") — no DB field; map to `subheading` field of the `hero` section (currently `subheading` drives the italic line at `Hero.tsx:13`, separate from the tagline)
4. BookingCTA heading/subtext — currently hardcoded inline props in `page.tsx:30-31`; the `visit-cta` section exists in seed data and in the DB schema

**Out of scope:** MenuHighlights (separate table), VisitInfo address/phone (separate table), Story stats.

---

## Invariants

- Do NOT modify the `HomepageSection` TypeScript interface in `types.ts` — all required fields (`heading`, `subheading`, `cta_text`, `cta_url`) already exist.
- Do NOT modify the API route `src/app/api/admin/homepage/route.ts` — it already persists all fields correctly.
- Do NOT modify the admin editor `src/app/admin/homepage/page.tsx` unless adding a new tagline-specific admin field is needed (see Step 3 below — it is NOT needed; `subheading` is already editable there via the generic loop).
- All DB fallbacks must be preserved: components must always have a sensible default when DB returns null/undefined.
- The `OPENTABLE_URL` constant in `Hero.tsx` must be kept as the fallback value when `section.cta_url` is empty or null.
- Do not break any existing Playwright tests. Hero CTA carries `data-testid="hero-booking-cta"` — preserve it.
- The `BookingCTA` component already accepts `heading` and `subtext` props — only the call site in `page.tsx` needs to change, not the component itself.

---

## Success Criteria

All criteria are independently verifiable by the Verifier without running the app:

1. **[SC-1] Hero CTA text** — `Hero.tsx` line rendering the CTA button text reads `{section?.cta_text || "Book a Table"}` (or equivalent expression using the DB value with a non-empty fallback). The literal string `"Book a Table"` must NOT appear as a standalone hardcoded child of the anchor tag.

2. **[SC-2] Hero CTA URL** — `Hero.tsx` anchor `href` for the primary CTA reads a variable derived from `section?.cta_url`, not the raw `OPENTABLE_URL` constant. `OPENTABLE_URL` must still exist as the fallback.

3. **[SC-3] Hero tagline** — `Hero.tsx` line 33 (the `<p>` containing `"Birmingham · Est. Since Day One"`) renders a dynamic value. Specifically: a new field (e.g. `tagline`) from `section` is used, OR the existing `subheading` field is repurposed for the tagline AND the italic `{tagline}` line below it uses a different field or a separate fallback. The hardcoded string `"Birmingham · Est. Since Day One"` must NOT be a bare JSX string literal in that `<p>`.

4. **[SC-4] BookingCTA wired to DB** — `page.tsx` fetches (or derives from existing `sections`) the `visit-cta` section and passes its `heading` and `subheading` to `<BookingCTA>` as `heading` and `subtext` props respectively. The hardcoded string literals `"Book Your Table"` and `"Reserve online in seconds — no deposit required."` must NOT appear as inline prop values.

5. **[SC-5] Fallbacks present** — Each wired prop must have a fallback: `section?.cta_text || "Book a Table"`, `section?.cta_url || OPENTABLE_URL`, tagline field `|| "Birmingham · Est. Since Day One"`, `ctaSection?.heading || "Book Your Table"`, `ctaSection?.subheading || "Reserve online in seconds — no deposit required."`.

6. **[SC-6] No type errors** — No new TypeScript errors introduced. `HomepageSection` type already has all needed fields.

---

## Implementation Steps

### Step 1 — Wire Hero CTA text (`Hero.tsx`)

**File:** `src/components/sections/Hero.tsx`

**Current (line 60):**
```tsx
Book a Table
```

**Change:** Replace the hardcoded text child of the CTA anchor with:
```tsx
{section?.cta_text || "Book a Table"}
```

**Current (line 54):**
```tsx
href={OPENTABLE_URL}
```

**Change:** Before the `return` statement, derive a local variable:
```tsx
const ctaUrl = section?.cta_url || OPENTABLE_URL;
```
Then change line 54 to:
```tsx
href={ctaUrl}
```

The `OPENTABLE_URL` constant at line 5 must remain unchanged (it becomes the fallback value).

---

### Step 2 — Wire Hero tagline ("Birmingham · Est. Since Day One") (`Hero.tsx`)

**Analysis:** The `Hero` component currently uses `section?.subheading` for the italic tagline below the logo (line 13, rendered at line 49). The Birmingham tagline at line 33 is a separate UI element (a small caps label above the logo). These serve different visual roles and should map to different fields.

**Decision:** Repurpose the `subheading` field for the tagline (the small-caps location badge at line 33), and move the italic flavour line to use a separate fallback. This is the cleanest approach given the existing DB schema — `subheading` currently contains `"Handcrafted broths. Bold flavours."` in seed data, which is actually the italic line, not the Birmingham tagline. We will swap the mapping so that:
- `subheading` → feeds the Birmingham tagline `<p>` at line 33 (admin label: "Subheading / Intro" — rename in admin is out of scope)
- The italic line at line 49 uses its own hardcoded fallback `"Handcrafted broths. Bold flavours."` since no second DB field exists for it

**Wait — re-examine:** The seed data has `subheading: "Handcrafted broths. Bold flavours."` for the hero section, and `Hero.tsx:13` already reads:
```tsx
const tagline = section?.subheading ?? "Handcrafted broths. Bold flavours.";
```
This means `subheading` is CURRENTLY wired to the italic flavour line. The Birmingham tagline is a second, unconnected element.

**Correct approach:** The Birmingham tagline is a separate UI concept. We use `heading` for neither. The cleanest solution within the existing schema without migration is:
- Keep `subheading` → italic flavour line (already working, per Research admin field inventory row: "Subheading | subheading | Hero | YES")
- Map the Birmingham tagline to a **new derived variable** that reads from `section?.heading` since `heading` for the `hero` section is currently `"RAMEN DON"` (used by the `<h1>` logo image, not rendered as text). However this would collide.

**Final decision:** The `heading` field in the hero section is used by the admin UI (`section.heading !== undefined` check) but its value `"RAMEN DON"` is not rendered as text — the `<h1>` renders an `<Image>` logo, not `section.heading`. Therefore `section.heading` is available as a field that currently goes unused in the `Hero` component. Map the Birmingham tagline to `section.heading`.

**Change in `Hero.tsx`:** Add a new local variable after line 13:
```tsx
const locationTag = section?.heading || "Birmingham · Est. Since Day One";
```
Replace the JSX at line 32-34:
```tsx
<p className="font-sans text-xs tracking-[0.4em] uppercase text-[#C8892A] mb-6">
  Birmingham · Est. Since Day One
</p>
```
With:
```tsx
<p className="font-sans text-xs tracking-[0.4em] uppercase text-[#C8892A] mb-6">
  {locationTag}
</p>
```

**Note for handoff:** The admin editor at `admin/homepage/page.tsx` already renders a "Section Heading" input for every section where `section.heading !== undefined`. Since the hero seed has `heading: "RAMEN DON"`, this field is already editable in admin. The Executor must update the seed data `heading` value to something like `"Birmingham · Est. Since Day One"` so the fallback is correct when admin hasn't customised it, OR keep `"RAMEN DON"` in the DB heading and set the fallback in the component to `"Birmingham · Est. Since Day One"`. The fallback string in the component is the safer choice since the DB value may differ per environment.

---

### Step 3 — Wire BookingCTA to `visit-cta` section (`page.tsx`)

**File:** `src/app/(public)/page.tsx`

**Current (lines 21-22):**
```tsx
const heroSection = sections.find((s) => s.slug === "hero");
const storySection = sections.find((s) => s.slug === "story");
```

**Add line (after line 22):**
```tsx
const ctaSection = sections.find((s) => s.slug === "visit-cta");
```

**Current (lines 29-32):**
```tsx
<BookingCTA
  heading="Book Your Table"
  subtext="Reserve online in seconds — no deposit required."
/>
```

**Replace with:**
```tsx
<BookingCTA
  heading={ctaSection?.heading || "Book Your Table"}
  subtext={ctaSection?.subheading || "Reserve online in seconds — no deposit required."}
/>
```

**Important:** `getHomepageSections()` in `fetchers.ts:112` filters by `is_visible = true`. If the `visit-cta` section has `is_visible = false` in DB, `ctaSection` will be `undefined` and fallbacks will apply — this is the correct graceful degradation behaviour.

---

### Step 4 — Verify no other files need changes

- `src/lib/data/types.ts` — no changes needed; `HomepageSection` already has all required fields.
- `src/lib/data/fetchers.ts` — no changes needed; `getHomepageSections()` already fetches all sections including `visit-cta`.
- `src/app/api/admin/homepage/route.ts` — no changes needed.
- `src/app/admin/homepage/page.tsx` — no changes needed; the generic loop already renders editable fields for `heading`, `subheading`, `cta_text`, `cta_url` for every section including `hero` and `visit-cta`.
- `src/components/opentable/BookingCTA.tsx` — no changes needed; it already accepts `heading` and `subtext` props.

---

## File Change Summary

| File | Lines Affected | Change Type |
|------|---------------|-------------|
| `src/components/sections/Hero.tsx` | ~5, ~13-14, ~33, ~54, ~60 | Edit — wire CTA text, CTA URL, tagline |
| `src/app/(public)/page.tsx` | ~22, ~29-32 | Edit — fetch visit-cta, pass dynamic props to BookingCTA |

**Total files changed: 2**

---

## Handoff Notes

### Exact DB slugs
- Hero section slug: `"hero"`
- Visit-CTA section slug: `"visit-cta"`
- Story section slug: `"story"` (not touched)

### Field mapping (DB → Component)
| DB Column | Section Slug | Component | Prop / Variable | Rendered As |
|-----------|-------------|-----------|-----------------|-------------|
| `heading` | `hero` | `Hero` | `locationTag` | Small-caps location badge above logo |
| `subheading` | `hero` | `Hero` | `tagline` | Italic flavour line below logo (already wired) |
| `cta_text` | `hero` | `Hero` | inline | Primary CTA button label |
| `cta_url` | `hero` | `Hero` | `ctaUrl` | Primary CTA button href |
| `heading` | `visit-cta` | `BookingCTA` | `heading` prop | BookingCTA section heading |
| `subheading` | `visit-cta` | `BookingCTA` | `subtext` prop | BookingCTA subtitle |

### Fallback values
- `locationTag`: `"Birmingham · Est. Since Day One"`
- `tagline` (already wired): `"Handcrafted broths. Bold flavours."`
- Hero CTA text: `"Book a Table"`
- Hero CTA URL: `OPENTABLE_URL` constant (`https://www.opentable.co.uk/r/ramen-don-birmingham`)
- BookingCTA heading: `"Book Your Table"`
- BookingCTA subtext: `"Reserve online in seconds — no deposit required."`

### Component prop names (BookingCTA)
- `heading` (string, optional) — maps to `<h2>` text
- `subtext` (string, optional) — maps to `<p>` subtitle text
- These props already exist in `BookingCTAProps` interface in `BookingCTA.tsx:3-7`

### Data path
`getHomepageSections()` → Supabase `homepage_sections` table → filtered `is_visible = true` → `sections` array in `page.tsx` → `.find()` by slug → passed to components

### Test preservation
- `data-testid="hero-booking-cta"` must remain on the Hero CTA anchor (do not remove)
- `data-testid="booking-cta"` must remain on BookingCTA anchor (not touched, in BookingCTA.tsx)

---

[SUBAGENT CONTEXT HEALTH — PLANNER — END]
saturation_pct: 68%  health_band: WARNING  measured_at: 2026-04-14T21:39:35.010Z  source: parent-hook file  self_estimate: ~74%
