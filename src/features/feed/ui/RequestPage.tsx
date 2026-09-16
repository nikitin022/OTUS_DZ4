import { Link, useParams } from 'react-router-dom';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Card } from '../../../components/ui/Card';
import { Skeleton } from '../../../components/ui/Skeleton';
import { ErrorBanner } from '../../../components/ui/ErrorBanner';
import { EmptyState } from '../../../components/ui/EmptyState';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { UrgencyBadge } from '../../../components/ui/UrgencyBadge';
import { RequestStatusPill } from '../../../components/ui/StatusPill';
import { useCenters, useRequestResponses, useRequests } from '../../../api/hooks';
import { formatBloodGroup } from '../../../lib/bloodGroups';
import { formatRelativeTime, formatVolume } from '../../../lib/format';

/**
 * Карточка заявки (FR-4.3): цель диплинка из push-уведомления.
 * Показывает группу, объём, срочность, прогресс и счётчик откликов (FR-8.1).
 */
export function RequestPage() {
  const { requestId } = useParams<{ requestId: string }>();

  const requestsQuery = useRequests();
  const centersQuery = useCenters();
  const responsesQuery = useRequestResponses(requestId);

  const request = requestsQuery.data?.find((r) => r.id === requestId);
  const center = centersQuery.data?.find((c) => c.id === request?.centerId);

  if (requestsQuery.isPending) {
    return (
      <div>
        <PageHeader title="Заявка" showBack />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (requestsQuery.isError) {
    return (
      <div>
        <PageHeader title="Заявка" showBack />
        <ErrorBanner
          message="Не удалось загрузить заявку."
          onRetry={() => void requestsQuery.refetch()}
        />
      </div>
    );
  }

  if (!request) {
    return (
      <div>
        <PageHeader title="Заявка" showBack />
        <EmptyState
          icon="💧"
          title="Заявка не найдена"
          description="Возможно, она уже закрыта или ссылка устарела."
          action={
            <Link
              to="/feed"
              className="inline-flex min-h-11 items-center rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-800"
            >
              К ленте заявок
            </Link>
          }
        />
      </div>
    );
  }

  if (request.status === 'closed') {
    return (
      <div>
        <PageHeader title="Заявка" showBack />
        <Card className="mb-4">
          <div className="flex items-center gap-2">
            <p className="text-base font-semibold text-ink-900">
              {formatBloodGroup(request.bloodGroup, request.rhFactor)}
            </p>
            <RequestStatusPill status="closed" />
          </div>
        </Card>
        <EmptyState
          icon="✅"
          title="Заявка закрыта"
          description="Потребность уже закрыта — спасибо всем, кто откликнулся!"
          action={
            <Link
              to="/feed"
              className="inline-flex min-h-11 items-center rounded-lg border border-primary-700 px-4 py-2 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-50"
            >
              Другие заявки
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Заявка" showBack />

      <Card>
        <div className="flex items-start justify-between gap-2">
          <p className="text-lg font-semibold text-ink-900">
            {formatBloodGroup(request.bloodGroup, request.rhFactor)}
          </p>
          <UrgencyBadge urgency={request.urgency} />
        </div>

        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-ink-600">Объём</dt>
            <dd className="font-medium text-ink-900">
              {formatVolume(request.volumeMl)}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-600">Собрано</dt>
            <dd className="font-medium text-ink-900">
              {formatVolume(request.collectedMl)}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-600">Центр</dt>
            <dd className="font-medium">
              {center ? (
                <Link
                  to={`/centers/${center.id}`}
                  className="text-primary-700 hover:underline"
                >
                  {center.name}
                </Link>
              ) : (
                '—'
              )}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-600">Обновлено</dt>
            <dd className="font-medium text-ink-900">
              {formatRelativeTime(request.updatedAt)}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-600">Откликнулись</dt>
            <dd className="font-medium text-ink-900">
              {responsesQuery.data
                ? `${responsesQuery.data.length} чел.`
                : '…'}
            </dd>
          </div>
        </dl>

        <div className="mt-4">
          <ProgressBar
            value={request.collectedMl}
            max={request.volumeMl}
            label="Прогресс сбора крови"
          />
        </div>

        <Link
          to={`/centers/${request.centerId}/book`}
          className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-800"
        >
          Записаться на донацию
        </Link>
      </Card>
    </div>
  );
}
