# Posts, assets, and destinations

A ContentHero post is the unit you build, then attach media and platform destinations to, then schedule or publish. MCP tool names are shown; CLI is `contenthero post ...`.

## Create the post

`create_post` (CLI `contenthero post create <title> --platform <p>`). Requires `pipeline:write`.

| Field | Required | Notes |
|---|---|---|
| `title` | yes | Internal title for the post |
| `platform` | yes | Primary platform: `youtube`, `instagram`, `tiktok`, `facebook`, `linkedin`, `x`, `threads`, `general` |
| `description` | no | The caption draft (use the approved draft from voice-synthesis) |
| `stage` | no | Pipeline stage id, slug, or name; defaults to the first stage |
| `status` | no | `draft`, `active`, `completed`, `archived` |

`update_post` (CLI `contenthero post update <id>`) edits `title`, `description`, `platform`, `status`, `stage`, `script`, `notes`. Use it to set the `script` (for video) or move the post along the pipeline.

Pipeline stages are per-account and customizable. List them with `list_pipeline_stages` (CLI `contenthero pipeline stages`) and resolve by id, slug, or name rather than assuming fixed names.

## Attach assets

`add_post_asset` (CLI `contenthero post asset add <postId> --type <t> --url <url>`). Requires `assets:write`.

| Field | Required | Notes |
|---|---|---|
| `assetType` | yes | `image`, `video`, `audio`, `document`, `link` |
| `assetUrl` | yes | Public URL of the asset (e.g. a generated media URL) |
| `displayName` | no | Optional label |

Attach the media you produced in the Produce phase, or a URL the user supplied. The asset is added by URL.

## Add destinations

A destination is one platform target for the post, optionally bound to a connected account. `add_post_destination` (CLI `contenthero post destination add <postId> --platform <p>`). Requires `pipeline:write`.

| Field | Required | Notes |
|---|---|---|
| `platform` | yes | One of the post platforms above |
| `format` | no | `post`, `reel`, `story`, `short`, `thread`, etc. Match the platform |
| `connectedAccountId` | no | The publish target account (from `list_connected_accounts`). Required to actually publish |
| `scheduledAt` | no | ISO-8601 time for this destination |

A post can have several destinations (e.g. an Instagram Reel and a TikTok of the same clip). To publish, a destination needs a `connectedAccountId` that points at a live connected account. `update_post_destination` edits an existing one (format, account, scheduled time, status).

## The assemble sequence

1. `create_post` with the title, primary platform, and the approved caption as `description`.
2. `add_post_asset` for the produced or supplied media.
3. `add_post_destination` for each platform target, with its `format` and `connectedAccountId`.
4. `update_post` to set `script` / `notes` if relevant, or to move the stage.
5. Hand off to scheduling or publishing (see `scheduling.md`).

`get_post` (CLI `contenthero post get <id>`) returns the full post with its assets and destinations, so you can confirm the assembly before scheduling.
