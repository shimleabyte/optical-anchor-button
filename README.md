# Optical Anchor Button — React + Vanilla JavaScript

An eye-first interactive button experiment with a centered, oversized, pointer-aware iris. This branch keeps the React/TypeScript implementation as the comparison baseline and adds a framework-free Vanilla JavaScript version of the same optical interaction.

Optical Anchor combines a machined graphite frame, a lightly micro-grained burnt-orange enamel face, and a custom vector eye with warm sclera shading, an amber/copper iris, radial fibres, glossy reflections, and page-wide tracking. While the pointer is over the button, the brow lifts into an excited expression and a small “Let's collab!” speech bubble appears; there is no persistent CTA label.

![Optical Anchor design preview](docs/previews/optical-anchor.svg)

[React showcase](index.html) · [Standalone Vanilla showcase](vanilla/index.html) · [Component QA matrix](component-matrix.html) · [Browser validation report](docs/BROWSER-VALIDATION.md) · [Vanilla architecture guide](docs/VANILLA-REBUILD.md)

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

### React / TypeScript app

The repository currently uses npm in CI. Use one package manager per checkout; do not alternate between npm and pnpm in the same existing `node_modules` directory.

```bash
npm install
npm run dev
```

Open the Vite URL printed in the terminal.

### Standalone Vanilla JavaScript

Open [`vanilla/index.html`](vanilla/index.html) directly in a modern browser. It uses local CSS and classic scripts; it does not need React, a module loader, a bundler, or a development server.

If you prefer pnpm for the React app, use `pnpm install` and `pnpm dev` consistently in that checkout. No lockfile is currently committed, so dependency versions selected by the package manager may differ within the version ranges in `package.json`.

## Verify

```bash
npm run typecheck
npm test
npm run check:vanilla-css
npm run build
npm run test:browser
```

GitHub Actions checks types, unit tests, stylesheet parity, production build output, and browser interactions in Chromium. Browser coverage includes `sm` / `md` / `lg` sizing, full-width sizing, hover and pointer exit, keyboard focus, disabled/loading behavior, reduced motion, simulated touch/mouse input, narrow viewports, native button attributes, controller cleanup, and opening the Vanilla page through `file://`. The browser workflow uploads screenshots, traces, and an HTML report as artifacts.

The `vanilla/vanilla.css` file mirrors the studio and component source stylesheets. After editing either source stylesheet, run `npm run sync:vanilla-css`; CI uses `npm run check:vanilla-css` to detect drift.

See [docs/VANILLA-REBUILD.md](docs/VANILLA-REBUILD.md) for the Vanilla factory API, lifecycle ownership, and implementation boundaries. See [docs/BROWSER-VALIDATION.md](docs/BROWSER-VALIDATION.md) for browser-check scope and limitations.

## Implementations

- **React:** The primary component baseline, with `OpticalButton` props for `loading`, `size` (`sm` / `md` / `lg`), and `fullWidth`. The eye-only default has a programmatic accessible name and defaults to `type="button"`.
- **Vanilla:** `OpticalAnchorButton.create(options)` creates a native button and returns `element`, `controller`, `setDisabled`, `setLoading`, and `destroy`. Common and custom native attributes can be passed through `attributes`; lifecycle-managed attributes and string event handlers are filtered. Disabled and loading remain independent flags.

The eye is decorative and hidden from assistive technology. Visible text or a programmatic label supplies the button's accessible name.

## Scope excluded from v1

No routing, API calls, built-in tooltips, icon dependencies, cursor manipulation, randomized expressions, sound effects, or generic ripple animation. Showcase state-forcing classes are not part of the public component API.

## License

MIT. See [LICENSE](LICENSE).
