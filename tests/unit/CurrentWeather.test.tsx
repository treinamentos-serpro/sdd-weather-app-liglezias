import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CurrentWeather from '../../src/components/CurrentWeather';
import type { City, CurrentWeather as CurrentWeatherData } from '../../src/types/weather';

const city: City = {
  id: 1,
  name: 'São Paulo',
  country: 'Brasil',
  latitude: -23.55,
  longitude: -46.63,
  timezone: 'America/Sao_Paulo',
};

const current: CurrentWeatherData = {
  time: '2026-09-30T10:00',
  temperatureC: 22,
  condition: { code: 2, label: 'Parcialmente nublado' },
  humidityPercent: 68,
  windSpeedKmh: 12.5,
  precipitationMm: 0.2,
  pressureHpa: 1013,
};

describe('CurrentWeather', () => {
  it('renders the city, condition icon, converted temperature, and metrics', () => {
    render(<CurrentWeather city={city} current={current} unit="fahrenheit" />);

    expect(screen.getByRole('heading', { name: 'São Paulo' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Parcialmente nublado' })).toHaveTextContent('⛅');
    expect(screen.getByText('72°F')).toBeInTheDocument();
    expect(screen.getByText('68 %')).toBeInTheDocument();
    expect(screen.getByText('12,5 km/h')).toBeInTheDocument();
    expect(screen.getByText('0,2 mm')).toBeInTheDocument();
    expect(screen.getByText('1.013 hPa')).toBeInTheDocument();
  });

  it('shows placeholders for metrics missing from a partial current payload', () => {
    const { humidityPercent: _humidity, ...partialCurrent } = current;
    render(<CurrentWeather city={city} current={partialCurrent} unit="celsius" />);

    expect(screen.getByText('22°C')).toBeInTheDocument();
    expect(screen.getByText('Umidade').parentElement).toHaveTextContent('—');
  });
});
