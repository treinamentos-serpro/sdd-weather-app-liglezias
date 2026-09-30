import type { Unit } from '../types/weather';

export function toFahrenheit(temperatureC: number): number {
  return (temperatureC * 9) / 5 + 32;
}

export function formatTemperature(temperatureC: number, unit: Unit): string {
  const temperature = unit === 'celsius' ? temperatureC : toFahrenheit(temperatureC);
  const roundedTemperature = Math.round(temperature);
  const suffix = unit === 'celsius' ? '°C' : '°F';

  return `${roundedTemperature}${suffix}`;
}
