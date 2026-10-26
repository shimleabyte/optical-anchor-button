# Optical Anchor — Design Contract v2 / Eye-First Experiment

## Product direction

**Name:** Optical Anchor  
**Product:** One reusable native button component.  
**Identity:** Precision instrument expressed through studio hardware cues.  
**Primary signature:** One oversized, custom-drawn SVG eye centered within a burnt-orange enamel housing.  
**Design intent:** The eye itself is the action affordance; the previous “Let's Collab” CTA is deliberately removed in this experimental branch.

## Visual language

- **Housing:** Compact graphite frame, inset border, small hardware-like radius, and a warm enamel face.
- **Eye scale:** Dominant focal element. Standard housing is 184 × 132 px; eye artwork is 132 × 86 px. Smaller and larger sizes scale proportionally.
- **Sclera:** Warm ivory with a gentle top highlight and shadowed lower edge, avoiding stark flat white.
- **Iris:** Layered amber-to-copper radial color, dark limbal ring, fine radial fibres, an inner warm ring, deep pupil, and restrained moisture glints.
- **Eyelids:** Upper and lower contours, a warm upper-lid gradient, soft brow crease, and separate closed-lid stroke for sleeping state.
- **Shadow:** Localized contact/drop shading and recessed face treatment only. No ambient glow or oversized shadow.
- **Motion:** The aperture opens on hover, the iris tracks page-wide while awake, and inactivity transitions the eye through tired to sleep.

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

- `sm`: 156 × 112 px.
- `md`: 184 × 132 px; default.
- `lg`: 216 × 156 px.
- `fullWidth`: expands the housing to the containing block's width while keeping the eye centered.
- Optional `children` are supported as a small secondary caption. The showcase leaves children empty.

## Interaction contract

- **Sleeping:** The aperture is closed and the iris hidden until the pointer enters the button.
- **Awake:** The aperture opens, the iris follows cursor direction anywhere within the page, and the brow subtly relaxes.
- **Tired:** After 2.2 seconds without pointer movement, the aperture becomes half-closed.
- **Sleep:** After another 780 ms idle, the eye closes and the gaze resets.
- **Reactivation:** Moving the pointer while tired wakes the eye. Once fully asleep, it waits for the next button entry.
- **Microgravity:** The enamel face follows pointer movement by at most 1.15 px horizontally and 0.75 px vertically while the pointer is over the button. Outside it, the face stays neutral while the iris keeps tracking.
- **Pressed:** The face travels down by 1 px; no bounce or ripple.
- **Focus-visible:** A clear 2 px ivory outline with an orange secondary edge.
- **Disabled/loading:** Native disabled semantics; tracking is blocked and the eye sleeps. Loading gets a small corner spinner.
- **Touch:** Pointer tracking is skipped on touch pointer movement.
- **Reduced motion:** Transitions and spinner animation become effectively immediate.

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
