---
artifact_type: "RESEARCH"
role: "RESEARCHER"
run_id: "RUN_20260415-134500"
attempt: 1
created_at: "2026-04-15T13:50:00Z"
---

# Research — RUN_20260415-134500 (Attempt 1)

## Investigation Scope

- Admin panel structure: all admin page files for homepage and hours
- API routes: `/api/admin/homepage` and `/api/admin/hours` PATCH handlers
- Database layer: Supabase client setup, schema, RLS policies
- Frontend consumption: how homepage sections and opening hours are rendered on the public site
- Data fetching layer: `fetchers.ts` and whether it is actually used
- Footer and other components showing opening hours
- Environment config: `.env.local` for Supabase credentials
- Existing tests: `tests/e2e/admin.spec.ts`

---

## Key Findings

### Finding 1 — ROOT CAUSE of all 5 homepage field failures: Frontend sections are hardcoded

The public homepage (`src/app/(public)/page.tsx`) renders these static React components:
- `src/components/sections/Hero.tsx` — fully hardcoded (heading, subheading, image, CTA)
- `src/components/sections/Story.tsx` — fully hardcoded (heading, body text)
- `src/components/sections/VisitInfo.tsx` — fully hardcoded (includes hardcoded opening hours)

None of these components call `getHomepageSections()` or any API. They are pure static JSX with literals baked in. So even if the admin saves to Supabase successfully, the frontend never reads from `homepage_sections` — it always renders the hardcoded values.

The `getHomepageSections()` fetcher in `src/lib/data/fetchers.ts` exists and is correct, but **it is never called** by any public page component.

### Finding 2 — ROOT CAUSE of opening hours not updating: Footer and other components are hardcoded

Opening hours appear in three public locations:
1. `src/components/layout/Footer.tsx` — **hardcoded** static HTML, no DB call
2. `src/components/sections/VisitInfo.tsx` — **hardcoded** static HTML, no DB call
3. `src/app/(public)/contact/page.tsx` — **hardcoded** static HTML, no DB call

The one exception: `src/app/(public)/visit/page.tsx` **correctly** calls `getOpeningHours()` and renders dynamically from the database. This is the only page where opening hours updates would reflect.

The `getOpeningHours()` fetcher exists and is correct. It is only used in the `/visit` page.

### Finding 3 — Admin PATCH API routes are structurally sound

`/api/admin/homepage` PATCH (`src/app/api/admin/homepage/route.ts`):
- Receives `{ sections: HomepageSection[] }`
- Calls `supabase.from("homepage_sections").upsert(section, { onConflict: "slug" })`
- Does NOT call revalidate after save — but this is secondary since frontend doesn't read DB anyway

`/api/admin/hours` PATCH (`src/app/api/admin/hours/route.ts`):
- Receives `{ hours: OpeningHour[] }`
- Strips `id`, `created_at`, `updated_at` from each record before upsert
- Calls `supabase.from("opening_hours").upsert({ ...fields, day_of_week: ... }, { onConflict: "day_of_week" })`
- **Does** call `/api/admin/revalidate` after save (this is correct)
- The hours PATCH is actually correct — the failure is not in the API but in the hardcoded frontend

### Finding 4 — Database schema is correct

`supabase/migrations/001_initial.sql` defines both `homepage_sections` and `opening_hours` tables with appropriate columns. The schema matches the TypeScript types in `src/lib/data/types.ts`.

### Finding 5 — RLS policies restrict public reads of hidden sections

The `homepage_sections` table has:
```sql
CREATE POLICY "homepage_public_read" ON homepage_sections FOR SELECT USING (is_visible = true);
```
This means a section with `is_visible = false` will not appear in reads from the anon client. The admin API uses the **service role** key (`createSupabaseAdminClient()`) which bypasses RLS — so the admin panel correctly shows all sections including hidden ones. This is working as intended.

### Finding 6 — Supabase credentials are present in .env.local

- `NEXT_PUBLIC_SUPABASE_URL` — set
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — set
- `SUPABASE_SERVICE_ROLE_KEY` — set

No missing credential issue.

### Finding 7 — Admin homepage PATCH does not call revalidate

`src/app/admin/homepage/page.tsx` `handleSave()` calls `PATCH /api/admin/homepage` but does NOT then call `POST /api/admin/revalidate`. The hours admin page (`src/app/admin/hours/page.tsx`) does call revalidate. This is a minor secondary issue (irrelevant until the frontend is made dynamic), but should be fixed for consistency.

### Finding 8 — getHomepageSections() filters by is_visible=true from fetcher

`src/lib/data/fetchers.ts` `getHomepageSections()` includes `.eq("is_visible", true)` — meaning hidden sections will never appear on the public site even once the components are made dynamic. This is correct behavior.

### Finding 9 — Only /visit page uses dynamic opening hours

The `/visit` page correctly uses `getOpeningHours()`. The footer, `/contact`, and `VisitInfo` component (shown on homepage) all use hardcoded data.

### Finding 10 — Existing tests do not cover admin save functionality

`tests/e2e/admin.spec.ts` only covers redirect to login and login form rendering. There are no tests for authenticated admin saves or for verifying that changes persist to the frontend.

---

## Constraints Identified

