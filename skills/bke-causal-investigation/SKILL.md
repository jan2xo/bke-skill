---
name: bke-causal-investigation
description: Investigate unexplained BKE engineering failures with source tracing, falsifiable hypotheses, minimal experiments, and real execution evidence. Use for diagnosis before speculative fixes or new infrastructure; this skill does not impose FORGE session time limits.
---

# BKE Causal Investigation

**Purpose:** Identify and verify the cause of an authorized engineering problem, then make the smallest justified correction. This is a reusable investigation method, not an agent scheduler or a grant of execution authority.

## Activation and authority
- Activate for an unexplained failure, compatibility issue, unfamiliar integration boundary, suspected regression, or conflicting runtime evidence. Ordinary well-understood edits need not load this skill.
- First read the target repository's root bke.md, current PR/task contract, main/head, relevant source and existing tests. Owner authorization, repository rules and current GitHub state outrank this skill.
- Use alongside bke-lean-engineering, bke-test-certification and bke-security-review when relevant.
- Do not create new tasks, branches, cross-repository changes, credentials, production actions, or infrastructure without existing authorization.
- This skill is usable by authorized BKE engineering agents including FORGE and Codex. It does **not** activate bke-forge-bounded-execution for Codex or anyone else.

## 1. Trace real behavior
1. State the observed failure, environment, affected version and acceptance criterion. Separate observation from interpretation.
2. Trace producer -> boundary -> transport/storage -> consumer, including configuration, migrations, relevant security checks and representative callers.
3. Read actual CI step definitions, source checkout, tests, traces and artifacts. Do not infer execution merely from a passing badge or checked-in test file.
4. Identify the earliest actionable causal failure rather than chasing downstream aggregates.
5. Record current counterevidence and untested assumptions; do not call a hypothesis a root cause.

## 2. Run discriminating experiments
For each plausible cause, keep a compact investigation capsule:
- OBSERVATION: What is established by a reproducible result?
- HYPOTHESIS: What cause explains it?
- PREDICTION: What should differ if the hypothesis is correct?
- EXPERIMENT: Smallest authorized test distinguishing competing explanations.
- RESULT: Actual output and link to source/run/artifact; include failures and skips.
- DECISION: Supported, refuted or still unknown.

Prefer the experiment with highest information gain and lowest safety/cost impact. Use existing scripts, tests and GitHub Actions as the available execution computer. Where appropriate, use real app/consumer receiving, isolated databases, browser automation, screenshots, network traces and failure injection in disposable authorized CI. Mocked fixtures, source checks and local profiles are valid evidence only for their actual boundaries.

## 3. Correct and prove
- Fix the verified cause with the smallest coherent change; preserve Node/Docker fallbacks, auth controls, schemas, and established contracts unless the assigned intent explicitly changes them.
- Reproduce the original failure and show it stops occurring; also test relevant valid, invalid, concurrent, stale or unauthorized inputs as required by the changed boundary.
- Push coherent source to the assigned PR before CI validation; distinguish committed source from temporary or discarded experiments.
- Verify exact tested source, effective workflow revision, run attempt, actual test execution and acceptance claim. A failed or pending CI run is not a pass.
- Inspect and reconcile GitHub state before retrying any mutation whose response was lost.

## 4. Avoid infrastructure-first drift
Before adding a workflow, dispatcher, service, dependency or database, establish:
1. Which necessary experiment existing authorized tools cannot perform.
2. Why the smallest existing CI path is insufficient.
3. Which narrowly scoped addition addresses that proven gap.
4. What permissions, safety and rollback conditions apply.

If the environment cannot run a decisive test, identify the precise evidence gap and authorized next action. Do not invent results, build a new orchestrator by default, or confuse missing tool access with a technical root cause.

## 5. Checkpoint and stop
Write significant findings, exact links and corrections in the assigned PR using existing owner-handoff conventions. Avoid repetitive transcripts. Report DONE when the assigned acceptance criteria are proven, PARTIAL when progress or CI remains, or BLOCKED only when the next authorized action cannot proceed.

End with: verified cause (or not established), decisive experiment, exact change/head, actual evidence, remaining unverified claims and one executable next step. Do not claim production, human-authenticated, native or physical acceptance from source CI alone.

**Principle:** Trace -> Hypothesize -> Experiment -> Observe -> Correct -> Verify. Evidence before architecture.
