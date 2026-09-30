import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ForecastList from '../../src/components/ForecastList';
import { mockWeatherData } from '../../src/mocks/weather';

const forecast = mockWeatherData.forecast ?? [];

describe('ForecastList', () => {
  it('renders five days with conditions, temperatures, and rain probabilities', () => {
    render(<ForecastList forecast={forecast} unit="celsius" />);

    const list = screen.getByRole('list');
    const cards = within(list).getAllByRole('listitem');
    expect(cards).toHaveLength(5);
    expect(screen.getByText('Hoje')).toBeInTheDocument();
    expect(screen.getByText('Amanhã')).toBeInTheDocument();
    expect(within(cards[0]).getByText('25°C')).toBeInTheDocument();
    expect(within(cards[0]).getByText('16°C')).toBeInTheDocument();
    expect(within(cards[0]).getByText('15%')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Parcialmente nublado' })).toBeInTheDocument();
  });

  it('converts maximum and minimum temperatures to the selected unit', () => {
    render(<ForecastList forecast={forecast} unit="fahrenheit" />);

    const firstCard = within(screen.getByRole('list')).getAllByRole('listitem')[0];
    expect(within(firstCard).getByText('77°F')).toBeInTheDocument();
    expect(within(firstCard).getByText('61°F')).toBeInTheDocument();
  });

  it('shows a placeholder when rain probability is unavailable', () => {
    const forecastWithoutProbability = forecast.map(
      ({ precipitationProbabilityPercent: _, ...day }) => day,
    );

    render(<ForecastList forecast={forecastWithoutProbability} unit="celsius" />);

    const list = screen.getByRole('list');
    const rainValues = within(list).getAllByText('—');
    expect(rainValues).toHaveLength(5);
    expect(rainValues[0].tagName).toBe('SPAN');
  });

  it('does not present an incomplete forecast as a five-day list', () => {
    render(<ForecastList forecast={forecast.slice(0, 4)} unit="celsius" />);

    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });
});
