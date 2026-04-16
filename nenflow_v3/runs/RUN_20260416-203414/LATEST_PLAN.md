---
artifact_type: "PLAN"
role: "PLANNER"
run_id: "RUN_20260416-203414"
attempt: 1
timestamp: "2026-04-16T20:39:00Z"
task_summary: "Fix missing body content rendering for Hero, Signature Dishes, and Visit CTA CMS-managed sections"
---

# Plan: Fix Missing Body Content Rendering (Hero, Signature Dishes, Visit CTA)

## Task Statement

Three sections on the Ramen Don homepage receive body content from the CMS (Supabase `homepage_sections.body` column) but never render it on the public site. The root cause in all three cases is purely at the frontend component layer — the DB schema, TypeScript types, API fetcher, and admin CMS form are all correct and require no changes.

The fixes are:

1. **Hero** (`src/components/sections/Hero.tsx`) — add `section.body` rendering below the tagline paragraph.
2. **Signature Dishes** (`src/components/sections/MenuHighlights.tsx`) — add `section.body` rendering below the section heading and above the bowl grid.
3. **Visit CTA** (`src/components/opentable/BookingCTA.tsx` + `src/app/(public)/page.tsx`) — add a `body?: string` prop to `BookingCTA` and render it between heading and the CTA button; pass `ctaSection?.body` from `page.tsx`.

Additionally, the admin CMS (`src/app/admin/homepage/page.tsx`) guards the body textarea with `section.body !== undefined`. Because Supabase returns `null` (not a missing key) for unset TEXT columns, this condition evaluates as `null !== undefined` = `true`, meaning the textarea DOES render. **No change to admin CMS is strictly required** unless live testing reveals Supabase omits the `body` key entirely for those rows — in that case, the Executor must change the guard to unconditionally show the body textarea for all sections.

Verification requires Playwright browser screenshots proving body content appears visually on the rendered public site at `http://localhost:3000`.

---

## Invariants

1. **Do not modify DB schema, TypeScript types, or API routes.** The `body TEXT` column exists; `HomepageSection.body?: string` is correct; the API PATCH upsert persists body correctly. Zero migration required.
2. **Do not break Story section.** `src/components/sections/Story.tsx` already renders `section.body` correctly. Do not touch this file.
3. **Do not change the visual layout or styling** of any section beyond inserting a body paragraph element consistent with the section's existing design language (typography, colour tokens: `text-[#A09488]`, font `font-sans` or `font-display` as appropriate, spacing).
4. **Do not add body rendering if `section.body` is falsy.** Use conditional rendering so sections with no body content in the CMS are unaffected in appearance.
5. **BookingCTA `body` prop must be optional** with no default (or default of `undefined`) so existing usages that omit the prop continue to work as before. The `subtext` prop and its rendering must remain unchanged.
6. **The `data-testid="hero-booking-cta"` and `data-testid="booking-cta"` attributes must not be removed** — they are used by Playwright tests.
7. **TypeScript must compile without errors** — run `npx tsc --noEmit` or equivalent after making changes.

---

## Implementation Steps

### Step 1 — Hero: Add body rendering in `Hero.tsx`

File: `src/components/sections/Hero.tsx`

After the tagline `<p>` element (line 47–49), and before the button group `<div>` (line 50+), insert conditional body rendering:

```tsx
{section?.body && (
  <p className="font-sans text-sm text-[#A09488] mb-6 max-w-xl mx-auto leading-relaxed">
    {section.body}
  </p>
)}
```

Place it between the tagline paragraph and the flex button group so visual flow is: location label → logo → tagline → body → CTAs → scroll indicator.

Add a `data-testid="hero-body"` attribute to the paragraph for Playwright targeting:

```tsx
{section?.body && (
  <p
    className="font-sans text-sm text-[#A09488] mb-6 max-w-xl mx-auto leading-relaxed"
    data-testid="hero-body"
  >
    {section.body}
  </p>
)}
```

### Step 2 — Signature Dishes: Add body rendering in `MenuHighlights.tsx`

File: `src/components/sections/MenuHighlights.tsx`

