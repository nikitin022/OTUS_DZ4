import { createContext, useContext } from 'react';
import type { Donor } from '../../../types';

export const DONOR_PROFILE_STORAGE_KEY = 'kaplya.donorProfile';

export interface DonorProfileContextValue {
  /** null — гость (FR-1.4) */
  donor: Donor | null;
  saveDonor: (donor: Donor) => void;
  clearDonor: () => void;
}

export const DonorProfileContext = createContext<DonorProfileContextValue | undefined>(undefined);

/** Чтение профиля из localStorage; повреждённые данные трактуются как гость */
export function loadDonorFromStorage(): Donor | null {
  try {
    const raw = localStorage.getItem(DONOR_PROFILE_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Donor) : null;
  } catch {
    return null;
  }
}

/** Доступ к профилю донора (FR-1). Гость = null (FR-1.4) */
export function useDonorProfile(): DonorProfileContextValue {
  const ctx = useContext(DonorProfileContext);
  if (!ctx) {
    throw new Error('useDonorProfile должен использоваться внутри DonorProfileProvider');
  }
  return ctx;
}
