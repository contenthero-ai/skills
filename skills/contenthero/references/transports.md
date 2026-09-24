# Transports, auth, scopes, and shared state

## The ladder

Detect once, at the start of the session. Never mix, never switch mid-session, never announce
which one you picked.

1. **MCP (preferred).** If ContentHero tools are visible in the toolset, use them. Match loosely
   across namespaces: `mcp__contenthero__*` (the hosted OAuth server at
   `https://mcp.contenthero.ai`), `mcp__plugin_contenthero_ContentHero__*` (the same server,
   installed with the ContentHero plugin), `mcp__contenthero-local__*` (a local stdio build), or
   any `mcp__*contenthero*__*` a host assigns, in any casing. OAuth or a configured key handles auth; nothing to do
   in chat.
2. **CLI.** No MCP visible, but `contenthero auth status` exits 0 or `CONTENTHERO_API_KEY` is
   set. Pattern is `contenthero <noun> <verb>`, JSON on stdout by default.
3. **Raw `/api/v1`.** Last resort, when neither exists but the user has a key and an HTTP client.
   Bearer the key against `https://app.contenthero.ai/api/v1`.
4. **Nothing available.** Say it once: connect the MCP server at `https://mcp.contenthero.ai`, or
   `npm install -g @contenthero/cli` then `contenthero login`.

## Hard rules

- ⛔ **Never ask the user to paste an API key into the chat.** Keys go through
  `contenthero login` (browser-assisted), the `CONTENTHERO_API_KEY` environment variable, or MCP
  OAuth. Never log or echo a key.
- **MCP mode: only MCP tools.** Do not shell out to the CLI for the same operation.
- **CLI mode: only `contenthero ...`.** Discover arguments with `contenthero schema` or
  `contenthero <command> --help`. Do not hand-write raw HTTP.
- ⛔ **Never cross over.** If an operation is missing from your detected transport, tell the user.
  Do not switch transports to reach it.

Concepts are identical across transports. MCP `generate_image` is CLI
`contenthero generate image`. The tool's own description is the contract in both.

## Discovering the CLI surface

`contenthero schema` dumps the input schema of every command in one JSON document, which is how
an agent learns the surface without reading documentation. `contenthero --help` gives the tree;
`contenthero <command> --help` gives one command's flags.

⚠️ **Requires cli 0.3.5 or newer.** Earlier versions truncated `schema` at 64KB when its output
went through a pipe (65,536 bytes of 93,998), because the process exited before stdout drained.
On an older CLI the JSON will not parse. Redirect to a file if you are stuck on one.

## Exit codes (CLI)

| Code | Means |
|---|---|
| 0 | OK |
| 1 | General failure |
| 2 | Usage error, so re-read the command's `--help` |
| 3 | Auth: not logged in, or the key is invalid |
| 4 | **Timeout: the work was ACCEPTED but did not finish.** Not a failure. |

⛔ **Exit 4 is the one that costs money if you misread it.** The output id is still emitted. Poll
it. Re-running spends again for a render that is already in progress.

## Scopes

API keys are scope-gated, and a missing scope is a deliberate boundary, not an obstacle:

| Scope | Covers |
|---|---|
| generate scopes | Making media |
| `assets:write` | Uploading and attaching media |
| `planner:write` | Spaces, stages, cards, tags |
| `publish:write` | Publishing to live accounts |
| `brandkit:read` / `brandkit:write` | Reading and editing brand context |
| `editor:write` | Timeline and canvas edits |
| `context:read` | Reading the open app's state, and previews |

⛔ **When a call fails on scope, name the scope the user needs to grant and stop.** Do not route
around it through another transport or another tool. Holding `publish:write` in particular is the
account owner's standing consent to autonomous publishing, so its absence is a decision.

## Shared state: `.contenthero/context.md`

One file at the workspace root, caching the ids a session resolves so later work does not
re-discover them.

```
# ContentHero workspace context
# Written by the ContentHero skill. Safe to edit or delete. Revalidated before every spend.

active_brand_kit_id: <uuid>
active_brand_kit_name: <string>
default_avatar_id: <uuid>
default_look_id: <uuid>
connected_account_ids:
  - <uuid>   # platform: instagram, handle: @...
recent_card_ids:
  - <uuid>   # newest first
notes: <free text, optional>
```

⛔ **It is a hint, never the source of truth.** Always revalidate against a live read before a
spend or a publish; ids get archived and revoked between sessions. If a cached id fails a read,
drop it and resolve fresh. If the file is missing, create it when you first resolve something.
