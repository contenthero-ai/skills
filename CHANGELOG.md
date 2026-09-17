# Changelog

All notable changes to the ContentHero Skills are documented here. This repo is git-installed and versioned independently of the `@contenthero/*` npm packages.

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
