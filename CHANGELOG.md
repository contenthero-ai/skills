# Changelog

All notable changes to the ContentHero Skills are documented here. This repo is git-installed and versioned independently of the `@contenthero/*` npm packages.

## [0.2.2] - 2026-09-26

Brand kits in the skill match the live API: a kit is a set of Markdown sections.

### Changed
- **Brand kits are Markdown sections.** The brand guidance reads a kit's section outline first, fetches only the
  sections a task needs, and writes sections by key; the field model the skill used to describe no longer exists
  in the API.
- **Importing a kit from its sources.** A kit's websites are one list, primary first, and an import analyzes every
  website plus the kit's own YouTube and Instagram accounts, writing only empty sections.
- Pinned to `@contenthero/mcp` 0.4.19 and `@contenthero-ai/american-spelling` 0.1.2.

## [0.2.1] - 2026-09-24

The skill becomes installable by upload, on every chat app, and passes the open Agent Skills spec.
The repo becomes one Agent Plugins 1.0 plugin that brings the ContentHero connector with the skill.

### Changed
- **One plugin layout for every host.** The skill moved from `contenthero/` to
  `skills/contenthero/`, the fixed location in the Agent Plugins 1.0 standard (agent-plugins.org)
  that Cursor, VS Code, Codex, Devin, OpenClaw, Hermes and Claude all scan. Root `plugin.json` and
  `mcp.json` are the only hand-edited manifests; `.claude-plugin/`, `.mcp.json` and
  `agents/openai.yaml` are generated from them. `.codex-plugin/` and `.cursor-plugin/` are removed:
  both hosts load the portable layout directly.

### Fixed
- **The plugin loaded no skill on any plugin host.** Each vendor manifest pointed at the skill a
  different, wrong way: Claude's `marketplace.json` listed skills as objects where its schema takes
  paths (`claude plugin validate` failed: `plugins.0.skills: Invalid input`), Codex's `"skills":
  "./"` found no `skills/` folder, and Cursor's pointed at the skill instead of its parent. Now a
  Claude Code install reports 1 skill and 1 MCP server (measured 2026-09-24).
- **The skill failed the open spec it claims.** The `description` was 1,166 characters against a
  1,024 limit, and the frontmatter carried `argument-hint` and `homepage`, keys the spec does not
  allow. Both now live under `metadata`, and the description is rewritten to what the skill does
  and when to use it. Found by a real claude.ai upload, not by any check here.

### Added
- **Install instructions per host.** `README.md` and `INSTALL.md` send members to
  contenthero.ai/skills and list the two release files; `INSTALL_FOR_AGENTS.md` is now for terminal
  agents only and installs the plugin, or copies `skills/contenthero/` (never the whole repo, which
  nested the skill too deep to be found). `.cursor-plugin/marketplace.json` is generated, because
  Cursor's GitHub import refuses a repo without one.
- **The skill covers `show_media`**, and the coverage guard runs against a current mcp: it imported
  `dist/server.js` and `dist/groups.js`, deep paths that later builds no longer ship, so it was stuck
  on mcp 0.4.8. It now imports the package entrypoint.
- **The ContentHero connector ships with the skill.** A bare skill cannot declare a connector, so
  claude.ai listed none. As a plugin, `mcp.json` declares `https://mcp.contenthero.ai`.
- **Uploadable packages.** `npm run build:zip` writes `dist/contenthero.zip` (the skill folder at
  its root, for skill uploads) and `dist/contenthero-plugin.zip` (the plugin, for plugin uploads),
  and the release workflow attaches both to every `v*` tag, so
  `releases/latest/download/contenthero.zip` is a stable link. Verified by upload on claude.ai
  and ChatGPT (the zip) and Gemini (the same folder, unzipped), with a canary proving Gemini keeps
  `references/`.
- **ChatGPT branding.** `contenthero/agents/openai.yaml` (generated from `.codex-plugin/plugin.json`
  and `.mcp.json`, never hand-edited) gives ChatGPT our name, laurel icon, and the MCP server the
  skill depends on. Without it ChatGPT invented a placeholder icon.
- **Two guards.** `check:skill` fails when the generated file is stale or any of the six version
  spellings disagree; `check:spec` runs the spec's own reference validator in CI.

### Changed
- Dropped the "context and execution layer" positioning everywhere it appeared. Every connector
  supplies context and executes, so it said nothing specific; the description and manifests now
  lead with what the user can do. The behavioral rule it stood for stays in the skill body: the
  user's assistant writes every word, ContentHero never writes copy.

## [0.2.0] - 2026-09-17

Three skills become one, the whole 88-tool surface becomes reachable, and the repo gets its first
guard. Rebuilt against the published `@contenthero/mcp` 0.4.6 and `@contenthero/cli` 0.3.5.

