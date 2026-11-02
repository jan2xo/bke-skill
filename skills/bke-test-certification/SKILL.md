---
name: bke-test-certification
description: Verify that BKE tests, CI jobs, and artifacts establish the declared acceptance boundary for an exact source revision. Use for certification planning, CI evidence audits, or release-proof checks; do not impose heavy certification on ordinary low-impact edits.
---

# BKE Test Certification

Establish what the evidence actually proves using the smallest complete verification graph. Follow the target repository's current `bke.md`, explicit owner decisions, and live GitHub task. This skill includes evidence integrity; it grants no merge, deployment, signing, credential, physical-test, or production authority.

## Define the claim

Recover the exact candidate head/base, relevant diff and callers, authorized acceptance criteria, and existing workflows before choosing checks. Record a compact mapping in the existing PR:

`requirement -> check or observation -> exact source/artifact -> acceptance boundary`

Separate source implementation, native/runtime behavior, and production operation. Record required, not-required, and unavailable proof with reasons. Do not turn optional evidence into a new acceptance gate or reduce an existing requirement to make checks pass.

## Inspect actual execution

- Inspect the workflow definition and trigger that produced the run, then the source actually checked out by the relevant job. On issue-comment or dispatch runs, the workflow/run SHA may differ from the tested PR source. A PR-head checkout does not imply the run used that branch's new workflow steps.
- Verify required jobs and steps completed, the intended test commands ran, and their assertions cover the changed requirement. An aggregate success, test-file presence, test count, cached artifact, or author checkpoint alone is insufficient.
- Distinguish failure, cancellation, and skipped work. An intentionally irrelevant skipped job is not a failure; a skipped required proof is not certification.
- Inspect the first actionable causal failure before proposing a correction. Preserve requirements and controls; do not rerun blindly, weaken detectors, or redesign around a wrapper error.
- Reuse valid evidence for the unchanged exact candidate. A head change invalidates evidence that no longer proves the candidate; rerun only the necessary graph and obtain renewed review where required.

## Verify the changed boundary

Use existing tests and tools. For changed interfaces, exercise representative legitimate and relevant invalid/stale/conflicting inputs through actual receiving code, including error transport and important side effects. Pure unit tests, recorded responses, mocks, subprocess tests, controlled browser fixtures, and live provider calls prove different things; identify which was used.

Source-text assertions can guard configuration or accidental removal but cannot establish lifecycle behavior, concurrency, delivery, or actual integration. Avoid tests that merely repeat implementation wording. Keep scenarios proportional to the changed behavior and consequence of failure; documentation-only changes can need only focused source checks and review.

Execute only within the authorized environment. A verification plan does not authorize destructive fault injection, installing software, signing, contacting production, sending browser messages, or accessing secrets. Preserve human authentication and existing CI trust/permission boundaries.

## Bind artifacts to their evidence

When packaging or release integrity is in scope:

- Verify the artifact's actual bytes and digest against the trusted build record, and establish which source and build produced it. A filename, embedded label, claimed SHA, or successful download alone is not provenance.
- Inspect required manifest/version, signature/trust identity, platform, and packaging checks for the actual artifact type. A signature or checksum alone does not establish all of these.
- Verify the consumed/installed/deployed artifact is the intended one when that operation is authorized. Retained earlier artifacts and stale caches must not substitute for the current candidate.
- Do not require signing, SBOMs, attestations, or new storage/pipelines without a product requirement. Never include secret values or private data in evidence.

## Report the proven boundary

Use the repository's existing DONE / PARTIAL / BLOCKED conventions for the declared task. Include exact source and relevant artifact identity, required run/job/check links, the result of actual execution, first causal failure or counterevidence, and remaining unverified claims.

Source CI does not certify an authenticated browser, physical device, native installation, real provider side effects, or production deployment unless the required environment and behavior were actually exercised. A source-only milestone may be DONE while its parent product remains PARTIAL. Missing required live evidence remains unverified even when every source test passes.

Publish a concise checkpoint to the existing PR only when authorized and verify that it was saved. Recommend the smallest necessary next action, or none. Stop at the accepted boundary; do not create a new certification framework or follow-on phase.
