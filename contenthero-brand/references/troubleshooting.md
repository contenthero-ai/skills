# Troubleshooting

## Scopes

- Reads (brand kit, knowledge search/list/get, inspiration, performance) need `brandkit:read`.
- Edits (`update_brand_kit`, the section writes) and knowledge writes (`add`/`remove_brand_knowledge`) need `brandkit:write`.

If a call fails on scope, tell the user which scope to grant in API Keys settings. Do not work around it.

## No brand kit

If `list_brand_kits` is empty, the user has no brand kit. They create one in the ContentHero app (it is not creatable through this skill). Without one, voice grounding and the knowledge base are unavailable; say so rather than improvising a brand.

## Several brand kits

When more than one brand kit exists and the user did not say which, ask, or use the default (the kit marked default). Cache the chosen one in `.contenthero/context.md` so you do not ask again. Always revalidate the cached id with a live `get_brand_kit` before relying on it.

## Knowledge search returns nothing

- The query may be too narrow, or the threshold too high. Broaden the query or lower the threshold.
- The knowledge base may be empty or thin. Confirm with `list_brand_knowledge`. If empty, offer to start adding to it.
- Search returns ranked chunks. If a chunk is a fragment and you need the whole item, take its `knowledgeId` and `get_brand_knowledge`.

## Knowledge add limits

The knowledge base is plan-limited (items per brand kit by tier). A `limitReached` error means the user is at their cap; point them at upgrading, or remove an item first. Large files and video or audio must be added by a hosted URL (`--file-url` / `fileUrl`) rather than a base64 `--file`, which is limited to small documents and images by the request-body size.

## Brand-scoped reads look empty

If `list_outliers --brand-kit <id>` or the scoped account reads return nothing, the brand kit may have no linked inspiration or brand accounts. Check `get_brand_kit` -> `inspirationAccounts` / `brandAccounts`. The user links accounts to a brand kit in the app.

## Edits

- `update_brand_kit` only accepts the allow-listed identity fields; system and state columns are not writable through this surface.
- The structured objects (positioning, audience, voiceProfile, contentStrategy) are passed whole. Read the current value, modify it, and write the full object, rather than sending a partial that would drop fields.
- Section and kit archiving is reversible (soft delete). There is no hard delete.

## The hard line

Never silently change the user's brand document or knowledge base. Reads and summaries are free; any write (an identity edit, a new section, a knowledge add or remove) is confirmed with the user first.
