import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDonorProfile } from '../../features/profile/model/DonorProfileContext';

/**
 * Защита действий, требующих входа (FR-1.4): гость перенаправляется
 * на профиль, исходный маршрут сохраняется для возврата после входа.
 */
export function RequireDonor({ children }: { children: ReactNode }) {
  const { donor } = useDonorProfile();
  const location = useLocation();

  if (!donor) {
    return (
      <Navigate to="/profile" replace state={{ from: location.pathname }} />
    );
  }

  return <>{children}</>;
}
