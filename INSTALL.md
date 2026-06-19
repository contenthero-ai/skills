# Install ContentHero Skills

The repo includes three skills:

- **`contenthero-generate`**: generate image, video, audio, reference-board, and lip-sync media, with output-id chaining and cost preflight
- **`contenthero-pipeline`**: ground a post in your outliers and brand voice, draft on-brand copy in your own voice, then publish and schedule it
- **`contenthero-brand`**: read and update your brand kit, and read your inspiration accounts, outliers, and performance

Most people want all three. They cooperate: `contenthero-brand` resolves your brand context, `contenthero-pipeline` grounds and publishes, and `contenthero-generate` produces the media along the way.

## Option 1: `gh skill install` (most portable)

If you have [GitHub CLI](https://cli.github.com) v2.90+, this writes to the right directory for your agent automatically (Claude Code, Cursor, Codex, Gemini CLI, and more):

```bash
gh skill install contenthero-ai/skills contenthero-generate
gh skill install contenthero-ai/skills contenthero-pipeline
gh skill install contenthero-ai/skills contenthero-brand
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
