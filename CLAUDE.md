# CLAUDE.md: the ContentHero skill

This repository is a one-way, read-only mirror of the ContentHero plugin. It is written by ContentHero's release
process and nothing else: a change made here is overwritten by the next sync, so open an issue instead of a pull
request. The skill's own instructions live in `skills/contenthero/SKILL.md` and are not repeated here, because two
copies of one rule drift.

## What this is

One plugin, one skill: `contenthero`. A router `SKILL.md` plus workflow references under
`skills/contenthero/references/`, packaged as an Agent Plugins 1.0 plugin (agent-plugins.org) that also declares the
ContentHero MCP connector. Chat apps that take a bare skill get `contenthero.zip`; plugin hosts get the skill and the
connector in one install through `contenthero-plugin.zip` or the plugin manifests. Both zips are attached to every
release.

Two files are hand-edited at the source: `plugin.json` and `mcp.json`. Every vendor spelling (`.claude-plugin/`,
`.cursor-plugin/marketplace.json`, `.mcp.json`, `skills/contenthero/agents/openai.yaml`) is generated from them, and a
release fails when a generated file is stale.

## The skill never enumerates the tool surface

When the skill runs, the agent has already received every tool's name, description and full JSON Schema from the
server. Writing a parameter table into a reference file creates a second source of truth for facts the agent already
holds, costs tokens to carry, and is guaranteed to drift.

Write only what the tool list cannot say:

| Write this | Not this |
|---|---|
| The order to call things in | What arguments a tool takes |
| The trap that costs money or deletes work | What a tool returns |
| The gate that needs a human | A restatement of the tool's description |
| The choice between two tools that look alike | A list of every tool in a domain |

If a sentence would still be true with the tool's own description in front of you, delete it.

Every tool the server offers is named at least once, in a sentence that says when to reach for it, and every tool the
skill names exists. A release checks both directions against the server's own tool contract.

## Editing rules

- `SKILL.md` is a router and stays one. It is loaded in full on invoke and stays in context for the session, so every
  line is a recurring cost. Detail goes to `references/`, which load only when read.
- The `description` in the frontmatter is always in context, whether the skill is used or not. Keep it on one line.
- Never freeze a value the product resolves live: the model roster, a platform's limits and a plan's limits all
  change without a deploy. Point at the tool that resolves them.
- Never an em dash or an en dash. American English.
- Say "card" for a piece of work. A post is one destination of a card, one per platform.

## The thesis

The user's own AI assistant writes every word, grounded in the user's real context. ContentHero never writes copy; it
supplies that context and executes. Copy with no grounding in the user's real context is the anti-pattern. Copy
grounded in what performs for this user, their brand voice and their own past work, which the user then approves, is
the feature. That line is the product, so it survives every edit.
