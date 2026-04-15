---
name: "ATT_0_INTAKE"
run_id: "RUN_20260415-153700"
type: intake
created_at: "2026-04-15T15:37:00Z"
---

# INTAKE — RUN_20260415-153700

## task_summary
Fix the opening hours rendering in VisitInfo.tsx so day names have colons and the format matches the Footer reference exactly; verify against all pages with Playwright CLI.

## task_type
bug-fix

## user_intent
The previous fix left the opening hours in VisitInfo.tsx looking "jumbled" — no colon separator between day name and time, and the flex justify-between layout creates a visually disconnected split. The user wants the format to match the Footer's "Day: time" pattern exactly (same as seen at bottom of gallery page).

## goal_attractor
Opening hours on the landing page (VisitInfo) look identical in typographic style and format to the footer's Opening Hours column: same muted color, same "Day: time" single-line format with colon, same text size.

## constraints
- Only change the Opening Hours column within VisitInfo.tsx
- Do NOT change any other component, page, or file unless strictly necessary
- Must verify with Playwright CLI (Playwright MCP is disconnected — use npx playwright test)
- Must not break TypeScript compilation

## invariants
- Layout structure of VisitInfo (3-column grid) must remain unchanged
- "Find Us" and "Reserve" columns must not be touched
- Footer.tsx must not be touched
- Contact/Visit pages must not be touched

## success_criteria
1. Opening hours in VisitInfo show "Day: time" format with colon separator, matching Footer pattern
2. All text uses text-[#A09488] (no bright white text-[#F0EBE3] for day names)
3. TypeScript compiles clean
4. Playwright smoke tests pass (or are run and output captured)

## ambiguities
none — the reference (Footer.tsx) is clear and the target file (VisitInfo.tsx) is known

## clarification_needed
false

## recommended_next_step
DIRECT_EXECUTE
