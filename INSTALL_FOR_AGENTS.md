# ContentHero Skills — Installation Guide for AI Agents

Read this entire file, then follow the steps. Ask the user for an API key only through the supported flows (never have them paste a key into the chat). Target: about 5 minutes to a working ContentHero integration.

This file is the agent-facing companion to [`INSTALL.md`](./INSTALL.md) (human-facing). Where they overlap, this file is canonical for agent-driven installs.

## Step 0: If you are not Claude Code

Read [`CLAUDE.md`](./CLAUDE.md) at the repo root first. It is the runtime contract for these skills: the thesis (ContentHero is the context-plus-execution layer, the host LLM is the brain), the auth ladder, the shared-state cache, and the hard rules. Claude Code reads it automatically. Other agents should fetch it explicitly.

If you fetched this file by URL without cloning yet, the companion files live at:

- `https://raw.githubusercontent.com/contenthero-ai/skills/main/CLAUDE.md` — runtime contract
- `https://raw.githubusercontent.com/contenthero-ai/skills/main/contenthero-generate/SKILL.md` — generation skill (transport ladder, chaining, cost preflight)
- `https://raw.githubusercontent.com/contenthero-ai/skills/main/contenthero-pipeline/SKILL.md` — pipeline skill (ground, draft on-brand, produce, publish, schedule)
- `https://raw.githubusercontent.com/contenthero-ai/skills/main/contenthero-brand/SKILL.md` — brand skill (brand kit reads and writes, inspiration reads)
- `https://raw.githubusercontent.com/contenthero-ai/skills/main/INSTALL.md` — human-facing install doc

## Step 1: Detect the agent host and install the skills

Detect which agent is running before cloning. Each host expects skills at a different path. If you are not sure, ask the user "which AI coding agent are you running this from?"

The most portable install is `gh skill install` (GitHub CLI v2.90+), which writes to the right directory for your host automatically:

```bash
gh skill install contenthero-ai/skills contenthero-generate
gh skill install contenthero-ai/skills contenthero-pipeline
gh skill install contenthero-ai/skills contenthero-brand
```

If `gh skill` is not available, clone the whole repo to the host's skills path:

| Agent host    | Default install path                            |
|---------------|-------------------------------------------------|
| Claude Code   | `~/.claude/skills/contenthero-skills`           |
| OpenClaw      | `~/.openclaw/skills/contenthero-skills`         |
| Codex         | `~/.codex/skills/contenthero-skills`            |
| Cursor        | `~/.cursor/skills/contenthero-skills`           |
| Other         | Whatever path the host loads skills from. Ask the user. |

```bash
# Replace <install-path> with the row from the table above:
git clone --single-branch --depth 1 \
  https://github.com/contenthero-ai/skills.git \
  <install-path>
```

After cloning, the three skills are auto-discovered at `contenthero-generate/SKILL.md`, `contenthero-pipeline/SKILL.md`, and `contenthero-brand/SKILL.md`.

## Step 2: Pick a transport (MCP or CLI)

The skills route every ContentHero call through one transport. Detect in this order (full ladder in [`CLAUDE.md`](./CLAUDE.md)):

1. **MCP** if ContentHero MCP tools are already visible (`mcp__contenthero__*` or any `mcp__*contenthero*__*`). This is the path of least resistance: OAuth, no key handling, runs against the user's account and credits. If MCP is detected and the user is happy with it, **skip to Step 4**.
2. **CLI** if no MCP is visible.

### Wiring MCP from scratch (preferred for chat-native hosts)

The hosted server is OAuth at `https://mcp.contenthero.ai`. For Claude Code:

```bash
claude mcp add --transport http contenthero https://mcp.contenthero.ai
```

The first call opens an OAuth consent screen in the browser. No API key needed. For other hosts, follow their MCP setup docs and point them at `https://mcp.contenthero.ai`.

### Wiring the CLI (preferred for shell-native hosts and CI)

```bash
npm install -g @contenthero/cli   # requires Node 20+, binary is `contenthero`
```

Then authenticate with ONE of these (never have the user paste a key into the chat):

