# Optical Anchor — Design Contract v2 / Eye-First Experiment

## Product direction

**Name:** Optical Anchor  
**Product:** One reusable native button component.  
**Identity:** Precision instrument expressed through studio hardware cues.  
**Primary signature:** One oversized, custom-drawn SVG eye centered in a raised circular bezel; a slim horizontal capsule housing extends behind it.  
**Design intent:** The eye itself is the action affordance. “Let's collab!” exists only as a contextual speech bubble while the pointer hovers the button; it is not a persistent CTA or a replacement label.

## Visual language

- **Housing:** Slim horizontal capsule with graphite frame and warm enamel face; a raised circular bezel overlaps the housing at its exact center.
- **Eye scale:** Dominant focal element. Standard housing is 280 × 76 px; central bezel is 138 × 138 px; eye artwork is 132 × 86 px. Smaller and larger sizes scale proportionally.
- **Sclera:** Warm ivory with a gentle top highlight and shadowed lower edge, avoiding stark flat white.
- **Iris:** Layered amber-to-copper radial color, dark limbal ring, fine radial fibres, an inner warm ring, deep pupil, and restrained moisture glints.
- **Eyelids:** An anatomical almond aperture with asymmetric inner/outer corners, a tapered upper lid, a soft lower waterline, a separate crease, and a shaped closed-eye contour.
- **Aperture construction:** The iris is clipped to the eye silhouette. Awake, tired, and sleeping states use independent upper-lid cover shapes; the sclera and iris retain their natural geometry and are never flattened with a vertical scale transform.
- **Bezel integration:** The central bezel uses an outer graphite seat, copper rim, fine inset ring, and controlled contact shadow so the raised eye housing reads as a single assembled object rather than a circle pasted onto the capsule.
- **Iris rendering:** Keep the amber/copper radial structure, limbal ring, fine radial fibres, warm inner ring, deep pupil, and restrained corneal highlights. The major catchlight stays coherent with the housing's light direction.
- **Surface texture:** Very low-contrast procedural micro-grain on the matte enamel housing and raised bezel; sclera and iris remain smooth for focal contrast.
- **Shadow:** Localized contact/drop shading and recessed face treatment only. No ambient glow or oversized shadow.
- **Motion and expression:** The aperture opens on hover, the iris tracks page-wide while awake, and inactivity transitions the eye through tired to sleep. Hovering the button is the eye's most excited state: the brow rises into a higher, more emphatic arch and a small “Let's collab!” speech bubble appears. Once the pointer leaves the button, the excited brow and bubble return to neutral even if page-wide gaze tracking continues. Keyboard focus alone never triggers the bubble.

## Visual tokens

| Token | Value | Role |
| --- | --- | --- |
| `--oa-orange` | `#B34D26` | Main enamel face |
| `--oa-orange-hover` | `#A84422` | Hover face |
| `--oa-orange-pressed` | `#89361D` | Pressed face |
| `--oa-ink` | `#191816` | Graphite frame |
| `--oa-frame-line` | `#6C4635` | Warm frame edge |
| `--oa-ivory` | `#F3EEE6` | Focus ring and surrounding light tones |

## Button dimensions

- `sm`: 236 × 64 px; bezel 116 × 116 px.
- `md`: 280 × 76 px; bezel 138 × 138 px; default.
- `lg`: 324 × 88 px; bezel 160 × 160 px.
- `fullWidth`: expands the housing to the containing block's width while keeping the eye centered.
- Optional `children` are supported as a small secondary caption. The showcase leaves children empty.

## Interaction contract

