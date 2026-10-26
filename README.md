# Optical Anchor Button — React design branch

An eye-first React button experiment built around a centered, oversized, pointer-aware iris. This branch captures the visual redesign and React component baseline.

Optical Anchor combines a machined graphite frame, a lightly micro-grained burnt-orange enamel face, and a custom vector eye with warm sclera shading, an amber/copper iris, radial fibres, glossy reflections, and page-wide tracking. While the pointer is over the button, the brow lifts into an excited expression and a small “Let's collab!” speech bubble appears; there is no persistent CTA label.

![Optical Anchor design preview](docs/previews/optical-anchor.svg)

[Interactive HTML prototype](Optical-Anchor-Prototype.html) · [Component QA matrix](component-matrix.html) · [Browser validation report](docs/BROWSER-VALIDATION.md)

## Design contract

- **Identity:** Precision Instrument / Studio Hardware.
- **Material:** An anodized-inspired matte surface with a dark inset frame.
- **Geometry:** A 280 × 76 px standard capsule with a 25 px outer radius, an inset precision frame, and a 138 px raised central bezel. The eye remains the dominant focal point.
- **Signature:** A large hand-drawn SVG eye with layered sclera, limbal ring, radial iris fibres, pupil reflections, eyelids, and crease lines.
- **Eye lifecycle:** Starts asleep, wakes on hover, tracks pointer direction across the page, grows tired after 2.2 seconds of inactivity, then sleeps 780 ms later.
- **Microgravity:** The face shifts by at most about 1.15 px horizontally and 0.75 px vertically only while the pointer is over the button. The system cursor is never moved.
- **State feedback:** Sleeping, awake, tired, pressed, focus-visible, disabled, and loading.
- **Accessibility:** Native button semantics, keyboard activation, a programmatic accessible name, visible focus, optional custom children, and reduced-motion support.
- **Visual constraints:** No purple/blue gradients, gratuitous glow, glassmorphism, third-party icon packs, emoji, or ambient animation.

See [DESIGN-CONTRACT.md](DESIGN-CONTRACT.md) for the full specification.

## Run locally

Requires Node.js 20.19+ or 22.12+. Node.js 22 is the CI-tested baseline.

The repository currently uses npm in CI. Use one package manager per checkout; do not alternate between npm and pnpm in the same existing `node_modules` directory.

```bash
npm install
npm run dev
```

Open the Vite URL. Hover the eye housing to wake it, move elsewhere in the page to watch the iris track, then pause to observe the tired and sleeping states. The bubble appears only while hovering the button; move away to return the brow to neutral.

If you prefer pnpm, use `pnpm install` and `pnpm dev` consistently for that checkout. No lockfile is currently committed, so dependency versions selected by the package manager may differ within the version ranges in `package.json`.

## Verify

```bash
npm run typecheck
npm test
npm run build
npm run test:browser
```

GitHub Actions checks the TypeScript types, unit tests, production build, and Playwright Chromium regression suite. Browser coverage includes `sm` / `md` / `lg` dimensions, bezel and eye scaling, full-width sizing, hover and pointer exit, keyboard focus, disabled/loading states, reduced motion, simulated touch/mouse input, and narrow viewport fit. The browser workflow uploads screenshots, traces, and an HTML report as artifacts. Automated tests do not certify every anatomical detail or transition; see [docs/BROWSER-VALIDATION.md](docs/BROWSER-VALIDATION.md) for scope and limitations.

## React component API

`OpticalButton` extends native React button attributes with `loading`, `size` (`sm` / `md` / `lg`), and `fullWidth` props. The eye-only default has an accessible name of “Optical Anchor eye control” and defaults to `type="button"` to avoid accidental form submission. Housing sizes are sm (236 × 64 px), md (280 × 76 px), and lg (324 × 88 px); the raised bezel scales from 116 px to 160 px. `fullWidth` expands the housing to the containing block up to 360 px. Optional children are supported as a secondary caption, but the showcase leaves them empty.

The eye is decorative and hidden from assistive technology. A programmatic accessible name is provided when the button has no visible children.

## Scope excluded from v1

No routing, API calls, built-in tooltips, icon dependencies, cursor manipulation, randomized expressions, sound effects, or generic ripple animation. Showcase state-forcing classes are not part of the public component API.

## License

MIT. See [LICENSE](LICENSE).
