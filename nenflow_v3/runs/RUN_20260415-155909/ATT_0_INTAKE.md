---
run_id: RUN_20260415-155909
step: INTAKE
recommended_next_step: RESEARCH
clarification_needed: false
---

# NenFlow v3 — INTAKE

## task_summary
Fix the admin gallery hero assignment system so that starring/unstarring an image correctly sets or removes it as the landing page hero.

## task_type
bug-fix

## user_intent
The user wants the star-based hero toggle in the admin gallery to actually persist and reflect the correct hero image on the public landing page.

## goal_attractor
When the user clicks the star on a gallery image in admin, the hero is set. When they click it again (or on another image), the previous hero is cleared and the new one is set (or cleared). The landing page renders the correct hero accordingly.

## constraints
- Must work within the existing admin gallery UI and the star-toggle UX already in place
- Must not break other gallery functionality (image upload, delete, ordering)
- Must not break the public-facing landing page hero render

## invariants
- Existing gallery images must not be deleted or reordered as a side-effect
- Auth/admin protection on the relevant API routes must remain intact
- No regressions to other pages

## success_criteria
1. Clicking the star on an unstarred image sets it as the hero and persists (DB + API)
2. Clicking the star on the currently-starred image removes it as the hero
3. The public landing page reflects the current hero image (or falls back gracefully if none set)
4. Star state in the admin UI is accurate on page load (reads from DB, not local state only)
5. No console errors or broken API calls during the flow

## ambiguities
- Whether the hero field is stored in an image document or in a separate config/settings document
- Whether the frontend star toggle currently calls any API at all, or is purely client-side state
- Whether the landing page hero is fetched at build time (SSG) or request time (SSR/ISR)

## clarification_needed
false

## recommended_next_step
RESEARCH