### Changed
- **One skill, `contenthero`, replaces `contenthero-generate`, `contenthero-pipeline` and
  `contenthero-brand`.** The split cost more than it saved: `pipeline` delegated into `generate`
  and read `brand`'s cached context, so the main flow loaded all three anyway while paying for
  three always-in-context descriptions. claude.ai also installs one zip per skill, so three skills
  meant three uploads on the most common path. `SKILL.md` is now a router; the workflows live in
  `contenthero/references/`.
- **The skill no longer restates the tool surface.** When it runs, the agent already holds every
  name, description and JSON Schema from `listTools()`. What is written here is only what those
  schemas cannot say: sequencing, traps, gates, and the choice between two tools that look alike.
- Rewrote the cookbook and the install docs for one skill and the current vocabulary.

### Added
- **`scripts/check-tools.mjs`, and CI to run it.** The first automated check in this repository.
  It reads the live surface from the published package and checks both directions: every tool the
  skill names must exist, and every tool that exists must be named in a workflow.
- Coverage for two domains no skill had ever mentioned: **the editor** (projects, timelines,
  canvases, elements, previews, exports) and **inspiration** (tracked accounts and outlier-ranked
  content), plus the planner, the media library, and account reads.

### Fixed
- **21 tool names that no longer existed.** The whole `create_post` / `add_post_destination` /
  `schedule_post` family, `list_outliers`, `list_inspiration_accounts`,
  `get_brand_account_performance`, `wait_for_generation` and more. The vocabulary had changed in
  two directions at once: a post became a card, a destination became a post, and `publish_post`
  survived taking a `cardId`.
- **Coverage went from 25 of 88 tools to 88 of 88**, and it is now enforced rather than claimed.
- Removed a frozen model catalog that had already drifted, missing 2 of 26 live models, and a
  frozen list of prompt-reference schemes. Both are values the roster resolves live.
- `.codex-plugin` and `.cursor-plugin` pointed at `assets/icon.png` and `assets/logo.png`, which
  have never existed in this repository. References removed.

## [0.1.0] - 2026-06-19

First release: three skills, the runtime contract, and the cookbook, contract-audited and dogfooded end to end against production.

### Added
- Repository scaffold and runtime contracts: `CLAUDE.md` (thesis, auth ladder, shared-state cache, hard rules), `INSTALL.md`, `INSTALL_FOR_AGENTS.md`, `README.md`.
- Per-host plugin manifests: `.claude-plugin/`, `.codex-plugin/`, `.cursor-plugin/`.
- Hosted MCP config (`mcp.json` / `.mcp.json`) pointing at `https://mcp.contenthero.ai`.
- `contenthero-generate` skill: execution-only generation workflow (image, video, audio, board, lip-sync, upscale) with the transport ladder, cost preflight, async smart-wait and polling, and output-id chaining. References: `model-catalog.md` (live roster, durable positioning, per-operation parameter shapes), `prompt-craft.md` (durable, model-agnostic prompting craft: image and video prompt structure, image-to-image vs image-to-video, negative phrasing, aspect ratio, universal content principles, safety), `identity.md` (avatars, looks, boards as the reference library), `media-inputs.md` (references by URL or output-id), `chaining.md` (output-into-input recipes), `troubleshooting.md`.
- `contenthero-pipeline` skill (the hero): the phased Ground to Draft to Produce to Assemble to Schedule/Publish workflow, grounded against the real post, inspiration, brand-account, and connected-account surfaces, with the no-server-side-copy and approval-before-publish hard rules and the `pipeline:write` / `assets:write` / `publish:write` scope gates. References: `voice-synthesis.md` (the grounding-to-draft methodology: three grounding sources, the list-then-get mining pattern, extracting pattern primitives, encoding the user's voice, the approval gate, thin-grounding handling), `posts-and-destinations.md`, `scheduling.md` (with the live-push safety gate), `connected-accounts.md`, `troubleshooting.md`.
- `contenthero-brand` skill: the context feeder. Resolves and caches the active brand kit (`.contenthero/context.md`), reads and summarizes the five-tab brand document, wraps the brand knowledge base (semantic search, browse, read, add, remove), and surfaces inspiration outliers and brand-account performance with brand-kit scoping. Confirmed writes for identity, section, and knowledge edits. References: `brand-kit-structure.md`, `knowledge.md`, `inspiration.md`, `troubleshooting.md`.
- `COOKBOOK.md`: end-to-end recipes (ground the workspace, on-brand caption for an existing reel, outlier to on-brand clip scheduled, talking-head post, capture a lesson into the knowledge base).

### Fixed (polish pass)
- Corrected the cost-preflight parameter name to `getCost` (was `get_cost`) in the runtime contract and the install guide.
- Corrected model discovery: there is no MCP `list_models` tool; the live roster is the `modelId` enum on the `generate_*` tools (MCP) or `contenthero model list` (CLI). Updated across the generate skill and its references.
