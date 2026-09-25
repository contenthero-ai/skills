# ContentHero Cookbook

End-to-end recipes. Tool names are the MCP names; the CLI equivalents are
`contenthero <noun> <verb>`.

Across every recipe: ContentHero supplies the context and the execution, **the host LLM writes
any words**, grounded and never generic, and **the user approves before anything goes live**.

## Ground the workspace on a brand (run this first)

The setup every other recipe assumes.

1. `list_brand_kits`, resolve the active kit (the only one, the default, or ask).
2. `get_brand_kit` with `detail: 'summary'`, then the voice and offer sections; summarize them back in one line.
3. Write `active_brand_kit_id` to `.contenthero/context.md`.

Later work picks the brand up without re-asking. Revalidate before spending on it.

## On-brand caption for a clip the user already has

The everyday request.

1. **Ground.** `list_content` scoped to the brand kit for what performs, `get_content` on the top
   two or three (transcript on, since you are mining the script). `get_brand_kit` with `roles` for the voice and style sections.
   `search_brand_knowledge` for the brand's stance on the topic.
2. **Draft.** Host LLM writes the hook and caption, emulating the user's proven patterns in their
   voice. Present it, say which grounding it stands on, get approval.
3. **Assemble.** `create_card` with the approved copy, then `update_card` to attach the clip as an
   asset and add the platform post. ⛔ **`assets` and `posts` replace the whole set**, so send
   everything you want to keep.
4. **Ship.** Set `scheduledAt`, or `publish_post` to go now, after confirming platforms and
   timing.

## Outlier to scheduled clip (the full pipeline)

Research to published.

1. **Ground.** `list_spaces` to know which board you are working on. Then `list_content` for the
   patterns, `get_content` for the depth, `get_brand_kit` for the voice and Design Guidelines sections,
   `search_brand_knowledge` for the brand's position.
2. **Draft.** Concept, hook, caption. Approve before spending a credit on it.
3. **Produce.** `list_models` then `get_model` for the shape. `generate_image` for the key frame,
   with `getCost` first. Chain its output id into `generate_video` as the start frame. Ground the
   visual in the brand's Design Guidelines.
4. **Assemble.** `create_card` **with the `spaceId`** so it lands on the right board, then
   `update_card` for the video asset and the platform post. `get_platform` for that platform's
   real field shape rather than guessing it.
5. **Ship.** Schedule it, after confirming.

## Talking-head post from a script the user supplies

1. `generate_audio` with the user's script and a `voiceId` from `list_voices`. Capture the output
   id.
2. `generate_lip_sync` with a portrait plus that audio output id. An avatar's look is the natural
   portrait, and its `defaultVoiceId` the natural voice.
3. `create_card`, then `update_card` to attach the video and the post.
4. Schedule.

⛔ **The script is the user's.** If they have not supplied one, that is a grounded drafting job,
not something to improvise.

## Build a consistent character, then use it everywhere

1. `create_avatar` with `getCost` first, since it spends. Supply reference photos for a likeness,
   or omit them to invent one.
2. ⚠️ **Poll `get_avatar` until status is `completed`.** It returns before the avatar is usable.
3. `generate_board` from its look for a multi-angle consistency sheet.
4. Pass the board or the look as a reference into every later generation.

## Turn a rough recording into a finished post

1. `import_media` if it is on a URL, or `create_media_upload` then PUT then
   `complete_media_upload` for a local file.
2. `edit_audio` to isolate the voice or enhance the recording. `getCost` first.
3. `transcribe` for the text. ⚠️ **It spends and cannot be priced in advance**, so say so before
   doing it to something long.
4. Ground and draft the caption from the transcript, then assemble the card as above.

## Assemble and export in the editor

1. `list_projects`, or `create_project` for a new one.
2. `get_project` for its current state and revision.
3. `update_timeline` or `update_canvas` with a batch of ops. Pass `expectedRevision` when anyone
   else might be editing, so a concurrent change fails loudly instead of being overwritten.
4. `get_context` to see a frame. Its `mode: 'video'` then `get_preview` only when the question is
   about motion or pacing, since that one renders and has to be polled.
5. `get_export_formats`, then `export_project`, then poll `get_export`.

## Capture a lesson so the brand gets smarter

1. After a decision, a result, or a useful resource, offer to remember it.
2. `add_brand_knowledge`. Confirm first, give it a clear title.
3. Tell the user it is now searchable, so future grounding will surface it.

Moments worth capturing: "short hooks outperform for us", a competitor teardown, a brand
guidelines document. **When a user says "remember this", this is the call**, not a note in the
chat that dies with the session.

## Clean up without destroying anything

1. `archive` with the right `assetType` hides a card, a space, a brand kit section, a project.
   Pass `archived: false` to restore.
2. ⚠️ **Archived still counts against storage.** If the user is near a limit, say that archiving
   will not fix it.
3. `delete_space` and `delete_project` genuinely remove things, and deleting a space cascades to
   every card on it. **When a user says "delete", work out whether they mean hide, and default to
   archive.**
