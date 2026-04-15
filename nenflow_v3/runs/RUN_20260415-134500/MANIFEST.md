# NenFlow v3 Run Manifest — RUN_20260415-134500

| Field | Value |
|-------|-------|
| run_id | RUN_20260415-134500 |
| route | B (Research → Plan → Execute → Verify) |
| attempts | 1 |
| verdict | PASS |
| completed_at | 2026-04-15T14:10:00Z |

## Artifacts

| Artifact | Path |
|----------|------|
| INTAKE | ATT_0_INTAKE.md |
| RESEARCH | ATT_1_RESEARCH.md |
| PLAN | ATT_1_PLAN.md |
| EXECUTION | ATT_1_EXECUTION.md |
| VERIFIER BRIEF | ATT_1_VERIFIER_BRIEF.md |
| VERIFICATION | ATT_1_VERIFICATION.md |

## Files Changed

| File | Change |
|------|--------|
| `src/app/(public)/page.tsx` | Converted to async Server Component; calls `getHomepageSections()` + `getOpeningHours()`; passes data to Hero (conditionally), Story, VisitInfo |
| `src/components/sections/Hero.tsx` | Added optional `section?: HomepageSection` prop; tagline uses `section.subheading` with fallback |
| `src/components/sections/Story.tsx` | Added optional `section?: HomepageSection` prop; heading + body use section data with fallback |
| `src/components/sections/VisitInfo.tsx` | Added optional `hours?: OpeningHour[]` prop; renders hours dynamically with fallback |
| `src/components/layout/Footer.tsx` | Converted to async Server Component; calls `getOpeningHours()`; renders hours dynamically |
| `src/app/(public)/contact/page.tsx` | Converted to async Server Component; calls `getOpeningHours()`; renders hours dynamically |
| `src/app/admin/homepage/page.tsx` | Added `POST /api/admin/revalidate` call in `handleSave()` after successful save |
| `src/app/api/admin/revalidate/route.ts` | Added `/contact` and `/visit` to revalidated paths |
| `tests/e2e/admin.spec.ts` | Added 4 smoke tests + 2 skipped save-and-reflect tests |