1. **Invariant**: Must not break existing working admin functionality (menu, gallery, venue sections work if they are dynamic — need to confirm, but likely the same pattern).
2. **Invariant**: Must not alter visual design or layout of public pages.
3. **Invariant**: Must not break authentication/session handling.
4. **Branch**: All changes on `ramen-don_alpha`.
5. **No destructive schema changes**: The database schema is correct and should not be altered.
6. **Playwright tests**: Must be added to verify each save-and-reflect scenario.
7. **Revalidation**: After saving to Supabase from admin pages, `POST /api/admin/revalidate` must be called so Next.js ISR cache is invalidated and pages re-render from fresh DB data.

---

## Recommendations

### Primary Fix — Make public frontend components dynamic (read from DB)

The core problem across all 5 failing areas is the same: static hardcoded components need to become dynamic. The approach depends on how we want to architect this:

**Option A (Recommended): Convert public page to async Server Component and pass props to section components**

For the homepage (`src/app/(public)/page.tsx`):
1. Make `HomePage` an async function, call `getHomepageSections()` and `getOpeningHours()`
2. Find sections by slug (hero, story, signature-dishes, visit-cta) and pass their fields as props to Hero, Story, etc.
3. Section components accept optional override props, falling back to hardcoded defaults if null

For the opening hours footer/contact/VisitInfo:
1. Make `Footer` an async Server Component, call `getOpeningHours()` and render dynamically
2. Make `src/app/(public)/contact/page.tsx` async and call `getOpeningHours()`
3. Make `VisitInfo` accept opening hours as a prop (since it's used inside the already-async homepage)

**Option B: Add API fetching directly in footer/contact (client-side)**

Less ideal — footers should use server-side rendering for SEO and to avoid loading flash.

### Secondary Fix — Add revalidate call to homepage admin save

`src/app/admin/homepage/page.tsx` `handleSave()` should call `POST /api/admin/revalidate` after a successful save, mirroring the hours admin page pattern.

### Playwright tests needed

New test scenarios:
1. Login as admin, edit homepage section heading, save, reload public homepage, verify new heading
2. Login as admin, toggle hero section hidden, save, verify section absent from homepage
3. Login as admin, edit opening hours, save, reload `/visit` and footer, verify new hours
4. Verify no console errors during save operations

These require real Supabase credentials in the test environment, or mocking the API responses.

---

## Unknowns Remaining

1. **Whether the database has been seeded** — `homepage_sections` and `opening_hours` tables may be empty (no seeding mechanism observed). If empty, the admin GET returns `OPENING_HOURS` fallback data, but upserts would insert new rows. This is likely fine given the upsert on conflict logic, but the Planner should verify by having the setup route check table row counts.

2. **Whether other admin sections (menu, gallery, venue) have the same static component problem** — The task only calls out homepage and opening hours, but it's possible the `/visit` page works for hours (confirmed) while menu/gallery do have dynamic rendering. Need brief check for completeness — likely low risk since these aren't mentioned as broken.

3. **Playwright test authentication strategy** — The existing tests run without credentials (Supabase not configured in test env). End-to-end save-and-reflect tests need authenticated sessions. Need to determine whether to use `SUPABASE_SERVICE_ROLE_KEY` directly in tests, or set up a test user, or use `storageState` with a pre-authenticated session.

4. **Next.js version-specific caching behavior** — `AGENTS.md` warns about breaking changes. The `revalidatePath` calls in the revalidate route use `"page"` as the second argument. This may differ from the installed version. The Planner should check `node_modules/next/dist/docs/` for the specific API.

---

## File Index

| File | Role | Notes |
|------|------|-------|
| `src/app/(public)/page.tsx` | Homepage entry | Currently non-async, renders hardcoded components |
| `src/components/sections/Hero.tsx` | Hero section | Fully hardcoded |
| `src/components/sections/Story.tsx` | Story section | Fully hardcoded |
| `src/components/sections/VisitInfo.tsx` | Hours on homepage | Fully hardcoded |
| `src/components/layout/Footer.tsx` | Sitewide footer | Hours hardcoded, non-async |
| `src/app/(public)/contact/page.tsx` | Contact page | Hours hardcoded, non-async |
| `src/app/(public)/visit/page.tsx` | Visit page | **Working** — uses `getOpeningHours()` |
| `src/lib/data/fetchers.ts` | Data layer | Has `getHomepageSections()` and `getOpeningHours()` — correct but underused |
| `src/lib/data/types.ts` | TypeScript types | All types correct |
| `src/lib/data/seed-data.ts` | Fallback data | Used when Supabase fails/returns empty |
| `src/lib/supabase-admin.ts` | Admin DB client | Uses service role key, bypasses RLS |
| `src/lib/supabase-server.ts` | Public DB client | Uses anon key, respects RLS |
| `src/app/api/admin/homepage/route.ts` | Homepage save API | PATCH works; missing revalidate call |
| `src/app/api/admin/hours/route.ts` | Hours save API | PATCH correct; calls revalidate |
| `src/app/api/admin/revalidate/route.ts` | Cache revalidation | Revalidates all public + admin paths |
| `src/app/admin/homepage/page.tsx` | Admin homepage UI | Save calls PATCH but not revalidate |
| `src/app/admin/hours/page.tsx` | Admin hours UI | Save calls PATCH + revalidate — correct pattern |
| `supabase/migrations/001_initial.sql` | DB schema | Correct; `homepage_sections` and `opening_hours` defined with UNIQUE constraints |
| `.env.local` | Config | All 3 Supabase vars present |
| `tests/e2e/admin.spec.ts` | Tests | Only covers auth, no save tests |
| `playwright.config.ts` | Test config | baseURL localhost:3000, reuseExistingServer |
