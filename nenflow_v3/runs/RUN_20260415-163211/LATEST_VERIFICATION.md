---
artifact_type: "VERIFICATION_REPORT"
role: "VERIFIER"
run_id: "RUN_20260415-163211"
verdict: "PASS"
---

# Verification Report: Wire Admin Homepage Editor to Public Homepage

## Files Inspected

- `src/components/sections/Hero.tsx`
- `src/app/(public)/page.tsx`

---

## Success Criteria Results

### [SC-1] Hero CTA text — PASS

`Hero.tsx` line 62: `{section?.cta_text || "Book a Table"}`

The bare string `"Book a Table"` does NOT appear as a standalone JSX child of the anchor. The fallback is correctly embedded in the expression.

### [SC-2] Hero CTA URL — PASS

`Hero.tsx` line 14: `const ctaUrl = section?.cta_url || OPENTABLE_URL;`
`Hero.tsx` line 56: `href={ctaUrl}` — uses derived variable, not raw `OPENTABLE_URL`.
`OPENTABLE_URL` constant exists at line 5: `"https://www.opentable.co.uk/r/ramen-don-birmingham"` — serves as fallback.

### [SC-3] Hero tagline — PASS

`Hero.tsx` line 15: `const locationTag = section?.heading || "Birmingham · Est. Since Day One";`
`Hero.tsx` line 35: `{locationTag}` — renders dynamic value.
The hardcoded string `"Birmingham · Est. Since Day One"` does NOT appear as a bare JSX string literal in the `<p>` element — it exists only as the fallback in the variable declaration.

### [SC-4] BookingCTA wired to DB — PASS

`page.tsx` line 23: `const ctaSection = sections.find((s) => s.slug === "visit-cta");`
`page.tsx` lines 31-32:
```tsx
heading={ctaSection?.heading || "Book Your Table"}
subtext={ctaSection?.subheading || "Reserve online in seconds — no deposit required."}
```
The hardcoded literals `"Book Your Table"` and `"Reserve online in seconds — no deposit required."` do NOT appear as inline prop values on `<BookingCTA>`.

### [SC-5] Fallbacks present — PASS

All five required fallbacks verified:

| Fallback | Location | Status |
|----------|----------|--------|
| `section?.cta_text \|\| "Book a Table"` | Hero.tsx line 62 | PRESENT |
| `section?.cta_url \|\| OPENTABLE_URL` (via `ctaUrl`) | Hero.tsx line 14 | PRESENT |
| `section?.heading \|\| "Birmingham · Est. Since Day One"` (via `locationTag`) | Hero.tsx line 15 | PRESENT |
| `ctaSection?.heading \|\| "Book Your Table"` | page.tsx line 31 | PRESENT |
| `ctaSection?.subheading \|\| "Reserve online in seconds — no deposit required."` | page.tsx line 32 | PRESENT |

### [SC-6] No type errors — PASS

`npx tsc --noEmit` returned zero output (zero errors).

---

## Invariant Checks

| Invariant | Status |
|-----------|--------|
| `data-testid="hero-booking-cta"` present on Hero CTA anchor (Hero.tsx line 60) | PASS |
| `OPENTABLE_URL` constant still exists in Hero.tsx (line 5) | PASS |
| `src/app/api/admin/homepage/route.ts` — NOT modified (`git diff HEAD` returned empty) | PASS |

---

VERDICT: PASS

---

[SUBAGENT CONTEXT HEALTH — VERIFIER — END]
saturation_pct: 68%  health_band: WARNING  measured_at: 2026-04-14T21:39:35.010Z  source: parent-hook file  self_estimate: ~30%
