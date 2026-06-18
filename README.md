# ContentHero Skills

AI agent skills for creating and shipping on-brand content. ContentHero is the context-plus-execution layer. Your own LLM is the brain.

Works with Claude Code, Cursor, Codex, OpenClaw, and other AI coding agents.

```
"Find my top outliers, ground a Reel caption in my brand voice, draft it for my approval, then schedule it."
→ reads your inspiration outliers → extracts the patterns that perform for you → pulls your brand kit voice and your recent posts → drafts an on-brand caption in your own voice → you approve → produces the media → schedules the post
```

## Install

**Paste this into your agent.** It clones the repo to the right path, wires a transport (MCP or CLI), grounds itself on your brand kit, and offers a free smoke test.

```
Read https://raw.githubusercontent.com/contenthero-ai/skills/main/INSTALL_FOR_AGENTS.md and follow it.
Ask me for any API keys you need.
```

Prefer to install manually? See [INSTALL.md](./INSTALL.md). The short version:

```bash
gh skill install contenthero-ai/skills contenthero-generate
gh skill install contenthero-ai/skills contenthero-pipeline
gh skill install contenthero-ai/skills contenthero-brand
```

Then connect a transport: MCP (`claude mcp add --transport http contenthero https://mcp.contenthero.ai`) or the CLI (`npm install -g @contenthero/cli` then `contenthero login`).

## The idea

Most "AI content" tools try to be the brain: you give a topic, their server writes your script and picks your visuals as a black box. ContentHero does the opposite. Your LLM is already a strong writer. What it lacks is your context and a way to ship. ContentHero supplies both.

- **Context:** your brand kit (tone, vocabulary, banned words), your inspiration outliers (the posts that actually perform in your niche), and your own past posts and their performance.
- **Execution:** generate image, video, audio, reference boards, and lip-sync, then assemble, schedule, and publish to your connected accounts.

ContentHero never writes your copy server-side. When a draft is needed, the skill grounds your LLM in your real context and your proven patterns, your LLM writes it in your voice, and you approve before anything ships.

## What's included

| Skill | What it does | Invoke |
|-------|--------------|--------|
| **contenthero-generate** | Image, video, audio, reference board, and lip-sync. Output-id chaining, cost preflight, async wait. Execution only. | `/contenthero:generate` |
| **contenthero-pipeline** | Ground in outliers and brand voice → draft on-brand (your LLM writes, you approve) → produce → assemble → schedule or publish. The hero skill. | `/contenthero:pipeline` |
| **contenthero-brand** | Read and update your brand kit and sections. Read inspiration accounts, outliers, and brand-account performance. | `/contenthero:brand` |

The skills cooperate through a small workspace file, `.contenthero/context.md`, that caches your active brand kit and identity ids so they are not re-discovered every run.

## Authentication

Two transports, detected in priority order:

| Priority | Transport | Trigger | Billing |
|----------|-----------|---------|---------|
| 1 | **MCP (OAuth)** | ContentHero MCP tools visible | Your ContentHero account credits |
| 2 | **CLI (API key)** | `contenthero auth status` exits 0 or `CONTENTHERO_API_KEY` set | Your ContentHero account credits |

Never paste an API key into an agent chat. Use `contenthero login` (browser-assisted), the `CONTENTHERO_API_KEY` environment variable, or MCP OAuth. See [INSTALL.md](./INSTALL.md) for details.

## Things to try

| Prompt | What happens |
|--------|--------------|
| "Generate a product image with nano-banana-2, then animate it into a 5-second clip." | generate → chain the output id straight into a video, no re-upload |
| "Find my top outliers this month and tell me the hook patterns that work for my audience." | reads inspiration outliers, extracts pattern primitives |
| "Draft an on-brand caption for this reel using my voice and my best-performing posts." | grounds your LLM in brand voice plus your top posts, drafts for approval |
| "Turn this idea into an on-brand post and schedule it to my connected accounts." | full pipeline: ground → draft → produce → assemble → schedule |
| "Read my brand kit and summarize my tone and banned words." | brand context read |

## Requirements

- A ContentHero account (MCP OAuth or a CLI API key)
- An AI agent that supports skills
- For the CLI: Node 20+. For MCP: nothing to install locally.

## Links

- [ContentHero](https://contenthero.ai)
- [SDK and MCP](https://github.com/contenthero-ai/contenthero-sdk) (`@contenthero/sdk`, `@contenthero/mcp`, `@contenthero/cli`)
- [Cookbook](COOKBOOK.md)
- [Changelog](CHANGELOG.md)

## License

MIT
