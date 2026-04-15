---
run_id: RUN_20260413-100000
role: RESEARCHER
status: COMPLETE
---

## Findings

### Header (src/components/layout/Header.tsx)
- `position: fixed; top: 0; left: 0; right: 0; z-50`
- Inner flex row height: **`h-16 lg:h-20`** — 64px mobile, 80px on `lg` (1024px+) breakpoint

### MenuNav (src/components/menu/MenuNav.tsx)
- `sticky top-16 z-40` — sticks at 64px on ALL viewports
- Mobile: 64px = header height ✓ correct
- Desktop: 64px vs 80px header → nav sticks 16px under the header
- SCROLL_OFFSET = 124 (hardcoded constant)
- Nav physical height: ~57px (py-3 inner div + py-1.5 button + text-sm = 12+20+12+12+1border = 57px)

### Menu Page (src/app/(public)/menu/page.tsx)
- Hero banner: `pt-20 pb-10` — always 80px top padding regardless of breakpoint
- Structure: Hero → MenuNav → category sections
- Category sections: `<section id="cat-{slug}" className="py-12">` — 48px top padding before h2

### Public Layout (src/app/(public)/layout.tsx)
- `<main className="flex-1">` — no padding-top; header is fixed so pages manage their own top padding

### Root Cause Analysis

**Mobile bug (primary)**:
- Header: 64px. Nav sticks at 64px. Nav bottom: 64+57 = 121px.
- SCROLL_OFFSET=124 provides only 3px buffer above nav bottom.
- iOS Safari has a dynamic viewport — the address bar animates in/out during scroll, causing getBoundingClientRect() values to shift by several pixels.
- With only 3px buffer, sections frequently land 1-5px behind the sticky nav.

**Desktop side effect**:
- Nav sticks at 64px but header is 80px → nav is partially behind header (16px overlap).
- Effective nav bottom = 64+57 = 121px. SCROLL_OFFSET=124 provides 3px buffer.
- Same iOS-equivalent risk on mobile. Desktop coincidentally works due to the 16px header overlap "eating" the nav height, making effective bottom ~121px which 124 just clears.
- However: if we fix sticky to `top-20` on desktop without increasing SCROLL_OFFSET, desktop will break (need 80+57+buffer=~145).

### Required Fix

1. **`MenuNav` sticky position**: Change `top-16` to `top-16 lg:top-20` to correctly align nav below header on both breakpoints.

2. **SCROLL_OFFSET**: Replace magic constant with dynamic measurement. Add a `useRef` on the nav element. In `updateActive` and `scrollTo`, compute offset as:
   ```
   offset = headerHeight + navElement.offsetHeight + 8
   headerHeight = window.matchMedia('(min-width: 1024px)').matches ? 80 : 64
   ```
   This eliminates the fragile magic number entirely.

3. **No other files need changing.** Category section IDs, menu page structure, and header are all correct.
