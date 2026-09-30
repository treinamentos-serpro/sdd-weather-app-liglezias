import type { Unit } from '../types/weather';

interface UnitToggleProps {
  unit: Unit;
  onChange: (unit: Unit) => void;
}

export default function UnitToggle({ unit, onChange }: UnitToggleProps) {
  return (
    <div
      role="group"
      aria-label="Unidade de temperatura"
      className="inline-flex rounded-full border border-white/10 bg-white/5 p-1 shadow-glass backdrop-blur-md"
    >
      <button
        type="button"
        aria-pressed={unit === 'celsius'}
        onClick={() => onChange('celsius')}
        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400 ${
          unit === 'celsius'
            ? 'bg-accent-500 text-white'
            : 'text-white/70 hover:bg-white/10 hover:text-white'
        }`}
      >
        °C
      </button>
      <button
        type="button"
        aria-pressed={unit === 'fahrenheit'}
        onClick={() => onChange('fahrenheit')}
        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400 ${
          unit === 'fahrenheit'
            ? 'bg-accent-500 text-white'
            : 'text-white/70 hover:bg-white/10 hover:text-white'
        }`}
      >
        °F
      </button>
    </div>
  );
}
