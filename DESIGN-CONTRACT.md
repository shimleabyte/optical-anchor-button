# Optical Anchor — Design Contract v1

## Product direction

**Name:** Optical Anchor  
**Product:** One reusable standalone button component.  
**Identity:** Precision Instrument, expressed through studio hardware cues.  
**Signature:** One custom-drawn optical eye whose pupil follows pointer direction, paired with restrained eyebrow expression and a small gravity illusion.

## Visual tokens

| Token | Value | Role |
| --- | --- | --- |
| `--oa-orange` | `#B34D26` | Main burnt-orange face |
| `--oa-orange-hover` | `#AD4823` | Slightly deeper hover face, preserving text contrast |
| `--oa-orange-pressed` | `#963D1C` | Pressed face |
| `--oa-ink` | `#191816` | Graphite frame / dark stage |
| `--oa-frame-line` | `#65402E` | Normal outer edge |
| `--oa-ivory` | `#F3EEE6` | Eye sclera, text, and focus ring on dark surroundings |
| `2px` | Corner radius | Square geometry, not pill-shaped |
| `1px` | Inset/border detail | Precision edge treatment |

## Button dimensions

- `sm`: 36 px high.
- `md`: 44 px high; default.
- `lg`: 52 px high.
- The eye is part of the component's visual signature, not a third-party icon.
- Label uses inherited neutral sans-serif type and stays editable via `children`.

## Interaction contract

- **Idle:** relaxed brow, centered gaze, neutral face.
- **Hover:** gaze follows pointer; brow lifts slightly; face shifts one shade deeper; inset/outer edges become brighter.
- **Pressed:** face travels down by 1 px; no bounce or ripple.
- **Focus-visible:** clear 2 px ivory outline for dark surfaces, with an orange secondary edge.
- **Disabled:** native disabled behavior and clearly muted surface.
- **Loading:** busy state, visible spinner, stable label, and blocked repeat activation. It looks different from disabled.
- **Microgravity:** button face follows pointer by no more than 1.15 px horizontally and 0.75 px vertically. The operating-system pointer is never moved.
- **Pointer leave:** gaze and face offset return to zero.
- **Touch:** pointer tracking is skipped on touch pointers; native pressed feedback remains.
- **Reduced motion:** transitions and spinner animation become effectively immediate.

## Accessibility and engineering constraints

- Use native `<button>` semantics and default `type="button"`.
- Keep the eye decorative (`aria-hidden`); visible button content supplies the accessible name.
- Preserve Enter/Space behavior and a visible keyboard focus indicator.
- Keep `loading` distinct from `disabled`; loading also sets `aria-busy`.
- Do not make any action depend on the eye's expression.
- No pointer manipulation, routing, network calls, sound, or business logic inside the component.

## Banlist

- No Lucide, Feather, Heroicons, or emoji.
- No purple-blue gradient, gratuitous glow, glassmorphism, or RGB gamer aesthetic.
- No pill shape, giant shadow, gratuitous 3D bevel, noisy texture, random expression, or ambient animation.
- No generic scroll animations, bounce, ripple, or pointer teleportation.
- No marketing copy that substitutes for a defined component contract.

## Prototype scope

This prototype validates the `primary` visual direction only. Additional `secondary` and `ghost` variants should be added only after the primary's proportions and interaction feel are approved. The showcase's forced-state classes are demo-only and are not part of the component API.