- **Sleeping:** The eyelid cover closes the full aperture and hides the iris without squashing either shape; pointer entry wakes the eye.
- **Awake:** The aperture opens, the iris follows cursor direction anywhere within the page, and the brow subtly relaxes. Page-wide tracking continues while awake or tired, even when the pointer is outside the button; the housing remains neutral outside the button.
- **Blink:** While awake or tired, variable-delay timers trigger brief full eyelid closures over the eye silhouette. The iris and sclera keep their native geometry; blinking is disabled when reduced motion is requested.
- **Tired:** After 2.2 seconds without pointer movement, the upper lid lowers over the iris to create a half-closed expression. While keyboard focus remains, tired cues are allowed, but the eye cannot enter full sleep.
- **Sleep:** After another 780 ms idle, the eye closes and the gaze resets, except while keyboard-focused. When focus is lost, the normal idle-to-sleep progression resumes.
- **Reactivation:** Moving the pointer while tired wakes the eye. Once fully asleep, renewed pointer movement wakes it if the pointer is still over the button; if the pointer is outside the button, it waits for the next button entry. Waking uses a quick but gentle eyelid opening, with the iris moving toward the pointer as the aperture opens before settling into fixation.
- **Microgravity:** The enamel face follows pointer movement by at most 1.15 px horizontally and 0.75 px vertically while the pointer is over the button. Outside it, the face stays neutral while the iris keeps tracking. When the pointer leaves the viewport, the gaze briefly holds its last fixation, then gradually returns toward center without triggering sleep by itself.
- **Pressed:** The face travels down by 1 px; no bounce or ripple.
- **Focus-visible:** A clear 2 px ivory outline with an orange secondary edge. Keyboard focus gently wakes the eye with a neutral centered gaze; pointer tracking begins when pointer input is available, while the focus ring remains visible.
- **Disabled/loading:** Native disabled semantics; tracking is blocked and the eye sleeps. Loading gets a small corner spinner.
- **Touch:** Pointer tracking is skipped on touch pointer movement.
- **Reduced motion:** Transitions and spinner animation become effectively immediate.

## Eye behavior research — decisions before implementation

### Decision 01: idle gaze / maintain fixation

**Chosen direction:** A — Maintain fixation.

When the eye is awake and the pointer becomes stationary, it continues looking toward that pointer position rather than wandering away. The gaze can contain very low-amplitude, low-frequency micro-movements so it does not feel like a perfectly frozen vector. Natural blinks may occur at irregular intervals and should not look like a repeating animation loop. Fatigue develops gradually from the awake expression into the tired state; it must not be represented by immediately losing interest or looking away.

**Behavior constraints:**
- Pointer position remains the gaze target while it is stationary.
- Micro-movements are subtle deviations around fixation, not random large gaze jumps.
- Blink timing varies; no obvious fixed-period loop.
- Fatigue is communicated through eyelid aperture, brow tension, and blink behavior while fixation remains the default.
- This is a behavior design decision only; exact durations, amplitudes, and implementation remain open for subsequent decisions and testing.

### Decision 02: response to pointer motion / adaptive ocular motion

**Chosen direction:** A — Adaptive ocular motion.

The eye uses two response styles based on target motion. During continuous, slower pointer movement, the iris follows with smooth pursuit and a small, controlled lag. When the target jumps a large distance between samples, the eye makes a rapid saccade-like transition toward the new target, then settles into fixation. The transition should feel organic without overshoot, spring bounce, or exaggerated elastic motion.

**Behavior constraints:**
- Slow and continuous motion uses smooth pursuit rather than snapping every frame.
- Sudden, large changes in pointer target use a fast gaze transition.
- Saccade-like motion ends cleanly at the target; no bouncy overshoot.
- After reaching the target, the eye returns to the maintain-fixation behavior defined in Decision 01.
- Thresholds, speeds, easing, and lag are implementation parameters to tune after browser testing; do not imply exact human physiology from the stylized animation.

### Decision 03: blink character / natural irregular blinking

**Chosen direction:** A — Natural, irregular blinking.

The eye uses short blinks with variable intervals. A blink may happen after a gaze shift or when attention relaxes, but it preserves the current fixation target. Blinking is driven by the behavior state rather than an obvious repeating CSS loop. As fatigue develops, eyelid motion may slow or the resting aperture may narrow, but blink timing should not become a rigid metronome.

