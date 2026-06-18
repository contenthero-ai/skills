# Scheduling and publishing

Two ways a post goes out: scheduled for later, or published now. Both push to the live connected accounts on a destination. Treat them as outward-facing and irreversible.

## Schedule

`schedule_post` (CLI `contenthero post schedule <id> <when>`). Sets the scheduled time on the post and its destinations. `when` is an ISO-8601 timestamp, or `clear` (CLI) / null (MCP) to unschedule.

- Prefer scheduling over immediate publishing unless the user explicitly says post now.
- Confirm the time zone intent with the user. Pass an unambiguous ISO-8601 time.
- Scheduling queues the post; it does not publish immediately.

## Publish now

`publish_post` (CLI `contenthero post publish <id>`). Pushes the post to its live connected accounts immediately. Requires `publish:write`.

- Optional `platform` narrows to one destination platform; the default publishes all destinations.
- Returns a per-destination result (`publishedCount`, `failedCount`, and a result per destination). Read it and report what actually went out and what failed.
- This is **irreversible and live.** It posts to the user's real social accounts.

## The safety gate (mandatory)

Before `schedule_post` or `publish_post`:

1. The final copy must be the user's approved draft (see `voice-synthesis.md`). Never publish copy the user has not seen.
2. Confirm the destinations (which platforms, which connected accounts) and the timing back to the user.
3. Get an explicit yes for the publish or the schedule.

Do not publish as a side effect of another request. Publishing is always its own confirmed step.

## Preconditions

- Each destination you intend to publish needs a `connectedAccountId` pointing at a live connected account (see `connected-accounts.md`). A destination with no connected account cannot publish.
- The key needs `publish:write`. If it is missing, tell the user to grant it; do not try to publish through another path.
- Revalidate the connected account is still live (`get_connected_account`) before publishing if it came from a cache.

## After publishing

Report the outcome plainly: which destinations published, which failed and why, and the live URL if returned. If some destinations failed, surface that rather than reporting a blanket success.
