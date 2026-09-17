# Troubleshooting: error to action

Exit codes and scope names live in `transports.md`. This is what to DO when something goes wrong.

## "Still rendering" is not a failure

The single most expensive misreading available. Generation and `upscale` smart-wait about fifty
seconds, then return an id if the render is still going. Video and boards routinely take minutes.

⛔ **Poll the id. Never re-submit because it is slow.** Re-submitting spends again for the same
output. CLI exit code 4 means exactly this: accepted, not finished, id still emitted.

## Safe retries

If you genuinely need to retry a submission, for example a network blip while submitting, reuse
the **same client-chosen output id as an idempotency key**. Re-submitting with the same id returns
the existing job instead of starting a second one, and you can poll immediately because you knew
the id up front. It must be a UUID.

## 400 or invalid parameter

Almost always a field the chosen model does not support, or a value outside its allowed set: a
resolution it does not offer, a mode it does not have, a per-model feature borrowed from a
different family.

`get_model` returns what that model actually accepts. Resend with only those fields. **Do not
retry the identical request hoping for a different answer.**

## A reference will not resolve

- **An output id from another account** will not resolve. Ownership is scoped; use the user's own.
- **A URL behind auth, a login wall, or a WAF** cannot be fetched. Use a public URL or an output
  id.
- **The wrong media kind for the field**, such as a video where a start frame is expected, is
  rejected. Match the kind.

## Insufficient credits

Not a bug. Check `get_balance`, tell the user plainly, and point them at billing. Then preview
with `getCost` before the next attempt so the number is known in advance rather than discovered.

## Output is off-model or the wrong subject

Do not solve consistency with a longer prompt. Build a reference board or reuse an avatar look and
pass it as a reference. `identity.md` and `chaining.md`.

## A read came back empty or short

Before concluding the user has no data, check whether the read was **scoped to the wrong place**.
This is the most common false alarm in the surface:

- `list_cards` and `list_stages` without a `spaceId` read the DEFAULT board only, and say nothing
  about the others. Call `list_spaces` first.
- A stage name resolved against the wrong space is a different column with the same name.
- `list_content` scoped to a brand kit excludes accounts not linked to that kit.
- An archived item is hidden from a default list but still exists.

## A write did nothing visible

- **`update_stage` without `spaceId`** cannot tell which board you meant.
- **`update_space` and `update_brand_kit` are PATCHes**: a field you omitted was left alone, not
  cleared. Clearing usually means passing an empty value explicitly.
- ⛔ **`update_card`'s `posts` and `assets` REPLACE.** If work disappeared, this is why. Read the
  card, then send the complete set.

## A delete was refused

Working as designed. `delete_stage` refuses a column holding cards unless you name a
`targetStageId`, and tells you the count. `delete_space` refuses while any card remains, because
it would cascade to every card, cover, caption, post and schedule on the board.

**Offer `archive` instead.** Nothing in ContentHero is hard-deleted, so archiving is reversible
and is what the user usually meant.

## A publish failed

Check, in this order: the post has a connected account attached; `get_connected_account` says that
target can still publish; the key holds `publish:write`. A revoked social connection is the usual
cause, and it is fixed in the app, not from here.

## Scope errors

Name the scope the user needs to grant, and stop. ⛔ Do not route around it.
