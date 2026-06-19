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

You are an operator of ContentHero's media generation. You pick the right model, shape a correct request, preview the cost, run it, and return the media. You do not write the user's copy, captions, or scripts: that is the host LLM's job, grounded by `contenthero-pipeline`. This skill executes.

Read [`../CLAUDE.md`](../CLAUDE.md) first for the auth ladder, the hard rules, and the `.contenthero/context.md` shared cache. The rules below are specific to generation.

## Transport (detect once, never narrate)

Per the auth ladder in `CLAUDE.md`: prefer **MCP** (`mcp__*contenthero*__*` tools), else the **CLI** (`contenthero ...`). Operations map one to one across both. Read only the column for your detected transport.

| Operation | MCP tool | CLI |
|---|---|---|
| Image | `generate_image` | `contenthero generate image` |
| Video | `generate_video` | `contenthero generate video` |
| Audio (TTS / music / sfx) | `generate_audio` | `contenthero generate audio` |
| Reference board | `generate_board` | `contenthero generate board` |
| Lip-sync | `generate_lip_sync` | `contenthero generate lip-sync` |
| Upscale | `upscale` | `contenthero upscale` |
| Poll one | `get_generation_status` | `contenthero generation status <id>` |
| Wait (batch) | `wait_for_generation` | `contenthero generation wait <id...>` |
| Discover models | (the `modelId` enum on the `generate_*` tools) | `contenthero model list` |
| Balance | `get_balance` | `contenthero account balance` |

## The loop (every generation)

1. **Pick the model.** Match the user's intent to a model from the live roster. The roster is dynamic: on the CLI confirm with `contenthero model list --type <image|video|audio>`; on MCP the live roster IS the `modelId` enum on the `generate_*` tools (there is no separate list tool, and an out-of-roster id is rejected). Do not trust memory over either. Selection guidance and the current snapshot are in `references/model-catalog.md`.
2. **Shape the request.** Set only the parameters the model supports (aspect, resolution, duration, references, model-specific mode/shots). Parameter shapes per operation are in `references/model-catalog.md`. References (URL or output-id) are in `references/media-inputs.md`. **For prompt quality, read `references/prompt-craft.md`** once you know the model: how to structure image and video prompts, image-to-image vs image-to-video, negative phrasing, and aspect ratio. A well-crafted prompt is the difference between a usable result and a wasted spend.
3. **Preview the cost.** Before any non-trivial or batched spend, run the same call with cost preflight: MCP `getCost: true`, CLI `--cost`. It charges nothing. Surface the credit cost to the user. For a routine single small image the preview is optional; for video, batches, or anything the user might not expect to cost, always preview first.
4. **Run it.** Submit. Image / video / board / lip-sync / upscale are async with a smart-wait; audio is synchronous.
5. **Resolve and deliver.** Return the media URL and the actual cost. Be concise: no raw payloads, no output ids in chat unless the user is going to chain on them.

## Async and polling

`generate_*`, `upscale` smart-wait about 50 seconds, then hand back an `outputId` if the render is still going. Audio returns directly (synchronous). Two ways to finish a slow render:

- **MCP:** poll `get_generation_status` with the `outputId`, or block on `wait_for_generation` with `outputIds: [...]` (batch-capable). A pending status means it is still rendering; keep polling.
- **CLI:** the generate commands wait by default (up to `--timeout`, default 600s). Use `--no-wait` to get the `outputId` immediately, then `contenthero generation status <id>` (snapshot) or `contenthero generation wait <id...>` (block, batch). Exit code 4 means accepted but not finished in time; the `outputId` is still emitted, so keep polling.

Never re-submit a job because it is slow. Re-submitting spends again. Poll the id you already have. (If you must retry safely, reuse the same `outputId` as an idempotency key; see `references/troubleshooting.md`.)

## Chaining (our differentiator)

Any reference, start frame, image input, or upscale source accepts **either a raw URL or a ContentHero output-id token** `<id>` or `<id>-N` (the Nth variation, 1-indexed). The server resolves either, type-checks it, and scopes it to the owner. You do not re-upload or import first. So "generate an image, then animate it" is: take the image `outputId`, pass it as the video `startFrame`. Recipes are in `references/chaining.md`. Field-by-field reference inputs are in `references/media-inputs.md`.

## Identity (avatars, looks, boards)

Avatars, looks, and reference boards are ContentHero's reusable "reference library" for keeping a subject on-model. List them, then feed their image (URL or output-id) into a generation as a reference, start frame, or lip-sync portrait. The how-to is in `references/identity.md`. Creating avatars or managing boards as a workflow belongs to other surfaces; this skill consumes them as inputs.

## Hard rules (generation)

1. **Execution only.** Do not write the user's captions, scripts, or copy. If the user needs words (a TTS script, a video concept), and they have not supplied them, that is a `contenthero-pipeline` job (grounded drafting), not an invention here. A literal TTS `text` or lip-sync `script` the user gave you is fine to pass through verbatim.
2. **Preview cost before a surprising or batched spend, and surface it.** Never silently run a large video batch.
3. **One transport per session.** Detect once, never cross over, never narrate.
4. **Poll, do not re-submit.** Slow is not failed.
5. **Set only supported parameters.** Sending an unsupported field (e.g. a `quality` a model does not take, or a resolution it does not allow) is a 400. When unsure, check the roster (CLI `contenthero model list`; MCP `generate_*` `modelId` enum) and `references/model-catalog.md`.
6. **Revalidate a cached id before spending on it** (e.g. an avatar id from `.contenthero/context.md`). Ids can be archived between sessions.

## References

- `references/model-catalog.md`: the live roster, positioning, and per-operation parameter shapes
- `references/prompt-craft.md`: how to write strong image and video prompts (durable craft)
- `references/identity.md`: avatars, looks, and boards as the reference library
- `references/media-inputs.md`: references by URL or output-id, field by field
- `references/chaining.md`: feeding one generation into the next
- `references/troubleshooting.md`: error to action mapping, exit codes, idempotency