**Behavior constraints:**
- Blinks are short, complete lid movements with a smooth close-and-open profile.
- The interval varies within a plausible range; avoid obvious periodic loops.
- A gaze shift or moment of relaxation can increase the chance of a blink, rather than forcing one after every movement.
- Blinking never changes the current gaze target.
- Exact timing and duration remain tunable implementation parameters and must be validated visually.

### Decision 04: fatigue expression / gradual layered fatigue

**Chosen direction:** A — Gradual layered fatigue.

Fatigue accumulates through several subtle cues rather than a single sudden eyelid change. The upper lid gradually lowers, the brow relaxes slightly, and occasional blinks become slower. The eye continues fixating on the current pointer target until the sleep transition; it must not look away merely because it becomes tired.

**Behavior constraints:**
- Use a gradual progression of eyelid aperture, brow tension, and blink timing.
- Keep the gaze target stable while awake and tired.
- Slower blinks are occasional cues, not a repeated exaggerated animation.
- The final transition to sleep should read as the culmination of fatigue, not an abrupt state toggle.
- The exact fatigue curve and timing remain implementation parameters to test visually.

### Decision 05: waking behavior / soft, attentive awakening

**Chosen direction:** A — Soft, attentive awakening.

When the sleeping eye is reactivated by pointer entry, the eyelids open quickly but gently. The iris begins orienting toward the pointer during the opening motion, then settles into the fixation behavior defined in Decision 01. The expression should convey renewed attention rather than surprise, alarm, or an abrupt instrument-like activation.

**Behavior constraints:**
- Eyelid opening is prompt but controlled, without a sudden startled snap.
- Iris orientation begins during the opening transition, so gaze and aperture feel coordinated.
- The gaze settles into fixation without overshoot or spring-like bounce.
- Brow movement stays subtle; do not add a surprised expression.
- Timing and coordination remain implementation parameters to validate in the browser.

### Decision 06: pointer exit / gentle return to neutral

**Chosen direction:** B — Gentle return to neutral.

When the pointer leaves the browser viewport, the eye briefly preserves its last fixation before slowly returning its gaze toward the center. This provides a quiet release from tracking without an abrupt gaze reset or an immediate transition to sleep.

**Behavior constraints:**
- Hold the last gaze target briefly after pointer exit.
- Return toward the neutral center gradually, with controlled motion and no overshoot or spring bounce.
- Pointer exit alone must not force the eye into the sleeping state.
- The face and housing remain neutral outside the button; this decision applies to gaze behavior.
- Exact hold duration and return timing remain tunable implementation parameters to validate in the browser.

### Decision 07: recovery from sleep / renewed activity wakes it

**Chosen direction:** B — Renewed activity wakes it.

After the eye reaches full sleep, fresh pointer movement wakes it if the pointer is still inside the button. If the pointer is outside the button, the sleeping state remains until the pointer enters the button again. This lets the eye respond to renewed user activity without making it wake from unrelated motion elsewhere on the page.

**Behavior constraints:**
- While fully asleep and hovered, a new pointer movement is a wake trigger.
- While fully asleep and outside the button, pointer movement alone is not a wake trigger; button re-entry is required.
- The wake transition follows Decision 05: open quickly but gently, coordinate iris orientation toward the pointer, then settle into fixation.
- Pointer movement must not bypass the waking transition or cause the iris to teleport to its target.
- The wake trigger is distinct from the fatigue and sleep timers; implementation should avoid stale timers accidentally returning the eye to sleep immediately after waking.

### Decision 08: gaze boundary / page-wide tracking

**Chosen direction:** A — Page-wide tracking.

While the eye is awake or tired, its iris tracks the pointer throughout the browser viewport, including when the pointer is far from the button. Only the iris gaze changes; the housing and enamel face stay neutral when the pointer is outside the button.

