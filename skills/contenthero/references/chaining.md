# Chaining recipes

Chaining means feeding one generation's output straight into the next as an input, by passing its `outputId` (or `<id>-N`) where a reference, frame, or source is expected. No re-upload. See `media-inputs.md` for the field map.

The pattern is always: run step 1, capture its `outputId`, pass that id into step 2.

## Image to video (animate a still)

Generate the image, then use its id as the video's first frame.

- MCP: `generate_image` -> capture `outputId` -> `generate_video({ modelId, prompt, startFrame: "<imageId>" })`
- CLI:
  ```bash
  IMG=$(contenthero generate image "a red ceramic cube on white" --model nano-banana-2 --no-wait | jq -r .outputId)
  contenthero generation wait "$IMG"            # let it finish
  contenthero generate video "slow push in" --model veo-3.1-fast --start-frame "$IMG"
  ```

## Board to image (keep a subject on-model)

Build a reference board, then generate images that reference it so the subject stays consistent.

- `generate_board({ boardType: "character", referenceImages: ["<sourceImageId or URL>"] })` -> capture board `outputId` -> `generate_image({ modelId, prompt, referenceImages: ["<boardId>"] })`

## Image to lip-sync (talking portrait)

Generate or pick a portrait, then animate it speaking.

- `generate_image(...)` -> `generate_lip_sync({ modelId: "infinitalk", imageUrl: "<portraitId>", script: "<words the user supplied>", voiceId: "<voiceId>" })`
- Or with existing speech: pass `audioUrl: "<audioId or URL>"` instead of `script` + `voiceId`.

## Audio to lip-sync (your own TTS clip)

Synthesize speech, then drive a portrait with it.

- `generate_audio({ modelId: "elevenlabs-tts", text: "<the user's script>", voiceId })` -> capture audio `outputId` -> `generate_lip_sync({ modelId, imageUrl: "<portraitId or URL>", audioUrl: "<audioId>" })`

## Generate then upscale

- `generate_image(...)` -> `upscale({ modelId: "topaz-image-upscale", sourceUrl: "<imageId>", factor: "2x" })`
- Video: `upscale({ modelId: "topaz-video-upscale", sourceUrl: "<videoId>", factor: "2x", durationSeconds: <len> })`

## Multi-variation chaining

If step 1 produced several variations, choose one with the `-N` suffix: `startFrame: "<id>-3"` animates the third image. The bare id uses the first.

## Sequencing rule

A chained input must be finished before the next step resolves it. With the CLI, the generate commands wait by default, so a piped id is ready; if you used `--no-wait`, call `contenthero generation wait <id>` before chaining. With MCP, the smart-wait usually returns a completed result; if it returned a pending `outputId`, poll `get_generation_status` until complete before feeding it forward.
