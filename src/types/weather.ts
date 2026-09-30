export type Unit = 'celsius' | 'fahrenheit';

export interface City {
  id: number;
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

export interface WeatherCondition {
  code: number;
  label: string;
}

export interface CurrentWeather {
  time: string;
  temperatureC: number;
  condition: WeatherCondition;
  humidityPercent?: number;
  windSpeedKmh?: number;
  precipitationMm?: number;
  pressureHpa?: number;
}

export interface ForecastDay {
  date: string;
  temperatureMinC: number;
  temperatureMaxC: number;
  condition: WeatherCondition;
}

export interface WeatherData {
  city: City;
  timezone: string;
  current?: CurrentWeather;
  forecast?: ForecastDay[];
}

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error';

export interface SearchState {
  status: AsyncStatus;
  query: string;
  results: City[];
  message?: string;
}

export interface WeatherState {
  status: AsyncStatus;
  data?: WeatherData;
  message?: string;
}
