---
artifact_type: "RESEARCH"
role: "RESEARCHER"
run_id: "RUN_20260415-163211"
---

# NenFlow v3 Research: Ramen Don Admin Homepage Editor Bug

## Investigation Scope

**Project:** C:\Users\doner\ramen-don (Next.js 15+ restaurant website)

**Bug Summary:** Admin homepage editor fields (CTA button text, headings, body content) save successfully but changes don't reflect on the public homepage. Additionally, the public homepage displays hardcoded content that the admin cannot edit (e.g., "Birmingham EST since day one").

---

## Key Findings

### 1. Admin Homepage Editor

**Location:** `src/app/admin/homepage/page.tsx` (lines 1-196)

**Editable Fields Exposed:**
- section.heading (text input)
- section.subheading (text input)  
- section.body (textarea)
- section.cta_text (text input)
- section.cta_url (text input)
- section.is_visible (toggle checkbox)

**Save Mechanism:** PATCH `/api/admin/homepage` with `{ sections }` payload

---

### 2. API Route: /api/admin/homepage/

**Location:** `src/app/api/admin/homepage/route.ts`

**GET:** Fetches homepage_sections table, falls back to seed data
**PATCH:** Uses `.upsert(section, { onConflict: "slug" })` to update each section

---

### 3. Database Schema: homepage_sections

**Columns:**
- id (UUID, PRIMARY KEY)
- slug (TEXT, UNIQUE) - used for upsert conflict detection
- heading, subheading, body, cta_text, cta_url (TEXT, nullable)
- image_key (TEXT)
- is_visible (BOOLEAN, default true)
- sort_order (SMALLINT)

---

## Hardcoded Strings Inventory

All hardcoded strings that should be database-driven:

| String | File | Line | Component | Issue |
|--------|------|------|-----------|-------|
| "Birmingham · Est. Since Day One" | Hero.tsx | 33 | Hero | No DB field, not editable |
| "Book a Table" button text | Hero.tsx | 60 | Hero | Ignores section.cta_text |
| OPENTABLE_URL button link | Hero.tsx | 54 | Hero | Ignores section.cta_url |
| "18+" | Story.tsx | 57 | Story | Hardcoded stat |
| "12h" | Story.tsx | 61 | Story | Hardcoded stat |
| "B1" | Story.tsx | 65 | Story | Hardcoded stat |
| FEATURED_BOWLS array (4 items) | MenuHighlights.tsx | 4-35 | MenuHighlights | Completely hardcoded |
| "Book Your Table" | page.tsx | 30 | BookingCTA | Should fetch from DB |
| "Reserve online in seconds..." | page.tsx | 31 | BookingCTA | Should fetch from DB |
| "Unit 1A Regency Wharf" | VisitInfo.tsx | 18 | VisitInfo | Hardcoded address |
| "Birmingham, West Midlands" | VisitInfo.tsx | 19 | VisitInfo | Hardcoded address |
| "B1 2DS" | VisitInfo.tsx | 20 | VisitInfo | Hardcoded postcode |
| "0121 714 5565" | VisitInfo.tsx | 23 | VisitInfo | Hardcoded phone |

---

## Admin Fields Inventory

| Admin Field | DB Column | Components Using It | Working? |
|-------------|-----------|-------------------|----------|
| Heading | heading | Story | YES |
| Subheading | subheading | Hero | YES |
| Body | body | Story | YES |
| CTA Text | cta_text | Hero | **NO - Ignored** |
| CTA URL | cta_url | Hero | **NO - Ignored** |
| Visible | is_visible | Fetcher filter | YES |

---

## Data Flow Gaps

### Gap #1: CTA Button Text Ignored (Hero.tsx:60)
- Admin edits cta_text in DB ✓
- Hero receives section prop ✓
- **Component uses hardcoded "Book a Table" instead of section?.cta_text** ✗

### Gap #2: CTA Button URL Ignored (Hero.tsx:54)
- Admin edits cta_url in DB ✓
- Hero receives section prop ✓
- **Component uses hardcoded OPENTABLE_URL constant** ✗

### Gap #3: BookingCTA Props Hardcoded (page.tsx:29-31)
- **Homepage passes hardcoded heading and subtext instead of fetching from DB** ✗
- Should fetch "visit-cta" section

### Gap #4: "Est. Since Day One" Cannot Be Edited (Hero.tsx:33)
- **No DB field exists** ✗
- No admin field to control this tagline

### Gap #5: MenuHighlights Completely Disconnected (MenuHighlights.tsx)
- **Component uses hardcoded FEATURED_BOWLS array** ✗
- "signature-dishes" section in DB is completely ignored
- No way for admin to customize featured bowls

### Gap #6: Address & Phone Hardcoded (VisitInfo.tsx:18-20, 23)
- **Should fetch from venue_details table** ✗
- Currently hardcoded in component

---

## Constraints Identified

1. **Upsert Conflict Key:** API uses slug for conflict detection; if id field doesn't match, upsert may fail
2. **Fallback Masks Failures:** DB errors silently return seed data, hiding failed saves
3. **No Prop Validation:** Components don't require props, making hardcoding easy
4. **Missing Section Props:** MenuHighlights, BookingCTA don't accept section props

---

## Recommendations

### IMMEDIATE (HIGH PRIORITY)

1. **Fix Hero CTA Text (Hero.tsx:60):**
   Change: `"Book a Table"`
   To: `{section?.cta_text || "Book a Table"}`

2. **Fix Hero CTA URL (Hero.tsx:54):**
   Change: `const OPENTABLE_URL = "..."`
   To: `const url = section?.cta_url || OPENTABLE_URL;`

3. **Fix "Est. Since Day One" (Hero.tsx:33):**
   Add new DB field or make it editable via subheading
   Change hardcoded string to use dynamic value

4. **Fix BookingCTA Props (page.tsx:29-31):**
   Fetch "visit-cta" section from DB
   Pass: `heading={ctaSection?.heading} subtext={ctaSection?.subheading}`

5. **Fix MenuHighlights (MenuHighlights.tsx):**
   Remove hardcoded FEATURED_BOWLS array
   Fetch from menu_items table or accept section prop

### MEDIUM PRIORITY

6. **Fix VisitInfo Address (VisitInfo.tsx):**
   Fetch from venue_details table
   Remove hardcoded address, phone strings

7. **Verify API PATCH:**
   Add logging to confirm updates are working
   Test upsert behavior

---

## Unknowns Remaining

1. Is PATCH handler actually being called?
2. Does upsert really update records or fail silently?
3. Is Supabase properly configured?
4. Does /api/admin/revalidate actually clear caches?
5. Are there DB constraints blocking updates?

---

[SUBAGENT CONTEXT HEALTH — RESEARCHER — END]
saturation_pct: 72%  health_band: WARNING  measured_at: 2026-04-15T17:32:00Z  source: research-completion  self_estimate: ~78%
