# Troubleshooting

## Scope errors

The pipeline spans three write scopes:

- `pipeline:write` for `create_post`, `update_post`, `archive_post`, `add_post_destination`, `update_post_destination`, `schedule_post`.
- `assets:write` for `add_post_asset`.
- `publish:write` for `publish_post`.

If a call fails on scope, tell the user exactly which scope to grant in API Keys settings. Do not try another path to achieve the same write.

## Publish failures

`publish_post` returns a per-destination result with `publishedCount` and `failedCount`. A partial failure is common (one platform succeeds, another fails). Read the per-destination results and report precisely:

- **Destination has no connected account:** it cannot publish. Add or set a `connectedAccountId` (see `connected-accounts.md`).
- **Connected account stale or expired:** `connectionStatus` is not live. The user reconnects it in the app (web-only OAuth).
- **Account lacks publish capability:** the connection's `capabilities` do not include publish for that platform.
- **Platform rejected the content:** surface the platform's message; the fix is usually the content (length, media format), not a retry.

Never report a blanket success when some destinations failed.

## Grounding is missing

If `get_brand_kit`, `list_outliers`, and `list_posts` all come back empty, you have no grounding. Do not invent a generic caption and call it on-brand. Tell the user what is missing and either ask for tone direction or proceed with an explicit note that the draft is not yet grounded. See `voice-synthesis.md`.

## Two-step read returns shallow data

`list_outliers` and the `topContent` from `get_brand_account_performance` are shallow `Outlier` records (no transcript). If you need the hook, structure, or hashtags, call `get_inspiration_content <id>` on the chosen item. Do not try to mine a pattern from the list view.

## Stage not found

Pipeline stages are per-account and customizable. If a stage name does not resolve, list them with `list_pipeline_stages` and use an id or the exact slug or name. Do not assume a fixed stage set.

## Scheduling

- Pass an unambiguous ISO-8601 timestamp. Confirm the intended time zone with the user.
- To unschedule, clear the time (`clear` on the CLI, null on MCP).
- Scheduling sets the time on the post and its destinations; it does not publish.

## The hard line

If you ever find yourself about to publish copy the user has not approved, or to invent generic copy because grounding was thin, stop. Both violate the skill's core contract. Show the draft, get approval, and ground the draft in real context.
