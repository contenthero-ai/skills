# Seedance (video family)

What holds across the Seedance video models, and what differs between versions. The general craft is in
`video-direction.md` and `performance.md`; this file only adds what is particular to this family.
Durations, resolutions, reference counts, settings and prices change without notice: read them from
`get_model` for the exact version, every time.

## What the family does well

- **Multi-shot generations.** One generation can carry several cuts with consistent people and space,
  so a whole scene can often be one generation rather than many stitched clips.
- **Performance from references.** Characters, wardrobe, locations, motion and voices can each be given
  as references, and the model holds them together.
- **Speech and sound in the same pass.** The model can generate dialogue, effects and ambience with the
  picture, or perform to supplied audio.

## Choose the input mode first

Every version offers two modes, and a request carries the inputs of one mode only (`get_model` lists
them; mixing is refused):

- **References mode**: images, videos and audio that define who and what appears, how it moves and how
  it sounds. Use it for anything with recurring characters, a set location or a voice. This is the mode
  for production work.
- **Frames mode**: a start frame, an end frame, or both, that pin the first and last picture. Use it to
  continue from a previous clip's last frame or to land on an exact composition. The frames anchor the
  picture, so the prompt describes the motion between them.

Decide the mode before writing the prompt: the two modes want differently written prompts, and a plan
that needs both a pinned first frame and character references must choose which matters more for that
shot.

## Writing for this family

- **Bind every reference to a role, one by one.** State what each reference is for (identity,
  wardrobe, location, motion, voice) and what to take from it. Address references the way the model's
  `promptReferences` declares (`media-inputs.md`).
- **Say what not to take from a reference.** A character reference brings its background and lighting
  along unless told otherwise; a motion reference brings its people. Limit each reference to its role.
- **Several images of one subject must be declared as one subject.** Otherwise the model may put
  several copies of it on screen.
- **Choose references per generation.** Pass only what this generation shows. Every extra reference
  is something the model will try to use.
- **Structure multi-shot prompts as one block per camera shot**, each with framing, camera behavior,
  timed action and an end state, then the look, the sound and a closing line of locks
  (`video-direction.md`).
- **Write dialogue as quoted lines attributed to a named speaker**, state the spoken language, and give
  each line its own beat. Keep sound directions separate from picture directions.

## Audio references

- **Voice references lock delivery and timing.** Supply each character's lines as an audio reference
  and tell the prompt which speaker each file belongs to.
- **Respect the minimum and maximum length of each audio reference** (`get_model`). Join a short line
  with other real takes of the same voice and name the section to use; never pad with silence, which
  the model may fill with invented speech.
- **A video reference steers motion; it does not reproduce its source.** Expect the model to
  reinterpret it. To change one thing in a clip while keeping the rest exactly, use an edit model, not a
  video reference.

## Versions

Pick the version by the job, then confirm its current limits in `get_model`.

- **Flagship (the newest full version):** the strongest performances, the longest single generations
  and the best multi-shot consistency. Use it for final takes. When it declares a draft setting,
  iterate at draft and upgrade only the approved take (`upgradeFromOutputId`); price the upgrade first,
  since it re-renders the whole take.
- **Flash variant of the flagship:** the same input model at lower cost and lower ceiling. Use it to
  test blocking and timing when draft is not available or not cheap enough.
- **Previous full version:** shorter generations, but it may offer resolutions the flagship does not.
  Reach for it when the delivery format needs one of those.
- **Fast and Mini variants of the previous version:** the cheapest way to test composition and motion.
  Judge layout and action with them, never skin, texture or likeness.

A prompt written for one version transfers to its siblings, so test cheap and finish on the version
whose output the user will see.

## Known failure modes

- **The room changes when the camera moves.** Reference real frames of the location at the angles
  used, not only a single establishing image.
- **Scale drifts for characters of very different sizes.** Show them together in a reference, and avoid
  poses the reference never shows.
- **Objects appear, vanish or float.** Name who holds each object and where it rests, and cut props the
  shot does not need.
- **Lines rush or overlap action.** Let each action finish before its line, and give each line room.
- **Rights filters reject close likenesses of known characters or very lifelike frontal faces.**
  Describe original designs in plain terms, never by a franchise or character name, and rephrase rather
  than retrying the same text.
