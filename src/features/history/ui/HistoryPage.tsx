import { Link } from 'react-router-dom';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Skeleton } from '../../../components/ui/Skeleton';
import { ErrorBanner } from '../../../components/ui/ErrorBanner';
import { EmptyState } from '../../../components/ui/EmptyState';
import { AppointmentStatusPill } from '../../../components/ui/StatusPill';
import { useDonationHistory } from '../../../api/hooks';
import { useDonorProfile } from '../../profile/model/profileContext';
import { isDonationIntervalMet } from '../../../lib/validation';
import { formatDate, formatVolume } from '../../../lib/format';
import type { DonationHistoryEntry } from '../../../types';

/**
 * История донаций (FR-6): дата, место, объём, тип, статус
 * и индикатор «Интервал соблюдён» (FR-6.1, FR-6.2).
 */
export function HistoryPage() {
  const { donor } = useDonorProfile();
  const historyQuery = useDonationHistory(donor?.id);

  if (!donor) {
    return (
      <div>
        <PageHeader title="История донаций" />
        <EmptyState
          icon="📋"
          title="Профиль не заполнен"
          description="Чтобы видеть историю донаций, заполните профиль донора."
          action={
            <Link
              to="/profile"
              className="inline-flex min-h-11 items-center rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-800"
            >
              Заполнить профиль
            </Link>
          }
        />
      </div>
    );
  }

  if (historyQuery.isPending) {
    return (
      <div>
        <PageHeader title="История донаций" />
        <div aria-busy="true" className="space-y-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (historyQuery.isError) {
    return (
      <div>
        <PageHeader title="История донаций" />
        <ErrorBanner
          message="Не удалось загрузить историю."
          onRetry={() => void historyQuery.refetch()}
        />
      </div>
    );
  }

  const entries = historyQuery.data ?? [];

  if (entries.length === 0) {
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

  /** Индикатор интервала: сравниваем запись с предыдущей (более ранней) */
  function intervalBadge(entry: DonationHistoryEntry, nextOlder: DonationHistoryEntry | undefined) {
    const met = isDonationIntervalMet(nextOlder?.date ?? null, new Date(entry.date));
    return met ? (
      <Badge tone="success">Интервал соблюдён</Badge>
    ) : (
      <Badge tone="danger">Интервал не соблюдён</Badge>
    );
  }

  return (
    <div>
      <PageHeader title="История донаций" />

      <ul className="space-y-3" aria-label="История донаций">
        {entries.map((entry, index) => (
          <li key={entry.id}>
            <Card>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-base font-semibold text-ink-900">{formatDate(entry.date)}</p>
                  <p className="text-sm text-ink-600">{entry.centerName}</p>
                </div>
                <AppointmentStatusPill
                  status={
                    entry.status === 'завершена'
                      ? 'confirmed'
                      : entry.status === 'отменена'
                        ? 'cancelled'
                        : 'missed'
                  }
                />
              </div>

              <dl className="mt-3 space-y-1 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-600">Тип донации</dt>
                  <dd className="font-medium text-ink-900">{entry.type}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-600">Объём</dt>
                  <dd className="font-medium text-ink-900">{formatVolume(entry.volumeMl)}</dd>
                </div>
              </dl>

              <div className="mt-3">{intervalBadge(entry, entries[index + 1])}</div>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
