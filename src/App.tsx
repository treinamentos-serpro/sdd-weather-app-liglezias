import { useState } from 'react';
import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import SearchBar from './components/SearchBar';
import EmptyState from './components/states/EmptyState';
import ErrorState from './components/states/ErrorState';
import LoadingState from './components/states/LoadingState';
import UnitToggle from './components/UnitToggle';
import { mockWeatherData } from './mocks/weather';
import type { Unit, WeatherState } from './types/weather';

function normalizeCityName(name: string): string {
  return name
    .trim()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('pt-BR');
}

export default function App() {
  const [unit, setUnit] = useState<Unit>('celsius');
  const [query, setQuery] = useState('');
  const [weatherState, setWeatherState] = useState<WeatherState>({ status: 'idle' });

  async function handleSearch(city: string) {
    setQuery(city);
    setWeatherState({ status: 'loading' });

    try {
      await new Promise<void>((resolve) => window.setTimeout(resolve, 180));

      const matchesMock = normalizeCityName(city) === normalizeCityName(mockWeatherData.city.name);
      if (!matchesMock) {
        setWeatherState({ status: 'empty', message: 'Nenhuma cidade encontrada.' });
        return;
      }

      if (!mockWeatherData.current && !mockWeatherData.forecast?.length) {
        throw new Error('O mock não contém dados meteorológicos utilizáveis.');
      }

      setWeatherState({ status: 'success', data: mockWeatherData });
    } catch {
      setWeatherState({
        status: 'error',
        message: 'Não foi possível carregar os dados de demonstração.',
      });
    }
  }

  const weather = weatherState.data;

  return (
    <div className="min-h-screen bg-night-900 text-white">
      <header className="border-b border-white/10 bg-night-800/80 px-4 py-4 backdrop-blur-md sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center">
          <a
            href="#weather-content"
            className="flex shrink-0 items-center gap-2 rounded-lg text-lg font-semibold tracking-tight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-400"
            aria-label="Clima Agora — ir para o conteúdo"
          >
            <span aria-hidden="true" className="text-2xl text-sun">
              ☀
            </span>
            <span>Clima Agora</span>
          </a>

          <div className="min-w-0 flex-1">
            <SearchBar onSearch={handleSearch} disabled={weatherState.status === 'loading'} />
          </div>

          <UnitToggle unit={unit} onChange={setUnit} />
        </div>
      </header>

      <main id="weather-content" className="px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
          {weatherState.status === 'idle' && (
            <EmptyState
              title="Consulte o clima da sua cidade"
              hint="Busque São Paulo para visualizar os dados de demonstração."
            />
          )}

          {weatherState.status === 'loading' && <LoadingState message="Buscando clima..." />}

          {weatherState.status === 'empty' && (
            <EmptyState
              title="Nenhuma cidade encontrada"
              hint="Tente buscar São Paulo para abrir os dados de demonstração."
            />
          )}

          {weatherState.status === 'error' && (
            <ErrorState
              message={weatherState.message ?? 'Ocorreu um erro inesperado.'}
              onRetry={() => {
                void handleSearch(query);
              }}
            />
          )}

          {weatherState.status === 'success' && weather && (
            <>
              {weather.current ? (
                <CurrentWeather city={weather.city} current={weather.current} unit={unit} />
              ) : (
                <p role="status" className="text-sm text-white/70">
                  Clima atual indisponível.
                </p>
              )}
              {weather.forecast ? (
                <ForecastList forecast={weather.forecast} unit={unit} />
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
