---
run_id: RUN_20260414-232000
created_at: 2026-04-14T23:20:00Z
task_type: bug-fix
clarification_needed: false
recommended_next_step: PLAN
---

# ATT_0 — INTAKE

## task_summary
Verify that Run 4 fixes (gallery page, revalidation) are working, diagnose and fix the opening hours day-grouping display bug, and confirm venue details and hours update correctly on the public site.

## task_type
bug-fix

## user_intent
Confirm the system is fully functional end-to-end: admin writes reflect on the public site, the gallery works without crashing, and opening hours display all 7 days individually without grouping.

## goal_attractor
- `/gallery` shows uploaded images without any crash
- Saving hours in admin → public site reflects the change after revalidation
- Saving venue details in admin → public site reflects the change
- Opening hours admin page shows 7 distinct day rows (Sun–Sat), not bunched/duplicated

## constraints
- Do NOT change `middleware.ts`, `src/lib/supabase-server.ts`, or `.env.local`
- All admin writes must go through `/api/admin/*` routes using `createSupabaseAdminClient()`
- Dev server: `npm run dev` in `C:/Users/doner/ramen-don` → `http://localhost:3000`
- Admin credentials: `donald@karaokebox.co.uk` / `18Frithst!!!!`

## invariants
- Admin login/logout must remain working
- All `/api/admin/*` routes must continue using `createSupabaseAdminClient()` (true service role)
- Public pages use anon key via `createSupabaseServerClient()` — do not change this
- Gallery upload flow (confirmed working in Run 4) must not regress
- `GalleryGrid.tsx` src priority: `storage_url || local_path` (fixed in Run 4) must stay

## success_criteria
1. `http://localhost:3000/gallery` loads without error and shows at least one uploaded image
2. `PATCH /api/admin/hours` returns `{"success":true}` and public hours page reflects the change after hard-refresh
3. `PATCH /api/admin/venue` returns `{"success":true}` and public site reflects the change
4. Opening hours admin page shows exactly 7 rows (one per day, Sun=0 through Sat=6) with distinct times — no duplicates or grouping

## ambiguities
- Whether `storage_url` is actually populated in DB for uploaded images (gallery crash may persist if null)
- Whether duplicate rows exist in `opening_hours` table (root cause of grouping bug)
- Whether upsert `onConflict: "day_of_week"` is stripping `id`/`created_at`/`updated_at` before upserting (may cause silent conflict failures)
- Whether revalidation path in `route.ts` actually covers all required paths

## clarification_needed
false

## recommended_next_step
PLAN

## route_selected
A — Plan → Execute → Verify (well-specified task, detailed handoff context available)
