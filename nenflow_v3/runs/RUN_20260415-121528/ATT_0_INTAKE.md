---
run_id: RUN_20260415-121528
phase: INTAKE
task_type: config
recommended_next_step: PLAN
clarification_needed: false
---

# INTAKE — RUN_20260415-121528

## task_summary
Prepare the ramen-don Next.js site for production: commit all current changes, merge to main, push main to GitHub, create a new local working branch, configure next.config.ts for the ramendon.uk domain, and document Railway deployment setup.

## task_type
config

## user_intent
Get the site live on Railway via GitHub, using ramendon.uk as the domain, while preserving a local working branch for ongoing development.

## goal_attractor
- `main` branch on GitHub contains the full, clean, production-ready codebase
- Railway is connected to GitHub main and will auto-deploy on push
- A new working branch exists locally for continued development
- next.config.ts references ramendon.uk correctly

## constraints
- Current branch: `ramen-don_alpha` (many modified files)
- GitHub remote already exists: https://github.com/doner21/ramen-don.git
- Site domain: ramendon.uk
- Must not lose any current work
- Must not force-push main without user confirmation

## invariants
- All current working changes must be committed before branch ops
- The new working branch must be cut from the post-commit state (not from stale main)
- next.config.ts `allowedDevOrigins` has already been removed (done in prior step)

## success_criteria
1. All modified files committed on `ramen-don_alpha`
2. `main` branch updated with those commits (merge or reset)
3. `main` pushed to origin/main on GitHub
4. New working branch (e.g. `ramen-don_dev`) created from current state
5. next.config.ts updated for ramendon.uk if any domain-specific config is needed
6. Railway deployment instructions documented (manual step — no Railway CLI assumed)

## ambiguities
- Whether to merge ramen-don_alpha → main or reset main to ramen-don_alpha (preference: merge/rebase for clean history)
- Name of the new working branch (will use `ramen-don_dev` unless user specifies otherwise)
- Whether there are Railway-specific files needed (railway.json / nixpacks.toml)

## clarification_needed
false

## recommended_next_step
PLAN
