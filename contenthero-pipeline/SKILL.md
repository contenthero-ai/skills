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

You take a user from an idea to a scheduled or published post, grounded in their real context. You orchestrate the user's own LLM to draft on-brand copy and you execute the production and distribution. **You never write copy server-side and you never invent generic copy.** The draft is the host LLM's, grounded in the user's outliers, brand voice, and past performance, and approved by the user before anything ships.

Read [`../CLAUDE.md`](../CLAUDE.md) first for the auth ladder, the thesis, the hard rules, and the `.contenthero/context.md` cache. The phases below are specific to the pipeline.

## Transport and scopes

Per the auth ladder: prefer **MCP** (`mcp__*contenthero*__*`), else the **CLI** (`contenthero post ...`, `contenthero inspiration ...`, `contenthero brand-account ...`, `contenthero connected-account ...`). Writes are scope-gated: creating and editing posts and destinations needs `pipeline:write`, attaching assets needs `assets:write`, and **publishing needs `publish:write`**. If a call fails on scope, tell the user which scope to grant; do not route around it.

## The phases

Walk them in order. Skip a phase only when the user's request makes it irrelevant (e.g. "just schedule post X" jumps to Schedule).

### 1. Ground (always, before drafting)

Pull the user's real context. This is what makes the draft on-brand instead of generic. Resolve the active brand kit from `.contenthero/context.md` if cached (revalidate it), else `list_brand_kits` then `get_brand_kit`.

- **Brand voice:** `get_brand_kit` gives `voiceProfile`, `audience`, `positioning`, `contentStrategy`, and `sections`. This is the tone, vocabulary, and guardrails.
- **What performs in their niche:** `list_outliers` (ranked by outlier score) surfaces the proven patterns. The list is shallow; `get_inspiration_content` on the top few returns the deep fields (`transcript`, `description`, `hashtags`, `keywords`) you actually mine for hook and structure.
- **What performs for them:** `get_brand_account_performance` returns the user's own `topContent` and `recentContent`. `list_posts` (and `get_post` for `script` / `description`) surfaces their past captions and voice.

Full grounding method, including the list-then-get mining pattern, is in `references/voice-synthesis.md`. Cache resolved ids (brand kit, connected accounts) to `.contenthero/context.md`.

### 2. Draft (the host LLM writes, grounded, approval-gated)

Synthesize the copy (hook, caption, script, hashtags) by **emulating the user's proven patterns in the user's own voice**, following `references/voice-synthesis.md`. There is no server tool that writes copy; the host LLM does the writing, grounded in Phase 1. Then **present the draft to the user and get approval before producing or publishing.** Iterate on their feedback. Never ship copy the user has not seen.

This is the line that defines the skill: grounded voice-synthesis is the feature; generic ungrounded copy is the anti-pattern. If you have no grounding (no brand kit, no outliers, no past posts), say so and ask, rather than inventing a generic caption.

### 3. Produce (optional)

If the post needs new media, delegate to `contenthero-generate` (image, video, audio, board, lip-sync). Ground the visual in the brand kit's visual style. Some posts reuse an existing asset and skip this phase. Capture the resulting media URL or output-id for Phase 4.

### 4. Assemble

Build the post object. Details and field shapes are in `references/posts-and-destinations.md`.

- `create_post` with the title, primary platform, and the approved caption as the description. Optionally place it in a pipeline stage (`list_pipeline_stages` to see stages).
- `add_post_asset` to attach the produced or supplied media (by URL).
- `add_post_destination` for each platform target: platform, format (post, reel, story, short, thread), and the connected account id (`list_connected_accounts`). Set `script` / `notes` via `update_post` if relevant.

### 5. Schedule or publish

- **Schedule:** `schedule_post` with an ISO-8601 time (sets the time on the post and its destinations). Prefer scheduling unless the user explicitly wants to post now.
- **Publish now:** `publish_post` pushes to the live connected accounts immediately. This is irreversible and outward-facing. Requires `publish:write`. Details and the safety gate are in `references/scheduling.md`.

**Hard gate: never schedule or publish without the user's explicit approval of the final content** (the approved draft plus the media plus the destinations). Confirm the targets and timing back to the user before the call.

## Hard rules (pipeline)

1. **No server-side copy, no ungrounded copy.** The host LLM drafts, grounded in the user's outliers, brand voice, and past posts. No grounding means ask, do not invent.
2. **Approval before production and before publish.** Show the draft; show the final post, destinations, and timing. Get a yes.
3. **Publishing is live and irreversible.** Treat `publish_post` with care; prefer `schedule_post`. Confirm destinations and timing first.
4. **Respect scopes.** `pipeline:write`, `assets:write`, `publish:write`. Surface a missing scope; do not work around it.
5. **One transport per session.** Detect once, never cross over, never narrate.
6. **Revalidate cached ids** (brand kit, connected accounts) before assembling or publishing.

## References

- `references/voice-synthesis.md` — the grounding-to-draft methodology (the moat)
- `references/posts-and-destinations.md` — building posts, assets, and platform destinations
- `references/scheduling.md` — scheduling, publishing, and the live-push safety gate
- `references/connected-accounts.md` — reading connected accounts as publish targets
- `references/troubleshooting.md` — scopes, publish failures, error to action mapping
