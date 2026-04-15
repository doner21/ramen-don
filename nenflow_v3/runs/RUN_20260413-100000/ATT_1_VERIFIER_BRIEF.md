---
run_id: RUN_20260413-100000
role: VERIFIER_BRIEF
---

# Verifier Brief — ATT_1

## File Changed

`src/components/menu/MenuNav.tsx`

---

## What to Check

### 1. `sticky top-16 lg:top-20` class on nav

Grep for this exact string in the file:

```bash
grep "sticky top-16 lg:top-20" C:/Users/doner/ramen-don/src/components/menu/MenuNav.tsx
```

Expected: exactly one match on the `<nav>` element's `className`.

### 2. `navRef` ref present and attached

```bash
grep "navRef" C:/Users/doner/ramen-don/src/components/menu/MenuNav.tsx
```

Expected: three matches — `useRef` import implicit via `navRef` declaration, `const navRef = useRef<HTMLElement>(null)`, and `ref={navRef}` on the `<nav>` element.

### 3. `getScrollOffset()` function present

```bash
grep "getScrollOffset" C:/Users/doner/ramen-don/src/components/menu/MenuNav.tsx
```

Expected: three matches — function definition (`const getScrollOffset = (): number =>`), call inside `updateActive`, call inside `scrollTo`.

### 4. `SCROLL_OFFSET` constant absent

```bash
grep "SCROLL_OFFSET" C:/Users/doner/ramen-don/src/components/menu/MenuNav.tsx
```

Expected: zero matches. Any match is a FAIL.

### 5. Build passes

```bash
cd C:/Users/doner/ramen-don && npx next build 2>&1 | tail -30
```

Expected: route table printed with no TypeScript errors. Exit code 0.

---

## Build Result

**PASS**

Build completed with zero TypeScript errors. All routes compiled. Output observed by Executor:

```
Route (app)
┌ ○ /
├ ○ /_not-found
...
├ ○ /menu
...
└ ○ /visit

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

The Verifier must independently re-run the build to confirm — the above is the Executor's local observation only.

---

## Additional Checks

- `git diff --name-only` must list only `src/components/menu/MenuNav.tsx` (no other files modified).
- `useEffect` dependency array must be `[categories]` — grep for `}, [categories]);`.
