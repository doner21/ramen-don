---
artifact_type: "PLAN"
role: "PLANNER"
run_id: "RUN_20260415-173300"
created_at: "2026-04-15T17:33:00Z"
attempt: 1
---

# NenFlow v3 — PLAN

## Task Statement

Promote the `15-apr` branch to production:

1. Commit all uncommitted changes on `15-apr` (source files only — see below for scope).
2. Create branch `16-apr` from `15-apr` (before merging, so it tracks the same commit).
3. Merge `15-apr` into `main` (fast-forward is possible — see Handoff Notes).
4. Push `main` to `origin` (GitHub remote: `https://github.com/doner21/ramen-don.git`).
5. Deploy to Railway.app — CLI is NOT installed; provide manual deployment instructions.

---

## Pre-Investigation Findings

### Uncommitted Changes — What They Are

**Modified source files (meaningful work — MUST be committed):**
- `src/app/(public)/page.tsx` — wires `ctaSection` and `signatureSection` from DB to components
- `src/app/(public)/visit/page.tsx` — adds optional `venue.tagline` display
- `src/components/sections/MenuHighlights.tsx` — accepts optional `HomepageSection` prop, uses DB values with fallbacks

**Modified config file (tool artifact — MUST be committed or is fine to commit):**
- `.nenflow_context_health.json` — NenFlow tool artifact; safe to commit alongside the source changes

**Deleted files (test screenshots — MUST be staged as deletes):**
- `tests/screenshots/**` — all deleted screenshot files shown in `git status -D`; these are tracked files whose deletion must be committed

**Untracked files (do NOT commit these):**
- `.playwright-mcp/` directory — runtime tool logs and state files; not source code
- `nenflow_v3/runs/RUN_20260415-173300/` — current run's artifacts (will include this plan); commit these as part of this step or as a separate chore commit
- `github-apps.png`, `railway-*.png` — scratch screenshots from user's Railway/GitHub setup session; do NOT commit
- `railway-*.png` — same as above

**Decision: Two-commit approach:**
1. Commit source changes + screenshot deletions + nenflow artifacts as one commit (or split into two if cleaner).
2. Do NOT commit `.playwright-mcp/` logs or `railway-*.png` / `github-*.png` scratch images.

### Branch Topology

- `15-apr` HEAD: `56983c9` (fix: wire hero image assignment to landing page)
- `main` HEAD: `1588d42` (Merge branch 'apr-15' into main)
- Merge base: `56983c9` — **the merge base IS the tip of `15-apr`**

This means `main` is AHEAD of `15-apr` by 1 commit (the previous merge commit `1588d42`).
There is NOTHING on `15-apr` that is not already in `main` historically, BUT the current
uncommitted changes are what need to land on `main`.