After the `<h2>` heading (line 48–50), and before the `</div>` closing the `text-center mb-14` wrapper, insert:

```tsx
{section?.body && (
  <p
    className="font-sans text-sm text-[#A09488] mt-4 max-w-xl mx-auto leading-relaxed"
    data-testid="signature-dishes-body"
  >
    {section.body}
  </p>
)}
```

This places the body paragraph visually below the heading, inside the centred header block, before the bowl card grid.

### Step 3a — BookingCTA: Add `body` prop

File: `src/components/opentable/BookingCTA.tsx`

Add `body?: string` to the `BookingCTAProps` interface and to the destructured params (with no default). Render it between the heading and the `<p>{subtext}</p>`:

```tsx
interface BookingCTAProps {
  heading?: string;
  subtext?: string;
  body?: string;          // NEW
  className?: string;
  ctaUrl?: string;
}

export default function BookingCTA({
  heading = "Ready to Visit?",
  subtext = "Reserve your table at Ramen Don Birmingham",
  body,                   // NEW
  className = "",
  ctaUrl = "https://www.opentable.co.uk/r/ramen-don-birmingham",
}: BookingCTAProps) {
  return (
    <section className={`bg-[#2C231D] border-y border-[#3D3229] py-16 px-4 text-center ${className}`}>
      <h2 className="font-display text-3xl lg:text-4xl font-semibold text-[#F0EBE3] mb-3">
        {heading}
      </h2>
      {body && (
        <p
          className="text-[#A09488] text-base mb-4 max-w-md mx-auto"
          data-testid="booking-cta-body"
        >
          {body}
        </p>
      )}
      <p className="text-[#A09488] text-base mb-8 max-w-md mx-auto">{subtext}</p>
      {/* ... rest of component unchanged ... */}
    </section>
  );
}
```

Note: `body` renders above `subtext` so CMS body content appears before the booking subtext. If the UX preference is body below subtext, swap the order. The above matches the typical CMS intent (body = expanded description, subtext = short call to action prompt).

### Step 3b — Homepage page: Pass `ctaSection?.body` to `BookingCTA`

File: `src/app/(public)/page.tsx`

Update the `<BookingCTA>` usage to add the `body` prop:

```tsx
<BookingCTA
  heading={ctaSection?.heading || "Book Your Table"}
  subtext={ctaSection?.subheading || "Reserve online in seconds — no deposit required."}
  body={ctaSection?.body}
  ctaUrl={ctaSection?.cta_url}
