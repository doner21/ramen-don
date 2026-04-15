---
artifact_type: "VERIFIER_BRIEF"
role: "EXECUTOR"
run_id: "RUN_20260415-163211"
---

# Verifier Brief: Wire Admin Homepage Editor to Public Homepage

## Your Task

Independently verify PASS or FAIL against each success criterion below. Do NOT rely on this brief's narrative — read the files directly.

---

## Files to Inspect

1. `src/components/sections/Hero.tsx`
2. `src/app/(public)/page.tsx`

---

## Success Criteria Checklist

### [SC-1] Hero CTA text
- File: `src/components/sections/Hero.tsx`
- Verify: The CTA anchor child renders `{section?.cta_text || "Book a Table"}` (or equivalent)
- Verify: The bare string `"Book a Table"` does NOT appear as a standalone hardcoded JSX child of the anchor

### [SC-2] Hero CTA URL
- File: `src/components/sections/Hero.tsx`
- Verify: The primary CTA anchor `href` uses a variable derived from `section?.cta_url` (not raw `OPENTABLE_URL`)
- Verify: `OPENTABLE_URL` constant still exists and is used as the fallback value

### [SC-3] Hero tagline
- File: `src/components/sections/Hero.tsx`
- Verify: The `<p>` element that previously contained `"Birmingham · Est. Since Day One"` now renders a dynamic value
- Verify: The hardcoded string `"Birmingham · Est. Since Day One"` does NOT appear as a bare JSX string literal in that `<p>`
- Verify: A fallback of `"Birmingham · Est. Since Day One"` exists in a variable declaration

### [SC-4] BookingCTA wired to DB
- File: `src/app/(public)/page.tsx`
- Verify: `ctaSection` is declared using `sections.find((s) => s.slug === "visit-cta")`
- Verify: `<BookingCTA>` receives `heading={ctaSection?.heading || "Book Your Table"}` and `subtext={ctaSection?.subheading || "Reserve online in seconds — no deposit required."}`
- Verify: The hardcoded strings `"Book Your Table"` and `"Reserve online in seconds — no deposit required."` do NOT appear as inline prop values on `<BookingCTA>`

### [SC-5] Fallbacks present
- Verify all five fallbacks exist:
  - `section?.cta_text || "Book a Table"` in Hero.tsx
  - `section?.cta_url || OPENTABLE_URL` (via `ctaUrl` variable) in Hero.tsx
  - `section?.heading || "Birmingham · Est. Since Day One"` (via `locationTag` variable) in Hero.tsx
  - `ctaSection?.heading || "Book Your Table"` in page.tsx
  - `ctaSection?.subheading || "Reserve online in seconds — no deposit required."` in page.tsx

### [SC-6] No type errors
- Run: `npx tsc --noEmit` from `C:\Users\doner\ramen-don`
- Verify: Zero errors in output

---

## Test Preservation Check

- Verify: `data-testid="hero-booking-cta"` still present on the Hero CTA anchor in `Hero.tsx`

---

## Out-of-Scope Files (must be untouched)

- `src/app/api/admin/homepage/route.ts`
- `src/app/admin/homepage/page.tsx`
- `src/components/opentable/BookingCTA.tsx`
