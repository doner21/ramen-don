---
run_id: RUN_20260413-100000
role: PLANNER
verdict: PLAN_READY
---

# Plan: Fix MenuNav Responsive Scroll Offset

## Task Statement

Replace the hardcoded `SCROLL_OFFSET = 124` constant and incorrect `top-16` sticky class in
`src/components/menu/MenuNav.tsx` with a dynamic offset that correctly accounts for header
height at both mobile (64px) and desktop (80px) breakpoints, plus the measured nav height.

---

## Invariants

- Props interface `MenuNavProps` is unchanged.
- Scroll-spy algorithm is unchanged: forward iteration, absolute-position comparison.
- No other files are modified.
- The `useEffect` dependency array stays `[categories]`.

---

## Success Criteria

1. `sticky top-16 lg:top-20` — nav sits flush below the header on both breakpoints.
2. `SCROLL_OFFSET` constant is removed entirely from the file.
3. A `navRef` of type `useRef<HTMLElement>(null)` is defined and attached to the `<nav>` element.
4. `getScrollOffset()` helper reads live breakpoint and live nav height each call.
5. Both `updateActive` and `scrollTo` call `getScrollOffset()` instead of the constant.
6. `npx next build` passes with zero TypeScript errors.

---

## Exact File Change

### `src/components/menu/MenuNav.tsx` — full replacement

```tsx
"use client";

import { useState, useEffect, useRef } from "react";

interface MenuNavProps {
  categories: { slug: string; name: string }[];
}

export default function MenuNav({ categories }: MenuNavProps) {
  const [active, setActive] = useState(categories[0]?.slug || "");
  const navRef = useRef<HTMLElement>(null);

  const getScrollOffset = (): number => {
    const headerHeight = window.matchMedia("(min-width: 1024px)").matches
      ? 80
      : 64;
    return headerHeight + (navRef.current?.offsetHeight ?? 57) + 8;
  };

  useEffect(() => {
    const updateActive = () => {
      const scrollY = window.scrollY;
      const offset = getScrollOffset();
      let currentSlug = categories[0]?.slug || "";

      for (const cat of categories) {
        const el = document.getElementById(`cat-${cat.slug}`);
        if (el) {
          const elTop = el.getBoundingClientRect().top + scrollY;
          if (scrollY >= elTop - offset) {
            currentSlug = cat.slug;
          }
        }
      }

      setActive(currentSlug);
    };

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    return () => window.removeEventListener("scroll", updateActive);
  }, [categories]);

  const scrollTo = (slug: string) => {
    const el = document.getElementById(`cat-${slug}`);
    if (el) {
      const top =
        el.getBoundingClientRect().top + window.scrollY - getScrollOffset();
      window.scrollTo({ top, behavior: "smooth" });
    }
    setActive(slug);
  };

  return (
    <nav
      ref={navRef}
      className="sticky top-16 lg:top-20 z-40 bg-[#1A1714]/95 backdrop-blur-sm border-b border-[#3D3229] overflow-x-auto"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex gap-1 py-3 min-w-max">
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => scrollTo(cat.slug)}
              className={`px-4 py-1.5 text-sm font-sans font-medium tracking-wide transition-all whitespace-nowrap ${
                active === cat.slug
                  ? "bg-[#C8892A] text-[#1A1714]"
                  : "text-[#A09488] hover:text-[#F0EBE3]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
```

---

## getScrollOffset() Logic

- Mobile (<1024px): 64 + ~57 + 8 = **~129px** (was 124 — adds the 5px iOS needed)
- Desktop (≥1024px): 80 + ~57 + 8 = **~145px** (was 124 — required after fixing sticky top)

Called fresh on every scroll event and every pill tap — auto-adapts to device rotation.

---

## Verification

1. `npx next build` — zero TS errors
2. Mobile (390px): tap pills → sections appear just below nav; scroll spy updates correctly
3. Desktop (1280px): same checks, nav now clears full 80px header
4. `git diff --name-only` → only `src/components/menu/MenuNav.tsx`
