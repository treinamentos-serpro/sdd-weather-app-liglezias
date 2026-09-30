import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import EmptyState from '../../src/components/states/EmptyState';

describe('EmptyState', () => {
  it('renders a title and a helpful hint', () => {
    render(
      <EmptyState title="Nenhuma cidade encontrada" hint="Tente outro nome ou confira a grafia." />,
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Nenhuma cidade encontrada' })).toBeInTheDocument();
    expect(screen.getByText('Tente outro nome ou confira a grafia.')).toBeInTheDocument();
  });
});
