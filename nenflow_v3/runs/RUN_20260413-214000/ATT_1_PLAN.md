---
artifact_type: "PLAN"
role: "PLANNER"
run_id: "RUN_20260413-214000"
context_saturation_estimate: "10%"
---

# Plan

## Task Statement
Transition the Ramen Don project from static seed data to a live Supabase integration. This includes provisioning the database schema, seeding it with initial data, and updating the application's middleware and data fetchers to use the live Supabase client.

## Invariants
- [INV_001] Do not break the existing UI layouts or styling.
- [INV_002] Ensure public pages continue to work, either with live data or by falling back gracefully.
- [INV_003] Use the existing `@supabase/ssr` pattern for session management in middleware.

## Success Criteria
- [SC_001] Supabase tables (`venue_details`, `menu_categories`, etc.) exist in the live database.
- [SC_002] Seed data from `supabase/seed.sql` is present in the live database.
- [SC_003] `middleware.ts` correctly handles Supabase session refreshing and protects `/admin` routes.
- [SC_004] Data fetchers in `src/lib/data/fetchers.ts` retrieve data from the live Supabase instance.

## Handoff Notes
1. Provision the database using Playwright to run `001_initial.sql` and `seed.sql`.
2. Update `middleware.ts` to use `@supabase/ssr`'s `createServerClient`.
3. Verify the connection using a standalone script and by running `npm run lint`.
