---
artifact_type: "ORCH_CONTINUATION"
run_id: "RUN_20260415-121528"
written_at: "2026-04-15T12:25:00Z"
reason: "Orchestrator context saturation — user requested handoff"
recommended_next_move: "Fix Railway branch to main, add custom domain ramendon.uk, then update Supabase auth URL"
---

# Orchestrator Continuation Contract

## What Has Been Done (Complete)

1. **Git** — All code committed and pushed:
   - `ramen-don_alpha` — working branch, all changes committed (commit `b6e0db3`)
   - `main` — production branch, same commit, pushed to GitHub
   - `ramen-don_dev` — new local working branch for ongoing dev
   - GitHub remote: https://github.com/doner21/ramen-don.git

2. **Railway project created**:
   - Project name: `cooperative-laughter` (Railway's random name — can be renamed)
   - Project ID: `114db40c-6367-4b70-b600-5d764e67ddd2`
   - Service name: `ramen-don`
   - Service ID: `463a48df-7487-43c8-bf1a-158a13cae382`
   - Environment ID: `5752ba83-e593-453d-a171-ca46b0e5c288`
   - Direct URL: https://railway.com/project/114db40c-6367-4b70-b600-5d764e67ddd2/service/463a48df-7487-43c8-bf1a-158a13cae382

3. **Supabase env vars added to Railway** (all 3 saved, deployment triggered):
   - `NEXT_PUBLIC_SUPABASE_URL` ✅
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✅
   - `SUPABASE_SERVICE_ROLE_KEY` ✅
   - Latest deployment: **ACTIVE / Deployment successful**

## What Remains (In Order)

### Step 1 — Fix the branch from `ramen-don_alpha` → `main`
- In Railway: service Settings → Source → "Branch connected to production"
- Currently set to `ramen-don_alpha` — change to `main`
- URL: https://railway.com/project/114db40c-6367-4b70-b600-5d764e67ddd2/service/463a48df-7487-43c8-bf1a-158a13cae382/settings?environmentId=5752ba83-e593-453d-a171-ca46b0e5c288
- The dropdown uses class `rail-select__control` — click it, then select `main`

### Step 2 — Add custom domain `ramendon.uk`
- In Railway: same Settings page → scroll down to **Networking** section
- Click "Generate Domain" or "Add Custom Domain"
- Enter: `ramendon.uk`
- Railway will display a CNAME record (e.g. `xxxxxx.up.railway.app`)
- Copy that CNAME value — user needs to add it in GoDaddy DNS

### Step 3 — Configure GoDaddy DNS
- Tell user to go to GoDaddy → DNS Management for `ramendon.uk`
- Add CNAME record:
  - Name: `www`
  - Value: the CNAME Railway provided
- For root domain (`@`): use GoDaddy forwarding to redirect to `www.ramendon.uk`
  OR recommend Cloudflare for CNAME flattening

### Step 4 — Update Supabase auth URL
- Go to Supabase dashboard → Authentication → URL Configuration
- Set Site URL to: `https://www.ramendon.uk`
- Add to Redirect URLs: `https://www.ramendon.uk/**`
- This ensures admin login works on the live domain

## Key Credentials (already in Railway — do NOT re-enter)
- Supabase URL: https://usponfmwsloozdccugmb.supabase.co
- Keys already saved in Railway Variables

## Browser State
- Playwright MCP is available and the browser has Railway open
- Last page: Railway service Settings tab
- The branch dropdown was found via `.rail-select__control` CSS class
