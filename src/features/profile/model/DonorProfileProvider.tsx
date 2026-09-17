import { useCallback, useMemo, useState, type ReactNode } from 'react';
import type { Donor } from '../../../types';
import {
  DONOR_PROFILE_STORAGE_KEY,
  DonorProfileContext,
  loadDonorFromStorage,
} from './profileContext';

/**
 * Профиль донора (FR-1). Гость = null; профиль сохраняется в localStorage.
 */
export function DonorProfileProvider({ children }: { children: ReactNode }) {
  const [donor, setDonor] = useState<Donor | null>(loadDonorFromStorage);

  const saveDonor = useCallback((next: Donor) => {
    localStorage.setItem(DONOR_PROFILE_STORAGE_KEY, JSON.stringify(next));
    setDonor(next);
  }, []);

  const clearDonor = useCallback(() => {
    localStorage.removeItem(DONOR_PROFILE_STORAGE_KEY);
    setDonor(null);
  }, []);

  const value = useMemo(() => ({ donor, saveDonor, clearDonor }), [donor, saveDonor, clearDonor]);

  return <DonorProfileContext.Provider value={value}>{children}</DonorProfileContext.Provider>;
}
