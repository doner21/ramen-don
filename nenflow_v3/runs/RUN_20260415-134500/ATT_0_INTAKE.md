---
name: "ATT_0_INTAKE"
run_id: "RUN_20260415-134500"
type: intake
created_at: "2026-04-15T13:45:00Z"
---

# INTAKE — RUN_20260415-134500

## task_summary
Fix Admin Home page save failures (heading, subheading, story, hero image visibility) and opening hours updates not persisting, then verify the entire admin backend with Playwright.

## task_type
bug-fix

## user_intent
The admin panel's CMS fields are not persisting to the database/API. Changes made in the Admin Home page (section heading, subheading, story text, hero image hide toggle) do not save. Opening hours displayed site-wide also do not update when edited in the admin panel. The user needs all these fixed and verified end-to-end with Playwright tests on localhost.

## goal_attractor
When done: an admin can edit any CMS field in the admin panel, save it, and see the change reflected on the live site. Playwright tests confirm each field persists across page reloads. No more silent save failures.

## constraints
- Changes must be made on the current branch (`ramen-don_alpha`) on localhost
- Must use Playwright for verification
- Must not break existing working admin functionality
- Must not alter the main branch

## invariants
- Existing page layouts and visual design must remain unchanged
- Authentication/session handling must not be broken
- Other working admin sections must continue to work
- Database schema must not be destructively altered

## success_criteria
1. Admin Home page: section heading change saves and reflects on frontend after reload
2. Admin Home page: subheading change saves and reflects on frontend after reload
3. Admin Home page: story text change saves and reflects on frontend after reload
4. Admin Home page: hero image visibility toggle (hide/show) saves and reflects on frontend
5. Opening hours: changes in admin save and reflect at bottom of every page after reload
6. Playwright tests confirm each of the above scenarios pass
7. No console errors during save operations

## ambiguities
- Which specific API routes handle admin saves (need to investigate)
- Whether the issue is in the frontend form submission, API handler, or database write layer
- Whether there is a single shared save endpoint or separate ones per section
- Whether the opening hours issue is the same root cause as the home page issues

## clarification_needed
false

## recommended_next_step
RESEARCH

## notes
The task requires codebase investigation before a plan can be formed — API routes, form handlers, and database layer are unknown. Route B (Research → Plan → Execute → Verify) is appropriate.
