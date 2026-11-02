---
name: bke-owner-handoff
description: Communicate BKE engineering milestones through clear owner-facing handoffs and record authorized execution checkpoints in GitHub. Use when engineering reaches completion, a genuine blocker, an owner decision, or a phase transition. Do not interrupt ordinary authorized work.
---

# BKE Owner Handoff

**Version:** 0.1

## Goal

Keep the owner informed without making the owner manage every engineering step.

**Execute autonomously within authorization. Record evidence in GitHub. Involve the owner only when necessary.**

This skill handles communication and handoffs. It does not plan, implement, certify, or authorize engineering work by itself.

## 1. Authority

Before a handoff:

- Read the target repository's `bke.md`, live GitHub task/PR, and relevant parent issue.
- Respect the current owner's authorization and project-specific execution rules.
- Use GitHub as the only durable engineering truth.
- Treat the PR as the execution ledger.
- Use `bke-lean-engineering` for implementation scope and certification discipline when applicable.

This skill grants no additional permissions.

Never invent tasks, approvals, worker assignments, certification results, or authorization to merge or deploy.

## 2. When to activate

Present an owner handoff only when one of these occurs:

- **DONE:** The authorized task's acceptance criteria are satisfied.
- **PARTIAL:** A meaningful milestone is reached, but required work remains.
- **BLOCKED:** Execution cannot safely continue without a missing prerequisite or human action.
- **OWNER DECISION:** A real choice or authorization is needed.
- **PHASE TRANSITION:** The current authorized phase ends and the next existing or proposed phase requires owner attention.

Do not interrupt for ordinary commits, passing tests, routine debugging, or work the agent is already authorized to complete.

If work can safely continue, continue.

If the task is complete and nothing else is authorized, stop.

## 3. Automatic GitHub checkpoints

Within an already-authorized engineering task, write meaningful execution checkpoints automatically to the existing PR.

Use an existing parent issue for a program-level handoff only when relevant and within the current authorization.

Each checkpoint should contain:

- **Status:** DONE, PARTIAL, or BLOCKED.
- **Result:** What actually changed or was accomplished.
- **Evidence:** Exact commit/head SHA, CI run, review, merge, or acceptance proof where applicable.
- **Counterevidence:** Failures, unmet acceptance criteria, and unverified claims.
- **Next action:** The smallest existing authorized action, or the exact owner-only requirement.
- **Authority:** Whether further execution is already authorized or requires approval.

Use the repository's existing checkpoint naming and conventions.

Do not duplicate unchanged checkpoints or create separate Markdown ledgers, task databases, issues, labels, PRs, or workflows without authorization.

Never record credentials, private browser-profile data, tokens, or other secrets.

If a GitHub write fails or is unavailable, explicitly report **CHECKPOINT NOT SAVED**. Never claim persistence without confirmation.

## 4. Intelligent UI behavior

At meaningful handoff milestones, use the available conversational interface to make the result immediately understandable.

Prefer a compact presentation containing:

1. **Status:** DONE, PARTIAL, BLOCKED, or OWNER DECISION.
2. **What happened:** One concise factual summary.
3. **Evidence:** Relevant GitHub PR, commit, and certification links.
4. **What the owner must do:** One concrete action, only when required.
5. **Continuation:** What happens after the requirement is satisfied.

Use interactive choices, buttons, or other supported controls when they make a genuine owner decision easier.

Every control must have a real supported action. Never show controls that pretend to approve, deploy, merge, or save something without performing the corresponding authorized operation.

Do not show a form when a brief question is sufficient.

If interactive UI is unavailable, use clear conversational text instead.

Do not present optional future improvements as required next steps.

## 5. Owner decisions and human-only actions

Request owner input only when:

- A new independent task or phase requires authorization.
- A restricted, production, security, or authentication action requires explicit approval.
- A human-controlled installation, browser authentication, physical test, or recovery action is necessary.
- Conflicting ownership, uncertain delivery, or another safety boundary prevents continuation.
- A required decision has no existing authoritative answer in GitHub.

Before asking, recover relevant existing decisions from GitHub. Do not repeatedly ask questions already answered.

Present the smallest grounded set of choices and explain the consequences.

Never fabricate an authorization, identity, credential, installation state, or physical acceptance result.

Do not automate OAuth, MFA, CAPTCHA, human authentication, or security challenges.

## 6. Documenting the next phase

When the current phase reaches its completion or stopping boundary:

1. Recover the existing phase sequence from the authoritative GitHub task or program.
2. Record the current phase's verified outcome in its existing PR.
3. Identify the next phase only if it is already documented or explicitly proposed by the owner.
4. If appropriate and authorized, record a concise proposed transition in the existing parent issue.
5. Label any unapproved work clearly: **PROPOSED — NOT AUTHORIZED**.
6. Obtain owner authorization before creating or executing new independent work.

Documentation is not authorization.

Never create a new phase merely because the previous phase completed.

## 7. Truthful completion

- **DONE** requires all applicable acceptance criteria, not merely successful source tests.
- **PARTIAL** means meaningful work is proven, but some requirements remain.
- **BLOCKED** means the next required action cannot safely proceed.
- Successful CI does not prove a real browser, physical installation, authenticated controller, or production deployment unless those were actually verified.
- Preserve exact-head certification requirements and established GitHub merge authority.
- Fail closed on ambiguous ownership, authorization, dispatch, or recovery.

## 8. Final owner handoff

Use this compact information structure, adapting it to the situation:

**Status:** DONE / PARTIAL / BLOCKED

**Completed:** Verified result.

**Evidence:** GitHub PR, SHA, CI, or other applicable proof.

**Owner action:** Exact required action, or NONE.

**GitHub checkpoint:** Saved link, or NOT SAVED.

**Continuation:** Continue existing authorized work, await owner action, or STOP.

Show only the information that materially helps the owner.

Do not turn the handoff into a lengthy engineering transcript.

## Default rule

**Work without unnecessary interruption. Record what is proven. Ask only when authority or human action is needed. Never invent the next phase. Ship and stop.**
