---
artifact_type: "PLAN"
role: "PLANNER"
run_id: "RUN_20260415-001"
attempt: 1
task_summary: "Fix Wednesday closed display on landing page, footer, and contact page"
---

# ATT_1 — Plan: Fix Wednesday Opening Hours

## Task Statement

Wednesday is now a closed day. The Supabase database is already correct. The Visit Us page already shows Wednesday as closed (it fetches dynamically). Three files contain hardcoded opening hours strings that still group Tuesday–Friday together or show Wednesday as open. Those three files must be updated. The seed-data fallback also needs correcting.

---

## Invariants

- Do NOT touch `src/app/(public)/visit/page.tsx` — it is already correct.
- Do NOT refactor components to be async or data-driven. Simple string edits only.
- Preserve all existing class names, styling, and structure. Only change text content and closed-state styling.
- Do NOT alter hours for any other day.
- Do NOT change Monday's closed display — it is already correct.

---

## Changes Required

### File 1: `src/components/sections/VisitInfo.tsx`

**Location:** Lines 29–32 — the single `Tue–Fri` row.

**Current:**
```jsx
<div className="flex justify-between">
  <span className="text-[#F0EBE3]">Tue–Fri</span>
  <span className="text-[#A09488]">12:00–15:00, 17:00–22:00</span>
</div>
```

**Replace with:**
```jsx
<div className="flex justify-between">
  <span className="text-[#F0EBE3]">Tuesday</span>
  <span className="text-[#A09488]">12:00–15:00, 17:00–22:00</span>
</div>
<div className="flex justify-between text-[#A09488]">
  <span className="line-through opacity-50">Wednesday</span>
  <span className="line-through opacity-50">Closed</span>
</div>
<div className="flex justify-between">
  <span className="text-[#F0EBE3]">Thu–Fri</span>
  <span className="text-[#A09488]">12:00–15:00, 17:00–22:00</span>
</div>
```

---

### File 2: `src/components/layout/Footer.tsx`

**Location:** Lines 77–78 — Monday closed line + Tue–Fri line.

**Current:**
```jsx
<p className="line-through opacity-50">Monday — Closed</p>
<p>Tue–Fri: 12:00–15:00, 17:00–22:00</p>
```

**Replace with:**
```jsx
<p className="line-through opacity-50">Monday — Closed</p>
<p>Tue: 12:00–15:00, 17:00–22:00</p>
<p className="line-through opacity-50">Wednesday — Closed</p>
<p>Thu–Fri: 12:00–15:00, 17:00–22:00</p>
```

---

### File 3: `src/app/(public)/contact/page.tsx`

**Location:** Lines 73–76 — the Wednesday row (currently shows hours, not closed).

**Current:**
```jsx
<div className="flex justify-between py-2 border-b border-[#3D3229]">
  <span className="text-[#F0EBE3]">Wednesday</span>
  <span className="text-[#A09488]">12:00–15:00, 17:00–22:00</span>
</div>
```

**Replace with** (match Monday's closed pattern at lines 65–68):
```jsx
<div className="flex justify-between py-2 border-b border-[#3D3229] opacity-40">
  <span className="text-[#F0EBE3] line-through">Wednesday</span>
  <span className="text-[#A09488] line-through">Closed</span>
</div>
```

---

### File 4: `src/lib/data/seed-data.ts`

**Location:** Lines 37–45 — Wednesday entry in `OPENING_HOURS` array.

**Current:**
```typescript
{
  day_of_week: 2,
  day_name: "Wednesday",
  is_closed: false,
  lunch_open: "12:00",
  lunch_close: "15:00",
  dinner_open: "17:00",
  dinner_close: "22:00",
},
```

**Replace with:**
```typescript
{
  day_of_week: 2,
  day_name: "Wednesday",
  is_closed: true,
},
```

---

## Success Criteria

1. Landing page (homepage) opening hours section shows Wednesday as closed with strikethrough/muted style, and Tuesday and Thu–Fri listed separately.
2. Footer on every page (menu, reservations, gallery, contact bottom) shows Wednesday as closed.
3. Contact page opening hours section shows Wednesday as closed with the same opacity/line-through style as Monday.
4. `seed-data.ts` Wednesday entry has `is_closed: true` and no hours fields.
5. Visit Us page is unchanged and still shows Wednesday closed.
6. No TypeScript errors introduced.

---

## Handoff Notes

- The contact page Monday closed pattern uses `opacity-40` on the outer div + `line-through` on both inner spans. Wednesday must match this exactly.
- VisitInfo uses a different closed pattern: `text-[#A09488]` on the outer div + `line-through opacity-50` on both spans (no opacity on outer div). Match Monday in VisitInfo (lines 25–28).
- Footer uses plain `<p>` tags with `line-through opacity-50` class. Keep that pattern for Wednesday.
- No ISR invalidation is needed in dev. In production, a redeploy or `revalidatePath` call handles cache clearing — that is out of scope for this fix.
- The researcher noted menu/reservations/gallery pages don't have their own hours displays; they use the shared Footer component. Fixing Footer.tsx covers all of them.
