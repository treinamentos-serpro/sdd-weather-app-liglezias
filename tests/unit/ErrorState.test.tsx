import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ErrorState from '../../src/components/states/ErrorState';

describe('ErrorState', () => {
  it('renders the message as an alert and invokes retry', () => {
    const onRetry = vi.fn();
    render(<ErrorState message="Não foi possível carregar o clima." onRetry={onRetry} />);

    expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível carregar o clima.');
    fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));

    expect(onRetry).toHaveBeenCalledExactlyOnceWith();
  });
});
