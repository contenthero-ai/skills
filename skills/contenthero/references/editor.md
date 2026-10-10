# Editor: projects, timelines, canvases, exports

The editor is where media becomes a finished piece. A **project** is either a TIMELINE (video,
clips over time) or a CANVAS (slides and layers). Both are edited by sending batches of
operations, and both are versioned.

⚠️ **No skill covered this surface before 2026-09-17.** Sixteen tools, none of them mentioned
anywhere, which is why this file exists.

## Find the project before you edit it

`list_projects` to see what exists, `get_project` for one project's full state. `create_project`
starts a new one; `delete_project` removes it. `import_project` and `export_project` move a
project's definition in and out as a document. To copy a project, use `duplicate_project`.

When a new project is for a planned piece, **pass the card's id as `cardId` to `create_project` or
`import_project`**: the project is linked to that card in the same call, so the card opens the edit
in progress from the moment it exists. For a project that already exists, add
`{ "projectId": "<id>" }` to the card's assets instead.

Read `get_project` before an edit you did not just make yourself. You need its current shape, and
you need its revision.

## Project settings belong to the project

`get_project` reads a project's settings with its state; `update_project` changes them, along with its title, brand
kit and cover. A setting is shared by everyone who edits the project, and changing one is an edit that undo reverses.
Change settings with `update_project`, never inside an `update_timeline` or `update_canvas` batch: those carry
content only, and a setting sent there is refused.

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

## Versions, copies and undo

`undo_project_edit` and `redo_project_edit` step through the project's edit history, as the editor's Undo and
Redo do, whoever made the edit.

A **version** is a saved state you can come back to: `save_project_version` before a risky change,
`list_project_versions` to find one, `update_project_version` to name it, `delete_project_version` to remove it.
Two tools bring a version back, and they do different things:

- `restore_project_version` puts the version back into this project. The current state is saved as a version
  first, so the restore can itself be reversed.
- `duplicate_project` with `versionId` makes a NEW project from the version and leaves this one as it is.
  Without `versionId` it copies the project as it is now.

Restore when the user wants this project back where it was; duplicate when they want to keep both.

⚠️ Do not guess op names or layer kinds. `get_schema` with kind `timeline` or `layer` returns what
the surface actually accepts. An op the schema does not know is a 400, and a batch with one refused op
applies nothing, so check first.

## Code clips: code the editor draws

A code clip or layer is a video, audio or image whose content is a React component the editor draws on every frame.
**Read `get_schema` with kind `code` before writing or changing one.** It is the sandbox's own guide, generated from what the sandbox has: what
the code can import and what it cannot use, the box the code draws in, the brand prop names, the size limit, and
examples. Do not write code from memory of Remotion: the sandbox is a subset, and code it lacks is refused.

The write says what is wrong. Code that does not compile is refused, and the result's `diagnostics` name each finding
with its line and column; warnings apply and say what may go wrong. Fix every error and write it again. Then look at
it: `view` renders the frame, so check the clip at its start, middle and end before you call it done.

## Effects

Effects change or generate pixels: in code, on what it draws on a canvas; on a video or image clip, in its
`effects`, drawn after its color. **Read `get_schema` with kind `effect`** for the effects by group and where each can
go, and again with an effect's name for its parameters, ranges and defaults before you set them. An effect whose job a
color control already does is not offered on clips; use that control instead.

## Templates: the editor's Elements

A **template** is reusable code, a shape or an animated emoji: ContentHero's own, and the user's saved ones, the same
set the editor's Elements panel shows. `list_templates` to browse (by kind, category or search), `get_template` for one,
with its code and controls.

**Place one with an `insert_template` op** in `update_timeline` or `update_canvas`, not by copying its code into a new
clip. It places the clip the Elements panel would: branded with the project's brand kit, at the template's own size on
this canvas, and over the main video rather than splitting it. Set its props in the same op, choose where it lands
with `placement`, or pass `brand: false` to keep the template's own colors and fonts.

Save a template only when the user asks for one: `create_template` from a code clip, code layer or shape on a project (`fromItem`),
as a copy of another (`fromTemplateId`), or from its fields. A placed copy is a snapshot: changing a template changes
no clip already placed from it.

`update_template` changes one of the user's own templates and `delete_template` removes one; ContentHero's templates
are read-only, so copy one to change it.

## Overlays that stay on their moment

An overlay that belongs to a moment (a lower third on a speaker's name, a callout on a word) should carry an `anchor`:
`{ clipId, t }`, the clip on another track and the second of its footage where the overlay starts. `get_transcript`
gives the second: a word starts at its `startMs / 1000`. Set it with `update_clip`, or on the clip you create.

An anchored overlay follows its moment through every later edit (a ripple, a trim, a split, a silence cut) and is
removed, undoably, when the moment itself is cut. An unanchored one stays at its frame on the timeline while the
footage under it moves.

## Background removal is metered, and only for video

Both editors expose `remove_background`. **Image removal is free. Video removal is a premium,
metered feature**, charged per second with a duration cap, and it errors out if the plan or the
balance cannot cover it. It runs as an ASYNC job: the result carries an id to poll with
`get_generation_status`, the layer's media swaps to the transparent cutout when it lands, and the
original is kept.

Tell the user before removing a video background. It is the one op in this surface that spends.

## Seeing and hearing the work before you commit to it

One tool answers it: `view` with a render. What it returns is **ephemeral and never stored**, so none
of it is a deliverable.

- **A frame:** just `render`, for how a moment looks.
- **Motion, cuts, transitions, pacing:** frames across the range in question, with `count`, `perSecond`
  or `frames` and `fromFrame`/`toFrame`. Frames close together show how something moves; frames spread
  across a longer range show its pacing. Ask for the frames the question needs.
- **Sound:** `sound` renders the range's mix as an export mixes it, and measures it.
- **The range as it plays:** `video` watches it with its sound. Where video cannot be received, it comes
  back as frames across the range plus the sound measured.
- **A raw source clip, not your edit:** name it with `assetId` or `mediaUrl` and window it with
  `fromSec`/`toSec`, to judge footage before you cut it in.

A render is a job: what is not ready within the call comes back with a `renderId` to read later.
One frame cannot show pacing; frames across a range can.

## Exporting the finished piece

`get_schema` with kind `export` first: it tells you what this project can actually be exported as. Then
`export_project` to start the render, and `get_export` to poll it and collect the result.
`list_project_exports` lists the project's earlier exports, finished and running: check it before
exporting again, because a second export of the same edit is a second file the user keeps.

`get_transcript` pulls the spoken text out of a project's media, which is what you want for
captions, subtitles, or feeding a script back into a card.

`share_project` makes a public live link to a project, and revokes it. It is outward-facing, so share only when the
user asks.

## Where this meets the rest

- Media to put in a project comes from `references/media-library.md` or fresh from
  `references/generating.md`.
- **Link the project to its card when the project is made**, not when the edit is done: `cardId` on
  `create_project` or `import_project`. A finished export can then be attached as media too:
  `references/planner.md`, "What a card can hold".
- Failures, scopes and polling: `references/troubleshooting.md`.
