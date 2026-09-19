# Editor: projects, timelines, canvases, exports

The editor is where media becomes a finished piece. A **project** is either a TIMELINE (video,
clips over time) or a CANVAS (slides and layers). Both are edited by sending batches of
operations, and both are versioned.

⚠️ **No skill covered this surface before 2026-09-17.** Sixteen tools, none of them mentioned
anywhere, which is why this file exists.

## Find the project before you edit it

`list_projects` to see what exists, `get_project` for one project's full state. `create_project`
starts a new one; `delete_project` removes it. `import_project` and `export_project` move a
project's definition in and out as a document, which is how you duplicate or back one up.

Read `get_project` before an edit you did not just make yourself. You need its current shape, and
you need its revision.

## Edits are batches of operations, and revision is how you avoid clobbering

`update_timeline` and `update_canvas` each take a batch of ops. A timeline op acts on clips and
tracks; a canvas op acts on layers and slides (`create_layer`, `update_layer`, `reorder_layer`,
`group_layers`, `create_slide`, `set_background`, and more). Each op is an object with an `op`
name plus its fields, and each successful edit returns a NEW revision for chaining the next one.

**`expectedRevision` is optional and that is a real choice, not a formality.**

- Omit it for last-write-wins. Fine when you are the only editor.
- Pass the revision from a prior `get_project` to **fail loudly on a concurrent change** instead
  of silently overwriting someone else's work.

You do not need to fetch the project just to get a revision; every edit hands the next one back.

⚠️ Do not guess op names or layer kinds. `get_timeline_types` and `get_layer_types` return what
the surface actually accepts. An op the schema does not know is a 400, and a batch that fails
part-way is worth avoiding by checking first.

## Background removal is metered, and only for video

Both editors expose `remove_background`. **Image removal is free. Video removal is a premium,
metered feature**, charged per second with a duration cap, and it errors out if the plan or the
balance cannot cover it. It runs as an ASYNC job: the result carries an id to poll with
`get_generation_status`, the layer's media swaps to the transparent cutout when it lands, and the
original is kept.

Tell the user before removing a video background. It is the one op in this surface that spends.

## Saved elements: the reusable pieces

An **element** is a saved reference piece (a character, a location, a prop) that you reuse across
projects. `list_elements` to browse, `get_element` for one, `create_element` to save a new one,
`update_element` to rename or recategorize it, `delete_element` to drop it.

Category `auto` lets the server classify an element from its image rather than making you choose.
The description is what makes an element findable later, so write a real one.

## Seeing the work before you commit to it

Two different answers, and picking the wrong one wastes time or money:

One tool answers all of it: `get_context` with a render. `mode` picks how much motion you need.

- **A frame:** just `render`. Cheapest and instant; `mode` defaults to `'image'`.
- **A few frames across a range:** `count` with `fromFrame`/`toFrame`. Still instant, still inline images.
- **Motion, cuts, transitions, pacing:** `mode: 'video'` renders a short low-res composed clip of
  a timeline range. This one is a JOB: it returns a renderId, you poll `get_preview` until it is
  done, then fetch the url. Capped at 20 seconds, because judging motion needs seconds not minutes.

All three are **ephemeral and never stored**, so none of them is a deliverable.

A still cannot show pacing. Reach for a preview only when the question is about motion.

## Exporting the finished piece

`get_export_formats` first: it tells you what this project can actually be exported as. Then
`export_project` to start the render, and `get_export` to poll it and collect the result.

`get_transcript` pulls the spoken text out of a project's media, which is what you want for
captions, subtitles, or feeding a script back into a card.

## Where this meets the rest

- Media to put in a project comes from `references/media-library.md` or fresh from
  `references/generating.md`.
- A finished export usually becomes an asset on a card: `references/planner.md`.
- Failures, scopes and polling: `references/troubleshooting.md`.
