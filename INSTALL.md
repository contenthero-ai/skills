# Install ContentHero Skills

The repo includes **one skill, `contenthero`**, covering the whole product: generating media,
running the planner and publishing, brand context and its knowledge base, research by outlier
score, the media library, and the editor.

It routes your request to the right workflow, so there is nothing to choose at install time and
nothing to install twice.

> It was three skills (`contenthero-generate`, `contenthero-pipeline`, `contenthero-brand`) until
> September 2026. If you installed those, remove them: one skill replaces all three, and leaving
> the old ones installed means two sets of instructions describing the same product, one of them
> out of date.

## Option 1: `gh skill install` (most portable)

If you have [GitHub CLI](https://cli.github.com) v2.90+, this writes to the right directory for your agent automatically (Claude Code, Cursor, Codex, Gemini CLI, and more):

```bash
gh skill install contenthero-ai/skills contenthero
```

Project scope (current repo) is the default. For user scope (every project on this machine), add `--scope user`.

## Option 2: Git clone

Clone into your agent's skills directory:

**Claude Code** (default `~/.claude/skills/contenthero-skills`):
```bash
git clone https://github.com/contenthero-ai/skills.git ~/.claude/skills/contenthero-skills
```

**Cursor / Codex / OpenClaw:** clone to `~/.cursor/skills/`, `~/.codex/skills/`, or `~/.openclaw/skills/` respectively.

> Not sure where your skills directory is? Ask your agent: "Where is your skills directory?"

## Authenticate

Two transports, detected in this order. Pick whichever fits how you work.

| Priority | Transport | Trigger | Auth | Best for |
|----------|-----------|---------|------|----------|
| 1 | **MCP (OAuth)** | ContentHero MCP tools visible | Browser OAuth, no key | Chat-native hosts on a ContentHero plan |
| 2 | **CLI (API key)** | `contenthero auth status` exits 0 or `CONTENTHERO_API_KEY` set | API key | Shell-native hosts, CI, scripts |

### MCP (OAuth, no API key)

Connect the hosted server. For Claude Code:

```bash
claude mcp add --transport http contenthero https://mcp.contenthero.ai
```

The first call opens an OAuth consent screen in your browser. Calls run against your ContentHero account and credits.

### CLI (API key)

```bash
npm install -g @contenthero/cli   # Node 20+, binary is `contenthero`

# Browser-assisted login (recommended): opens your browser, mints a key for this machine
contenthero login

# ...or bring your own key (CI / headless). Create one in the app under API Keys:
export CONTENTHERO_API_KEY=ch_live_...

contenthero auth status   # verify
```

The stored credential lives at `~/.contenthero/credentials` (mode 0600). The environment variable always wins over the stored file, so CI can override a local login.

> Never paste your API key into an agent chat. Use `contenthero login` or the environment variable. The skills will pick the key up from the CLI or the OAuth session.

## First run

Paste this to your agent:

> Read https://raw.githubusercontent.com/contenthero-ai/skills/main/INSTALL_FOR_AGENTS.md and follow it. Ask me for any API keys you need.

The agent fetches the install spec, wires the transport, grounds itself on your brand kit, and offers a free cost-preview smoke test. Then try: "Find my top outliers, ground a Reel caption in my brand voice, and draft it for my approval."

## Requirements

- A ContentHero account (sign in via MCP OAuth, or create an API key for the CLI)
- An AI agent that supports skills (Claude Code, Cursor, Codex, OpenClaw, or similar)
- For the CLI: Node 20+. For MCP: nothing to install locally.
