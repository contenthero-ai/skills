# Inspiration, outliers, and performance

The brand's own performance and its niche's proven patterns are grounding. All reads here are read-only and can be scoped to the active brand kit.

## The brand's own performance (what works for this user)

- `list_brand_accounts` (CLI `contenthero brand-account list`) -> the user's own tracked social accounts. Pass the brand kit id (`--brand-kit <id>`) to scope to the accounts linked to this brand.
- `get_brand_account_performance <accountId>` (CLI `contenthero brand-account performance <id>`) -> content count, totals and averages, and the account's `topContent` and `recentContent`. The user's own top-performing posts are the truest model of their voice.

## The niche's proven patterns (what works for others)

- `list_inspiration_accounts` (CLI `contenthero inspiration accounts`) -> the creators the user tracks. Scope with `--brand-kit <id>`.
- `list_outliers` (CLI `contenthero inspiration outliers`) -> the top content across those creators, ranked by outlier score (how far a post overperformed its creator's baseline). Filters: platform, content type, min score, search, sort. Scope with `--brand-kit <id>` to get only the outliers from this brand's linked inspiration accounts.
- `get_inspiration_account <accountId>` -> one creator with its top outliers.

## The list-then-get pattern (for deep mining)

`list_outliers` and a brand account's `topContent` come back shallow (title plus metrics, no transcript). To mine a hook, structure, or hashtags from a high performer, take its id and call:
- `get_inspiration_content <contentId>` (CLI `contenthero inspiration content <id>`) -> the full item: description, transcript, hashtags, keywords, engagement.

So: list to rank and choose, then get the detail on the few that matter. Do not try to mine a pattern from the list view. (This is the same pattern `contenthero-pipeline`'s voice-synthesis uses.)

## Brand scoping (the linkage)

The brand kit links specific inspiration and brand accounts. Two ways to use that:
- From `get_brand_kit`: `inspirationAccounts[]` and `brandAccounts[]` now each carry an `id`, so you can go straight to `get_inspiration_account(id)` / `get_brand_account_performance(id)`.
- From the list reads: pass `brandKitId` (`--brand-kit <id>`) to `list_outliers` / `list_inspiration_accounts` / `list_brand_accounts` to get only what is linked to this brand, in one call.

Use brand scoping when the user is working within one brand, so the research reflects that brand's niche, not everything they track.

## What this grounds

- Hand the performance and outlier reads to `contenthero-pipeline` as the proven-pattern source for the Draft phase.
- Use the user's own top content as the primary voice signal (it beats a stated profile, because it is evidence).
