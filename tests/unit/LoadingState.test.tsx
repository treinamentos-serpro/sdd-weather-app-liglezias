import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import LoadingState from '../../src/components/states/LoadingState';

describe('LoadingState', () => {
  it('announces the default loading message through a status role', () => {
    render(<LoadingState />);

    expect(screen.getByRole('status')).toHaveTextContent('Carregando...');
  });

  it('renders a custom loading message', () => {
    render(<LoadingState message="Buscando previsão..." />);

    expect(screen.getByRole('status')).toHaveTextContent('Buscando previsão...');
  });
});
