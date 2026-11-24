# Video direction: prompts that a video model can stage

A video prompt is a director's brief for one generation. The model renders what it can see described
and guesses everything else, and its guesses are the average of its training data. Direct every choice
that matters to the shot; leave the rest out.

This file holds the craft that applies to any video model. The model's family file under `models/`
adds what that family does differently, and `get_model` is the authority on what the model accepts.
For a piece of several shots, plan first (`pre-production.md`). For acting, read `performance.md`.

## Write what a camera could record

- **Describe the visible, never the mood.** A feeling, a genre word or a quality adjective gives the
  model nothing to render. Translate each one into what the viewer would see: positions, movements,
  light direction, what changes from the first frame to the last.
- **Prefer plain, specific words over many.** A short brief where every phrase is concrete beats a long
  one padded with adjectives. Length that adds no visible fact adds noise.
- **State the target, not the failure.** Describe what should happen. A sentence about what must not
  happen still plants the unwanted image; use the model's negative field where it has one
  (`prompt-craft.md`).
- **Each generation stands alone.** The model remembers nothing from earlier generations. Restate
  everything this shot needs, and leave out what it does not: no scene numbers, no "as before", no
  characters or props from another shot.

## Structure of a brief

Order matters less than completeness, but a consistent order keeps nothing from being forgotten:

1. **What happens, in one sentence**, and the total length.
2. **Who and what is in it**, each tied to its reference (`media-inputs.md` says how the model wants
   references addressed). Keep descriptions of referenced subjects short and limited to what the
   reference cannot show or must not lose: a long description competes with the image.
3. **The space**: where the camera is, what is in the foreground, middle and background, where the light
   comes from.
4. **The first frame**: who is where, facing which way, already in motion if they are moving. An empty
   or ambiguous first frame invites the model to invent one.
5. **The shots**, in order, each with its framing, its camera behavior and its action (below).
6. **Light and look**: the light's source and direction, the color and texture of the image, stated once
   so it holds across every shot.
7. **Sound**, only what the shot needs, in the form the model takes.
8. **Locks**: a short closing restatement of what must stay constant (who is present, how many, what
   they wear, the layout).

## Shots and cuts

- **One block per continuous camera shot.** A new block means a real cut. Several actions inside one
  unbroken shot stay in one block, described in playback order.
- **Say how many shots there are, or that it is one continuous take**, and say that the camera cuts only
  where the brief says. A model left to decide adds its own cuts.
- **Time the beats when timing matters.** Give each shot a range that adds up to the total. Treat the
  timing as intent: models land close to it, not on the frame.
- **Hold continuity across cuts:** the same people, the same side of the action, the same direction of
  gaze and movement, the same light, the same state of every prop.
- **Fit the action to the time.** If the actions cannot happen at a natural pace in the time given,
  remove an action or lengthen the shot. Never let the model rush.

## Camera movement

A camera move is a storytelling decision, not decoration. Give every move a reason in the story and a
clear description of its path.

- **Describe each move by its start, its path, its end and its speed.** Name the subject the camera
  follows or reveals. A move with no stated end drifts.
- **One move per shot, or a still camera.** Combining several moves in one shot (a push while orbiting
  while tilting) produces unstable, floating motion. If the story needs two moves, give them two shots.
- **Motivate the move from the action.** The camera follows someone who moves, pushes in when attention
  narrows, pulls back when it widens to reveal context, holds still when the performance is the event.
  A move with no reason reads as artificial.
- **A still camera is a choice, and often the right one.** Dialogue, small gestures and comic timing
  read best when the frame does not move. Say "locked off" explicitly; otherwise the model adds drift.
- **Keep the move physically possible.** Describe the camera as an object in the space: how high it is,
  how far from the subject, on which side. A move that would pass through walls or people produces
  warping.
- **Preserve screen direction.** Decide which side of the action the camera stays on, and keep it there
  across the shots of a scene. Crossing that line between cuts makes characters appear to swap places.
- **Size the move to the shot length.** A large move in a short shot reads as a whip; a small move in a
  long shot reads as hesitation. Match travel to duration.
- **Name the framing at both ends of a move** when the framing changes (from wide to close, say), so the
  model knows where to stop.
- **Use a named technique only with its effect spelled out.** A specialist term may not be understood;
  describe the visible change it produces alongside the term.
- **Plan the cut out of the move.** If the next shot continues from this one, end the move on a frame
  the next shot can start from.

## Space and continuity of place

- **Fix the room before the camera moves in it.** Reference the location from approved footage at the
  angles the shot will use. A single establishing image only holds the layout from its own angle.
- **When a shot returns to a place, show the model that place again.** Pass frames of the earlier shot.
  Without them the model rebuilds the room from the words, and the furniture moves.
- **Keep a referenced subject in frame where it is named.** Naming a referenced subject in a shot where
  it is absent pushes the model to force it in.

## Objects and physics

- **Name who does each action.** "The cup is lifted" leaves the model to choose who lifts it. Every
  action has a subject.
- **Every object is held, worn or resting on something.** An object with no stated support floats,
  drops or appears from nowhere. Say whose hand or which surface it is on at the start and at the end.
- **Fewer props per shot.** Each prop is something the model must track. Remove any prop the story does
  not use in that shot.
- **Describe forces by their effect.** Weight, impact, wind and water are rendered from what they do to
  bodies and materials: what bends, what moves, how fast it settles.

## Light and look

- **Light is a source with a direction.** Name where it comes from and what it falls on, and keep it the
  same across a scene's cuts unless the story changes it.
- **Tie color to things in the scene** (a material, a light, a wall) rather than listing colors. A color
  with nothing to belong to drifts.
- **Describe the look, not equipment or people.** Camera brands, lens models and the names of directors
  or films are unreliable and may trip rights filters. Describe the visible qualities instead.
- **Realism comes from specific imperfection.** Texture, wear, uneven light and real materials read as
  real; a request for "realistic" alone returns a clean average.

## Review every take before the next

Watch the whole take, not a still. Check identity, the layout of the space, who does what, the props'
state at every cut, whether each line lands after its action, and the motion at full speed. Name the
single biggest failure, fix its cause, and rerun (`pre-production.md`, "Iterate cheaply").
