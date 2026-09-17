# Planner: spaces, stages, cards, posts

The planner is where an idea becomes a scheduled or published post.

## The vocabulary changed, and it changed in two directions at once

Read this before anything else in this file, because prose written against the old surface
reads as though the whole family was deleted. It was not.

- What used to be a **post** is now a **card**: one piece of work.
- What used to be a **destination** is now a **post**: how a card reaches ONE platform. A card
  holds one post per platform.
- **`publish_post` survived both renames** and takes a `cardId`.

The hierarchy, top to bottom: **Space → Stage → Card → Post.** A space is a board. Stages are
its columns. Cards move between stages. Posts hang off a card, one per platform.

## Everything is scoped to a space, and the default is a trap

⚠️ **`list_cards` and `list_stages` without a `spaceId` read the account's DEFAULT board only,
and cards on any other board are absent with nothing in the response saying so.** Search misses
them too. Once a user has more than one space, an unscoped read quietly lies.

**Call `list_spaces` first**, pick the board, and pass its id to everything after. Use
`get_space` when you need one board's live card count on its own.

Stages are per-space and user-customizable: two spaces can each hold a stage called "Published"
with different ids. **Never resolve a stage name against the wrong board.** `list_stages` for the
real columns, then pass a stage id (most stable), slug, or name.

`create_card` follows the same rule: **without `spaceId` it lands on the default board.** Its
`stage` argument decides the space when you pass a stage id, and a `spaceId` that disagrees is
rejected rather than guessed.

## Building a card

1. `create_card` with the title and the primary platform. Keep the title short: a long one wraps
   and makes the column unreadable.
2. `update_card` for the body (script, notes, cover) and for its posts and assets.
3. `publish_post` when it is approved, or set `scheduledAt` and let it go at its time.

### `posts` and `assets` replace the whole set

⛔ **The mistake that loses work.** Both fields are declarative. Send one post and every other
platform on that card is deleted. Send one asset and the rest of the carousel goes with it.

**`get_card` first, then send the complete set you want to end up with.** Posts key on platform.
Assets key on id, and **the array order is the carousel order**, so reordering is just sending
the same ids in a different sequence. Keep an existing asset by id; add a new one by `assetUrl`
or `outputId`.

### Shaping a post for its platform

Do not guess a platform's fields. `list_platforms` shows what the account can publish to and
whether a connected account exists for each. `get_platform` returns the real shape: the fields,
the enums, and the character limits per format (post, reel, short, story, thread). Ground
`platformSettings` against that.

Each post needs a connected account. `list_connected_accounts` for the targets,
`get_connected_account` to confirm one can actually publish before you attach it. Connecting an
account happens in the app; you cannot do it from here.

## Scheduling and publishing

`scheduledAt` on `update_card` sets the time on the card **and every post** on it; pass `null` to
clear. Give an individual post its own `scheduledAt` to override for that platform.

`publish_post` goes out **now**, to every post on the card or to one named platform. It needs the
`publish:write` scope, and holding that scope is the account owner's standing consent to
autonomous publishing.

⛔ **Confirm the copy, the media, the platforms and the timing with the user before either
call.** Prefer scheduling. Publishing is public and cannot be undone from here.

## Moving work around

- **Between stages:** `update_card` with a `stage`. A card entering a stage goes to the TOP of
  it; the board reads newest-first.
- **Between spaces:** `update_card` with a `spaceId`. Without a stage it lands in the target's
  stage whose slug matches its current one, or that space's first stage.
- **In bulk:** pass `cardIds` to move a selection in one call. Fields that describe ONE card
  (title, notes, script, cover) still need exactly one.

## Organizing the board

`create_space` makes a new board; `duplicateFrom` copies another board's STAGES and never its
cards, so the new board arrives with the columns and none of the work. `update_space` renames or
re-covers it and is a PATCH, so omitting a field leaves it alone.

`create_stage` adds a column, placed with `afterId`/`beforeId`, or at the end. The slug is
derived from the name and is not settable. `update_stage` renames, recolors or moves one, and
**requires `spaceId`**, because a stage id alone does not tell the server which board you mean.

⚠️ **Renaming a column away from "Published" stops publishing auto-moving cards into it.**

`delete_stage` needs a `targetStageId` unless the column is empty: the server refuses to silently
drop the cards in it, tells you how many there are, and moves them in the same transaction.
`delete_space` refuses outright while it still holds cards, because the delete cascades to every
card, cover, caption, post and schedule in it. **Archive the board instead** unless the user
means it.

Tags are per-account labels: `list_tags`, `create_tag`, `update_tag`, `delete_tag`, and attach
them when you create or update a card.

## Where the other workflows meet this one

- Copy for a card comes from `references/voice-synthesis.md`, grounded per
  `references/grounding.md`. Never publish words the user has not approved.
- Media for a card comes from `references/generating.md` or the library
  (`references/media-library.md`).
- Errors and scopes: `references/troubleshooting.md`.
