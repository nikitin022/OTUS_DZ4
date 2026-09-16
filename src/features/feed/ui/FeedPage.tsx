import { PageHeader } from '../../../components/ui/PageHeader';
import { Skeleton } from '../../../components/ui/Skeleton';

/**
 * Экран живой ленты потребностей (FR-3).
 * Фильтры (FR-3.2), автообновление (FR-3.3) и пагинация (FR-3.4)
 * подключаются вместе с данными на следующем шаге.
 */
export function FeedPage() {
  return (
    <div>
      <PageHeader title="Лента потребностей" />

      <div
        aria-busy="true"
        aria-label="Загрузка заявок"
        className="space-y-3"
      >
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="h-24 w-full" />
        ))}
      </div>
    </div>
  );
}
