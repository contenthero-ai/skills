# CLAUDE.md — ContentHero Skills

## What This Is

The ContentHero Skills. Three independent, self-contained skills that turn ContentHero into the context-plus-execution layer for your agent:

- **contenthero-generate** — idea to media. Image, video, audio, reference board, and lip-sync generation, with output-id chaining and cost preflight. Execution only.
- **contenthero-pipeline** — research to published post. Grounds a post in your inspiration outliers and brand voice, has the host LLM draft on-brand copy in your own voice, then produces the media, assembles the post, and schedules or publishes it. The hero skill.
- **contenthero-brand** — your context. Reads and updates your brand kit and sections, and reads inspiration accounts, outliers, and brand-account performance. Feeds the other two.

Each skill includes its own bundle of `references/` so it installs cleanly via `gh skill install`, an agent host's plugin manifest, or a direct git clone.

## The Thesis (read this first)

ContentHero is the **context and execution layer**. Your own LLM is the **brain**. The skills feed the brain grounding (brand kit, inspiration outliers, your own past posts) and execute (generate media, publish, schedule). This is the line that defines how these skills work.

There are two different things. Only one of them is the anti-pattern.

- **Anti-pattern (never do this):** draft copy with no grounding in the user's real context, generic words that could belong to any brand, presented as if they were on-brand.
- **The feature (always do this when copy is needed):** the host LLM drafts copy, grounded in the user's real context. Pull the user's outliers to extract the patterns that actually perform for them (hook archetype, structure, pacing, CTA style). Pull the brand kit for tone, vocabulary, and banned words. Pull the user's own recent and top-performing posts. Then synthesize a draft that emulates the user's proven patterns in the user's own voice, present it for approval, and only then execute. The brain writes the words. ContentHero supplies the grounding and the method.

**The hard rule:** when copy is needed, ground it in the user's real context (outliers plus brand voice plus past posts), never present generic or ungrounded copy as on-brand, and never publish without explicit approval. Generic copywriting with no grounding is the anti-pattern. Grounded voice synthesis is the feature. The full method lives in `contenthero-pipeline/references/voice-synthesis.md`.

## Architecture

```
contenthero-skills/
├── CLAUDE.md                   # This file. Thesis, auth ladder, hard rules, shared state.
├── INSTALL.md                  # Human-facing install
├── INSTALL_FOR_AGENTS.md       # Agent-driven install spec
├── README.md                   # Public-facing description
├── COOKBOOK.md                 # End-to-end workflow recipes
├── VERSION  CHANGELOG.md  LICENSE
├── mcp.json + .mcp.json        # Hosted MCP server config (used by plugin manifests)
├── .claude-plugin/             # Claude Code / OpenClaw plugin manifest
├── .codex-plugin/              # Codex plugin manifest
├── .cursor-plugin/             # Cursor plugin manifest
├── contenthero-generate/       # Self-contained skill
│   ├── SKILL.md                # Generation workflow (execution only)
│   └── references/             # model-catalog, identity, media-inputs, chaining, troubleshooting
├── contenthero-pipeline/       # Self-contained skill (hero)
│   ├── SKILL.md                # Ground to draft to produce to assemble to publish
│   └── references/             # voice-synthesis, posts-and-destinations, scheduling, connected-accounts, troubleshooting
├── contenthero-brand/          # Self-contained skill
│   ├── SKILL.md                # Brand kit reads and writes, inspiration reads
│   └── references/             # brand-kit-structure, inspiration, troubleshooting
└── assets/                     # Logos, plugin assets
```

The three skills are independent. If shared docs drift between them, that is acceptable. Each skill is internally consistent and authored to stand alone.

## The 300-Line Guideline

Keep each SKILL.md focused. Skill files are injected into the prompt, so what stays in SKILL.md is what the agent needs to decide what to do next:

- Frontmatter (name, description, triggers, allowed-tools)
- Stage and phase flow (what stages exist, when to enter each)
- Decision trees (mode detection, transport selection, when to draft vs when to stop)
- Rules that apply every turn
- Short "Read references/X.md for details" pointers at each stage

What moves to `references/`: CLI and tool call examples, request and response shapes, model rosters, parameter tables, full prompt patterns, and error handling. The test: if removing a section would NOT break the agent's ability to decide what to do next, it belongs in `references/`. If it WOULD, it stays.

## Auth Ladder (transport detection)

Pick one transport at the start of a session. Never mix, never switch mid-session, never narrate the choice. Detect in this order:

