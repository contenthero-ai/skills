# Video editing: from footage to a delivered file

The method for editing a video in the ContentHero editor, whether the footage was filmed or generated.
The editor's tools and their mechanics are in `editor.md`; this file is the order of work and the
standard each step must meet. The user signs off twice: once on the plan, once on the result.
Everything between is yours to carry out without stopping.

## Principles

1. **The plan is the contract.** One document holds every editing decision. The user signs it off
   once; after that, build from it, and report any departure from it rather than making it silently.
2. **Anchor decisions to content, never to frame numbers.** Attach every decision to a moment in what
   is said or shown (a span of the transcript, a range of a source clip). Frame positions are computed
   from those anchors after cutting, so the plan survives the cut.
3. **Do only work that survives.** Process only what is kept. A step that changes timing runs before
   any step that depends on timing.
4. **A step is done when its checks pass**, not when its action ran. Each step checks itself as it
   goes.
5. **Judge in playback, not in stills.** Many defects (stutter, flicker, a jump in a move, a clipped
   word) exist only in motion. Watch the real result.
6. **Reuse before building.** Look for the components, templates and style libraries the user already
   has, and use them where they serve. Build a new part only where none fits, and build it to match the
   existing look.
7. **Fix a shared part once.** A defect in a component used in many places is fixed in the component,
   never patched instance by instance.
8. **Ask only what only the user can answer, and ask early.** A missing asset, a taste decision, the
   export destination. When the user turns a proposal down, show the alternatives side by side with your
   pick marked.
9. **File everything as it arrives.** Media brought into the project or the library is named for what
   it is and filed into its folder in the same step (`media-library.md`).
10. **Edit one working copy.** Duplicate the original project once and edit the copy in place. Save a
    version before each large batch so any batch can be undone.
11. **Leave nothing orphaned.** An edit that stops using a project module removes it when nothing else
    uses it.
12. **Report faithfully:** what was done, what was checked, what was not, and every difference from the
    plan.

## The user's house style

Everything that varies by user or by series lives outside this method: the look and its components,
sound levels, track layout, naming, export destination and settings. Read it from the user's earlier
projects, templates and style libraries; ask for what is missing; record the answers in
`.contenthero/context.md` so the next edit starts from them.

## Resuming

Read the project's current state first. Find the first step below whose done-check fails and start
there. Never redo a step whose check passes.

## The steps

| Step | Done when |
|---|---|
| 1. Ingest | Every source is in the project, readable, and transcribed where it has speech |
| 2. Organize | Sources are named, filed and in order on a base timeline, with nothing missing |
| 3. Plan | The plan and storyboard are signed off by the user |
| 4. Cut | The timeline equals the plan's kept ranges and every seam is clean |
| 5. Color | Color is consistent across clips and matches the plan's look |
| 6. Voice | Kept speech is cleaned up and leveled to the house target |
| 7. Layer | Every b-roll, graphic and effect in the plan is built |
| 8. Sound | Every music and sound decision is placed and the whole mix is measured |
| 9. Review | Whole-video checks pass and the user has accepted the result |
| 10. Deliver | The confirmed export exists at the confirmed destination and is verified |

Color and voice are independent and can run side by side.

### 1 Ingest
Confirm every file arrived and plays. Start transcription where speech exists and wait for it.

### 2 Organize
Order sources by capture time and by the continuity of what is said. Ask only when the order is
genuinely ambiguous. Lay them on a base timeline and confirm nothing is missing or overlapping by
accident.

### 3 Plan
Read the whole transcript and watch all the footage first: retakes, stumbles, dead air, sections,
claims. Then write the plan:

- **Cut plan:** the whole transcript with each kept range and each dropped span, every drop with a
  reason. Flag a drop that removes a claim, a result or a transition.
- **Sections:** the kept content divided into sections, each with the single point it makes. Conceive
  each section from its content, never from a previous video's plan.
- **Decisions:** one row per decision, attached to an anchor: b-roll (what it shows and why), graphics
  and effects (which component, what triggers it), music (where it enters and leaves, its level), sound
  effects (what they answer), color (the look, and any anchor that needs different handling). Every
  spoken point gets a visual decision, even when the decision is to stay on the speaker.
- **Missing inputs:** a decision that needs something the project lacks (an asset, a logo, a screen
  recording) names it and asks. Never design around the gap.
- **Export intent:** the destination and settings, proposed from the last export.

Build the storyboard in place on the working copy, at its anchors, with real components over real
footage, so that after sign-off it is the finished layer rather than a reference to rebuild. Show a
frame for every beat, and a short motion test for any treatment the user has not seen move. Present
plan and storyboard together and build nothing before the sign-off.

### 4 Cut
Apply the kept ranges and compute positions from the anchors. Check every seam against the transcript
and by ear: no clipped words, no stray breaths, natural rhythm across the join.

### 5 Color
Match the plan's look, from a reference if one was given. Verify by sampling frames across the whole
timeline. Lighting that genuinely differs between sources is reported, not hidden.

### 6 Voice
Clean up only the kept audio, then level it to the house target. Every later sound decision is set
against the voice, so the voice is settled first.

### 7 Layer
Build every b-roll, graphic and effect decision in one pass over the whole video, using the house
components. Every built item traces back to a plan row. Create shared data (word timings, lists several
parts read) once, from the transcript, before building on it. Check each section in playback as it is
finished.

### 8 Sound
Place music and effects under the house sound rules. File anything fetched from outside on arrival.
Set levels against the voice, then measure the whole mix.

### 9 Review
Run the whole-video checks below and fix what they find. Only then hand the result to the user, with
every departure from the plan listed. A revision names the decisions it changes by anchor and rebuilds
only what they touch. A layer the user edited by hand is theirs: move it only as far as the picture
beneath it moved.

### 10 Deliver
Confirm the destination and settings, suggesting the last ones used. Confirm the export carries no
platform mark the user did not ask for. Verify the finished file, deliver it, and record the
destination and settings as the new last used.

## Checks

Targets and thresholds come from the house style, never from here. A check that cannot run is reported,
never skipped silently.

**While building:**

- Every stretch of the transcript has its decision built, and nothing overlaps on a track by accident.
- A move is watched across its whole travel, frame to frame. A still at each end does not show a jump.
- No sliver of bare footage between two graphics so short it reads as a flash. Join them instead.
- At a direct handoff, the incoming part shows on the cut frame and the outgoing part is gone from it.
- A container and its content enter and leave together.
- A value a still cannot show (a curve, a level, a timing) is read back from the project after it is
  written.

**Whole video, before review:**

- Full playback with no stall, flicker or dropped frames.
- Music and effects balanced against the voice for the whole length.
- No collisions of layers in time or space, no black or empty frames, no unintended silence.
- Overall loudness and peak against the house target.
- The plan against the build, every departure listed.

**The delivered file:**

- Format, size, frame rate, codecs and duration as confirmed.
- Loudness and peak as targeted, and any leveling the export applied reported.
- No black frames, no unwanted marks, no defect the previews did not show.
- The delivered copy is identical to the export.

## Gaps

When the editor cannot do what the plan needs, say so, and propose the closest supported route. Never
work around it silently, and never remove the user's content to avoid a defect. When a defect appears
in playback or export that the project's own content does not explain, stop adjusting the project,
report it as a product issue, and say whether the export carries it.
