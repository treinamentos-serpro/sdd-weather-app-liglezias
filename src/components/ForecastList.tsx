import type { ForecastDay, Unit } from '../types/weather';
import ForecastCard from './ForecastCard';

interface ForecastListProps {
  forecast: ForecastDay[];
  unit: Unit;
}

export default function ForecastList({ forecast, unit }: ForecastListProps) {
  if (forecast.length !== 5) return null;

  return (
    <section aria-labelledby="forecast-heading" className="w-full">
      <h2 id="forecast-heading" className="mb-4 text-lg font-semibold text-white">
        Próximos dias
      </h2>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {forecast.map((forecastDay, index) => (
          <ForecastCard
            key={forecastDay.date}
            forecastDay={forecastDay}
            dayIndex={index}
            unit={unit}
          />
        ))}
      </ul>
    </section>
  );
}