**Correct sequence therefore:**
1. Commit changes on `15-apr`
2. Create `16-apr` from `15-apr`
3. Merge `15-apr` → `main` — this will create a merge commit (main has `1588d42` which is not reachable from `15-apr`'s current HEAD, so it is a true merge, not fast-forward)
4. Push main

### Railway CLI

`railway` is NOT installed. Manual deployment instructions must be provided.

### Remote

`origin` = `https://github.com/doner21/ramen-don.git`

---

## Invariants

1. The `15-apr` branch must NOT be deleted at any point.
2. No force-push to `main` — only a regular push.
3. The `.playwright-mcp/` directory and `railway-*.png` / `github-*.png` scratch images must NOT be committed.
4. The `nenflow_v3/` run artifacts SHOULD be committed (they are legitimate project files, not scratch).
5. `16-apr` must be created from `15-apr` BEFORE the merge (so it points to the pre-merge commit, giving a clean working base).
6. The merge into `main` must not discard any work — use `--no-ff` only if needed; do not `--squash`.

---

## Success Criteria

1. `git log main --oneline` shows all commits from `15-apr` reachable from `main`.
2. `git push origin main` exits 0 (no error).
3. `git branch` lists `16-apr` pointing at the same commit as `15-apr` (pre-merge).
4. `15-apr` branch still exists.
5. Railway deployment is triggered — either via CLI (if later installed) or via GitHub auto-deploy from main.

---

## Implementation Steps (for Executor)

### Step 1 — Stage and commit source changes + screenshot deletions

```bash
# Stage the 3 modified source files
git add src/app/\(public\)/page.tsx
git add src/app/\(public\)/visit/page.tsx
git add src/components/sections/MenuHighlights.tsx

# Stage all deleted screenshot files
git add tests/screenshots/

# Stage the nenflow context health file (tool artifact, fine to commit)
git add .nenflow_context_health.json

# Stage the nenflow run artifacts for this run
git add nenflow_v3/runs/RUN_20260415-173300/

# DO NOT stage: .playwright-mcp/, railway-*.png, github-*.png, github-apps.png
# Verify staging before commit:
git status

# Commit
git commit -m "feat: wire admin CMS sections to frontend + clean test screenshots

- Wire ctaSection and signatureSection from DB to HomePage
- Wire venue.tagline display to VisitPage
- MenuHighlights accepts optional HomepageSection prop with DB values
- Remove stale test screenshots (regenerated on next test run)"
```

### Step 2 — Create `16-apr` from `15-apr` (before merge)

```bash
git checkout -b 16-apr
git checkout 15-apr
```

Or equivalently:
```bash
git branch 16-apr 15-apr
```

### Step 3 — Merge `15-apr` into `main`

```bash
git checkout main
git merge 15-apr --no-ff -m "Merge branch '15-apr' into main"
```

Use `--no-ff` to preserve branch history explicitly. This will create a merge commit.

### Step 4 — Push `main` to GitHub

```bash
git push origin main
```

Verify: `git log origin/main --oneline -3`

### Step 5 — Push `16-apr` to GitHub (optional but recommended)

```bash
git push origin 16-apr
```

This sets up the new working branch on the remote.

### Step 6 — Railway deployment (CLI not available — manual instructions)

Since `railway` CLI is not installed, deployment must be triggered via Railway's GitHub integration:

**Option A (GitHub auto-deploy — preferred if already configured):**
- If Railway project is connected to `github.com/doner21/ramen-don` and set to deploy from `main`, pushing to `main` in Step 4 will automatically trigger a Railway deploy.
- User should verify in Railway dashboard at `https://railway.app/dashboard`.

**Option B (Manual trigger in Railway dashboard):**
1. Go to `https://railway.app/dashboard`
2. Open the `ramen-don` project
3. Click the service (likely named `ramen-don` or `web`)
4. Click "Deploy" or check the "Deployments" tab — a new deployment from the latest `main` commit should appear automatically
5. If not automatic, click "Trigger Deploy" and select the `main` branch

**Option C (Install Railway CLI for future runs):**
```bash
npm install -g @railway/cli
railway login
railway up
```

---

## Handoff Notes

### Branch topology detail
- `main` is 1 commit AHEAD of `15-apr` (the previous merge commit `1588d42`).
- After committing changes in Step 1, `15-apr` will be 2 commits ahead of the merge-base but 1 behind `main`'s extra merge commit — resulting in a true divergence, requiring a merge commit on `main`.
- This is expected and correct — do NOT attempt fast-forward.

### Files to NOT commit (risk of polluting repo)
- `.playwright-mcp/` — runtime Playwright MCP session logs; no source value
- `railway-*.png`, `github-apps.png`, `github-confirm-access.png` — scratch setup images from UI sessions
- These are not in `.gitignore` currently — Executor should note this but NOT modify `.gitignore` unless explicitly tasked

### Railway connection status
- Unknown whether Railway project already has GitHub auto-deploy configured.
- The existence of `railway-*.png` images suggests the user has been setting up Railway manually via UI.
- The Verifier should confirm deployment by checking Railway dashboard, not by running CLI commands.

### NenFlow run artifacts to commit
- `nenflow_v3/runs/RUN_20260415-173300/ATT_0_INTAKE.md` — already exists
- `nenflow_v3/runs/RUN_20260415-173300/ATT_1_PLAN.md` — this file
- `nenflow_v3/runs/RUN_20260415-173300/LATEST_PLAN.md` — alias, to be created by Planner
- Executor will add its own artifacts (ATT_2_EXECUTION.md etc.) — those should also be staged

### Key file paths
- `C:\Users\doner\ramen-don\src\app\(public)\page.tsx`
- `C:\Users\doner\ramen-don\src\app\(public)\visit\page.tsx`
- `C:\Users\doner\ramen-don\src\components\sections\MenuHighlights.tsx`
- `C:\Users\doner\ramen-don\tests\screenshots\` (deleted files to stage)
- `C:\Users\doner\ramen-don\nenflow_v3\runs\RUN_20260415-173300\`
