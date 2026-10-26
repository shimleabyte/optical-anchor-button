# Browser validation — eye-first design branch

## Current branch status

The current implementation replaces whole-eye vertical squashing with layered SVG eyelid covers for awake, tired, and sleeping states. The iris is clipped to the almond-shaped aperture, the inner/outer corners are asymmetric, and the bezel has clearer concentric rims and contact shading. A Playwright Chromium run now checks physical hover, pointer exit, keyboard focus, disabled/loading behavior, and viewport fit at 320 px and 390 px. The screenshots are available in the linked workflow artifact. These browser checks verify the exercised interaction and viewport contracts; they do not prove every anatomical detail or transition quality, so the remaining visual checklist is still useful before merge.

## Manual/browser regression checklist

- The body, bezel, and eye share a consistent visual center at sm, md, and lg sizes.
- The bezel appears mechanically seated in the capsule, with distinct graphite, copper, and inset-rim boundaries.
- Idle shows no speech bubble; hovering the button raises the excited brow and reveals “Let's collab!” without a persistent label.
- Leaving the button hides the bubble and returns the brow to neutral while page-wide eye tracking may continue.
- The showcase `STATE` readout changes to `HOVER` while the live object is physically hovered, then returns to the selected preview state on pointer exit.
- Keyboard focus alone does not show the speech bubble or the excited brow.
- Physical excited expression is gated to `any-hover: hover` and `any-pointer: fine`; touch-only devices do not acquire a persistent hover bubble.
- The hover/focus expression and bubble remain hidden when the button is disabled or loading.
- Bubble placement stays clear of the brow and bezel at sm/md/lg and full-width sizes; it remains inside narrow 320 px and 390 px layouts.
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

- Automated quality checks: [GitHub Actions Quality checks](https://github.com/shimleabyte/optical-anchor-button/actions/workflows/ci.yml) runs type-checking, unit tests, and the production build.
- Chromium browser QA: [Browser QA workflow](https://github.com/shimleabyte/optical-anchor-button/actions/workflows/browser-qa.yml) checks idle and hover rendering, pointer exit, keyboard focus, disabled/loading behavior, reduced motion, and horizontal fit at 320 px and 390 px.
- Browser evidence: the workflow uploads idle, hover, and narrow-viewport screenshots plus Playwright traces and an HTML report as the `optical-anchor-browser-evidence` artifact.
- The showcase status readout now reports physical hover separately from the selected preview state, so the live object doesn't visually claim to be idle while the real pointer is hovering over it.
- A passing automation run confirms only the exercised browser contracts; inspect the screenshots for detailed eye anatomy, material boundaries, and transition quality before merging.

## SVG/rendering notes

The React component uses `useId` to scope gradient, clip-path, and filter resources per instance. The standalone HTML prototype uses fixed SVG IDs because it contains a single eye instance. The browser checklist should be re-run before merging this experimental branch.
