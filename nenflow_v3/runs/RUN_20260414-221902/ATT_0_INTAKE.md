---
artifact_type: INTAKE
run_id: RUN_20260414-221902
created_at: 2026-04-14T22:19:02Z
---

# NenFlow v3 — INTAKE

## task_summary
Supabase is not configured correctly for ramen-don admin: setup wizard fails with "new row violates row-level security policy", gallery images don't update, opening hours don't persist after saving.

## task_type
bug-fix / config

## user_intent
Make the admin panel fully functional end-to-end: setup wizard completes, gallery uploads save, opening hours changes persist — all via Supabase.

## goal_attractor
Admin panel works: setup wizard runs clean, gallery shows uploaded images, opening hours reflect edits after save.

## constraints
- Project: /c/Users/doner/ramen-don (Next.js + Supabase)
- Supabase project ref: usponfmwsloozdccugmb
- Use Playwright to inspect the running admin UI
- Must not delete existing data
- Session fix from previous run (RUN_20260414-212623) must remain intact

## invariants
- Existing Supabase data must not be lost
- middleware.ts must not be changed
- Public-facing website must keep working

## success_criteria
1. Setup wizard completes without RLS error
2. Gallery image uploads appear in the gallery view
3. Opening hours changes persist after "Save All Changes"
4. No "row-level security policy" errors in any admin operation

## ambiguities
- Which tables exist vs are missing in Supabase
- Whether RLS is enabled with no permissive policies (common cause)
- Whether gallery Storage bucket exists
- What the setup wizard API route actually does

## clarification_needed
false

## recommended_next_step
RESEARCH
