# Performance: directing generated actors

A generated face looks alive when the character is visibly trying to get something. It looks dead when
the prompt describes expressions. Direct intention, and let the face follow.

Use this whenever a character acts, reacts or speaks. Camera, space and timing are in
`video-direction.md`; the order of work is in `pre-production.md`.

## Direct the task, not the face

- **Give each character something to do to someone.** A performance is a pursuit: convincing,
  reassuring, hiding, testing, provoking. Write it as a verb aimed at the other character or at the
  goal in the scene.
- **Never prescribe the face.** Instructions about eyebrows, mouth shapes or "looks sad" produce
  mechanical, indicated acting. Describe what the character is doing and why, and the expression
  follows from it.
- **Turn every emotion word into the action that produces it.** When a feeling matters, name the
  behavior a viewer would read it from: where attention goes, what the hands do, when the character
  stops and starts. Never the label alone.
- **Put the work in the eyes.** Where the character looks, when, and what they are checking for, is the
  clearest signal of a mind at work. A listener watching for a reaction, a speaker checking whether a
  point landed, someone avoiding a look they cannot afford: each is a task the eyes carry.
- **Prefer restraint.** Held-back feeling reads stronger than displayed feeling. Push intensity only
  where the story peaks.

## Build the scene before the lines

Work from the whole scene, never from one line.

1. **Read the scene to its end.** The final beat tells you what the scene is about; read everything
   before it in that light.
2. **Name the one thing the scene is about**, shared by everyone in it, including characters who stay
   silent. If a character stands outside it, the reading is wrong.
3. **Give each character their own reason** for pushing in that shared direction. Different reasons are
   what make two performances in one scene distinct.
4. **Name what stands in each character's way.** The pressure against the goal is what the audience
   feels.
5. **Give each character a physical channel** for their task: the ordinary activity of the scene through
   which their intention shows. The camera needs something to see.
6. **Write the beats against the actual lines**: what the character does to their partner on each
   line, and where, if anywhere, their effort breaks.

Characters never play the theme of the piece. They play their own goals; the theme emerges from them.

## Every character in frame is acting

- **Listeners have tasks too.** A character who is not speaking is deciding, waiting, judging or
  hiding. Give them that task, or they freeze.
- **Ask for natural blinking and engaged gaze.** A short closing line against a fixed, glassy stare is a
  useful safeguard for generated faces; it is the one place an external instruction belongs.
- **Contrast partners.** Two characters with mirrored strengths and weaknesses on the axis the scene
  turns on make a scene readable at a glance.

## Dialogue

- **One action, then the line.** A character who must finish a physical action and speak at the same
  moment does both badly. Let the action land, then the line, or the line, then the action.
- **Say who speaks each line**, every time, and bind each speaker to their voice reference.
- **Give lines room.** A line needs time to be said at a natural pace plus a breath around it. When the
  model generates speech, keep lines short and few per shot.
- **Lip sync is a separate operation.** When a face must speak a fixed recording exactly, a lip-sync
  model (`generating.md`) is more reliable than asking a general video model to match it.

## Comedy and physical performance

- **Timing comes from pauses.** State the pause before the reaction and the hold after it; a model left
  alone runs beats together.
- **One gag per shot.** A shot that carries a setup, a reaction and a payoff at once lands none of them.
- **Physical action needs its cause and effect.** State what triggers the movement, the movement itself,
  and how the body settles afterwards.

## Characters that are not human

A stylized or animal character keeps its design only when its reference shows it, at the scale the
story needs, from the sides the shots will see. Describe its manner of moving in visible terms (weight,
speed, what parts move) rather than human emotions. Keep its pose and scale consistent with what the
reference shows: a pose the reference never shows (a standing character seated, say) invites the model
to redesign the character.
