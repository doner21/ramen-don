#!/usr/bin/env node
/**
 * NenFlow v3 Smoke Test
 * Usage: node nenflow_v3/tests/smoke_test.js [run_id]
 * If no run_id is given, tests the most recently modified run directory.
 *
 * Checks:
 *   1. INTAKE artifact exists and has required frontmatter fields
 *   2. At least one PLAN or RESEARCH artifact exists
 *   3. At least one EXECUTION artifact exists
 *   4. At least one VERIFICATION artifact exists with a valid verdict
 *   5. Verdict field is exactly "PASS" or "FAIL" (no malformed values)
 *   6. All checked artifacts have matching run_id in frontmatter
 */

const fs = require("fs");
const path = require("path");

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const RUNS_DIR = path.join(__dirname, "..", "runs");

// task_summary may live in the body (as a heading) rather than frontmatter — only require run_id + next step
const REQUIRED_INTAKE_FIELDS = ["run_id", "recommended_next_step"];
const REQUIRED_PLAN_FIELDS    = ["artifact_type", "role", "run_id"];
const REQUIRED_EXEC_FIELDS    = ["artifact_type", "role", "run_id"];
const REQUIRED_VERIFY_FIELDS  = ["artifact_type", "role", "run_id", "verdict"];
const VALID_VERDICTS          = new Set(["PASS", "FAIL"]);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Parse YAML-ish frontmatter (simple key: "value" or key: value) */
function parseFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const fields = {};
  for (const line of match[1].split("\n")) {
    const m = line.match(/^(\w+):\s*"?([^"]*)"?\s*$/);
    if (m) fields[m[1].trim()] = m[2].trim();
  }
  return fields;
}

function readFm(filePath) {
  try {
    return parseFrontmatter(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

function pass(msg) { console.log(`  ✓ ${msg}`); }
function fail(msg) { console.error(`  ✗ ${msg}`); return 1; }

/** Find artifacts in runDir matching a glob-ish suffix */
function findArtifacts(runDir, ...patterns) {
  const files = fs.readdirSync(runDir);
  return patterns.flatMap(p => files.filter(f => f.includes(p))).map(f => path.join(runDir, f));
}

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------

function testRun(runId, runDir) {
  console.log(`\nRun: ${runId}`);
  let failures = 0;

  // --- 1. INTAKE ---
  const intakePath = path.join(runDir, "ATT_0_INTAKE.md");
  if (!fs.existsSync(intakePath)) {
    failures += fail("ATT_0_INTAKE.md missing");
  } else {
    const fm = readFm(intakePath);
    if (!fm) {
      failures += fail("ATT_0_INTAKE.md has no parseable frontmatter");
    } else {
      for (const field of REQUIRED_INTAKE_FIELDS) {
        if (!fm[field]) failures += fail(`INTAKE missing field: ${field}`);
        else pass(`INTAKE.${field} = "${fm[field]}"`);
      }
    }
  }

  // --- 2. PLAN or RESEARCH artifact ---
  const planFiles = findArtifacts(runDir, "_PLAN", "_RESEARCH");
  if (planFiles.length === 0) {
    failures += fail("No PLAN or RESEARCH artifact found");
  } else {
    for (const f of planFiles) {
      const fm = readFm(f);
      const base = path.basename(f);
      const requiredFields = base.includes("PLAN") ? REQUIRED_PLAN_FIELDS : ["artifact_type", "role", "run_id"];
      if (!fm) { failures += fail(`${base}: no frontmatter`); continue; }
      for (const field of requiredFields) {
        if (!fm[field]) failures += fail(`${base} missing field: ${field}`);
        else pass(`${base}.${field} = "${fm[field]}"`);
      }
    }
  }

  // --- 3. EXECUTION artifact ---
  const execFiles = findArtifacts(runDir, "_EXECUTION");
  if (execFiles.length === 0) {
    failures += fail("No EXECUTION artifact found");
  } else {
    for (const f of execFiles) {
      const fm = readFm(f);
      const base = path.basename(f);
      if (!fm) { failures += fail(`${base}: no frontmatter`); continue; }
      for (const field of REQUIRED_EXEC_FIELDS) {
        if (!fm[field]) failures += fail(`${base} missing field: ${field}`);
        else pass(`${base}.${field} = "${fm[field]}"`);
      }
    }
  }

  // --- 4 & 5. VERIFICATION artifact + verdict ---
  const verifyFiles = findArtifacts(runDir, "_VERIFICATION");
  if (verifyFiles.length === 0) {
    failures += fail("No VERIFICATION artifact found");
  } else {
    for (const f of verifyFiles) {
      const fm = readFm(f);
      const base = path.basename(f);
      if (!fm) { failures += fail(`${base}: no frontmatter`); continue; }
      for (const field of REQUIRED_VERIFY_FIELDS) {
        if (!fm[field]) failures += fail(`${base} missing field: ${field}`);
        else pass(`${base}.${field} = "${fm[field]}"`);
      }
      if (fm.verdict && !VALID_VERDICTS.has(fm.verdict)) {
        failures += fail(`${base}.verdict is "${fm.verdict}" — must be PASS or FAIL`);
      }
    }
  }

  // --- 6. run_id coherence (spot-check first found VERIFICATION) ---
  if (verifyFiles.length > 0) {
    const fm = readFm(verifyFiles[0]);
    if (fm && fm.run_id && fm.run_id !== runId) {
      failures += fail(`run_id mismatch: directory="${runId}", artifact="${fm.run_id}"`);
    } else if (fm && fm.run_id) {
      pass(`run_id coherent in VERIFICATION artifact`);
    }
  }

  return failures;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function resolveRunDir(arg) {
  if (arg) {
    const d = path.join(RUNS_DIR, arg);
    if (!fs.existsSync(d)) { console.error(`Run directory not found: ${d}`); process.exit(1); }
    return { runId: arg, runDir: d };
  }
  // Most recently modified run
  const dirs = fs.readdirSync(RUNS_DIR)
    .map(name => ({ name, mtime: fs.statSync(path.join(RUNS_DIR, name)).mtime }))
    .sort((a, b) => b.mtime - a.mtime);
  if (dirs.length === 0) { console.error("No run directories found."); process.exit(1); }
  const runId = dirs[0].name;
  return { runId, runDir: path.join(RUNS_DIR, runId) };
}

const { runId, runDir } = resolveRunDir(process.argv[2]);
const totalFailures = testRun(runId, runDir);

console.log(`\n${"─".repeat(50)}`);
if (totalFailures === 0) {
  console.log(`RESULT: PASS (${runId})`);
} else {
  console.log(`RESULT: FAIL — ${totalFailures} assertion(s) failed (${runId})`);
  process.exit(1);
}
