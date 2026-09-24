# CLAUDE.md: maintaining the ContentHero skill

Instructions for editing **this repository**. The skill's own instructions live in
`skills/contenthero/SKILL.md` and are not repeated here, because two copies of one rule drift.

## What this is

**One plugin, one skill: `contenthero`.** A router `SKILL.md` plus workflow references under
`skills/contenthero/references/`, packaged as an **Agent Plugins 1.0** plugin (agent-plugins.org)
that also declares the ContentHero MCP connector. Chat apps that take a bare skill (claude.ai
Skills, ChatGPT, Gemini) get `dist/contenthero.zip`; plugin hosts (claude.ai Plugins, Claude Code,
Codex, Cursor, VS Code, Devin, OpenClaw, Hermes) get the skill and the connector in one install.

**Two files are hand-edited: `plugin.json` and `mcp.json`.** Every vendor spelling
(`.claude-plugin/`, `.cursor-plugin/marketplace.json`, `.mcp.json`, `skills/contenthero/agents/openai.yaml`) is generated from them by
`npm run build:skill`, and `npm run check` fails when a generated file is stale. Never edit a
generated file: the per-vendor manifests this replaced each pointed their host at a different,
wrong skill path, and Claude's validator rejected ours outright (measured 2026-09-24).

It was three skills (`contenthero-generate`, `contenthero-pipeline`, `contenthero-brand`) until
2026-09-17. They were consolidated because the split cost more than it saved: `pipeline`
delegated into `generate` and read `brand`'s cached context, so the flagship flow loaded all
three anyway and paid for three always-in-context descriptions to do it. **claude.ai also
installs one zip per skill**, so three skills meant three uploads for the most common install
path.

## ⛔ The skill must never enumerate the tool surface

The rule that shapes every edit here.

When the skill runs, the agent has **already received every tool's name, description and full
JSON Schema** from `listTools()`. Writing a parameter table into a reference file creates a second
source of truth for facts the agent already holds, costs tokens to carry, and is guaranteed to
drift. That is exactly what rotted the documentation repository: 77 dead references across 10
files, live for about three months.

**Write only what `listTools()` cannot say:**

| Write this | Not this |
|---|---|
| The order to call things in | What arguments a tool takes |
| The trap that costs money or deletes work | What a tool returns |
| The gate that needs a human | A restatement of the tool's description |
| The choice between two tools that look alike | A list of every tool in a domain |

If a sentence would still be true with the tool's own description in front of you, delete it.

## The guard

`npm run check` runs `scripts/check-tools.mjs`, which reads the live surface from the published
`@contenthero/mcp` and checks it **in both directions**:

- **Forward:** every tool the skill names must exist. This repo had **21 dead names** before the
  guard existed.
- **Reverse:** every live tool must be named at least once, in a sentence telling an agent when
  to reach for it. This repo covered **25 of 88 tools**, with the editor's 16 and inspiration's 4
  not mentioned anywhere at all.

The reverse direction is what makes "full coverage" a fact rather than a claim in a README.
Coverage is derived by reading the prose, so there is no second list to fall behind: **you cannot
satisfy the guard without writing the sentence.**

Run it before committing. It is also CI.

### Two ways the guard was wrong, kept here so they are not rediscovered

1. **It could not see single-word tools.** Both directions used one backticked-snake_case pattern,
   so `archive`, `favorite`, `upscale` and `transcribe` were reported uncovered while being
   documented, purely for having no underscore. Coverage now searches for each live name
   literally; only dead-name detection uses the pattern, because you cannot enumerate what does
   not exist.
2. **It flagged correct prose.** Canvas ops (`create_layer`, `set_background`) and schema enum
   values are real, current, snake_case, and not tools. Rather than allowlist them, the guard
   accepts any token the **live surface itself still mentions**, harvested from every description
   and enum the server advertises. A retired op vanishes from those descriptions too, so it is
   still caught.

⭐ **A guard that flags correct code gets switched off.** Both fixes exist to keep this one
trusted.

## Editing rules

- **`SKILL.md` is a router and must stay one.** It is loaded in full on invoke and stays in
  context for the session, so every line is a recurring cost. Keep it under 500 lines; it is
  currently around 150. Detail goes to `references/`, which load only when read. **If domain
  detail creeps back into `SKILL.md`, the consolidation has failed.**
- **The `description` in the frontmatter is always in context**, for every session, whether the
  skill is used or not. It is capped at 1,536 characters. Make it earn the space.
- **Never freeze a value the product resolves live.** The model roster, a model's
  `promptReferences` schemes, a platform's character limits and tier limits all change without a
  deploy. Point at the tool that resolves them. A frozen list was already found drifting here: a
  model catalog missing 2 of 26 live models.
- ⛔ **Never an em dash or an en dash**, anywhere. Restructure the sentence.
- **American English**, including in comments.
- **Say "card" not "post"** for a piece of work. What used to be a post is a card; what used to be
  a destination is a post, one per platform; `publish_post` survived and takes a `cardId`.

## The thesis, which the skill must keep carrying

The user's own AI assistant **writes every word**, grounded in the user's real context. ContentHero **never writes copy**; it supplies that context and executes.

- **The anti-pattern:** copy with no grounding in the user's real context, generic words that
  could belong to any brand, presented as if they were on-brand.
- **The feature:** the host LLM drafts, grounded in what actually performs for this user, their
  brand voice, and their own past work, then the user approves.

ContentHero never writes copy server-side. That line is the product, so it survives every edit.

## Layout

```
contenthero-skills/
├── CLAUDE.md               This file. Maintainer rules.
├── README.md  INSTALL.md  INSTALL_FOR_AGENTS.md  COOKBOOK.md
├── CHANGELOG.md  VERSION  LICENSE
├── package.json            Exists only to run the guards.
├── scripts/check-tools.mjs The tool-coverage guard.
├── scripts/build-skill.mjs Generates the vendor files and zips, and guards them.
├── .github/workflows/      CI, and the release that attaches both zips.
├── plugin.json  mcp.json   HAND-EDITED. The Agent Plugins manifest and the connector.
├── .claude-plugin/  .mcp.json   GENERATED for Claude.
├── .cursor-plugin/marketplace.json   GENERATED for Cursor's GitHub import.
└── skills/contenthero/
    ├── SKILL.md            The router.
    ├── references/         The workflows.
    ├── agents/openai.yaml  GENERATED for ChatGPT and Codex.
    └── assets/icon.svg
```
