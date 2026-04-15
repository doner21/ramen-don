---
artifact_type: INTAKE
run_id: RUN_20260414-212623
created_at: 2026-04-14T21:26:23Z
---

# NenFlow v3 — INTAKE

## task_summary
Fix "session has expired" error in the ramen-don website admin panel when saving items and uploading gallery images.

## task_type
bug-fix

## user_intent
Restore full admin panel functionality so the user can save menu/content items and upload gallery images without hitting authentication/session expiry errors.

## goal_attractor
Admin panel operates without session errors. Gallery image uploads succeed. The admin experience is smooth end-to-end, correctly integrated with Supabase.

## constraints
- Project is `/c/Users/doner/ramen-don` — Next.js + Supabase
- Must check `.env` and `.env.local` files for configuration issues
- Must verify Supabase client integration in admin panel
- If no obvious config fix is found, redesign parts of admin to work with Supabase properly
- Must not break existing website functionality or data

## invariants
- Existing Supabase data must not be lost or corrupted
- Public-facing website functionality must remain intact
- No new breaking changes to non-admin routes

## success_criteria
1. Admin panel saves items without "Error saving item: your session has expired. Please log in again."
2. Gallery section successfully uploads images
3. Supabase auth session is correctly initialized and refreshed in admin context
4. `.env`/`.env.local` Supabase variables are correctly set and consumed

## ambiguities
- Which admin panel implementation is in use (custom vs. a CMS adapter)?
- Is there a middleware.ts auth guard that may be causing session invalidation?
- Are SUPABASE_URL / SUPABASE_ANON_KEY / SERVICE_ROLE_KEY present and correct in .env.local?
- Is the admin using Supabase auth client-side or server-side (SSR cookies vs. localStorage)?

## clarification_needed
false

## recommended_next_step
RESEARCH
