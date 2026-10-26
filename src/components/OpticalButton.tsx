import { forwardRef, useCallback, useRef, type ButtonHTMLAttributes, type PointerEvent } from 'react';
import './optical-button.css';

export type OpticalButtonSize = 'sm' | 'md' | 'lg';

export interface OpticalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Keeps the face in its progress state and prevents repeat activation. */
  loading?: boolean;
  /** Component height: 36, 44, or 52 pixels. */
  size?: OpticalButtonSize;
  /** Stretches the control to the width of its containing block. */
  fullWidth?: boolean;
}

/**
 * Optical Anchor is a native button with a small, pointer-aware optical mark.
 * The mark is decorative; the accessible name comes from the button content.
 */
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

    const resetTracking = useCallback(() => {
      const node = localRef.current;
      if (!node) return;
      node.style.setProperty('--gaze-x', '0px');
      node.style.setProperty('--gaze-y', '0px');
      node.style.setProperty('--pull-x', '0px');
      node.style.setProperty('--pull-y', '0px');
    }, []);

    const handlePointerMove = useCallback((event: PointerEvent<HTMLButtonElement>) => {
      onPointerMove?.(event);
      if (event.pointerType === 'touch' || blocked) return;
      const node = localRef.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const nx = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1));
      const ny = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1));

      // Keep the optical movement expressive but physically restrained.
      node.style.setProperty('--gaze-x', `${(nx * 4.2).toFixed(2)}px`);
      node.style.setProperty('--gaze-y', `${(ny * 2.5).toFixed(2)}px`);
      node.style.setProperty('--pull-x', `${(nx * 1.15).toFixed(2)}px`);
      node.style.setProperty('--pull-y', `${(ny * 0.75).toFixed(2)}px`);
    }, [blocked, onPointerMove]);

    const handlePointerLeave = useCallback((event: PointerEvent<HTMLButtonElement>) => {
      resetTracking();
      onPointerLeave?.(event);
    }, [onPointerLeave, resetTracking]);

    const handlePointerDown = useCallback((event: PointerEvent<HTMLButtonElement>) => {
      onPointerDown?.(event);
    }, [onPointerDown]);

    const handlePointerUp = useCallback((event: PointerEvent<HTMLButtonElement>) => {
      onPointerUp?.(event);
    }, [onPointerUp]);

    const classes = [
      'oa-button',
      `oa-button--${size}`,
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
              <path
                className="oa-button__brow"
                d="M10 8.5 Q22 2.5 34 8.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <path
                d="M4.5 19 Q24 4.5 43.5 19 Q24 33.5 4.5 19Z"
                fill="#F3EEE6"
                stroke="#2A1B15"
                strokeWidth="1.1"
              />
              <g className="oa-button__iris">
                <circle cx="24" cy="19" r="7.1" fill="#8B3C20" />
                <circle cx="24" cy="19" r="4.1" fill="#171513" />
                <circle cx="25.6" cy="17.4" r="1.35" fill="#FFFFFF" />
              </g>
              <path d="M6.5 19 Q24 7.2 41.5 19" fill="none" stroke="#2A1B15" strokeWidth="0.75" opacity="0.42" />
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