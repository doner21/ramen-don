# RUN_20260413-100000 — MANIFEST

| Field | Value |
|-------|-------|
| run_id | RUN_20260413-100000 |
| task | Fix MenuNav responsive scroll offset (mobile bug) |
| route | B (Research → Plan → Execute → Verify) |
| attempts | 1 |
| verdict | PASS |
| date | 2026-04-13 |

## Files Changed

- `src/components/menu/MenuNav.tsx`

## Changes

1. `SCROLL_OFFSET = 124` constant removed
2. `useRef<HTMLElement>(null)` added as `navRef`, attached to `<nav>`
3. `getScrollOffset()` helper added — reads live header height (64px mobile / 80px desktop at 1024px breakpoint) + live nav `offsetHeight` + 8px buffer
4. Nav className: `sticky top-16` → `sticky top-16 lg:top-20`
5. Both `updateActive` and `scrollTo` now call `getScrollOffset()` instead of the constant

## Result

Mobile: 64 + ~57 + 8 = ~129px offset (was 124 — insufficient for iOS Safari's dynamic viewport)
Desktop: 80 + ~57 + 8 = ~145px offset (was 124 — would have broken after sticky fix)
