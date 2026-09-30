import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from '../../src/App';

describe('App', () => {
  it('starts idle with brand, search, and unit controls', () => {
    render(<App />);

    expect(
      screen.getByRole('link', { name: 'Clima Agora — ir para o conteúdo' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('search')).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Unidade de temperatura' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Consulte o clima da sua cidade' }),
    ).toBeInTheDocument();
  });

  it('shows loading and then the mock weather for São Paulo', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('searchbox', { name: 'Buscar cidade' }), 'São Paulo');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(screen.getByRole('status')).toHaveTextContent('Buscando clima...');
    expect(await screen.findByText('22°C')).toBeInTheDocument();
    expect(screen.getByRole('list')).toHaveAttribute(
      'class',
      expect.stringContaining('grid-cols-2'),
    );
  });

  it('shows the empty state for a city not present in the local mock', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('searchbox', { name: 'Buscar cidade' }), 'Recife');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(
      await screen.findByRole('heading', { name: 'Nenhuma cidade encontrada' }),
    ).toBeInTheDocument();
  });

  it('keeps the unit as UI state and converts displayed temperatures', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('searchbox', { name: 'Buscar cidade' }), 'São Paulo');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));
    await screen.findByText('22°C');
    await user.click(screen.getByRole('button', { name: '°F' }));

    expect(screen.getByText('72°F')).toBeInTheDocument();
    expect(screen.getByText('77°F')).toBeInTheDocument();
  });
});
