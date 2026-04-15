---
artifact_type: PLAN
run_id: RUN_20260414-212623
role: planner
task: Fix "Error saving item: your session has expired" bug in admin panel
---

# Plan — Admin Session Expiry Bug Fix

## A. Task Objective

An authenticated admin user can save menu items, categories, opening hours, venue details, homepage sections, and upload gallery images **without encountering "Your session has expired. Please log in again."** — including after the in-memory access token has expired (1+ hour of tab lifetime) and the middleware has rotated refresh tokens. When the session truly becomes invalid (e.g. user signs out in another tab, or refresh token is genuinely revoked), the user is cleanly redirected to `/admin/login` rather than shown a cryptic modal error.

## B. Invariants (non-negotiable)

1. **No regression in normal auth flow.** Logging in at `/admin/login`, navigating admin pages, and fetching data (existing `fetchData`/`fetchImages`/`fetchHours`/`fetchVenue`/`fetchSections` reads) must continue to work.
   - *Why*: These flows are currently functional. Breaking them would create a worse bug than the one being fixed.

2. **Middleware behavior is unchanged.** Do not edit `middleware.ts`. Refresh-token rotation on the server side must continue to happen. Cookies remain `httpOnly: false` so the browser client can read them via `document.cookie`.
   - *Why*: Middleware is functionally correct per research; the bug is on the browser side.

3. **Server-side Supabase usage is untouched.** `src/lib/supabase-server.ts` and any server components / route handlers that use the server client remain as-is.
   - *Why*: Not implicated in the bug.

4. **Public (non-admin) routes are untouched.** No changes to `src/app/(public)/*` or any route outside `src/app/admin/*` and `src/lib/supabase.ts`.
   - *Why*: Bug is scoped to admin browser client; touching public code is scope creep.

5. **No new dependencies.** Fix uses only `@supabase/ssr` (already installed) and React primitives.
   - *Why*: A one-bug fix should not pull in infrastructure.

6. **Genuine session expiry still redirects to login.** If the refresh token is truly invalid (not just a stale in-memory copy), the user is sent to `/admin/login`. The bug fix must not silently swallow real auth failures.
   - *Why*: Security & UX — users must be signed out when auth genuinely fails.

## C. Constraints (ranked by severity)

### Critical
- **C1. The browser client must read the current cookie state at call time.** Any fix that keeps a stale in-memory refresh token defeats the purpose. Violation looks like: recreating the singleton but caching tokens in a closure, or using a custom storage adapter that reads once.
- **C2. The three explicit session-guard blocks that throw the exact string `"Your session has expired. Please log in again."` must be removed.** Violation looks like: leaving any `if (!user) throw new Error("Your session has expired...")` in the three documented locations. Those guards are the direct source of the user-facing error.

### Important
- **C3. Auth errors from real Supabase operations must still be surfaced usefully.** After removing the pre-checks, actual auth failures (e.g. Supabase returning 401 on an `insert`) must produce a clear message and trigger redirect to login, not a silent no-op.
- **C4. The fix for `supabase.ts` must not break code that destructures or stores the client.** Existing callers do `const supabase = createSupabaseBrowserClient()` once at component top and reuse `supabase` through the render. Each call returning a fresh instance is fine because instances share cookie storage (per research), but the function signature and return shape must stay identical.

### Stylistic / guidance
- **C5. Minimize edits.** Do not refactor component internals, restyle UI, or touch unrelated logic.
- **C6. Keep the existing `alert(...)` / `setError(...)` error-display patterns.** Do not introduce a toast library or new UI primitives.

## D. Relevant System Surfaces

### Must modify
- `src/lib/supabase.ts` — remove module-level singleton. (15 lines currently; will become ~10.)
- `src/app/admin/gallery/page.tsx` — remove guard block at lines 56-63 inside `handleUpload`; add auth-error handling in the `catch` block (current catch at ~line 99-103).
- `src/app/admin/menu/page.tsx` — remove guard block at lines 347-354 inside `ItemModal.handleSubmit`; remove guard block at lines 547-551 inside `CategoryModal.handleSubmit`; add auth-error handling in both `catch` blocks.
- `src/app/admin/layout.tsx` — convert from a simple server wrapper to include a small client-side auth watcher that listens for `SIGNED_OUT` / invalid session and routes to `/admin/login`.

