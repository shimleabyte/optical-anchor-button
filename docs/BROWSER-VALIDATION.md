# Browser validation — eye-first design branch

## Current branch status

The current implementation replaces whole-eye vertical squashing with layered SVG eyelid covers for awake, tired, and sleeping states. The iris is clipped to the almond-shaped aperture, the inner/outer corners are asymmetric, and the bezel has clearer concentric rims and contact shading. A Playwright Chromium run now checks physical hover, pointer exit, keyboard focus, disabled/loading behavior, and viewport fit at 320 px and 390 px. The screenshots are available in the linked workflow artifact. These browser checks verify the exercised interaction and viewport contracts; they do not prove every anatomical detail or transition quality, so the remaining visual checklist is still useful before merge.

## Manual/browser regression checklist

- The body, bezel, and eye share a consistent visual center at sm, md, and lg sizes.
- The size matrix renders sm at 236 × 64 px with a 116 px bezel and 108 × 70 px eye; md at 280 × 76 px with a 138 px bezel and 132 × 86 px eye; lg at 324 × 88 px with a 160 px bezel and 158 × 103 px eye.
- The bezel appears mechanically seated in the capsule, with distinct graphite, copper, and inset-rim boundaries.
- Idle shows no speech bubble; hovering the button raises the excited brow and reveals “Let's collab!” without a persistent label.
- Leaving the button hides the bubble and returns the brow to neutral while page-wide eye tracking may continue.
- The showcase `STATE` readout changes to `HOVER` while the live object is physically hovered, then returns to the selected preview state on pointer exit.
- Keyboard focus alone does not show the speech bubble or the excited brow.
- Physical excited expression is gated to `any-hover: hover` and `any-pointer: fine`; touch-only devices do not acquire a persistent hover bubble.
- The hover/focus expression and bubble remain hidden when the button is disabled or loading.
- Bubble placement stays clear of the brow and bezel at sm/md/lg and full-width sizes; it remains within the housing bounds and inside narrow 320 px and 390 px layouts.
- `fullWidth` fills a narrower parent and caps at 360 px when its parent is wider; the bezel and iris remain horizontally centered.
- On hybrid-capable input, synthetic touch pointer entry does not add the physical-hover class or change gaze, while mouse movement can still activate the hover expression.
- On touch-only emulation, touch pointer movement does not wake or steer the eye and does not expose the excited brow or bubble.
- Bubble fade-out completes before visibility becomes hidden; reduced-motion removes the delay.
- The sleeping state fully covers the sclera and iris; only the closed-lid contour remains.
- Waking reveals the almond aperture without stretching or flattening the iris.
- Tired state covers the upper portion of the eye while the visible iris and pupil remain circular.
- The medial tear duct, outer canthus, upper lid edge, lower waterline, and lid crease remain distinct without crossing or doubling awkwardly.
- No open-eye upper/lower contour remains visible on top of the sleeping cover.
- The iris stays clipped to the aperture at extreme gaze offsets; highlights remain legible without escaping the eye silhouette.
- Awake/tired/sleep transitions crossfade cleanly and do not expose overlapping lid shapes as a double outline.
- Irregular blinks fully cover the aperture briefly, reopen cleanly, and do not alter iris geometry.
- A keyboard-focused eye may blink and become tired but never enters sleep until focus is lost.
- Reduced-motion preference disables autonomous blinking and shortens visual transitions.
- The iris follows the pointer beyond the button after the eye wakes.
- After 2.2 seconds of inactivity, the eye gets tired; after another 780 ms, it sleeps and resets its gaze.
- Hover and pressed housing colors remain warm and restrained.
- Focus-visible, disabled, loading, and reduced-motion states remain legible.
- No horizontal overflow at 390 px or 320 px; no uncaught JavaScript errors.

## Validation record

- Quality workflow: [GitHub Actions checks](https://github.com/shimleabyte/optical-anchor-button/actions/workflows/ci.yml) runs TypeScript validation, unit tests, and a production build with both the main showcase and QA matrix as build entries.
- Browser workflow: [Chromium Browser QA](https://github.com/shimleabyte/optical-anchor-button/actions/workflows/browser-qa.yml) checks button dimensions and eye/bezel scaling for sm/md/lg; bubble bounds; wide and narrow `fullWidth` parents; disabled/loading, focus-visible and reduced-motion states; and simulated hybrid and touch-only pointer input.
- The QA matrix is available at `/component-matrix.html` while the Vite development server is running.
- The workflow artifacts include desktop idle and hover screenshots, the desktop size matrix, a 320 px full-width matrix screenshot, 320 px / 390 px hover screenshots, failure traces, and the Playwright HTML report.
- Automated checks confirm only the exercised interaction and layout contracts; inspect the screenshots for fine anatomical construction, bezel/housing material alignment, and transition quality before merging.


## SVG/rendering notes

The React component uses `useId` to scope gradient, clip-path, and filter resources per instance. The standalone HTML prototype uses fixed SVG IDs because it contains a single eye instance. The browser checklist should be re-run before merging this experimental branch.
