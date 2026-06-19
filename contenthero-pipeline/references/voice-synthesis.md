# Voice synthesis: grounding to draft

This is the method that makes a ContentHero draft different from a generic "write me a caption" prompt. The skill grounds the host LLM in the user's real, performing context, and the host LLM drafts in the user's own voice, emulating what already works for them. The output is a draft the user approves.

The rule: **grounded voice-synthesis is the feature; generic ungrounded copy is the anti-pattern.** If the grounding is missing, ask for it or proceed without claiming the result is on-brand. Do not fill the gap with generic copywriting.

## The three grounding sources

Pull all three before drafting. Each answers a different question.

1. **Brand voice: how this user sounds.** `get_brand_kit` returns `voiceProfile`, `audience`, `positioning`, `contentStrategy`, `designPrinciples`, and `sections` (each section has `fields` of `{ key, label, value }`). Read these for tone, vocabulary, the audience being addressed, and any explicit do-nots. Banned words or tone guardrails usually live in `voiceProfile` or a voice section field, not a dedicated column, so read the voice profile and sections rather than assuming a field name.

2. **What performs in the niche: proven patterns.** `list_outliers` returns the top content the user tracks, ranked by `outlierScore` (also `engagementRate`, `viewsPerFollower`). This list is shallow (title plus metrics). To mine a pattern you need the depth, so this is a two-step read.

3. **What performs for this user: their own track record.** `get_brand_account_performance` returns the user's own `topContent` and `recentContent` (plus totals and averages). `list_posts` and `get_post` surface their past captions (`description`), `script`, and `notes`. This is the most important voice signal: the user's own best posts are the truest model of their voice.

## The list-then-get mining pattern

Outliers and brand-account content come back as shallow `Outlier` records (title and metrics, no transcript). The deep fields you draft from come from a second call:

1. `list_outliers` (or read `topContent` from `get_brand_account_performance`) to rank and choose the few most relevant, highest-performing items.
2. `get_inspiration_content <id>` on each chosen item to get `transcript`, `description`, `hashtags`, `keywords`. These are what you extract pattern primitives from.

Do not try to mine a hook or structure from the list view. Pick from the list, then get the detail.

## Extracting pattern primitives

From the deep content of the chosen high performers, extract the durable, transferable patterns, not the literal words:

- **Hook archetype:** how the opening earns attention (question, bold claim, pattern interrupt, number, contrarian take). Read it from the transcript's first lines and the title.
- **Structure:** the shape (problem then payoff, list, story arc, demo then result). Read it from the transcript flow.
- **Pacing and length:** short and punchy vs longer build, from `durationSeconds` and transcript density.
- **CTA style:** how they close and ask for the action.
- **Hashtag and keyword strategy:** from `hashtags` and `keywords`, the volume and specificity that travels in this niche.

You are extracting the *pattern*, not copying the post. Two or three high performers reveal the shape; emulate the shape in the user's voice and topic.

## Encoding the user's voice

From the brand kit and the user's own top posts, hold these while drafting:

- Tone and register (from `voiceProfile` and the user's actual past captions).
- Vocabulary the user uses, and any words or claims to avoid.
- The audience being spoken to (`audience`).
- The positioning and offer the content should serve (`positioning`, `primaryOffer`, `contentStrategy`).

When the brand voice profile and the user's own top-performing captions disagree, the user's actual high-performing posts win: they are evidence, the profile is intent.

## The draft

Synthesize: take the proven pattern primitives, apply them to this post's topic, and write in the user's voice for the user's audience.

- Produce the pieces the platform needs: hook, caption or script, hashtags, CTA. Match the destination platform's norms (a Reel caption is not a YouTube description).
- Keep it the user's, not yours. If you would not believe the user wrote it, rewrite it.
- **Present the draft to the user and get approval.** Offer the reasoning briefly ("modeled the hook on your top Reel's question opener, kept it to your usual short punchy caption") so they can steer.
- Iterate on feedback. Never proceed to produce or publish on an unapproved draft.

## When grounding is thin

- **No brand kit:** ask the user for tone direction, or proceed and tell them the draft is not yet brand-grounded. Do not pretend it is on-brand.
- **No outliers tracked:** lean on the user's own past posts as the pattern source. If there are none either, draft from the user's stated intent and say the patterns are not yet grounded.
- **No past posts:** lean on the niche outliers. State which grounding you used.

Always tell the user which grounding the draft stands on. That transparency is part of the value: they know the draft emulates real, performing context, not a generic template.
