# Model catalog and parameter shapes

The roster is **dynamic**: enabled and disabled from the ContentHero admin switchboard, so it changes without a skill update. Always confirm against the live roster before relying on a specific id:

- CLI: `contenthero model list --type image` (or `video`, `audio`).
- MCP: there is no separate list tool. The live roster IS the `modelId` enum on the `generate_*` tools, so the valid ids are visible in the tool schema and an out-of-roster id is rejected.

The snapshot below was captured 2026-06-19 to guide selection. If an id here is not in the live roster, it was disabled: use the live roster.

## How to pick

Match the user's intent to a model. Defaults are marked. Tags tell you the strengths.

**Durable positioning (the quick mental model):**
- **GPT Image 2** when text, UI, typography, or graphic design fidelity matters, or as the general high-fidelity default.
- **Nano Banana 2** as the fast everyday image model, strong for single-subject portraits and character work.
- **Seedance 2.0** as the all-purpose, multi-shot video workhorse; **Seedance 2.0 Fast** when speed and cost matter.
- **Kling 3.0** as a cheaper single-plane video option with multi-shot and audio; reach for it when heavy motion is not required.
- **VEO 3.1** for top cinematic quality with native audio/dialogue; **VEO 3.1 Fast** for the same character at lower cost.
- **WAN 2.6** for intentionally stylized, artistic, multi-shot video, up to 15s.
- **Flux 2** for strong prompt adherence and a different look from the Banana family (takes a `mode`).

When the user's intent is open, prefer the marked default for the content type and confirm against the live roster (CLI `contenthero model list`; MCP `generate_*` `modelId` enum).

### Image (`generate_image` / `contenthero generate image`)

| Model id | Name | Good for |
|---|---|---|
| `gpt-image-2` | GPT Image 2 (default) | Precise text rendering, multilingual, high prompt control, up to 4K |
| `nano-banana-2` | Nano Banana 2 | Google's latest. Fast, high quality, up to 4K. Strong for single-subject portraits |
| `nano-banana-pro` | Nano Banana Pro | Studio-quality control, legible text, strong consistency |
| `nano-banana` | Nano Banana | Quick, high-quality generation and editing |
| `seedream-5-lite` | Seedream 5 Lite | Up to 3K, multi-image editing, good for product images |
| `flux-2-pro` | Flux 2 | Real-world lighting, spatial accuracy, character consistency. Takes a `mode` (pro / flex) |
| `flux-1-kontext` | Flux Kontext | Generation and editing, scene coherence, style control. Takes a `mode` (pro / max) |

### Video (`generate_video` / `contenthero generate video`)

| Model id | Name | Good for |
|---|---|---|
| `kling-3.0` | Kling 3.0 (default) | Multi-shot or single-shot, audio, start/end frames. Multi-shot via `shots` |
| `veo-3.1-quality` | VEO 3.1 | Best quality, prompt adherence, native audio/dialogue |
| `veo-3.1-fast` | VEO 3.1 Fast | Like VEO 3.1, faster and cheaper, audio-backed |
| `seedance-2` | Seedance 2.0 | Next-gen realism, high prompt control, video/audio references |
| `seedance-2-fast` | Seedance 2.0 Fast | Fast, cost-efficient, multimodal references |
| `kling-2.6` | Kling 2.6 | Cinematic, fluid motion, audio-backed, cheaper |
| `wan-2.6` | Wan 2.6 | Cinematic, multi-shot, audio-visual sync, up to 15s. Multi-shot via `multiShot` |
| `kling-3.0-motion-control` | Kling 3.0 Motion Control | Transfer motion from a reference video to an image subject |
| `kling-2.6-motion-control` | Kling 2.6 Motion Control | Same, on 2.6 |

### Audio (`generate_audio` / `contenthero generate audio`, synchronous)

| Model id | Name | Good for |
|---|---|---|
| `elevenlabs-tts` | Text to Speech (default) | Convert text to speech in any voice. Needs `text` + `voiceId` |
| `elevenlabs-music` | Music | Studio-quality music from a prompt. Needs `prompt`, optional `durationSeconds` |
| `elevenlabs-sound-effects` | Sound Effects | A sound effect from a description. Needs `prompt`, optional `durationSeconds`, `promptInfluence` |

