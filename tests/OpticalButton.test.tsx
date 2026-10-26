import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import opticalButtonStyles from '../src/components/optical-button.css?raw';
import { OpticalButton } from '../src/components/OpticalButton';

afterEach(() => cleanup());

function dispatchPointerMove(target: Element, clientX: number, clientY: number) {
  const event = new Event('pointermove', { bubbles: true, cancelable: true });
  Object.defineProperties(event, {
    pointerType: { value: 'mouse' },
    clientX: { value: clientX },
    clientY: { value: clientY },
  });
  fireEvent(target, event);
}

function findCssBlocks(source: string, header: string) {
  const blocks: { start: number; end: number; text: string }[] = [];
  let searchFrom = 0;

  while (true) {
    const start = source.indexOf(header, searchFrom);
    if (start < 0) break;
    const openBrace = source.indexOf('{', start);
    if (openBrace < 0) break;

    let depth = 0;
    let end = openBrace;
    for (; end < source.length; end += 1) {
      if (source[end] === '{') depth += 1;
      if (source[end] === '}') depth -= 1;
      if (depth === 0) break;
    }

    if (depth !== 0) break;
    blocks.push({ start, end: end + 1, text: source.slice(start, end + 1) });
    searchFrom = end + 1;
  }

  return blocks;
}

describe('OpticalButton', () => {
  it('renders a centered eye-first native button with a useful default accessible label', () => {
    render(<OpticalButton />);
    expect(screen.getByRole('button', { name: 'Optical Anchor eye control' })).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    const button = screen.getByRole('button');
    expect(button.querySelector('.oa-button__eye')).toHaveAttribute('viewBox', '0 0 160 104');
    expect(button.querySelector('.oa-button__brow--excited')).toBeInTheDocument();
    expect(button.querySelector('.oa-button__bubble')).toHaveTextContent("Let's collab!");
    expect(button.querySelector('.oa-button__bubble')).toHaveAttribute('aria-hidden', 'true');
  });

  it('limits physical hover expression to any hover-capable fine pointer', () => {
    const mediaBlocks = findCssBlocks(opticalButtonStyles, '@media (any-hover: hover) and (any-pointer: fine)');
    const mediaCss = mediaBlocks.map((block) => block.text).join('\n');
    const outsideMedia = mediaBlocks.reduce(
      (source, block) => source.slice(0, source.indexOf(block.text)) + source.slice(source.indexOf(block.text) + block.text.length),
      opticalButtonStyles,
    );
    const physicalHoverSelectors = [
      '.oa-button:not(:disabled):hover .oa-button__brow--neutral',
      '.oa-button:not(:disabled):hover .oa-button__brow--excited',
      '.oa-button:not(:disabled):hover .oa-button__bubble',
    ];

    expect(mediaBlocks.length).toBeGreaterThan(0);
    for (const selector of physicalHoverSelectors) {
      expect(mediaCss).toContain(selector);
      expect(outsideMedia).not.toContain(selector);
    }
    expect(opticalButtonStyles).toContain('--bubble-x: 35px; --bubble-y: -68px;');
    expect(opticalButtonStyles).toContain('--bubble-x: 49px; --bubble-y: -85px;');
  });

  it('keeps SVG resource identifiers unique across multiple instances', () => {
    render(<><OpticalButton /><OpticalButton /></>);
    const ids = Array.from(document.querySelectorAll('.oa-button__eye [id]'), (node) => node.id);
    expect(ids.length).toBeGreaterThan(0);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('keeps iris geometry intact and layers distinct eyelid shapes over the aperture', () => {
    render(<OpticalButton />);
    const eye = screen.getByRole('button').querySelector('.oa-button__eye') as SVGSVGElement;
    const iris = eye.querySelector('.oa-button__iris');
    const awakeLid = eye.querySelector('.oa-button__lid-cover--awake');
    const tiredLid = eye.querySelector('.oa-button__lid-cover--tired');
    const sleepingLid = eye.querySelector('.oa-button__lid-cover--sleeping');

    expect(iris).toHaveAttribute('clip-path', expect.stringContaining('aperture-clip'));
    expect(awakeLid).toBeInTheDocument();
    expect(tiredLid).toBeInTheDocument();
    expect(sleepingLid).toBeInTheDocument();
    expect(new Set([
      awakeLid?.getAttribute('d'),
      tiredLid?.getAttribute('d'),
      sleepingLid?.getAttribute('d'),
    ]).size).toBe(3);
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

      dispatchPointerMove(button, 180, 120);
      expect(button).toHaveClass('oa-button--awake');

      dispatchPointerMove(button, 900, 80);
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

  it('blinks irregularly while focused without entering sleep', () => {
    vi.useFakeTimers();
    const random = vi.spyOn(Math, 'random').mockReturnValue(0);
    try {
      render(<OpticalButton />);
      const button = screen.getByRole('button');
      fireEvent.focus(button);

      expect(button).toHaveClass('oa-button--awake');
      vi.advanceTimersByTime(2200);
      expect(button).toHaveClass('oa-button--tired');
      vi.advanceTimersByTime(2400);
      expect(button).toHaveClass('oa-button--blinking');
      vi.advanceTimersByTime(135);
      expect(button).not.toHaveClass('oa-button--blinking');
      expect(button).toHaveClass('oa-button--tired');
      expect(button).not.toHaveClass('oa-button--sleeping');
    } finally {
      random.mockRestore();
      vi.useRealTimers();
    }
  });

  it('keeps a disabled button asleep and does not wake on pointer movement', () => {
    render(<OpticalButton disabled>Unavailable</OpticalButton>);
    const button = screen.getByRole('button', { name: 'Unavailable' });
    dispatchPointerMove(button, 20, 20);
    expect(button).toHaveClass('oa-button--sleeping');
    expect(button).not.toHaveClass('oa-button--awake');
  });

  it('applies size and full-width classes', () => {
    render(<OpticalButton size="lg" fullWidth>Wide</OpticalButton>);
    expect(screen.getByRole('button', { name: 'Wide' })).toHaveClass('oa-button--lg', 'oa-button--full-width');
  });
});
