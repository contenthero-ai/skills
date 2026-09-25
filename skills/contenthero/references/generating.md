# Generating: the loop that does not waste a spend

Image, video, audio, boards, lip-sync and upscaling. This is where the user's credits actually
go, so the order matters more here than anywhere else in the surface.

## The loop

### 1. Pick the model from the live roster, never from memory

`list_models` filtered by content type, or `get_model` once you have a candidate. The roster is
also the `modelId` enum on the generate tools, and an id that is not on it is rejected.

⛔ **Never name a model from memory.** The roster changes without a deploy. A model you remember
may be gone, renamed, or superseded by something better for the same job.

### 2. Get the model's real request shape

`get_model` returns the exact parameters that model accepts: input types, prompt mode and
character cap, duration range, resolutions, aspect ratios, max references, generation count,
audio support, features.

⚠️ **Sending a field a model does not take is a 400.** Models differ more than they look: a
resolution one accepts, another refuses. Ground the request in `get_model` instead of assuming
the family shares a shape.

When the model takes references, read its `promptReferences`. **It tells you how to address each
reference in the prompt for that specific model**: numbered tags, named tags, plain prose, or
describe-by-role. Using a scheme the model does not declare just drops stray text into the
prompt, which quietly degrades the result rather than erroring. Details in `media-inputs.md`.

### 3. Price it before you spend it

Every generation tool takes `getCost`, which returns the estimate and **runs nothing and charges
nothing**.

Use it before anything batched, long, high-resolution, or larger than the user is likely
expecting. For a routine single small image, skip it. **For video, always.** Surface the number
in credits before committing.

`get_balance` (`account.md`) tells you whether the spend will even complete.

### 4. Write the prompt properly

A weak prompt is a wasted spend, not just a worse result. `prompt-craft.md` is the durable craft;
read it once you know which model you are using, because the right prompt shape depends on it.

Ground the visual in the brand kit's Design Guidelines section (`grounding.md`) when the output is for the
user's brand.

### 5. Run it, then poll

Image, video, board, lip-sync and `upscale` are async with a smart-wait of roughly fifty seconds,
then hand back an id if the render is still going. Audio returns directly.

⛔ **Poll `get_generation_status` with the id. Never re-submit because it is slow.** A pending
status means it is still rendering. Re-submitting spends the credits again for the same output.
`get_generation_status` blocks by default and takes several ids at once, so a batch is one call.

### 6. Deliver the outcome

The media and what it cost. Not the output id, not the payload, not the model's parameters,
unless the user is going to chain on them.

## The operations

| Want | Tool | Note |
|---|---|---|
| Still image | `generate_image` | Text-to-image, or image-to-image with references |
| Motion | `generate_video` | From a prompt, a start or end frame, or references |
| Speech, music, sound effects | `generate_audio` | Synchronous, no polling |
| A consistency sheet | `generate_board` | Multi-panel reference sheet; see `identity.md` |
| A face that speaks | `generate_lip_sync` | A portrait plus an audio clip or a script |
| More resolution | `upscale` | Image or video, at a model-supported factor |
| Cleaner audio | `edit_audio` | Isolate a voice, enhance a recording (`media-library.md`) |
| Audio into text | `transcribe` | ⚠️ Spends, and **cannot be priced first** |

## Chaining is the differentiator

Any reference, start frame, image input or upscale source takes **either a raw URL or a
ContentHero output-id token**. The server resolves either, type-checks it, and scopes it to the
owner.

So "make an image, then animate it" is not export, re-upload, import. It is: take the image's
output id, pass it as the video's start frame. Recipes in `chaining.md`, field-by-field inputs in
`media-inputs.md`.

## Hard rules

1. **Execution only.** Do not invent the user's captions, scripts or copy. A script they gave you
   passes through verbatim; a script they did not is a grounded drafting job
   (`voice-synthesis.md`), not something to improvise here.
2. **Preview cost before a surprising or batched spend, and say the number.**
3. **Poll, do not re-submit.** Slow is not failed.
4. **Set only supported parameters**, read from `get_model`.
5. **Revalidate a cached id before spending on it.**
