# ContentHero Cookbook

End-to-end workflow recipes that chain the skills. Each recipe names the tools in order (MCP names shown; the CLI equivalents are `contenthero <noun> <verb>`).

> Full recipes land in Slice 4. This file is a stub during the scaffold slice.

## Planned recipes

- **Talking-head post:** `generate_audio` → `generate_lip_sync` → `create_post` → `schedule_post`.
- **Outlier to on-brand clip, scheduled:** `list_outliers` → `get_brand_kit` + `list_posts` + `get_brand_account_performance` → [host LLM drafts via voice-synthesis] → `generate_image` → `generate_video` → `create_post` → `add_post_destination` → `schedule_post`.
- **On-brand caption for an existing reel:** ground in outliers + brand voice + recent posts → draft hook and caption emulating proven patterns → approval → attach to a post.
