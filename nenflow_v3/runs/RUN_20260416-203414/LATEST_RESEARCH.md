---
artifact_type: RESEARCH
role: RESEARCHER
run_id: RUN_20260416-203414
---

# NenFlow v3 RESEARCH: Missing Body Content for Hero, Signature Dishes, Visit CTA

## Investigation Scope

- Admin CMS: `src/app/admin/homepage/page.tsx`
- API layer: `src/app/api/admin/homepage/route.ts`
- Frontend pages: `src/app/(public)/page.tsx`, `src/app/(public)/visit/page.tsx`
- Components: `src/components/sections/Hero.tsx`, `src/components/sections/MenuHighlights.tsx`, `src/components/sections/VisitInfo.tsx`, `src/components/sections/Story.tsx`, `src/components/opentable/BookingCTA.tsx`
- Type definitions: `src/lib/data/types.ts`
- Data fetchers: `src/lib/data/fetchers.ts`
- DB schema: `supabase/migrations/001_initial.sql`, `supabase/seed.sql`

---

## Key Findings

### 1. DATABASE SCHEMA — body column EXISTS and is correct

The `homepage_sections` table in `supabase/migrations/001_initial.sql` includes:

```sql
CREATE TABLE IF NOT EXISTS homepage_sections (
  id UUID PRIMARY KEY ...,
  slug TEXT NOT NULL UNIQUE,
  heading TEXT,
  subheading TEXT,
  body TEXT,       -- <-- EXISTS
  cta_text TEXT,
  cta_url TEXT,
  image_key TEXT,
  is_visible BOOLEAN DEFAULT true,
  sort_order SMALLINT DEFAULT 0,
  ...
);
```

The `body` column is present in the schema. This rules out a DB schema issue as the root cause.

### 2. TYPE DEFINITION — body field EXISTS in HomepageSection

`src/lib/data/types.ts` defines:

```typescript
export interface HomepageSection {
  id?: string;
  slug: string;
  heading?: string;
  subheading?: string;
  body?: string;       // <-- EXISTS as optional field
  cta_text?: string;
  cta_url?: string;
  image_key?: string;
  is_visible?: boolean;
  sort_order?: number;
}
```

The TypeScript type is correct. No type-level issue.

### 3. ADMIN CMS — body field IS rendered, but only when `section.body !== undefined`

The admin page (`src/app/admin/homepage/page.tsx`) renders the body textarea conditionally:

```tsx
{section.body !== undefined && (
  <div className="md:col-span-2">
    <label ...>Body Content</label>
    <textarea ... value={section.body || ""} ... />
  </div>
)}
```

**CRITICAL:** This check uses `!== undefined`. If Supabase returns `null` (not `undefined`) for the body column, the textarea WILL render (because `null !== undefined` is true). If Supabase returns the field as absent from the response object entirely, then `body` would be `undefined` and the textarea would NOT render.

**Seed data analysis:**
- `hero` slug: seeded WITHOUT a body field — `body` column not set → Supabase will return `null` → admin WILL show textarea
- `signature-dishes` slug: seeded WITHOUT a body field → same as hero
- `visit-cta` slug: seeded WITHOUT a body field → same as hero
- `story` slug: seeded WITH a body field — body IS set → works correctly

So the admin form renders the body textarea for all three sections (null is not undefined). The admin CMS is NOT the issue preventing display — assuming Supabase returns null (not absent) for unset TEXT columns.

### 4. FRONTEND COMPONENTS — This is the ROOT CAUSE

#### 4a. Hero section (`src/components/sections/Hero.tsx`)

The `Hero` component receives a `HomepageSection` prop but **NEVER reads `section.body`**. The component renders:
- `section?.subheading` → used as tagline
- `section?.cta_url` → used for booking link

But `section?.body` is **never read or rendered anywhere** in the component. There is no `<p>{section.body}</p>` or equivalent. The Hero component simply does not use the body field.

#### 4b. Signature Dishes section (`src/components/sections/MenuHighlights.tsx`)

The `MenuHighlights` component receives a `HomepageSection` prop and renders:
- `section?.subheading` — rendered as "Our Kitchen" label
- `section?.heading` — rendered as "Signature Bowls" heading

But `section?.body` is **never read or rendered anywhere** in the component. The component has no body rendering logic at all.

Additionally, the seed data for `signature-dishes` has NO `body` field:
```typescript
{
  slug: "signature-dishes",
  heading: "Signature Bowls",
  subheading: "From our kitchen to your table",
  is_visible: true,
  sort_order: 3,
}
```
No body content was ever seeded for this section.

#### 4c. Visit CTA section — NOT a component rendering issue, but a different architectural issue

The `visit-cta` section is NOT rendered via a dedicated component that reads body. In `src/app/(public)/page.tsx`:

```tsx
const ctaSection = sections.find((s) => s.slug === "visit-cta");
...
<BookingCTA
  heading={ctaSection?.heading || "Book Your Table"}
  subtext={ctaSection?.subheading || "Reserve online in seconds — no deposit required."}
  ctaUrl={ctaSection?.cta_url}
/>
```

The `BookingCTA` component (`src/components/opentable/BookingCTA.tsx`) accepts `heading`, `subtext`, and `ctaUrl` props — but the `subtext` prop maps to `section.subheading`, NOT `section.body`. The `body` field from the CMS is **not passed to BookingCTA at all**, and BookingCTA has no body prop.

