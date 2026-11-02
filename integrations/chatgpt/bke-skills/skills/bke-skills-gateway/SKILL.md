---
name: bke-skills-gateway
description: Use for BKE repository engineering, debugging, code reviews, CI, and architecture tasks to load the latest relevant BKE engineering skill from the GitHub-canonical BKE Skills MCP server.
---

# BKE Skills Gateway

Treat the target repository's live root `bke.md` and GitHub issues, PRs, CI, and exact-head state as authoritative. Never replace them with this plugin, and never use Notion as engineering truth.

When beginning substantive BKE engineering, call the connected `list_skills` tool once, identify a relevant skill, then call `get_skill` using its `name` and `blob_sha`. Read the returned instructions and apply them **under** the repository's `bke.md` and explicit owner authorization. Do not invent missing skills or claim a skill loaded if tool access failed. If tools are unavailable, explain the limitation and follow repository instructions directly; do not introduce a new service.

The MCP server is **read-only** and returns a certified snapshot of public skills built from `jan2xo/bke-skill` Git source; newly merged skills appear after the next deployment; it does not implement them, assign work, write GitHub, authenticate users, or enforce their behavior. A plugin release is a client entry point, not a new source of truth. For repeated calls during a task, retain the returned revision unless the upstream skill changes.
