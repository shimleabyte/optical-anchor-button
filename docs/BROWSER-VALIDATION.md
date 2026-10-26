# Browser validation — eye-first design branch

## Current branch status

The earlier 12-check report recorded the page-wide tracking lifecycle before this design revision. It is a historical baseline, not a visual pass for the current centered-eye artwork.

The current branch changes the button dimensions, replaces the eye SVG with shaded sclera and a layered copper/amber iris, removes the default CTA label, and updates the standalone prototype. GitHub Actions checks the React type-check, unit tests, and production build; those checks do not render the standalone HTML in a real browser.

## Manual/browser regression checklist

- The eye is centered within the enclosure at sm, md, and lg sizes.
- The default render shows no “Let's Collab” label or right-side status mark.
- The eye is closed initially and opens on button entry.
- The iris follows the pointer beyond the button after the eye wakes.
- Iris translation stays bounded within the eye aperture.
- After 2.2 seconds of inactivity, the eye gets tired; after another 780 ms, it sleeps and resets its gaze.
- The upper and lower eyelid outlines stay crisp through sleeping, awake, and tired states.
- Hover and pressed housing colors remain warm and restrained.
- Focus-visible, disabled, loading, and reduced-motion states remain legible.
- No horizontal overflow at 390 px or 320 px; no uncaught JavaScript errors.

## SVG/rendering notes

The React component uses `useId` to scope gradient, clip-path, and filter resources per instance. The standalone HTML prototype uses fixed SVG IDs because it contains a single eye instance. The browser checklist should be re-run before merging this experimental branch.
