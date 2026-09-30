import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import UnitToggle from '../../src/components/UnitToggle';

describe('UnitToggle', () => {
  it('exposes a labeled group and marks the selected unit', () => {
    render(<UnitToggle unit="celsius" onChange={vi.fn()} />);

    expect(screen.getByRole('group', { name: 'Unidade de temperatura' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Celsius' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Fahrenheit' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('marks Fahrenheit as selected when provided by the parent', () => {
    render(<UnitToggle unit="fahrenheit" onChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'Celsius' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    expect(screen.getByRole('button', { name: 'Fahrenheit' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('supports keyboard focus and activates the focused unit', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<UnitToggle unit="celsius" onChange={onChange} />);

    await user.tab();
    expect(screen.getByRole('button', { name: 'Celsius' })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('button', { name: 'Fahrenheit' })).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledExactlyOnceWith('fahrenheit');
  });
});
