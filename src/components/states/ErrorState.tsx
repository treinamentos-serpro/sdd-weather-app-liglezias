interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <section
      role="alert"
      className="rounded-2xl border border-red-300/20 bg-red-400/10 p-5 text-white backdrop-blur-md"
    >
      <p>{message}</p>
      <button
        type="button"
        onClick={() => onRetry()}
        className="mt-4 rounded-xl border border-white/15 bg-white/10 px-4 py-2 font-medium text-white transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400"
      >
        Tentar novamente
      </button>
    </section>
  );
}
