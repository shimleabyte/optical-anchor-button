# Browser validation — page-wide gaze lifecycle

## Standalone prototype result

**12 / 12 functional and responsive checks passed** against `Optical-Anchor-Prototype.html` in headless Chromium. No uncaught page errors were observed. The scenario ran at 1280 × 900 and then at a 390 × 844 viewport.

Validated behavior:
- The eye starts closed.
- Pointer entry on the button wakes the eye.
- After waking, the iris tracks pointer movement elsewhere in the page.
- The button's microgravity resets outside its hit area while the gaze continues.
- Pointer inactivity changes the eye to tired after 2.2 seconds.
- The eye closes and resets after another 780 ms.
- Page movement does not wake the eye again while it is sleeping; button re-entry does.
- The disabled preview remains disabled and forces the eye back to sleep.
- The narrow viewport has no horizontal overflow.
- The flow produced no uncaught JavaScript errors.

## React package verification

GitHub Actions' **Quality checks** workflow passed the TypeScript type-check, unit tests, and production build on commit `afc1d6b`. The test suite includes checks for the eye lifecycle and viewport pointer movement. Re-run the workflow after future changes; the standalone browser test and React package checks cover different execution paths.

## Scope

These checks are focused behavior checks, not a full accessibility audit. Reduced-motion, focus-visible, native keyboard activation, and other existing component behaviors are covered by the project's test baseline, but the 12-check run above specifically records the new lifecycle and responsive behavior.
