# Browser validation — page-wide gaze lifecycle

## Current status

The page-wide gaze lifecycle is implemented in the React component and standalone HTML prototype. **Fresh browser validation has not yet been run for this revision.** Do not interpret the historical 20/20 result below as proof that this update passes.

## Expected behavior to verify

- The eye is closed on first render.
- Entering the button with a mouse or pen wakes the eye.
- After waking, pointer movement elsewhere inside the page continues to steer the iris.
- The face microgravity returns to neutral outside the button while the iris keeps tracking.
- After 2.2 seconds without pointer movement, the eye becomes tired; after another 780 ms, it closes and its gaze resets.
- Moving the pointer again during the tired phase wakes the eye immediately and restarts the idle timer.
- Disabled/loading controls remain asleep and do not react to pointer movement.
- Touch pointer movement does not trigger the gaze behavior.
- Window blur or document visibility loss resets the eye to sleep.
- Native keyboard activation, focus-visible styling, reduced motion, responsive layout, and no-overflow checks remain intact.

## Historical baseline

The previous prototype revision recorded 20/20 checks in Chromium 144. That report covered local button-only tracking, including resetting gaze on pointer leave. Those assertions are obsolete because the current behavior deliberately tracks beyond the button. Run the updated prototype and React test/build scripts before publishing a new pass count.