Voice discovery (browse `voiceId` values) and transcription are separate tools (`list_voices` / `get_voice`, `transcribe`).

### Upscale (`upscale` / `contenthero upscale`)

| Model id | Name | Source |
|---|---|---|
| `topaz-image-upscale` | Topaz Image Upscale | An image (URL or output-id). Factor e.g. `2x`, `4x` |
| `topaz-video-upscale` | Topaz Video Upscale | A video (URL or output-id). Pass `durationSeconds` for accurate pricing |

### Lip-sync (`generate_lip_sync` / `contenthero generate lip-sync`)

| Model id | Name | Good for |
|---|---|---|
| `infinitalk` | Infinitalk | High-quality lip-sync, up to 10 minutes |
| `infinitalk-fast` | Infinitalk Fast | Budget lip-sync, up to 10 minutes |
| `kling-ai-avatar` | Kling Avatar 2.0 | High-fidelity lip-sync, up to 5 minutes |

## Parameter shapes per operation

MCP argument names are shown. CLI flags are the kebab-case equivalents (`aspectRatio` -> `--aspect`, `numImages` -> `--num`, `startFrame` -> `--start-frame`, `referenceImages` -> repeated `--ref`). Every operation also takes the cost-preflight switch: MCP `getCost: true`, CLI `--cost`.

### generate_image
- `modelId` (required), `prompt` (required for most; optional for a few reference-only flows)
- `aspectRatio` (e.g. `16:9`, `1:1`, `9:16`), `resolution` (e.g. `1K`, `2K`, `4K`)
- `mode` (only flux-2-pro `pro`/`flex`, flux-1-kontext `pro`/`max`; affects variant and price)
- `numImages` (1-4), `seed`
- `referenceImages[]` (URL or output-id; image-to-image / editing)

### generate_video
- `modelId` (required), `prompt` (required for most; an auxiliary hint for motion-control)
- `aspectRatio`, `resolution` (e.g. `720p`, `1080p`, `4K`), `duration` (seconds, model-dependent)
- `audioEnabled` (models that support audio), `numGenerations` (1-4), `negativePrompt`, `seed`
- `startFrame`, `endFrame` (URL or output-id), `referenceImages[]`, `referenceVideos[]`, `referenceAudio[]`
- `multiShot` (WAN 2.6: one longer multi-shot sequence)
- `shots[]` (Kling 3.0 only: ordered `{ prompt, duration }`, each 1-12s, total <=15s; turns on multi-shot; only `startFrame` attaches, as shot 1's first frame; audio always on). CLI: `--shots '<json>'`.
- Seedance 2.0 input modes are selected by which references you pass: a `startFrame` (plus optional `endFrame`) runs start/end-frame mode; `referenceImages`/`referenceVideos`/`referenceAudio` without a `startFrame` run references mode.

### generate_audio (synchronous)
- `modelId` (required)
- TTS: `text` + `voiceId` (+ optional `voiceName` for display)
- Music / sfx: `prompt`, optional `durationSeconds`; sfx also takes `promptInfluence` (0-1)

### generate_board
- `boardType` (required; one of: character, pose, mascot, creature, weapon, vehicle, object, location, shot)
- `prompt` (required when no `referenceImages`), `referenceImages[]` (URL or output-id; the source image leads)
- `numImages` (1-4), `boardName`
- Boards are fixed 3:4 at 4K and render slowly (minutes); expect an `outputId` to poll.

### upscale
- `modelId` (required), `sourceUrl` (URL or output-id), `factor` (e.g. `2x`, `4x`)
- video upscalers: `durationSeconds` (for pricing)

### generate_lip_sync
- `modelId` (required), `imageUrl` (the portrait; URL or output-id)
- a voice source: either `audioUrl` (existing speech; URL or output-id), OR `script` + `voiceId` (synthesized)
- optional `motionPrompt`, `resolution` (e.g. `480p`, `720p`, `1080p`), `audioDurationSeconds` (for cost accuracy in audio mode)
