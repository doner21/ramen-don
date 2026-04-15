---
name: "ATT_0_INTAKE"
run_id: "RUN_20260415-173300"
type: "intake"
created_at: "2026-04-15T17:33:00Z"
---

# NenFlow v3 — INTAKE

## task_summary
Merge the current branch (15-apr) into main, create a new working branch from 15-apr, push main to GitHub, and deploy main to Railway.app.

## task_type
config

## user_intent
Promote the work on the 15-apr branch to production (main → GitHub → Railway.app) while preserving a forward working branch.

## goal_attractor
main is up-to-date on GitHub and live on Railway.app; a new working branch exists for continued development.

## constraints
- Current branch: 15-apr
- Target merge destination: main
- New branch must be named sensibly (date-based, e.g. 16-apr)
- Railway deployment must use Railway CLI (if available) or provide clear manual steps
- Merge must not cause data loss or overwrite unintended changes

## invariants
- The 15-apr branch must not be deleted
- Uncommitted changes must be handled before merge (stash, commit, or discard — user decides)
- No force-push to main without explicit user approval

## success_criteria
1. main branch contains all commits from 15-apr
2. main is pushed to GitHub remote (origin/main updated)
3. A new branch (e.g. 16-apr) exists pointing at the same commit as 15-apr
4. Railway.app deployment is triggered and succeeds (or instructions provided if CLI unavailable)

## ambiguities
- Git status shows uncommitted changes on several files — these must be resolved before merge
- New branch name not specified by user (assumed 16-apr based on date context)
- Railway CLI availability unknown; deployment method unconfirmed
- Merge strategy not specified (fast-forward preferred if history is linear)

## clarification_needed
false

## recommended_next_step
PLAN
