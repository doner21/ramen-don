---
run_id: RUN_20260413-110000
role: RESEARCHER
status: COMPLETE
---

## Bug 1: Nav Pills — Root Cause

### Issue Summary
Category nav pills on the `/menu` page do not scroll to the correct section or highlight the active category when scrolling on mobile. The previous fix (replacing `SCROLL_OFFSET = 124` with a dynamic `getScrollOffset()` function) did NOT resolve the issue.

### Root Causes Identified

#### 1. **Race Condition: `getScrollOffset()` Called Too Early / Unstable**
   - **Location**: `src/components/menu/MenuNav.tsx`, lines 13-18 and throughout the component
   - **Problem**: `getScrollOffset()` reads `navRef.current?.offsetHeight ?? 57` on every call. On first mount and during rapid operations, `navRef.current` may be null or the offsetHeight may not yet be finalized due to React render cycles.
   - **Impact**: 
     - First scroll calculation uses fallback 57px instead of actual nav height
     - If nav renders at a different height (e.g., 52px on iPhone with different font rendering), the offset is permanently wrong
     - On button click (`scrollTo`), `getScrollOffset()` is called before React re-renders, so navRef may temporarily be unavailable
   - **Evidence**: The function is called dynamically at lines 23, 48 — neither is guaranteed to have final DOM measurements

#### 2. **Missing `useEffect` Dependency: `getScrollOffset` Not Re-evaluated on Layout Changes**
   - **Location**: `src/components/menu/MenuNav.tsx`, line 42
   - **Problem**: The `useEffect` has dependency `[categories]` but `getScrollOffset()` is defined outside and its result depends on `navRef.current?.offsetHeight` and window width. When the window is resized (common on mobile after orientation change), the offset should be recalculated but isn't.
   - **Impact**: On iOS/Android orientation change (portrait ↔ landscape), nav height may change but scroll positions don't update
   - **Code**: `window.addEventListener("scroll", updateActive, { passive: true });` runs once on mount; if window resizes, the old offset is stale

#### 3. **Media Query Timing on Mobile Safari**
   - **Location**: `src/components/menu/MenuNav.tsx`, line 14
   - **Problem**: `window.matchMedia("(min-width: 1024px)").matches` reads the breakpoint at the moment `getScrollOffset()` is called. On iOS Safari, the actual viewport width can be ambiguous (visual viewport vs. layout viewport). Additionally, the Tailwind breakpoint `lg:` is 1024px, but device widths are often reported differently.
   - **Impact**: On iPad (1024px width) or certain Android devices, the header height calculation may toggle between 64px and 80px incorrectly

#### 4. **Scroll Spy Logic: Immediate setActive() on Click Overrides Scroll Detection**
   - **Location**: `src/components/menu/MenuNav.tsx`, lines 44-52
   - **Problem**: In `scrollTo()`, `setActive(slug)` is called immediately after `window.scrollTo()` with `behavior: "smooth"`. The smooth scroll takes ~300-500ms, but the active pill is updated instantly. If the user scrolls by hand during smooth scroll, the pill will incorrectly highlight.
   - **Impact**: Mobile users see inconsistent highlighting when tapping pills quickly or scrolling manually during smooth scroll

### Measurement Values (Calculated)
- **Mobile header height (h-16)**: 64px
- **Desktop header height (h-20)**: 80px
- **Expected nav height**: ~57px (but varies by device/font rendering)
- **Expected getScrollOffset (mobile)**: 64 + 57 + 8 = 129px

---

## Bug 2: Hamburger Menu Non-Functional on Mobile

### Issue Summary
The hamburger button in the Header does not respond to taps/clicks on mobile devices.

### Root Causes Identified

#### 1. **Missing `type="button"` Attribute (Best Practice Violation)**
   - **Location**: `src/components/layout/Header.tsx`, line 89
   - **Problem**: The hamburger `<button>` lacks `type="button"`. Default is `submit`, which could cause unexpected behavior.
   - **Code**: 
     ```jsx
     <button className="lg:hidden p-2 text-[#F0EBE3]" onClick={() => setMenuOpen(!menuOpen)}
     ```
   - **Fix**: Add `type="button"`