1. **MCP (preferred)** — if ContentHero MCP tools are visible in the toolset, use them. Match loosely across server namespaces: `mcp__contenthero__*` (hosted OAuth at `https://mcp.contenthero.ai`), `mcp__contenthero-local__*` (a local stdio build), or any `mcp__* contenthero*__*` variant a host assigns. OAuth or a configured API key handles auth. No key handling in chat.
2. **CLI** — if no MCP is visible, use the `contenthero` CLI when `contenthero auth status` exits 0 OR `CONTENTHERO_API_KEY` is set in the environment. Pattern is `contenthero <noun> <verb>`, JSON on stdout by default, exit codes `0` ok, `1` general, `2` usage, `3` auth, `4` timeout (work accepted but not finished). Add `--cost` to preflight a spend and `--no-wait` plus `contenthero generation wait <id>` for non-blocking polling.
3. **Raw `/api/v1`** — last resort only, when neither MCP nor the CLI is available but the user has an API key and an HTTP client. Bearer the API key against `https://app.contenthero.ai/api/v1`.
4. **Neither** — tell the user once: "To use this skill, connect the ContentHero MCP server (`https://mcp.contenthero.ai`) or install the CLI: `npm install -g @contenthero/cli` then `contenthero login`."

**Hard rules:**
- **Never ask the user to paste an API key into the chat.** Keys go through `contenthero login` (browser-assisted), the `CONTENTHERO_API_KEY` environment variable, or the MCP OAuth flow. The skill never logs or echoes a key.
- **MCP mode: only use `mcp__*contenthero*__*` tools.** The tool name is the API. Do not shell out to the CLI for the same operation.
- **CLI mode: only use `contenthero ...` commands.** Run `contenthero schema` or `contenthero <command> --help` to discover arguments. Do not hand-write raw HTTP.
- **Never cross over.** If an operation is not exposed in your detected transport, tell the user. Do not switch transports to reach it.
- **Tool and CLI names are identical concepts across transports.** MCP `generate_image` is CLI `contenthero generate image`. The references show both side by side. Read only the column for your detected mode.

## Shared State (cross-skill cache)

Skills cooperate through one workspace file: **`.contenthero/context.md`** at the workspace root. It caches the ids a session resolves so a later skill does not have to re-discover them.

- `contenthero-brand` writes it after resolving the active brand kit.
- `contenthero-pipeline` and `contenthero-generate` read it first, and append ids they resolve (avatar, look, board, connected account, recent post ids).
- It is a hint, not the source of truth. **Always revalidate an id against a live read before a spend or a publish.** Ids can be archived or revoked between sessions.
- It is human-readable and machine-readable. One file per workspace.

Schema (Markdown with a fenced YAML-style block the skills parse leniently):

```
# ContentHero workspace context
# Written by the ContentHero skills. Safe to edit or delete. Revalidated before every spend.

active_brand_kit_id: <uuid>
active_brand_kit_name: <string>
default_avatar_id: <uuid>
default_look_id: <uuid>
connected_account_ids:
  - <uuid>   # platform: instagram, handle: @...
recent_post_ids:
  - <uuid>   # last posts this workspace created, newest first
notes: <free text, optional>
```

If the file is missing, the first skill that needs an id resolves it live and creates the file. If a cached id fails a live read, drop it from the cache and resolve fresh.

## API Conventions

- **Async generation:** `generate_*` runs a smart-wait (about 50s) then hands back an `outputId` if the render is still going. Poll with `get_generation_status`, or block with `wait_for_generation` (CLI `contenthero generation wait <id>`). Exit code 4 (CLI) or a pending status (MCP) means the work was accepted but did not finish in time. The `outputId` is always returned, so keep polling.
- **Cost preflight:** every spend can be previewed first. MCP passes `getCost: true` on the generate call; CLI uses `--cost`. It charges nothing.
- **Chaining:** a reference (start frame, image input, etc.) accepts a raw URL OR a ContentHero output-id token `<uuid>-<N>` (the Nth variation of a prior output). The server resolves either, type-checks it, and scopes it to the owner. This is more forgiving than import-first competitors. Prefer passing the output-id straight through rather than re-uploading.
- **Scopes:** API keys are scope-gated. Generation needs generate scopes, publishing needs `publish:write`, pipeline needs `pipeline:write`. If a call fails on scope, tell the user which scope to grant in API Keys settings. Do not work around a missing scope.

## Hard Rules (every skill, every turn)

1. Always ground drafted copy in the user's real context, and never present ungrounded generic copy as if it were on-brand. See the thesis.
2. Never ask the user to paste an API key in chat.
3. Never publish or schedule without explicit user approval of the final content.
4. Always preview cost before a large or batched spend, and surface it to the user.
5. Be concise in chat. Report the result (the media, the post link, the cost) not the plumbing (output ids, raw payloads, transport choice).
6. Revalidate cached ids before a spend or publish.
7. One transport per session. Detect once, never narrate, never cross over.
