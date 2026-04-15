---
artifact_type: VERIFIER_BRIEF
run_id: RUN_20260414-212623
role: executor → verifier handoff
task: Fix "Error saving item: your session has expired" bug in admin panel
---

# Verifier Brief — Admin Session Expiry Bug Fix

## What Was Changed and Why

The admin panel browser client (`src/lib/supabase.ts`) was caching a single Supabase instance at module scope. When the Next.js middleware rotated the auth tokens (updating browser cookies), the singleton retained the old in-memory refresh token and continued using it, causing auth failures on save operations. Additionally, three explicit "diagnostic" guard blocks directly threw a user-facing "Your session has expired" error whenever `getUser()`/`getSession()` returned null — which can happen transiently even during a valid refresh cycle.

Changes:
1. **`src/lib/supabase.ts`** — Removed the singleton. `createSupabaseBrowserClient()` now creates a fresh instance on each call. All instances share `document.cookie`, so they always see the current rotated token.
2. **`src/lib/auth-errors.ts`** — New helper that inspects thrown errors and returns `true` if they are auth-related (HTTP 401, `AuthSessionMissingError`, message fragments like "jwt expired").
3. **`src/app/admin/gallery/page.tsx`** — Removed the guard block inside `handleUpload` that called `supabase.auth.getUser()` and threw if `!user`. Updated the `catch` block to redirect to `/admin/login` on genuine auth errors.
4. **`src/app/admin/menu/page.tsx`** — Removed two guard blocks: one in `ItemModal.handleSubmit` (used `getUser()`) and one in `CategoryModal.handleSubmit` (used `getSession()`). Updated both `catch` blocks to redirect on genuine auth errors.
5. **`src/components/admin/AdminAuthWatcher.tsx`** — New client component that subscribes to `supabase.auth.onAuthStateChange`. Redirects to `/admin/login` when the event is `SIGNED_OUT`.
6. **`src/app/admin/layout.tsx`** — Added `<AdminAuthWatcher />` to the layout so it is always mounted in every admin page.

## Static Checks the Verifier Must Run

Run each of these and check the expected result:

### 1. Confirm singleton is gone from supabase.ts
```bash
grep -n "let supabaseBrowserClient\|if (supabaseBrowserClient)" src/lib/supabase.ts
```
**Expected: no output (0 matches).** Any match is a FAIL.

### 2. Confirm guard throw is gone from all three pages
```bash
grep -rn "throw new Error(\"Your session has expired" src/
```
**Expected: no output (0 matches).** Any match is a FAIL.

### 3. Confirm auth-errors.ts exists and exports isAuthError
```bash
test -f src/lib/auth-errors.ts && grep -n "export function isAuthError" src/lib/auth-errors.ts
```
**Expected: line number with `export function isAuthError(err: unknown): boolean`.** No output = FAIL.

### 4. Confirm AdminAuthWatcher.tsx exists with correct shape
```bash
test -f src/components/admin/AdminAuthWatcher.tsx && head -3 src/components/admin/AdminAuthWatcher.tsx
```
**Expected: first line is `"use client";`.**

```bash
grep -n "onAuthStateChange\|SIGNED_OUT\|unsubscribe" src/components/admin/AdminAuthWatcher.tsx
```
**Expected: all three strings present.** Missing any = FAIL.

### 5. Confirm layout.tsx imports and renders AdminAuthWatcher
```bash
grep -n "AdminAuthWatcher" src/app/admin/layout.tsx
```
**Expected: two matches — the import line and the JSX `<AdminAuthWatcher />`.** Fewer = FAIL.

### 6. Confirm isAuthError is imported in both modified pages
```bash
grep -n "isAuthError" src/app/admin/gallery/page.tsx src/app/admin/menu/page.tsx
```
**Expected: at minimum one import line and one usage in each file.**

### 7. Confirm middleware.ts content integrity
```bash
git diff middleware.ts
```
**Expected: The diff shown here is a PRE-EXISTING modification from the initial commit, not from this execution.** The executor did not touch `middleware.ts`. Verifier should confirm the diff content matches what was already present in the repo BEFORE this task (the diff shows a migration from a cookie-check approach to `@supabase/ssr createServerClient` — this predates this task).

To be precise: run `git stash` to confirm middleware.ts restores to the initial commit version, then `git stash pop`. Or simply inspect the diff and confirm it does not contain any of the changes described in this task (no changes to `isAuthError`, no changes to gallery/menu pages in the middleware diff).

### 8. Confirm no non-admin callers of createSupabaseBrowserClient
```bash
grep -r "createSupabaseBrowserClient(" src/ --include="*.ts" --include="*.tsx" -l
```
**Expected: all listed files are under `src/app/admin/`, `src/components/admin/`, or `src/lib/`.** Any file under `src/app/(public)/` or other non-admin path = flag as risk (do not fail automatically, but investigate).

## Build Check

