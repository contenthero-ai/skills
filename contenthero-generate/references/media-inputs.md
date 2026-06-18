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

## Rules

- Do not download then re-upload an output to get a URL. Pass the output-id.
- Match the media kind to the field. An image-only field (start frame, portrait) will reject a video id.
- A URL must be publicly fetchable. If it is behind auth or a WAF, it will fail; tell the user rather than guessing.
- When you need a specific variation, use the `-N` suffix. When any variation is fine, the bare id is the first.
