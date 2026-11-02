# BKE Skills MCP — proven ChatGPT access and release runbook

**Authority:** Root [bke.md](../bke.md), live GitHub task/PR/CI, and explicit operator decisions outrank this runbook. GitHub is source and durable release ledger; Cloudflare serves a **derived, public, read-only, immutable-at-build** snapshot. This is a record of demonstrated capability and the existing minimal release procedure, **not** permanent authorization for future deployments.

## 1. What has actually been proved

| Capability | Proof | Boundary |
|---|---|---|
| ChatGPT can invoke the connected BKE Skills MCP `list_skills` and pinned `get_skill` tools and read actual skill Markdown | [PR #13 production checkpoint](https://github.com/jan2xo/bke-skill/pull/13#issuecomment-6583273579); live ChatGPT calls after the 2026-11-02 17:05 UTC deployment returned both exact skill blobs and full `skill_text` | Proves the tools in that connected ChatGPT session, **not** every client, session, or account |
| ChatGPT can inspect GitHub source, PRs, CI and write authorized PR checkpoints through the connected GitHub connector | [PR #12 source merge checkpoint](https://github.com/jan2xo/bke-skill/pull/12#issuecomment-6582849222); [PR #13 checkpoint](https://github.com/jan2xo/bke-skill/pull/13#issuecomment-6583273579) | Connector grants and repo permissions still govern each future action |
| ChatGPT can use the authenticated Cloudflare connector to read a deployment baseline and upload a verified compiled Worker module to the **existing** script | [PR #13 checkpoint](https://github.com/jan2xo/bke-skill/pull/13#issuecomment-6583273579); provider version/deployment verification after upload | Not a general permission to change DNS, secrets, auth or other Workers |
| GitHub Actions can build a pinned source revision into an auditable Worker bundle for transfer when the conversational runtime has no npm/build environment | Release ledger [#4](https://github.com/jan2xo/bke-skill/pull/4), [#7](https://github.com/jan2xo/bke-skill/pull/7), [#10](https://github.com/jan2xo/bke-skill/pull/10), [#13](https://github.com/jan2xo/bke-skill/pull/13) | Temporary CI additions were **not merged** into canonical main |
| Live raw HTTP MCP `initialize`, `tools/list`, `list_skills` and `get_skill` can be tested from GitHub Actions | Prior release [#10](https://github.com/jan2xo/bke-skill/pull/10) and run [#41453174934](https://github.com/jan2xo/bke-skill/actions/runs/41453174934) | This external HTTP check was not repeated for the two-skill release; live **native ChatGPT** retrieval was repeated successfully |
| The owner-handoff **skill instruction** contains Intelligent UI behavior | [Owner Handoff SKILL.md](../skills/bke-owner-handoff/SKILL.md); direct pinned `get_skill` returned the section | A skill does **not itself render UI**, grant actions, enforce policy or prove separate GUI/computer control |

**Do not repeat a proof-of-capability discovery project** if these durable records answer the historical question. **Do still** inspect available tools and current authorization in each session, and collect **fresh source-SHA, bundle-hash, provider-version, and live-list/get evidence for every new release**. Historic availability does not certify new bytes.

## 2. Canonical release boundaries

- One owner-authorized **exact GitHub main commit**. Never silently deploy newer `main`, a PR branch, local uncommitted files or an older release bundle.
- Preserve exactly the approved public read-only MCP tools (`list_skills`, `get_skill`), existing Worker `bke-skills-mcp`, account, compatible runtime, and `workers.dev` endpoint. No GitHub authentication or runtime secret required.
- No production deploy without explicit owner authorization. Do not automate OAuth, MFA, CAPTCHA or human security challenges.
- A **temporary release-only PR** is a GitHub execution ledger and CI transport only. **Close without merge.** Any permanent runbook/source change belongs in a separate normal PR.
- Do not add a new build host, queue, agent service, secret, schedule, or task database just because the conversational runtime has no shell.

## 3. Repeat the already-proven minimal release procedure

1. **Recover authority.** Read repository `bke.md`, latest relevant GitHub PRs/issues and this runbook. Verify the operator explicitly authorized the precise source SHA and existing Cloudflare Worker; check there is no concurrent release/ownership ambiguity.
2. **Record source pins.** Read `main` and its Git tree. Capture `git rev-parse HEAD:skills/<name>/SKILL.md` for each approved skill, exact `wrangler.jsonc`, plugin MCP URL and required tests. A merged skill is NOT automatically deployed; the catalog is generated from committed Git source.
3. **Snapshot production before writes.** Through the connected Cloudflare API, inspect the worker name/account, active version/deployment (100% traffic), subdomain enabled/previews state, bindings and compatibility date. Save the **immutable current version ID as rollback target**. Stop on unexpected drift.
4. **Create ONE temporary release-only PR from current main.** Limit the diff to temporary additions in `.github/workflows/mcp-check.yml`. Use an **independent second checkout** pinned to the *authorized exact source SHA*, separate from the release PR head. Do not change `src/`, `skills/`, dependencies or `main` to ship the release.
5. **Certify and bundle in GitHub Actions.** Run `npm ci --no-audit --no-fund`, `npm test`, `npm run build:catalog`, `npx wrangler deploy --dry-run --outdir ...`. Check the separate checkout `HEAD`, clean Git status, **all** expected skill blob SHAs, snapshot source commit and count, and `workers_dev:true` where the published plugin URL is on `workers.dev`. Require exactly one JavaScript Worker module and confirm that it contains the pinned source and skill identifiers.
6. **Transfer without claiming a local build.** The proven temporary workflow emits the compiled module as deterministic gzip/base64 chunks in the CI log, together with source SHA, file name, byte length and SHA-256 digest. Verify chunk offsets, total length, source metadata and complete run SUCCESS. This is public release code: never print credentials or private data in logs. An equally verifiable GitHub artifact transfer is acceptable if the connector can actually read it; do not assume artifact access.
7. **Independently validate bytes and recheck Cloudflare.** In the authenticated Cloudflare connection, reconstruct/decompress the exported module, rehash its **actual bytes** to the CI SHA-256, check its byte length and embedded immutable source/skill identities, and compare the current provider version, route and bindings to the saved baseline **immediately before write**. Stop on mismatch. An asserted source SHA in a label alone is not sufficient.
8. **Upload only the existing Worker code.** Use the Cloudflare Workers script-content endpoint with the verified module as `main_module`; retain the existing public route, compatibility and empty bindings. The content upload may automatically deploy to 100% traffic; inspect its response and the provider's version/deployment list. No other production changes.
9. **Verify the live service.** Confirm the new immutable version at 100%, same `workers.dev` enabled, previews disabled, bindings/compatibility unchanged, and previous version retained. Invoke **native ChatGPT BKE Skills** `list_skills`, then pinned `get_skill` for **each** approved exact blob; require readable, correct full Markdown. If required by the specific release plan, run independent raw HTTP MCP handshake/list/get via GitHub Actions.
10. **Record and finish.** Post in the *same release PR* the exact authorized main SHA, release PR head, successful CI run/job, bundle bytes/SHA-256, Cloudflare version/deployment IDs, previous rollback version, route/bindings, native client results, counterevidence and follow-up. Close the **temporary release PR unmerged**. Verify canonical `main` unchanged.

**Stop / rollback:** On content hash mismatch, unexpected account/route/permissions, stale source, changed baseline, missing CI evidence or unavailable authenticator, stop before write. If upload occurred but live acceptance fails, use the Cloudflare deployment-version API to restore the **verified previous immutable version** (do not use `force` to bypass safety checks), verify the public MCP and document the incident. If rollback authorization or safety is ambiguous, stop and request operator action rather than improvising.

## 4. Evidence record — successful two-skill release, 2026-11-03 PHT

- **Authorized canonical main:** [`fbaf0e8265554e122130033162ea38a97c9d9ae2`](https://github.com/jan2xo/bke-skill/commit/fbaf0e8265554e122130033162ea38a97c9d9ae2).
- **Skill blob pins:** `bke-lean-engineering@099af3c9a31c53fee95eedb2a8a27b4a81f52a9d`; `bke-owner-handoff@f48f576ba0cf2e898fa3aa691da799118c69de0f`.
- **Release-only ledger:** [PR #13](https://github.com/jan2xo/bke-skill/pull/13); exact PR head `08bc25d151b4576d1c85a80e5b9026a31b02e198`, **CLOSED WITHOUT MERGE**. Verified build [run #41487214210](https://github.com/jan2xo/bke-skill/actions/runs/41487214210), SUCCESS.
- **Verified bundle:** `index.js`, 1,237,262 bytes; SHA-256 `d84f2bc3075b98023cba2ca1467654569262324062daa107b0a10adc77a73740`. Independent decompression and hash through connected Cloudflare tool PASS.
- **Cloudflare:** existing script `bke-skills-mcp` updated to version 4 `42b4acce-a20e-4680-90d2-620b8abe9503`, deployment `2c295277-aab4-48b5-9a4e-9c7967df0ea9` at 100%; `workers.dev` enabled, previews disabled, bindings empty. Previous rollback version 3 `3254f647-730e-4936-b0c5-3a6ac2f8a8b2` retained.
- **Live native ChatGPT test:** `list_skills` returned two skills, deployed tree `1b1fabebc2dea463e23c5758871924031c396c2d`. Pinned `get_skill` returned full Lean Markdown (3,281 characters) and Owner Handoff Markdown (7,115 characters) including `## 4. Intelligent UI behavior`. **Both PASS**.
- **GitHub evidence:** [production release and live-client checkpoint](https://github.com/jan2xo/bke-skill/pull/13#issuecomment-6583273579). No cross-service mutation, browser authentication, UI automation, or independent external raw MCP re-test was claimed for this deployment.

## 5. Interpretation for future BKE conversations

The proven system is: **GitHub source → immutable compiled skill snapshot in GitHub Actions → verified bundle via authenticated Cloudflare connector → public read-only MCP → native ChatGPT tool calls returning actual skill Markdown**.

This establishes a repeatable **tool-and-artifact execution chain** and demonstrates that ChatGPT can directly read GitHub and call the connected Cloudflare and BKE Skills tools in the tested session. It is **not** evidence that ChatGPT automatically executes skills, uses a computer, independently authenticates to Chrome, creates its own authoritative tasks, or can skip real-world acceptance.

**Reusable historical capability proof is not reusable exact-head release proof.** Read the existing ledger instead of rediscovering the connector; certify every changed artifact instead of pretending old CI validates new bytes.
