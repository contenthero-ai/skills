# Identity: avatars, looks, voices, boards

The reusable library that keeps a person, character or product **on-model across many
outputs**. Reach for it whenever the user wants the same subject twice.

## Avatars and their looks

An avatar is a saved subject with a base look, a set of alternate looks, and a
`defaultVoiceId`. `list_avatars` to browse, `get_avatar` for one avatar's full detail and all
its looks.

### Creating one spends credits and does not finish when it returns

`create_avatar` **spends credits**, so preview with `getCost` first and tell the user the number.

Two ways to make one, and they produce different things:

- **Supply `referenceImageUrls`** and the avatar becomes a likeness of a real person from their
  photos.
- **Omit them** and the character is invented from the description and traits.

⚠️ **It returns as soon as the record exists, not when the avatar is usable.** It comes back at
status `processing` with no image, because its first look is still rendering. **Poll `get_avatar`
until status is `completed`** before feeding it into anything. Handing the id straight to a
generation gets you an error or an empty reference.

`update_avatar` renames one or changes its default look. Setting the default voice to none clears
it. `delete_avatar` is a soft delete and **its looks survive**, which matters: deleting an avatar
does not orphan the images you already generated with it.

Looks are added from images you already own, and removing one trashes it with a recovery window
rather than destroying it.

## Voices

Lip-sync and text-to-speech both need a `voiceId`. `list_voices` to browse, `get_voice` for one.

**Voices are read-only here.** Creating or cloning a voice happens in the app; there is no tool
for it, so do not promise one. An avatar's `defaultVoiceId` is the natural choice when animating
that avatar, and using a different voice for a familiar face is usually a mistake worth flagging.

## Reference boards

A board is a dense multi-panel sheet capturing a subject from many angles and poses. It is the
strongest tool available for consistency, because one image carries the whole subject.

Produce one with `generate_board` from a source image, a written description, or both. Boards are
stored as ordinary media, so `list_media` finds them again later.

Reuse a board by passing it into a later generation's reference inputs, exactly like any other
image. The recipe is in `chaining.md`.

## Choosing between them

| The user wants | Reach for |
|---|---|
| The same person across many posts | An avatar, and its look as a reference |
| A subject held consistent from several angles | A board |
| A saved face to speak | An avatar's look plus its `defaultVoiceId`, into lip-sync |
| A saved prop, location or character for the editor | An element (`editor.md`) |
| One-off with no consistency requirement | Nothing here. Just generate. |

Elements (`editor.md`) and avatars overlap in spirit and differ in use: an element is a saved
reference piece for editor projects, an avatar is a subject you generate and animate.

## Cache, then revalidate

Write the chosen avatar and look ids to `.contenthero/context.md` so later work reuses them.
⛔ **Revalidate with `get_avatar` before spending on a cached id.** It may have been deleted or
archived since, and discovering that after a paid video render is expensive.
