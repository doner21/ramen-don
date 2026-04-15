---
artifact_type: ORCH_CONTINUATION
run_id: RUN_20260414-221902
recommended_next_move: PLAN
---

# Orchestrator Continuation Contract

## Why Handoff

Orchestrator context at 61% WARNING after completing INTAKE + Research for run RUN_20260414-221902. Spawning Planner+Executor+Verifier would push into HARD_RISK. Handing off to fresh subagent per Route F Mode 2.

## Current Run State

- run_id: RUN_20260414-221902
- Route: B (Research-First)
- INTAKE: COMPLETE → ATT_0_INTAKE.md
- Research: COMPLETE → ATT_1_RESEARCH.md
- Plan: NOT STARTED
- Execution: NOT STARTED
- Verification: NOT STARTED

## What the Fresh Orchestrator Must Do

1. Read ATT_1_RESEARCH.md
2. Spawn Planner (Route B step 2): input = research + task below
3. Validate Plan
4. Spawn Executor
5. Spawn Verifier
6. Return PASS or FAIL to user

## Task (for Planner context)

Fix 3 issues in ramen-don admin (Next.js + Supabase, project root: C:/Users/doner/ramen-don):

**Issue 1: False "Configuration Required" banner on admin dashboard**
- `src/app/admin/page.tsx` `checkConfiguration()` calls `supabase.storage.listBuckets()` with anon key
- `listBuckets()` returns empty for anon users → `galleryBucket = undefined` → `setIsConfigured(false)`
- Fix: Remove the bucket check from `checkConfiguration`, OR use a server endpoint. The bucket exists — just skip or fix the detection.

**Issue 2: "new row violates row-level security policy" from setup wizard**
- User clicks "Run Setup Wizard" → calls POST /api/admin/setup
- Planner MUST read `src/app/api/admin/setup/route.ts` to find the exact cause
- Likely the setup route is trying to INSERT seed data using anon key or is inserting when it should upsert

**Issue 3: Opening hours and gallery not persisting**
- Root cause was no admin user existed → writes always failed RLS
- Admin user NOW EXISTS: donald@karaokebox.co.uk
- The session fix (run RUN_20260414-212623) is already applied
- After user logs in, writes should work — verify this before adding code changes
- If writes still fail after login, the Planner must investigate why

## Critical Context

- Supabase project ref: usponfmwsloozdccugmb
- ANON key and SERVICE_ROLE_KEY are in .env.local (do not log them)
- All 7 tables exist and have RLS with write policy: `auth.role() = 'authenticated'`
- Gallery bucket 'gallery' exists and is public
- The session fix from RUN_20260414-212623 touched: src/lib/supabase.ts, src/lib/auth-errors.ts, src/app/admin/gallery/page.tsx, src/app/admin/menu/page.tsx, src/app/admin/layout.tsx, src/components/admin/AdminAuthWatcher.tsx

## Invariants

- Do NOT change middleware.ts
- Do NOT change RLS policies in Supabase (they are correctly designed)
- Do NOT break the session fix from RUN_20260414-212623
- Do NOT expose SERVICE_ROLE_KEY to the browser

## Artifacts Location

C:/Users/doner/ramen-don/nenflow_v3/runs/RUN_20260414-221902/