```bash
cd /path/to/ramen-don && npm run build
```
**Expected: build completes with `✓ Compiled successfully` and `✓ Generating static pages` with no TypeScript errors. Any error is an automatic FAIL.**

## Behavioral Test Instructions (from Plan Section F3)

### Preferred test (fast, simulates token rotation):

1. Start dev server: `npm run dev`
2. Log in at `/admin/login`
3. Open DevTools → Application → Cookies
4. Delete only the access-token cookie (the `sb-<project>-auth-token` cookie or the one containing the JWT — do NOT delete the refresh token cookie)
5. Navigate to `/admin/menu`, edit any item, click Save
6. **Expected: Save succeeds. No "Your session has expired" alert. Item is updated.**
7. Repeat for `/admin/gallery` (upload an image) and `/admin/hours` (Save All Changes)

### Genuine-expiry test (confirms redirect on real auth failure):

1. Log in. Open a second tab also on `/admin`
2. In tab 2 DevTools console, run:
   ```js
   document.cookie.split(';').forEach(c => { const n = c.split('=')[0].trim(); if (n.startsWith('sb-')) document.cookie = n + '=; Max-Age=0; path=/'; });
   ```
3. In tab 1, click Save on a menu item
4. **Expected: User is redirected to `/admin/login` — either via `AdminAuthWatcher` (fires `SIGNED_OUT`) or via the `isAuthError` catch branch. No cryptic error alert persisting on screen.**

### What NOT to accept as evidence (per Plan Section F4):
- Saving immediately after a fresh login — the bug requires token rotation (1+ hour or manual cookie deletion)
- A passing build alone — proves compilation only
- A screenshot of the UI looking normal — the bug is invisible until save after rotation

## Files That Should Appear in git diff

The Verifier must run `git diff --name-only` and confirm this exact set of files is modified (relative to the last commit):

**Modified (tracked files):**
- `src/lib/supabase.ts`
- `src/app/admin/gallery/page.tsx`
- `src/app/admin/menu/page.tsx`
- `src/app/admin/layout.tsx`

**Created (untracked):**
- `src/lib/auth-errors.ts`
- `src/components/admin/AdminAuthWatcher.tsx`

**Note on pre-existing modifications:** `git diff --name-only` will also show other files that had pre-existing uncommitted changes BEFORE this task started. These include: `middleware.ts`, `src/lib/supabase-server.ts`, `src/app/admin/homepage/page.tsx`, `src/app/admin/hours/page.tsx`, `src/app/admin/venue/page.tsx`, `src/app/admin/page.tsx`, `src/app/layout.tsx`, `src/components/opentable/OpenTableWidget.tsx`. These are NOT scope violations — they were already modified before this execution. The executor did not touch them.

## Files That Must NOT Appear in This Task's Diff

If any of these files were *newly* modified by this executor (check git blame or compare content to initial commit), it is a FAIL:
- `middleware.ts` (pre-existing change is OK; new changes from this task are NOT OK)
- `src/lib/supabase-server.ts` (same caveat)
- `.env.local`
- `src/app/(public)/*` — any file under this path
- `src/app/admin/hours/page.tsx`
- `src/app/admin/venue/page.tsx`
- `src/app/admin/homepage/page.tsx`

## Known Risks and Caveats

1. **`middleware.ts` and `supabase-server.ts` have pre-existing uncommitted changes.** These are not from this task. The executor confirmed by reading both files and comparing to the plan's "must not modify" list. The diffs show a migration from cookie-check to `createServerClient` in middleware, and `httpOnly: false` in server client — both predating this task.

2. **`isAuthError` false-negative risk.** If Supabase returns an auth failure under a message format not in the helper's list, the user sees the raw error message instead of a redirect. This is no worse than pre-fix behavior. The helper covers: status 401, `AuthSessionMissingError`, `AuthApiError` (401/403), "jwt expired", "invalid jwt", "invalid refresh token", "refresh token not found", "not authenticated".

3. **`onAuthStateChange` fires `INITIAL_SESSION` on mount.** The `AdminAuthWatcher` only acts on `SIGNED_OUT`, so this initial event causes no redirect. Confirmed by reading the code.

4. **Storage upload.** The gallery upload uses `supabase.storage.from('gallery').upload(...)`. With a fresh browser client per call, the storage client inherits auth from the same `document.cookie` store. This should work correctly. The behavioral test should include a gallery upload to confirm.

5. **Per-render client instantiation cost.** Several admin pages call `createSupabaseBrowserClient()` at the component top level (called once per render, not per event). This is fine — the cost is trivial compared to network I/O and the instances share cookie storage.

## Observed Results (Local)

- `npx tsc --noEmit` after Step 1: empty output (no errors)
- `npm run build`: PASS — `✓ Compiled successfully in 1769ms`, `✓ Generating static pages (25/25) in 474ms`, no TypeScript errors
- Grep for throw string: 0 matches
- Grep for singleton variable: 0 matches
- All callers of `createSupabaseBrowserClient` are in admin scope — no non-admin usage detected
