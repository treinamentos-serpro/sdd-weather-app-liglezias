import { useState } from 'react';
import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import SearchBar from './components/SearchBar';
import EmptyState from './components/states/EmptyState';
import ErrorState from './components/states/ErrorState';
import LoadingState from './components/states/LoadingState';
import UnitToggle from './components/UnitToggle';
import useWeather from './hooks/useWeather';
import type { Unit } from './types/weather';

export default function App() {
  const [unit, setUnit] = useState<Unit>('celsius');
  const { status, data, error, search, retry } = useWeather();

  return (
    <div className="min-h-screen bg-night-900 text-white">
      <header className="border-b border-white/10 bg-night-800/80 px-4 py-4 backdrop-blur-md sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center">
          <h1 className="shrink-0 text-lg font-semibold tracking-tight">
            <a
              href="#weather-content"
              className="flex items-center gap-2 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-400"
            >
              <span aria-hidden="true" className="text-2xl text-sun">
                ☀
              </span>
              <span>Clima do Luciozo</span>
            </a>
          </h1>

          <div className="min-w-0 flex-1">
            <SearchBar onSearch={(city) => void search(city)} disabled={status === 'loading'} />
          </div>

          <UnitToggle unit={unit} onChange={setUnit} />
        </div>
      </header>

      <main id="weather-content" className="px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
          {status === 'idle' && (
            <EmptyState
              title="Consulte o clima da sua cidade"
              hint="Busque uma cidade para consultar o clima atual e a previsão."
            />
          )}

          {status === 'loading' && <LoadingState message="Buscando clima..." />}

          {status === 'empty' && (
            <EmptyState
              title="Nenhuma cidade encontrada"
              hint="Tente outro nome ou confira a grafia da cidade."
            />
          )}

          {status === 'error' && (
            <ErrorState
              message={error ?? 'Ocorreu um erro inesperado.'}
              onRetry={() => void retry()}
            />
          )}

          {status === 'success' && data && (
            <>
              {data.current ? (
                <CurrentWeather city={data.city} current={data.current} unit={unit} />
              ) : (
                <p role="status" className="text-sm text-white/70">
                  Clima atual indisponível.
                </p>
              )}
              {data.forecast ? (
                <ForecastList forecast={data.forecast} unit={unit} />
              ) : (
                <p role="status" className="text-sm text-white/70">
                  Previsão indisponível.
                </p>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
