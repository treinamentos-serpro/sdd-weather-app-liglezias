import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../../src/App';
import useWeather, { type UseWeatherResult } from '../../src/hooks/useWeather';
import { mockWeatherData } from '../../src/mocks/weather';

vi.mock('../../src/hooks/useWeather', () => ({
  default: vi.fn(),
}));

function mockWeatherHook(overrides: Partial<UseWeatherResult> = {}): UseWeatherResult {
  const result: UseWeatherResult = {
    status: 'idle',
    data: undefined,
    cities: [],
    error: undefined,
    query: '',
    search: vi.fn().mockResolvedValue(undefined),
    selectCity: vi.fn().mockResolvedValue(undefined),
    retry: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };

  vi.mocked(useWeather).mockReturnValue(result);
  return result;
}

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the brand, search and unit controls in idle state', () => {
    mockWeatherHook();
    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: 'Clima do Luciozo' })).toBeInTheDocument();
    expect(screen.getByRole('search')).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Unidade de temperatura' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Consulte o clima da sua cidade' }),
    ).toBeInTheDocument();
  });

  it('delegates search and renders loading state', async () => {
    const search = vi.fn().mockResolvedValue(undefined);
    mockWeatherHook({ status: 'idle', search });
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('searchbox', { name: 'Buscar cidade' }), 'Campinas');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(search).toHaveBeenCalledExactlyOnceWith('Campinas');
  });

  it('renders loading state and disables search while loading', () => {
    mockWeatherHook({ status: 'loading' });
    render(<App />);

    expect(screen.getByRole('status')).toHaveTextContent('Buscando clima...');
    expect(screen.getByRole('button', { name: 'Buscar' })).toBeDisabled();
  });

  it('renders empty and error states and delegates retry', async () => {
    mockWeatherHook({ status: 'empty' });
    const { rerender } = render(<App />);
    expect(screen.getByRole('heading', { name: 'Nenhuma cidade encontrada' })).toBeInTheDocument();

    const retry = vi.fn().mockResolvedValue(undefined);
    mockWeatherHook({ status: 'error', error: 'Falha de rede.', retry });
    rerender(<App />);

    expect(screen.getByRole('alert')).toHaveTextContent('Falha de rede.');
    await userEvent.setup().click(screen.getByRole('button', { name: 'Tentar novamente' }));
    expect(retry).toHaveBeenCalledExactlyOnceWith();
  });

  it('renders hook data and converts temperatures using UI unit state', async () => {
    mockWeatherHook({ status: 'success', data: mockWeatherData });
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByText('22°C')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(5);

    await user.click(screen.getByRole('button', { name: 'Fahrenheit' }));

    expect(screen.getByText('72°F')).toBeInTheDocument();
    expect(screen.getByText('77°F')).toBeInTheDocument();
  });
});
