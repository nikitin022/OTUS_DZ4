import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Skeleton } from '../../../components/ui/Skeleton';
import { ErrorBanner } from '../../../components/ui/ErrorBanner';
import { EmptyState } from '../../../components/ui/EmptyState';
import { useCenters, useRequests } from '../../../api/hooks';
import { getOpenStatus } from '../../../lib/workingHours';
import { formatBloodGroup } from '../../../lib/bloodGroups';
import { buildRouteUrl } from '../../../lib/maps';

const DAY_LABELS = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

/**
 * Карточка центра крови (FR-2.3/2.4): адрес, график, телефон,
 * нужные группы, «Записаться» и «Построить маршрут».
 */
export function CenterPage() {
  const { centerId } = useParams<{ centerId: string }>();

  const centersQuery = useCenters();
  const requestsQuery = useRequests();

  const center = centersQuery.data?.find((c) => c.id === centerId);

  const neededGroups = useMemo(() => {
    const groups = new Set<string>();
    for (const request of requestsQuery.data ?? []) {
      if (request.centerId === centerId && request.status === 'active') {
        groups.add(formatBloodGroup(request.bloodGroup, request.rhFactor));
      }
    }
    return [...groups];
  }, [requestsQuery.data, centerId]);

  if (centersQuery.isPending) {
    return (
      <div>
        <PageHeader title="Центр крови" showBack />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (centersQuery.isError) {
    return (
      <div>
        <PageHeader title="Центр крови" showBack />
        <ErrorBanner
          message="Не удалось загрузить данные центра."
          onRetry={() => void centersQuery.refetch()}
        />
      </div>
    );
  }

  if (!center) {
    return (
      <div>
        <PageHeader title="Центр крови" showBack />
        <EmptyState
          icon="🏥"
          title="Центр не найден"
          description="Возможно, данные устарели. Вернитесь к карте и выберите центр заново."
          action={
            <Link
              to="/map"
              className="inline-flex min-h-11 items-center rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-800"
            >
              На карту
            </Link>
          }
        />
      </div>
    );
  }

  const openStatus = getOpenStatus(center.workingHours);

  return (
    <div>
      <PageHeader title={center.name} showBack />

      <Card>
        <div className="flex flex-wrap items-center gap-2">
          {center.isVerified && <Badge tone="success">Проверенный центр</Badge>}
          <Badge tone={openStatus.isOpen ? 'success' : 'neutral'}>
            {openStatus.label}
          </Badge>
        </div>

        <dl className="mt-4 space-y-3 text-sm">
          <div>
            <dt className="text-ink-600">Адрес</dt>
            <dd className="font-medium text-ink-900">{center.address}</dd>
          </div>
          <div>
            <dt className="text-ink-600">Телефон</dt>
            <dd className="font-medium text-ink-900">
              <a href={`tel:${center.phone.replace(/[^+\d]/g, '')}`} className="text-primary-700 hover:underline">
                {center.phone}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-ink-600">График работы</dt>
            <dd>
              <ul className="mt-1 space-y-0.5">
                {[1, 2, 3, 4, 5, 6, 0].map((day) => {
                  const hours = center.workingHours[day];
                  return (
                    <li key={day} className="flex gap-3">
                      <span className="w-8 text-ink-600">{DAY_LABELS[day]}</span>
                      <span className={hours ? 'font-medium text-ink-900' : 'text-ink-600'}>
                        {hours ? hours.replace('-', '–') : 'выходной'}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </dd>
          </div>
          <div>
            <dt className="text-ink-600">Нужные группы крови</dt>
            <dd className="mt-1">
              {neededGroups.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {neededGroups.map((group) => (
                    <Badge key={group} tone="danger">
                      {group}
                    </Badge>
                  ))}
                </div>
              ) : (
                <span className="text-ink-600">Активных заявок нет</span>
              )}
            </dd>
          </div>
        </dl>

        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            to={`/centers/${center.id}/book`}
            className="inline-flex min-h-11 items-center rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-800"
          >
            Записаться
          </Link>
          <a
            href={buildRouteUrl(center)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center rounded-lg border border-primary-700 px-4 py-2 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-50"
          >
            Построить маршрут
          </a>
        </div>
      </Card>
    </div>
  );
}
