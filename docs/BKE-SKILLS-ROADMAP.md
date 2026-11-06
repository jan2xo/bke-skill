# BKE Skills roadmap and delivery checklist

This is the agreed capability map and milestone checklist for BKE Skills. Root [bke.md](../bke.md), explicit owner decisions, and live GitHub PR/CI/release state govern execution. A candidate listed here is not an authorized implementation task.

**Published state verified: 7 November 2026, Asia/Manila.** The connected production catalog lists six skills at source tree `24f2573a9c73b423b779655ad3ab4552a300cb07`, matching current main `c6fcf88f43e035109b5c4d4a8edd95f648c11660`; all six native `get_skill` calls returned full Markdown. The proposed decision-discipline skill below is not in that live snapshot. Historical four-skill release evidence remains in [PR #18](https://github.com/jan2xo/bke-skill/pull/18#issuecomment-6586188924), closed without merge.

Checked items below describe the specific completed milestone, not completion of the whole product. Current PR heads, required CI, reviews, merge and live publication must be rechecked in GitHub; this document is not a per-push execution ledger.

## 1. Current skill inventory

| Skill | Responsibility | Source and live status |
|---|---|---|
| [bke-causal-investigation](../skills/bke-causal-investigation/SKILL.md) | Evidence-led diagnosis and discriminating experiments before speculative fixes | On main and retrieved through the live MCP at blob `aecbdc9d0030265841a1c9d49c895d686f777c6b` |
| [bke-decision-discipline](../skills/bke-decision-discipline/SKILL.md) | Decide whether and where to change code; carry CI constraints, policy boundaries and current-state decisions into execution | Proposed source addition; source CI and behavioral evaluation belong to its PR. Not yet merged or published to the live MCP |
| [bke-forge-bounded-execution](../skills/bke-forge-bounded-execution/SKILL.md) | Explicitly assigned FORGE session execution and recovery; does not apply to Codex/Sol | On main and retrieved through the live MCP at blob `813199116212437fcc0820b98211a885eb33a62f` |
| [bke-lean-engineering](../skills/bke-lean-engineering/SKILL.md) | Authorized scope, reuse, minimum complete change and verification, completion boundaries | On main and retrieved through the live MCP at blob `93af0e8cb0f21bb460fcd18c9ccf85c30630aecd` |
| [bke-owner-handoff](../skills/bke-owner-handoff/SKILL.md) | Meaningful checkpoints, precise blockers, necessary owner decisions and truthful handoffs | On main and retrieved through the live MCP at blob `f48f576ba0cf2e898fa3aa691da799118c69de0f` |
| [bke-security-review](../skills/bke-security-review/SKILL.md) | Relevant trust boundaries, misuse/failure paths, material findings and review provenance | On main and retrieved through the live MCP at blob `6a0b043eb370d3ef87f81373be7801cd50a9e69d` |
| [bke-test-certification](../skills/bke-test-certification/SKILL.md) | Actual CI execution, interface proof, evidence/artifact integrity and acceptance boundaries | On main and retrieved through the live MCP at blob `ce5dafb51ea632e967b7d3f5091cd642d36757ed` |

A retrieved skill supplies guidance. It does not grant authority, enforce agent behavior, create an independent reviewer, render an interface, or prove a native/production outcome.

## 2. Potential capabilities and consolidation

These are candidates and coverage decisions, not a queue of approved new skills.

| Capability discussed | Present disposition | What would justify separate work |
|---|---|---|
| Repository reconnaissance | Basic recovery remains in `bke.md`; specialist skill is a lower-priority candidate | A recurring need for a reusable procedure to trace unfamiliar repositories, dependencies, callers and operating state beyond existing recovery instructions |
| Security review | Prioritized; implemented as `bke-security-review` in PR #17 | Further changes should address demonstrated gaps in review practice, without turning every ordinary edit into an audit |
| Test certification | Prioritized; implemented as `bke-test-certification` in PR #17 | Further changes should address demonstrated proof gaps using the minimum complete verification graph |
| PR lifecycle | Covered by current repository rules and foundational skills; no separate skill planned now | A repeatable operational procedure that adds useful detail beyond fresh-PR, exact-head, review and merge-authority rules already present |
| Worker identity | Later specialist candidate; no standalone skill implemented | A defined inspection task against real authoritative assignment, session-isolation and identity contracts; guidance must not invent or implement those guarantees |
| Evidence integrity | Consolidated into Test Certification | Split only if a substantial independently useful workflow emerges; avoid duplicating SHA, artifact, checkout and provenance rules |
| Architecture compliance | Check relevant canonical responsibilities/contracts during reviews; no standalone skill implemented | A recurring architecture-review workflow broad enough to justify its own procedure; security tracing does not claim exhaustive business/architecture compliance |
| Skill discovery and activation metadata | Existing list/get delivery works; richer selection metadata is proposed | A focused change to expose short descriptions or necessary activation guidance when names alone are insufficient; no semantic search service is required |

Do not create all candidates merely to complete this table. Before adding a skill, identify its activation condition, useful procedure beyond existing rules, authority boundary, minimum evidence, and stopping condition. Existing skills should remain focused.

## 3. MCP delivery decision

Use the **existing single public read-only BKE Skills MCP** for these instruction-only skills. Retain `list_skills` and `get_skill`; do not create one server per skill.

- The current gateway requires one catalog listing when beginning substantive BKE engineering, followed by relevant pinned retrieval. Retain the selected revision during the task.
- Avoid repeating discovery for ordinary tool calls, commits or progress messages. Refresh when a revision is rejected or a changed catalog is genuinely needed.
- The current catalog returns name, blob SHA, path and source. It does not expose descriptions/activation guidance; improving that is a proposal, not delivered functionality.
- Consider a separate MCP only for a concrete access, credential, operation, ownership, runtime, release or failure-containment boundary.
- Operational tools remain in the systems that own those operations, such as GitHub and CI. A security-review skill on another server would not by itself create independent review authority.

The [gateway instructions](../integrations/chatgpt/bke-skills/skills/bke-skills-gateway/SKILL.md) define the actual loading contract. Any future change to that contract needs its own authorized scope and evidence.

## 4. Delivery checklist

### Foundation and current published release

- [x] One read-only catalog exposes `list_skills` and `get_skill`.
- [x] Skill source and immutable blob identities are derived from committed Git.
- [x] Lean Engineering and Owner Handoff are implemented on main.
- [x] The revised Lean completion/interface rules were merged through [PR #15](https://github.com/jan2xo/bke-skill/pull/15).
- [x] Live catalog listing and pinned full-text retrieval of the two foundational skills were verified for the snapshot above.
- [x] A [release runbook](BKE-SKILLS-MCP-RELEASE-RUNBOOK.md) records the existing publication, validation, rollback and owner-authorization boundaries.

### Specialist source implementation — PR #17

- [x] Implement Security Review with explicit activation, authority, review provenance and stopping boundaries.
- [x] Implement Test Certification, including evidence integrity and source/native/production distinctions.
- [x] Extend existing tests to verify all four committed payloads and stale-revision rejection.
- [x] Extend local HTTP MCP smoke to verify the actual catalog and pinned full-text/tree/blob retrieval for all four skills.
- [x] Initial implementation head `3e7d1da993ce812630c0c8da2f477cad2ab33d1a` passed [CI 41503682530](https://github.com/jan2xo/bke-skill/actions/runs/41503682530): 5/5 tests, dry-run and all-four-skill local MCP retrieval.
- [x] That initial implementation received an attributed fresh-context [ACCEPT_SOURCE_ONLY review](https://github.com/jan2xo/bke-skill/pull/17#pullrequestreview-5741658992), including three bounded behavioral scenarios.
- [x] Merge specialist source through owner-authorized, SHA-locked PR #17 after final-head CI/review; canonical source `a12eeef544ffdde6184ad3c68e66f4ae0061fb7e`.
- [x] Obtain explicit owner GO and release-runbook authorization for publication of the resolved canonical source to the existing Worker.
- [x] Complete the runbook with fresh source/bundle/provider evidence: version `3545ac53-0ddf-476f-8b91-fa09af1ff412` at 100%, previous rollback version retained; see [release ledger](https://github.com/jan2xo/bke-skill/pull/18#issuecomment-6586188924).
- [x] Verify the production/native-client catalog lists four skills and each pinned `get_skill` returns full Markdown exactly matching canonical GitHub.
- [x] Record publication evidence and update the inventory to published.

The initial CI/review links prove their pinned implementation head. They do not automatically certify a later PR head. The final source head `80fb21595baba2c9f77bca1e720815629f0d5ba4` passed [CI 41504874117](https://github.com/jan2xo/bke-skill/actions/runs/41504874117) and [independent-context review](https://github.com/jan2xo/bke-skill/pull/17#pullrequestreview-5741751014) before merge. The release independently built and tested the exact merged canonical source; this publication-status update changes no skill or runtime bytes. Sub-agent review means a fresh context that did not implement the candidate; the publisher account was also the PR author, so the COMMENT verdict is not separate-account formal approval.

The local skill-creator validator could not start because PyYAML was unavailable. CI's existing builder checked names/frontmatter/source identity and the independent reviewer inspected YAML and activation. This is not a claim that the unavailable validator ran. Three scenarios demonstrate bounded application, not universal agent compliance.

### Potential work — not yet implemented as separate capabilities

- [ ] Decide whether catalog descriptions are needed, then authorize a focused metadata change if justified.
- [ ] Evaluate recurring reconnaissance needs before proposing a separate skill.
- [ ] Evaluate recurring PR-lifecycle gaps before proposing a separate skill.
- [ ] Define a concrete identity-inspection use case before proposing Worker Identity.
- [ ] Evaluate whether architecture compliance needs a dedicated procedure beyond existing reviews.
- [ ] Use real task outcomes to improve specialist guidance when demonstrated failures justify a narrow correction.

Evidence Integrity is intentionally included in Test Certification; it is not an uncompleted requirement to create another skill. Separate MCP servers, autonomous planners, extra task databases and new certification infrastructure are not requirements of this roadmap.

## 5. Maintaining this map

Update the existing row/checklist when a capability changes status, is merged/published, is deliberately deferred, or a candidate is consolidated. Link canonical PR/release evidence. Do not create a diary, duplicate raw logs, copy skill contents here, or infer authorization from an unchecked item.

Implementation, independent assessment, source merge, production publication, native-client retrieval, and observed agent behavior are separate milestones. Mark only the milestone actually proved.