#### 2. **Potential iOS Safari Touch Event Issue (Most Likely)**
   - **Context**: The button uses React state to conditionally render the drawer
   - **Issue**: iOS Safari sometimes suppresses click events on elements that conditionally render DOM content
   - **Assessment**: The React code is correct, but iOS Safari's event handling with conditional rendering can be problematic
   - **Indicator**: If test clicks work but real device taps don't, this is the issue

#### 3. **Test Uses Mouse Events, Not Touch Events**
   - **Location**: `tests/e2e/navigation.spec.ts`, line 33
   - **Problem**: Playwright's `.click()` simulates a mouse event, not a touch event. iOS Safari may handle these differently.
   - **Impact**: Test may pass while real touch fails

---

## Existing Playwright Tests

### Menu Navigation Tests (menu.spec.ts) - 6 Tests
1. `loads with correct title` — Page title check
2. `all 7 categories are visible` — All category headings render
3. `prices with pound sign present` — Pricing format
4. `dietary tags visible` — VG/dietary badges
5. `sample menu items present` — Known items appear
6. `MenuNav is present` — Sticky nav bar exists

**Critical Gaps**: 
- NO tests for clicking pills and scrolling to sections
- NO tests for scroll spy highlighting
- NO mobile-specific behavior tests

### Hamburger / Mobile Navigation Tests (navigation.spec.ts)
**Test**: `mobile hamburger opens drawer` (lines 27-40)
- Sets iPhone 13 viewport (390x844)
- Clicks hamburger button
- Expects drawer menu links visible

**Status**: This test would FAIL if button click doesn't work. The code logic is correct.

---

## Playwright Config

**File**: `playwright.config.ts`

**baseURL**: `http://localhost:3002`

**Projects**:
- Desktop Chrome
- Mobile Safari (iPhone 13) — 390x844px

**Gaps**: No Android devices configured

---

## Fix Recommendations

### Bug 1: Nav Pills

#### Fix #1: Memoize the Scroll Offset
Calculate nav height once after mount and on resize, not on every scroll event.

```typescript
const [navHeight, setNavHeight] = useState<number>(57);

useEffect(() => {
  const updateNavHeight = () => {
    if (navRef.current) {
      setNavHeight(navRef.current.offsetHeight);
    }
  };
  updateNavHeight();
  window.addEventListener("resize", updateNavHeight);
  return () => window.removeEventListener("resize", updateNavHeight);
}, []);

const getScrollOffset = (): number => {
  const headerHeight = window.matchMedia("(min-width: 1024px)").matches ? 80 : 64;
  return headerHeight + navHeight + 8;
};
```

#### Fix #2: Remove Immediate `setActive()` from `scrollTo()`
Let the scroll spy listener detect when the page settles at the new position.

```typescript
const scrollTo = (slug: string) => {
  const el = document.getElementById(`cat-${slug}`);
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - getScrollOffset();
    window.scrollTo({ top, behavior: "smooth" });
  }
  // REMOVE: setActive(slug);
};
```

#### Fix #3: Add Debounce to Scroll Spy
Prevent pill from flickering on fast scrolling.

```typescript
const onScroll = () => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(updateActive, 50);
};
window.addEventListener("scroll", onScroll, { passive: true });
```

---

### Bug 2: Hamburger Menu

#### Fix #1: Add `type="button"`
```jsx
<button
  type="button"
  className="lg:hidden p-2 text-[#F0EBE3]"
  onClick={() => setMenuOpen(!menuOpen)}
  aria-label="Toggle navigation"
>
```

#### Fix #2: If issue persists, add Pointer Events
```jsx
className="lg:hidden p-2 text-[#F0EBE3] pointer-events-auto"
```

#### Fix #3: Improve Touch Event Testing
Enhance Playwright tests to dispatch actual touch events instead of mouse clicks.

