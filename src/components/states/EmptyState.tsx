interface EmptyStateProps {
  title: string;
  hint: string;
}

export default function EmptyState({ title, hint }: EmptyStateProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-white backdrop-blur-md">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-white/65">{hint}</p>
    </section>
  );
}