**Behavior constraints:**
- Track the pointer throughout the viewport while awake or tired, not just while hovering over the button.
- Keep housing microgravity and pointer-responsive face movement limited to the pointer being over the button.
- On viewport exit, follow Decision 06: briefly hold the last fixation, then return gradually toward center without triggering sleep by itself.
- After full sleep, follow Decision 07: movement wakes the eye only if the pointer is still over the button; otherwise, button re-entry is required.
- The gaze boundary and sleep state are separate concerns; do not let page-wide tracking prevent fatigue or sleep.
- Pointer coordinates, target transitions, and event listeners must remain bounded and cleaned up correctly when the component unmounts.

### Decision 09: keyboard focus / focus wakes the eye

**Chosen direction:** A — Focus wakes the eye.

When the button receives keyboard focus, the eye wakes gently and adopts a neutral, centered gaze. Pointer tracking begins when pointer input is available. The visible focus ring remains present so the expression never substitutes for a conventional keyboard-focus indicator.

**Behavior constraints:**
- Keyboard focus can initiate the gentle wake transition without requiring pointer movement.
- Begin from a neutral centered gaze when no usable pointer target is available.
- When pointer input becomes available, follow the normal gaze-tracking behavior without abrupt target jumps.
- Keep the visible focus ring clear throughout the wake transition and while focus remains.
- Preserve native button semantics and Enter/Space activation; focus and wake behavior must not activate the button.
- Avoid competing wake triggers or stale sleep timers that immediately close the eye after focus wakes it.

### Decision 10: fatigue while keyboard-focused / tired, but never fully asleep

**Chosen direction:** C — Tired, but never fully asleep.

Keyboard focus remains a sign that the control is actively being navigated, so the eye may express gradual fatigue while focused but must not fully close. Once focus is lost, the normal idle-to-sleep progression applies again.

**Behavior constraints:**
- Fatigue cues may progress while keyboard focus remains, including a lowered upper lid and relaxed brow.
- Full sleep is prohibited while the button retains keyboard focus.
- On blur, resume the normal idle-to-sleep progression without an abrupt expression change or an immediate forced sleep.
- Preserve the visible focus ring until focus is genuinely lost.
- Ensure timer cancellation and rescheduling cannot cause a stale sleep timer to close the eye while focus is still active.

### Decision 10: fatigue while keyboard-focused / tired, but never fully asleep

**Chosen direction:** C — Tired, but never fully asleep.

While the button retains keyboard focus, the eye may gradually show tired cues, but it must not close fully. When focus leaves, the normal idle-to-sleep progression can resume. This preserves visible keyboard context without freezing the eye's entire fatigue behavior.

**Behavior constraints:**
- Focused state may progress from awake to tired using the existing fatigue cues.
- While keyboard focus remains, suppress the transition to full sleep but do not force the eye to remain fully awake.
- On blur, resume the normal idle-to-sleep progression without an abrupt expression jump.
- Keep the focus-visible ring independent of eye aperture and expression.
- Ensure sleep timers are cleared, paused, or reconciled when focus changes to prevent stale callbacks from closing a focused eye.

## Accessibility and engineering constraints

- Use native `<button>` semantics and default `type="button"`.
- Keep the SVG eye decorative (`aria-hidden`); provide the default programmatic accessible name “Optical Anchor eye control” when there are no visible children.
- Preserve Enter/Space activation and visible keyboard focus.
- Keep `loading` distinct from `disabled`; loading sets `aria-busy`.
- SVG gradient, clip, and filter IDs must be unique per rendered component instance.
- Do not make activation depend on the eye's expression.
- No pointer manipulation, routing, network calls, sound, or business logic inside the component.

## Banlist

- No Lucide, Feather, Heroicons, or emoji.
- No purple-blue gradients, gratuitous glow, glassmorphism, or RGB gamer aesthetic.
- No pill housing, giant shadows, gratuitous 3D bevel, noisy texture, or ambient animation.
- No generic bounce, ripple, or pointer teleportation.
