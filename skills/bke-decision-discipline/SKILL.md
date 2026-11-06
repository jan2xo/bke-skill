---
name: bke-decision-discipline
description: Choose whether and where to change BKE software when a reported failure, task takeover, scope change, CI constraint, or policy tradeoff creates competing next actions. Use before consequential engineering decisions; routine understood edits do not need a separate decision ceremony.
---

# BKE Decision Discipline

Choose the smallest authorized action supported by evidence, then follow it through. A valid outcome may be a patch, corrected usage, recovery of existing work, a narrowly blocked operation, or no change.

This skill adds decision checks to existing BKE engineering practice. It is not an orchestrator, an approval grant, or an automatic security audit. Use relevant investigation, certification and handoff skills only when needed; do not load the entire catalog for each decision.

## 1. Bind the decision to the actual task

Read current owner instructions, the repository's root `bke.md`, the assigned task/PR, live default branch, candidate head/base and relevant source. Apply the repository's authority order; current explicit owner authorization controls scope, and live GitHub defines implementation state. This skill and historical checkpoints cannot create permission or override those authorities.

Before writing, identify the authorized result, acceptance boundary, owning PR/branch and exclusions. An integration destination is not blanket permission to implement every feature there.

- One independent intent belongs in one fresh PR from the verified current default branch (normally `main`) under the target repository's contract. Reuse an already assigned open task PR only when it remains the authorized, current implementation owner.
- A dependent stacked PR requires an explicitly authorized dependency exception: record its base, prerequisite and integration order. Never infer this exception merely because another feature branch is convenient. An already explicit task, dependency or release authorization governs its exception; this skill does not require repeat approval of that model.
- Fixes and tests needed to complete the same intent stay in its PR; do not create a PR for every corrective commit.
- A newly discovered unrelated improvement is a proposal, not an extension of the active task. Do not implement it or propagate it into another PR without scope authority.
- If owner direction changes, reconcile the task contract before the next mutation. Continue independently authorized work while a genuinely dependent decision is unresolved.

## 2. Decide whether code needs to change

Preserve the exact failing input, expected result, environment and actual response, sanitized for the repository audience. Separate the user's symptom from the proposed explanation.

Compare that input with the canonical contract and real receiving behavior:

| Evidence | Smallest next action |
|---|---|
| Supported valid input fails | Trace the first causal failure and patch its owner. |
| Invalid input is correctly rejected | Explain the supported input; do not automatically redesign validation or UI. A usability improvement needs its own requirement. |
| Source appears correct but the environment differs | Verify configuration, deployed artifact or runtime at that boundary before changing source. |
| Cause is uncertain | Run the cheapest authorized experiment that distinguishes the plausible causes. |
| Required evidence or authority is unavailable | Isolate that dependent action, record the precise prerequisite and continue other authorized work. |

Do not label a hypothesis a root cause. State what observation would refute it. After one understood correction, inspect the result before choosing the next; do not use repeated CI dispatches as random experiments.

## 3. Reuse the canonical execution path

Identify the existing owner, helper, command or workflow for the operation. Prefer invoking or narrowly correcting it over copying its logic.

For privileged operations, a hand-written SQL transaction or alternate endpoint is not proven equivalent merely because it produces the desired role or status. Check relevant eligibility, authorization, atomicity/concurrency, revocation, audit and failure behavior against the canonical path.

If an alternative materially changes the approved method, privileges or guard coverage, resolve that specific authority boundary before use. Existing authorization remains valid within its scope; do not ask again for an unchanged approved action. Do not build new infrastructure merely to avoid an inconvenient but usable path.

## 4. Carry known execution constraints forward

Read relevant workflow triggers, guards, concurrency groups, permissions and recent causal failures before selecting CI. Translate established constraints into the next executable plan.

For example: `shared cancellation group -> sequential affected runs -> wait for completion before the next conflicting dispatch`. Do not redispatch a known conflicting multi-target command and plan to recover from the same cancellations again.

- Use the minimum complete affected graph. Include or exclude a check because of the responsibility it actually tests, not its name or its previous result. Preserve every check required by the applicable repository/task acceptance contract; graph selection does not waive existing gates.
- When scheduler or workflow behavior causes a failure, distinguish it from source/test failure. Retain the red/cancelled evidence; never count it as passed.
- Verify workflow revision, tested source, run attempt and actual required job results. On comment-triggered CI, the run's main-branch SHA may differ from its candidate checkout.
- Keep reusable constraints in the existing PR's current summary. A permanent scheduler fix is a separate intent unless already authorized; do not silently rewrite CI during feature recovery.

## 5. Name policy changes honestly

Removing a security or business gate is a policy change when the gate enforces its intended requirement, even if it blocks the desired workflow. Do not describe reduced protection as an equivalent-security bug fix.

Before implementation, identify the old rule, proposed rule, affected callers, preserved controls, actual benefit and lost protection. Verify current owner authority for that change and record its provenance accurately. An executor's statement of approval is not an independent approving event.

Test the intended legitimate behavior and remaining refusal boundaries. Keep source acceptance separate from authorized runtime operation and production cutover.

## 6. Recover work without manufacturing new work

When task ownership changes or scope is withdrawn, inspect the complete mixed diff before closing, reverting or moving it. Deferring one feature does not imply abandoning unrelated integration work.

Prefer a forward revert or selective transfer that preserves history and valid unrelated work. Record the intended source/base relationship, compare actual resulting files/trees, and update dependency order. Do not force-push or transfer unrelated patches merely to make branches look aligned.

A restored identical tree is useful source evidence, not automatic certification of the new commit. Re-evaluate required exact-head checks and review under the repository contract. Do not keep committing documentation just to embed each new head and cause another certification cycle.

## 7. Leave one accurate current state

Use the existing PR body for current intent, scope, ownership/dependencies, policy, acceptance checklist and certification plan. Update superseded statements rather than appending another conflicting "current" section.

Keep chronological evidence in concise comments. At a significant decision or task boundary, link the actual resulting head, run/job results and remaining acceptance. Verify important writes were saved; reconcile an unknown outcome before retrying.

When useful, record this compact decision in the existing ledger, not a new document or service:

- **Decision / task:** chosen action and owning PR.
- **Evidence / counterevidence:** decisive observation and remaining uncertainty.
- **Scope / authority:** what permits the action and what remains excluded.
- **Execution constraint:** known condition that changes how it must run.
- **Completion:** required proof, actual result and unverified boundary.
- **Next:** smallest authorized action, or none.

Do not create this record for every tool call. Read prior decisions before asking the owner to repeat them. Finish the authorized acceptance loop when tools and authority permit; a checkpoint or queued run is progress, not completion. Stop when acceptance is met, the owner stops the task, or a real execution/authority boundary is reached.

**Decision test:** Does the next action address demonstrated need, belong to this task, respect known constraints, and produce evidence proportionate to its consequence? If not, revise the action before writing.
