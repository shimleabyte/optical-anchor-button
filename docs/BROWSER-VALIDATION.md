# Browser validation — eye-first design branch

## Current branch status

The current implementation replaces whole-eye vertical squashing with layered SVG eyelid covers for awake, tired, and sleeping states. The iris is clipped to the almond-shaped aperture, the inner/outer corners are asymmetric, and the bezel has clearer concentric rims and contact shading. Structural tests cover the presence and distinct geometry of these lid layers. The visual result still requires a real-browser pass; unit tests and type checks alone cannot verify anatomy, alignment, or transitions.

## Manual/browser regression checklist

- The body, bezel, and eye share a consistent visual center at sm, md, and lg sizes.
- The bezel appears mechanically seated in the capsule, with distinct graphite, copper, and inset-rim boundaries.
- The default render shows no “Let's Collab” label or right-side status mark.
- The sleeping state fully covers the sclera and iris; only the closed-lid contour remains.
- Waking reveals the almond aperture without stretching or flattening the iris.
- Tired state covers the upper portion of the eye while the visible iris and pupil remain circular.
- The medial tear duct, outer canthus, upper lid edge, lower waterline, and lid crease remain distinct without crossing or doubling awkwardly.
- No open-eye upper/lower contour remains visible on top of the sleeping cover.
- The iris stays clipped to the aperture at extreme gaze offsets; highlights remain legible without escaping the eye silhouette.
- Awake/tired/sleep transitions crossfade cleanly and do not expose overlapping lid shapes as a double outline.
- The iris follows the pointer beyond the button after the eye wakes.
- After 2.2 seconds of inactivity, the eye gets tired; after another 780 ms, it sleeps and resets its gaze.
- Hover and pressed housing colors remain warm and restrained.
- Focus-visible, disabled, loading, and reduced-motion states remain legible.
- No horizontal overflow at 390 px or 320 px; no uncaught JavaScript errors.

## Validation record

- Automated validation status: not yet run in this execution environment.
- Browser visual validation status: pending; do not treat the historical 12-check report as approval of the new eyelid geometry.

## SVG/rendering notes

The React component uses `useId` to scope gradient, clip-path, and filter resources per instance. The standalone HTML prototype uses fixed SVG IDs because it contains a single eye instance. The browser checklist should be re-run before merging this experimental branch.
