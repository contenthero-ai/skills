# Seedream (image family)

What holds across the Seedream image models, and how their versions differ. The general image craft is
in `prompt-craft.md`; this file adds what matters when Seedream builds the assets of a production
(`pre-production.md`). Resolutions, aspect ratios, reference counts and prices change without notice:
read them from `get_model` for the exact version.

## What the family is good for

- **Assets from several references at once.** A person, an outfit, a prop and a place can be combined
  in one image while each keeps its identity, which makes it suited to building an asset bible.
- **Editing by instruction.** Given an image, it changes what the prompt names and keeps the rest.

## Writing for this family

- **Give each reference one role, and say it.** Identity, wardrobe, object, location or style. Say
  what to take from each and what to ignore (a reference's background, its lighting, other people in
  it).
- **When editing, describe only the change.** The model already sees the input. Restating the whole
  image competes with the edit.
- **Describe the shot as a photograph:** framing, camera height and distance, light source and
  direction, materials. These anchor the image in something real.
- **Ask for real imperfection when realism matters:** skin texture, uneven light, worn materials. A
  bare request for realism returns a clean average.
- **State small details in words** (text on an object, a logo, a specific color of a garment), even
  when a reference shows them. Fine detail is the first thing lost.

## Building production assets

- **Start a likeness from raw photos or real video frames**, never from an earlier generation. Each
  generation drifts; generations of generations drift further.
- **Make each recurring subject once, then reuse that image.** Re-generating a subject for each shot
  produces a slightly different subject each time.
- **Match the asset to the shot it serves.** An asset meant to be a video's first frame must be
  composed and lit as that frame, at the video's aspect ratio.
- **Keep a neutral version of each character** (plain background, full figure, even light) alongside
  any styled one. The neutral version is the better video reference.
- **Turn the canonical image into a reference sheet** when the subject must be seen from several sides
  (`identity.md`).

## Versions

Pick the version by the job, then confirm its current limits in `get_model`.

- **Newest full version:** the best fidelity to references and the best instruction following. Use it
  for canonical assets.
- **Pro:** an alternative full-quality version. Compare it on a hard asset when the newest version
  struggles with a particular subject.
- **Lite:** compare its reference count and resolutions with the full versions in `get_model`. When it
  takes more references or renders larger, use it for an image that needs that.
- **Flash:** the cheapest and fastest. Use it for storyboard frames and composition tests, never for an
  asset that later generations will copy.
