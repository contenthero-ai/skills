---
name: contenthero-generate
description: |
  Generate media with ContentHero: image, video, audio, reference boards, and lip-sync.
  Execution only, no copywriting. Handles output-id chaining (feed a prior result straight
  into the next generation as a reference, by URL or by output-id token), cost preflight
  (preview the spend, charges nothing), and async smart-wait with standalone polling.
  Use when: (1) generating any image, video, audio, reference board, or lip-sync via ContentHero,
  (2) "make an image of...", "generate a video of...", "create a voiceover", "build a reference board",
  "lip-sync this clip", "upscale this", (3) chaining one generation into another (image to video,
  board to image), (4) checking or waiting on a ContentHero generation by id.
  Picks the right ContentHero model from the live roster and previews cost before spending.
  NOT for: writing captions, scripts, or copy (the host LLM drafts those, grounded by
  contenthero-pipeline), publishing or scheduling posts (use contenthero-pipeline), or
  reading and editing the brand kit (use contenthero-brand).
argument-hint: "[what to generate] [--model <id>]"
homepage: https://contenthero.ai
allowed-tools: Bash, WebFetch, Read, Write, mcp__contenthero__*
---

# ContentHero Generate

> SCAFFOLD. The full generation workflow lands in Slice 2 (transport ladder, model selection from the live roster, cost preflight, output-id chaining, async wait, and the references). Until then, follow `CLAUDE.md` at the repo root for the auth ladder and hard rules.

Read the runtime contract in [`../CLAUDE.md`](../CLAUDE.md) first: transport detection, the no-copywriting rule, cost preflight, and the `.contenthero/context.md` shared cache.

References (added in Slice 2):
- `references/model-catalog.md` — the live ContentHero model roster and what each is for
- `references/identity.md` — avatars, looks, and boards as the reference library
- `references/media-inputs.md` — references by URL or output-id token
- `references/chaining.md` — feeding one generation into the next
- `references/troubleshooting.md` — error to action mapping
