# Voice synthesis: grounding to draft

This is the method that makes a ContentHero draft different from a generic "write me a caption" prompt. The skill grounds the host LLM in the user's real, performing context, and the host LLM drafts in the user's own voice, emulating what already works for them. The output is a draft the user approves.

The rule: **grounded voice-synthesis is the feature; generic ungrounded copy is the anti-pattern.** If the grounding is missing, ask for it or proceed without claiming the result is on-brand. Do not fill the gap with generic copywriting.

## The three grounding sources

Pull all three before drafting. Each answers a different question.

1. **Brand voice: how this user sounds.** The brand kit's sections, read by role (`get_brand_kit` with `roles`, after a `detail: 'summary'` read if you do not know what the kit holds). `voice_and_tone` is the personality and principles; `writing_style` covers written pieces and `speaking_style` covers anything spoken; `audience` is who you are addressing and `offer` is what the content serves. Each is Markdown in the user's own structure, so read the whole section rather than looking for a particular heading. Anything the brand avoids is written into these sections as principles.

2. **What performs in the niche: proven patterns.** `list_content` returns the posts the user tracks, ranked by OUTLIER SCORE, which measures a post against its own creator's baseline rather than the platform average. That is why a small account's breakout outranks a big account's routine post: it is a repeatable pattern rather than a big number. The list is shallow (title plus metrics), so mining one is a two-step read. Filters and the full surface are in `research.md`.

3. **What performs for this user: their own track record.** `get_account` on one of the user's own tracked profiles (`accountType: 'brand'`) returns their top and most recent posts with totals and averages. `list_cards` and `get_card` surface the captions, scripts and notes they have written before. **This is the most important voice signal**: the user's own best posts are the truest model of their voice, ahead of any stated profile.

## The list-then-get mining pattern

Ranked content comes back shallow: title and metrics, no transcript. The deep fields you draft from need a second call.

1. `list_content`, filtered to the brand and a recent window, to rank and choose the few most relevant, highest-performing items. `get_account` on one of the user's own tracked profiles gives the same ranking for their own back catalog.
2. `get_content` on each chosen item for `description`, `hashtags`, `keywords` and audio info. ⚠️ **The transcript is OPT-IN**: ask for it only on the two or three you will actually mine, because a long video is a large document.

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

- Tone and register (from Voice & Tone, the style section for this format, and the user's actual past captions).
- The principles the user writes by, and anything they avoid.
- The audience being spoken to (Audience).
- What the content should serve (Offer and Content Strategy).

When the brand kit and the user's own top-performing captions disagree, the user's actual high-performing posts win: they are evidence, the kit is intent.

## The draft

Synthesize: take the proven pattern primitives, apply them to this post's topic, and write in the user's voice for the user's audience.

- Produce the pieces the platform needs: hook, caption or script, hashtags, CTA. Match the target platform's norms (a Reel caption is not a YouTube description), and read them from `get_platform` rather than memory.
- Keep it the user's, not yours. If you would not believe the user wrote it, rewrite it.
- **Present the draft to the user and get approval.** Offer the reasoning briefly ("modeled the hook on your top Reel's question opener, kept it to your usual short punchy caption") so they can steer.
- Iterate on feedback. Never proceed to produce or publish on an unapproved draft.

## When grounding is thin

- **No brand kit:** ask the user for tone direction, or proceed and tell them the draft is not yet brand-grounded. Do not pretend it is on-brand.
- **No outliers tracked:** lean on the user's own past posts as the pattern source. If there are none either, draft from the user's stated intent and say the patterns are not yet grounded.
- **No past posts:** lean on the niche outliers. State which grounding you used.

Always tell the user which grounding the draft stands on. That transparency is part of the value: they know the draft emulates real, performing context, not a generic template.
