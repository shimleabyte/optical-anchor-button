# Browser validation — Prototype 0.1.0

The self-contained HTML prototype was loaded into Chromium 144 through Playwright page.set_content so CSS and JavaScript ran without remote dependencies.

## Result

20 / 20 checks passed against the interactive HTML prototype.

Validated:
- Native accessible button and visible label.
- Eye pupil tracking and face microgravity stay within defined limits.
- Pointer leave resets gaze and pull values.
- Hover changes face, edge, and brow expression.
- Pressed state shifts the face by 1 px.
- Enter and Space activate the native button.
- Disabled prevents activation.
- Loading disables repeat activation, exposes aria-busy, and uses a distinct face treatment.
- Focus indicator remains visible on dark stage.
- Reduced-motion preference shortens transitions and spinner animation.
- Full-width mode fits a narrower parent.
- State controls preserve aria-pressed and reset returns to default.
- No horizontal overflow at 390 px or 320 px.
- No uncaught JavaScript errors.

Contrast ratios recorded in the browser checklist are token-pair calculations, not a full automated accessibility audit.

## Important limitation

This validates the self-contained HTML prototype only. The React component unit tests and package build have not yet passed in this execution environment because npm registry resolution failed with EAI_AGAIN. Do not treat prototype checks as proof that the React package has passed its build or tests.
