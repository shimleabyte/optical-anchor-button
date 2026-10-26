# Optical Anchor Button

An eye-first React button experiment built around a centered, oversized, pointer-aware iris.

Optical Anchor combines a machined graphite frame, a lightly micro-grained burnt-orange enamel face, and a custom vector eye with warm sclera shading, an amber/copper iris, radial fibres, glossy reflections, and page-wide tracking. While the pointer is over the button, the brow lifts into an excited expression and a small “Let's collab!” speech bubble appears; there is no persistent CTA label.

![Optical Anchor design preview](docs/previews/optical-anchor.svg)

[Interactive HTML prototype](Optical-Anchor-Prototype.html) · [Browser validation report](docs/BROWSER-VALIDATION.md)

## Design contract

- Identity: Precision Instrument / Studio Hardware.
- Material: anodized-inspired matte surface with a dark inset frame.
- Geometry: compact hardware housing with a 4 px corner radius, inset precision frame, and a centered eye scaled to dominate the face.
- Signature: a large hand-drawn SVG eye with layered sclera, limbal ring, radial iris fibres, pupil reflections, eyelids, and crease lines.
- Eye lifecycle: starts asleep, wakes when the button is hovered, tracks pointer direction across the page, grows tired after 2.2 seconds of inactivity, then sleeps 780 ms later.
- Microgravity: the face shifts by at most about 1.15 px horizontally and 0.75 px vertically only while the pointer is over the button. The system cursor is never moved.
- State feedback: sleeping, awake, tired, pressed, focus-visible, disabled, and loading.
- Accessibility: native button semantics, keyboard activation, a programmatic accessible name, visible focus, optional custom children, and reduced-motion support.
- Banlist: no purple/blue gradient, gratuitous glow, glassmorphism, third-party icon packs, emoji, or ambient animation.

See DESIGN-CONTRACT.md for the full specification.

## Run locally

Requires Node.js 20.19+ or 22.12+.

1. Run npm install.
2. Run npm run dev.
3. Open the local URL printed by Vite. Hover the eye housing to wake it, move elsewhere on the page to watch the iris track, then pause to observe the tired and sleeping states. The bubble appears only while hovering the button; move away to return the brow to neutral.

## Verify

Run `npm run typecheck`, `npm test`, and `npm run build`.

GitHub Actions passed type-checking, unit tests, and the production build on the current implementation. The previous standalone eye-lifecycle prototype passed 12 interaction/responsive checks in headless Chromium. This design branch changes the SVG artwork and layout, so it needs a fresh visual and responsive validation before it can be called verified. See [docs/BROWSER-VALIDATION.md](docs/BROWSER-VALIDATION.md) for the scope and limitations of those checks.

## Component API

OpticalButton extends native React button attributes with loading, size (sm/md/lg), and fullWidth props. The eye-only default has an accessible name of “Optical Anchor eye control” and a button type of button to avoid accidental form submission. Sizes are sm (156 × 112 px), md (184 × 132 px), and lg (216 × 156 px). Optional children are supported as a secondary caption, but the showcase leaves them empty.

The eye is decorative and hidden from assistive technology. A programmatic accessible name is provided when the button has no visible children.

## Scope excluded from v1

No routing, API calls, built-in tooltips, icon dependencies, cursor manipulation, randomized expressions, sound effects, or generic ripple animation. Showcase state-forcing classes are not part of the public component API.

## License

MIT. See LICENSE.
