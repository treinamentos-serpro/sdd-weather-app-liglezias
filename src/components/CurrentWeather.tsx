import { formatTemperature } from '../lib/temperature';
import { getWeatherIcon } from '../lib/weatherCodes';
import type { City, CurrentWeather as CurrentWeatherData, Unit } from '../types/weather';

interface CurrentWeatherProps {
  city: City;
  current: CurrentWeatherData;
  unit: Unit;
}

function formatMetric(value: number | undefined, unit: string): string {
  if (value === undefined) return '—';

  return `${value.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} ${unit}`;
}

export default function CurrentWeather({ city, current, unit }: CurrentWeatherProps) {
  const location = [city.admin1, city.country].filter(Boolean).join(', ');

  const metrics = [
    { label: 'Umidade', value: formatMetric(current.humidityPercent, '%') },
    { label: 'Vento', value: formatMetric(current.windSpeedKmh, 'km/h') },
    { label: 'Precipitação', value: formatMetric(current.precipitationMm, 'mm') },
    { label: 'Pressão', value: formatMetric(current.pressureHpa, 'hPa') },
  ];

  return (
    <section
      aria-labelledby="current-weather-heading"
      className="w-full rounded-3xl border border-white/10 bg-white/5 p-5 text-white shadow-glass backdrop-blur-md sm:p-8"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="current-weather-heading" className="text-lg font-medium text-white/80">
            {city.name}
          </h2>
          {location && <p className="mt-1 text-sm text-white/55">{location}</p>}
          <p className="mt-5 text-6xl font-semibold leading-none tracking-tight sm:text-7xl">
            {formatTemperature(current.temperatureC, unit)}
          </p>
          <p className="mt-3 text-base text-white/75">{current.condition.label}</p>
        </div>

        <span aria-hidden="true" className="self-start text-6xl sm:self-center sm:text-7xl">
          {getWeatherIcon(current.condition.code)}
        </span>
      </div>

      <dl className="mt-7 grid grid-cols-2 gap-x-4 gap-y-5 border-t border-white/10 pt-5 sm:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label}>
            <dt className="text-sm text-white/55">{metric.label}</dt>
            <dd className="mt-1 text-base font-medium text-white">{metric.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
