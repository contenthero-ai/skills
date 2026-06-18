# ContentHero Cookbook

End-to-end recipes that chain the skills. Tool names are the MCP names; the CLI equivalents are `contenthero <noun> <verb>`. Across every recipe: ContentHero supplies the context and the execution, the host LLM does any drafting (grounded, never generic), and the user approves before anything ships.

## Ground the workspace on a brand (run this first)

The setup every other recipe assumes. `contenthero-brand`:

1. `list_brand_kits` -> resolve the active brand kit (one, the default, or ask).
2. `get_brand_kit` -> summarize the voice and offer back in a line.
3. Write `active_brand_kit_id` (and any default avatar / connected accounts) to `.contenthero/context.md`.

Now `contenthero-pipeline` and `contenthero-generate` pick the brand up without re-asking.

## On-brand caption for an existing reel

The everyday request: the user has a clip and wants a caption in their voice. `contenthero-pipeline` + `contenthero-brand`:

1. Ground: `list_outliers` (scoped with `brandKitId`) -> pick the top few -> `get_inspiration_content` on each for hooks and structure. `get_brand_kit` for voice. `get_brand_account_performance` for the user's own best posts. `search_brand_knowledge` for the brand's stance on the topic.
2. Draft (host LLM): write the hook and caption emulating the user's proven patterns, in their voice. Present for approval.
3. Attach: `create_post` (the approved caption as the description) -> `add_post_asset` (the reel) -> `add_post_destination`.
4. Ship: `schedule_post` or `publish_post`, after the user confirms.

## Outlier to on-brand clip, scheduled (the full pipeline)

Research to published, end to end:

1. Ground: `list_outliers` -> `get_inspiration_content` (patterns) + `get_brand_kit` (voice/visual) + `search_brand_knowledge` (brand stance) + `get_brand_account_performance` (own top posts).
2. Draft (host LLM): concept + hook + caption, grounded in the above. Approve.
3. Produce (`contenthero-generate`): `generate_image` for the key frame -> chain its output id into `generate_video` as the start frame. Ground the visual in the brand's `visualStyle`.
4. Assemble: `create_post` -> `add_post_asset` (the video) -> `add_post_destination` (platform + format + connected account).
5. Ship: `schedule_post`, after confirming destinations and timing.

## Talking-head post

A presenter clip from a script the user supplies:

1. `generate_audio` (`elevenlabs-tts`, the user's script + a `voiceId`) -> capture the audio output id.
2. `generate_lip_sync` (a portrait `imageUrl` + the audio output id) -> the talking-head video.
3. `create_post` -> `add_post_asset` (the video) -> `add_post_destination`.
4. `schedule_post`.

The script is the user's. If they have not supplied one, that is a `contenthero-pipeline` Draft (grounded), not an invention.

## Capture a lesson into the knowledge base

How the brand gets smarter over time. `contenthero-brand`:

1. After a decision, a result, or a shared resource, offer to remember it.
2. `add_brand_knowledge` (`sourceType: text` for a lesson or decision; `url` / `youtube` for a resource; `file` for a document). Confirm first, give it a clear title.
3. Tell the user it is now searchable. Future recipes' Ground steps will surface it via `search_brand_knowledge`.

Example moments: "we learned short hooks outperform for us" (text), "add this competitor teardown" (url), "remember this brand guidelines PDF" (file).
