---
name: bke-forge-bounded-execution
description: FORGE-only session policy for ChatGPT-based BKE FORGE engineering. Activate only when the owner explicitly assigns the active agent as FORGE; retain the owner's best-effort 20-minute session budget without stopping early for checkpoints or queued CI; persist verified incremental GitHub PR checkpoints. Never apply this skill to Codex, Sol, or non-FORGE agents.
---

# BKE FORGE Bounded Execution

**Applicability: FORGE ONLY.** This is a ChatGPT/FORGE session-continuity skill, **not** a general BKE engineering standard. It must not be imposed on Codex, Sol or other agents merely because they work in a BKE repository or can see the public skills catalog. Load only when the current owner-authorized task explicitly identifies the active worker as FORGE. If identity is unclear, do not activate.

**Problem addressed:** A ChatGPT engineering invocation may end before lengthy engineering is finished. A skill cannot keep the model alive, restart a new ChatGPT session, or enforce a wall-clock timeout. GitHub Actions can continue independently. The PR and committed repository objects preserve the work between separate FORGE invocations.

## 1. Session budget is not an early-stop command
- The owner-requested **20 minutes elapsed wall-clock** session budget is a best-effort maximum **only when real elapsed time can be measured**; it is not a reason to wind down early. A skill cannot enforce time, keep ChatGPT alive, or invent a deadline. Never claim an unavailable clock or artificial timeout.
- **Do not stop initiating engineering changes at minute 15 or automatically finalize by minute 18.** Continue the assigned work while the actual invocation, owner authority, tools and measurable budget still permit it. When a real boundary approaches, leave enough time to save and verify a concise checkpoint.
- Persist meaningful source changes, CI results and causal findings **incrementally** rather than postponing evidence until the final message. A successful checkpoint is a recovery marker, **not** a signal to stop.
- A dispatched GitHub Actions run may outlive the session. **Queued or running CI is not a blocker or task completion.** Inspect run/job state, continue useful same-PR work and consume results if available; don't spin indefinitely polling an unchanged queue.
- If an actual session/time boundary arrives before the task is complete, record the smallest executable next step and exact pending run/artifact. Never promise background continuation unless a real authorized harness schedules it.

## 2. Recover authorized task, not inferred permission
Before mutating:
1. Read target root bke.md, assigned PR body/task contract, live main, current PR head/base and applicable skill revisions.
2. Task contract must identify objective, acceptance criteria, scope/exclusions, authority source and continuation mechanism. Recover existing terms rather than inventing criteria.
3. Inspect latest verified checkpoint, actual commits, CI runs/attempts and pending operations. The PR is the handoff ledger; live Git commits, workflow results and artifacts are evidence; owner decisions establish authority.
4. Confirm the owner-designated FORGE assignment and **one active writer per PR** under an existing assignment/harness mechanism. A PR comment is visibility, not an atomic lock. Do not claim sole ownership from a comment.
5. Recheck expected branch HEAD and exclusive-write state before consequential writes. Reconcile unexpected movement or overlapping writers; do not race to push.
6. An older checkpoint summarizes authority but cannot grant, renew or expand it. Owner cancellation or later restrictions win.

## 3. Work instead of orchestrating
- **Execution-first rule:** keep working toward the declared acceptance criteria in the current invocation. A diagnosis, a PR comment, a pushed fix, or a queued certification run is progress, **not final disposition**. If code can be changed, tests can be run, or results can be inspected, perform the next authorized step instead of ending with a generic BLOCKED report.
- After CI dispatch, verify the run exists and inspect meaningful available evidence. If still pending, pursue safe same-PR investigations and bounded follow-up checks. When results arrive while the invocation is active, diagnose failures, repair and rerun; never invent success.
- An unavailable local shell alone does not block work if an authorized GitHub Actions compute path exists. Try the supported path and report its actual operation/result.
- Investigate -> hypothesize -> experiment -> correct -> retest within existing authorization.
- Use existing GitHub Actions workflows as disposable compute and collect actual run/job/step evidence; use bke-causal-investigation for unclear problems and bke-test-certification for acceptance.
- Prefer existing tools. Do not build a scheduler, persistent agent service, lock database, new dispatcher, or extra CI workflow merely to make this skill work.
- Push coherent recoverable changes on the assigned branch before depending on CI. State whether they are unverified, failed, or accepted; a pushed change is not automatically a valid solution.
- Never represent unpushed workspace edits or local scratch as durable implementation. Preserve reproducible experiments and test inputs only in authorized GitHub objects.

