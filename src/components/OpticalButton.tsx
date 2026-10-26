import { forwardRef, useCallback, useEffect, useId, useRef, type ButtonHTMLAttributes, type PointerEvent } from 'react';
import './optical-button.css';

export type OpticalButtonSize = 'sm' | 'md' | 'lg';
type EyeState = 'sleeping' | 'awake' | 'tired';

export interface OpticalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Keeps the face in its progress state and prevents repeat activation. */
  loading?: boolean;
  /** Visual footprint: compact, standard, or oversized. */
  size?: OpticalButtonSize;
  /** Stretches the control to the width of its containing block. */
  fullWidth?: boolean;
}

const IDLE_MS = 2200;
const TIRED_MS = 780;

/**
 * A native, eye-only button: hovering wakes the eye, page-wide pointer movement
 * steers its iris, and inactivity takes it from tired back to sleep.
 */
export const OpticalButton = forwardRef<HTMLButtonElement, OpticalButtonProps>(
  function OpticalButton(
    {
      children,
      className = '',
      disabled = false,
      fullWidth = false,
      loading = false,
      size = 'md',
      type = 'button',
      'aria-label': ariaLabel,
      onPointerMove,
      onPointerLeave,
      onPointerDown,
      onPointerUp,
      ...buttonProps
    },
    forwardedRef,
  ) {
    const localRef = useRef<HTMLButtonElement | null>(null);
    const eyeId = useId().replace(/:/g, '');
    const blocked = disabled || loading;

    const setButtonRef = useCallback((node: HTMLButtonElement | null) => {
      localRef.current = node;
      if (typeof forwardedRef === 'function') forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    }, [forwardedRef]);

    useEffect(() => {
      const button = localRef.current;
      if (!button) return;
      let state: EyeState = 'sleeping';
      let tiredTimer: number | undefined;
      let sleepTimer: number | undefined;

      const clearTimers = () => {
        window.clearTimeout(tiredTimer);
        window.clearTimeout(sleepTimer);
        tiredTimer = undefined;
        sleepTimer = undefined;
      };
      const setEye = (next: EyeState) => {
        state = next;
        button.classList.toggle('oa-button--sleeping', next === 'sleeping');
        button.classList.toggle('oa-button--awake', next === 'awake');
        button.classList.toggle('oa-button--tired', next === 'tired');
      };
      const reset = (resetGaze = true) => {
        if (resetGaze) {
          button.style.setProperty('--gaze-x', '0px');
          button.style.setProperty('--gaze-y', '0px');
        }
        button.style.setProperty('--pull-x', '0px');
        button.style.setProperty('--pull-y', '0px');
      };
      const sleep = () => {
        clearTimers();
        setEye('sleeping');
        reset();
      };
      const scheduleSleep = () => {
        clearTimers();
        tiredTimer = window.setTimeout(() => {
          setEye('tired');
          tiredTimer = undefined;
          sleepTimer = window.setTimeout(sleep, TIRED_MS);
        }, IDLE_MS);
      };
      const handleMove = (event: globalThis.PointerEvent) => {
        if (blocked || event.pointerType === 'touch') return;
        const rect = button.getBoundingClientRect();
        const inside = event.clientX >= rect.left && event.clientX <= rect.right &&
          event.clientY >= rect.top && event.clientY <= rect.bottom;
        if (state === 'sleeping' && !inside) return;

        setEye('awake');
        const eye = button.querySelector('.oa-button__eye');
        if (eye) {
          const eyeRect = eye.getBoundingClientRect();
          const dx = event.clientX - (eyeRect.left + eyeRect.width / 2);
          const dy = event.clientY - (eyeRect.top + eyeRect.height / 2);
          const distance = Math.hypot(dx, dy);
          const strength = Math.min(1, distance / 210);
          const nx = distance ? dx / distance * strength : 0;
          const ny = distance ? dy / distance * strength : 0;
          button.style.setProperty('--gaze-x', (nx * 8).toFixed(2) + 'px');
          button.style.setProperty('--gaze-y', (ny * 5.2).toFixed(2) + 'px');
        }
        if (inside && rect.width && rect.height) {
          const nx = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1));
          const ny = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1));
          button.style.setProperty('--pull-x', (nx * 1.15).toFixed(2) + 'px');
          button.style.setProperty('--pull-y', (ny * 0.75).toFixed(2) + 'px');
        } else {
          button.style.setProperty('--pull-x', '0px');
          button.style.setProperty('--pull-y', '0px');
        }
        scheduleSleep();
      };
      const handleBlur = () => sleep();
      const handleVisibility = () => { if (document.hidden) sleep(); };

      if (blocked) {
        sleep();
        return;
      }
      window.addEventListener('pointermove', handleMove, { passive: true });
      window.addEventListener('blur', handleBlur);
      document.addEventListener('visibilitychange', handleVisibility);
      return () => {
        window.removeEventListener('pointermove', handleMove);
        window.removeEventListener('blur', handleBlur);
        document.removeEventListener('visibilitychange', handleVisibility);
        clearTimers();
      };
    }, [blocked]);

    const handlePointerMove = useCallback((event: PointerEvent<HTMLButtonElement>) => {
      onPointerMove?.(event);
    }, [onPointerMove]);
    const handlePointerLeave = useCallback((event: PointerEvent<HTMLButtonElement>) => {
      const node = localRef.current;
      node?.style.setProperty('--pull-x', '0px');
      node?.style.setProperty('--pull-y', '0px');
      onPointerLeave?.(event);
    }, [onPointerLeave]);
    const handlePointerDown = useCallback((event: PointerEvent<HTMLButtonElement>) => {
      onPointerDown?.(event);
    }, [onPointerDown]);
    const handlePointerUp = useCallback((event: PointerEvent<HTMLButtonElement>) => {
      onPointerUp?.(event);
    }, [onPointerUp]);

    const classes = [
      'oa-button',
      'oa-button--sleeping',
      'oa-button--' + size,
      fullWidth ? 'oa-button--full-width' : '',
      loading ? 'oa-button--loading' : '',
      className,
    ].filter(Boolean).join(' ');

    return (
      <button
        {...buttonProps}
        ref={setButtonRef}
        className={classes}
        type={type}
        disabled={blocked}
        aria-label={ariaLabel || (!children ? 'Optical Anchor eye control' : undefined)}
        aria-busy={loading || undefined}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <span className="oa-button__face">
          <span className="oa-button__content">
            <svg className="oa-button__eye" viewBox="0 0 160 104" aria-hidden="true" focusable="false">
              <defs>
                <linearGradient id={eyeId + '-sclera'} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fff8ed" />
                  <stop offset="36%" stopColor="#f7ebdb" />
                  <stop offset="72%" stopColor="#e9d1b9" />
                  <stop offset="100%" stopColor="#c59d83" />
                </linearGradient>
                <linearGradient id={eyeId + '-lid'} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f1c7a2" />
                  <stop offset="48%" stopColor="#a95e43" />
                  <stop offset="100%" stopColor="#613322" />
                </linearGradient>
                <radialGradient id={eyeId + '-iris'} cx="36%" cy="27%" r="78%">
                  <stop offset="0%" stopColor="#f8d897" />
                  <stop offset="24%" stopColor="#dca15a" />
                  <stop offset="52%" stopColor="#a95d30" />
                  <stop offset="78%" stopColor="#69351f" />
                  <stop offset="100%" stopColor="#2d1a14" />
                </radialGradient>
                <radialGradient id={eyeId + '-pupil'} cx="32%" cy="22%" r="85%">
                  <stop offset="0%" stopColor="#33251e" />
                  <stop offset="65%" stopColor="#100e0d" />
                  <stop offset="100%" stopColor="#050505" />
                </radialGradient>
                <linearGradient id={eyeId + '-glint'} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#fff0d6" />
                </linearGradient>
                <clipPath id={eyeId + '-iris-clip'}>
                  <circle cx="80" cy="52" r="27.5" />
                </clipPath>
                <filter id={eyeId + '-soft-shadow'} x="-10%" y="-25%" width="120%" height="160%">
                  <feDropShadow dx="0" dy="2.2" stdDeviation="2.1" floodColor="#351c13" floodOpacity=".3" />
                </filter>
              </defs>

              <path className="oa-button__orbital-shadow" d="M7 52 C31 22 56 13 80 13 C104 13 129 22 153 52 C129 82 104 91 80 91 C56 91 31 82 7 52Z" />
              <path className="oa-button__brow" d="M27 24 C45 12 63 7 80 8 C100 8 118 14 134 25" />
              <g className="oa-button__aperture">
                <path
                  className="oa-button__sclera"
                  d="M9 52 C31 25 56 15 80 15 C104 15 129 25 151 52 C129 79 104 89 80 89 C56 89 31 79 9 52Z"
                  fill={'url(#' + eyeId + '-sclera)'}
                  stroke="#6d4231"
                  strokeWidth="1.25"
                  filter={'url(#' + eyeId + '-soft-shadow)'}
                />
                <path d="M17 52 C39 32 59 23 80 23 C101 23 121 32 143 52" fill="none" stroke="#ffffff" strokeOpacity=".56" strokeWidth="2" strokeLinecap="round" />
                <g className="oa-button__iris">
                  <circle cx="80" cy="52" r="28.2" fill="#3a2118" />
                  <circle cx="80" cy="52" r="26.4" fill={'url(#' + eyeId + '-iris)'} stroke="#5e301c" strokeWidth="1.2" />
                  <circle cx="80" cy="52" r="21.3" fill="none" stroke="#edbd72" strokeOpacity=".7" strokeWidth="1.1" />
                  <g clipPath={'url(#' + eyeId + '-iris-clip)'} strokeLinecap="round">
                    <path d="M80 26 L82 34 M89 27 L87 35 M98 31 L94 38 M106 38 L99 42 M108 47 L100 49 M109 56 L100 55 M105 65 L98 61 M97 72 L92 65 M87 77 L85 68 M77 78 L78 68 M67 75 L71 66 M58 69 L65 62 M52 60 L62 57 M52 50 L62 51 M56 40 L65 45 M64 31 L70 39" fill="none" stroke="#f4c77c" strokeOpacity=".62" strokeWidth="1.05" />
                    <path d="M83 27 L83 35 M94 30 L90 37 M103 38 L97 43 M108 51 L100 52 M102 64 L96 60 M91 74 L88 66 M73 76 L75 67 M61 66 L67 61 M54 54 L62 53 M61 39 L68 44" fill="none" stroke="#4a281a" strokeOpacity=".68" strokeWidth=".9" />
                  </g>
                  <circle cx="80" cy="52" r="13.4" fill="#241812" stroke="#c58a50" strokeWidth="1.1" />
                  <circle cx="80" cy="52" r="11.8" fill={'url(#' + eyeId + '-pupil)'} />
                  <ellipse cx="72.8" cy="42.4" rx="5.9" ry="3.6" fill={'url(#' + eyeId + '-glint)'} opacity=".96" transform="rotate(-32 72.8 42.4)" />
                  <circle cx="88.7" cy="61.2" r="2" fill="#f3d9b2" opacity=".72" />
                  <circle cx="72.8" cy="42.4" r="1.5" fill="#ffffff" />
                </g>
              </g>
              <path className="oa-button__lid--upper" d="M9 52 C31 25 56 15 80 15 C104 15 129 25 151 52" />
              <path className="oa-button__lid--lower" d="M10 52 C34 79 56 89 80 89 C104 89 126 79 150 52" />
              <path className="oa-button__closed-lid" d="M9 52 C39 66 121 66 151 52" />
              <path className="oa-button__lid-highlight" d="M24 38 C44 21 61 18 80 18 C100 18 117 22 136 38" />
              <path className="oa-button__tear-duct" d="M13 49 Q17 52 13 55 M147 49 Q143 52 147 55" />
            </svg>
            {children ? <span className="oa-button__label">{children}</span> : null}
          </span>
        </span>
      </button>
    );
  },
);

OpticalButton.displayName = 'OpticalButton';
