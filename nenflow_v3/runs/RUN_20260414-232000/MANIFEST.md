# MANIFEST — RUN_20260414-232000

| Field | Value |
|-------|-------|
| Run ID | RUN_20260414-232000 |
| Project | Ramen Don Admin Panel |
| Attempt | 1 |
| Verdict | PASS |
| Route | A (Plan → Execute → Verify) |
| Started | 2026-04-14T23:20:00Z |
| Completed | 2026-04-14T23:50:00Z |

## Artifacts

| File | Role |
|------|------|
| ATT_0_INTAKE.md | Orchestrator intake |
| ATT_1_PLAN.md | Planner output |
| ATT_1_EXECUTION.md | Executor output |
| ATT_1_VERIFIER_BRIEF.md | Executor → Verifier handoff |
| ATT_1_VERIFICATION.md | Verifier output (PASS) |

## Changes Landed

| File | Change |
|------|--------|
| `src/app/api/admin/hours/route.ts` | Upsert fix: strips `id`/`created_at`/`updated_at` before upsert |
| `src/app/admin/hours/page.tsx` | Added revalidation call after successful save |
| `src/app/admin/venue/page.tsx` | Added revalidation call after successful save |

## Verified Live (Playwright)

- `/gallery` — loads, images visible, no crash
- Admin login — working
- Hours save → `{"success":true}` → revalidate → public `/visit` updated
- Venue save → `{"success":true}` → revalidate → public `/visit` updated
- Exactly 7 hours rows, no duplicates
