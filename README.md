# Optical Anchor Button

An eye-first React button experiment built around a centered, oversized, pointer-aware iris.

Optical Anchor combines a machined graphite frame, a lightly micro-grained burnt-orange enamel face, and a custom vector eye with warm sclera shading, an amber/copper iris, radial fibres, glossy reflections, and page-wide tracking. While the pointer is over the button, the brow lifts into an excited expression and a small “Let's collab!” speech bubble appears; there is no persistent CTA label.

![Optical Anchor design preview](docs/previews/optical-anchor.svg)

[Interactive HTML prototype](Optical-Anchor-Prototype.html) · [Component QA matrix](component-matrix.html) · [Browser validation report](docs/BROWSER-VALIDATION.md) · [Vanilla rebuild](vanilla/index.html) · [Vanilla architecture](docs/VANILLA-REBUILD.md)

## Design contract

- Identity: Precision Instrument / Studio Hardware.
- Material: anodized-inspired matte surface with a dark inset frame.
- Geometry: slim 280 × 76 px standard capsule with a 25 px outer radius, an inset precision frame, and a 138 px raised central bezel. The eye remains the dominant focal point.
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

Run `npm run typecheck`, `npm test`, `npm run build`, and `npm run test:browser`.

GitHub Actions runs the type-check, unit tests, production build, and Playwright Chromium regression suite. Browser coverage includes the `sm` / `md` / `lg` dimensions, bezel and eye scaling, full-width parent caps, idle/hover rendering, pointer exit, keyboard focus, disabled/loading states, reduced motion, simulated touch/mouse input, and narrow viewport fit. The browser workflow uploads desktop and responsive screenshots, traces, and an HTML report as artifacts. Automated checks do not certify every anatomical detail or transition, so review the evidence before merging; see [docs/BROWSER-VALIDATION.md](docs/BROWSER-VALIDATION.md).

## Implementations

The React implementation is the primary component baseline. A framework-free build is available at [`vanilla/index.html`](vanilla/index.html); it uses classic local scripts and can be opened directly in a browser. See [the Vanilla rebuild guide](docs/VANILLA-REBUILD.md) for its API and file boundaries.

## Component API

OpticalButton extends native React button attributes with `loading`, `size` (`sm` / `md` / `lg`), and `fullWidth` props. The eye-only default has an accessible name of “Optical Anchor eye control” and defaults to `type="button"` to avoid accidental form submission. Housing sizes are sm (236 × 64 px), md (280 × 76 px), and lg (324 × 88 px); the raised bezel scales from 116 px to 160 px. `fullWidth` expands the housing to the containing block up to 360 px. Optional children are supported as a secondary caption, but the showcase leaves them empty.

The eye is decorative and hidden from assistive technology. A programmatic accessible name is provided when the button has no visible children.

## Scope excluded from v1

No routing, API calls, built-in tooltips, icon dependencies, cursor manipulation, randomized expressions, sound effects, or generic ripple animation. Showcase state-forcing classes are not part of the public component API.

## License

MIT. See LICENSE.
