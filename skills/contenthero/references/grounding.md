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

- **Imported:** pass `websiteUrls` (primary first) and/or the brand's own YouTube or Instagram in
  `brandAccounts`, with `extract: true`. ContentHero takes the colors, typography, logos and assets
  from the first website and analyzes every website and those accounts' posts to write the kit's
  empty sections. ⚠️ **It returns IMMEDIATELY, before the kit has any content.** The empty kit is
  the handle and the sections fill in over the next few minutes (longer while a newly linked
  account's posts arrive), so poll `analysisStatus` and `extractionStatus` with `get_brand_kit`
  rather than concluding it failed.
- **From a social profile:** pass its url and no name at all. The kit is named after the handle
  and starts ingesting that account's posts.
- **Empty, or a copy:** just a name, or `duplicateFrom` an existing kit.

Kits are capped by plan, and a duplicate counts against the cap like any other.

## Sections: what a kit holds

A brand kit is a set of named **sections**, each one Markdown document the user writes freely.
Every kit starts with the same eight, and the user can rename them and add their own:

| Tab | Section (role) | Grounds |
|---|---|---|
| Overview | About, Audience, Offer, Content Strategy | What the brand is for, who it serves, what it sells, what it publishes |
| Voice | Voice & Tone, Writing Style, Speaking Style | Every word you draft, written and spoken |
| Visual | Design Guidelines | Every image, video and layout |

The kit also holds its visual identity as data (logos, colors, typography) and the Social and
Knowledge tabs: the brand's own profiles and the accounts it watches (`references/research.md`),
and everything uploaded about the brand.

**Address a section by its `key`, and find what a section means by its `role`.** The key never
changes; the name is the user's to rename. A starter section's role is the same in every kit
whatever it is called, so `voice_and_tone` finds the voice even in a kit that renamed it. A
section the user added has no role: read the summary to see what it covers.

### Read the summary first, then only what the task needs

`get_brand_kit` reads three ways, and the cheapest one is the right first read:

1. **`detail: 'summary'`**: every section's key, role, version, length and outline (its own
   headings), with no bodies. Decide from this what the task needs.
2. **A filter** (`keys`, `roles`, or `tabs`): just those sections, with their Markdown bodies. A
   caption needs `voice_and_tone` and `writing_style`; a video script needs `speaking_style`
   instead; an image needs `design_guidelines`.
3. **No filter**: the whole kit, including media and linked accounts. Rarely what a task needs.

**Summarize what was asked for; do not dump a section back at the user.**

## The knowledge base is the highest-leverage read

This is where the user has put their notes, docs, articles and transcripts. It is richer than the
kit's sections and it is semantically searchable.

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

`update_brand_kit` changes section content, brand media, which kit is DEFAULT, and **which
tracked accounts the kit is LINKED to**. Only what you pass is touched.

**Sections are written by key, naming only the sections you change.** A `body` replaces the whole
section, so read it, change what needs changing, and send the whole new body back. Pass the
`version` you read as `expectedVersion`: if the section changed since (the user, or another agent,
edited it), nothing is written and the error returns its current version and body. Re-read,
reapply your change on top, and retry; never overwrite what somebody else just wrote. `revertTo`
restores an earlier version as a new one, so any write can be undone. A section without a key is a
new section of the user's own; a section is archived with the `archive` tool using
`assetType: brand_kit_section`.

⚠️ **The account and media lists are declarative: they REPLACE, and `[]` clears.** Same trap as
`update_card`'s posts. Read before you write.

⛔ **Confirm a material change before writing it.** This is the user's real brand document. A read
or a summary needs no confirmation; a rewrite of their Voice & Tone does. Show the section, show
old and new, get a yes.

Keep the user's structure. A section's headings are theirs: edit within them rather than
reorganizing the document because it was easier to write. And write principles, never sample
phrases: an AI that reads the kit later will reuse any example line word for word.

## Where this meets the rest

- What performs, the other half of grounding: `references/research.md`.
- Turning grounding into a draft: `references/voice-synthesis.md`.
- Visual identity grounds prompts: `references/prompt-craft.md`.
