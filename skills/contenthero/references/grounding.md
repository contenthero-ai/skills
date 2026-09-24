# Brand context: resolve it, read it, grow it

The brand kit is the user's identity as data. It is the grounding that makes a draft theirs, and
it is the first thing to settle in almost any session.

## Resolve the active brand kit first, and cache it

Most work is for one brand. Settle which one before anything else.

1. Check `.contenthero/context.md` for a cached `active_brand_kit_id`. **Revalidate it with
   `get_brand_kit`**: it may have been archived since.
2. Otherwise `list_brand_kits`. One kit, use it. Several, ask, or take the default. None, offer
   to create one.
3. Write the resolved id and name back to `.contenthero/context.md` so a later workflow does not
   re-ask.

`create_brand_kit` builds one from any of three sources, and the fastest is rarely the obvious
one:

- **From a website:** pass `websiteUrl` with `extract: true` and ContentHero scrapes the site and
  fills in business name, positioning, voice, colors, typography, logos and assets by itself. ⚠️
  **It returns IMMEDIATELY, before the kit has any content.** The empty kit is the handle and the
  fields arrive over the next minute or two, so poll `extractionStatus` with `get_brand_kit`
  rather than concluding it failed.
- **From a social profile:** pass its url and no name at all. The kit is named after the handle
  and starts ingesting that account's posts.
- **Empty, or a copy:** just a name, or `duplicateFrom` an existing kit.

Kits are capped by plan, and a duplicate counts against the cap like any other.

## The five tabs

One document, five areas. Read the one the question is about. `get_brand_kit` returns all of it
in a single read, so **summarize what was asked for and do not dump the whole document back**.

| Tab | Holds | Grounds |
|---|---|---|
| Overview | Business, offer, niche, positioning, audience, content strategy | What the brand is for |
| Voice | `voiceProfile`, tone, vocabulary, the do-not list | Every word you draft |
| Visual identity | Logos, colors, typography, visual style, design principles | Every image and video |
| Social | The brand's own profiles and the accounts it watches | Research (`references/research.md`) |
| Knowledge | Everything uploaded about the brand | The deepest grounding |

## The knowledge base is the highest-leverage read

This is where the user has put their notes, docs, articles and transcripts. It is richer than the
kit's structured fields and it is semantically searchable.

- **`search_brand_knowledge`** when you need what the brand has said about a topic. This is
  retrieval over embedded content, and it is the read to reach for **before drafting or deciding
  anything on-brand**. Most sessions should hit it and most do not.
- `list_brand_knowledge` to see what exists, `get_brand_knowledge` for one item's stored body.
- **`add_brand_knowledge`** when the user wants something remembered: a lesson, a decision, an
  asset description, an article. This is how the brand gets smarter over time. Confirm first, and
  tell them it is now searchable.
- `remove_brand_knowledge` on request.

When the user says "remember this", that is an `add_brand_knowledge` call, not a note in the chat
that dies with the session.

## Editing the brand

`update_brand_kit` changes identity fields, brand media, which kit is DEFAULT, and **which
tracked accounts the kit is LINKED to**. Only the fields you pass are touched.

⚠️ **The account lists are declarative: they REPLACE, and `[]` clears.** Same trap as
`update_card`'s posts. Read before you write.

Brand kit sections used to have their own create, update and archive tools. They no longer do:
**sections are edited through `update_brand_kit`, and a section is archived with the `archive`
tool** using `assetType: brand_kit_section`.

⛔ **Confirm a material change before writing it.** This is the user's real brand document. A read
or a summary needs no confirmation; a rewrite of their voice profile does. Show the field, show
old and new, get a yes.

Free-form objects (positioning, audience, `voiceProfile`, content strategy) are structured. Edit
them precisely. Do not flatten a nested object into a paragraph because it was easier to write.

## Where this meets the rest

- What performs, the other half of grounding: `references/research.md`.
- Turning grounding into a draft: `references/voice-synthesis.md`.
- Visual identity grounds prompts: `references/prompt-craft.md`.
