import { useEffect, useRef, useState } from 'react';
import { getWeather, searchCities } from '../services/weatherService';
import type { AsyncStatus, City, WeatherData } from '../types/weather';

type LastOperation = { type: 'search'; name: string } | { type: 'weather'; city: City };

export interface UseWeatherResult {
  status: AsyncStatus;
  data: WeatherData | undefined;
  cities: City[];
  error: string | undefined;
  query: string;
  search: (name: string) => Promise<void>;
  selectCity: (city: City) => Promise<void>;
  retry: () => Promise<void>;
}

export default function useWeather(): UseWeatherResult {
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [data, setData] = useState<WeatherData>();
  const [cities, setCities] = useState<City[]>([]);
  const [error, setError] = useState<string>();
  const [query, setQuery] = useState('');
  const controllerRef = useRef<AbortController | null>(null);
  const lastOperationRef = useRef<LastOperation | null>(null);

  useEffect(
    () => () => {
      controllerRef.current?.abort();
    },
    [],
  );

  function beginOperation(): AbortController {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    return controller;
  }

  function isCurrentOperation(controller: AbortController): boolean {
    return controllerRef.current === controller && !controller.signal.aborted;
  }

  async function loadWeather(city: City, controller: AbortController): Promise<void> {
    lastOperationRef.current = { type: 'weather', city };
    setStatus('loading');
    setData(undefined);
    setError(undefined);

    try {
      const weather = await getWeather(city, controller.signal);
      if (!isCurrentOperation(controller)) return;

      setData(weather);
      setStatus('success');
    } catch (caughtError) {
      if (!isCurrentOperation(controller)) return;

      setError(caughtError instanceof Error ? caughtError.message : 'Falha ao carregar o clima.');
      setStatus('error');
    }
  }

  async function search(name: string): Promise<void> {
    const trimmedName = name.trim();
    setQuery(trimmedName);
    setData(undefined);
    setCities([]);
    setError(undefined);
    setStatus('loading');
    lastOperationRef.current = { type: 'search', name: trimmedName };
    const controller = beginOperation();

    try {
      const results = await searchCities(trimmedName, controller.signal);
      if (!isCurrentOperation(controller)) return;

      setCities(results);
      if (results.length === 0) {
        setStatus('empty');
        return;
      }

      await loadWeather(results[0], controller);
    } catch (caughtError) {
      if (!isCurrentOperation(controller)) return;

      setError(caughtError instanceof Error ? caughtError.message : 'Falha ao buscar cidades.');
      setStatus('error');
    }
  }

  async function selectCity(city: City): Promise<void> {
    setQuery(city.name);
    setCities((currentCities) =>
      currentCities.some((currentCity) => currentCity.id === city.id)
        ? currentCities
        : [city, ...currentCities],
    );
    const controller = beginOperation();
    await loadWeather(city, controller);
  }

  async function retry(): Promise<void> {
    const lastOperation = lastOperationRef.current;
    if (!lastOperation) return;

    if (lastOperation.type === 'search') {
      await search(lastOperation.name);
      return;
    }

    const controller = beginOperation();
    await loadWeather(lastOperation.city, controller);
  }

  return { status, data, cities, error, query, search, selectCity, retry };
}
