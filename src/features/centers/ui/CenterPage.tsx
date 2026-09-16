import { Link, useParams } from 'react-router-dom';
import { PageHeader } from '../../../components/ui/PageHeader';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

/**
 * Карточка центра крови (FR-2.3/2.4). Данные подключаются на следующем шаге.
 */
export function CenterPage() {
  const { centerId } = useParams<{ centerId: string }>();

  return (
    <div>
      <PageHeader title="Центр крови" showBack />

      <EmptyState
        icon="🏥"
        title={`Центр № ${centerId ?? '—'}`}
        description="Здесь появятся данные центра: адрес, график работы, телефон, нужные группы крови."
      />

      <Card className="mt-4">
        <div className="flex flex-wrap gap-2">
          <Link
            to={`/centers/${centerId ?? ''}/book`}
            className="inline-flex min-h-11 items-center rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-800"
          >
            Записаться
          </Link>
          <Button variant="secondary" disabled>
            Построить маршрут
          </Button>
        </div>
      </Card>
    </div>
  );
}
