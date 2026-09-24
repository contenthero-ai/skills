# Install ContentHero

ContentHero ships as **one plugin**: the `contenthero` skill plus the ContentHero connector (the
hosted MCP server at `https://mcp.contenthero.ai`). The skill knows how to use ContentHero well; the
connector is what lets it act on your account.

**Step-by-step instructions for your AI, with download buttons, are at
[contenthero.ai/skills](https://contenthero.ai/skills)** and in the
[docs](https://docs.contenthero.ai/skills/install). This page is the short version.

## Two files, from every release

| File | What it is | Use it on |
|---|---|---|
| [`contenthero-plugin.zip`](https://github.com/contenthero-ai/skills/releases/latest/download/contenthero-plugin.zip) | The plugin: skill and connector together | Claude (Customize, Plugins, Add, upload) |
| [`contenthero.zip`](https://github.com/contenthero-ai/skills/releases/latest/download/contenthero.zip) | The skill on its own | ChatGPT and Grok (upload the zip), Gemini (unzip, then upload the `contenthero` folder) |

A skill uploaded on its own cannot bring the connector with it, so on those apps connect ContentHero
separately first (the MCP steps at [contenthero.ai/mcp](https://contenthero.ai/mcp)).

## Terminal agents: install the plugin

This repository is its own plugin marketplace, so the plugin (skill and connector) installs by name:

```bash
# Claude Code
claude plugin marketplace add contenthero-ai/skills
claude plugin install contenthero@contenthero

# Codex
codex plugin marketplace add contenthero-ai/skills   # then /plugins, install ContentHero
```

Cursor and VS Code import the same repository as a plugin; Gemini CLI, OpenClaw and Hermes install
the skill folder. The exact steps for each are on [contenthero.ai/skills](https://contenthero.ai/skills).

## Any other agent that reads skills

Copy `skills/contenthero/` from this repo into your agent's skills folder. `~/.agents/skills/` is the
shared location most agents read (Codex, Cursor, VS Code, Gemini CLI, Grok Build, OpenClaw). Then
connect ContentHero over MCP, or install the CLI:

```bash
npm install -g @contenthero/cli   # Node 20+, binary is `contenthero`
contenthero login                 # opens your browser, saves a key for this machine
```

The stored credential lives at `~/.contenthero/credentials` (mode 0600). `CONTENTHERO_API_KEY` in
the environment always wins over it, so CI can override a local login.

> Never paste your API key into an agent chat. Use the connector, `contenthero login`, or the
> environment variable.

## Updating

A plugin installed from the marketplace updates when you update the marketplace
(`claude plugin marketplace update contenthero`). An uploaded file is a snapshot: download the new
release and upload it again. A copied folder updates when you copy it again.

## Requirements

- A ContentHero account
- An AI that supports skills or plugins (Claude, ChatGPT, Gemini, Codex, Cursor, and more)
- For the CLI only: Node 20+
