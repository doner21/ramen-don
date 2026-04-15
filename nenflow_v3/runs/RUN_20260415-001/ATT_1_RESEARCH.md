---
run_id: RUN_20260415-001
step: RESEARCH
attempt: 1
---

# ATT_1 — Research Brief: Opening Hours Inconsistency

## Executive Summary

The website has a data-sync split: the Visit Us page fetches hours dynamically from Supabase and shows Wednesday correctly as closed. All other displays (landing page hero section, footer on every page, and contact page) are **hardcoded static strings** that still show the old schedule (only Monday closed, Tuesday–Friday grouped together). The fix is to update the hardcoded strings in three files.

---

## Hours Data Source and Schema

- **Primary source:** Supabase `opening_hours` table
- **Fallback:** `src/lib/data/seed-data.ts` lines 22–81
- **Fetcher:** `src/lib/data/fetchers.ts` → `getOpeningHours()`

**Schema (OpeningHour):**
```typescript
{
  id?: string;
  day_of_week: number;      // 0=Monday … 6=Sunday
  day_name: string;
  is_closed: boolean;
  lunch_open?: string | null;
  lunch_close?: string | null;
  dinner_open?: string | null;
  dinner_close?: string | null;
  note?: string | null;
}
```

**Seed data issue:** Wednesday (`day_of_week: 2`) still has `is_closed: false` in seed data. Supabase DB has been updated. Seed data should also be updated.

---

## Component Map

| Surface | File | Data Source | Status |
|---------|------|-------------|--------|
| Visit Us page | `src/app/(public)/visit/page.tsx` | `getOpeningHours()` → Supabase | ✓ Correct |
| Landing page hours | `src/components/sections/VisitInfo.tsx` | Hardcoded strings | ✗ Broken |
| Footer (every page) | `src/components/layout/Footer.tsx` | Hardcoded strings | ✗ Broken |
| Contact page | `src/app/(public)/contact/page.tsx` | Hardcoded strings | ✗ Broken |
| Menu / Reservations / Gallery | Use Footer component | Via Footer | ✗ Broken (via Footer) |

**Key insight:** The user-reported "bottom of the menu page, reservations, gallery, and contact" is the Footer component — a single shared component used across all pages. Fixing Footer.tsx fixes them all.

---

## Root Cause

Someone updated the Supabase DB and the Visit Us page (which fetches dynamically) but forgot to update three places with hardcoded strings: VisitInfo.tsx, Footer.tsx, and contact/page.tsx.

---

## Fix Surface

### 1. `src/components/sections/VisitInfo.tsx` (~lines 26–42)
Currently groups Tue–Fri together. Needs Wednesday split out as "Closed".

### 2. `src/components/layout/Footer.tsx` (~lines 73–90)
Same Tue–Fri grouping issue. Fix once, fixes footer on every page.

### 3. `src/app/(public)/contact/page.tsx` (~lines 62–94)
Lists all 7 days individually but Wednesday row is not marked as closed.

### 4. `src/lib/data/seed-data.ts` (~line 40–50)
Wednesday seed entry has `is_closed: false` — should be `true`.

---

## Risks

- Converting Footer/VisitInfo to async server components is complex and out of scope — simple string updates are sufficient and safe.
- ISR cache: after changes, `revalidatePath` or a build may be needed depending on environment.
- Seed data must also be updated to stay in sync with DB so a fresh environment doesn't regress.
