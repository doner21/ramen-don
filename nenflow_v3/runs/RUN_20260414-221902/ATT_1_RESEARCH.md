---
artifact_type: RESEARCH
run_id: RUN_20260414-221902
role: researcher
---

# Research Brief — Supabase Config Issues

## Core Finding

Tables exist and SELECT works. Gallery bucket exists. RLS policies require `auth.role() = 'authenticated'` for all writes. Admin pages use the browser client (anon key) — writes fail because the user was never authenticated (no admin user existed until now).

**Admin user now created:** donald@karaokebox.co.uk (during this session). After login, browser client auth.role() = 'authenticated' and writes should pass RLS.

## Migration State

- 001_initial.sql: Creates all 7 tables. ALL have RLS enabled. Write policy: `FOR ALL USING (auth.role() = 'authenticated')`. Read policy: public SELECT.
- 002_create_gallery_bucket.sql: Creates 'gallery' bucket (public=true) with authenticated write policies on storage.objects.
- Migrations have been applied to live Supabase (confirmed: SELECT returns data on opening_hours, gallery_images, menu_items).

## Live Database State

- opening_hours: SELECT ✅ | UPSERT (anon) ⚠️ silent fail (RLS)
- gallery_images: SELECT ✅ | INSERT (anon) ❌ "new row violates row-level security policy"
- gallery bucket: EXISTS ✅ (confirmed via service role key)

## Setup Wizard (admin/page.tsx checkConfiguration)

Uses browser client (anon key) to:
1. Query menu_items — succeeds ✅
2. listBuckets() — returns empty for anon key → galleryBucket = undefined → setIsConfigured(false)

This is a FALSE NEGATIVE. The bucket exists but anon key can't list buckets. The "Configuration Required" banner is shown incorrectly.

## Setup Wizard API Route (/api/admin/setup)

Uses SERVICE_ROLE_KEY. The RLS error when clicking "Run Setup Wizard" likely comes from the setup route trying to INSERT seed data using the wrong client, OR from the fact that admin/page.tsx itself (not the API) triggers something with anon key.
⚠️ The Planner should READ `/src/app/api/admin/setup/route.ts` to confirm the exact cause.

## Opening Hours Save Flow

`src/app/admin/hours/page.tsx`: calls `supabase.from("opening_hours").upsert(hours)` with browser client. After login this will work (auth.role() = 'authenticated'). No code change needed IF user is logged in.

## Gallery Upload Flow

`src/app/admin/gallery/page.tsx`: uploads to 'gallery' bucket, inserts into gallery_images. After login this will work. Session fix from run RUN_20260414-212623 is already applied.

## Root Cause Summary

1. **"Configuration Required" banner**: False negative — `listBuckets()` with anon key returns empty even though bucket exists. Fix: use a server endpoint with service role key for the bucket check, OR just check if the menu_items query succeeded and skip the bucket check.
2. **"new row violates row-level security policy" (setup wizard)**: Need to read setup/route.ts to confirm exact cause.
3. **Gallery/hours not persisting**: User was not logged in (no admin user existed). Now that user exists, logging in should fix this — no code changes needed for the data writes themselves.

## Key Files for Planner

MUST read:
- `src/app/api/admin/setup/route.ts` — exact cause of RLS error when setup wizard runs
- `src/app/admin/page.tsx` lines 25-54 — checkConfiguration function (the false-negative bucket check)

Likely need to modify:
- `src/app/admin/page.tsx` — fix checkConfiguration to not use listBuckets() with anon key

May already be fixed by login:
- `src/app/admin/hours/page.tsx` — no change needed if user logs in
- `src/app/admin/gallery/page.tsx` — no change needed if user logs in (session fix already applied)
