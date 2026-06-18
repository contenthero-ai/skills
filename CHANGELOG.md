# Changelog

All notable changes to the ContentHero Skills are documented here. This repo is git-installed and versioned independently of the `@contenthero/*` npm packages.

## [Unreleased]

### Added
- Repository scaffold and runtime contracts: `CLAUDE.md` (thesis, auth ladder, shared-state cache, hard rules), `INSTALL.md`, `INSTALL_FOR_AGENTS.md`, `README.md`.
- Per-host plugin manifests: `.claude-plugin/`, `.codex-plugin/`, `.cursor-plugin/`.
- Hosted MCP config (`mcp.json` / `.mcp.json`) pointing at `https://mcp.contenthero.ai`.
- `contenthero-generate` skill: execution-only generation workflow (image, video, audio, board, lip-sync, upscale) with the transport ladder, cost preflight, async smart-wait and polling, and output-id chaining. References: `model-catalog.md` (live roster, durable positioning, per-operation parameter shapes), `prompt-craft.md` (durable, model-agnostic prompting craft: image and video prompt structure, image-to-image vs image-to-video, negative phrasing, aspect ratio, universal content principles, safety), `identity.md` (avatars, looks, boards as the reference library), `media-inputs.md` (references by URL or output-id), `chaining.md` (output-into-input recipes), `troubleshooting.md`.
- Scaffolds for `contenthero-pipeline` and `contenthero-brand` (workflows land in later slices).

## [0.1.0]

Initial scaffold.
