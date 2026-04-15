---
artifact_type: "EXECUTION_REPORT"
role: "EXECUTOR"
run_id: "RUN_20260415-121528"
attempt: 1
---

# Execution Report — RUN_20260415-121528

## Step 1 — Stage and Commit on ramen-don_alpha

**Command run:**
```
git add --all
git commit -m "feat: production-ready build — admin panel, gallery, auth, API routes, and test suite

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

**Output (truncated to key lines):**
```
[ramen-don_alpha f895a19] feat: production-ready build — admin panel, gallery, auth, API routes, and test suite
 190 files changed, 11183 insertions(+), 383 deletions(-)
```
New commit hash: `f895a19084138872c4d2049e257d828f1f2db0ea`

**Post-commit git status:**
```
On branch ramen-don_alpha
Your branch is ahead of 'origin/ramen-don_alpha' by 1 commit.
nothing to commit, working tree clean
```
Working tree is clean. Invariant 1 (no work lost) satisfied.

---

## Step 2 — Push ramen-don_alpha

**Command run:**
```
git push origin ramen-don_alpha
```

**Output:**
```
To https://github.com/doner21/ramen-don.git
   cb33e90..f895a19  ramen-don_alpha -> ramen-don_alpha
```
Remote `origin/ramen-don_alpha` now at `f895a19`.

---

## Step 3 — Create main Branch and Push to GitHub

**3a. Remote main check:**
```
git ls-remote --heads origin main
```
Output: (empty — no remote main existed)

**3b. Create local main:**
```
git checkout -b main
```
Output: `Switched to a new branch 'main'`

**3c. Push main to origin:**
```
git push -u origin main
```
Output:
```
To https://github.com/doner21/ramen-don.git
 * [new branch]      main -> main
branch 'main' set up to track 'origin/main'.
```
Remote `origin/main` created at `f895a19`. No force-push was needed (remote main did not previously exist).

---

## Step 4 — Create ramen-don_dev Branch

**Commands run:**
```
git checkout ramen-don_alpha
git checkout -b ramen-don_dev
```
Output:
```
Switched to branch 'ramen-don_alpha'
Switched to a new branch 'ramen-don_dev'
```
`ramen-don_dev` created locally, pointing to `f895a19`.

---

## Step 5 — Confirm next.config.ts (Read-Only)

File: `C:\Users\doner\ramen-don\next.config.ts`

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
```

Confirmation: `*.supabase.co` remotePattern is present and intact. No edits were made. Invariant 5 satisfied.

---

## Step 6 — No .env Files in Commit

**Command run:**
```
git show HEAD --name-only | grep -i ".env" || echo "no env files in commit — GOOD"
```
Output: `no env files in commit — GOOD`

Invariant 2 (no .env committed) satisfied.

---

## Final Git State

**git log --oneline ramen-don_alpha:**
```
f895a19 feat: production-ready build — admin panel, gallery, auth, API routes, and test suite
cb33e90 Initial commit: Ramen Don Next.js site with mobile nav fixes
```

**git branch -a:**
```
  main
  master
  ramen-don_alpha
* ramen-don_dev
  remotes/origin/main
  remotes/origin/ramen-don_alpha
```

**git rev-parse ramen-don_alpha main ramen-don_dev:**
```
f895a19084138872c4d2049e257d828f1f2db0ea
f895a19084138872c4d2049e257d828f1f2db0ea
f895a19084138872c4d2049e257d828f1f2db0ea
```
All three local branches point to the same commit. origin/main also at f895a19.

---

## Railway Manual Setup Instructions

To deploy `ramendon.uk` on Railway:

### 1. Create New Project
- Go to https://railway.app/dashboard
- Click **New Project** → **Deploy from GitHub repo**
- Select repository: `doner21/ramen-don`
- Select branch: `main`

### 2. Set Environment Variables
In the Railway project → **Variables** tab, add the following three variables:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL (e.g. `https://xxxx.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key (keep secret) |

Note: `PORT` is auto-injected by Railway; Next.js reads it automatically. No manual PORT config needed.

### 3. Configure Custom Domain
- Railway project → **Settings** → **Networking** → **Custom Domains**
- Add: `ramendon.uk`
- Railway will provide a DNS CNAME target — point your domain registrar's CNAME record to it
- SSL is provisioned automatically by Railway

### 4. Build and Start
Railway auto-detects Next.js via `package.json`. It will run:
- Build: `npm run build` (i.e. `next build`)
- Start: `npm run start` (i.e. `next start`)

No `railway.json` or `nixpacks.toml` is required.

---

## Commands Run Locally

```
git add --all
git commit -m "feat: production-ready build — admin panel, gallery, auth, API routes, and test suite\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
git status
git show HEAD --name-only | grep -i ".env" || echo "no env files in commit — GOOD"
git ls-remote --heads origin main
git push origin ramen-don_alpha
git checkout -b main
git push -u origin main
git checkout ramen-don_alpha
git checkout -b ramen-don_dev
git log --oneline ramen-don_alpha
git branch -a
git rev-parse ramen-don_alpha main ramen-don_dev
```

## Observed Results (LOCAL OBSERVATIONS)

- Commit `f895a19` created successfully with 190 files changed.
- Working tree clean after commit.
- No .env files in commit.
- `ramen-don_alpha` pushed to origin (cb33e90..f895a19).
- `main` branch created locally and pushed to `origin/main` (new branch).
- `ramen-don_dev` created locally from `ramen-don_alpha` HEAD.
- All three local branches (ramen-don_alpha, main, ramen-don_dev) resolve to `f895a19084138872c4d2049e257d828f1f2db0ea`.
- `next.config.ts` confirmed intact with `*.supabase.co` remotePattern — no edits made.
