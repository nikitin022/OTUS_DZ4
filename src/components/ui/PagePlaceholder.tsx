interface PagePlaceholderProps {
  title: string;
  description: string;
}

/**
 * Временный экран-заглушка для каркаса маршрутов.
 * Заменяется реальной реализацией по мере разработки функций.
 */
export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <section
      aria-labelledby="page-title"
      className="rounded-card border border-slate-200 bg-surface p-6 text-center"
    >
      <h1 id="page-title" className="text-xl font-semibold text-ink-900">
        {title}
      </h1>
      <p className="mt-2 text-sm text-ink-600">{description}</p>
      <span className="mt-4 inline-block rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
        Экран в разработке
      </span>
    </section>
  );
}
