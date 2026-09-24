# Account: balance, platforms, and what the user is looking at

Small surface, three genuinely different questions.

## What can they spend

`get_balance` returns the credit balance, the tier, and top-up state. Read it before a large
batch so you can tell the user whether it will actually complete, rather than discovering it
half way through.

⛔ **Never quote a plan's limits from memory.** Tier limits change without a deploy. If the user
asks what their plan includes, read it, or send them to the app.

## Where can they publish

`list_platforms` is the discovery catalog: every platform the account can publish to, each
platform's formats, and whether a connected account exists for it. `get_platform` returns one
platform's full publishing shape, the fields, options and character limits per format.

**Ground a post's `platformSettings` against `get_platform` instead of guessing the fields.**
Platforms change their requirements and the catalog is live; your memory of Instagram's caption
limit is not.

Note the difference from `list_connected_accounts` (`references/planner.md`): platforms are what
the product supports, connected accounts are what this user has actually hooked up.

## What are they looking at right now

`get_context` reads the live state of the open app: the active surface, the focused element, the
playhead position, and the current selection.

This is the tool that turns "make this one brighter" from a guess into an action. **When a user
says "this", "here", or "the selected one", read the context rather than asking them which.** It
is also how you land a new card in the space they are actually looking at instead of the default
board.

It can render a frame or a few frames of what is on screen, which is the cheap instant answer for
"how does it look" (`references/editor.md` covers when to reach for a full preview instead).
