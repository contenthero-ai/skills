---
name: contenthero-pipeline
description: |
  Run the ContentHero content pipeline end to end: ground a post in the user's inspiration
  outliers and brand voice, have the host LLM draft on-brand copy in the user's own voice
  (grounded, never generic, approval-gated), produce the media, assemble the post, and
  schedule or publish it to connected accounts. The hero skill.
  Use when: (1) "turn this idea into a post", "write me an on-brand caption", "draft a hook for my reel",
  "make a post and schedule it", "publish this to my accounts", (2) the user wants copy that emulates
  their proven patterns and their own voice, (3) any flow from research or idea to a published or
  scheduled post. The skill pulls the user's outliers, brand kit tone and vocabulary, and their own
  recent and top-performing posts, then the host LLM drafts emulating what works for this user.
  ContentHero never writes copy server-side: the skill supplies the grounding and the method, the
  host LLM writes the words, and the user approves before anything ships.
  NOT for: bare media generation with no post (use contenthero-generate), or generic copywriting
  with no grounding in the user's real context (that is the anti-pattern this skill exists to replace).
argument-hint: "[idea or post goal]"
homepage: https://contenthero.ai
allowed-tools: Bash, WebFetch, Read, Write, mcp__contenthero__*
---

# ContentHero Pipeline

> SCAFFOLD. The full pipeline lands in Slice 3: the phased flow (Ground, Draft, Produce, Assemble, Schedule/Publish), the `voice-synthesis.md` grounding-to-draft methodology, and the references. Until then, follow `CLAUDE.md` at the repo root.

Read the runtime contract in [`../CLAUDE.md`](../CLAUDE.md) first. The defining rule of this skill: ContentHero never generates copy server-side. The host LLM may draft, but only grounded in the user's real context (outliers plus brand voice plus past posts), never generic, never published without approval.

Phases (built in Slice 3): Ground (`list_outliers` + `get_brand_kit` + `list_posts` + `get_brand_account_performance`) → Draft (host LLM synthesizes on-brand copy, approval-gated) → Produce (delegate to contenthero-generate) → Assemble (`create_post` + `add_post_asset` + `add_post_destination`) → Schedule or Publish (`schedule_post` / `publish_post`, scope-gated on `publish:write`).

References (added in Slice 3):
- `references/voice-synthesis.md` — the grounding-to-draft methodology (the moat)
- `references/posts-and-destinations.md` — building posts and platform destinations
- `references/scheduling.md` — scheduling and publishing
- `references/connected-accounts.md` — reading connected accounts
- `references/troubleshooting.md` — error to action mapping
