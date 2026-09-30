import type { WeatherData } from '../types/weather';

export const mockWeatherData: WeatherData = {
  city: {
    id: 3448439,
    name: 'São Paulo',
    country: 'Brasil',
    admin1: 'São Paulo',
    latitude: -23.55,
    longitude: -46.63,
    timezone: 'America/Sao_Paulo',
  },
  timezone: 'America/Sao_Paulo',
  current: {
    time: '2026-09-30T10:00',
    temperatureC: 22,
    humidityPercent: 68,
    windSpeedKmh: 12.5,
    precipitationMm: 0.2,
    pressureHpa: 1013,
    condition: {
      code: 2,
      label: 'Parcialmente nublado',
    },
  },
  forecast: [
    {
      date: '2026-09-30',
      temperatureMinC: 16,
      temperatureMaxC: 25,
      precipitationProbabilityPercent: 15,
      condition: { code: 2, label: 'Parcialmente nublado' },
    },
    {
      date: '2026-10-01',
      temperatureMinC: 17,
      temperatureMaxC: 26,
      precipitationProbabilityPercent: 25,
      condition: { code: 3, label: 'Nublado' },
    },
    {
      date: '2026-10-02',
      temperatureMinC: 18,
      temperatureMaxC: 27,
      precipitationProbabilityPercent: 70,
      condition: { code: 61, label: 'Chuva fraca' },
    },
    {
      date: '2026-10-03',
      temperatureMinC: 17,
      temperatureMaxC: 24,
      precipitationProbabilityPercent: 10,
      condition: { code: 1, label: 'Predominantemente limpo' },
    },
    {
      date: '2026-10-04',
      temperatureMinC: 16,
      temperatureMaxC: 23,
      precipitationProbabilityPercent: 45,
      condition: { code: 80, label: 'Pancadas de chuva' },
    },
  ],
};
