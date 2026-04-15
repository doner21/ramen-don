---
artifact_type: "INTAKE"
role: "ORCHESTRATOR"
run_id: "RUN_20260413-214000"
---

# Intake Frame

## task_summary

Set up the Supabase integration for the Ramen Don project, moving from static/seed data to a live database.

## task_type

config / feature

## user_intent

The user wants a fully functional Supabase backend for the Ramen Don site, including database tables, seed data, and admin authentication.

## goal_attractor

A "done" state is when the site correctly fetches data from Supabase (venue, menu, hours, etc.) and the admin section is protected by Supabase authentication, replacing the current mock/fallback behavior.

## constraints

- Must use existing `@supabase/ssr` and `@supabase/supabase-js` dependencies.
- Must follow the existing directory structure (src/lib/supabase-server.ts, src/lib/data/fetchers.ts, etc.).
- Admin routes must be protected via middleware using Supabase session checks.

## invariants

- Public pages must still work (fall back gracefully if possible, but the goal is live data).
- Existing styling and layouts must not be broken.
- Database schema must match `supabase/migrations/001_initial.sql`.

## success_criteria

- Supabase environment variables are documented and ready for the user to provide.
- `middleware.ts` is updated to handle Supabase session refreshing correctly.
- `src/lib/data/fetchers.ts` is verified to work with the live Supabase client.
- Admin login is functional using Supabase Auth.

## ambiguities

- We don't have the user's Supabase URL and Keys yet.
- We need to confirm if the user has already run the SQL in their Supabase dashboard.

## clarification_needed

true

## clarification_questions

- Have you already created a Supabase project and run the SQL from `supabase/migrations/001_initial.sql` and `supabase/seed.sql` in your dashboard?
- If so, could you please provide your `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`? You can add them to a `.env.local` file or provide them here.

## recommended_next_step

RESEARCH
