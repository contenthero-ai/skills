# Media library: getting files in, finding them, keeping them tidy

Everything the account owns as first-class media: what you generated, what you uploaded, what
you imported. Once a file is in here it has an `outputId`, and an `outputId` can be fed straight
into a generation or attached to a card without re-uploading it.

## Finding something

- `list_media` to browse.
- `search_media` when the user describes what they want rather than naming it.
- `get_media` for one item's full detail once you have its id.
- `show_media` to put a set in front of the user (search results, a folder, a shortlist). It renders a browsable grid and costs you almost no context. Use `get_media` instead only when you need to see the pixels yourself, and never re-show media that a create or import tool already displayed.

Prefer searching over listing-and-scanning when the user's phrasing is descriptive ("that beach
shot from last week"). Prefer `get_media` over re-listing when you already hold an id.

## Getting a file in

Two paths, and the right one depends on where the bytes are.

**Already on a public URL:** `import_media`. The server fetches it and re-hosts it, and returns
the `outputId` plus a public URL. One call. This is also the path for a hosted client that
cannot read local files.

**A local file: two phases, and both are required.**

1. `create_media_upload` returns a signed `uploadUrl` and **the exact headers to send**.
2. PUT the bytes to that URL **with those headers unchanged**.
3. `complete_media_upload` with the returned `outputId`.

⚠️ **Skipping step 3 leaves the upload unfinished.** The bytes may be in storage but the media
record is not real until you complete it. And do not edit the headers: they are part of what the
signature covers.

## Organizing

Folders are the structure: `list_folders`, `get_folder`, `create_folder`, `update_folder`,
`delete_folder`. `favorite` marks something worth finding again, and takes `favorited: false` to
clear it.

## Nothing is ever hard-deleted

`archive` hides an asset and takes `archived: false` to restore it. It works across the product,
not just media: pass `assetType` plus an id for a card, a brand kit, a brand kit section, a
project, a space and more. **ContentHero never hard-deletes, so this is always reversible**,
which makes archiving the correct answer almost any time a user says "get rid of this".

⚠️ **Archived is not deleted, and an archived item still counts against storage.** If the user's
actual problem is that they are near a limit, archiving will not fix it. Say so rather than
letting them think it did.

Note the contrast with the planner: `delete_space` and `delete_project` really do remove things,
and `delete_space` cascades to every card on the board. When a user says "delete", work out
whether they mean hide or destroy, and default to archive.

## Audio cleanup

`edit_audio` transforms existing audio with an audio-processing model: isolating a voice from
background noise, or enhancing a rough recording. It **spends credits**, so preview with
`getCost` first. It takes a standalone file by url, or audio already in the library.

`transcribe` turns audio into text. It **spends credits and cannot be priced in advance**,
because pricing it would mean reading the file's duration first. It is metered per minute, so
warn the user before transcribing anything long. The transcript comes back inline, no polling.

## Where this meets the rest

- An `outputId` from here is a valid reference input anywhere: `references/media-inputs.md`.
- Attaching media to a card, and the declarative-assets trap: `references/planner.md`.
- Putting media on a timeline or canvas: `references/editor.md`.
