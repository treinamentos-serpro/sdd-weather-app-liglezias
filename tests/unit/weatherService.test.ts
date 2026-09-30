import { afterEach, describe, expect, it, vi } from 'vitest';
import { getWeather, searchCities, WeatherServiceError } from '../../src/services/weatherService';
import type { City } from '../../src/types/weather';

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

const city: City = {
  id: 3448439,
  name: 'São Paulo',
  country: 'Brasil',
  latitude: -23.55,
  longitude: -46.63,
  timezone: 'America/Sao_Paulo',
};

function createForecastPayload(current: unknown, daily: unknown): Record<string, unknown> {
  return { timezone: 'America/Sao_Paulo', current, daily };
}

describe('searchCities', () => {
  it('returns an empty list without calling the network for blank input', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(searchCities('   ')).resolves.toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('encodes the city name and maps Open-Meteo results to City', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [
          {
            id: 3448439,
            name: 'São Paulo',
            latitude: -23.55,
            longitude: -46.63,
            country: 'Brasil',
            admin1: 'São Paulo',
            timezone: 'America/Sao_Paulo',
          },
        ],
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const cities = await searchCities(' São Paulo & região ');

    expect(fetchMock).toHaveBeenCalledExactlyOnceWith(
      'https://geocoding-api.open-meteo.com/v1/search?name=S%C3%A3o%20Paulo%20%26%20regi%C3%A3o&count=10&language=pt&format=json',
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
    expect(cities).toEqual([
      {
        id: 3448439,
        name: 'São Paulo',
        latitude: -23.55,
        longitude: -46.63,
        country: 'Brasil',
        admin1: 'São Paulo',
        timezone: 'America/Sao_Paulo',
      },
    ]);
  });

  it('omits optional location fields when Open-Meteo does not return them', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          results: [{ id: 1, name: 'Cidade', latitude: 1, longitude: 2 }],
        }),
      }),
    );

    const cities = await searchCities('Cidade');

    expect(cities[0]).toEqual({ id: 1, name: 'Cidade', latitude: 1, longitude: 2 });
  });

  it('throws WeatherServiceError when the response is not ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 503 }));

    await expect(searchCities('São Paulo')).rejects.toMatchObject({
      name: 'WeatherServiceError',
      status: 503,
    });
    await expect(searchCities('São Paulo')).rejects.toBeInstanceOf(WeatherServiceError);
  });

  it('returns an empty list when the response has no results field', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) }));

    await expect(searchCities('Cidade')).resolves.toEqual([]);
  });

  it('combines an optional caller signal with the 10-second timeout', async () => {
    const controller = new AbortController();
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ results: [] }) });
    vi.stubGlobal('fetch', fetchMock);

    await searchCities('Cidade', controller.signal);

    const requestOptions = fetchMock.mock.calls[0]?.[1] as RequestInit;
    expect(requestOptions.signal).toBeInstanceOf(AbortSignal);
    expect(requestOptions.signal).not.toBe(controller.signal);

    controller.abort();
    expect(requestOptions.signal?.aborted).toBe(true);
  });

  it('converts AbortError to the timeout message and clears the timer', async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      'fetch',
      vi.fn(
        (_input: RequestInfo | URL, init?: RequestInit) =>
          new Promise<Response>((_resolve, reject) => {
            init?.signal?.addEventListener(
              'abort',
              () => reject(new DOMException('Aborted', 'AbortError')),
              { once: true },
            );
          }),
      ),
    );

    const request = searchCities('Cidade');
    const timeoutExpectation = expect(request).rejects.toMatchObject({
      name: 'WeatherServiceError',
      message: 'A requisição demorou demais.',
    });
    await vi.advanceTimersByTimeAsync(10_000);
    await timeoutExpectation;
    expect(vi.getTimerCount()).toBe(0);
  });

  it('converts network failures to WeatherServiceError', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('connection lost')));

    await expect(searchCities('Cidade')).rejects.toMatchObject({
      name: 'WeatherServiceError',
      message: 'Falha de rede.',
    });
  });

  it('clears the timeout after a successful fetch', async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ results: [] }) }),
    );

    await expect(searchCities('Cidade')).resolves.toEqual([]);
    expect(vi.getTimerCount()).toBe(0);
  });
});

describe('getWeather', () => {
  it('requests current and daily data and maps parallel arrays to five forecast days', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () =>
        createForecastPayload(
          {
            time: '2026-09-30T10:00',
            temperature_2m: 22,
            relative_humidity_2m: 68,
            wind_speed_10m: 12.5,
            precipitation: 0.2,
            surface_pressure: 1013,
            weather_code: 2,
          },
          {
            time: ['2026-09-30', '2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04'],
            temperature_2m_min: [16, 17, 18, 17, 16],
            temperature_2m_max: [25, 26, 27, 24, 23],
            precipitation_probability_max: [15, 25, 70, 10, 45],
            weather_code: [2, 3, 61, 1, 80],
          },
        ),
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await getWeather(city);

    const requestUrl = new URL(String(fetchMock.mock.calls[0]?.[0]));
    expect(requestUrl.origin + requestUrl.pathname).toBe('https://api.open-meteo.com/v1/forecast');
    expect(requestUrl.searchParams.get('latitude')).toBe(String(city.latitude));
    expect(requestUrl.searchParams.get('longitude')).toBe(String(city.longitude));
    expect(requestUrl.searchParams.get('timezone')).toBe('auto');
    expect(requestUrl.searchParams.get('forecast_days')).toBe('5');
    expect(requestUrl.searchParams.get('temperature_unit')).toBe('celsius');
    expect(requestUrl.searchParams.get('current')).toContain('temperature_2m');
    expect(requestUrl.searchParams.get('daily')).toContain('temperature_2m_min');

    expect(result.city).toEqual(city);
    expect(result.current).toMatchObject({
      time: '2026-09-30T10:00',
      temperatureC: 22,
      humidityPercent: 68,
      windSpeedKmh: 12.5,
      precipitationMm: 0.2,
      pressureHpa: 1013,
      condition: { code: 2, label: 'Parcialmente nublado' },
    });
    expect(result.forecast).toHaveLength(5);
    expect(result.forecast?.[2]).toEqual({
      date: '2026-10-02',
      temperatureMinC: 18,
      temperatureMaxC: 27,
      precipitationProbabilityPercent: 70,
      condition: { code: 61, label: 'Chuva fraca' },
    });
  });

  it.each([
    'current',
    'daily',
  ] as const)('throws WeatherServiceError when %s is absent', async (missingSection) => {
    const payload = createForecastPayload(
      { time: '2026-09-30T10:00', temperature_2m: 22, weather_code: 2 },
      {
        time: ['2026-09-30', '2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04'],
        temperature_2m_min: [16, 17, 18, 17, 16],
        temperature_2m_max: [25, 26, 27, 24, 23],
        weather_code: [2, 3, 61, 1, 80],
      },
    );
    payload[missingSection] = undefined;
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => payload }));

    await expect(getWeather(city)).rejects.toBeInstanceOf(WeatherServiceError);
  });

  it('throws WeatherServiceError when the forecast response is not ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 502 }));

    await expect(getWeather(city)).rejects.toMatchObject({
      name: 'WeatherServiceError',
      status: 502,
    });
  });
});