### Must verify during execution (not modify unless needed)
- `src/app/admin/hours/page.tsx` — confirmed: no explicit `getUser()`/`getSession()` guard. Uses `supabase.from("opening_hours").upsert(hours)` directly. **No guard-removal needed.** Benefits automatically from the singleton fix.
- `src/app/admin/venue/page.tsx` — confirmed: no explicit guard. Uses `supabase.from("venue_details").update(...)` directly. **No guard-removal needed.** Benefits automatically from the singleton fix.
- `src/app/admin/homepage/page.tsx` — confirmed: no explicit guard. Uses `supabase.from("homepage_sections").upsert(sections)` directly. **No guard-removal needed.** Benefits automatically from the singleton fix.

### Must NOT modify
- `middleware.ts`
- `src/lib/supabase-server.ts`
- `.env.local`
- Any file under `src/app/(public)/` or public-facing routes.
- Any file not listed above.

## E. Implementation Strategy (ordered)

### Step 1 — Remove the browser-client singleton (root cause fix)

Edit `src/lib/supabase.ts`.

**Remove** (entire current file body):
```ts
import { createBrowserClient } from "@supabase/ssr";

let supabaseBrowserClient: ReturnType<typeof createBrowserClient> | undefined;

export function createSupabaseBrowserClient() {
  if (supabaseBrowserClient) return supabaseBrowserClient;

  supabaseBrowserClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return supabaseBrowserClient;
}
```

**Replace with**:
```ts
import { createBrowserClient } from "@supabase/ssr";

// Intentionally NOT cached at module level. Each call returns a fresh
// browser client that reads the current auth cookies at invocation time.
// Multiple instances share the same cookie storage (document.cookie), so
// this is safe and avoids the "stale in-memory refresh token" bug that
// occurs when middleware rotates tokens but the singleton keeps the old RT.
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

*Rationale — why first*: This alone eliminates the rotation conflict and is sufficient to fix the bug for hours/venue/homepage pages (which have no explicit guard). Without this, later steps won't help.

### Step 2 — Remove the three explicit guard blocks

These blocks throw the exact user-facing error string and remain incorrect even after Step 1 because a brand-new browser client that just started refreshing can transiently return `null` from `getUser()` while the refresh is in flight.

#### 2a. `src/app/admin/gallery/page.tsx` — inside `handleUpload` (currently lines 56-63)

**Remove**:
```ts
      // Diagnostic check: check session
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError && authError.name !== "AuthSessionMissingError") {
        console.error("Auth error details:", authError);
      }
      if (!user) {
        throw new Error("Your session has expired. Please log in again.");
      }

```
(Remove the blank line that follows the block as well, so the `const fileExt = ...` line remains cleanly inside the `try`.)

**Update the `catch` block** in `handleUpload` (currently at lines 99-103) from:
```ts
    } catch (err: any) {
      console.error("Error uploading image:", err);
      setError(err.message);
    } finally {
```
to:
```ts
    } catch (err: any) {
      console.error("Error uploading image:", err);
      if (isAuthError(err)) {
        setError("Your session has expired. Redirecting to login...");
        setTimeout(() => { window.location.href = "/admin/login"; }, 1200);
      } else {
        setError(err.message);
      }
    } finally {
```

At the top of the file (after the existing imports), add:
```ts
import { isAuthError } from "@/lib/auth-errors";
```

#### 2b. `src/app/admin/menu/page.tsx` — inside `ItemModal.handleSubmit` (currently lines 347-354)

**Remove**:
```ts
      // Diagnostic check: check session
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError && authError.name !== "AuthSessionMissingError") {
        console.error("Auth error details:", authError);
      }
      if (!user) {
        throw new Error("Your session has expired. Please log in again.");
      }

```

**Update the `catch` block** in `ItemModal.handleSubmit` (currently at ~lines 382-385) from:
```ts
    } catch (err: any) {
      console.error("Error saving menu item:", err);
      alert("Error saving item: " + (err.message || "Unknown error"));
    } finally {
```
to:
```ts
    } catch (err: any) {
      console.error("Error saving menu item:", err);
      if (isAuthError(err)) {
        alert("Your session has expired. Redirecting to login...");
        window.location.href = "/admin/login";
        return;
      }
      alert("Error saving item: " + (err.message || "Unknown error"));
    } finally {
```

#### 2c. `src/app/admin/menu/page.tsx` — inside `CategoryModal.handleSubmit` (currently lines 547-551)

**Remove**:
```ts
      // Diagnostic check: check session
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error("Your session has expired. Please log in again.");
      }

