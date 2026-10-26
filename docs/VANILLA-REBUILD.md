# Vanilla rebuild

The Vanilla implementation lives in `vanilla/` and mirrors the React showcase without a React runtime, TypeScript compilation, or application bundler.

## Run it

Open `vanilla/index.html` in a modern browser. The page uses classic scripts and local CSS; it does not need a development server. For automated browser checks, the repository's Playwright workflow serves the root using Vite and visits `/vanilla/index.html`.

## Structure

- `index.html` — static showcase markup and semantic landmarks.
- `vanilla.css` — the current studio stylesheet and optical button stylesheet, combined without changing their design tokens or component selectors.
- `eye-controller.js` — timers, pointer tracking, focus lifecycle, fatigue/sleep, blinking, reduced motion, visibility handling, and cleanup.
- `optical-button.js` — native button factory, unique SVG IDs per instance, native attributes via the `attributes` object, loading/disabled API, and controller ownership.
- `showcase.js` — preview state controls, activation counter, and live state readout.

## Component API

```js
const control = OpticalAnchorButton.create({
  ariaLabel: "Open project",
  describedBy: "project-hint",
  size: "md", // sm | md | lg
  fullWidth: false,
  disabled: false,
  loading: false,
  children: "", // optional visible secondary caption
  onClick(event) { /* application action */ }
});
document.querySelector("#mount").append(control.element);

// Update after creation:
control.setDisabled(true);
control.setLoading(false);

// When the owning view is removed:
control.destroy();
```

The factory returns `element`, `controller`, `setDisabled`, `setLoading`, and `destroy`. It uses a native button so keyboard activation and form behavior remain browser-managed. Pass common and custom attributes through `attributes`; event-handler strings, `class`, `style`, and lifecycle-managed attributes are ignored in that bag. Use `onClick` for the activation callback. `disabled` and `loading` remain independent flags, so clearing one does not override the other.

## Behavioral contract

The eye wakes on mouse/pen entry or movement while it is already awake; gaze tracks across the page, while the face pull is limited to the button bounds. Inactivity transitions through tired after 2.2 seconds and sleeps 780 ms later unless keyboard focus remains. Touch pointer movement does not wake or steer the iris. The bubble and excited brow are only for hover-capable fine pointers. Reduced-motion preference disables autonomous blinks; visibility changes and window blur reconcile the active state. Destroy removes listeners, timers, and transient state classes.

## Validation

Run the repository scripts from the root:

- `npm run typecheck`
- `npm test`
- `npm run build`
- `npm run test:browser`
- `npm run check:vanilla-css` (CI verifies the standalone stylesheet exactly matches the source studio and component styles)
- `npm run sync:vanilla-css` after changing either source stylesheet

The dedicated Vanilla browser tests verify native button attributes, keyboard activation, physical hover, focused tired/sleep lifecycle, controller cleanup, live reduced-motion changes, disabled/loading API independence, direct `file://` opening, and narrow viewports. CI also checks that `vanilla/vanilla.css` stays synchronized with the two source stylesheets. The React implementation remains intact on this branch as the comparison baseline.
