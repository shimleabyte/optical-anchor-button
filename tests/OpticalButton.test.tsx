import { render, screen } from '@testing-library/react';
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

  it('applies size and full-width classes', () => {
    render(<OpticalButton size="lg" fullWidth>Wide</OpticalButton>);
    expect(screen.getByRole('button', { name: 'Wide' })).toHaveClass('oa-button--lg', 'oa-button--full-width');
  });
});
