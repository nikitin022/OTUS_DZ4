import { PageHeader } from '../../../components/ui/PageHeader';
import { EmptyState } from '../../../components/ui/EmptyState';

/**
 * История донаций (FR-6): с пустым состоянием по FR-6.2.
 * Данные подключаются на следующем шаге.
 */
export function HistoryPage() {
  return (
    <div>
      <PageHeader title="История донаций" />
      <EmptyState
        icon="🩸"
        title="У вас пока нет записей"
        description="После первой донации здесь появится история: дата, место, объём и статус."
      />
    </div>
  );
}
