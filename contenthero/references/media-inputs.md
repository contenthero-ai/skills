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

**How a model binds references to your prompt varies by model, and there is no convention you can
assume.** `get_model` returns a `promptReferences` block for exactly this reason. Read it and
follow it.

⛔ **Do not memorize the scheme names, and do not expect a list of them here.** The set of schemes
is a live value the roster resolves, in the same way the model list is. A list frozen into this
file would be wrong the first time a model ships with a new binding style, and wrong silently,
because using the wrong scheme does not error.

What the block tells you, and how to act on each part:

- **`scheme`** names the form the model expects. Some models want literal tokens written into the
  prompt; some address references by an element's name; some want plain prose ("the first
  image"); some have no addressing at all and take references positionally, so you describe each
  one by its role.
- **`inputs[].token`** gives the exact token form for each bucket, with `{n}` standing for the
  reference's order and `{name}` for an element's name. Build the token from this rather than
  guessing its capitalization or spacing.
- **`honored`** says whether the model actually binds your addressing or silently falls back to
  position. When it is false, order is the only thing that carries meaning, so put the references
  in the order the prompt discusses them.

⚠️ **Using a scheme the model does not declare does not fail loudly, it just degrades the
result.** A literal `@Image1` written at a model that takes prose is stray text in the prompt: it
consumes attention, it binds nothing, and the output is quietly worse. This is the most common
way a technically valid generation comes back wrong.

Pass references in the same order you address them, whatever the scheme.

### Named elements (Kling 3.0)

A model whose `promptReferences` declares a named-element scheme and whose `inputTypes` include `elements` accepts named reference elements: groups of images that all depict one entity (a character, prop, location), addressable as `@name`. Pass them on the video reference set as `elements: [{ name, description, images: [urlsOrIds] }]` (CLI: see `contenthero generate video --help`), alongside a `startFrame` (required). Up to `maxElements` per request. Reference each in the prompt by its `@name`. Element images may be URLs or output-ids, so you can generate the angle shots first and assemble an element from them.

## Rules

- Do not download then re-upload an output to get a URL. Pass the output-id.
- Match the media kind to the field. An image-only field (start frame, portrait) will reject a video id.
- A URL must be publicly fetchable. If it is behind auth or a WAF, it will fail; tell the user rather than guessing.
- When you need a specific variation, use the `-N` suffix. When any variation is fine, the bare id is the first.