Furthermore, on the **visit page** (`src/app/(public)/visit/page.tsx`), the visit-cta section data is not fetched at all — it calls only `getOpeningHours()` and `getVenueDetails()`. The `getHomepageSections()` fetcher is not called on the visit page.

#### 4d. Story section — the one that WORKS (reference pattern)

`src/components/sections/Story.tsx` correctly reads `section.body`:

```tsx
const bodyText = section?.body ?? null;
...
{bodyText ? (
  <p style={{ whiteSpace: "pre-line" }}>{bodyText}</p>
) : (
  <>{/* fallback content */}</>
)}
```

This is the correct pattern that the other three sections should follow.

### 5. SEED DATA — hero and visit-cta have no body in seed, signature-dishes also missing body

From `supabase/seed.sql`:
- `hero`: seeded with heading, subheading, cta_text, cta_url, image_key — **no body**
- `signature-dishes`: seeded with heading, subheading — **no body**
- `visit-cta`: seeded with heading, subheading, cta_text, cta_url — **no body**
- `story`: seeded with heading, **body** (only section with body seeded)

This means even if the admin saves body content, the sections may have been seeded without body. However, the admin UI (body textarea) appears correctly for sections where Supabase returns `null` for body (since `null !== undefined`), so users CAN type body content and save it. The problem is purely that the frontend components don't render it.

### 6. FETCHER — returns ALL fields including body

`getHomepageSections()` in `fetchers.ts` does `select("*")` which returns all columns including `body`. This is correct and not the issue.

---

## Constraints Identified

1. **DB schema is correct** — `body TEXT` column exists in `homepage_sections`. No migration needed.
2. **Type is correct** — `HomepageSection.body?: string` is defined. No type changes needed.
3. **API is correct** — The PATCH route does `upsert(section, { onConflict: "slug" })` which will persist `body` if present. No API changes needed.
4. **Admin CMS shows body textarea** for hero, signature-dishes, and visit-cta as long as Supabase returns `null` (not absent) for those rows. If some rows were seeded without a `body` insert and Supabase omits the column from the JSON response entirely, the textarea may not show — but this is less likely as Supabase returns all declared columns as `null`.
5. **Do not break Story section** — it already works correctly using the `section?.body` pattern.
6. **Visit CTA on homepage** uses `BookingCTA` which only has `heading`, `subtext`, `ctaUrl` props — adding body requires either a new prop or a different component architecture.
7. **Visit page** (`/visit`) does not call `getHomepageSections()` at all — it is a separate page that doesn't use homepage_sections data.

---

## Recommendations

### Fix 1: Hero component — add body rendering

In `src/components/sections/Hero.tsx`, add rendering of `section?.body` below the tagline paragraph. The body could appear as a subtitle or descriptor below the tagline. Use the Story pattern: `{section?.body && <p>{section.body}</p>}`.

### Fix 2: MenuHighlights (signature-dishes) component — add body rendering

In `src/components/sections/MenuHighlights.tsx`, add `section?.body` rendering below the heading. This could appear as a paragraph between the heading and the grid of bowls.

### Fix 3: Visit CTA — add body prop to BookingCTA or render differently

Two sub-options:
- **Option A (simpler):** Add a `body?: string` prop to `BookingCTA` component and render it between the heading and the CTA button. Then pass `ctaSection?.body` from `page.tsx`. This is minimal and consistent.
- **Option B:** Create a separate `VisitCTA` section component that accepts a full `HomepageSection` prop and renders heading, body, and cta_url.

Option A is recommended — minimal change, consistent with existing pattern.

### No DB migration required

The `body` column already exists. No schema change needed.

### Admin CMS — no changes likely needed

The body textarea already appears for all sections (because the conditional check is `!== undefined`, and Supabase returns `null` not missing for unset TEXT columns). However, the Planner should verify this assumption by checking whether the admin form currently shows the body textarea for hero and signature-dishes when loaded from Supabase. If Supabase response includes `body: null`, the textarea renders; if body key is absent from the JSON object, it won't render.

As a safety measure: the admin page could change `section.body !== undefined` to always render the body textarea for all sections (or check `'body' in HomepageSection` type). This would be a minor defensive improvement.

---

## Failure Mode Summary

| Section | DB body column | Type definition | Admin textarea | Frontend renders body |
|---|---|---|---|---|
| hero | EXISTS (null by default) | EXISTS | YES (null != undefined) | **NO — never read in Hero.tsx** |
| signature-dishes | EXISTS (null by default) | EXISTS | YES | **NO — never read in MenuHighlights.tsx** |
| visit-cta | EXISTS (null by default) | EXISTS | YES | **NO — BookingCTA has no body prop** |
| story | EXISTS (seeded value) | EXISTS | YES | YES — works correctly |

---

## Unknowns Remaining

1. Whether Supabase actually returns `body: null` or omits the `body` key entirely for rows seeded without a body value — determines whether admin textarea shows. Highly likely it returns `null` (standard SQL behavior for NULL columns in JSON responses).
2. Whether the admin page was previously showing body textarea for hero/signature-dishes at all. If the field shows and users save content, does that content persist? The API PATCH route sends the entire sections array including body, so persistence should work.
3. The visit page (`/visit`) does not use homepage_sections data — the visit-cta section is only used on the homepage (`/`). This is the intended design per the current code, but the Planner should confirm whether visit CTA should also appear/render on the `/visit` page.
