---
run_id: RUN_20260413-100000
task_summary: Fix menu category nav scroll offset on mobile — same sticky-nav mismatch that was fixed on desktop
task_type: bug-fix
user_intent: Make category pill taps scroll to the correct section on mobile, and have the scroll spy highlight correctly as the user scrolls
goal_attractor: Mobile users can tap any category pill and land on the right section; active pill tracks correctly during scroll
constraints:
  - Must not regress desktop behaviour (SCROLL_OFFSET=124 currently works on desktop)
  - iOS Safari is the primary mobile target (Playwright Mobile Safari / iPhone 13)
  - Single MenuNav component handles both breakpoints — solution must be responsive
invariants:
  - MenuNav component interface (props) unchanged
  - Scroll-spy logic approach unchanged (forward iteration, absolute position comparison)
  - No layout changes to header or menu page structure
success_criteria:
  - Tapping a category pill on mobile scrolls such that the section heading is just below the nav bar
  - Scroll spy highlights the correct pill while scrolling on a mobile viewport
  - Desktop scroll behaviour still correct (quick manual check)
ambiguities:
  - Exact mobile header height vs desktop header height (h-16 mobile / h-20 desktop — needs verification in Header.tsx)
  - Whether MenuNav sticky top value accounts for mobile header height
  - Whether the sticky nav itself is a different height on mobile
clarification_needed: false
recommended_next_step: RESEARCH
---

## Notes

The desktop fix set SCROLL_OFFSET=124. The comment in MenuNav.tsx states:
"Height of fixed header (h-16=64px mobile, h-20=80px desktop) + sticky nav (~48px) + buffer"

On mobile: 64 + 48 = 112 + buffer. On desktop: 80 + 48 = 128 + buffer.
SCROLL_OFFSET=124 is between these — correct for neither precisely but apparently works on desktop.

Need to verify:
1. Actual Header height classes (mobile vs desktop)
2. MenuNav sticky top class (should be top-16 on mobile, top-20 on desktop)
3. Whether MenuNav's sticky top is incorrectly set, causing it to overlap the header on mobile
   (if MenuNav has `top-16` but header is only 64px tall on mobile = correct; but if mobile
   header is actually shorter this would stack wrong)
