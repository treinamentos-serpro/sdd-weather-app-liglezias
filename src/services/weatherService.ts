import type { City } from '../types/weather';

const GEOCODING_ENDPOINT = 'https://geocoding-api.open-meteo.com/v1/search';

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
