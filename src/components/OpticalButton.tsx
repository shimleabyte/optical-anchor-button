import { forwardRef, useCallback, useEffect, useRef, type ButtonHTMLAttributes, type PointerEvent } from 'react';
import './optical-button.css';

export type OpticalButtonSize = 'sm' | 'md' | 'lg';
type EyeState = 'sleeping' | 'awake' | 'tired';

export interface OpticalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Keeps the face in its progress state and prevents repeat activation. */
  loading?: boolean;
  /** Component height: 36, 44, or 52 pixels. */
  size?: OpticalButtonSize;
  /** Stretches the control to the width of its containing block. */
  fullWidth?: boolean;
}

const IDLE_MS = 2200;
const TIRED_MS = 780;

/** A native button whose eye wakes on hover, tracks page-wide, then tires and sleeps. */
export const OpticalButton = forwardRef<HTMLButtonElement, OpticalButtonProps>(
  function OpticalButton(
    {
      children = "Let's Collab",
      className = '',
      disabled = false,
      fullWidth = false,
      loading = false,
      size = 'md',
      type = 'button',
      onPointerMove,
      onPointerLeave,
      onPointerDown,
      onPointerUp,
      ...buttonProps
    },
    forwardedRef,
  ) {
    const localRef = useRef<HTMLButtonElement | null>(null);
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
      const reset = (gaze = true) => {
        if (gaze) {
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
        // Sleeping eyes ignore unrelated page movement until the button is entered.
        if (state === 'sleeping' && !inside) return;

        setEye('awake');
        const eye = button.querySelector('.oa-button__eye');
        if (eye) {
          const eyeRect = eye.getBoundingClientRect();
          const dx = event.clientX - (eyeRect.left + eyeRect.width / 2);
          const dy = event.clientY - (eyeRect.top + eyeRect.height / 2);
          const distance = Math.hypot(dx, dy);
          const strength = Math.min(1, distance / 180);
          const nx = distance ? dx / distance * strength : 0;
          const ny = distance ? dy / distance * strength : 0;
          button.style.setProperty('--gaze-x', (nx * 4.2).toFixed(2) + 'px');
          button.style.setProperty('--gaze-y', (ny * 2.5).toFixed(2) + 'px');
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
        aria-busy={loading || undefined}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <span className="oa-button__face">
          <span className="oa-button__content">
            <svg className="oa-button__eye" viewBox="0 0 48 36" aria-hidden="true" focusable="false">
              <path className="oa-button__brow" d="M10 8.5 Q22 2.5 34 8.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              <path className="oa-button__sclera" d="M4.5 19 Q24 4.5 43.5 19 Q24 33.5 4.5 19Z" fill="#F3EEE6" stroke="#2A1B15" strokeWidth="1.1" />
              <g className="oa-button__iris">
                <circle cx="24" cy="19" r="7.1" fill="#8B3C20" />
                <circle cx="24" cy="19" r="4.1" fill="#171513" />
                <circle cx="25.6" cy="17.4" r="1.35" fill="#FFFFFF" />
              </g>
              <path d="M6.5 19 Q24 7.2 41.5 19" fill="none" stroke="#2A1B15" strokeWidth="0.75" opacity="0.42" />
              <path className="oa-button__loading-scan" d="M5.5 19 H42.5" fill="none" />
              <path className="oa-button__eyelid" d="M4.5 19 Q24 23.5 43.5 19" fill="none" stroke="#2A1B15" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="oa-button__label">{children}</span>
            <span className="oa-button__status" aria-hidden="true">
              {loading ? <span className="oa-button__spinner" /> : <span className="oa-button__status-mark" />}
            </span>
          </span>
        </span>
      </button>
    );
  },
);

OpticalButton.displayName = 'OpticalButton';
