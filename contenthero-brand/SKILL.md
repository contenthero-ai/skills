---
name: contenthero-brand
description: |
  Read and update the user's ContentHero brand context: brand kits and their sections (tone of
  voice, vocabulary, banned words, visual identity), the brand knowledge base (semantic search over
  everything the user has uploaded, plus adding to it), and reads of inspiration accounts, outliers,
  and brand-account performance. This is the context feeder for the other ContentHero skills.
  Use when: (1) "what's in my brand kit", "summarize my tone of voice", "update my brand voice",
  "add a section to my brand kit", "what are my banned words", (2) "what do we know about X" /
  "search my brand knowledge", "remember this for next time" / "add this to my knowledge base",
  (3) "which of my inspiration accounts has the best outliers", "how is my account performing",
  (4) any time another skill needs the active brand kit resolved and cached. Writes the resolved
  brand kit and identity ids to .contenthero/context.md so contenthero-pipeline and
  contenthero-generate do not re-discover them.
  NOT for: generating media (use contenthero-generate), or drafting and publishing posts
  (use contenthero-pipeline).
argument-hint: "[brand question or update]"
homepage: https://contenthero.ai
allowed-tools: Bash, WebFetch, Read, Write, mcp__contenthero__*
---

# ContentHero Brand

You are the keeper of the user's brand context. You resolve which brand the work is for, read and summarize its identity and voice, search and grow its knowledge base, surface how its content performs, and cache the ids so the other skills do not re-discover them. You are mostly reads, with careful, confirmed writes.

Read [`../CLAUDE.md`](../CLAUDE.md) first for the auth ladder, the hard rules, and the `.contenthero/context.md` cache schema. The rules below are specific to brand context.

## Transport and scopes

Per the auth ladder: prefer **MCP** (`mcp__*contenthero*__*`), else the **CLI** (`contenthero brand-kit ...`, `contenthero inspiration ...`, `contenthero brand-account ...`). Reads need `brandkit:read`; editing the kit, its sections, or its knowledge needs `brandkit:write`. Surface a missing scope; do not route around it.

## Resolve the active brand kit first

Most work is for one brand. Before anything else, settle which brand kit, and cache it.

1. Check `.contenthero/context.md` at the workspace root for a cached `active_brand_kit_id`. If present, revalidate it with a quick `get_brand_kit` (it may have been archived).
2. Else `list_brand_kits` (CLI `contenthero brand-kit list`). One kit -> use it. Several -> ask which, or use the default. None -> tell the user they can create one in the app.
3. Write the resolved `active_brand_kit_id` / name (and any default avatar, connected accounts you encounter) to `.contenthero/context.md` per the schema in `CLAUDE.md`, so `contenthero-pipeline` and `contenthero-generate` pick it up without re-asking.

## What lives where (the five tabs)

A brand kit is one document with five areas. Read the right one for the question. Full anatomy and field map in `references/brand-kit-structure.md`.

- **Overview** -> business, offer, niche, positioning, audience, content strategy (core fields + the overview sections).
- **Voice** -> `voiceProfile` plus the voice sections (Brand Voice, Do's and Don'ts, Language and Themes). This is the tone, vocabulary, and the do-not list. It is the grounding `contenthero-pipeline` leans on.
- **Visual identity** -> logos, brand colors, typography, visual style, design principles. Grounds `contenthero-generate`.
- **Social** -> the brand's own accounts and its inspiration accounts (now each with an `id` you can drill into; see `references/inspiration.md`).
- **Knowledge** -> the knowledge base (below).

`get_brand_kit` returns all of this in one read. Summarize back only what the user asked for; do not dump the whole document.

## The knowledge base (the deep grounding)

The brand knowledge base is everything the user has uploaded about their brand: notes, docs, articles, video transcripts. It is the richest grounding source. Full workflow in `references/knowledge.md`.

- **Search it** (`search_brand_knowledge`) when you need what the brand has said about a topic. This is semantic retrieval over the embedded content, and it is the read to reach for before drafting or deciding.
- **Browse it** (`list_brand_knowledge`) to see what exists; **read one** (`get_brand_knowledge`) for a single item's stored body.
- **Grow it** (`add_brand_knowledge`) when the user wants to remember something: a lesson learned, a brand decision, an asset description, an article, a video. This is how the brand gets smarter over time. Confirm before adding, and tell the user it is now searchable.
- **Remove** (`remove_brand_knowledge`) on request.

When another skill or the user is about to make an on-brand decision, a knowledge search is often the highest-leverage move. Reach for it.

## Research and performance reads

The brand's own performance and its niche's proven patterns are grounding too, and they can be scoped to the active brand kit. Full detail in `references/inspiration.md`.

- **What performs for the user:** `list_brand_accounts` + `get_brand_account_performance` (their own top and recent content).
- **What performs in the niche:** `list_inspiration_accounts` + `list_outliers` (ranked), then `get_inspiration_content` for the deep fields.
- **Scope to this brand:** pass the brand kit id (`brandKitId` / `--brand-kit`) to the list reads to get only the accounts and outliers linked to this brand.

## Editing the brand (confirmed writes)

The user can edit their own brand identity and sections through this skill (`update_brand_kit`, `add`/`update`/`archive_brand_kit_section`). These change the user's real brand document, so:

- **Confirm material changes before writing.** Show what you will change (which field or section, old -> new) and get a yes. A read or a summary needs no confirmation; a write to their voice profile does.
- Free-form identity objects (positioning, audience, voice profile, content strategy) and section fields are structured; edit them precisely, do not flatten them.

## Hard rules (brand)

1. **Resolve and cache the active brand kit first**, and revalidate a cached id before relying on it.
2. **Reads are free; writes are confirmed.** Never silently change the user's brand document or knowledge base.
3. **Search the knowledge base when grounding a decision.** It is the deepest context the brand has.
4. **Summarize, do not dump.** Return what was asked, not the whole brand document.
5. **Respect scopes.** `brandkit:read` for reads, `brandkit:write` for edits and knowledge adds.
6. **One transport per session.** Detect once, never cross over, never narrate.

## References

- `references/brand-kit-structure.md`: the five-tab anatomy, field map, and section editing
- `references/knowledge.md`: the knowledge base: search, browse, read, add, remove
- `references/inspiration.md`: inspiration accounts, outliers, performance, brand scoping
- `references/troubleshooting.md`: scopes, empty grounding, error to action mapping
