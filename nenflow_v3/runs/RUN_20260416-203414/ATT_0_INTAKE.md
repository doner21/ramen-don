---
run_id: RUN_20260416-203414
artifact_type: INTAKE
attempt: 0
---

# NenFlow v3 INTAKE

## task_summary
Fix missing body content rendering for three CMS-managed sections (hero, signature dishes, visit CTA) so that content edited in the admin panel appears on the public-facing main site.

## task_type
bug-fix

## user_intent
The user wants body content fields to be editable in the admin CMS and for that content to actually appear on the frontend. Previous fix attempts have not resolved this. All three sections are affected: hero, signature dishes, and visit CTA.

## goal_attractor
When the user types body content for hero, signature dishes, or visit CTA in the admin panel and saves, that text appears correctly on the public site. The admin panel has the correct fields. The frontend reads and renders them.

## constraints
- Must use Playwright to browse Supabase (no direct API access)
- If Supabase login is required, must surface the browser to the user and ask them to log in
- Previous fix attempts have failed — must root-cause rather than re-apply surface patches
- Verification must be non-brittle: actual browser screenshots confirming content renders

## invariants
- Do not break other working sections
- Do not lose existing CMS data
- Do not break the admin panel's other functionality

## success_criteria
1. Hero section: body content field exists in admin, content saved there renders visibly on the public homepage
2. Signature dishes section: body content field exists in admin, content renders on public site
3. Visit CTA section: section (and its body content field) exists in admin, content renders on the visit page
4. Playwright screenshots confirm each of the above — not just code inspection
5. Verification checks the actual rendered DOM, not just that the field exists in code

## ambiguities
- Whether the issue is in the DB schema (missing column), admin form (missing field input), or frontend component (not reading/rendering the field)
- Whether all three sections share the same root cause or have different failure modes
- Current Supabase schema not confirmed — need to investigate

## clarification_needed
false

## recommended_next_step
RESEARCH
