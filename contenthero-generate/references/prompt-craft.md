# Prompt craft

Durable, model-agnostic prompting guidance for ContentHero's generation models. This is a foundation, not a per-model bible: model-specific depth is added over time. Anything volatile (which aspect ratios, resolutions, or durations a model accepts) is confirmed at run time against the live roster (CLI `contenthero model list`; MCP `generate_*` `modelId` enum), not asserted here.

Field names below are the ContentHero surface names (`aspectRatio`, `resolution`, `negativePrompt`, `startFrame`, `referenceImages`, `audioEnabled`); CLI flags are the kebab equivalents.

## Image prompts

**The formula:** subject + setting + camera + lighting + style/medium.

- **Subject:** concrete, not generic. Not "a person" but the specific physical detail, materials, wardrobe.
- **Setting:** where it is, what is around it.
- **Camera:** lens and angle (e.g. `85mm, f/2.0`, low angle, overhead). Specific optics constrain the model toward real photography instead of generic "AI art."
- **Lighting:** describe what the light *does*, not just its name. Not "natural light" but "warm side-light from camera-left, defined shadow under the jaw." Behavior beats labels.
- **Style/medium:** photograph, oil painting, 3D render, anime, editorial, etc.

**Keep it concise.** Dense and specific beats long and vague; very long prompts distort. A focused paragraph that nails the five components outperforms a sprawling one.

**Realism:** models default to a clean, dataset-average "ideal." To get genuine realism, ask for specific imperfections (skin texture, asymmetry, wear, grain) rather than just saying "realistic."

**Text in images:** when the image should contain readable text, state the exact string, and the placement and style. Some models render text far better than others (see `model-catalog.md`).

## Image-to-image (editing)

When you pass `referenceImages` to edit an existing image, **describe what changes, not the whole input.**

- Weak: "a man with brown hair in a leather jacket holding coffee, made into anime."
- Strong: "transform into anime style, vibrant colors, soft cel shading."

The model already has the input; redescribing it competes with the edit.

## Video prompts

**Text-to-video:** the image formula still applies (subject, setting, camera, lighting, style), plus motion.

**Image-to-video (a `startFrame`):** the frame anchors the first frame. **The prompt should describe motion, not the static frame.**

- Camera motion: push in, slow dolly, sweeping pan, tracking shot, whip pan.
- Subject motion: "the dancer spins," "smoke rises slowly," "leaves drift across frame."
- Do not redescribe what is already in the frame.

**Duration, aspect ratio, audio, and references are model-gated.** Confirm per model against the live roster (CLI `contenthero model list`; MCP `generate_*` `modelId` enum) rather than assuming. Audio: set `audioEnabled` only on models that support it; a few models take an `referenceAudio` input instead (e.g. Seedance references mode). See `model-catalog.md`.

## Negative phrasing

Some ContentHero models accept a `negativePrompt` (e.g. several video models); many image models do not.

- Where `negativePrompt` is supported, use it for what to avoid.
- Where it is not, **phrase positively in the main prompt.** Instead of "no blur," write "tack sharp." Instead of "no people," write "uninhabited landscape." Instead of "not cartoonish," name the real style you want.

## Aspect ratio

Defaults to reach for (confirm the model accepts them):

- `16:9` landscape, cinematic, YouTube, web.
- `9:16` vertical, social (Reels, TikTok, Shorts, Stories).
- `1:1` square, profile, icon.
- `4:3`, `3:4`, `21:9` are model-dependent; check the model.

Match the aspect ratio to where the content will be published.

## References and consistency

- Most image models accept multiple `referenceImages`; some single-frame video models accept exactly one. The live schema decides; a model that takes one will reject extras.
- For a subject that must stay consistent across many outputs (a person, mascot, product), do not rely on the prompt alone. Build a reference board and feed it back in, or reuse an avatar look. See `identity.md` and `chaining.md`.

## Universal content principles

These hold regardless of model:

- **Front-load the hook.** The opening seconds or the focal element carry most of the attention. Lead with the strongest idea.
- **One idea per output.** A single clear concept produces far better results than a crowded one. If there are several, make several outputs.
- **Synthesize a thesis, not a list.** "X is happening because Y, here is the proof" beats "here are five things."
- **Translate a named style into concrete rules.** "In the style of [artist]" is unreliable. Convert it to what you actually want: palette, composition, lighting, line weight, grain. Concrete visual rules transfer; names do not.

## Safety

Models reject prompts that trip safety or rights filters. Avoid:

- Real public figures by name or likeness.
- Trademarks and branded characters.
- Sexual or otherwise disallowed content.

A rejected prompt fails terminally; rephrase around the trigger rather than retrying the same text.
