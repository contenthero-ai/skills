# Pre-production: plan a generated film before spending on it

A generated film (a skit, an ad, a story, any piece made of several generated shots) fails in the same
places a filmed one does: an unclear story, a cast that drifts, a location that changes between shots.
The difference is that every fix is a paid regeneration. Decide on paper what the model cannot be
trusted to decide, then generate.

Read this before the first video generation of any piece longer than one shot. Read
`video-direction.md` when you write the prompts, `performance.md` when a character acts or speaks, and
the model's family file under `models/` once you know which model renders it.

## The documents, in order

Each document is built from the one before it. Do not write prompts before the beat sheet exists, and do
not generate before the assets exist.

1. **Logline and treatment.** One sentence that states who wants what and what stands in the way, then a
   short treatment of how it opens, turns and ends. If the user cannot agree with the logline, nothing
   downstream will land.
2. **Beat sheet.** The piece as a numbered list of beats, each one a single visible change: someone
   arrives, decides, fails, wins. A beat that changes nothing on screen is cut or merged. Give each beat
   an intended length so the whole fits the target runtime.
3. **Script.** Every spoken line, who says it, and which beat it belongs to. Lines are written for the
   ear and timed against their beat. Long speech inside a short beat forces rushed delivery.
4. **Asset bible.** Every character, location and prop that appears more than once, each with its
   canonical image and a name. See "Assets" below.
5. **Storyboard.** One frame per shot, showing framing, who is where, and what the camera does. A
   storyboard frame can be a quick generation, a frame from an earlier take, or a sketch: its job is to
   fix composition before the expensive render.
6. **Generation plan.** Which beats each generation covers, which assets each one references, and the
   estimated cost. Price it with `getCost` and show the user the total before the first render.

Get the user's yes on the treatment and on the generation plan. Everything between is yours to draft.

## Splitting the piece into generations

- **Group beats by location and cast.** One generation per continuous situation keeps the space and the
  people consistent inside it. Cutting to a new place is a natural point to start a new generation.
- **Give each generation one dramatic job.** A generation asked to deliver a setup, a reversal and a
  payoff at once does all three poorly. Split it, or simplify until one job remains.
- **Size each generation to the model's real duration limit**, read from `get_model`, leaving room for
  the action to breathe. Packing a generation to its limit rushes the performance.
- **Plan the joins.** Decide how each generation hands over to the next: a hard cut to a new angle, or a
  continuation from the previous clip's last frame (`returnLastFrame`, then that frame as the next
  `startFrame`). A continuation must match pose, light and framing, so plan the last moment of a clip
  as carefully as its first.

## Assets

The asset bible is where consistency is won. A model reproduces what it is shown far more reliably than
what it is told.

- **One canonical image per recurring subject.** Every generation that shows the subject references the
  same image. A new image for the same subject is a new subject as far as the model is concerned.
- **Build a likeness from raw source material.** For a real person, start from real photos or real video
  frames, never from an earlier generation of them: each generation drifts a little, and drift compounds
  when generations feed generations.
- **Show the subject from every side the story needs.** A reference sheet (`identity.md`) carries
  several angles in one image. A subject only ever seen from the front will be guessed from behind.
- **Lock wardrobe and props in the asset, not only in the prompt.** If the outfit must match across
  shots, the canonical image wears it.
- **Give locations their own references.** An empty set render fixes the layout only until the camera
  moves. Once the location has been filmed in an approved take, frames from that take are the stronger
  reference for every later shot in that space, because they show the layout at the angles the model
  will need.
- **Show scale.** When characters differ greatly in size, the reference must show them together or
  against a known object. A size stated only in words is often ignored.
- **Name everything the same way everywhere.** One name per subject, used in the asset's media name,
  in the plan and in every prompt. `media-library.md` covers naming and filing; file assets into a
  folder for the piece the moment they exist.

## Audio and dialogue

- **Decide where each voice comes from before generating picture.** A model that takes audio references
  can perform to a recorded or synthesized line, which locks timing and delivery. A model that
  generates its own speech decides the delivery for you.
- **Each audio reference must meet the model's length limits** (`get_model`). When a line is shorter than
  the minimum, join it with other real takes for that character and tell the prompt which section to
  use. Do not pad a line with silence: the model may fill the silence with invented speech.
- **One file per voice per generation**, so the model never has to guess who says what.

## Iterate cheaply, finish once

- **Explore at the lowest quality that still shows the problem.** Use a model's draft setting, or a
  cheaper sibling in the same family, to test blocking, timing and performance. Judge composition and
  action at draft quality; judge skin, texture and fine detail only at final quality.
- **Change one thing per retry.** When a take fails, name the failure, fix the one cause in the prompt
  or the references, and rerun. Changing several things at once leaves you unable to tell what worked.
- **Keep every take and its prompt.** A rejected take often has a usable section, and a later shot may
  need a frame from it. Record what each take was for and why it was kept or rejected.
- **Upgrade only the winner.** When the model supports upgrading a draft (`upgradeFromOutputId`),
  upgrade the take the user approved, and price the upgrade first: it can cost as much as a fresh
  render at that quality.
- **Repair before you regenerate.** When an approved take has one local defect, an edit model that
  keeps the source's motion and timing can remove it at a fraction of the risk of a full rerun. Check
  what the edit drops (some return no audio track) and rejoin it in the edit.

## The production record

Keep one document for the piece that holds all of the above in production order: treatment, beats,
script, assets, storyboard, every generation with its prompt and outcome, and the cut list. It lets the
user review the whole piece in one place, and it lets any later session resume without rediscovering
what was decided. Present it to the user at each sign-off.
