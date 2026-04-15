---
run_id: RUN_20260413-110000
role: EXECUTOR
verdict: EXECUTION_COMPLETE
---

## What Was Changed

### Fix 1: `src/components/menu/MenuNav.tsx` — Full replacement
Replaced the entire file with an iOS Safari-compatible implementation:
- `window.scrollY` replaced with `window.pageYOffset || document.documentElement.scrollTop`
- `behavior: 'smooth'` removed from `window.scrollTo()` (CSS handles scroll smoothing; double-setting conflicts on iOS Safari)
- `navRef.current?.offsetHeight` measured once on mount and on resize via a dedicated `useEffect`, stored in `navHeight` state — not measured on every scroll/click
- Immediate `setActive(slug)` call removed from `scrollTo()` — the scroll event listener now exclusively manages active state
- `type="button"` added to pill buttons

### Fix 2: `src/components/layout/Header.tsx` — Hamburger button
- Added `type="button"` attribute to the hamburger button
- Added `cursor-pointer` to the hamburger button className

### Fix 3: `tests/e2e/navigation.spec.ts` — Logotype test and hamburger interaction
- Replaced `page.locator("header").locator("text=RAMEN DON")` with `page.locator("header img[alt='Ramen Don']")` — the logotype is now an image, not text
- Changed `hamburger.click()` to `hamburger.tap()` for mobile touch simulation
- Added `isMobile` fixture to conditionally use `tap()` on touch-enabled contexts and `click()` on desktop Chrome (which has no touch context)

### Fix 4: `tests/e2e/home.spec.ts` — H1 logo image check
The h1 on the homepage now contains `<img alt="Ramen Don">` rather than text. The existing `toContainText(/RAMEN DON/i)` assertion produced an empty string. Replaced with:
- `page.locator("h1 img[alt='Ramen Don']").first()` visibility check

Note: Fix 4 as specified only covered "header" checks, but the actual failure was in the `h1` element. The fix was applied to the `h1` assertion which shares the same root cause (image replaced text).

### Fix 5: `tests/e2e/menu.spec.ts` — Mobile nav pill test added
Added `mobile nav pills scroll to correct sections` test at end of file. The `pillsToTest` slugs (`bowls`, `soft-drinks`, `beers`) were verified against `src/lib/data/seed-data.ts` — exact match. Added `isMobile` conditional for `tap()` vs `click()` to handle Desktop Chrome project (no touch context).

## Files Changed

| File | Action |
|------|--------|
| `src/components/menu/MenuNav.tsx` | Full replacement |
| `src/components/layout/Header.tsx` | Edit — hamburger button `type` + `cursor-pointer` |
| `tests/e2e/navigation.spec.ts` | Edit — logo locator, `tap()` with `isMobile` fallback |
| `tests/e2e/home.spec.ts` | Edit — h1 logo image check |
| `tests/e2e/menu.spec.ts` | Edit — new mobile nav pill test appended |

## Expected Behavior After Change

- MenuNav scroll spy is reliable on iOS Safari (no `window.scrollY` bug, no double smooth-scroll conflict)
- Active pill updates after scroll settles rather than immediately on click
- Hamburger button correctly typed and cursor-pointer on hover
- All navigation tests check the image-based logotype instead of missing text
- Mobile nav pill test verifies section scroll on both mobile and desktop

## How Planner Invariants Were Addressed

- **iOS Safari scrollY fix**: Replaced with `window.pageYOffset || document.documentElement.scrollTop` throughout MenuNav
- **No double smooth-scroll**: `behavior: 'smooth'` removed from `window.scrollTo()` call
- **Stable navHeight measurement**: Moved to a dedicated mount+resize effect, stored in state, not measured inline per-scroll
- **No premature setActive**: `setActive(slug)` call removed from `scrollTo()`; scroll event listener is now the sole authority
- **type="button" on hamburger**: Added
- **cursor-pointer on hamburger**: Added
- **Logotype locator fix**: Applied in both navigation.spec.ts and home.spec.ts
- **tap() for mobile**: Applied in navigation.spec.ts hamburger test and menu.spec.ts pill test
- **New mobile pill test**: Added to menu.spec.ts with correct slug mapping from seed data

## Deviations from Specified Plan

1. **Fix 4 scope**: The planner specified checking only if home.spec.ts checks for logo "in the header." The actual failure was in the h1 element, not the header. The fix was extended to cover the h1 assertion — same root cause, same fix pattern, different DOM location. Documented here as a minor scope extension rather than a silent drift.

2. **tap() fallback in Fix 3 and Fix 5**: The planner specified `tap()` for real iOS touch simulation but did not account for the Desktop Chrome project having no touch context. Added `isMobile` fixture conditional to avoid breaking the desktop run. This is faithful to the intent (tap on mobile, click on desktop) rather than a scope drift.

## Known Risks

- The `isMobile` Playwright fixture reflects the browser context configuration (`hasTouch`), not the viewport size. Manually setting viewport to 375px in a Desktop Chrome context still resolves `isMobile` as `false`. This is intentional and correct — `tap()` requires touch support, not just a narrow viewport.
- The `waitForTimeout(800)` in the mobile pill test is a fixed delay to allow scroll settle. If the server is slow, this may occasionally be insufficient.

## What Still Feels Uncertain

- The CSS `html { scroll-behavior: smooth }` behavior was verified by reading the codebase; not directly tested. The fix assumes the CSS property is set on the html element.
- `window.pageYOffset` is deprecated in favor of `window.scrollY` in modern browsers, but remains the correct compatibility fix for older iOS Safari with `html { height: 100% }`.

## Suggested Verification Paths

1. Run `npx playwright test --project="Mobile Safari (iPhone 13)"` — expect 26/26 pass
2. Run `npx playwright test --project="Desktop Chrome"` — expect 26/26 pass
3. On a real iOS device or iOS simulator: visit `/menu`, tap a category pill, verify smooth scroll to section without jitter, verify active pill updates after scroll settles (not immediately on tap)
4. On desktop: hover over hamburger button and verify `cursor-pointer` cursor style

## Commands Run Locally

```
npx next build
npx playwright test --project="Mobile Safari (iPhone 13)"
npx playwright test --project="Mobile Safari (iPhone 13)"   # after home.spec.ts fix
npx playwright test --project="Desktop Chrome"
npx playwright test --project="Desktop Chrome"              # after isMobile fix
```

## Observed Results

LOCAL OBSERVATIONS:

- `npx next build`: ✓ Compiled successfully in 1739ms, TypeScript clean, 23 static pages generated
- `npx playwright test --project="Mobile Safari (iPhone 13)"` (final): **26 passed** (32.8s)
- `npx playwright test --project="Desktop Chrome"` (final): **26 passed** (21.8s)

No regressions introduced. New mobile pill test (test #18 in mobile Safari, test #18 in Desktop Chrome) passed on both projects.
