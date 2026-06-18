# Connected accounts (publish targets)

Connected accounts are the user's real social accounts, linked for publishing. They are read-only from the skills: connecting an account is a web-only OAuth flow in the ContentHero app. The skill reads them to bind destinations and to publish.

## Reading

`list_connected_accounts` (CLI `contenthero connected-account list`) returns the connected accounts, default first. `get_connected_account <id>` (CLI `contenthero connected-account get <id>`) returns one in detail.

Each account exposes a safe projection only (no tokens are ever returned):

- `id` (use this as the destination's `connectedAccountId`)
- `platform`, `accountName`, `accountHandle`, `accountUrl`
- `connectionStatus` (whether it is live), `connectionType`
- `capabilities` (what the connection can do: publish, analytics; platform-shaped)
- `isDefault`, `lastSyncedAt`, `lastValidatedAt`

## How they fit the pipeline

- A post destination publishes through a connected account: set the destination's `connectedAccountId` to the account's `id` (see `posts-and-destinations.md`).
- Match the platform: an Instagram destination needs an Instagram connected account.
- Before publishing, confirm the account is live (`connectionStatus`) and can publish (`capabilities`). A destination bound to a stale or non-publishing account will fail at publish time.
- Cache the connected account ids you resolve to `.contenthero/context.md`, but revalidate before publishing; a connection can expire between sessions.

## When there is no connected account

If the user has no connected account for a platform they want to publish to, you cannot connect it from the skill. Tell them to connect it in the ContentHero app (the OAuth flow is web-only), then continue. You can still build and schedule the post; it just cannot publish until the account is connected.
