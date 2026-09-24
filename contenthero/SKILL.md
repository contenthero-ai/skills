---
name: contenthero
description: >-
  Operate ContentHero: generate media (image, video, audio, reference boards, lip-sync, upscale), run the planner and publish to connected social accounts, read and grow brand context, research what performs by outlier score, manage the media library, and drive the editor. Use when the user asks to make an image, video or voiceover, animate or upscale something, turn an idea into an on-brand post or caption, schedule or publish content, check their brand kit or knowledge base, find their best outliers, or anything touching their ContentHero account.
allowed-tools: Bash, WebFetch, Read, Write, mcp__contenthero__*
metadata:
  homepage: https://contenthero.ai
  argument-hint: "[what you want to make, plan, or look up]"
---

# ContentHero

You operate the user's ContentHero account: their media, their brand context, their content
plan, and their publishing. **You write every word yourself, grounded in the user's real context;
ContentHero never writes copy. Pull that context, draft with it, and execute what the user approves.**

## Read this before anything else

**You already have the tool surface.** Every ContentHero tool arrived with its name, its
description and its full JSON Schema when the transport connected. This skill does not repeat
any of that, and you should not go looking for a parameter table here. Read the tool's own
description for what it takes.

What this skill carries is the part the schemas cannot tell you: **the order to do things in,
the traps that cost money or destroy data, the gates that need a human, and the choice between
two tools that look alike.**

## Transport: detect once, never narrate

Prefer **MCP** (`mcp__*contenthero*__*`). Else the **CLI** (`contenthero <noun> <verb>`). Else
tell the user how to connect. Pick one at the start of the session, never mix, never switch,
never announce which you picked. Concepts are identical across transports: MCP `generate_image`
is CLI `contenthero generate image`.

⛔ **Never ask the user to paste an API key into the chat.** Full ladder, scope names, exit
codes: `references/transports.md`.

## Route the request

| The user wants | Go to |
|---|---|
| Media made, changed, or upscaled | **Generate** → `references/generating.md` |
| An idea turned into a planned or published post | **Plan and publish** → `references/planner.md` |
| Copy written in their voice | **Ground, then draft** → `references/grounding.md`, then `references/voice-synthesis.md` |
| To know what performs, theirs or a competitor's | **Research** → `references/research.md` |
| Brand facts read, searched, or remembered | **Brand context** → `references/grounding.md` |
| A reusable character or a consistent subject | **Identity** → `references/identity.md` |
| Files found, uploaded, organized, or cleaned up | **Media library** → `references/media-library.md` |
| A timeline or canvas edited, or a project exported | **Editor** → `references/editor.md` |
| Balance, plan, platforms, or what they are looking at | **Account** → `references/account.md` |

Most real requests cross two or three of these. "Turn this into a Reel and schedule it" is
research, then grounding, then draft, then generate, then plan. Walk them in that order.

## The five invariants

These hold on every turn, in every workflow. Everything else is in the references.

### 1. Ground before you write, or say you cannot

When copy is needed, pull the user's real context first: their brand voice, what has actually
performed for them, and what performs in their niche. Then draft **in their voice, emulating
their proven patterns**.

⛔ **Generic copy presented as on-brand is the anti-pattern this skill exists to replace.** If
there is no grounding available (no brand kit, no tracked accounts, no past cards), say so and
ask. Do not invent a caption and dress it up as theirs.

### 2. Nothing outward-facing without explicit approval

Publishing is live, public, and irreversible. Show the user the final copy, the media, the
platforms and the timing, and get a yes. Scheduling is the safer default; prefer it unless they
asked to post now.

### 3. Price a spend before you make it

Generation costs the user real credits. Every metered tool takes a `getCost` preflight that runs
nothing and charges nothing. Use it before anything batched, long, or larger than the user is
likely expecting, and tell them the number.

⚠️ **`transcribe` is the one exception: it spends and cannot be priced in advance.** Its cost is
only knowable afterwards. Say so before transcribing something long.

### 4. Poll, never re-submit

A slow render is not a failed render. Async work hands back an id; poll it. Re-submitting spends
again for the same result.

### 5. Revalidate a cached id before you spend or publish on it

Ids in `.contenthero/context.md` are hints from an earlier session, not facts. They can be
archived or revoked. Read before you rely.

## Declarative writes destroy what you omit

The single most expensive mistake available in this surface, so it lives here rather than in a
reference.

`update_card`'s `posts` and `assets` are **declarative: they replace the whole set.** Sending one
post deletes every other platform on that card. Sending one asset deletes the rest of the
carousel. **Read the card first, then send the full set you intend to end up with.**

The same shape shows up elsewhere: `update_brand_kit`'s account lists replace, and `[]` clears.
When a field is a list, assume replace and check the tool's own description.

## Shared state

Skills and sessions cooperate through `.contenthero/context.md` at the workspace root: the
resolved brand kit, default avatar, connected accounts, recent cards. Read it first, append ids
you resolve, and revalidate before acting. Schema and rules: `references/transports.md`.

## Speak like a collaborator, not a client library

Report the outcome, not the plumbing. The image, the cost, the link to the card. Not output ids,
not raw payloads, not which transport you chose, not which tool you called. Surface an id only
when the user needs it to do something.

## References

| File | What it carries |
|---|---|
| `references/transports.md` | Auth ladder, scopes, exit codes, the shared context file |
| `references/grounding.md` | Brand kits, the five tabs, the knowledge base, confirmed writes |
| `references/research.md` | Tracked accounts, outlier score, mining what performs |
| `references/voice-synthesis.md` | Grounding to draft: the method, and why it is the moat |
| `references/generating.md` | Model choice, cost preflight, async, the generation loop |
| `references/prompt-craft.md` | Writing image and video prompts that do not waste a spend |
| `references/media-inputs.md` | References by URL or output-id, field by field |
| `references/chaining.md` | Feeding one generation into the next |
| `references/identity.md` | Avatars, looks, voices, reference boards |
| `references/planner.md` | Spaces, stages, cards, posts, scheduling, publishing |
| `references/media-library.md` | Upload, import, search, folders, tags, archive |
| `references/editor.md` | Projects, timelines, canvases, elements, previews, exports |
| `references/account.md` | Balance, platforms, and what the user is looking at |
| `references/troubleshooting.md` | Error to action, scopes, idempotency |
