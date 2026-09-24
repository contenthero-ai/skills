# Research: what actually performs

The research surface answers "what should we make" with evidence instead of instinct. It is the
grounding that makes a draft on-brand rather than generic, so reach for it before writing.

⚠️ **This surface was renamed and merged, and no skill covered it before 2026-09-17.** The old
list_inspiration_accounts, list_brand_accounts, list_outliers,
get_inspiration_content and get_brand_account_performance are gone, collapsed into four
tools.

## Two kinds of account, one list

`list_accounts` returns the social accounts this ContentHero account **tracks**, and it holds two
kinds distinguished by `accountType`:

- `inspiration`: creators and competitors the user watches, for research.
- `brand`: the user's OWN profiles.

⚠️ **These are TRACKED SOCIAL ACCOUNTS, not the user's ContentHero account** and not their
publishing connections. Three different things:

| You want | Use |
|---|---|
| Who the user watches, and their own profiles as data | `list_accounts` (this file) |
| Where the user can publish | `list_connected_accounts` (`references/planner.md`) |
| The user's balance and plan | `get_balance` (`references/account.md`) |

`get_account` gives one tracked account with how its content actually performs: post counts,
total and average views, likes, comments, average engagement and outlier score, plus its top
posts and its most recent ones. **It works for both kinds**, so it is how you answer "how is my
account doing" and "how is this competitor doing" with the same call.

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

The pattern, every time:

1. `list_content`, ranked, filtered to the brand and a recent window.
2. Read the top handful.
3. `get_content` with the transcript on the two or three that are genuinely close to what the
   user is making.
4. Extract the pattern, not the content: hook archetype, structure, pacing, CTA style.

⛔ **Mine the pattern, never the words.** Copying a competitor's phrasing is plagiarism with
extra steps, and it will not sound like the user. The method for turning patterns into their
voice is `references/voice-synthesis.md`.

## Where this meets the rest

- Brand voice and the knowledge base, the other half of grounding: `references/grounding.md`.
- Turning grounding into a draft: `references/voice-synthesis.md`.
- Tracked accounts are linked to a brand kit through `update_brand_kit`, which is covered in
  `references/grounding.md`.
