interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = 'Carregando...' }: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center text-white/75 backdrop-blur-md"
    >
      <span
        aria-hidden="true"
        className="mx-auto mb-3 block size-5 animate-spin rounded-full border-2 border-white/20 border-t-accent-400"
      />
      <span>{message}</span>
    </div>
  );
}
