---
artifact_type: "VERIFIER_BRIEF"
role: "EXECUTOR"
for_role: "VERIFIER"
run_id: "RUN_20260415-173300"
attempt: 1
created_at: "2026-04-15T17:40:00Z"
---

# NenFlow v3 — Verifier Brief

## What Was Done

The `15-apr` branch was committed, merged into `main`, and pushed to GitHub. A new working branch `16-apr` was created and pushed.

---

## Success Criteria to Verify

Run these commands independently to verify — do NOT rely on the Executor's narrative.

### 1. `15-apr` branch still exists

```bash
git branch
```

Expected: `15-apr` appears in the list.

### 2. `16-apr` branch exists and points to same commit as `15-apr`

```bash
git rev-parse 15-apr
git rev-parse 16-apr
```

Expected: Both SHAs are identical (both point to the post-Step-1 commit).

### 3. `main` includes all `15-apr` commits

```bash
git log main --oneline | head -10
git log 15-apr --oneline | head -5
```

Expected: All commits reachable from `15-apr` are also reachable from `main`. The merge commit `Merge branch '15-apr' into main` should be the HEAD of `main`.

### 4. `origin/main` is updated on GitHub

```bash
git log origin/main --oneline -3
```

Expected: Shows the merge commit as the most recent commit on `origin/main`.

### 5. No scratch images or playwright logs committed

```bash
git show --name-only HEAD | grep -E "(railway-|github-apps|github-confirm|playwright-mcp)"
```

Expected: No output (none of these files appear in the merge commit).

### 6. Source files are in the commit

```bash
git log --oneline --diff-filter=M --name-only | head -20
```

Or inspect the commit directly:

```bash
git show <step-1-commit-sha> --name-only | grep -E "(page\.tsx|visit|MenuHighlights)"
```

Expected: `src/app/(public)/page.tsx`, `src/app/(public)/visit/page.tsx`, `src/components/sections/MenuHighlights.tsx` appear as modified.

### 7. Screenshot deletions committed

```bash
git show <step-1-commit-sha> --name-only | grep "tests/screenshots"
```

Expected: Multiple `tests/screenshots/` paths appear as deleted.

### 8. `origin/16-apr` exists on GitHub

```bash
git ls-remote origin 16-apr
```

Expected: Returns a SHA and `refs/heads/16-apr`.

---

## Railway Deployment Instructions (Manual — CLI not installed)

Since the `railway` CLI is not installed on this machine, deployment must be triggered via Railway's GitHub integration.

### Option A — Automatic (if GitHub auto-deploy is configured)

If the Railway project is connected to `github.com/doner21/ramen-don` and configured to deploy from `main`, pushing to `main` in Step 4 will have automatically triggered a deployment.

To verify:
1. Go to: https://railway.app/dashboard
2. Open the `ramen-don` project
3. Check the "Deployments" tab — a new deployment from the latest `main` commit should show status "Success" or "Building"

### Option B — Manual trigger

If auto-deploy is not configured or the deployment did not trigger automatically:
1. Go to: https://railway.app/dashboard
2. Open the `ramen-don` project
3. Click the service (likely named `ramen-don` or `web`)
4. Click the "Deploy" button or go to "Settings" > "Deploy" and click "Trigger Deploy"
5. Select branch: `main`
6. Confirm and wait for build to complete

### Option C — Install Railway CLI for future runs

```bash
npm install -g @railway/cli
railway login
railway up
```

---

## Files to Inspect (Key Evidence)

- `src/app/(public)/page.tsx` — wires `ctaSection` and `signatureSection` from DB
- `src/app/(public)/visit/page.tsx` — adds optional `venue.tagline` display
- `src/components/sections/MenuHighlights.tsx` — accepts optional `HomepageSection` prop

---

## PASS Criteria Summary

| Check | Command | Expected |
|-------|---------|----------|
| `15-apr` exists | `git branch` | shows `15-apr` |
| `16-apr` == `15-apr` SHA | `git rev-parse 15-apr && git rev-parse 16-apr` | SHAs match |
| `main` has merge commit | `git log main --oneline -1` | "Merge branch '15-apr' into main" |
| `origin/main` updated | `git log origin/main --oneline -3` | merge commit at top |
| `origin/16-apr` exists | `git ls-remote origin 16-apr` | returns SHA |
| No scratch files in commit | `git show HEAD \| grep railway` | no output |
| Source files committed | `git show <sha> --name-only` | 3 source files present |
| Screenshots deleted | `git show <sha> --name-only` | `tests/screenshots/` entries |
