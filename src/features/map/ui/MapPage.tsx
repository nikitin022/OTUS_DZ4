import { PageHeader } from '../../../components/ui/PageHeader';
import { EmptyState } from '../../../components/ui/EmptyState';

/** Экран карты центров крови (FR-2). Данные подключаются на следующем шаге. */
export function MapPage() {
  return (
    <div>
      <PageHeader title="Карта центров" />
      <EmptyState
        icon="🗺️"
        title="Карта загрузится после подключения данных"
        description="Здесь появятся центры крови в вашем радиусе: маркеры, статус «открыто/закрыто», расстояние и поиск."
      />
    </div>
  );
}