/>
```

### Step 4 — Admin CMS verification (conditional)

File: `src/app/admin/homepage/page.tsx`

The current guard is `{section.body !== undefined && (...)}` at line 151. Because Supabase returns `null` for unset TEXT columns, this evaluates to `true` and the textarea renders. **No change is needed unless live inspection proves otherwise.**

However, as a defensive improvement and to make future intent clear, the Executor SHOULD change this guard to always render body textarea for all sections regardless of null/undefined:

Change line 151:
```tsx
{section.body !== undefined && (
```
To:
```tsx
{(section.body !== undefined || true) && (
```

Actually, simply remove the conditional entirely and always render the body textarea — this is cleaner:

**Preferred approach:** Remove the `{section.body !== undefined && (...)}` wrapper and always render the body textarea block for all sections unconditionally. The textarea already handles `value={section.body || ""}` correctly whether body is null, undefined, or a string.

### Step 5 — Seed body content for Playwright verification

The Playwright verification requires body content to be visible on the rendered public site. Currently, hero, signature-dishes, and visit-cta have no body content seeded in the DB.

The Executor must ensure body content exists in the DB for these sections before running Playwright. Two options:

**Option A (preferred — via admin CMS):** Navigate to `http://localhost:3000/admin/homepage` using Playwright, type body text into the body textarea for hero, signature-dishes, and visit-cta sections, and click "Save All Changes". Then navigate to the public homepage to verify.

**Option B (direct DB seed update):** Update `supabase/seed.sql` to include body text for these three sections, then re-run the seed. This only applies if the dev environment uses seed data (not production DB).

Use Option A as the primary approach — it tests the full admin-to-frontend data pipeline and is non-destructive. The seed.sql update can be done as a secondary step for reproducibility.

---

## Success Criteria

All of the following must be true for a PASS verdict:

1. **Hero body visible:** Playwright navigates to `http://localhost:3000`, takes a screenshot, and the element `[data-testid="hero-body"]` is present in the DOM with non-empty text content.

2. **Signature Dishes body visible:** Playwright navigates to `http://localhost:3000`, and the element `[data-testid="signature-dishes-body"]` is present in the DOM with non-empty text content.

3. **BookingCTA body visible:** Playwright navigates to `http://localhost:3000`, and the element `[data-testid="booking-cta-body"]` is present in the DOM with non-empty text content.

4. **Story section unaffected:** Playwright navigates to `http://localhost:3000`, and the Story section still renders correctly (its body content still shows — no regression).

5. **TypeScript compiles clean:** `npx tsc --noEmit` exits with code 0, no errors.

6. **No visual regressions on other sections:** The Hero, MenuHighlights, and BookingCTA sections render without layout breakage (screenshot confirms visual sanity — no overflow, no missing elements, no broken styles).

7. **Admin CMS body textarea visible:** Playwright navigates to `http://localhost:3000/admin/homepage`, and body textarea fields are visible for the hero, signature-dishes, and visit-cta sections (confirms admin can save body content).

8. **Screenshots saved as evidence:** All Playwright screenshots saved to `nenflow_v3/runs/RUN_20260416-203414/screenshots/` for Verifier inspection.

---

## Handoff Notes

### File locations (all relative to `/Users/doner/ramen-don/`)

| File | Change |
|---|---|
| `src/components/sections/Hero.tsx` | Add body paragraph after tagline (Step 1) |
| `src/components/sections/MenuHighlights.tsx` | Add body paragraph after h2 heading (Step 2) |
| `src/components/opentable/BookingCTA.tsx` | Add `body?: string` prop + conditional render (Step 3a) |
| `src/app/(public)/page.tsx` | Pass `body={ctaSection?.body}` to BookingCTA (Step 3b) |
| `src/app/admin/homepage/page.tsx` | Remove `section.body !== undefined` guard, always render body textarea (Step 4) |

### Reference pattern

`src/components/sections/Story.tsx` lines 12 and 38–40 show the canonical pattern:
```tsx
const bodyText = section?.body ?? null;
// ...
{bodyText ? (
  <p style={{ whiteSpace: "pre-line" }}>{bodyText}</p>
) : (
  <>{/* fallback content */}</>
)}
```

The Executor may use either `section?.body && <p>...</p>` (no fallback) or the Story pattern with `?? null` and fallback. The simpler conditional `&&` is preferred for Hero and MenuHighlights since there is no meaningful fallback body copy — the hardcoded content in those sections is not body copy.

### Dev server

Verify the dev server is running at `http://localhost:3000` before Playwright verification. If not running, start with `npm run dev` from the project root.

### Admin credentials

The admin page at `/admin/homepage` must be accessible. Check if admin requires auth — if it does, the Executor must handle the login step in Playwright before accessing admin.

### Playwright screenshot directory

Create `nenflow_v3/runs/RUN_20260416-203414/screenshots/` before saving screenshots.

### Risk: Body content must be in DB before verification

If the DB has no body content for these sections, the conditional renders will produce nothing even after the code fix. The Executor MUST seed body content (via admin CMS or direct DB update) as part of the execution, before running Playwright. Without this, tests will fail even with correct code.

### Risk: Admin may require authentication

If the admin CMS is behind a login wall, the Playwright approach for seeding via admin may not be viable without credentials. In that case, fall back to updating `supabase/seed.sql` and re-running the seed, or directly updating the DB with a SQL statement.

### No changes to these files

- `src/lib/data/types.ts` — types are correct
- `src/lib/data/fetchers.ts` — fetcher is correct
- `src/app/api/admin/homepage/route.ts` — API route is correct
- `supabase/migrations/001_initial.sql` — schema is correct
- `src/components/sections/Story.tsx` — working correctly, must not be touched
- `src/app/(public)/visit/page.tsx` — the visit page does not use homepage_sections; visit-cta is homepage-only by current design
