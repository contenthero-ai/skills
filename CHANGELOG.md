# Changelog

All notable changes to the ContentHero Skills are documented here. This repo is git-installed and versioned independently of the `@contenthero/*` npm packages.

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
