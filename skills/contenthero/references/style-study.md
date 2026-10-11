# Study a video's style

When the user wants to know how a post's video is made so they can make work that looks, moves
and sounds like it: its visuals, motion, type, color, pacing, sound effects, music, and how the
music and effects sit against the voice. This is the deep end of research (`references/research.md`):
reach for it on the one or two posts whose style the user wants, not on every post.

The steps run in this order because each one reads what the step before it stored.

## 1. Download the video

`analyze_content` with `kind: "video"` downloads every video the post holds into shared analysis
copies, which every step below reads. It spends credits, so price it with `getCost` first and tell
the user the number. A copy still downloading answers pending: call again with the same `contentId`
and kind to follow it, at no charge.

A carousel reports each video by its 0-based `slide`. Carry that `slide` through every step below,
or each step reads a different video than the one you mean.

## 2. Read the cut list

`get_content` with `cuts` returns where each downloaded video's picture changes, free. The cut list
is the skeleton of the study: the gaps between cuts are the shot lengths, which are the pacing,
and the cut seconds are where to look and listen next.

## 3. See it at the cuts

`view` the post as a source (`contentId`, and `slide` for a carousel) with `atSec` set to the cut
list's seconds, and just after them, so each shot is seen as it lands. A shot whose look changes
without a cut (a camera move, a zoom, type animating in) needs frames across its window with
`perSecond` instead; the closer together the frames, the finer the motion they show.

## 4. Hear it in windows

`view` with `sound` measures a window of the video as it is: its loudness, where its sounds start,
and a picture of its waveform and spectrogram. Walk the whole video window by window rather than
asking for it in one: a window the tool refuses as too long says so, and the answer is a shorter
window. Lay the sound onsets beside the cut list: whether cuts land on sounds is part of the style.

## 5. Transcribe it

`transcribe` with the post's `contentId` (and `slide`) gives its words. It spends credits, so price
it with `getCost` and tell the user. It can only be priced once step 1 has downloaded the video,
because its price comes from the video's length. A long video answers running: call again with the
same post to follow it, at no charge. For a post's one video, `get_content` with
`transcript: "segments"` then returns the words timed, which tells you where the voice is in each
sound window, so you can tell the voice from the music and the effects.

## 6. Synthesize the style

Write the style as something the user can reuse, under these heads:

- **Visuals:** framing, subjects, setting, lighting.
- **Motion:** camera movement, transitions at the cuts, anything animated on screen.
- **Type:** typefaces, weight, size and placement, and how captions and titles arrive and leave.
- **Color:** palette, grade, contrast, and whether it shifts across the video.
- **Pacing:** shot lengths from the cut list, and where the video speeds up or slows down.
- **Sound effects:** what they are and where they fall against the cuts.
- **Music:** its feel and energy, where it rises and drops, and whether cuts land on its beats.
- **The mix against the voice:** how far the music and effects sit under the voice, whether they
  dip when the voice speaks, and what plays where nobody speaks.

Ground every claim in what you saw or measured, and name the seconds it comes from. Say what you
could not tell rather than guessing.

⛔ **Describe the style, never copy the work.** The study yields a pattern to make the user's own
work in, the same rule as mining hooks and structure (`references/research.md`). Turning it into
the user's own piece is generation and editing: `references/generating.md`, `references/editor.md`.
