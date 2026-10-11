# Research: what actually performs

The research surface answers "what should we make" with evidence instead of instinct. It is the
grounding that makes a draft on-brand rather than generic, so reach for it before writing.

⚠️ **This surface was renamed and merged, and no skill covered it before 2026-09-17.** The old
list_inspiration_accounts, list_brand_accounts, list_outliers,
get_inspiration_content and get_brand_account_performance are gone, collapsed into four
tools.

## Two kinds of account, one list

`list_tracked_accounts` returns the social accounts this ContentHero account **tracks**, and it holds two
kinds distinguished by `accountType`:

- `inspiration`: creators and competitors the user watches, for research.
- `brand`: the user's OWN profiles.

⚠️ **These are TRACKED SOCIAL ACCOUNTS, not the user's ContentHero account** and not their
publishing connections. Three different things:

| You want | Use |
|---|---|
| Who the user watches, and their own profiles as data | `list_tracked_accounts` (this file) |
| Where the user can publish | `list_connected_accounts` (`references/planner.md`) |
| The user's balance and plan | `get_account` (`references/account.md`) |

`get_tracked_account` gives one tracked account with how its content actually performs: post counts,
total and average views, likes, comments, average engagement and outlier score, plus its top
posts and its most recent ones. **It works for both kinds**, so it is how you answer "how is my
account doing" and "how is this competitor doing" with the same call. `update_tracked_account` moves a tracked
account within its list.

## Outlier score is the whole idea

`list_content` is the core research read: tracked posts **ranked by outlier score**.

**An outlier score measures a post against its own creator's baseline, not the platform's.** A
small account's breakout scores higher than a large account's routine post. That is the point:
it surfaces what worked *unusually well for that creator*, which is a repeatable pattern, rather
than what merely got big numbers because the account is big.

`list_content` spans both the creators they watch and their own posts. Filter by account type,
platform, content type, outlier score range, views, duration, or the account's follower count.
Scope it to a brand kit to get only the accounts linked to that brand.

## List shallow, then get deep

`list_content` is deliberately shallow: enough to rank and choose. The fields you actually mine
for a hook and a structure come from `get_content` on the few that matter.

`get_content` returns engagement stats, outlier score, hashtags, keywords, mentions and audio
info for one post. **The transcript is opt-in**, because a long video is a large document. Ask
for it when you are going to mine the script, not by default.

`analyze_content` works on a post for analysis, as one of three kinds. `breakdown` (the default) runs Break It Down:
why it works, from the hook and structure to the call to action and the steps to recreate it.
`scenes` prepares the post to be seen: each scene's time range, what happens and what is said in
it, and a frame of each. Ask for scenes when the task depends on what the video shows, not only
what it says. `get_content` reports whether either exists, and reading them is free (`analysis`
for the breakdown, `scenes` for the scenes); creating one spends credits, and scenes are priced
per minute of video. The third kind, `video`, is below.

`analyze_content` with `kind: "video"` downloads every video a post holds, its one video or each
video slide of a carousel, into shared analysis copies, which the reading tools use. Once stored,
each video answers with its cut list (where it changes scene), free, reported by slide for a
carousel. A post with no video says so: its images are already stored and readable. Nothing lands in
the user's library or counts against their storage; for the footage itself, `import` the post's page
address as `url` instead. It is charged for what the downloads moved, and is free when the copies
already exist or are being made, so price it with `getCost` first. A copy still downloading answers
pending: call `analyze_content` again with the same `contentId` and kind to follow it, at no charge.
It needs the `studio:generate` scope. `get_content` reports each video's state every time (`absent`
until it is downloaded), and `cuts` adds each downloaded video's cut list, free, narrowed by
`startMs`/`endMs`.

To see and hear a downloaded video, not only read its cuts, `view` it as a source with its
`contentId` (and `slide`, the 0-based slide a carousel video is reported by): frames at its cut
list's seconds with `atSec`, or across a window with `count` or `perSecond`, and `sound` for the
window's loudness, where its sounds start and a picture of its waveform and spectrogram. That is how
to study a post's pacing and its sound, beat by beat (`references/editor.md`).

The pattern, every time:

1. `list_content`, ranked, filtered to the brand and a recent window.
2. Read the top handful.
3. `get_content` with the transcript on the two or three that are genuinely close to what the
   user is making.
4. Extract the pattern, not the content: hook archetype, structure, pacing, CTA style.
5. When the work lands on a card, attach the posts it drew from as inspiration, by `contentId`
   (`references/planner.md`, "What a card can hold").

⛔ **Mine the pattern, never the words.** Copying a competitor's phrasing is plagiarism with
extra steps, and it will not sound like the user. The method for turning patterns into their
voice is `references/voice-synthesis.md`.

## Where this meets the rest

- Brand voice and the knowledge base, the other half of grounding: `references/grounding.md`.
- Turning grounding into a draft: `references/voice-synthesis.md`.
- Tracked accounts are linked to a brand kit through `update_brand_kit`, which is covered in
  `references/grounding.md`.
