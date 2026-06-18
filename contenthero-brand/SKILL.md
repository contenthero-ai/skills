---
name: contenthero-brand
description: |
  Read and update the user's ContentHero brand context: brand kits and their sections (tone of
  voice, vocabulary, banned words, visual identity), plus reads of inspiration accounts, outliers,
  and brand-account performance. This is the context feeder for the other ContentHero skills.
  Use when: (1) "what's in my brand kit", "summarize my tone of voice", "update my brand voice",
  "add a section to my brand kit", "what are my banned words", (2) "which of my inspiration accounts
  has the best outliers", "how is my account performing", (3) any time another skill needs the active
  brand kit resolved and cached. Writes the resolved brand kit and identity ids to
  .contenthero/context.md so contenthero-pipeline and contenthero-generate do not re-discover them.
  NOT for: generating media (use contenthero-generate), or drafting and publishing posts
  (use contenthero-pipeline).
argument-hint: "[brand question or update]"
homepage: https://contenthero.ai
allowed-tools: Bash, WebFetch, Read, Write, mcp__contenthero__*
---

# ContentHero Brand

> SCAFFOLD. The full brand workflow lands in Slice 4: brand kit reads and section edits, inspiration and performance reads, and writing the `.contenthero/context.md` cache. Until then, follow `CLAUDE.md` at the repo root.

Read the runtime contract in [`../CLAUDE.md`](../CLAUDE.md) first: transport detection and the shared-state cache schema.

This skill resolves the active brand kit, summarizes the user's voice (tone, vocabulary, banned words), and caches the brand kit id and any default identity ids into `.contenthero/context.md` for the other skills. It also surfaces inspiration outliers and brand-account performance as grounding reads.

References (added in Slice 4):
- `references/brand-kit-structure.md` — brand kit and section anatomy
- `references/inspiration.md` — inspiration accounts, outliers, and content reads
- `references/troubleshooting.md` — error to action mapping
