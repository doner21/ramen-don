---
artifact_type: "VERIFIER_BRIEF"
role: "EXECUTOR"
run_id: "RUN_20260415-001"
attempt: 1
---

# ATT_1 — Verifier Brief

## Task Summary

Wednesday is now a closed day. Four files were edited to reflect this. Verify each change independently.

---

## Files Changed

1. `src/components/sections/VisitInfo.tsx`
2. `src/components/layout/Footer.tsx`
3. `src/app/(public)/contact/page.tsx`
4. `src/lib/data/seed-data.ts`

## File NOT Changed (must remain untouched)

- `src/app/(public)/visit/page.tsx`

---

## Success Criteria to Verify

### SC1 — VisitInfo.tsx (landing page hours)
- The string `Tue–Fri` must NOT appear anywhere in this file
- A row for `Tuesday` with `12:00–15:00, 17:00–22:00` must exist
- A row for `Wednesday` must exist with `line-through` and `opacity-50` classes and text `Closed`
- A row for `Thu–Fri` with `12:00–15:00, 17:00–22:00` must exist

### SC2 — Footer.tsx (footer on every page)
- The string `Tue–Fri` must NOT appear anywhere in this file
- A line `Tue: 12:00–15:00, 17:00–22:00` must exist
- A line `Wednesday — Closed` with `line-through opacity-50` class must exist
- A line `Thu–Fri: 12:00–15:00, 17:00–22:00` must exist
- Monday line (`Monday — Closed` with `line-through opacity-50`) must be unchanged

### SC3 — contact/page.tsx (contact page hours)
- Wednesday row must have `opacity-40` on the outer div
- Wednesday row must have `line-through` on both inner spans
- Wednesday right span must show `Closed` (not hours)
- Monday row (lines ~65–68) must be unchanged
- All other days (Tuesday, Thursday, Friday, Saturday, Sunday) must be unchanged

### SC4 — seed-data.ts
- Wednesday entry (`day_of_week: 2`) must have `is_closed: true`
- Wednesday entry must NOT have `lunch_open`, `lunch_close`, `dinner_open`, `dinner_close` fields

### SC5 — visit/page.tsx unchanged
- File must not have been modified (check its content — it should still fetch dynamically via getOpeningHours)

### SC6 — No TypeScript errors
- Run `npx tsc --noEmit` — must produce zero output (no errors)

---

## Closed Styling Reference

For comparison, Monday's closed styling in each file:

**VisitInfo.tsx (Monday):**
```jsx
<div className="flex justify-between text-[#A09488]">
  <span className="line-through opacity-50">Monday</span>
  <span className="line-through opacity-50">Closed</span>
</div>
```

**Footer.tsx (Monday):**
```jsx
<p className="line-through opacity-50">Monday — Closed</p>
```

**contact/page.tsx (Monday):**
```jsx
<div className="flex justify-between py-2 border-b border-[#3D3229] opacity-40">
  <span className="text-[#F0EBE3] line-through">Monday</span>
  <span className="text-[#A09488] line-through">Closed</span>
</div>
```
