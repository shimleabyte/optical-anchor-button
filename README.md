# Optical Anchor Button

A standalone React button concept built around one custom optical signature: a burnt-orange face, a dark precision frame, a hand-drawn eye, page-wide pointer tracking, and an awake-to-tired-to-sleep lifecycle. This is a focused single-component experiment, not a general UI kit.

![Optical Anchor design preview](docs/previews/optical-anchor.svg)

[Interactive HTML prototype](Optical-Anchor-Prototype.html) · [Browser validation report](docs/BROWSER-VALIDATION.md)

## Design contract

- **Identity:** Precision Instrument / Studio Hardware.
- **Material:** An anodized-inspired matte surface with a dark inset frame.
- **Geometry:** Compact square silhouette, fine inset edge, and restrained corner radius.
- **Signature:** One custom-drawn optical eye with restrained brow expression.
- **Eye lifecycle:** Starts asleep, wakes on hover, tracks pointer direction across the page, grows tired after 2.2 seconds of inactivity, then sleeps 780 ms later.
- **Microgravity:** The face shifts by at most about 1.15 px horizontally and 0.75 px vertically only while the pointer is over the button. The system cursor is never moved.
- **State feedback:** Default, hover, pressed, focus-visible, disabled, and loading.
- **Accessibility:** Native button semantics, keyboard activation, visible focus, a stable accessible label, and reduced-motion support.
- **Visual constraints:** No purple/blue gradients, gratuitous glow, glassmorphism, third-party icon packs, emoji, or ambient animation.

See [DESIGN-CONTRACT.md](DESIGN-CONTRACT.md) for the full specification.

## Run locally

Requires Node.js 20.19+ or 22.12+. Node.js 22 is the CI-tested baseline.

The repository currently uses npm in CI. Use one package manager per checkout; do not alternate between npm and pnpm in the same existing `node_modules` directory.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Use the state selector to inspect component states, hover the button to wake the eye, move the pointer elsewhere in the page, then pause to observe the tired and sleeping states.

If you prefer pnpm, use `pnpm install` and `pnpm dev consistently for that checkout. No lockfile is currently committed, so dependency versions selected by the package manager may differ within the version ranges in `package.json`.

## Verify

```bash
npm run typecheck
npm test
npm run build
```

The repository includes type-checking, unit tests, and a production build. See [docs/BROWSER-VALIDATION.md](docs/BROWSER-VALIDATION.md) for browser-test scope and limitations.

## Component API

`OpticalButton` extends native React button attributes with `loading`, `size` (`sm` / `md` / `lg`), and `fullWidth` props. The default size is `md` (44 px); `sm` is 36 px and `lg` is 52 px. The default label is “Let's Collab”, and the default button type is `button` to avoid accidental form submission.

The eye is decorative and hidden from assistive technology. The visible button label supplies its accessible name.

## Scope excluded from v1

No routing, API calls, built-in tooltips, icon dependencies, cursor manipulation, randomized expressions, sound effects, or generic ripple animation. Showcase state-forcing classes are not part of the public component API.

## License

MIT. See [LICENSE](LICENSE).
