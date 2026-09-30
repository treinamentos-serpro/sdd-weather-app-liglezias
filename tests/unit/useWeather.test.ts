import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import useWeather from '../../src/hooks/useWeather';
import { mockWeatherData } from '../../src/mocks/weather';
import { getWeather, searchCities } from '../../src/services/weatherService';
import type { City } from '../../src/types/weather';

vi.mock('../../src/services/weatherService', () => ({
  getWeather: vi.fn(),
  searchCities: vi.fn(),
}));

const secondCity: City = {
  id: 2,
  name: 'Campinas',
  country: 'Brasil',
  latitude: -22.9,
  longitude: -47.06,
};

describe('useWeather', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts idle with empty data and exposes all actions', () => {
    const { result } = renderHook(() => useWeather());

    expect(result.current).toMatchObject({
      status: 'idle',
      data: undefined,
      cities: [],
      error: undefined,
      query: '',
    });
    expect(result.current.search).toEqual(expect.any(Function));
    expect(result.current.selectCity).toEqual(expect.any(Function));
    expect(result.current.retry).toEqual(expect.any(Function));
  });

  it('searches cities and loads weather for the first result', async () => {
    vi.mocked(searchCities).mockResolvedValue([mockWeatherData.city, secondCity]);
    vi.mocked(getWeather).mockResolvedValue(mockWeatherData);
    const { result } = renderHook(() => useWeather());

    await act(async () => result.current.search('São Paulo'));

    expect(searchCities).toHaveBeenCalledExactlyOnceWith('São Paulo', expect.any(AbortSignal));
    expect(getWeather).toHaveBeenCalledExactlyOnceWith(
      mockWeatherData.city,
      expect.any(AbortSignal),
    );
    expect(result.current.status).toBe('success');
    expect(result.current.cities).toEqual([mockWeatherData.city, secondCity]);
    expect(result.current.data).toEqual(mockWeatherData);
  });

  it('sets empty when the city search returns no results', async () => {
    vi.mocked(searchCities).mockResolvedValue([]);
    const { result } = renderHook(() => useWeather());

    await act(async () => result.current.search('Cidade inexistente'));

    expect(result.current.status).toBe('empty');
    expect(result.current.cities).toEqual([]);
    expect(getWeather).not.toHaveBeenCalled();
  });

  it('loads weather when a city is selected directly', async () => {
    vi.mocked(getWeather).mockResolvedValue(mockWeatherData);
    const { result } = renderHook(() => useWeather());

    await act(async () => result.current.selectCity(secondCity));

    expect(getWeather).toHaveBeenCalledExactlyOnceWith(secondCity, expect.any(AbortSignal));
    expect(result.current.query).toBe('Campinas');
    expect(result.current.cities).toContainEqual(secondCity);
    expect(result.current.status).toBe('success');
    expect(result.current.data).toEqual(mockWeatherData);
  });

  it('retries the last forecast operation for the selected city', async () => {
    vi.mocked(searchCities).mockResolvedValue([mockWeatherData.city]);
    vi.mocked(getWeather)
      .mockRejectedValueOnce(new Error('Falha temporária'))
      .mockResolvedValueOnce(mockWeatherData);
    const { result } = renderHook(() => useWeather());

    await act(async () => result.current.search('São Paulo'));
    expect(result.current.status).toBe('error');

    await act(async () => result.current.retry());

    expect(getWeather).toHaveBeenCalledTimes(2);
    expect(getWeather).toHaveBeenLastCalledWith(mockWeatherData.city, expect.any(AbortSignal));
    expect(result.current.status).toBe('success');
    expect(result.current.data).toEqual(mockWeatherData);
  });

  it('retries the search operation when geocoding failed', async () => {
    vi.mocked(searchCities)
      .mockRejectedValueOnce(new Error('Rede indisponível'))
      .mockResolvedValueOnce([mockWeatherData.city]);
    vi.mocked(getWeather).mockResolvedValue(mockWeatherData);
    const { result } = renderHook(() => useWeather());

    await act(async () => result.current.search('São Paulo'));
    expect(result.current.status).toBe('error');

    await act(async () => result.current.retry());

    expect(searchCities).toHaveBeenCalledTimes(2);
    expect(getWeather).toHaveBeenCalledOnce();
    await waitFor(() => expect(result.current.status).toBe('success'));
  });
});
