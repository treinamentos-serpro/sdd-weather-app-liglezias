interface EmptyStateProps {
  title: string;
  hint: string;
}

export default function EmptyState({ title, hint }: EmptyStateProps) {
  return (
    <section
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-labelledby="empty-state-heading"
      className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-white backdrop-blur-md"
    >
      <h2 id="empty-state-heading" className="text-lg font-semibold">
        {title}
      </h2>
      <p className="mt-2 text-sm text-white/65">{hint}</p>
    </section>
  );
}
