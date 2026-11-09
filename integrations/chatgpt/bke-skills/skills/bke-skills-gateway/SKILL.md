---
name: bke-skills-gateway
description: Use for BKE repository engineering, debugging, code reviews, CI, and architecture tasks to load the latest relevant BKE engineering skill from the GitHub-canonical BKE Skills MCP server.
---

# BKE Skills Gateway

Treat the target repository's live root `bke.md` and GitHub issues, PRs, CI, and exact-head state as authoritative. Never replace them with this plugin, and never use Notion as engineering truth.

When beginning substantive BKE engineering, call the distinct `primary_skill({})` read-only tool first. The legacy `get_skill({name: "bke-lean-engineering"})` call remains supported for older clients, but is not the normal entry point. Read the complete primary Markdown and inspect its `available_skills` index from the same bundled `tree_sha`. Select the smallest sufficient existing set for the task, then read additional selected skills via `get_skill({name, blob_sha})` using the returned immutable SHAs **before** doing work they govern. Keep that snapshot for the task; reconcile stale revisions rather than silently mixing releases. `list_skills` remains compatible for older clients and as a fallback if a still-deployed primary response lacks the index, but is not a compulsory first step. Apply all skill instructions **under** the repository's `bke.md` and explicit owner authorization. Do not invent missing skills or claim a skill loaded if retrieval failed. If tools are unavailable, explain the limitation and follow repository instructions directly; do not introduce a new service.

Skill selection boundary: bke-forge-bounded-execution is **FORGE-only**. Load it only for an explicitly owner-assigned BKE FORGE session in ChatGPT. Do not apply it to Codex, Sol, or other agents simply because they use BKE GitHub or this catalog. bke-causal-investigation is a reusable diagnostic skill and does not impose FORGE session limits. Never infer FORGE identity merely from the model name.

The MCP server is **read-only** and returns a certified snapshot of public skills built from `jan2xo/bke-skill` Git source; newly merged skills appear after the next deployment; it does not implement them, assign work, write GitHub, authenticate users, or enforce their behavior. A plugin release is a client entry point, not a new source of truth. For repeated calls during a task, retain the returned revision unless the upstream skill changes.