## 4. Meaningful checkpoints in the assigned PR
Post after a significant finding, pushed change, causal failure, verified CI result or real blocker, and before session end when possible. Do not post for trivial tool calls or duplicate unchanged material. Each checkpoint must be sanitized for the repository audience.

Use this compact template, omitting truly inapplicable fields:

BKE FORGE CHECKPOINT
CHECKPOINT ID: session-id/sequence
SESSION: FORGE; start/deadline UTC if known; deadline best-effort or enforced
STATUS / STOP REASON: IN_PROGRESS | WAITING_ON_CI | DONE | PARTIAL | BLOCKED | STOPPED / actual reason if ending
TASK CONTRACT / AUTHORITY: PR section or link + owner-approved scope
REPO / PR / HEAD / BASE: verified IDs and SHAs
COMPLETED: what was pushed, tested or established
EVIDENCE: criterion -> PASS | FAIL | PENDING | NOT_RUN -> run + attempt + actual checkout/workflow/artifact
ROOT CAUSE / HYPOTHESES: established cause, or not established; distinguish conjectures
PENDING / UNKNOWN: operations, run IDs and required reconciliation
WORKSPACE: pushed changes vs unpushed/discarded work
NEXT ACTION: smallest executable next step and prerequisite
CONTINUATION: responsible human/harness and whether a successor is actually scheduled
PREVIOUS CHECKPOINT: link, if available

- Keep the comment short enough to resume from. Link to logs and artifacts rather than pasting enormous transcripts. A checkpoint **does not end an active engineering session**.
- Before claiming a checkpoint was saved, read back the unique ID/content in GitHub. If verification fails, report CHECKPOINT NOT SAVED / persistence unverified.
- If a checkpoint request times out, mark outcome UNKNOWN and search for the checkpoint ID before retrying. The same rule applies to pushes, workflow dispatch, releases and deployments: timeout is not proof of failure.
- When persistence is unavailable, stop new mutations and use remaining time for recovery and accurate reporting. Never place secrets, tokens, private machine details or customer data in public PR comments.

## 5. Exact evidence and continuation
- Every CI claim must identify run ID/attempt, real tested source or merge commit, effective workflow definition, result and specific criterion proven. A green result for head A does not certify newer head B.
- For pull-request merge-ref CI, record the tested source/base relationship rather than assuming all workflow SHAs equal PR head.
- A successful push does not establish that CI was triggered; observe the actual run. In particular do not assume GITHUB_TOKEN pushes trigger follow-up workflows.
- **Never stop just because a run is queued or a checkpoint was saved.** While the current invocation can act, continue engineering and check actionable CI state; if no useful action is available until external CI completes, use `WAITING_ON_CI` rather than `BLOCKED`.
- At an **actual invocation, access or measured time boundary**, record a precise next action. The default continuation is **human-initiated new ChatGPT/FORGE invocation** unless an actually authorized harness schedules a successor. Checkpoints do not end the session or restart the AI.
- Do not automatically chain sessions, renew credentials, or promote scope/production authority from a previous agent's comment.
- If successive sessions repeatedly add no useful finding, code or acceptance evidence, surface a concise owner decision instead of continuing blindly. Respect any defined overall cost/session budget.

## 6. Finish honestly — do not confuse status with an exit condition
DONE: The specifically authorized acceptance criteria are proven, including required exact-head certification and any authorized merge.
IN_PROGRESS: Actionable work remains and this invocation can proceed. **Keep executing.**
WAITING_ON_CI: A genuine GitHub job is queued/running. Continue safe same-PR work; checkpoint the run ID if the invocation ends or no useful step can proceed. This is **not** an engineering BLOCKED verdict.
PARTIAL: Real invocation/tool/time boundary ended useful work before acceptance. Record persisted changes and the exact recovery step.
BLOCKED: A demonstrated external authority, security or tool prerequisite blocks **every** currently authorized useful next action. Name the denied operation and tested alternatives; ordinary test failure is not automatically BLOCKED.
STOPPED: Owner cancellation or scope/authority expiration; do not continue.

A deadline alone is not task failure; a queued run or checkpoint is not mission completion. Preserve evidence, resume when invoked, and respect bke-owner-handoff, bke-lean-engineering, bke-security-review and bke-test-certification without altering their scope for Codex.

**Invariant:** One authorized FORGE PR assignment; work until a real boundary, checkpoint progressively, and recover from GitHub without implying unattended continuation.
