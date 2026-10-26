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
      onPointerEnter: onPointerEnterProp,
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
      let blinkTimer: number | undefined;
      let blinkEndTimer: number | undefined;
      let focused = button.matches(':focus');
      const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
      let pointerInsideButton = false;
      let hasPointerTarget = false;
      let lastPointerX = window.innerWidth / 2;
      let lastPointerY = window.innerHeight / 2;
      let returnTimer: number | undefined;

      const clearBlinkTimers = () => {
        window.clearTimeout(blinkTimer);
        window.clearTimeout(blinkEndTimer);
        blinkTimer = undefined;
        blinkEndTimer = undefined;
        button.classList.remove('oa-button--blinking');
      };
      const scheduleBlink = () => {
        window.clearTimeout(blinkTimer);
        blinkTimer = undefined;
        if (state === 'sleeping' || blocked || prefersReducedMotion || document.hidden) return;
        const tired = state === 'tired';
        const delay = tired
          ? (focused ? 2400 + Math.random() * 2200 : 260 + Math.random() * 260)
          : 3400 + Math.random() * 3300;
        blinkTimer = window.setTimeout(() => {
          blinkTimer = undefined;
          if (state === 'sleeping' || blocked || document.hidden) return;
          button.classList.add('oa-button--blinking');
          blinkEndTimer = window.setTimeout(() => {
            button.classList.remove('oa-button--blinking');
            blinkEndTimer = undefined;
            if (state !== 'tired' || focused) scheduleBlink();
          }, tired ? 135 : 110);
        }, delay);
      };
      const clearTimers = () => {
        window.clearTimeout(tiredTimer);
        window.clearTimeout(sleepTimer);
        tiredTimer = undefined;
        sleepTimer = undefined;
      };
      const setEye = (next: EyeState) => {
        const changed = state !== next;
        state = next;
        button.classList.toggle('oa-button--sleeping', next === 'sleeping');
        button.classList.toggle('oa-button--awake', next === 'awake');
        button.classList.toggle('oa-button--tired', next === 'tired');
        if (next === 'sleeping') clearBlinkTimers();
        else if (changed) scheduleBlink();
      };
      const setGaze = (x: number, y: number) => {
        const eye = button.querySelector('.oa-button__eye');
        if (!eye) return;
        const rect = eye.getBoundingClientRect();
        const dx = x - (rect.left + rect.width / 2);
        const dy = y - (rect.top + rect.height / 2);
        const distance = Math.hypot(dx, dy);
        const strength = Math.min(1, distance / 210);
        button.style.setProperty('--gaze-x', (distance ? dx / distance * strength * 8 : 0).toFixed(2) + 'px');
        button.style.setProperty('--gaze-y', (distance ? dy / distance * strength * 5.2 : 0).toFixed(2) + 'px');
      };
      const resetPull = () => {
        button.style.setProperty('--pull-x', '0px');
        button.style.setProperty('--pull-y', '0px');
      };
      const resetGaze = () => {
        button.style.setProperty('--gaze-x', '0px');
        button.style.setProperty('--gaze-y', '0px');
      };
      const sleep = () => {
        clearTimers();
        if (focused) {
          setEye('tired');
          return;
        }
        setEye('sleeping');
        resetGaze();
      };
      const scheduleSleep = () => {
        clearTimers();
        tiredTimer = window.setTimeout(() => {
          tiredTimer = undefined;
          setEye('tired');
          if (focused) return;
          sleepTimer = window.setTimeout(sleep, TIRED_MS);
        }, IDLE_MS);
      };
      const wake = () => {
        window.clearTimeout(returnTimer);
        setEye('awake');
        scheduleSleep();
      };
      const handleMove = (event: globalThis.PointerEvent) => {
        if (blocked || event.pointerType === 'touch') return;
        lastPointerX = event.clientX;
        lastPointerY = event.clientY;
        hasPointerTarget = true;
        const rect = button.getBoundingClientRect();
        button.classList.remove('oa-button--returning');
        pointerInsideButton = event.clientX >= rect.left && event.clientX <= rect.right &&
          event.clientY >= rect.top && event.clientY <= rect.bottom;
        if (state === 'sleeping') {
          if (!pointerInsideButton) return;
          wake();
        } else {
          setEye('awake');
          scheduleSleep();
        }

        setGaze(event.clientX, event.clientY);
        if (pointerInsideButton && rect.width && rect.height) {
          const nx = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1));
          const ny = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1));
          button.style.setProperty('--pull-x', (nx * 1.15).toFixed(2) + 'px');
          button.style.setProperty('--pull-y', (ny * 0.75).toFixed(2) + 'px');
        } else {
          resetPull();
        }
      };
      const handlePointerOut = (event: globalThis.PointerEvent) => {
        if (event.relatedTarget !== null) return;
        pointerInsideButton = false;
        resetPull();
        window.clearTimeout(returnTimer);
        if (state === 'sleeping') return;
        returnTimer = window.setTimeout(() => {
          if (state !== 'sleeping') {
            button.classList.add('oa-button--returning');
            resetGaze();
          }
          returnTimer = undefined;
        }, 180);
      };
      const handleFocus = () => {
        focused = true;
        if (blocked) return;
        clearTimers();
        setEye('awake');
        if (hasPointerTarget) setGaze(lastPointerX, lastPointerY);
        else resetGaze();
        scheduleSleep();
      };
      const handleFocusOut = () => {
        focused = false;
        if (blocked) return;

        // If focus leaves while already tired, finish the tired phase rather
        // than restarting the full idle interval.
        if (state === 'tired') {
          clearTimers();
          sleepTimer = window.setTimeout(sleep, TIRED_MS);
          return;
        }
        scheduleSleep();
      };
      const handleWindowBlur = () => {
        pointerInsideButton = false;
        resetPull();
        if (focused) {
          clearTimers();
          setEye('tired');
        } else {
          sleep();
        }
      };
      const handleVisibility = () => {
        if (document.hidden) handleWindowBlur();
        else if (state !== 'sleeping') scheduleBlink();
      };

      if (blocked) {
        sleep();
        return;
      }
      if (focused) handleFocus();
      window.addEventListener('pointermove', handleMove, { passive: true });
      window.addEventListener('pointerout', handlePointerOut);
      window.addEventListener('blur', handleWindowBlur);
      button.addEventListener('focus', handleFocus);
      button.addEventListener('blur', handleFocusOut);
      document.addEventListener('visibilitychange', handleVisibility);
      return () => {
        window.removeEventListener('pointermove', handleMove);
        window.removeEventListener('pointerout', handlePointerOut);
        window.removeEventListener('blur', handleWindowBlur);
        button.removeEventListener('focus', handleFocus);
        button.removeEventListener('blur', handleFocusOut);
        document.removeEventListener('visibilitychange', handleVisibility);
        clearTimers();
        clearBlinkTimers();
        window.clearTimeout(returnTimer);
        button.classList.remove(
          'oa-button--pointer-hover',
          'oa-button--returning',
          'oa-button--awake',
          'oa-button--tired',
          'oa-button--sleeping',
        );
        resetPull();
        resetGaze();
      };
    }, [blocked]);

    const handlePointerEnter = useCallback((event: PointerEvent<HTMLButtonElement>) => {
      if (event.pointerType !== 'touch' && !blocked) {
        localRef.current?.classList.add('oa-button--pointer-hover');
      }
      onPointerEnterProp?.(event);
    }, [blocked, onPointerEnterProp]);
    const handlePointerMove = useCallback((event: PointerEvent<HTMLButtonElement>) => {
      onPointerMove?.(event);
    }, [onPointerMove]);
    const handlePointerLeave = useCallback((event: PointerEvent<HTMLButtonElement>) => {
      const node = localRef.current;
      if (event.pointerType !== 'touch') node?.classList.remove('oa-button--pointer-hover');
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
        onPointerEnter={handlePointerEnter}
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
                <clipPath id={eyeId + '-aperture-clip'}>
                  <path d="M10 53 C9 50 11 47 15 44 C35 25 57 16 80 16 C106 16 131 26 151 47 C132 73 107 87 81 88 C53 89 28 76 10 53Z" />
                </clipPath>
                <clipPath id={eyeId + '-iris-clip'}>
                  <circle cx="80" cy="52" r="27.5" />
                </clipPath>
                <filter id={eyeId + '-soft-shadow'} x="-10%" y="-25%" width="120%" height="160%">
                  <feDropShadow dx="0" dy="2.2" stdDeviation="2.1" floodColor="#351c13" floodOpacity=".3" />
                </filter>
              </defs>

              <path className="oa-button__orbital-shadow" d="M8 53 C7 50 10 46 15 42 C35 22 57 13 80 13 C107 13 133 24 155 47 C135 76 109 92 81 93 C52 94 27 79 8 53Z" />
              <path className="oa-button__brow oa-button__brow--neutral" d="M27 24 C45 12 63 7 80 8 C100 8 118 14 134 25" />
              <path className="oa-button__brow oa-button__brow--excited" d="M25 23 C42 6 61 2 80 2 C102 2 122 8 137 23" />
              <g className="oa-button__aperture">
                <path
                  className="oa-button__sclera"
                  d="M10 53 C9 50 11 47 15 44 C35 25 57 16 80 16 C106 16 131 26 151 47 C132 73 107 87 81 88 C53 89 28 76 10 53Z"
                  fill={'url(#' + eyeId + '-sclera)'}
                  stroke="#6d4231"
                  strokeWidth="1.25"
                  filter={'url(#' + eyeId + '-soft-shadow)'}
                />
                <path d="M17 52 C39 32 59 23 80 23 C101 23 121 32 143 52" fill="none" stroke="#ffffff" strokeOpacity=".56" strokeWidth="2" strokeLinecap="round" />
                <g className="oa-button__iris" clipPath={'url(#' + eyeId + '-aperture-clip)'}>
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
                <path
                  className="oa-button__lid-cover oa-button__lid-cover--awake"
                  d="M10 53 C9 50 11 47 15 44 C35 25 57 16 80 16 C106 16 131 26 151 47 C132 38 108 31 80 31 C55 32 34 39 15 44 C11 47 9 50 10 53Z"
                  fill={'url(#' + eyeId + '-lid)'}
                />
                <path
                  className="oa-button__lid-cover oa-button__lid-cover--tired"
                  d="M10 53 C9 50 11 47 15 44 C35 25 57 16 80 16 C106 16 131 26 151 47 C132 47 105 50 80 49 C55 50 32 47 15 44 C11 47 9 50 10 53Z"
                  fill={'url(#' + eyeId + '-lid)'}
                />
                <path
                  className="oa-button__lid-cover oa-button__lid-cover--sleeping"
                  d="M10 53 C9 50 11 47 15 44 C35 25 57 16 80 16 C106 16 131 26 151 47 C132 73 107 87 81 88 C53 89 28 76 10 53Z"
                  fill={'url(#' + eyeId + '-lid)'}
                />
                <path className="oa-button__lid-edge oa-button__lid-edge--awake" d="M9 52 C31 39 54 30 80 30 C106 30 129 39 151 52" />
                <path className="oa-button__lid-edge oa-button__lid-edge--tired" d="M9 52 C31 47 55 49 80 48 C105 49 129 47 151 52" />
              </g>
              <path className="oa-button__lid--upper" stroke={'url(#' + eyeId + '-lid)'} d="M10 53 C9 50 11 47 15 44 C35 25 57 16 80 16 C106 16 131 26 151 47" />
              <path className="oa-button__lid--lower" d="M12 53 C32 76 55 88 81 88 C107 87 132 73 150 49" />
              <path className="oa-button__closed-lid" d="M10 53 C35 45 58 42 80 43 C104 42 127 44 150 47" />
              <path className="oa-button__lid-highlight" d="M24 38 C44 21 61 18 80 18 C100 18 117 22 136 38" />
              <path className="oa-button__tear-duct" d="M15 48 C11 50 12 54 16 56 M145 50 Q149 52 145 54" />
            </svg>
            <span className="oa-button__bubble" aria-hidden="true">Let's collab!</span>
            {children ? <span className="oa-button__label">{children}</span> : null}
          </span>
        </span>
      </button>
    );
  },
);

OpticalButton.displayName = 'OpticalButton';
