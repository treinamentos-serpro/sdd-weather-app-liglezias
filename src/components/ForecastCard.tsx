import { getDayLabel, getShortDate } from '../lib/format';
import { formatTemperature } from '../lib/temperature';
import { getWeatherIcon } from '../lib/weatherCodes';
import type { ForecastDay, Unit } from '../types/weather';

interface ForecastCardProps {
  forecastDay: ForecastDay;
  dayIndex: number;
  unit: Unit;
}

export default function ForecastCard({ forecastDay, dayIndex, unit }: ForecastCardProps) {
  const precipitationProbability =
    forecastDay.precipitationProbabilityPercent === undefined
      ? '—'
      : `${forecastDay.precipitationProbabilityPercent}%`;

  return (
    <li>
      <article className="h-full rounded-2xl border border-white/10 bg-white/5 p-4 text-white shadow-glass backdrop-blur-md">
        <header className="text-center">
          <h3 className="font-medium">{getDayLabel(forecastDay.date, dayIndex)}</h3>
          <time dateTime={forecastDay.date} className="mt-1 block text-sm text-white/55">
            {getShortDate(forecastDay.date)}
          </time>
        </header>

        <div className="my-4 text-center">
          <span aria-label={forecastDay.condition.label} role="img" className="text-4xl">
            {getWeatherIcon(forecastDay.condition.code)}
          </span>
          <p className="mt-2 min-h-10 text-sm text-white/70">{forecastDay.condition.label}</p>
        </div>

        <dl className="flex items-center justify-center gap-3 text-sm">
          <div className="flex items-center gap-1">
            <dt className="sr-only">Temperatura máxima</dt>
            <dd className="font-semibold text-white">
              {formatTemperature(forecastDay.temperatureMaxC, unit)}
            </dd>
          </div>
          <div className="flex items-center gap-1">
            <dt className="sr-only">Temperatura mínima</dt>
            <dd className="text-white/55">
              {formatTemperature(forecastDay.temperatureMinC, unit)}
            </dd>
          </div>
        </dl>

        <p className="mt-4 border-t border-white/10 pt-3 text-center text-xs text-white/60">
          Chuva: <span className="font-medium text-white">{precipitationProbability}</span>
        </p>
      </article>
    </li>
  );
}
