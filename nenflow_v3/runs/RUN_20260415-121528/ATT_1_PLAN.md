---
artifact_type: "PLAN"
role: "PLANNER"
run_id: "RUN_20260415-121528"
attempt: 1
task_summary: "Commit all changes, merge to main, push to GitHub, create ramen-don_dev branch, confirm Railway readiness for ramendon.uk"
---

# PLAN — RUN_20260415-121528

## Task Statement
Commit all current changes on `ramen-don_alpha`, merge into `main`, push `main` to
GitHub (origin: https://github.com/doner21/ramen-don.git), create a new local
working branch `ramen-don_dev`, confirm `next.config.ts` is production-correct for
ramendon.uk, and document Railway environment variable requirements. Railway
deployment itself is manual via the dashboard.

---

## Hard Constraints (Invariants)

1. No work must be lost — every file shown in `git status` must be staged and committed before any branch operation.
2. Force-push to `main` is only permitted if `main` on remote has no divergent history — Executor must confirm with `git ls-remote` first.
3. `.env*` files are git-ignored — no secrets will be committed. Executor must verify with `git show HEAD --name-only` after commit.
4. The new working branch (`ramen-don_dev`) must be cut AFTER the commit on `ramen-don_alpha`.
5. `next.config.ts` must NOT be broken — any check must confirm existing `remotePatterns` for `*.supabase.co` is intact.

---

## Findings

### Branches
- Local: `master`, `ramen-don_alpha` (current)
- Remote: `origin/ramen-don_alpha`
- No remote `main` exists on origin yet.
- Both `master` and `ramen-don_alpha` point to the same commit: `cb33e90`.

### next.config.ts
Production-correct as-is. The domain `ramendon.uk` does NOT require any entry in `remotePatterns` — that config only controls external image sources. No changes needed.

### Railway Readiness
- No `railway.json` or `nixpacks.toml` needed — Railway's Nixpacks auto-detects Next.js via `package.json` scripts (`next build` / `next start`).
- `PORT` env var is auto-injected by Railway; Next.js respects it automatically.

---

## Step-by-Step Implementation

### Step 1 — Stage and Commit All Changes on `ramen-don_alpha`
```bash
git add --all
git commit -m "feat: production-ready build — admin panel, gallery, auth, API routes, and test suite

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```
Verify: `git status` shows clean working tree.

### Step 2 — Push `ramen-don_alpha` to Origin
```bash
git push origin ramen-don_alpha
```

### Step 3 — Create/Update `main` Branch and Push to GitHub
**3a.** Check if remote `main` exists:
```bash
git ls-remote --heads origin main
```

**3b.** Create local `main` from `ramen-don_alpha`:
```bash
git checkout -b main
# (or if main already exists locally: git checkout main && git reset --hard ramen-don_alpha)
```

**3c.** Push `main` to origin:
```bash
git push -u origin main
# If remote main already exists with divergent history:
git push --force-with-lease origin main
```

### Step 4 — Create New Working Branch `ramen-don_dev`
```bash
git checkout ramen-don_alpha
git checkout -b ramen-don_dev
```

### Step 5 — Confirm `next.config.ts` (No Edits)
Executor reads the file and confirms `*.supabase.co` remotePattern is intact. Documents in Execution Report.

### Step 6 — Document Railway Setup in Execution Report
Include the following manual steps for the user:
1. Railway dashboard → New Project → Deploy from GitHub → select `doner21/ramen-don`, branch: `main`
2. Variables tab → add: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
3. Settings → Networking → Custom Domains → add `ramendon.uk`
4. Railway auto-detects Next.js, runs `npm run build` then `npm run start`

---

## Files Modified by Executor
- **None** — `next.config.ts` requires no changes. All work is git operations.

---

## Success Criteria (for Verifier)

1. `git log --oneline ramen-don_alpha` shows at least 2 commits.
2. `git status` on `ramen-don_alpha` shows a clean working tree.
3. `git log --oneline main` HEAD matches `ramen-don_alpha` HEAD (same commit hash).
4. `git ls-remote --heads origin main` returns the same HEAD commit hash as local `main`.
5. `git branch` shows `ramen-don_dev` exists locally.
6. `ramen-don_dev` HEAD equals `main` HEAD.
7. `next.config.ts` contains `*.supabase.co` in `remotePatterns`, no `.env` file in commit.
8. Execution Report documents the three Railway env vars and custom domain step.

---

## Risk Notes
- Local default branch is `master`, not `main` — Executor must explicitly create `main`.
- `nenflow_v3/` run artifacts will be committed — acceptable, user can gitignore later.
- `force-with-lease` preferred over bare `--force` if remote main already exists.
