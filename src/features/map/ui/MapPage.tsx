import { useMemo, useState } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Badge } from '../../../components/ui/Badge';
import { Skeleton } from '../../../components/ui/Skeleton';
import { ErrorBanner } from '../../../components/ui/ErrorBanner';
import { EmptyState } from '../../../components/ui/EmptyState';
import { useCenters, useRequests } from '../../../api/hooks';
import { useDonorProfile } from '../../profile/model/DonorProfileContext';
import { useUserCoords } from '../../geo/model/useUserCoords';
import { getOpenStatus } from '../../../lib/workingHours';
import {
  DEFAULT_CITY_CENTER,
  distanceKm,
  isWithinRadius,
} from '../../../lib/geo';
import { formatDistance } from '../../../lib/format';
import { buildRouteUrl } from '../../../lib/maps';
import { MapFiltersBar, type MapFilters } from './MapFiltersBar';

const DEFAULT_ZOOM = 11;
/** Радиус поиска для гостя, пока профиль не заполнен */
const GUEST_RADIUS_KM = 100;

function createMarkerIcon(isOpen: boolean): L.DivIcon {
  const color = isOpen ? '#0f766e' : '#94a3b8';
  return L.divIcon({
    className: '',
    html: `<span aria-hidden="true" style="display:block;width:18px;height:18px;border-radius:50%;background:${color};border:2px solid #ffffff;box-shadow:0 1px 3px rgba(0,0,0,0.4)"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

/**
 * Карта центров крови (FR-2): маркеры со статусом «открыто/закрыто»,
 * фильтры, расстояние и переход к карточке центра.
 */
export function MapPage() {
  const { donor } = useDonorProfile();
  const centersQuery = useCenters();
  const requestsQuery = useRequests();

  const [filters, setFilters] = useState<MapFilters>({
    onlyOpen: false,
    onlyUrgent: false,
    bloodGroup: '',
  });
  // Геолокация — по запросу браузера; при отказе показываем весь город (матрица ошибок ТЗ)
  const { coords: userCoords, notice: geoNotice } = useUserCoords();

  const activeRequests = useMemo(
    () => (requestsQuery.data ?? []).filter((r) => r.status === 'active'),
    [requestsQuery.data],
  );

  const filteredCenters = useMemo(() => {
    const centers = centersQuery.data ?? [];
    return centers.filter((center) => {
      if (filters.onlyOpen && !getOpenStatus(center.workingHours).isOpen) {
        return false;
      }
      if (
        filters.onlyUrgent &&
        !activeRequests.some(
          (r) => r.centerId === center.id && r.urgency !== 'обычная',
        )
      ) {
        return false;
      }
      if (
        filters.bloodGroup &&
        !activeRequests.some(
          (r) => r.centerId === center.id && r.bloodGroup === filters.bloodGroup,
        )
      ) {
        return false;
      }
      if (userCoords) {
        const radiusKm = donor?.searchRadiusKm ?? GUEST_RADIUS_KM;
        if (!isWithinRadius(center.coordinates, userCoords, radiusKm)) {
          return false;
        }
      }
      return true;
    });
  }, [
    centersQuery.data,
    activeRequests,
    filters,
    userCoords,
    donor?.searchRadiusKm,
  ]);

  return (
    <div>
      <PageHeader title="Карта центров" />

      <MapFiltersBar filters={filters} onChange={setFilters} />

      {geoNotice && (
        <div className="mb-4">
          <ErrorBanner message={geoNotice} />
        </div>
      )}

      {centersQuery.isPending ? (
        <Skeleton className="h-80 w-full" />
      ) : centersQuery.isError ? (
        <ErrorBanner
          message="Не удалось загрузить центры. Проверьте соединение."
          onRetry={() => void centersQuery.refetch()}
        />
      ) : filteredCenters.length === 0 ? (
        <EmptyState
          icon="🏥"
          title="Центров не найдено"
          description="В выбранном радиусе нет подходящих центров. Измените радиус в профиле или сбросьте фильтры."
          action={
            <Link
              to="/profile"
              className="inline-flex min-h-11 items-center rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-800"
            >
              Изменить радиус
            </Link>
          }
        />
      ) : (
        <div className="h-80 overflow-hidden rounded-card border border-slate-200">
          <MapContainer
            center={userCoords ?? DEFAULT_CITY_CENTER}
            zoom={DEFAULT_ZOOM}
            scrollWheelZoom
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredCenters.map((center) => {
              const openStatus = getOpenStatus(center.workingHours);
              return (
                <Marker
                  key={center.id}
                  position={center.coordinates}
                  icon={createMarkerIcon(openStatus.isOpen)}
                >
                  <Popup>
                    <div className="min-w-44">
                      <p className="text-sm font-semibold text-ink-900">
                        {center.name}
                      </p>
                      <p className="mt-0.5 text-xs text-ink-600">
                        {center.address}
                      </p>
                      <p className="mt-1.5">
                        <Badge tone={openStatus.isOpen ? 'success' : 'neutral'}>
                          {openStatus.label}
                        </Badge>
                      </p>
                      {userCoords && (
                        <p className="mt-1 text-xs text-ink-600">
                          {formatDistance(
                            distanceKm(userCoords, center.coordinates),
                          )}{' '}
                          от вас
                        </p>
                      )}
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Link
                          to={`/centers/${center.id}`}
                          className="text-sm font-medium text-primary-700 underline-offset-2 hover:underline"
                        >
                          Подробнее
                        </Link>
                        <a
                          href={buildRouteUrl(center)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-medium text-primary-700 underline-offset-2 hover:underline"
                        >
                          Маршрут
                        </a>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      )}
    </div>
  );
}
