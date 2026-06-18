# Changelog

All notable changes to the ContentHero Skills are documented here. This repo is git-installed and versioned independently of the `@contenthero/*` npm packages.

## [Unreleased]

### Added
- Repository scaffold and runtime contracts: `CLAUDE.md` (thesis, auth ladder, shared-state cache, hard rules), `INSTALL.md`, `INSTALL_FOR_AGENTS.md`, `README.md`.
- Per-host plugin manifests: `.claude-plugin/`, `.codex-plugin/`, `.cursor-plugin/`.
- Hosted MCP config (`mcp.json` / `.mcp.json`) pointing at `https://mcp.contenthero.ai`.
- `contenthero-generate` skill: execution-only generation workflow (image, video, audio, board, lip-sync, upscale) with the transport ladder, cost preflight, async smart-wait and polling, and output-id chaining. References: `model-catalog.md` (live roster, durable positioning, per-operation parameter shapes), `prompt-craft.md` (durable, model-agnostic prompting craft: image and video prompt structure, image-to-image vs image-to-video, negative phrasing, aspect ratio, universal content principles, safety), `identity.md` (avatars, looks, boards as the reference library), `media-inputs.md` (references by URL or output-id), `chaining.md` (output-into-input recipes), `troubleshooting.md`.
- `contenthero-pipeline` skill (the hero): the phased Ground to Draft to Produce to Assemble to Schedule/Publish workflow, grounded against the real post, inspiration, brand-account, and connected-account surfaces, with the no-server-side-copy and approval-before-publish hard rules and the `pipeline:write` / `assets:write` / `publish:write` scope gates. References: `voice-synthesis.md` (the grounding-to-draft methodology: three grounding sources, the list-then-get mining pattern, extracting pattern primitives, encoding the user's voice, the approval gate, thin-grounding handling), `posts-and-destinations.md`, `scheduling.md` (with the live-push safety gate), `connected-accounts.md`, `troubleshooting.md`.
- Scaffold for `contenthero-brand` (workflow lands in the next slice).

## [0.1.0]

Initial scaffold.
