# Identity: avatars, looks, and boards as the reference library

ContentHero's reusable subjects (avatars and their looks) and reference boards are the "library" you feed into generation to keep a person, character, or product on-model across many outputs. This skill **consumes** them as inputs. It does not create avatars or manage boards as a workflow.

## Avatars and looks

An avatar is a saved subject. It has a base look (`imageUrl`) and a `defaultVoiceId`, and it can have several looks (variations).

- List: MCP `list_avatars`; CLI `contenthero avatar list`. Each entry has an `imageUrl` (base look) and a `defaultVoiceId`.
- Detail: MCP `get_avatar`; CLI `contenthero avatar get <id>`. Returns full detail and the avatar's looks.

Use an avatar by passing its look image into a generation:

- As a portrait for lip-sync: `generate_lip_sync({ imageUrl: "<avatar imageUrl or output-id>", ... })`, optionally with the avatar's `defaultVoiceId`.
- As a reference for image or video: pass the look image into `referenceImages[]` (or `startFrame`).

Cache the chosen avatar and look ids in `.contenthero/context.md` so other skills reuse them. **Revalidate before spending**: an avatar id from the cache may have been archived. A quick `get_avatar` (or `contenthero avatar get <id>`) confirms it still resolves.

## Voices

Lip-sync and TTS need a `voiceId`.

- List: MCP `list_voices`; CLI `contenthero voice list`.
- Detail: MCP `get_voice`; CLI `contenthero voice get <id>`.
- An avatar's `defaultVoiceId` is the natural default when animating that avatar.

## Reference boards

A board is a dense multi-panel sheet (3:4, 4K) that captures a subject from many angles or poses, used to keep it consistent. Boards are produced by `generate_board` (see `model-catalog.md`) and stored as media with `kind = board`.

- Browse existing boards: MCP `list_media` with the board kind filter; CLI `contenthero media list --kind board`.
- Reuse a board: pass its image (URL or output-id) into a later generation's `referenceImages[]`. Recipe in `chaining.md` ("Board to image").

## When to reach for the library

- The user wants the same person, mascot, or product across several outputs: build or pick a board, then reference it.
- The user wants a specific saved avatar to present or speak: pull the avatar, use its look image and `defaultVoiceId`.
- One-off generations with no consistency requirement do not need the library.
