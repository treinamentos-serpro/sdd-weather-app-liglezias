import { type FormEvent, useState } from 'react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  disabled?: boolean;
}

export default function SearchBar({ onSearch, disabled = false }: SearchBarProps) {
  const [city, setCity] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedCity = city.trim();
    if (!trimmedCity) return;

    onSearch(trimmedCity);
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="flex w-full items-end gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 shadow-glass backdrop-blur-md"
    >
      <div className="min-w-0 flex-1">
        <label htmlFor="city-search" className="sr-only">
          Buscar cidade
        </label>
        <input
          id="city-search"
          type="search"
          value={city}
          onChange={(event) => setCity(event.currentTarget.value)}
          placeholder="Digite uma cidade"
          disabled={disabled}
          className="w-full rounded-xl border border-white/10 bg-night-800/80 px-4 py-3 text-white placeholder:text-white/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
      <button
        type="submit"
        disabled={disabled}
        className="shrink-0 rounded-xl bg-accent-500 px-5 py-3 font-medium text-white transition-colors hover:bg-accent-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Buscar
      </button>
    </form>
  );
}