```

**Update the `catch` block** in `CategoryModal.handleSubmit` (currently at ~lines 576-579) from:
```ts
    } catch (err: any) {
      console.error("Error saving category:", err);
      alert("Error saving category: " + (err.message || "Unknown error"));
    } finally {
```
to:
```ts
    } catch (err: any) {
      console.error("Error saving category:", err);
      if (isAuthError(err)) {
        alert("Your session has expired. Redirecting to login...");
        window.location.href = "/admin/login";
        return;
      }
      alert("Error saving category: " + (err.message || "Unknown error"));
    } finally {
```

At the top of `src/app/admin/menu/page.tsx` (after the existing imports), add:
```ts
import { isAuthError } from "@/lib/auth-errors";
```

*Rationale — why after Step 1*: With the singleton removed, the vast majority of save operations will succeed and never hit these catch blocks. The `isAuthError` branch only fires if a real auth failure occurs (Supabase returns 401/403 due to RLS or genuinely invalid refresh token), which is the correct behavior we want to preserve.

### Step 3 — Create the shared auth-error helper

Create a new file `src/lib/auth-errors.ts`:

```ts
// Detects whether an error thrown by a Supabase client call is auth-related
// (expired/invalid session, missing JWT). Used by admin pages to trigger a
// clean redirect to /admin/login instead of showing a cryptic database error.
export function isAuthError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const e = err as { status?: number; code?: string; message?: string; name?: string };

  // HTTP 401 from PostgREST / Storage
  if (e.status === 401) return true;

  // Supabase auth error codes / names
  if (e.name === "AuthSessionMissingError") return true;
  if (e.name === "AuthApiError" && (e.status === 401 || e.status === 403)) return true;

  // Common message fragments returned by supabase-js / gotrue
  const msg = (e.message || "").toLowerCase();
  if (msg.includes("jwt expired")) return true;
  if (msg.includes("invalid jwt")) return true;
  if (msg.includes("invalid refresh token")) return true;
  if (msg.includes("refresh token not found")) return true;
  if (msg.includes("not authenticated")) return true;

  return false;
}
```

*Rationale*: Encapsulates the "is this an auth problem?" decision in one place. Keeps the page-level catch blocks short and makes future adjustments trivial.

### Step 4 — Add an auth watcher to the admin layout

Currently `src/app/admin/layout.tsx` is a pure server component wrapper. We need a client component that subscribes to `supabase.auth.onAuthStateChange` and redirects on `SIGNED_OUT`. Keep the layout itself a server component for now and introduce a small client child.

Create a new file `src/components/admin/AdminAuthWatcher.tsx`:

```tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase";

