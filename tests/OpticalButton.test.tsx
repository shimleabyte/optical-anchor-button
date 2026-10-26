import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { OpticalButton } from '../src/components/OpticalButton';

describe('OpticalButton', () => {
  it('renders a native button with the default accessible label', () => {
    render(<OpticalButton />);
    expect(screen.getByRole('button', { name: "Let's Collab" })).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('passes activation to the consumer', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<OpticalButton onClick={onClick}>Open project</OpticalButton>);
    await user.click(screen.getByRole('button', { name: 'Open project' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('prevents activation when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<OpticalButton disabled onClick={onClick}>Unavailable</OpticalButton>);
    const button = screen.getByRole('button', { name: 'Unavailable' });
    expect(button).toBeDisabled();
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('uses disabled semantics while loading and exposes busy state', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<OpticalButton loading onClick={onClick}>Save</OpticalButton>);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('respects native submit type when requested', () => {
    render(<OpticalButton type="submit">Save form</OpticalButton>);
    expect(screen.getByRole('button', { name: 'Save form' })).toHaveAttribute('type', 'submit');
  });

  it('starts asleep, wakes on button entry, tracks beyond the button, then tires and sleeps', () => {
    vi.useFakeTimers();
    try {
      const { unmount } = render(<OpticalButton>Watch me</OpticalButton>);
      const button = screen.getByRole('button', { name: 'Watch me' });
      const buttonRect = { x: 100, y: 100, left: 100, top: 100, right: 316, bottom: 144, width: 216, height: 44, toJSON: () => ({}) };
      const eye = button.querySelector('.oa-button__eye') as SVGSVGElement;
      const eyeRect = { x: 110, y: 106, left: 110, top: 106, right: 146, bottom: 134, width: 36, height: 28, toJSON: () => ({}) };
      button.getBoundingClientRect = vi.fn(() => buttonRect);
      eye.getBoundingClientRect = vi.fn(() => eyeRect);
      expect(button).toHaveClass('oa-button--sleeping');

      fireEvent.pointerMove(button, { pointerType: 'mouse', clientX: 180, clientY: 120 });
      expect(button).toHaveClass('oa-button--awake');

      fireEvent.pointerMove(button, { pointerType: 'mouse', clientX: 900, clientY: 80 });
      expect(button.style.getPropertyValue('--gaze-x')).not.toBe('0px');
      expect(button.style.getPropertyValue('--pull-x')).toBe('0px');

      vi.advanceTimersByTime(2200);
      expect(button).toHaveClass('oa-button--tired');
      vi.advanceTimersByTime(780);
      expect(button).toHaveClass('oa-button--sleeping');
      unmount();
    } finally {
      vi.useRealTimers();
    }
  });

  it('keeps a disabled button asleep and does not wake on pointer movement', () => {
    render(<OpticalButton disabled>Unavailable</OpticalButton>);
    const button = screen.getByRole('button', { name: 'Unavailable' });
    fireEvent.pointerMove(button, { pointerType: 'mouse', clientX: 20, clientY: 20 });
    expect(button).toHaveClass('oa-button--sleeping');
    expect(button).not.toHaveClass('oa-button--awake');
  });

  it('applies size and full-width classes', () => {
    render(<OpticalButton size="lg" fullWidth>Wide</OpticalButton>);
    expect(screen.getByRole('button', { name: 'Wide' })).toHaveClass('oa-button--lg', 'oa-button--full-width');
  });
});
