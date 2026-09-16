import { useParams } from 'react-router-dom';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Card } from '../../../components/ui/Card';
import { ProgressBar } from '../../../components/ui/ProgressBar';

const detailRows = [
  { label: 'Группа крови', value: '—' },
  { label: 'Объём', value: '—' },
  { label: 'Срочность', value: '—' },
  { label: 'Центр', value: '—' },
  { label: 'Обновлено', value: '—' },
] as const;

/**
 * Карточка заявки (FR-4.3): цель диплинка из push-уведомления.
 * Данные подключаются на следующем шаге.
 */
export function RequestPage() {
  const { requestId } = useParams<{ requestId: string }>();

  return (
    <div>
      <PageHeader title="Заявка" showBack />

      <Card>
        <dl className="space-y-2">
          {detailRows.map((row) => (
            <div key={row.label} className="flex justify-between gap-4 text-sm">
              <dt className="text-ink-600">{row.label}</dt>
              <dd className="font-medium text-ink-900">{row.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-4">
          <ProgressBar value={0} max={100} label="Прогресс сбора крови" />
          <p className="mt-1 text-xs text-ink-600">
            Прогресс сбора появится после подключения данных
          </p>
        </div>
      </Card>

      <p className="mt-3 text-xs text-ink-600">Заявка № {requestId ?? '—'}</p>
    </div>
  );
}
