# Media inputs: references by URL or output-id

Every place a generation takes an input image, video, or audio, ContentHero accepts **either** form, interchangeably:

- A **raw URL** to a public asset (`https://...`).
- A **ContentHero output-id token**: `<id>` (the first variation) or `<id>-N` (the Nth variation, 1-indexed) of one of your own prior generations.

The server resolves either, type-checks it against the field (an image field rejects a video), and scopes it to the owning account. This is more forgiving than tools that force you to upload or import a URL first. **Prefer passing the output-id straight through** when chaining from a generation you just ran: no re-upload, no intermediate URL handling.

You get an `outputId` from any generate result. A multi-variation generation (e.g. `numImages: 4`) exposes each variation as `<id>-1` through `<id>-4`. The bare `<id>` resolves to the first.

## Input fields by operation

| Operation | Field | Accepts | Notes |
|---|---|---|---|
| Image | `referenceImages[]` | image URL or output-id | image-to-image / editing |
| Video | `startFrame` | image URL or output-id | first frame |
| Video | `endFrame` | image URL or output-id | last frame |
| Video | `referenceImages[]` | image URL or output-id | reference / subject images |
| Video | `referenceVideos[]` | video URL or output-id | e.g. motion-control source, Seedance refs mode |
| Video | `referenceAudio[]` | audio URL or output-id | audio-driven video (models that accept it) |
| Board | `referenceImages[]` | image URL or output-id | the source the board is built from |
| Lip-sync | `imageUrl` | image URL or output-id | the portrait (required) |
| Lip-sync | `audioUrl` | audio URL or output-id | existing speech (or use `script` + `voiceId`) |
| Upscale | `sourceUrl` | image or video URL or output-id | matches the upscaler's media kind |

## CLI equivalents

- Image refs: repeat `--ref <urlOrId>`.
- Video: `--start-frame`, `--end-frame`, repeat `--ref` (images), `--ref-video`, `--ref-audio`.
- Board: repeat `--ref`.
- Lip-sync: `--image`, `--audio` (or `--script` + `--voice`).
- Upscale: positional source id or `--ref` style per `contenthero upscale --help`.

## Addressing references in the prompt

How a model binds references to your prompt varies by model. `get_model` returns a `promptReferences` block; follow it rather than assuming one convention. The `scheme` tells you the form:

- `numbered_tag`: write the literal tokens it lists (e.g. `@Image1`, `@Video1`, `@Audio1`) in the prompt, numbered by the order you pass references. The model binds each tag to that reference (e.g. "the warrior from `@Image1` holding `@Image2`").
- `named_tag`: each reference is a named element; reference it as `@name` in the prompt, matching the element's name.
- `numbered_prose`: refer to references as plain text, `"image 1"`, `"image 2"` (no `@`), in the order you pass them.
- `descriptive`: the model has no tags; describe each reference by its role or content ("the subject from the first image", "use the second image as the background"). Order still matters.
- `none`: a single reference; describe it directly.

`promptReferences.honored` says whether the model binds the addressing or treats references positionally. `promptReferences.inputs[].token` gives the exact form per bucket (`{n}` = reference order, `{name}` = element name). Pass references in the same order you reference them. Do not use a scheme a model does not declare: a literal `@Image1` on a `numbered_prose` or `descriptive` model is just stray prompt text.

### Named elements (Kling 3.0)

A model whose `promptReferences.scheme` is `named_tag` and whose `inputTypes` include `elements` accepts named reference elements: groups of images that all depict one entity (a character, prop, location), addressable as `@name`. Pass them on the video reference set as `elements: [{ name, description, images: [urlsOrIds] }]` (CLI: see `contenthero generate video --help`), alongside a `startFrame` (required). Up to `maxElements` per request. Reference each in the prompt by its `@name`. Element images may be URLs or output-ids, so you can generate the angle shots first and assemble an element from them.

## Rules

- Do not download then re-upload an output to get a URL. Pass the output-id.
- Match the media kind to the field. An image-only field (start frame, portrait) will reject a video id.
- A URL must be publicly fetchable. If it is behind auth or a WAF, it will fail; tell the user rather than guessing.
- When you need a specific variation, use the `-N` suffix. When any variation is fine, the bare id is the first.
