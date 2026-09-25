# ContentHero

Create, edit, schedule, and publish content from your AI assistant. Generate images, video, and
voiceovers, plan your content calendar, and draft on-brand copy, from hooks and scripts to captions
and ads, grounded in what already performs for you.

One plugin: the `contenthero` skill plus the ContentHero connector. It works in Claude, ChatGPT,
Gemini, Codex, Cursor, VS Code, and other AI assistants that read skills.

```
"Find my top outliers, ground a Reel caption in my brand voice, draft it for my approval, then schedule it."
→ reads your inspiration outliers → extracts the patterns that perform for you → pulls your brand kit
  voice and your recent posts → drafts an on-brand caption in your own voice → you approve → produces
  the media → schedules the post
```

## Install

**Pick your AI at [contenthero.ai/skills](https://contenthero.ai/skills)** for step-by-step
instructions and the download. The short version is in [INSTALL.md](./INSTALL.md):

- **Claude:** download [`contenthero-plugin.zip`](https://github.com/contenthero-ai/skills/releases/latest/download/contenthero-plugin.zip) and upload it under Customize, Plugins.
- **ChatGPT, Gemini, Grok:** download [`contenthero.zip`](https://github.com/contenthero-ai/skills/releases/latest/download/contenthero.zip) and upload it as a skill, then connect ContentHero.
- **Claude Code:** `claude plugin marketplace add contenthero-ai/skills`, then `claude plugin install contenthero@contenthero`.

## The idea

ContentHero pairs your LLM with your context. Your LLM is already a strong writer. What it lacks is your brand voice, your proven patterns, and a way to publish. ContentHero supplies all three.

- **Context:** your brand kit (voice, audience, offer, design guidelines), your inspiration outliers (the posts that actually perform in your niche), and your own past posts and their performance.
- **Execution:** generate image, video, audio, reference boards, and lip-sync, then assemble, schedule, and publish to your connected accounts.

When a draft is needed, the skill grounds your LLM in your real context and your proven patterns, your LLM writes it in your voice, and you approve before anything goes live.

## What's included

**One skill, `/contenthero`, covering the whole product.** It routes your request to the right
workflow rather than making you pick a skill first.

| Workflow | What it covers |
|----------|----------------|
| **Generate** | Image, video, audio, reference boards, lip-sync, upscaling. Cost preflight before every spend, output-id chaining so you never re-upload. |
| **Plan and publish** | Spaces, stages and cards, one post per platform, scheduling, and publishing to your connected accounts. |
| **Ground and draft** | Your brand kit and its searchable knowledge base. Your LLM writes in your voice; you approve before anything goes live. |
| **Research** | The accounts you track and their posts ranked by outlier score, which measures a post against its own creator's baseline rather than the platform's. |
| **Media library** | Upload, import, search, folders, and archiving that is always reversible. |
| **Editor** | Projects, timelines, canvases, saved elements, previews, and exports. |

It remembers your context in a small workspace file, `.contenthero/context.md`, caching your
active brand kit and identity ids so they are not re-discovered every run.

> It was three separate skills until September 2026. One covers the same ground with a single
> install, and the real flows crossed all three anyway.

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

- A ContentHero account
- An AI that supports skills or plugins
- For the CLI only: Node 20+

## Links

- [ContentHero](https://contenthero.ai)
- [SDK and MCP](https://github.com/contenthero-ai/contenthero-sdk) (`@contenthero/sdk`, `@contenthero/mcp`, `@contenthero/cli`)
- [Cookbook](COOKBOOK.md)
- [Changelog](CHANGELOG.md)

## License

MIT
