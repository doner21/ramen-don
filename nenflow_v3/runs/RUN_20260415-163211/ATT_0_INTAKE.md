---
run_id: RUN_20260415-163211
step: INTAKE
recommended_next_step: RESEARCH
clarification_needed: false
---

# NenFlow v3 — INTAKE

## task_summary
Fix the admin homepage editing panel so that all editable fields (section text, CTA button text, etc.) actually persist to the database and render correctly on the public homepage — eliminating hardcoded content like "Birmingham EST since day one" that cannot be changed via admin.

## task_type
bug-fix

## user_intent
The user wants the admin homepage content editor to be the single source of truth for what appears on the public homepage. Currently edits either don't save, don't display, or the homepage has hardcoded content that bypasses the CMS entirely.

## goal_attractor
Every editable field shown in the admin homepage panel maps 1:1 to a visible element on the public homepage. Saving a change in admin updates the live page. No hardcoded content remains that the admin cannot control.

## constraints
- Must not break existing page structure or layout
- Must not regress other pages
- The admin panel UI likely already exists — fix the data wiring, not the UI
- Hardcoded strings in JSX must be replaced with DB-sourced values
- Fallback/default values should be sensible so the page doesn't break if DB is empty

## invariants
- Admin auth must remain intact
- Public homepage must render without errors even if no content is saved in DB
- Other admin sections (gallery, menu, etc.) must be unaffected

## success_criteria
1. Editing homepage section text in admin and saving updates the live homepage
2. Editing CTA button text in admin and saving updates the button text on the live homepage
3. "Birmingham EST since day one" (or any other hardcoded strings) are replaced by DB-driven values the admin can edit
4. All editable fields in the admin homepage panel have a corresponding visible effect on the public homepage
5. No fields in the admin panel are "dead" (editable but have no effect)

## ambiguities
- What fields exist in the admin homepage editor (need to read the component)
- What the DB schema looks like for homepage sections
- Whether the homepage reads from DB at all, or is largely static
- Whether the API save route exists and works, or is missing entirely

## recommended_next_step
RESEARCH
