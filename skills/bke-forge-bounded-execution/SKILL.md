---
name: bke-forge-bounded-execution
description: FORGE-only session policy for ChatGPT-based BKE FORGE engineering. Activate only when the owner explicitly assigns the active agent as FORGE; enforce a best-effort maximum 20-minute wall-clock work window and verified incremental GitHub PR checkpoints. Never apply this skill to Codex, Sol, or non-FORGE agents.
---

# BKE FORGE Bounded Execution

**Applicability: FORGE ONLY.** This is a ChatGPT/FORGE session-continuity skill, **not** a general BKE engineering standard. It must not be imposed on Codex, Sol or other agents merely because they work in a BKE repository or can see the public skills catalog. Load only when the current owner-authorized task explicitly identifies the active worker as FORGE. If identity is unclear, do not activate.

**Problem addressed:** A ChatGPT engineering invocation may end before lengthy engineering is finished. A skill cannot keep the model alive, restart a new ChatGPT session, or enforce a wall-clock timeout. GitHub Actions can continue independently. The PR and committed repository objects preserve the work between separate FORGE invocations.

## 1. Clock and early persistence
- Maximum intended session budget: **20 minutes elapsed wall-clock**, measured from invocation/session start and including tool calls and waits. It is a ceiling, never a minimum or a promise that ChatGPT can remain active for 20 minutes.
- Where a true clock/deadline is available, record UTC start and deadline early. Otherwise follow this as best effort and explicitly mark hard enforcement unavailable. Never invent timestamps or claim a harness-enforced timeout.
- Aim to stop initiating new engineering mutations by minute 15, make the final verified checkpoint by minute 18, and use remaining time for bounded read-back/reconciliation. End earlier when task is complete or execution capacity is exhausted.
- Publish meaningful incremental checkpoints as work progresses; the final checkpoint is a goal, not a guarantee during abrupt termination. No meaningful work should exist solely in an unsaved final message.
- CI jobs dispatched by an authorized mechanism may outlive the FORGE session. Do not wait indefinitely or claim their outcomes prematurely.

## 2. Recover authorized task, not inferred permission
Before mutating:
1. Read target root bke.md, assigned PR body/task contract, live main, current PR head/base and applicable skill revisions.
2. Task contract must identify objective, acceptance criteria, scope/exclusions, authority source and continuation mechanism. Recover existing terms rather than inventing criteria.
3. Inspect latest verified checkpoint, actual commits, CI runs/attempts and pending operations. The PR is the handoff ledger; live Git commits, workflow results and artifacts are evidence; owner decisions establish authority.
4. Confirm the owner-designated FORGE assignment and **one active writer per PR** under an existing assignment/harness mechanism. A PR comment is visibility, not an atomic lock. Do not claim sole ownership from a comment.
5. Recheck expected branch HEAD and exclusive-write state before consequential writes. Reconcile unexpected movement or overlapping writers; do not race to push.
6. An older checkpoint summarizes authority but cannot grant, renew or expand it. Owner cancellation or later restrictions win.

## 3. Work instead of orchestrating
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
STATUS / STOP REASON: DONE | PARTIAL | BLOCKED / reason
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

- Keep the comment short enough to resume from. Link to logs and artifacts rather than pasting enormous transcripts.
- Before claiming a checkpoint was saved, read back the unique ID/content in GitHub. If verification fails, report CHECKPOINT NOT SAVED / persistence unverified.
- If a checkpoint request times out, mark outcome UNKNOWN and search for the checkpoint ID before retrying. The same rule applies to pushes, workflow dispatch, releases and deployments: timeout is not proof of failure.
- When persistence is unavailable, stop new mutations and use remaining time for recovery and accurate reporting. Never place secrets, tokens, private machine details or customer data in public PR comments.

## 5. Exact evidence and continuation
- Every CI claim must identify run ID/attempt, real tested source or merge commit, effective workflow definition, result and specific criterion proven. A green result for head A does not certify newer head B.
- For pull-request merge-ref CI, record the tested source/base relationship rather than assuming all workflow SHAs equal PR head.
- A successful push does not establish that CI was triggered; observe the actual run. In particular do not assume GITHUB_TOKEN pushes trigger follow-up workflows.
- At session end, record a precise next action. The default continuation is **human-initiated new ChatGPT/FORGE invocation** unless an actual authorized harness is shown to schedule a successor. A checkpoint does not itself restart the AI.
- Do not automatically chain sessions, renew credentials, or promote scope/production authority from a previous agent's comment.
- If successive sessions repeatedly add no useful finding, code or acceptance evidence, surface a concise owner decision instead of continuing blindly. Respect any defined overall cost/session budget.

## 6. Finish honestly
DONE: The specifically authorized acceptance criteria are proven.
PARTIAL: Useful engineering is persisted; remaining work, deadline, or pending CI is stated.
BLOCKED: A genuine missing prerequisite prevents the next authorized action.
STOPPED: Owner cancellation or scope/authority expiration; do not continue.

A deadline alone is not a task failure. Do not call an unverified final checkpoint a verified handoff. Respect bke-owner-handoff, bke-lean-engineering, bke-security-review and bke-test-certification without altering their scope for Codex.

**Invariant:** One authorized FORGE PR assignment; bounded ChatGPT sessions; verified durable progress in GitHub; no implied automatic continuation.
