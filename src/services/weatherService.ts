import { getWeatherLabel } from '../lib/weatherCodes';
import type { City, CurrentWeather, ForecastDay, WeatherData } from '../types/weather';

const GEOCODING_ENDPOINT = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_ENDPOINT = 'https://api.open-meteo.com/v1/forecast';

interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
  timezone?: string;
}

interface GeocodingResponse {
  results?: GeocodingResult[];
}

interface ForecastCurrentResponse {
  time?: unknown;
  temperature_2m?: unknown;
  weather_code?: unknown;
  relative_humidity_2m?: unknown;
  wind_speed_10m?: unknown;
  precipitation?: unknown;
  surface_pressure?: unknown;
}

interface ForecastDailyResponse {
  time?: unknown;
  temperature_2m_min?: unknown;
  temperature_2m_max?: unknown;
  precipitation_probability_max?: unknown;
  weather_code?: unknown;
}

interface ForecastResponse {
  timezone?: unknown;
  current?: unknown;
  daily?: unknown;
}

export class WeatherServiceError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'WeatherServiceError';
    this.status = status;
  }
}

function isGeocodingResult(value: unknown): value is GeocodingResult {
  if (typeof value !== 'object' || value === null) return false;

  const result = value as Record<string, unknown>;
  return (
    typeof result.id === 'number' &&
    typeof result.name === 'string' &&
    typeof result.latitude === 'number' &&
    typeof result.longitude === 'number'
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isFiveStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) && value.length === 5 && value.every((item) => typeof item === 'string')
  );
}

function isFiveNumberArray(value: unknown): value is number[] {
  return Array.isArray(value) && value.length === 5 && value.every(isNumber);
}

function isFiveOptionalProbabilityArray(value: unknown): value is Array<number | null> {
  return (
    Array.isArray(value) &&
    value.length === 5 &&
    value.every((item) => item === null || isNumber(item))
  );
}

export async function searchCities(name: string, signal?: AbortSignal): Promise<City[]> {
  const trimmedName = name.trim();
  if (!trimmedName) return [];

  const url =
    `${GEOCODING_ENDPOINT}?name=${encodeURIComponent(trimmedName)}` +
    '&count=10&language=pt&format=json';
  const timeoutSignal = AbortSignal.timeout(10_000);
  const requestSignal = signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal;
  const response = await fetch(url, { signal: requestSignal });

  if (!response.ok) {
    throw new WeatherServiceError('Falha ao buscar cidades.', response.status);
  }

  const payload = (await response.json()) as GeocodingResponse;
  const results = Array.isArray(payload.results) ? payload.results : [];

  return results.filter(isGeocodingResult).map((result) => ({
    id: result.id,
    name: result.name,
    latitude: result.latitude,
    longitude: result.longitude,
    ...(typeof result.country === 'string' ? { country: result.country } : {}),
    ...(typeof result.admin1 === 'string' ? { admin1: result.admin1 } : {}),
    ...(typeof result.timezone === 'string' ? { timezone: result.timezone } : {}),
  }));
}

export async function getWeather(city: City, signal?: AbortSignal): Promise<WeatherData> {
  const query = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    current:
      'temperature_2m,relative_humidity_2m,precipitation,surface_pressure,wind_speed_10m,weather_code',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    timezone: 'auto',
    forecast_days: '5',
    temperature_unit: 'celsius',
  });
  const timeoutSignal = AbortSignal.timeout(10_000);
  const requestSignal = signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal;
  const response = await fetch(`${FORECAST_ENDPOINT}?${query}`, { signal: requestSignal });

  if (!response.ok) {
    throw new WeatherServiceError('Falha ao buscar a previsão do tempo.', response.status);
  }

  const payload = (await response.json()) as ForecastResponse;
  if (!isRecord(payload.current)) {
    throw new WeatherServiceError('Resposta incompleta: clima atual ausente.');
  }
  if (!isRecord(payload.daily)) {
    throw new WeatherServiceError('Resposta incompleta: previsão diária ausente.');
  }
  if (typeof payload.timezone !== 'string' || !payload.timezone) {
    throw new WeatherServiceError('Resposta incompleta: fuso horário ausente.');
  }

  const currentData = payload.current as ForecastCurrentResponse;
  if (
    typeof currentData.time !== 'string' ||
    !isNumber(currentData.temperature_2m) ||
    !isNumber(currentData.weather_code)
  ) {
    throw new WeatherServiceError('Resposta incompleta: dados atuais inválidos.');
  }

  const dailyData = payload.daily as ForecastDailyResponse;
  const { time, temperature_2m_min, temperature_2m_max, weather_code } = dailyData;
  if (
    !isFiveStringArray(time) ||
    !isFiveNumberArray(temperature_2m_min) ||
    !isFiveNumberArray(temperature_2m_max) ||
    !isFiveNumberArray(weather_code)
  ) {
    throw new WeatherServiceError('Resposta incompleta: arrays da previsão inválidos.');
  }

  const precipitationProbabilities = dailyData.precipitation_probability_max;
  if (
    precipitationProbabilities !== undefined &&
    !isFiveOptionalProbabilityArray(precipitationProbabilities)
  ) {
    throw new WeatherServiceError('Resposta incompleta: probabilidades de precipitação inválidas.');
  }

  const current: CurrentWeather = {
    time: currentData.time,
    temperatureC: currentData.temperature_2m,
    condition: {
      code: currentData.weather_code,
      label: getWeatherLabel(currentData.weather_code),
    },
    ...(isNumber(currentData.relative_humidity_2m)
      ? { humidityPercent: currentData.relative_humidity_2m }
      : {}),
    ...(isNumber(currentData.wind_speed_10m) ? { windSpeedKmh: currentData.wind_speed_10m } : {}),
    ...(isNumber(currentData.precipitation) ? { precipitationMm: currentData.precipitation } : {}),
    ...(isNumber(currentData.surface_pressure)
      ? { pressureHpa: currentData.surface_pressure }
      : {}),
  };

  const forecast: ForecastDay[] = time.map((date, index) => ({
    date,
    temperatureMinC: temperature_2m_min[index],
    temperatureMaxC: temperature_2m_max[index],
    condition: {
      code: weather_code[index],
      label: getWeatherLabel(weather_code[index]),
    },
    ...(isFiveOptionalProbabilityArray(precipitationProbabilities) &&
    precipitationProbabilities[index] !== null
      ? { precipitationProbabilityPercent: precipitationProbabilities[index] }
      : {}),
  }));

  return { city, timezone: payload.timezone, current, forecast };
}