- **Browser-assisted (recommended):** tell the user to run `contenthero login` in their terminal. It opens the browser, mints a key for this machine, and stores it at `~/.contenthero/credentials` (mode 0600).
- **Environment variable (CI or headless):** the user sets `CONTENTHERO_API_KEY=ch_live_...` in their shell profile. They create the key in the app under API Keys. The env var always wins over the stored file.

Verify:

```bash
contenthero --version
contenthero auth status
```

## Step 3: Confirm credits and scopes

ContentHero generation and publishing spend credits and require scoped keys. Before the first real spend:

- Check the balance: MCP `get_balance`, CLI `contenthero account balance`.
- API keys are scope-gated. Generation needs generate scopes, publishing needs `publish:write`, the pipeline needs `pipeline:write`. A `contenthero login` key is provisioned with the standard scopes. If a call fails on a missing scope, tell the user which scope to grant in API Keys settings. Do not work around it.

If the balance is low, point the user at their billing settings rather than proceeding into a failed spend.

## Step 4: Ground the brand (canonical install outcome)

This is the step the install is actually for. The thing that makes ContentHero different from a raw media API is that it grounds your agent in the user's real brand and research context. Set that up now so every later generation and post is on-brand.

Read [`contenthero-brand/SKILL.md`](./contenthero-brand/SKILL.md) and:

1. List the user's brand kits (`list_brand_kits`). If there is exactly one, make it active. If there are several, ask which to use. If there are none, tell the user they can create one in the app and continue without it for now.
2. Read the active brand kit (`get_brand_kit`) and summarize back to the user, in one or two lines, the tone of voice, key vocabulary, and any banned words you found.
3. Write the resolved brand kit id (and any default avatar or connected accounts you see) into `.contenthero/context.md` at the workspace root, per the shared-state schema in `CLAUDE.md`. Later skills read this so they do not re-discover it.

On the happy path this step ends with an active brand kit cached and a one-line summary of the user's voice. That is the grounding the pipeline skill builds on.

## Step 5: Verify the install (opt-in)

Ask the user: "Want a quick smoke test? I can preview the cost of a small image generation (charges nothing), or generate one real image (a few credits) to confirm the integration works end to end."

- **Cost-only (free):** MCP `generate_image` with `get_cost: true`, or CLI `contenthero generate image "a red ceramic cube on white" --model nano-banana-2 --cost`. Confirms auth, transport, and pricing without spending.
- **Real generation (a few credits):** drop the `--cost` flag. Returns an `outputId` and, once finished, the media URL.

If the user declines, skip to Step 6. The skills work either way; the smoke test just removes uncertainty.

Common failures, in order:

1. **No transport detected.** Run `contenthero auth status` (CLI) or confirm `mcp__contenthero__*` tools are visible (MCP).
2. **Auth fails.** The key is missing or revoked. Re-run `contenthero login`, or check the OAuth connection.
3. **Scope error.** The key lacks a needed scope. Tell the user which one to grant.
4. **Low balance.** Point the user at billing.

## Step 6: Done

The skills now have a transport, an authenticated account, and a grounded brand context. Tell the user:

> ContentHero Skills are installed and grounded on your brand. Try:
> - "Generate a 9:16 product image with nano-banana-2, then animate it into a 5-second clip"
> - "Find my top outliers, ground a Reel caption in my brand voice, and draft it for my approval"
> - "Turn this idea into an on-brand post and schedule it to my connected accounts"

The pipeline skill handles the research, grounds the draft in the user's own voice, produces the media, assembles the post, and schedules it. The user's LLM writes the words; ContentHero supplies the grounding and the execution.

## Upgrade

```bash
cd <install-path> && git pull origin main
```

Or with `gh skill`, re-run `gh skill install contenthero-ai/skills <skill>`. Re-read the active SKILL.md after an upgrade if the version bumped: the transport ladder occasionally gains new options.

## What this skill does NOT do

- It does not create the user's ContentHero account. They must already have one.
- It does not write copy server-side. The host LLM drafts copy, grounded in the user's context, per the thesis in `CLAUDE.md`. ContentHero supplies the grounding and the method, never the words.
- It does not store or transmit the API key anywhere outside the local agent environment. The key stays in the user's shell, the CLI credential file, or the MCP OAuth session. The skill never logs it.
