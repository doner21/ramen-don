---
run_id: RUN_20260415-001
step: INTAKE
date: 2026-04-15
---

# ATT_0 — INTAKE

## task_summary
Fix opening hours display across the website so Wednesday appears as closed everywhere (landing page, menu footer, reservations footer, gallery footer, contact page), not just on the Visit Us page.

## task_type
bug-fix

## user_intent
The restaurant is closed on Wednesdays. The Visit Us page correctly reflects this, but the opening hours component used on the landing page and in the footer of menu, reservations, gallery, and contact pages still only shows Monday as closed. Additionally the contact page has two separate opening hours displays that are both broken.

## goal_attractor
Every opening hours display on the site consistently shows Wednesday as closed. Visit Us page remains correct. Contact page (both instances) is fixed.

## constraints
- Visit Us page already works — do not break it
- Contact page has two opening hours locations that need fixing
- Multiple pages share this opening hours display component or data

## invariants
- Existing correct behaviour on Visit Us page must not regress
- No changes to unrelated UI or business logic

## success_criteria
- Landing page (homepage) opening hours shows Wednesday as closed
- Menu page footer/section shows Wednesday as closed
- Reservations page footer/section shows Wednesday as closed
- Gallery page footer/section shows Wednesday as closed
- Contact page (both opening hours instances) shows Wednesday as closed
- Visit Us page still shows Wednesday as closed

## ambiguities
- Hours data source: database (Supabase), hardcoded component, or config file?
- Why does Visit Us page update but other pages don't — different data fetch, different component, or hardcoded fallback?
- Are the footer hours a shared component with a separate data fetch, or just a different prop/default?

## clarification_needed
false

## recommended_next_step
RESEARCH
