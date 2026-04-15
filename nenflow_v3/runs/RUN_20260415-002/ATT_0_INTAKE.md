---
run_id: RUN_20260415-002
task_summary: Write a minimal smoke test file that validates key NenFlow v3 workflow phases via artifact inspection.
task_type: meta-system
user_intent: Validate that the NenFlow v3 agentic workflow is producing well-formed artifacts across all phases.
goal_attractor: A runnable test script exists at nenflow_v3/tests/smoke_test.js that checks artifact schema/structure for any given run.
constraints:
  - Keep token usage low
  - Minimal assertions — enough to catch structural failures
  - Sensible location in repo (nenflow_v3/tests/)
  - Do not modify any existing nenflow_v3 system files or run artifacts
invariants:
  - Existing runs must not be altered
  - No production code touched
success_criteria:
  - nenflow_v3/tests/smoke_test.js exists
  - Script is syntactically valid Node.js (no parse errors)
  - Script exercises INTAKE / PLAN / EXECUTION / VERIFICATION artifact checks
  - Script can be run with: node nenflow_v3/tests/smoke_test.js [run_id]
ambiguities: none material
clarification_needed: false
recommended_next_step: DIRECT_EXECUTE
route: DIRECT_EXECUTE
---
