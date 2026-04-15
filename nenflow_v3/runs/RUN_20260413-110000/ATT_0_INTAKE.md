---
run_id: RUN_20260413-110000
task_summary: Fix two mobile bugs — category nav pills not scrolling/highlighting, hamburger menu non-functional
task_type: bug-fix
user_intent: Make /menu page fully functional on mobile — nav pills must scroll to correct sections and highlight on scroll; hamburger menu must open/close
goal_attractor: Mobile user taps "Bowls" → scrolls to bowls section, active pill updates; hamburger opens mobile nav drawer
constraints:
  - Test with Playwright (mobile viewport)
  - No Verifier agent — researcher + executor only
  - Desktop must not regress
  - Previous SCROLL_OFFSET fix (getScrollOffset() dynamic approach) may not have solved the pill issue
invariants:
  - MenuNav component props interface unchanged
  - Header component structure unchanged beyond what's needed
  - All 7 category sections must be reachable by tap
success_criteria:
  - Playwright mobile test: tap each nav pill → correct section scrolls into view
  - Playwright mobile test: hamburger button tap → mobile drawer opens
  - npx next build passes
ambiguities:
  - Root cause of pill failure (SCROLL_OFFSET fix was just deployed but user says still broken — may be a different issue like scroll container, overflow hidden, or iOS touch events)
  - Root cause of hamburger failure (may be z-index, pointer-events, overflow:hidden on parent, or state not persisting)
clarification_needed: false
recommended_next_step: RESEARCH
route: B (Research → Execute, no Verifier)
---