export default function AdminAuthWatcher() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        router.replace("/admin/login");
      }
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

  return null;
}
```

Edit `src/app/admin/layout.tsx`:

**Replace entire file contents** with:
```tsx
import AdminNav from "@/components/admin/AdminNav";
import AdminAuthWatcher from "@/components/admin/AdminAuthWatcher";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#1A1714]">
      <AdminAuthWatcher />
      <AdminNav />
      <main className="flex-1 p-8 pt-[88px] lg:pt-8 overflow-auto">{children}</main>
    </div>
  );
}
```

*Rationale — why last*: This is a defense-in-depth measure for genuine session termination. It is not required to fix the main bug (Steps 1 and 2 do that), but it prevents the fallback error paths in Step 2 from being reached at all in the common case of "user signed out in another tab" or "token actually revoked server-side," because Supabase will fire `SIGNED_OUT` and we redirect before the user clicks Save.

## F. Verification Strategy

The Verifier must distinguish between **static evidence** (code has the right shape) and **behavioral evidence** (the bug is actually gone). Both are required; neither alone is sufficient.

### F1. Static checks (necessary, not sufficient)

Verifier confirms via file reads / grep:

1. `src/lib/supabase.ts` contains **no** `let supabaseBrowserClient`, no `if (supabaseBrowserClient) return`, no module-level caching variable. The file exports a function that unconditionally calls `createBrowserClient`.
2. `src/app/admin/gallery/page.tsx` contains **no** occurrence of the string `"Your session has expired. Please log in again."` inside a `throw new Error(...)`. Same check for both handlers in `src/app/admin/menu/page.tsx`.
   - Grep pattern: `throw new Error\("Your session has expired`. Expected matches across the three files: **0**.
3. `src/lib/auth-errors.ts` exists and exports `isAuthError`.
4. `src/components/admin/AdminAuthWatcher.tsx` exists, uses `"use client"`, subscribes to `onAuthStateChange`, and unsubscribes on unmount.
5. `src/app/admin/layout.tsx` imports and renders `<AdminAuthWatcher />`.
6. `middleware.ts` is byte-identical to the pre-change version.

### F2. Build check

Run `npm run build` (or equivalent in this repo — check `package.json` scripts). Must complete without TypeScript or lint errors. A build failure is an automatic FAIL regardless of behavior.

### F3. Behavioral check (the real evidence)

The bug is a **time-dependent** condition: it only appears after the initial access token expires (~1 hour) and the middleware has rotated the session. Simulating this requires either (a) waiting an hour, or (b) manually clearing the access token cookie to force refresh.

**Preferred behavioral test (manual, fast):**
1. Start the dev server. Log in at `/admin/login`.
2. Open DevTools → Application → Cookies. Delete only the access-token cookie (the `sb-<project>-auth-token` cookie whose value contains the access JWT — the refresh token cookie must remain).
3. Navigate to `/admin/menu`. Edit any item. Click Save.
4. **Expected**: Save succeeds. No "Your session has expired" alert. The item is updated.
5. Repeat step 2-4 for `/admin/gallery` (upload an image) and `/admin/hours` (Save All Changes).

**Alternative behavioral test (genuine-expiry path):**
1. Log in. Open a second browser tab, also on `/admin`.
2. In tab 2, run in DevTools console: `document.cookie.split(';').forEach(c => { const n = c.split('=')[0].trim(); if (n.startsWith('sb-')) document.cookie = n + '=; Max-Age=0; path=/'; });` — then in tab 1, click Save on a menu item.
3. **Expected**: User is redirected to `/admin/login` (via either `AdminAuthWatcher` or the `isAuthError` catch branch). No cryptic error alert hangs on screen.

### F4. What NOT to accept as evidence

- **"I logged in and saved once, it worked"** — this is the baseline that was already working. The bug appears after token rotation, so a fresh-login save proves nothing.
- **"Tests pass"** — there are no existing tests for this flow. A green test suite is not evidence unless a new test specifically simulates token rotation.
- **"Grep shows the error string is gone"** — confirms Step 2 was done but says nothing about Step 1 or Step 4.
- **Screenshots of the admin UI looking normal** — the bug is invisible until a save is attempted after rotation.

## G. Risks and Edge Cases

1. **Risk: Breaking the Storage upload.** The gallery upload uses `supabase.storage.from('gallery').upload(...)`. With a fresh browser client per call, the storage client inherits its auth from the same cookie store — should work, but Verifier should explicitly test upload (not just DB writes).

2. **Risk: `onAuthStateChange` firing on initial mount.** `supabase-js` fires an `INITIAL_SESSION` event on subscribe. Our handler only acts on `SIGNED_OUT`, so this is fine — but if the Executor mistakenly checks for any falsy session or adds `TOKEN_REFRESHED` handling, it could cause redirect loops on page load.

3. **Risk: `createBrowserClient` being called at module scope elsewhere.** If any file (including any file not in the admin tree) imports `createSupabaseBrowserClient` and calls it at module top-level, changing the singleton to per-call is still safe, but instantiation cost multiplies. Executor should grep for `createSupabaseBrowserClient(` usage across `src/` and flag any non-admin usage as out-of-scope (do not modify, just note in the Execution Report).

4. **Risk: `useRouter` import for App Router.** `next/navigation` (not `next/router`) is the correct import for App Router client components. The Executor must use `next/navigation` — mixing the two breaks the build.

5. **Risk: `AGENTS.md` note about Next.js breaking changes.** The repo's `AGENTS.md` warns that "This is NOT the Next.js you know" and instructs checking `node_modules/next/dist/docs/`. Before writing the `AdminAuthWatcher` or layout edits, the Executor should verify:
   - that `useRouter` from `next/navigation` still works as documented, and
   - that client components in the `app/` directory are still declared via `"use client"`.
   If either has changed, follow the installed `next` docs, not training-data assumptions.

6. **Risk: `isAuthError` false-negative.** If Supabase returns an auth failure under a message format not listed, the user sees the raw error instead of a redirect. This is acceptable — it's no worse than the pre-fix behavior — but Verifier should spot-check by reading `isAuthError` and confirming it covers the documented cases (status 401, `AuthSessionMissingError`, `invalid refresh token`).

7. **Scope creep risk.** Executor must not "fix" the existing `console.log` debug lines in `ItemModal` / `CategoryModal`, not restyle UI, and not refactor the modal components. Those concerns are out of scope.

## H. Deliverables

The Executor produces exactly these file changes:

| Path | Action |
|------|--------|
| `src/lib/supabase.ts` | Modify — remove singleton |
| `src/lib/auth-errors.ts` | Create |
| `src/app/admin/gallery/page.tsx` | Modify — remove guard, add `isAuthError` import & catch branch |
| `src/app/admin/menu/page.tsx` | Modify — remove both guards, add `isAuthError` import & catch branches in both modals |
| `src/app/admin/layout.tsx` | Modify — add `<AdminAuthWatcher />` |
| `src/components/admin/AdminAuthWatcher.tsx` | Create |

**Must NOT appear in the diff:** `middleware.ts`, `.env.local`, `src/lib/supabase-server.ts`, any file under `src/app/admin/hours/`, `src/app/admin/venue/`, `src/app/admin/homepage/`, any public-route file.

## I. Handoff Instructions — Executor

1. **Read the AGENTS.md note first.** Before writing any Next.js-specific code (layout, client component, `useRouter`), check `node_modules/next/dist/docs/` for the current App Router / client-component conventions. Do not rely on training-data Next.js knowledge.

2. **Do Step 1 first in isolation.** After editing `src/lib/supabase.ts`, run the build (`npm run build` or `tsc --noEmit`). Confirm no regressions before proceeding. This catches type fallout from changing the return-type inference.

3. **Do Step 3 (create `src/lib/auth-errors.ts`) before Step 2**, because Step 2 imports it. Editing in the opposite order creates a broken intermediate state.

4. **Do not change the error message text in the catch branches** beyond what's specified. The exact phrasing matters for user-facing consistency.

5. **Do not add auth checks to hours/venue/homepage pages.** Research confirmed they have no such guards. Adding them now would reintroduce the bug under a different name.

6. **Grep check before finishing**: run a search for `createSupabaseBrowserClient(` across `src/` and confirm no caller relies on identity-equality of the returned client (e.g. `if (clientA === clientB)`). If any such reliance exists outside admin scope, stop and escalate — do not modify non-admin code.

7. **Do not amend the commit that contains only Step 1.** Create separate commits per logical step if the repo's convention allows, so a bisect can isolate regressions.

8. **Assumptions safe to make**:
   - Supabase anon key and URL env vars are correctly set (research confirmed).
   - Middleware is correct and does not need changes (research confirmed).
   - `@supabase/ssr` is installed and `createBrowserClient` exists (already imported).
   - `next/navigation` exports `useRouter` (standard App Router).

9. **When done**, produce an Execution Report listing:
   - All files modified/created (with line counts changed).
   - Output of `npm run build` (or equivalent).
   - Output of the grep check from item 6.
   - Confirmation that `middleware.ts`, `supabase-server.ts`, and `.env.local` were NOT modified.

## J. Handoff Instructions — Verifier

1. **Do not trust the Executor's narrative.** Open every modified file and read it. Confirm the exact removals and additions described in Section E are present.

2. **Run the static checks in F1 literally.** If `grep -r "throw new Error(\"Your session has expired" src/` returns any hit, that is an immediate FAIL. If `src/lib/supabase.ts` contains the word `let ` before `supabaseBrowserClient`, that is an immediate FAIL.

3. **Run the build (F2).** If the build fails, that is an immediate FAIL regardless of code inspection.

4. **Attempt the behavioral test in F3.** A PASS requires either (a) successful reproduction of the "delete access-token cookie, then save" flow resulting in a successful save, OR (b) a clear, documented reason the environment prevents the test, accompanied by strong static evidence that the singleton is gone and guards are removed.

5. **False-positive traps to avoid**:
   - A passing `npm run build` is not proof the bug is fixed — it only proves the code compiles.
   - Confirming the error string is gone from the source is not proof of a fix — the bug could now surface as a different error if the singleton is still present.
   - A successful save on a fresh login is not proof — the bug requires token rotation. If F3 cannot be performed, mark as "behavioral test not run" rather than PASS.

6. **Verify scope**: run `git diff --name-only` (or equivalent) and confirm the file list matches Section H exactly. Any file outside that list appearing in the diff is a FAIL for scope violation, even if the behavioral test passes.

7. **Verify `middleware.ts` untouched**: `git diff middleware.ts` must be empty. If not, FAIL.

8. **Report format**: return PASS or FAIL with:
   - Result of each F1 static check (pass/fail per item).
   - Build output summary.
   - Behavioral test outcome (or documented reason not run).
   - List of changed files from git diff.
   - Any deviation from Sections E or H.
