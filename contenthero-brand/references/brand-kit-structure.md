# Brand kit structure

A brand kit is one coherent document. `get_brand_kit` (CLI `contenthero brand-kit get <id>`) returns all of it in a single read. It maps to five tabs in the app; here is where each field lives and how to edit it.

## The five tabs

### Overview
Core identity, returned as top-level fields on the brand kit:
- `businessName`, `primaryOffer`, `nicheDefinition`
- `positioning`, `audience`, `contentStrategy` (structured objects)
Plus the overview `sections` (each a `{ tab: "overview", sectionName, fields }`): typically About, Audience, Content Strategy, Positioning.

### Voice
The grounding the pipeline leans on most:
- `voiceProfile` (structured object: tone, register, and so on)
- the voice `sections`: **Brand Voice**, **Do's and Don'ts**, **Language and Themes**. The do-not list and banned words usually live in Do's and Don'ts or inside `voiceProfile`, not in a dedicated column, so read the voice profile and the voice sections together.

### Visual identity
Grounds image and video generation:
- `logos`, `brandColors`, `typography`, `visualStyle`, `designPrinciples`, `assets`

### Social
- `brandAccounts` (the brand's own social accounts) and `inspirationAccounts` (the creators it tracks). Each now carries an `id` and `accountType`, so you can drill into one with `get_inspiration_account` / `get_brand_account_performance`, or scope reads to this brand kit. See `inspiration.md`.

### Knowledge
- `knowledge` here is a capped preview list (titles plus truncated bodies). For the real knowledge base (full search, browse, read, add, remove) use the dedicated tools in `knowledge.md`.

## Reading and summarizing

`get_brand_kit` returns the whole document. The summary fields to lead with depend on the question:
- "summarize my voice" -> `voiceProfile` + the voice sections.
- "what's my offer / who's my audience" -> `primaryOffer`, `audience`, `positioning`, `nicheDefinition`.
- "what are my brand colors / fonts" -> `brandColors`, `typography`, `visualStyle`.

Return what was asked. Do not print the entire document.

## Editing

All edits require `brandkit:write` and should be confirmed with the user first (show old -> new).

- **Identity fields:** `update_brand_kit` (CLI `contenthero brand-kit update <id> ...`). Allow-listed fields: name, businessName, websiteUrl, primaryOffer, nicheDefinition, positioning, audience, voiceProfile, visualStyle, designPrinciples, brandColors, typography, contentStrategy. The structured objects (positioning, audience, voiceProfile, contentStrategy) are passed whole; edit them precisely rather than flattening.
- **Sections:** `add_brand_kit_section` / `update_brand_kit_section` / `archive_brand_kit_section` (CLI `contenthero brand-kit section add|update|archive`). A section is a `tab` + `sectionName` + `fields` (each field `{ key, label, type, value }`). Use these to add or refine a voice or overview section (e.g. a new "Catchphrases" voice section).
- Archiving is reversible (soft delete); there is no hard delete.

## The active brand kit cache

After resolving which brand kit the work is for, write it to `.contenthero/context.md` (schema in `CLAUDE.md`): `active_brand_kit_id`, `active_brand_kit_name`, and any default avatar or connected-account ids you encounter. The other skills read this first. Always revalidate a cached id with a live read before relying on it for a spend or a publish.
