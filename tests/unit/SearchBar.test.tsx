import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import SearchBar from '../../src/components/SearchBar';

describe('SearchBar', () => {
  it('exposes a labeled search form and submits the trimmed city', () => {
    const onSearch = vi.fn();

    render(<SearchBar onSearch={onSearch} />);

    expect(screen.getByRole('search')).toBeInTheDocument();
    const input = screen.getByRole('searchbox', { name: 'Buscar cidade' });
    fireEvent.change(input, { target: { value: '  São Paulo  ' } });
    fireEvent.submit(screen.getByRole('search'));

    expect(onSearch).toHaveBeenCalledExactlyOnceWith('São Paulo');
  });

  it.each(['', '   '])('does not submit an empty trimmed value: %j', (value) => {
    const onSearch = vi.fn();

    render(<SearchBar onSearch={onSearch} />);

    fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar cidade' }), {
      target: { value },
    });
    fireEvent.submit(screen.getByRole('search'));

    expect(onSearch).not.toHaveBeenCalled();
  });

  it('disables the input and submit button when disabled', () => {
    render(<SearchBar onSearch={vi.fn()} disabled />);

    expect(screen.getByRole('searchbox', { name: 'Buscar cidade' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Buscar' })).toBeDisabled();
  });
});
